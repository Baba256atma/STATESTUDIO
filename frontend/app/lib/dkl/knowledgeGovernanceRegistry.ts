/**
 * DKL-8:2 — Knowledge Governance Registry.
 *
 * Canonical immutable registry for Knowledge Governance concepts declared by
 * DKL-8:1. Consumes only the DKL-8:1 Foundation public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by DKL-8:2.
 *
 * Public exports (exactly 8):
 *   KnowledgeGovernanceRegistryId
 *   KnowledgeGovernanceRegistryVersion
 *   KnowledgeGovernanceRegistryName
 *   KnowledgeGovernanceRegistryNamespace
 *   KnowledgeGovernanceRegistryStatus
 *   KnowledgeGovernanceRegistryReadiness
 *   KnowledgeGovernanceRegistryPlatform
 *   getKnowledgeGovernanceRegistrySummary()
 */

import {
  KnowledgeGovernanceFoundationId,
  KnowledgeGovernanceFoundationPlatform,
  KnowledgeGovernanceFoundationVersion,
} from "./knowledgeGovernanceFoundation.ts";
import {
  KnowledgeGovernanceBoundaryRegistry,
  KnowledgeGovernanceNonOwnershipRegistry,
  KnowledgeGovernanceOwnershipRegistry,
  KnowledgeGovernanceProhibitedSurfaceRegistry,
  KnowledgeGovernanceRegistryCatalogMeta,
} from "./knowledgeGovernanceRegistryCatalog.ts";
import {
  KnowledgeGovernanceLifecycleRegistry,
  KnowledgeGovernanceLifecycleStateRegistry,
  KnowledgeGovernanceLifecycleTransitionRegistry,
} from "./knowledgeGovernanceLifecycleRegistry.ts";
import {
  KnowledgeGovernanceAccessIntentRegistry,
  KnowledgeGovernanceAuditIntentRegistry,
  KnowledgeGovernanceClassificationRegistry,
  KnowledgeGovernanceComplianceIntentRegistry,
  KnowledgeGovernanceDecisionReferenceKindRegistry,
  KnowledgeGovernanceDispositionRegistry,
  KnowledgeGovernanceEvidenceKindRegistry,
  KnowledgeGovernanceExceptionCategoryRegistry,
  KnowledgeGovernancePolicyReferenceKindRegistry,
  KnowledgeGovernanceRetentionRegistry,
  KnowledgeGovernanceSensitivityRegistry,
  KnowledgeGovernanceUsagePolicyRegistry,
} from "./knowledgeGovernancePolicyRegistry.ts";
import {
  KnowledgeGovernanceCapabilityRegistry,
  KnowledgeGovernanceRoleRegistry,
} from "./knowledgeGovernanceRoleRegistry.ts";
import {
  KnowledgeGovernanceContractRegistry,
  KnowledgeGovernanceSubjectRegistry,
} from "./knowledgeGovernanceSubjectRegistry.ts";
import type {
  KnowledgeGovernanceRegistryEntryBase,
  KnowledgeGovernanceRegistrySummary,
} from "./knowledgeGovernanceRegistryTypes.ts";

export const KnowledgeGovernanceRegistryId =
  "DKL-8:2/KnowledgeGovernanceRegistry" as const;

export const KnowledgeGovernanceRegistryName =
  "Knowledge Governance Registry" as const;

export const KnowledgeGovernanceRegistryVersion = "1.0.0" as const;

export const KnowledgeGovernanceRegistryNamespace =
  "nexora.dkl.knowledge-governance.registry" as const;

export const KnowledgeGovernanceRegistryStatus = "RegistryDefined" as const;

export const KnowledgeGovernanceRegistryReadiness = "ReadyForModel" as const;

const findById = <T extends KnowledgeGovernanceRegistryEntryBase>(
  collection: readonly T[],
  id: string,
): T | undefined => collection.find((item) => item.id === id);

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "subjects",
  "contracts",
  "roles",
  "capabilities",
  "classifications",
  "sensitivities",
  "accessIntents",
  "usagePolicies",
  "retentionIntents",
  "dispositionIntents",
  "auditIntents",
  "complianceIntents",
  "lifecycleStates",
  "lifecycleTransitions",
  "evidenceKinds",
  "exceptionCategories",
  "policyReferenceKinds",
  "decisionReferenceKinds",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const totalEntryCount =
  KnowledgeGovernanceSubjectRegistry.length +
  KnowledgeGovernanceContractRegistry.length +
  KnowledgeGovernanceRoleRegistry.length +
  KnowledgeGovernanceCapabilityRegistry.length +
  KnowledgeGovernanceClassificationRegistry.length +
  KnowledgeGovernanceSensitivityRegistry.length +
  KnowledgeGovernanceAccessIntentRegistry.length +
  KnowledgeGovernanceUsagePolicyRegistry.length +
  KnowledgeGovernanceRetentionRegistry.length +
  KnowledgeGovernanceDispositionRegistry.length +
  KnowledgeGovernanceAuditIntentRegistry.length +
  KnowledgeGovernanceComplianceIntentRegistry.length +
  KnowledgeGovernanceLifecycleStateRegistry.length +
  KnowledgeGovernanceLifecycleTransitionRegistry.length +
  KnowledgeGovernanceEvidenceKindRegistry.length +
  KnowledgeGovernanceExceptionCategoryRegistry.length +
  KnowledgeGovernancePolicyReferenceKindRegistry.length +
  KnowledgeGovernanceDecisionReferenceKindRegistry.length +
  KnowledgeGovernanceOwnershipRegistry.length +
  KnowledgeGovernanceNonOwnershipRegistry.length +
  KnowledgeGovernanceBoundaryRegistry.length;

