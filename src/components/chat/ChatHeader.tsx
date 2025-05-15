import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ChatHeaderProps {
  onNewRcaSubmission: () => void;
}

export function ChatHeader({ onNewRcaSubmission }: ChatHeaderProps) {
  return (
    <header className="bg-card border-b border-border p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">M-pesa Incident Analyzer</h1>
        <Button variant="default" onClick={onNewRcaSubmission}>
          <PlusCircle className="mr-2 h-5 w-5 text-primary-foreground" />
          New RCA
        </Button>
      </div>
    </header>
  );
}
