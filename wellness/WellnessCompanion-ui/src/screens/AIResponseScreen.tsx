import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { NavigationParams } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { apiService } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<NavigationParams, 'AIResponse'>;
  route: RouteProp<NavigationParams, 'AIResponse'>;
};

export const AIResponseScreen: React.FC<Props> = ({ navigation, route }) => {
  const { journalEntry } = route.params;
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Get AI response from the API service
  useEffect(() => {
    const getAIResponse = async () => {
      try {
        setLoading(true);
        
        // First check if we can get models to verify the API is accessible
        await apiService.getModels();
        
        // Then get the response
        const aiResponse = await apiService.getResponse(journalEntry);
        setResponse(aiResponse);
        setError(null);
      } catch (err) {
        console.error('Failed to get AI response:', err);
        setError('Failed to connect to the AI service. Using fallback response.');
        
        // Fallback responses if the API call fails
        const advisorResponses = {
          therapist: "From a therapeutic perspective, it's important to acknowledge that your feelings are valid. Your emotional response is a natural reaction to this situation. Let's explore some coping strategies that might help you process these emotions in a healthy way...",
          friend: "Hey, I hear you and I totally get what you're going through. It's completely normal to feel this way, and I want you to know that I'm here for you. Have you considered looking at it this way...",
          parent: "I care about you deeply and it hurts to see you going through this. Remember that challenges help us grow stronger, and I believe in your ability to handle this situation. Here's what I've learned from my experience...",
          mentor: "Looking at this situation objectively, I can see several learning opportunities here. Your emotional awareness is commendable, and we can use this experience to develop stronger emotional intelligence...",
        };

        setResponse(advisorResponses[journalEntry.advisorPerspective as keyof typeof advisorResponses] || advisorResponses.friend);
      } finally {
        setLoading(false);
      }
    };

    getAIResponse();
  }, [journalEntry]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emotion}>{journalEntry.emotion.icon}</Text>
        <Text style={styles.title}>Your Personalized Response</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
          <Text style={styles.loadingText}>Connecting to AI service...</Text>
        </View>
      ) : (
        <>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <View style={styles.responseCard}>
            <View style={styles.advisorHeader}>
              <Text style={styles.advisorLabel}>
                Advice from a {journalEntry.advisorPerspective}:
              </Text>
            </View>
            <Text style={styles.responseText}>{response}</Text>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>AI Summary</Text>
            <Text style={styles.summaryText}>{journalEntry.aiSummary}</Text>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Gratitude', { journalEntry })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emotion: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  responseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  advisorHeader: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  advisorLabel: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontSize: 20,
  },
  responseText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  summarySection: {
    marginBottom: theme.spacing.xl,
  },
  summaryTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryText: {
    ...theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 12,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: theme.spacing.md,
    borderRadius: 8,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: '#c62828',
    ...theme.typography.body,
  },
}); 