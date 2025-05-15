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
          isSystem ? "bg-accent text-accent-foreground" :
          isError ? "bg-destructive text-destructive-foreground" :
          "bg-secondary text-secondary-foreground"
        )}>
          <Icon size={18} />
        </div>
      )}
      <Card
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-0 shadow-md",
          isUser ? "bg-accent text-accent-foreground rounded-br-none" : "",
          isBot ? "bg-card text-card-foreground rounded-bl-none" : "",
          isSystem ? "bg-secondary text-secondary-foreground border-primary rounded-bl-none w-full max-w-xl" : "",
          isError ? "bg-destructive/10 text-destructive-foreground border-destructive rounded-bl-none" : ""
        )}
      >
        <CardContent className="p-3">
          <div className={cn("text-sm whitespace-pre-wrap", isSystem && "font-medium text-lg")}>
            {message.text}
          </div>
          <div
            className={cn(
              "text-xs mt-1",
              isUser ? "text-right text-accent-foreground/70" : "text-left text-muted-foreground",
              isSystem ? "text-right text-secondary-foreground/70" : ""
            )}
          >
            {timeString}
          </div>
        </CardContent>
      </Card>
      {isUser && (
         <div className="flex-shrink-0 bg-accent text-accent-foreground p-2 rounded-full">
          <Icon size={18} />
        </div>
      )}
    </div>
  );
}
