import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { KochavaMeasurement } from 'react-native-kochava-measurement';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

KochavaMeasurement.instance.registerIosAppGuid('korafinity-qefta');
KochavaMeasurement.instance.start();

const RC_IOS_KEY = "appl_aaaIaGlejOqYoTcKNRDkOhSueDQ"; // replace with real
const RC_ANDROID_KEY = "your_android_api_key";

const { width } = Dimensions.get('window');

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

        if (Platform.OS === 'ios') {
          await Purchases.configure({ apiKey: RC_IOS_KEY });
        } else if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: RC_ANDROID_KEY });
        }

        const info = await Purchases.getCustomerInfo();
        console.log("Customer info:", info);
      } catch (e) {
        console.warn("RevenueCat init error", e);
      } finally {
        setLoading(false);
      }
    };

    init();

    const timer = setTimeout(() => setIsReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    try {
      router.replace('/home');
    } catch (navError) {
      console.error('Navigation error:', navError);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading RevenueCat…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!imageError ? (
        <Image
          source={require('../assets/RAFinitySplash1.png')}
          style={styles.logo}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>RAFFINITY</Text>
        </View>
      )}
      
      <Text style={styles.descriptionText}>
        Instantly search ICD-10 codes and RAF values. Designed for clinicians in value-based care.
      </Text>
      
      {isReady ? (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to the App</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.loadingText}>Loading…</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20 },
  logo: { width: Math.min(width * 0.6, 200), height: Math.min(width * 0.6, 200), marginBottom: 30 },
  logoContainer: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#007AFF', borderRadius: 20, marginBottom: 30 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', textAlign: 'center' },
  descriptionText: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 40, maxWidth: width * 0.85 },
  loadingText: { fontSize: 16, color: '#666', textAlign: 'center' },
  continueButton: { backgroundColor: '#007AFF', paddingHorizontal: 40, paddingVertical: 18, borderRadius: 30, marginTop: 20 },
  continueButtonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
});
