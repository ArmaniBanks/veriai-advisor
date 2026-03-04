export interface PortfolioAsset {
  token: string;
  amount: number;
  avgCostUsd: number;
  currentPrice: number;
  volatility: number | null;
  riskLevel: "low" | "moderate" | "high" | null;
}

export interface InferenceResult {
  token: string;
  volatility: number;
  riskLevel: "low" | "moderate" | "high";
  recommendation: string;
  txHash: string;
  timestamp: string;
  modelCid: string;
}

export const MOCK_PORTFOLIO: PortfolioAsset[] = [
  { token: "ETH", amount: 10.0, avgCostUsd: 1950, currentPrice: 2340, volatility: null, riskLevel: null },
  { token: "BTC", amount: 0.5, avgCostUsd: 42000, currentPrice: 67500, volatility: null, riskLevel: null },
];

export const MOCK_INFERENCE: InferenceResult = {
  token: "ETH",
  volatility: 0.043,
  riskLevel: "moderate",
  recommendation:
    "Current volatility suggests moderate risk. Increasing position size should be considered carefully if short-term market swings are a concern. Consider dollar-cost averaging to reduce exposure to sudden price movements.",
  txHash: "0x8ab1f3e7c9d2b4a6f8e1c3d5a7b9e2f4c6d8a1b3e5f7c9d2b4a6f8e1c3d5a7",
  timestamp: new Date().toISOString(),
  modelCid: "hJD2Ja3akZFt1A2LT-D_1oxOCz_OtuGYw4V9eE1m39M",
};

export const AGENT_STEPS = [
  { step: 1, label: "Checking portfolio", icon: "portfolio" as const, status: "done" as const },
  { step: 2, label: "Running on-chain volatility model", icon: "chain" as const, status: "done" as const },
  { step: 3, label: "Reasoning about risk (TEE)", icon: "brain" as const, status: "done" as const },
  { step: 4, label: "Generating recommendation", icon: "output" as const, status: "done" as const },
];
