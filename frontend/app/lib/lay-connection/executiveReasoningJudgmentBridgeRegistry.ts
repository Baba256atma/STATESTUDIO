import { getExecutiveReasoningJudgmentBridgeCompatibilityMatrix } from "./executiveReasoningJudgmentBridgeCompatibility.ts";
import {
  EXECUTIVE_REASONING_JUDGMENT_BRIDGE_ID,
  EXECUTIVE_REASONING_JUDGMENT_BRIDGE_METADATA,
  EXECUTIVE_REASONING_JUDGMENT_BRIDGE_VERSION,
  EXECUTIVE_REASONING_JUDGMENT_PAYLOAD_TYPES,
} from "./executiveReasoningJudgmentBridgeContracts.ts";
import type { ExecutiveBridgeRegistry } from "./executiveReasoningJudgmentBridgeTypes.ts";

export const EXECUTIVE_REASONING_JUDGMENT_BRIDGE_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveReasoningJudgmentBridge",
  "buildExecutiveReasoningJudgmentBridgeManifest",
  "validateExecutiveReasoningJudgmentBridge",
  "validateExecutiveReasoningJudgmentBridgeManifest",
  "getExecutiveReasoningJudgmentBridgeRegistry",
  "getExecutiveReasoningJudgmentBridgeCompatibilityMatrix",
] as const);

export function getExecutiveReasoningJudgmentBridgeRegistry(): ExecutiveBridgeRegistry {
  return Object.freeze({
    bridgeId: EXECUTIVE_REASONING_JUDGMENT_BRIDGE_ID,
    supportedProducers: Object.freeze(["APP-REASON"] as const),
    supportedConsumers: Object.freeze(["APP-JUDGE"] as const),
    supportedPayloadTypes: EXECUTIVE_REASONING_JUDGMENT_PAYLOAD_TYPES,
    supportedContractVersions: Object.freeze([EXECUTIVE_REASONING_JUDGMENT_BRIDGE_VERSION] as const),
    compatibilityMatrix: getExecutiveReasoningJudgmentBridgeCompatibilityMatrix(),
    extensionPolicy: EXECUTIVE_REASONING_JUDGMENT_BRIDGE_METADATA,
    publicApis: EXECUTIVE_REASONING_JUDGMENT_BRIDGE_PUBLIC_APIS,
  });
}
