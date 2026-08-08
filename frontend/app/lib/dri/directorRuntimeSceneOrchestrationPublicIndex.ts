/** DRI-3:9 — sole consumer entry for the frozen DRI-3 Scene Orchestration platform. */

import {
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_ATTENTION_LEVELS,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_ATTENTION_ORDER,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_CERTIFICATION_DECISIONS,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_CERTIFICATION_STATUSES,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_OPERATION_KINDS,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_OPERATION_ORDER,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_CAPABILITIES,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_ELIGIBILITY_VALUES,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_GUARANTEES,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_STATUSES,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_VALIDATION_SEVERITIES,
  DIRECTOR_SCENE_ORCHESTRATION_FROZEN_VALIDATION_STATUSES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CHARACTERISTICS,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_STATUSES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_TARGETS,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_PUBLICATION_PHASES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_REQUIREMENT_IDS,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES,
  directorRuntimeSceneOrchestrationFreeze,
  directorRuntimeSceneOrchestrationFreezeCompatibility,
  directorRuntimeSceneOrchestrationFreezeGuarantees,
  directorRuntimeSceneOrchestrationFreezeIdentity,
  directorRuntimeSceneOrchestrationFreezeManifest,
  directorRuntimeSceneOrchestrationFrozenFunctionalApiNames,
  directorRuntimeSceneOrchestrationFrozenIdentityChain,
  directorRuntimeSceneOrchestrationFrozenPublicApiSurface,
  directorRuntimeSceneOrchestrationFrozenPublicTypeNames,
  directorRuntimeSceneOrchestrationLock,
  directorRuntimeSceneOrchestrationPlatform,
  directorRuntimeSceneOrchestrationPlatformApiNames,
  directorRuntimeSceneOrchestrationPlatformConcepts,
  directorRuntimeSceneOrchestrationPlatformIdentity,
  directorRuntimeSceneOrchestrationPlatformNamespace,
  directorRuntimeSceneOrchestrationPlatformPredicateNames,
  directorRuntimeSceneOrchestrationPlatformRegistry,
  directorRuntimeSceneOrchestrationPlatformUpstream,
  directorRuntimeSceneOrchestrationPlatformVersion,
  directorSceneOrchestrationPlatformConsumerContract,
  directorSceneOrchestrationPlatformIdentityValue,
  directorSceneOrchestrationPlatformRequirements,
  isDirectorSceneOrchestrationPlatformEligible,
  isPublishedDirectorSceneOrchestrationPlatformResult,
  publishDirectorRuntimeSceneOrchestrationPlatform,
  verifyDirectorRuntimeSceneOrchestrationFreeze,
  type DirectorSceneOrchestrationCertificationCondition,
  type DirectorSceneOrchestrationCertificationRecord,
  type DirectorSceneOrchestrationPlan,
  type DirectorSceneOrchestrationPlatformCapability,
  type DirectorSceneOrchestrationPlatformCompatibilityEntry,
  type DirectorSceneOrchestrationPlatformConsumerContract,
  type DirectorSceneOrchestrationPlatformEligibility,
  type DirectorSceneOrchestrationPlatformGuarantee,
  type DirectorSceneOrchestrationPlatformInput,
  type DirectorSceneOrchestrationPlatformManifest,
  type DirectorSceneOrchestrationPlatformReason,
  type DirectorSceneOrchestrationPlatformResult,
  type DirectorSceneOrchestrationPlatformStatus,
} from "@/app/lib/dri/directorRuntimeSceneOrchestrationFreeze";

