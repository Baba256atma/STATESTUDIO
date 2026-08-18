/**
 * CC:3 — Deterministic command policy (target requirements + subject compatibility).
 *
 * Small explicit rules — not a giant policy engine.
 */

import type { NexoraConversationalIntentKind } from "./conversationalIntent.ts";
import type { NexoraConversationalSubjectKind } from "./conversationalContext.ts";
import type { NexoraConversationalCommandKind } from "./conversationalCommand.ts";

/** Executive subjects that may be focused / explored / analyzed / compared. */
export const CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS = Object.freeze([
  "object",
  "goal",
  "problem",
  "scenario",
  "decision",
  "execution",
  "business",
] as const satisfies readonly NexoraConversationalSubjectKind[]);

export type ConversationalCommandTargetRequirement =
  | "none"
  | "primary"
  | "primary-optional"
  | "primary-and-secondary";

export type ConversationalIntentCommandRule = {
  readonly intentKind: NexoraConversationalIntentKind;
  readonly commandKind: NexoraConversationalCommandKind;
  readonly targetRequirement: ConversationalCommandTargetRequirement;
  readonly allowedPrimaryKinds: readonly NexoraConversationalSubjectKind[] | "*";
  readonly mappingRuleId: string;
};

/**
 * Explicit intent → command mapping table.
 * CC:3 does not invent mappings outside this table.
 */
