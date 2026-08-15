/**
 * P1:2 — Executive Observation & Evidence Resolution.
 *
 * Deterministic conversion of certified Nexora Data Reality into traceable
 * executive evidence and executive observations.
 *
 * Chain:
 *   NexoraDataRealitySnapshot
 *   → resolveDataRealityAdvisorEvidence
 *   → resolveDataRealityExecutiveObservations
 *   → Evidence-backed Executive Reality
 *
 * Interprets already-resolved P0 Data Reality. Does not normalize datasets,
 * compute KPIs, resolve P0 executive states, or introduce generative AI.
 */

import type {
  NexoraBusinessFact,
  NexoraDataRealitySnapshot,
  NexoraExecutiveState,
  NexoraKPIResult,
  NexoraObjectExecutiveState,
} from "./dataRealityContracts.ts";
import type {
  DataRealityAdvisorAttentionLevel,
  DataRealityAdvisorEvidence,
  DataRealityAdvisorState,
  DataRealityExecutiveObservation,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import { NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS } from "./dataRealityStageProjection.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityExecutiveObservationResolutionIdentity =
  "P1:2/ExecutiveObservationEvidenceResolution" as const;

export const dataRealityExecutiveObservationResolutionVersion =
  "1.0.0" as const;

export const dataRealityExecutiveObservationResolutionNamespace =
  "nexora.data-reality.executive-advisor.observation-resolution" as const;

export const dataRealityExecutiveObservationResolutionPhase =
  "ObservationEvidenceResolution" as const;

export const dataRealityExecutiveObservationResolutionArchitecturalRole =
  "ExecutiveObservationEvidenceResolver" as const;

export interface DataRealityExecutiveObservationResolutionIdentity {
  readonly identity: "P1:2/ExecutiveObservationEvidenceResolution";
  readonly version: "1.0.0";
  readonly namespace: "nexora.data-reality.executive-advisor.observation-resolution";
  readonly phase: "ObservationEvidenceResolution";
  readonly architecturalRole: "ExecutiveObservationEvidenceResolver";
}

const IDENTITY: DataRealityExecutiveObservationResolutionIdentity =
  Object.freeze({
    identity: dataRealityExecutiveObservationResolutionIdentity,
    version: dataRealityExecutiveObservationResolutionVersion,
    namespace: dataRealityExecutiveObservationResolutionNamespace,
    phase: dataRealityExecutiveObservationResolutionPhase,
    architecturalRole:
      dataRealityExecutiveObservationResolutionArchitecturalRole,
  });

export function getDataRealityExecutiveObservationResolutionIdentity(): DataRealityExecutiveObservationResolutionIdentity {
  return IDENTITY;
}

// ─── Capabilities & invariants ──────────────────────────────────────────────

export const DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_CAPABILITIES =
  Object.freeze([
    "consume-certified-data-reality",
    "resolve-advisor-evidence",
    "resolve-executive-observations",
    "resolve-executive-meaning",
    "resolve-advisor-state",
    "resolve-advisor-attention",
    "resolve-dominant-state",
    "resolve-dominant-attention",
    "support-focus-aware-ordering",
    "preserve-evidence-traceability",
    "preserve-unresolved-state",
    "support-dataset-sensitive-observations",
  ] as const);

export type DataRealityExecutiveObservationResolutionCapability =
  (typeof DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_CAPABILITIES)[number];

export const DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_INVARIANTS =
  Object.freeze([
    "Evidence originates only from certified Data Reality.",
    "Observations must be evidence-backed where certified evidence exists.",
    "Missing evidence must never be fabricated.",
    "Executive observations are not recommendations.",
    "Executive meaning must be deterministic.",
    "P1:2 must not calculate KPIs.",
    "P1:2 must not normalize raw datasets.",
    "P1:2 must not replace P0 executive-state resolution.",
    "Stable and unresolved states remain semantically distinct.",
    "Focus changes priority, not truth.",
    "Selected objects change priority, not truth.",
    "Generative AI is not allowed in observation resolution.",
    "No UI/rendering dependency is allowed.",
    "Same reality input produces the same resolution output.",
    "Evidence identifiers are deterministic.",
    "Every evidence reference from an observation must resolve to existing evidence.",
    "Dominant state uses explicit priority rules.",
    "P0 behavior remains immutable.",
  ] as const);

// ─── Explicit state / attention maps ────────────────────────────────────────

/**
 * Canonical P0 executive state → P1 Advisor state.
 * P0 currently exposes: normal | attention | critical.
 */
export const DATA_REALITY_TO_ADVISOR_STATE_MAP = Object.freeze({
  normal: "stable",
  attention: "watch",
  critical: "critical",
} as const satisfies Record<NexoraExecutiveState, DataRealityAdvisorState>);

export const DATA_REALITY_ADVISOR_STATE_TO_ATTENTION = Object.freeze({
  unresolved: "low",
  stable: "none",
  watch: "medium",
  risk: "high",
  critical: "immediate",
  opportunity: "medium",
} as const satisfies Record<
  DataRealityAdvisorState,
  DataRealityAdvisorAttentionLevel
>);

/** Lower rank = higher severity. Opportunity never overrides operational risk. */
export const DATA_REALITY_ADVISOR_STATE_SEVERITY_ORDER = Object.freeze([
  "critical",
  "risk",
  "watch",
  "opportunity",
  "unresolved",
  "stable",
] as const satisfies readonly DataRealityAdvisorState[]);

export const DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER = Object.freeze([
  "immediate",
  "high",
  "medium",
  "low",
  "none",
] as const satisfies readonly DataRealityAdvisorAttentionLevel[]);

// ─── Input / result contracts ───────────────────────────────────────────────

export interface ResolveDataRealityExecutiveObservationsInput {
  readonly snapshot: NexoraDataRealitySnapshot;
  readonly focusedObjectId?: string;
  readonly selectedObjectIds?: readonly string[];
  readonly includeStable?: boolean;
  readonly includeUnresolved?: boolean;
}

export interface DataRealityExecutiveObservationResolutionResult {
  readonly snapshotId?: string;
  readonly evidence: readonly DataRealityAdvisorEvidence[];
  readonly observations: readonly DataRealityExecutiveObservation[];
  readonly dominantState: DataRealityAdvisorState;
  readonly dominantAttention: DataRealityAdvisorAttentionLevel;
  readonly observedSubjectIds: readonly string[];
  readonly unresolvedSubjectIds: readonly string[];
  readonly resolutionReasons: readonly string[];
}

// ─── Subject context ────────────────────────────────────────────────────────

type SubjectContext = {
  readonly objectKey: string;
  readonly subjectId: string;
  readonly nexoraObjectId?: string;
  readonly displayName: string;
  readonly executiveState?: NexoraExecutiveState;
  readonly kpis: readonly NexoraKPIResult[];
  readonly facts: readonly NexoraBusinessFact[];
  readonly objectState?: NexoraObjectExecutiveState;
};

function displayNameForObjectKey(objectKey: string): string {
  if (objectKey.length === 0) return objectKey;
  return objectKey.charAt(0).toUpperCase() + objectKey.slice(1);
}

function stageSubjectIdForObjectKey(objectKey: string): string | undefined {
  return NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS.find(
    (binding) => binding.objectKey === objectKey,
  )?.mvpStageObjectId;
}

function nexoraObjectIdForObjectKey(
  objectKey: string,
  snapshot: NexoraDataRealitySnapshot,
): string | undefined {
  const fromState = snapshot.objectStates.find(
    (entry) => entry.objectKey === objectKey,
  )?.nexoraObjectId;
  if (fromState) return fromState;
  const fromKpi = snapshot.kpis.find(
    (entry) => entry.objectKey === objectKey,
  )?.nexoraObjectId;
  if (fromKpi) return fromKpi;
  return NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS.find(
    (binding) => binding.objectKey === objectKey,
  )?.nexoraObjectId;
}

function resolveSubjectId(
  objectKey: string,
  snapshot: NexoraDataRealitySnapshot,
): string {
  return (
    stageSubjectIdForObjectKey(objectKey) ??
    nexoraObjectIdForObjectKey(objectKey, snapshot) ??
    objectKey
  );
}

function collectObjectKeys(
  snapshot: NexoraDataRealitySnapshot,
): readonly string[] {
  const keys = new Set<string>();
  for (const fact of snapshot.facts) keys.add(fact.objectKey);
  for (const kpi of snapshot.kpis) keys.add(kpi.objectKey);
  for (const state of snapshot.objectStates) keys.add(state.objectKey);
  return Object.freeze([...keys].sort((a, b) => a.localeCompare(b)));
}

function buildSubjectContexts(
  snapshot: NexoraDataRealitySnapshot,
): readonly SubjectContext[] {
  const objectKeys = collectObjectKeys(snapshot);
  return Object.freeze(
    objectKeys.map((objectKey) => {
      const objectState = snapshot.objectStates.find(
        (entry) => entry.objectKey === objectKey,
      );
      const kpis = Object.freeze(
        snapshot.kpis
          .filter((entry) => entry.objectKey === objectKey)
          .slice()
          .sort((a, b) => a.kpiId.localeCompare(b.kpiId)),
      );
      const facts = Object.freeze(
        snapshot.facts
          .filter((entry) => entry.objectKey === objectKey)
          .slice()
          .sort((a, b) => a.metricKey.localeCompare(b.metricKey)),
      );
      return Object.freeze({
        objectKey,
        subjectId: resolveSubjectId(objectKey, snapshot),
        nexoraObjectId: nexoraObjectIdForObjectKey(objectKey, snapshot),
        displayName: displayNameForObjectKey(objectKey),
        executiveState: objectState?.state,
        kpis,
        facts,
        objectState,
      });
    }),
  );
}

function subjectMatchesFocus(
  context: SubjectContext,
  focusId: string,
): boolean {
  return (
    context.subjectId === focusId ||
    context.objectKey === focusId ||
    context.nexoraObjectId === focusId
  );
}

// ─── Formatting (locale-independent) ────────────────────────────────────────

function formatDeterministicNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  const fixed = value.toFixed(4);
  return fixed.replace(/\.?0+$/, "");
}

