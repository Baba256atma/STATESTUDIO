/** D9:7:3 — Executive strategic perspective weighting + enterprise adaptive consensus prioritization types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { PerspectiveCategory, StrategicConsensusSnapshot } from "./consensusIntelligenceTypes";
import type { EnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationTypes";

export type WeightingCategory =
  | "resilience_priority"
  | "governance_priority"
  | "operational_speed_priority"
  | "recovery_priority"
  | "stability_priority"
  | "foresight_priority"
  | "trust_priority"
  | "explainability_priority"
  | "unknown";

export type WeightingStrength = "weak" | "moderate" | "elevated" | "dominant" | "executive_grade";

export type PriorityState = "balanced" | "shifting" | "adaptive" | "concentrated" | "stabilized";

/** Perspectives that may gain influence in the weighting layer (includes meta-cognition emphasis). */
export type WeightedPerspectiveInfluence =
  | PerspectiveCategory
  | "trust"
  | "explainability";

export type StrategicPerspectiveWeight = {
  weightingId: string;
  priorityState: PriorityState;
  weightingStrength: WeightingStrength;
  weightingCategory: WeightingCategory;
  summary: string;
  dominantPerspectives: readonly WeightedPerspectiveInfluence[];
  reducedPerspectives: readonly WeightedPerspectiveInfluence[];
  weightingSignals: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type AdaptiveInfluenceSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly WeightingCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type ExecutiveWeightingField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  influencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly WeightingCategory[];
  generatedAt: number;
};

export type PerspectivePriorityShift = {
  shiftId: string;
  shiftLabel: string;
  shiftSummary: string;
  fromPriorityState: PriorityState;
  toPriorityState: PriorityState;
  elevatedPerspectives: readonly WeightedPerspectiveInfluence[];
  deprioritizedPerspectives: readonly WeightedPerspectiveInfluence[];
  generatedAt: number;
};

export type ConsensusPrioritizationSummary = {
  dominantPriorityState: PriorityState;
  dominantWeightingStrength: WeightingStrength;
  prioritizationHeadline: string;
  balancePosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EnterpriseConsensusPrioritySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: ConsensusPrioritizationSummary;
  recentWeightings: readonly StrategicPerspectiveWeight[];
  priorityShifts: readonly PerspectivePriorityShift[];
  influenceSignals: readonly AdaptiveInfluenceSignal[];
  weightingFields: readonly ExecutiveWeightingField[];
};

export type StrategicPerspectiveWeightingInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  strategicConsensusSnapshot?: StrategicConsensusSnapshot | null;
  conflictResolutionSnapshot?: EnterpriseConflictResolutionSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type StrategicPerspectiveWeightingResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseConsensusPrioritySnapshot | null;
  newWeightings: number;
  storeSignature: string;
};

export type PerspectiveWeightingStoreState = {
  weightings: readonly StrategicPerspectiveWeight[];
  snapshots: readonly EnterpriseConsensusPrioritySnapshot[];
  priorityShifts: readonly PerspectivePriorityShift[];
  influenceSignals: readonly AdaptiveInfluenceSignal[];
  weightingFields: readonly ExecutiveWeightingField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastPriorityState: PriorityState | null;
};
