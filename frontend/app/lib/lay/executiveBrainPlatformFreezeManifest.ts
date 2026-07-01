import { getExecutiveBrainCompatibilityMatrix, getExecutiveBrainPlatformExtensionPolicy } from "./executiveBrainPlatformCompatibility.ts";
import {
  getExecutiveBrainReleaseMetadata,
  listExecutiveBrainPhases,
  listExecutiveBrainPlatformCapabilities,
  listExecutiveBrainPlatformPublicApis,
} from "./executiveBrainPlatformFreezeRegistry.ts";
import { runExecutiveBrainPlatformRegression } from "./executiveBrainPlatformRegression.ts";
import {
  EXECUTIVE_BRAIN_PLATFORM_FREEZE_CONTRACT_VERSION,
  type ExecutiveBrainPlatformManifest,
} from "./executiveBrainPlatformFreezeTypes.ts";

export function buildExecutiveBrainPlatformFreezeManifest(): ExecutiveBrainPlatformManifest {
  const phases = listExecutiveBrainPhases();
  const publicApis = listExecutiveBrainPlatformPublicApis();
  const capabilities = listExecutiveBrainPlatformCapabilities();
  const compatibility = getExecutiveBrainCompatibilityMatrix();
  const extensionPolicy = getExecutiveBrainPlatformExtensionPolicy();
  const regression = runExecutiveBrainPlatformRegression();
  const releaseMetadata = getExecutiveBrainReleaseMetadata();

  return Object.freeze({
    contractVersion: EXECUTIVE_BRAIN_PLATFORM_FREEZE_CONTRACT_VERSION,
    releaseMetadata,
    phases,
    publicApis,
    capabilities,
    compatibility,
    extensionPolicy,
    regression,
    certificationState: "certified",
    frozen: true,
    consumerSafe:
      phases.every((phase) => phase.certified && phase.frozen) &&
      publicApis.every((api) => api.available) &&
      capabilities.every((capability) => capability.certified) &&
      compatibility.validationResult === "valid" &&
      compatibility.phaseEntries.every((entry) => entry.compatible) &&
      regression.failed === 0,
  });
}