function kpiSlug(kpiId: string): string {
  const parts = kpiId.split(".");
  return parts[parts.length - 1] || kpiId;
}

// ─── State / attention resolvers ────────────────────────────────────────────

/**
 * Map certified P0 executive state into P1 Advisor state.
 * Missing / absent P0 state → unresolved (never fabricated certainty).
 */
export function resolveAdvisorStateFromDataReality(
  executiveState: NexoraExecutiveState | null | undefined,
): DataRealityAdvisorState {
  if (executiveState === null || executiveState === undefined) {
    return "unresolved";
  }
  return DATA_REALITY_TO_ADVISOR_STATE_MAP[executiveState];
}

export function resolveAdvisorAttentionFromAdvisorState(
  state: DataRealityAdvisorState,
): DataRealityAdvisorAttentionLevel {
  return DATA_REALITY_ADVISOR_STATE_TO_ATTENTION[state];
}

export function resolveDominantDataRealityAdvisorState(
  states: readonly DataRealityAdvisorState[],
): DataRealityAdvisorState {
  if (states.length === 0) return "unresolved";
  let dominant: DataRealityAdvisorState = "stable";
  let bestRank = DATA_REALITY_ADVISOR_STATE_SEVERITY_ORDER.indexOf("stable");
  for (const state of states) {
    const rank = DATA_REALITY_ADVISOR_STATE_SEVERITY_ORDER.indexOf(state);
    if (rank !== -1 && rank < bestRank) {
      bestRank = rank;
      dominant = state;
    }
  }
  return dominant;
}

