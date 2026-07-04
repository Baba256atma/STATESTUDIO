import {
  EXECUTIVE_BLIND_SPOT_BRIDGE_ID,
  EXECUTIVE_BLIND_SPOT_CATEGORIES,
  EXECUTIVE_BLIND_SPOT_METADATA,
  EXECUTIVE_BLIND_SPOT_POLICY,
  EXECUTIVE_BLIND_SPOT_TYPES,
} from "./executiveBlindSpotBridgeContracts.ts";
import { getExecutiveBlindSpotCompatibilityMatrix } from "./executiveBlindSpotBridgeCompatibility.ts";
import type { ExecutiveBlindSpotRegistry } from "./executiveBlindSpotBridgeTypes.ts";

export const EXECUTIVE_BLIND_SPOT_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveBlindSpotBridge",
  "ExecutiveBlindSpotBridgePlatform",
  "buildExecutiveBlindSpotManifest",
  "validateExecutiveBlindSpotBridge",
  "validateExecutiveBlindSpotManifest",
  "validateExecutiveBlindSpotRegistry",
  "getExecutiveBlindSpotRegistry",
  "getExecutiveBlindSpotCompatibilityMatrix",
] as const);

export function getExecutiveBlindSpotRegistry(): ExecutiveBlindSpotRegistry {
  return Object.freeze({
    bridgeId: EXECUTIVE_BLIND_SPOT_BRIDGE_ID,
    providers: Object.freeze([
      Object.freeze({ providerId: "app-reason-provider", platformId: "APP-REASON", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "app-judge-provider", platformId: "APP-JUDGE", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "awareness-context-provider", platformId: "LAY-CONN-5", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "attention-signal-provider", platformId: "LAY-CONN-6", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "priority-signal-provider", platformId: "LAY-CONN-7", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "recommendation-provider", platformId: "EXECUTIVE-RECOMMENDATION", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "explanation-provider", platformId: "EXECUTIVE-EXPLANATION", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "knowledge-provider", platformId: "KNL", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "identity-provider", platformId: "IDN", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "smm-provider", platformId: "SMM", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "assistant-provider", platformId: "ASS", certified: false, futureCompatible: true }),
    ] as const),
    consumers: Object.freeze([
      Object.freeze({ consumerId: "lay-blind-spot-consumer", name: "Executive Blind Spot Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "assistant-blind-spot-consumer", name: "Assistant Blind Spot Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "dashboard-blind-spot-consumer", name: "Dashboard Blind Spot Consumer", metadataOnly: true }),
    ] as const),
    categories: EXECUTIVE_BLIND_SPOT_CATEGORIES,
    blindSpotTypes: EXECUTIVE_BLIND_SPOT_TYPES,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "LAY-CONN-1", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-2", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-3", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-4", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-5", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-6", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-7", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-REASON", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-JUDGE", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "EXECUTIVE-RECOMMENDATION", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "EXECUTIVE-EXPLANATION", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "KNL", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "IDN", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "SMM", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "ASS", required: false, mode: "future-compatible" }),
    ] as const),
    compatibilityMatrix: getExecutiveBlindSpotCompatibilityMatrix(),
    versionMetadata: EXECUTIVE_BLIND_SPOT_METADATA,
    extensionPolicy: EXECUTIVE_BLIND_SPOT_POLICY,
    publicApis: EXECUTIVE_BLIND_SPOT_PUBLIC_APIS,
  });
}
