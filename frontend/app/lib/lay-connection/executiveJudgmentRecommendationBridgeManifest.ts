import {
  EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_METADATA,
  EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_VERSION,
} from "./executiveJudgmentRecommendationBridgeContracts.ts";
import { getExecutiveJudgmentRecommendationBridgeRegistry } from "./executiveJudgmentRecommendationBridgeRegistry.ts";
import type { ExecutiveRecommendationManifest } from "./executiveJudgmentRecommendationBridgeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-3-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveJudgmentRecommendationBridgeManifest(): ExecutiveRecommendationManifest {
  const registry = getExecutiveJudgmentRecommendationBridgeRegistry();
  const deterministicFingerprint = fingerprint([
    registry.bridgeId,
    ...registry.supportedProducers,
    ...registry.supportedConsumers,
    ...registry.supportedPayloadTypes,
    ...registry.supportedContractVersions,
    ...registry.compatibilityMatrix.map((entry) => `${entry.platformId}:${entry.compatible}:${entry.required}`).sort(),
    ...registry.publicApis,
  ]);

  return Object.freeze({
    platformId: "nexora-executive-judgment-recommendation-bridge",
    bridgeId: registry.bridgeId,
    bridgeName: "Executive Judgment to Recommendation Bridge",
    version: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_VERSION,
    dependencies: Object.freeze(["LAY-CONN-1", "LAY-CONN-2", "APP-JUDGE", "APP-RECOMMENDATION"] as const),
    compatibility: registry.compatibilityMatrix,
    extensionPolicy: registry.extensionPolicy,
    releaseMetadata: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_METADATA,
    deterministicFingerprint,
  });
}
