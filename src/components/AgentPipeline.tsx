import { AGENT_STEPS } from "@/lib/mockData";
import { Wallet, Link2, Brain, FileText, Check } from "lucide-react";

const iconMap = {
  portfolio: Wallet,
  chain: Link2,
  brain: Brain,
  output: FileText,
};

const AgentPipeline = () => {
  return (
    <div className="glass-card rounded-lg p-6">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-6">ReAct Agent Pipeline</h2>
      <div className="space-y-1">
        {AGENT_STEPS.map((step, i) => {
          const Icon = iconMap[step.icon];
          return (
            <div key={step.step} className="flex items-center gap-4" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center glow-primary">
                  {step.status === "done" ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Icon className="h-4 w-4 text-primary" />
                  )}
                </div>
                {i < AGENT_STEPS.length - 1 && <div className="w-px h-6 bg-primary/20" />}
              </div>
              <div className="pb-5">
                <p className="text-sm font-medium">{step.label}</p>
                <p className="text-xs text-muted-foreground">Step {step.step}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentPipeline;
