/**
 * RTC-1:5 — Executive Context Manifest Registry.
 *
 * Deterministic catalogue of Manifest baselines and package sections.
 *
 * Ownership: owned exclusively by RTC-1:5.
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
import { ExecutiveContextManifestIdentity } from "./executiveContextManifestIdentity.ts";
import {
  ExecutiveContextManifestCompatibilityTargets,
  ExecutiveContextManifestExtensionPoints,
  ExecutiveContextManifestMetadata,
  ExecutiveContextManifestPublicContracts,
  ExecutiveContextManifestValidationSummary,
} from "./executiveContextManifestMetadata.ts";

/** Ordered Manifest structure sections. */
export const ExecutiveContextManifestSections = Object.freeze([
  "Identity",
  "Version",
  "Status",
  "Dependencies",
  "Public Contracts",
  "Runtime Capabilities",
  "Runtime Guarantees",
  "Validation Summary",
  "Compatibility",
  "Extension Points",
  "Metadata",
] as const);

/**
 * Canonical Manifest registry / baseline catalogue.
 */
export const ExecutiveContextManifestRegistry = Object.freeze({
  registryId: "RTC-1:5/ManifestRegistry",
  sourcePhase: "RTC-1:5" as const,
  identity: ExecutiveContextManifestIdentity,
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
  metadata: ExecutiveContextManifestMetadata,
  baselines: Object.freeze({
    upstreamRuntimePhases: ExecutiveContextManifestDependencies.length,
    runtimeCapabilities: ExecutiveContextManifestCapabilities.length,
    runtimeGuarantees: ExecutiveContextManifestGuarantees.length,
    validationCategories:
      ExecutiveContextManifestValidationSummary.validationCategories,
    validationRules: ExecutiveContextManifestValidationSummary.validationRules,
    compatibilityTargets: ExecutiveContextManifestCompatibilityTargets.length,
    extensionPoints: ExecutiveContextManifestExtensionPoints.length,
  }),
  oneCanonicalManifest: true as const,
  completeUpstreamCoverage: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
