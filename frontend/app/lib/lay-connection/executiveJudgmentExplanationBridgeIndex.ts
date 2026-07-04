export type {
  ExecutiveExplanationBridgeLifecycle,
  ExecutiveExplanationCertification,
  ExecutiveExplanationCompatibility,
  ExecutiveExplanationConfidence,
  ExecutiveExplanationConstraint,
  ExecutiveExplanationContext,
  ExecutiveExplanationEvidence,
  ExecutiveExplanationManifest,
  ExecutiveExplanationMetadata,
  ExecutiveExplanationPayloadType,
  ExecutiveExplanationRegistry,
  ExecutiveExplanationRequest,
  ExecutiveExplanationTarget,
  ExecutiveExplanationTrace,
  ExecutiveExplanationTradeoff,
  ExecutiveExplanationValidation,
  ExecutiveJudgmentExplanationBridge as ExecutiveJudgmentExplanationBridgeContract,
  ExecutiveJudgmentExplanationBridgeResult,
  ExecutiveJudgmentExplanationInput,
  ExecutiveJudgmentRationale,
} from "./executiveJudgmentExplanationBridgeTypes.ts";

export {
  EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_ID,
  EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_METADATA,
  EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_VERSION,
  EXECUTIVE_JUDGMENT_EXPLANATION_PAYLOAD_TYPES,
  EXECUTIVE_JUDGMENT_EXPLANATION_TARGETS,
  ExecutiveJudgmentExplanationBridge,
} from "./executiveJudgmentExplanationBridgeContracts.ts";
export { getExecutiveJudgmentExplanationBridgeCompatibilityMatrix } from "./executiveJudgmentExplanationBridgeCompatibility.ts";
export { buildExecutiveJudgmentExplanationBridgeManifest } from "./executiveJudgmentExplanationBridgeManifest.ts";
export {
  EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_PUBLIC_APIS,
  getExecutiveJudgmentExplanationBridgeRegistry,
} from "./executiveJudgmentExplanationBridgeRegistry.ts";
export {
  validateExecutiveJudgmentExplanationBridge,
  validateExecutiveJudgmentExplanationBridgeManifest,
  validateExecutiveJudgmentExplanationBridgeRegistry,
} from "./executiveJudgmentExplanationBridgeValidation.ts";

import { ExecutiveJudgmentExplanationBridge } from "./executiveJudgmentExplanationBridgeContracts.ts";
import { getExecutiveJudgmentExplanationBridgeCompatibilityMatrix } from "./executiveJudgmentExplanationBridgeCompatibility.ts";
import { buildExecutiveJudgmentExplanationBridgeManifest } from "./executiveJudgmentExplanationBridgeManifest.ts";
import { getExecutiveJudgmentExplanationBridgeRegistry } from "./executiveJudgmentExplanationBridgeRegistry.ts";
import {
  validateExecutiveJudgmentExplanationBridge,
  validateExecutiveJudgmentExplanationBridgeManifest,
  validateExecutiveJudgmentExplanationBridgeRegistry,
} from "./executiveJudgmentExplanationBridgeValidation.ts";

export const ExecutiveJudgmentExplanationBridgePlatform = Object.freeze({
  ExecutiveJudgmentExplanationBridge,
  buildExecutiveJudgmentExplanationBridgeManifest,
  validateExecutiveJudgmentExplanationBridge,
  validateExecutiveJudgmentExplanationBridgeManifest,
  validateExecutiveJudgmentExplanationBridgeRegistry,
  getExecutiveJudgmentExplanationBridgeRegistry,
  getExecutiveJudgmentExplanationBridgeCompatibilityMatrix,
});
