export type {
  ExecutivePrioritySignal,
  ExecutivePrioritySignalCategory,
  ExecutivePrioritySignalCertification,
  ExecutivePrioritySignalCompatibility,
  ExecutivePrioritySignalConfidence,
  ExecutivePrioritySignalConsumer,
  ExecutivePrioritySignalDependency,
  ExecutivePrioritySignalIdentity,
  ExecutivePrioritySignalLevel,
  ExecutivePrioritySignalManifest,
  ExecutivePrioritySignalMetadata,
  ExecutivePrioritySignalPlatform as ExecutivePrioritySignalPlatformContract,
  ExecutivePrioritySignalPolicy,
  ExecutivePrioritySignalProvider,
  ExecutivePrioritySignalRegistry,
  ExecutivePrioritySignalResult,
  ExecutivePrioritySignalSeverity,
  ExecutivePrioritySignalSource,
  ExecutivePrioritySignalTarget,
  ExecutivePrioritySignalValidation,
} from "./executivePrioritySignalTypes.ts";

export {
  EXECUTIVE_PRIORITY_SIGNAL_CATEGORIES,
  EXECUTIVE_PRIORITY_SIGNAL_METADATA,
  EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_ID,
  EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_VERSION,
  EXECUTIVE_PRIORITY_SIGNAL_POLICY,
  EXECUTIVE_PRIORITY_SIGNAL_TYPES,
  ExecutivePrioritySignalPlatform,
} from "./executivePrioritySignalContracts.ts";
export { getExecutivePrioritySignalCompatibilityMatrix } from "./executivePrioritySignalCompatibility.ts";
export { buildExecutivePrioritySignalManifest } from "./executivePrioritySignalManifest.ts";
export {
  EXECUTIVE_PRIORITY_SIGNAL_PUBLIC_APIS,
  getExecutivePrioritySignalRegistry,
} from "./executivePrioritySignalRegistry.ts";
export {
  validateExecutivePrioritySignalManifest,
  validateExecutivePrioritySignalPlatform,
  validateExecutivePrioritySignalRegistry,
} from "./executivePrioritySignalValidation.ts";

import { ExecutivePrioritySignalPlatform } from "./executivePrioritySignalContracts.ts";
import { getExecutivePrioritySignalCompatibilityMatrix } from "./executivePrioritySignalCompatibility.ts";
import { buildExecutivePrioritySignalManifest } from "./executivePrioritySignalManifest.ts";
import { getExecutivePrioritySignalRegistry } from "./executivePrioritySignalRegistry.ts";
import {
  validateExecutivePrioritySignalManifest,
  validateExecutivePrioritySignalPlatform,
  validateExecutivePrioritySignalRegistry,
} from "./executivePrioritySignalValidation.ts";

export const ExecutivePrioritySignalPlatformFacade = Object.freeze({
  ExecutivePrioritySignalPlatform,
  buildExecutivePrioritySignalManifest,
  validateExecutivePrioritySignalPlatform,
  validateExecutivePrioritySignalManifest,
  validateExecutivePrioritySignalRegistry,
  getExecutivePrioritySignalRegistry,
  getExecutivePrioritySignalCompatibilityMatrix,
});
