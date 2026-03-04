import { MOCK_PORTFOLIO } from "@/lib/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";

const PortfolioCard = () => {
  return (
    <div className="glass-card rounded-lg p-6">
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">Portfolio</h2>
      <div className="space-y-4">
        {MOCK_PORTFOLIO.map((asset) => {
          const pnl = (asset.currentPrice - asset.avgCostUsd) / asset.avgCostUsd;
          const isUp = pnl >= 0;
          return (
            <div key={asset.token} className="flex items-center justify-between p-4 rounded-md bg-secondary/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                  {asset.token.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold">{asset.token}</p>
                  <p className="text-xs text-muted-foreground">{asset.amount} units</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold">${asset.currentPrice.toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-xs ${isUp ? "text-success" : "text-destructive"}`}>
                  {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {(pnl * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Value</span>
          <span className="font-mono font-bold text-primary">
            ${MOCK_PORTFOLIO.reduce((s, a) => s + a.amount * a.currentPrice, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
