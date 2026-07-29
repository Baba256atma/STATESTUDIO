/**
 * RTC-1:4 — Executive Context Runtime Validation.
 *
 * Canonical validation policies for Executive Context consistency.
 * Consumes RTC-1:3 Model public surface only.
 * Read-only policies — no activation, mutation, UI, or AI.
 *
 * Ownership: owned exclusively by RTC-1:4.
 *
 * Public exports:
 *   ExecutiveContextRuntimeValidationId
 *   ExecutiveContextRuntimeValidationVersion
 *   ExecutiveContextRuntimeValidationName
 *   ExecutiveContextRuntimeValidationNamespace
 *   ExecutiveContextRuntimeValidationStatus
 *   ExecutiveContextRuntimeValidationReadiness
 *   ExecutiveContextRuntimeValidation
 *   getExecutiveContextRuntimeValidationSummary()
 */

import { ExecutiveContextRuntimeModel } from "./executiveContextRuntimeModel.ts";
import { ExecutiveContextIntegrityValidation } from "./executiveContextIntegrityValidation.ts";
import {
  ExecutiveContextValidationCategories,
  ExecutiveContextValidationCategoryNames,
  ExecutiveContextValidationExecutionOrder,
} from "./executiveContextValidationCategories.ts";
import {
  ExecutiveContextValidationRegistry,
  ExecutiveContextValidationRuleBaseline,
} from "./executiveContextValidationRegistry.ts";
import {
  ExecutiveContextValidationResultModelDeclaration,
  ExecutiveContextValidationStatuses,
} from "./executiveContextValidationResult.ts";
import {
  ExecutiveContextActivationBlockingSeverities,
  ExecutiveContextValidationSeverities,
  ExecutiveContextValidationSeverityNames,
} from "./executiveContextValidationSeverity.ts";

/** Canonical validation identity. */
export const ExecutiveContextRuntimeValidationId =
  "RTC-1:4/ExecutiveContextRuntimeValidation" as const;

export const ExecutiveContextRuntimeValidationName =
  "Executive Context Runtime Validation" as const;

export const ExecutiveContextRuntimeValidationVersion = "1.0.0" as const;

export const ExecutiveContextRuntimeValidationNamespace =
  "nexora.rtc.executive.context.validation" as const;

export const ExecutiveContextRuntimeValidationStatus = "Validation" as const;

export const ExecutiveContextRuntimeValidationReadiness =
  "ReadyForManifest" as const;

export const ExecutiveContextRuntimeValidationNextPhase =
  "RTC-1:5 — Executive Context Runtime Manifest" as const;

export const ExecutiveContextRuntimeValidationIdentity = Object.freeze({
  id: ExecutiveContextRuntimeValidationId,
  name: ExecutiveContextRuntimeValidationName,
  phaseId: "RTC-1:4" as const,
  version: ExecutiveContextRuntimeValidationVersion,
  namespace: ExecutiveContextRuntimeValidationNamespace,
  status: ExecutiveContextRuntimeValidationStatus,
  stage: ExecutiveContextRuntimeValidationReadiness,
  readiness: ExecutiveContextRuntimeValidationReadiness,
  layer: "Runtime Layer" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Context Runtime" as const,
  canonical: true as const,
  mutable: false as const,
  sourceModel: "RTC-1:3/ExecutiveContextRuntimeModel" as const,
  upstream: "RTC-1:3 — Executive Context Runtime Model" as const,
  target: "Nexora Executive Experience MVP" as const,
  nextPhase: ExecutiveContextRuntimeValidationNextPhase,
  description:
    "Canonical validation policies that guarantee every ExecutiveContext is internally consistent before activation. Defines categories, rules, severity, and structured results without mutating runtime state.",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Validation principles. */
export const ExecutiveContextValidationPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-1:4/Principle/01",
    name: "Evaluation Only",
    description: "Validation never changes Runtime state. It only evaluates it.",
  }),
  Object.freeze({
    principleId: "RTC-1:4/Principle/02",
    name: "Deterministic Rules",
    description: "Every validation rule is deterministic.",
  }),
  Object.freeze({
    principleId: "RTC-1:4/Principle/03",
    name: "Independent Of UiAiPersistence",
    description: "Validation is independent of UI, AI and persistence.",
  }),
  Object.freeze({
    principleId: "RTC-1:4/Principle/04",
    name: "Validation Precedes Activation",
    description: "An invalid context can never become Active.",
  }),
  Object.freeze({
    principleId: "RTC-1:4/Principle/05",
    name: "Structured Results",
    description:
      "Validation produces structured results. No exceptions as business validation.",
  }),
] as const);