/** Exact DRI-3:8-approved publication. Do not wrap or rename these symbols. */
export {
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CAPABILITIES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CHARACTERISTICS,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_STATUSES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_TARGETS,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_ELIGIBILITY_VALUES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_GUARANTEES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_PUBLICATION_PHASES,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_REQUIREMENT_IDS,
  DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_STATUSES,
  directorRuntimeSceneOrchestrationPlatform,
  directorRuntimeSceneOrchestrationPlatformApiNames,
  directorRuntimeSceneOrchestrationPlatformConcepts,
  directorRuntimeSceneOrchestrationPlatformIdentity,
  directorRuntimeSceneOrchestrationPlatformNamespace,
  directorRuntimeSceneOrchestrationPlatformPredicateNames,
  directorRuntimeSceneOrchestrationPlatformRegistry,
  directorRuntimeSceneOrchestrationPlatformUpstream,
  directorRuntimeSceneOrchestrationPlatformVersion,
  directorSceneOrchestrationPlatformConsumerContract,
  directorSceneOrchestrationPlatformIdentityValue,
  directorSceneOrchestrationPlatformRequirements,
  isDirectorSceneOrchestrationPlatformEligible,
  isPublishedDirectorSceneOrchestrationPlatformResult,
  publishDirectorRuntimeSceneOrchestrationPlatform,
};
export type {
  DirectorSceneOrchestrationCertificationCondition,
  DirectorSceneOrchestrationCertificationRecord,
  DirectorSceneOrchestrationPlan,
  DirectorSceneOrchestrationPlatformCapability,
  DirectorSceneOrchestrationPlatformCompatibilityEntry,
  DirectorSceneOrchestrationPlatformConsumerContract,
  DirectorSceneOrchestrationPlatformEligibility,
  DirectorSceneOrchestrationPlatformGuarantee,
  DirectorSceneOrchestrationPlatformInput,
  DirectorSceneOrchestrationPlatformManifest,
  DirectorSceneOrchestrationPlatformReason,
  DirectorSceneOrchestrationPlatformResult,
  DirectorSceneOrchestrationPlatformStatus,
};

export const directorRuntimeSceneOrchestrationPublicIndexIdentity =
  "DRI-3:9/DirectorRuntimeSceneOrchestrationPublicIndex" as const;
export const directorRuntimeSceneOrchestrationPublicIndexNamespace =
  "nexora.dri.scene.orchestration.public-index" as const;
export const directorRuntimeSceneOrchestrationPublicIndexVersion = "3.9.0" as const;
export const directorRuntimeSceneOrchestrationPublicIndexUpstream =
  directorRuntimeSceneOrchestrationFreezeIdentity;
export const directorRuntimeSceneOrchestrationConsumerImportPath =
  "@/app/lib/dri/directorRuntimeSceneOrchestrationPublicIndex" as const;

export const directorRuntimeSceneOrchestrationReleaseStatus = "Released" as const;
export const directorRuntimeSceneOrchestrationFreezeStatus = "Frozen" as const;
export const directorRuntimeSceneOrchestrationCertificationStatus = "Certified" as const;
export const directorRuntimeSceneOrchestrationStability = "Stable" as const;
export const directorRuntimeSceneOrchestrationConsumerReadiness = "ReadyForConsumer" as const;
export const directorRuntimeSceneOrchestrationConsumerRole = "SoleConsumerEntryPoint" as const;

/** Canonical lock preserved from DRI-3:8. */
export const DRI_3_SCENE_ORCHESTRATION_LOCK = directorRuntimeSceneOrchestrationLock;

export const directorRuntimeSceneOrchestrationPublicNamespaceSections = Object.freeze([
  "Identity", "Public Types", "Public APIs", "Validation", "Certification",
  "Release Information", "Compatibility", "Registry", "Consumer Information",
] as const);

export const directorRuntimeSceneOrchestrationPublicIdentityChain = Object.freeze([
  ...directorRuntimeSceneOrchestrationFrozenIdentityChain,
  directorRuntimeSceneOrchestrationPublicIndexIdentity,
] as const);

export const directorRuntimeSceneOrchestrationApprovedFrozenExports =
  directorRuntimeSceneOrchestrationFrozenPublicApiSurface;

