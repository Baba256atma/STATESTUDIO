/**
 * EIL-7:5 — Integration Governance Manifest Identity.
 *
 * Canonical immutable identity for the Integration Governance Manifest.
 * Declares exclusive upstream dependency on EIL-7:4 Validation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-7:5.
 */

import { IntegrationGovernanceValidationCanonicalId } from "./integrationGovernanceValidation.ts";

/** Canonical phase ID. */
export const IntegrationGovernanceManifestPhaseId = "EIL-7:5" as const;

/** Canonical manifest ID. */
export const IntegrationGovernanceManifestCanonicalId =
  "EIL-7:5/IntegrationGovernanceManifest" as const;

/** Human-readable manifest name. */
export const IntegrationGovernanceManifestName =
  "Integration Governance Manifest" as const;

/** Semantic version. */
export const IntegrationGovernanceManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationGovernanceManifestNamespace =
  "nexora.eil.integration-governance.manifest" as const;

/** Manifest status. */
export const IntegrationGovernanceManifestStatusValue = "Manifest" as const;

/** Immediate next-phase readiness. */
export const IntegrationGovernanceManifestReadinessValue =
  "ReadyForPlatform" as const;

/**
 * Immutable identity for EIL-7:5 Integration Governance Manifest.
 */
export const IntegrationGovernanceManifestIdentity = Object.freeze({
  phaseId: IntegrationGovernanceManifestPhaseId,
  canonicalId: IntegrationGovernanceManifestCanonicalId,
  name: IntegrationGovernanceManifestName,
  version: IntegrationGovernanceManifestVersion,
  namespace: IntegrationGovernanceManifestNamespace,
  layer: "EIL" as const,
  platform: "EIL-7" as const,
  phaseType: "Manifest" as const,
  status: IntegrationGovernanceManifestStatusValue,
  readiness: IntegrationGovernanceManifestReadinessValue,
  validationDependency: IntegrationGovernanceValidationCanonicalId,
  validationEntryPoint: "integrationGovernanceValidation.ts" as const,
  description:
    "Canonical immutable architectural publication of validated Integration Governance metadata.",
  metadataOnly: true as const,
  immutable: true as const,
});
