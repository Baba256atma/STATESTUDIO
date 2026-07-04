import {
  EXECUTIVE_SCENE_EVE_METADATA,
  EXECUTIVE_SCENE_EVE_POLICY,
  EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_ID,
  EXECUTIVE_SCENE_EVE_SIGNAL_CATEGORIES,
  EXECUTIVE_SCENE_EVE_SIGNAL_TYPES,
} from "./executiveSceneEveSignalBridgeContracts.ts";
import { getExecutiveSceneEveCompatibilityMatrix } from "./executiveSceneEveSignalBridgeCompatibility.ts";
import type { ExecutiveSceneEveRegistry } from "./executiveSceneEveSignalBridgeTypes.ts";

export const EXECUTIVE_SCENE_EVE_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveSceneEveSignalBridge",
  "ExecutiveSceneEveSignalBridgePlatform",
  "buildExecutiveSceneEveManifest",
  "validateExecutiveSceneEveSignalBridge",
  "validateExecutiveSceneEveManifest",
  "validateExecutiveSceneEveRegistry",
  "getExecutiveSceneEveRegistry",
  "getExecutiveSceneEveCompatibilityMatrix",
] as const);

export function getExecutiveSceneEveRegistry(): ExecutiveSceneEveRegistry {
  return Object.freeze({
    bridgeId: EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_ID,
    providers: Object.freeze([
      Object.freeze({ providerId: "lay-connection-provider", platformId: "LAY-CONN-1", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "reasoning-judgment-provider", platformId: "LAY-CONN-2", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "judgment-recommendation-provider", platformId: "LAY-CONN-3", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "judgment-explanation-provider", platformId: "LAY-CONN-4", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "awareness-context-provider", platformId: "LAY-CONN-5", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "attention-signal-provider", platformId: "LAY-CONN-6", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "priority-signal-provider", platformId: "LAY-CONN-7", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "blind-spot-provider", platformId: "LAY-CONN-8", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "assistant-dashboard-provider", platformId: "LAY-CONN-9", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "scene-provider", platformId: "SCENE", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "eve-provider", platformId: "EVE", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "assistant-provider", platformId: "ASS", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "dashboard-provider", platformId: "DASHBOARD", certified: false, futureCompatible: true }),
    ] as const),
    consumers: Object.freeze([
      Object.freeze({ consumerId: "scene-signal-consumer", name: "Scene Signal Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "eve-signal-consumer", name: "EVE Signal Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "executive-visual-context-consumer", name: "Executive Visual Context Consumer", metadataOnly: true }),
    ] as const),
    signalCategories: EXECUTIVE_SCENE_EVE_SIGNAL_CATEGORIES,
    signalTypes: EXECUTIVE_SCENE_EVE_SIGNAL_TYPES,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "LAY-CONN-1", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-2", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-3", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-4", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-5", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-6", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-7", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-8", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-9", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "SCENE", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "EVE", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "ASS", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "DASHBOARD", required: false, mode: "future-compatible" }),
    ] as const),
    compatibilityMatrix: getExecutiveSceneEveCompatibilityMatrix(),
    versionMetadata: EXECUTIVE_SCENE_EVE_METADATA,
    extensionPolicy: EXECUTIVE_SCENE_EVE_POLICY,
    publicApis: EXECUTIVE_SCENE_EVE_PUBLIC_APIS,
  });
}
