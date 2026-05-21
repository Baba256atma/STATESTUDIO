/** D9:5:3 — Executive strategic priority arbitration + multi-objective decision balancing types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import type { InterventionWindowSnapshot } from "../foresight-cognition/interventionTimingTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";

export type PriorityCategory =
  | "resilience"
  | "operational_speed"
  | "governance"
  | "coordination"
  | "recovery"
  | "growth"
  | "stabilization"
  | "adaptability"
  | "strategic_alignment"
  | "unknown";

export type TradeoffType = "reinforcing" | "competing" | "conflicting" | "balancing" | "constraining";

export type ArbitrationState = "aligned" | "tension" | "constrained" | "unstable" | "balanced";

export type ArbitrationConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type StrategicPriorityConflict = {
  conflictId: string;
  priorityA: PriorityCategory;
  priorityB: PriorityCategory;
  conflictSummary: string;
  tensionLevel: "moderate" | "elevated" | "critical";
  generatedAt: number;
};

export type EnterpriseDecisionTradeoff = {
  tradeoffId: string;
  tradeoffType: TradeoffType;
  priorityA: PriorityCategory;
  priorityB: PriorityCategory;
  tradeoffSummary: string;
  tradeoffIntensity: "low" | "moderate" | "high";
  generatedAt: number;
};

export type OperationalBalancingSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedPriorities: readonly PriorityCategory[];
  balancingRequirement: "monitor" | "rebalance" | "constrain" | "align";
  confidence: number;
  generatedAt: number;
};

export type ExecutivePriorityArbitration = {
  arbitrationId: string;
  arbitrationState: ArbitrationState;
  tradeoffType: TradeoffType;
  summary: string;
  competingPriorities: readonly PriorityCategory[];
  balancingSignals: readonly string[];
  confidence: number;
  confidenceLevel: ArbitrationConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type TradeoffAwarenessSummary = {
  dominantArbitrationState: ArbitrationState;
  dominantTradeoffType: TradeoffType;
  arbitrationHeadline: string;
  balancingPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type MultiObjectiveDecisionSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  arbitrationCount: number;
  awarenessSummary: TradeoffAwarenessSummary;
  recentExecutiveArbitrations: readonly ExecutivePriorityArbitration[];
  priorityConflicts: readonly StrategicPriorityConflict[];
  decisionTradeoffs: readonly EnterpriseDecisionTradeoff[];
  balancingSignals: readonly OperationalBalancingSignal[];
};

export type StrategicPriorityArbitrationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  coordinationSnapshot?: DecisionCoordinationSnapshot | null;
  dependencySnapshot?: DependencyAwarenessSnapshot | null;
  anticipatorySnapshot?: EnterpriseAnticipatorySnapshot | null;
  preparednessSnapshot?: EnterprisePreparednessSnapshot | null;
  interventionSnapshot?: InterventionWindowSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
};

export type StrategicPriorityArbitrationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: MultiObjectiveDecisionSnapshot | null;
  newExecutiveArbitrations: number;
  storeSignature: string;
};

export type PriorityArbitrationStoreState = {
  executiveArbitrations: readonly ExecutivePriorityArbitration[];
  snapshots: readonly MultiObjectiveDecisionSnapshot[];
  priorityConflicts: readonly StrategicPriorityConflict[];
  decisionTradeoffs: readonly EnterpriseDecisionTradeoff[];
  balancingSignals: readonly OperationalBalancingSignal[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
