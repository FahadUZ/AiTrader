import { MarketSelector } from "./MarketSelector";
import { TimeframeSelector } from "./TimeframeSelector";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="flex items-center justify-between gap-4 p-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">AI Trading Terminal</h1>
          <Badge variant="secondary" className="hidden md:inline-flex">
            <span className="h-2 w-2 rounded-full bg-trading-buy mr-2 animate-pulse"></span>
            Live
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <MarketSelector />
          <TimeframeSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
