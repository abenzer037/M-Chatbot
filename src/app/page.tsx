'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message } from '@/types';
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
      const aiOutput = await getAIResponse(messageText);
      if (aiOutput.suggestions && aiOutput.suggestions.length > 0) {
        const suggestionsText = (
          <div>
            <p className="font-semibold mb-2">Here are some suggestions based on previous RCA reports:</p>
            <ul className="list-disc list-inside space-y-1">
              {aiOutput.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        );
        addMessage(suggestionsText, 'bot');
      } else {
        addMessage("I couldn't find any specific suggestions for that, but please provide more details if you'd like me to try again.", 'bot');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage(
        "Sorry, I encountered an error while processing your request. Please try again later.",
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRcaSubmission = () => {
    // Placeholder for New RCA Submission functionality
    // For now, it can clear the chat and show a message
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
