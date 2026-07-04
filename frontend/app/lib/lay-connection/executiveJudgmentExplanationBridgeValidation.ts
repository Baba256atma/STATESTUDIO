import { ExecutiveJudgmentExplanationBridge } from "./executiveJudgmentExplanationBridgeContracts.ts";
import { getExecutiveJudgmentExplanationBridgeRegistry } from "./executiveJudgmentExplanationBridgeRegistry.ts";
import type {
  ExecutiveExplanationManifest,
  ExecutiveExplanationRegistry,
  ExecutiveExplanationValidation,
  ExecutiveJudgmentExplanationBridge as ExecutiveJudgmentExplanationBridgeContract,
} from "./executiveJudgmentExplanationBridgeTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveExplanationValidation {
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

export function validateExecutiveJudgmentExplanationBridge(
  bridge: ExecutiveJudgmentExplanationBridgeContract = ExecutiveJudgmentExplanationBridge,
  registry: ExecutiveExplanationRegistry = getExecutiveJudgmentExplanationBridgeRegistry()
): ExecutiveExplanationValidation {
  const errors: string[] = [];
  const producerSet = new Set(registry.supportedProducers);
  const consumerSet = new Set(registry.supportedConsumers);
  const payloadSet = new Set(registry.supportedPayloadTypes);
  const targetSet = new Set(registry.supportedExplanationTargets);
  const versionSet = new Set(registry.supportedContractVersions);

  if (!bridge.bridgeId) errors.push("missing-bridge-id");
  if (!producerSet.has(bridge.judgmentInput.producerId)) errors.push(`invalid-judgment-result:${bridge.judgmentInput.producerId}`);
  if (!consumerSet.has(bridge.explanationRequest.consumerId)) errors.push(`invalid-explanation-consumer:${bridge.explanationRequest.consumerId}`);
  if (!targetSet.has(bridge.explanationRequest.target)) errors.push(`invalid-explanation-target:${bridge.explanationRequest.target}`);
  if (!bridge.rationale.rationaleId) errors.push("missing-rationale");
  if (bridge.evidence.length === 0) errors.push("missing-evidence-summary");
  if (bridge.constraints.length === 0) errors.push("missing-constraint-summary");
  if (bridge.tradeoffs.length === 0) errors.push("missing-tradeoff-summary");
  if (!bridge.confidence.confidenceSummaryId) errors.push("missing-confidence-summary");
  if (!versionSet.has(bridge.judgmentInput.contractVersion)) errors.push(`invalid-contract-version:${bridge.judgmentInput.contractVersion}`);
  if (!versionSet.has(bridge.explanationRequest.contractVersion)) errors.push(`invalid-contract-version:${bridge.explanationRequest.contractVersion}`);
  if (!bridge.metadata.metadataOnly || !bridge.metadata.immutable) errors.push("boundary-violation");

  const payloadTypes = [
    bridge.judgmentInput.payloadType,
    bridge.explanationRequest.payloadType,
    bridge.context.payloadType,
    bridge.rationale.payloadType,
    bridge.confidence.payloadType,
    bridge.trace.payloadType,
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

export function validateExecutiveJudgmentExplanationBridgeRegistry(
  registry: ExecutiveExplanationRegistry = getExecutiveJudgmentExplanationBridgeRegistry()
): ExecutiveExplanationValidation {
  const errors: string[] = [];

  errors.push(...duplicateValues(registry.supportedProducers).map((id) => `duplicate-producer:${id}`));
  errors.push(...duplicateValues(registry.supportedConsumers).map((id) => `duplicate-consumer:${id}`));
  errors.push(...duplicateValues(registry.supportedPayloadTypes).map((id) => `duplicate-payload-type:${id}`));
  errors.push(...duplicateValues(registry.supportedExplanationTargets).map((id) => `duplicate-explanation-target:${id}`));
  errors.push(...duplicateValues(registry.supportedContractVersions).map((id) => `duplicate-contract-version:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  if (registry.supportedProducers.length === 0) errors.push("missing-producer-registration");
  if (registry.supportedConsumers.length === 0) errors.push("missing-consumer-registration");
  if (registry.supportedExplanationTargets.length === 0) errors.push("missing-explanation-targets");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!registry.extensionPolicy.metadataOnly || !registry.extensionPolicy.immutable) errors.push("boundary-violation");

  return validation(errors);
}

export function validateExecutiveJudgmentExplanationBridgeManifest(manifest: ExecutiveExplanationManifest): ExecutiveExplanationValidation {
  const errors: string[] = [];

  if (manifest.platformId !== "nexora-executive-judgment-explanation-bridge") errors.push("invalid-manifest-platform");
  if (manifest.bridgeId !== "executive-judgment-explanation-bridge") errors.push("invalid-manifest-bridge");
  if (manifest.version !== "LAY-CONN-4") errors.push("invalid-manifest-version");
  if (!manifest.dependencies.includes("LAY-CONN-1")) errors.push("missing-dependency:LAY-CONN-1");
  if (!manifest.dependencies.includes("LAY-CONN-2")) errors.push("missing-dependency:LAY-CONN-2");
  if (!manifest.dependencies.includes("LAY-CONN-3")) errors.push("missing-dependency:LAY-CONN-3");
  if (!manifest.dependencies.includes("APP-JUDGE")) errors.push("missing-dependency:APP-JUDGE");
  if (!manifest.dependencies.includes("EXECUTIVE-EXPLANATION")) errors.push("missing-dependency:EXECUTIVE-EXPLANATION");
  if (manifest.compatibility.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!manifest.extensionPolicy.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("boundary-violation");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return validation(errors);
}
