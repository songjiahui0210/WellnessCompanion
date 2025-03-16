import OpenAI from 'openai';

// Replace with your actual OpenAI API key
const OPENAI_API_KEY = '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';

// Create the OpenAI client
const openaiClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for browser environments
});

// Export a safe version with error handling
export const openai = {
  chat: {
    completions: {
      create: async (params: any) => {
        try {
          console.log("Calling OpenAI API...");
          return await openaiClient.chat.completions.create(params);
        } catch (error) {
          console.error("OpenAI API Error:", error);
          // Return a structured response that matches the expected format
          return {
            choices: [{ message: { content: "Sorry, I encountered an error processing your request." } }]
          };
        }
      }
    }
  }
};