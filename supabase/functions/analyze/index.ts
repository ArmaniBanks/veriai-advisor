import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
      console.warn("OG_PRIVATE_KEY not set – returning simulated response");
    }

    // TODO: Replace this mock with real OpenGradient SDK calls when running
    // a Python backend. The edge function can proxy to your Python service,
    // or you can implement the logic here once a TS SDK is available.
    //
    // Real flow would be:
    // 1. client.llm.ensure_opg_approval(opg_amount=5)
    // 2. Run ReAct agent with portfolio + volatility tools
    // 3. Volatility tool calls ONNX model CID: hJD2Ja3akZFt1A2LT-D_1oxOCz_OtuGYw4V9eE1m39M
    // 4. Return { answer, tx_hash }

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1500));

    const mockVolatility = (Math.random() * 0.06 + 0.02).toFixed(3);
    const riskLevel =
      Number(mockVolatility) > 0.05
        ? "high"
        : Number(mockVolatility) > 0.035
        ? "moderate"
        : "low";

    const answer = `ETH Volatility: ${mockVolatility} (${(Number(mockVolatility) * 100).toFixed(1)}%)\n\nRisk Assessment:\nCurrent volatility suggests ${riskLevel} risk. ${
      riskLevel === "high"
        ? "Consider reducing exposure or hedging your position."
        : riskLevel === "moderate"
        ? "Increasing position size should be considered carefully if short-term market swings are a concern. Consider dollar-cost averaging."
        : "Conditions are relatively stable. Gradual position increases may be reasonable."
    }\n\nModel CID: hJD2Ja3akZFt1A2LT-D_1oxOCz_OtuGYw4V9eE1m39M\nOG_PRIVATE_KEY configured: ${ogKey ? "Yes" : "No (simulated response)"}`;

    const tx_hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    return new Response(JSON.stringify({ answer, tx_hash }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