export const directorRuntimeSceneOrchestrationApprovedFrozenExportCount =
  directorRuntimeSceneOrchestrationApprovedFrozenExports.length;

export const directorRuntimeSceneOrchestrationPublicTypeNames =
  directorRuntimeSceneOrchestrationFrozenPublicTypeNames;

export const directorRuntimeSceneOrchestrationPublicFunctionalApiNames =
  directorRuntimeSceneOrchestrationFrozenFunctionalApiNames;

export const directorRuntimeSceneOrchestrationConsumerRules = Object.freeze([
  "public-index-only",
  "no-foundation-import",
  "no-contracts-import",
  "no-model-import",
  "no-focus-attention-import",
  "no-validation-import",
  "no-certification-import",
  "no-platform-import",
  "no-freeze-import",
  "preserve-immutable-contracts",
  "preserve-certification-conditions",
  "do-not-reinterpret-orchestration-semantics",
  "do-not-infer-renderer-instructions",
  "do-not-calculate-kpi-or-business-truth",
] as const);

export const directorRuntimeSceneOrchestrationPublicIdentity = Object.freeze({
  id: directorRuntimeSceneOrchestrationPublicIndexIdentity,
  version: directorRuntimeSceneOrchestrationPublicIndexVersion,
  namespace: directorRuntimeSceneOrchestrationPublicIndexNamespace,
  lock: DRI_3_SCENE_ORCHESTRATION_LOCK,
  upstreamFreezeIdentity: directorRuntimeSceneOrchestrationFreezeIdentity,
  identityChain: directorRuntimeSceneOrchestrationPublicIdentityChain,
  identityChainCount: directorRuntimeSceneOrchestrationPublicIdentityChain.length,
});

export const directorRuntimeSceneOrchestrationPublicTypes = Object.freeze({
  names: directorRuntimeSceneOrchestrationPublicTypeNames,
  count: directorRuntimeSceneOrchestrationPublicTypeNames.length,
  source: "DRI-3:8/DirectorRuntimeSceneOrchestrationFreeze" as const,
});

export const directorRuntimeSceneOrchestrationPublicApis = Object.freeze({
  functionalApiNames: directorRuntimeSceneOrchestrationPublicFunctionalApiNames,
  functionalApiCount: directorRuntimeSceneOrchestrationPublicFunctionalApiNames.length,
  approvedFrozenExports: directorRuntimeSceneOrchestrationApprovedFrozenExports,
  approvedFrozenExportCount: directorRuntimeSceneOrchestrationApprovedFrozenExportCount,
  publish: publishDirectorRuntimeSceneOrchestrationPlatform,
  isEligible: isDirectorSceneOrchestrationPlatformEligible,
  isPublished: isPublishedDirectorSceneOrchestrationPlatformResult,
  verifyFreeze: verifyDirectorRuntimeSceneOrchestrationFreeze,
});

export const directorRuntimeSceneOrchestrationValidationNamespace = Object.freeze({
  authority: "DRI-3:5/DirectorRuntimeSceneOrchestrationValidation" as const,
  statuses: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_VALIDATION_STATUSES,
  severities: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_VALIDATION_SEVERITIES,
  guarantees: Object.freeze([
    "validation-authority-preserved", "deterministic", "non-mutating", "immutable",
  ] as const),
});

export const directorRuntimeSceneOrchestrationCertificationNamespace = Object.freeze({
  authority: "DRI-3:6/DirectorRuntimeSceneOrchestrationCertification" as const,
  statuses: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_CERTIFICATION_STATUSES,
  decisions: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_CERTIFICATION_DECISIONS,
  conditionalTransparency: true as const,
  guarantees: Object.freeze([
    "certification-authority-preserved", "conditions-preserved", "lineage-preserved",
  ] as const),
});

