import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

// Preload assets
const prepareAssets = async (setLogoLoaded) => {
  try {
    await Font.loadAsync({
      // Load fonts here if needed
    });

    await Asset.loadAsync([
      require('../assets/rafinity-logo.png'),
    ]);

    setLogoLoaded(true);
  } catch (e) {
    console.warn('Asset loading failed', e);
    setLogoLoaded(false);
  }
};

export default function Index() {
  const [logoLoaded, setLogoLoaded] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await prepareAssets(setLogoLoaded);

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
      {logoLoaded && (
        <Image
          source={require('../assets/rafinity-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
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
