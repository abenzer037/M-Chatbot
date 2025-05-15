'use client';

import type { Message } from "@/types";
import { ChatMessage } from "./ChatMessage";
import { ChatLoadingIndicator } from "./ChatLoadingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef} viewportRef={viewportRef}>
      <div className="space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <ChatLoadingIndicator />}
      </div>
    </ScrollArea>
  );
}
