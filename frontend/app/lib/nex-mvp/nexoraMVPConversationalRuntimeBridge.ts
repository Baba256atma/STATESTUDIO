/**
 * CC:4 — MVP Runtime applicator.
 *
 * Applies a planned conversational Runtime action through existing
 * nexoraMVPObjectInteraction authorities. No Stage coordinate writes.
 * Conversation and click converge on selectNexoraMVPInteractionSubject etc.
 */

import {
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  resetNexoraMVPObjectInteractionOverview,
  resolveNexoraMVPInteractionSubject,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { applyNexoraMVPWorkspaceChangeToInteraction } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { isNexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import type { NexoraConversationalCommand } from "@/app/lib/conversational-control/conversationalCommand.ts";
import {
  CONVERSATIONAL_RUNTIME_BRIDGE_REASON,
  type NexoraConversationalRuntimeBridgeResult,
} from "@/app/lib/conversational-control/conversationalRuntimeBridge.ts";
import { dispatchNexoraConversationalCommand } from "@/app/lib/conversational-control/conversationalRuntimeDispatch.ts";

export type NexoraMVPConversationalApplyInput = {
  readonly command: NexoraConversationalCommand | null;
  readonly state: NexoraMVPObjectInteractionState;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly lastAppliedCommandId?: string | null;
};

export type NexoraMVPConversationalApplyResult = {
  readonly result: NexoraConversationalRuntimeBridgeResult;
  readonly nextState: NexoraMVPObjectInteractionState;
  /** Control source for observability — conversation counts as direct user control. */
  readonly controlSource: "conversation";
};

function markApplied(
  planned: NexoraConversationalRuntimeBridgeResult,
): NexoraConversationalRuntimeBridgeResult {
  const reasons = Object.freeze([
    CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_APPLIED,
    ...planned.reasons.filter(
      (r) => r !== CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_PLANNED,
    ),
  ]);
  return Object.freeze({
    ...planned,
    status: "applied",
    reasons,
    trace: Object.freeze({
      ...planned.trace,
      status: "applied",
      reasons,
    }),
  });
}

function rejectKeepState(
  state: NexoraMVPObjectInteractionState,
  result: NexoraConversationalRuntimeBridgeResult,
): NexoraMVPConversationalApplyResult {
  return Object.freeze({
    result,
    nextState: state,
    controlSource: "conversation",
  });
}

/**
 * Apply a CC:3 command through existing MVP interaction Runtime authority.
 * On failure, returns the original state (atomic — no partial mutation).
 */
export function applyNexoraMVPConversationalCommand(
  input: NexoraMVPConversationalApplyInput,
): NexoraMVPConversationalApplyResult {
  const catalog =
    input.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const knownSubjectIds = Object.freeze([
    ...catalog.objects.map((o) => o.id),
    ...catalog.contextSubjects.map((c) => c.id),
  ]);

  const planned = dispatchNexoraConversationalCommand({
    command: input.command,
    knownSubjectIds,
    lastAppliedCommandId: input.lastAppliedCommandId,
  });

  if (planned.status !== "applied" || planned.plan == null) {
    return rejectKeepState(input.state, planned);
  }

  const plan = planned.plan;
  const state = input.state;

  switch (plan.runtimeActionKind) {
    case "select-interaction-subject": {
      const targetId = plan.primaryTargetId;
      if (!targetId) {
        return rejectKeepState(
          state,
          Object.freeze({
            ...planned,
            status: "rejected",
            runtimeActionKind: null,
            plan: null,
            reasons: Object.freeze([
              CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
            ]),
            trace: Object.freeze({
              ...planned.trace,
              status: "rejected",
              mappedRuntimeActionKind: null,
              authorityInvoked: null,
              reasons: Object.freeze([
                CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
              ]),
            }),
          }),
        );
      }

      const resolved = resolveNexoraMVPInteractionSubject(targetId, catalog);
      if (resolved == null) {
        return rejectKeepState(
          state,
          Object.freeze({
            ...planned,
            status: "rejected",
            runtimeActionKind: null,
            plan: null,
            reasons: Object.freeze([
              CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
            ]),
            trace: Object.freeze({
              ...planned.trace,
              status: "rejected",
              mappedRuntimeActionKind: null,
              authorityInvoked: null,
              reasons: Object.freeze([
                CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
              ]),
            }),
          }),
        );
      }

      const nextState = selectNexoraMVPInteractionSubject(
        state,
        targetId,
        catalog,
      );
      return Object.freeze({
        result: markApplied(planned),
        nextState,
        controlSource: "conversation",
      });
    }

    case "reset-overview": {
      const nextState = resetNexoraMVPObjectInteractionOverview(state);
      return Object.freeze({
        result: markApplied(planned),
        nextState,
        controlSource: "conversation",
      });
    }

    case "navigation-step-back": {
      const nextState = stepBackNexoraMVPObjectInteraction(state, catalog);
      return Object.freeze({
        result: markApplied(planned),
        nextState,
        controlSource: "conversation",
      });
    }

    case "navigation-step-forward": {
      const nextState = stepForwardNexoraMVPObjectInteraction(state, catalog);
      return Object.freeze({
        result: markApplied(planned),
        nextState,
        controlSource: "conversation",
      });
    }

    case "open-queue-collection": {
      const category = plan.collectionCategory;
      if (
        category !== "problem" &&
        category !== "scenario" &&
        category !== "decision" &&
        category !== "execution"
      ) {
        return rejectKeepState(
          state,
          Object.freeze({
            ...planned,
            status: "unsupported",
            plan: null,
            runtimeActionKind: null,
            reasons: Object.freeze([
              CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_UNSUPPORTED,
            ]),
            trace: Object.freeze({
              ...planned.trace,
              status: "unsupported",
              mappedRuntimeActionKind: null,
              reasons: Object.freeze([
                CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_UNSUPPORTED,
              ]),
            }),
          }),
        );
      }

      const nextState = openNexoraMVPExecutiveQueueCollection(
        state,
        category,
        catalog,
      );
      return Object.freeze({
        result: markApplied(planned),
        nextState,
        controlSource: "conversation",
      });
    }

    case "change-workspace": {
      const workspaceId = plan.primaryTargetId;
      if (!workspaceId || !isNexoraMVPWorkspaceKind(workspaceId)) {
        return rejectKeepState(
          state,
          Object.freeze({
            ...planned,
            status: "rejected",
            plan: null,
            runtimeActionKind: null,
            reasons: Object.freeze([
              CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
              CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
            ]),
            trace: Object.freeze({
              ...planned.trace,
              status: "rejected",
              mappedRuntimeActionKind: null,
              authorityInvoked: null,
              reasons: Object.freeze([
                CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
              ]),
            }),
          }),
        );
      }

      // Atomic: validate optional entry subject before mutating workspace.
      const entrySubjectId = plan.secondaryTargetIds[0] ?? null;
      if (entrySubjectId) {
        const resolvedEntry = resolveNexoraMVPInteractionSubject(
          entrySubjectId,
          catalog,
        );
        if (resolvedEntry == null) {
          return rejectKeepState(
            state,
            Object.freeze({
              ...planned,
              status: "rejected",
              plan: null,
              runtimeActionKind: null,
              reasons: Object.freeze([
                CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
                CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
              ]),
              trace: Object.freeze({
                ...planned.trace,
                status: "rejected",
                mappedRuntimeActionKind: null,
                authorityInvoked: null,
                reasons: Object.freeze([
                  CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
                ]),
              }),
            }),
          );
        }
      }

      let nextState = applyNexoraMVPWorkspaceChangeToInteraction(
        state,
        workspaceId,
      );

      // If workspace authority rejected (unchanged when invalid), treat as failure.
      if (nextState.workspace !== workspaceId) {
        return rejectKeepState(
          state,
          Object.freeze({
            ...planned,
            status: "rejected",
            plan: null,
            runtimeActionKind: null,
            reasons: Object.freeze([
              CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
              CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
            ]),
            trace: Object.freeze({
              ...planned.trace,
              status: "rejected",
              mappedRuntimeActionKind: null,
              authorityInvoked: null,
              reasons: Object.freeze([
                CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
              ]),
            }),
          }),
        );
      }

      if (entrySubjectId) {
        nextState = selectNexoraMVPInteractionSubject(
          nextState,
          entrySubjectId,
          catalog,
        );
      }

      return Object.freeze({
        result: markApplied(planned),
        nextState,
        controlSource: "conversation",
      });
    }

    case "resolve-executive-recommendation": {
      // Advisory only — Runtime/Stage unchanged. CC:8 runs in the orchestrator.
      const applied = markApplied(planned);
      return Object.freeze({
        result: Object.freeze({
          ...applied,
          reasons: Object.freeze([
            ...applied.reasons,
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_RECOMMENDATION_DISPATCHED,
            "advisory-only-no-runtime-mutation",
          ]),
          trace: Object.freeze({
            ...applied.trace,
            authorityInvoked: "resolveNexoraExecutiveRecommendation",
            reasons: Object.freeze([
              ...applied.trace.reasons,
              CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_RECOMMENDATION_DISPATCHED,
              "advisory-only-no-runtime-mutation",
            ]),
          }),
        }),
        nextState: state,
        controlSource: "conversation",
      });
    }

    default:
      return rejectKeepState(
        state,
        Object.freeze({
          ...planned,
          status: "unsupported",
          plan: null,
          runtimeActionKind: null,
          reasons: Object.freeze([
            CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_UNSUPPORTED,
          ]),
          trace: Object.freeze({
            ...planned.trace,
            status: "unsupported",
            mappedRuntimeActionKind: null,
            reasons: Object.freeze([
              CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_UNSUPPORTED,
            ]),
          }),
        }),
      );
  }
}

/**
 * Narrow facade: CC:3 command → MVP Runtime apply.
 * Preserves CC:1/2/3 boundaries (command must already be mapped).
 */
export function executeNexoraConversationalControl(
  input: NexoraMVPConversationalApplyInput,
): NexoraMVPConversationalApplyResult {
  return applyNexoraMVPConversationalCommand(input);
}
