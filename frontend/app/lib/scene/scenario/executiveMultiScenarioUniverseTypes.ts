/**
 * E2:96 — Multi-scenario universe + executive comparison contracts.
 */

import type { TypeCScenarioComparison } from "../../typec/typeCScenarioComparison";
import type { TypeCScenarioDraft } from "../../typec/typeCScenarioDrafts";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation";

export type ScenarioComparisonMode = "single" | "dual" | "triple";

export type ScenarioUniverseLayoutMode = "overlay" | "split" | "ghost";

export type ScenarioChangeClassification =
  | "added"
  | "removed"
  | "modified"
  | "improved"
  | "degraded"
  | "unchanged";

export type ScenarioImpactMagnitude = "minor" | "moderate" | "major" | "critical";

export type ExecutiveScenarioLayerRole = "baseline" | "alternative";

export type ExecutiveScenarioLayerMetadata = {
  id: string;
  title: string;
  description: string;
  confidence: number;
  riskScore: number;
  costImpact: "low" | "medium" | "high";
  opportunityImpact: "low" | "medium" | "high";
  timelineLength: number;
  role: ExecutiveScenarioLayerRole;
  rank: number | null;
  overallScore: number;
  riskLevel: "low" | "medium" | "high";
};

export type ExecutiveScenarioObjectDelta = {
  objectId: string;
  classification: ScenarioChangeClassification;
  magnitude: ScenarioImpactMagnitude;
  baselineState: string;
  scenarioState: string;
};

export type ExecutiveScenarioRelationshipDelta = {
  sourceId: string;
  targetId: string;
  classification: ScenarioChangeClassification;
  strength: number;
};

export type ExecutiveScenarioLayerDelta = {
  scenarioId: string;
  objectDeltas: readonly ExecutiveScenarioObjectDelta[];
  relationshipDeltas: readonly ExecutiveScenarioRelationshipDelta[];
  metricChanges: ReadonlyArray<{ metricId: string; label: string; delta: number; direction: "up" | "down" | "neutral" }>;
  divergenceStepIndex: number | null;
};

export type ExecutiveScenarioTradeOffSurface = {
  gain: number;
  cost: number;
  risk: number;
  confidence: number;
  resilience: number;
};

export type ExecutiveScenarioRanking = {
  scenarioId: string;
  title: string;
  rank: number;
  overallScore: number;
  tradeOff: ExecutiveScenarioTradeOffSurface;
  recommendationLevel: "recommended" | "acceptable" | "risky";
};

export type ExecutiveScenarioStrategicRecommendation = {
  recommendedScenarioId: string;
  recommendedTitle: string;
  reasoning: string;
  tradeoffSummary: string;
  confidence: number;
};

export type ExecutiveScenarioUniverseLayer = {
  metadata: ExecutiveScenarioLayerMetadata;
  simulation: TypeCScenarioSimulation | null;
  draft: TypeCScenarioDraft | null;
  delta: ExecutiveScenarioLayerDelta | null;
  visible: boolean;
  ghostProjection: boolean;
  colorToken: string;
};

export type ExecutiveScenarioUniverseState = {
  signature: string;
  comparisonId: string | null;
  comparisonMode: ScenarioComparisonMode;
  layoutMode: ScenarioUniverseLayoutMode;
  baselineScenarioId: string;
  activeScenarioId: string;
  visibleLayerIds: readonly string[];
  layers: readonly ExecutiveScenarioUniverseLayer[];
  rankings: readonly ExecutiveScenarioRanking[];
  recommendation: ExecutiveScenarioStrategicRecommendation | null;
  comparisonSummary: string;
  comparisonActive: boolean;
  divergencePoints: ReadonlyArray<{ stepIndex: number; scenarioId: string; label: string }>;
};

export type BuildExecutiveScenarioUniverseInput = {
  comparison: TypeCScenarioComparison;
  drafts: readonly TypeCScenarioDraft[];
  simulations: readonly TypeCScenarioSimulation[];
  sceneObjectIds?: readonly string[];
};

export type ScenarioUniverseObjectSelection = {
  highlighted_objects?: string[];
  risk_sources?: string[];
  risk_targets?: string[];
  dim_unrelated_objects?: boolean;
};

export type ExecutiveScenarioComparisonDashboardRow = {
  scenarioId: string;
  title: string;
  riskScore: number;
  costImpact: string;
  opportunityImpact: string;
  confidence: number;
  overallScore: number;
  rank: number | null;
  active: boolean;
  visible: boolean;
};
