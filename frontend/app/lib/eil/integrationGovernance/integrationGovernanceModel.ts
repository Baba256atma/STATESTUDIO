/**
 * EIL-7:3 — Integration Governance Model.
 *
 * Canonical immutable architectural model for Integration Governance.
 * Consumes only the EIL-7:2 Integration Governance Registry aggregate.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by EIL-7:3.
 */

import { IntegrationGovernanceCapabilityModels } from "./integrationGovernanceCapabilityModels.ts";
import { IntegrationGovernanceComplianceModels } from "./integrationGovernanceComplianceModels.ts";
import { IntegrationGovernanceContractModels } from "./integrationGovernanceContractModels.ts";
import { IntegrationGovernanceDomainModels } from "./integrationGovernanceDomainModels.ts";
import { IntegrationGovernanceLifecycleModels } from "./integrationGovernanceLifecycleModels.ts";
import { IntegrationGovernancePolicyModels } from "./integrationGovernancePolicyModels.ts";
import {
  IntegrationGovernanceRegistry,
  IntegrationGovernanceRegistryCanonicalId,
  IntegrationGovernanceRegistryIdentity,
} from "./integrationGovernanceRegistry.ts";

/** Closed relationship-type vocabulary. */
export type GovernanceRelationshipType =
  | "owns"
  | "references"
  | "contains"
  | "dependsOn"
  | "classifiedAs"
  | "progressesTo"
  | "governedBy"
  | "validatedBy"
  | "publishedBy"
  | "sourcedFrom";

