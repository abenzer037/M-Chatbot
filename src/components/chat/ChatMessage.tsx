
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
          "max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-0 shadow-md", // Increased max-width
          isUser ? "bg-secondary text-secondary-foreground rounded-br-none" : "",
          isBot ? "bg-card text-card-foreground rounded-bl-none" : "",
          isSystem ? "bg-primary text-primary-foreground border-primary rounded-bl-none w-full max-w-4xl" : "", // System message uses primary color, increased max-width
          isError ? "bg-destructive/10 border-destructive text-foreground rounded-bl-none" : "" 
        )}
      >
        <CardContent className="p-3">
          <div className={cn(
            "text-sm whitespace-pre-wrap",
            isSystem && "font-medium text-lg",
            isError && "text-foreground" 
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
