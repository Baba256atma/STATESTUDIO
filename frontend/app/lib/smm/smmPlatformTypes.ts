/**
 * SMM-1 — Shared Mental Model Platform domain types.
 */

import type {
  SMM_EXTENSION_POINT_KEYS,
  SMM_MODEL_ARTIFACT_TYPE_KEYS,
  SMM_MODEL_CONTRACT_KEYS,
  SMM_MODEL_SCOPE_KEYS,
  SMM_PLATFORM_CONTRACT_VERSION,
} from "./smmPlatformContracts.ts";

export type SmmIdentifier = string;
export type SmmModelScopeKey = (typeof SMM_MODEL_SCOPE_KEYS)[number];
export type SmmModelArtifactTypeKey = (typeof SMM_MODEL_ARTIFACT_TYPE_KEYS)[number];
export type SmmModelContractKey = (typeof SMM_MODEL_CONTRACT_KEYS)[number];
export type SmmExtensionPointKey = (typeof SMM_EXTENSION_POINT_KEYS)[number];
export type SmmVersion = typeof SMM_PLATFORM_CONTRACT_VERSION | string;

export type SmmPlatformMetadata = Readonly<{
  metadataId: string;
  metadataVersion: typeof SMM_PLATFORM_CONTRACT_VERSION;
  owner: string;
  createdAt: string;
  readOnly: true;
}>;

export type SmmPlatformIdentity = Readonly<{
  layerId: "SMM";
  appId: "APP";
  title: typeof import("./smmPlatformContracts.ts").SMM_PLATFORM_NAME;
  platformId: typeof import("./smmPlatformContracts.ts").SMM_PLATFORM_ID;
  version: typeof SMM_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof import("./smmPlatformContracts.ts").SMM_PLATFORM_ARCHITECTURE_VERSION;
  contractVersion: typeof SMM_PLATFORM_CONTRACT_VERSION;
  compatibilityVersion: typeof import("./smmPlatformContracts.ts").SMM_PLATFORM_COMPATIBILITY_VERSION;
  mvpStatus: "active";
  releaseStage: "mvp-foundation";
  compatibilityLevel: "foundation";
  readOnly: true;
}>;

export type SmmPlatformBoundaries = Readonly<{
  owns: readonly string[];
  doesNotOwn: readonly string[];
  readOnly: true;
}>;

export type SmmModelScopeContract = Readonly<{
  scopeId: SmmIdentifier;
  scopeKey: SmmModelScopeKey;
  label: string;
  description: string;
  version: typeof SMM_PLATFORM_CONTRACT_VERSION;
  referenceOnly: true;
  metadata: SmmPlatformMetadata;
  readOnly: true;
}>;

export type SmmModelArtifactTypeContract = Readonly<{
  artifactTypeId: SmmIdentifier;
  artifactTypeKey: SmmModelArtifactTypeKey;
  label: string;
  description: string;
  version: typeof SMM_PLATFORM_CONTRACT_VERSION;
  declarativeOnly: true;
  metadata: SmmPlatformMetadata;
  readOnly: true;
}>;

export type SmmModelContract = Readonly<{
  contractId: SmmIdentifier;
  contractKey: SmmModelContractKey;
  label: string;
  description: string;
  version: typeof SMM_PLATFORM_CONTRACT_VERSION;
  interfaceOnly: true;
  metadata: SmmPlatformMetadata;
  readOnly: true;
}>;

export type SmmExtensionPoint = Readonly<{
  extensionPointId: SmmIdentifier;
  extensionPointKey: SmmExtensionPointKey;
  label: string;
  description: string;
  version: typeof SMM_PLATFORM_CONTRACT_VERSION;
  status: "reserved" | "registered";
  metadata: SmmPlatformMetadata;
  readOnly: true;
}>;

export type SmmPlatformRegistrySnapshot = Readonly<{
  scopeCount: number;
  artifactTypeCount: number;
  modelContractCount: number;
  extensionPointCount: number;
  readOnly: true;
}>;

export type SmmPlatformRegistry = Readonly<{
  scopes: readonly SmmModelScopeContract[];
  artifactTypes: readonly SmmModelArtifactTypeContract[];
  modelContracts: readonly SmmModelContract[];
  extensionPoints: readonly SmmExtensionPoint[];
  snapshot: SmmPlatformRegistrySnapshot;
  readOnly: true;
}>;

export type SmmPlatformVersionMetadata = Readonly<{
  platformVersion: typeof SMM_PLATFORM_CONTRACT_VERSION;
  contractVersion: typeof SMM_PLATFORM_CONTRACT_VERSION;
  compatibilityVersion: typeof import("./smmPlatformContracts.ts").SMM_PLATFORM_COMPATIBILITY_VERSION;
  architectureVersion: typeof import("./smmPlatformContracts.ts").SMM_PLATFORM_ARCHITECTURE_VERSION;
  migrationStrategyId: string;
  additiveOnly: true;
  readOnly: true;
}>;

export type SmmPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./smmPlatformContracts.ts").SMM_PLATFORM_ID;
  version: typeof SMM_PLATFORM_CONTRACT_VERSION;
  title: string;
  goal: string;
  lifecycle: "build";
  principles: readonly string[];
  publicApis: readonly string[];
  extensionPoints: readonly string[];
  modelScopeKeys: readonly string[];
  modelArtifactTypeKeys: readonly string[];
  readOnly: true;
}>;

export type SmmPlatformValidationIssue = Readonly<{
  code: string;
  message: string;
  readOnly: true;
}>;

export type SmmPlatformValidationReport = Readonly<{
  valid: boolean;
  issues: readonly SmmPlatformValidationIssue[];
  readOnly: true;
}>;

export type SmmPlatformState = Readonly<{
  platformId: typeof import("./smmPlatformContracts.ts").SMM_PLATFORM_ID;
  foundationVersion: typeof SMM_PLATFORM_CONTRACT_VERSION;
  contractVersion: typeof SMM_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  scopeCount: number;
  artifactTypeCount: number;
  modelContractCount: number;
  extensionPointCount: number;
  supportedScopes: readonly string[];
  supportedArtifactTypes: readonly string[];
  supportedModelContracts: readonly string[];
  supportedExtensionPoints: readonly string[];
  timestamp: string;
  readOnly: true;
}>;

export type SmmPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

/** Future model definition contract — interface only, no implementation. */
export type SmmModelDefinitionContract = Readonly<{
  contractKey: "model_definition";
  define: never;
  readOnly: true;
}>;

/** Future model reference shape — contract only. */
export type SmmModelReferenceContract = Readonly<{
  referenceId: SmmIdentifier;
  scopeKey: SmmModelScopeKey;
  artifactTypeKey: SmmModelArtifactTypeKey;
  contentRef: string;
  readOnly: true;
}>;

/** Future model snapshot shape — contract only. */
export type SmmModelSnapshotContract = Readonly<{
  snapshotId: SmmIdentifier;
  modelVersion: string;
  scopeKey: SmmModelScopeKey;
  payloadRef: string;
  readOnly: true;
}>;

/** Future model sync contract — interface only. */
export type SmmModelSyncContract = Readonly<{
  contractKey: "model_sync";
  synchronize: never;
  readOnly: true;
}>;
