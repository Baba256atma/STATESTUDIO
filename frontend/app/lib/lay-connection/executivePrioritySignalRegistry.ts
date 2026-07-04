import {
  EXECUTIVE_PRIORITY_SIGNAL_CATEGORIES,
  EXECUTIVE_PRIORITY_SIGNAL_METADATA,
  EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_ID,
  EXECUTIVE_PRIORITY_SIGNAL_POLICY,
  EXECUTIVE_PRIORITY_SIGNAL_TYPES,
} from "./executivePrioritySignalContracts.ts";
import { getExecutivePrioritySignalCompatibilityMatrix } from "./executivePrioritySignalCompatibility.ts";
import type { ExecutivePrioritySignalRegistry } from "./executivePrioritySignalTypes.ts";

export const EXECUTIVE_PRIORITY_SIGNAL_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutivePrioritySignalPlatform",
  "buildExecutivePrioritySignalManifest",
  "validateExecutivePrioritySignalPlatform",
  "validateExecutivePrioritySignalManifest",
  "validateExecutivePrioritySignalRegistry",
  "getExecutivePrioritySignalRegistry",
  "getExecutivePrioritySignalCompatibilityMatrix",
] as const);

export function getExecutivePrioritySignalRegistry(): ExecutivePrioritySignalRegistry {
  return Object.freeze({
    platformId: EXECUTIVE_PRIORITY_SIGNAL_PLATFORM_ID,
    providers: Object.freeze([
      Object.freeze({ providerId: "app-reason-provider", platformId: "APP-REASON", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "app-judge-provider", platformId: "APP-JUDGE", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "awareness-context-provider", platformId: "LAY-CONN-5", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "attention-signal-provider", platformId: "LAY-CONN-6", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "recommendation-provider", platformId: "EXECUTIVE-RECOMMENDATION", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "explanation-provider", platformId: "EXECUTIVE-EXPLANATION", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "knowledge-provider", platformId: "KNL", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "identity-provider", platformId: "IDN", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "smm-provider", platformId: "SMM", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "assistant-provider", platformId: "ASS", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "runtime-provider", platformId: "Runtime", certified: false, futureCompatible: true }),
    ] as const),
    consumers: Object.freeze([
      Object.freeze({ consumerId: "lay-priority-consumer", name: "Executive Priority Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "dashboard-priority-consumer", name: "Dashboard Priority Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "assistant-priority-consumer", name: "Assistant Priority Consumer", metadataOnly: true }),
    ] as const),
    categories: EXECUTIVE_PRIORITY_SIGNAL_CATEGORIES,
    priorityTypes: EXECUTIVE_PRIORITY_SIGNAL_TYPES,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "LAY-CONN-1", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-2", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-3", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-4", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-5", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-6", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-REASON", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-JUDGE", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "EXECUTIVE-RECOMMENDATION", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "EXECUTIVE-EXPLANATION", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "KNL", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "IDN", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "SMM", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "ASS", required: false, mode: "future-compatible" }),
    ] as const),
    compatibilityMatrix: getExecutivePrioritySignalCompatibilityMatrix(),
    versionMetadata: EXECUTIVE_PRIORITY_SIGNAL_METADATA,
    extensionPolicy: EXECUTIVE_PRIORITY_SIGNAL_POLICY,
    publicApis: EXECUTIVE_PRIORITY_SIGNAL_PUBLIC_APIS,
  });
}
