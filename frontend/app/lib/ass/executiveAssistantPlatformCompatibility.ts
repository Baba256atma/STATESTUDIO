/**
 * ASS-9 — Platform compatibility matrix (metadata only).
 */

import { ASS_ARCHITECTURE_STACK } from "./executiveAssistantPlatformContracts.ts";
import { ASS_CERTIFIED_MVP_PHASE_KEYS } from "./executiveAssistantPlatformFreezeRegistry.ts";
import type {
  ExecutiveAssistantPlatformCompatibilityEntry,
  ExecutiveAssistantPlatformCompatibilityMatrix,
} from "./executiveAssistantPlatformFreezeTypes.ts";

function entry(
  sourceLayer: string,
  targetLayer: string,
  compatible: boolean,
  relationship: string
): ExecutiveAssistantPlatformCompatibilityEntry {
  return Object.freeze({ sourceLayer, targetLayer, compatible, relationship, readOnly: true as const });
}

export function buildExecutiveAssistantPlatformCompatibilityEntries(): readonly ExecutiveAssistantPlatformCompatibilityEntry[] {
  const entries: ExecutiveAssistantPlatformCompatibilityEntry[] = [];

  for (let index = 0; index < ASS_CERTIFIED_MVP_PHASE_KEYS.length - 1; index += 1) {
    const source = ASS_CERTIFIED_MVP_PHASE_KEYS[index];
    const target = ASS_CERTIFIED_MVP_PHASE_KEYS[index + 1];
    entries.push(entry(source, target, true, "additive_mvp_dependency"));
  }

  for (const phase of ASS_CERTIFIED_MVP_PHASE_KEYS) {
    entries.push(entry("CORE", phase, true, "core_reference_only"));
    entries.push(entry("KNL", phase, true, "knl_reference_only"));
    entries.push(entry("APP", phase, true, "app_consumes_ass_contracts"));
    entries.push(entry("LLM", phase, true, "llm_upstream_platform"));
    entries.push(entry("SMM", phase, true, "smm_upstream_platform"));
    entries.push(entry(phase, "CORE", true, "ass_respects_core_boundaries"));
  }

  entries.push(entry("APP", "ASS", true, "app_uses_ass_platform_contracts"));
  entries.push(entry("LLM", "ASS", true, "ass_builds_on_llm_foundation"));
  entries.push(entry("SMM", "ASS", true, "ass_consumes_smm_contracts"));
  entries.push(entry("ASS", "IDN", true, "idn_consumes_ass_identity_contracts"));
  entries.push(entry("ASS", "LAY", true, "lay_consumes_ass_orchestration_contracts"));
  entries.push(entry("ASS/10", "ASS", true, "future_ass_extension_additive"));
  entries.push(entry("ASS/11", "ASS", true, "future_ass_extension_additive"));

  for (const stackLayer of ASS_ARCHITECTURE_STACK) {
    if (stackLayer === "ASS") {
      continue;
    }
    entries.push(entry(stackLayer, "ASS/9", true, "architecture_stack_metadata_only"));
  }

  return Object.freeze(entries);
}

export function getExecutiveAssistantPlatformCompatibilityMatrix(): ExecutiveAssistantPlatformCompatibilityMatrix {
  const entries = buildExecutiveAssistantPlatformCompatibilityEntries();
  const requiredLayers = ["CORE", "KNL", "APP", "LLM", "SMM", "IDN", "LAY"];
  const covered = new Set(entries.map((item) => item.sourceLayer));
  const missing = requiredLayers.filter((layer) => !covered.has(layer));
  return Object.freeze({
    matrixId: "executive-assistant-platform-compatibility-matrix",
    entries,
    entryCount: entries.length,
    validationResult: missing.length === 0 ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
