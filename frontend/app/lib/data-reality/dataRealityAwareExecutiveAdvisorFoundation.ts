/**
 * P1:1 — Data-Reality-Aware Executive Advisor Foundation.
 *
 * Canonical types, vocabulary, contracts, identities, and invariants for a
 * Data-Reality-Aware Executive Advisor. Interpretation layer over certified
 * P0 Data Reality — not a second KPI engine, state resolver, or normalizer.
 *
 * Chain consumed (not rebuilt):
 *   NexoraDataset → normalizeDatasetToBusinessFacts
 *   → bindBusinessFactsToNexoraObjects → computeNexoraKPIs
 *   → resolveObjectExecutiveStates → NexoraDataRealitySnapshot
 *   → projectDataRealityToExecutiveRuntime → Stage presentation
 *
 * Foundation only: no LLM, chat UI, ranking, scenario creation, or actions.
 */

import type { NexoraDataRealitySnapshot } from "./dataRealityContracts.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityAwareExecutiveAdvisorFoundationIdentity =
  "P1:1/DataRealityAwareExecutiveAdvisorFoundation" as const;

export const dataRealityAwareExecutiveAdvisorFoundationVersion =
  "1.0.0" as const;

export const dataRealityAwareExecutiveAdvisorFoundationNamespace =
  "nexora.data-reality.executive-advisor.foundation" as const;

export const dataRealityAwareExecutiveAdvisorFoundationPhase =
  "Foundation" as const;

export const dataRealityAwareExecutiveAdvisorFoundationArchitecturalRole =
  "DataRealityAwareExecutiveAdvisorFoundation" as const;

export interface DataRealityAwareExecutiveAdvisorFoundationIdentity {
  readonly identity: "P1:1/DataRealityAwareExecutiveAdvisorFoundation";
  readonly version: "1.0.0";
  readonly namespace: "nexora.data-reality.executive-advisor.foundation";
  readonly phase: "Foundation";
  readonly architecturalRole: "DataRealityAwareExecutiveAdvisorFoundation";
}

const IDENTITY: DataRealityAwareExecutiveAdvisorFoundationIdentity =
  Object.freeze({
    identity: dataRealityAwareExecutiveAdvisorFoundationIdentity,
    version: dataRealityAwareExecutiveAdvisorFoundationVersion,
    namespace: dataRealityAwareExecutiveAdvisorFoundationNamespace,
    phase: dataRealityAwareExecutiveAdvisorFoundationPhase,
    architecturalRole:
      dataRealityAwareExecutiveAdvisorFoundationArchitecturalRole,
  });

export function getDataRealityAwareExecutiveAdvisorFoundationIdentity(): DataRealityAwareExecutiveAdvisorFoundationIdentity {
  return IDENTITY;
}

// ─── Advisor principle ──────────────────────────────────────────────────────

/**
 * Core principle: The Executive Advisor must reason from certified executive
 * reality before generating advisory meaning.
 */
export const DATA_REALITY_AWARE_ADVISOR_CORE_PRINCIPLE =
  "The Executive Advisor must reason from certified executive reality before generating advisory meaning." as const;

export const DATA_REALITY_AWARE_ADVISOR_FOUNDATION_PRINCIPLES = Object.freeze([
  "Reality before Advice",
  "Evidence before Recommendation",
  "Executive Meaning before Conversation",
  "Object Context before Generic Explanation",
  "Deterministic Context before Generative Language",
] as const);

export type DataRealityAwareAdvisorFoundationPrinciple =
  (typeof DATA_REALITY_AWARE_ADVISOR_FOUNDATION_PRINCIPLES)[number];

// ─── Canonical advisor subject kinds ────────────────────────────────────────

export const DATA_REALITY_ADVISOR_SUBJECT_KINDS = Object.freeze([
  "enterprise",
  "goal",
  "object",
  "kpi",
  "issue",
  "risk",
  "opportunity",
  "scenario",
  "decision",
  "execution",
] as const);

export type DataRealityAdvisorSubjectKind =
  (typeof DATA_REALITY_ADVISOR_SUBJECT_KINDS)[number];

// ─── Advisor reality states ─────────────────────────────────────────────────

/**
 * Canonical reality interpretation states.
 * Later layers derive these from certified P0 executive reality —
 * do not infer directly from raw dataset values.
 */
export const DATA_REALITY_ADVISOR_STATES = Object.freeze([
  "unresolved",
  "stable",
  "watch",
  "risk",
  "critical",
  "opportunity",
] as const);

export type DataRealityAdvisorState =
  (typeof DATA_REALITY_ADVISOR_STATES)[number];

export const DATA_REALITY_ADVISOR_STATE_MEANING = Object.freeze({
  unresolved: "insufficient certified reality exists",
  stable: "no meaningful executive intervention currently indicated",
  watch: "meaningful change or pressure deserves attention",
  risk: "evidence indicates material executive risk",
  critical: "immediate or high-severity executive attention may be required",
  opportunity: "evidence indicates favorable potential worth executive attention",
} as const satisfies Record<DataRealityAdvisorState, string>);

