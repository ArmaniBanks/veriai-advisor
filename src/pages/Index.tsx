import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import PortfolioCard from "@/components/PortfolioCard";
import AgentPipeline from "@/components/AgentPipeline";
import QueryDemo, { CopyableHash, type AnalyzeResult } from "@/components/QueryDemo";
import { ShieldCheck, Activity } from "lucide-react";

const riskColors: Record<string, string> = {
  low: "text-success",
  moderate: "text-warning",
  high: "text-destructive",
};

const riskBg: Record<string, string> = {
  low: "bg-success/10 border-success/30",
  moderate: "bg-warning/10 border-warning/30",
  high: "bg-destructive/10 border-destructive/30",
};

const Index = () => {
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <main className="container max-w-5xl mx-auto px-6 pb-20 space-y-8">
        <QueryDemo onResult={setResult} />

        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Volatility + Risk Badge */}
            <div className="glass-card rounded-lg p-6 space-y-6">
              <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                On-Chain Inference Result
              </h2>

              <div className="flex items-center gap-6">
                {/* Volatility gauge */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-secondary" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" strokeWidth="6"
                      className="stroke-primary"
                      strokeDasharray={`${Math.min(result.volatility * 10, 1) * 264} 264`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold font-mono text-primary">
                      {(result.volatility * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold">Volatility Score</p>
                  <div
                    className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${
                      riskBg[result.risk_level] || riskBg.moderate
                    } ${riskColors[result.risk_level] || riskColors.moderate}`}
                  >
                    <Activity className="h-3 w-3" />
                    {result.risk_level} risk
                  </div>
                </div>
              </div>

              {/* Full answer */}
              <div className="bg-secondary/40 rounded-md p-4">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-sans">
                  {result.answer}
                </pre>
              </div>

              {/* Blockchain verification with copy */}
              <div className="border border-border/50 rounded-md p-4 space-y-2">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Blockchain Verification
                </p>
                <CopyableHash label="Tx" value={result.tx_hash} />
                <CopyableHash
                  label="Model CID"
                  value="hJD2Ja3akZFt1A2LT-D_1oxOCz_OtuGYw4V9eE1m39M"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PortfolioCard />
                <AgentPipeline />
              </div>
            </div>
          </div>
        )}

        {!result && (
          <p className="text-center text-sm text-muted-foreground pt-8">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary text-xs font-mono">
              Send
            </kbd>{" "}
            to run the verifiable AI agent
          </p>
        )}
      </main>
    </div>
  );
};

export default Index;
