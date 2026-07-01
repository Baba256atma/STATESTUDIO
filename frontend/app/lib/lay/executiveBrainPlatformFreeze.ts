export {
  EXECUTIVE_BRAIN_PLATFORM_FREEZE_CONTRACT_VERSION,
} from "./executiveBrainPlatformFreezeTypes.ts";
export type {
  ExecutiveBrainCertificationResult,
  ExecutiveBrainCompatibilityMatrix,
  ExecutiveBrainFreezeResult,
  ExecutiveBrainPlatformCapabilityEntry,
  ExecutiveBrainPlatformCertificationGate,
  ExecutiveBrainPlatformCertificationStatus,
  ExecutiveBrainPlatformExtensionPolicy,
  ExecutiveBrainPlatformLayerCompatibilityEntry,
  ExecutiveBrainPlatformManifest,
  ExecutiveBrainPlatformPhaseCompatibilityEntry,
  ExecutiveBrainPlatformPhaseId,
  ExecutiveBrainPlatformPhaseRegistryEntry,
  ExecutiveBrainPlatformPublicApiEntry,
  ExecutiveBrainRegressionResult,
  ExecutiveBrainReleaseMetadata,
} from "./executiveBrainPlatformFreezeTypes.ts";
export {
  EXECUTIVE_BRAIN_RELEASE_METADATA,
  getExecutiveBrainReleaseMetadata,
  listExecutiveBrainPhases,
  listExecutiveBrainPlatformCapabilities,
  listExecutiveBrainPlatformPublicApis,
} from "./executiveBrainPlatformFreezeRegistry.ts";
export {
  getExecutiveBrainCompatibilityMatrix,
  getExecutiveBrainPlatformExtensionPolicy,
} from "./executiveBrainPlatformCompatibility.ts";
export {
  EXECUTIVE_BRAIN_PLATFORM_REGRESSION_COMMAND,
  runExecutiveBrainPlatformRegression,
} from "./executiveBrainPlatformRegression.ts";
export { buildExecutiveBrainPlatformFreezeManifest } from "./executiveBrainPlatformFreezeManifest.ts";
export { runExecutiveBrainPlatformCertification } from "./executiveBrainPlatformCertification.ts";
export {
  getExecutiveBrainPlatformState,
  runExecutiveBrainPlatformFreeze,
} from "./executiveBrainPlatformFreezeRunner.ts";

import { buildExecutiveBrainPlatformFreezeManifest } from "./executiveBrainPlatformFreezeManifest.ts";
import { getExecutiveBrainCompatibilityMatrix } from "./executiveBrainPlatformCompatibility.ts";
import { listExecutiveBrainPhases, listExecutiveBrainPlatformCapabilities } from "./executiveBrainPlatformFreezeRegistry.ts";
import { runExecutiveBrainPlatformCertification } from "./executiveBrainPlatformCertification.ts";
import { runExecutiveBrainPlatformRegression } from "./executiveBrainPlatformRegression.ts";
import { getExecutiveBrainPlatformState, runExecutiveBrainPlatformFreeze } from "./executiveBrainPlatformFreezeRunner.ts";

export function listExecutiveBrainCapabilities() {
  return listExecutiveBrainPlatformCapabilities();
}

export const ExecutiveBrainPlatformFreeze = Object.freeze({
  buildExecutiveBrainPlatformFreezeManifest,
  runExecutiveBrainPlatformCertification,
  runExecutiveBrainPlatformRegression,
  runExecutiveBrainPlatformFreeze,
  getExecutiveBrainPlatformState,
  listExecutiveBrainPhases,
  listExecutiveBrainCapabilities,
  getExecutiveBrainCompatibilityMatrix,
});
