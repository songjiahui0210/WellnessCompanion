// AnalysisResultScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Clipboard, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import styles from '../appStyles';

// 你的 API_KEY 如果有就写，不要提交到公共仓库
const GEMINI_API_KEY = 'YOUR_API_KEY';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// 定义一个类型给 messages 用
type Message = { type: string; text: string };

export default function AnalysisResultScreen() {
  const route = useRoute();

  /** 从 route.params 中拿到从上一页传来的数据 */
  const {
    selectedEmotion,
    customEmotion,
    emotionIntensity,
    selectedRecipient,
    customRecipient,
    selectedScenario,
    customScenario,
  } = route.params as {
    selectedEmotion: string;
    customEmotion: string;
    emotionIntensity: number;
    selectedRecipient: string;
    customRecipient: string;
    selectedScenario: string;
    customScenario: string;
  };

  // 本页自己的 state
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessage, setLastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [additionalInput, setAdditionalInput] = useState('');

  /** 调用后端生成 Expression 文本 */
  const generateExpression = async () => {
    setLoading(true);

    try {
      const scenarioText = customScenario || selectedScenario;
      const emotionText = customEmotion || selectedEmotion;
      const recipientText = customRecipient || selectedRecipient;
      const additionalText = additionalInput
        ? ` Additional information: ${additionalInput}`
        : '';

      // 准备要发送的 prompt
      const prompt = {
        contents: [
          {
            parts: [
              {
                text: `The user is a young adult with language impairments and needs you to write a few sentences of expressing their feelings for them.
                The user is feeling "${emotionText}" at an intensity level of ${emotionIntensity} on a scale from 1 to 10, where 1 is very mild and 10 is very strong. They want to communicate with "${recipientText}" in the "${scenarioText}" context. ${additionalText}

                Write a considerate and clear text for the user directly with some details to explain their true intentions and feelings with potential causes in the situation, maintaining a genuine atmosphere. 
                
                Start the message with 'I' and write in a natural tone. Avoid using numbers to describe the emotion intensity; instead, use descriptive language to convey the emotion strength based on the intensity level provided. Write directly for them so that they can read it directly. Don't add anything in the brackets.`
              }
            ]
          }
        ]
      };

      // 发送请求
      const response = await axios.post(API_URL, prompt);
      const generatedText = response.data.candidates[0].content.parts[0].text || "I couldn't generate a response.";

      // 更新 state
      setMessages((prev) => [...prev, { type: 'ai', text: generatedText }]);
      setLastMessage(generatedText);
    } catch (error) {
      console.error('Error while generating expression:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unknown error occurred';
      setMessages((prev) => [...prev, { type: 'ai', text: `Error: ${errorMessage}` }]);
      setLastMessage('');
    }

    setLoading(false);
  };

  /** 复制到剪贴板 */
  const copyToClipboard = () => {
    Clipboard.setString(lastMessage);
    Alert.alert('Copied to clipboard!');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>Analysis & Result</Text>
        <Text style={{ marginBottom: 10 }}>
          This page uses the data from the previous page to generate text via LLM.
        </Text>

        {/* 生成按钮 */}
        <Button
          title={loading ? 'Loading...' : 'Generate Expression'}
          onPress={generateExpression}
          disabled={loading}
        />

        {/* 显示生成结果 */}
        {lastMessage ? (
          <>
            <Text style={styles.messageText}>{lastMessage}</Text>

            {/* 再来一次 */}
            <Button
              title="Give me another try"
              onPress={() => {
                setAdditionalInput(''); // 清空附加信息
                generateExpression();    // 再次调用
              }}
              disabled={loading}
            />

            {/* 附加信息输入框 */}
            <Text>Is there anything you want to add?</Text>
            <TextInput
              style={styles.input}
              placeholder="Add more details"
              value={additionalInput}
              onChangeText={setAdditionalInput}
              onSubmitEditing={generateExpression}
            />

            {/* 复制结果 */}
            <Button
              title="Copy"
              onPress={copyToClipboard}
              disabled={!lastMessage}
            />
          </>
        ) : null}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
