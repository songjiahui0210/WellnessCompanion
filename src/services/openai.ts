import OpenAI from 'openai';

// Use environment variables for API keys
// You'll need to create a .env file at the root of your project
// with EXPO_PUBLIC_OPENAI_API_KEY=your_api_key
// Note: For Expo, environment variables must be prefixed with EXPO_PUBLIC_ to be accessible in the client
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

// Use mock data when API key is not available
const useMockData = !apiKey;

// Create the OpenAI client only if we have an API key
const openaiClient = useMockData ? null : new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true, // Required for browser environments
});

// Export a safe version with error handling
export const openai = {
  chat: {
    completions: {
      create: async (params: any) => {
        try {
          console.log("Calling OpenAI API...");
          
          if (useMockData) {
            console.log("No API key found. Using mock data instead.");
            return getMockResponse(params);
          }
          
          const response = await openaiClient.chat.completions.create(params);
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

// Mock response function for testing
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