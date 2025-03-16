import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { NavigationParams } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type Props = {
  navigation: NativeStackNavigationProp<NavigationParams, 'RecordingMethod'>;
  route: RouteProp<NavigationParams, 'RecordingMethod'>;
};

export const RecordingMethodScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [textContent, setTextContent] = useState('');
  const { emotion, intensity } = route.params;

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const handleSubmit = () => {
    navigation.navigate('Analysis', {
      emotion,
      intensity,
      content: textContent,
      isVoiceNote: false,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Express Your Feelings</Text>
      <Text style={styles.subtitle}>
        You're feeling <Text style={styles.emotionText}>{emotion.name}</Text>. 
        Would you like to write about it or record your voice?
      </Text>

      <View style={styles.methodsContainer}>
        <View style={styles.textSection}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Type your thoughts here..."
            value={textContent}
            onChangeText={setTextContent}
          />
          <TouchableOpacity 
            style={[styles.button, { opacity: textContent ? 1 : 0.5 }]}
            onPress={handleSubmit}
            disabled={!textContent}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity 
          style={[styles.recordButton, isRecording && styles.recording]}
          onPress={handleVoiceRecord}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? 'Stop Recording' : 'Start Voice Recording'}
          </Text>
        </TouchableOpacity>
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
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  emotionText: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  methodsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textSection: {
    width: '100%',
  },
  textInput: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: theme.spacing.md,
    minHeight: 150,
    ...theme.typography.body,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  orText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginVertical: theme.spacing.lg,
  },
  recordButton: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.md,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: theme.colors.error,
  },
  recordButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 