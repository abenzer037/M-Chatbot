
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message, ApiChatbotResponse } from '@/types';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { getAIResponse } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((text: string | React.ReactNode, sender: Message['sender']) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString() + Math.random().toString(), // Basic unique ID
        text,
        sender,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    addMessage(
      "Welcome to the M-pesa Incident Analysis assistant! I can help you analyze IT incidents. How can I assist you today?",
      'system'
    );
  }, [addMessage]);

  const handleSendMessage = async (messageText: string) => {
    addMessage(messageText, 'user');
    setIsLoading(true);

    try {
      const apiResponse: ApiChatbotResponse = await getAIResponse(messageText);
      
      const botMessageContent = (
        <div className="space-y-2">
          <p>{apiResponse.full_response}</p>
          {apiResponse.summary && (
            <div>
              <p className="font-semibold">Summary:</p>
              <p>{apiResponse.summary}</p>
            </div>
          )}
          {apiResponse.recommendation && (
             <div>
              <p className="font-semibold">Recommendation:</p>
              <p>{apiResponse.recommendation}</p>
            </div>
          )}
          {apiResponse.source_incidents && apiResponse.source_incidents.length > 0 && (
            <div>
              <p className="font-semibold mt-2">Source Incidents:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {apiResponse.source_incidents.map((incident, index) => (
                  <li key={index}>
                    <p className="font-medium">Content: <span className="font-normal">{incident.Content}</span></p>
                    {incident.Metadata && Object.keys(incident.Metadata).length > 0 && (
                       <details className="mt-1">
                         <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Metadata</summary>
                         <pre className="bg-muted/50 p-2 rounded-md text-muted-foreground text-[0.7rem] whitespace-pre-wrap break-all">
                           {JSON.stringify(incident.Metadata, null, 2)}
                         </pre>
                       </details>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
      addMessage(botMessageContent, 'bot');

    } catch (error) {
      console.error('Error processing message:', error);
      let errorMessage = "Sorry, I encountered an error while processing your request. Please try again later.";
      if (error instanceof Error) {
        errorMessage = error.message; // Show more specific error from action
      }
      addMessage(
        errorMessage,
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRcaSubmission = () => {
    setMessages([]);
     addMessage(
      "Welcome to the M-pesa Incident Analysis assistant! I can help you analyze IT incidents. How can I assist you today?",
      'system'
    );
    addMessage("New RCA submission process would start here. Chat has been reset.", "system");
    console.log("New RCA Submission button clicked");
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <ChatHeader onNewRcaSubmission={handleNewRcaSubmission} />
      <main className="flex-grow flex flex-col overflow-hidden">
        <ChatArea messages={messages} isLoading={isLoading} />
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
