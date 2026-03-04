import { useState } from "react";
import { Send, Loader2, Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const EXAMPLE_QUERY = "I hold 10 ETH. Based on the current volatility from the on-chain model, should I increase my position? What is the risk level?";

export interface AnalyzeResult {
  answer: string;
  tx_hash: string;
}

const QueryDemo = ({ onResult }: { onResult: (result: AnalyzeResult) => void }) => {
  const [query, setQuery] = useState(EXAMPLE_QUERY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze", {
        body: { query },
      });

      if (fnError) throw new Error(fnError.message || "Edge function error");
      if (data?.error) throw new Error(data.error);
      if (!data?.answer || !data?.tx_hash) throw new Error("Invalid response from agent");

      onResult({ answer: data.answer, tx_hash: data.tx_hash });
    } catch (err: any) {
      console.error("Analyze failed:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 space-y-4">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Agent Query</h2>
      <div className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          disabled={loading}
          className="w-full bg-secondary/50 border border-border rounded-md p-4 pr-14 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground disabled:opacity-50"
          placeholder="Ask about your portfolio risk..."
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={loading || !query.trim()}
          className="absolute bottom-3 right-3 rounded-full bg-primary hover:bg-primary/80 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
          ) : (
            <Send className="h-4 w-4 text-primary-foreground" />
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default QueryDemo;

export const TxHashDisplay = ({ txHash }: { txHash: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Tx:</span>
      <code className="text-xs font-mono text-accent truncate flex-1">{txHash}</code>
      <button
        onClick={copy}
        className="flex-shrink-0 p-1 rounded hover:bg-secondary transition-colors"
        title="Copy transaction hash"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-success" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
        )}
      </button>
    </div>
  );
};
