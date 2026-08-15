/**
 * CC:7 — Projection of executive context for CC:1–6 consumption.
 *
 * Supplies only what upstream resolvers need. Does not expose full CC:7 state.
 */

import type { NexoraConversationContextSnapshot } from "./conversationalContext.ts";
import type { NexoraExecutiveContextSnapshot } from "./executiveContextSnapshot.ts";

export type NexoraExecutiveConversationContextProjection = {
  readonly currentSubjectId: string | null;
  readonly previousSubjectIds: readonly string[];
  readonly currentWorkspaceId: string | null;
  readonly currentModelId: string | null;
  readonly recentCandidateIds: readonly string[];
  readonly presentedSubjectIds: readonly string[];
  readonly presentedSetKind: string | null;
  readonly presentedAnchorSubjectId: string | null;
};

/**
 * Project CC:7 snapshot into the shape CC:2 / orchestrator consume.
 */
export function projectExecutiveContextForConversation(
  context: NexoraExecutiveContextSnapshot | null | undefined,
): NexoraExecutiveConversationContextProjection {
  if (!context) {
    return Object.freeze({
      currentSubjectId: null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: null,
      currentModelId: null,
      recentCandidateIds: Object.freeze([]),
      presentedSubjectIds: Object.freeze([]),
      presentedSetKind: null,
      presentedAnchorSubjectId: null,
    });
  }

  const recentCandidateIds = Object.freeze([
    ...(context.currentSubject ? [context.currentSubject.subjectId] : []),
    ...context.previousSubjects.map((s) => s.subjectId),
    ...context.recentReferences.map((s) => s.subjectId),
  ].filter((id, index, all) => all.indexOf(id) === index));

  return Object.freeze({
    currentSubjectId: context.currentSubject?.subjectId ?? null,
    previousSubjectIds: Object.freeze(
      context.previousSubjects.map((s) => s.subjectId),
    ),
    currentWorkspaceId: context.currentWorkspaceId,
    currentModelId: context.currentModelId,
    recentCandidateIds,
    presentedSubjectIds: Object.freeze(
      context.presentedSet?.subjectIds ?? [],
    ),
    presentedSetKind: context.presentedSet?.kind ?? null,
    presentedAnchorSubjectId: context.presentedSet?.anchorSubjectId ?? null,
  });
}

/**
 * Compatibility bridge: CC:7 projection → existing CC:2 conversation snapshot.
 */
export function toNexoraConversationContextSnapshot(
  context: NexoraExecutiveContextSnapshot | null | undefined,
): NexoraConversationContextSnapshot {
  const projected = projectExecutiveContextForConversation(context);
  return Object.freeze({
    currentSubjectId: projected.currentSubjectId,
    previousSubjectIds: projected.previousSubjectIds,
    currentWorkspaceId: projected.currentWorkspaceId,
    currentModelId: projected.currentModelId,
    presentedSubjectIds: projected.presentedSubjectIds,
    presentedSetKind: projected.presentedSetKind,
    presentedAnchorSubjectId: projected.presentedAnchorSubjectId,
    recentCandidateIds: projected.recentCandidateIds,
  });
}

/**
 * Compact Advisor-facing summary (read-only). No raw internal dump.
 */
export function projectExecutiveContextForAdvisorSummary(
  context: NexoraExecutiveContextSnapshot | null | undefined,
): string | null {
  if (!context?.currentSubject) return null;
  const parts: string[] = [context.currentSubject.canonicalName ?? context.currentSubject.subjectId];
  if (
    context.currentProblem &&
    context.currentProblem.subjectId !== context.currentSubject.subjectId
  ) {
    parts.push(
      context.currentProblem.canonicalName ?? context.currentProblem.subjectId,
    );
  }
  return parts.join(" → ");
}
