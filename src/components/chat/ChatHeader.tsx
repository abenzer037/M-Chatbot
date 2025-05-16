
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3 } from "lucide-react";
import Image from "next/image"; // Import the Image component

interface ChatHeaderProps {
  onNewRcaSubmission: () => void;
  onAnalyticsClick: () => void;
}

export function ChatHeader({ onNewRcaSubmission, onAnalyticsClick }: ChatHeaderProps) {
  return (
    <header className="bg-card border-b border-border p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 
            Logo image should be in the 'public/images/' directory.
            For example: public/images/logo.png
          */}
          <Image
            src="/images/logo.png" // Path relative to the 'public' directory
            alt="M-pesa Incident Analyzer Logo"
            width={70} // Increased width
            height={60} // Increased height
            priority 
          />
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
