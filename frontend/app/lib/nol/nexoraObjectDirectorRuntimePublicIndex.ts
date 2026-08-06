/** NOL-4:9 — sole public consumer entry for the frozen Director Runtime platform. */
import * as frozenSurface from "./runtime/nexoraObjectDirectorRuntimeFreeze.ts";

export * from "./runtime/nexoraObjectDirectorRuntimeFreeze.ts";

// 1. Identity
export const publicIndexId = "NOL-4:9/NexoraObjectDirectorRuntimePublicIndex" as const;
export const publicIndexIdentity = publicIndexId;
export const publicIndexVersion = frozenSurface.nexoraObjectDirectorRuntimeFreezeVersion;
export const publicIndexSchemaVersion = frozenSurface.nexoraObjectDirectorRuntimeFreezeSchemaVersion;
export const runtimePublicIndexVersion = frozenSurface.nexoraObjectDirectorRuntimeFreezeVersion;
export const runtimePublicIndexSchemaVersion = frozenSurface.nexoraObjectDirectorRuntimeFreezeSchemaVersion;
export const runtimePublicIndexUpstream = frozenSurface.nexoraObjectDirectorRuntimeFreezeIdentity;
export const NEXORA_DIRECTOR_RUNTIME_PUBLIC_INDEX_IMPORT_PATH = "@/app/lib/nol/nexoraObjectDirectorRuntimePublicIndex" as const;

// 2. Public Types — the registry and all type exports originate in Freeze.
export const runtimePublicTypes = frozenSurface.getNexoraDirectorRuntimePublicTypeRegistry();

// 3. Public APIs — callable exports are re-exported unchanged from Freeze.
export const runtimePublicApis = frozenSurface.getNexoraDirectorRuntimePublicApiRegistry();

// 4. Validation
export const runtimeValidationSurface = Object.freeze({
  validateFreezeRequest: frozenSurface.validateNexoraDirectorRuntimeFreezeRequest,
  validateFreezeManifest: frozenSurface.validateNexoraDirectorRuntimeFreezeManifest,
  validateFreezeArtifact: frozenSurface.validateNexoraDirectorRuntimeFreezeArtifact,
  verifyFreeze: frozenSurface.verifyNexoraDirectorRuntimeFreeze,
  validateCertificationReport: frozenSurface.validateNexoraDirectorRuntimeCertificationReport,
  validateRuntime: frozenSurface.validateNexoraDirectorRuntime,
} as const);

// 5. Certification
export const runtimeCertificationSurface = Object.freeze({
  certify: frozenSurface.certifyNexoraDirectorRuntime,
  recertify: frozenSurface.recertifyNexoraDirectorRuntime,
  suspend: frozenSurface.suspendNexoraDirectorRuntimeCertification,
  restore: frozenSurface.restoreNexoraDirectorRuntimeCertification,
  expire: frozenSurface.expireNexoraDirectorRuntimeCertification,
  revoke: frozenSurface.revokeNexoraDirectorRuntimeCertification,
  project: frozenSurface.projectNexoraDirectorRuntimeCertification,
} as const);

// 6. Release Information
export const runtimePublicIndexStatus = frozenSurface.nexoraDirectorRuntimeFreezeStatus;
export const runtimeReleaseInformation = frozenSurface.nexoraDirectorRuntimeReleaseInformation;

// 7. Compatibility
export const runtimePublicIndexCompatibility = frozenSurface.nexoraDirectorRuntimeFreezeCompatibility;
export const runtimeCompatibilityInformation = Object.freeze({
  compatibility: frozenSurface.nexoraDirectorRuntimeFreezeCompatibility,
  dependencyLock: frozenSurface.nexoraDirectorRuntimeDependencyLock,
  versionLock: frozenSurface.nexoraDirectorRuntimeVersionLock,
  schemaLock: frozenSurface.nexoraDirectorRuntimeSchemaLock,
} as const);

// 8. Registry
export const runtimePublicApiRegistry = frozenSurface.getNexoraDirectorRuntimePublicApiRegistry();
export const runtimePublicTypeRegistry = frozenSurface.getNexoraDirectorRuntimePublicTypeRegistry();
export const runtimePublicIdentityRegistry = frozenSurface.getNexoraDirectorRuntimePublicIdentityRegistry();
export const runtimeRegistryInformation = Object.freeze({
  publicApiRegistry: runtimePublicApiRegistry,
  publicTypeRegistry: runtimePublicTypeRegistry,
  publicIdentityRegistry: runtimePublicIdentityRegistry,
  publicApiCount: runtimePublicApiRegistry.count,
  publicTypeCount: runtimePublicTypeRegistry.count,
  publicIdentityCount: runtimePublicIdentityRegistry.count,
} as const);

// 9. Consumer Information
export const runtimeConsumerInformation = Object.freeze({
  readyForConsumer: true,
  freezeOnlyDependency: true,
  stableApi: true,
  soleConsumerEntryPoint: true,
} as const);

export function verifyNexoraDirectorRuntimeConsumerEntry() {
  return runtimeConsumerInformation;
}

export const NEXORA_DIRECTOR_RUNTIME_NAMESPACE_SECTIONS = Object.freeze([
  "Identity",
  "Public Types",
  "Public APIs",
  "Validation",
  "Certification",
  "Release Information",
  "Compatibility",
  "Registry",
  "Consumer Information",
] as const);

export const nexoraObjectDirectorRuntimePublicIndex = Object.freeze({
  identity: Object.freeze({
    publicIndexId,
    publicIndexIdentity,
    publicIndexVersion,
    publicIndexSchemaVersion,
    upstreamIdentity: runtimePublicIndexUpstream,
  } as const),
  publicTypes: runtimePublicTypes,
  publicApis: runtimePublicApis,
  validation: runtimeValidationSurface,
  certification: runtimeCertificationSurface,
  releaseInformation: runtimeReleaseInformation,
  compatibility: runtimeCompatibilityInformation,
  registry: runtimeRegistryInformation,
  consumerInformation: Object.freeze({
    ...runtimeConsumerInformation,
    importPath: NEXORA_DIRECTOR_RUNTIME_PUBLIC_INDEX_IMPORT_PATH,
    status: runtimePublicIndexStatus,
  } as const),
} as const);
