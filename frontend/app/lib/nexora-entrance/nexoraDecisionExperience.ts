/**
 * NEX-EXP:7 — manager decision/commitment experience projection.
 * Confirmation required. CC:10R is the only committed-decision writer.
 */

import type {
  NexoraMVPObjectInteractionCatalog,
  NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraDecisionRuntimeAdapter } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import {
  buildDecisionBrief,
  buildDecisionQuestion,
  commitThroughCanonicalRuntime,
  comparisonFingerprint,
  isAmbiguousDeictic,
  isBareConfirmation,
  isDecisionExperienceUtterance,
  namedScenarioFromUtterance,
  pendingConfirmationFor,
  projectDecisionView,
  resolveTargetScenario,
  toExecutionPlanningHandoff,
} from "./nexoraDecisionExperienceResolution.ts";
import {
  getNexoraDecisionExperienceIdentity,
  NEXORA_DECISION_EXPERIENCE_BOUNDARY,
  verifyNexoraDecisionExperience,
  type DecisionExperienceState,
  type NexoraDecisionExperienceSession,
} from "./nexoraDecisionExperienceTypes.ts";

export {
  getNexoraDecisionExperienceIdentity,
  NEXORA_DECISION_EXPERIENCE_BOUNDARY,
  verifyNexoraDecisionExperience,
};

const DECISION_SLOT = [2.15, -2.05, 0] as const;

export function createNexoraDecisionExperienceSession(): NexoraDecisionExperienceSession {
  return freezeDecisionSession({
    state: "NOT_STARTED",
    view: null,
    pendingConfirmation: null,
    canonicalRecord: null,
    askedQuestionKeys: [],
    introduced: false,
    handoff: null,
    lastMutatedReality: null,
    lastStartedExecution: null,
  });
}

export function overlayDecisionOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  session: NexoraDecisionExperienceSession | null,
): NexoraMVPObjectInteractionCatalog {
  const record = session?.canonicalRecord;
  if (!record || record.status !== "Approved") return catalog;
  const id = record.decisionId;
  if (catalog.objects.some((entry) => entry.id === id)) return catalog;
  const centerId =
    catalog.objects.find((entry) => entry.id.startsWith("goal-"))?.id ??
    NEXORA_EXECUTIVE_GOAL_OBJECT_ID;
  return Object.freeze({
    ...catalog,
    objects: Object.freeze([
      ...catalog.objects,
      Object.freeze({
        id,
        label: record.title,
        kind: "object" as const,
        position: DECISION_SLOT,
        status: "stable" as const,
        attention: "elevated" as const,
      }),
    ]),
    relationships: Object.freeze([
      ...catalog.relationships,
      Object.freeze({
        id: `rel-center-decision-${id}`,
        sourceId: centerId,
        targetId: id,
      }),
    ]),
    contextSubjects: Object.freeze([
      ...catalog.contextSubjects,
      Object.freeze({
        id,
        label: record.title,
        kind: "decision" as const,
        status: "stable" as const,
        attention: "elevated" as const,
      }),
    ]),
  });
}

export function shouldNexoraDecisionExperienceOwnUtterance(
  entrance: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (!entrance || entrance.workspaceResolution === "existing-workspace") {
    return false;
  }
  if (
    entrance.scenarioComparison?.state !== "READY_FOR_DECISION" &&
    !entrance.decisionExperience?.introduced
  ) {
    return false;
  }
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isIdentityReserved(normalized)) return false;
  if (isManagerObjectUtterance(normalized)) return false;
  if (isGreeting(normalized)) {
    return !entrance.decisionExperience?.introduced;
  }
  const pending = Boolean(entrance.decisionExperience?.pendingConfirmation);
  if (pending && (isBareConfirmation(normalized) || /^approve(?: it| this)?$/.test(normalized))) {
    return true;
  }
  if (/^why$/.test(normalized)) {
    return Boolean(entrance.decisionExperience?.introduced);
  }
  if (isDecisionExperienceUtterance(normalized)) return true;
  return false;
}

