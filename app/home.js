import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import Fuse from 'fuse.js';

const { width } = Dimensions.get('window');
const DATA_URL = 'https://raw.githubusercontent.com/bwwwclark/Rafinity-data/main/icdData_full.json';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(DATA_URL)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch ICD data:', err);
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys: ['Diagnosis Code (ICD-10)', 'Description'],
      threshold: 0.4,
    });
  }, [data]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    const results = fuse.search(search);
    return results.map(result => result.item);
  }, [search, fuse, data]);

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
            placeholder="Search by code or description..."
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              borderRadius: 8,
              fontSize: 16,
              backgroundColor: '#fafafa',
            }}
          />
        </View>

        {/* Content list maximized */}
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => `${item['Diagnosis Code (ICD-10)']}_${index}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/detail', params: item })}
            >
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
          )}
        />
      </View>
    </SafeAreaView>
  );
}
