/**
 * EX-1:4 — Executive Stage Validation.
 *
 * Canonical validation framework that verifies every Executive Stage before
 * it can be rendered. Consumes EX-1:3 Model public surface only.
 * Read-only policies — no rendering, mutation, interactions, or AI.
 *
 * Ownership: owned exclusively by EX-1:4.
 *
 * Public exports:
 *   ExecutiveStageValidationId
 *   ExecutiveStageValidationVersion
 *   ExecutiveStageValidationName
 *   ExecutiveStageValidationNamespace
 *   ExecutiveStageValidationStatus
 *   ExecutiveStageValidationReadiness
 *   ExecutiveStageValidation
 *   getExecutiveStageValidationSummary()
 */

import { ExecutiveStageModel } from "./executiveStageModel.ts";
import { ExecutiveStageIntegrityValidation } from "./executiveStageIntegrityValidation.ts";
import {
  ExecutiveStageValidationCategories,
  ExecutiveStageValidationCategoryNames,
  ExecutiveStageValidationExecutionOrder,
} from "./executiveStageValidationCategories.ts";
import {
  ExecutiveStageValidationRegistry,
  ExecutiveStageValidationRuleBaseline,
  ExecutiveStageCanonicalValidationRuleCount,
} from "./executiveStageValidationRegistry.ts";
import {
  ExecutiveStageValidationResultModelDeclaration,
  ExecutiveStageValidationStatuses,
} from "./executiveStageValidationResult.ts";
import {
  ExecutiveStageRenderingBlockingSeverities,
  ExecutiveStageValidationSeverities,
  ExecutiveStageValidationSeverityNames,
} from "./executiveStageValidationSeverity.ts";

/** Canonical validation identity. */
export const ExecutiveStageValidationId =
  "EX-1:4/ExecutiveStageValidation" as const;

export const ExecutiveStageValidationName =
  "Executive Stage Validation" as const;

export const ExecutiveStageValidationVersion = "1.0.0" as const;

export const ExecutiveStageValidationNamespace =
  "nexora.ex.executive.stage.validation" as const;

export const ExecutiveStageValidationStatus = "Validation" as const;

export const ExecutiveStageValidationReadiness = "ReadyForManifest" as const;

export const ExecutiveStageValidationNextPhase =
  "EX-1:5 — Executive Stage Manifest" as const;