// ─── Advisor intent kinds ───────────────────────────────────────────────────

export const DATA_REALITY_ADVISOR_INTENT_KINDS = Object.freeze([
  "observe",
  "explain",
  "investigate",
  "compare",
  "prioritize",
  "recommend",
  "simulate",
  "decide",
  "act",
] as const);

export type DataRealityAdvisorIntentKind =
  (typeof DATA_REALITY_ADVISOR_INTENT_KINDS)[number];

export const DATA_REALITY_ADVISOR_INTENT_MEANING = Object.freeze({
  observe: "What is happening?",
  explain: "Why is it happening?",
  investigate: "What should be examined next?",
  compare: "How does this compare with another object/state/time/scenario?",
  prioritize: "What deserves executive attention first?",
  recommend: "What response should be considered?",
  simulate: "What could happen under alternative assumptions/actions?",
  decide: "What decision needs to be made?",
  act: "What approved action should be executed or communicated?",
} as const satisfies Record<DataRealityAdvisorIntentKind, string>);

// ─── Executive attention level ──────────────────────────────────────────────

/** Executive relevance — not visual styling, CSS, or Three.js. */
export const DATA_REALITY_ADVISOR_ATTENTION_LEVELS = Object.freeze([
  "none",
  "low",
  "medium",
  "high",
  "immediate",
] as const);

export type DataRealityAdvisorAttentionLevel =
  (typeof DATA_REALITY_ADVISOR_ATTENTION_LEVELS)[number];

// ─── Evidence ───────────────────────────────────────────────────────────────

export const DATA_REALITY_ADVISOR_EVIDENCE_SOURCE_KINDS = Object.freeze([
  "business-fact",
  "kpi",
  "executive-state",
  "object-binding",
  "trend",
  "comparison",
  "relationship",
] as const);

export type DataRealityAdvisorEvidenceSourceKind =
  (typeof DATA_REALITY_ADVISOR_EVIDENCE_SOURCE_KINDS)[number];

/**
 * Traceable evidence referencing certified P0 outputs where possible.
 * Must not contain hidden reasoning or LLM-generated claims as facts.
 */
export interface DataRealityAdvisorEvidence {
  readonly id: string;
  readonly sourceKind: DataRealityAdvisorEvidenceSourceKind;
  readonly subjectId: string;
  readonly label: string;
  readonly summary: string;
  readonly value?: number | string | boolean;
  readonly unit?: string;
  readonly confidence?: number;
  readonly sourceReference?: string;
}

// ─── Executive observation ──────────────────────────────────────────────────

/**
 * Observation is not a recommendation.
 * Holds executive meaning derived from certified reality + evidence.
 */
export interface DataRealityExecutiveObservation {
  readonly id: string;
  readonly subjectKind: DataRealityAdvisorSubjectKind;
  readonly subjectId: string;
  readonly state: DataRealityAdvisorState;
  readonly attention: DataRealityAdvisorAttentionLevel;
  readonly headline: string;
  readonly executiveMeaning: string;
  readonly evidenceIds: readonly string[];
}

// ─── Advisor question ───────────────────────────────────────────────────────

export interface DataRealityAdvisorQuestion {
  readonly id: string;
  readonly subjectId?: string;
  readonly intent: DataRealityAdvisorIntentKind;
  readonly question: string;
  readonly evidenceIds: readonly string[];
}

// ─── Advisory candidate ─────────────────────────────────────────────────────

/**
 * Non-final advisory candidate — not an approved recommendation.
 * Later phases may rank, suppress, compose, or transform candidates.
 */
export interface DataRealityAdvisoryCandidate {
  readonly id: string;
  readonly intent: DataRealityAdvisorIntentKind;
  readonly subjectKind: DataRealityAdvisorSubjectKind;
  readonly subjectId: string;
  readonly title: string;
  readonly rationale: string;
  readonly evidenceIds: readonly string[];
  readonly attention: DataRealityAdvisorAttentionLevel;
}

// ─── Advisor context ────────────────────────────────────────────────────────

/**
 * Central canonical advisor context.
 * No React state, UI, Three.js, LLM messages, prompts, or mutable runtime refs.
 */
export interface DataRealityAwareAdvisorContext {
  readonly contextId: string;
  readonly datasetId?: string;
  readonly snapshotId?: string;
  readonly focusedObjectId?: string;
  readonly selectedObjectIds: readonly string[];
  readonly primarySubjectKind: DataRealityAdvisorSubjectKind;
  readonly primarySubjectId?: string;
  readonly dominantState: DataRealityAdvisorState;
  readonly attention: DataRealityAdvisorAttentionLevel;
  readonly observations: readonly DataRealityExecutiveObservation[];
  readonly evidence: readonly DataRealityAdvisorEvidence[];
  readonly questions: readonly DataRealityAdvisorQuestion[];
  readonly advisoryCandidates: readonly DataRealityAdvisoryCandidate[];
  readonly availableIntents: readonly DataRealityAdvisorIntentKind[];
  readonly generatedAt?: string;
}

