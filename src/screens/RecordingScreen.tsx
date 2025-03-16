import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { theme } from '../theme';
import { ScreenProps } from '../types';

export const RecordingScreen: React.FC<ScreenProps<'RecordingMethod'>> = ({ 
  navigation, 
  route 
}) => {
  const { emotion, intensity } = route.params;
  const [content, setContent] = useState('');
  const [isVoiceNote, setIsVoiceNote] = useState(false);

  const handleContinue = () => {
    navigation.navigate('Analysis', {
      emotion,
      intensity,
      content,
      isVoiceNote,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Express your {emotion.name.toLowerCase()} feelings
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Type your thoughts here..."
          value={content}
          onChangeText={setContent}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !content && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!content}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    flex: 1,
    marginBottom: theme.spacing.lg,
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 12,
    ...theme.typography.body,
  },
  button: {
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
    color: theme.colors.card,
  },
});

export default RecordingScreen; 