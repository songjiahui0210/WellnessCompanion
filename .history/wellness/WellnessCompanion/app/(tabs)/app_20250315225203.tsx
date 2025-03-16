// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmotionInputScreen from './screens/EmotionInputScreen'; 
import AnalysisResultScreen from './screens/AnalysisResultScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EmotionInput">
        <Stack.Screen
          name="EmotionInput"
          component={EmotionInputScreen}
          options={{ title: 'Emotion Input' }}
        />
        <Stack.Screen
          name="AnalysisResult"
          component={AnalysisResultScreen}
          options={{ title: 'Analysis & Result' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

