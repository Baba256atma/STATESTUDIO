import type { CognitiveStyle } from "./cognitiveStyleTypes";

type BuildCognitiveNarrativeInput = {
  style: CognitiveStyle;
  action: string;
  why: string;
  confidence: string;
  tradeoff: string;
  impact: string;
  risk: string;
};

export function buildCognitiveNarrative(input: BuildCognitiveNarrativeInput): string {
  if (input.style === "analyst") {
    return `This recommendation is supported by ${input.confidence.toLowerCase()}, but remains shaped by ${input.risk.toLowerCase()} and the trade-off that ${input.tradeoff.toLowerCase()}.`;
  }
  if (input.style === "operator") {
    return `The main issue is operational pressure across dependent nodes. ${input.action} is the clearest path because ${input.why.toLowerCase()}, while keeping the immediate bottlenecks visible.`;
  }
  if (input.style === "investor") {
    return `This move changes the risk and resilience posture more than it changes the headline metric. ${input.impact} while ${input.tradeoff.toLowerCase()}.`;
  }
  return `${input.action} is the clearest move because ${input.why.toLowerCase()}. ${input.impact}`;
}
