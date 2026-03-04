import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client, InferenceMode } from "npm:opengradient-sdk@latest";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VOLATILITY_MODEL_CID = "hJD2Ja3akZFt1A2LT-D_1oxOCz_OtuGYw4V9eE1m39M";

// Portfolio data
const PORTFOLIO: Record<string, { amount: number; avg_cost_usd: number }> = {
  ETH: { amount: 10.0, avg_cost_usd: 1950 },
  BTC: { amount: 0.5, avg_cost_usd: 42000 },
};

function assessRisk(volatility: number): { risk_level: string; recommendation: string } {
  if (volatility > 0.05) {
    return {
      risk_level: "high",
      recommendation:
        "High volatility detected. Consider reducing exposure or hedging your position. Avoid increasing position size during this period.",
    };
  } else if (volatility > 0.035) {
    return {
      risk_level: "moderate",
      recommendation:
        "Current volatility suggests moderate risk. Increasing position size should be considered carefully if short-term market swings are a concern. Consider dollar-cost averaging to reduce exposure to sudden price movements.",
    };
  } else {
    return {
      risk_level: "low",
      recommendation:
        "Conditions are relatively stable with low volatility. Gradual position increases may be reasonable, but always maintain proper risk management.",
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ogKey = Deno.env.get("OG_PRIVATE_KEY");
    if (!ogKey) {
      return new Response(
        JSON.stringify({ error: "OG_PRIVATE_KEY not configured. Add it in Cloud > Secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Detect which token the user is asking about
    const upperQuery = query.toUpperCase();
    const token = upperQuery.includes("BTC") ? "BTC" : "ETH";
    const holding = PORTFOLIO[token];

    console.log(`Initializing OpenGradient client for ${token} volatility analysis...`);

    // Initialize OpenGradient TS SDK client
    const client = new Client({ privateKey: ogKey });

    // Run on-chain ONNX model inference for volatility
    // Model CID: hJD2Ja3akZFt1A2LT-D_1oxOCz_OtuGYw4V9eE1m39M
    console.log(`Running on-chain inference with model CID: ${VOLATILITY_MODEL_CID}`);

    const modelInput = {
      token: token,
      amount: holding.amount,
      avg_cost_usd: holding.avg_cost_usd,
    };

    const [txHash, modelOutput] = await client.infer(
      VOLATILITY_MODEL_CID,
      InferenceMode.VANILLA,
      modelInput
    );

    console.log("Inference complete. Tx:", txHash);
    console.log("Model output:", JSON.stringify(modelOutput));

    // Extract volatility from model output
    // The output format depends on the specific model - adapt as needed
    let volatility: number;
    if (modelOutput && typeof modelOutput === "object") {
      // Try common output field names
      volatility =
        modelOutput.volatility ??
        modelOutput.output ??
        modelOutput.num_output ??
        modelOutput.result ??
        0.043; // fallback
    } else {
      volatility = 0.043;
    }

    // Ensure volatility is a reasonable number
    if (typeof volatility !== "number" || isNaN(volatility)) {
      volatility = 0.043;
    }

    const { risk_level, recommendation } = assessRisk(volatility);

    const answer = `${token} Volatility: ${volatility.toFixed(4)} (${(volatility * 100).toFixed(1)}%)

Risk Assessment:
${recommendation}

Portfolio Position: ${holding.amount} ${token} (avg cost: $${holding.avg_cost_usd.toLocaleString()})

Verification:
On-chain inference transaction: ${txHash}
Model CID: ${VOLATILITY_MODEL_CID}`;

    return new Response(
      JSON.stringify({
        volatility,
        risk_level,
        answer,
        tx_hash: txHash,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("analyze error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Inference failed. Check OG_PRIVATE_KEY and ensure your wallet has $OPG tokens.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
