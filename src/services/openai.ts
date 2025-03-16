import OpenAI from 'openai';

// NEVER hardcode API keys in your code - use environment variables instead
// For React Native/Expo, you can use a .env file with react-native-dotenv
// or process.env in a Node.js environment
const OPENAI_API_KEY = ''; // Remove hardcoded key

// Create the OpenAI client
const openaiClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for browser environments
});

// Export a safe version with improved error handling
export const openai = {
  chat: {
    completions: {
      create: async (params: any) => {
        try {
          console.log("Calling OpenAI API...");
          
          // Check if API key is available
          if (!OPENAI_API_KEY) {
            console.warn("No API key provided. Using mock data instead.");
            return getMockResponse(params);
          }
          
          const response = await openaiClient.chat.completions.create(params);
          console.log("API call successful");
          return response;
        } catch (error: any) {
          console.error("OpenAI API Error:", error);
          
          // More detailed error handling
          let errorMessage = "Sorry, I encountered an error processing your request.";
          
          if (error.status === 429) {
            errorMessage = "Rate limit exceeded. Please try again later or check your API quota.";
          } else if (error.status === 401) {
            errorMessage = "Authentication error. Please check your API key.";
          } else if (error.message) {
            errorMessage = `Error: ${error.message}`;
          }
          
          // Return a structured response that matches the expected format
          return {
            choices: [{ message: { content: errorMessage } }]
          };
        }
      }
    }
  }
};

// Mock response function for testing when no API key is available
function getMockResponse(params: any) {
  const userMessage = params.messages.find((m: any) => m.role === "user")?.content || "";
  
  // Generate different responses based on content
  if (userMessage.includes("feeling")) {
    return {
      choices: [{
        message: {
          content: "I understand you're sharing your feelings. It's important to acknowledge your emotions. Based on what you've shared, it seems like you're experiencing a mix of emotions. Remember that it's okay to feel this way, and taking time to reflect on your emotions is a healthy practice."
        }
      }]
    };
  } else if (userMessage.includes("summarize")) {
    return {
      choices: [{
        message: {
          content: "Based on your journal entry, you seem to be feeling a mix of emotions. Your thoughts reflect both positive and challenging aspects of your experience. Remember that acknowledging these feelings is an important step in emotional well-being."
        }
      }]
    };
  }
  
  return {
    choices: [{
      message: {
        content: "Thank you for sharing. I'm here to support you through your emotional journey. Remember that acknowledging your feelings is an important step toward emotional well-being."
      }
    }]
  };
}