export type NexoraDecisionExperienceTurnResult = {
  readonly session: NexoraDecisionExperienceSession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

export function resolveNexoraDecisionExperienceTurn(input: {
  readonly utterance: string;
  readonly entrance: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
}): NexoraDecisionExperienceTurnResult {
  const previous =
    input.entrance.decisionExperience ?? createNexoraDecisionExperienceSession();
  const normalized = input.utterance.toLowerCase().replace(/[.!?]+$/g, "");
  const fingerprint = comparisonFingerprint(input.entrance);
  let preferenceId = previous.view?.selectedPreference ?? null;
  let pending = previous.pendingConfirmation;
  let canonical = previous.canonicalRecord;
  let state: DecisionExperienceState =
    previous.state === "NOT_STARTED" ? "DECISION_READY" : previous.state;
  let overrideNoted = previous.view?.overrideNoted ?? false;
  let response = "";

  const recommendedId =
    input.entrance.scenarioComparison?.recommendation?.recommendedScenarioId ??
    null;
  const named = namedScenarioFromUtterance(
    input.entrance.scenarioDiscovery?.scenarios ?? [],
    input.utterance,
  );
  if (named && /i choose|i prefer|go with|approve|let'?s go/.test(normalized)) {
    preferenceId = named.id;
    if (recommendedId && named.id !== recommendedId) overrideNoted = true;
  }

  if (pending && pending.fingerprint !== fingerprint) {
    pending = null;
    state = "REVIEWING_DECISION";
    response =
      "The Decision Brief changed. Confirmation was paused. Review the updated comparison before committing.";
  } else if (/have i decided/.test(normalized)) {
    response =
      canonical?.status === "Approved"
        ? `Yes. ${canonical.title} is committed. Execution has not started.`
        : "No. Preference and recommendation are not approval.";
  } else if (/\bi prefer\b/.test(normalized)) {
    const target =
      named ??
      resolveTargetScenario(input.entrance, input.utterance, preferenceId);
    preferenceId = target?.id ?? preferenceId;
    state = "PREFERENCE_EXPRESSED";
    pending = null;
    response = `${target?.title ?? "That Scenario"} is your current preference. It has not been approved.`;
  } else if (
    /not yet|let'?s wait|need more evidence|come back to this later/.test(
      normalized,
    )
  ) {
    state = "DEFERRED";
    pending = null;
    response =
      "Deferred. The Decision remains uncommitted. Journey stays pending; execution has not started.";
  } else if (/reject|don'?t approve|i don'?t want/.test(normalized)) {
    const target = resolveTargetScenario(
      input.entrance,
      input.utterance,
      preferenceId,
    );
    if (!target) {
      response = "Which Scenario are you rejecting? Nexora will not guess.";
    } else {
      pending = pendingConfirmationFor(target, fingerprint, "reject");
      state = "AWAITING_CONFIRMATION";
      response = `You’re about to reject ${target.title} as the decision for ${input.entrance.goalDiscovery?.context.goalTitle ?? "the active Goal"}. Confirm?`;
    }
  } else if (
    pending &&
    (isBareConfirmation(normalized) ||
      /yes,? confirm/.test(normalized) ||
      /^approve(?: it| this)?$/.test(normalized))
  ) {
    const awaiting = pending;
    const scenario =
      input.entrance.scenarioDiscovery?.scenarios.find(
        (entry) => entry.id === awaiting.scenarioId,
      ) ?? null;
    if (!scenario || awaiting.fingerprint !== fingerprint) {
      pending = null;
      response =
        "Confirmation is no longer valid against the current evidence. Review again before committing.";
    } else {
      const applied = commitThroughCanonicalRuntime({
        adapter: input.decisionRuntime ?? null,
        existing: canonical,
        scenario,
        entrance: input.entrance,
        action: awaiting.requestedAction,
        overrideNoted,
        managerReason: extractManagerReason(input.utterance),
      });
      canonical = applied.decision;
      pending = null;
      if (applied.decision?.status === "Approved") {
        state = "READY_FOR_EXECUTION_PLANNING";
        response = `Decision committed: ${applied.decision.title}. Execution has not started.`;
      } else if (applied.decision?.status === "Rejected") {
        state = "REJECTED";
        response =
          "Rejected. No next Scenario was auto-approved. Execution has not started.";
      } else {
        state = "REVIEWING_DECISION";
        response = "The Decision was not applied. Review and confirm again if you still want to commit.";
      }
    }
  } else if (!pending && isBareConfirmation(normalized)) {
    response =
      "Nothing is awaiting confirmation. Nexora will not guess a Decision to approve.";
  } else if (
    /\blet'?s go with|let'?s do (?:that|this|it)|go with scenario|i approve|make this the decision|^approve/.test(
      normalized,
    ) ||
    isAmbiguousDeictic(normalized)
  ) {
    const target = resolveTargetScenario(
      input.entrance,
      input.utterance,
      preferenceId,
    );
    if (!target) {
      response =
        "Which Scenario do you want to commit to? The referent is ambiguous, so Nexora will not guess.";
    } else {
      preferenceId = target.id;
      pending = pendingConfirmationFor(target, fingerprint, "approve");
      state = "AWAITING_CONFIRMATION";
      const goal =
        input.entrance.goalDiscovery?.context.goalTitle ?? "the active Goal";
      const differs =
        recommendedId && target.id !== recommendedId
          ? ` ${target.title} is not the current recommendation, but you can choose it.`
          : "";
      response = `You’re about to approve ${target.title} as the decision for ${goal}. Confirm?${differs}`;
    }
  } else if (/what exactly am i deciding/.test(normalized)) {
    state = "REVIEWING_DECISION";
    const target = resolveTargetScenario(
      input.entrance,
      input.utterance,
      preferenceId,
    );
    response = buildDecisionQuestion(input.entrance, target);
  } else if (
    /decision brief|what am i accepting|what are the risks|what are we uncertain|why should i approve/.test(
      normalized,
    )
  ) {
    state = "REVIEWING_DECISION";
    const target = resolveTargetScenario(
      input.entrance,
      input.utterance,
      preferenceId,
    );
    response = buildDecisionBrief({
      entrance: input.entrance,
      scenario: target,
      preferenceId,
      committed: canonical?.status === "Approved",
    });
  } else if (/what could go wrong|what happens if i wait/.test(normalized)) {
    const target = resolveTargetScenario(
      input.entrance,
      input.utterance,
      preferenceId,
    );
    response = /wait/.test(normalized)
      ? `If you wait, ${target?.title ?? "the current plan"} remains a counterfactual and the current gap is likely to remain. That is PREDICTED, not observed.`
      : `Material uncertainties remain: ${(target?.unknowns ?? ["unvalidated assumptions"]).slice(0, 2).join("; ")}. Unknown is not high risk, and expected impact stays PREDICTED.`;
  } else if (/^why$/.test(normalized) || /what did i decide|why did i decide|why this option/.test(normalized)) {
    const recommendationReason =
      input.entrance.scenarioComparison?.recommendation?.reasoningSummary ?? "";
    response = canonical
      ? /^why$/.test(normalized) || /why did i decide/.test(normalized)
        ? `You committed ${canonical.title} after explicit confirmation. ${
            recommendationReason ||
            canonical.rationale?.summary ||
            "The stored rationale is the recommendation, trade-offs, and any manager reason actually given."
          } Expected impact remains PREDICTED.`
        : `You committed ${canonical.title}. Chosen Scenario is KNOWN. Expected impact remains PREDICTED. Future outcome is UNKNOWN.`
      : /^why$/.test(normalized)
        ? buildDecisionBrief({
            entrance: input.entrance,
            scenario: resolveTargetScenario(
              input.entrance,
              input.utterance,
              preferenceId,
            ),
            preferenceId,
            committed: false,
          })
        : "No Decision is committed yet.";
  } else if (/did execution start/.test(normalized)) {
    response = "No. Decision commitment does not start execution.";
  } else if (/what happens next/.test(normalized)) {
    response =
      canonical?.status === "Approved"
        ? "Ready for execution planning. Execution has not started."
        : "Review the Decision Brief, then confirm if you want to commit. Execution stays downstream.";
  } else if (/\bi choose\b/.test(normalized)) {
    const target =
      named ??
      resolveTargetScenario(input.entrance, input.utterance, preferenceId);
    preferenceId = target?.id ?? preferenceId;
    if (recommendedId && target && target.id !== recommendedId) {
      overrideNoted = true;
    }
    const recTitle =
      input.entrance.scenarioDiscovery?.scenarios.find(
        (entry) => entry.id === recommendedId,
      )?.title ?? "the current recommendation";
    const tradeoff =
      input.entrance.scenarioComparison?.comparison?.tradeoffs.find(
        (entry) => entry.scenarioId === target?.id,
      );
    response = target
      ? `${target.title} is not blocked.${
          recommendedId && target.id !== recommendedId
            ? ` It is not the current recommendation (${recTitle}). The main trade-off is ${tradeoff?.sacrifices[0] ?? "recorded in comparison"}.`
            : ""
        } It has not been approved.`
      : "Which Scenario do you want to choose?";
    state = "PREFERENCE_EXPRESSED";
  } else {
    const target = resolveTargetScenario(
      input.entrance,
      input.utterance,
      preferenceId,
    );
    response = `${buildDecisionQuestion(input.entrance, target)} Recommendation is not a Decision. ${NEXORA_DECISION_EXPERIENCE_BOUNDARY.cc10rAuthority} remains commitment authority.`;
  }

  if (canonical?.status === "Approved") {
    state = "READY_FOR_EXECUTION_PLANNING";
  }
  const view = projectDecisionView({
    entrance: input.entrance,
    preferenceId,
    state,
    committed: canonical,
    overrideNoted,
  });
  const next = freezeDecisionSession({
    ...previous,
    state,
    view,
    pendingConfirmation: pending,
    canonicalRecord: canonical,
    askedQuestionKeys: unique([
      ...previous.askedQuestionKeys,
      normalized.slice(0, 48),
    ]),
    introduced: true,
    lastMutatedReality: null,
    lastStartedExecution: null,
    handoff:
      canonical?.status === "Approved"
        ? toExecutionPlanningHandoff({
            entrance: input.entrance,
            committed: canonical,
            view,
          })
        : previous.handoff,
  });
  return Object.freeze({
    session: next,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayDecisionOnEntranceCatalog(input.catalog, next),
  });
}

