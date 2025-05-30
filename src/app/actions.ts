
'use server';

import type { ApiChatRequest, ApiChatbotResponse, RcaFormData, RcaSubmissionResponse } from '@/types';

export async function getAIResponse(userInput: string): Promise<ApiChatbotResponse> {
  const apiUrlFromEnv = process.env.NEXT_PUBLIC_CHATBOT_API_URL;

  if (!apiUrlFromEnv) {
    console.error('Error: NEXT_PUBLIC_CHATBOT_API_URL is not set.');
    throw new Error('Chatbot API URL is not configured. Please contact support.');
  }

  // Ensure the base URL from .env doesn't have a trailing slash, then append the specific endpoint path
  const baseApiUrl = apiUrlFromEnv.replace(/\/$/, '');
  const endpointPath = '/chat'; // Matching @app.post("/chat") in the Python backend
  const fullApiUrl = `${baseApiUrl}${endpointPath}`;

  console.log(`Attempting to call AI API at: ${fullApiUrl}`); // Log the URL being called

  const requestBody: ApiChatRequest = {
    query: userInput,
  };

  try {
    const response = await fetch(fullApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error from ${fullApiUrl} (${response.status}): ${errorBody}`);
      // Log the full response object in case of non-ok status for more details
      try {
        const errorJson = JSON.parse(errorBody);
        console.error('API Error JSON response:', errorJson);
      } catch (e) {
        // If errorBody is not JSON, it's already logged as text
      }
      throw new Error(`Failed to get AI response from the external API. Status: ${response.status}, URL: ${fullApiUrl}`);
    }

    const data: ApiChatbotResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error calling external AI API at ${fullApiUrl}:`, error);
    let errorMessage = `Failed to connect to the AI service at ${fullApiUrl}. Please try again later.`;
    if (error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    if (error.cause) { 
        // Check if error.cause is an object before stringifying
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
    throw new Error(errorMessage);
  }
}

export async function submitRcaData(formData: RcaFormData): Promise<RcaSubmissionResponse> {
  console.log('Attempting to submit RCA data via server action:', formData);

  // TODO: Implement the actual API call to your backend here.
  // This is a placeholder for your API integration.
  // Example structure for an API call:
  // const rcaApiUrl = process.env.RCA_SUBMISSION_API_URL; // You'll need to set this in your .env files
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
