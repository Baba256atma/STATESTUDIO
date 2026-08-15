/**
 * CC:7 — Structured executive context snapshot contracts.
 */

import type { NexoraConversationalSubjectKind } from "./conversationalContext.ts";
import { EXECUTIVE_CONTEXT_BOUNDS } from "./executiveContextAwareness.ts";

export const NEXORA_EXECUTIVE_CONTEXT_REFERENCE_SOURCES = Object.freeze([
  "explicit",
  "conversation",
  "workspace-transition",
  "navigation",
  "runtime",
] as const);

export type NexoraExecutiveContextReferenceSource =
  (typeof NEXORA_EXECUTIVE_CONTEXT_REFERENCE_SOURCES)[number];

export type NexoraExecutiveContextReference = {
  readonly subjectId: string;
  readonly subjectKind: NexoraConversationalSubjectKind;
  readonly canonicalName?: string;
  readonly source: NexoraExecutiveContextReferenceSource;
  readonly turnIndex: number;
};

export type NexoraExecutiveContextCommandReference = {
  readonly commandId: string;
  readonly kind: string;
  readonly primaryTargetId: string | null;
  readonly secondaryTargetIds: readonly string[];
};

export type NexoraExecutiveContextRuntimeReference = {
  readonly status: string;
  readonly runtimeActionKind: string | null;
  readonly affectedSubjectIds: readonly string[];
};

export const NEXORA_PRESENTED_EXECUTIVE_SET_KINDS = Object.freeze([
  "subjects",
  "problems",
  "scenarios",
  "decisions",
  "executions",
] as const);

export type NexoraPresentedExecutiveSetKind =
  (typeof NEXORA_PRESENTED_EXECUTIVE_SET_KINDS)[number];

export type NexoraPresentedExecutiveSet = {
  readonly kind: NexoraPresentedExecutiveSetKind;
  readonly subjectIds: readonly string[];
  readonly anchorSubjectId: string | null;
  readonly turnIndex: number;
};

export type NexoraExecutiveContextSnapshot = {
  readonly currentSubject: NexoraExecutiveContextReference | null;
  readonly previousSubjects: readonly NexoraExecutiveContextReference[];
  readonly currentGoal: NexoraExecutiveContextReference | null;
  readonly currentProblem: NexoraExecutiveContextReference | null;
  readonly currentScenario: NexoraExecutiveContextReference | null;
  readonly currentDecision: NexoraExecutiveContextReference | null;
  readonly currentExecution: NexoraExecutiveContextReference | null;
  readonly currentWorkspaceId: string | null;
  readonly currentModelId: string | null;
  readonly lastCommand: NexoraExecutiveContextCommandReference | null;
  readonly lastRuntimeResult: NexoraExecutiveContextRuntimeReference | null;
  /** CC:8 reference only — not full recommendation memory. */
  readonly lastRecommendationId: string | null;
  readonly recentReferences: readonly NexoraExecutiveContextReference[];
  readonly presentedSet: NexoraPresentedExecutiveSet | null;
  readonly turnIndex: number;
};

export const NEXORA_EXECUTIVE_CONTEXT_CHANGE_KINDS = Object.freeze([
  "set-current-subject",
  "push-previous-subject",
  "set-goal",
  "set-problem",
  "set-scenario",
  "set-decision",
  "set-execution",
  "change-scope",
  "drop-stale-reference",
  "record-presented-set",
  "set-last-command",
  "set-last-runtime-result",
  "set-last-recommendation-id",
  "advance-turn",
] as const);

export type NexoraExecutiveContextChangeKind =
  (typeof NEXORA_EXECUTIVE_CONTEXT_CHANGE_KINDS)[number];

export type NexoraExecutiveContextChange = {
  readonly kind: NexoraExecutiveContextChangeKind;
  readonly previousValue: unknown;
  readonly nextValue: unknown;
  readonly reason: string;
};

