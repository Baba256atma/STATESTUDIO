/**
 * CC:4 — Validate + plan conversational Runtime dispatch (pure).
 *
 * Does not mutate Runtime itself. The MVP applicator consumes the plan.
 */

import type { NexoraConversationalCommand } from "./conversationalCommand.ts";
import { mapConversationalCommandToRuntimeAction } from "./conversationalRuntimeActionAdapter.ts";
import {
  CONVERSATIONAL_RUNTIME_BRIDGE_REASON,
  type NexoraConversationalRuntimeBridgeInput,
  type NexoraConversationalRuntimeBridgeResult,
  type NexoraConversationalRuntimeBridgeTrace,
} from "./conversationalRuntimeBridge.ts";

function freezeResult(
  result: NexoraConversationalRuntimeBridgeResult,
): NexoraConversationalRuntimeBridgeResult {
  return Object.freeze({
    status: result.status,
    commandId: result.commandId,
    runtimeActionKind: result.runtimeActionKind,
    source: "conversation",
    affectedSubjectIds: Object.freeze([...result.affectedSubjectIds]),
    reasons: Object.freeze([...result.reasons]),
    plan: result.plan
      ? Object.freeze({
          ...result.plan,
          secondaryTargetIds: Object.freeze([
            ...result.plan.secondaryTargetIds,
          ]),
          notes: Object.freeze([...result.plan.notes]),
        })
      : null,
    trace: Object.freeze({
      ...result.trace,
      affectedSubjectIds: Object.freeze([...result.trace.affectedSubjectIds]),
      reasons: Object.freeze([...result.trace.reasons]),
    }),
  });
}

function buildTrace(
  partial: Omit<NexoraConversationalRuntimeBridgeTrace, never>,
): NexoraConversationalRuntimeBridgeTrace {
  return Object.freeze({
    ...partial,
    affectedSubjectIds: Object.freeze([...partial.affectedSubjectIds]),
    reasons: Object.freeze([...partial.reasons]),
  });
}

function reject(args: {
  readonly commandId: string;
  readonly commandKind: string;
  readonly status: NexoraConversationalRuntimeBridgeResult["status"];
  readonly reasons: readonly string[];
  readonly supportCheck?: string;
}): NexoraConversationalRuntimeBridgeResult {
  return freezeResult({
    status: args.status,
    commandId: args.commandId,
    runtimeActionKind: null,
    source: "conversation",
    affectedSubjectIds: Object.freeze([]),
    reasons: args.reasons,
    plan: null,
    trace: buildTrace({
      commandId: args.commandId,
      commandKind: args.commandKind,
      validationPassed: false,
      supportCheck: args.supportCheck ?? "rejected",
      mappedRuntimeActionKind: null,
      authorityInvoked: null,
      affectedSubjectIds: Object.freeze([]),
      status: args.status,
      reasons: args.reasons,
    }),
  });
}

function requiresPrimaryTarget(command: NexoraConversationalCommand): boolean {
  switch (command.kind) {
    case "focus-subject":
    case "explore-subject":
    case "analyze-subject":
    case "simulate-scenario":
    case "prepare-executive-context":
    case "switch-workspace":
    case "request-recommendation":
    case "request-explanation":
    case "request-prioritization":
      return true;
    case "reveal-related":
      return true;
    default:
      return false;
  }
}

function isWorkspaceTargetCommand(command: NexoraConversationalCommand): boolean {
  return (
    command.kind === "prepare-executive-context" ||
    command.kind === "switch-workspace"
  );
}

/**
 * Validate a CC:3 command and produce a Runtime action plan.
 * Pure — no Runtime mutation. Call the MVP applicator to apply.
 */
