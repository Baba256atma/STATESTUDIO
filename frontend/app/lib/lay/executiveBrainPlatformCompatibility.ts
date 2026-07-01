import { listExecutiveBrainPhases } from "./executiveBrainPlatformFreezeRegistry.ts";
import type {
  ExecutiveBrainCompatibilityMatrix,
  ExecutiveBrainPlatformExtensionPolicy,
  ExecutiveBrainPlatformLayerCompatibilityEntry,
  ExecutiveBrainPlatformPhaseCompatibilityEntry,
} from "./executiveBrainPlatformFreezeTypes.ts";

const VERIFIED_LAYERS = Object.freeze(["CORE", "DS", "INT", "KNL", "LLM", "APP", "SMM", "ASS", "IDN"] as const);
const FUTURE_LAYERS = Object.freeze(["DOM", "STE", "BUS", "OPS"] as const);

function phaseEntry(
  consumerPhaseId: ExecutiveBrainPlatformPhaseCompatibilityEntry["consumerPhaseId"],
  providerPhaseId: ExecutiveBrainPlatformPhaseCompatibilityEntry["providerPhaseId"]
): ExecutiveBrainPlatformPhaseCompatibilityEntry {
  return Object.freeze({
    consumerPhaseId,
    providerPhaseId,
    compatible: true,
    contract: "public-exports",
  });
}

function layerEntry(
  sourceLayer: string,
  targetLayer: string,
  relationship: string,
  status: "verified" | "future"
): ExecutiveBrainPlatformLayerCompatibilityEntry {
  return Object.freeze({
    sourceLayer,
    targetLayer,
    compatible: true,
    relationship,
    status,
  });
}

function buildPhaseCompatibilityEntries(): readonly ExecutiveBrainPlatformPhaseCompatibilityEntry[] {
  const entries: ExecutiveBrainPlatformPhaseCompatibilityEntry[] = [];
  for (const phase of listExecutiveBrainPhases()) {
    for (const providerPhaseId of phase.consumes) {
      entries.push(phaseEntry(phase.phaseId, providerPhaseId));
    }
  }
  return Object.freeze(entries);
}

function buildLayerCompatibilityEntries(): readonly ExecutiveBrainPlatformLayerCompatibilityEntry[] {
  const entries: ExecutiveBrainPlatformLayerCompatibilityEntry[] = [];

  for (const layer of VERIFIED_LAYERS) {
    entries.push(layerEntry("LAY", layer, "lay_respects_upstream_layer_boundaries", "verified"));
    entries.push(layerEntry(layer, "LAY", "upstream_layer_consumes_lay_contracts", "verified"));
  }

  for (const layer of FUTURE_LAYERS) {
    entries.push(layerEntry(layer, "LAY", "future_layer_consumes_lay_contracts", "future"));
    entries.push(layerEntry("LAY", layer, "lay_declares_future_compatibility", "future"));
  }

  entries.push(layerEntry("LAY", "LAY/12", "architecture_stack_metadata_only", "verified"));

  return Object.freeze(entries);
}

const PHASE_COMPATIBILITY_MATRIX: readonly ExecutiveBrainPlatformPhaseCompatibilityEntry[] = buildPhaseCompatibilityEntries();
const LAYER_COMPATIBILITY_MATRIX: readonly ExecutiveBrainPlatformLayerCompatibilityEntry[] = buildLayerCompatibilityEntries();

const EXTENSION_POLICY: ExecutiveBrainPlatformExtensionPolicy = Object.freeze({
  frozen: true,
  extensionMode: "additive-only",
  breakingChangesAllowed: false,
  privateImportsAllowed: false,
  runtimeBehaviorAllowed: false,
  requiresNewPhase: true,
  notes: Object.freeze([
    "Certified LAY public APIs are frozen.",
    "Future executive brain changes must be additive and released as later LAY phases.",
    "Consumers must import through public engine and foundation exports only.",
    "No runtime intelligence, LLM calls, or platform state mutation is permitted in LAY-12.",
  ]),
});

export function getExecutiveBrainPlatformExtensionPolicy(): ExecutiveBrainPlatformExtensionPolicy {
  return EXTENSION_POLICY;
}

export function getExecutiveBrainCompatibilityMatrix(): ExecutiveBrainCompatibilityMatrix {
  const phaseEntries = PHASE_COMPATIBILITY_MATRIX;
  const layerEntries = LAYER_COMPATIBILITY_MATRIX;
  const verifiedLayersCovered = VERIFIED_LAYERS.every((layer) =>
    layerEntries.some((entry) => entry.sourceLayer === "LAY" && entry.targetLayer === layer && entry.status === "verified")
  );
  const futureLayersCovered = FUTURE_LAYERS.every((layer) =>
    layerEntries.some((entry) => entry.sourceLayer === layer && entry.targetLayer === "LAY" && entry.status === "future")
  );

  return Object.freeze({
    matrixId: "executive-brain-platform-compatibility-matrix",
    phaseEntries,
    layerEntries,
    entryCount: phaseEntries.length + layerEntries.length,
    validationResult: verifiedLayersCovered && futureLayersCovered ? "valid" : "invalid",
  });
}
