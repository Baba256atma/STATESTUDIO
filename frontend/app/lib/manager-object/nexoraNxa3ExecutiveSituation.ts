/** NXA:3 — compressed read model over existing executive authorities. */
import type { NexoraExecutiveContextSnapshot, NexoraExecutiveContextUpdateResult } from "../conversational-control/executiveContextSnapshot.ts";
import type { ManagerObjectTurn } from "./managerObjectInteraction.ts";
import type { NexoraConversationState } from "./nexoraNca2ConversationStateTypes.ts";
import type { NxaAdvisorTurnContract } from "./nexoraNxa1ExecutiveAdvisorContract.ts";
import type { NexoraEntranceSession } from "../nexora-entrance/nexoraEntranceTypes.ts";
import { collectManagerObjectContext } from "./managerObjectContext.ts";

export const nexoraNxa3Identity = "NXA:3/ExecutiveContextSituationalAwareness" as const;
export const NEXORA_NXA3_BOUNDARY = Object.freeze({
  identity: nexoraNxa3Identity,
  readModelOnly: true as const,
  createsMemoryStore: false as const,
  createsGoalStore: false as const,
  createsDecisionStore: false as const,
  createsExecutionStore: false as const,
  createsOutcomeStore: false as const,
  createsReferentSystem: false as const,
  createsJourneyEngine: false as const,
  writesStage: false as const,
  truthPrecedence: "validated runtime > canonical executive state > validated evidence > manager assertion > conversation > inference" as const,
});

export type SituationClaimKind = "FACT" | "MANAGER_ASSERTION" | "ASSUMPTION" | "INFERENCE" | "UNKNOWN";
export type SituationClaim = { readonly kind: SituationClaimKind; readonly text: string; readonly subject: string | null };
export type SituationQuestion = { readonly text: string; readonly status: "OPEN" | "RESOLVED" | "SUPERSEDED" | "BLOCKED" };
export type SituationChangeKind = "DATA" | "STATE" | "DECISION" | "EXECUTION" | "EVIDENCE" | "MANAGER_DIRECTION" | "NONE";

export type ExecutiveSituation = {
  readonly identity: typeof nexoraNxa3Identity;
  readonly composedAtTurn: number;
  readonly goal: { readonly title: string; readonly target: string | null; readonly currentReality: string | null; readonly gap: string | null; readonly status: string } | null;
  readonly focus: { readonly subjectId: string | null; readonly label: string | null; readonly kind: string | null; readonly collectionKind: string | null; readonly collectionMemberIds: readonly string[]; readonly comparisonIds: readonly string[]; readonly relatedSubjects: readonly string[] };
  readonly investigation: { readonly subjectId: string | null; readonly evidence: readonly string[]; readonly claims: readonly SituationClaim[]; readonly causalStatus: "CONFIRMED" | "UNCONFIRMED" | "UNKNOWN" };
  readonly advisory: { readonly recommendation: string | null; readonly reason: string | null; readonly status: "ACTIVE" | "OVERRIDDEN" | "INVALIDATED" | "NONE" };
  readonly decision: { readonly subjectId: string | null; readonly state: string; readonly confirmationPending: boolean };
  readonly execution: { readonly subjectId: string | null; readonly state: string; readonly blocker: string | null };
  readonly outcome: { readonly state: string; readonly baseline: string | null; readonly observed: string | null; readonly goalImpact: string | null };
  readonly conversation: { readonly referent: string | null; readonly recentNeed: string; readonly pendingQuestion: SituationQuestion | null; readonly latestManagerAssertion: string | null };
  readonly change: { readonly kind: SituationChangeKind; readonly summary: string | null; readonly affectsGoalOrRecommendation: boolean };
  readonly strongestUnresolvedIssue: string | null;
  readonly conflicts: readonly { readonly authoritative: string; readonly managerAssertion: string; readonly resolution: "PRESERVE_BOTH" }[];
};

function firstMeasuredEvidence(turn: ManagerObjectTurn): string | null {
  return turn.explanation.evidence.find((item) => /\d/.test(item.text))?.text ?? null;
}

