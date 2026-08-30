/**
 * DTH:10 — Live Execution Theatre composer.
 * Projects CC:11 after start. Does not create, start, or complete Execution.
 */

import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreAuthoritativeExecution } from "./nexoraDecisionTheatreExecutionReadinessComposer.ts";
import {
  nexoraDecisionTheatreLiveExecutionIdentity,
  nexoraDecisionTheatreLiveExecutionVersion,
  type NexoraDecisionTheatreLiveExecution,
  type NexoraDecisionTheatreLiveExecutionAction,
  type NexoraDecisionTheatreLiveExecutionActionAvailability,
  type NexoraDecisionTheatreLiveExecutionObservation,
  type NexoraDecisionTheatreLiveExecutionState,
} from "./nexoraDecisionTheatreLiveExecution.ts";

export const nexoraDecisionTheatreLiveExecutionComposerIdentity =
  "DTH:10/LiveExecutionComposer" as const;

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function action(
  name: NexoraDecisionTheatreLiveExecutionAction,
  available: boolean,
  reason: string,
): NexoraDecisionTheatreLiveExecutionActionAvailability {
  return Object.freeze({ action: name, available, reason });
}

function observation(status: "known" | "unknown", summary: string): NexoraDecisionTheatreLiveExecutionObservation {
  return Object.freeze({ status, summary });
}

function liveStatus(status: string | null): boolean {
  return status === "in-progress" || status === "blocked" || status === "at-risk" || status === "completed";
}

function theatreState(
  status: string,
  hasAttention: boolean,
  blocked: boolean,
): NexoraDecisionTheatreLiveExecutionState {
  if (status === "completed") return "EXECUTION_COMPLETED";
  if (blocked || status === "blocked") return "EXECUTION_BLOCKED";
  if (status === "at-risk" || hasAttention) return "EXECUTION_ATTENTION";
  if (status === "planned" || status === "ready") return "EXECUTION_CREATED";
  return "EXECUTION_ACTIVE";
}

