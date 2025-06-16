
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.replace('/home'); // navigate to main screen
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/rafinity-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to RAFinity</Text>
      <Text style={styles.description}>
        Quickly search ICD-10 codes and identify risk adjustment factor (RAF) scores for efficient medical documentation and HCC review.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 320,  // Increased from 160
    height: 120, // Increased from 60
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});