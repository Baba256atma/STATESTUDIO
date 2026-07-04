export type {
  ExecutiveKpiPlatformCertificationGate,
  ExecutiveKpiPlatformCertificationResult,
  ExecutiveKpiPlatformCompatibilityEntry,
  ExecutiveKpiPlatformExtensionPolicy,
  ExecutiveKpiPlatformFreezeManifest,
  ExecutiveKpiPlatformFreezeState,
  ExecutiveKpiPlatformFreezeStatus,
  ExecutiveKpiPlatformIdentity,
  ExecutiveKpiPlatformPhaseEntry,
  ExecutiveKpiPlatformPublicApiEntry,
  ExecutiveKpiPlatformRegressionEntry,
  ExecutiveKpiPlatformRegressionResult,
  ExecutiveKpiPlatformReleaseMetadata,
} from "./executiveKpiPlatformFreezeTypes.ts";

export { getExecutiveKpiPlatformCompatibilityMatrix } from "./executiveKpiPlatformCompatibility.ts";
export { runExecutiveKpiPlatformCertification } from "./executiveKpiPlatformCertification.ts";
export { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeManifest.ts";
export {
  EXECUTIVE_KPI_PLATFORM_EXTENSION_POLICY,
  EXECUTIVE_KPI_PLATFORM_IDENTITY,
  EXECUTIVE_KPI_PLATFORM_PHASES,
  EXECUTIVE_KPI_PLATFORM_RELEASE_METADATA,
  getExecutiveKpiPlatformExtensionPolicy,
  listExecutiveKpiPlatformPhases,
  listExecutiveKpiPlatformPublicApis,
} from "./executiveKpiPlatformFreezeRegistry.ts";
export { getExecutiveKpiPlatformFreezeState, runExecutiveKpiPlatformFreeze } from "./executiveKpiPlatformFreezeRunner.ts";
export { runExecutiveKpiPlatformRegression } from "./executiveKpiPlatformRegression.ts";

import { getExecutiveKpiPlatformCompatibilityMatrix } from "./executiveKpiPlatformCompatibility.ts";
import { runExecutiveKpiPlatformCertification } from "./executiveKpiPlatformCertification.ts";
import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeManifest.ts";
import {
  getExecutiveKpiPlatformExtensionPolicy,
  listExecutiveKpiPlatformPhases,
  listExecutiveKpiPlatformPublicApis,
} from "./executiveKpiPlatformFreezeRegistry.ts";
import { getExecutiveKpiPlatformFreezeState, runExecutiveKpiPlatformFreeze } from "./executiveKpiPlatformFreezeRunner.ts";
import { runExecutiveKpiPlatformRegression } from "./executiveKpiPlatformRegression.ts";

export const ExecutiveKpiPlatformFreeze = Object.freeze({
  buildExecutiveKpiPlatformFreezeManifest,
  runExecutiveKpiPlatformCertification,
  runExecutiveKpiPlatformRegression,
  runExecutiveKpiPlatformFreeze,
  getExecutiveKpiPlatformFreezeState,
  listExecutiveKpiPlatformPhases,
  listExecutiveKpiPlatformPublicApis,
  getExecutiveKpiPlatformCompatibilityMatrix,
  getExecutiveKpiPlatformExtensionPolicy,
});
