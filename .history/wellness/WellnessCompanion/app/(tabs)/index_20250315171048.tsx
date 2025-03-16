import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View, Text, TextInput, Button, ScrollView, TouchableOpacity, FlatList, Clipboard, KeyboardAvoidingView, Platform} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import styles from '../appStyles';

const GEMINI_API_KEY = 'YOUR_API_KEY';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function App() {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [customEmotion, setCustomEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [inputMethod, setInputMethod] = useState<'speech' | 'text'>('text');
  const [summaryMessage, setSummaryMessage] = useState('');
  const [selectedNextStep, setSelectedNextStep] = useState<'log' | 'advice' | 'express' | ''>('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [customRecipient, setCustomRecipient] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [customScenario, setCustomScenario] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDetailedEmotions, setShowDetailedEmotions] = useState(false);

  const emotions = ['Happy 😊', 'Sad 😢', 'Angry 😡', 'Worried 😨', 'Other'];
  const detailedEmotions = ['Overwhelmed', 'Stressed', 'Anxious', 'Frustrated','Annoyed', 'Nervous'];

  const recipients = ['Friend', 'Family', 'Romantic interest', 'Peers', 'Other'];
  const scenarios = ['School', 'Home', 'Public places', 'Workplace', 'Online', 'Medical Settings', 'Other'];

  const handleTagSelection = (
    tag: string, 
    setter: React.Dispatch<React.SetStateAction<string>>, 
    customSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(tag);
    if (tag === 'Other') {
      customSetter('');  
    } else {
      customSetter('');
    }
  };

  const generateSummary = async () => {
    if (!selectedEmotion && !customEmotion) {
      alert('Please select or input an emotion first.');
      return;
    }

    setLoading(true);
    try {
      const emotionText = customEmotion || selectedEmotion;
      const prompt = {
        contents: [{
          parts: [{
            text: `The user is feeling "${emotionText}" with an intensity level of ${emotionIntensity} (1 is mild, 10 is very strong).
            Please summarize the user's feeling in a supportive, authentic, and concise manner. 
            Offer empathy and encouragement without being overly wordy.`
          }]
        }]
      };

      const response = await axios.post(API_URL, prompt);
      const generatedText = 
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text 
        || "I couldn't generate a summary.";

      setSummaryMessage(generatedText.trim());
    } catch (error) {
      console.error('Error while generating summary:', error);
      setSummaryMessage(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
    setLoading(false);
  };


  const generateNextStepContent = async () => {
    setLoading(true);

    try {
      if (selectedNextStep === 'log') {
        setLastMessage(`Your feeling "${customEmotion || selectedEmotion}" at intensity ${emotionIntensity} has been logged.`);
      }
      else if (selectedNextStep === 'advice') {
        const emotionText = customEmotion || selectedEmotion;
        const prompt = {
          contents: [{
            parts: [{
              text: `The user is feeling "${emotionText}" with an intensity of ${emotionIntensity}.
              Please offer some practical suggestions or advice to help them cope in a supportive tone.`
            }]
          }]
        };

        const response = await axios.post(API_URL, prompt);
        const generatedText =
          response?.data?.candidates?.[0]?.content?.parts?.[0]?.text 
          || "I couldn't generate advice.";

        setLastMessage(generatedText.trim());

      } else if (selectedNextStep === 'express') {
        const scenarioText = customScenario || selectedScenario;
        const recipientText = customRecipient || selectedRecipient;
        const emotionText = customEmotion || selectedEmotion;

        const prompt = {
          contents: [{
            parts: [{
              text: `The user is a young adult with language impairments and needs you to write a few sentences of expressing their feelings for them.
              
              They are feeling "${emotionText}" at an intensity level of ${emotionIntensity}. 
              They want to communicate with "${recipientText}" in the "${scenarioText}" context.
              
              Write a considerate, genuine, and clear text message for the user directly, with some details to explain their true intentions and feelings, 
              potentially mentioning the situation if relevant. Start with "I" and keep a supportive, understanding tone.`
            }]
          }]
        };

        const response = await axios.post(API_URL, prompt);
        const generatedText = 
          response?.data?.candidates?.[0]?.content?.parts?.[0]?.text 
          || "I couldn't generate a response.";

        setLastMessage(generatedText.trim());
      }
    } catch (error) {
      console.error('Error while generating next-step content:', error);
      setLastMessage(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    Clipboard.setString(lastMessage);
    alert('Copied to clipboard!');
  };

  const renderEmotionSelection = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Emotions</Text>

        <TouchableOpacity onPress={() => setShowDetailedEmotions(!showDetailedEmotions)} style={styles.iconButton}>
          <FontAwesome name="plus" size={20} color="#007AFF" />
        </TouchableOpacity>

        <FlatList
          data={emotions}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tag, (selectedEmotion === item) && styles.selectedTag]}
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
                style={[styles.tag, (selectedEmotion === item) && styles.selectedTag]}
                onPress={() => handleTagSelection(item, setSelectedEmotion, setCustomEmotion)}
              >
                <Text style={styles.tagText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal={false}
            numColumns={2}
          />
        )}

        {selectedEmotion === "Other" && (
          <TextInput
            style={styles.input}
            placeholder="Type your emotion"
            value={customEmotion}
            onChangeText={setCustomEmotion}
          />
        )}

        {/* Intensity Slider */}
        {(selectedEmotion || customEmotion) && (
          <>
            <Text style={styles.sliderLabel}>Intensity Level: {emotionIntensity}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={emotionIntensity}
              onValueChange={(value) => setEmotionIntensity(Array.isArray(value) ? value[0] : value)}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#b9e4c9"
            />
          </>
        )}
      </View>
    );
  };

  const renderInputMethodSelection = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Input Method</Text>
        <View style={{ flexDirection: 'row' }}>
          <Button
            title="Speech to Text"
            onPress={() => setInputMethod('speech')}
            color={inputMethod === 'speech' ? '#007AFF' : undefined}
          />
          <Button
            title="Text Input"
            onPress={() => setInputMethod('text')}
            color={inputMethod === 'text' ? '#007AFF' : undefined}
          />
        </View>
        {
          inputMethod === 'speech' && (
            <Text style={styles.infoText}>
              Here you could implement or call your Speech-to-Text function.
            </Text>
          )
        }
        {
          inputMethod === 'text' && (
            <Text style={styles.infoText}>
              You can type your emotion above or pick from tags.
            </Text>
          )
        }
      </View>
    );
  };

  const renderExpressOptions = () => {
    if (selectedNextStep !== 'express') return null;

    return (
      <View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Who do you want to express to?</Text>
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
          {selectedRecipient === "Other" && (
            <TextInput
              style={styles.input}
              placeholder="Type your recipient"
              value={customRecipient}
              onChangeText={setCustomRecipient}
            />
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Scenario</Text>
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
          {selectedScenario === "Other" && (
            <TextInput
              style={styles.input}
              placeholder="Type your scenario"
              value={customScenario}
              onChangeText={setCustomScenario}
            />
          )}
        </View>

        <Button
          title={loading ? 'Generating...' : 'Generate Expression'}
          onPress={generateNextStepContent}
          disabled={loading}
        />
      </View>
    );
  };

  const renderFinalMessage = () => {
    if (!lastMessage) return null;
    return (
      <View style={{ marginVertical: 16 }}>
        <Text style={styles.messageText}>{lastMessage}</Text>
        <Button
          title="Copy"
          onPress={copyToClipboard}
        />
      </View>
    );
  };

  const renderNextStepSelection = () => {
    if (!summaryMessage) return null; 
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>What's next?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Button 
            title="Log this emotion" 
            onPress={() => {
              setSelectedNextStep('log');
              setLastMessage('');
            }}
          />
          <Button 
            title="Get advice" 
            onPress={() => {
              setSelectedNextStep('advice');
              setLastMessage('');
            }}
          />
          <Button 
            title="Express feelings to someone" 
            onPress={() => {
              setSelectedNextStep('express');
              setLastMessage('');
            }}
          />
        </View>
      </View>
    );
  };

  const renderGenerateNextStepButton = () => {
    if (!selectedNextStep) return null;
    if (selectedNextStep === 'express') return null; 
    return (
      <View style={{ marginVertical: 10 }}>
        <Button
          title={loading ? 'Generating...' : 'Generate'}
          onPress={generateNextStepContent}
          disabled={loading}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        <Text style={styles.header}>How are you feeling today?</Text>
        
        {renderEmotionSelection()}
        {renderInputMethodSelection()}

        <Button
          title={loading ? 'Generating...' : 'Summarize & Support'}
          onPress={generateSummary}
          disabled={loading}
        />
        
        {summaryMessage ? (
          <View style={{ marginVertical: 16 }}>
            <Text style={styles.messageText}>{summaryMessage}</Text>
          </View>
        ) : null}

        {renderNextStepSelection()}
        {renderGenerateNextStepButton()}

        {renderExpressOptions()}

        {renderFinalMessage()}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default App;