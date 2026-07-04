import {
  EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_ID,
  EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_METADATA,
  EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_VERSION,
  EXECUTIVE_JUDGMENT_EXPLANATION_PAYLOAD_TYPES,
  EXECUTIVE_JUDGMENT_EXPLANATION_TARGETS,
} from "./executiveJudgmentExplanationBridgeContracts.ts";
import { getExecutiveJudgmentExplanationBridgeCompatibilityMatrix } from "./executiveJudgmentExplanationBridgeCompatibility.ts";
import type { ExecutiveExplanationRegistry } from "./executiveJudgmentExplanationBridgeTypes.ts";

export const EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveJudgmentExplanationBridge",
  "ExecutiveJudgmentExplanationBridgePlatform",
  "buildExecutiveJudgmentExplanationBridgeManifest",
  "validateExecutiveJudgmentExplanationBridge",
  "validateExecutiveJudgmentExplanationBridgeManifest",
  "validateExecutiveJudgmentExplanationBridgeRegistry",
  "getExecutiveJudgmentExplanationBridgeRegistry",
  "getExecutiveJudgmentExplanationBridgeCompatibilityMatrix",
] as const);

export function getExecutiveJudgmentExplanationBridgeRegistry(): ExecutiveExplanationRegistry {
  return Object.freeze({
    bridgeId: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_ID,
    supportedProducers: Object.freeze(["APP-JUDGE"] as const),
    supportedConsumers: Object.freeze(["EXECUTIVE-EXPLANATION"] as const),
    supportedPayloadTypes: EXECUTIVE_JUDGMENT_EXPLANATION_PAYLOAD_TYPES,
    supportedExplanationTargets: EXECUTIVE_JUDGMENT_EXPLANATION_TARGETS,
    supportedContractVersions: Object.freeze([EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_VERSION] as const),
    compatibilityMatrix: getExecutiveJudgmentExplanationBridgeCompatibilityMatrix(),
    extensionPolicy: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_METADATA,
    publicApis: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_PUBLIC_APIS,
  });
}
