/**
 * CORE-OUT:1A — Live Outcome Observation & Capture.
 *
 * Captures observations and decides Outcome linkage.
 * Does not evaluate expected-vs-actual, infer causation, or create Learning.
 * Data Reality remains the observation source of truth.
 */

import type { NexoraKPIResult } from "../data-reality/dataRealityContracts.ts";
import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import type { SemanticConfidence } from "./problemRiskOpportunityIntelligence.ts";
import type { NexoraDataSourceValidationState } from "../data-reality/realDataIntegrationFoundation.ts";
import type {
  ExecutiveOutcomeBaseline,
  ExecutiveOutcomeExpectation,
  ExecutiveOutcomeObservation,
  ExecutiveOutcomeWindow,
} from "./nexoraLiveOutcomeIntelligence.ts";

export const nexoraLiveOutcomeObservationCaptureIdentity =
  "CORE-OUT:1A/LiveOutcomeObservationCapture" as const;
export const nexoraLiveOutcomeObservationCaptureVersion = "1.0.0" as const;
export const nexoraLiveOutcomeObservationCaptureNamespace =
  "nexora.core.live-outcome-observation-capture" as const;

export const LIVE_OUTCOME_OBSERVATION_BOUNDARY = Object.freeze({
  role: "outcome-observation-capture-and-linkage" as const,
  dataRealityAuthority: "P0:1/NexoraDataRealityFoundation" as const,
  rdiAuthority: "RDI:1/NexoraRealDataIntegrationFoundation" as const,
  evaluationAuthority: "CORE-OUT:1/LiveOutcomeIntelligence" as const,
  causalAuthority: "CORE-INT:3/GroundedCausalConstraintIntelligence" as const,
  evaluatesSuccess: false as const,
  createsLearning: false as const,
  writesApp4Learning: false as const,
  usesLlm: false as const,
  wiresCc11: false as const,
  mutatesDecision: false as const,
  mutatesExecution: false as const,
  mutatesStage: false as const,
  currentKpiEqualsOutcome: false as const,
  changeEqualsOutcome: false as const,
  progressEqualsOutcome: false as const,
  temporalSequenceEqualsLinkage: false as const,
  temporalSequenceEqualsCausation: false as const,
  inventsTimestamps: false as const,
  inventsProvenance: false as const,
  isExiWriter: false as const,
  storageLifetime: "session" as const,
});

export type OutcomeObservationValidation = NexoraDataSourceValidationState;
export type OutcomeObservationFreshness = "current" | "stale" | "unknown";
export type OutcomeWindowStatus =
  | "not-started"
  | "open"
  | "ready-for-observation"
  | "closed"
  | "timing-incomplete";
export type OutcomeLinkBasis =
  | "explicit-target-binding"
  | "metric-binding"
  | "execution-target-binding"
  | "decision-outcome-binding"
  | "manual-validated-binding";
export type OutcomeCaptureRejection =
  | "missing-provenance"
  | "missing-timestamp"
  | "invalid-observation"
  | "unsupported-observation"
  | "missing-outcome-link"
  | "dimension-mismatch"
  | "unit-mismatch"
  | "window-mismatch"
  | "timing-incomplete"
  | "execution-progress-only"
  | "recent-change-only"
  | "current-kpi-unlinked";

export type OutcomeObservationInput = Readonly<{
  readonly subjectId: string;
  readonly metricId: string;
  readonly dimension: string;
  readonly unit: string | null;
  readonly value: number | null;
  readonly qualitativeState: string | null;
  readonly observedAt: string | null;
  readonly capturedAt: string | null;
  readonly sourceId: string | null;
  readonly datasetId: string | null;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly validationState: OutcomeObservationValidation;
  readonly freshnessState: OutcomeObservationFreshness;
  readonly decisionId?: string | null;
  readonly executionId?: string | null;
  readonly expectedOutcomeId?: string | null;
  readonly observationWindowId?: string | null;
  readonly executionProgressOnly?: boolean;
  readonly recentChangeOnly?: boolean;
}>;

export type OutcomeObservationWindowRecord = Readonly<{
  readonly id: string;
  readonly subjectId: string;
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly openedAt: string | null;
  readonly expectedStartAt: string | null;
  readonly expectedEndAt: string | null;
  readonly baselineObservationId: string | null;
  readonly expectedOutcomeIds: readonly string[];
  readonly status: OutcomeWindowStatus;
}>;

