/**
 * CC:3 — Deterministic Conversational Command Mapper.
 *
 * Consumes structured CC:1 intent + CC:2 context only.
 * Does not parse raw language, resolve IDs, execute, or mutate Runtime/Stage/Director.
 */

import {
  CONVERSATIONAL_COMMAND_REASON,
  type NexoraConversationalCommand,
  type NexoraConversationalCommandKind,
  type NexoraConversationalCommandMappingInput,
  type NexoraConversationalCommandMappingResult,
  type NexoraConversationalCommandTrace,
  type NexoraCommandMappingStatus,
} from "./conversationalCommand.ts";
import type { NexoraConversationalExecutionClass } from "./conversationalIntent.ts";
import type { NexoraConversationalSubjectKind } from "./conversationalContext.ts";
import {
  findConversationalIntentCommandRule,
  isSecondarySubjectKindCompatible,
  isSubjectKindCompatibleWithCommand,
  type ConversationalIntentCommandRule,
} from "./conversationalCommandPolicy.ts";

function executionClassForCommand(
  kind: NexoraConversationalCommandKind,
): Exclude<NexoraConversationalExecutionClass, "unknown"> {
  switch (kind) {
    case "focus-subject":
    case "open-overview":
    case "navigate-back":
    case "navigate-forward":
    case "prepare-executive-context":
    case "switch-workspace":
      return "navigation";
    case "request-recommendation":
    case "request-explanation":
    case "request-prioritization":
      return "analysis";
    case "define-scenario":
    case "modify-scenario":
    case "evaluate-scenario":
    case "compare-scenarios":
    case "explain-scenario":
    case "open-scenario":
    case "defer-decision-commitment":
    case "commit-decision":
    case "approve-decision":
    case "reject-decision":
    case "defer-decision":
    case "reconsider-decision":
    case "confirm-decision-commitment":
    case "cancel-decision-commitment":
    case "prefer-option":
      return "analysis";
    case "reveal-related":
    case "reveal-problems":
    case "reveal-goals":
    case "reveal-scenarios":
    case "reveal-decisions":
    case "reveal-execution":
    case "explore-subject":
      return "exploration";
    case "compare-subjects":
    case "analyze-subject":
      return "analysis";
    case "simulate-scenario":
      return "simulation";
    case "unsupported":
    default:
      return "navigation";
  }
}

function mappedReasonFor(kind: NexoraConversationalCommandKind): string {
  switch (kind) {
    case "focus-subject":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_FOCUS;
    case "open-overview":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_OVERVIEW;
    case "reveal-related":
    case "reveal-problems":
    case "reveal-goals":
    case "reveal-scenarios":
    case "reveal-decisions":
    case "reveal-execution":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_RELATION;
    case "compare-subjects":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_COMPARISON;
    case "analyze-subject":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_ANALYSIS;
    case "simulate-scenario":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_SIMULATION;
    case "explore-subject":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_EXPLORATION;
    case "navigate-back":
    case "navigate-forward":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_NAVIGATION;
    case "prepare-executive-context":
    case "switch-workspace":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_EXPERIENCE;
    case "request-recommendation":
    case "request-explanation":
    case "request-prioritization":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_RECOMMENDATION;
    case "define-scenario":
    case "modify-scenario":
    case "evaluate-scenario":
    case "compare-scenarios":
    case "explain-scenario":
    case "open-scenario":
    case "defer-decision-commitment":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_SCENARIO;
    case "commit-decision":
    case "approve-decision":
    case "reject-decision":
    case "defer-decision":
    case "reconsider-decision":
    case "confirm-decision-commitment":
    case "cancel-decision-commitment":
    case "prefer-option":
      return CONVERSATIONAL_COMMAND_REASON.MAPPED_DECISION_COMMITMENT;
    default:
      return CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC;
  }
}

/**
 * Deterministic command identity from kind + ordered targets.
 * Avoids random IDs for stable tests and replay.
 */
export function deriveNexoraConversationalCommandId(input: {
  readonly kind: NexoraConversationalCommandKind;
  readonly primaryTargetId: string | null;
  readonly secondaryTargetIds: readonly string[];
}): string {
  const primary = input.primaryTargetId ?? "-";
  const secondary =
    input.secondaryTargetIds.length === 0
      ? "-"
      : input.secondaryTargetIds.join("+");
  return `cc3:${input.kind}:${primary}:${secondary}`;
}

