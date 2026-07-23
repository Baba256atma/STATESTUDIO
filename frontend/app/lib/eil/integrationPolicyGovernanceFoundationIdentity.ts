/**
 * EIL-5:1 — Integration Policy & Governance Foundation Identity.
 *
 * Canonical immutable identity for the Integration Policy & Governance Platform foundation.
 * Metadata-only. No governance enforcement behavior.
 *
 * Ownership: owned exclusively by EIL-5:1.
 */

import type { IntegrationPolicyGovernanceFoundationIdentity as PolicyGovernanceFoundationIdentityDescriptor } from "./integrationPolicyGovernanceFoundationTypes.ts";

/** Canonical foundation identity constant. */
export const IntegrationPolicyGovernanceFoundationId =
  "EIL-5:1/IntegrationPolicyGovernanceFoundation" as const;

/** Human-readable foundation name. */
export const IntegrationPolicyGovernanceFoundationName =
  "Integration Policy & Governance Foundation" as const;

/** Semantic version. */
export const IntegrationPolicyGovernanceFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationPolicyGovernanceFoundationNamespace =
  "nexora.eil.integration-policy-governance.foundation" as const;

/** Foundation status. */
export const IntegrationPolicyGovernanceFoundationStatusValue =
  "Foundation" as const;

/** Immediate next-phase readiness. */
export const IntegrationPolicyGovernanceFoundationReadinessValue =
  "ReadyForRegistry" as const;

/**
 * Immutable identity descriptor for EIL-5:1 Integration Policy & Governance Foundation.
 */
export const IntegrationPolicyGovernanceFoundationIdentity: PolicyGovernanceFoundationIdentityDescriptor =
  Object.freeze({
    foundationId: IntegrationPolicyGovernanceFoundationId,
    foundationName: IntegrationPolicyGovernanceFoundationName,
    foundationVersion: IntegrationPolicyGovernanceFoundationVersion,
    foundationNamespace: IntegrationPolicyGovernanceFoundationNamespace,
    layer: "EIL" as const,
    platform: "EIL-5" as const,
    phaseId: "EIL-5:1" as const,
    phaseType: "Foundation" as const,
    owner: "EIL-5 Integration Policy & Governance Foundation",
    status: IntegrationPolicyGovernanceFoundationStatusValue,
    readiness: IntegrationPolicyGovernanceFoundationReadinessValue,
    description:
      "Immutable architectural foundation of the Nexora Integration Policy & Governance Platform. Declares governance identities, categories, contracts, capabilities, responsibilities, lifecycle, ownership, boundaries, and terminology without governance enforcement or policy execution behavior.",
    metadataOnly: true as const,
    immutable: true as const,
  });
