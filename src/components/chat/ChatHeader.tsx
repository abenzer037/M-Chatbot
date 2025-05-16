
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
            IMPORTANT: Ensure your logo file (e.g., logo.png) is moved 
            from 'src/images/' to 'public/images/'.
            The 'src' prop below assumes the logo is at 'public/images/logo.png'.
            Adjust width and height for desired display size.
          */}
          <Image
            src="/images/logo.png" 
            alt="M-pesa Incident Analyzer Logo"
            width={40} // Adjusted for a typical header logo size
            height={40} // Adjusted for a typical header logo size (assuming square logo)
            className="h-auto max-h-[40px]" // Ensure height consistency and maintain aspect ratio via h-auto
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
