import { useState, useEffect, useCallback, useRef } from "react";
import { Send, Loader2, Copy, Check, AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const EXAMPLE_QUERY = "I hold 10 ETH. Based on the current volatility from the on-chain model, should I increase my position? What is the risk level?";

export interface AnalyzeResult {
  volatility: number;
  risk_level: string;
  answer: string;
  tx_hash: string | null;
}

type WarmupStatus = "idle" | "waking" | "ready" | "degraded";

const QueryDemo = ({ onResult }: { onResult: (result: AnalyzeResult) => void }) => {
  const [query, setQuery] = useState(EXAMPLE_QUERY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warmup, setWarmup] = useState<WarmupStatus>("idle");
  const didWarmupRef = useRef(false);

  const runWarmup = useCallback(async () => {
    setWarmup("waking");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze", {
        body: { mode: "warmup" },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.status === "ready") setWarmup("ready");
      else setWarmup("degraded");
    } catch (err) {
      console.warn("Warmup failed:", err);
      setWarmup("degraded");
    }
  }, []);

  useEffect(() => {
    if (didWarmupRef.current) return;
    didWarmupRef.current = true;
    runWarmup();
  }, [runWarmup]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const { data, error: fnError } = await supabase.functions.invoke("analyze", {
        body: { query },
      });
      clearTimeout(timeoutId);

      if (fnError) throw new Error(fnError.message || "Edge function error");
      if (data?.error) throw new Error(data.error);
      if (!data?.answer) throw new Error("Invalid response from agent");

      onResult({
        volatility: data.volatility,
        risk_level: data.risk_level,
        answer: data.answer,
        tx_hash: data.tx_hash,
      });
    } catch (err: any) {
      console.error("Analyze failed:", err);
      const msg = err?.name === "AbortError"
        ? "Request timed out. The backend may be cold-starting — please retry."
        : err.message || "An unexpected error occurred";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Agent Query</h2>
        <BackendStatus status={warmup} onRetry={runWarmup} />
      </div>
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

      {warmup === "waking" && !loading && (
        <p className="text-xs text-muted-foreground">
          Backend is still waking up — your first request may take a moment.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Running on-chain inference via OpenGradient…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const BackendStatus = ({ status, onRetry }: { status: WarmupStatus; onRetry: () => void }) => {
  if (status === "waking") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Waking backend…
      </span>
    );
  }
  if (status === "ready") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-success">
        <Wifi className="h-3 w-3" />
        Backend ready
      </span>
    );
  }
  if (status === "degraded") {
    return (
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 text-xs text-warning hover:text-warning/80 transition-colors"
        title="Retry backend warmup"
      >
        <WifiOff className="h-3 w-3" />
        Backend degraded
        <RefreshCw className="h-3 w-3 ml-0.5" />
      </button>
    );
  }
  return null;
};

export default QueryDemo;

export const CopyableHash = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground flex-shrink-0">{label}:</span>
      <code className="text-xs font-mono text-accent truncate flex-1">{value}</code>
      <button
        onClick={copy}
        className="flex-shrink-0 p-1 rounded hover:bg-secondary transition-colors"
        title={`Copy ${label}`}
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