export const directorRuntimeSceneOrchestrationReleaseInformation = Object.freeze({
  release: directorRuntimeSceneOrchestrationReleaseStatus,
  freeze: directorRuntimeSceneOrchestrationFreezeStatus,
  certification: directorRuntimeSceneOrchestrationCertificationStatus,
  stability: directorRuntimeSceneOrchestrationStability,
  readiness: directorRuntimeSceneOrchestrationConsumerReadiness,
  lock: DRI_3_SCENE_ORCHESTRATION_LOCK,
  version: directorRuntimeSceneOrchestrationPublicIndexVersion,
  namespace: directorRuntimeSceneOrchestrationPublicIndexNamespace,
  platformAuthority: "DRI-3:7/DirectorRuntimeSceneOrchestrationPlatform" as const,
  freezeAuthority: directorRuntimeSceneOrchestrationFreezeIdentity,
});

export const directorRuntimeSceneOrchestrationPublicCompatibility = Object.freeze({
  ...directorRuntimeSceneOrchestrationFreezeCompatibility,
  readyForConsumer: true as const,
  renderingSupported: false as const,
  nolMutationSupported: false as const,
  businessPolicySupported: false as const,
  consumerCategories: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_CONSUMER_CATEGORIES,
  targets: DIRECTOR_SCENE_ORCHESTRATION_PLATFORM_COMPATIBILITY_TARGETS,
});

export const directorRuntimeSceneOrchestrationConsumerInformation = Object.freeze({
  role: directorRuntimeSceneOrchestrationConsumerRole,
  readiness: directorRuntimeSceneOrchestrationConsumerReadiness,
  importPath: directorRuntimeSceneOrchestrationConsumerImportPath,
  rules: directorRuntimeSceneOrchestrationConsumerRules,
  soleConsumerEntryPoint: true as const,
});

const directorRuntimeSceneOrchestrationPublicIndexConcepts = Object.freeze([
  "Identity Chain", "Namespace Sections", "Approved Frozen Exports", "Public Types",
  "Public Functional APIs", "Validation", "Certification", "Release", "Compatibility",
  "Consumer Contract",
] as const);

export const directorRuntimeSceneOrchestrationPublicIndexRegistry = Object.freeze({
  concepts: directorRuntimeSceneOrchestrationPublicIndexConcepts,
  conceptCount: directorRuntimeSceneOrchestrationPublicIndexConcepts.length,
  namespaceSections: directorRuntimeSceneOrchestrationPublicNamespaceSections,
  namespaceSectionCount: directorRuntimeSceneOrchestrationPublicNamespaceSections.length,
  identityChain: directorRuntimeSceneOrchestrationPublicIdentityChain,
  identityChainCount: directorRuntimeSceneOrchestrationPublicIdentityChain.length,
  approvedFrozenExports: directorRuntimeSceneOrchestrationApprovedFrozenExports,
  approvedFrozenExportCount: directorRuntimeSceneOrchestrationApprovedFrozenExportCount,
  publicTypes: directorRuntimeSceneOrchestrationPublicTypeNames,
  publicTypeCount: directorRuntimeSceneOrchestrationPublicTypeNames.length,
  publicFunctionalApis: directorRuntimeSceneOrchestrationPublicFunctionalApiNames,
  publicFunctionalApiCount: directorRuntimeSceneOrchestrationPublicFunctionalApiNames.length,
  consumerRules: directorRuntimeSceneOrchestrationConsumerRules,
  consumerRuleCount: directorRuntimeSceneOrchestrationConsumerRules.length,
  operationKinds: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_OPERATION_KINDS,
  operationOrder: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_OPERATION_ORDER,
  attentionLevels: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_ATTENTION_LEVELS,
  attentionOrder: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_ATTENTION_ORDER,
  platformStatuses: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_STATUSES,
  platformEligibilityValues: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_ELIGIBILITY_VALUES,
  platformCapabilities: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_CAPABILITIES,
  platformGuarantees: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_PLATFORM_GUARANTEES,
  freezeGuarantees: directorRuntimeSceneOrchestrationFreezeGuarantees,
});

