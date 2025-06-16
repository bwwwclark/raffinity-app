
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

export default function DetailScreen() {
  const params = useLocalSearchParams();
  const rafScore = params['V28 CMS-HCC Model RAF Score'] || 'None';

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Code Details
      </Text>

      {/* Highlighted RAF Score */}
      <View
        style={{
          backgroundColor: '#f0f8ff',
          padding: 12,
          borderRadius: 8,
          marginBottom: 24,
          borderLeftWidth: 4,
          borderLeftColor: '#007BFF',
        }}
      >
        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
          RAF Score
        </Text>
        <Text style={{ fontSize: 18, color: '#007BFF' }}>
          {rafScore}
        </Text>
      </View>

      {/* Other details */}
      {Object.entries(params).map(([key, value]) => {
        if (key === 'V28 CMS-HCC Model RAF Score') return null;
        return (
          <View key={key} style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#222' }}>
              {key}
            </Text>
            <Text style={{ fontSize: 16, color: '#666', marginTop: 2 }}>
              {value || 'None'}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}