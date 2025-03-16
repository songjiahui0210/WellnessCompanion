import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-get-random-values';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmotionSelectionScreen } from './src/screens/EmotionSelectionScreen';
import { RecordingMethodScreen } from './src/screens/RecordingMethodScreen';
import { AnalysisScreen } from './src/screens/AnalysisScreen';
import { AIResponseScreen } from './src/screens/AIResponseScreen';
import { GratitudeScreen } from './src/screens/GratitudeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { NavigationParams } from './src/types';
import { View, Text, StyleSheet } from 'react-native';

// Properly type the Stack navigator
const Stack = createNativeStackNavigator<NavigationParams>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate initialization
  useEffect(() => {
    console.log("App is initializing...");
    setTimeout(() => {
      setIsLoading(false);
      console.log("App initialization complete");
    }, 1000);
  }, []);

  // Show loading screen
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer fallback={<Text>Loading...</Text>}>
      <Stack.Navigator initialRouteName="EmotionSelection">
        <Stack.Screen 
          name="EmotionSelection" 
          component={EmotionSelectionScreen}
          options={{ title: 'How are you feeling?' }}
        />
        <Stack.Screen 
          name="RecordingMethod" 
          component={RecordingMethodScreen}
          options={{ title: 'Express Your Feelings' }}
        />
        <Stack.Screen 
          name="Analysis" 
          component={AnalysisScreen}
          options={{ title: 'AI Analysis' }}
        />
        <Stack.Screen 
          name="AIResponse" 
          component={AIResponseScreen}
          options={{ title: 'AI Response' }}
        />
        <Stack.Screen 
          name="Gratitude" 
          component={GratitudeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'Your Journey' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#000',
  },
});