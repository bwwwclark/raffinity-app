import { Stack } from 'expo-router';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';

export default function Layout() {
  return (
    <SubscriptionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="paywall" options={{ 
          headerShown: true, 
          title: 'Subscription',
          headerBackTitle: 'Back'
        }} />
        <Stack.Screen name="about" options={{ 
          headerShown: true, 
          title: 'About RAFinity',
          headerBackTitle: 'Back'
        }} />
        <Stack.Screen name="detail" options={{ 
          headerShown: true, 
          title: 'Code Details',
          headerBackTitle: 'Back'
        }} />
      </Stack>
    </SubscriptionProvider>
  );
}
