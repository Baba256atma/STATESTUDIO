/** D10:1 - Canonical MVP runtime and strategic readiness contracts. */

export type ReadinessState = "not_ready" | "in_progress" | "ready" | "blocked";

export type RuntimeHealthLevel = "healthy" | "degraded" | "warning" | "critical";

export type ReadinessValidationStatus = "unvalidated" | "validating" | "validated" | "failed" | "blocked";

export type ReadinessDimension =
  | "development_status"
  | "test_status"
  | "runtime_stability"
  | "integration_status"
  | "deployment_status"
  | "ux_readiness"
  | "executive_readiness"
  | "operational_readiness";

export type FeatureReadinessId =
  | "ingestion"
  | "mapping"
  | "fragility"
  | "simulation"
  | "decision_intelligence"
  | "executive_panels"
  | "scenario_workflows"
  | "connectors"
  | "chat_intelligence";

export type StrategicReadinessTarget =
  | "mvp"
  | "demo"
  | "pilot"
  | "production_candidate";

export type ReadinessSignal = {
  id: string;
  label: string;
  state: ReadinessState;
  confidence: number;
  validationStatus: ReadinessValidationStatus;
  notes: readonly string[];
  blockers: readonly string[];
};

export type ReadinessDomainModel = {
  dimensions: Readonly<Record<ReadinessDimension, ReadinessSignal>>;
  aggregateState: ReadinessState;
  confidence: number;
};

export type RuntimeHealthCheck = {
  id: string;
  label: string;
  health: RuntimeHealthLevel;
  summary: string;
};

export type RuntimeHealthSummary = {
  status: RuntimeHealthLevel;
  confidence: number;
  checks: readonly RuntimeHealthCheck[];
  warnings: readonly string[];
  blockers: readonly string[];
  generatedAt: number;
  signature: string;
};

export type FeatureReadinessEntry = {
  featureId: FeatureReadinessId;
  label: string;
  readinessState: ReadinessState;
  confidence: number;
  validationStatus: ReadinessValidationStatus;
  notes: readonly string[];
  blockers: readonly string[];
};

export type FeatureReadinessRegistry = {
  features: Readonly<Record<FeatureReadinessId, FeatureReadinessEntry>>;
  aggregateState: ReadinessState;
  confidence: number;
};

export type RuntimeReadinessRegistry = {
  registryId: string;
  organizationId: string;
  generatedAt: number;
  platform: ReadinessDomainModel;
  runtimeHealth: RuntimeHealthSummary;
  features: FeatureReadinessRegistry;
  signature: string;
};

export type StrategicReadinessEvaluation = {
  target: StrategicReadinessTarget;
  state: ReadinessState;
  confidence: number;
  blockers: readonly string[];
  incomplete: readonly string[];
  highestRisk: string | null;
  shouldHappenNext: readonly string[];
  decisionAuthority: "evaluation_only";
};

export type ExecutiveReadinessSnapshot = {
  snapshotId: string;
  organizationId: string;
  generatedAt: number;
  isNexoraReady: boolean;
  answer: string;
  incomplete: readonly string[];
  blocked: readonly string[];
  highestRisk: string | null;
  shouldHappenNext: readonly string[];
  evaluations: Readonly<Record<StrategicReadinessTarget, StrategicReadinessEvaluation>>;
  signature: string;
};

export type RuntimeReadinessInput = {
  organizationId?: string;
  dimensions?: Partial<Record<ReadinessDimension, Partial<ReadinessSignal>>>;
  features?: Partial<Record<FeatureReadinessId, Partial<FeatureReadinessEntry>>>;
  runtimeChecks?: readonly RuntimeHealthCheck[];
  now?: number;
};
