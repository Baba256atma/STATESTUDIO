/**
 * EIL-5:2 — Integration Policy & Governance Contract Registry.
 *
 * Canonical registry for the ten Foundation governance contracts.
 * References Foundation contract identities without redefining architecture.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:2.
 */

import { IntegrationPolicyGovernanceFoundationPlatform } from "./integrationPolicyGovernanceFoundation.ts";
import type {
  IntegrationPolicyGovernanceContractRegistryEntry,
  PolicyGovernanceCompatibilityClassification,
  PolicyGovernanceComplianceClassification,
  PolicyGovernanceContractClassification,
} from "./integrationPolicyGovernanceRegistryTypes.ts";

const foundation = IntegrationPolicyGovernanceFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

const CONTRACT_CLASSIFICATION: Readonly<
  Record<string, PolicyGovernanceContractClassification>
> = Object.freeze({
  Policy: "Policy",
  GovernanceRule: "GovernanceRule",
  GovernanceBoundary: "GovernanceBoundary",
  GovernanceScope: "GovernanceScope",
  ComplianceContract: "Compliance",
  PolicyLifecycle: "PolicyLifecycle",
  PolicyVersion: "PolicyVersion",
  PolicyMetadata: "PolicyMetadata",
  PolicyCompatibility: "PolicyCompatibility",
  GovernanceIdentity: "GovernanceIdentity",
});

const COMPATIBILITY: Readonly<
  Record<string, PolicyGovernanceCompatibilityClassification>
> = Object.freeze({
  Policy: "Canonical",
  GovernanceRule: "Rule",
  GovernanceBoundary: "Boundary",
  GovernanceScope: "Scope",
  ComplianceContract: "Compliance",
  PolicyLifecycle: "Lifecycle",
  PolicyVersion: "Version",
  PolicyMetadata: "Metadata",
  PolicyCompatibility: "Compatibility",
  GovernanceIdentity: "Identity",
});

const COMPLIANCE: Readonly<
  Record<string, PolicyGovernanceComplianceClassification>
> = Object.freeze({
  Policy: "Canonical",
  GovernanceRule: "Declarative",
  GovernanceBoundary: "Boundary",
  GovernanceScope: "Scope",
  ComplianceContract: "Contractual",
  PolicyLifecycle: "Lifecycle",
  PolicyVersion: "Version",
  PolicyMetadata: "Metadata",
  PolicyCompatibility: "Compatibility",
  GovernanceIdentity: "Identity",
});

/**
 * Exactly ten contract registry entries preserving Foundation order.
 */
export const IntegrationPolicyGovernanceContractRegistry: readonly IntegrationPolicyGovernanceContractRegistryEntry[] =
  Object.freeze(
    foundation.contracts.map((contract) =>
      Object.freeze({
        registryId:
          `EIL-5:2/Registry/Contract/${contract.contractName}` as const,
        canonicalKey: contract.contractName,
        canonicalName: contract.canonicalName,
        contractName: contract.canonicalName,
        category: "Contract" as const,
        description: contract.description,
        contractClassification:
          CONTRACT_CLASSIFICATION[contract.contractName]!,
        architecturalPurpose: contract.description,
        compatibilityClassification: COMPATIBILITY[contract.contractName]!,
        complianceClassification: COMPLIANCE[contract.contractName]!,
        sourcePhase:
          "EIL-5:1/IntegrationPolicyGovernanceFoundation" as const,
        sourceNamespace: foundationNamespace,
        architecturalOwner: "EIL-5:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: contract.deterministicOrder,
        tags: Object.freeze(["contract", "foundation-reference"]),
        sourceReference: `${foundationId}/contracts/${contract.contractName}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen contract-registry catalog with derived count. */
export const IntegrationPolicyGovernanceContractRegistryCatalog = Object.freeze(
  {
    collectionId: "EIL-5:2/Collection/Contracts",
    category: "Contract" as const,
    sourcePhase: "EIL-5:2" as const,
    entries: IntegrationPolicyGovernanceContractRegistry,
    entryCount: IntegrationPolicyGovernanceContractRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  },
);
