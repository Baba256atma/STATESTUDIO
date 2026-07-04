export type {
  ExecutiveReasoningAssumption,
  ExecutiveReasoningConfidence,
  ExecutiveReasoningConstraint,
  ExecutiveReasoningContract,
  ExecutiveReasoningEvidence,
  ExecutiveReasoningInput,
  ExecutiveReasoningManifest,
  ExecutiveReasoningMetadata,
  ExecutiveReasoningOutput,
  ExecutiveReasoningPackage,
  ExecutiveReasoningRegistry,
  ExecutiveReasoningRegistryMutationResult,
  ExecutiveReasoningTrace,
  ExecutiveReasoningValidation,
  RegisteredExecutiveReasoningPackage,
} from "./executiveReasoningTypes.ts";
export { EXECUTIVE_REASONING_CONTRACT_VERSION } from "./executiveReasoningTypes.ts";
export {
  createExecutiveReasoningRegistry,
  freezeExecutiveReasoningRegistry,
  getExecutiveReasoningPackage,
  hasExecutiveReasoningPackage,
  listExecutiveReasoningPackages,
  registerExecutiveReasoningPackage,
  unregisterExecutiveReasoningPackage,
} from "./executiveReasoningRegistry.ts";
export {
  validateExecutiveReasoningFoundation,
  validateExecutiveReasoningPackage,
  validateExecutiveReasoningRegistration,
  validateExecutiveReasoningRegistry,
} from "./executiveReasoningValidation.ts";
export {
  buildExecutiveReasoningManifest,
  validateExecutiveReasoningManifest,
} from "./executiveReasoningManifest.ts";

import {
  createExecutiveReasoningRegistry,
  freezeExecutiveReasoningRegistry,
  getExecutiveReasoningPackage,
  hasExecutiveReasoningPackage,
  listExecutiveReasoningPackages,
  registerExecutiveReasoningPackage,
  unregisterExecutiveReasoningPackage,
} from "./executiveReasoningRegistry.ts";
import {
  validateExecutiveReasoningFoundation,
  validateExecutiveReasoningPackage,
  validateExecutiveReasoningRegistration,
  validateExecutiveReasoningRegistry,
} from "./executiveReasoningValidation.ts";
import {
  buildExecutiveReasoningManifest,
  validateExecutiveReasoningManifest,
} from "./executiveReasoningManifest.ts";

export const ExecutiveReasoningFoundation = Object.freeze({
  createExecutiveReasoningRegistry,
  registerExecutiveReasoningPackage,
  unregisterExecutiveReasoningPackage,
  getExecutiveReasoningPackage,
  listExecutiveReasoningPackages,
  hasExecutiveReasoningPackage,
  freezeExecutiveReasoningRegistry,
  validateExecutiveReasoningFoundation,
  validateExecutiveReasoningPackage,
  validateExecutiveReasoningRegistration,
  validateExecutiveReasoningRegistry,
  buildExecutiveReasoningManifest,
  validateExecutiveReasoningManifest,
});
