
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

// Metadata for source incidents
export interface ApiMetadata {
  [key: string]: any; // Allow any other metadata fields
}

// Structure for a single source incident
export interface ApiSourceIncident {
  Content: string;
  Metadata: ApiMetadata;
}

// Updated to match the new backend response structure with summary, recommendation, etc.
export interface ApiChatbotResponse {
  summary: string;
  recommendation: string;
  full_response: string;
  source_incidents: ApiSourceIncident[];
}

// Type for RCA Form Data
export interface RcaFormData {
  incidentTicketNumber: string;
  timeDetected: string; // Should be ISO string for datetime-local
  timeRecorded: string; // Should be ISO string for datetime-local
  timeRestored: string; // Should be ISO string for datetime-local
  affectedCi: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Closed';
  incidentOwner: string;
  notDetectedByMonitoringReason?: string;
  description: string;
  systemImpact: string;
  businessImpact: string;
  rootCauseFindings: string;
  correctiveActions: string;
  preventativeMeasures: string;
}

// Type for RCA Submission API Response (from server action)
export interface RcaSubmissionResponse {
  success: boolean;
  message: string;
  ticketNumber?: string;
}
