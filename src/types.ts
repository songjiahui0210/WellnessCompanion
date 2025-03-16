// import { NativeStackScreenProps } from '@react-navigation/native-stack';

// export type Emotion = {
//   name: string;
//   icon: string;
//   color: string;
// };

// export type JournalEntry = {
//   id?: string;
//   date?: Date;
//   emotion: Emotion;
//   content: string;
//   intensity: number;
//   isVoiceNote?: boolean;
//   aiSummary?: string;
//   isLogged?: boolean;
// };

// export type EmotionTrend = {
//   date: Date;
//   emotion: Emotion;
// };

// export type MonthlyStats = {
//   month: string;
//   dominantEmotion: Emotion;
//   emotionCounts: Record<string, number>;
// };

// export type NavigationParams = {
//   EmotionSelection: undefined;
//   RecordingMethod: { emotion: Emotion; intensity: number };
//   Analysis: { emotion: Emotion; content: string; intensity: number; isVoiceNote?: boolean };
//   AIResponse: { journalEntry: JournalEntry; responseType: string };
//   Gratitude: { journalEntry: JournalEntry };
//   Profile: undefined;
// };

// export type ScreenProps<T extends keyof NavigationParams> = NativeStackScreenProps<NavigationParams, T>;