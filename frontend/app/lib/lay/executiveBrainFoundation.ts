export type {
  ExecutiveBrainCapability,
  ExecutiveBrainCapabilityId,
  ExecutiveBrainConfiguration,
  ExecutiveBrainEngineDefinition,
  ExecutiveBrainExtensionDefinition,
  ExecutiveBrainManifest,
  ExecutiveBrainPhaseDefinition,
  ExecutiveBrainPhaseId,
  ExecutiveBrainPlatform,
  ExecutiveBrainRegistry,
  ExecutiveBrainValidationIssue,
  ExecutiveBrainValidationResult,
} from "./executiveBrainTypes.ts";
export {
  EXECUTIVE_BRAIN_ARCHITECTURAL_ROLE,
  EXECUTIVE_BRAIN_DESCRIPTION,
  EXECUTIVE_BRAIN_LAYER_IDENTITY,
  EXECUTIVE_BRAIN_PLATFORM,
  EXECUTIVE_BRAIN_PLATFORM_ID,
  EXECUTIVE_BRAIN_PLATFORM_NAME,
  EXECUTIVE_BRAIN_RELEASE_STAGE,
  EXECUTIVE_BRAIN_VERSION,
} from "./executiveBrainConstants.ts";
export { EXECUTIVE_BRAIN_CAPABILITIES } from "./executiveBrainCapabilities.ts";
export { DEFAULT_EXECUTIVE_BRAIN_CONFIGURATION, getExecutiveBrainConfiguration } from "./executiveBrainConfiguration.ts";
export {
  EXECUTIVE_BRAIN_CAPABILITY_CONTRACT,
  EXECUTIVE_BRAIN_CONFIGURATION_CONTRACT,
  EXECUTIVE_BRAIN_CONTRACTS,
  EXECUTIVE_BRAIN_ENGINE_CONTRACT,
  EXECUTIVE_BRAIN_MANIFEST_CONTRACT,
  EXECUTIVE_BRAIN_PLATFORM_CONTRACT,
  EXECUTIVE_BRAIN_VALIDATION_CONTRACT,
} from "./executiveBrainContracts.ts";
export {
  EXECUTIVE_BRAIN_ENGINE_REGISTRY,
  EXECUTIVE_BRAIN_EXTENSION_REGISTRY,
  EXECUTIVE_BRAIN_PHASE_REGISTRY,
  EXECUTIVE_BRAIN_REGISTRY,
  getExecutiveBrainCapabilities,
  getExecutiveBrainPlatform,
  getExecutiveBrainRegistry,
} from "./executiveBrainRegistry.ts";
export { EXECUTIVE_BRAIN_PUBLIC_APIS, buildExecutiveBrainManifest } from "./executiveBrainManifest.ts";
export { validateExecutiveBrainFoundation } from "./executiveBrainValidation.ts";

import { getExecutiveBrainConfiguration } from "./executiveBrainConfiguration.ts";
import { buildExecutiveBrainManifest } from "./executiveBrainManifest.ts";
import {
  getExecutiveBrainCapabilities,
  getExecutiveBrainPlatform,
  getExecutiveBrainRegistry,
} from "./executiveBrainRegistry.ts";
import { validateExecutiveBrainFoundation } from "./executiveBrainValidation.ts";

export const ExecutiveBrainFoundation = Object.freeze({
  getExecutiveBrainPlatform,
  getExecutiveBrainCapabilities,
  getExecutiveBrainConfiguration,
  getExecutiveBrainRegistry,
  buildExecutiveBrainManifest,
  validateExecutiveBrainFoundation,
});
