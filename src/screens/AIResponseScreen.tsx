import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../theme';
import { ScreenProps } from '../types';
import { openai } from '../services/openai';

export const AIResponseScreen: React.FC<ScreenProps<'AIResponse'>> = ({ 
  navigation, 
  route 
}) => {
  const { journalEntry, responseType } = route.params;
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');

  const generateResponse = async () => {
    setLoading(true);
    try {
      let prompt = '';
      
      switch (responseType) {
        case 'advice':
          prompt = `The user is feeling "${journalEntry.emotion.name}" with intensity ${journalEntry.intensity}/10.
            Their thoughts: "${journalEntry.content}"
            Please provide practical, empathetic advice for dealing with these feelings.`;
          break;
        
        case 'expression':
          prompt = `The user is feeling "${journalEntry.emotion.name}" with intensity ${journalEntry.intensity}/10.
            Their thoughts: "${journalEntry.content}"
            Please help them express these feelings in a clear, thoughtful message that they could share with others.`;
          break;
        
        default:
          prompt = `Thank you for sharing your feelings. Your emotion "${journalEntry.emotion.name}" has been logged.`;
          setResponse(prompt);
          setLoading(false);
          return;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a supportive emotional companion app that offers empathy and understanding." },
          { role: "user", content: prompt }
        ],
      });

      setResponse(response.choices[0]?.message?.content || 
        "I couldn't generate a response.");
    } catch (error) {
      console.error('Error generating response:', error);
      setResponse('Sorry, I had trouble generating a response. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    generateResponse();
  }, []);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(response);
    alert('Copied to clipboard!');
  };

  const handleContinue = () => {
    navigation.navigate('Gratitude', { journalEntry });
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Generating response...</Text>
        </View>
      ) : (
        <>
          <View style={styles.responseCard}>
            <Text style={styles.responseTitle}>
              {responseType === 'advice' ? '💡 Advice' : 
               responseType === 'expression' ? '💬 Expression' : 
               '📝 Logged'}
            </Text>
            <Text style={styles.responseText}>{response}</Text>
          </View>

          <TouchableOpacity 
            style={styles.copyButton}
            onPress={copyToClipboard}
          >
            <Text style={styles.buttonText}>📋 Copy to Clipboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    ...theme.typography.body,
    marginTop: theme.spacing.md,
  },
  responseCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.xl,
  },
  responseTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  responseText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  copyButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.card,
  },
}); 