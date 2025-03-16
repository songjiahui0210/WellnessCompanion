import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../theme';
import { Emotion, ScreenProps } from '../types';

const baseEmotions: Emotion[] = [
  { name: 'Happy', icon: '😊', color: '#FFD700' },
  { name: 'Sad', icon: '😢', color: '#87CEEB' },
  { name: 'Angry', icon: '😠', color: '#FF6B6B' },
  { name: 'Worried', icon: '😨', color: '#DDA0DD' },
  { name: 'Other', icon: '➕', color: '#A9A9A9' },
];

const detailedEmotions: Emotion[] = [
  { name: 'Overwhelmed', icon: '😫', color: '#E6B0AA' },
  { name: 'Stressed', icon: '😓', color: '#D7BDE2' },
  { name: 'Anxious', icon: '😰', color: '#A9CCE3' },
  { name: 'Frustrated', icon: '😤', color: '#F5B7B1' },
  { name: 'Nervous', icon: '😅', color: '#FAD7A0' },
];

export const EmotionSelectionScreen: React.FC<ScreenProps<'EmotionSelection'>> = ({ navigation }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [customEmotion, setCustomEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [showDetailedEmotions, setShowDetailedEmotions] = useState(false);

  const handleEmotionSelect = (emotion: Emotion) => {
    console.log("Selected emotion:", emotion);
    setSelectedEmotion(emotion);
  };

  const handleContinue = () => {
    console.log("Continuing with emotion:", selectedEmotion);
    if (selectedEmotion) {
      const emotion = selectedEmotion.name === 'Other' && customEmotion
        ? { name: customEmotion, icon: '📝', color: '#A9A9A9' }
        : selectedEmotion;

      navigation.navigate('RecordingMethod', { 
        emotion,
        intensity: emotionIntensity 
      });
    }
  };

  console.log('App is rendering');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      
      <View style={styles.emotionsContainer}>
        {baseEmotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.name}
            style={[
              styles.emotionCard,
              { backgroundColor: emotion.color + '20' },
              selectedEmotion?.name === emotion.name && styles.selectedCard
            ]}
            onPress={() => handleEmotionSelect(emotion)}
          >
            <Text style={styles.emotionIcon}>{emotion.icon}</Text>
            <Text style={styles.emotionName}>{emotion.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.showMoreButton}
        onPress={() => setShowDetailedEmotions(!showDetailedEmotions)}
      >
        <FontAwesome 
          name={showDetailedEmotions ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={theme.colors.primary} 
        />
        <Text style={styles.showMoreText}>
          {showDetailedEmotions ? "Show Less" : "More Emotions"}
        </Text>
      </TouchableOpacity>

      {showDetailedEmotions && (
        <View style={styles.emotionsContainer}>
          {detailedEmotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.name}
              style={[
                styles.emotionCard,
                { backgroundColor: emotion.color + '20' },
                selectedEmotion?.name === emotion.name && styles.selectedCard
              ]}
              onPress={() => handleEmotionSelect(emotion)}
            >
              <Text style={styles.emotionIcon}>{emotion.icon}</Text>
              <Text style={styles.emotionName}>{emotion.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedEmotion?.name === 'Other' && (
        <TextInput
          style={styles.input}
          placeholder="Type your emotion..."
          value={customEmotion}
          onChangeText={setCustomEmotion}
        />
      )}

      {selectedEmotion && (
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityLabel}>
            Intensity Level: {emotionIntensity}
          </Text>
          <Slider
            value={emotionIntensity}
            onValueChange={(value) => setEmotionIntensity(value)}
            minimumValue={1}
            maximumValue={10}
            step={1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.secondary}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.continueButton, !selectedEmotion && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!selectedEmotion || (selectedEmotion.name === 'Other' && !customEmotion)}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
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
    textAlign: 'center',
  },
  emotionsContainer: {
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
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  showMoreText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  input: {
    height: 40,
    borderColor: theme.colors.secondary,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  intensityContainer: {
    marginBottom: theme.spacing.md,
  },
  intensityLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.text,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
}); 