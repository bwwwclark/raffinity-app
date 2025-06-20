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
          source={require('../assets/RAFinitySplash1.png')}
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
      
      <Text style={styles.descriptionText}>
        Instantly search ICD-10 codes and RAF values. Designed for clinicians in value-based care. Save time, improve accuracy, and boost reimbursement.
      </Text>
      
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
    paddingHorizontal: 20,
  },
  logo: {
    width: Math.min(width * 0.6, 200), // 60% of screen width, max 200px
    height: Math.min(width * 0.6, 200), // Keep it square
    marginBottom: 30,
  },
  logoContainer: {
    width: Math.min(width * 0.6, 200),
    height: Math.min(width * 0.6, 200),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
    maxWidth: width * 0.85,
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
