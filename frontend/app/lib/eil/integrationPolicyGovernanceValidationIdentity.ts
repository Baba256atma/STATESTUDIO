/**
 * EIL-5:4 — Integration Policy & Governance Validation Identity.
 *
 * Canonical immutable identity for the Integration Policy & Governance Validation phase.
 * Declares exactly one upstream phase dependency: EIL-5:3 Integration Policy & Governance Model.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-5:4.
 */

import type { IntegrationPolicyGovernanceValidationIdentity as PolicyGovernanceValidationIdentityDescriptor } from "./integrationPolicyGovernanceValidationTypes.ts";

/** Canonical phase ID. */
export const IntegrationPolicyGovernanceValidationPhaseId = "EIL-5:4" as const;

/** Canonical validation ID. */
export const IntegrationPolicyGovernanceValidationCanonicalId =
  "EIL-5:4/IntegrationPolicyGovernanceValidation" as const;

/** Human-readable validation name. */
export const IntegrationPolicyGovernanceValidationName =
  "Integration Policy & Governance Validation" as const;

/** Semantic version. */
export const IntegrationPolicyGovernanceValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationPolicyGovernanceValidationNamespace =
  "nexora.eil.integration-policy-governance.validation" as const;

/** Layer. */
export const IntegrationPolicyGovernanceValidationLayer = "EIL" as const;

/** Platform. */
export const IntegrationPolicyGovernanceValidationPlatformId = "EIL-5" as const;

/** Phase type. */
export const IntegrationPolicyGovernanceValidationPhaseType =
  "Validation" as const;

/** Validation status. */
export const IntegrationPolicyGovernanceValidationStatusValue =
  "Validation" as const;

/** Immediate next-phase readiness. */
export const IntegrationPolicyGovernanceValidationReadinessStateValue =
  "ReadyForManifest" as const;

/** Sole upstream Model dependency. */
export const IntegrationPolicyGovernanceValidationModelDependency =
  "EIL-5:3/IntegrationPolicyGovernanceModel" as const;

/** Sole Model aggregate entry point. */
export const IntegrationPolicyGovernanceValidationModelEntryPoint =
  "integrationPolicyGovernanceModel.ts" as const;

/**
 * Immutable identity object for EIL-5:4 Integration Policy & Governance Validation.
 * Dependency list contains exactly one phase dependency.
 */
export const IntegrationPolicyGovernanceValidationIdentity: PolicyGovernanceValidationIdentityDescriptor =
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceValidationPhaseId,
    canonicalId: IntegrationPolicyGovernanceValidationCanonicalId,
    name: IntegrationPolicyGovernanceValidationName,
    version: IntegrationPolicyGovernanceValidationVersion,
    namespace: IntegrationPolicyGovernanceValidationNamespace,
    layer: IntegrationPolicyGovernanceValidationLayer,
    platform: IntegrationPolicyGovernanceValidationPlatformId,
    phaseType: IntegrationPolicyGovernanceValidationPhaseType,
    status: IntegrationPolicyGovernanceValidationStatusValue,
    readiness: IntegrationPolicyGovernanceValidationReadinessStateValue,
    modelDependency: IntegrationPolicyGovernanceValidationModelDependency,
    modelEntryPoint: IntegrationPolicyGovernanceValidationModelEntryPoint,
    description:
      "Canonical validation architecture declaring rules, categories, findings, and readiness gates for Integration Policy & Governance Foundation, Registry, and Model metadata without executing validation.",
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly one declared phase dependency. */
export const IntegrationPolicyGovernanceValidationDependencies = Object.freeze([
  Object.freeze({
    phaseId: IntegrationPolicyGovernanceValidationModelDependency,
    entryPoint: IntegrationPolicyGovernanceValidationModelEntryPoint,
    relationship: "SoleUpstreamModel" as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);
