import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Purchases from 'react-native-purchases';

export default function PaywallScreen() {
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      setOfferings(offerings);
      console.log('offerings')
    } catch (error) {
      console.error('Error fetching offerings:', error);
      Alert.alert('Error', 'Unable to load subscription plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const purchasePackage = async (packageToPurchase) => {
    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      if (customerInfo.entitlements.active.Pro) {
        Alert.alert(
          'Success!', 
          'Welcome to RAFinity Pro!',
          [{ text: 'Continue', onPress: () => router.replace('/home') }]
        );
      }
    } catch (error) {
      console.error('Purchase error:', error);
      if (!error.userCancelled) {
        Alert.alert('Purchase Failed', 'Unable to complete purchase. Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const restorePurchases = async () => {
    setPurchasing(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      
      if (customerInfo.entitlements.active.Pro) {
        Alert.alert(
          'Restored!', 
          'Your Pro subscription has been restored.',
          [{ text: 'Continue', onPress: () => router.replace('/home') }]
        );
      } else {
        Alert.alert('No Purchases', 'No active subscriptions found to restore.');
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Restore Failed', 'Unable to restore purchases. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading subscription plans...</Text>
      </View>
    );
  }

  // Get the current offering or find "The standard set of packages"
  const currentOffering = offerings?.current || 
    offerings?.all?.['The standard set of packages'] ||
    Object.values(offerings?.all || {})[0];
  
  if (!currentOffering) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No subscription plans available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOfferings}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>RAFinity Pro</Text>
        <Text style={styles.subtitle}>
          Unlock unlimited searches and advanced features for clinical excellence
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Pro Features:</Text>
        <View style={styles.feature}>
          <Text style={styles.featureText}>✓ Unlimited ICD-10 code searches</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureText}>✓ Advanced RAF score calculations</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureText}>✓ Export functionality</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureText}>✓ Pro support</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureText}>✓ No advertisements</Text>
        </View>
      </View>

      <View style={styles.packagesContainer}>
        {currentOffering.availablePackages.map((pkg, index) => (
          <>
          <Text style={styles.packagePrice}>
              {pkg.identifier.includes('annual') ? "Annual" : "Monthly"}
            </Text>
          <TouchableOpacity
            key={index}
            style={[
              styles.packageButton,
              index === 0 && styles.recommendedPackage
            ]}
            onPress={() =>{
              console.log('asdsd', pkg)
              purchasePackage(pkg)
            }
            

            }
            disabled={purchasing}
          >
            {index === 0 && (
              <Text style={styles.recommendedLabel}>MOST POPULAR</Text>
            )}
            <Text style={styles.packageTitle}>
            {pkg.identifier.includes('annual') ? "Annual" : "Monthly"}
            </Text>
            <Text style={styles.packagePrice}>
              {pkg.product.priceString}
            </Text>
            
          </TouchableOpacity>
          </>
        ))}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={restorePurchases}
          disabled={purchasing}
        >
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.back()}
          disabled={purchasing}
        >
          <Text style={styles.continueButtonText}>Continue with Free Version</Text>
        </TouchableOpacity>
      </View>

      {purchasing && (
        <View style={styles.purchasingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.purchasingText}>Processing...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  feature: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  packagesContainer: {
    marginBottom: 30,
  },
  packageButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  recommendedPackage: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  recommendedLabel: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    alignItems: 'center',
  },
  restoreButton: {
    marginBottom: 15,
  },
  restoreButtonText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  continueButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  purchasingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchasingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});