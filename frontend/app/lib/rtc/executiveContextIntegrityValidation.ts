/**
 * RTC-1:4 — Executive Context Integrity Validation.
 *
 * Global runtime integrity validation rules.
 * Policies only — evaluation is declared, not executed.
 *
 * Ownership: owned exclusively by RTC-1:4.
 */

import type { ExecutiveContextValidationRuleDeclaration } from "./executiveContextValidationRules.ts";

const integrityRule = (
  categoryOrder: number,
  executionOrder: number,
  ruleKey: string,
  name: string,
  description: string,
  severity: "Error" | "Critical",
): ExecutiveContextValidationRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-1:4/Rule/${String(executionOrder).padStart(2, "0")}`,
    ruleKey,
    name,
    description,
    category: "Integrity" as const,
    severity,
    preventsActivation: true as const,
    executionOrder,
    categoryOrder,
    evaluatesOnly: true as const,
    mutatesState: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Integrity validation rules (37..40).
 * Covers global singleton consistency for activation safety.
 */
export const ExecutiveContextIntegrityValidationRules = Object.freeze([
  integrityRule(
    1,
    37,
    "ExactlyOneActiveContext",
    "Exactly one active context",
    "Runtime must contain exactly one active Executive Context.",
    "Critical",
  ),
  integrityRule(
    2,
    38,
    "ExactlyOneStageJournalTimeline",
    "Exactly one Stage, Journal, and Timeline",
    "Runtime must contain exactly one Stage, one Journal, and one Timeline.",
    "Critical",
  ),
  integrityRule(
    3,
    39,
    "ExactlyOneDirector",
    "Exactly one Director",
    "Runtime must contain exactly one Director instance.",
    "Error",
  ),
  integrityRule(
    4,
    40,
    "ExactlyOneAdvisor",
    "Exactly one Advisor",
    "Runtime must contain exactly one Advisor instance.",
    "Error",
  ),
] as const);

/** Integrity validation catalogue metadata. */
export const ExecutiveContextIntegrityValidation = Object.freeze({
  integrityId: "RTC-1:4/IntegrityValidation",
  sourcePhase: "RTC-1:4" as const,
  rules: ExecutiveContextIntegrityValidationRules,
  ruleCount: ExecutiveContextIntegrityValidationRules.length,
  coversActiveContext: true as const,
  coversStage: true as const,
  coversJournal: true as const,
  coversTimeline: true as const,
  coversDirector: true as const,
  coversAdvisor: true as const,
  evaluatesOnly: true as const,
  mutatesState: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
