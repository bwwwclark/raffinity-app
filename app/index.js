import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

// Preload assets
const prepareAssets = async () => {
  try {
    await Font.loadAsync({
      // Example font preload (if you use custom fonts)
      // 'SpaceMono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    });

    await Asset.loadAsync([
      require('../assets/rafinity-logo.png'),
    ]);
  } catch (e) {
    console.warn('Asset loading failed', e);
  }
};

export default function Index() {
  useEffect(() => {
    const init = async () => {
      try {
        // Keep splash screen visible while loading assets
        await SplashScreen.preventAutoHideAsync();
        await prepareAssets();

        // Simulate slight delay (e.g., for animation or data fetch)
        setTimeout(() => {
          try {
            router.replace('/home');
          } catch (e) {
            console.error('Navigation error:', e);
          }
        }, 500);
      } catch (e) {
        console.error('App init error:', e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/rafinity-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#007AFF" />
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
    marginBottom: 20,
  },
});
