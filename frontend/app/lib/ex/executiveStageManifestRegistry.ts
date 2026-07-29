/**
 * EX-1:5 — Executive Stage Manifest Registry.
 *
 * Deterministic catalogue of Manifest baselines and package sections.
 *
 * Ownership: owned exclusively by EX-1:5.
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
import { ExecutiveStageManifestIdentity } from "./executiveStageManifestIdentity.ts";
import {
  ExecutiveStageManifestCompatibilityTargets,
  ExecutiveStageManifestExtensionPoints,
  ExecutiveStageManifestMetadata,
  ExecutiveStageManifestPublicContracts,
  ExecutiveStageManifestValidationSummary,
} from "./executiveStageManifestMetadata.ts";

/** Ordered Manifest structure sections. */
export const ExecutiveStageManifestSections = Object.freeze([
  "Identity",
  "Version",
  "Status",
  "Dependencies",
  "Public Contracts",
  "Stage Capabilities",
  "Stage Guarantees",
  "Validation Summary",
  "Compatibility",
  "Extension Points",
  "Metadata",
] as const);

/**
 * Canonical Manifest registry / baseline catalogue.
 */
export const ExecutiveStageManifestRegistry = Object.freeze({
  registryId: "EX-1:5/ManifestRegistry",
  sourcePhase: "EX-1:5" as const,
  identity: ExecutiveStageManifestIdentity,
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
  metadata: ExecutiveStageManifestMetadata,
  baselines: Object.freeze({
    upstreamDependencies: ExecutiveStageManifestDependencies.length,
    stageCapabilities: ExecutiveStageManifestCapabilities.length,
    stageGuarantees: ExecutiveStageManifestGuarantees.length,
    validationCategories:
      ExecutiveStageManifestValidationSummary.validationCategories,
    canonicalValidationRules:
      ExecutiveStageManifestValidationSummary.validationRules,
    compatibilityTargets: ExecutiveStageManifestCompatibilityTargets.length,
    extensionPoints: ExecutiveStageManifestExtensionPoints.length,
  }),
  oneCanonicalManifest: true as const,
  completeUpstreamCoverage: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
