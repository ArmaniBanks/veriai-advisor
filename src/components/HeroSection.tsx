import heroBg from "@/assets/hero-bg.jpg";
import { Shield, Cpu } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="relative z-10 container max-w-5xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-mono text-primary tracking-widest uppercase">Verifiable AI</span>
          <Cpu className="h-5 w-5 text-accent" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          <span className="text-gradient">Crypto Risk Advisor</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          On-chain ONNX model inference with TEE-secured LLM reasoning.
          Every risk assessment is verifiable on the OpenGradient blockchain.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {["OpenGradient SDK", "LangGraph ReAct", "ONNX Inference", "x402 Protocol", "Base Sepolia"].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono border border-border bg-secondary/50 text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