export function resolveDominantDataRealityAdvisorAttention(
  attentions: readonly DataRealityAdvisorAttentionLevel[],
): DataRealityAdvisorAttentionLevel {
  if (attentions.length === 0) return "none";
  let dominant: DataRealityAdvisorAttentionLevel = "none";
  let bestRank = DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER.indexOf("none");
  for (const attention of attentions) {
    const rank = DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER.indexOf(attention);
    if (rank !== -1 && rank < bestRank) {
      bestRank = rank;
      dominant = attention;
    }
  }
  return dominant;
}

// ─── Executive meaning & headlines ──────────────────────────────────────────

type MeaningTable = Readonly<
  Partial<Record<DataRealityAdvisorState, string>>
>;

const EXECUTIVE_MEANING_BY_OBJECT: Readonly<Record<string, MeaningTable>> =
  Object.freeze({
    revenue: Object.freeze({
      stable:
        "Revenue performance is currently within the expected operating range.",
      watch:
        "Revenue growth has weakened enough to deserve executive attention.",
      critical:
        "Revenue performance indicates material pressure requiring executive attention.",
      unresolved:
        "Certified data is currently insufficient to establish an executive performance state for Revenue.",
    }),
    production: Object.freeze({
      stable:
        "Production utilization is currently within the expected operating range.",
      watch:
        "Production utilization is elevated and may constrain near-term operational flexibility.",
      critical:
        "Production utilization is operating near its practical capacity limit and may reduce operational flexibility.",
      unresolved:
        "Certified data is currently insufficient to establish an executive performance state for Production.",
    }),
    warehouse: Object.freeze({
      stable:
        "Warehouse utilization is currently within the expected operating range.",
      watch:
        "Warehouse utilization is elevated and may constrain inventory handling flexibility.",
      critical:
        "Warehouse utilization is near capacity and may constrain inventory handling flexibility.",
      unresolved:
        "Certified data is currently insufficient to establish an executive performance state for Warehouse.",
    }),
    shipping: Object.freeze({
      stable:
        "Shipping performance is currently within the expected operating range.",
      watch:
        "Shipping performance is below the preferred operating level and should be monitored.",
      critical:
        "Shipping performance is materially below preferred operating levels and may require executive attention.",
      unresolved:
        "Certified data is currently insufficient to establish an executive performance state for Shipping.",
    }),
    customer: Object.freeze({
      stable:
        "Customer performance is currently within the expected operating range.",
      watch:
        "Customer performance is below the preferred operating range and may require investigation.",
      critical:
        "Customer performance is materially below preferred operating levels and may require executive attention.",
      unresolved:
        "Certified data is currently insufficient to establish an executive performance state for Customer.",
    }),
    cost: Object.freeze({
      unresolved:
        "Certified data is currently insufficient to establish an executive performance state for Cost.",
      stable: "Cost performance is currently within the expected operating range.",
      watch: "Cost performance deserves executive attention.",
      critical: "Cost performance indicates material executive risk.",
    }),
  });

