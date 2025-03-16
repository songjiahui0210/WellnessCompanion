import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { ScreenProps } from '../types';

const emotions = [
  { name: 'Happy', icon: '😊', color: '#FFD700' },
  { name: 'Sad', icon: '😢', color: '#87CEEB' },
  { name: 'Anxious', icon: '😰', color: '#DDA0DD' },
];

export const EmotionSelectionScreen: React.FC<ScreenProps<'EmotionSelection'>> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      <View style={styles.emotionsGrid}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.name}
            style={[styles.emotionCard, { backgroundColor: emotion.color + '20' }]}
            onPress={() => navigation.navigate('RecordingMethod', { emotion })}
          >
            <Text style={styles.emotionIcon}>{emotion.icon}</Text>
            <Text style={styles.emotionName}>{emotion.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emotionCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotionIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  emotionName: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
}); 