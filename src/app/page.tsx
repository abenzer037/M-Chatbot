
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message, ApiChatbotResponse, RcaFormData } from '@/types';
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
  const [isLoading, setIsLoading] = useState(false); // Used for chat input and RCA form submission
  const [isRcaFormOpen, setIsRcaFormOpen] = useState(false);
  const { toast } = useToast();

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
      // Directly use the 'response' field from the API
      addMessage(apiResponse.response, 'bot');

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
    // Placeholder for future analytics functionality
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
        // Reset chat and add a message about the new RCA context
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
        onAnalyticsClick={handleAnalyticsClick} // Pass the new handler
      />
      <main className="flex-grow flex flex-col overflow-hidden">
        <ChatArea messages={messages} isLoading={isLoading && !isRcaFormOpen} /> {/* Show chat loading only if RCA form is not open */}
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
              isLoading={isLoading} // Pass loading state to the form
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