const lookups = Object.freeze({
  getKnowledgeGovernanceSubjectById: (id: string) =>
    findById(KnowledgeGovernanceSubjectRegistry, id),
  getKnowledgeGovernanceRoleById: (id: string) =>
    findById(KnowledgeGovernanceRoleRegistry, id),
  getKnowledgeGovernanceCapabilityById: (id: string) =>
    findById(KnowledgeGovernanceCapabilityRegistry, id),
  getKnowledgeClassificationById: (id: string) =>
    findById(KnowledgeGovernanceClassificationRegistry, id),
  getKnowledgeSensitivityById: (id: string) =>
    findById(KnowledgeGovernanceSensitivityRegistry, id),
  getKnowledgeAccessIntentById: (id: string) =>
    findById(KnowledgeGovernanceAccessIntentRegistry, id),
  getKnowledgeRetentionIntentById: (id: string) =>
    findById(KnowledgeGovernanceRetentionRegistry, id),
  getKnowledgeDispositionIntentById: (id: string) =>
    findById(KnowledgeGovernanceDispositionRegistry, id),
  getKnowledgeGovernanceLifecycleStateById: (id: string) =>
    findById(KnowledgeGovernanceLifecycleStateRegistry, id),
  getKnowledgeGovernanceEvidenceKindById: (id: string) =>
    findById(KnowledgeGovernanceEvidenceKindRegistry, id),
  getKnowledgeGovernanceRegistryEntryCount: () => totalEntryCount,
});