/**
 * Input for later builders that project certified Data Reality into advisor context.
 * Consumes the canonical P0 snapshot type — does not redefine it.
 */
export interface BuildDataRealityAwareAdvisorContextInput {
  readonly dataRealitySnapshot: NexoraDataRealitySnapshot;
  readonly focusedObjectId?: string;
  readonly selectedObjectIds?: readonly string[];
  readonly requestedIntent?: DataRealityAdvisorIntentKind;
  readonly currentWorkspace?: string;
  readonly currentGoalId?: string;
  readonly currentScenarioId?: string;
  readonly currentDecisionId?: string;
}

// ─── Foundation capabilities ────────────────────────────────────────────────

export const DATA_REALITY_AWARE_ADVISOR_FOUNDATION_CAPABILITIES = Object.freeze([
  "consume-certified-data-reality",
  "identify-executive-subject",
  "represent-executive-observation",
  "represent-evidence",
  "represent-attention",
  "represent-advisor-intent",
  "represent-executive-question",
  "represent-advisory-candidate",
  "support-object-aware-advisory-context",
  "support-stage-advisor-synchronization",
] as const);

export type DataRealityAwareExecutiveAdvisorFoundationCapability =
  (typeof DATA_REALITY_AWARE_ADVISOR_FOUNDATION_CAPABILITIES)[number];

// ─── Foundation invariants ──────────────────────────────────────────────────

export const DATA_REALITY_AWARE_ADVISOR_FOUNDATION_INVARIANTS = Object.freeze([
  "Advisor reality must originate from certified Data Reality.",
  "Raw dataset values must not bypass the P0 reality pipeline.",
  "KPI calculations must not be duplicated in P1.",
  "Executive-state resolution must not be duplicated in P1.",
  "Evidence and advisory meaning must remain distinguishable.",
  "Observations must remain distinguishable from recommendations.",
  "Advisory candidates must remain distinguishable from approved decisions.",
  "Missing reality must resolve to unresolved, never fabricated certainty.",
  "P1 must remain deterministic until a generative-language boundary is explicitly introduced.",
  "Generative language must never become the source of executive truth.",
  "Focused-object context must be able to narrow Advisor interpretation without mutating the underlying Data Reality snapshot.",
  "Advisor context must remain independent from rendering technology.",
  "Stage and Advisor must be able to consume the same executive reality without creating separate truth models.",
  "No React, Three.js, UI, network, database, or LLM dependency is allowed in P1:1.",
  "All exported constant registries must be immutable.",
] as const);

// ─── Foundation metadata ────────────────────────────────────────────────────

export interface DataRealityAwareExecutiveAdvisorFoundationMetadata {
  readonly identity: DataRealityAwareExecutiveAdvisorFoundationIdentity;
  readonly capabilities: readonly DataRealityAwareExecutiveAdvisorFoundationCapability[];
  readonly invariants: readonly string[];
  readonly principles: readonly string[];
}

const METADATA: DataRealityAwareExecutiveAdvisorFoundationMetadata =
  Object.freeze({
    identity: IDENTITY,
    capabilities: DATA_REALITY_AWARE_ADVISOR_FOUNDATION_CAPABILITIES,
    invariants: DATA_REALITY_AWARE_ADVISOR_FOUNDATION_INVARIANTS,
    principles: DATA_REALITY_AWARE_ADVISOR_FOUNDATION_PRINCIPLES,
  });

export function getDataRealityAwareExecutiveAdvisorFoundationMetadata(): DataRealityAwareExecutiveAdvisorFoundationMetadata {
  return METADATA;
}

// ─── Type guards ────────────────────────────────────────────────────────────

export function isDataRealityAdvisorSubjectKind(
  value: unknown,
): value is DataRealityAdvisorSubjectKind {
  return (DATA_REALITY_ADVISOR_SUBJECT_KINDS as readonly unknown[]).includes(
    value,
  );
}

export function isDataRealityAdvisorState(
  value: unknown,
): value is DataRealityAdvisorState {
  return (DATA_REALITY_ADVISOR_STATES as readonly unknown[]).includes(value);
}

export function isDataRealityAdvisorIntentKind(
  value: unknown,
): value is DataRealityAdvisorIntentKind {
  return (DATA_REALITY_ADVISOR_INTENT_KINDS as readonly unknown[]).includes(
    value,
  );
}

export function isDataRealityAdvisorAttentionLevel(
  value: unknown,
): value is DataRealityAdvisorAttentionLevel {
  return (
    DATA_REALITY_ADVISOR_ATTENTION_LEVELS as readonly unknown[]
  ).includes(value);
}

export function isDataRealityAdvisorEvidenceSourceKind(
  value: unknown,
): value is DataRealityAdvisorEvidenceSourceKind {
  return (
    DATA_REALITY_ADVISOR_EVIDENCE_SOURCE_KINDS as readonly unknown[]
  ).includes(value);
}