export const CONVERSATIONAL_INTENT_COMMAND_RULES: readonly ConversationalIntentCommandRule[] =
  Object.freeze([
    Object.freeze({
      intentKind: "focus" as const,
      commandKind: "focus-subject" as const,
      targetRequirement: "primary" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.focus→focus-subject",
    }),
    Object.freeze({
      intentKind: "explore" as const,
      commandKind: "explore-subject" as const,
      targetRequirement: "primary" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.explore→explore-subject",
    }),
    Object.freeze({
      intentKind: "overview" as const,
      commandKind: "open-overview" as const,
      targetRequirement: "none" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.overview→open-overview",
    }),
    Object.freeze({
      intentKind: "show-related" as const,
      commandKind: "reveal-related" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.show-related→reveal-related",
    }),
    Object.freeze({
      intentKind: "show-problems" as const,
      commandKind: "reveal-problems" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.show-problems→reveal-problems",
    }),
    Object.freeze({
      intentKind: "show-goals" as const,
      commandKind: "reveal-goals" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: Object.freeze([
        "object",
        "goal",
        "business",
        "workspace",
      ] as const satisfies readonly NexoraConversationalSubjectKind[]),
      mappingRuleId: "intent.show-goals→reveal-goals",
    }),
    Object.freeze({
      intentKind: "show-scenarios" as const,
      commandKind: "reveal-scenarios" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.show-scenarios→reveal-scenarios",
    }),
    Object.freeze({
      intentKind: "show-decisions" as const,
      commandKind: "reveal-decisions" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.show-decisions→reveal-decisions",
    }),
    Object.freeze({
      intentKind: "show-execution" as const,
      commandKind: "reveal-execution" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: Object.freeze([
        "object",
        "decision",
        "execution",
        "goal",
        "problem",
        "scenario",
        "business",
      ] as const satisfies readonly NexoraConversationalSubjectKind[]),
      mappingRuleId: "intent.show-execution→reveal-execution",
    }),
    Object.freeze({
      intentKind: "compare" as const,
      commandKind: "compare-subjects" as const,
      targetRequirement: "primary-and-secondary" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.compare→compare-subjects",
    }),
    Object.freeze({
      intentKind: "analyze" as const,
      commandKind: "analyze-subject" as const,
      targetRequirement: "primary" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.analyze→analyze-subject",
    }),
    Object.freeze({
      intentKind: "simulate" as const,
      commandKind: "simulate-scenario" as const,
      targetRequirement: "primary" as const,
      allowedPrimaryKinds: Object.freeze([
        "scenario",
      ] as const satisfies readonly NexoraConversationalSubjectKind[]),
      mappingRuleId: "intent.simulate→simulate-scenario",
    }),
    Object.freeze({
      intentKind: "navigate-back" as const,
      commandKind: "navigate-back" as const,
      targetRequirement: "none" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.navigate-back→navigate-back",
    }),
    Object.freeze({
      intentKind: "navigate-forward" as const,
      commandKind: "navigate-forward" as const,
      targetRequirement: "none" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.navigate-forward→navigate-forward",
    }),
    Object.freeze({
      intentKind: "prepare-context" as const,
      commandKind: "prepare-executive-context" as const,
      targetRequirement: "primary" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.prepare-context→prepare-executive-context",
    }),
    Object.freeze({
      intentKind: "switch-workspace" as const,
      commandKind: "switch-workspace" as const,
      targetRequirement: "primary" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.switch-workspace→switch-workspace",
    }),
    Object.freeze({
      intentKind: "recommend" as const,
      commandKind: "request-recommendation" as const,
      targetRequirement: "primary" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.recommend→request-recommendation",
    }),
    Object.freeze({
      intentKind: "explain" as const,
      commandKind: "request-explanation" as const,
      targetRequirement: "primary" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.explain→request-explanation",
    }),
    ...(
      [
        "situation",
        "evidence",
        "change",
        "risk",
        "execution-status",
      ] as const
    ).map((intentKind) =>
      Object.freeze({
        intentKind,
        commandKind: "request-prioritization" as const,
        targetRequirement: "primary-optional" as const,
        allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
        mappingRuleId: `intent.${intentKind}→request-prioritization`,
      }),
    ),
    Object.freeze({
      intentKind: "decision-status" as const,
      commandKind: "request-prioritization" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.decision-status→request-prioritization",
    }),
    Object.freeze({
      intentKind: "prioritize" as const,
      commandKind: "request-prioritization" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.prioritize→request-prioritization",
    }),
    Object.freeze({
      intentKind: "explore-scenario" as const,
      commandKind: "evaluate-scenario" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.explore-scenario→evaluate-scenario",
    }),
    Object.freeze({
      intentKind: "define-scenario" as const,
      commandKind: "define-scenario" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.define-scenario→define-scenario",
    }),
    Object.freeze({
      intentKind: "modify-scenario" as const,
      commandKind: "modify-scenario" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS,
      mappingRuleId: "intent.modify-scenario→modify-scenario",
    }),
    Object.freeze({
      intentKind: "compare-scenarios" as const,
      commandKind: "compare-scenarios" as const,
      targetRequirement: "none" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.compare-scenarios→compare-scenarios",
    }),
    Object.freeze({
      intentKind: "explain-scenario" as const,
      commandKind: "explain-scenario" as const,
      targetRequirement: "none" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.explain-scenario→explain-scenario",
    }),
    Object.freeze({
      intentKind: "select-scenario-reference" as const,
      commandKind: "open-scenario" as const,
      targetRequirement: "none" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.select-scenario-reference→open-scenario",
    }),
    Object.freeze({
      intentKind: "commit-decision" as const,
      commandKind: "commit-decision" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.commit-decision→commit-decision",
    }),
    Object.freeze({
      intentKind: "prefer-option" as const,
      commandKind: "prefer-option" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.prefer-option→prefer-option",
    }),
    Object.freeze({
      intentKind: "reject-decision" as const,
      commandKind: "reject-decision" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.reject-decision→reject-decision",
    }),
    Object.freeze({
      intentKind: "defer-decision" as const,
      commandKind: "defer-decision" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.defer-decision→defer-decision",
    }),
    Object.freeze({
      intentKind: "reconsider-decision" as const,
      commandKind: "reconsider-decision" as const,
      targetRequirement: "primary-optional" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId: "intent.reconsider-decision→reconsider-decision",
    }),
    Object.freeze({
      intentKind: "confirm-decision-commitment" as const,
      commandKind: "confirm-decision-commitment" as const,
      targetRequirement: "none" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId:
        "intent.confirm-decision-commitment→confirm-decision-commitment",
    }),
    Object.freeze({
      intentKind: "cancel-decision-commitment" as const,
      commandKind: "cancel-decision-commitment" as const,
      targetRequirement: "none" as const,
      allowedPrimaryKinds: "*" as const,
      mappingRuleId:
        "intent.cancel-decision-commitment→cancel-decision-commitment",
    }),
  ]);

export function findConversationalIntentCommandRule(
  intentKind: NexoraConversationalIntentKind,
): ConversationalIntentCommandRule | null {
  return (
    CONVERSATIONAL_INTENT_COMMAND_RULES.find((r) => r.intentKind === intentKind) ??
    null
  );
}

export function isSubjectKindCompatibleWithCommand(
  subjectKind: NexoraConversationalSubjectKind | null | undefined,
  rule: ConversationalIntentCommandRule,
): boolean {
  if (rule.allowedPrimaryKinds === "*") return true;
  if (!subjectKind) return rule.targetRequirement === "none";
  return (rule.allowedPrimaryKinds as readonly string[]).includes(subjectKind);
}

export function isSecondarySubjectKindCompatible(
  subjectKind: NexoraConversationalSubjectKind | null | undefined,
): boolean {
  if (!subjectKind) return false;
  return (CONVERSATIONAL_FOCUSABLE_SUBJECT_KINDS as readonly string[]).includes(
    subjectKind,
  );
}