function freezeCommand(
  command: NexoraConversationalCommand,
): NexoraConversationalCommand {
  return Object.freeze({
    commandId: command.commandId,
    kind: command.kind,
    source: "conversation",
    executionClass: command.executionClass,
    primaryTargetId: command.primaryTargetId,
    secondaryTargetIds: Object.freeze([...command.secondaryTargetIds]),
    requiresConfirmation: command.requiresConfirmation,
    executable: command.executable,
    reasons: Object.freeze([...command.reasons]),
  });
}

function buildTrace(args: {
  readonly intentKind: string;
  readonly contextStatus: string;
  readonly primarySubjectId: string | null;
  readonly secondarySubjectIds: readonly string[];
  readonly primarySubjectKind: NexoraConversationalSubjectKind | null;
  readonly mappingRule: string | null;
  readonly compatibilityPassed: boolean;
  readonly commandKind: NexoraConversationalCommandKind | null;
  readonly mappingStatus: NexoraCommandMappingStatus;
  readonly reasons: readonly string[];
}): NexoraConversationalCommandTrace {
  return Object.freeze({
    intentKind: args.intentKind,
    contextStatus: args.contextStatus,
    primarySubjectId: args.primarySubjectId,
    secondarySubjectIds: Object.freeze([...args.secondarySubjectIds]),
    primarySubjectKind: args.primarySubjectKind,
    mappingRule: args.mappingRule,
    compatibilityPassed: args.compatibilityPassed,
    commandKind: args.commandKind,
    mappingStatus: args.mappingStatus,
    reasons: Object.freeze([...args.reasons]),
  });
}

function blocked(args: {
  readonly intentKind: string;
  readonly contextStatus: string;
  readonly primarySubjectId: string | null;
  readonly secondarySubjectIds: readonly string[];
  readonly primarySubjectKind: NexoraConversationalSubjectKind | null;
  readonly mappingRule: string | null;
  readonly status: NexoraCommandMappingStatus;
  readonly reasons: readonly string[];
}): NexoraConversationalCommandMappingResult {
  return Object.freeze({
    command: null,
    status: args.status,
    trace: buildTrace({
      intentKind: args.intentKind,
      contextStatus: args.contextStatus,
      primarySubjectId: args.primarySubjectId,
      secondarySubjectIds: args.secondarySubjectIds,
      primarySubjectKind: args.primarySubjectKind,
      mappingRule: args.mappingRule,
      compatibilityPassed: false,
      commandKind: null,
      mappingStatus: args.status,
      reasons: args.reasons,
    }),
  });
}

function succeed(args: {
  readonly rule: ConversationalIntentCommandRule;
  readonly intentKind: string;
  readonly contextStatus: string;
  readonly primaryTargetId: string | null;
  readonly secondaryTargetIds: readonly string[];
  readonly primarySubjectKind: NexoraConversationalSubjectKind | null;
  readonly extraReasons?: readonly string[];
}): NexoraConversationalCommandMappingResult {
  const kind = args.rule.commandKind;
  const commandId = deriveNexoraConversationalCommandId({
    kind,
    primaryTargetId: args.primaryTargetId,
    secondaryTargetIds: args.secondaryTargetIds,
  });

  const reasons = Object.freeze([
    mappedReasonFor(kind),
    CONVERSATIONAL_COMMAND_REASON.CONFIRMATION_NOT_REQUIRED,
    CONVERSATIONAL_COMMAND_REASON.EXECUTABLE_NOT_EXECUTED,
    CONVERSATIONAL_COMMAND_REASON.NO_RAW_LANGUAGE_PARSE,
    CONVERSATIONAL_COMMAND_REASON.NO_ID_RESOLUTION,
    CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
    ...(args.secondaryTargetIds.length > 0
      ? [CONVERSATIONAL_COMMAND_REASON.ORDER_PRESERVED]
      : []),
    ...(args.extraReasons ?? []),
  ]);

  const command = freezeCommand({
    commandId,
    kind,
    source: "conversation",
    executionClass: executionClassForCommand(kind),
    primaryTargetId: args.primaryTargetId,
    secondaryTargetIds: args.secondaryTargetIds,
    requiresConfirmation: false,
    executable: true,
    reasons,
  });

  return Object.freeze({
    command,
    status: "mapped" as const,
    trace: buildTrace({
      intentKind: args.intentKind,
      contextStatus: args.contextStatus,
      primarySubjectId: args.primaryTargetId,
      secondarySubjectIds: args.secondaryTargetIds,
      primarySubjectKind: args.primarySubjectKind,
      mappingRule: args.rule.mappingRuleId,
      compatibilityPassed: true,
      commandKind: kind,
      mappingStatus: "mapped",
      reasons,
    }),
  });
}

/**
 * Primary CC:3 API — map intent + resolved context to a canonical command.
 * Pure. Does not accept raw utterances.
 */
