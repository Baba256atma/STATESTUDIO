/**
 * SMM-2 — Shared Mental Model Domain types (interface-only).
 */

import type { SmmModelScopeKey } from "./smmPlatformTypes.ts";
import type {
  SMM_DOMAIN_ARTIFACT_KEYS,
  SMM_DOMAIN_CONTRACT_VERSION,
  SMM_DOMAIN_MODEL_KEYS,
  SMM_DOMAIN_REGISTRY_KEYS,
  SMM_DOMAIN_VIEW_KEYS,
} from "./sharedMentalModelContracts.ts";

export type SharedMentalModelDomainKey = (typeof SMM_DOMAIN_MODEL_KEYS)[number];
export type SharedMentalModelViewKey = (typeof SMM_DOMAIN_VIEW_KEYS)[number];
export type SharedMentalModelArtifactKey = (typeof SMM_DOMAIN_ARTIFACT_KEYS)[number];
export type SharedMentalModelRegistryKey = (typeof SMM_DOMAIN_REGISTRY_KEYS)[number];

export type SharedModelMetadata = Readonly<{
  metadataId: string;
  contractVersion: typeof SMM_DOMAIN_CONTRACT_VERSION;
  foundationVersion: typeof import("./sharedMentalModelContracts.ts").SMM_DOMAIN_FOUNDATION_DEPENDENCY;
  label: string;
  tags: readonly string[];
  createdAt: string;
  readOnly: true;
}>;

export type SharedMentalModel = Readonly<{
  modelId: string;
  modelVersion: string;
  scopeKey: SmmModelScopeKey;
  label: string;
  description: string;
  contentRef: string;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedBelief = Readonly<{
  beliefId: string;
  modelId: string;
  statementRef: string;
  confidenceRef: string;
  scopeKey: SmmModelScopeKey;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedAssumption = Readonly<{
  assumptionId: string;
  modelId: string;
  statementRef: string;
  scopeKey: SmmModelScopeKey;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedConstraint = Readonly<{
  constraintId: string;
  modelId: string;
  ruleRef: string;
  scopeKey: SmmModelScopeKey;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedPerspective = Readonly<{
  perspectiveId: string;
  modelId: string;
  viewpointRef: string;
  scopeKey: SmmModelScopeKey;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedNarrative = Readonly<{
  narrativeId: string;
  modelId: string;
  storyRef: string;
  scopeKey: SmmModelScopeKey;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedExecutiveView = Readonly<{
  viewId: string;
  modelId: string;
  executiveRef: string;
  summaryRef: string;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedOrganizationView = Readonly<{
  viewId: string;
  modelId: string;
  organizationRef: string;
  summaryRef: string;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedWorkspaceView = Readonly<{
  viewId: string;
  modelId: string;
  workspaceRef: string;
  summaryRef: string;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedScenarioView = Readonly<{
  viewId: string;
  modelId: string;
  scenarioRef: string;
  summaryRef: string;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedModelSnapshot = Readonly<{
  snapshotId: string;
  modelId: string;
  modelVersion: string;
  payloadRef: string;
  capturedAt: string;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedModelReference = Readonly<{
  referenceId: string;
  modelId: string;
  targetRef: string;
  scopeKey: SmmModelScopeKey;
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedModelVersion = Readonly<{
  versionId: string;
  modelId: string;
  versionLabel: string;
  compatibility: readonly string[];
  metadata: SharedModelMetadata;
  readOnly: true;
}>;

export type SharedMentalModelDomainRegistration = Readonly<{
  domainId: string;
  domainKey: SharedMentalModelDomainKey;
  label: string;
  description: string;
  contractVersion: typeof SMM_DOMAIN_CONTRACT_VERSION;
  foundationVersion: typeof import("./sharedMentalModelContracts.ts").SMM_DOMAIN_FOUNDATION_DEPENDENCY;
  mandatoryFields: readonly string[];
  interfaceOnly: true;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelContractRegistration = Readonly<{
  contractId: string;
  domainKey: SharedMentalModelDomainKey;
  contractVersion: typeof SMM_DOMAIN_CONTRACT_VERSION;
  label: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelArtifactRegistration = Readonly<{
  artifactId: string;
  artifactKey: SharedMentalModelArtifactKey;
  domainKey: SharedMentalModelDomainKey;
  contractVersion: typeof SMM_DOMAIN_CONTRACT_VERSION;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelVersionRegistration = Readonly<{
  versionEntryId: string;
  modelVersion: string;
  contractVersion: typeof SMM_DOMAIN_CONTRACT_VERSION;
  foundationVersion: typeof import("./sharedMentalModelContracts.ts").SMM_DOMAIN_FOUNDATION_DEPENDENCY;
  compatibility: readonly string[];
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelExtensionRegistration = Readonly<{
  extensionId: string;
  extensionPointKey: string;
  domainKey: SharedMentalModelDomainKey;
  contractVersion: typeof SMM_DOMAIN_CONTRACT_VERSION;
  compatible: true;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelContractRegistry = Readonly<{
  domainRegistry: readonly SharedMentalModelDomainRegistration[];
  domainCount: number;
  contractRegistry: readonly SharedMentalModelContractRegistration[];
  contractCount: number;
  artifactRegistry: readonly SharedMentalModelArtifactRegistration[];
  artifactCount: number;
  versionRegistry: readonly SharedMentalModelVersionRegistration[];
  versionCount: number;
  extensionRegistry: readonly SharedMentalModelExtensionRegistration[];
  extensionCount: number;
  readOnly: true;
}>;

export type SharedMentalModelManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./sharedMentalModelContracts.ts").SMM_DOMAIN_PLATFORM_ID;
  version: typeof SMM_DOMAIN_CONTRACT_VERSION;
  title: typeof import("./sharedMentalModelContracts.ts").SMM_DOMAIN_PLATFORM_NAME;
  goal: string;
  domainModelKeys: readonly string[];
  publicApis: readonly string[];
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type SharedMentalModelValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type SharedMentalModelValidationReport = Readonly<{
  valid: boolean;
  issues: readonly SharedMentalModelValidationIssue[];
  readOnly: true;
}>;

export type SharedMentalModelLayerState = Readonly<{
  contractVersion: typeof SMM_DOMAIN_CONTRACT_VERSION;
  foundationDependency: typeof import("./sharedMentalModelContracts.ts").SMM_DOMAIN_FOUNDATION_DEPENDENCY;
  initialized: boolean;
  registry: SharedMentalModelContractRegistry;
  timestamp: string;
  readOnly: true;
}>;

export type SharedMentalModelBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: SharedMentalModelLayerState | null;
  readOnly: true;
}>;

export type SharedMentalModelDomainEntity =
  | SharedMentalModel
  | SharedBelief
  | SharedAssumption
  | SharedConstraint
  | SharedPerspective
  | SharedNarrative
  | SharedExecutiveView
  | SharedOrganizationView
  | SharedWorkspaceView
  | SharedScenarioView
  | SharedModelSnapshot
  | SharedModelReference
  | SharedModelVersion
  | SharedModelMetadata;
