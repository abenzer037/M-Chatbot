
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
          {/* Replace this with your actual logo using next/image */}
          <Image
            src="/images/logo.png" // IMPORTANT: Update this path if your logo is named differently or in another folder within 'public'
            alt="M-pesa Incident Analyzer Logo" // IMPORTANT: Provide a descriptive alt text
            width={100} // IMPORTANT: Set the desired display width of your logo
            height={32} // IMPORTANT: Set the desired display height of your logo
            className="h-auto" // Optional: maintain aspect ratio if width/height props define a different one
            priority // Optional: if your logo is critical for LCP, consider adding priority
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
