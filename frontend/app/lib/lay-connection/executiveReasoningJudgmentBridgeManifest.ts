import { EXECUTIVE_REASONING_JUDGMENT_BRIDGE_METADATA } from "./executiveReasoningJudgmentBridgeContracts.ts";
import { getExecutiveReasoningJudgmentBridgeRegistry } from "./executiveReasoningJudgmentBridgeRegistry.ts";
import type { ExecutiveBridgeManifest } from "./executiveReasoningJudgmentBridgeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `lay-conn-2-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveReasoningJudgmentBridgeManifest(): ExecutiveBridgeManifest {
  const registry = getExecutiveReasoningJudgmentBridgeRegistry();
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
    platformId: "nexora-executive-reasoning-judgment-bridge",
    bridgeId: registry.bridgeId,
    bridgeName: "Executive Reasoning to Judgment Bridge",
    supportedVersions: registry.supportedContractVersions,
    dependencies: Object.freeze(["LAY-CONN-1", "APP-REASON", "APP-JUDGE"] as const),
    compatibility: registry.compatibilityMatrix,
    extensionPolicy: registry.extensionPolicy,
    releaseMetadata: EXECUTIVE_REASONING_JUDGMENT_BRIDGE_METADATA,
    deterministicFingerprint,
  });
}
