import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { NavigationParams, JournalEntry } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type Props = {
  navigation: NativeStackNavigationProp<NavigationParams, 'Analysis'>;
  route: RouteProp<NavigationParams, 'Analysis'>;
};

const advisorOptions = [
  { id: 'therapist', label: 'Therapist', icon: '👩‍⚕️' },
  { id: 'friend', label: 'Close Friend', icon: '🤝' },
  { id: 'parent', label: 'Parent', icon: '👨‍👩‍👧‍👦' },
  { id: 'mentor', label: 'Mentor', icon: '🎓' },
];

const recipientOptions = [
  { id: 'self', label: 'Myself', icon: '🤔' },
  { id: 'friend', label: 'A Friend', icon: '👥' },
  { id: 'partner', label: 'Partner', icon: '💑' },
  { id: 'family', label: 'Family Member', icon: '👨‍👩‍👧‍👦' },
];

export const AnalysisScreen: React.FC<Props> = ({ navigation, route }) => {
  const { emotion, content, isVoiceNote } = route.params;
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [saveToJournal, setSaveToJournal] = useState(true);

  // Simulate AI analysis
  React.useEffect(() => {
    setTimeout(() => {
      setAiSummary(
        "Based on your entry, it seems you're experiencing strong emotions due to a challenging situation. Your response shows self-awareness and a desire to understand these feelings better."
      );
      setLoading(false);
    }, 2000);
  }, []);

  const handleContinue = () => {
    const journalEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      emotion,
      content,
      isVoiceNote,
      aiSummary,
      advisorPerspective: selectedAdvisor,
      recipient: selectedRecipient,
      isLogged: saveToJournal,
    };

    navigation.navigate('AIResponse', { journalEntry });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Analysis</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} size="large" />
          <Text style={styles.loadingText}>Analyzing your entry...</Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{aiSummary}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Advisor Perspective</Text>
            <View style={styles.optionsGrid}>
              {advisorOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    selectedAdvisor === option.id && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedAdvisor(option.id)}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Express To</Text>
            <View style={styles.optionsGrid}>
              {recipientOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    selectedRecipient === option.id && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedRecipient(option.id)}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.saveSection}>
            <TouchableOpacity
              style={styles.saveToggle}
              onPress={() => setSaveToJournal(!saveToJournal)}
            >
              <View style={[styles.checkbox, saveToJournal && styles.checked]} />
              <Text style={styles.saveText}>Save to journal</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selectedAdvisor || !selectedRecipient) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!selectedAdvisor || !selectedRecipient}
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
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
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
  summaryCard: {
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
  summaryTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.sm,
  },
  optionLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  saveSection: {
    marginBottom: theme.spacing.xl,
  },
  saveToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  checked: {
    backgroundColor: theme.colors.primary,
  },
  saveText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 