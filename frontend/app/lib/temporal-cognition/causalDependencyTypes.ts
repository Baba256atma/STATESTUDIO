/** D9:3:2 — Operational causal chain awareness + strategic temporal dependency intelligence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseTemporalSnapshot } from "./temporalCognitionTypes";

export type DependencyCategory =
  | "fragility"
  | "escalation"
  | "governance"
  | "resilience"
  | "recovery"
  | "operational"
  | "coordination"
  | "strategic"
  | "unknown";

export type DependencyStrength = "weak" | "moderate" | "strong" | "systemic";

export type PropagationType = "localized" | "distributed" | "cascading" | "cyclical";

export type CausalConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type OperationalCausalChain = {
  causalChainId: string;
  category: DependencyCategory;
  dependencyStrength: DependencyStrength;
  propagationType: PropagationType;
  summary: string;
  chain: readonly string[];
  upstreamNodeIds: readonly string[];
  downstreamNodeIds: readonly string[];
  confidence: number;
  confidenceLevel: CausalConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type TemporalDependencyLink = {
  linkId: string;
  fromCategory: DependencyCategory;
  toCategory: DependencyCategory;
  fromLabel: string;
  toLabel: string;
  dependencyStrength: DependencyStrength;
  propagationType: PropagationType;
  summary: string;
  generatedAt: number;
};

export type StrategicCauseEffectSequence = {
  sequenceId: string;
  category: DependencyCategory;
  causeLabel: string;
  effectLabel: string;
  dependencyStrength: DependencyStrength;
  progressionSummary: string;
  linkedChainIds: readonly string[];
  generatedAt: number;
};

export type DependencyPropagationSignal = {
  signalId: string;
  category: DependencyCategory;
  propagationType: PropagationType;
  dependencyStrength: DependencyStrength;
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type OrganizationalImpactChain = {
  impactChainId: string;
  category: DependencyCategory;
  impactSummary: string;
  consequenceLabels: readonly string[];
  linkedChainIds: readonly string[];
  generatedAt: number;
};

export type CausalDependencySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  chainCount: number;
  linkCount: number;
  causalSummary: string;
  dominantCategories: readonly DependencyCategory[];
  dominantPropagationType: PropagationType;
  dominantDependencyStrength: DependencyStrength;
  recentChains: readonly OperationalCausalChain[];
  dependencyLinks: readonly TemporalDependencyLink[];
  propagationSignals: readonly DependencyPropagationSignal[];
  impactChains: readonly OrganizationalImpactChain[];
  causeEffectSequences: readonly StrategicCauseEffectSequence[];
};

export type OperationalCausalDependencyInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  temporalSnapshot?: EnterpriseTemporalSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type OperationalCausalDependencyResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CausalDependencySnapshot | null;
  newChains: number;
  storeSignature: string;
};

export type CausalDependencyStoreState = {
  chains: readonly OperationalCausalChain[];
  links: readonly TemporalDependencyLink[];
  snapshots: readonly CausalDependencySnapshot[];
  signals: readonly DependencyPropagationSignal[];
  impactChains: readonly OrganizationalImpactChain[];
  causeEffectSequences: readonly StrategicCauseEffectSequence[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