const HEADLINE_BY_OBJECT: Readonly<Record<string, MeaningTable>> = Object.freeze(
  {
    revenue: Object.freeze({
      stable: "Revenue Performance Stable",
      watch: "Revenue Growth Requires Attention",
      critical: "Revenue Performance Critical",
      unresolved: "Revenue Performance Unresolved",
    }),
    production: Object.freeze({
      stable: "Production Capacity Stable",
      watch: "Production Capacity Elevated",
      critical: "Production Capacity Under Pressure",
      unresolved: "Production Capacity Unresolved",
    }),
    warehouse: Object.freeze({
      stable: "Warehouse Capacity Stable",
      watch: "Warehouse Capacity Elevated",
      critical: "Warehouse Capacity Under Pressure",
      unresolved: "Warehouse Capacity Unresolved",
    }),
    shipping: Object.freeze({
      stable: "Shipping Performance Stable",
      watch: "Shipping Performance Below Target",
      critical: "Shipping Performance Critical",
      unresolved: "Shipping Performance Unresolved",
    }),
    customer: Object.freeze({
      stable: "Customer Performance Stable",
      watch: "Customer Performance Requires Attention",
      critical: "Customer Performance Critical",
      unresolved: "Customer Performance Unresolved",
    }),
    cost: Object.freeze({
      unresolved: "Cost Performance Unresolved",
      stable: "Cost Performance Stable",
      watch: "Cost Performance Requires Attention",
      critical: "Cost Performance Critical",
    }),
  },
);

