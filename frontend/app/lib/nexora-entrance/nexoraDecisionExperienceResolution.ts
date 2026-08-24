/**
 * NEX-EXP:7 — decision question, brief, preference vs commitment classification.
 * Commitment writes only through CC:10R. Confirmation is required.
 */

import {
  buildDeterministicCandidateId,
  buildDeterministicDecisionId,
  type NexoraDecisionRationale,
  type NexoraExecutiveDecision,
} from "@/app/lib/conversational-control/executiveDecisionCandidate.ts";
import { getExecutiveDecisionCommitmentIdentity } from "@/app/lib/conversational-control/executiveDecisionCommitment.ts";
import { resolveNexoraDecisionCommitmentPolicy } from "@/app/lib/conversational-control/executiveDecisionCommitmentPolicy.ts";
import type { NexoraDecisionRuntimeAdapter } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter.ts";
import { EXECUTIVE_DECISION_INTELLIGENCE_BOUNDARY } from "@/app/lib/executive-intelligence/executiveDecisionIntelligence.ts";
import { executiveStageDecisionBriefIdentity } from "@/app/lib/spatial-presentation/executiveStageDecisionBrief.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { ExecutiveScenarioObject } from "./nexoraScenarioDiscoveryTypes.ts";
import type {
  ExecutiveDecisionExperienceView,
  NexoraExecutionPlanningHandoff,
  PendingDecisionConfirmationView,
} from "./nexoraDecisionExperienceTypes.ts";

export function isDecisionExperienceUtterance(normalized: string): boolean {
  return (
    /what exactly am i deciding/.test(normalized) ||
    /what am i (?:accepting|committing)/.test(normalized) ||
    /have i decided/.test(normalized) ||
    /\bi prefer\b/.test(normalized) ||
    /\blet'?s go with\b/.test(normalized) ||
    /\blet'?s do (?:that|this|it)\b/.test(normalized) ||
    /\bgo with (?:scenario|it|this)\b/.test(normalized) ||
    /^(?:i )?approve (?:it|this|scenario)/.test(normalized) ||
    /^approve(?: scenario| this| it)?$/.test(normalized) ||
    /make this the decision/.test(normalized) ||
    /yes,? confirm/.test(normalized) ||
    /^confirm(?: it)?$/.test(normalized) ||
    /^yes$/.test(normalized) ||
    /no,? don'?t approve/.test(normalized) ||
    /^reject(?: this)?$/.test(normalized) ||
    /i don'?t want scenario/.test(normalized) ||
    /^not yet$/.test(normalized) ||
    /let'?s wait/.test(normalized) ||
    /need more evidence/.test(normalized) ||
    /come back to this later/.test(normalized) ||
    /\bi choose\b/.test(normalized) ||
    /why should i approve/.test(normalized) ||
    /what could go wrong/.test(normalized) ||
    /what happens if i wait/.test(normalized) ||
    /why this option/.test(normalized) ||
    /what did i decide/.test(normalized) ||
    /why did i decide/.test(normalized) ||
    /did execution start/.test(normalized) ||
    /what happens next/.test(normalized) ||
    /decision brief/.test(normalized) ||
    /what are the risks/.test(normalized)
  );
}

export function isBareConfirmation(normalized: string): boolean {
  return /^(?:yes|confirm(?: it)?|yes,? confirm)$/.test(normalized);
}

export function isAmbiguousDeictic(normalized: string): boolean {
  return /^(?:approve this|go with it|confirm it|let'?s do (?:that|this|it))$/.test(
    normalized,
  );
}

export function namedScenarioFromUtterance(
  scenarios: readonly ExecutiveScenarioObject[],
  utterance: string,
): ExecutiveScenarioObject | null {
  const letter =
    utterance.match(/\bscenario\s+([a-d])\b/i)?.[1] ??
    utterance.match(/\b(?:with|prefer|choose|approve)\s+([a-d])\b/i)?.[1];
  if (letter) {
    return (
      scenarios.find(
        (entry) => entry.letter.toLowerCase() === letter.toLowerCase(),
      ) ?? null
    );
  }
  return (
    scenarios.find((entry) =>
      utterance.toLowerCase().includes(entry.title.toLowerCase()),
    ) ?? null
  );
}

export function buildDecisionQuestion(
  entrance: NexoraEntranceSession,
  scenario: ExecutiveScenarioObject | null,
): string {
  const goal =
    entrance.goalDiscovery?.context.goalTitle ?? "the active Goal";
  const title = scenario?.title ?? "a comparable Scenario";
  return `Should we proceed with ${title} to advance ${goal}?`;
}

