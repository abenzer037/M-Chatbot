import { Bot } from "lucide-react";

export function ChatLoadingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4 justify-start">
       <div className="flex-shrink-0 bg-primary text-primary-foreground p-2 rounded-full">
          <Bot size={18} />
        </div>
      <div className="bg-card text-card-foreground p-3 rounded-lg rounded-bl-none shadow-md">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-muted-foreground">Bot is thinking</span>
          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