function extractManagerReason(utterance: string): string | null {
  const match = utterance.match(/\bbecause\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

function freezeDecisionSession(
  session: NexoraDecisionExperienceSession,
): NexoraDecisionExperienceSession {
  return Object.freeze({
    ...session,
    askedQuestionKeys: Object.freeze([...session.askedQuestionKeys]),
    lastMutatedReality: null,
    lastStartedExecution: null,
  });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

function isManagerObjectUtterance(normalized: string): boolean {
  return (
    /^(?:explain this|what is this|show(?: me)? .+|what is connected|where should i look next|how does this (?:help|affect) my goal|where are we|what needs my attention)$/.test(
      normalized,
    ) ||
    /^explain .+/i.test(normalized) ||
    /^show scenario/.test(normalized)
  );
}

function isIdentityReserved(normalized: string): boolean {
  return (
    /what do you know about me/.test(normalized) || normalized === "who are you"
  );
}

function isGreeting(normalized: string): boolean {
  return /^(?:hi|hello|hey)$/.test(normalized);
}

export function decisionExperienceUsesExistingAuthorities(): boolean {
  return (
    NEXORA_DECISION_EXPERIENCE_BOUNDARY.startsNexExp8 === false &&
    NEXORA_DECISION_EXPERIENCE_BOUNDARY.nexoraCanCommitDecision === false &&
    NEXORA_DECISION_EXPERIENCE_BOUNDARY.startsExecution === false &&
    NEXORA_DECISION_EXPERIENCE_BOUNDARY.parallelDecisionRuntime === false &&
    getNexoraDecisionExperienceIdentity().id ===
      "NEX-EXP:7/ManagerDecisionCommitmentExperience"
  );
}
