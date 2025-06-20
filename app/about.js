import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL('mailto:rafinity.dx@gmail.com');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://rafinity.net/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 15 }}>
          {!imageError ? (
            <Image
              source={require('../assets/RAFinitySplash.png')}
              style={{
                width: Math.min(width * 0.5, 150),
                height: Math.min(width * 0.5, 150),
                resizeMode: 'contain',
                marginBottom: 10,
              }}
              onError={(error) => {
                console.log('About image failed to load:', error);
                setImageError(true);
              }}
            />
          ) : (
            <View style={{
              width: Math.min(width * 0.5, 150),
              height: Math.min(width * 0.5, 150),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: 20,
              marginBottom: 10,
              borderWidth: 2,
              borderColor: '#007AFF',
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#007AFF',
                textAlign: 'center',
              }}>
                RAFinity
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <Text style={{
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 20,
        }}>
          Instantly search ICD-10 codes and RAF values. Designed for clinicians in value-based care. Save time, improve accuracy, and boost reimbursement.
        </Text>

        {/* Contact Information */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginBottom: 15 }}>
            <Text style={{
              fontSize: 16,
              color: '#333',
              textAlign: 'center',
            }}>
              Visit{' '}
              <TouchableOpacity onPress={handleWebsitePress} style={{ alignSelf: 'center' }}>
                <Text style={{
                  fontSize: 16,
                  color: '#007AFF',
                  textDecorationLine: 'underline',
                }}>
                  https://rafinity.net/
                </Text>
              </TouchableOpacity>
              {' '}for more information
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{
              fontSize: 16,
              color: '#333',
              textAlign: 'center',
            }}>
              Contact{' '}
              <TouchableOpacity onPress={handleEmailPress} style={{ alignSelf: 'center' }}>
                <Text style={{
                  fontSize: 16,
                  color: '#007AFF',
                  textDecorationLine: 'underline',
                }}>
                  rafinity.dx@gmail.com
                </Text>
              </TouchableOpacity>
              {' '}with any questions or comments
            </Text>
          </View>

          <Text style={{
            fontSize: 16,
            color: '#333',
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            Please leave a review in the app store!
          </Text>
        </View>

        {/* How to Use Section */}
        <View style={{
          backgroundColor: '#f8f9fa',
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 15,
            textAlign: 'center',
          }}>
            🚀 How to Use RAFinity
          </Text>

          <View style={{ marginBottom: 15 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 5,
            }}>
              1. Search ICD-10 Codes
            </Text>
            <Text style={{
              fontSize: 15,
              color: '#666',
              lineHeight: 22,
            }}>
              Type a diagnosis code or keyword (e.g., "diabetes" or "E11.9") into the search bar.
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 5,
            }}>
              2. Browse Matching Results
            </Text>
            <Text style={{
              fontSize: 15,
              color: '#666',
              lineHeight: 22,
            }}>
              Scroll through the list of matching ICD-10 codes and descriptions.
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 5,
            }}>
              3. Tap to View Details
            </Text>
            <Text style={{
              fontSize: 15,
              color: '#666',
              lineHeight: 22,
            }}>
              Tap any row to see detailed information, including RAF scores and CMS-HCC model categories.
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 5,
            }}>
              4. Look for V28 Highlights
            </Text>
            <Text style={{
              fontSize: 15,
              color: '#666',
              lineHeight: 22,
            }}>
              Codes that are part of the new CMS-HCC V28 model are clearly labeled.
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            paddingHorizontal: 40,
            paddingVertical: 15,
            borderRadius: 25,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 40,
          }}
          onPress={() => router.back()}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
          }}>
            Back to Search
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
