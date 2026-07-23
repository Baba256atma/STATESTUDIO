/**
 * EIL-5:3 — Integration Policy & Governance Model Identity.
 *
 * Canonical immutable identity for the Integration Policy & Governance Model.
 * Declares exactly one upstream phase dependency: EIL-5:2 Integration Policy & Governance Registry.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:3.
 */

import type { IntegrationPolicyGovernanceModelIdentity as PolicyGovernanceModelIdentityDescriptor } from "./integrationPolicyGovernanceModelTypes.ts";

/** Canonical phase ID. */
export const IntegrationPolicyGovernanceModelPhaseId = "EIL-5:3" as const;

/** Canonical model ID. */
export const IntegrationPolicyGovernanceModelCanonicalId =
  "EIL-5:3/IntegrationPolicyGovernanceModel" as const;

/** Human-readable model name. */
export const IntegrationPolicyGovernanceModelName =
  "Integration Policy & Governance Model" as const;

/** Semantic version. */
export const IntegrationPolicyGovernanceModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationPolicyGovernanceModelNamespace =
  "nexora.eil.integration-policy-governance.model" as const;

/** Layer. */
export const IntegrationPolicyGovernanceModelLayer = "EIL" as const;

/** Platform. */
export const IntegrationPolicyGovernanceModelPlatformId = "EIL-5" as const;

/** Phase type. */
export const IntegrationPolicyGovernanceModelPhaseType = "Model" as const;

/** Model status. */
export const IntegrationPolicyGovernanceModelStatusValue = "Model" as const;

/** Immediate next-phase readiness. */
export const IntegrationPolicyGovernanceModelReadinessValue =
  "ReadyForValidation" as const;

/** Sole upstream Registry dependency. */
export const IntegrationPolicyGovernanceModelRegistryDependency =
  "EIL-5:2/IntegrationPolicyGovernanceRegistry" as const;

/** Sole Registry aggregate entry point. */
export const IntegrationPolicyGovernanceModelRegistryEntryPoint =
  "integrationPolicyGovernanceRegistry.ts" as const;

/**
 * Immutable identity object for EIL-5:3 Integration Policy & Governance Model.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationPolicyGovernanceModelIdentity: PolicyGovernanceModelIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceModelPhaseId,
    canonicalId: IntegrationPolicyGovernanceModelCanonicalId,
    name: IntegrationPolicyGovernanceModelName,
    version: IntegrationPolicyGovernanceModelVersion,
    namespace: IntegrationPolicyGovernanceModelNamespace,
    layer: IntegrationPolicyGovernanceModelLayer,
    platform: IntegrationPolicyGovernanceModelPlatformId,
    phaseType: IntegrationPolicyGovernanceModelPhaseType,
    status: IntegrationPolicyGovernanceModelStatusValue,
    readiness: IntegrationPolicyGovernanceModelReadinessValue,
    registryDependency: IntegrationPolicyGovernanceModelRegistryDependency,
    registryEntryPoint: IntegrationPolicyGovernanceModelRegistryEntryPoint,
    description:
      "Canonical architectural model transforming Integration Policy & Governance Registry collections into deterministic domain, relationship, topology, and lifecycle model metadata.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationPolicyGovernanceModelDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceModelRegistryDependency,
    entryPoint: IntegrationPolicyGovernanceModelRegistryEntryPoint,
    relationship: "SoleUpstreamRegistry" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
