
import type { Message } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, User, AlertTriangle, Info } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";
  const isBot = message.sender === "bot";
  const isSystem = message.sender === "system";
  const isError = message.sender === "error";

  const timeString = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const Icon = isUser ? User : isBot ? Bot : isError ? AlertTriangle : Info;

  return (
    <div
      className={cn(
        "flex items-end gap-2 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className={cn(
          "flex-shrink-0 p-2 rounded-full",
          isBot ? "bg-primary text-primary-foreground" :
          isSystem ? "bg-primary text-primary-foreground" :
          isError ? "bg-destructive text-destructive-foreground" :
          "bg-secondary text-secondary-foreground" // Default fallback, though not typically hit with current senders
        )}>
          <Icon size={18} />
        </div>
      )}
      <Card
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-0 shadow-md",
          isUser ? "bg-secondary text-secondary-foreground rounded-br-none" : "",
          isBot ? "bg-card text-card-foreground rounded-bl-none" : "",
          isSystem ? "bg-primary text-primary-foreground border-primary rounded-bl-none w-full max-w-xl" : "", // System message uses primary color
          isError ? "bg-destructive/10 border-destructive text-destructive-foreground rounded-bl-none" : "" 
        )}
      >
        <CardContent className="p-3">
          <div className={cn(
            "text-sm whitespace-pre-wrap",
            isSystem && "font-medium text-lg",
            isError && "text-foreground" // Added to make error text use main foreground color
            )}>
            {message.text}
          </div>
          <div
            className={cn(
              "text-xs mt-1",
              isUser ? "text-right text-secondary-foreground/70" : "text-left text-muted-foreground",
              isSystem ? "text-right text-primary-foreground/70" : "",
              isError ? "text-left text-muted-foreground" : ""
            )}
          >
            {timeString}
          </div>
        </CardContent>
      </Card>
      {isUser && (
         <div className="flex-shrink-0 bg-secondary text-secondary-foreground p-2 rounded-full">
          <Icon size={18} />
        </div>
      )}
    </div>
  );
}
