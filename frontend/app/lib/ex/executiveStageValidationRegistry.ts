/**
 * EX-1:4 — Executive Stage Validation Registry.
 *
 * Deterministic catalogue of all forty canonical validation rules.
 * Stable rule identities; count is dynamically extensible while preserving
 * the identities of the initial forty canonical rules.
 *
 * Ownership: owned exclusively by EX-1:4.
 */

import {
  ExecutiveStageIntegrityChecks,
  ExecutiveStageIntegrityValidationRules,
  ExecutiveStageRuntimeCompatibilityChecks,
} from "./executiveStageIntegrityValidation.ts";
import {
  ExecutiveStageValidationCategories,
  ExecutiveStageValidationCategoryNames,
  type ExecutiveStageValidationCategoryName,
} from "./executiveStageValidationCategories.ts";
import { ExecutiveStageValidationRules } from "./executiveStageValidationRules.ts";
import {
  ExecutiveStageRenderingBlockingSeverities,
  ExecutiveStageValidationSeverities,
} from "./executiveStageValidationSeverity.ts";

/** Complete ordered rule baseline — exactly 40 canonical rules. */
export const ExecutiveStageValidationRuleBaseline = Object.freeze([
  ...ExecutiveStageValidationRules,
  ...ExecutiveStageIntegrityValidationRules,
] as const);

/** Canonical baseline size — identities of these rules are preserved forever. */
export const ExecutiveStageCanonicalValidationRuleCount = 40 as const;

const byCategory = (category: ExecutiveStageValidationCategoryName) =>
  Object.freeze(
    ExecutiveStageValidationRuleBaseline.filter(
      (rule) => rule.category === category,
    ),
  );

/**
 * Canonical validation rule registry.
 * Lookup is deterministic and category-ordered.
 */
export const ExecutiveStageValidationRegistry = Object.freeze({
  registryId: "EX-1:4/ValidationRegistry",
  sourcePhase: "EX-1:4" as const,
  categories: ExecutiveStageValidationCategories,
  categoryNames: ExecutiveStageValidationCategoryNames,
  severities: ExecutiveStageValidationSeverities,
  renderingBlockingSeverities: ExecutiveStageRenderingBlockingSeverities,
  rules: ExecutiveStageValidationRuleBaseline,
  ruleCount: ExecutiveStageValidationRuleBaseline.length,
  canonicalRuleCount: ExecutiveStageCanonicalValidationRuleCount,
  rulesByCategory: Object.freeze({
    Identity: byCategory("Identity"),
    Structure: byCategory("Structure"),
    Layers: byCategory("Layers"),
    Objects: byCategory("Objects"),
    Relationships: byCategory("Relationships"),
    Focus: byCategory("Focus"),
    Interactions: byCategory("Interactions"),
    "Runtime Binding": byCategory("Runtime Binding"),
    Metadata: byCategory("Metadata"),
    Integrity: byCategory("Integrity"),
  }),
  integrityChecks: ExecutiveStageIntegrityChecks,
  runtimeCompatibilityChecks: ExecutiveStageRuntimeCompatibilityChecks,
  statistics: Object.freeze({
    categoryCount: ExecutiveStageValidationCategories.length,
    ruleCount: ExecutiveStageValidationRuleBaseline.length,
    canonicalRuleCount: ExecutiveStageCanonicalValidationRuleCount,
    identityRuleCount: byCategory("Identity").length,
    structureRuleCount: byCategory("Structure").length,
    layersRuleCount: byCategory("Layers").length,
    objectsRuleCount: byCategory("Objects").length,
    relationshipsRuleCount: byCategory("Relationships").length,
    focusRuleCount: byCategory("Focus").length,
    interactionsRuleCount: byCategory("Interactions").length,
    runtimeBindingRuleCount: byCategory("Runtime Binding").length,
    metadataRuleCount: byCategory("Metadata").length,
    integrityRuleCount: byCategory("Integrity").length,
    integrityCheckCount: ExecutiveStageIntegrityChecks.length,
    runtimeCompatibilityCheckCount:
      ExecutiveStageRuntimeCompatibilityChecks.length,
    blockingRuleCount: ExecutiveStageValidationRuleBaseline.filter(
      (rule) => rule.preventsRendering,
    ).length,
  }),
  stableRuleIdentities: true as const,
  backwardCompatibleIdentities: true as const,
  dynamicallyExtensible: true as const,
  preservesCanonicalRuleIdentities: true as const,
  evaluatesOnly: true as const,
  mutatesState: false as const,
  executable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