export const ExecutiveStageValidationIdentity = Object.freeze({
  id: ExecutiveStageValidationId,
  name: ExecutiveStageValidationName,
  phaseId: "EX-1:4" as const,
  version: ExecutiveStageValidationVersion,
  namespace: ExecutiveStageValidationNamespace,
  status: ExecutiveStageValidationStatus,
  readiness: ExecutiveStageValidationReadiness,
  layer: "Executive Experience" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Stage" as const,
  canonical: true as const,
  mutable: false as const,
  sourceModel: "EX-1:3/ExecutiveStageModel" as const,
  upstream: "EX-1:3 — Executive Stage Model" as const,
  target: "Nexora Executive Experience MVP" as const,
  nextPhase: ExecutiveStageValidationNextPhase,
  description:
    "Canonical validation framework that verifies every Executive Stage is structurally complete, Runtime-compatible, and safe to render. Read-only — never modifies the Stage or the Runtime.",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Validation principles. */
export const ExecutiveStageValidationPrinciples = Object.freeze([
  Object.freeze({
    principleId: "EX-1:4/Principle/01",
    name: "Read Only",
    description: "Validation never changes Stage state.",
  }),
  Object.freeze({
    principleId: "EX-1:4/Principle/02",
    name: "Deterministic",
    description: "Validation is deterministic.",
  }),
  Object.freeze({
    principleId: "EX-1:4/Principle/03",
    name: "Rendering Independent",
    description: "Validation is independent of rendering.",
  }),
  Object.freeze({
    principleId: "EX-1:4/Principle/04",
    name: "Architecture Before Visuals",
    description: "Validation evaluates architecture before visuals.",
  }),
  Object.freeze({
    principleId: "EX-1:4/Principle/05",
    name: "Immutable Results",
    description: "Validation produces immutable results.",
  }),
] as const);

/** Stage guarantees. */
export const ExecutiveStageValidationGuarantees = Object.freeze([
  "architectural correctness",
  "Runtime compatibility",
  "deterministic evaluation",
  "immutable results",
  "render safety",
  "structural completeness",
] as const);

/** Prohibited surfaces. */
export const ExecutiveStageValidationProhibitedSurfaces = Object.freeze([
  "render the Stage",
  "execute interactions",
  "object animation",
  "modify Runtime",
  "calculate layouts",
  "invoke AI",
  "execute Workspace logic",
  "access external systems",
  "React rendering",
] as const);

/**
 * Canonical immutable Executive Stage Validation aggregate.
 */
export const ExecutiveStageValidation = Object.freeze({
  identity: ExecutiveStageValidationIdentity,
  model: ExecutiveStageModel,
  categories: ExecutiveStageValidationCategories,
  categoryNames: ExecutiveStageValidationCategoryNames,
  executionOrder: ExecutiveStageValidationExecutionOrder,
  severities: ExecutiveStageValidationSeverities,
  severityNames: ExecutiveStageValidationSeverityNames,
  renderingBlockingSeverities: ExecutiveStageRenderingBlockingSeverities,
  rules: ExecutiveStageValidationRuleBaseline,
  registry: ExecutiveStageValidationRegistry,
  integrity: ExecutiveStageIntegrityValidation,
  resultModel: ExecutiveStageValidationResultModelDeclaration,
  statuses: ExecutiveStageValidationStatuses,
  principles: ExecutiveStageValidationPrinciples,
  guarantees: ExecutiveStageValidationGuarantees,
  prohibitedSurfaces: ExecutiveStageValidationProhibitedSurfaces,
  baselines: Object.freeze({
    validationCategories: ExecutiveStageValidationCategories.length,
    canonicalValidationRules: ExecutiveStageCanonicalValidationRuleCount,
    severityLevels: ExecutiveStageValidationSeverities.length,
    integrityChecks: ExecutiveStageIntegrityValidation.checkCount,
    runtimeCompatibilityChecks:
      ExecutiveStageIntegrityValidation.runtimeCompatibilityCheckCount,
    validationResultSections:
      ExecutiveStageValidationResultModelDeclaration.fieldCount,
  }),
  statistics: Object.freeze({
    categoryCount: ExecutiveStageValidationCategories.length,
    ruleCount: ExecutiveStageValidationRuleBaseline.length,
    canonicalRuleCount: ExecutiveStageCanonicalValidationRuleCount,
    severityCount: ExecutiveStageValidationSeverities.length,
    statusCount: ExecutiveStageValidationStatuses.length,
    principleCount: ExecutiveStageValidationPrinciples.length,
    guaranteeCount: ExecutiveStageValidationGuarantees.length,
    integrityRuleCount: ExecutiveStageIntegrityValidation.ruleCount,
    integrityCheckCount: ExecutiveStageIntegrityValidation.checkCount,
    runtimeCompatibilityCheckCount:
      ExecutiveStageIntegrityValidation.runtimeCompatibilityCheckCount,
    blockingRuleCount:
      ExecutiveStageValidationRegistry.statistics.blockingRuleCount,
    resultFieldCount:
      ExecutiveStageValidationResultModelDeclaration.fieldCount,
  }),
  upstreamDependencies: Object.freeze([
    "EX-1:3 — Executive Stage Model",
  ]),
  status: ExecutiveStageValidationStatus,
  readiness: ExecutiveStageValidationReadiness,
  nextPhase: ExecutiveStageValidationNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  evaluatesOnly: true as const,
  readOnly: true as const,
  rendersStage: false as const,
  modifiesRuntime: false as const,
  modifiesStageState: false as const,
  executesInteractions: false as const,
  renderingBehavior: false as const,
  communicatesWithReact: false as const,
  invokesAi: false as const,
  accessesExternalSystems: false as const,
  usesExceptionsAsBusinessValidation: false as const,
  executableValidation: false as const,
  reactBehavior: false as const,
  animationBehavior: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
} as const);

/** Deterministic frozen Validation summary. */
export function getExecutiveStageValidationSummary() {
  return Object.freeze({
    validationId: ExecutiveStageValidationId,
    version: ExecutiveStageValidationVersion,
    name: ExecutiveStageValidationName,
    namespace: ExecutiveStageValidationNamespace,
    status: ExecutiveStageValidationStatus,
    readiness: ExecutiveStageValidationReadiness,
    categoryCount: ExecutiveStageValidationCategories.length,
    ruleCount: ExecutiveStageValidationRuleBaseline.length,
    canonicalRuleCount: ExecutiveStageCanonicalValidationRuleCount,
    severityCount: ExecutiveStageValidationSeverities.length,
    integrityCheckCount: ExecutiveStageIntegrityValidation.checkCount,
    runtimeCompatibilityCheckCount:
      ExecutiveStageIntegrityValidation.runtimeCompatibilityCheckCount,
    baselines: ExecutiveStageValidation.baselines,
    nextPhase: ExecutiveStageValidationNextPhase,
    sourceModel: ExecutiveStageValidationIdentity.sourceModel,
    readOnly: true as const,
    modifiesRuntime: false as const,
    rendersStage: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveStageValidation = () => ExecutiveStageValidation;