export type OutcomeObservationLink = Readonly<{
  readonly observationId: string;
  readonly expectedOutcomeId: string | null;
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly subjectId: string;
  readonly linkBasis: OutcomeLinkBasis;
  readonly comparisonDimension: string;
  readonly confidence: SemanticConfidence;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
}>;

export type CapturedOutcomeObservation = Readonly<{
  readonly observationId: string;
  readonly subjectId: string;
  readonly metricId: string;
  readonly dimension: string;
  readonly unit: string | null;
  readonly value: number | null;
  readonly qualitativeState: string | null;
  readonly observedAt: string | null;
  readonly capturedAt: string | null;
  readonly sourceId: string | null;
  readonly datasetId: string | null;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly validationState: OutcomeObservationValidation;
  readonly freshnessState: OutcomeObservationFreshness;
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly expectedOutcomeId: string | null;
  readonly observationWindowId: string | null;
  readonly outcomeLink: OutcomeObservationLink | null;
  readonly eligibleAsActualOutcome: boolean;
  readonly rejections: readonly OutcomeCaptureRejection[];
  readonly isOutcome: boolean;
  readonly duplicateOf: string | null;
}>;

export type OutcomeObservationCaptureAssessment = Readonly<{
  readonly identity: typeof nexoraLiveOutcomeObservationCaptureIdentity;
  readonly subjectId: string | null;
  readonly observations: readonly CapturedOutcomeObservation[];
  readonly linkedActuals: readonly ExecutiveOutcomeObservation[];
  readonly baseline: ExecutiveOutcomeBaseline | null;
  readonly window: OutcomeObservationWindowRecord | null;
  readonly evaluatorWindow: ExecutiveOutcomeWindow;
  readonly currentReality: {
    readonly statement: string;
    readonly dimension: string | null;
    readonly numericValue: number | null;
    readonly isOutcome: false;
  } | null;
  readonly evaluatesSuccess: false;
  readonly createsLearning: false;
}>;

type CaptureStore = {
  observations: Map<string, CapturedOutcomeObservation>;
  windows: Map<string, OutcomeObservationWindowRecord>;
  links: Map<string, OutcomeObservationLink>;
};

const store: CaptureStore = {
  observations: new Map(),
  windows: new Map(),
  links: new Map(),
};

function freezeList<T>(values: readonly T[]): readonly T[] {
  return Object.freeze([...values]);
}

export function observationIdentity(input: {
  readonly sourceId: string | null;
  readonly datasetId: string | null;
  readonly metricId: string;
  readonly observedAt: string | null;
}): string {
  return `obs:${input.sourceId ?? "none"}:${input.datasetId ?? "none"}:${input.metricId}:${input.observedAt ?? "untimed"}`;
}

export function dimensionsCompatible(left: string, right: string): boolean {
  return left === right;
}

export function unitsCompatible(
  left: string | null,
  right: string | null,
): boolean {
  return left === right;
}

function windowContains(
  window: OutcomeObservationWindowRecord | null,
  observedAt: string | null,
): OutcomeCaptureRejection | null {
  if (window == null) return "timing-incomplete";
  if (window.status === "timing-incomplete") return "timing-incomplete";
  if (observedAt == null) return "missing-timestamp";
  const start = window.expectedStartAt ?? window.openedAt;
  const end = window.expectedEndAt;
  if (start && observedAt < start) return "window-mismatch";
  if (end && observedAt > end) return "window-mismatch";
  return null;
}

function rejectionsFor(
  input: OutcomeObservationInput,
  link: OutcomeObservationLink | null,
  window: OutcomeObservationWindowRecord | null,
  expected: ExecutiveOutcomeExpectation | null,
): readonly OutcomeCaptureRejection[] {
  const reasons: OutcomeCaptureRejection[] = [];
  if (input.provenanceRefs.length === 0 || !input.sourceId || !input.datasetId) {
    reasons.push("missing-provenance");
  }
  if (!input.observedAt) reasons.push("missing-timestamp");
  if (input.validationState === "invalid") reasons.push("invalid-observation");
  if (input.validationState === "unsupported") {
    reasons.push("unsupported-observation");
  }
  if (input.executionProgressOnly) reasons.push("execution-progress-only");
  if (input.recentChangeOnly) reasons.push("recent-change-only");
  const windowIssue = windowContains(window, input.observedAt);
  if (windowIssue) reasons.push(windowIssue);
  if (link == null) {
    reasons.push("missing-outcome-link");
    if (!input.expectedOutcomeId && !expected) {
      reasons.push("current-kpi-unlinked");
    }
  } else if (expected && !dimensionsCompatible(link.comparisonDimension, expected.dimension)) {
    reasons.push("dimension-mismatch");
  } else if (
    expected &&
    !unitsCompatible(input.unit, expected.unit) &&
    expected.unit != null &&
    input.unit != null
  ) {
    reasons.push("unit-mismatch");
  } else if (
    expected &&
    !dimensionsCompatible(input.dimension, expected.dimension)
  ) {
    reasons.push("dimension-mismatch");
  }
  return freezeList([...new Set(reasons)]);
}