export function projectNexoraDecisionTheatreLiveExecution(input: {
  readonly theatre: NexoraDecisionTheatreFoundation;
  readonly authoritativeExecutions?: readonly NexoraDecisionTheatreAuthoritativeExecution[] | null;
}): NexoraDecisionTheatreLiveExecution | null {
  const commitment = input.theatre.decisionCommitment;
  if (commitment?.state !== "COMMITTED" || commitment.authoritativeDecisionId == null) return null;

  const related =
    (input.authoritativeExecutions ?? []).find((item) => item.decisionId === commitment.authoritativeDecisionId) ??
    null;
  if (related == null || !liveStatus(related.status)) return null;

  const hasAuthoritativeBlock = related.status === "blocked";
  const attentionFromRisks = related.risks.map((item) =>
    Object.freeze({
      id: item.riskId,
      label: item.label,
      kind: "risk" as const,
      attention: true as const,
      blocked: false as const,
      relatedNotCausal: true as const,
    }),
  );
  const attentionFromConstraints =
    related.status === "blocked"
      ? []
      : related.blockers.map((item) =>
          Object.freeze({
            id: item.blockerId,
            label: item.label,
            kind: "constraint" as const,
            attention: true as const,
            blocked: false as const,
            relatedNotCausal: true as const,
          }),
        );
  const attentionFromStatus =
    related.status === "at-risk"
      ? [
          Object.freeze({
            id: `${related.executionId}:at-risk`,
            label: "Existing Execution authority reports this Execution as at risk.",
            kind: "canonical-status" as const,
            attention: true as const,
            blocked: false as const,
            relatedNotCausal: true as const,
          }),
        ]
      : [];
  const attentionSignals = Object.freeze([
    ...attentionFromRisks,
    ...attentionFromConstraints,
    ...attentionFromStatus,
  ]);
  const blockers = Object.freeze(
    hasAuthoritativeBlock
      ? related.blockers.map((item) =>
          Object.freeze({
            id: item.blockerId,
            label: item.label,
            source: "authoritative-execution" as const,
            blocked: true as const,
          }),
        )
      : [],
  );
  const state = theatreState(related.status, attentionSignals.length > 0, hasAuthoritativeBlock);
  const progressKnown = related.progress != null;
  const ownerKnown = related.ownerIds.length > 0;
  const timingKnown = related.milestones.some((item) => item.deadline);
  const outcomeKnown = related.outcomeId != null && related.outcomeId.length > 0;
  const progressObservation = progressKnown
    ? observation("known", `Authoritative progress observation: ${related.progress}.`)
    : observation("unknown", "Execution has started, but no authoritative progress observation is available yet.");
  const ownerObservation = ownerKnown
    ? observation("known", related.ownerIds.join(", "))
    : observation("unknown", "An owner is not established.");
  const timingObservation = timingKnown
    ? observation("known", "Timing comes from existing execution milestones.")
    : observation("unknown", "Timing is not established.");
  const outcomeObservation = outcomeKnown
    ? observation("known", "An outcome observation is available for this Execution.")
    : observation("unknown", "No authoritative Outcome has been observed or recorded yet.");
  const unknowns = Object.freeze(
    [
      progressKnown ? null : "progress",
      ownerKnown ? null : "owner",
      timingKnown ? null : "timing",
      outcomeKnown ? null : "outcome",
    ].filter((item): item is string => item != null),
  );
  const risks = Object.freeze(
    related.risks.map((item) =>
      Object.freeze({
        id: item.riskId,
        label: item.label,
        kind: "risk" as const,
        related: true as const,
        causal: false as const,
      }),
    ),
  );
  const constraints = Object.freeze(
    related.blockers.map((item) =>
      Object.freeze({
        id: item.blockerId,
        label: item.label,
        kind: "constraint" as const,
        related: true as const,
        causal: false as const,
      }),
    ),
  );
  const decisionTitle = commitment.candidateLabel ?? commitment.advisorReadable.reviewing;
  const attentionCopy =
    attentionSignals.length === 0
      ? "No supported attention signal is currently available."
      : attentionSignals.map((item) => `${item.label} deserves attention.`).join(" ");
  const blockedCopy =
    state === "EXECUTION_BLOCKED"
      ? blockers.length > 0
        ? `Execution is blocked by ${blockers.map((item) => item.label).join("; ")}.`
        : "Existing Execution authority reports this Execution as blocked."
      : "No authoritative evidence indicates that Execution cannot proceed.";
  const associationCopy =
    constraints.length > 0 && state !== "EXECUTION_BLOCKED"
      ? "A related constraint is associated with this Execution. That does not by itself mean it has stopped execution."
      : constraints.length > 0
        ? "Existing Execution authority reports a blocker for this Execution."
        : "No related constraint is established on this Execution.";
  const knownFacts = Object.freeze(
    [
      `Canonical status is ${related.status}.`,
      ownerKnown ? `Owner: ${related.ownerIds.join(", ")}.` : null,
      progressKnown ? `Progress observation: ${related.progress}.` : null,
      timingKnown ? "Timing is established on existing milestones." : null,
    ].filter((item): item is string => item != null),
  );
  const liveExecutionId = `dth10-live:${input.theatre.sceneScript.scriptId}:${related.executionId}:${state}`;

  return freezeTree({
    identity: nexoraDecisionTheatreLiveExecutionIdentity,
    version: nexoraDecisionTheatreLiveExecutionVersion,
    liveExecutionId,
    open: true as const,
    state,
    sceneIntentKind: input.theatre.sceneIntent.intentKind,
    sceneScriptId: input.theatre.sceneScript.scriptId,
    executionId: related.executionId,
    decisionId: related.decisionId,
    decisionTitle,
    canonicalStatus: related.status,
    progressObservation,
    ownerObservation,
    timingObservation,
    outcomeObservation,
    evidence: Object.freeze([]),
    risks,
    constraints,
    kpis: Object.freeze([]),
    attentionSignals,
    unknowns,
    blockers,
    outcomeId: related.outcomeId ?? null,
    comparisonMemberIds: commitment.comparisonMemberIds,
    suggestedQuestions: Object.freeze([
      "What is happening now?",
      "How is it going?",
      "Does anything need my attention?",
    ]),
    actions: Object.freeze([
      action("VIEW_ACTIVE_EXECUTION", true, "The Execution comes from the existing Execution authority."),
      action("VIEW_AUTHORIZING_DECISION", true, "The authorizing Decision comes from the existing Decision authority."),
      action(
        "SHOW_COMPARISON_HISTORY",
        commitment.comparisonMemberIds.length >= 2,
        "Compared options remain available as history, not as an open choice.",
      ),
      action("INSPECT_RELATED_OBJECT", true, "Inspection reuses existing object investigation."),
    ]),
    advisorReadable: Object.freeze({
      scene: `The approved ${decisionTitle} decision is now being executed. The active Execution is at the center of the Theatre.`,
      happeningNow: `The approved ${decisionTitle} decision is now being executed. The active Execution is at the center of the Theatre.`,
      why: `This Execution comes from the ${decisionTitle} decision that you approved.`,
      progress: progressObservation.summary,
      attention: attentionCopy,
      blocked: blockedCopy,
      known: knownFacts.join(" "),
      unknown: unknowns.length
        ? unknowns.map((item) => `${item} is not established`).join(". ") + "."
        : "No additional Execution observations are missing from current sources.",
      outcome: outcomeObservation.summary,
      association: associationCopy,
      completeQuestion:
        related.status === "completed"
          ? "Yes. Existing Execution authority records this Execution as complete."
          : "No. Execution has started, but it is not marked complete.",
      completeCommand:
        "Completing Execution uses the existing Execution authority and requires an explicit confirmation. Viewing this scene does not complete it.",
      mustNotInfer: Object.freeze([
        "Missing progress is not 0%.",
        "Missing timing is not delayed.",
        "Missing owner is not blocked.",
        "Attention is not the same as blocked.",
        "Related is not the same as caused.",
        "No Outcome yet is not unsuccessful.",
      ]),
    }),
    limitations: Object.freeze([
      "DTH:10 does not create Execution records or fabricate progress, owners, deadlines, or outcomes.",
      "Outcome Theatre is not implemented here.",
    ]),
    derivationMetadata: Object.freeze({
      composer: "DTH:10/LiveExecutionComposer" as const,
      inventedExecution: false as const,
      inventedProgress: false as const,
      unknownPromotedToBlocked: false as const,
      unknownPromotedToAttention: false as const,
      associationPromotedToCause: false as const,
      clickMutatedExecution: false as const,
      completedExecution: false as const,
      inventedOutcome: false as const,
      mutatedStage: false as const,
      timestampUsed: false as const,
      randomUsed: false as const,
    }),
  });
}