function changeFrom(update: NexoraExecutiveContextUpdateResult | null, utterance: string, entrance?: NexoraEntranceSession | null): ExecutiveSituation["change"] {
  const kinds = update?.trace.changeKinds ?? [];
  if (/^(?:forget|no[,.]?\s+(?:show|focus)|show|focus|back to)\b/i.test(utterance.trim()) && kinds.includes("set-current-subject")) {
    return Object.freeze({ kind: "MANAGER_DIRECTION" as const, summary: "The manager changed the active direction.", affectsGoalOrRecommendation: true });
  }
  if (kinds.includes("set-decision")) return Object.freeze({ kind: "DECISION" as const, summary: "Decision state changed.", affectsGoalOrRecommendation: true });
  if (kinds.includes("set-execution")) return Object.freeze({ kind: "EXECUTION" as const, summary: "Execution state changed.", affectsGoalOrRecommendation: true });
  const comparison = entrance?.outcomeMonitoring?.context?.comparisons.at(-1);
  if (comparison?.observed || entrance?.outcomeMonitoring?.observations.length) {
    return Object.freeze({ kind: "DATA" as const, summary: comparison?.expected && comparison.observed ? `${comparison.subject} changed from ${comparison.expected} to ${comparison.observed}.` : "A new outcome observation was recorded.", affectsGoalOrRecommendation: true });
  }
  if (kinds.includes("set-current-subject") || kinds.includes("record-presented-set")) return Object.freeze({ kind: "STATE" as const, summary: "The active executive context changed.", affectsGoalOrRecommendation: false });
  return Object.freeze({ kind: "NONE" as const, summary: null, affectsGoalOrRecommendation: false });
}

function numericValue(text: string): string | null { return text.match(/\b\d+(?:\.\d+)?%?\b/)?.[0] ?? null; }

