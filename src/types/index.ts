
export interface Message {
  id: string;
  text: string | React.ReactNode;
  sender: 'user' | 'bot' | 'system' | 'error';
  timestamp: Date;
}

// Types for the external Python API
export interface ApiChatRequest {
  query: string;
}

export interface ApiSourceIncident {
  Content: string;
  Metadata: Record<string, any>;
}

export interface ApiChatbotResponse {
  summary: string;
  recommendation: string;
  full_response: string;
  source_incidents: ApiSourceIncident[];
}
