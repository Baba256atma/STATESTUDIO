export type {
  ExecutiveCameraReference,
  ExecutiveEveSignal,
  ExecutiveHighlightReference,
  ExecutiveNarrationReference,
  ExecutiveObjectReference,
  ExecutiveSceneContext,
  ExecutiveSceneEveCertification,
  ExecutiveSceneEveCompatibility,
  ExecutiveSceneEveConsumer,
  ExecutiveSceneEveDependency,
  ExecutiveSceneEveManifest,
  ExecutiveSceneEveMetadata,
  ExecutiveSceneEvePolicy,
  ExecutiveSceneEveProvider,
  ExecutiveSceneEveRegistry,
  ExecutiveSceneEveResult,
  ExecutiveSceneEveSignalBridge as ExecutiveSceneEveSignalBridgeContract,
  ExecutiveSceneEveSignalCategory,
  ExecutiveSceneEveValidation,
  ExecutiveSceneReference,
  ExecutiveSceneSignal,
  ExecutiveSketchReference,
  ExecutiveTimelineReference,
  ExecutiveVisualContext,
} from "./executiveSceneEveSignalBridgeTypes.ts";

export {
  EXECUTIVE_SCENE_EVE_METADATA,
  EXECUTIVE_SCENE_EVE_POLICY,
  EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_ID,
  EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_VERSION,
  EXECUTIVE_SCENE_EVE_SIGNAL_CATEGORIES,
  EXECUTIVE_SCENE_EVE_SIGNAL_TYPES,
  ExecutiveSceneEveSignalBridge,
} from "./executiveSceneEveSignalBridgeContracts.ts";
export { getExecutiveSceneEveCompatibilityMatrix } from "./executiveSceneEveSignalBridgeCompatibility.ts";
export { buildExecutiveSceneEveManifest } from "./executiveSceneEveSignalBridgeManifest.ts";
export {
  EXECUTIVE_SCENE_EVE_PUBLIC_APIS,
  getExecutiveSceneEveRegistry,
} from "./executiveSceneEveSignalBridgeRegistry.ts";
export {
  validateExecutiveSceneEveManifest,
  validateExecutiveSceneEveRegistry,
  validateExecutiveSceneEveSignalBridge,
} from "./executiveSceneEveSignalBridgeValidation.ts";

import { ExecutiveSceneEveSignalBridge } from "./executiveSceneEveSignalBridgeContracts.ts";
import { getExecutiveSceneEveCompatibilityMatrix } from "./executiveSceneEveSignalBridgeCompatibility.ts";
import { buildExecutiveSceneEveManifest } from "./executiveSceneEveSignalBridgeManifest.ts";
import { getExecutiveSceneEveRegistry } from "./executiveSceneEveSignalBridgeRegistry.ts";
import {
  validateExecutiveSceneEveManifest,
  validateExecutiveSceneEveRegistry,
  validateExecutiveSceneEveSignalBridge,
} from "./executiveSceneEveSignalBridgeValidation.ts";

export const ExecutiveSceneEveSignalBridgePlatform = Object.freeze({
  ExecutiveSceneEveSignalBridge,
  buildExecutiveSceneEveManifest,
  validateExecutiveSceneEveSignalBridge,
  validateExecutiveSceneEveManifest,
  validateExecutiveSceneEveRegistry,
  getExecutiveSceneEveRegistry,
  getExecutiveSceneEveCompatibilityMatrix,
});