function resolveExecutiveMeaning(
  objectKey: string,
  displayName: string,
  state: DataRealityAdvisorState,
): string {
  const specific = EXECUTIVE_MEANING_BY_OBJECT[objectKey]?.[state];
  if (specific) return specific;
  switch (state) {
    case "stable":
      return `${displayName} performance is currently within the expected operating range.`;
    case "watch":
      return `${displayName} performance deserves executive attention.`;
    case "risk":
      return `${displayName} evidence indicates material executive risk.`;
    case "critical":
      return `${displayName} indicates material pressure requiring executive attention.`;
    case "opportunity":
      return `${displayName} indicates favorable potential worth executive attention.`;
    case "unresolved":
      return `Certified data is currently insufficient to establish an executive performance state for ${displayName}.`;
  }
}

function resolveHeadline(
  objectKey: string,
  displayName: string,
  state: DataRealityAdvisorState,
): string {
  const specific = HEADLINE_BY_OBJECT[objectKey]?.[state];
  if (specific) return specific;
  switch (state) {
    case "stable":
      return `${displayName} Performance Stable`;
    case "watch":
      return `${displayName} Requires Attention`;
    case "risk":
      return `${displayName} At Risk`;
    case "critical":
      return `${displayName} Under Pressure`;
    case "opportunity":
      return `${displayName} Opportunity`;
    case "unresolved":
      return `${displayName} Performance Unresolved`;
  }
}

// ─── Evidence resolution ────────────────────────────────────────────────────

function freezeEvidence(
  evidence: DataRealityAdvisorEvidence,
): DataRealityAdvisorEvidence {
  return Object.freeze({ ...evidence });
}

function buildBusinessFactEvidence(
  context: SubjectContext,
  fact: NexoraBusinessFact,
): DataRealityAdvisorEvidence {
  const formatted = formatDeterministicNumber(fact.value);
  const unitSuffix = fact.unit ? ` ${fact.unit}` : "";
  return freezeEvidence({
    id: `evidence:${context.subjectId}:business-fact:${fact.metricKey}`,
    sourceKind: "business-fact",
    subjectId: context.subjectId,
    label: `${context.displayName} ${fact.metricKey}`,
    summary: `${context.displayName} ${fact.metricKey} raw fact = ${formatted}${unitSuffix}`,
    value: fact.value,
    ...(fact.unit !== undefined ? { unit: fact.unit } : {}),
    sourceReference: `${fact.sourceDatasetId}:${fact.objectKey}:${fact.metricKey}`,
  });
}

function buildKpiEvidence(
  context: SubjectContext,
  kpi: NexoraKPIResult,
): DataRealityAdvisorEvidence {
  const formatted = formatDeterministicNumber(kpi.value);
  const reasonName =
    context.objectState?.reasons.find((reason) => reason.kpiId === kpi.kpiId)
      ?.kpiName ?? kpi.kpiId;
  return freezeEvidence({
    id: `evidence:${context.subjectId}:kpi:${kpiSlug(kpi.kpiId)}`,
    sourceKind: "kpi",
    subjectId: context.subjectId,
    label: reasonName,
    summary: `${reasonName} = ${formatted}${kpi.unit}`,
    value: kpi.value,
    unit: kpi.unit,
    sourceReference: kpi.kpiId,
  });
}

function buildExecutiveStateEvidence(
  context: SubjectContext,
  objectState: NexoraObjectExecutiveState,
): DataRealityAdvisorEvidence {
  return freezeEvidence({
    id: `evidence:${context.subjectId}:executive-state`,
    sourceKind: "executive-state",
    subjectId: context.subjectId,
    label: `${context.displayName} executive state`,
    summary: `${context.displayName} executive state = ${objectState.state}`,
    value: objectState.state,
    sourceReference: objectState.nexoraObjectId,
  });
}

function buildObjectBindingEvidence(
  context: SubjectContext,
): DataRealityAdvisorEvidence | undefined {
  if (!context.nexoraObjectId) return undefined;
  const stageId = stageSubjectIdForObjectKey(context.objectKey);
  const target = stageId ?? context.nexoraObjectId;
  return freezeEvidence({
    id: `evidence:${context.subjectId}:object-binding`,
    sourceKind: "object-binding",
    subjectId: context.subjectId,
    label: `${context.displayName} object binding`,
    summary: `${context.displayName} → ${target}`,
    value: target,
    sourceReference: context.nexoraObjectId,
  });
}