export function buildDecisionBrief(input: {
  readonly entrance: NexoraEntranceSession;
  readonly scenario: ExecutiveScenarioObject | null;
  readonly preferenceId: string | null;
  readonly committed: boolean;
}): string {
  const comparison = input.entrance.scenarioComparison;
  const recommendation = comparison?.recommendation;
  const chosen =
    input.scenario ??
    (comparison?.comparison?.scenarioResults.find(
      (entry) => entry.scenarioId === (input.preferenceId ?? recommendation?.recommendedScenarioId),
    )
      ? input.entrance.scenarioDiscovery?.scenarios.find(
          (entry) =>
            entry.id ===
            (input.preferenceId ?? recommendation?.recommendedScenarioId),
        )
      : null);
  const tradeoff = comparison?.comparison?.tradeoffs.find(
    (entry) => entry.scenarioId === chosen?.id,
  );
  const alternative = comparison?.comparison?.scenarioResults.find(
    (entry) => entry.scenarioId !== chosen?.id && entry.ranked,
  );
  const goal = input.entrance.goalDiscovery?.context.goalTitle ?? "the active Goal";
  return [
    `Decision: ${chosen?.title ?? "not selected"}.`,
    `Why now: ${goal} currently requires a response.`,
    `Why this path: ${recommendation?.goalFit ?? "strongest current evidenced fit, or manager preference."}`,
    `Main benefit: ${tradeoff?.gains[0] ?? "not evidenced"}.`,
    `Main sacrifice: ${tradeoff?.sacrifices[0] ?? "not evidenced"}.`,
    `Main uncertainty: ${chosen?.unknowns[0] ?? comparison?.comparison?.unknowns[0] ?? "not recorded"}.`,
    `Alternative: ${alternative?.title ?? "none ranked"}.`,
    `Status: ${input.committed ? "Approved" : "Not approved"}.`,
    `Presentation authority: ${executiveStageDecisionBriefIdentity}.`,
  ].join(" ");
}

export function resolveTargetScenario(
  entrance: NexoraEntranceSession,
  utterance: string,
  preferenceId: string | null,
): ExecutiveScenarioObject | null {
  const scenarios = entrance.scenarioDiscovery?.scenarios ?? [];
  const named = namedScenarioFromUtterance(scenarios, utterance);
  if (named) return named;
  if (preferenceId) {
    return scenarios.find((entry) => entry.id === preferenceId) ?? null;
  }
  const recommended =
    entrance.scenarioComparison?.recommendation?.recommendedScenarioId;
  if (recommended) {
    return scenarios.find((entry) => entry.id === recommended) ?? null;
  }
  const ranked = (entrance.scenarioComparison?.comparison?.scenarioResults ?? []).filter(
    (entry) => entry.ranked,
  );
  if (ranked.length === 1) {
    return scenarios.find((entry) => entry.id === ranked[0]?.scenarioId) ?? null;
  }
  return null;
}

export function comparisonFingerprint(entrance: NexoraEntranceSession): string {
  return (
    entrance.scenarioComparison?.fingerprint ??
    (entrance.scenarioDiscovery?.scenarios ?? [])
      .map((entry) => `${entry.id}:${entry.scenarioStatus}`)
      .join("|")
  );
}

export function projectDecisionView(input: {
  readonly entrance: NexoraEntranceSession;
  readonly preferenceId: string | null;
  readonly state: ExecutiveDecisionExperienceView["decisionStatus"];
  readonly committed: NexoraExecutiveDecision | null;
  readonly overrideNoted: boolean;
}): ExecutiveDecisionExperienceView {
  const scenarios = input.entrance.scenarioDiscovery?.scenarios ?? [];
  const recommendation = input.entrance.scenarioComparison?.recommendation;
  const chosen =
    scenarios.find((entry) => entry.id === input.preferenceId) ??
    scenarios.find((entry) => entry.id === recommendation?.recommendedScenarioId) ??
    null;
  const comparison = input.entrance.scenarioComparison?.comparison;
  const tradeoff = comparison?.tradeoffs.find(
    (entry) => entry.scenarioId === chosen?.id,
  );
  return Object.freeze({
    decisionQuestion: buildDecisionQuestion(input.entrance, chosen),
    activeGoal: input.entrance.goalDiscovery?.context.goalTitle ?? null,
    recommendedScenario: recommendation?.recommendedScenarioId ?? null,
    alternatives: recommendation?.alternativeScenarioIds ?? [],
    selectedPreference: input.preferenceId,
    decisionStatus: input.state,
    rationale: Object.freeze(
      [
        recommendation?.reasoningSummary ?? null,
        input.overrideNoted
          ? "Manager selected a path other than the current recommendation."
          : null,
      ].filter((value): value is string => Boolean(value)),
    ),
    tradeoffs: Object.freeze([
      ...(tradeoff?.gains ?? []),
      ...(tradeoff?.sacrifices ?? []),
    ]),
    risks: Object.freeze(chosen?.risks ?? []),
    assumptions: Object.freeze(
      (chosen?.assumptions ?? []).map((entry) => entry.statement),
    ),
    unknowns: Object.freeze(chosen?.unknowns ?? comparison?.unknowns ?? []),
    evidence: Object.freeze(chosen?.evidence ?? comparison?.evidence ?? []),
    confirmationRequired: true,
    managerConfirmed: input.committed?.status === "Approved",
    committedDecisionId: input.committed?.decisionId ?? null,
    committedAt: input.committed?.committedAt ?? null,
    startsExecution: false,
    overrideNoted: input.overrideNoted,
  });
}

