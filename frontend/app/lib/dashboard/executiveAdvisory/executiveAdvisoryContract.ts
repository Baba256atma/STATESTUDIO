/**
 * Phase 5:1 — Executive Advisory Foundation contract.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle, ImpactDirection } from "../dashboardVisualSignalContract.ts";
import type { AdvisoryContext } from "./aggregation/advisoryContextContract.ts";
import type { AdvisoryConfidenceEvaluation } from "./confidence/advisoryConfidenceContract.ts";
import type { AdvisoryExplanationBundle } from "./explainability/advisoryExplainabilityContract.ts";

export const EXECUTIVE_ADVISORY_SURFACE_VERSION = "5.4.0";

export const CANONICAL_EXECUTIVE_ADVISORY_OWNER = "executiveAdvisoryRuntime";

export const CANONICAL_EXECUTIVE_ADVISORY_SURFACE_ID = "decision" as const;

export type AdvisoryFocusLevel = "monitor" | "review" | "investigate" | "decision_recommended";

export type AdvisoryUrgency = "low" | "moderate" | "high" | "urgent";

export type PrioritySignalDomain = "operational" | "risk" | "timeline" | "scenario";

export type AdvisoryConfidenceLevel = "low" | "moderate" | "high" | "very_high";

export type GuidanceCandidateKind =
  | "investigate_further"
  | "compare_alternatives"
  | "escalate_review"
  | "maintain_monitoring";

export type AdvisoryContextSource =
  | "operational"
  | "risk"
  | "timeline"
  | "scenario"
  | "war_room"
  | "dashboard";

export type AdvisoryFocusCard = Readonly<{
  focus: AdvisoryFocusLevel;
  label: string;
  urgency: AdvisoryUrgency;
  attentionLevel: string;
  summary: string;
}>;

export type PrioritySignalEntry = Readonly<{
  domain: PrioritySignalDomain;
  label: string;
  summary: string;
  rank: number;
  trend: ImpactDirection;
}>;

export type PrioritySignalsCard = Readonly<{
  signals: readonly PrioritySignalEntry[];
  topPriority: string;
  summary: string;
}>;

export type AdvisoryNarrativeCard = Readonly<{
  situationSummary: string;
  executiveBriefing: string;
  contextSummary: string;
}>;

export type GuidanceCandidateEntry = Readonly<{
  kind: GuidanceCandidateKind;
  label: string;
  suggestion: string;
  priority: "low" | "moderate" | "high";
}>;

export type GuidanceCandidatesCard = Readonly<{
  candidates: readonly GuidanceCandidateEntry[];
  summary: string;
}>;

export type AdvisoryConfidenceCard = Readonly<{
  level: AdvisoryConfidenceLevel;
  label: string;
  trend: ImpactDirection;
  explanation: string;
}>;

export type ExecutiveAdvisorySnapshot = Readonly<{
  focus: AdvisoryFocusCard;
  prioritySignals: PrioritySignalsCard;
  narrative: AdvisoryNarrativeCard;
  guidanceCandidates: GuidanceCandidatesCard;
  confidence: AdvisoryConfidenceCard;
  warRoomContextBridge: string;
}>;

export type ExecutiveAdvisoryAggregationInput = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
  objectsInScene?: number;
}>;

export type ExecutiveAdvisorySurfaceModel = Readonly<{
  surfaceId: typeof CANONICAL_EXECUTIVE_ADVISORY_SURFACE_ID;
  owner: typeof CANONICAL_EXECUTIVE_ADVISORY_OWNER;
  headline: string;
  snapshot: ExecutiveAdvisorySnapshot;
  visualBundle: DashboardSurfaceVisualBundle;
  contextSources: readonly AdvisoryContextSource[];
  /** Phase 5:2 — normalized advisory context from aggregation layer. */
  advisoryContext: AdvisoryContext;
  /** Phase 5:3 — canonical confidence evaluation from confidence framework. */
  confidenceEvaluation: AdvisoryConfidenceEvaluation;
  /** Phase 5:4 — canonical explanation bundle from explainability layer. */
  explanationBundle: AdvisoryExplanationBundle;
}>;