export function resolveDataRealityAdvisorEvidence(
  input: ResolveDataRealityExecutiveObservationsInput,
): readonly DataRealityAdvisorEvidence[] {
  const contexts = buildSubjectContexts(input.snapshot);
  const evidence: DataRealityAdvisorEvidence[] = [];
  const seen = new Set<string>();

  const push = (item: DataRealityAdvisorEvidence | undefined) => {
    if (!item || seen.has(item.id)) return;
    seen.add(item.id);
    evidence.push(item);
  };

  for (const context of contexts) {
    for (const fact of context.facts) {
      push(buildBusinessFactEvidence(context, fact));
    }
    for (const kpi of context.kpis) {
      push(buildKpiEvidence(context, kpi));
    }
    if (context.objectState) {
      push(buildExecutiveStateEvidence(context, context.objectState));
    }
    push(buildObjectBindingEvidence(context));
  }

  evidence.sort((a, b) => a.id.localeCompare(b.id));
  return Object.freeze(evidence);
}

// ─── Observation resolution ─────────────────────────────────────────────────

function freezeObservation(
  observation: DataRealityExecutiveObservation,
): DataRealityExecutiveObservation {
  return Object.freeze({
    ...observation,
    evidenceIds: Object.freeze([...observation.evidenceIds]),
  });
}

function attentionRank(attention: DataRealityAdvisorAttentionLevel): number {
  return DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER.indexOf(attention);
}

function compareObservationsForOrdering(
  a: DataRealityExecutiveObservation,
  b: DataRealityExecutiveObservation,
  focusedObjectId: string | undefined,
  selectedObjectIds: ReadonlySet<string>,
  subjectById: ReadonlyMap<string, SubjectContext>,
): number {
  const contextA = subjectById.get(a.subjectId);
  const contextB = subjectById.get(b.subjectId);

  const focusedA = focusedObjectId
    ? contextA
      ? subjectMatchesFocus(contextA, focusedObjectId)
      : a.subjectId === focusedObjectId
    : false;
  const focusedB = focusedObjectId
    ? contextB
      ? subjectMatchesFocus(contextB, focusedObjectId)
      : b.subjectId === focusedObjectId
    : false;
  if (focusedA !== focusedB) return focusedA ? -1 : 1;

  const selectedA =
    selectedObjectIds.has(a.subjectId) ||
    (contextA
      ? selectedObjectIds.has(contextA.objectKey) ||
        (contextA.nexoraObjectId
          ? selectedObjectIds.has(contextA.nexoraObjectId)
          : false)
      : false);
  const selectedB =
    selectedObjectIds.has(b.subjectId) ||
    (contextB
      ? selectedObjectIds.has(contextB.objectKey) ||
        (contextB.nexoraObjectId
          ? selectedObjectIds.has(contextB.nexoraObjectId)
          : false)
      : false);
  if (selectedA !== selectedB) return selectedA ? -1 : 1;

  const attentionDelta = attentionRank(a.attention) - attentionRank(b.attention);
  if (attentionDelta !== 0) return attentionDelta;

  return a.subjectId.localeCompare(b.subjectId);
}

function buildObservationForSubject(
  context: SubjectContext,
  evidence: readonly DataRealityAdvisorEvidence[],
): DataRealityExecutiveObservation {
  const advisorState = resolveAdvisorStateFromDataReality(context.executiveState);
  const attention = resolveAdvisorAttentionFromAdvisorState(advisorState);
  const evidenceIds = Object.freeze(
    evidence
      .filter((item) => item.subjectId === context.subjectId)
      .map((item) => item.id)
      .sort((a, b) => a.localeCompare(b)),
  );

  return freezeObservation({
    id: `observation:${context.subjectId}`,
    subjectKind: "object",
    subjectId: context.subjectId,
    state: advisorState,
    attention,
    headline: resolveHeadline(context.objectKey, context.displayName, advisorState),
    executiveMeaning: resolveExecutiveMeaning(
      context.objectKey,
      context.displayName,
      advisorState,
    ),
    evidenceIds,
  });
}

