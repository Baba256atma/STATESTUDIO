/**
 * SMM-8 — Platform identity, phase registry, and release metadata.
 */

import { SMM_EXTENSION_REGISTRY, SMM_PLATFORM_ID, SMM_PLATFORM_NAME } from "./smmPlatformContracts.ts";
import { SMM_PLATFORM_CONTRACT_VERSION, SMM_PUBLIC_API_REGISTRY } from "./smmPlatformContracts.ts";
import { SMM_DOMAIN_CONTRACT_VERSION, SMM_DOMAIN_PLATFORM_ID, SMM_DOMAIN_PUBLIC_API_REGISTRY } from "./sharedMentalModelContracts.ts";
import { SMM_GOVERNANCE_CONTRACT_VERSION, SMM_GOVERNANCE_PLATFORM_ID, SMM_GOVERNANCE_PUBLIC_API_REGISTRY } from "./sharedMentalModelGovernanceContracts.ts";
import { SMM_IDENTITY_CONTRACT_VERSION, SMM_IDENTITY_PLATFORM_ID, SMM_IDENTITY_PUBLIC_API_REGISTRY } from "./sharedMentalModelIdentityContracts.ts";
import { SMM_QUERY_CONTRACT_VERSION, SMM_QUERY_PLATFORM_ID, SMM_QUERY_PUBLIC_API_REGISTRY } from "./sharedMentalModelQueryContracts.ts";
import { SMM_SNAPSHOT_CONTRACT_VERSION, SMM_SNAPSHOT_PLATFORM_ID, SMM_SNAPSHOT_PUBLIC_API_REGISTRY } from "./sharedMentalModelSnapshotContracts.ts";
import { SMM_SYNC_CONTRACT_VERSION, SMM_SYNC_PLATFORM_ID, SMM_SYNC_PUBLIC_API_REGISTRY } from "./sharedMentalModelSynchronizationContracts.ts";
import type {
  SharedMentalModelPlatformExtensionRegistration,
  SharedMentalModelPlatformPhaseRegistration,
  SharedMentalModelPlatformRegistry,
} from "./sharedMentalModelPlatformFreezeTypes.ts";

export const SMM_PLATFORM_FREEZE_CONTRACT_VERSION = "SMM/8" as const;
export const SMM_PLATFORM_RELEASE_VERSION = "1.0.0-mvp" as const;
export const SMM_PLATFORM_FREEZE_VERSION = "SMM/8-freeze" as const;
export const SMM_PLATFORM_RELEASE_STAGE = "certified-frozen" as const;

export const SMM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY = Object.freeze([
  "runSharedMentalModelPlatformCertification",
  "runSharedMentalModelPlatformRegression",
  "buildSharedMentalModelPlatformManifest",
  "runSharedMentalModelPlatformFreeze",
  "SharedMentalModelPlatform",
] as const);

export const SMM_PLATFORM_FREEZE_PRINCIPLES = Object.freeze([
  "metadata_only_no_runtime_behavior",
  "consumes_smm_1_through_smm_7_only",
  "never_modifies_certified_phases",
  "regression_read_only",
  "freeze_mvp_contracts_immutably",
  "future_smm_extensions_additive_only",
] as const);

export const SMM_CERTIFIED_MVP_PHASE_KEYS = Object.freeze([
  "SMM/1",
  "SMM/2",
  "SMM/3",
  "SMM/4",
  "SMM/5",
  "SMM/6",
  "SMM/7",
] as const);

export const SMM_EXTENSION_POLICY = Object.freeze([
  "future_phases_extend_smm_8_additively",
  "no_breaking_changes_to_certified_phases",
  "runtime_engines_consume_frozen_contracts_only",
  "similarity_alignment_conflict_recommendation_out_of_scope",
  "smm_9_plus_reserved_for_execution_engines",
] as const);