export interface DirectorSceneOrchestrationConsumerEntryVerificationInput {
  readonly identity: string;
  readonly freezeIdentity: string;
  readonly namespace: string;
  readonly lock: string;
  readonly releaseStatus: string;
  readonly freezeStatus: string;
  readonly certificationStatus: string;
  readonly stability: string;
  readonly readiness: string;
  readonly consumerRole: string;
  readonly importPath: string;
  readonly namespaceSections: readonly string[];
  readonly identityChain: readonly string[];
  readonly frozenExportNames: readonly string[];
}

export const directorRuntimeSceneOrchestrationConsumerEntryVerificationInput = Object.freeze({
  identity: directorRuntimeSceneOrchestrationPublicIndexIdentity,
  freezeIdentity: directorRuntimeSceneOrchestrationFreezeIdentity,
  namespace: directorRuntimeSceneOrchestrationPublicIndexNamespace,
  lock: DRI_3_SCENE_ORCHESTRATION_LOCK,
  releaseStatus: directorRuntimeSceneOrchestrationReleaseStatus,
  freezeStatus: directorRuntimeSceneOrchestrationFreezeStatus,
  certificationStatus: directorRuntimeSceneOrchestrationCertificationStatus,
  stability: directorRuntimeSceneOrchestrationStability,
  readiness: directorRuntimeSceneOrchestrationConsumerReadiness,
  consumerRole: directorRuntimeSceneOrchestrationConsumerRole,
  importPath: directorRuntimeSceneOrchestrationConsumerImportPath,
  namespaceSections: directorRuntimeSceneOrchestrationPublicNamespaceSections,
  identityChain: directorRuntimeSceneOrchestrationPublicIdentityChain,
  frozenExportNames: Object.freeze(
    directorRuntimeSceneOrchestrationApprovedFrozenExports.map(({ exportName }) => exportName),
  ),
});

