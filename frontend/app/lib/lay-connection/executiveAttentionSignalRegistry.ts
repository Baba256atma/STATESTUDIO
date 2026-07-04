import {
  EXECUTIVE_ATTENTION_SIGNAL_CATEGORIES,
  EXECUTIVE_ATTENTION_SIGNAL_METADATA,
  EXECUTIVE_ATTENTION_SIGNAL_PLATFORM_ID,
  EXECUTIVE_ATTENTION_SIGNAL_POLICY,
  EXECUTIVE_ATTENTION_SIGNAL_TYPES,
} from "./executiveAttentionSignalContracts.ts";
import { getExecutiveAttentionSignalCompatibilityMatrix } from "./executiveAttentionSignalCompatibility.ts";
import type { ExecutiveAttentionSignalRegistry } from "./executiveAttentionSignalTypes.ts";

export const EXECUTIVE_ATTENTION_SIGNAL_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveAttentionSignalPlatform",
  "buildExecutiveAttentionSignalManifest",
  "validateExecutiveAttentionSignalPlatform",
  "validateExecutiveAttentionSignalManifest",
  "validateExecutiveAttentionSignalRegistry",
  "getExecutiveAttentionSignalRegistry",
  "getExecutiveAttentionSignalCompatibilityMatrix",
] as const);

export function getExecutiveAttentionSignalRegistry(): ExecutiveAttentionSignalRegistry {
  return Object.freeze({
    platformId: EXECUTIVE_ATTENTION_SIGNAL_PLATFORM_ID,
    providers: Object.freeze([
      Object.freeze({ providerId: "app-reason-provider", platformId: "APP-REASON", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "app-judge-provider", platformId: "APP-JUDGE", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "awareness-context-provider", platformId: "LAY-CONN-5", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "recommendation-provider", platformId: "EXECUTIVE-RECOMMENDATION", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "explanation-provider", platformId: "EXECUTIVE-EXPLANATION", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "knowledge-provider", platformId: "KNL", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "identity-provider", platformId: "IDN", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "smm-provider", platformId: "SMM", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "assistant-provider", platformId: "ASS", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "runtime-provider", platformId: "Runtime", certified: false, futureCompatible: true }),
    ] as const),
    consumers: Object.freeze([
      Object.freeze({ consumerId: "lay-attention-consumer", name: "Executive Attention Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "dashboard-attention-consumer", name: "Dashboard Attention Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "assistant-attention-consumer", name: "Assistant Attention Consumer", metadataOnly: true }),
    ] as const),
    categories: EXECUTIVE_ATTENTION_SIGNAL_CATEGORIES,
    signalTypes: EXECUTIVE_ATTENTION_SIGNAL_TYPES,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "LAY-CONN-1", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-2", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-3", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-4", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-5", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-REASON", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-JUDGE", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "EXECUTIVE-RECOMMENDATION", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "EXECUTIVE-EXPLANATION", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "KNL", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "IDN", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "SMM", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "ASS", required: false, mode: "future-compatible" }),
    ] as const),
    compatibilityMatrix: getExecutiveAttentionSignalCompatibilityMatrix(),
    versionMetadata: EXECUTIVE_ATTENTION_SIGNAL_METADATA,
    extensionPolicy: EXECUTIVE_ATTENTION_SIGNAL_POLICY,
    publicApis: EXECUTIVE_ATTENTION_SIGNAL_PUBLIC_APIS,
  });
}
