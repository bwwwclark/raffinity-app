import React, { createContext, useContext, useState, useEffect } from 'react';
import Purchases from 'react-native-purchases';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    checkSubscriptionStatus();
    
    // Listen for purchase updates
    Purchases.addCustomerInfoUpdateListener((info) => {
      setCustomerInfo(info);
      setIsPremium(info.entitlements.active.Pro !== undefined);
    });

    return () => {
      // Cleanup listener if needed
    };
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      setIsPremium(info.entitlements.active.Pro !== undefined);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    setIsLoading(true);
    await checkSubscriptionStatus();
  };

  const value = {
    isPremium,
    isLoading,
    customerInfo,
    refreshSubscriptionStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};