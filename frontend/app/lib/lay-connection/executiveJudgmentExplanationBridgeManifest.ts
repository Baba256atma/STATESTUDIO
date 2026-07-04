import {
  EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_METADATA,
  EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_VERSION,
} from "./executiveJudgmentExplanationBridgeContracts.ts";
import { getExecutiveJudgmentExplanationBridgeRegistry } from "./executiveJudgmentExplanationBridgeRegistry.ts";
import type { ExecutiveExplanationManifest } from "./executiveJudgmentExplanationBridgeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-4-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveJudgmentExplanationBridgeManifest(): ExecutiveExplanationManifest {
  const registry = getExecutiveJudgmentExplanationBridgeRegistry();
  const deterministicFingerprint = fingerprint([
    registry.bridgeId,
    ...registry.supportedProducers,
    ...registry.supportedConsumers,
    ...registry.supportedPayloadTypes,
    ...registry.supportedExplanationTargets,
    ...registry.supportedContractVersions,
    ...registry.compatibilityMatrix.map((entry) => `${entry.platformId}:${entry.compatible}:${entry.required}:${entry.mode}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: "nexora-executive-judgment-explanation-bridge",
    bridgeId: registry.bridgeId,
    bridgeName: "Executive Judgment to Explanation Bridge",
    version: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_VERSION,
    dependencies: Object.freeze(["LAY-CONN-1", "LAY-CONN-2", "LAY-CONN-3", "APP-JUDGE", "EXECUTIVE-EXPLANATION"] as const),
    compatibility: registry.compatibilityMatrix,
    extensionPolicy: registry.extensionPolicy,
    releaseMetadata: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_METADATA,
    deterministicFingerprint,
  });
}
