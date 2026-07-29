/**
 * RTC-1:5 — Executive Context Runtime Manifest.
 *
 * Canonical immutable package description for the Executive Context Runtime.
 * Consumes RTC-1:4 Validation public surface only.
 * Metadata only — no executable runtime logic.
 *
 * Ownership: owned exclusively by RTC-1:5.
 *
 * Public exports:
 *   ExecutiveContextRuntimeManifestId
 *   ExecutiveContextRuntimeManifestVersion
 *   ExecutiveContextRuntimeManifestName
 *   ExecutiveContextRuntimeManifestNamespace
 *   ExecutiveContextRuntimeManifestStatus
 *   ExecutiveContextRuntimeManifestReadiness
 *   ExecutiveContextRuntimeManifest
 *   getExecutiveContextRuntimeManifestSummary()
 */

import {
  ExecutiveContextManifestCapabilities,
  ExecutiveContextManifestCapabilityNames,
} from "./executiveContextManifestCapabilities.ts";
import {
  ExecutiveContextManifestDependencies,
  ExecutiveContextManifestDependencyCatalog,
} from "./executiveContextManifestDependencies.ts";
import {
  ExecutiveContextManifestGuaranteeNames,
  ExecutiveContextManifestGuarantees,
} from "./executiveContextManifestGuarantees.ts";
import {
  ExecutiveContextManifestIdentity,
  ExecutiveContextRuntimeManifestId,
  ExecutiveContextRuntimeManifestName,
  ExecutiveContextRuntimeManifestNamespace,
  ExecutiveContextRuntimeManifestNextPhase,
  ExecutiveContextRuntimeManifestReadiness,
  ExecutiveContextRuntimeManifestStatus,
  ExecutiveContextRuntimeManifestVersion,
  ExecutiveContextRuntimeName,
} from "./executiveContextManifestIdentity.ts";
import {
  ExecutiveContextManifestCompatibilityTargets,
  ExecutiveContextManifestExtensionPoints,
  ExecutiveContextManifestInvariants,
  ExecutiveContextManifestMetadata,
  ExecutiveContextManifestPrinciples,
  ExecutiveContextManifestProhibitedSurfaces,
  ExecutiveContextManifestPublicContracts,
  ExecutiveContextManifestValidationSummary,
} from "./executiveContextManifestMetadata.ts";
import {
  ExecutiveContextManifestRegistry,
  ExecutiveContextManifestSections,
} from "./executiveContextManifestRegistry.ts";
import { ExecutiveContextRuntimeValidation } from "./executiveContextRuntimeValidation.ts";

export {
  ExecutiveContextRuntimeManifestId,
  ExecutiveContextRuntimeManifestName,
  ExecutiveContextRuntimeManifestNamespace,
  ExecutiveContextRuntimeManifestReadiness,
  ExecutiveContextRuntimeManifestStatus,
  ExecutiveContextRuntimeManifestVersion,
};

/**
 * Canonical immutable Executive Context Runtime Manifest aggregate.
 */
export const ExecutiveContextRuntimeManifest = Object.freeze({
  identity: ExecutiveContextManifestIdentity,
  runtimeName: ExecutiveContextRuntimeName,
  validation: ExecutiveContextRuntimeValidation,
  metadata: ExecutiveContextManifestMetadata,
  registry: ExecutiveContextManifestRegistry,
  sections: ExecutiveContextManifestSections,
  dependencies: ExecutiveContextManifestDependencies,
  dependencyCatalog: ExecutiveContextManifestDependencyCatalog,
  publicContracts: ExecutiveContextManifestPublicContracts,
  capabilities: ExecutiveContextManifestCapabilities,
  capabilityNames: ExecutiveContextManifestCapabilityNames,
  guarantees: ExecutiveContextManifestGuarantees,
  guaranteeNames: ExecutiveContextManifestGuaranteeNames,
  validationSummary: ExecutiveContextManifestValidationSummary,
  compatibility: ExecutiveContextManifestCompatibilityTargets,
  extensionPoints: ExecutiveContextManifestExtensionPoints,
  principles: ExecutiveContextManifestPrinciples,
  invariants: ExecutiveContextManifestInvariants,
  prohibitedSurfaces: ExecutiveContextManifestProhibitedSurfaces,
  baselines: ExecutiveContextManifestRegistry.baselines,
  statistics: Object.freeze({
    sectionCount: ExecutiveContextManifestSections.length,
    upstreamPhaseCount: ExecutiveContextManifestDependencies.length,
    publicContractCount: ExecutiveContextManifestPublicContracts.length,
    capabilityCount: ExecutiveContextManifestCapabilities.length,
    guaranteeCount: ExecutiveContextManifestGuarantees.length,
    compatibilityCount: ExecutiveContextManifestCompatibilityTargets.length,
    extensionPointCount: ExecutiveContextManifestExtensionPoints.length,
    validationCategoryCount:
      ExecutiveContextManifestValidationSummary.validationCategories,
    validationRuleCount:
      ExecutiveContextManifestValidationSummary.validationRules,
    principleCount: ExecutiveContextManifestPrinciples.length,
    invariantCount: ExecutiveContextManifestInvariants.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-1:1 — Executive Context Runtime Foundation",
    "RTC-1:2 — Executive Context Runtime Registry",
    "RTC-1:3 — Executive Context Runtime Model",
    "RTC-1:4 — Executive Context Runtime Validation",
  ]),
  status: ExecutiveContextRuntimeManifestStatus,
  readiness: ExecutiveContextRuntimeManifestReadiness,
  nextPhase: ExecutiveContextRuntimeManifestNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  executableRuntimeLogic: false as const,
  holdsActiveState: false as const,
  validatesContexts: false as const,
  performsLifecycleTransitions: false as const,
  renderingBehavior: false as const,
  invokesAi: false as const,
  persistsData: false as const,
  accessesExternalSystems: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  referencesPlatform: false as const,
  referencesUi: false as const,
  platformPhase: false as const,
  certificationPhase: false as const,
  freezePhase: false as const,
} as const);

/** Deterministic frozen Manifest summary. */
export function getExecutiveContextRuntimeManifestSummary() {
  return Object.freeze({
    manifestId: ExecutiveContextRuntimeManifestId,
    version: ExecutiveContextRuntimeManifestVersion,
    name: ExecutiveContextRuntimeManifestName,
    runtimeName: ExecutiveContextRuntimeName,
    namespace: ExecutiveContextRuntimeManifestNamespace,
    status: ExecutiveContextRuntimeManifestStatus,
    readiness: ExecutiveContextRuntimeManifestReadiness,
    upstreamPhaseCount: ExecutiveContextManifestDependencies.length,
    capabilityCount: ExecutiveContextManifestCapabilities.length,
    guaranteeCount: ExecutiveContextManifestGuarantees.length,
    validationCategoryCount:
      ExecutiveContextManifestValidationSummary.validationCategories,
    validationRuleCount:
      ExecutiveContextManifestValidationSummary.validationRules,
    compatibilityCount: ExecutiveContextManifestCompatibilityTargets.length,
    extensionPointCount: ExecutiveContextManifestExtensionPoints.length,
    nextPhase: ExecutiveContextRuntimeManifestNextPhase,
    sourceValidation: ExecutiveContextManifestIdentity.sourceValidation,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveContextRuntimeManifest = () =>
  ExecutiveContextRuntimeManifest;

export {
  ExecutiveContextManifestIdentity,
  ExecutiveContextRuntimeManifestNextPhase,
  ExecutiveContextRuntimeName,
};
