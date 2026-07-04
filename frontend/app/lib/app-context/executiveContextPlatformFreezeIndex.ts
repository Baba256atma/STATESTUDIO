export type {
  ExecutiveContextPlatformCompatibilityEntry,
  ExecutiveContextPlatformExtensionPolicy,
  ExecutiveContextPlatformFreezeState,
  ExecutiveContextPlatformIdentity,
  ExecutiveContextPlatformManifest,
  ExecutiveContextPlatformPhaseRegistryEntry,
  ExecutiveContextPlatformPublicApiEntry,
  ExecutiveContextPlatformReleaseMetadata,
} from "./executiveContextPlatformFreezeTypes.ts";
export {
  EXECUTIVE_CONTEXT_EXTENSION_POLICY,
  EXECUTIVE_CONTEXT_PHASE_REGISTRY,
  EXECUTIVE_CONTEXT_PLATFORM_IDENTITY,
  EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY,
  EXECUTIVE_CONTEXT_RELEASE_METADATA,
  listExecutiveContextPlatformPhases,
  listExecutiveContextPlatformPublicApis,
} from "./executiveContextPlatformFreezeRegistry.ts";
export {
  EXECUTIVE_CONTEXT_COMPATIBILITY_MATRIX,
  getExecutiveContextPlatformCompatibilityMatrix,
  isExecutiveContextPlatformCompatibilityMatrixValid,
} from "./executiveContextPlatformCompatibility.ts";
export {
  buildExecutiveContextPlatformFreezeManifest,
  isExecutiveContextPlatformFreezeManifestValid,
} from "./executiveContextPlatformFreezeManifest.ts";
export {
  getExecutiveContextPlatformFreezeState,
  runExecutiveContextPlatformFreeze,
} from "./executiveContextPlatformFreezeRunner.ts";

import {
  getExecutiveContextPlatformCompatibilityMatrix,
  isExecutiveContextPlatformCompatibilityMatrixValid,
} from "./executiveContextPlatformCompatibility.ts";
import {
  buildExecutiveContextPlatformFreezeManifest,
  isExecutiveContextPlatformFreezeManifestValid,
} from "./executiveContextPlatformFreezeManifest.ts";
import {
  getExecutiveContextPlatformFreezeState,
  runExecutiveContextPlatformFreeze,
} from "./executiveContextPlatformFreezeRunner.ts";
import {
  listExecutiveContextPlatformPhases,
  listExecutiveContextPlatformPublicApis,
} from "./executiveContextPlatformFreezeRegistry.ts";

export const ExecutiveContextPlatformFreeze = Object.freeze({
  buildExecutiveContextPlatformFreezeManifest,
  isExecutiveContextPlatformFreezeManifestValid,
  runExecutiveContextPlatformFreeze,
  getExecutiveContextPlatformFreezeState,
  getExecutiveContextPlatformCompatibilityMatrix,
  isExecutiveContextPlatformCompatibilityMatrixValid,
  listExecutiveContextPlatformPhases,
  listExecutiveContextPlatformPublicApis,
});
