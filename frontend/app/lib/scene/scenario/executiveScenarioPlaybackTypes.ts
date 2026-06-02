/**
 * E2:95 — Executive scenario playback + spatial propagation contracts.
 */

export type ScenarioPlaybackSpeed = "slow" | "normal" | "fast";

export type ScenarioPlaybackStatus = "idle" | "playing" | "paused" | "completed";

export type ScenarioStepSeverity = "info" | "watch" | "warning" | "critical";

export type ScenarioImpactStrength = "low" | "medium" | "high" | "critical";

export type ScenarioObjectState = "normal" | "active" | "impacted" | "recovering" | "resolved";

export type ScenarioStepKind =
  | "disruption"
  | "risk"
  | "decision"
  | "opportunity"
  | "recovery"
  | "operational";

export type ExecutiveScenarioMetricChange = {
  metricId: string;
  label: string;
  delta: number;
  direction: "up" | "down" | "neutral";
};

export type ExecutiveScenarioDecisionOption = {
  id: string;
  label: string;
  selected?: boolean;
};

export type ExecutiveScenarioStep = {
  stepId: string;
  index: number;
  timestamp?: string;
  title: string;
  summary: string;
  severity: ScenarioStepSeverity;
  kind: ScenarioStepKind;
  sourceObjects: readonly string[];
  targetObjects: readonly string[];
  affectedRelationships: ReadonlyArray<{
    sourceId: string;
    targetId: string;
    relationshipId?: string;
  }>;
  metricChanges?: readonly ExecutiveScenarioMetricChange[];
  impactStrength: ScenarioImpactStrength;
  timelineEventId?: string | null;
  narration?: {
    what: string;
    why: string;
    consequence: string;
    recommendation?: string;
  };
  decisionOptions?: readonly ExecutiveScenarioDecisionOption[];
  propagationHops?: ReadonlyArray<{ from: string; to: string; strength: number }>;
};

export type ExecutiveScenarioPlaybackSequence = {
  scenarioId: string;
  scenarioName: string;
  steps: readonly ExecutiveScenarioStep[];
  signature: string;
};

export type ExecutiveScenarioPropagationView = {
  signature: string;
  stepIndex: number;
  stepId: string;
  objectStates: Readonly<Record<string, ScenarioObjectState>>;
  activeObjectIds: readonly string[];
  impactedObjectIds: readonly string[];
  highlightedRelationships: ReadonlyArray<{ sourceId: string; targetId: string; strength: number }>;
  activeClusterIds: readonly string[];
  riskSources: readonly string[];
  riskTargets: readonly string[];
  propagationEdges: ReadonlyArray<{ from: string; to: string; strength: number; depth: number }>;
  dimUnrelated: boolean;
  focusObjectId: string | null;
  activeSummary: string;
  stepTitle: string;
  progressLabel: string;
  completionPercent: number;
  kind: ScenarioStepKind;
  severity: ScenarioStepSeverity;
};

export type ExecutiveScenarioCompletionSummary = {
  scenarioId: string;
  scenarioName: string;
  affectedSystems: readonly string[];
  affectedObjectIds: readonly string[];
  riskLevel: ScenarioStepSeverity;
  confidenceScore: number;
  impactSummary: string;
};

export type ExecutiveScenarioPlaybackState = {
  status: ScenarioPlaybackStatus;
  speed: ScenarioPlaybackSpeed;
  currentStepIndex: number;
  sequence: ExecutiveScenarioPlaybackSequence | null;
  propagationView: ExecutiveScenarioPropagationView | null;
  completionSummary: ExecutiveScenarioCompletionSummary | null;
  cameraFollowEnabled: boolean;
  userCameraOverride: boolean;
  signature: string;
};

export type BuildExecutiveScenarioPlaybackSequenceInput = {
  scenarioId?: string | null;
  scenarioName?: string | null;
  simulation?: {
    scenarioId: string;
    affectedObjectIds: string[];
    propagationPaths: Array<{ from: string; to: string; intensity: number }>;
    riskLevel: "low" | "medium" | "high";
    summary: string;
  } | null;
  timelineEvents?: ReadonlyArray<{
    id: string;
    title: string;
    timestamp?: string;
    timestampIso?: string;
    summary?: string;
    narrativeSummary?: string;
    severity?: ScenarioStepSeverity;
    markerType?: string;
    relatedObjectIds?: readonly string[];
  }>;
  sceneObjectLabels?: Readonly<Record<string, string>>;
};

export type ScenarioPlaybackObjectSelection = {
  highlighted_objects?: string[];
  risk_sources?: string[];
  risk_targets?: string[];
  dim_unrelated_objects?: boolean;
};
