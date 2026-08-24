/**
 * CC:7 — MVP adapter: observe Runtime interaction results into executive context.
 *
 * Read-only observation. Does not call Runtime writers.
 */

import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import type { NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  updateNexoraExecutiveContext,
  presentedSetKindFromRevealCommand,
} from "@/app/lib/conversational-control/executiveContextUpdater.ts";
import type {
  NexoraExecutiveContextSnapshot,
  NexoraPresentedExecutiveSet,
} from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import type { NexoraConversationalSubjectKind } from "@/app/lib/conversational-control/conversationalContext.ts";

function kindFromFocused(
  state: NexoraMVPObjectInteractionState,
): NexoraConversationalSubjectKind | null {
  const kind = state.focusedSubject?.kind;
  if (
    kind === "object" ||
    kind === "problem" ||
    kind === "scenario" ||
    kind === "decision" ||
    kind === "execution" ||
    kind === "outcome" ||
    kind === "goal"
  ) {
    return kind;
  }
  return kind ? "unknown" : null;
}

/**
 * Sync CC:7 after direct click / navigation / workspace Runtime changes.
 */
export function syncNexoraExecutiveContextFromRuntimeState(input: {
  readonly previousContext: NexoraExecutiveContextSnapshot;
  readonly nextState: NexoraMVPObjectInteractionState;
  readonly syncSource: "runtime" | "navigation" | "workspace-transition";
  readonly executiveSubjects?: readonly NexoraConversationalSubjectRecord[];
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
}): ReturnType<typeof updateNexoraExecutiveContext> {
  const focused = input.nextState.focusedSubject;
  let presentedSet: NexoraPresentedExecutiveSet | null = null;
  if (input.nextState.collectionContext?.objectIds?.length) {
    const category = input.nextState.collectionContext.category;
    const kind =
      category === "problem"
        ? "problems"
        : category === "scenario"
          ? "scenarios"
          : category === "decision"
            ? "decisions"
            : category === "execution"
              ? "executions"
              : "subjects";
    presentedSet = Object.freeze({
      kind,
      subjectIds: Object.freeze([...input.nextState.collectionContext.objectIds]),
      anchorSubjectId: focused?.id ?? null,
      turnIndex: input.previousContext.turnIndex + 1,
    });
  }

  return updateNexoraExecutiveContext({
    previousContext: input.previousContext,
    syncSource: input.syncSource,
    runtimeFocusedSubjectId: focused?.id ?? null,
    runtimeFocusedSubjectKind: kindFromFocused(input.nextState),
    runtimeFocusedCanonicalName: focused?.label ?? null,
    runtimeWorkspaceId: input.nextState.workspace,
    presentedSet,
    executiveSubjects: input.executiveSubjects,
  });
}

/**
 * Build a presented set from catalog links for reveal-* with an anchor object.
 */
export function buildPresentedSetFromCatalogLinks(input: {
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly anchorSubjectId: string | null;
  readonly commandKind: string | null;
  readonly turnIndex: number;
}): NexoraPresentedExecutiveSet | null {
  const setKind = presentedSetKindFromRevealCommand(input.commandKind);
  if (!setKind || !input.anchorSubjectId) return null;

  const wantedKind =
    setKind === "problems"
      ? "problem"
      : setKind === "scenarios"
        ? "scenario"
        : setKind === "decisions"
          ? "decision"
          : setKind === "executions"
            ? "execution"
            : null;

  const linkedIds = input.catalog.contextLinks
    .filter((link) => link.objectId === input.anchorSubjectId)
    .map((link) => link.contextId);

  const subjectIds = Object.freeze(
    input.catalog.contextSubjects
      .filter((subject) => {
        if (!linkedIds.includes(subject.id)) return false;
        if (!wantedKind) return true;
        return subject.kind === wantedKind;
      })
      .map((subject) => subject.id),
  );

  if (subjectIds.length === 0) return null;

  return Object.freeze({
    kind: setKind,
    subjectIds,
    anchorSubjectId: input.anchorSubjectId,
    turnIndex: input.turnIndex,
  });
}

export function buildPresentedSetFromCollectionState(
  state: NexoraMVPObjectInteractionState,
  turnIndex: number,
): NexoraPresentedExecutiveSet | null {
  const collection = state.collectionContext;
  if (!collection?.objectIds?.length) return null;
  const category = collection.category;
  const kind =
    category === "problem"
      ? "problems"
      : category === "scenario"
        ? "scenarios"
        : category === "decision"
          ? "decisions"
          : category === "execution"
            ? "executions"
            : "subjects";
  return Object.freeze({
    kind,
    subjectIds: Object.freeze([...collection.objectIds]),
    anchorSubjectId: state.focusedSubject?.id ?? null,
    turnIndex,
  });
}
