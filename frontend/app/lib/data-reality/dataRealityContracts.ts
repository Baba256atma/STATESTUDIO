/**
 * P0:1 — Data Reality contracts.
 *
 * Canonical, serializable business-data structures for the chain:
 *   Dataset → Facts → Object Binding → KPI → Executive State → Runtime → Stage
 *
 * Presentation-free and Stage/Three.js-free by design.
 * Does not mutate frozen NOL / DRI / EX-DRI / REX / NEX-CI / NEX-MVP surfaces.
 */

// ─── Dataset ────────────────────────────────────────────────────────────────

export type NexoraDatasetId = string;

/**
 * Future-compatible source tags. P0:1 ships demo/manual only;
 * csv | api | database are reserved for later ingestion phases.
 */
export const NEXORA_DATASET_SOURCES = Object.freeze([
  "demo",
  "manual",
  "csv",
  "api",
  "database",
] as const);

export type NexoraDatasetSource = (typeof NEXORA_DATASET_SOURCES)[number];

/**
 * Same business model + same NexoraObjects + different scenario data
 * must later produce different KPIs, executive states, and Stage behavior.
 */
export const NEXORA_DATASET_SCENARIOS = Object.freeze([
  "baseline",
  "operational-pressure",
] as const);

export type NexoraDatasetScenario = (typeof NEXORA_DATASET_SCENARIOS)[number];

/** Raw business observation. No UI / Stage / presentation fields. */
export type NexoraDatasetRecord = {
  readonly objectKey: string;
  readonly metricKey: string;
  readonly value: number;
  readonly unit?: string;
  readonly observedAt?: string;
};

export type NexoraDataset = {
  readonly id: NexoraDatasetId;
  readonly name: string;
  readonly version: string;
  readonly capturedAt: string;
  readonly source: NexoraDatasetSource;
  /** Dataset family for A/B scenario comparison (same model, different values). */
  readonly familyId: string;
  readonly scenario: NexoraDatasetScenario;
  readonly records: readonly NexoraDatasetRecord[];
};

// ─── Business facts ─────────────────────────────────────────────────────────

/** Normalized fact consumed by later object/KPI binding. */
export type NexoraBusinessFact = {
  readonly objectKey: string;
  readonly metricKey: string;
  readonly value: number;
  readonly unit?: string;
  readonly sourceDatasetId: NexoraDatasetId;
};

// ─── Object data binding ────────────────────────────────────────────────────

/**
 * Binding definition — associates business metrics with a NexoraObject key.
 *
 * `objectKey` is the Data Reality business key.
 * `nexoraObjectId` maps onto canonical NOL `NexoraObjectIdentity.id`.
 * Optional on definitions; required on resolved bindings used at runtime.
 */
export type NexoraObjectDataBinding = {
  readonly objectKey: string;
  readonly metricKeys: readonly string[];
  /** Canonical NOL NexoraObjectIdentity.id when known. */
  readonly nexoraObjectId?: string;
};

/**
 * Runtime-resolved binding — canonical NOL identity is mandatory.
 * Dataset A and Dataset B must share the same resolved registry.
 */
export type NexoraResolvedObjectDataBinding = {
  readonly objectKey: string;
  readonly nexoraObjectId: string;
  readonly metricKeys: readonly string[];
};

/**
 * Business fact attributable to exactly one canonical NexoraObject.
 * Downstream KPI computation (P0:3) consumes these, not unbound facts.
 */
export type NexoraBoundBusinessFact = {
  readonly objectKey: string;
  readonly metricKey: string;
  readonly value: number;
  readonly unit?: string;
  readonly sourceDatasetId: NexoraDatasetId;
  readonly nexoraObjectId: string;
};

// ─── KPI ────────────────────────────────────────────────────────────────────

/**
 * Deterministic computation strategies for demo KPIs.
 * Not a generic expression language — only kinds required by P0:3.
 */
export const NEXORA_KPI_COMPUTATION_KINDS = Object.freeze([
  "growth-rate",
  "ratio-percent",
  "score-percent",
] as const);

export type NexoraKPIComputationKind =
  (typeof NEXORA_KPI_COMPUTATION_KINDS)[number];

/**
 * Deterministic KPI definition belonging to a NexoraObject.
 * `requiredMetrics` order is significant for computation kinds:
 *   growth-rate   → [current, previous]
 *   ratio-percent → [numerator, denominator]
 *   score-percent → [score, maximum]
 */
export type NexoraKPIDefinition = {
  readonly id: string;
  readonly objectKey: string;
  readonly name: string;
  readonly requiredMetrics: readonly string[];
  readonly unit: string;
  readonly computationKind: NexoraKPIComputationKind;
};

