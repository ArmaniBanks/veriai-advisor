import { MOCK_INFERENCE } from "@/lib/mockData";
import { Activity, ExternalLink, ShieldCheck } from "lucide-react";

const riskColors = {
  low: "text-success",
  moderate: "text-warning",
  high: "text-destructive",
};

const riskBg = {
  low: "bg-success/10 border-success/30",
  moderate: "bg-warning/10 border-warning/30",
  high: "bg-destructive/10 border-destructive/30",
};

const VolatilityResult = () => {
  const inf = MOCK_INFERENCE;
  const pct = (inf.volatility * 100).toFixed(1);

  return (
    <div className="glass-card rounded-lg p-6 space-y-6">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">On-Chain Inference Result</h2>

      {/* Volatility gauge */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" className="stroke-secondary" />
            <circle
              cx="50" cy="50" r="42" fill="none" strokeWidth="6"
              className="stroke-primary"
              strokeDasharray={`${inf.volatility * 264 * 10} 264`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold font-mono text-primary">{pct}%</span>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold">{inf.token} Volatility</p>
          <div className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${riskBg[inf.riskLevel]} ${riskColors[inf.riskLevel]}`}>
            <Activity className="h-3 w-3" />
            {inf.riskLevel} risk
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-secondary/40 rounded-md p-4">
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Risk Assessment
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">{inf.recommendation}</p>
      </div>

      {/* Verification */}
      <div className="border border-border/50 rounded-md p-4 space-y-2">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Blockchain Verification</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Tx:</span>
          <code className="text-xs font-mono text-accent truncate flex-1">{inf.txHash}</code>
          <ExternalLink className="h-3.5 w-3.5 text-accent flex-shrink-0 cursor-pointer hover:text-primary transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Model CID:</span>
          <code className="text-xs font-mono text-secondary-foreground truncate">{inf.modelCid}</code>
        </div>
      </div>
    </div>
  );
};

export default VolatilityResult;
