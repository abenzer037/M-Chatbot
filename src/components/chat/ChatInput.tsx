'use client';

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (messageText: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        onSendMessage(inputValue.trim());
        setInputValue("");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-t border-border p-4 shadow-sm"
    >
      <div className="container mx-auto flex items-start gap-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about an incident.."
          className="flex-grow resize-none_ focus:ring-1 focus:ring-primary/50"
          rows={1}
          disabled={isLoading}
          aria-label="Chat input"
        />
        <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="bg-primary hover:bg-primary/90">
          <SendHorizonal className="h-5 w-5 text-primary-foreground" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
