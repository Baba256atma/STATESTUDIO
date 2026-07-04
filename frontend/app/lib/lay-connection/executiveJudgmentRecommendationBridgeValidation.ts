import { ExecutiveJudgmentRecommendationBridge } from "./executiveJudgmentRecommendationBridgeContracts.ts";
import { getExecutiveJudgmentRecommendationBridgeRegistry } from "./executiveJudgmentRecommendationBridgeRegistry.ts";
import type {
  ExecutiveJudgmentRecommendationBridge as ExecutiveJudgmentRecommendationBridgeContract,
  ExecutiveRecommendationManifest,
  ExecutiveRecommendationRegistry,
  ExecutiveRecommendationValidation,
} from "./executiveJudgmentRecommendationBridgeTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveRecommendationValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

export function validateExecutiveJudgmentRecommendationBridge(
  bridge: ExecutiveJudgmentRecommendationBridgeContract = ExecutiveJudgmentRecommendationBridge,
  registry: ExecutiveRecommendationRegistry = getExecutiveJudgmentRecommendationBridgeRegistry()
): ExecutiveRecommendationValidation {
  const errors: string[] = [];
  const producerSet = new Set(registry.supportedProducers);
  const consumerSet = new Set(registry.supportedConsumers);
  const payloadSet = new Set(registry.supportedPayloadTypes);
  const versionSet = new Set(registry.supportedContractVersions);

  if (!bridge.bridgeId) errors.push("missing-bridge-id");
  if (!producerSet.has(bridge.judgmentInput.producerId)) errors.push(`invalid-judgment-result:${bridge.judgmentInput.producerId}`);
  if (!consumerSet.has(bridge.recommendationRequest.consumerId)) errors.push(`invalid-recommendation-consumer:${bridge.recommendationRequest.consumerId}`);
  if (bridge.evidence.length === 0) errors.push("missing-decision-evidence");
  if (bridge.constraints.length === 0) errors.push("missing-constraints");
  if (bridge.tradeoffs.length === 0) errors.push("missing-tradeoffs");
  if (!versionSet.has(bridge.judgmentInput.contractVersion)) errors.push(`invalid-contract-version:${bridge.judgmentInput.contractVersion}`);
  if (!versionSet.has(bridge.recommendationRequest.contractVersion)) errors.push(`invalid-contract-version:${bridge.recommendationRequest.contractVersion}`);
  if (!bridge.metadata.metadataOnly || !bridge.metadata.immutable) errors.push("boundary-violation");

  const payloadTypes = [
    bridge.judgmentInput.payloadType,
    bridge.recommendationRequest.payloadType,
    bridge.context.payloadType,
    bridge.confidence.payloadType,
    bridge.intent.payloadType,
    ...bridge.evidence.map((entry) => entry.payloadType),
    ...bridge.constraints.map((entry) => entry.payloadType),
    ...bridge.tradeoffs.map((entry) => entry.payloadType),
  ];
  for (const payloadType of payloadTypes) {
    if (!payloadSet.has(payloadType)) errors.push(`unsupported-payload:${payloadType}`);
  }

  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");

  return validation(errors);
}

export function validateExecutiveJudgmentRecommendationBridgeRegistry(
  registry: ExecutiveRecommendationRegistry = getExecutiveJudgmentRecommendationBridgeRegistry()
): ExecutiveRecommendationValidation {
  const errors: string[] = [];

  errors.push(...duplicateValues(registry.supportedProducers).map((id) => `duplicate-producer:${id}`));
  errors.push(...duplicateValues(registry.supportedConsumers).map((id) => `duplicate-consumer:${id}`));
  errors.push(...duplicateValues(registry.supportedPayloadTypes).map((id) => `duplicate-payload-type:${id}`));
  errors.push(...duplicateValues(registry.supportedContractVersions).map((id) => `duplicate-contract-version:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  if (registry.supportedProducers.length === 0) errors.push("missing-producer-registration");
  if (registry.supportedConsumers.length === 0) errors.push("missing-consumer-registration");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!registry.extensionPolicy.metadataOnly || !registry.extensionPolicy.immutable) errors.push("boundary-violation");

  return validation(errors);
}

export function validateExecutiveJudgmentRecommendationBridgeManifest(manifest: ExecutiveRecommendationManifest): ExecutiveRecommendationValidation {
  const errors: string[] = [];

  if (manifest.platformId !== "nexora-executive-judgment-recommendation-bridge") errors.push("invalid-manifest-platform");
  if (manifest.bridgeId !== "executive-judgment-recommendation-bridge") errors.push("invalid-manifest-bridge");
  if (manifest.version !== "LAY-CONN-3") errors.push("invalid-manifest-version");
  if (!manifest.dependencies.includes("LAY-CONN-1")) errors.push("missing-dependency:LAY-CONN-1");
  if (!manifest.dependencies.includes("LAY-CONN-2")) errors.push("missing-dependency:LAY-CONN-2");
  if (!manifest.dependencies.includes("APP-JUDGE")) errors.push("missing-dependency:APP-JUDGE");
  if (!manifest.dependencies.includes("APP-RECOMMENDATION")) errors.push("missing-dependency:APP-RECOMMENDATION");
  if (manifest.compatibility.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!manifest.extensionPolicy.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("boundary-violation");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return validation(errors);
}