const PHASE_DEFINITIONS = Object.freeze([
  Object.freeze({
    phaseId: "SMM/1",
    contractVersion: SMM_PLATFORM_CONTRACT_VERSION,
    platformId: SMM_PLATFORM_ID,
    title: "Platform Foundation",
    publicApis: SMM_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["smmPlatformContracts.ts", "smmPlatformExports.ts"]),
    buildLayerApi: "buildSmmPlatformFoundation",
  }),
  Object.freeze({
    phaseId: "SMM/2",
    contractVersion: SMM_DOMAIN_CONTRACT_VERSION,
    platformId: SMM_DOMAIN_PLATFORM_ID,
    title: "Domain Contracts",
    publicApis: SMM_DOMAIN_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["sharedMentalModelContracts.ts", "sharedMentalModelExports.ts"]),
    buildLayerApi: "buildSharedMentalModelContracts",
  }),
  Object.freeze({
    phaseId: "SMM/3",
    contractVersion: SMM_IDENTITY_CONTRACT_VERSION,
    platformId: SMM_IDENTITY_PLATFORM_ID,
    title: "Registry & Identity Engine",
    publicApis: SMM_IDENTITY_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["sharedMentalModelIdentityContracts.ts", "sharedMentalModelIdentityExports.ts"]),
    buildLayerApi: "buildSharedMentalModelRegistry",
  }),
  Object.freeze({
    phaseId: "SMM/4",
    contractVersion: SMM_SNAPSHOT_CONTRACT_VERSION,
    platformId: SMM_SNAPSHOT_PLATFORM_ID,
    title: "Snapshot & Version Platform",
    publicApis: SMM_SNAPSHOT_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["sharedMentalModelSnapshotContracts.ts", "sharedMentalModelSnapshotExports.ts"]),
    buildLayerApi: "buildSharedMentalModelSnapshotPlatform",
  }),
  Object.freeze({
    phaseId: "SMM/5",
    contractVersion: SMM_SYNC_CONTRACT_VERSION,
    platformId: SMM_SYNC_PLATFORM_ID,
    title: "Synchronization Platform",
    publicApis: SMM_SYNC_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["sharedMentalModelSynchronizationContracts.ts", "sharedMentalModelSynchronizationExports.ts"]),
    buildLayerApi: "buildSharedMentalModelSynchronizationPlatform",
  }),
  Object.freeze({
    phaseId: "SMM/6",
    contractVersion: SMM_QUERY_CONTRACT_VERSION,
    platformId: SMM_QUERY_PLATFORM_ID,
    title: "Query & Read Model Platform",
    publicApis: SMM_QUERY_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["sharedMentalModelQueryContracts.ts", "sharedMentalModelQueryExports.ts"]),
    buildLayerApi: "buildSharedMentalModelQueryPlatform",
  }),
  Object.freeze({
    phaseId: "SMM/7",
    contractVersion: SMM_GOVERNANCE_CONTRACT_VERSION,
    platformId: SMM_GOVERNANCE_PLATFORM_ID,
    title: "Governance Platform",
    publicApis: SMM_GOVERNANCE_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["sharedMentalModelGovernanceContracts.ts", "sharedMentalModelGovernanceExports.ts"]),
    buildLayerApi: "buildSharedMentalModelGovernancePlatform",
  }),
] as const);

const CERTIFIED_EXTENSION_STATUS = Object.freeze({
  model_builder: "reserved",
  model_registry: "certified",
  model_validation: "reserved",
  model_sync: "certified",
  model_query: "certified",
  model_governance: "certified",
  model_integration: "reserved",
  model_certification: "certified",
} as const);

export function getSharedMentalModelCertifiedPhaseRegistrations(): readonly SharedMentalModelPlatformPhaseRegistration[] {
  return Object.freeze(
    PHASE_DEFINITIONS.map((phase) =>
      Object.freeze({
        ...phase,
        readOnly: true as const,
      })
    )
  );
}

export function getSharedMentalModelPlatformExtensionRegistry(): readonly SharedMentalModelPlatformExtensionRegistration[] {
  return Object.freeze(
    SMM_EXTENSION_REGISTRY.map((entry) =>
      Object.freeze({
        extensionId: entry.extensionId,
        label: entry.label,
        phaseKey: entry.phaseKey,
        status: CERTIFIED_EXTENSION_STATUS[entry.phaseKey as keyof typeof CERTIFIED_EXTENSION_STATUS] ?? "reserved",
        readOnly: true as const,
      })
    )
  );
}

export function getSharedMentalModelPlatformPublicApiRegistry(): readonly string[] {
  const apis = PHASE_DEFINITIONS.flatMap((phase) => [...phase.publicApis]);
  return Object.freeze([...new Set(apis)]);
}

export function getSharedMentalModelPlatformRegistry(): SharedMentalModelPlatformRegistry {
  const certifiedPhases = getSharedMentalModelCertifiedPhaseRegistrations();
  return Object.freeze({
    platformId: SMM_PLATFORM_ID,
    platformName: SMM_PLATFORM_NAME,
    contractVersion: SMM_PLATFORM_FREEZE_CONTRACT_VERSION,
    releaseVersion: SMM_PLATFORM_RELEASE_VERSION,
    freezeVersion: SMM_PLATFORM_FREEZE_VERSION,
    releaseStage: SMM_PLATFORM_RELEASE_STAGE,
    certifiedPhases,
    phaseCount: certifiedPhases.length,
    publicApis: getSharedMentalModelPlatformPublicApiRegistry(),
    extensionPoints: getSharedMentalModelPlatformExtensionRegistry(),
    readOnly: true as const,
  });
}

export function getSharedMentalModelCertifiedPhaseById(phaseId: string): SharedMentalModelPlatformPhaseRegistration | null {
  return getSharedMentalModelCertifiedPhaseRegistrations().find((phase) => phase.phaseId === phaseId) ?? null;
}
