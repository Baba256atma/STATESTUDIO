/**
 * DKL-8:1 — Knowledge Governance Foundation.
 *
 * Immutable architectural foundation for governing organizational knowledge.
 * Consumes only the DKL-7 Knowledge Services Public Index.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by DKL-8:1.
 *
 * Public exports (exactly 8):
 *   KnowledgeGovernanceFoundationId
 *   KnowledgeGovernanceFoundationVersion
 *   KnowledgeGovernanceFoundationName
 *   KnowledgeGovernanceFoundationNamespace
 *   KnowledgeGovernanceFoundationStatus
 *   KnowledgeGovernanceFoundationReadiness
 *   KnowledgeGovernanceFoundationPlatform
 *   getKnowledgeGovernanceFoundationSummary()
 */

import {
  KnowledgeServicesPublicIndexId,
  KnowledgeServicesPublicIndexVersion,
} from "./knowledgeServicesPublicIndex.ts";
import { KnowledgeGovernanceBoundaries } from "./knowledgeGovernanceBoundaries.ts";
import {
  KnowledgeGovernanceAccessIntents,
  KnowledgeGovernanceClassificationPackage,
  KnowledgeGovernanceClassifications,
  KnowledgeGovernanceDispositions,
  KnowledgeGovernanceRetentions,
  KnowledgeGovernanceSensitivities,
} from "./knowledgeGovernanceClassification.ts";
import {
  KnowledgeGovernanceAuditIntents,
  KnowledgeGovernanceComplianceIntents,
  KnowledgeGovernanceContracts,
  KnowledgeGovernanceDecisionReferenceContract,
  KnowledgeGovernanceEvidenceKinds,
  KnowledgeGovernanceExceptionContract,
  KnowledgeGovernancePolicyReference,
  KnowledgeGovernanceSubjects,
  KnowledgeGovernanceUsagePolicy,
} from "./knowledgeGovernanceContracts.ts";
import type {
  KnowledgeGovernanceFoundationSummary,
  KnowledgeGovernanceIdentity,
} from "./knowledgeGovernanceFoundationTypes.ts";
import { KnowledgeGovernanceLifecycle } from "./knowledgeGovernanceLifecycle.ts";
import {
  KnowledgeGovernanceOwnership,
  KnowledgeGovernanceRoles,
} from "./knowledgeGovernanceOwnership.ts";

export const KnowledgeGovernanceFoundationId =
  "DKL-8:1/KnowledgeGovernanceFoundation" as const;

export const KnowledgeGovernanceFoundationName =
  "Knowledge Governance Foundation" as const;

export const KnowledgeGovernanceFoundationVersion = "1.0.0" as const;

export const KnowledgeGovernanceFoundationNamespace =
  "nexora.dkl.knowledge-governance.foundation" as const;

export const KnowledgeGovernanceFoundationStatus =
  "FoundationDefined" as const;

export const KnowledgeGovernanceFoundationReadiness =
  "ReadyForRegistry" as const;

const identity: KnowledgeGovernanceIdentity = Object.freeze({
  foundationId: KnowledgeGovernanceFoundationId,
  foundationName: KnowledgeGovernanceFoundationName,
  foundationVersion: KnowledgeGovernanceFoundationVersion,
  foundationNamespace: KnowledgeGovernanceFoundationNamespace,
  layer: "Data Knowledge Layer",
  phase: "DKL-8",
  stage: "Foundation",
  sourcePhase: "DKL-8:1",
  owner: "DKL-8 Knowledge Governance",
  status: KnowledgeGovernanceFoundationStatus,
  readiness: KnowledgeGovernanceFoundationReadiness,
  dkl7PublicIndexId: KnowledgeServicesPublicIndexId,
  dkl7PublicIndexVersion: KnowledgeServicesPublicIndexVersion,
  metadataOnly: true,
  immutable: true,
});

const dependency = Object.freeze({
  dependencyId: "DKL-8:1/Dependency/DKL7PublicIndex",
  directPreviousPhaseModule: "knowledgeServicesPublicIndex.ts" as const,
  dkl7PublicIndexOnly: true as const,
  publicIndexId: KnowledgeServicesPublicIndexId,
  publicIndexVersion: KnowledgeServicesPublicIndexVersion,
  dkl7InternalImport: false as const,
  dkl6DirectImport: false as const,
  dkl5DirectImport: false as const,
  dkl4DirectImport: false as const,
  dkl3DirectImport: false as const,
  dkl2DirectImport: false as const,
  dkl1DirectImport: false as const,
  reconstructsUpstream: false as const,
  canonicalPath:
    "DKL-8:1 → DKL-7 Public Index → DKL-7 Freeze → earlier certified DKL phases",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "subjects",
  "roles",
  "classification",
  "sensitivity",
  "accessIntent",
  "retention",
  "disposition",
  "audit",
  "compliance",
  "lifecycle",
  "evidence",
  "exceptions",
  "boundaries",
  "readiness",
] as const);

const foundationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
): Readonly<{
  id: string;
  exportName: string;
  phase: "DKL-8:1";
  section: "Foundation";
  kind: typeof kind;
  version: typeof KnowledgeGovernanceFoundationVersion;
  status: typeof KnowledgeGovernanceFoundationStatus;
  stability: "Stable";
  public: true;
  sourceReference: "knowledgeGovernanceFoundation.ts";
}> =>
  Object.freeze({
    id: `DKL-8:1/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-8:1" as const,
    section: "Foundation" as const,
    kind,
    version: KnowledgeGovernanceFoundationVersion,
    status: KnowledgeGovernanceFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "knowledgeGovernanceFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const KnowledgeGovernanceFoundationApiRegistry = Object.freeze([
  foundationApi("KnowledgeGovernanceFoundationId", "IdentityConstant"),
  foundationApi("KnowledgeGovernanceFoundationVersion", "IdentityConstant"),
  foundationApi("KnowledgeGovernanceFoundationName", "IdentityConstant"),
  foundationApi("KnowledgeGovernanceFoundationNamespace", "IdentityConstant"),
  foundationApi("KnowledgeGovernanceFoundationStatus", "MetadataConstant"),
  foundationApi("KnowledgeGovernanceFoundationReadiness", "MetadataConstant"),
  foundationApi("KnowledgeGovernanceFoundationPlatform", "Aggregate"),
  foundationApi("getKnowledgeGovernanceFoundationSummary", "Helper"),
]);

/**
 * Canonical immutable Knowledge Governance Foundation platform.
 * Seventeen ordered sections. Metadata only.
 */
export const KnowledgeGovernanceFoundationPlatform = Object.freeze({
  identity,
  dependency,
  contracts: KnowledgeGovernanceContracts,
  subjects: KnowledgeGovernanceSubjects,
  roles: KnowledgeGovernanceRoles,
  classification: KnowledgeGovernanceClassifications,
  sensitivity: KnowledgeGovernanceSensitivities,
  accessIntent: KnowledgeGovernanceAccessIntents,
  retention: KnowledgeGovernanceRetentions,
  disposition: KnowledgeGovernanceDispositions,
  audit: KnowledgeGovernanceAuditIntents,
  compliance: KnowledgeGovernanceComplianceIntents,
  lifecycle: KnowledgeGovernanceLifecycle,
  evidence: KnowledgeGovernanceEvidenceKinds,
  exceptions: Object.freeze([KnowledgeGovernanceExceptionContract]),
  boundaries: KnowledgeGovernanceBoundaries,
  readiness: KnowledgeGovernanceFoundationReadiness,
  apiRegistry: KnowledgeGovernanceFoundationApiRegistry,
  ownership: KnowledgeGovernanceOwnership,
  classificationPackage: KnowledgeGovernanceClassificationPackage,
  usagePolicy: KnowledgeGovernanceUsagePolicy,
  policyReference: KnowledgeGovernancePolicyReference,
  decisionReference: KnowledgeGovernanceDecisionReferenceContract,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: KnowledgeGovernanceFoundationStatus,
  nextPhase: "DKL-8:2 — Knowledge Governance Registry",
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

/** Deterministic frozen Knowledge Governance Foundation summary. */
export function getKnowledgeGovernanceFoundationSummary(): KnowledgeGovernanceFoundationSummary {
  return Object.freeze({
    foundationId: KnowledgeGovernanceFoundationId,
    version: KnowledgeGovernanceFoundationVersion,
    name: KnowledgeGovernanceFoundationName,
    namespace: KnowledgeGovernanceFoundationNamespace,
    status: KnowledgeGovernanceFoundationStatus,
    readiness: KnowledgeGovernanceFoundationReadiness,
    dkl7PublicIndexId: KnowledgeServicesPublicIndexId,
    contractCount: KnowledgeGovernanceContracts.length,
    subjectTypeCount: KnowledgeGovernanceSubjects.length,
    roleCount: KnowledgeGovernanceRoles.length,
    classificationCount: KnowledgeGovernanceClassifications.length,
    sensitivityCount: KnowledgeGovernanceSensitivities.length,
    accessIntentCount: KnowledgeGovernanceAccessIntents.length,
    retentionCount: KnowledgeGovernanceRetentions.length,
    dispositionCount: KnowledgeGovernanceDispositions.length,
    auditIntentCount: KnowledgeGovernanceAuditIntents.length,
    complianceIntentCount: KnowledgeGovernanceComplianceIntents.length,
    lifecycleStateCount: KnowledgeGovernanceLifecycle.stateCount,
    evidenceKindCount: KnowledgeGovernanceEvidenceKinds.length,
    exceptionContractCount: 1,
    ownsCount: KnowledgeGovernanceOwnership.ownsCount,
    doesNotOwnCount: KnowledgeGovernanceOwnership.doesNotOwnCount,
    prohibitedSurfaceCount: KnowledgeGovernanceBoundaries.prohibitedSurfaceCount,
    sectionCount: PLATFORM_SECTIONS.length,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