/** Runtime guarantees. */
export const ExecutiveContextValidationGuarantees = Object.freeze([
  "deterministic evaluation",
  "complete rule coverage",
  "immutable results",
  "reproducible outcomes",
  "activation safety",
] as const);

/** Prohibited surfaces. */
export const ExecutiveContextValidationProhibitedSurfaces = Object.freeze([
  "activate contexts",
  "modify runtime state",
  "execute transitions",
  "render UI",
  "communicate with React",
  "invoke AI",
  "access databases",
  "calculate business metrics",
  "Next.js",
] as const);

/**
 * Canonical immutable Executive Context Runtime Validation aggregate.
 */
export const ExecutiveContextRuntimeValidation = Object.freeze({
  identity: ExecutiveContextRuntimeValidationIdentity,
  model: ExecutiveContextRuntimeModel,
  categories: ExecutiveContextValidationCategories,
  categoryNames: ExecutiveContextValidationCategoryNames,
  executionOrder: ExecutiveContextValidationExecutionOrder,
  severities: ExecutiveContextValidationSeverities,
  severityNames: ExecutiveContextValidationSeverityNames,
  activationBlockingSeverities: ExecutiveContextActivationBlockingSeverities,
  rules: ExecutiveContextValidationRuleBaseline,
  registry: ExecutiveContextValidationRegistry,
  integrity: ExecutiveContextIntegrityValidation,
  resultModel: ExecutiveContextValidationResultModelDeclaration,
  statuses: ExecutiveContextValidationStatuses,
  principles: ExecutiveContextValidationPrinciples,
  guarantees: ExecutiveContextValidationGuarantees,
  prohibitedSurfaces: ExecutiveContextValidationProhibitedSurfaces,
  statistics: Object.freeze({
    categoryCount: ExecutiveContextValidationCategories.length,
    ruleCount: ExecutiveContextValidationRuleBaseline.length,
    severityCount: ExecutiveContextValidationSeverities.length,
    statusCount: ExecutiveContextValidationStatuses.length,
    principleCount: ExecutiveContextValidationPrinciples.length,
    guaranteeCount: ExecutiveContextValidationGuarantees.length,
    integrityRuleCount: ExecutiveContextIntegrityValidation.ruleCount,
    blockingRuleCount:
      ExecutiveContextValidationRegistry.statistics.blockingRuleCount,
    resultFieldCount: ExecutiveContextValidationResultModelDeclaration.fieldCount,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-1:3 — Executive Context Runtime Model",
  ]),
  status: ExecutiveContextRuntimeValidationStatus,
  readiness: ExecutiveContextRuntimeValidationReadiness,
  nextPhase: ExecutiveContextRuntimeValidationNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  evaluatesOnly: true as const,
  readOnly: true as const,
  activatesContexts: false as const,
  modifiesRuntimeState: false as const,
  executesTransitions: false as const,
  renderingBehavior: false as const,
  communicatesWithReact: false as const,
  invokesAi: false as const,
  accessesDatabases: false as const,
  calculatesBusinessMetrics: false as const,
  usesExceptionsAsBusinessValidation: false as const,
  executableValidation: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
} as const);

/** Deterministic frozen Validation summary. */
export function getExecutiveContextRuntimeValidationSummary() {
  return Object.freeze({
    validationId: ExecutiveContextRuntimeValidationId,
    version: ExecutiveContextRuntimeValidationVersion,
    name: ExecutiveContextRuntimeValidationName,
    namespace: ExecutiveContextRuntimeValidationNamespace,
    status: ExecutiveContextRuntimeValidationStatus,
    readiness: ExecutiveContextRuntimeValidationReadiness,
    categoryCount: ExecutiveContextValidationCategories.length,
    ruleCount: ExecutiveContextValidationRuleBaseline.length,
    severityCount: ExecutiveContextValidationSeverities.length,
    integrityRuleCount: ExecutiveContextIntegrityValidation.ruleCount,
    nextPhase: ExecutiveContextRuntimeValidationNextPhase,
    sourceModel: ExecutiveContextRuntimeValidationIdentity.sourceModel,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveContextRuntimeValidation = () =>
  ExecutiveContextRuntimeValidation;
