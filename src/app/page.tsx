
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message, ApiChatbotResponse, RcaFormData } from '@/types';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { getAIResponse } from './actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RcaForm } from '@/components/rca/RcaForm';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRcaFormOpen, setIsRcaFormOpen] = useState(false);

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
    // Only add welcome message if no messages exist to prevent re-adding on RCA form close
    if (messages.length === 0) {
      addMessage(
        "Welcome to the M-pesa Incident Analysis assistant! I can help you analyze IT incidents. How can I assist you today?",
        'system'
      );
    }
  }, [addMessage, messages.length]);

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
        errorMessage = error.message; 
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
    setIsRcaFormOpen(true);
  };

  const handleRcaFormSubmit = (data: RcaFormData) => {
    console.log("RCA Form Submitted:", data);
    setIsRcaFormOpen(false);
    // Reset chat and add a message about the new RCA context
    setMessages([]);
    addMessage(
      `New RCA started for ticket: ${data.incidentTicketNumber}. Details logged. You can now ask questions related to this incident or provide further information.`,
      'system'
    );
    // Here you could potentially send some of this data to the AI 
    // or use it to prime the conversation.
    // For example:
    // handleSendMessage(`Analyze incident ${data.incidentTicketNumber}: ${data.description}`);
  };


  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <ChatHeader onNewRcaSubmission={handleNewRcaSubmission} />
      <main className="flex-grow flex flex-col overflow-hidden">
        <ChatArea messages={messages} isLoading={isLoading} />
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      <Dialog open={isRcaFormOpen} onOpenChange={setIsRcaFormOpen}>
        <DialogContent className="max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <DialogHeader>
            <DialogTitle>New RCA Submission</DialogTitle>
            <DialogDescription>
              Please fill out the details for the new Root Cause Analysis report. All fields are required unless marked optional.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-6"> {/* Added pr-6 for scrollbar spacing */}
            <RcaForm
              onSubmitRca={handleRcaFormSubmit}
              onCancel={() => setIsRcaFormOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
