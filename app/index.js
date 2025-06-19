import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

// Preload assets with better error handling
const prepareAssets = async () => {
  try {
    // Load fonts if needed
    await Font.loadAsync({
      // Add your fonts here
    });

    // Load assets with more robust error handling
    let logoAvailable = false;
    try {
      await Asset.loadAsync([
        require('../assets/rafinity-logo.png'),
      ]);
      logoAvailable = true;
      console.log('Logo loaded successfully');
    } catch (assetError) {
      console.warn('Logo asset not found or failed to load:', assetError);
      logoAvailable = false;
    }
    
    return { success: true, logoAvailable };
  } catch (e) {
    console.error('Critical asset loading failed:', e);
    return { success: false, logoAvailable: false };
  }
};

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [logoAvailable, setLogoAvailable] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Prevent splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();
        
        // Load assets
        const result = await prepareAssets();
        setLogoAvailable(result.logoAvailable);
        
        // Mark as ready to show button
        setIsReady(true);
        
      } catch (e) {
        console.error('App init error:', e);
        // Even if there's an error, mark as ready so app doesn't get stuck
        setIsReady(true);
      } finally {
        try {
          await SplashScreen.hideAsync();
        } catch (splashError) {
          console.warn('Splash screen hide error:', splashError);
        }
      }
    };

    init();
  }, []);

  const handleContinue = () => {
    try {
      console.log('Navigating to home...');
      router.replace('/home');
    } catch (navError) {
      console.error('Navigation error:', navError);
      // Fallback navigation attempt
      setTimeout(() => {
        try {
          router.push('/home');
        } catch (fallbackError) {
          console.error('Fallback navigation also failed:', fallbackError);
        }
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      {logoAvailable ? (
        <Image
          source={require('../assets/rafinity-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          onError={(e) => {
            console.error('Image loading error:', e);
            setLogoAvailable(false);
          }}
        />
      ) : (
        <View style={styles.placeholderLogo}>
          <Text style={styles.placeholderText}>RAFFINITY</Text>
        </View>
      )}
      
      {!isReady ? (
        <>
          <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
          <Text style={styles.loadingText}>Loading your experience...</Text>
        </>
      ) : (
        <>
          <Text style={styles.descriptionText}>
            Instantly search ICD-10 codes and RAF values. Designed for clinicians in value-based care.
            Save time, improve accuracy, and boost reimbursement.
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue to the App</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
  placeholderLogo: {
    width: 160,
    height: 160,
    marginBottom: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
    marginTop: 20,
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