export function composeExecutiveSituation(input: {
  readonly utterance: string;
  readonly executiveContext: NexoraExecutiveContextSnapshot;
  readonly contextUpdate: NexoraExecutiveContextUpdateResult | null;
  readonly turn: ManagerObjectTurn;
  readonly conversation: NexoraConversationState;
  readonly nxa1: NxaAdvisorTurnContract;
  readonly collection?: { readonly kind: string; readonly memberIds: readonly string[] } | null;
  readonly managerAssertion?: string | null;
  readonly entranceSession?: NexoraEntranceSession | null;
}): ExecutiveSituation {
  const goal = input.turn.navigation.goal.status === "understood" &&
    input.turn.navigation.goal.source !== "unknown" &&
    !/^unknown goal$/i.test(input.turn.navigation.goal.title)
      ? input.turn.navigation.goal
      : null;
  const measured = firstMeasuredEvidence(input.turn);
  const assertions = [
    ...(input.turn.session.managerObservations ?? []),
    ...(input.managerAssertion && !(input.turn.session.managerObservations ?? []).some((item) => item.text === input.managerAssertion)
      ? [{ text: input.managerAssertion, provenance: "manager-reported" as const, matchedLabel: input.nxa1.referentName }]
      : []),
  ];
  const latestAssertion = assertions.at(-1)?.text ?? null;
  const claims: SituationClaim[] = [
    ...input.turn.explanation.evidence.map((item) => Object.freeze({ kind: item.support === "KNOWN" ? "FACT" as const : "INFERENCE" as const, text: item.text, subject: input.turn.explanation.subject.label })),
    ...assertions.map((item) => Object.freeze({ kind: "MANAGER_ASSERTION" as const, text: item.text, subject: item.matchedLabel })),
    ...input.turn.explanation.relationships.map((item) => Object.freeze({ kind: "INFERENCE" as const, text: item.text, subject: input.turn.explanation.subject.label })),
    ...(input.turn.explanation.uncertainty ? [Object.freeze({ kind: "UNKNOWN" as const, text: input.turn.explanation.uncertainty, subject: input.turn.explanation.subject.label })] : []),
  ];
  const authoritativeValue = numericValue(measured ?? "");
  const assertedValue = numericValue(latestAssertion ?? "");
  const conflicts = authoritativeValue && assertedValue && authoritativeValue !== assertedValue
    ? Object.freeze([{ authoritative: measured!, managerAssertion: latestAssertion!, resolution: "PRESERVE_BOTH" as const }])
    : Object.freeze([]);
  const recommendation = input.conversation.lastAdvisoryPosition?.optionLabel ?? input.conversation.lastRecommendation ?? null;
  const managerOverride = /^(?:no[,.]?\s+)?(?:forget|show|focus|open)\b/i.test(input.utterance.trim()) && Boolean(input.conversation.lastAdvisoryPosition);
  const recommendationInvalidated = Boolean(
    recommendation &&
    latestAssertion &&
    /\b(?:normal|not constrained|not the cause|disproved|ruled out)\b/i.test(latestAssertion) &&
    /capacity/i.test(`${recommendation} ${latestAssertion}`),
  );
  const activeCollection = input.collection ?? (input.conversation.lastCollection ? { kind: input.conversation.lastCollection.kind, memberIds: input.conversation.lastCollection.memberIds ?? [] } : null);
  const pending = input.conversation.pendingQuestion;
  const authoritativeFocus = input.executiveContext.currentSubject;
  const authoritativeContext = authoritativeFocus?.subjectId && authoritativeFocus.subjectId !== input.turn.context.objectId
    ? collectManagerObjectContext(authoritativeFocus.subjectId)
    : input.turn.context;
  const kpi = authoritativeContext.kpi.value;
  const entranceDecision = input.entranceSession?.decisionExperience;
  const entranceExecution = input.entranceSession?.executionPlanning;
  const entranceOutcome = input.entranceSession?.outcomeMonitoring;
  const outcomeContext = entranceOutcome?.context;
  const outcomeComparison = outcomeContext?.comparisons.at(-1);
  const outcomeObservation = entranceOutcome?.observations.at(-1);
  return Object.freeze({
    identity: nexoraNxa3Identity,
    composedAtTurn: input.executiveContext.turnIndex,
    goal: goal || kpi ? Object.freeze({ title: goal?.title ?? `${kpi?.label ?? input.turn.context.identity.value ?? "Current result"} target`, target: goal?.successSignals.find((item) => item.target)?.target ?? goal?.currentGap?.desiredState ?? kpi?.target ?? null, currentReality: goal?.currentGap?.currentState ?? kpi?.value ?? measured, gap: goal?.currentGap?.summary ?? (kpi?.target && kpi.value ? `${kpi.label} is ${kpi.value} against a ${kpi.target} target.` : null), status: input.turn.navigation.progressState }) : null,
    focus: Object.freeze({ subjectId: authoritativeFocus?.subjectId ?? input.turn.activeObjectId, label: authoritativeFocus?.canonicalName ?? input.turn.context.identity.value, kind: authoritativeFocus?.subjectKind ?? input.turn.context.objectKind.value, collectionKind: activeCollection?.kind ?? null, collectionMemberIds: Object.freeze([...(activeCollection?.memberIds ?? [])]), comparisonIds: Object.freeze([...(input.conversation.activeComparison?.candidateIds ?? [])]), relatedSubjects: Object.freeze(authoritativeContext.relationships.map((item) => item.otherLabel)) }),
    investigation: Object.freeze({ subjectId: input.turn.session.investigationSubjectId ?? input.turn.activeObjectId, evidence: Object.freeze(input.turn.explanation.evidence.map((item) => item.text)), claims: Object.freeze(claims), causalStatus: input.turn.explanation.drivers.some((item) => item.causalClaim === "confirmed") ? "CONFIRMED" as const : input.turn.explanation.relationships.length || input.turn.explanation.drivers.length ? "UNCONFIRMED" as const : "UNKNOWN" as const }),
    advisory: Object.freeze({ recommendation, reason: null, status: recommendationInvalidated ? "INVALIDATED" as const : managerOverride ? "OVERRIDDEN" as const : recommendation ? "ACTIVE" as const : "NONE" as const }),
    decision: Object.freeze({ subjectId: entranceDecision?.canonicalRecord?.decisionId ?? input.executiveContext.currentDecision?.subjectId ?? null, state: entranceDecision?.state ?? input.turn.journey.decisionState, confirmationPending: Boolean(entranceDecision?.pendingConfirmation) || input.executiveContext.pendingTurnExpectation?.questionKind === "decision-commitment" }),
    execution: Object.freeze({ subjectId: entranceExecution?.canonicalExecutionId ?? input.executiveContext.currentExecution?.subjectId ?? null, state: entranceExecution?.state ?? input.turn.journey.executionState, blocker: entranceExecution?.plan?.unknowns[0] ?? (input.turn.journey.blocker?.kind === "EXECUTION_BLOCKED" ? input.turn.journey.blocker.reason : null) }),
    outcome: Object.freeze({ state: entranceOutcome?.state ?? input.turn.journey.outcomeState, baseline: outcomeComparison?.expected ?? null, observed: outcomeComparison?.observed ?? outcomeObservation?.observedValue ?? measured, goalImpact: outcomeContext?.goalImpact.state ?? input.turn.navigation.progressState }),
    conversation: Object.freeze({ referent: input.nxa1.referentName, recentNeed: input.nxa1.need, pendingQuestion: pending ? Object.freeze({ text: pending.question, status: pending.status === "SUSPENDED" ? "SUPERSEDED" as const : "OPEN" as const }) : null, latestManagerAssertion: latestAssertion }),
    change: changeFrom(input.contextUpdate, input.utterance, input.entranceSession),
    strongestUnresolvedIssue: input.turn.journey.blocker?.reason ?? input.turn.explanation.uncertainty ?? null,
    conflicts,
  });
}

