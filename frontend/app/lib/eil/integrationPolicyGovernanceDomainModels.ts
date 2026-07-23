/**
 * EIL-5:3 — Integration Policy & Governance Domain Models.
 *
 * Immutable architectural domain models derived from Registry references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:3.
 */

import { IntegrationPolicyGovernanceRegistryIdentity } from "./integrationPolicyGovernanceRegistry.ts";
import type {
  IntegrationPolicyGovernanceDomainModel,
  PolicyGovernanceDomainModelKey,
  PolicyGovernanceRegistryReference,
} from "./integrationPolicyGovernanceModelTypes.ts";

const registryRef = (
  collection: PolicyGovernanceRegistryReference["collection"],
  entryKey: string,
): PolicyGovernanceRegistryReference =>
  Object.freeze({
    registryId: IntegrationPolicyGovernanceRegistryIdentity.canonicalId,
    registryNamespace: IntegrationPolicyGovernanceRegistryIdentity.namespace,
    entryPoint: "integrationPolicyGovernanceRegistry.ts" as const,
    collection,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const domainModel = (
  key: PolicyGovernanceDomainModelKey,
  canonicalName: string,
  description: string,
  collection: PolicyGovernanceRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationPolicyGovernanceDomainModel =>
  Object.freeze({
    modelId: `EIL-5:3/Model/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-5:3" as const,
    lifecycle: "Verified" as const,
    sourceRegistryReference: registryRef(collection, entryKey),
    sourceReference: `EIL-5:2/IntegrationPolicyGovernanceRegistry/${collection}/${entryKey}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen canonical governance domain model definitions.
 * Registry collections are referenced, never duplicated.
 */
export const IntegrationPolicyGovernanceDomainModels: readonly IntegrationPolicyGovernanceDomainModel[] =
  Object.freeze([
    domainModel(
      "GovernancePolicy",
      "Governance Policy",
      "Root architectural model for a governance policy definition.",
      "contracts",
      "Policy",
      1,
      Object.freeze(["domain", "policy"]),
    ),
    domainModel(
      "GovernanceRule",
      "Governance Rule",
      "Architectural rule definition within a governance policy.",
      "contracts",
      "GovernanceRule",
      2,
      Object.freeze(["domain", "rule"]),
    ),
    domainModel(
      "GovernanceScope",
      "Governance Scope",
      "Architectural scope metadata for governance applicability.",
      "contracts",
      "GovernanceScope",
      3,
      Object.freeze(["domain", "scope"]),
    ),
    domainModel(
      "GovernanceBoundary",
      "Governance Boundary",
      "Architectural boundary metadata for governance ownership surfaces.",
      "contracts",
      "GovernanceBoundary",
      4,
      Object.freeze(["domain", "boundary"]),
    ),
    domainModel(
      "ComplianceRequirement",
      "Compliance Requirement",
      "Architectural compliance requirement metadata without evaluation.",
      "contracts",
      "ComplianceContract",
      5,
      Object.freeze(["domain", "compliance-requirement"]),
    ),
    domainModel(
      "ComplianceDeclaration",
      "Compliance Declaration",
      "Architectural compliance declaration metadata without enforcement.",
      "capabilities",
      "ComplianceDeclaration",
      6,
      Object.freeze(["domain", "compliance-declaration"]),
    ),
    domainModel(
      "PolicyVersion",
      "Policy Version",
      "Architectural policy version metadata without version engines.",
      "contracts",
      "PolicyVersion",
      7,
      Object.freeze(["domain", "version"]),
    ),
    domainModel(
      "PolicyLifecycle",
      "Policy Lifecycle",
      "Architectural policy lifecycle metadata without state machines.",
      "contracts",
      "PolicyLifecycle",
      8,
      Object.freeze(["domain", "lifecycle"]),
    ),
    domainModel(
      "PolicyDependency",
      "Policy Dependency",
      "Architectural policy dependency metadata preserving approved direction.",
      "categories",
      "DependencyPolicy",
      9,
      Object.freeze(["domain", "dependency"]),
    ),
    domainModel(
      "PolicyCompatibility",
      "Policy Compatibility",
      "Architectural policy compatibility metadata without validation engines.",
      "contracts",
      "PolicyCompatibility",
      10,
      Object.freeze(["domain", "compatibility"]),
    ),
    domainModel(
      "PolicyMetadata",
      "Policy Metadata",
      "Architectural policy metadata envelope without persistence engines.",
      "contracts",
      "PolicyMetadata",
      11,
      Object.freeze(["domain", "metadata"]),
    ),
    domainModel(
      "GovernanceOwner",
      "Governance Owner",
      "Architectural ownership metadata for governance surfaces.",
      "ownershipCoverage",
      "1",
      12,
      Object.freeze(["domain", "owner"]),
    ),
    domainModel(
      "GovernanceContext",
      "Governance Context",
      "Architectural context metadata surrounding a governance definition.",
      "capabilities",
      "PolicyDescription",
      13,
      Object.freeze(["domain", "context"]),
    ),
    domainModel(
      "GovernanceInventory",
      "Governance Inventory",
      "Architectural inventory metadata for governance collections.",
      "capabilities",
      "InventorySupport",
      14,
      Object.freeze(["domain", "inventory"]),
    ),
    domainModel(
      "GovernanceClassification",
      "Governance Classification",
      "Architectural classification metadata for governance categories.",
      "capabilities",
      "GovernanceClassification",
      15,
      Object.freeze(["domain", "classification"]),
    ),
    domainModel(
      "ExecutiveGovernanceBoundary",
      "Executive Governance Boundary",
      "Architectural boundary metadata for executive-level governance.",
      "categories",
      "ExecutiveGovernancePolicy",
      16,
      Object.freeze(["domain", "executive-boundary"]),
    ),
  ]);
