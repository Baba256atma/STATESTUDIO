/**
 * EIL-7:1 — Integration Governance Foundation Contracts.
 *
 * Immutable contract declarations for Integration Governance Foundation surfaces.
 * Declarations only. No runtime enforcement. No governance engines.
 *
 * Ownership: owned exclusively by EIL-7:1.
 */

/** Closed contract-name vocabulary. */
export type GovernanceContractName =
  | "GovernanceContract"
  | "PolicyContract"
  | "ComplianceContract"
  | "VersioningContract"
  | "CompatibilityContract"
  | "LifecycleGovernanceContract"
  | "ApprovalContract"
  | "AuditContract"
  | "RiskContract"
  | "IntegrationStandardContract";

/** Immutable governance contract descriptor. */
export interface IntegrationGovernanceContract {
  readonly contractId: `EIL-7:1/Contract/${GovernanceContractName}`;
  readonly contractName: GovernanceContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const contract = (
  contractName: GovernanceContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): IntegrationGovernanceContract =>
  Object.freeze({
    contractId: `EIL-7:1/Contract/${contractName}` as const,
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
export const IntegrationGovernanceFoundationContracts: readonly IntegrationGovernanceContract[] =
  Object.freeze([
    contract(
      "GovernanceContract",
      "Governance Contract",
      "Canonical metadata contract binding governance identity to domain and policy references.",
      Object.freeze([
        "governanceId",
        "domainRefs",
        "policyRefs",
        "complianceRefs",
        "metadataOnly",
      ]),
      1,
    ),
    contract(
      "PolicyContract",
      "Policy Contract",
      "Declarative policy metadata without policy engine execution.",
      Object.freeze([
        "policyId",
        "policyCategoryRef",
        "scopeRef",
        "metadataOnly",
      ]),
      2,
    ),
    contract(
      "ComplianceContract",
      "Compliance Contract",
      "Declarative compliance metadata without compliance evaluation.",
      Object.freeze([
        "complianceId",
        "complianceCategoryRef",
        "requirementRefs",
        "metadataOnly",
      ]),
      3,
    ),
    contract(
      "VersioningContract",
      "Versioning Contract",
      "Declarative versioning metadata without version management runtime.",
      Object.freeze([
        "versionId",
        "semverRef",
        "compatibilityRef",
        "metadataOnly",
      ]),
      4,
    ),
    contract(
      "CompatibilityContract",
      "Compatibility Contract",
      "Declarative compatibility metadata without compatibility resolvers.",
      Object.freeze([
        "compatibilityId",
        "targetRefs",
        "constraintRefs",
        "metadataOnly",
      ]),
      5,
    ),
    contract(
      "LifecycleGovernanceContract",
      "Lifecycle Governance Contract",
      "Declarative lifecycle governance metadata without lifecycle execution.",
      Object.freeze([
        "lifecycleGovernanceId",
        "stageRefs",
        "transitionRefs",
        "metadataOnly",
      ]),
      6,
    ),
    contract(
      "ApprovalContract",
      "Approval Contract",
      "Declarative approval metadata without approval workflows.",
      Object.freeze([
        "approvalId",
        "approverRoleRefs",
        "gateRefs",
        "metadataOnly",
      ]),
      7,
    ),
    contract(
      "AuditContract",
      "Audit Contract",
      "Declarative audit metadata without audit execution.",
      Object.freeze([
        "auditId",
        "auditScopeRefs",
        "evidenceRefs",
        "metadataOnly",
      ]),
      8,
    ),
    contract(
      "RiskContract",
      "Risk Contract",
      "Declarative risk metadata without risk engine evaluation.",
      Object.freeze([
        "riskId",
        "riskCategoryRefs",
        "mitigationRefs",
        "metadataOnly",
      ]),
      9,
    ),
    contract(
      "IntegrationStandardContract",
      "Integration Standard Contract",
      "Declarative integration standard metadata without standard enforcement.",
      Object.freeze([
        "standardId",
        "standardRefs",
        "applicabilityRefs",
        "metadataOnly",
      ]),
      10,
    ),
  ]);

/** Deterministic contract-name inventory. */
export const IntegrationGovernanceFoundationContractNames = Object.freeze(
  IntegrationGovernanceFoundationContracts.map(
    (item) => item.contractName,
  ),
) as readonly GovernanceContractName[];
