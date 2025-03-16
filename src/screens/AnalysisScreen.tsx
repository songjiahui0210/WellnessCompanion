import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { ScreenProps } from '../types';
import { openai } from '../services/openai';

export const AnalysisScreen: React.FC<ScreenProps<'Analysis'>> = ({ 
  navigation, 
  route 
}) => {
  const { emotion, content, intensity, isVoiceNote } = route.params;
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  const generateSummary = async () => {
    setLoading(true);
    try {
      const prompt = `The user is feeling "${emotion.name}" with an intensity level of ${intensity} (1 is mild, 10 is very strong).
        Their thoughts: "${content}"
        Please summarize their feelings in a supportive, authentic, and concise manner.
        Offer empathy and encouragement without being overly wordy.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a supportive emotional companion app that offers empathy and understanding." },
          { role: "user", content: prompt }
        ],
      });
      
      const summary = response.choices[0]?.message?.content || 
        "I couldn't generate a summary.";
      
      setAiSummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setAiSummary('Sorry, I had trouble analyzing your emotions. Please try again.');
    }
    setLoading(false);
  };

  React.useEffect(() => {
    generateSummary();
  }, []);

  const handleNextStep = (responseType: 'summary' | 'advice' | 'expression') => {
    const journalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      emotion,
      content,
      intensity,
      isVoiceNote,
      aiSummary,
      isLogged: true
    };

    navigation.navigate('AIResponse', { 
      journalEntry,
      responseType
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Analyzing your feelings...</Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>AI Summary</Text>
            <Text style={styles.summaryText}>{aiSummary}</Text>
          </View>

          <Text style={styles.sectionTitle}>What would you like to do next?</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => handleNextStep('summary')}
            >
              <Text style={styles.optionText}>📝 Log this emotion</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => handleNextStep('advice')}
            >
              <Text style={styles.optionText}>💡 Get advice</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => handleNextStep('expression')}
            >
              <Text style={styles.optionText}>💬 Express to someone</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    marginTop: theme.spacing.md,
    color: theme.colors.text,
  },
  summaryCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 12,
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
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  optionsContainer: {
    gap: theme.spacing.md,
  },
  optionButton: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
}); 