export function toExecutionPlanningHandoff(input: {
  readonly entrance: NexoraEntranceSession;
  readonly committed: NexoraExecutiveDecision | null;
  readonly view: ExecutiveDecisionExperienceView | null;
}): NexoraExecutionPlanningHandoff {
  return Object.freeze({
    activeGoal: input.entrance.goalDiscovery?.context ?? null,
    realityContext: input.entrance.realityDiscovery?.context ?? null,
    issueContext: input.entrance.issueDiscovery?.handoff ?? null,
    scenarioComparison: input.entrance.scenarioComparison?.comparison ?? null,
    recommendation: input.entrance.scenarioComparison?.recommendation ?? null,
    committedDecision: input.committed,
    chosenScenario: input.committed?.scenarioId ?? input.view?.selectedPreference ?? null,
    decisionRationale: input.view?.rationale ?? [],
    tradeoffs: input.view?.tradeoffs ?? [],
    risks: input.view?.risks ?? [],
    assumptions: input.view?.assumptions ?? [],
    unknowns: input.view?.unknowns ?? [],
    evidence: input.view?.evidence ?? [],
    conversationContext: input.entrance.conversationNotes.slice(-6).join(" | "),
    startsExecution: false,
  });
}

export function commitThroughCanonicalRuntime(input: {
  readonly adapter: NexoraDecisionRuntimeAdapter | null;
  readonly existing: NexoraExecutiveDecision | null;
  readonly scenario: ExecutiveScenarioObject;
  readonly entrance: NexoraEntranceSession;
  readonly action: "approve" | "reject" | "defer";
  readonly overrideNoted: boolean;
  readonly managerReason: string | null;
}): {
  readonly adapter: NexoraDecisionRuntimeAdapter | null;
  readonly decision: NexoraExecutiveDecision | null;
  readonly status: string;
} {
  if (!input.adapter) {
    return {
      adapter: null,
      decision: null,
      status: "missing-canonical-runtime",
    };
  }
  const runtime = input.adapter;
  const decisionId = buildDeterministicDecisionId(input.scenario.id);
  const goalId = input.entrance.goalDiscovery?.object?.id;
  const recommendation = input.entrance.scenarioComparison?.recommendation;
  const summary = [
    input.managerReason
      ? `Manager committed to ${input.scenario.title}: ${input.managerReason}`
      : `Manager committed to ${input.scenario.title}.`,
    input.overrideNoted && !input.managerReason
      ? `This was not the current Nexora recommendation (${recommendation?.recommendedScenarioId ?? "none"}).`
      : null,
  ]
    .filter(Boolean)
    .join(" ");
  const rationale: NexoraDecisionRationale = Object.freeze({
    summary,
    goalIds: Object.freeze(goalId ? [goalId] : []),
    problemIds: Object.freeze(
      (input.entrance.issueDiscovery?.objects ?? []).map((entry) => entry.id),
    ),
    recommendationId: recommendation?.recommendationId,
    scenarioId: input.scenario.id,
    evidenceRefs: Object.freeze([]),
    uncertaintyRefs: Object.freeze([...input.scenario.unknowns]),
  });
  const result = runtime.transitionDecision({
    decisionId,
    action: input.action,
    title: input.scenario.title,
    subjectIds: Object.freeze(
      [goalId, input.scenario.id].filter((value): value is string => Boolean(value)),
    ),
    scenarioId: input.scenario.id,
    recommendationId: recommendation?.recommendationId,
    rationale,
    uncertaintyRefs: input.scenario.unknowns,
    candidateId: buildDeterministicCandidateId({
      source: "scenario",
      key: input.scenario.id,
    }),
    committedAt: "manager-confirmed",
  });
  return {
    adapter: runtime,
    decision: result.decision,
    status: result.status,
  };
}

export function commitmentAuthorities() {
  return Object.freeze({
    cc10: getExecutiveDecisionCommitmentIdentity().id,
    cc10r: EXECUTIVE_DECISION_INTELLIGENCE_BOUNDARY.decisionAuthority,
    ei5OwnsDecisionState: EXECUTIVE_DECISION_INTELLIGENCE_BOUNDARY.ownsDecisionState,
    prod4: executiveStageDecisionBriefIdentity,
    policy: resolveNexoraDecisionCommitmentPolicy,
  });
}

export function pendingConfirmationFor(
  scenario: ExecutiveScenarioObject,
  fingerprint: string,
  action: "approve" | "reject",
): PendingDecisionConfirmationView {
  return Object.freeze({
    scenarioId: scenario.id,
    title: scenario.title,
    fingerprint,
    requestedAction: action,
  });
}

export { resolveNexoraDecisionCommitmentPolicy };
