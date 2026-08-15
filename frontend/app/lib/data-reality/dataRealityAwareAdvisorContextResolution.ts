/**
 * P1:3 — Data-Reality-Aware Advisor Context Resolution.
 *
 * Deterministic bridge from certified Data Reality + P1:2 evidence/observations
 * + executive interaction context → DataRealityAwareAdvisorContext.
 *
 * Answers: What should the Advisor understand right now?
 * Does not recommend, generate questions, call LLMs, or mutate truth.
 *
 * Chain:
 *   NexoraDataRealitySnapshot
 *   → P1:2 Evidence + Observations
 *   → Focus / Selection / Workspace / Goal / Scenario / Decision
 *   → Requested Intent
 *   → Primary Subject + Available Intents
 *   → DataRealityAwareAdvisorContext
 */

import type {
  BuildDataRealityAwareAdvisorContextInput,
  DataRealityAdvisorAttentionLevel,
  DataRealityAdvisorEvidence,
  DataRealityAdvisorIntentKind,
  DataRealityAdvisorSubjectKind,
  DataRealityAwareAdvisorContext,
  DataRealityExecutiveObservation,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import {
  DATA_REALITY_ADVISOR_INTENT_KINDS,
  isDataRealityAdvisorIntentKind,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import {
  DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER,
  resolveDataRealityExecutiveObservationResolution,
  type DataRealityExecutiveObservationResolutionResult,
} from "./dataRealityExecutiveObservationResolution.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityAwareAdvisorContextResolutionIdentity =
  "P1:3/DataRealityAwareAdvisorContextResolution" as const;

export const dataRealityAwareAdvisorContextResolutionVersion =
  "1.0.0" as const;

export const dataRealityAwareAdvisorContextResolutionNamespace =
  "nexora.data-reality.executive-advisor.context-resolution" as const;

export const dataRealityAwareAdvisorContextResolutionPhase =
  "AdvisorContextResolution" as const;

export const dataRealityAwareAdvisorContextResolutionArchitecturalRole =
  "DataRealityAwareAdvisorContextResolver" as const;

export interface DataRealityAwareAdvisorContextResolutionIdentity {
  readonly identity: "P1:3/DataRealityAwareAdvisorContextResolution";
  readonly version: "1.0.0";
  readonly namespace: "nexora.data-reality.executive-advisor.context-resolution";
  readonly phase: "AdvisorContextResolution";
  readonly architecturalRole: "DataRealityAwareAdvisorContextResolver";
}

const IDENTITY: DataRealityAwareAdvisorContextResolutionIdentity =
  Object.freeze({
    identity: dataRealityAwareAdvisorContextResolutionIdentity,
    version: dataRealityAwareAdvisorContextResolutionVersion,
    namespace: dataRealityAwareAdvisorContextResolutionNamespace,
    phase: dataRealityAwareAdvisorContextResolutionPhase,
    architecturalRole:
      dataRealityAwareAdvisorContextResolutionArchitecturalRole,
  });

export function getDataRealityAwareAdvisorContextResolutionIdentity(): DataRealityAwareAdvisorContextResolutionIdentity {
  return IDENTITY;
}

// ─── Principles / capabilities / invariants ─────────────────────────────────

export const DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_PRINCIPLES =
  Object.freeze([
    "Reality before Context",
    "Evidence before Interpretation",
    "Focus narrows Context — it does not alter Truth",
    "Selection expands Context — it does not alter Truth",
    "Interaction influences Relevance — it does not create Reality",
    "Intent directs Advice — it does not rewrite Evidence",
    "Unresolved Reality remains Unresolved",
    "Context before Generative Language",
  ] as const);

export type DataRealityAwareAdvisorContextResolutionPrinciple =
  (typeof DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_PRINCIPLES)[number];

export const DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_CAPABILITIES =
  Object.freeze([
    "consume-observation-evidence-resolution",
    "build-data-reality-aware-advisor-context",
    "resolve-primary-executive-subject",
    "resolve-focus-aware-context",
    "resolve-selection-aware-context",
    "resolve-workspace-aware-context",
    "resolve-goal-context",
    "resolve-scenario-context",
    "resolve-decision-context",
    "resolve-available-advisor-intents",
    "preserve-enterprise-dominant-reality",
    "prioritize-relevant-observations",
    "prioritize-relevant-evidence",
    "preserve-evidence-integrity",
    "support-deterministic-context-identity",
    "support-dataset-sensitive-advisor-context",
  ] as const);

export type DataRealityAwareAdvisorContextResolutionCapability =
  (typeof DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_CAPABILITIES)[number];

export const DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_INVARIANTS =
  Object.freeze([
    "Advisor Context originates from certified Data Reality.",
    "P1:2 is the sole observation/evidence resolution dependency.",
    "P1:3 does not calculate KPI values.",
    "P1:3 does not resolve P0 executive states.",
    "P1:3 does not duplicate P1:2 observation logic.",
    "Focus changes relevance, not truth.",
    "Selection changes relevance, not truth.",
    "Workspace changes context, not truth.",
    "Requested intent changes direction, not truth.",
    "Invalid focus cannot create a subject.",
    "Unknown selection cannot create evidence.",
    "Enterprise dominant reality survives object focus.",
    "Stable and unresolved remain distinct.",
    "Every observation evidence reference remains resolvable.",
    "Context IDs are deterministic.",
    "Same semantic input produces same context.",
    "Questions are not generated in P1:3.",
    "Advisory candidates are not generated in P1:3.",
    "No recommendation is produced in P1:3.",
    "No generative language dependency is allowed.",
    "No UI/rendering dependency is allowed.",
    "No mutation of certified Data Reality is allowed.",
    "P0 behavior remains unchanged.",
    "P1:1 contracts remain canonical and are not duplicated.",
    "P1:2 remains canonical for evidence/observation resolution.",
  ] as const);

export interface DataRealityAwareAdvisorContextResolutionMetadata {
  readonly identity: DataRealityAwareAdvisorContextResolutionIdentity;
  readonly capabilities: readonly DataRealityAwareAdvisorContextResolutionCapability[];
  readonly invariants: readonly string[];
  readonly principles: readonly string[];
}

const METADATA: DataRealityAwareAdvisorContextResolutionMetadata =
  Object.freeze({
    identity: IDENTITY,
    capabilities: DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_CAPABILITIES,
    invariants: DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_INVARIANTS,
    principles: DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_PRINCIPLES,
  });

export function getDataRealityAwareAdvisorContextResolutionMetadata(): DataRealityAwareAdvisorContextResolutionMetadata {
  return METADATA;
}

// ─── Resolution contracts ───────────────────────────────────────────────────

export interface DataRealityAdvisorPrimarySubjectResolution {
  readonly subjectKind: DataRealityAdvisorSubjectKind;
  readonly subjectId?: string;
  readonly reason: string;
}

export interface DataRealityAwareAdvisorContextResolutionResult {
  readonly context: DataRealityAwareAdvisorContext;
  readonly primarySubject: DataRealityAdvisorPrimarySubjectResolution;
  readonly requestedIntent?: DataRealityAdvisorIntentKind;
  readonly requestedIntentAvailable: boolean;
  readonly resolutionReasons: readonly string[];
}

export interface ResolveDataRealityAdvisorAvailableIntentsInput {
  readonly primarySubject: DataRealityAdvisorPrimarySubjectResolution;
  readonly focusedObjectId?: string;
  readonly hasValidFocus: boolean;
  readonly currentWorkspace?: string;
  readonly currentGoalId?: string;
  readonly currentScenarioId?: string;
  readonly currentDecisionId?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function attentionRank(attention: DataRealityAdvisorAttentionLevel): number {
  const rank = DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER.indexOf(attention);
  return rank === -1
    ? DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER.length
    : rank;
}

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function knownSubjectIds(
  reality: DataRealityExecutiveObservationResolutionResult,
): ReadonlySet<string> {
  return new Set(reality.observedSubjectIds);
}

function isKnownSubject(
  subjectId: string,
  known: ReadonlySet<string>,
): boolean {
  return known.has(subjectId);
}

/**
 * Deduplicate selection while preserving first-seen order.
 * Unknown IDs are recorded but do not create reality.
 */
export function resolveDataRealityAdvisorSelectedObjectIds(
  selectedObjectIds: readonly string[] | undefined,
  knownSubjectIdsSet: ReadonlySet<string>,
): {
  readonly selectedObjectIds: readonly string[];
  readonly unknownSelectedObjectIds: readonly string[];
} {
  const selected: string[] = [];
  const unknown: string[] = [];
  const seen = new Set<string>();

  for (const id of selectedObjectIds ?? []) {
    if (seen.has(id)) continue;
    seen.add(id);
    if (isKnownSubject(id, knownSubjectIdsSet)) {
      selected.push(id);
    } else {
      unknown.push(id);
    }
  }

  return Object.freeze({
    selectedObjectIds: Object.freeze(selected),
    unknownSelectedObjectIds: Object.freeze(unknown),
  });
}

function workspaceKind(
  currentWorkspace: string | undefined,
): "problem" | "goal" | "scenario" | "decision" | "execution" | "other" | undefined {
  if (!currentWorkspace) return undefined;
  const normalized = currentWorkspace.trim().toLowerCase();
  if (normalized === "problem") return "problem";
  if (normalized === "goal") return "goal";
  if (normalized === "scenario") return "scenario";
  if (normalized === "decision") return "decision";
  if (normalized === "execution") return "execution";
  return "other";
}

function highestAttentionObservation(
  observations: readonly DataRealityExecutiveObservation[],
  candidateIds?: ReadonlySet<string>,
): DataRealityExecutiveObservation | undefined {
  let best: DataRealityExecutiveObservation | undefined;
  for (const observation of observations) {
    if (candidateIds && !candidateIds.has(observation.subjectId)) continue;
    if (!best) {
      best = observation;
      continue;
    }
    const rankDelta =
      attentionRank(observation.attention) - attentionRank(best.attention);
    if (rankDelta < 0) {
      best = observation;
      continue;
    }
    if (
      rankDelta === 0 &&
      observation.subjectId.localeCompare(best.subjectId) < 0
    ) {
      best = observation;
    }
  }
  return best;
}

// ─── Context identity ───────────────────────────────────────────────────────

export function buildDataRealityAwareAdvisorContextId(input: {
  readonly snapshotId?: string;
  readonly focusedObjectId?: string;
  readonly selectedObjectIds: readonly string[];
  readonly currentWorkspace?: string;
  readonly currentGoalId?: string;
  readonly currentScenarioId?: string;
  readonly currentDecisionId?: string;
  readonly requestedIntent?: DataRealityAdvisorIntentKind;
}): string {
  const selected =
    input.selectedObjectIds.length === 0
      ? "none"
      : input.selectedObjectIds.map(normalizeToken).join("+");

  return [
    "advisor-context",
    `snapshot-${normalizeToken(input.snapshotId)}`,
    `focus-${normalizeToken(input.focusedObjectId)}`,
    `sel-${selected}`,
    `ws-${normalizeToken(input.currentWorkspace)}`,
    `goal-${normalizeToken(input.currentGoalId)}`,
    `scenario-${normalizeToken(input.currentScenarioId)}`,
    `decision-${normalizeToken(input.currentDecisionId)}`,
    `intent-${normalizeToken(input.requestedIntent)}`,
  ].join(":");
}

// ─── Primary subject ────────────────────────────────────────────────────────

export function resolveDataRealityAdvisorPrimarySubject(input: {
  readonly focusedObjectId?: string;
  readonly hasValidFocus: boolean;
  readonly currentDecisionId?: string;
  readonly currentScenarioId?: string;
  readonly currentGoalId?: string;
  readonly selectedObjectIds: readonly string[];
  readonly observations: readonly DataRealityExecutiveObservation[];
}): DataRealityAdvisorPrimarySubjectResolution {
  if (input.hasValidFocus && input.focusedObjectId) {
    return Object.freeze({
      subjectKind: "object",
      subjectId: input.focusedObjectId,
      reason: "focused-object",
    });
  }

  if (input.currentDecisionId) {
    return Object.freeze({
      subjectKind: "decision",
      subjectId: input.currentDecisionId,
      reason: "current-decision",
    });
  }

  if (input.currentScenarioId) {
    return Object.freeze({
      subjectKind: "scenario",
      subjectId: input.currentScenarioId,
      reason: "current-scenario",
    });
  }

  if (input.currentGoalId) {
    return Object.freeze({
      subjectKind: "goal",
      subjectId: input.currentGoalId,
      reason: "current-goal",
    });
  }

  const selectedSet = new Set(input.selectedObjectIds);
  const selectedBest = highestAttentionObservation(
    input.observations,
    selectedSet.size > 0 ? selectedSet : undefined,
  );
  if (selectedSet.size > 0 && selectedBest) {
    return Object.freeze({
      subjectKind: "object",
      subjectId: selectedBest.subjectId,
      reason: "highest-attention-selected-object",
    });
  }

  const observedBest = highestAttentionObservation(input.observations);
  if (observedBest) {
    return Object.freeze({
      subjectKind: "object",
      subjectId: observedBest.subjectId,
      reason: "highest-attention-observed-object",
    });
  }

  return Object.freeze({
    subjectKind: "enterprise",
    reason: "fallback-subject:enterprise",
  });
}

// ─── Available intents ──────────────────────────────────────────────────────

const ENTERPRISE_INTENTS = Object.freeze([
  "observe",
  "explain",
  "investigate",
  "compare",
  "prioritize",
] as const satisfies readonly DataRealityAdvisorIntentKind[]);

const FOCUSED_OBJECT_INTENTS = Object.freeze([
  "observe",
  "explain",
  "investigate",
  "compare",
  "prioritize",
  "recommend",
] as const satisfies readonly DataRealityAdvisorIntentKind[]);

const SCENARIO_INTENTS = Object.freeze([
  "observe",
  "explain",
  "investigate",
  "compare",
  "simulate",
] as const satisfies readonly DataRealityAdvisorIntentKind[]);

const DECISION_INTENTS = Object.freeze([
  "observe",
  "explain",
  "investigate",
  "compare",
  "prioritize",
  "recommend",
  "decide",
] as const satisfies readonly DataRealityAdvisorIntentKind[]);

const EXECUTION_INTENTS = Object.freeze([
  "observe",
  "explain",
  "investigate",
  "prioritize",
  "act",
] as const satisfies readonly DataRealityAdvisorIntentKind[]);

function addIntents(
  target: Set<DataRealityAdvisorIntentKind>,
  intents: readonly DataRealityAdvisorIntentKind[],
): void {
  for (const intent of intents) target.add(intent);
}

/**
 * Available intents are controlled by resolved context, never by requested
 * intent alone. Requested intent expresses direction only.
 */
export function resolveDataRealityAdvisorAvailableIntents(
  input: ResolveDataRealityAdvisorAvailableIntentsInput,
): readonly DataRealityAdvisorIntentKind[] {
  const intents = new Set<DataRealityAdvisorIntentKind>();
  const workspace = workspaceKind(input.currentWorkspace);

  addIntents(intents, ENTERPRISE_INTENTS);

  if (input.hasValidFocus || input.primarySubject.subjectKind === "object") {
    addIntents(intents, FOCUSED_OBJECT_INTENTS);
  }

  if (input.currentScenarioId || workspace === "scenario") {
    addIntents(intents, SCENARIO_INTENTS);
  }

  if (input.currentDecisionId || workspace === "decision") {
    addIntents(intents, DECISION_INTENTS);
  }

  if (workspace === "execution") {
    addIntents(intents, EXECUTION_INTENTS);
  }

  if (input.currentGoalId || workspace === "goal") {
    addIntents(intents, ENTERPRISE_INTENTS);
  }

  const ordered = DATA_REALITY_ADVISOR_INTENT_KINDS.filter((intent) =>
    intents.has(intent),
  );
  return Object.freeze(ordered);
}

// ─── Relevant observations / evidence ───────────────────────────────────────

function observationRelevanceRank(
  observation: DataRealityExecutiveObservation,
  primarySubjectId: string | undefined,
  selectedObjectIds: ReadonlySet<string>,
): number {
  if (primarySubjectId && observation.subjectId === primarySubjectId) {
    return -200;
  }
  if (selectedObjectIds.has(observation.subjectId)) {
    return -100 + attentionRank(observation.attention);
  }
  return attentionRank(observation.attention);
}

export function resolveDataRealityAdvisorRelevantObservations(input: {
  readonly observations: readonly DataRealityExecutiveObservation[];
  readonly primarySubjectId?: string;
  readonly selectedObjectIds: readonly string[];
}): readonly DataRealityExecutiveObservation[] {
  const selected = new Set(input.selectedObjectIds);
  const ordered = [...input.observations].sort((a, b) => {
    const rankDelta =
      observationRelevanceRank(a, input.primarySubjectId, selected) -
      observationRelevanceRank(b, input.primarySubjectId, selected);
    if (rankDelta !== 0) return rankDelta;
    return a.subjectId.localeCompare(b.subjectId);
  });
  return Object.freeze(ordered.map((observation) => Object.freeze({
    ...observation,
    evidenceIds: Object.freeze([...observation.evidenceIds]),
  })));
}

export function resolveDataRealityAdvisorRelevantEvidence(input: {
  readonly evidence: readonly DataRealityAdvisorEvidence[];
  readonly observations: readonly DataRealityExecutiveObservation[];
  readonly primarySubjectId?: string;
  readonly selectedObjectIds: readonly string[];
}): readonly DataRealityAdvisorEvidence[] {
  const selected = new Set(input.selectedObjectIds);
  const observationOrder = new Map<string, number>();
  input.observations.forEach((observation, index) => {
    observationOrder.set(observation.subjectId, index);
  });

  const referencedIds = new Set<string>();
  for (const observation of input.observations) {
    for (const evidenceId of observation.evidenceIds) {
      referencedIds.add(evidenceId);
    }
  }

  const ordered = [...input.evidence].sort((a, b) => {
    const primaryA =
      input.primarySubjectId && a.subjectId === input.primarySubjectId ? 0 : 1;
    const primaryB =
      input.primarySubjectId && b.subjectId === input.primarySubjectId ? 0 : 1;
    if (primaryA !== primaryB) return primaryA - primaryB;

    const selectedA = selected.has(a.subjectId) ? 0 : 1;
    const selectedB = selected.has(b.subjectId) ? 0 : 1;
    if (selectedA !== selectedB) return selectedA - selectedB;

    const obsA = observationOrder.get(a.subjectId) ?? Number.MAX_SAFE_INTEGER;
    const obsB = observationOrder.get(b.subjectId) ?? Number.MAX_SAFE_INTEGER;
    if (obsA !== obsB) return obsA - obsB;

    return a.id.localeCompare(b.id);
  });

  // Preserve full evidence set so observation.evidenceIds never dangle.
  void referencedIds;
  return Object.freeze(ordered.map((item) => Object.freeze({ ...item })));
}

// ─── Primary APIs ───────────────────────────────────────────────────────────

function buildResolutionReasons(input: {
  readonly primarySubject: DataRealityAdvisorPrimarySubjectResolution;
  readonly selectedObjectIds: readonly string[];
  readonly unknownSelectedObjectIds: readonly string[];
  readonly invalidFocusId?: string;
  readonly dominantState: string;
  readonly dominantAttention: string;
  readonly currentWorkspace?: string;
  readonly currentGoalId?: string;
  readonly currentScenarioId?: string;
  readonly currentDecisionId?: string;
  readonly requestedIntent?: DataRealityAdvisorIntentKind;
  readonly requestedIntentAvailable: boolean;
}): readonly string[] {
  const reasons: string[] = [];

  if (input.invalidFocusId) {
    reasons.push(`invalid-focus:${input.invalidFocusId}`);
  }

  reasons.push(
    `primary-subject:${input.primarySubject.reason}${
      input.primarySubject.subjectId
        ? `:${input.primarySubject.subjectId}`
        : ""
    }`,
  );

  for (const selectedId of input.selectedObjectIds) {
    reasons.push(`selected-subject:${selectedId}`);
  }
  for (const unknownId of input.unknownSelectedObjectIds) {
    reasons.push(`unknown-selection:${unknownId}`);
  }

  reasons.push(`dominant-state:${input.dominantState}`);
  reasons.push(`dominant-attention:${input.dominantAttention}`);

  if (input.currentWorkspace) {
    reasons.push(`workspace:${normalizeToken(input.currentWorkspace)}`);
  }
  if (input.currentGoalId) {
    reasons.push(`goal:${input.currentGoalId}`);
  }
  if (input.currentScenarioId) {
    reasons.push(`scenario:${input.currentScenarioId}`);
  }
  if (input.currentDecisionId) {
    reasons.push(`decision:${input.currentDecisionId}`);
  }

  if (input.requestedIntent) {
    reasons.push(`requested-intent:${input.requestedIntent}`);
    reasons.push(
      input.requestedIntentAvailable
        ? "requested-intent:available"
        : "requested-intent:unavailable",
    );
  }

  if (input.primarySubject.reason === "fallback-subject:enterprise") {
    reasons.push("fallback-subject:enterprise");
  }

  return Object.freeze(reasons);
}

/**
 * Detailed P1:3 resolution API for architecture, testing, and debugging.
 */
export function resolveDataRealityAwareAdvisorContext(
  input: BuildDataRealityAwareAdvisorContextInput,
): DataRealityAwareAdvisorContextResolutionResult {
  const reality = resolveDataRealityExecutiveObservationResolution({
    snapshot: input.dataRealitySnapshot,
    focusedObjectId: input.focusedObjectId,
    selectedObjectIds: input.selectedObjectIds,
  });

  const known = knownSubjectIds(reality);
  const invalidFocusId =
    input.focusedObjectId && !isKnownSubject(input.focusedObjectId, known)
      ? input.focusedObjectId
      : undefined;
  const hasValidFocus = Boolean(
    input.focusedObjectId && !invalidFocusId,
  );
  const resolvedFocusId = hasValidFocus ? input.focusedObjectId : undefined;

  const selection = resolveDataRealityAdvisorSelectedObjectIds(
    input.selectedObjectIds,
    known,
  );

  const primarySubject = resolveDataRealityAdvisorPrimarySubject({
    focusedObjectId: resolvedFocusId,
    hasValidFocus,
    currentDecisionId: input.currentDecisionId,
    currentScenarioId: input.currentScenarioId,
    currentGoalId: input.currentGoalId,
    selectedObjectIds: selection.selectedObjectIds,
    observations: reality.observations,
  });

  const availableIntents = resolveDataRealityAdvisorAvailableIntents({
    primarySubject,
    focusedObjectId: resolvedFocusId,
    hasValidFocus,
    currentWorkspace: input.currentWorkspace,
    currentGoalId: input.currentGoalId,
    currentScenarioId: input.currentScenarioId,
    currentDecisionId: input.currentDecisionId,
  });

  const requestedIntent = isDataRealityAdvisorIntentKind(input.requestedIntent)
    ? input.requestedIntent
    : undefined;
  const requestedIntentAvailable = requestedIntent
    ? availableIntents.includes(requestedIntent)
    : false;

  const observations = resolveDataRealityAdvisorRelevantObservations({
    observations: reality.observations,
    primarySubjectId: primarySubject.subjectId,
    selectedObjectIds: selection.selectedObjectIds,
  });

  const evidence = resolveDataRealityAdvisorRelevantEvidence({
    evidence: reality.evidence,
    observations,
    primarySubjectId: primarySubject.subjectId,
    selectedObjectIds: selection.selectedObjectIds,
  });

  const snapshotId = reality.snapshotId ?? input.dataRealitySnapshot.datasetId;
  const contextId = buildDataRealityAwareAdvisorContextId({
    snapshotId,
    focusedObjectId: resolvedFocusId,
    selectedObjectIds: selection.selectedObjectIds,
    currentWorkspace: input.currentWorkspace,
    currentGoalId: input.currentGoalId,
    currentScenarioId: input.currentScenarioId,
    currentDecisionId: input.currentDecisionId,
    requestedIntent,
  });

  const resolutionReasons = buildResolutionReasons({
    primarySubject,
    selectedObjectIds: selection.selectedObjectIds,
    unknownSelectedObjectIds: selection.unknownSelectedObjectIds,
    invalidFocusId,
    dominantState: reality.dominantState,
    dominantAttention: reality.dominantAttention,
    currentWorkspace: input.currentWorkspace,
    currentGoalId: input.currentGoalId,
    currentScenarioId: input.currentScenarioId,
    currentDecisionId: input.currentDecisionId,
    requestedIntent,
    requestedIntentAvailable,
  });

  const context: DataRealityAwareAdvisorContext = Object.freeze({
    contextId,
    datasetId: input.dataRealitySnapshot.datasetId,
    snapshotId,
    ...(resolvedFocusId !== undefined
      ? { focusedObjectId: resolvedFocusId }
      : {}),
    selectedObjectIds: selection.selectedObjectIds,
    primarySubjectKind: primarySubject.subjectKind,
    ...(primarySubject.subjectId !== undefined
      ? { primarySubjectId: primarySubject.subjectId }
      : {}),
    dominantState: reality.dominantState,
    attention: reality.dominantAttention,
    observations,
    evidence,
    questions: Object.freeze([]),
    advisoryCandidates: Object.freeze([]),
    availableIntents,
  });

  return Object.freeze({
    context,
    primarySubject,
    ...(requestedIntent !== undefined ? { requestedIntent } : {}),
    requestedIntentAvailable,
    resolutionReasons,
  });
}

/**
 * Primary P1:3 consumer API.
 * Returns the canonical DataRealityAwareAdvisorContext only.
 */
export function buildDataRealityAwareAdvisorContext(
  input: BuildDataRealityAwareAdvisorContextInput,
): DataRealityAwareAdvisorContext {
  return resolveDataRealityAwareAdvisorContext(input).context;
}
