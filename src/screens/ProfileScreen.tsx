import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { NavigationParams, EmotionTrend, MonthlyStats } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LineChart, BarChart } from 'react-native-chart-kit';

type Props = {
  navigation: NativeStackNavigationProp<NavigationParams, 'Profile'>;
};

// Mock data - in real app, this would come from a database
const mockDailyMood: EmotionTrend[] = [
  { date: new Date('2024-01-01'), emotion: { name: 'Happy', icon: '😊', color: '#FFD700' } },
  { date: new Date('2024-01-02'), emotion: { name: 'Peaceful', icon: '😌', color: '#98FB98' } },
  // ... more data
];

const mockMonthlyStats: MonthlyStats[] = [
  {
    month: 'January',
    dominantEmotion: { name: 'Happy', icon: '😊', color: '#FFD700' },
    emotionCounts: { 'Happy': 15, 'Sad': 5, 'Anxious': 3, 'Peaceful': 8 },
  },
  // ... more months
];

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: theme.colors.card,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(124, 152, 133, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Emotional Journey</Text>
        <TouchableOpacity
          style={styles.newEntryButton}
          onPress={() => navigation.navigate('EmotionSelection')}
        >
          <Text style={styles.buttonText}>New Entry</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeframeSelector}>
        {(['daily', 'monthly', 'yearly'] as const).map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.timeframeOption,
              timeframe === option && styles.selectedTimeframe,
            ]}
            onPress={() => setTimeframe(option)}
          >
            <Text
              style={[
                styles.timeframeText,
                timeframe === option && styles.selectedTimeframeText,
              ]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chartContainer}>
        {timeframe === 'daily' && (
          <>
            <Text style={styles.chartTitle}>Daily Mood Chart</Text>
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  data: [3, 4, 2, 5, 3, 4, 5],
                }],
              }}
              width={screenWidth - theme.spacing.lg * 2}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </>
        )}

        {timeframe === 'monthly' && (
          <>
            <Text style={styles.chartTitle}>Monthly Emotion Distribution</Text>
            <BarChart
              data={{
                labels: ['Happy', 'Sad', 'Anxious', 'Peaceful'],
                datasets: [{
                  data: [15, 5, 3, 8],
                }],
              }}
              width={screenWidth - theme.spacing.lg * 2}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=""
            />
          </>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Most Common Emotion</Text>
            <Text style={styles.statValue}>Happy 😊</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Journaling Streak</Text>
            <Text style={styles.statValue}>7 days</Text>
          </View>
        </View>

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Insights</Text>
          <Text style={styles.insightsText}>
            Your emotional well-being has been generally positive this week. 
            You've shown great consistency in journaling, which contributes to better self-awareness.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  newEntryButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  timeframeSelector: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    marginBottom: theme.spacing.lg,
  },
  timeframeOption: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedTimeframe: {
    backgroundColor: theme.colors.primary + '20',
  },
  timeframeText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  selectedTimeframeText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  chartContainer: {
    padding: theme.spacing.lg,
  },
  chartTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  chart: {
    marginVertical: theme.spacing.lg,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginHorizontal: theme.spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  insightsContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginTop: theme.spacing.lg,
  },
  insightsTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  insightsText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
}); 