import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import PortfolioCard from "@/components/PortfolioCard";
import AgentPipeline from "@/components/AgentPipeline";
import VolatilityResult from "@/components/VolatilityResult";
import QueryDemo, { TxHashDisplay, type AnalyzeResult } from "@/components/QueryDemo";
import { ShieldCheck } from "lucide-react";

const Index = () => {
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <main className="container max-w-5xl mx-auto px-6 pb-20 space-y-8">
        <QueryDemo onResult={setResult} />

        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Agent answer */}
            <div className="glass-card rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Agent Response
              </h2>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-sans">
                {result.answer}
              </pre>
              <div className="border border-border/50 rounded-md p-3">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Blockchain Verification</p>
                <TxHashDisplay txHash={result.tx_hash} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PortfolioCard />
                <AgentPipeline />
              </div>
              <div className="lg:col-span-3">
                <VolatilityResult />
              </div>
            </div>
          </div>
        )}

        {!result && (
          <p className="text-center text-sm text-muted-foreground pt-8">
            Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary text-xs font-mono">Send</kbd> to run the verifiable AI agent
          </p>
        )}
      </main>
    </div>
  );
};

export default Index;