export function mapNexoraConversationalCommand(
  input: NexoraConversationalCommandMappingInput,
): NexoraConversationalCommandMappingResult {
  const intent = input.intent;
  const context = input.context;

  const primarySubjectId = context.primarySubject?.subjectId ?? null;
  const primarySubjectKind = context.primarySubject?.subjectKind ?? null;
  const secondarySubjectIds = Object.freeze(
    context.secondarySubjects.map((s) => s.subjectId),
  );

  const baseBlocked = {
    intentKind: intent.kind,
    contextStatus: context.resolutionStatus,
    primarySubjectId,
    secondarySubjectIds,
    primarySubjectKind,
  };

  // ── Unknown intent ────────────────────────────────────────────────────────
  if (intent.kind === "unknown") {
    return blocked({
      ...baseBlocked,
      mappingRule: null,
      status: "unsupported-intent",
      reasons: Object.freeze([
        CONVERSATIONAL_COMMAND_REASON.UNSUPPORTED_INTENT,
        CONVERSATIONAL_COMMAND_REASON.NO_RAW_LANGUAGE_PARSE,
        CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
      ]),
    });
  }

  // ── Respect CC:2 resolution status (do not reinterpret) ───────────────────
  if (context.resolutionStatus === "ambiguous") {
    return blocked({
      ...baseBlocked,
      mappingRule: null,
      status: "ambiguous-context",
      reasons: Object.freeze([
        CONVERSATIONAL_COMMAND_REASON.AMBIGUOUS_CONTEXT_BLOCKED,
        CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
      ]),
    });
  }

  if (context.resolutionStatus === "missing-context") {
    return blocked({
      ...baseBlocked,
      mappingRule: null,
      status: "missing-target",
      reasons: Object.freeze([
        CONVERSATIONAL_COMMAND_REASON.MISSING_CONTEXT_BLOCKED,
        CONVERSATIONAL_COMMAND_REASON.MISSING_PRIMARY_TARGET,
        CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
      ]),
    });
  }

  if (context.resolutionStatus === "not-found") {
    return blocked({
      ...baseBlocked,
      mappingRule: null,
      status: "invalid-context",
      reasons: Object.freeze([
        CONVERSATIONAL_COMMAND_REASON.NOT_FOUND_CONTEXT_BLOCKED,
        CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
      ]),
    });
  }

  const rule = findConversationalIntentCommandRule(intent.kind);
  if (!rule) {
    return blocked({
      ...baseBlocked,
      mappingRule: null,
      status: "unsupported-intent",
      reasons: Object.freeze([
        CONVERSATIONAL_COMMAND_REASON.UNSUPPORTED_INTENT,
        CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
      ]),
    });
  }

  // ── Experience / workspace commands (CC:6 supplies workspace target) ───────
  if (
    intent.kind === "prepare-context" ||
    intent.kind === "switch-workspace"
  ) {
    const experience = input.experienceResolution;
    const workspaceId = experience?.workspaceId ?? null;
    if (!workspaceId || experience?.decision !== "transition") {
      return blocked({
        ...baseBlocked,
        mappingRule: rule.mappingRuleId,
        status: "missing-target",
        reasons: Object.freeze([
          CONVERSATIONAL_COMMAND_REASON.EXPERIENCE_TARGET_REQUIRED,
          CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
        ]),
      });
    }

    // Explicit subject from CC:2 beats experience default entry subject.
    const entrySubjectId =
      primarySubjectId ?? experience.entrySubjectId ?? null;
    const secondaryTargetIds = Object.freeze(
      entrySubjectId ? [entrySubjectId] : [],
    );

    return succeed({
      rule,
      intentKind: intent.kind,
      contextStatus: context.resolutionStatus,
      primaryTargetId: workspaceId,
      secondaryTargetIds,
      primarySubjectKind: primarySubjectKind,
      extraReasons: Object.freeze([
        CONVERSATIONAL_COMMAND_REASON.MAPPED_EXPERIENCE,
        ...(primarySubjectId
          ? ["explicit-subject-preserved-over-experience-default"]
          : []),
      ]),
    });
  }

  // ── Target requirements ───────────────────────────────────────────────────
  if (rule.targetRequirement === "none") {
    return succeed({
      rule,
      intentKind: intent.kind,
      contextStatus: context.resolutionStatus,
      primaryTargetId: null,
      secondaryTargetIds: Object.freeze([]),
      primarySubjectKind: null,
    });
  }

  if (rule.targetRequirement === "primary") {
    if (!primarySubjectId || !context.primarySubject) {
      return blocked({
        ...baseBlocked,
        mappingRule: rule.mappingRuleId,
        status: "missing-target",
        reasons: Object.freeze([
          CONVERSATIONAL_COMMAND_REASON.MISSING_PRIMARY_TARGET,
          CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
        ]),
      });
    }

    if (!isSubjectKindCompatibleWithCommand(primarySubjectKind, rule)) {
      return blocked({
        ...baseBlocked,
        mappingRule: rule.mappingRuleId,
        status: "invalid-context",
        reasons: Object.freeze([
          CONVERSATIONAL_COMMAND_REASON.SUBJECT_KIND_INCOMPATIBLE,
          CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
        ]),
      });
    }

    return succeed({
      rule,
      intentKind: intent.kind,
      contextStatus: context.resolutionStatus,
      primaryTargetId: primarySubjectId,
      secondaryTargetIds: Object.freeze([]),
      primarySubjectKind,
    });
  }

  if (rule.targetRequirement === "primary-and-secondary") {
    if (!primarySubjectId || !context.primarySubject) {
      return blocked({
        ...baseBlocked,
        mappingRule: rule.mappingRuleId,
        status: "missing-target",
        reasons: Object.freeze([
          CONVERSATIONAL_COMMAND_REASON.MISSING_PRIMARY_TARGET,
          CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
        ]),
      });
    }

    if (secondarySubjectIds.length === 0) {
      return blocked({
        ...baseBlocked,
        mappingRule: rule.mappingRuleId,
        status: "missing-target",
        reasons: Object.freeze([
          CONVERSATIONAL_COMMAND_REASON.MISSING_SECONDARY_TARGET,
          CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
        ]),
      });
    }

    if (!isSubjectKindCompatibleWithCommand(primarySubjectKind, rule)) {
      return blocked({
        ...baseBlocked,
        mappingRule: rule.mappingRuleId,
        status: "invalid-context",
        reasons: Object.freeze([
          CONVERSATIONAL_COMMAND_REASON.SUBJECT_KIND_INCOMPATIBLE,
          CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
        ]),
      });
    }

    for (const secondary of context.secondarySubjects) {
      if (!isSecondarySubjectKindCompatible(secondary.subjectKind)) {
        return blocked({
          ...baseBlocked,
          mappingRule: rule.mappingRuleId,
          status: "invalid-context",
          reasons: Object.freeze([
            CONVERSATIONAL_COMMAND_REASON.SUBJECT_KIND_INCOMPATIBLE,
            CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
          ]),
        });
      }
    }

    return succeed({
      rule,
      intentKind: intent.kind,
      contextStatus: context.resolutionStatus,
      primaryTargetId: primarySubjectId,
      secondaryTargetIds: secondarySubjectIds,
      primarySubjectKind,
    });
  }

  // Unfiltered collection (show problems / show all problems) must not inherit
  // conversational subject as an implicit related-to filter.
  if (
    rule.targetRequirement === "primary-optional" &&
    intent.kind === "show-problems" &&
    (intent.targetHints?.length ?? 0) === 0
  ) {
    return succeed({
      rule,
      intentKind: intent.kind,
      contextStatus: context.resolutionStatus,
      primaryTargetId: null,
      secondaryTargetIds: Object.freeze([]),
      primarySubjectKind: null,
    });
  }

  // primary-optional (reveal-*)
  if (primarySubjectId && context.primarySubject) {
    if (!isSubjectKindCompatibleWithCommand(primarySubjectKind, rule)) {
      return blocked({
        ...baseBlocked,
        mappingRule: rule.mappingRuleId,
        status: "invalid-context",
        reasons: Object.freeze([
          CONVERSATIONAL_COMMAND_REASON.SUBJECT_KIND_INCOMPATIBLE,
          CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
        ]),
      });
    }

    return succeed({
      rule,
      intentKind: intent.kind,
      contextStatus: context.resolutionStatus,
      primaryTargetId: primarySubjectId,
      secondaryTargetIds: Object.freeze([]),
      primarySubjectKind,
    });
  }

  // Collection without anchor (CC:2 not-required) — still a valid reveal command.
  if (context.resolutionStatus === "not-required") {
    return succeed({
      rule,
      intentKind: intent.kind,
      contextStatus: context.resolutionStatus,
      primaryTargetId: null,
      secondaryTargetIds: Object.freeze([]),
      primarySubjectKind: null,
    });
  }

  return blocked({
    ...baseBlocked,
    mappingRule: rule.mappingRuleId,
    status: "missing-target",
    reasons: Object.freeze([
      CONVERSATIONAL_COMMAND_REASON.MISSING_PRIMARY_TARGET,
      CONVERSATIONAL_COMMAND_REASON.DETERMINISTIC,
    ]),
  });
}
