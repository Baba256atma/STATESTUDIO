export type {
  ExecutiveAwarenessContext,
  ExecutiveAwarenessContextAggregator as ExecutiveAwarenessContextAggregatorContract,
  ExecutiveAwarenessContextEntry,
  ExecutiveAwarenessContextResult,
  ExecutiveContextAggregationPolicy,
  ExecutiveContextCategory,
  ExecutiveContextCertification,
  ExecutiveContextCompatibility,
  ExecutiveContextConsumer,
  ExecutiveContextDependency,
  ExecutiveContextManifest,
  ExecutiveContextMetadata,
  ExecutiveContextPriority,
  ExecutiveContextProvider,
  ExecutiveContextRegistry,
  ExecutiveContextSource,
  ExecutiveContextValidation,
} from "./executiveAwarenessContextAggregatorTypes.ts";

export {
  EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_ID,
  EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_VERSION,
  EXECUTIVE_AWARENESS_CONTEXT_CATEGORIES,
  EXECUTIVE_AWARENESS_CONTEXT_METADATA,
  EXECUTIVE_AWARENESS_CONTEXT_POLICY,
  EXECUTIVE_AWARENESS_CONTEXT_SOURCES,
  EXECUTIVE_AWARENESS_CONTEXT_TYPES,
  ExecutiveAwarenessContextAggregator,
} from "./executiveAwarenessContextAggregatorContracts.ts";
export { getExecutiveAwarenessContextCompatibilityMatrix } from "./executiveAwarenessContextAggregatorCompatibility.ts";
export { buildExecutiveAwarenessContextManifest } from "./executiveAwarenessContextAggregatorManifest.ts";
export {
  EXECUTIVE_AWARENESS_CONTEXT_PUBLIC_APIS,
  getExecutiveAwarenessContextRegistry,
} from "./executiveAwarenessContextAggregatorRegistry.ts";
export {
  validateExecutiveAwarenessContextAggregator,
  validateExecutiveAwarenessContextManifest,
  validateExecutiveAwarenessContextRegistry,
} from "./executiveAwarenessContextAggregatorValidation.ts";

import { ExecutiveAwarenessContextAggregator } from "./executiveAwarenessContextAggregatorContracts.ts";
import { getExecutiveAwarenessContextCompatibilityMatrix } from "./executiveAwarenessContextAggregatorCompatibility.ts";
import { buildExecutiveAwarenessContextManifest } from "./executiveAwarenessContextAggregatorManifest.ts";
import { getExecutiveAwarenessContextRegistry } from "./executiveAwarenessContextAggregatorRegistry.ts";
import {
  validateExecutiveAwarenessContextAggregator,
  validateExecutiveAwarenessContextManifest,
  validateExecutiveAwarenessContextRegistry,
} from "./executiveAwarenessContextAggregatorValidation.ts";

export const ExecutiveAwarenessContextAggregatorPlatform = Object.freeze({
  ExecutiveAwarenessContextAggregator,
  buildExecutiveAwarenessContextManifest,
  validateExecutiveAwarenessContextAggregator,
  validateExecutiveAwarenessContextManifest,
  validateExecutiveAwarenessContextRegistry,
  getExecutiveAwarenessContextRegistry,
  getExecutiveAwarenessContextCompatibilityMatrix,
});