function exactOrder(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function verifyDirectorRuntimeSceneOrchestrationConsumerEntry(
  input: DirectorSceneOrchestrationConsumerEntryVerificationInput =
    directorRuntimeSceneOrchestrationConsumerEntryVerificationInput,
) {
  const violations: string[] = [];
  if (input.identity !== directorRuntimeSceneOrchestrationPublicIndexIdentity)
    violations.push("identity");
  if (input.freezeIdentity !== directorRuntimeSceneOrchestrationFreezeIdentity)
    violations.push("freeze-identity");
  if (input.namespace !== directorRuntimeSceneOrchestrationPublicIndexNamespace)
    violations.push("namespace");
  if (input.lock !== DRI_3_SCENE_ORCHESTRATION_LOCK) violations.push("lock");
  if (input.releaseStatus !== directorRuntimeSceneOrchestrationReleaseStatus)
    violations.push("release-status");
  if (input.freezeStatus !== directorRuntimeSceneOrchestrationFreezeStatus)
    violations.push("freeze-status");
  if (input.certificationStatus !== directorRuntimeSceneOrchestrationCertificationStatus)
    violations.push("certification-status");
  if (input.stability !== directorRuntimeSceneOrchestrationStability) violations.push("stability");
  if (input.readiness !== directorRuntimeSceneOrchestrationConsumerReadiness)
    violations.push("readiness");
  if (input.consumerRole !== directorRuntimeSceneOrchestrationConsumerRole)
    violations.push("consumer-role");
  if (input.importPath !== directorRuntimeSceneOrchestrationConsumerImportPath)
    violations.push("import-path");
  if (!exactOrder(input.namespaceSections, directorRuntimeSceneOrchestrationPublicNamespaceSections))
    violations.push("namespace-sections");
  if (!exactOrder(input.identityChain, directorRuntimeSceneOrchestrationPublicIdentityChain))
    violations.push("identity-chain");
  const approvedNames = directorRuntimeSceneOrchestrationApprovedFrozenExports
    .map(({ exportName }) => exportName);
  if (!exactOrder(input.frozenExportNames, approvedNames)) violations.push("frozen-exports");
  if (!verifyDirectorRuntimeSceneOrchestrationFreeze().valid) violations.push("freeze-invalid");
  if (new Set(input.frozenExportNames).size !== input.frozenExportNames.length)
    violations.push("frozen-export-duplicates");
  return Object.freeze({
    valid: violations.length === 0,
    readyForConsumer: violations.length === 0,
    identity: directorRuntimeSceneOrchestrationPublicIndexIdentity,
    version: directorRuntimeSceneOrchestrationPublicIndexVersion,
    namespace: directorRuntimeSceneOrchestrationPublicIndexNamespace,
    lock: DRI_3_SCENE_ORCHESTRATION_LOCK,
    releaseStatus: directorRuntimeSceneOrchestrationReleaseStatus,
    freezeStatus: directorRuntimeSceneOrchestrationFreezeStatus,
    certificationStatus: directorRuntimeSceneOrchestrationCertificationStatus,
    stability: directorRuntimeSceneOrchestrationStability,
    readiness: directorRuntimeSceneOrchestrationConsumerReadiness,
    consumerRole: directorRuntimeSceneOrchestrationConsumerRole,
    sectionCount: directorRuntimeSceneOrchestrationPublicNamespaceSections.length,
    identityChainCount: directorRuntimeSceneOrchestrationPublicIdentityChain.length,
    publicTypeCount: directorRuntimeSceneOrchestrationPublicTypeNames.length,
    publicFunctionalApiCount: directorRuntimeSceneOrchestrationPublicFunctionalApiNames.length,
    approvedFrozenExportCount: directorRuntimeSceneOrchestrationApprovedFrozenExportCount,
    consumerRuleCount: directorRuntimeSceneOrchestrationConsumerRules.length,
    violations: Object.freeze(violations),
  });
}

export const directorRuntimeSceneOrchestrationPublicIndex = Object.freeze({
  identity: directorRuntimeSceneOrchestrationPublicIdentity,
  publicTypes: directorRuntimeSceneOrchestrationPublicTypes,
  publicApis: directorRuntimeSceneOrchestrationPublicApis,
  validation: directorRuntimeSceneOrchestrationValidationNamespace,
  certification: directorRuntimeSceneOrchestrationCertificationNamespace,
  releaseInformation: directorRuntimeSceneOrchestrationReleaseInformation,
  compatibility: directorRuntimeSceneOrchestrationPublicCompatibility,
  registry: directorRuntimeSceneOrchestrationPublicIndexRegistry,
  consumerInformation: directorRuntimeSceneOrchestrationConsumerInformation,
  phase: "DRI-3:9" as const,
  name: "DirectorRuntimeSceneOrchestrationPublicIndex" as const,
  layer: "DRI" as const,
  capability: "DirectorRuntimeSceneOrchestration" as const,
  stage: "PublicIndex" as const,
  immediateDependency: directorRuntimeSceneOrchestrationPublicIndexUpstream,
  freeze: directorRuntimeSceneOrchestrationFreeze,
  freezeManifest: directorRuntimeSceneOrchestrationFreezeManifest,
  platform: directorRuntimeSceneOrchestrationPlatform,
  namespaceSections: directorRuntimeSceneOrchestrationPublicNamespaceSections,
  approvedFrozenExports: directorRuntimeSceneOrchestrationApprovedFrozenExports,
  operationKinds: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_OPERATION_KINDS,
  operationOrder: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_OPERATION_ORDER,
  attentionLevels: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_ATTENTION_LEVELS,
  attentionOrder: DIRECTOR_SCENE_ORCHESTRATION_FROZEN_ATTENTION_ORDER,
});
