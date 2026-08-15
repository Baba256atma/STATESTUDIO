/**
 * P1:4 — Executive Advisory Candidate & Guidance Resolution.
 *
 * Deterministic bridge from P1:3 DataRealityAwareAdvisorContext into advisory
 * candidates and executive guidance.
 *
 * Answers: Given what Nexora currently knows, what deserves executive
 * consideration next?
 * Does not approve decisions, execute actions, or call generative AI.
 *
 * Chain:
 *   P0 Data Reality
 *   → P1:2 Evidence + Observation
 *   → P1:3 Advisor Context
 *   → P1:4 Advisory Candidate & Guidance Resolution
 */

import type {
  DataRealityAdvisorAttentionLevel,
  DataRealityAdvisorIntentKind,
  DataRealityAdvisorState,
  DataRealityAdvisorSubjectKind,
  DataRealityAdvisoryCandidate,
  DataRealityAwareAdvisorContext,
  DataRealityExecutiveObservation,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import { isDataRealityAdvisorIntentKind } from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import { DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER } from "./dataRealityExecutiveObservationResolution.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityExecutiveAdvisoryResolutionIdentity =
  "P1:4/ExecutiveAdvisoryCandidateGuidanceResolution" as const;

export const dataRealityExecutiveAdvisoryResolutionVersion = "1.0.0" as const;

export const dataRealityExecutiveAdvisoryResolutionNamespace =
  "nexora.data-reality.executive-advisor.advisory-resolution" as const;

export const dataRealityExecutiveAdvisoryResolutionPhase =
  "AdvisoryCandidateGuidanceResolution" as const;

export const dataRealityExecutiveAdvisoryResolutionArchitecturalRole =
  "ExecutiveAdvisoryCandidateGuidanceResolver" as const;

export interface DataRealityExecutiveAdvisoryResolutionIdentity {
  readonly identity: "P1:4/ExecutiveAdvisoryCandidateGuidanceResolution";
  readonly version: "1.0.0";
  readonly namespace: "nexora.data-reality.executive-advisor.advisory-resolution";
  readonly phase: "AdvisoryCandidateGuidanceResolution";
  readonly architecturalRole: "ExecutiveAdvisoryCandidateGuidanceResolver";
}

const IDENTITY: DataRealityExecutiveAdvisoryResolutionIdentity = Object.freeze({
  identity: dataRealityExecutiveAdvisoryResolutionIdentity,
  version: dataRealityExecutiveAdvisoryResolutionVersion,
  namespace: dataRealityExecutiveAdvisoryResolutionNamespace,
  phase: dataRealityExecutiveAdvisoryResolutionPhase,
  architecturalRole: dataRealityExecutiveAdvisoryResolutionArchitecturalRole,
});

export function getDataRealityExecutiveAdvisoryResolutionIdentity(): DataRealityExecutiveAdvisoryResolutionIdentity {
  return IDENTITY;
}

// ─── Principles / capabilities / invariants ─────────────────────────────────

export const DATA_REALITY_EXECUTIVE_ADVISORY_CORE_PRINCIPLE =
  "Advice must emerge from Context, not bypass Reality." as const;

export const DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_PRINCIPLES =
  Object.freeze([
    "Reality before Guidance",
    "Evidence before Advice",
    "Observation before Recommendation",
    "Risk before Action",
    "Unresolved before Assumption",
    "Candidate before Decision",
    "Guidance before Execution",
    "Deterministic Advice before Generative Language",
  ] as const);

export type DataRealityExecutiveAdvisoryResolutionPrinciple =
  (typeof DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_PRINCIPLES)[number];

export const DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_CAPABILITIES =
  Object.freeze([
    "consume-data-reality-aware-advisor-context",
    "resolve-advisory-candidates",
    "resolve-executive-guidance",
    "resolve-investigation-direction",
    "resolve-prioritization-direction",
    "resolve-recommendation-candidates",
    "resolve-simulation-guidance",
    "resolve-escalation-guidance",
    "protect-unresolved-reality",
    "rank-advisory-candidates",
    "rank-executive-guidance",
    "resolve-primary-advisory-candidate",
    "resolve-primary-executive-guidance",
    "support-requested-intent-priority",
    "preserve-evidence-traceability",
    "preserve-observation-traceability",
    "support-focus-and-severity-coexistence",
    "support-dataset-sensitive-guidance",
  ] as const);

export type DataRealityExecutiveAdvisoryResolutionCapability =
  (typeof DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_CAPABILITIES)[number];

export const DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_INVARIANTS =
  Object.freeze([
    "P1:4 consumes canonical P1:3 Advisor Context.",
    "P1:4 does not read raw datasets.",
    "P1:4 does not calculate KPIs.",
    "P1:4 does not resolve P0 executive states.",
    "P1:4 does not recreate P1:2 observations.",
    "P1:4 does not recreate P1:3 context.",
    "Every candidate originates from resolved context.",
    "Every recommendation remains a candidate.",
    "Candidate does not equal decision.",
    "Guidance does not equal execution.",
    "Unresolved reality cannot produce unsupported recommendation.",
    "Unresolved reality cannot be treated as poor performance.",
    "Stable reality cannot produce urgent escalation by default.",
    "Critical reality may produce urgent guidance.",
    "Escalation requires severe context.",
    "Simulation guidance requires available simulate intent.",
    "Recommendation requires available recommend intent.",
    "Requested intent does not grant unavailable capability.",
    "Focus affects relevance, not severity truth.",
    "Critical enterprise reality cannot be hidden by stable/watch focus.",
    "All candidate evidence references must resolve.",
    "All guidance evidence references must resolve.",
    "All guidance observation references must resolve.",
    "All source candidate references must resolve.",
    "Candidate IDs are deterministic.",
    "Guidance IDs are deterministic.",
    "Same semantic input produces same result.",
    "No randomness is allowed.",
    "No generative AI is required.",
    "No UI dependency is allowed.",
    "No execution dependency is allowed.",
    "P0 remains unchanged.",
    "P1:1 contracts remain canonical.",
    "P1:2 remains canonical for evidence/observations.",
    "P1:3 remains canonical for Advisor Context.",
  ] as const);

export interface DataRealityExecutiveAdvisoryResolutionMetadata {
  readonly identity: DataRealityExecutiveAdvisoryResolutionIdentity;
  readonly capabilities: readonly DataRealityExecutiveAdvisoryResolutionCapability[];
  readonly invariants: readonly string[];
  readonly principles: readonly string[];
}

const METADATA: DataRealityExecutiveAdvisoryResolutionMetadata = Object.freeze({
  identity: IDENTITY,
  capabilities: DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_CAPABILITIES,
  invariants: DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_INVARIANTS,
  principles: DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_PRINCIPLES,
});

export function getDataRealityExecutiveAdvisoryResolutionMetadata(): DataRealityExecutiveAdvisoryResolutionMetadata {
  return METADATA;
}

// ─── Guidance vocabulary ────────────────────────────────────────────────────

export const DATA_REALITY_EXECUTIVE_GUIDANCE_KINDS = Object.freeze([
  "monitor",
  "investigate",
  "compare",
  "prioritize",
  "recommend",
  "simulate",
  "escalate",
  "defer",
] as const);

export type DataRealityExecutiveGuidanceKind =
  (typeof DATA_REALITY_EXECUTIVE_GUIDANCE_KINDS)[number];

export const DATA_REALITY_EXECUTIVE_GUIDANCE_PRIORITIES = Object.freeze([
  "low",
  "medium",
  "high",
  "urgent",
] as const);

export type DataRealityExecutiveGuidancePriority =
  (typeof DATA_REALITY_EXECUTIVE_GUIDANCE_PRIORITIES)[number];

export const DATA_REALITY_ADVISOR_STATE_TO_GUIDANCE_PRIORITY = Object.freeze({
  stable: "low",
  unresolved: "medium",
  watch: "medium",
  opportunity: "medium",
  risk: "high",
  critical: "urgent",
} as const satisfies Record<
  DataRealityAdvisorState,
  DataRealityExecutiveGuidancePriority
>);

/** Lower rank = higher severity for ranking. */
export const DATA_REALITY_ADVISOR_STATE_ADVISORY_SEVERITY_ORDER = Object.freeze([
  "critical",
  "risk",
  "watch",
  "opportunity",
  "unresolved",
  "stable",
] as const satisfies readonly DataRealityAdvisorState[]);

export const DATA_REALITY_EXECUTIVE_GUIDANCE_PRIORITY_ORDER = Object.freeze([
  "urgent",
  "high",
  "medium",
  "low",
] as const satisfies readonly DataRealityExecutiveGuidancePriority[]);

export interface DataRealityExecutiveGuidance {
  readonly id: string;
  readonly kind: DataRealityExecutiveGuidanceKind;
  readonly subjectKind: DataRealityAdvisorSubjectKind;
  readonly subjectId: string;
  readonly priority: DataRealityExecutiveGuidancePriority;
  readonly title: string;
  readonly rationale: string;
  readonly evidenceIds: readonly string[];
  readonly observationIds: readonly string[];
  readonly sourceCandidateIds: readonly string[];
  readonly blockedByUnresolvedReality: boolean;
}

export interface ResolveDataRealityExecutiveAdvisoryInput {
  readonly context: DataRealityAwareAdvisorContext;
  readonly requestedIntent?: DataRealityAdvisorIntentKind;
  readonly maxCandidates?: number;
  readonly includeLowAttention?: boolean;
}

export interface DataRealityExecutiveAdvisoryResolutionResult {
  readonly contextId: string;
  readonly candidates: readonly DataRealityAdvisoryCandidate[];
  readonly guidance: readonly DataRealityExecutiveGuidance[];
  readonly primaryCandidateId?: string;
  readonly primaryGuidanceId?: string;
  readonly resolutionReasons: readonly string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const SUBJECT_DISPLAY_NAMES: Readonly<Record<string, string>> = Object.freeze({
  "obj-capacity": "Production",
  "obj-inventory": "Warehouse",
  "obj-delivery": "Shipping",
  "obj-customer": "Customer",
  "obj-revenue": "Revenue",
  cost: "Cost",
});

function displayNameForSubject(subjectId: string): string {
  if (SUBJECT_DISPLAY_NAMES[subjectId]) return SUBJECT_DISPLAY_NAMES[subjectId]!;
  if (subjectId.startsWith("obj-")) {
    const rest = subjectId.slice(4);
    return rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  return subjectId.charAt(0).toUpperCase() + subjectId.slice(1);
}

function attentionRank(attention: DataRealityAdvisorAttentionLevel): number {
  const rank = DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER.indexOf(attention);
  return rank === -1
    ? DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER.length
    : rank;
}

function stateSeverityRank(state: DataRealityAdvisorState): number {
  const rank = DATA_REALITY_ADVISOR_STATE_ADVISORY_SEVERITY_ORDER.indexOf(state);
  return rank === -1
    ? DATA_REALITY_ADVISOR_STATE_ADVISORY_SEVERITY_ORDER.length
    : rank;
}

function guidancePriorityRank(
  priority: DataRealityExecutiveGuidancePriority,
): number {
  const rank = DATA_REALITY_EXECUTIVE_GUIDANCE_PRIORITY_ORDER.indexOf(priority);
  return rank === -1
    ? DATA_REALITY_EXECUTIVE_GUIDANCE_PRIORITY_ORDER.length
    : rank;
}

export function resolveGuidancePriorityFromAdvisorState(
  state: DataRealityAdvisorState,
): DataRealityExecutiveGuidancePriority {
  return DATA_REALITY_ADVISOR_STATE_TO_GUIDANCE_PRIORITY[state];
}

function hasIntent(
  availableIntents: readonly DataRealityAdvisorIntentKind[],
  intent: DataRealityAdvisorIntentKind,
): boolean {
  return availableIntents.includes(intent);
}

function observationBySubject(
  context: DataRealityAwareAdvisorContext,
  subjectId: string,
): DataRealityExecutiveObservation | undefined {
  return context.observations.find((entry) => entry.subjectId === subjectId);
}

function freezeCandidate(
  candidate: DataRealityAdvisoryCandidate,
): DataRealityAdvisoryCandidate {
  return Object.freeze({
    ...candidate,
    evidenceIds: Object.freeze([...candidate.evidenceIds]),
  });
}

function freezeGuidance(
  guidance: DataRealityExecutiveGuidance,
): DataRealityExecutiveGuidance {
  return Object.freeze({
    ...guidance,
    evidenceIds: Object.freeze([...guidance.evidenceIds]),
    observationIds: Object.freeze([...guidance.observationIds]),
    sourceCandidateIds: Object.freeze([...guidance.sourceCandidateIds]),
  });
}

// ─── Candidate intent eligibility by state ──────────────────────────────────

function candidateIntentsForState(
  state: DataRealityAdvisorState,
  availableIntents: readonly DataRealityAdvisorIntentKind[],
): readonly DataRealityAdvisorIntentKind[] {
  const desired: DataRealityAdvisorIntentKind[] = [];

  switch (state) {
    case "stable":
      desired.push("observe", "compare");
      break;
    case "watch":
      desired.push("investigate", "compare", "prioritize", "recommend");
      break;
    case "risk":
      desired.push("investigate", "prioritize", "recommend", "simulate");
      break;
    case "critical":
      desired.push("prioritize", "investigate", "recommend", "simulate");
      break;
    case "opportunity":
      desired.push("investigate", "compare", "recommend", "simulate");
      break;
    case "unresolved":
      // Unresolved protection: investigate only — never recommend/assume.
      desired.push("investigate");
      break;
  }

  return Object.freeze(desired.filter((intent) => hasIntent(availableIntents, intent)));
}

function candidateTitle(
  intent: DataRealityAdvisorIntentKind,
  displayName: string,
  state: DataRealityAdvisorState,
): string {
  switch (intent) {
    case "observe":
      return `Observe ${displayName} performance`;
    case "compare":
      return `Compare ${displayName} against related operating conditions`;
    case "investigate":
      if (state === "unresolved") {
        return `Investigate missing ${displayName} performance evidence`;
      }
      if (state === "critical") {
        return `Investigate ${displayName} capacity pressure`;
      }
      return `Investigate drivers behind ${displayName} ${state} state`;
    case "prioritize":
      return `Prioritize ${displayName} executive review`;
    case "recommend":
      return `Consider evaluating ${displayName} response options`;
    case "simulate":
      return `Simulate alternatives for ${displayName}`;
    case "explain":
      return `Explain ${displayName} executive state`;
    case "decide":
      return `Identify decision needed for ${displayName}`;
    case "act":
      return `Identify approved action for ${displayName}`;
  }
}

function candidateRationale(
  intent: DataRealityAdvisorIntentKind,
  displayName: string,
  state: DataRealityAdvisorState,
  attention: DataRealityAdvisorAttentionLevel,
): string {
  switch (intent) {
    case "observe":
      return `${displayName} is currently ${state} with ${attention} attention, so continued observation is appropriate.`;
    case "compare":
      return `${displayName} is in a ${state} state, so comparison with related objects or conditions may clarify relative priority.`;
    case "investigate":
      if (state === "unresolved") {
        return `Certified KPI evidence for ${displayName} is currently insufficient, so investigation should focus on closing the evidence gap rather than assuming performance.`;
      }
      return `${displayName} is in a ${state} executive state with ${attention} attention, so further investigation should be considered before a management decision.`;
    case "prioritize":
      return `${displayName} currently carries ${attention} attention in a ${state} state, so it should be moved higher in executive review order.`;
    case "recommend":
      return `${displayName} is in a ${state} executive state with supporting evidence, so response options may be considered as advisory candidates — not approved decisions.`;
    case "simulate":
      return `${displayName} is in a ${state} state and simulation intent is available, so alternative assumptions may be evaluated before deciding.`;
    default:
      return `${displayName} is in a ${state} state with ${attention} attention, so ${intent} may be considered.`;
  }
}

function recommendationTitle(displayName: string): string {
  switch (displayName) {
    case "Production":
      return "Consider evaluating capacity relief options";
    case "Warehouse":
      return "Consider examining whether warehouse constraints require operational adjustment";
    case "Shipping":
      return "Consider reviewing shipping recovery options";
    case "Customer":
      return "Consider examining customer performance recovery options";
    case "Revenue":
      return "Consider reviewing revenue growth response options";
    default:
      return `Consider evaluating ${displayName} response options`;
  }
}

// ─── Ranking ────────────────────────────────────────────────────────────────

type RankContext = {
  readonly focusedObjectId?: string;
  readonly primarySubjectId?: string;
  readonly selectedObjectIds: ReadonlySet<string>;
  readonly requestedIntent?: DataRealityAdvisorIntentKind;
  readonly requestedIntentAvailable: boolean;
};

function subjectRelevanceBoost(
  subjectId: string,
  rankContext: RankContext,
): number {
  let boost = 0;
  if (rankContext.focusedObjectId === subjectId) boost += 40;
  if (rankContext.primarySubjectId === subjectId) boost += 20;
  if (rankContext.selectedObjectIds.has(subjectId)) boost += 10;
  return boost;
}

function candidateRankScore(
  candidate: DataRealityAdvisoryCandidate,
  observation: DataRealityExecutiveObservation | undefined,
  rankContext: RankContext,
): number {
  const state = observation?.state ?? "unresolved";
  const attention = observation?.attention ?? candidate.attention;
  let score = 1000;

  // Severity dominates so critical cannot be hidden by watch focus.
  score -= stateSeverityRank(state) * 100;
  score -= attentionRank(attention) * 10;
  score += subjectRelevanceBoost(candidate.subjectId, rankContext);

  if (
    rankContext.requestedIntentAvailable &&
    rankContext.requestedIntent === candidate.intent
  ) {
    score += 50;
  }

  // Prefer prioritize/investigate over observe for severe states.
  const intentBias: Partial<Record<DataRealityAdvisorIntentKind, number>> = {
    prioritize: 8,
    investigate: 7,
    recommend: 5,
    simulate: 4,
    compare: 3,
    observe: 1,
  };
  score += intentBias[candidate.intent] ?? 0;

  return score;
}

function compareCandidates(
  a: DataRealityAdvisoryCandidate,
  b: DataRealityAdvisoryCandidate,
  context: DataRealityAwareAdvisorContext,
  rankContext: RankContext,
): number {
  const obsA = observationBySubject(context, a.subjectId);
  const obsB = observationBySubject(context, b.subjectId);
  const scoreDelta =
    candidateRankScore(b, obsB, rankContext) -
    candidateRankScore(a, obsA, rankContext);
  if (scoreDelta !== 0) return scoreDelta;

  const severityDelta =
    stateSeverityRank(obsA?.state ?? "unresolved") -
    stateSeverityRank(obsB?.state ?? "unresolved");
  if (severityDelta !== 0) return severityDelta;

  if (a.subjectId !== b.subjectId) {
    return a.subjectId.localeCompare(b.subjectId);
  }
  return a.intent.localeCompare(b.intent);
}

function guidanceRankScore(
  guidance: DataRealityExecutiveGuidance,
  observation: DataRealityExecutiveObservation | undefined,
  rankContext: RankContext,
): number {
  let score = 1000;
  score -= guidancePriorityRank(guidance.priority) * 100;
  score -= stateSeverityRank(observation?.state ?? "unresolved") * 20;
  score += subjectRelevanceBoost(guidance.subjectId, rankContext);

  const kindBias: Partial<Record<DataRealityExecutiveGuidanceKind, number>> = {
    escalate: 10,
    prioritize: 9,
    investigate: 8,
    recommend: 6,
    simulate: 5,
    compare: 3,
    monitor: 2,
    defer: 1,
  };
  score += kindBias[guidance.kind] ?? 0;

  if (
    rankContext.requestedIntentAvailable &&
    rankContext.requestedIntent &&
    ((rankContext.requestedIntent === "investigate" &&
      guidance.kind === "investigate") ||
      (rankContext.requestedIntent === "recommend" &&
        guidance.kind === "recommend") ||
      (rankContext.requestedIntent === "simulate" &&
        guidance.kind === "simulate") ||
      (rankContext.requestedIntent === "prioritize" &&
        guidance.kind === "prioritize") ||
      (rankContext.requestedIntent === "compare" &&
        guidance.kind === "compare") ||
      (rankContext.requestedIntent === "observe" &&
        guidance.kind === "monitor"))
  ) {
    score += 40;
  }

  return score;
}

function compareGuidance(
  a: DataRealityExecutiveGuidance,
  b: DataRealityExecutiveGuidance,
  context: DataRealityAwareAdvisorContext,
  rankContext: RankContext,
): number {
  const obsA = observationBySubject(context, a.subjectId);
  const obsB = observationBySubject(context, b.subjectId);
  const scoreDelta =
    guidanceRankScore(b, obsB, rankContext) -
    guidanceRankScore(a, obsA, rankContext);
  if (scoreDelta !== 0) return scoreDelta;

  const priorityDelta =
    guidancePriorityRank(a.priority) - guidancePriorityRank(b.priority);
  if (priorityDelta !== 0) return priorityDelta;

  if (a.subjectId !== b.subjectId) {
    return a.subjectId.localeCompare(b.subjectId);
  }
  return a.kind.localeCompare(b.kind);
}

// ─── Candidate resolution ───────────────────────────────────────────────────

function buildCandidate(input: {
  readonly observation: DataRealityExecutiveObservation;
  readonly intent: DataRealityAdvisorIntentKind;
}): DataRealityAdvisoryCandidate {
  const displayName = displayNameForSubject(input.observation.subjectId);
  const title =
    input.intent === "recommend"
      ? recommendationTitle(displayName)
      : candidateTitle(input.intent, displayName, input.observation.state);

  return freezeCandidate({
    id: `candidate:${input.observation.subjectId}:${input.intent}:${input.observation.state}`,
    intent: input.intent,
    subjectKind: input.observation.subjectKind,
    subjectId: input.observation.subjectId,
    title,
    rationale: candidateRationale(
      input.intent,
      displayName,
      input.observation.state,
      input.observation.attention,
    ),
    evidenceIds: input.observation.evidenceIds,
    attention: input.observation.attention,
  });
}

function isLowAttentionCandidate(
  candidate: DataRealityAdvisoryCandidate,
  observation: DataRealityExecutiveObservation | undefined,
): boolean {
  const attention = observation?.attention ?? candidate.attention;
  const state = observation?.state ?? "stable";
  // Unresolved must remain visible for investigate/defer protection paths.
  if (state === "unresolved") return false;
  return attention === "none" || attention === "low" || state === "stable";
}

export function resolveDataRealityAdvisoryCandidates(
  input: ResolveDataRealityExecutiveAdvisoryInput,
): readonly DataRealityAdvisoryCandidate[] {
  const maxCandidates = input.maxCandidates ?? 5;
  const includeLowAttention = input.includeLowAttention ?? false;
  const context = input.context;
  const requestedIntent = isDataRealityAdvisorIntentKind(input.requestedIntent)
    ? input.requestedIntent
    : undefined;
  const requestedIntentAvailable = Boolean(
    requestedIntent && hasIntent(context.availableIntents, requestedIntent),
  );

  const rankContext: RankContext = {
    focusedObjectId: context.focusedObjectId,
    primarySubjectId: context.primarySubjectId,
    selectedObjectIds: new Set(context.selectedObjectIds),
    requestedIntent,
    requestedIntentAvailable,
  };

  const all: DataRealityAdvisoryCandidate[] = [];
  for (const observation of context.observations) {
    const intents = candidateIntentsForState(
      observation.state,
      context.availableIntents,
    );
    for (const intent of intents) {
      all.push(buildCandidate({ observation, intent }));
    }
  }

  all.sort((a, b) => compareCandidates(a, b, context, rankContext));

  const filtered = includeLowAttention
    ? all
    : all.filter(
        (candidate) =>
          !isLowAttentionCandidate(
            candidate,
            observationBySubject(context, candidate.subjectId),
          ),
      );

  const limited = filtered.slice(0, maxCandidates);

  // Focus boosts relevance and must remain visible after truncation when
  // focus-aligned candidates exist — without hiding higher-severity subjects.
  if (
    context.focusedObjectId &&
    !limited.some((candidate) => candidate.subjectId === context.focusedObjectId)
  ) {
    const focusedCandidate = filtered.find(
      (candidate) => candidate.subjectId === context.focusedObjectId,
    );
    if (focusedCandidate && limited.length > 0) {
      limited[limited.length - 1] = focusedCandidate;
      limited.sort((a, b) => compareCandidates(a, b, context, rankContext));
    } else if (focusedCandidate) {
      limited.push(focusedCandidate);
    }
  }

  return Object.freeze(limited.map(freezeCandidate));
}

// ─── Guidance resolution ────────────────────────────────────────────────────

function guidanceKindsForState(
  state: DataRealityAdvisorState,
  availableIntents: readonly DataRealityAdvisorIntentKind[],
): readonly DataRealityExecutiveGuidanceKind[] {
  const kinds: DataRealityExecutiveGuidanceKind[] = [];

  switch (state) {
    case "stable":
      kinds.push("monitor");
      if (hasIntent(availableIntents, "compare")) kinds.push("compare");
      break;
    case "watch":
      if (hasIntent(availableIntents, "investigate")) kinds.push("investigate");
      kinds.push("monitor");
      if (hasIntent(availableIntents, "prioritize")) kinds.push("prioritize");
      if (hasIntent(availableIntents, "recommend")) kinds.push("recommend");
      break;
    case "risk":
      if (hasIntent(availableIntents, "investigate")) kinds.push("investigate");
      if (hasIntent(availableIntents, "prioritize")) kinds.push("prioritize");
      if (hasIntent(availableIntents, "recommend")) kinds.push("recommend");
      if (hasIntent(availableIntents, "simulate")) kinds.push("simulate");
      break;
    case "critical":
      if (hasIntent(availableIntents, "prioritize")) kinds.push("prioritize");
      kinds.push("escalate");
      if (hasIntent(availableIntents, "investigate")) kinds.push("investigate");
      if (hasIntent(availableIntents, "recommend")) kinds.push("recommend");
      if (hasIntent(availableIntents, "simulate")) kinds.push("simulate");
      break;
    case "opportunity":
      if (hasIntent(availableIntents, "investigate")) kinds.push("investigate");
      if (hasIntent(availableIntents, "compare")) kinds.push("compare");
      if (hasIntent(availableIntents, "recommend")) kinds.push("recommend");
      if (hasIntent(availableIntents, "simulate")) kinds.push("simulate");
      break;
    case "unresolved":
      if (hasIntent(availableIntents, "investigate")) kinds.push("investigate");
      kinds.push("defer");
      break;
  }

  return Object.freeze(kinds);
}

function guidanceTitle(
  kind: DataRealityExecutiveGuidanceKind,
  displayName: string,
  state: DataRealityAdvisorState,
): string {
  switch (kind) {
    case "monitor":
      return `Monitor ${displayName} performance`;
    case "investigate":
      if (state === "unresolved") {
        return `Investigate missing ${displayName} performance evidence`;
      }
      if (displayName === "Production") {
        return "Investigate production capacity pressure";
      }
      return `Investigate ${displayName} ${state} conditions`;
    case "compare":
      return `Compare ${displayName} with related operating conditions`;
    case "prioritize":
      if (displayName === "Production" && state === "critical") {
        return "Prioritize investigation of production capacity pressure";
      }
      if (displayName === "Production" && state === "watch") {
        return "Prioritize production capacity review";
      }
      return `Prioritize ${displayName} executive attention`;
    case "recommend":
      return recommendationTitle(displayName);
    case "simulate":
      return `Simulate alternatives for ${displayName}`;
    case "escalate":
      return `Escalate ${displayName} for immediate executive attention`;
    case "defer":
      return `Defer ${displayName} recommendation until certified evidence is available`;
  }
}

function guidanceRationale(
  kind: DataRealityExecutiveGuidanceKind,
  displayName: string,
  state: DataRealityAdvisorState,
  attention: DataRealityAdvisorAttentionLevel,
): string {
  switch (kind) {
    case "monitor":
      return `${displayName} is currently ${state}; continued monitoring is sufficient unless conditions change.`;
    case "investigate":
      if (state === "unresolved") {
        return `Certified data is insufficient to establish ${displayName} performance, so investigation should close the evidence gap.`;
      }
      return `${displayName} is in a ${state} state with ${attention} attention and warrants directed investigation.`;
    case "compare":
      return `Comparison can clarify whether ${displayName} deserves relative priority against other subjects.`;
    case "prioritize":
      return `${displayName} currently requires elevated executive ordering due to ${state} state and ${attention} attention.`;
    case "recommend":
      return `Response options for ${displayName} may be considered as advisory candidates based on certified evidence — not as approved decisions.`;
    case "simulate":
      return `Simulation intent is available, so alternative assumptions for ${displayName} may be evaluated before deciding.`;
    case "escalate":
      return `${displayName} is in a critical executive state with ${attention} attention and may require higher executive visibility.`;
    case "defer":
      return `Recommendation for ${displayName} should be deferred until certified KPI evidence is available.`;
  }
}

function relatedCandidateIds(
  candidates: readonly DataRealityAdvisoryCandidate[],
  subjectId: string,
  kind: DataRealityExecutiveGuidanceKind,
): readonly string[] {
  const intentMap: Partial<
    Record<DataRealityExecutiveGuidanceKind, DataRealityAdvisorIntentKind>
  > = {
    monitor: "observe",
    investigate: "investigate",
    compare: "compare",
    prioritize: "prioritize",
    recommend: "recommend",
    simulate: "simulate",
  };
  const intent = intentMap[kind];
  const matches = candidates.filter((candidate) => {
    if (candidate.subjectId !== subjectId) return false;
    if (!intent) return true;
    return candidate.intent === intent;
  });
  return Object.freeze(matches.map((candidate) => candidate.id));
}

export function resolveDataRealityExecutiveGuidance(
  input: ResolveDataRealityExecutiveAdvisoryInput,
  candidates?: readonly DataRealityAdvisoryCandidate[],
): readonly DataRealityExecutiveGuidance[] {
  const context = input.context;
  const resolvedCandidates =
    candidates ?? resolveDataRealityAdvisoryCandidates(input);
  const includeLowAttention = input.includeLowAttention ?? false;
  const requestedIntent = isDataRealityAdvisorIntentKind(input.requestedIntent)
    ? input.requestedIntent
    : undefined;
  const requestedIntentAvailable = Boolean(
    requestedIntent && hasIntent(context.availableIntents, requestedIntent),
  );
  const rankContext: RankContext = {
    focusedObjectId: context.focusedObjectId,
    primarySubjectId: context.primarySubjectId,
    selectedObjectIds: new Set(context.selectedObjectIds),
    requestedIntent,
    requestedIntentAvailable,
  };

  const guidance: DataRealityExecutiveGuidance[] = [];

  for (const observation of context.observations) {
    if (
      !includeLowAttention &&
      (observation.attention === "none" ||
        observation.attention === "low" ||
        observation.state === "stable")
    ) {
      // Still allow unresolved defer/investigate guidance.
      if (observation.state !== "unresolved") continue;
    }

    const kinds = guidanceKindsForState(
      observation.state,
      context.availableIntents,
    );
    const displayName = displayNameForSubject(observation.subjectId);
    const priority = resolveGuidancePriorityFromAdvisorState(observation.state);
    const blockedByUnresolvedReality = observation.state === "unresolved";

    for (const kind of kinds) {
      // Unresolved protection: never recommend/escalate/simulate.
      if (
        blockedByUnresolvedReality &&
        (kind === "recommend" || kind === "escalate" || kind === "simulate")
      ) {
        continue;
      }

      guidance.push(
        freezeGuidance({
          id: `guidance:${observation.subjectId}:${kind}:${priority}`,
          kind,
          subjectKind: observation.subjectKind,
          subjectId: observation.subjectId,
          priority,
          title: guidanceTitle(kind, displayName, observation.state),
          rationale: guidanceRationale(
            kind,
            displayName,
            observation.state,
            observation.attention,
          ),
          evidenceIds: observation.evidenceIds,
          observationIds: Object.freeze([observation.id]),
          sourceCandidateIds: relatedCandidateIds(
            resolvedCandidates,
            observation.subjectId,
            kind,
          ),
          blockedByUnresolvedReality,
        }),
      );
    }
  }

  guidance.sort((a, b) => compareGuidance(a, b, context, rankContext));
  return Object.freeze(guidance.map(freezeGuidance));
}

// ─── Primary composed API ───────────────────────────────────────────────────

function buildResolutionReasons(input: {
  readonly candidates: readonly DataRealityAdvisoryCandidate[];
  readonly guidance: readonly DataRealityExecutiveGuidance[];
  readonly requestedIntent?: DataRealityAdvisorIntentKind;
  readonly requestedIntentAvailable: boolean;
  readonly maxCandidates: number;
  readonly context: DataRealityAwareAdvisorContext;
}): readonly string[] {
  const reasons: string[] = [];

  for (const candidate of input.candidates) {
    const observation = observationBySubject(input.context, candidate.subjectId);
    reasons.push(
      `candidate:${candidate.subjectId}:${candidate.intent}:${observation?.state ?? "unresolved"}`,
    );
  }

  for (const guidance of input.guidance) {
    reasons.push(
      `guidance:${guidance.subjectId}:${guidance.kind}:${guidance.priority}`,
    );
    if (guidance.blockedByUnresolvedReality) {
      reasons.push(`unresolved-protection:${guidance.subjectId}`);
    }
  }

  if (input.requestedIntent) {
    reasons.push(
      input.requestedIntentAvailable
        ? `requested-intent:${input.requestedIntent}:matched`
        : `requested-intent:${input.requestedIntent}:unavailable`,
    );
  }

  reasons.push(`candidate-limit:${input.maxCandidates}`);
  return Object.freeze(reasons);
}

/**
 * Preferred P1:4 consumer API.
 * Advisor Context → Candidates → Guidance → Primary selection.
 */
export function resolveDataRealityExecutiveAdvisoryResolution(
  input: ResolveDataRealityExecutiveAdvisoryInput,
): DataRealityExecutiveAdvisoryResolutionResult {
  const maxCandidates = input.maxCandidates ?? 5;
  const context = input.context;
  const requestedIntent = isDataRealityAdvisorIntentKind(input.requestedIntent)
    ? input.requestedIntent
    : undefined;
  const requestedIntentAvailable = Boolean(
    requestedIntent && hasIntent(context.availableIntents, requestedIntent),
  );

  const candidates = resolveDataRealityAdvisoryCandidates(input);
  const guidance = resolveDataRealityExecutiveGuidance(input, candidates);

  const primaryCandidateId = candidates[0]?.id;
  const primaryGuidanceId = guidance[0]?.id;

  const resolutionReasons = buildResolutionReasons({
    candidates,
    guidance,
    requestedIntent,
    requestedIntentAvailable,
    maxCandidates,
    context,
  });

  return Object.freeze({
    contextId: context.contextId,
    candidates,
    guidance,
    ...(primaryCandidateId !== undefined ? { primaryCandidateId } : {}),
    ...(primaryGuidanceId !== undefined ? { primaryGuidanceId } : {}),
    resolutionReasons,
  });
}
