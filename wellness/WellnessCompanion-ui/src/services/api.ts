import { JournalEntry } from '../types';
import { config } from '../config';

// Get the API base URL from the config
const API_BASE_URL = config.api.baseUrl;

/**
 * Service to handle API calls to the local agent service
 */
export const apiService = {
  /**
   * Get available AI models
   * @returns Promise with the list of available models
   */
  getModels: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting models:', error);
      throw error;
    }
  },

  /**
   * Get AI analysis for a journal entry
   * @param content The journal entry content
   * @param emotion The emotion associated with the entry
   * @returns Promise with the AI analysis
   */
  getAnalysis: async (content: string, emotion: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          emotion,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Error getting analysis:', error);
      throw error;
    }
  },

  /**
   * Get personalized response from the AI agent
   * @param journalEntry The journal entry data
   * @returns Promise with the AI response
   */
  getResponse: async (journalEntry: JournalEntry): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: journalEntry.content,
          emotion: journalEntry.emotion.name,
          advisorPerspective: journalEntry.advisorPerspective,
          aiSummary: journalEntry.aiSummary,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting response:', error);
      throw error;
    }
  },
}; 