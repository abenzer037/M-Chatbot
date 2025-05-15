
'use server';

import type { ApiChatRequest, ApiChatbotResponse } from '@/types';

export async function getAIResponse(userInput: string): Promise<ApiChatbotResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_CHATBOT_API_URL;
  const openaiKey = process.env.NEXT_PUBLIC_CHATBOT_OPENAI_KEY;

  if (!apiUrl) {
    console.error('Error: NEXT_PUBLIC_CHATBOT_API_URL is not set.');
    throw new Error('Chatbot API URL is not configured. Please contact support.');
  }
  if (!openaiKey) {
    console.error('Error: NEXT_PUBLIC_CHATBOT_OPENAI_KEY is not set.');
    // Depending on security policy, you might want a more generic error for the client.
    throw new Error('Chatbot API key is not configured. Please contact support.');
  }

  const fullApiUrl = `${apiUrl.replace(/\/$/, '')}/chat/`; // Ensure no double slashes

  const requestBody: ApiChatRequest = {
    query: userInput,
  };

  try {
    const response = await fetch(fullApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-Key': openaiKey, // Send OpenAI key as a custom header
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error (${response.status}): ${errorBody}`);
      throw new Error(`Failed to get AI response from the external API. Status: ${response.status}`);
    }

    const data: ApiChatbotResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling external AI API:', error);
    if (error instanceof Error && error.message.startsWith('Failed to get AI response')) {
      throw error;
    }
    throw new Error('Failed to connect to the AI service. Please try again later.');
  }
}
