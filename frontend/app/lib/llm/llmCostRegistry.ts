/**
 * LLM-7 — Cost registry (in-memory, no persistence).
 */

import { buildLlmTokenMeterLayer } from "./llmTokenExports.ts";
import { LLM_COST_CONTRACT_VERSION, LLM_COST_DEFAULT_LIMITS } from "./llmCostContracts.ts";
import { aggregateLlmCost, lookupLlmCostAggregation } from "./llmCostAggregation.ts";
import {
  buildLlmCostRecordFromTokenRecord,
  estimateLlmCost,
} from "./llmCostEstimator.ts";
import {
  buildLlmCostPricingProfile,
  lookupPricingProfile,
  seedDefaultPricingProfiles,
} from "./llmCostPricing.ts";
import type {
  LlmCostAggregationQuery,
  LlmCostEstimateInput,
  LlmCostPricingProfile,
  LlmCostRecord,
  LlmCostRecordResult,
  LlmCostRegistry,
} from "./llmCostTypes.ts";
import {
  validateDuplicateLlmCostRecord,
  validateLlmCostRecord,
  validatePricingProfileCompatibility,
} from "./llmCostValidation.ts";

const pricingProfileRegistry = new Map<string, LlmCostPricingProfile>();
const costRecordRegistry = new Map<string, LlmCostRecord>();
const tokenRecordIndex = new Set<string>();

export function resetLlmCostRegistryForTests(): void {
  pricingProfileRegistry.clear();
  costRecordRegistry.clear();
  tokenRecordIndex.clear();
}

function createResult(success: boolean, reason: string, record: LlmCostRecord | null): LlmCostRecordResult {
  return Object.freeze({ success, reason, record, readOnly: true as const });
}

export function registerPricingProfile(profile: LlmCostPricingProfile): LlmCostPricingProfile {
  pricingProfileRegistry.set(profile.pricingProfileId, profile);
  return profile;
}

export function registerProviderModelPricingProfile(
  providerKey: LlmCostPricingProfile["providerKey"],
  modelKey: string,
  effectiveDate: string
): LlmCostPricingProfile {
  return registerPricingProfile(buildLlmCostPricingProfile(providerKey, modelKey, effectiveDate));
}

export function getLlmCostRegistry(): LlmCostRegistry {
  const pricingProfiles = Object.freeze([...pricingProfileRegistry.values()]);
  const records = Object.freeze([...costRecordRegistry.values()].sort((left, right) =>
    left.timestamp.localeCompare(right.timestamp)
  ));
  return Object.freeze({
    pricingProfiles,
    records,
    recordCount: records.length,
    aggregations: aggregateLlmCost(records),
    readOnly: true as const,
  });
}

export function recordLlmCost(
  input: LlmCostEstimateInput,
  costRecordId: string,
  timestamp: string = new Date(0).toISOString()
): LlmCostRecordResult {
  const duplicateValidation = validateDuplicateLlmCostRecord(
    [...costRecordRegistry.keys()],
    costRecordId,
    input.tokenRecord.recordId,
    [...tokenRecordIndex]
  );
  if (!duplicateValidation.valid) {
    return createResult(false, duplicateValidation.issues[0]?.message ?? "Duplicate cost record.", null);
  }
  if (costRecordRegistry.size >= LLM_COST_DEFAULT_LIMITS.maxCostRecords && !costRecordRegistry.has(costRecordId)) {
    return createResult(false, "Cost registry limit reached.", null);
  }

  const profiles = getLlmCostRegistry().pricingProfiles;
  const estimate = estimateLlmCost(input, profiles);
  if (!estimate) {
    return createResult(false, `No pricing profile for ${input.tokenRecord.providerKey}/${input.tokenRecord.modelKey}.`, null);
  }

  const profile = lookupPricingProfile(profiles, input.tokenRecord.providerKey, input.tokenRecord.modelKey);
  const record = buildLlmCostRecordFromTokenRecord(input.tokenRecord, estimate, costRecordId, timestamp);
  const validation = validateLlmCostRecord(record);
  if (!validation.valid) {
    return createResult(false, validation.issues[0]?.message ?? "Cost record validation failed.", null);
  }
  if (profile) {
    const profileValidation = validatePricingProfileCompatibility(record, profile);
    if (!profileValidation.valid) {
      return createResult(false, profileValidation.issues[0]?.message ?? "Pricing profile compatibility failed.", null);
    }
  }

  costRecordRegistry.set(costRecordId, record);
  tokenRecordIndex.add(input.tokenRecord.recordId);
  return createResult(true, "Cost record created.", record);
}

export function lookupLlmCostRecord(costRecordId: string): LlmCostRecord | null {
  return costRecordRegistry.get(costRecordId) ?? null;
}

export function lookupLlmCostAggregationFromRegistry(query: LlmCostAggregationQuery) {
  return lookupLlmCostAggregation(getLlmCostRegistry().records, query);
}

export function ensureLlmCostDependenciesReady(timestamp: string): boolean {
  const tokenLayer = buildLlmTokenMeterLayer(timestamp);
  if (!tokenLayer.success) {
    return false;
  }
  for (const profile of seedDefaultPricingProfiles(timestamp)) {
    registerPricingProfile(profile);
  }
  return true;
}

export function getLlmCostRegistryVersion(): typeof LLM_COST_CONTRACT_VERSION {
  return LLM_COST_CONTRACT_VERSION;
}