export type NexoraExecutiveContextUpdateTrace = {
  readonly previousTurnIndex: number;
  readonly nextTurnIndex: number;
  readonly trustedUpdate: boolean;
  readonly reasons: readonly string[];
  readonly changeKinds: readonly NexoraExecutiveContextChangeKind[];
};

export type NexoraExecutiveContextUpdateResult = {
  readonly nextContext: NexoraExecutiveContextSnapshot;
  readonly changes: readonly NexoraExecutiveContextChange[];
  readonly trace: NexoraExecutiveContextUpdateTrace;
};

export function createEmptyNexoraExecutiveContextSnapshot(
  partial?: Partial<NexoraExecutiveContextSnapshot>,
): NexoraExecutiveContextSnapshot {
  return freezeExecutiveContextSnapshot({
    currentSubject: null,
    previousSubjects: Object.freeze([]),
    currentGoal: null,
    currentProblem: null,
    currentScenario: null,
    currentDecision: null,
    currentExecution: null,
    currentWorkspaceId: null,
    currentModelId: null,
    lastCommand: null,
    lastRuntimeResult: null,
    lastRecommendationId: null,
    recentReferences: Object.freeze([]),
    presentedSet: null,
    turnIndex: 0,
    ...partial,
  });
}

export function freezeExecutiveContextReference(
  ref: NexoraExecutiveContextReference,
): NexoraExecutiveContextReference {
  return Object.freeze({ ...ref });
}

export function freezeExecutiveContextSnapshot(
  snapshot: NexoraExecutiveContextSnapshot,
): NexoraExecutiveContextSnapshot {
  return Object.freeze({
    currentSubject: snapshot.currentSubject
      ? freezeExecutiveContextReference(snapshot.currentSubject)
      : null,
    previousSubjects: Object.freeze(
      snapshot.previousSubjects
        .slice(0, EXECUTIVE_CONTEXT_BOUNDS.previousSubjects)
        .map((r) => freezeExecutiveContextReference(r)),
    ),
    currentGoal: snapshot.currentGoal
      ? freezeExecutiveContextReference(snapshot.currentGoal)
      : null,
    currentProblem: snapshot.currentProblem
      ? freezeExecutiveContextReference(snapshot.currentProblem)
      : null,
    currentScenario: snapshot.currentScenario
      ? freezeExecutiveContextReference(snapshot.currentScenario)
      : null,
    currentDecision: snapshot.currentDecision
      ? freezeExecutiveContextReference(snapshot.currentDecision)
      : null,
    currentExecution: snapshot.currentExecution
      ? freezeExecutiveContextReference(snapshot.currentExecution)
      : null,
    currentWorkspaceId: snapshot.currentWorkspaceId,
    currentModelId: snapshot.currentModelId,
    lastCommand: snapshot.lastCommand
      ? Object.freeze({
          ...snapshot.lastCommand,
          secondaryTargetIds: Object.freeze([
            ...snapshot.lastCommand.secondaryTargetIds,
          ]),
        })
      : null,
    lastRuntimeResult: snapshot.lastRuntimeResult
      ? Object.freeze({
          ...snapshot.lastRuntimeResult,
          affectedSubjectIds: Object.freeze([
            ...snapshot.lastRuntimeResult.affectedSubjectIds,
          ]),
        })
      : null,
    lastRecommendationId: snapshot.lastRecommendationId ?? null,
    recentReferences: Object.freeze(
      snapshot.recentReferences
        .slice(0, EXECUTIVE_CONTEXT_BOUNDS.recentReferences)
        .map((r) => freezeExecutiveContextReference(r)),
    ),
    presentedSet: snapshot.presentedSet
      ? Object.freeze({
          ...snapshot.presentedSet,
          subjectIds: Object.freeze(
            snapshot.presentedSet.subjectIds.slice(
              0,
              EXECUTIVE_CONTEXT_BOUNDS.presentedSetSubjects,
            ),
          ),
        })
      : null,
    turnIndex: snapshot.turnIndex,
  });
}
