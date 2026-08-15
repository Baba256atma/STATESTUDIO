/**
 * CC:7 — Pure executive context updater.
 *
 * Updates only from trusted successful results or explicit Runtime focus sync.
 * Never mutates Runtime/Stage.
 */

import type { NexoraConversationalIntentResolution } from "./conversationalIntent.ts";
import type {
  NexoraConversationalContextResolution,
  NexoraConversationalSubjectKind,
  NexoraConversationalSubjectRecord,
} from "./conversationalContext.ts";
import type { NexoraConversationalExperienceContextResolution } from "./conversationalExperienceContext.ts";
import type { NexoraConversationalCommandMappingResult } from "./conversationalCommand.ts";
import type { NexoraConversationalRuntimeBridgeResult } from "./conversationalRuntimeBridge.ts";
import {
  EXECUTIVE_CONTEXT_BOUNDS,
  EXECUTIVE_CONTEXT_REASON,
} from "./executiveContextAwareness.ts";
import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
  freezeExecutiveContextSnapshot,
  type NexoraExecutiveContextChange,
  type NexoraExecutiveContextReference,
  type NexoraExecutiveContextSnapshot,
  type NexoraExecutiveContextUpdateResult,
  type NexoraPresentedExecutiveSet,
  type NexoraPresentedExecutiveSetKind,
} from "./executiveContextSnapshot.ts";

export type NexoraExecutiveContextUpdateInput = {
  readonly previousContext: NexoraExecutiveContextSnapshot;
  readonly intentResult?: NexoraConversationalIntentResolution | null;
  readonly resolvedContext?: NexoraConversationalContextResolution | null;
  readonly experienceResult?: NexoraConversationalExperienceContextResolution | null;
  readonly commandResult?: NexoraConversationalCommandMappingResult | null;
  readonly runtimeResult?: NexoraConversationalRuntimeBridgeResult | null;
  /** Applied Runtime focus after trusted success (preferred over intent subject). */
  readonly runtimeFocusedSubjectId?: string | null;
  readonly runtimeFocusedSubjectKind?: NexoraConversationalSubjectKind | null;
  readonly runtimeFocusedCanonicalName?: string | null;
  readonly runtimeWorkspaceId?: string | null;
  readonly runtimeModelId?: string | null;
  /** Trusted presented set from Runtime/catalog projection (optional). */
  readonly presentedSet?: NexoraPresentedExecutiveSet | null;
  /** Subject registry for kind/name lookup. */
  readonly executiveSubjects?: readonly NexoraConversationalSubjectRecord[];
  /**
   * When true, treat as successful trusted turn (conversation apply).
   * When false/omitted with no syncSource, preserve context (failed turn).
   */
  readonly trustedSuccess?: boolean;
  /**
   * Direct Runtime observation path (click / navigation / workspace sync).
   * Does not require conversational command success.
   */
  readonly syncSource?: "runtime" | "navigation" | "workspace-transition" | null;
  /** CC:8 recommendation id reference (advisory turns). */
  readonly lastRecommendationId?: string | null;
};

function lookupSubject(
  subjectId: string | null | undefined,
  subjects: readonly NexoraConversationalSubjectRecord[] | undefined,
): NexoraConversationalSubjectRecord | null {
  if (!subjectId || !subjects) return null;
  return subjects.find((s) => s.subjectId === subjectId) ?? null;
}

function makeRef(input: {
  readonly subjectId: string;
  readonly subjectKind: NexoraConversationalSubjectKind;
  readonly canonicalName?: string;
  readonly source: NexoraExecutiveContextReference["source"];
  readonly turnIndex: number;
}): NexoraExecutiveContextReference {
  return freezeExecutiveContextReference({
    subjectId: input.subjectId,
    subjectKind: input.subjectKind,
    ...(input.canonicalName ? { canonicalName: input.canonicalName } : {}),
    source: input.source,
    turnIndex: input.turnIndex,
  });
}

function pushBoundedPrevious(
  previous: readonly NexoraExecutiveContextReference[],
  pushed: NexoraExecutiveContextReference | null,
  excludeId: string | null,
): readonly NexoraExecutiveContextReference[] {
  const next = [
    ...(pushed ? [pushed] : []),
    ...previous,
  ].filter(
    (ref, index, all) =>
      ref.subjectId !== excludeId &&
      all.findIndex((r) => r.subjectId === ref.subjectId) === index,
  );
  return Object.freeze(next.slice(0, EXECUTIVE_CONTEXT_BOUNDS.previousSubjects));
}

