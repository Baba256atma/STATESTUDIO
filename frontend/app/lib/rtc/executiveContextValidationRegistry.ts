/**
 * RTC-1:4 — Executive Context Validation Registry.
 *
 * Deterministic catalogue of all forty canonical validation rules.
 * Stable rule identities for later Runtime phases.
 *
 * Ownership: owned exclusively by RTC-1:4.
 */

import { ExecutiveContextIntegrityValidationRules } from "./executiveContextIntegrityValidation.ts";
import {
  ExecutiveContextValidationCategories,
  ExecutiveContextValidationCategoryNames,
  type ExecutiveContextValidationCategoryName,
} from "./executiveContextValidationCategories.ts";
import { ExecutiveContextValidationRules } from "./executiveContextValidationRules.ts";
import {
  ExecutiveContextActivationBlockingSeverities,
  ExecutiveContextValidationSeverities,
} from "./executiveContextValidationSeverity.ts";

/** Complete ordered rule baseline — exactly 40 rules. */
export const ExecutiveContextValidationRuleBaseline = Object.freeze([
  ...ExecutiveContextValidationRules,
  ...ExecutiveContextIntegrityValidationRules,
] as const);

const byCategory = (
  category: ExecutiveContextValidationCategoryName,
) =>
  Object.freeze(
    ExecutiveContextValidationRuleBaseline.filter(
      (rule) => rule.category === category,
    ),
  );

/**
 * Canonical validation rule registry.
 * Lookup is deterministic and category-ordered.
 */
export const ExecutiveContextValidationRegistry = Object.freeze({
  registryId: "RTC-1:4/ValidationRegistry",
  sourcePhase: "RTC-1:4" as const,
  categories: ExecutiveContextValidationCategories,
  categoryNames: ExecutiveContextValidationCategoryNames,
  severities: ExecutiveContextValidationSeverities,
  activationBlockingSeverities: ExecutiveContextActivationBlockingSeverities,
  rules: ExecutiveContextValidationRuleBaseline,
  ruleCount: ExecutiveContextValidationRuleBaseline.length,
  rulesByCategory: Object.freeze({
    Identity: byCategory("Identity"),
    Structure: byCategory("Structure"),
    Ownership: byCategory("Ownership"),
    References: byCategory("References"),
    Lifecycle: byCategory("Lifecycle"),
    Workspace: byCategory("Workspace"),
    Timeline: byCategory("Timeline"),
    Focus: byCategory("Focus"),
    Metadata: byCategory("Metadata"),
    Integrity: byCategory("Integrity"),
  }),
  statistics: Object.freeze({
    categoryCount: ExecutiveContextValidationCategories.length,
    ruleCount: ExecutiveContextValidationRuleBaseline.length,
    identityRuleCount: byCategory("Identity").length,
    structureRuleCount: byCategory("Structure").length,
    ownershipRuleCount: byCategory("Ownership").length,
    referencesRuleCount: byCategory("References").length,
    lifecycleRuleCount: byCategory("Lifecycle").length,
    workspaceRuleCount: byCategory("Workspace").length,
    timelineRuleCount: byCategory("Timeline").length,
    focusRuleCount: byCategory("Focus").length,
    metadataRuleCount: byCategory("Metadata").length,
    integrityRuleCount: byCategory("Integrity").length,
    blockingRuleCount: ExecutiveContextValidationRuleBaseline.filter(
      (rule) => rule.preventsActivation,
    ).length,
  }),
  stableRuleIdentities: true as const,
  backwardCompatibleIdentities: true as const,
  evaluatesOnly: true as const,
  mutatesState: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
