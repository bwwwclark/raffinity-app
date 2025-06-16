
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

const DATA_URL = 'https://raw.githubusercontent.com/bwwwclark/Rafinity-data/main/icdData_full.json';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const code = item['Diagnosis Code (ICD-10)'] || '';
      const desc = item['Description'] || '';
      return (
        code.toLowerCase().includes(search.toLowerCase()) ||
        desc.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search, data]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
<View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  }}
>
  <Image
    source={require('../assets/rafinity-logo.png')}
    style={{
      width: 40,
      height: 40,
      resizeMode: 'contain',
    }}
  />
  <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
    RAFinity: ICD-10 / RAF Lookup
  </Text>
</View>


      <TextInput
        placeholder="Search by code or description..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          borderRadius: 6,
          marginBottom: 12,
        }}
      />

      <FlatList
        data={filteredData}
       keyExtractor={(item, index) => `${item['Diagnosis Code (ICD-10)']}_${index}`}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/detail', params: item })}
          >
            <View
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                      marginLeft: 6,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 12 }}>V28</Text>
                  </View>
                )}
              </View>
              <Text style={{ color: '#555' }}>{item['Description']}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}