function pushRecent(
  recent: readonly NexoraExecutiveContextReference[],
  ref: NexoraExecutiveContextReference | null,
): readonly NexoraExecutiveContextReference[] {
  if (!ref) return recent;
  const next = [ref, ...recent].filter(
    (r, index, all) =>
      all.findIndex((x) => x.subjectId === r.subjectId) === index,
  );
  return Object.freeze(next.slice(0, EXECUTIVE_CONTEXT_BOUNDS.recentReferences));
}

function applySemanticSlot(
  draft: NexoraExecutiveContextSnapshot,
  ref: NexoraExecutiveContextReference,
  changes: NexoraExecutiveContextChange[],
): NexoraExecutiveContextSnapshot {
  switch (ref.subjectKind) {
    case "goal":
      changes.push(
        Object.freeze({
          kind: "set-goal" as const,
          previousValue: draft.currentGoal,
          nextValue: ref,
          reason: EXECUTIVE_CONTEXT_REASON.SEMANTIC_SLOT_UPDATED,
        }),
      );
      return { ...draft, currentGoal: ref };
    case "problem":
      changes.push(
        Object.freeze({
          kind: "set-problem" as const,
          previousValue: draft.currentProblem,
          nextValue: ref,
          reason: EXECUTIVE_CONTEXT_REASON.SEMANTIC_SLOT_UPDATED,
        }),
      );
      return { ...draft, currentProblem: ref };
    case "scenario":
      changes.push(
        Object.freeze({
          kind: "set-scenario" as const,
          previousValue: draft.currentScenario,
          nextValue: ref,
          reason: EXECUTIVE_CONTEXT_REASON.SEMANTIC_SLOT_UPDATED,
        }),
      );
      return { ...draft, currentScenario: ref };
    case "decision":
      changes.push(
        Object.freeze({
          kind: "set-decision" as const,
          previousValue: draft.currentDecision,
          nextValue: ref,
          reason: EXECUTIVE_CONTEXT_REASON.SEMANTIC_SLOT_UPDATED,
        }),
      );
      return { ...draft, currentDecision: ref };
    case "execution":
      changes.push(
        Object.freeze({
          kind: "set-execution" as const,
          previousValue: draft.currentExecution,
          nextValue: ref,
          reason: EXECUTIVE_CONTEXT_REASON.SEMANTIC_SLOT_UPDATED,
        }),
      );
      return { ...draft, currentExecution: ref };
    default:
      return draft;
  }
}

function dropIncompatibleSlotsOnWorkspaceChange(
  draft: NexoraExecutiveContextSnapshot,
  changes: NexoraExecutiveContextChange[],
): NexoraExecutiveContextSnapshot {
  // Soft policy: keep semantic slots; drop presented set (collection is workspace-local).
  if (draft.presentedSet) {
    changes.push(
      Object.freeze({
        kind: "drop-stale-reference" as const,
        previousValue: draft.presentedSet,
        nextValue: null,
        reason: EXECUTIVE_CONTEXT_REASON.STALE_REFERENCE_DROPPED,
      }),
    );
  }
  return { ...draft, presentedSet: null };
}

/**
 * Primary CC:7 API — update executive context from trusted results.
 */
