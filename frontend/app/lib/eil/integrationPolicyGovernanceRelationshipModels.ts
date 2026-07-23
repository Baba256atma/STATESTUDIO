/**
 * EIL-5:3 — Integration Policy & Governance Relationship Models.
 *
 * Canonical descriptive relationships between governance domain models.
 * Metadata only — no relationship resolution or execution.
 *
 * Ownership: owned exclusively by EIL-5:3.
 */

import { IntegrationPolicyGovernanceRegistryIdentity } from "./integrationPolicyGovernanceRegistry.ts";
import type {
  IntegrationPolicyGovernanceRelationshipModel,
  PolicyGovernanceDomainModelKey,
  PolicyGovernanceRegistryReference,
  PolicyGovernanceRelationshipType,
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

const relationship = (
  key: string,
  relationshipType: PolicyGovernanceRelationshipType,
  canonicalName: string,
  description: string,
  sourceModel: PolicyGovernanceDomainModelKey,
  targetModel: PolicyGovernanceDomainModelKey,
  collection: PolicyGovernanceRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationPolicyGovernanceRelationshipModel =>
  Object.freeze({
    relationshipId: `EIL-5:3/Relationship/${key}` as const,
    relationshipType,
    canonicalKey: key,
    canonicalName,
    description,
    sourceModel,
    targetModel,
    ownership: "EIL-5:3" as const,
    lifecycle: "Verified" as const,
    sourceRegistryReference: registryRef(collection, entryKey),
    sourceReference: `EIL-5:2/IntegrationPolicyGovernanceRegistry/${collection}/${entryKey}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    resolvesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve relationship declarations covering every relationship type.
 * Descriptive metadata only.
 */
export const IntegrationPolicyGovernanceRelationshipModels: readonly IntegrationPolicyGovernanceRelationshipModel[] =
  Object.freeze([
    relationship(
      "GovernanceOwnerOwnsPolicy",
      "owns",
      "Governance Owner → Governance Policy",
      "Governance owner owns policy definition metadata.",
      "GovernanceOwner",
      "GovernancePolicy",
      "contracts",
      "Policy",
      1,
      Object.freeze(["owns", "policy"]),
    ),
    relationship(
      "GovernancePolicyReferencesRule",
      "references",
      "Governance Policy → Governance Rule",
      "Governance policy references rule definition metadata.",
      "GovernancePolicy",
      "GovernanceRule",
      "contracts",
      "GovernanceRule",
      2,
      Object.freeze(["references", "rule"]),
    ),
    relationship(
      "GovernancePolicyDependsOnDependency",
      "dependsOn",
      "Governance Policy → Policy Dependency",
      "Governance policy depends on dependency metadata.",
      "GovernancePolicy",
      "PolicyDependency",
      "categories",
      "DependencyPolicy",
      3,
      Object.freeze(["dependsOn", "dependency"]),
    ),
    relationship(
      "GovernancePolicyCompatibleWithCompatibility",
      "compatibleWith",
      "Governance Policy → Policy Compatibility",
      "Governance policy is compatible with compatibility metadata.",
      "GovernancePolicy",
      "PolicyCompatibility",
      "contracts",
      "PolicyCompatibility",
      4,
      Object.freeze(["compatibleWith", "compatibility"]),
    ),
    relationship(
      "GovernanceScopeGovernedByPolicy",
      "governedBy",
      "Governance Scope → Governance Policy",
      "Governance scope is governed by policy metadata.",
      "GovernanceScope",
      "GovernancePolicy",
      "contracts",
      "GovernanceScope",
      5,
      Object.freeze(["governedBy", "scope"]),
    ),
    relationship(
      "GovernancePolicyClassifiedAsClassification",
      "classifiedAs",
      "Governance Policy → Governance Classification",
      "Governance policy is classified as classification metadata.",
      "GovernancePolicy",
      "GovernanceClassification",
      "capabilities",
      "GovernanceClassification",
      6,
      Object.freeze(["classifiedAs", "classification"]),
    ),
    relationship(
      "GovernanceRuleBelongsToPolicy",
      "belongsTo",
      "Governance Rule → Governance Policy",
      "Governance rule belongs to policy definition metadata.",
      "GovernanceRule",
      "GovernancePolicy",
      "contracts",
      "Policy",
      7,
      Object.freeze(["belongsTo", "policy"]),
    ),
    relationship(
      "GovernancePolicyComposedOfRules",
      "composedOf",
      "Governance Policy → Governance Rule",
      "Governance policy is composed of rule metadata.",
      "GovernancePolicy",
      "GovernanceRule",
      "collections",
      "collections",
      8,
      Object.freeze(["composedOf", "rule"]),
    ),
    relationship(
      "ExecutiveBoundaryExtendsBoundary",
      "extends",
      "Executive Governance Boundary → Governance Boundary",
      "Executive boundary metadata extends governance boundary metadata.",
      "ExecutiveGovernanceBoundary",
      "GovernanceBoundary",
      "categories",
      "ExecutiveGovernancePolicy",
      9,
      Object.freeze(["extends", "executive"]),
    ),
    relationship(
      "ComplianceDeclarationValidatesRequirement",
      "validates",
      "Compliance Declaration → Compliance Requirement",
      "Compliance declaration validates requirement metadata without evaluation.",
      "ComplianceDeclaration",
      "ComplianceRequirement",
      "contracts",
      "ComplianceContract",
      10,
      Object.freeze(["validates", "compliance"]),
    ),
    relationship(
      "GovernanceBoundaryConstrainsScope",
      "constrains",
      "Governance Boundary → Governance Scope",
      "Governance boundary constrains scope metadata without enforcement.",
      "GovernanceBoundary",
      "GovernanceScope",
      "contracts",
      "GovernanceBoundary",
      11,
      Object.freeze(["constrains", "boundary"]),
    ),
    relationship(
      "PolicyVersionInheritsLifecycle",
      "inherits",
      "Policy Version → Policy Lifecycle",
      "Policy version inherits lifecycle mapping metadata.",
      "PolicyVersion",
      "PolicyLifecycle",
      "contracts",
      "PolicyVersion",
      12,
      Object.freeze(["inherits", "version"]),
    ),
  ]);

/** Exactly twelve relationship types covered by the relationship models. */
export const IntegrationPolicyGovernanceRelationshipTypes = Object.freeze([
  "owns",
  "references",
  "dependsOn",
  "compatibleWith",
  "governedBy",
  "classifiedAs",
  "belongsTo",
  "composedOf",
  "extends",
  "validates",
  "constrains",
  "inherits",
] as const satisfies readonly PolicyGovernanceRelationshipType[]);
