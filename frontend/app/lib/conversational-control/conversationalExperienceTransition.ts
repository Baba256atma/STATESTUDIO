/**
 * CC:6 — Experience transition plan helpers.
 * Resolution stays read-only; execution remains CC:4 + workspace authority.
 */

import type {
  NexoraExecutiveExperienceContext,
  NexoraExecutiveExperienceTransitionPlan,
  NexoraExperienceContextChange,
  NexoraExperienceTransitionDecision,
} from "./conversationalExperienceContext.ts";

export function buildNexoraExperienceContextChanges(
  from: NexoraExecutiveExperienceContext,
  to: NexoraExecutiveExperienceContext,
): readonly NexoraExperienceContextChange[] {
  const changes: NexoraExperienceContextChange[] = [];
  if (from.workspaceId !== to.workspaceId) {
    changes.push(
      Object.freeze({
        field: "workspace" as const,
        from: from.workspaceId,
        to: to.workspaceId,
      }),
    );
  }
  if (
    to.presentationState != null &&
    from.presentationState !== to.presentationState
  ) {
    changes.push(
      Object.freeze({
        field: "presentationState" as const,
        from: from.presentationState,
        to: to.presentationState,
      }),
    );
  }
  if (to.entrySubjectId && from.entrySubjectId !== to.entrySubjectId) {
    changes.push(
      Object.freeze({
        field: "entrySubject" as const,
        from: from.entrySubjectId,
        to: to.entrySubjectId,
      }),
    );
  }
  return Object.freeze(changes);
}

export function planNexoraExecutiveExperienceTransition(input: {
  readonly from: NexoraExecutiveExperienceContext;
  readonly to: NexoraExecutiveExperienceContext;
  readonly decision: NexoraExperienceTransitionDecision;
  readonly reasons: readonly string[];
}): NexoraExecutiveExperienceTransitionPlan {
  const changes = buildNexoraExperienceContextChanges(input.from, input.to);
  return Object.freeze({
    from: input.from,
    to: input.to,
    changes,
    decision: input.decision,
    executable: input.decision === "transition" && changes.length > 0,
    requiresConfirmation: false,
    reasons: Object.freeze([...input.reasons]),
  });
}