export function resolveDataRealityExecutiveObservations(
  input: ResolveDataRealityExecutiveObservationsInput,
): readonly DataRealityExecutiveObservation[] {
  const includeStable = input.includeStable ?? true;
  const includeUnresolved = input.includeUnresolved ?? true;
  const contexts = buildSubjectContexts(input.snapshot);
  const evidence = resolveDataRealityAdvisorEvidence(input);
  const subjectById = new Map(
    contexts.map((context) => [context.subjectId, context]),
  );
  const selected = new Set(input.selectedObjectIds ?? []);

  const all = contexts.map((context) =>
    buildObservationForSubject(context, evidence),
  );

  const filtered = all.filter((observation) => {
    if (!includeStable && observation.state === "stable") return false;
    if (!includeUnresolved && observation.state === "unresolved") return false;
    return true;
  });

  filtered.sort((a, b) =>
    compareObservationsForOrdering(
      a,
      b,
      input.focusedObjectId,
      selected,
      subjectById,
    ),
  );

  return Object.freeze(filtered.map(freezeObservation));
}

function buildResolutionReasons(options: {
  readonly observations: readonly DataRealityExecutiveObservation[];
  readonly focusedObjectId?: string;
  readonly contexts: readonly SubjectContext[];
}): readonly string[] {
  const reasons: string[] = [];
  const sorted = [...options.observations].sort((a, b) =>
    a.subjectId.localeCompare(b.subjectId),
  );

  for (const observation of sorted) {
    if (observation.state === "stable") continue;
    reasons.push(`${observation.state}-state:${observation.subjectId}`);
  }

  if (options.focusedObjectId) {
    const focused = options.contexts.find((context) =>
      subjectMatchesFocus(context, options.focusedObjectId!),
    );
    reasons.push(
      `focused-subject:${focused?.subjectId ?? options.focusedObjectId}`,
    );
  }

  return Object.freeze(reasons);
}

/**
 * Preferred P1:2 consumer API.
 * Orchestrates evidence → observations → dominant reality → subject sets.
 *
 * Dominant state/attention are computed from complete resolved reality
 * before presentation filtering (includeStable / includeUnresolved).
 */
export function resolveDataRealityExecutiveObservationResolution(
  input: ResolveDataRealityExecutiveObservationsInput,
): DataRealityExecutiveObservationResolutionResult {
  const includeStable = input.includeStable ?? true;
  const includeUnresolved = input.includeUnresolved ?? true;
  const contexts = buildSubjectContexts(input.snapshot);
  const evidence = resolveDataRealityAdvisorEvidence(input);

  const completeObservations = contexts.map((context) =>
    buildObservationForSubject(context, evidence),
  );

  const dominantState = resolveDominantDataRealityAdvisorState(
    completeObservations.map((observation) => observation.state),
  );
  const dominantAttention = resolveDominantDataRealityAdvisorAttention(
    completeObservations.map((observation) => observation.attention),
  );

  const unresolvedSubjectIds = Object.freeze(
    completeObservations
      .filter((observation) => observation.state === "unresolved")
      .map((observation) => observation.subjectId)
      .sort((a, b) => a.localeCompare(b)),
  );

  const resolutionReasons = buildResolutionReasons({
    observations: completeObservations,
    focusedObjectId: input.focusedObjectId,
    contexts,
  });

  const subjectById = new Map(
    contexts.map((context) => [context.subjectId, context]),
  );
  const selected = new Set(input.selectedObjectIds ?? []);

  const observations = completeObservations
    .filter((observation) => {
      if (!includeStable && observation.state === "stable") return false;
      if (!includeUnresolved && observation.state === "unresolved") return false;
      return true;
    })
    .sort((a, b) =>
      compareObservationsForOrdering(
        a,
        b,
        input.focusedObjectId,
        selected,
        subjectById,
      ),
    );

  const observedSubjectIds = Object.freeze(
    observations.map((observation) => observation.subjectId),
  );

  return Object.freeze({
    snapshotId: input.snapshot.datasetId,
    evidence,
    observations: Object.freeze(observations.map(freezeObservation)),
    dominantState,
    dominantAttention,
    observedSubjectIds,
    unresolvedSubjectIds,
    resolutionReasons,
  });
}