export function composeSituationRecovery(situation: ExecutiveSituation, utterance: string): string | null {
  const text = utterance.trim().toLowerCase().replace(/[?.!]+$/g, "");
  if (/^(?:where were we|where are we now)$/.test(text)) {
    const parts = [
      situation.goal ? `Goal: ${situation.goal.title}.` : null,
      situation.focus.label ? `We’re focused on ${situation.focus.label}.` : null,
      situation.investigation.causalStatus === "UNCONFIRMED" ? "The causal relationship is still unconfirmed." : null,
      situation.strongestUnresolvedIssue ? `Still unresolved: ${situation.strongestUnresolvedIssue}` : null,
    ].filter((item): item is string => Boolean(item));
    return parts.join(" ");
  }
  if (/^what did you recommend$/.test(text)) return situation.advisory.recommendation ? `I recommended ${situation.advisory.recommendation}.` : "I haven’t made a supported recommendation in this conversation yet.";
  if (/^what (?:is|still) unresolved$/.test(text)) return situation.strongestUnresolvedIssue ? `Still unresolved: ${situation.strongestUnresolvedIssue}` : "There is no unresolved issue established in the current situation.";
  if (/^what were we investigating$/.test(text)) return situation.focus.label ? `We were investigating ${situation.focus.label}${situation.goal ? ` in relation to ${situation.goal.title}` : ""}.` : "There isn’t an active investigation to recover.";
  if (/^how far are we from the goal$/.test(text) && situation.goal?.currentReality && situation.goal.target) {
    return `${situation.goal.currentReality} is the current result against a ${situation.goal.target} target. ${situation.goal.gap ?? "The remaining gap is not separately quantified."}`;
  }
  return null;
}

export function composeSituationConflict(situation: ExecutiveSituation): string | null {
  const conflict = situation.conflicts[0];
  if (!conflict) return null;
  return `The validated context currently shows ${conflict.authoritative}, while you’ve provided ${conflict.managerAssertion}. I’ll preserve that as your current observation, but it is not yet validated by the connected data.`;
}

export function verifyNexoraNxa3(): { readonly ok: true } {
  if (!NEXORA_NXA3_BOUNDARY.readModelOnly || NEXORA_NXA3_BOUNDARY.createsMemoryStore || NEXORA_NXA3_BOUNDARY.writesStage) throw new Error("NXA:3 boundary violation");
  return Object.freeze({ ok: true as const });
}
