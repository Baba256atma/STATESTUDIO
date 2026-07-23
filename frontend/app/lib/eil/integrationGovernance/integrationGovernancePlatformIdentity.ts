/**
 * EIL-7:6 — Integration Governance Platform Identity.
 *
 * Canonical immutable identity for the Integration Governance Platform.
 * Declares exclusive upstream dependency on EIL-7:5 Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-7:6.
 */

import { IntegrationGovernanceManifestCanonicalId } from "./integrationGovernanceManifest.ts";

/** Canonical phase ID. */
export const IntegrationGovernancePlatformPhaseId = "EIL-7:6" as const;

/** Canonical platform ID. */
export const IntegrationGovernancePlatformCanonicalId =
  "EIL-7:6/IntegrationGovernancePlatform" as const;

/** Human-readable platform name. */
export const IntegrationGovernancePlatformName =
  "Integration Governance Platform" as const;

/** Semantic version. */
export const IntegrationGovernancePlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationGovernancePlatformNamespace =
  "nexora.eil.integration-governance.platform" as const;

/** Platform status. */
export const IntegrationGovernancePlatformStatusValue = "Platform" as const;

/** Immediate next-phase readiness. */
export const IntegrationGovernancePlatformReadinessValue =
  "ReadyForCertification" as const;

/**
 * Immutable identity for EIL-7:6 Integration Governance Platform.
 */
export const IntegrationGovernancePlatformIdentity = Object.freeze({
  phaseId: IntegrationGovernancePlatformPhaseId,
  canonicalId: IntegrationGovernancePlatformCanonicalId,
  name: IntegrationGovernancePlatformName,
  version: IntegrationGovernancePlatformVersion,
  namespace: IntegrationGovernancePlatformNamespace,
  layer: "EIL" as const,
  platform: "EIL-7" as const,
  phaseType: "Platform" as const,
  status: IntegrationGovernancePlatformStatusValue,
  readiness: IntegrationGovernancePlatformReadinessValue,
  manifestDependency: IntegrationGovernanceManifestCanonicalId,
  manifestEntryPoint: "integrationGovernanceManifest.ts" as const,
  description:
    "Canonical immutable Platform metadata package composing Foundation through Manifest Integration Governance architecture.",
  metadataOnly: true as const,
  immutable: true as const,
});