const identity = Object.freeze({
  registryId: KnowledgeGovernanceRegistryId,
  registryName: KnowledgeGovernanceRegistryName,
  registryVersion: KnowledgeGovernanceRegistryVersion,
  registryNamespace: KnowledgeGovernanceRegistryNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-8" as const,
  stage: "Registry" as const,
  sourcePhase: "DKL-8:2" as const,
  owner: "DKL-8 Knowledge Governance",
  status: KnowledgeGovernanceRegistryStatus,
  readiness: KnowledgeGovernanceRegistryReadiness,
  foundationId: KnowledgeGovernanceFoundationId,
  foundationVersion: KnowledgeGovernanceFoundationVersion,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-8:2/Dependency/DKL81Foundation",
  directPreviousPhaseModule: "knowledgeGovernanceFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: KnowledgeGovernanceFoundationId,
  foundationVersion: KnowledgeGovernanceFoundationVersion,
  dkl7DirectImport: false as const,
  dkl6DirectImport: false as const,
  dkl5DirectImport: false as const,
  dkl4DirectImport: false as const,
  dkl3DirectImport: false as const,
  dkl2DirectImport: false as const,
  dkl1DirectImport: false as const,
  reconstructsFoundation: false as const,
  canonicalPath: "DKL-8:2 → DKL-8:1 Foundation → DKL-7 Public Index",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const registryApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
): Readonly<{
  id: string;
  exportName: string;
  phase: "DKL-8:2";
  section: "Registry";
  kind: typeof kind;
  version: typeof KnowledgeGovernanceRegistryVersion;
  status: typeof KnowledgeGovernanceRegistryStatus;
  stability: "Stable";
  public: true;
  sourceReference: "knowledgeGovernanceRegistry.ts";
}> =>
  Object.freeze({
    id: `DKL-8:2/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-8:2" as const,
    section: "Registry" as const,
    kind,
    version: KnowledgeGovernanceRegistryVersion,
    status: KnowledgeGovernanceRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "knowledgeGovernanceRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const KnowledgeGovernanceRegistryApiRegistry = Object.freeze([
  registryApi("KnowledgeGovernanceRegistryId", "IdentityConstant"),
  registryApi("KnowledgeGovernanceRegistryVersion", "IdentityConstant"),
  registryApi("KnowledgeGovernanceRegistryName", "IdentityConstant"),
  registryApi("KnowledgeGovernanceRegistryNamespace", "IdentityConstant"),
  registryApi("KnowledgeGovernanceRegistryStatus", "MetadataConstant"),
  registryApi("KnowledgeGovernanceRegistryReadiness", "MetadataConstant"),
  registryApi("KnowledgeGovernanceRegistryPlatform", "Aggregate"),
  registryApi("getKnowledgeGovernanceRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Knowledge Governance Registry platform.
 * Collections preserved by reference. Lookups are pure and metadata-only.
 */
export const KnowledgeGovernanceRegistryPlatform = Object.freeze({
  identity,
  dependency,
  subjects: KnowledgeGovernanceSubjectRegistry,
  contracts: KnowledgeGovernanceContractRegistry,
  roles: KnowledgeGovernanceRoleRegistry,
  capabilities: KnowledgeGovernanceCapabilityRegistry,
  classifications: KnowledgeGovernanceClassificationRegistry,
  sensitivities: KnowledgeGovernanceSensitivityRegistry,
  accessIntents: KnowledgeGovernanceAccessIntentRegistry,
  usagePolicies: KnowledgeGovernanceUsagePolicyRegistry,
  retentionIntents: KnowledgeGovernanceRetentionRegistry,
  dispositionIntents: KnowledgeGovernanceDispositionRegistry,
  auditIntents: KnowledgeGovernanceAuditIntentRegistry,
  complianceIntents: KnowledgeGovernanceComplianceIntentRegistry,
  lifecycleStates: KnowledgeGovernanceLifecycleStateRegistry,
  lifecycleTransitions: KnowledgeGovernanceLifecycleTransitionRegistry,
  evidenceKinds: KnowledgeGovernanceEvidenceKindRegistry,
  exceptionCategories: KnowledgeGovernanceExceptionCategoryRegistry,
  policyReferenceKinds: KnowledgeGovernancePolicyReferenceKindRegistry,
  decisionReferenceKinds: KnowledgeGovernanceDecisionReferenceKindRegistry,
  ownership: Object.freeze({
    owns: KnowledgeGovernanceOwnershipRegistry,
    doesNotOwn: KnowledgeGovernanceNonOwnershipRegistry,
    ownsCount: KnowledgeGovernanceOwnershipRegistry.length,
    doesNotOwnCount: KnowledgeGovernanceNonOwnershipRegistry.length,
  }),
  boundaries: Object.freeze({
    ownershipBoundaries: KnowledgeGovernanceBoundaryRegistry,
    prohibitedSurfaces: KnowledgeGovernanceProhibitedSurfaceRegistry,
    foundationBoundaries: KnowledgeGovernanceFoundationPlatform.boundaries,
    runtimeEnforcement: false as const,
  }),
  readiness: KnowledgeGovernanceRegistryReadiness,
  apiRegistry: KnowledgeGovernanceRegistryApiRegistry,
  lifecycle: KnowledgeGovernanceLifecycleRegistry,
  catalog: KnowledgeGovernanceRegistryCatalogMeta,
  lookups,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  totalEntryCount,
  status: KnowledgeGovernanceRegistryStatus,
  nextPhase: "DKL-8:3 — Knowledge Governance Model",
  foundation: KnowledgeGovernanceFoundationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  policyExecution: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  engineReasoning: false as const,
  advisorBehavior: false as const,
  sceneBehavior: false as const,
  uiBehavior: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Knowledge Governance Registry summary. */
export function getKnowledgeGovernanceRegistrySummary(): KnowledgeGovernanceRegistrySummary {
  return Object.freeze({
    registryId: KnowledgeGovernanceRegistryId,
    version: KnowledgeGovernanceRegistryVersion,
    name: KnowledgeGovernanceRegistryName,
    namespace: KnowledgeGovernanceRegistryNamespace,
    status: KnowledgeGovernanceRegistryStatus,
    readiness: KnowledgeGovernanceRegistryReadiness,
    foundationId: KnowledgeGovernanceFoundationId,
    subjectCount: KnowledgeGovernanceSubjectRegistry.length,
    contractCount: KnowledgeGovernanceContractRegistry.length,
    roleCount: KnowledgeGovernanceRoleRegistry.length,
    capabilityCount: KnowledgeGovernanceCapabilityRegistry.length,
    classificationCount: KnowledgeGovernanceClassificationRegistry.length,
    sensitivityCount: KnowledgeGovernanceSensitivityRegistry.length,
    accessIntentCount: KnowledgeGovernanceAccessIntentRegistry.length,
    usagePolicyCount: KnowledgeGovernanceUsagePolicyRegistry.length,
    retentionCount: KnowledgeGovernanceRetentionRegistry.length,
    dispositionCount: KnowledgeGovernanceDispositionRegistry.length,
    auditIntentCount: KnowledgeGovernanceAuditIntentRegistry.length,
    complianceIntentCount: KnowledgeGovernanceComplianceIntentRegistry.length,
    lifecycleStateCount: KnowledgeGovernanceLifecycleStateRegistry.length,
    lifecycleTransitionCount:
      KnowledgeGovernanceLifecycleTransitionRegistry.length,
    evidenceKindCount: KnowledgeGovernanceEvidenceKindRegistry.length,
    exceptionCategoryCount: KnowledgeGovernanceExceptionCategoryRegistry.length,
    policyReferenceKindCount:
      KnowledgeGovernancePolicyReferenceKindRegistry.length,
    decisionReferenceKindCount:
      KnowledgeGovernanceDecisionReferenceKindRegistry.length,
    ownershipDeclarationCount:
      KnowledgeGovernanceOwnershipRegistry.length +
      KnowledgeGovernanceNonOwnershipRegistry.length,
    boundaryCount: KnowledgeGovernanceBoundaryRegistry.length,
    totalEntryCount,
    sectionCount: PLATFORM_SECTIONS.length,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
