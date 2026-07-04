export type {
  ExecutiveAttentionSignal,
  ExecutiveAttentionSignalCategory,
  ExecutiveAttentionSignalCertification,
  ExecutiveAttentionSignalCompatibility,
  ExecutiveAttentionSignalConfidence,
  ExecutiveAttentionSignalConsumer,
  ExecutiveAttentionSignalDependency,
  ExecutiveAttentionSignalIdentity,
  ExecutiveAttentionSignalManifest,
  ExecutiveAttentionSignalMetadata,
  ExecutiveAttentionSignalPlatform as ExecutiveAttentionSignalPlatformContract,
  ExecutiveAttentionSignalPolicy,
  ExecutiveAttentionSignalPriority,
  ExecutiveAttentionSignalProvider,
  ExecutiveAttentionSignalRegistry,
  ExecutiveAttentionSignalResult,
  ExecutiveAttentionSignalSeverity,
  ExecutiveAttentionSignalSource,
  ExecutiveAttentionSignalTarget,
  ExecutiveAttentionSignalValidation,
} from "./executiveAttentionSignalTypes.ts";

export {
  EXECUTIVE_ATTENTION_SIGNAL_CATEGORIES,
  EXECUTIVE_ATTENTION_SIGNAL_METADATA,
  EXECUTIVE_ATTENTION_SIGNAL_PLATFORM_ID,
  EXECUTIVE_ATTENTION_SIGNAL_PLATFORM_VERSION,
  EXECUTIVE_ATTENTION_SIGNAL_POLICY,
  EXECUTIVE_ATTENTION_SIGNAL_TYPES,
  ExecutiveAttentionSignalPlatform,
} from "./executiveAttentionSignalContracts.ts";
export { getExecutiveAttentionSignalCompatibilityMatrix } from "./executiveAttentionSignalCompatibility.ts";
export { buildExecutiveAttentionSignalManifest } from "./executiveAttentionSignalManifest.ts";
export {
  EXECUTIVE_ATTENTION_SIGNAL_PUBLIC_APIS,
  getExecutiveAttentionSignalRegistry,
} from "./executiveAttentionSignalRegistry.ts";
export {
  validateExecutiveAttentionSignalManifest,
  validateExecutiveAttentionSignalPlatform,
  validateExecutiveAttentionSignalRegistry,
} from "./executiveAttentionSignalValidation.ts";

import { ExecutiveAttentionSignalPlatform } from "./executiveAttentionSignalContracts.ts";
import { getExecutiveAttentionSignalCompatibilityMatrix } from "./executiveAttentionSignalCompatibility.ts";
import { buildExecutiveAttentionSignalManifest } from "./executiveAttentionSignalManifest.ts";
import { getExecutiveAttentionSignalRegistry } from "./executiveAttentionSignalRegistry.ts";
import {
  validateExecutiveAttentionSignalManifest,
  validateExecutiveAttentionSignalPlatform,
  validateExecutiveAttentionSignalRegistry,
} from "./executiveAttentionSignalValidation.ts";

export const ExecutiveAttentionSignalPlatformFacade = Object.freeze({
  ExecutiveAttentionSignalPlatform,
  buildExecutiveAttentionSignalManifest,
  validateExecutiveAttentionSignalPlatform,
  validateExecutiveAttentionSignalManifest,
  validateExecutiveAttentionSignalRegistry,
  getExecutiveAttentionSignalRegistry,
  getExecutiveAttentionSignalCompatibilityMatrix,
});
