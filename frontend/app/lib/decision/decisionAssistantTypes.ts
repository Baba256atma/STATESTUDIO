/**
 * Deterministic Decision Assistant — canonical contracts (no routing, no LLM).
 * Kept separate from decisionTypes.ts (snapshots/diff) to avoid conflating concerns.
 */

export type DecisionUrgency = "low" | "medium" | "high" | "critical";
export type DecisionPosture = "stabilize" | "protect" | "optimize" | "accelerate";
export type DecisionHorizon = "immediate" | "short" | "mid";
export type ScenarioDomain = "business" | "politics" | "strategy" | "generic";

export type ScenarioSeed = {
  id: string;
  name: string;
  intent: string;
  delta: Record<string, number>;
  tags?: string[];
  applicableWhen?: string[];
};

export type DecisionContext = {
  domainId: string;
  systemSummary?: string;
  riskLevel: DecisionUrgency;
  fragileObjectIds: string[];
  highlightedDriverIds: string[];
  selectedObjectId?: string;
  userIntent?: string;
  activePanel?: string;
  timeHorizon?: DecisionHorizon;
  metrics?: Record<string, number>;
};

export type EvaluatedScenario = {
  id: string;
  title: string;
  intent: string;
  delta: Record<string, number>;
  projectedEffects: {
    risk?: number;
    stability?: number;
    throughput?: number;
    cost?: number;
    confidence: number;
  };
  tradeoffs: string[];
  rationale: string[];
  affectedObjectIds: string[];
  score: number;
};

export type DecisionRecommendation = {
  posture: DecisionPosture;
  recommendedScenarioId: string;
  primaryAction: string;
  reasonSummary: string;
  watchouts: string[];
  alternatives: Array<{
    scenarioId: string;
    whyNotTopChoice: string;
  }>;
  confidence: number;
};

export type DecisionExecutiveBrief = {
  headline: string;
  summary: string;
  urgency: DecisionUrgency;
};

export type DecisionSceneAction = {
  highlightObjectIds: string[];
  dimObjectIds: string[];
  focusObjectId?: string;
  overlayTone?: "stable" | "warning" | "critical";
};

export type DecisionAssistantOutput = {
  context: DecisionContext;
  scenarioSeeds: ScenarioSeed[];
  scenarios: EvaluatedScenario[];
  recommendation: DecisionRecommendation;
  executiveBrief: DecisionExecutiveBrief;
  sceneAction: DecisionSceneAction;
  panelData: {
    advice: Record<string, unknown>;
    compare: Record<string, unknown>;
    timeline: Record<string, unknown>;
    warRoom: Record<string, unknown>;
  };
};