export const ALLOWED_OUTCOME_LINK_BASES = Object.freeze([
  "explicit-target-binding",
  "metric-binding",
  "execution-target-binding",
  "decision-outcome-binding",
  "manual-validated-binding",
] as const);

export const FORBIDDEN_OUTCOME_LINK_BASES = Object.freeze([
  "temporal-proximity",
  "semantic-guess",
  "llm-inferred",
] as const);

export function canonicalExpectedOutcomeId(sourceId: string): string {
  return `expected:${sourceId}`;
}

export function evaluateOutcomeLink(input: {
  readonly observation: OutcomeObservationInput;
  readonly expected: ExecutiveOutcomeExpectation | null;
  readonly basis: OutcomeLinkBasis | string;
}): OutcomeObservationLink | null {
  if (
    FORBIDDEN_OUTCOME_LINK_BASES.includes(
      input.basis as (typeof FORBIDDEN_OUTCOME_LINK_BASES)[number],
    )
  ) {
    return null;
  }
  if (
    !ALLOWED_OUTCOME_LINK_BASES.includes(
      input.basis as (typeof ALLOWED_OUTCOME_LINK_BASES)[number],
    )
  ) {
    return null;
  }
  const expected = input.expected;
  if (expected == null) return null;
  if (!dimensionsCompatible(input.observation.dimension, expected.dimension)) {
    return null;
  }
  return Object.freeze({
    observationId: observationIdentity(input.observation),
    expectedOutcomeId: expected.expectationId,
    decisionId: input.observation.decisionId ?? null,
    executionId: input.observation.executionId ?? null,
    subjectId: input.observation.subjectId,
    linkBasis: input.basis as OutcomeLinkBasis,
    comparisonDimension: expected.dimension,
    confidence: input.observation.validationState === "partial" ? "low" : "medium",
    evidenceRefs: freezeList(input.observation.evidenceRefs),
    provenanceRefs: freezeList(input.observation.provenanceRefs),
  });
}

export function openOutcomeObservationWindow(input: {
  readonly subjectId: string;
  readonly decisionId?: string | null;
  readonly executionId?: string | null;
  readonly openedAt?: string | null;
  readonly expectedStartAt?: string | null;
  readonly expectedEndAt?: string | null;
  readonly baselineObservationId?: string | null;
  readonly expectedOutcomeIds?: readonly string[];
}): OutcomeObservationWindowRecord {
  const hasTiming = Boolean(
    input.openedAt || input.expectedStartAt || input.expectedEndAt,
  );
  const id = `window:${input.decisionId ?? input.executionId ?? input.subjectId}:${input.openedAt ?? input.expectedStartAt ?? "incomplete"}`;
  const existing = store.windows.get(id);
  if (existing) return existing;
  const record: OutcomeObservationWindowRecord = Object.freeze({
    id,
    subjectId: input.subjectId,
    decisionId: input.decisionId ?? null,
    executionId: input.executionId ?? null,
    openedAt: input.openedAt ?? null,
    expectedStartAt: input.expectedStartAt ?? null,
    expectedEndAt: input.expectedEndAt ?? null,
    baselineObservationId: input.baselineObservationId ?? null,
    expectedOutcomeIds: freezeList(input.expectedOutcomeIds ?? []),
    status: hasTiming
      ? input.expectedEndAt && input.openedAt && input.openedAt > input.expectedEndAt
        ? "closed"
        : "ready-for-observation"
      : "timing-incomplete",
  });
  store.windows.set(id, record);
  return record;
}

