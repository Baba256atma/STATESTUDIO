/**
 * EX-1:5 — Executive Stage Manifest.
 *
 * Canonical immutable architectural release description of the Executive Stage.
 * Consumes EX-1:4 Validation public surface only.
 * Descriptive metadata only — no rendering, Runtime state, or business behaviour.
 *
 * Ownership: owned exclusively by EX-1:5.
 *
 * Public exports:
 *   ExecutiveStageManifestId
 *   ExecutiveStageManifestVersion
 *   ExecutiveStageManifestName
 *   ExecutiveStageManifestNamespace
 *   ExecutiveStageManifestStatus
 *   ExecutiveStageManifestReadiness
 *   ExecutiveStageManifest
 *   getExecutiveStageManifestSummary()
 */

import {
  ExecutiveStageManifestCapabilities,
  ExecutiveStageManifestCapabilityNames,
} from "./executiveStageManifestCapabilities.ts";
import {
  ExecutiveStageManifestDependencies,
  ExecutiveStageManifestDependencyCatalog,
} from "./executiveStageManifestDependencies.ts";
import {
  ExecutiveStageManifestGuaranteeNames,
  ExecutiveStageManifestGuarantees,
} from "./executiveStageManifestGuarantees.ts";
import {
  ExecutiveStageManifestIdentity,
  ExecutiveStageManifestId,
  ExecutiveStageManifestName,
  ExecutiveStageManifestNamespace,
  ExecutiveStageManifestNextPhase,
  ExecutiveStageManifestReadiness,
  ExecutiveStageManifestStatus,
  ExecutiveStageManifestVersion,
  ExecutiveStageName,
} from "./executiveStageManifestIdentity.ts";
import {
  ExecutiveStageManifestCompatibilityTargets,
  ExecutiveStageManifestExtensionPoints,
  ExecutiveStageManifestInvariants,
  ExecutiveStageManifestMetadata,
  ExecutiveStageManifestPrinciples,
  ExecutiveStageManifestProhibitedSurfaces,
  ExecutiveStageManifestPublicContracts,
  ExecutiveStageManifestValidationSummary,
} from "./executiveStageManifestMetadata.ts";
import {
  ExecutiveStageManifestRegistry,
  ExecutiveStageManifestSections,
} from "./executiveStageManifestRegistry.ts";
import { ExecutiveStageValidation } from "./executiveStageValidation.ts";

export {
  ExecutiveStageManifestId,
  ExecutiveStageManifestName,
  ExecutiveStageManifestNamespace,
  ExecutiveStageManifestReadiness,
  ExecutiveStageManifestStatus,
  ExecutiveStageManifestVersion,
};

/**
 * Canonical immutable Executive Stage Manifest aggregate.
 */
export const ExecutiveStageManifest = Object.freeze({
  identity: ExecutiveStageManifestIdentity,
  stageName: ExecutiveStageName,
  validation: ExecutiveStageValidation,
  metadata: ExecutiveStageManifestMetadata,
  registry: ExecutiveStageManifestRegistry,
  sections: ExecutiveStageManifestSections,
  dependencies: ExecutiveStageManifestDependencies,
  dependencyCatalog: ExecutiveStageManifestDependencyCatalog,
  publicContracts: ExecutiveStageManifestPublicContracts,
  capabilities: ExecutiveStageManifestCapabilities,
  capabilityNames: ExecutiveStageManifestCapabilityNames,
  guarantees: ExecutiveStageManifestGuarantees,
  guaranteeNames: ExecutiveStageManifestGuaranteeNames,
  validationSummary: ExecutiveStageManifestValidationSummary,
  compatibility: ExecutiveStageManifestCompatibilityTargets,
  extensionPoints: ExecutiveStageManifestExtensionPoints,
  principles: ExecutiveStageManifestPrinciples,
  invariants: ExecutiveStageManifestInvariants,
  prohibitedSurfaces: ExecutiveStageManifestProhibitedSurfaces,
  baselines: ExecutiveStageManifestRegistry.baselines,
  statistics: Object.freeze({
    sectionCount: ExecutiveStageManifestSections.length,
    upstreamPhaseCount: ExecutiveStageManifestDependencies.length,
    publicContractCount: ExecutiveStageManifestPublicContracts.length,
    capabilityCount: ExecutiveStageManifestCapabilities.length,
    guaranteeCount: ExecutiveStageManifestGuarantees.length,
    compatibilityCount: ExecutiveStageManifestCompatibilityTargets.length,
    extensionPointCount: ExecutiveStageManifestExtensionPoints.length,
    validationCategoryCount:
      ExecutiveStageManifestValidationSummary.validationCategories,
    validationRuleCount:
      ExecutiveStageManifestValidationSummary.validationRules,
    principleCount: ExecutiveStageManifestPrinciples.length,
    invariantCount: ExecutiveStageManifestInvariants.length,
  }),
  upstreamDependencies: Object.freeze([
    "EX-1:1 — Executive Stage Foundation",
    "EX-1:2 — Executive Stage Registry",
    "EX-1:3 — Executive Stage Model",
    "EX-1:4 — Executive Stage Validation",
  ]),
  status: ExecutiveStageManifestStatus,
  readiness: ExecutiveStageManifestReadiness,
  nextPhase: ExecutiveStageManifestNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  executableImplementation: false as const,
  holdsRuntimeState: false as const,
  validatesStageInstances: false as const,
  rendersStage: false as const,
  createsRuntimeObjects: false as const,
  executesInteractions: false as const,
  renderingBehavior: false as const,
  invokesAi: false as const,
  communicatesWithExternalServices: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  referencesPlatform: false as const,
  referencesUi: false as const,
  platformPhase: false as const,
  certificationPhase: false as const,
  freezePhase: false as const,
} as const);

/** Deterministic frozen Manifest summary. */
export function getExecutiveStageManifestSummary() {
  return Object.freeze({
    manifestId: ExecutiveStageManifestId,
    version: ExecutiveStageManifestVersion,
    name: ExecutiveStageManifestName,
    stageName: ExecutiveStageName,
    namespace: ExecutiveStageManifestNamespace,
    status: ExecutiveStageManifestStatus,
    readiness: ExecutiveStageManifestReadiness,
    upstreamPhaseCount: ExecutiveStageManifestDependencies.length,
    capabilityCount: ExecutiveStageManifestCapabilities.length,
    guaranteeCount: ExecutiveStageManifestGuarantees.length,
    validationCategoryCount:
      ExecutiveStageManifestValidationSummary.validationCategories,
    validationRuleCount:
      ExecutiveStageManifestValidationSummary.validationRules,
    compatibilityCount: ExecutiveStageManifestCompatibilityTargets.length,
    extensionPointCount: ExecutiveStageManifestExtensionPoints.length,
    baselines: ExecutiveStageManifest.baselines,
    nextPhase: ExecutiveStageManifestNextPhase,
    sourceValidation: ExecutiveStageManifestIdentity.sourceValidation,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveStageManifest = () => ExecutiveStageManifest;

export {
  ExecutiveStageManifestIdentity,
  ExecutiveStageManifestNextPhase,
  ExecutiveStageName,
};
