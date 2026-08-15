/**
 * CC:10 / CC:10R — Conversational Decision *session* metadata only.
 *
 * Product Decision status/lock/identity live in NexoraDecisionRuntimeAdapter.
 * This session retains:
 * - pending confirmation
 * - last referenced decision id
 * - supplemental provenance keyed by canonical decisionId
 */

import type {
  NexoraDecisionRationale,
  NexoraExecutiveDecision,
} from "./executiveDecisionCandidate.ts";
import type { NexoraPendingDecisionConfirmation } from "./executiveDecisionConfirmation.ts";
import type { NexoraDecisionRuntimeAdapter } from "./executiveDecisionRuntimeAdapter.ts";
import type { NexoraDecisionTransitionAction } from "./executiveDecisionTransition.ts";

/** @deprecated Product decisions no longer live here — use Decision Runtime. */
export type NexoraExecutiveDecisionSessionLegacyProduct = {
  readonly decisionsById: Readonly<Record<string, NexoraExecutiveDecision>>;
  readonly pendingConfirmation: NexoraPendingDecisionConfirmation | null;
  readonly lastDecisionId: string | null;
};

export type NexoraDecisionProvenanceRecord = {
  readonly decisionId: string;
  readonly candidateId?: string;
  readonly scenarioId?: string;
  readonly scenarioRevision?: number;
  readonly recommendationId?: string;
  readonly evidenceRefs: NexoraExecutiveDecision["evidenceRefs"];
  readonly uncertaintyRefs: readonly string[];
  readonly rationale?: NexoraDecisionRationale;
  readonly source: "conversation";
  readonly workspaceId?: string | null;
  readonly modelId?: string | null;
};

/**
 * Session-only conversational Decision metadata (not product truth).
 */
export type NexoraExecutiveDecisionSession = {
  readonly pendingConfirmation: NexoraPendingDecisionConfirmation | null;
  readonly lastReferencedDecisionId: string | null;
  readonly provenanceByDecisionId: Readonly<
    Record<string, NexoraDecisionProvenanceRecord>
  >;
};

export function createEmptyNexoraExecutiveDecisionSession(): NexoraExecutiveDecisionSession {
  return Object.freeze({
    pendingConfirmation: null,
    lastReferencedDecisionId: null,
    provenanceByDecisionId: Object.freeze({}),
  });
}

export function setPendingDecisionConfirmation(
  session: NexoraExecutiveDecisionSession,
  pending: NexoraPendingDecisionConfirmation | null,
): NexoraExecutiveDecisionSession {
  return Object.freeze({
    ...session,
    pendingConfirmation: pending,
  });
}

export function rememberDecisionProvenance(
  session: NexoraExecutiveDecisionSession,
  provenance: NexoraDecisionProvenanceRecord,
): NexoraExecutiveDecisionSession {
  return Object.freeze({
    ...session,
    lastReferencedDecisionId: provenance.decisionId,
    provenanceByDecisionId: Object.freeze({
      ...session.provenanceByDecisionId,
      [provenance.decisionId]: Object.freeze({ ...provenance }),
    }),
  });
}

export type ApplyNexoraExecutiveDecisionTransitionInput = {
  readonly runtime: NexoraDecisionRuntimeAdapter;
  readonly session: NexoraExecutiveDecisionSession;
  readonly decisionId: string;
  readonly action: NexoraDecisionTransitionAction;
  readonly title: string;
  readonly subjectIds?: readonly string[];
  readonly scenarioId?: string;
  readonly scenarioRevision?: number;
  readonly recommendationId?: string;
  readonly rationale?: NexoraDecisionRationale;
  readonly evidenceRefs?: NexoraExecutiveDecision["evidenceRefs"];
  readonly uncertaintyRefs?: readonly string[];
  readonly workspaceId?: string | null;
  readonly modelId?: string | null;
  readonly candidateId?: string;
  readonly committedAt?: string;
};

export type ApplyNexoraExecutiveDecisionTransitionResult = {
  readonly status:
    | "applied"
    | "already-committed"
    | "transition-not-allowed"
    | "failed";
  readonly decision: NexoraExecutiveDecision | null;
  readonly nextSession: NexoraExecutiveDecisionSession;
  readonly reasons: readonly string[];
};

/**
 * Apply a Decision transition through the canonical Runtime adapter,
 * then attach conversational provenance to the session metadata.
 */
export function applyNexoraExecutiveDecisionTransition(
  input: ApplyNexoraExecutiveDecisionTransitionInput,
): ApplyNexoraExecutiveDecisionTransitionResult {
  const result = input.runtime.transitionDecision({
    decisionId: input.decisionId,
    action: input.action,
    title: input.title,
    subjectIds: input.subjectIds,
    scenarioId: input.scenarioId,
    scenarioRevision: input.scenarioRevision,
    recommendationId: input.recommendationId,
    rationale: input.rationale,
    evidenceRefs: input.evidenceRefs,
    uncertaintyRefs: input.uncertaintyRefs,
    workspaceId: input.workspaceId,
    modelId: input.modelId,
    candidateId: input.candidateId,
    committedAt: input.committedAt,
  });

  if (result.status !== "applied" || result.decision == null) {
    return Object.freeze({
      status: result.status,
      decision: result.decision,
      nextSession: input.session,
      reasons: result.reasons,
    });
  }

  const nextSession = rememberDecisionProvenance(
    setPendingDecisionConfirmation(input.session, null),
    {
      decisionId: result.decision.decisionId,
      candidateId: input.candidateId,
      scenarioId: input.scenarioId ?? result.decision.scenarioId,
      scenarioRevision:
        input.scenarioRevision ?? result.decision.scenarioRevision,
      recommendationId:
        input.recommendationId ?? result.decision.recommendationId,
      evidenceRefs: input.evidenceRefs ?? result.decision.evidenceRefs,
      uncertaintyRefs:
        input.uncertaintyRefs ?? result.decision.uncertaintyRefs,
      rationale: input.rationale ?? result.decision.rationale,
      source: "conversation",
      workspaceId: input.workspaceId,
      modelId: input.modelId,
    },
  );

  return Object.freeze({
    status: "applied" as const,
    decision: result.decision,
    nextSession,
    reasons: result.reasons,
  });
}

export function findDecisionByScenarioId(
  runtime: NexoraDecisionRuntimeAdapter,
  scenarioId: string,
): NexoraExecutiveDecision | null {
  return runtime.findDecisionByScenarioId(scenarioId);
}

export function findDecisionById(
  runtime: NexoraDecisionRuntimeAdapter,
  decisionId: string,
): NexoraExecutiveDecision | null {
  return runtime.getDecision(decisionId);
}
