export type {
  ExecutiveBridgeAssumption,
  ExecutiveBridgeCertification,
  ExecutiveBridgeCompatibility,
  ExecutiveBridgeConfidence,
  ExecutiveBridgeConstraint,
  ExecutiveBridgeContext,
  ExecutiveBridgeEvidence,
  ExecutiveBridgeLifecycle,
  ExecutiveBridgeManifest,
  ExecutiveBridgeMetadata,
  ExecutiveBridgePayloadType,
  ExecutiveBridgeRegistry,
  ExecutiveBridgeResult,
  ExecutiveBridgeTrace,
  ExecutiveBridgeValidation,
  ExecutiveJudgmentRequest,
  ExecutiveReasoningInput,
  ExecutiveReasoningJudgmentBridge as ExecutiveReasoningJudgmentBridgeContract,
} from "./executiveReasoningJudgmentBridgeTypes.ts";

export {
  EXECUTIVE_REASONING_JUDGMENT_BRIDGE_ID,
  EXECUTIVE_REASONING_JUDGMENT_BRIDGE_METADATA,
  EXECUTIVE_REASONING_JUDGMENT_BRIDGE_VERSION,
  EXECUTIVE_REASONING_JUDGMENT_PAYLOAD_TYPES,
  ExecutiveReasoningJudgmentBridge,
} from "./executiveReasoningJudgmentBridgeContracts.ts";
export { getExecutiveReasoningJudgmentBridgeCompatibilityMatrix } from "./executiveReasoningJudgmentBridgeCompatibility.ts";
export { buildExecutiveReasoningJudgmentBridgeManifest } from "./executiveReasoningJudgmentBridgeManifest.ts";
export {
  EXECUTIVE_REASONING_JUDGMENT_BRIDGE_PUBLIC_APIS,
  getExecutiveReasoningJudgmentBridgeRegistry,
} from "./executiveReasoningJudgmentBridgeRegistry.ts";
export {
  validateExecutiveReasoningJudgmentBridge,
  validateExecutiveReasoningJudgmentBridgeManifest,
  validateExecutiveReasoningJudgmentBridgeRegistry,
} from "./executiveReasoningJudgmentBridgeValidation.ts";

import { ExecutiveReasoningJudgmentBridge } from "./executiveReasoningJudgmentBridgeContracts.ts";
import { getExecutiveReasoningJudgmentBridgeCompatibilityMatrix } from "./executiveReasoningJudgmentBridgeCompatibility.ts";
import { buildExecutiveReasoningJudgmentBridgeManifest } from "./executiveReasoningJudgmentBridgeManifest.ts";
import { getExecutiveReasoningJudgmentBridgeRegistry } from "./executiveReasoningJudgmentBridgeRegistry.ts";
import {
  validateExecutiveReasoningJudgmentBridge,
  validateExecutiveReasoningJudgmentBridgeManifest,
  validateExecutiveReasoningJudgmentBridgeRegistry,
} from "./executiveReasoningJudgmentBridgeValidation.ts";

export const ExecutiveReasoningJudgmentBridgePlatform = Object.freeze({
  ExecutiveReasoningJudgmentBridge,
  buildExecutiveReasoningJudgmentBridgeManifest,
  validateExecutiveReasoningJudgmentBridge,
  validateExecutiveReasoningJudgmentBridgeManifest,
  validateExecutiveReasoningJudgmentBridgeRegistry,
  getExecutiveReasoningJudgmentBridgeRegistry,
  getExecutiveReasoningJudgmentBridgeCompatibilityMatrix,
});