/** Presentation-free KPI computation output. */
export type NexoraKPIResult = {
  readonly kpiId: string;
  readonly objectKey: string;
  readonly nexoraObjectId: string;
  readonly value: number;
  readonly unit: string;
  readonly calculatedAt: string;
};

// ─── Executive state (business meaning) ─────────────────────────────────────

/**
 * Business executive condition derived from KPI meaning.
 *
 * Semantic triad adapted from NOL status meanings
 * (Healthy / Attention / Critical → Green / Yellow / Red), but kept as a
 * Data Reality vocabulary so business state is not conflated with:
 *   - NOL Seed visualization status (Green|Yellow|Red|Blue|White|Black)
 *   - Presentation depth (minimum | report | operation)
 *   - REX/DRI attention/focus channels
 *
 * Future phases project this onto NOL status / runtime attention.
 */
export const NEXORA_EXECUTIVE_STATES = Object.freeze([
  "normal",
  "attention",
  "critical",
] as const);

export type NexoraExecutiveState = (typeof NEXORA_EXECUTIVE_STATES)[number];

export const NEXORA_EXECUTIVE_STATE_MEANING = Object.freeze({
  normal:
    "Business behavior is within acceptable operating conditions.",
  attention:
    "Material deviation exists and deserves managerial awareness.",
  critical:
    "Material risk or constraint requires executive attention.",
} as const satisfies Record<NexoraExecutiveState, string>);

/**
 * Documented future projection onto NOL Seed status meanings.
 * Not applied in P0:1 — mapping only.
 */
export const NEXORA_EXECUTIVE_STATE_TO_NOL_STATUS_MEANING = Object.freeze({
  normal: "Healthy",
  attention: "Attention",
  critical: "Critical",
} as const satisfies Record<NexoraExecutiveState, string>);

/**
 * Presentation/information depth — intentionally NOT executive business state.
 * Mirrored here only as an architectural boundary marker for tests/docs.
 */
export const NEXORA_PRESENTATION_DEPTH_STATES = Object.freeze([
  "minimum",
  "report",
  "operation",
] as const);

export type NexoraPresentationDepthState =
  (typeof NEXORA_PRESENTATION_DEPTH_STATES)[number];

/**
 * Structured explanation for why an object received a business state.
 * Deterministic and AI-free — Advisor may later render prose from this.
 */
export type NexoraExecutiveStateReason = {
  readonly kpiId: string;
  readonly kpiName: string;
  readonly value: number;
  readonly unit: string;
  readonly state: NexoraExecutiveState;
  readonly ruleId: string;
};

/**
 * Resolved business executive state for one canonical NexoraObject.
 * Only objects with resolvable KPI meaning appear here.
 * Objects without KPIs (e.g. Cost) are omitted — never silently "normal".
 */
export type NexoraObjectExecutiveState = {
  readonly objectKey: string;
  readonly nexoraObjectId: string;
  readonly state: NexoraExecutiveState;
  readonly reasons: readonly NexoraExecutiveStateReason[];
};

/**
 * Inclusive/exclusive threshold band for one executive state.
 * Matching: (minInclusive === undefined || value >= minInclusive)
 *        && (maxExclusive === undefined || value < maxExclusive)
 */
export type NexoraKPIThresholdBand = {
  readonly state: NexoraExecutiveState;
  readonly minInclusive?: number;
  readonly maxExclusive?: number;
};

/**
 * Declarative KPI → executive-state rule.
 * Direction is explicit; bands are authoritative for evaluation.
 */
export type NexoraExecutiveStateRule = {
  readonly id: string;
  readonly kpiId: string;
  readonly objectKey: string;
  readonly kpiName: string;
  /** Explicit worse-direction; not inferred from names. */
  readonly worseWhen: "higher" | "lower";
  readonly bands: readonly NexoraKPIThresholdBand[];
};

// ─── Data Reality snapshot ──────────────────────────────────────────────────

/**
 * Interpreted business reality at a moment in time.
 * Boundary between data interpretation and executive runtime presentation.
 * P0:4 populates objectStates with resolved business meaning.
 */
export type NexoraDataRealitySnapshot = {
  readonly datasetId: NexoraDatasetId;
  readonly facts: readonly NexoraBusinessFact[];
  readonly kpis: readonly NexoraKPIResult[];
  readonly objectStates: readonly NexoraObjectExecutiveState[];
  readonly createdAt: string;
};

// ─── Identity / version ─────────────────────────────────────────────────────

export type NexoraDataRealityIdentity = {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly phase: string;
  readonly architecturalRole: string;
};
