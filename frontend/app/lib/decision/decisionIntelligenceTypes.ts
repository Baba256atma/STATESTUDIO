/**
 * Canonical contract for Nexora decision intelligence (insight + actions + confidence).
 * Rule-based only — no LLM in this layer.
 */

export type DecisionInsightSeverity = "stable" | "warning" | "critical";

export type DecisionInsightConfidenceLevel = "low" | "medium" | "high";

export type DecisionActionIntent =
  | "simulate"
  | "compare"
  | "inspect"
  | "focus_object"
  | "timeline"
  | "mitigate"
  | "reassess";

export type DecisionAction = {
  id: string;
  label: string;
  intent: DecisionActionIntent;
  /** Hint for UI routing (panels the shell knows how to open). */
  targetPanel?: string;
  targetObjectId?: string;
  reason?: string;
};

export type DecisionInsightOutput = {
  title: string;
  summary: string;
  severity: DecisionInsightSeverity;
  confidence: {
    score: number;
    level: DecisionInsightConfidenceLevel;
  };
  impact?: string;
  timeHorizon?: string;
  keyDrivers?: string[];
  actions: DecisionAction[];
};

export type DecisionIntelligenceSignal = {
  id: string;
  type?: string;
  label?: string;
  strength?: number;
  severity?: string;
  objectIds?: string[];
};

export type DecisionIntelligenceInput = {
  domainId?: string;
  activePanel?: string;
  selectedObjectId?: string | null;
  selectedObjectName?: string | null;
  sceneObjects?: Array<{
    id: string;
    name?: string;
    role?: string;
    severity?: string;
    highlighted?: boolean;
    dimmed?: boolean;
  }>;
  latestSignals?: DecisionIntelligenceSignal[];
  scannerSummary?: {
    fragilityScore?: number;
    fragilityLevel?: string;
    drivers?: string[];
    summary?: string;
  } | null;
  panelContext?: Record<string, unknown> | null;
  mode?: "demo" | "live";
};
