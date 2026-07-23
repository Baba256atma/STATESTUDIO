/**
 * EIL-5:1 — Integration Policy & Governance Foundation Contracts.
 *
 * Immutable contract declarations for Integration Policy & Governance Foundation surfaces.
 * Declarations only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-5:1.
 */

import type {
  IntegrationPolicyGovernanceContract,
  PolicyGovernanceContractName,
} from "./integrationPolicyGovernanceFoundationTypes.ts";

const contract = (
  contractName: PolicyGovernanceContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): IntegrationPolicyGovernanceContract =>
  Object.freeze({
    contractId: `EIL-5:1/Contract/${contractName}` as const,
    contractName,
    canonicalName,
    description,
    fields: Object.freeze([...fields]),
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten public governance contracts.
 * Order is deterministic and immutable.
 */
export const IntegrationPolicyGovernanceFoundationContracts: readonly IntegrationPolicyGovernanceContract[] =
  Object.freeze([
    contract(
      "Policy",
      "Policy",
      "Canonical metadata contract binding a policy identity to governance scope references.",
      Object.freeze([
        "policyId",
        "policyName",
        "categoryRef",
        "scopeRefs",
        "compatibilityRef",
        "metadataOnly",
      ]),
      1,
    ),
    contract(
      "GovernanceRule",
      "Governance Rule",
      "Declarative governance rule metadata without rule enforcement engines.",
      Object.freeze([
        "ruleId",
        "ruleName",
        "policyRef",
        "boundaryRefs",
        "runtimeEnforced",
      ]),
      2,
    ),
    contract(
      "GovernanceBoundary",
      "Governance Boundary",
      "Declarative governance boundary metadata without boundary enforcement runtime.",
      Object.freeze([
        "boundaryId",
        "boundaryName",
        "policyRef",
        "scopeRefs",
        "runtimeEnforced",
      ]),
      3,
    ),
    contract(
      "GovernanceScope",
      "Governance Scope",
      "Declarative governance scope metadata without scope evaluation engines.",
      Object.freeze([
        "scopeId",
        "scopeName",
        "policyRef",
        "boundaryRefs",
        "runtimeEvaluated",
      ]),
      4,
    ),
    contract(
      "ComplianceContract",
      "Compliance Contract",
      "Declarative compliance metadata without compliance execution engines.",
      Object.freeze([
        "complianceId",
        "policyRef",
        "declarationRefs",
        "runtimeValidated",
      ]),
      5,
    ),
    contract(
      "PolicyLifecycle",
      "Policy Lifecycle",
      "Declarative policy lifecycle metadata without lifecycle state machines.",
      Object.freeze([
        "lifecycleId",
        "policyRef",
        "lifecycleState",
        "executesTransitions",
      ]),
      6,
    ),
    contract(
      "PolicyVersion",
      "Policy Version",
      "Declarative policy version metadata without version resolution engines.",
      Object.freeze([
        "versionId",
        "policyRef",
        "semanticVersion",
        "runtimeResolved",
      ]),
      7,
    ),
    contract(
      "PolicyMetadata",
      "Policy Metadata",
      "Declarative policy metadata envelope without persistence or inventory engines.",
      Object.freeze([
        "metadataId",
        "policyRef",
        "annotationRefs",
        "runtimeStored",
      ]),
      8,
    ),
    contract(
      "PolicyCompatibility",
      "Policy Compatibility",
      "Declarative policy compatibility metadata without compatibility validation engines.",
      Object.freeze([
        "compatibilityId",
        "policyRef",
        "scopeRefs",
        "runtimeValidated",
      ]),
      9,
    ),
    contract(
      "GovernanceIdentity",
      "Governance Identity",
      "Declarative governance identity metadata without identity enforcement engines.",
      Object.freeze([
        "identityId",
        "canonicalId",
        "namespace",
        "runtimeEnforced",
      ]),
      10,
    ),
  ]);

export const IntegrationPolicyGovernanceFoundationContractNames = Object.freeze([
  "Policy",
  "GovernanceRule",
  "GovernanceBoundary",
  "GovernanceScope",
  "ComplianceContract",
  "PolicyLifecycle",
  "PolicyVersion",
  "PolicyMetadata",
  "PolicyCompatibility",
  "GovernanceIdentity",
] as const satisfies readonly PolicyGovernanceContractName[]);
