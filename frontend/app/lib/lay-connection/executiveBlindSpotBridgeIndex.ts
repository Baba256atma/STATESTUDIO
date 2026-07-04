export type {
  ExecutiveBlindSpotAssumption,
  ExecutiveBlindSpotBridge as ExecutiveBlindSpotBridgeContract,
  ExecutiveBlindSpotCandidate,
  ExecutiveBlindSpotCategory,
  ExecutiveBlindSpotCertification,
  ExecutiveBlindSpotCompatibility,
  ExecutiveBlindSpotConstraint,
  ExecutiveBlindSpotConsumer,
  ExecutiveBlindSpotContext,
  ExecutiveBlindSpotDependency,
  ExecutiveBlindSpotEvidence,
  ExecutiveBlindSpotIdentity,
  ExecutiveBlindSpotManifest,
  ExecutiveBlindSpotMetadata,
  ExecutiveBlindSpotOpportunity,
  ExecutiveBlindSpotPolicy,
  ExecutiveBlindSpotProvider,
  ExecutiveBlindSpotRegistry,
  ExecutiveBlindSpotResult,
  ExecutiveBlindSpotRisk,
  ExecutiveBlindSpotValidation,
} from "./executiveBlindSpotBridgeTypes.ts";

export {
  EXECUTIVE_BLIND_SPOT_BRIDGE_ID,
  EXECUTIVE_BLIND_SPOT_BRIDGE_VERSION,
  EXECUTIVE_BLIND_SPOT_CATEGORIES,
  EXECUTIVE_BLIND_SPOT_METADATA,
  EXECUTIVE_BLIND_SPOT_POLICY,
  EXECUTIVE_BLIND_SPOT_TYPES,
  ExecutiveBlindSpotBridge,
} from "./executiveBlindSpotBridgeContracts.ts";
export { getExecutiveBlindSpotCompatibilityMatrix } from "./executiveBlindSpotBridgeCompatibility.ts";
export { buildExecutiveBlindSpotManifest } from "./executiveBlindSpotBridgeManifest.ts";
export {
  EXECUTIVE_BLIND_SPOT_PUBLIC_APIS,
  getExecutiveBlindSpotRegistry,
} from "./executiveBlindSpotBridgeRegistry.ts";
export {
  validateExecutiveBlindSpotBridge,
  validateExecutiveBlindSpotManifest,
  validateExecutiveBlindSpotRegistry,
} from "./executiveBlindSpotBridgeValidation.ts";

import { ExecutiveBlindSpotBridge } from "./executiveBlindSpotBridgeContracts.ts";
import { getExecutiveBlindSpotCompatibilityMatrix } from "./executiveBlindSpotBridgeCompatibility.ts";
import { buildExecutiveBlindSpotManifest } from "./executiveBlindSpotBridgeManifest.ts";
import { getExecutiveBlindSpotRegistry } from "./executiveBlindSpotBridgeRegistry.ts";
import {
  validateExecutiveBlindSpotBridge,
  validateExecutiveBlindSpotManifest,
  validateExecutiveBlindSpotRegistry,
} from "./executiveBlindSpotBridgeValidation.ts";

export const ExecutiveBlindSpotBridgePlatform = Object.freeze({
  ExecutiveBlindSpotBridge,
  buildExecutiveBlindSpotManifest,
  validateExecutiveBlindSpotBridge,
  validateExecutiveBlindSpotManifest,
  validateExecutiveBlindSpotRegistry,
  getExecutiveBlindSpotRegistry,
  getExecutiveBlindSpotCompatibilityMatrix,
});
