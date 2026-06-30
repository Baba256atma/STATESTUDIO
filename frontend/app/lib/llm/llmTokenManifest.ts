/**
 * LLM-6 — Token meter manifest generation.
 */

import {
  LLM_TOKEN_COMPATIBLE_VERSIONS,
  LLM_TOKEN_CONTRACT_VERSION,
} from "./llmTokenContracts.ts";
import { aggregateTokenUsage } from "./llmTokenAggregation.ts";
import { validateTokenVersionCompatibility } from "./llmTokenValidation.ts";
import type { LlmTokenManifest, LlmTokenUsageRecord } from "./llmTokenTypes.ts";

export function getTokenManifest(records: readonly LlmTokenUsageRecord[]): LlmTokenManifest {
  const versionValidation = validateTokenVersionCompatibility();
  const aggregationSummary = aggregateTokenUsage(records);
  return Object.freeze({
    manifestId: `token-manifest-${records.length}`,
    meterVersion: LLM_TOKEN_CONTRACT_VERSION,
    totalRecords: records.length,
    aggregationSummary,
    validationResult: versionValidation.valid ? "valid" : "invalid",
    compatibility: Object.freeze([...LLM_TOKEN_COMPATIBLE_VERSIONS, LLM_TOKEN_CONTRACT_VERSION]),
    readOnly: true as const,
  });
}
