export type HarmonizedExecutiveCognitionStage =
  | "awareness"
  | "interpretation"
  | "framing"
  | "comparison"
  | "readiness"
  | "decision"
  | "monitoring"
  | "review";

export type HarmonizedExecutiveCognitionStep = {
  stage: HarmonizedExecutiveCognitionStage;
  order: number;
  executiveQuestion: string;
  primarySignals: string[];
};

export const HARMONIZED_EXECUTIVE_COGNITION_FLOW: HarmonizedExecutiveCognitionStep[] = [
  {
    stage: "awareness",
    order: 1,
    executiveQuestion: "What is happening?",
    primarySignals: ["alert", "monitoring", "propagation"],
  },
  {
    stage: "interpretation",
    order: 2,
    executiveQuestion: "Why does it matter?",
    primarySignals: ["fragility", "cross_domain", "narrative"],
  },
  {
    stage: "framing",
    order: 3,
    executiveQuestion: "What strategic frame should guide review?",
    primarySignals: ["scenario", "memory", "readiness"],
  },
  {
    stage: "comparison",
    order: 4,
    executiveQuestion: "Which alternatives differ materially?",
    primarySignals: ["comparison", "confidence"],
  },
  {
    stage: "readiness",
    order: 5,
    executiveQuestion: "Is there enough evidence and coordination to review?",
    primarySignals: ["readiness", "confidence", "coordination"],
  },
  {
    stage: "decision",
    order: 6,
    executiveQuestion: "What should receive executive focus?",
    primarySignals: ["recommendation", "intervention"],
  },
  {
    stage: "monitoring",
    order: 7,
    executiveQuestion: "What should be watched next?",
    primarySignals: ["monitoring", "drift", "forecast"],
  },
  {
    stage: "review",
    order: 8,
    executiveQuestion: "What changed and what should be learned?",
    primarySignals: ["review", "memory", "resilience", "adaptation"],
  },
];

export function listHarmonizedExecutiveCognitionFlow(): HarmonizedExecutiveCognitionStep[] {
  return HARMONIZED_EXECUTIVE_COGNITION_FLOW.map((step) => ({
    ...step,
    primarySignals: [...step.primarySignals],
  }));
}

export function stageForExecutiveSignal(sourceType: string): HarmonizedExecutiveCognitionStage {
  const normalized = String(sourceType ?? "").trim().toLowerCase();
  return (
    HARMONIZED_EXECUTIVE_COGNITION_FLOW.find((step) => step.primarySignals.includes(normalized))?.stage ??
    "interpretation"
  );
}
