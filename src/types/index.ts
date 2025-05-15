
export interface Message {
  id: string;
  text: string | React.ReactNode;
  sender: 'user' | 'bot' | 'system' | 'error';
  timestamp: Date;
}
