/**
 * LLM-12 — Platform compatibility matrix (metadata only).
 */

import { LLM_ARCHITECTURE_STACK } from "./llmPlatformContracts.ts";
import { LLM_CERTIFIED_MVP_PHASE_KEYS } from "./llmPlatformFreezeRegistry.ts";
import type { LlmPlatformCompatibilityEntry, LlmPlatformCompatibilityMatrix } from "./llmPlatformFreezeTypes.ts";

function entry(
  sourceLayer: string,
  targetLayer: string,
  compatible: boolean,
  relationship: string
): LlmPlatformCompatibilityEntry {
  return Object.freeze({ sourceLayer, targetLayer, compatible, relationship, readOnly: true as const });
}

export function buildLlmPlatformCompatibilityEntries(): readonly LlmPlatformCompatibilityEntry[] {
  const entries: LlmPlatformCompatibilityEntry[] = [];

  for (let index = 0; index < LLM_CERTIFIED_MVP_PHASE_KEYS.length - 1; index += 1) {
    const source = LLM_CERTIFIED_MVP_PHASE_KEYS[index];
    const target = LLM_CERTIFIED_MVP_PHASE_KEYS[index + 1];
    entries.push(entry(source, target, true, "additive_mvp_dependency"));
  }

  for (const phase of LLM_CERTIFIED_MVP_PHASE_KEYS) {
    entries.push(entry("APP", phase, true, "app_consumes_llm_contracts"));
    entries.push(entry("KNL", phase, true, "knl_reference_only_no_direct_provider_calls"));
    entries.push(entry(phase, "CORE", true, "llm_respects_core_boundaries"));
  }

  entries.push(entry("APP", "LLM", true, "app_uses_llm_platform_gateway"));
  entries.push(entry("KNL", "LLM", true, "knl_never_calls_providers_directly"));
  entries.push(entry("LLM", "SMM", true, "future_smm_compatibility_reserved"));
  entries.push(entry("LLM", "ASS", true, "future_ass_compatibility_reserved"));
  entries.push(entry("LLM", "LAY", true, "future_lay_compatibility_reserved"));
  entries.push(entry("LLM/13", "LLM", false, "enterprise_cache_outside_mvp_path"));
  entries.push(entry("LLM", "LLM/13", false, "mvp_does_not_depend_on_enterprise_cache"));

  for (const stackLayer of LLM_ARCHITECTURE_STACK) {
    if (stackLayer === "LLM") {
      continue;
    }
    entries.push(entry(stackLayer, "LLM/12", true, "architecture_stack_metadata_only"));
  }

  return Object.freeze(entries);
}

export function getLlmPlatformCompatibilityMatrix(): LlmPlatformCompatibilityMatrix {
  const entries = buildLlmPlatformCompatibilityEntries();
  const invalid = entries.filter((item) => item.sourceLayer === "LLM/13" && item.compatible);
  return Object.freeze({
    matrixId: "llm-platform-compatibility-matrix",
    entries,
    entryCount: entries.length,
    validationResult: invalid.length === 0 ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