export function captureOutcomeObservation(input: {
  readonly observation: OutcomeObservationInput;
  readonly expected?: ExecutiveOutcomeExpectation | null;
  readonly window?: OutcomeObservationWindowRecord | null;
  readonly linkBasis?: OutcomeLinkBasis | null;
}): CapturedOutcomeObservation {
  const observationId = observationIdentity(input.observation);
  const existing = store.observations.get(observationId);
  if (existing) {
    return Object.freeze({ ...existing, duplicateOf: existing.observationId });
  }
  const link =
    input.linkBasis && input.expected
      ? evaluateOutcomeLink({
          observation: input.observation,
          expected: input.expected,
          basis: input.linkBasis,
        })
      : (store.links.get(`${observationId}:${input.expected?.expectationId ?? ""}`) ??
        null);
  if (link) store.links.set(`${observationId}:${link.expectedOutcomeId ?? ""}`, link);
  const window =
    input.window ??
    (input.observation.observationWindowId
      ? store.windows.get(input.observation.observationWindowId) ?? null
      : null);
  const rejected = rejectionsFor(input.observation, link, window, input.expected ?? null);
  const eligible =
    link != null &&
    !rejected.includes("missing-provenance") &&
    !rejected.includes("missing-timestamp") &&
    !rejected.includes("invalid-observation") &&
    !rejected.includes("unsupported-observation") &&
    !rejected.includes("missing-outcome-link") &&
    !rejected.includes("dimension-mismatch") &&
    !rejected.includes("unit-mismatch") &&
    !rejected.includes("window-mismatch") &&
    !rejected.includes("timing-incomplete") &&
    !rejected.includes("execution-progress-only") &&
    !rejected.includes("recent-change-only") &&
    (input.observation.validationState === "valid" ||
      input.observation.validationState === "partial" ||
      input.observation.validationState === "stale");
  const captured: CapturedOutcomeObservation = Object.freeze({
    observationId,
    subjectId: input.observation.subjectId,
    metricId: input.observation.metricId,
    dimension: input.observation.dimension,
    unit: input.observation.unit,
    value: input.observation.value,
    qualitativeState: input.observation.qualitativeState,
    observedAt: input.observation.observedAt,
    capturedAt: input.observation.capturedAt,
    sourceId: input.observation.sourceId,
    datasetId: input.observation.datasetId,
    evidenceRefs: freezeList(input.observation.evidenceRefs),
    provenanceRefs: freezeList(input.observation.provenanceRefs),
    validationState: input.observation.validationState,
    freshnessState:
      input.observation.validationState === "stale"
        ? "stale"
        : input.observation.freshnessState,
    decisionId: input.observation.decisionId ?? null,
    executionId: input.observation.executionId ?? null,
    expectedOutcomeId: link?.expectedOutcomeId ?? input.observation.expectedOutcomeId ?? null,
    observationWindowId: window?.id ?? input.observation.observationWindowId ?? null,
    outcomeLink: link,
    eligibleAsActualOutcome: eligible,
    rejections: rejected,
    isOutcome: eligible,
    duplicateOf: null,
  });
  store.observations.set(observationId, captured);
  return captured;
}

export function bindOutcomeObservation(input: {
  readonly observationId: string;
  readonly expected: ExecutiveOutcomeExpectation;
  readonly basis: OutcomeLinkBasis;
  readonly window?: OutcomeObservationWindowRecord | null;
}): CapturedOutcomeObservation | null {
  const captured = store.observations.get(input.observationId);
  if (!captured) return null;
  const asInput: OutcomeObservationInput = {
    subjectId: captured.subjectId,
    metricId: captured.metricId,
    dimension: captured.dimension,
    unit: captured.unit,
    value: captured.value,
    qualitativeState: captured.qualitativeState,
    observedAt: captured.observedAt,
    capturedAt: captured.capturedAt,
    sourceId: captured.sourceId,
    datasetId: captured.datasetId,
    evidenceRefs: captured.evidenceRefs,
    provenanceRefs: captured.provenanceRefs,
    validationState: captured.validationState,
    freshnessState: captured.freshnessState,
    decisionId: captured.decisionId,
    executionId: captured.executionId,
    expectedOutcomeId: input.expected.expectationId,
    observationWindowId: captured.observationWindowId,
  };
  store.observations.delete(input.observationId);
  return captureOutcomeObservation({
    observation: asInput,
    expected: input.expected,
    window: input.window ?? null,
    linkBasis: input.basis,
  });
}

