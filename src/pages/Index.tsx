import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import PortfolioCard from "@/components/PortfolioCard";
import AgentPipeline from "@/components/AgentPipeline";
import VolatilityResult from "@/components/VolatilityResult";
import QueryDemo from "@/components/QueryDemo";

const Index = () => {
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <main className="container max-w-5xl mx-auto px-6 pb-20 space-y-8">
        <QueryDemo onRun={() => setShowResult(true)} />

        {showResult && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-slide-up">
            <div className="lg:col-span-2 space-y-6">
              <PortfolioCard />
              <AgentPipeline />
            </div>
            <div className="lg:col-span-3">
              <VolatilityResult />
            </div>
          </div>
        )}

        {!showResult && (
          <p className="text-center text-sm text-muted-foreground pt-8">
            Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary text-xs font-mono">Send</kbd> to run the verifiable AI agent
          </p>
        )}
      </main>
    </div>
  );
};

export default Index;
