// EmotionInputScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import styles from '../appStyles';

export default function EmotionInputScreen() {
  const navigation = useNavigation();

  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [customEmotion, setCustomEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(5);  
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [customRecipient, setCustomRecipient] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [customScenario, setCustomScenario] = useState('');
  const [showDetailedEmotions, setShowDetailedEmotions] = useState(false);

  const emotions = ['Happy 😊', 'Sad 😢', 'Angry 😡', 'Worried 😨', 'Other'];
  const detailedEmotions = ['Overwhelmed', 'Stressed', 'Anxious', 'Frustrated','Annoyed', 'Nervous'];
  const recipients = ['Friend', 'Family', 'Romantic interest', 'Peers', 'Other'];
  const scenarios = ['School', 'Home', 'Public places', 'Workplace', 'Online', 'Medical Settings', 'Other'];


  const handleTagSelection = (
    tag: string,
    setter: (val: string) => void,
    customSetter: (val: string) => void
  ) => {
    setter(tag);
    if (tag === 'Other') {
      customSetter('');
    } else {
      customSetter('');
    }
  };


  const onNext = () => {
    navigation.navigate('AnalysisResult' as never, {
      selectedEmotion,
      customEmotion,
      emotionIntensity,
      selectedRecipient,
      customRecipient,
      selectedScenario,
      customScenario,
    } as never);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior="padding"
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>How are you feeling today?</Text>

        {/* ---- Emotions ---- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Emotions</Text>
          <TouchableOpacity
            onPress={() => setShowDetailedEmotions(!showDetailedEmotions)}
            style={styles.iconButton}
          >
            <FontAwesome name="plus" size={20} color="#007AFF" />
          </TouchableOpacity>

          <FlatList
            data={emotions}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.tag, selectedEmotion === item && styles.selectedTag]}
                onPress={() => handleTagSelection(item, setSelectedEmotion, setCustomEmotion)}
              >
                <Text style={styles.tagText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal={false}
            numColumns={2}
          />

          {showDetailedEmotions && (
            <FlatList
              data={detailedEmotions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.tag, selectedEmotion === item && styles.selectedTag]}
                  onPress={() => setSelectedEmotion(item)}
                >
                  <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              horizontal={false}
              numColumns={2}
            />
          )}

          {selectedEmotion === 'Other' && (
            <TextInput
              style={styles.input}
              placeholder="Type your emotion"
              value={customEmotion}
              onChangeText={setCustomEmotion}
            />
          )}

          {(selectedEmotion !== '' || customEmotion) && (
            <>
              <Text style={styles.sliderLabel}>Level: {emotionIntensity}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={emotionIntensity}
                onValueChange={setEmotionIntensity}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
              />
            </>
          )}
        </View>

        {/* ---- Recipients ---- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recipients</Text>
          <FlatList
            data={recipients}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.tag, selectedRecipient === item && styles.selectedTag]}
                onPress={() => handleTagSelection(item, setSelectedRecipient, setCustomRecipient)}
              >
                <Text style={styles.tagText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal={false}
            numColumns={2}
          />
          {selectedRecipient === 'Other' && (
            <TextInput
              style={styles.input}
              placeholder="Type your recipient"
              value={customRecipient}
              onChangeText={setCustomRecipient}
            />
          )}
        </View>

        {/* ---- Scenarios ---- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Scenarios</Text>
          <FlatList
            data={scenarios}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.tag, selectedScenario === item && styles.selectedTag]}
                onPress={() => handleTagSelection(item, setSelectedScenario, setCustomScenario)}
              >
                <Text style={styles.tagText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal={false}
            numColumns={2}
          />
          {selectedScenario === 'Other' && (
            <TextInput
              style={styles.input}
              placeholder="Type your scenario"
              value={customScenario}
              onChangeText={setCustomScenario}
            />
          )}
        </View>

        <Button title="Next" onPress={onNext} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
