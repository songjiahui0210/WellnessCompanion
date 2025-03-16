import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { ScreenProps } from '../types';

export const GratitudeScreen: React.FC<ScreenProps<'Gratitude'>> = ({ 
  navigation, 
  route 
}) => {
  const { journalEntry } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌟</Text>
      
      <Text style={styles.title}>Thank You for Sharing</Text>
      
      <Text style={styles.message}>
        Taking time to reflect on your emotions is a powerful step toward emotional well-being. 
        Your commitment to self-awareness is admirable.
      </Text>

      <View style={styles.emotionCard}>
        <Text style={styles.emotionLabel}>You expressed feeling:</Text>
        <View style={styles.emotionContainer}>
          <Text style={styles.emotionIcon}>{journalEntry.emotion.icon}</Text>
          <Text style={styles.emotionName}>{journalEntry.emotion.name}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EmotionSelection')}
      >
        <Text style={styles.buttonText}>Record Another Emotion</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          View Your Journey
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  emotionCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    width: '100%',
  },
  emotionLabel: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.sm,
  },
  emotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  emotionName: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  secondaryButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.card,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
}); 