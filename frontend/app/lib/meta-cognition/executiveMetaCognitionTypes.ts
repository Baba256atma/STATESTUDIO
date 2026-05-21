import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { TypeCExecutiveSummary } from "../typec/typeCExecutiveSummary";

export type ExecutiveReasoningPathStep =
  | "enterprise_signals"
  | "operational_synchronization"
  | "topology_cognition"
  | "fragility_intelligence"
  | "strategic_interpretation"
  | "advisory_reasoning"
  | "governance_intelligence"
  | "meta_cognition_reflection"
  | "transparent_executive_reasoning"
  | "executive_strategic_self_awareness";

export type ExecutiveMetaCognitionAssumption = {
  id: string;
  label: string;
  source: "scene" | "recommendation" | "governance" | "confidence" | "assistant";
  stability: "stable" | "forming" | "weak";
};

export type ExecutiveMetaCognitionUncertainty = {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
};

export type ExecutiveConfidenceEvolution = {
  previous: number | null;
  current: number;
  direction: "increased" | "decreased" | "steady" | "unknown";
  explanation: string;
};

export type ExecutiveMetaCognitionSnapshot = {
  organizationId: string;
  signature: string;
  reasoningPath: ExecutiveReasoningPathStep[];
  supportingSignals: string[];
  assumptions: ExecutiveMetaCognitionAssumption[];
  uncertainty: ExecutiveMetaCognitionUncertainty[];
  confidenceEvolution: ExecutiveConfidenceEvolution;
  governanceContext: string;
  advisoryLimits: string[];
  strategicReflection: string;
  assistantReflectionLine: string;
  rightRailReflectionLine: string;
  timelineReflectionLine: string;
  timestamp: number;
};

export type BuildExecutiveMetaCognitionSnapshotInput = {
  organizationId?: string | null;
  sceneJson?: unknown;
  responseData?: unknown;
  strategicAdvice?: unknown;
  canonicalRecommendation?: CanonicalRecommendation | null;
  executiveSummary?: TypeCExecutiveSummary | null;
  pipelineStatus?: {
    status?: string | null;
    fragilityLevel?: string | null;
    signalsCount?: number | null;
    mappedObjectsCount?: number | null;
    summary?: string | null;
    insightLine?: string | null;
  } | null;
  previousConfidence?: number | null;
  timestamp?: number;
};

