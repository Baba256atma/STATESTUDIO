/**
 * E2:98 — Executive Cognitive Twin contracts.
 */

import type { TimelineEvent } from "../executiveTimelineHudTypes";
import type { ExecutiveScenarioUniverseState } from "../scenario/executiveMultiScenarioUniverseTypes";
import type { TypeCAlert } from "../../typec/typeCAlerts";
import type { TypeCDecisionRecommendation } from "../../typec/typeCDecisionRecommendation";
import type { TypeCExecutionState } from "../../typec/typeCExecutionState";
import type { TypeCMemoryState } from "../../typec/typeCMemory";
import type { TypeCScenarioComparison } from "../../typec/typeCScenarioComparison";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation";

export type CognitiveTwinHealthLevel = "healthy" | "warning" | "degraded" | "critical" | "recovering";

export type CognitiveTwinConfidenceLevel = "low" | "medium" | "high";

export type CognitiveTwinLifecycleState = "dormant" | "active" | "stressed" | "evolving" | "recovering";

export type CognitiveTwinEntityKind = "object" | "cluster" | "domain" | "system" | "resource";

export type CognitiveTwinDepartment =
  | "operations"
  | "finance"
  | "projects"
  | "logistics"
  | "quality"
  | "strategy";

export type CognitiveTwinRelationshipHealth = "healthy" | "stressed" | "broken";

export type CognitiveTwinResourceKind = "budget" | "people" | "equipment" | "capacity";

export type CognitiveTwinDriftKind = "organizational" | "strategic" | "operational";

export type CognitiveTwinRiskEvolution = "growing" | "stable" | "declining";

export type CognitiveTwinTwinEntity = {
  twinId: string;
  twinType: CognitiveTwinEntityKind;
  label: string;
  department: CognitiveTwinDepartment | null;
  lifecycleState: CognitiveTwinLifecycleState;
  healthState: CognitiveTwinHealthLevel;
  confidenceState: CognitiveTwinConfidenceLevel;
  pulseScore: number;
  healthScore: number;
  objectIds: readonly string[];
  relatedScenarioIds: readonly string[];
};

export type CognitiveTwinRelationshipTwin = {
  relationshipId: string;
  sourceId: string;
  targetId: string;
  strength: number;
  health: CognitiveTwinRelationshipHealth;
  pulseScore: number;
};

export type CognitiveTwinInstitutionalMemoryEntry = {
  id: string;
  kind: "decision" | "outcome" | "incident" | "recovery";
  title: string;
  summary: string;
  timestampLabel: string | null;
  relatedObjectIds: readonly string[];
  relatedScenarioId: string | null;
};

export type CognitiveTwinFutureBranch = {
  scenarioId: string;
  title: string;
  confidence: CognitiveTwinConfidenceLevel;
  riskEvolution: CognitiveTwinRiskEvolution;
  overallScore: number;
};

export type CognitiveTwinResourceConstraint = {
  resourceKind: CognitiveTwinResourceKind;
  label: string;
  pressureScore: number;
  bottleneck: boolean;
};

export type CognitiveTwinDriftSignal = {
  kind: CognitiveTwinDriftKind;
  title: string;
  summary: string;
  severity: CognitiveTwinHealthLevel;
  score: number;
};

export type ExecutiveCognitiveTwinScores = {
  enterprisePulseScore: number;
  enterpriseHealthScore: number;
  enterpriseReadinessScore: number;
  enterpriseResilienceScore: number;
  enterpriseStabilityScore: number;
  domainPulseScore: number;
  domainHealthScore: number;
};

export type ExecutiveCognitiveTwinAwareness = {
  situation: string;
  strategic: string;
  operational: string;
};

export type ExecutiveCognitiveTwinCopilotContext = {
  narrative: string;
  explanation: string;
  recommendation: string;
  changedSummary: string | null;
};

export type TwinObjectSelection = {
  highlighted_objects?: string[];
  risk_sources?: string[];
  risk_targets?: string[];
  dim_unrelated_objects?: boolean;
};

export type BuildExecutiveCognitiveTwinInput = {
  sceneObjectIds?: readonly string[];
  sceneObjectMeta?: ReadonlyArray<{
    id: string;
    label?: string;
    tags?: readonly string[];
    role?: string;
  }>;
  relationships?: ReadonlyArray<{ id: string; sourceId: string; targetId: string; type?: string }>;
  selectedObjectId?: string | null;
  domainLabel?: string | null;
  domainId?: string | null;
  activeSimulation?: TypeCScenarioSimulation | null;
  scenarioComparison?: TypeCScenarioComparison | null;
  scenarioUniverse?: ExecutiveScenarioUniverseState | null;
  timelineEvents?: readonly TimelineEvent[];
  alerts?: readonly TypeCAlert[];
  executionState?: TypeCExecutionState | null;
  decisionRecommendation?: TypeCDecisionRecommendation | null;
  memoryState?: TypeCMemoryState | null;
  pipelineConfidence?: number | null;
  pipelineRiskLabel?: string | null;
  warRoomSignature?: string | null;
};

export type ExecutiveCognitiveTwinState = {
  signature: string;
  active: boolean;
  registry: {
    objects: readonly CognitiveTwinTwinEntity[];
    clusters: readonly CognitiveTwinTwinEntity[];
    domains: readonly CognitiveTwinTwinEntity[];
    systems: readonly CognitiveTwinTwinEntity[];
    resources: readonly CognitiveTwinTwinEntity[];
  };
  relationships: readonly CognitiveTwinRelationshipTwin[];
  memory: readonly CognitiveTwinInstitutionalMemoryEntry[];
  futureBranches: readonly CognitiveTwinFutureBranch[];
  resourceConstraints: readonly CognitiveTwinResourceConstraint[];
  driftSignals: readonly CognitiveTwinDriftSignal[];
  riskEvolution: CognitiveTwinRiskEvolution;
  scores: ExecutiveCognitiveTwinScores;
  awareness: ExecutiveCognitiveTwinAwareness;
  copilot: ExecutiveCognitiveTwinCopilotContext;
  livingObjectIds: readonly string[];
  stressedRelationshipIds: readonly string[];
  selectedTwinId: string | null;
};

export type ExecutiveCognitiveTwinSnapshot = Pick<
  ExecutiveCognitiveTwinState,
  "signature" | "scores" | "awareness" | "copilot" | "riskEvolution" | "driftSignals"
>;