export function observationInputFromKpi(input: {
  readonly kpi: NexoraKPIResult;
  readonly subjectId: string;
  readonly dimension: string;
  readonly sourceId: string | null;
  readonly datasetId: string | null;
  readonly validationState: OutcomeObservationValidation;
  readonly freshnessState?: OutcomeObservationFreshness;
  readonly evidenceRefs?: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs?: readonly string[];
  readonly decisionId?: string | null;
  readonly executionId?: string | null;
}): OutcomeObservationInput {
  return Object.freeze({
    subjectId: input.subjectId,
    metricId: input.kpi.kpiId,
    dimension: input.dimension,
    unit: input.kpi.unit,
    value: input.kpi.value,
    qualitativeState: null,
    observedAt: input.kpi.calculatedAt || null,
    capturedAt: input.kpi.calculatedAt || null,
    sourceId: input.sourceId,
    datasetId: input.datasetId,
    evidenceRefs: freezeList(input.evidenceRefs ?? []),
    provenanceRefs: freezeList(input.provenanceRefs ?? []),
    validationState: input.validationState,
    freshnessState: input.freshnessState ?? "current",
    decisionId: input.decisionId ?? null,
    executionId: input.executionId ?? null,
  });
}

export function toEvaluatorObservation(
  captured: CapturedOutcomeObservation,
): ExecutiveOutcomeObservation | null {
  if (!captured.eligibleAsActualOutcome || captured.outcomeLink == null) {
    return null;
  }
  return Object.freeze({
    observationId: captured.observationId,
    statement:
      captured.value != null
        ? `Validated ${captured.dimension} is ${captured.value}${captured.unit ?? ""}.`
        : captured.qualitativeState ?? "Validated observation recorded.",
    claimKind: "FACT",
    dimension: captured.dimension,
    source: "canonical-outcome-writer",
    numericValue: captured.value,
    unit: captured.unit,
    observedDirection: null,
    observedAt: captured.observedAt,
    freshness: captured.freshnessState,
    validationStatus:
      captured.validationState === "stale"
        ? "validated"
        : captured.validationState === "partial"
          ? "partial"
          : "validated",
    outcomeLinked: true,
    evidenceRefs: captured.evidenceRefs,
    provenanceRefs: captured.provenanceRefs,
  });
}

function baselineFromObservation(
  captured: CapturedOutcomeObservation | null,
  window: OutcomeObservationWindowRecord | null,
): ExecutiveOutcomeBaseline | null {
  if (!captured) return null;
  if (captured.provenanceRefs.length === 0 || !captured.observedAt) return null;
  const boundary = window?.openedAt ?? window?.expectedStartAt;
  if (boundary && captured.observedAt > boundary) return null;
  return Object.freeze({
    measured: captured.dimension,
    measuredAt: captured.observedAt,
    source: captured.sourceId ?? "data-reality",
    numericValue: captured.value,
    unit: captured.unit,
    confidence: "medium",
    provenanceRefs: captured.provenanceRefs,
  });
}

export function projectOutcomeObservationCapture(input: {
  readonly subjectId: string | null;
  readonly expected?: ExecutiveOutcomeExpectation | null;
  readonly window?: OutcomeObservationWindowRecord | null;
  readonly currentKpi?: {
    readonly statement: string;
    readonly dimension: string | null;
    readonly numericValue: number | null;
  } | null;
}): OutcomeObservationCaptureAssessment {
  const observations = freezeList(
    [...store.observations.values()].filter(
      (entry) => input.subjectId == null || entry.subjectId === input.subjectId,
    ),
  );
  const linkedActuals = freezeList(
    observations
      .map(toEvaluatorObservation)
      .filter((entry): entry is ExecutiveOutcomeObservation => entry != null),
  );
  const window = input.window ?? null;
  const baselineId = window?.baselineObservationId ?? null;
  const baselineObs = baselineId
    ? store.observations.get(baselineId) ?? null
    : null;
  return Object.freeze({
    identity: nexoraLiveOutcomeObservationCaptureIdentity,
    subjectId: input.subjectId,
    observations,
    linkedActuals,
    baseline: baselineFromObservation(baselineObs, window),
    window,
    evaluatorWindow: Object.freeze({
      decisionAt: window?.openedAt ?? null,
      executionAt: window?.openedAt ?? null,
      observedAt: linkedActuals[0]?.observedAt ?? null,
      timingComplete: window != null && window.status !== "timing-incomplete",
    }),
    currentReality: input.currentKpi
      ? Object.freeze({ ...input.currentKpi, isOutcome: false as const })
      : null,
    evaluatesSuccess: false,
    createsLearning: false,
  });
}

export function listCapturedObservations(
  subjectId?: string | null,
): readonly CapturedOutcomeObservation[] {
  return freezeList(
    [...store.observations.values()].filter(
      (entry) => subjectId == null || entry.subjectId === subjectId,
    ),
  );
}

export function resetOutcomeObservationCaptureForTests(): void {
  store.observations.clear();
  store.windows.clear();
  store.links.clear();
}