/** Immutable relationship descriptor. */
export interface IntegrationGovernanceRelationshipModel {
  readonly relationshipId: `EIL-7:3/Relationship/${string}`;
  readonly relationshipType: GovernanceRelationshipType;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceModelId: string;
  readonly targetModelId: string;
  readonly order: number;
  readonly resolvesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical phase ID. */
export const IntegrationGovernanceModelPhaseId = "EIL-7:3" as const;

/** Canonical model ID. */
export const IntegrationGovernanceModelCanonicalId =
  "EIL-7:3/IntegrationGovernanceModel" as const;

/** Human-readable model name. */
export const IntegrationGovernanceModelName =
  "Integration Governance Model" as const;

/** Semantic version. */
export const IntegrationGovernanceModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationGovernanceModelNamespace =
  "nexora.eil.integration-governance.model" as const;

/** Model status. */
export const IntegrationGovernanceModelStatusValue = "Model" as const;

/** Immediate next-phase readiness. */
export const IntegrationGovernanceModelReadiness =
  "ReadyForValidation" as const;

/**
 * Immutable identity for EIL-7:3 Integration Governance Model.
 */
export const IntegrationGovernanceModelIdentity = Object.freeze({
  phaseId: IntegrationGovernanceModelPhaseId,
  canonicalId: IntegrationGovernanceModelCanonicalId,
  name: IntegrationGovernanceModelName,
  version: IntegrationGovernanceModelVersion,
  namespace: IntegrationGovernanceModelNamespace,
  layer: "EIL" as const,
  platform: "EIL-7" as const,
  phaseType: "Model" as const,
  status: IntegrationGovernanceModelStatusValue,
  readiness: IntegrationGovernanceModelReadiness,
  registryDependency: IntegrationGovernanceRegistryCanonicalId,
  registryEntryPoint: "integrationGovernanceRegistry.ts" as const,
  description:
    "Canonical immutable architectural model converting Integration Governance Registry vocabularies into typed domain, contract, capability, policy, compliance, and lifecycle models.",
  metadataOnly: true as const,
  immutable: true as const,
});

/** Deterministic Registry-derived model anchors. */
const domains = IntegrationGovernanceDomainModels;
const contracts = IntegrationGovernanceContractModels;
const capabilities = IntegrationGovernanceCapabilityModels;
const policies = IntegrationGovernancePolicyModels;
const lifecycles = IntegrationGovernanceLifecycleModels;

const relationship = (
  key: string,
  relationshipType: GovernanceRelationshipType,
  canonicalName: string,
  description: string,
  sourceModelId: string,
  targetModelId: string,
  order: number,
): IntegrationGovernanceRelationshipModel =>
  Object.freeze({
    relationshipId: `EIL-7:3/Relationship/${key}` as const,
    relationshipType,
    canonicalKey: key,
    canonicalName,
    description,
    sourceModelId,
    targetModelId,
    order,
    resolvesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly ten architectural relationships covering every relationship type.
 * Descriptive metadata only — not counted in the canonical model inventory of 55.
 */
export const IntegrationGovernanceRelationshipModels: readonly IntegrationGovernanceRelationshipModel[] =
  Object.freeze([
    relationship(
      "GovernanceOwnsPolicies",
      "owns",
      "Governance → Policies",
      "Governance domain owns policies domain architectural metadata.",
      domains[9]!.modelId,
      domains[0]!.modelId,
      1,
    ),
    relationship(
      "PoliciesReferencesPolicyContract",
      "references",
      "Policies → PolicyContract",
      "Policies domain references policy contract model metadata.",
      domains[0]!.modelId,
      contracts[1]!.modelId,
      2,
    ),
    relationship(
      "PoliciesContainsArchitecturalPolicy",
      "contains",
      "Policies → ArchitecturalPolicy",
      "Policies domain contains architectural policy model metadata.",
      domains[0]!.modelId,
      policies[0]!.modelId,
      3,
    ),
    relationship(
      "ComplianceDependsOnPolicies",
      "dependsOn",
      "Compliance → Policies",
      "Compliance domain depends on policies domain metadata.",
      domains[1]!.modelId,
      domains[0]!.modelId,
      4,
    ),
    relationship(
      "AuditClassifiedAsAuditCapability",
      "classifiedAs",
      "Audit → AuditDefinition",
      "Audit domain is classified as audit definition capability metadata.",
      domains[6]!.modelId,
      capabilities[6]!.modelId,
      5,
    ),
    relationship(
      "RegisteredProgressesToModeled",
      "progressesTo",
      "Registered → Modeled",
      "Registered lifecycle progresses to Modeled lifecycle metadata.",
      lifecycles[1]!.modelId,
      lifecycles[2]!.modelId,
      6,
    ),
    relationship(
      "PoliciesGovernedByGovernance",
      "governedBy",
      "Policies → Governance",
      "Policies domain is governed by governance domain metadata.",
      domains[0]!.modelId,
      domains[9]!.modelId,
      7,
    ),
    relationship(
      "GovernanceValidatedByValidationLifecycle",
      "validatedBy",
      "GovernanceContract → Validated",
      "Governance contract is validated by Validated lifecycle metadata.",
      contracts[0]!.modelId,
      lifecycles[3]!.modelId,
      8,
    ),
    relationship(
      "GovernancePublishedByPublicIndex",
      "publishedBy",
      "Governance → PublicIndex",
      "Governance domain is published by PublicIndex lifecycle metadata.",
      domains[9]!.modelId,
      lifecycles[8]!.modelId,
      9,
    ),
    relationship(
      "ModelSourcedFromRegistry",
      "sourcedFrom",
      "Model → Registry",
      "Model aggregate is sourced from Registry aggregate metadata.",
      IntegrationGovernanceModelCanonicalId,
      IntegrationGovernanceRegistryIdentity.canonicalId,
      10,
    ),
  ]);

export const IntegrationGovernanceRelationshipTypes = Object.freeze([
  "owns",
  "references",
  "contains",
  "dependsOn",
  "classifiedAs",
  "progressesTo",
  "governedBy",
  "validatedBy",
  "publishedBy",
  "sourcedFrom",
] as const);

/**
 * Dynamically derived Model inventory (canonical model instances only).
 */
export const IntegrationGovernanceModelInventory = Object.freeze({
  inventoryId: "EIL-7:3/Inventory",
  domainCount: IntegrationGovernanceDomainModels.length,
  contractCount: IntegrationGovernanceContractModels.length,
  capabilityCount: IntegrationGovernanceCapabilityModels.length,
  policyCount: IntegrationGovernancePolicyModels.length,
  complianceCount: IntegrationGovernanceComplianceModels.length,
  lifecycleCount: IntegrationGovernanceLifecycleModels.length,
  relationshipCount: IntegrationGovernanceRelationshipModels.length,
  totalModelInstanceCount:
    IntegrationGovernanceDomainModels.length +
    IntegrationGovernanceContractModels.length +
    IntegrationGovernanceCapabilityModels.length +
    IntegrationGovernancePolicyModels.length +
    IntegrationGovernanceComplianceModels.length +
    IntegrationGovernanceLifecycleModels.length,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-7:3/Dependency/EIL72Registry",
  upstreamPhase: "EIL-7:2" as const,
  upstreamCanonicalId: IntegrationGovernanceRegistryCanonicalId,
  registryOnly: true as const,
  registryPublicSurfaceOnly: true as const,
  registryInternalImport: false as const,
  foundationDirectImport: false as const,
  laterEil7PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  directPreviousPhaseModule: "integrationGovernanceRegistry.ts" as const,
  packageEntry: "frontend/app/lib/eil/integrationGovernance" as const,
  canonicalPath:
    "EIL-7:3 → EIL-7:2 IntegrationGovernanceRegistry (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Integration Governance Model aggregate.
 */
export const IntegrationGovernanceModel = Object.freeze({
  identity: IntegrationGovernanceModelIdentity,
  domains: IntegrationGovernanceDomainModels,
  contracts: IntegrationGovernanceContractModels,
  capabilities: IntegrationGovernanceCapabilityModels,
  policies: IntegrationGovernancePolicyModels,
  compliance: IntegrationGovernanceComplianceModels,
  lifecycle: IntegrationGovernanceLifecycleModels,
  relationships: IntegrationGovernanceRelationshipModels,
  relationshipTypes: IntegrationGovernanceRelationshipTypes,
  inventory: IntegrationGovernanceModelInventory,
  readiness: IntegrationGovernanceModelReadiness,
  dependency,
  registryIdentity: IntegrationGovernanceRegistryIdentity,
  registry: IntegrationGovernanceRegistry,
  status: IntegrationGovernanceModelStatusValue,
  nextPhase: "EIL-7:4 — Integration Governance Validation",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  governanceEngine: false as const,
  policyEngine: false as const,
  complianceEngine: false as const,
  approvalWorkflow: false as const,
  auditRuntime: false as const,
  riskRuntime: false as const,
  versionManager: false as const,
  compatibilityResolver: false as const,
  dashboard: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  serviceBehavior: false as const,
  schedulingBehavior: false as const,
  queueBehavior: false as const,
  workerBehavior: false as const,
  apiBehavior: false as const,
  aiBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil7Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