export function updateNexoraExecutiveContext(
  input: NexoraExecutiveContextUpdateInput,
): NexoraExecutiveContextUpdateResult {
  const previous =
    input.previousContext ?? createEmptyNexoraExecutiveContextSnapshot();
  const changes: NexoraExecutiveContextChange[] = [];
  const reasons: string[] = [];

  const trustedSuccess = input.trustedSuccess === true;
  const syncSource = input.syncSource ?? null;

  if (!trustedSuccess && !syncSource) {
    reasons.push(
      EXECUTIVE_CONTEXT_REASON.FAILED_TURN_CONTEXT_PRESERVED,
      EXECUTIVE_CONTEXT_REASON.DETERMINISTIC,
    );
    return Object.freeze({
      nextContext: freezeExecutiveContextSnapshot(previous),
      changes: Object.freeze([]),
      trace: Object.freeze({
        previousTurnIndex: previous.turnIndex,
        nextTurnIndex: previous.turnIndex,
        trustedUpdate: false,
        reasons: Object.freeze(reasons),
        changeKinds: Object.freeze([]),
      }),
    });
  }

  const nextTurn = previous.turnIndex + 1;
  changes.push(
    Object.freeze({
      kind: "advance-turn" as const,
      previousValue: previous.turnIndex,
      nextValue: nextTurn,
      reason: EXECUTIVE_CONTEXT_REASON.TURN_INDEX_ADVANCED,
    }),
  );
  reasons.push(EXECUTIVE_CONTEXT_REASON.TURN_INDEX_ADVANCED);

  let draft: NexoraExecutiveContextSnapshot = {
    ...previous,
    turnIndex: nextTurn,
  };

  // Scope sync from applied Runtime workspace/model.
  const nextWorkspace =
    input.runtimeWorkspaceId ?? draft.currentWorkspaceId ?? null;
  const nextModel = input.runtimeModelId ?? draft.currentModelId ?? null;
  if (
    nextWorkspace !== draft.currentWorkspaceId ||
    nextModel !== draft.currentModelId
  ) {
    changes.push(
      Object.freeze({
        kind: "change-scope" as const,
        previousValue: Object.freeze({
          workspaceId: draft.currentWorkspaceId,
          modelId: draft.currentModelId,
        }),
        nextValue: Object.freeze({
          workspaceId: nextWorkspace,
          modelId: nextModel,
        }),
        reason: EXECUTIVE_CONTEXT_REASON.WORKSPACE_SCOPE_CHANGED,
      }),
    );
    reasons.push(EXECUTIVE_CONTEXT_REASON.WORKSPACE_SCOPE_CHANGED);
    draft = dropIncompatibleSlotsOnWorkspaceChange(
      {
        ...draft,
        currentWorkspaceId: nextWorkspace,
        currentModelId: nextModel,
      },
      changes,
    );
  }

  // Resolve subject identity for context update.
  const primary = input.resolvedContext?.context.primarySubject ?? null;
  const runtimeId = input.runtimeFocusedSubjectId ?? null;
  const subjectId = runtimeId ?? primary?.subjectId ?? null;
  const lookedUp = lookupSubject(subjectId, input.executiveSubjects);
  const subjectKind =
    input.runtimeFocusedSubjectKind ??
    lookedUp?.subjectKind ??
    primary?.subjectKind ??
    null;
  const canonicalName =
    input.runtimeFocusedCanonicalName ??
    lookedUp?.canonicalName ??
    primary?.canonicalName;

  if (subjectId && subjectKind) {
    const source: NexoraExecutiveContextReference["source"] =
      syncSource === "navigation"
        ? "navigation"
        : syncSource === "workspace-transition"
          ? "workspace-transition"
          : syncSource === "runtime"
            ? "runtime"
            : "explicit";

    const nextRef = makeRef({
      subjectId,
      subjectKind,
      canonicalName,
      source,
      turnIndex: nextTurn,
    });

    const prevCurrent = draft.currentSubject;
    if (prevCurrent?.subjectId !== nextRef.subjectId) {
      if (prevCurrent) {
        changes.push(
          Object.freeze({
            kind: "push-previous-subject" as const,
            previousValue: draft.previousSubjects,
            nextValue: prevCurrent,
            reason: EXECUTIVE_CONTEXT_REASON.CURRENT_SUBJECT_PUSHED_TO_HISTORY,
          }),
        );
        reasons.push(
          EXECUTIVE_CONTEXT_REASON.CURRENT_SUBJECT_PUSHED_TO_HISTORY,
        );
      }
      changes.push(
        Object.freeze({
          kind: "set-current-subject" as const,
          previousValue: prevCurrent,
          nextValue: nextRef,
          reason:
            source === "explicit"
              ? EXECUTIVE_CONTEXT_REASON.EXPLICIT_SUBJECT_BECAME_CURRENT
              : source === "navigation"
                ? EXECUTIVE_CONTEXT_REASON.NAVIGATION_FOCUS_SYNCHRONIZED
                : EXECUTIVE_CONTEXT_REASON.RUNTIME_FOCUS_SYNCHRONIZED,
        }),
      );
      reasons.push(
        source === "explicit"
          ? EXECUTIVE_CONTEXT_REASON.EXPLICIT_SUBJECT_BECAME_CURRENT
          : source === "navigation"
            ? EXECUTIVE_CONTEXT_REASON.NAVIGATION_FOCUS_SYNCHRONIZED
            : EXECUTIVE_CONTEXT_REASON.RUNTIME_FOCUS_SYNCHRONIZED,
        EXECUTIVE_CONTEXT_REASON.EXPLICIT_REFERENCE_PRESERVED,
      );
      draft = {
        ...draft,
        previousSubjects: pushBoundedPrevious(
          draft.previousSubjects,
          prevCurrent,
          nextRef.subjectId,
        ),
        currentSubject: nextRef,
        recentReferences: pushRecent(draft.recentReferences, nextRef),
      };
      draft = applySemanticSlot(draft, nextRef, changes);
    } else if (prevCurrent) {
      // Same subject — refresh turn/source metadata lightly.
      draft = {
        ...draft,
        currentSubject: nextRef,
        recentReferences: pushRecent(draft.recentReferences, nextRef),
      };
      draft = applySemanticSlot(draft, nextRef, changes);
    }
  }

  // Overview: preserve executive structure (do not wipe slots).
  if (input.intentResult?.intent.kind === "overview") {
    reasons.push(
      EXECUTIVE_CONTEXT_REASON.OVERVIEW_PRESERVED_EXECUTIVE_STRUCTURE,
    );
  }

  // Presented set from trusted Runtime projection.
  if (input.presentedSet && input.presentedSet.subjectIds.length > 0) {
    const set: NexoraPresentedExecutiveSet = Object.freeze({
      ...input.presentedSet,
      subjectIds: Object.freeze(
        input.presentedSet.subjectIds.slice(
          0,
          EXECUTIVE_CONTEXT_BOUNDS.presentedSetSubjects,
        ),
      ),
      turnIndex: nextTurn,
    });
    changes.push(
      Object.freeze({
        kind: "record-presented-set" as const,
        previousValue: draft.presentedSet,
        nextValue: set,
        reason: EXECUTIVE_CONTEXT_REASON.PRESENTED_SET_RECORDED,
      }),
    );
    reasons.push(EXECUTIVE_CONTEXT_REASON.PRESENTED_SET_RECORDED);
    draft = { ...draft, presentedSet: set };
  }

  // Last command / runtime result (successful conversation turns).
  const command = input.commandResult?.command ?? null;
  if (trustedSuccess && command) {
    const lastCommand = Object.freeze({
      commandId: command.commandId,
      kind: command.kind,
      primaryTargetId: command.primaryTargetId,
      secondaryTargetIds: Object.freeze([...command.secondaryTargetIds]),
    });
    changes.push(
      Object.freeze({
        kind: "set-last-command" as const,
        previousValue: draft.lastCommand,
        nextValue: lastCommand,
        reason: EXECUTIVE_CONTEXT_REASON.LAST_COMMAND_RECORDED,
      }),
    );
    reasons.push(EXECUTIVE_CONTEXT_REASON.LAST_COMMAND_RECORDED);
    draft = { ...draft, lastCommand };
  }

  const runtime = input.runtimeResult ?? null;
  if (trustedSuccess && runtime) {
    const lastRuntimeResult = Object.freeze({
      status: runtime.status,
      runtimeActionKind: runtime.runtimeActionKind,
      affectedSubjectIds: Object.freeze([...runtime.affectedSubjectIds]),
    });
    changes.push(
      Object.freeze({
        kind: "set-last-runtime-result" as const,
        previousValue: draft.lastRuntimeResult,
        nextValue: lastRuntimeResult,
        reason: EXECUTIVE_CONTEXT_REASON.LAST_RUNTIME_RESULT_RECORDED,
      }),
    );
    reasons.push(EXECUTIVE_CONTEXT_REASON.LAST_RUNTIME_RESULT_RECORDED);
    draft = { ...draft, lastRuntimeResult };
  }

  if (
    trustedSuccess &&
    input.lastRecommendationId != null &&
    input.lastRecommendationId !== ""
  ) {
    changes.push(
      Object.freeze({
        kind: "set-last-recommendation-id" as const,
        previousValue: draft.lastRecommendationId,
        nextValue: input.lastRecommendationId,
        reason: EXECUTIVE_CONTEXT_REASON.LAST_RECOMMENDATION_RECORDED,
      }),
    );
    reasons.push(EXECUTIVE_CONTEXT_REASON.LAST_RECOMMENDATION_RECORDED);
    draft = { ...draft, lastRecommendationId: input.lastRecommendationId };
  }

  reasons.push(
    EXECUTIVE_CONTEXT_REASON.AUTOMATIC_ATTENTION_NOT_CONTEXT_AUTHORITY,
    EXECUTIVE_CONTEXT_REASON.DETERMINISTIC,
  );

  const nextContext = freezeExecutiveContextSnapshot(draft);
  return Object.freeze({
    nextContext,
    changes: Object.freeze(changes),
    trace: Object.freeze({
      previousTurnIndex: previous.turnIndex,
      nextTurnIndex: nextContext.turnIndex,
      trustedUpdate: true,
      reasons: Object.freeze([...reasons]),
      changeKinds: Object.freeze(changes.map((c) => c.kind)),
    }),
  });
}

export function presentedSetKindFromRevealCommand(
  commandKind: string | null | undefined,
): NexoraPresentedExecutiveSetKind | null {
  switch (commandKind) {
    case "reveal-problems":
      return "problems";
    case "reveal-scenarios":
      return "scenarios";
    case "reveal-decisions":
      return "decisions";
    case "reveal-execution":
      return "executions";
    case "reveal-related":
      return "subjects";
    default:
      return null;
  }
}
