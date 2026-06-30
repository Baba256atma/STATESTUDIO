/**
 * SMM-8 — Platform compatibility matrix (metadata only).
 */

import { SMM_ARCHITECTURE_STACK } from "./smmPlatformContracts.ts";
import { SMM_CERTIFIED_MVP_PHASE_KEYS } from "./sharedMentalModelPlatformFreezeRegistry.ts";
import type {
  SharedMentalModelPlatformCompatibilityEntry,
  SharedMentalModelPlatformCompatibilityMatrix,
} from "./sharedMentalModelPlatformFreezeTypes.ts";

function entry(
  sourceLayer: string,
  targetLayer: string,
  compatible: boolean,
  relationship: string
): SharedMentalModelPlatformCompatibilityEntry {
  return Object.freeze({ sourceLayer, targetLayer, compatible, relationship, readOnly: true as const });
}

export function buildSharedMentalModelPlatformCompatibilityEntries(): readonly SharedMentalModelPlatformCompatibilityEntry[] {
  const entries: SharedMentalModelPlatformCompatibilityEntry[] = [];

  for (let index = 0; index < SMM_CERTIFIED_MVP_PHASE_KEYS.length - 1; index += 1) {
    const source = SMM_CERTIFIED_MVP_PHASE_KEYS[index];
    const target = SMM_CERTIFIED_MVP_PHASE_KEYS[index + 1];
    entries.push(entry(source, target, true, "additive_mvp_dependency"));
  }

  for (const phase of SMM_CERTIFIED_MVP_PHASE_KEYS) {
    entries.push(entry("CORE", phase, true, "core_reference_only"));
    entries.push(entry("KNL", phase, true, "knl_reference_only"));
    entries.push(entry("APP", phase, true, "app_consumes_smm_contracts"));
    entries.push(entry("LLM", phase, true, "llm_upstream_platform"));
    entries.push(entry(phase, "CORE", true, "smm_respects_core_boundaries"));
  }

  entries.push(entry("APP", "SMM", true, "app_uses_smm_platform_contracts"));
  entries.push(entry("LLM", "SMM", true, "smm_builds_on_llm_foundation"));
  entries.push(entry("SMM", "ASS", true, "ass_consumes_smm_contracts"));
  entries.push(entry("SMM", "IDN", true, "idn_consumes_smm_identity_contracts"));
  entries.push(entry("SMM", "LAY", true, "lay_consumes_smm_query_contracts"));
  entries.push(entry("SMM/9", "SMM", true, "future_smm_extension_additive"));
  entries.push(entry("SMM/10", "SMM", true, "future_smm_extension_additive"));

  for (const stackLayer of SMM_ARCHITECTURE_STACK) {
    if (stackLayer === "SMM") {
      continue;
    }
    entries.push(entry(stackLayer, "SMM/8", true, "architecture_stack_metadata_only"));
  }

  return Object.freeze(entries);
}

export function getSharedMentalModelPlatformCompatibilityMatrix(): SharedMentalModelPlatformCompatibilityMatrix {
  const entries = buildSharedMentalModelPlatformCompatibilityEntries();
  const requiredLayers = ["CORE", "KNL", "APP", "LLM", "ASS", "IDN", "LAY"];
  const covered = new Set(entries.map((item) => item.sourceLayer));
  const missing = requiredLayers.filter((layer) => !covered.has(layer));
  return Object.freeze({
    matrixId: "smm-platform-compatibility-matrix",
    entries,
    entryCount: entries.length,
    validationResult: missing.length === 0 ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
