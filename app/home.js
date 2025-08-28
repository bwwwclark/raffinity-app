import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import Fuse from 'fuse.js';
import { useSubscription } from '../contexts/SubscriptionContext';

const { width } = Dimensions.get('window');
const DATA_URL = 'https://raw.githubusercontent.com/bwwwclark/Rafinity-data/main/icdData_full.json';

// Memoized list item component to prevent unnecessary re-renders
const ListItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View
      style={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {item['Diagnosis Code (ICD-10)']}
        </Text>
        {item['Has V28 HCC code'] === 'Yes' && (
          <View
            style={{
              backgroundColor: '#007BFF',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>CMS-HCC V28</Text>
          </View>
        )}
      </View>
      <Text style={{ color: '#555', marginTop: 2 }}>{item['Description']}</Text>
    </View>
  </TouchableOpacity>
));

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const debounceTimer = useRef(null);
  const searchCache = useRef(new Map());
  const codeIndex = useRef(new Map()); // Fast lookup for exact code matches
  const router = useRouter();
  const { isPremium, isLoading: subscriptionLoading } = useSubscription();

  const FREE_SEARCH_LIMIT = 10;
  const MAX_SEARCH_RESULTS = 50; // Limit results for better performance

  useEffect(() => {
    fetch(DATA_URL)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        
        // Build code index for fast exact matches
        const index = new Map();
        json.forEach((item, idx) => {
          const code = item['Diagnosis Code (ICD-10)'];
          if (code) {
            index.set(code.toLowerCase(), idx);
          }
        });
        codeIndex.current = index;
        
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch ICD data:', err);
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(() => {
    if (data.length === 0) return null;
    return new Fuse(data, {
      keys: [
        { name: 'Diagnosis Code (ICD-10)', weight: 0.7 },
        { name: 'Description', weight: 0.3 }
      ],
      threshold: 0.3, // More strict matching for better performance
      ignoreLocation: true,
      findAllMatches: false,
      minMatchCharLength: 2,
      distance: 100, // Limit search distance
      maxPatternLength: 32, // Limit pattern length
      includeScore: true, // Include score for sorting
    });
  }, [data]);

  // Debounce search input and track search count
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      
      // Increment search count for non-empty searches
      if (search.trim() && !isPremium) {
        setSearchCount(prev => prev + 1);
      }
    }, 150); // Reduced from 300ms to 150ms for faster response
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [search, isPremium]);

  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return data;
    if (!fuse) return data;
    
    // Check search limit for free users
    if (!isPremium && searchCount >= FREE_SEARCH_LIMIT) {
      return [];
    }
    
    // Performance monitoring
    const startTime = performance.now();
    
    // Check cache first
    const cacheKey = `${debouncedSearch.toLowerCase()}_${isPremium}`;
    if (searchCache.current.has(cacheKey)) {
      console.log(`🚀 Cache hit for "${debouncedSearch}" in ${(performance.now() - startTime).toFixed(1)}ms`);
      return searchCache.current.get(cacheKey);
    }
    
    // Fast path for exact code matches (e.g., "A00.0")
    const searchLower = debouncedSearch.toLowerCase().trim();
    const exactIndex = codeIndex.current.get(searchLower);
    if (exactIndex !== undefined && data[exactIndex]) {
      console.log(`⚡ Exact match for "${debouncedSearch}" in ${(performance.now() - startTime).toFixed(1)}ms`);
      const result = [data[exactIndex]];
      searchCache.current.set(cacheKey, result);
      return result;
    }
    
    // Perform search with result limiting
    const results = fuse.search(debouncedSearch, { limit: MAX_SEARCH_RESULTS });
    
    // Sort by relevance score (lower is better in Fuse.js)
    const sortedResults = results
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .map(result => result.item);
    
    // Cache the results (keep cache size reasonable)
    if (searchCache.current.size > 100) {
      const firstKey = searchCache.current.keys().next().value;
      searchCache.current.delete(firstKey);
    }
    searchCache.current.set(cacheKey, sortedResults);
    
    const endTime = performance.now();
    console.log(`🔍 Search for "${debouncedSearch}" completed in ${(endTime - startTime).toFixed(1)}ms (${sortedResults.length} results)`);
    
    return sortedResults;
  }, [debouncedSearch, fuse, data, isPremium, searchCount, MAX_SEARCH_RESULTS]);

  const handleItemPress = useCallback((item) => {
    router.push({ pathname: '/detail', params: item });
  }, [router]);

  const handleUpgradePress = () => {
    router.push('/paywall');
  };


  const showUpgradePrompt = () => {
    Alert.alert(
      'Search Limit Reached',
      `You've reached the free limit of ${FREE_SEARCH_LIMIT} searches. Upgrade to Pro for unlimited searches and advanced features.`,
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Upgrade Now', onPress: handleUpgradePress }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        {/* Header with minimal spacing */}
        <View style={{
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 2,
          paddingBottom: 2,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 2,
          }}>
            <View style={{ width: 60 }} />
            {!imageError ? (
              <Image
                source={require('../assets/RAFinitySplash.png')}
                style={{
                  width: Math.min(width * 0.6, 240),
                  height: 60,
                  resizeMode: 'contain',
                }}
                onError={(error) => {
                  console.log('Banner image failed to load:', error);
                  setImageError(true);
                }}
              />
            ) : (
              <View style={{
                width: Math.min(width * 0.6, 240),
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: 10,
                borderWidth: 2,
                borderColor: '#007AFF',
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#007AFF',
                  textAlign: 'center',
                }}>
                  RAFinity
                </Text>
              </View>
            )}
            <View style={{ alignItems: 'flex-end' }}>
              {isPremium ? (
                <View style={{
                  backgroundColor: '#28a745',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  marginBottom: 4,
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                    PRO
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleUpgradePress}
                  style={{
                    backgroundColor: '#007AFF',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                    UPGRADE
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => router.push('/about')}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text style={{
                  color: '#007AFF',
                  fontSize: 16,
                  textDecorationLine: 'underline',
                }}>
                  About
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#333',
          }}>
            ICD-10 / RAF Lookup
          </Text>
        </View>

        {/* Search bar with tight spacing */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
          <TextInput
            placeholder={
              !isPremium && searchCount >= FREE_SEARCH_LIMIT 
                ? "Upgrade to Pro for unlimited searches" 
                : "Search by code or description..."
            }
            value={search}
            onChangeText={setSearch}
            editable={isPremium || searchCount < FREE_SEARCH_LIMIT}
            style={{
              borderWidth: 1,
              borderColor: !isPremium && searchCount >= FREE_SEARCH_LIMIT ? '#dc3545' : '#ccc',
              padding: 10,
              borderRadius: 8,
              fontSize: 16,
              backgroundColor: !isPremium && searchCount >= FREE_SEARCH_LIMIT ? '#f8d7da' : '#fafafa',
              opacity: !isPremium && searchCount >= FREE_SEARCH_LIMIT ? 0.7 : 1,
            }}
          />
          {!isPremium && (
            <View style={{ marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ 
                fontSize: 12, 
                color: searchCount >= FREE_SEARCH_LIMIT ? '#dc3545' : '#666' 
              }}>
                Searches: {searchCount}/{FREE_SEARCH_LIMIT} (Free)
              </Text>
              {searchCount >= FREE_SEARCH_LIMIT && (
                <TouchableOpacity onPress={handleUpgradePress}>
                  <Text style={{ fontSize: 12, color: '#007AFF', textDecorationLine: 'underline' }}>
                    Upgrade Now
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Content list maximized */}
        {!isPremium && searchCount >= FREE_SEARCH_LIMIT && search.trim() ? (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            paddingHorizontal: 20 
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: '#333', 
              textAlign: 'center', 
              marginBottom: 10 
            }}>
              Search Limit Reached
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: '#666', 
              textAlign: 'center', 
              marginBottom: 20,
              lineHeight: 22 
            }}>
              You've used all {FREE_SEARCH_LIMIT} free searches. Upgrade to Pro for unlimited searches and advanced features.
            </Text>
            <TouchableOpacity 
              style={{
                backgroundColor: '#007AFF',
                paddingHorizontal: 30,
                paddingVertical: 15,
                borderRadius: 25,
              }}
              onPress={handleUpgradePress}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
                Upgrade to Pro
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => `${item['Diagnosis Code (ICD-10)']}_${index}`}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <ListItem item={item} onPress={handleItemPress} />
            )}
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={30}
            initialNumToRender={15}
            windowSize={8}
            getItemLayout={(data, index) => ({
              length: 70, // Approximate item height
              offset: 70 * index,
              index,
            })}
            disableVirtualization={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
