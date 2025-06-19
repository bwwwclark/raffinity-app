import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Simple initialization
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    try {
      router.replace('/home');
    } catch (navError) {
      console.error('Navigation error:', navError);
    }
  };

  return (
    <View style={styles.container}>
      {!imageError ? (
        <Image
          source={require('../assets/RAFinity_GooglePlay_512x512.png')}
          style={styles.logo}
          resizeMode="contain"
          onError={(error) => {
            console.log('Image failed to load:', error);
            setImageError(true);
          }}
        />
      ) : (
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>RAFFINITY</Text>
        </View>
      )}
      
      {isReady ? (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to the App</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
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
    width: Math.min(width * 0.6, 200), // 60% of screen width, max 200px
    height: Math.min(width * 0.6, 200), // Keep it square
    marginBottom: 60,
  },
  logoContainer: {
    width: Math.min(width * 0.6, 200),
    height: Math.min(width * 0.6, 200),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginBottom: 60,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    marginTop: 20,
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
