import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { NavigationParams } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type Props = {
  navigation: NativeStackNavigationProp<NavigationParams, 'Gratitude'>;
  route: RouteProp<NavigationParams, 'Gratitude'>;
};

export const GratitudeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { journalEntry } = route.params;
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🌟</Text>
        </View>

        <Text style={styles.title}>Thank You for Sharing</Text>
        
        <Text style={styles.message}>
          Taking time to reflect on your emotions is a powerful step toward 
          emotional well-being. Your commitment to self-awareness is admirable.
        </Text>

        <View style={styles.emotionContainer}>
          <Text style={styles.emotionLabel}>You expressed feeling:</Text>
          <View style={styles.emotionBadge}>
            <Text style={styles.emotionIcon}>{journalEntry.emotion.icon}</Text>
            <Text style={styles.emotionText}>{journalEntry.emotion.name}</Text>
          </View>
        </View>

        <Text style={styles.encouragement}>
          Remember, every emotion is valid and understanding them helps us grow.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.buttonText}>View Your Journey</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newEntryButton}
            onPress={() => navigation.navigate('EmotionSelection')}
          >
            <Text style={styles.buttonText}>New Entry</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 40,
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
  emotionContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emotionLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emotionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  emotionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  encouragement: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  profileButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  newEntryButton: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 