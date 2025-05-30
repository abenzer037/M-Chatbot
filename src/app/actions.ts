
'use server';

import type { ApiChatRequest, ApiChatbotResponse, RcaFormData, RcaSubmissionResponse } from '@/types';

// Hardcoded API URL
const CHATBOT_API_URL = "https://ops-bot.onrender.com/chat"; // Updated URL

export async function getAIResponse(userInput: string): Promise<ApiChatbotResponse> {
  console.log(`Attempting to call AI API at: ${CHATBOT_API_URL}`);

  const requestBody: ApiChatRequest = {
    query: userInput,
  };

  try {
    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error from ${CHATBOT_API_URL} (${response.status}): ${errorBody}`);
      let errorJson = {};
      try {
        errorJson = JSON.parse(errorBody);
      } catch (e) {
        // If errorBody is not JSON, it's already logged as text
      }
      throw new Error(`Failed to get AI response from the external API. Status: ${response.status}, URL: ${CHATBOT_API_URL}, Body: ${errorBody}`);
    }

    const data: ApiChatbotResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error calling external AI API at ${CHATBOT_API_URL}:`, error);
    let errorMessage = `Failed to connect to the AI service at ${CHATBOT_API_URL}. Please try again later.`;
    if (error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    if (error.cause) {
        if (typeof error.cause === 'object' && error.cause !== null) {
            try {
                errorMessage += ` Cause: ${JSON.stringify(error.cause)}`;
            } catch (e) {
                errorMessage += ` Cause: (Unserializable cause object)`;
            }
        } else {
            errorMessage += ` Cause: ${error.cause}`;
        }
    }
    // Re-throw a new error with a structured message or just the message
    // For the frontend to display, a simple message is often best.
    throw new Error(errorMessage);
  }
}

export async function submitRcaData(formData: RcaFormData): Promise<RcaSubmissionResponse> {
  console.log('Attempting to submit RCA data via server action:', formData);

  // TODO: Implement the actual API call to your backend here.
  // This is a placeholder for your API integration.
  // Example structure for an API call:
  // const rcaApiUrl = "YOUR_RCA_SUBMISSION_API_URL_HERE"; // Hardcode or get from env
  // if (!rcaApiUrl) {
  //   console.error('Error: RCA_SUBMISSION_API_URL is not set.');
  //   return { success: false, message: 'RCA submission API URL is not configured.' };
  // }
  // try {
  //   const response = await fetch(rcaApiUrl, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // Add any necessary authentication headers (e.g., 'Authorization': `Bearer ${your_token}`)
  //     },
  //     body: JSON.stringify(formData),
  //   });
  //   if (!response.ok) {
  //     const errorBody = await response.text();
  //     console.error(`RCA API Error (${response.status}): ${errorBody}`);
  //     return { success: false, message: `Failed to submit RCA data. API responded with status: ${response.status}` };
  //   }
  //   const responseData = await response.json(); // Assuming your API returns JSON
  //   return { success: true, message: 'RCA submitted successfully to external API!', ticketNumber: responseData.ticketNumber || formData.incidentTicketNumber };
  // } catch (error) {
  //   console.error('Error submitting RCA data to external API:', error);
  //   let message = 'Failed to connect to the RCA submission service.';
  //   if (error instanceof Error) {
  //       message = error.message;
  //   }
  //   return { success: false, message };
  // }

  // For demonstration, we simulate a successful API call with a delay.
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
  console.log(`Simulated RCA submission success for ticket: ${formData.incidentTicketNumber}`);
  // In a real scenario, you might get a specific ID or confirmation from the API.
  return { success: true, message: 'RCA data logged successfully (simulated).', ticketNumber: formData.incidentTicketNumber };
}

