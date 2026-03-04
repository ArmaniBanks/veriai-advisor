import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLE_QUERY = "I hold 10 ETH. Based on the current volatility from the on-chain model, should I increase my position? What is the risk level?";

const QueryDemo = ({ onRun }: { onRun: () => void }) => {
  const [query, setQuery] = useState(EXAMPLE_QUERY);

  return (
    <div className="glass-card rounded-lg p-6">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">Agent Query</h2>
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          className="w-full bg-secondary/50 border border-border rounded-md p-4 pr-14 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          placeholder="Ask about your portfolio risk..."
        />
        <Button
          size="icon"
          onClick={onRun}
          className="absolute bottom-3 right-3 rounded-full bg-primary hover:bg-primary/80"
        >
          <Send className="h-4 w-4 text-primary-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default QueryDemo;
