import { ExecutiveReasoningJudgmentBridge } from "./executiveReasoningJudgmentBridgeContracts.ts";
import { getExecutiveReasoningJudgmentBridgeRegistry } from "./executiveReasoningJudgmentBridgeRegistry.ts";
import type {
  ExecutiveBridgeManifest,
  ExecutiveBridgeRegistry,
  ExecutiveBridgeValidation,
  ExecutiveReasoningJudgmentBridge as ExecutiveReasoningJudgmentBridgeContract,
} from "./executiveReasoningJudgmentBridgeTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveBridgeValidation {
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

export function validateExecutiveReasoningJudgmentBridge(
  bridge: ExecutiveReasoningJudgmentBridgeContract = ExecutiveReasoningJudgmentBridge,
  registry: ExecutiveBridgeRegistry = getExecutiveReasoningJudgmentBridgeRegistry()
): ExecutiveBridgeValidation {
  const errors: string[] = [];
  const producerSet = new Set(registry.supportedProducers);
  const consumerSet = new Set(registry.supportedConsumers);
  const payloadSet = new Set(registry.supportedPayloadTypes);
  const versionSet = new Set(registry.supportedContractVersions);

  if (!bridge.bridgeId) errors.push("missing-bridge-id");
  if (!producerSet.has(bridge.reasoningInput.producerId)) errors.push(`invalid-reasoning-input:${bridge.reasoningInput.producerId}`);
  if (!consumerSet.has(bridge.judgmentRequest.consumerId)) errors.push(`invalid-judgment-consumer:${bridge.judgmentRequest.consumerId}`);
  if (bridge.evidence.length === 0) errors.push("missing-evidence");
  if (bridge.constraints.length === 0) errors.push("missing-constraints");
  if (!versionSet.has(bridge.reasoningInput.contractVersion)) errors.push(`invalid-contract-version:${bridge.reasoningInput.contractVersion}`);
  if (!versionSet.has(bridge.judgmentRequest.contractVersion)) errors.push(`invalid-contract-version:${bridge.judgmentRequest.contractVersion}`);
  if (!bridge.metadata.metadataOnly || !bridge.metadata.immutable) errors.push("boundary-violation");

  const payloadTypes = [
    bridge.reasoningInput.payloadType,
    bridge.judgmentRequest.payloadType,
    bridge.context.payloadType,
    bridge.confidence.payloadType,
    bridge.trace.payloadType,
    ...bridge.evidence.map((entry) => entry.payloadType),
    ...bridge.constraints.map((entry) => entry.payloadType),
    ...bridge.assumptions.map((entry) => entry.payloadType),
  ];
  for (const payloadType of payloadTypes) {
    if (!payloadSet.has(payloadType)) errors.push(`unsupported-payload:${payloadType}`);
  }

  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");

  return validation(errors);
}

export function validateExecutiveReasoningJudgmentBridgeRegistry(
  registry: ExecutiveBridgeRegistry = getExecutiveReasoningJudgmentBridgeRegistry()
): ExecutiveBridgeValidation {
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

export function validateExecutiveReasoningJudgmentBridgeManifest(manifest: ExecutiveBridgeManifest): ExecutiveBridgeValidation {
  const errors: string[] = [];

  if (manifest.platformId !== "nexora-executive-reasoning-judgment-bridge") errors.push("invalid-manifest-platform");
  if (manifest.bridgeId !== "executive-reasoning-judgment-bridge") errors.push("invalid-manifest-bridge");
  if (manifest.supportedVersions.length === 0) errors.push("missing-supported-versions");
  if (!manifest.dependencies.includes("LAY-CONN-1")) errors.push("missing-dependency:LAY-CONN-1");
  if (!manifest.dependencies.includes("APP-REASON")) errors.push("missing-dependency:APP-REASON");
  if (!manifest.dependencies.includes("APP-JUDGE")) errors.push("missing-dependency:APP-JUDGE");
  if (manifest.compatibility.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!manifest.extensionPolicy.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("boundary-violation");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return validation(errors);
}
