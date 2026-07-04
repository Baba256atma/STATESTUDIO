export type {
  AppDomainPlatformCertificationDiagnostic,
  AppDomainPlatformCertificationGate,
  AppDomainPlatformCertificationResult,
  AppDomainPlatformCompatibilityEntry,
  AppDomainPlatformExtensionPolicy,
  AppDomainPlatformFreezeState,
  AppDomainPlatformIdentity,
  AppDomainPlatformManifest,
  AppDomainPlatformPhaseRegistryEntry,
  AppDomainPlatformPublicApiEntry,
  AppDomainPlatformRegressionEntry,
  AppDomainPlatformRegressionResult,
  AppDomainPlatformReleaseMetadata,
  AppDomainPlatformStatus,
} from "./appDomainPlatformFreezeTypes.ts";
export {
  APP_DOMAIN_EXTENSION_POLICY,
  APP_DOMAIN_PHASE_REGISTRY,
  APP_DOMAIN_PLATFORM_IDENTITY,
  APP_DOMAIN_PUBLIC_API_REGISTRY,
  APP_DOMAIN_RELEASE_METADATA,
  listAppDomainPlatformPhases,
  listAppDomainPlatformPublicApis,
} from "./appDomainPlatformFreezeRegistry.ts";
export {
  APP_DOMAIN_COMPATIBILITY_MATRIX,
  getAppDomainPlatformCompatibilityMatrix,
  isAppDomainPlatformCompatibilityMatrixValid,
} from "./appDomainPlatformCompatibility.ts";
export {
  buildAppDomainPlatformManifest,
  isAppDomainPlatformManifestValid,
} from "./appDomainPlatformManifest.ts";
export { runAppDomainPlatformCertification } from "./appDomainPlatformCertification.ts";
export { runAppDomainPlatformRegression } from "./appDomainPlatformRegression.ts";
export {
  getAppDomainPlatformFreezeState,
  runAppDomainPlatformFreeze,
} from "./appDomainPlatformFreezeRunner.ts";

import {
  getAppDomainPlatformCompatibilityMatrix,
  isAppDomainPlatformCompatibilityMatrixValid,
} from "./appDomainPlatformCompatibility.ts";
import { runAppDomainPlatformCertification } from "./appDomainPlatformCertification.ts";
import {
  buildAppDomainPlatformManifest,
  isAppDomainPlatformManifestValid,
} from "./appDomainPlatformManifest.ts";
import { runAppDomainPlatformRegression } from "./appDomainPlatformRegression.ts";
import {
  getAppDomainPlatformFreezeState,
  runAppDomainPlatformFreeze,
} from "./appDomainPlatformFreezeRunner.ts";
import {
  listAppDomainPlatformPhases,
  listAppDomainPlatformPublicApis,
} from "./appDomainPlatformFreezeRegistry.ts";

export const AppDomainPlatformFreeze = Object.freeze({
  buildAppDomainPlatformManifest,
  isAppDomainPlatformManifestValid,
  runAppDomainPlatformCertification,
  runAppDomainPlatformRegression,
  runAppDomainPlatformFreeze,
  getAppDomainPlatformFreezeState,
  getAppDomainPlatformCompatibilityMatrix,
  isAppDomainPlatformCompatibilityMatrixValid,
  listAppDomainPlatformPhases,
  listAppDomainPlatformPublicApis,
});
