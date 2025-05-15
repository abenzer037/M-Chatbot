import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3 } from "lucide-react";

interface ChatHeaderProps {
  onNewRcaSubmission: () => void;
  onAnalyticsClick: () => void; // New prop for analytics button
}

export function ChatHeader({ onNewRcaSubmission, onAnalyticsClick }: ChatHeaderProps) {
  return (
    <header className="bg-card border-b border-border p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Placeholder SVG Logo */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
            data-ai-hint="logo mpesa"
          >
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" />
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="40" fill="currentColor" fontWeight="bold">
              M
            </text>
          </svg>
          <h1 className="text-xl font-semibold text-primary">M-pesa Incident Analyzer</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" onClick={onAnalyticsClick}>
            <BarChart3 className="mr-2 h-5 w-5 text-primary-foreground" />
            Analytics
          </Button>
          <Button variant="default" onClick={onNewRcaSubmission}>
            <PlusCircle className="mr-2 h-5 w-5 text-primary-foreground" />
            New RCA
          </Button>
        </div>
      </div>
    </header>
  );
}
