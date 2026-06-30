/**
 * LLM-7 — Cost manifest generation.
 */

import { getDefaultCostCompatibility, validateLlmCostVersionCompatibility } from "./llmCostValidation.ts";
import { aggregateLlmCost } from "./llmCostAggregation.ts";
import { LLM_COST_CONTRACT_VERSION } from "./llmCostContracts.ts";
import type { LlmCostManifest, LlmCostRecord } from "./llmCostTypes.ts";

export function getLlmCostManifest(records: readonly LlmCostRecord[]): LlmCostManifest {
  const versionValidation = validateLlmCostVersionCompatibility();
  return Object.freeze({
    manifestId: `cost-manifest-${records.length}`,
    estimatorVersion: LLM_COST_CONTRACT_VERSION,
    totalRecords: records.length,
    aggregationSummary: aggregateLlmCost(records),
    validationResult: versionValidation.valid ? "valid" : "invalid",
    compatibility: getDefaultCostCompatibility(),
    readOnly: true as const,
  });
}