export function dispatchNexoraConversationalCommand(
  input: NexoraConversationalRuntimeBridgeInput,
): NexoraConversationalRuntimeBridgeResult {
  const command = input.command;

  if (command == null) {
    return reject({
      commandId: "null",
      commandKind: "null",
      status: "rejected",
      reasons: Object.freeze([
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_NULL,
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.NO_RAW_LANGUAGE,
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
      ]),
    });
  }

  if (command.executable !== true) {
    return reject({
      commandId: command.commandId,
      commandKind: command.kind,
      status: "rejected",
      reasons: Object.freeze([
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_NOT_EXECUTABLE,
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
      ]),
    });
  }

  if (command.requiresConfirmation === true) {
    return reject({
      commandId: command.commandId,
      commandKind: command.kind,
      status: "confirmation-required",
      reasons: Object.freeze([
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_CONFIRMATION_REQUIRED,
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
      ]),
    });
  }

  if (
    input.lastAppliedCommandId != null &&
    input.lastAppliedCommandId === command.commandId
  ) {
    return freezeResult({
      status: "no-op",
      commandId: command.commandId,
      runtimeActionKind: null,
      source: "conversation",
      affectedSubjectIds: Object.freeze([]),
      reasons: Object.freeze([
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_DUPLICATE_DISPATCH,
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_NO_OP,
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
      ]),
      plan: null,
      trace: buildTrace({
        commandId: command.commandId,
        commandKind: command.kind,
        validationPassed: true,
        supportCheck: "duplicate-no-op",
        mappedRuntimeActionKind: null,
        authorityInvoked: null,
        affectedSubjectIds: Object.freeze([]),
        status: "no-op",
        reasons: Object.freeze([
          CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_DUPLICATE_DISPATCH,
        ]),
      }),
    });
  }

  if (requiresPrimaryTarget(command) && !command.primaryTargetId) {
    return reject({
      commandId: command.commandId,
      commandKind: command.kind,
      status: "rejected",
      reasons: Object.freeze([
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
      ]),
      supportCheck: "missing-primary-target",
    });
  }

  if (
    command.primaryTargetId &&
    input.knownSubjectIds &&
    !isWorkspaceTargetCommand(command) &&
    !input.knownSubjectIds.includes(command.primaryTargetId)
  ) {
    return reject({
      commandId: command.commandId,
      commandKind: command.kind,
      status: "rejected",
      reasons: Object.freeze([
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
      ]),
      supportCheck: "unknown-primary-target",
    });
  }

  for (const secondaryId of command.secondaryTargetIds) {
    if (
      input.knownSubjectIds &&
      !input.knownSubjectIds.includes(secondaryId)
    ) {
      return reject({
        commandId: command.commandId,
        commandKind: command.kind,
        status: "rejected",
        reasons: Object.freeze([
          CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_TARGET_INVALID,
          CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
        ]),
        supportCheck: "unknown-secondary-target",
      });
    }
  }

  const support = mapConversationalCommandToRuntimeAction(command);
  if (!support.supported || support.plan == null) {
    return reject({
      commandId: command.commandId,
      commandKind: command.kind,
      status: "unsupported",
      reasons: Object.freeze([
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_UNSUPPORTED,
        support.reason,
        CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
      ]),
      supportCheck: support.reason,
    });
  }

  const plan = support.plan;
  const affected = Object.freeze(
    [
      plan.primaryTargetId,
      ...plan.secondaryTargetIds,
    ].filter((id): id is string => typeof id === "string" && id.length > 0),
  );

  const reasons = Object.freeze([
    CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_COMMAND_PLANNED,
    ...plan.notes,
    CONVERSATIONAL_RUNTIME_BRIDGE_REASON.NO_STAGE_COORDINATE_WRITE,
    CONVERSATIONAL_RUNTIME_BRIDGE_REASON.NO_CAMERA_MOVE,
    CONVERSATIONAL_RUNTIME_BRIDGE_REASON.NO_RAW_LANGUAGE,
    CONVERSATIONAL_RUNTIME_BRIDGE_REASON.DETERMINISTIC,
  ]);

  return freezeResult({
    status: "applied",
    commandId: command.commandId,
    runtimeActionKind: plan.runtimeActionKind,
    source: "conversation",
    affectedSubjectIds: affected,
    reasons,
    plan,
    trace: buildTrace({
      commandId: command.commandId,
      commandKind: command.kind,
      validationPassed: true,
      supportCheck: "supported",
      mappedRuntimeActionKind: plan.runtimeActionKind,
      authorityInvoked: plan.notes.find((n) => n.startsWith("authority:")) ?? null,
      affectedSubjectIds: affected,
      status: "applied",
      reasons,
    }),
  });
}

/**
 * Alias: plan/validate conversational command for Runtime entry.
 * Mutation occurs only in the MVP applicator.
 */
export const planNexoraConversationalRuntimeDispatch =
  dispatchNexoraConversationalCommand;
