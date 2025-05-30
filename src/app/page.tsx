
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Message, ApiChatbotResponse, RcaFormData, ApiSourceIncident } from '@/types';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { getAIResponse, submitRcaData } from './actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RcaForm } from '@/components/rca/RcaForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRcaFormOpen, setIsRcaFormOpen] = useState(false);
  const { toast } = useToast();

  const addMessage = useCallback((text: string | React.ReactNode, sender: Message['sender']) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString() + Math.random().toString(),
        text,
        sender,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
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
      
      const botResponseContent = (
        <div className="space-y-3">
          {apiResponse.full_response && <p>{apiResponse.full_response}</p>}
          
          {apiResponse.summary && (
            <div>
              <h3 className="font-semibold text-base mb-1">Summary:</h3>
              <p className="text-sm">{apiResponse.summary}</p>
            </div>
          )}

          {apiResponse.recommendation && (
            <div>
              <h3 className="font-semibold text-base mb-1">Recommendation:</h3>
              <p className="text-sm">{apiResponse.recommendation}</p>
            </div>
          )}

          {apiResponse.source_incidents && apiResponse.source_incidents.length > 0 && (
            <div>
              <h3 className="font-semibold text-base mb-1">Source Incidents:</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {apiResponse.source_incidents.map((incident: ApiSourceIncident, index: number) => (
                  <li key={index} className="bg-muted/50 p-2 rounded-md">
                    <p className="font-medium">Content:</p>
                    <p className="whitespace-pre-wrap">{incident.Content}</p>
                    {incident.Metadata && Object.keys(incident.Metadata).length > 0 && (
                       <details className="mt-1 text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Metadata</summary>
                        <pre className="mt-1 p-2 bg-secondary/50 rounded text-xs overflow-x-auto">
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

      addMessage(botResponseContent, 'bot');

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

  const handleAnalyticsClick = () => {
    toast({
      title: "Analytics",
      description: "Analytics functionality is not yet implemented.",
    });
    console.log("Analytics button clicked");
  };

  const handleRcaFormSubmit = async (data: RcaFormData) => {
    setIsLoading(true);
    try {
      const result = await submitRcaData(data);
      if (result.success) {
        toast({
          title: "RCA Submitted Successfully",
          description: result.message || `RCA for ticket ${result.ticketNumber || data.incidentTicketNumber} has been logged.`,
        });
        setIsRcaFormOpen(false);
        setMessages([]);
        addMessage(
          `New RCA started for ticket: ${data.incidentTicketNumber}. Details logged. You can now ask questions related to this incident or provide further information.`,
          'system'
        );
      } else {
        toast({
          title: "RCA Submission Failed",
          description: result.message || "An unknown error occurred while submitting the RCA.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting RCA form:", error);
      toast({
        title: "RCA Submission Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred on the client.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <ChatHeader 
        onNewRcaSubmission={handleNewRcaSubmission} 
        onAnalyticsClick={handleAnalyticsClick}
      />
      <main className="flex-grow flex flex-col overflow-hidden">
        <ChatArea messages={messages} isLoading={isLoading && !isRcaFormOpen} />
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
          <ScrollArea className="max-h-[70vh] pr-6">
            <RcaForm
              onSubmitRca={handleRcaFormSubmit}
              onCancel={() => setIsRcaFormOpen(false)}
              isLoading={isLoading}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
