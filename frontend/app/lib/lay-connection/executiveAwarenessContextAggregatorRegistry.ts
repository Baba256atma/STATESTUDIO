import {
  EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_ID,
  EXECUTIVE_AWARENESS_CONTEXT_CATEGORIES,
  EXECUTIVE_AWARENESS_CONTEXT_METADATA,
  EXECUTIVE_AWARENESS_CONTEXT_POLICY,
  EXECUTIVE_AWARENESS_CONTEXT_TYPES,
} from "./executiveAwarenessContextAggregatorContracts.ts";
import { getExecutiveAwarenessContextCompatibilityMatrix } from "./executiveAwarenessContextAggregatorCompatibility.ts";
import type { ExecutiveContextRegistry } from "./executiveAwarenessContextAggregatorTypes.ts";

export const EXECUTIVE_AWARENESS_CONTEXT_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveAwarenessContextAggregator",
  "ExecutiveAwarenessContextAggregatorPlatform",
  "buildExecutiveAwarenessContextManifest",
  "validateExecutiveAwarenessContextAggregator",
  "validateExecutiveAwarenessContextManifest",
  "validateExecutiveAwarenessContextRegistry",
  "getExecutiveAwarenessContextRegistry",
  "getExecutiveAwarenessContextCompatibilityMatrix",
] as const);

export function getExecutiveAwarenessContextRegistry(): ExecutiveContextRegistry {
  return Object.freeze({
    aggregatorId: EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_ID,
    providers: Object.freeze([
      Object.freeze({ providerId: "app-reason-provider", source: "Executive Reasoning", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "app-judge-provider", source: "Executive Judgment", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "executive-recommendation-provider", source: "Executive Recommendation", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "executive-explanation-provider", source: "Executive Explanation", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "smm-provider", source: "Shared Mental Model", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "idn-provider", source: "Identity", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "knl-provider", source: "Knowledge", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "ass-provider", source: "Assistant", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "dashboard-provider", source: "Dashboard", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "scene-provider", source: "Scene", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "runtime-provider", source: "Runtime", certified: false, futureCompatible: true }),
    ] as const),
    consumers: Object.freeze([
      Object.freeze({ consumerId: "lay-awareness-consumer", name: "Executive Awareness Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "app-context-consumer", name: "Executive Context Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "assistant-context-consumer", name: "Assistant Context Consumer", metadataOnly: true }),
    ] as const),
    categories: EXECUTIVE_AWARENESS_CONTEXT_CATEGORIES,
    contextTypes: EXECUTIVE_AWARENESS_CONTEXT_TYPES,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "LAY-CONN-1", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-2", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-3", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-4", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-REASON", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-JUDGE", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "EXECUTIVE-RECOMMENDATION", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "EXECUTIVE-EXPLANATION", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "KNL", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "IDN", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "SMM", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "ASS", required: false, mode: "future-compatible" }),
    ] as const),
    compatibilityMatrix: getExecutiveAwarenessContextCompatibilityMatrix(),
    versionMetadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA,
    extensionPolicy: EXECUTIVE_AWARENESS_CONTEXT_POLICY,
    publicApis: EXECUTIVE_AWARENESS_CONTEXT_PUBLIC_APIS,
  });
}
