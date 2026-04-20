import type { PanelSharedData } from "../../panels/panelDataResolverTypes";
import type { RightPanelView } from "./rightPanelTypes";

export type CognitiveFlowStep =
  | "analyze"
  | "risk"
  | "explore"
  | "decide"
  | "act"
  | "review";

export type CognitiveFlowState = {
  currentStep: CognitiveFlowStep;
  suggestedNextStep?: string;
  confidence: number;
  history: Array<{
    view: RightPanelView;
    timestamp: number;
  }>;
};

export type CognitiveFlowInput = {
  currentView: RightPanelView;
  panelData: PanelSharedData | null | undefined;
  context: {
    intent?: string;
    riskLevel?: number;
    hasSimulation?: boolean;
    hasRecommendation?: boolean;
    hasDecision?: boolean;
    hasOutcome?: boolean;
  };
};

export type CognitiveFlowOutput = CognitiveFlowState & {
  showNextStepCTA: boolean;
  nextStepLabel: string;
};

const FLOW_TRANSITIONS: Record<CognitiveFlowStep, CognitiveFlowStep> = {
  analyze: "risk",
  risk: "explore",
  explore: "decide",
  decide: "act",
  act: "review",
  review: "review",
};

const STEP_LABEL_MAP: Record<CognitiveFlowStep, string> = {
  analyze: "Consider starting analysis",
  risk: "Consider reviewing risk analysis",
  explore: "Consider exploring scenarios",
  decide: "Consider reviewing decision options",
  act: "Consider preparing an action plan",
  review: "Consider reviewing outcomes",
};

declare global {
  interface Window {
    __NEXORA_FLOW_HISTORY__?: Array<{
      view: RightPanelView;
      timestamp: number;
    }>;
  }
}

function clampConfidence(value: number) {
  return Math.min(1, Math.max(0.35, value));
}

function normalizeIntent(value: string | undefined): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function detectCurrentStep(input: CognitiveFlowInput): CognitiveFlowState["currentStep"] {
  const intent = normalizeIntent(input.context.intent);

  if (input.context.hasOutcome) return "review";
  if (input.context.hasDecision) return "act";
  if (input.context.hasRecommendation) return "decide";
  if (input.context.hasSimulation) return "explore";
  if ((input.context.riskLevel ?? 0) >= 0.7) return "risk";
  if (intent.includes("analy")) return "analyze";

  if (input.currentView === "risk" || input.currentView === "war_room") return "risk";
  if (input.currentView === "simulate" || input.currentView === "compare" || input.currentView === "timeline") return "explore";
  if (input.currentView === "decision_council" || input.currentView === "advice") return "decide";
  if (input.currentView === "memory" || input.currentView === "org_memory") return "review";

  return "analyze";
}

function estimateConfidence(step: CognitiveFlowStep, input: CognitiveFlowInput) {
  let score = 0.55;

  if (step === "risk" && (input.context.riskLevel ?? 0) >= 0.7) score += 0.25;
  if (step === "explore" && input.context.hasSimulation) score += 0.2;
  if (step === "decide" && input.context.hasRecommendation) score += 0.2;
  if (step === "act" && input.context.hasDecision) score += 0.2;
  if (step === "review" && input.context.hasOutcome) score += 0.2;
  if (normalizeIntent(input.context.intent).length > 0) score += 0.05;

  return clampConfidence(score);
}

function readFlowHistory(): CognitiveFlowState["history"] {
  if (typeof window === "undefined") return [];
  return Array.isArray(window.__NEXORA_FLOW_HISTORY__) ? window.__NEXORA_FLOW_HISTORY__ : [];
}

export function recordPanelCognitiveFlowHistory(view: RightPanelView) {
  if (typeof window === "undefined") return [];
  const nextEntry = { view, timestamp: Date.now() };
  const existing = readFlowHistory();
  const deduped =
    existing.length > 0 &&
    existing[existing.length - 1]?.view === view
      ? existing
      : [...existing, nextEntry].slice(-12);
  window.__NEXORA_FLOW_HISTORY__ = deduped;
  return deduped;
}

export function getPanelCognitiveFlow(input: CognitiveFlowInput): CognitiveFlowOutput {
  const currentStep = detectCurrentStep(input);
  const nextStep = FLOW_TRANSITIONS[currentStep];
  const confidence = estimateConfidence(currentStep, input);
  const history = readFlowHistory();
  const suggestedNextStep = nextStep;
  const nextStepLabel = STEP_LABEL_MAP[nextStep];

  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][CognitiveFlow]", {
      step: currentStep,
      nextStep,
      confidence,
      currentView: input.currentView,
    });
  }

  return {
    currentStep,
    suggestedNextStep,
    confidence,
    history,
    showNextStepCTA: currentStep !== "review",
    nextStepLabel,
  };
}
