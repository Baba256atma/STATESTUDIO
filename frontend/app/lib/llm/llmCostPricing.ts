/**
 * LLM-7 — Provider/model pricing profiles (deterministic placeholders).
 */

import { LLM_PROVIDER_KEYS } from "./llmPlatformContracts.ts";
import {
  LLM_COST_DEFAULT_CURRENCY,
  LLM_COST_PRICING_VERSION,
} from "./llmCostContracts.ts";
import type { LlmCostPricingProfile } from "./llmCostTypes.ts";

const PLACEHOLDER_PRICING: Readonly<Record<string, { input: number; output: number }>> = Object.freeze({
  "gpt:gpt-4o-mini": Object.freeze({ input: 0.00000015, output: 0.0000006 }),
  "gpt:gpt-4o": Object.freeze({ input: 0.0000025, output: 0.00001 }),
  "claude:claude-3-5-sonnet": Object.freeze({ input: 0.000003, output: 0.000015 }),
  "claude:claude-3-haiku": Object.freeze({ input: 0.00000025, output: 0.00000125 }),
  "gemini:gemini-1.5-pro": Object.freeze({ input: 0.00000125, output: 0.000005 }),
  "ollama:llama3": Object.freeze({ input: 0, output: 0 }),
  "local_models:local-default": Object.freeze({ input: 0, output: 0 }),
  "future_providers:future-default": Object.freeze({ input: 0.000001, output: 0.000002 }),
});

const DEFAULT_PRICING = Object.freeze({ input: 0.000001, output: 0.000002 });

export function buildPricingProfileId(providerKey: string, modelKey: string): string {
  return `pricing-profile-${providerKey}-${modelKey}`;
}

export function buildLlmCostPricingProfile(
  providerKey: (typeof LLM_PROVIDER_KEYS)[number],
  modelKey: string,
  effectiveDate: string
): LlmCostPricingProfile {
  const key = `${providerKey}:${modelKey}`;
  const rates = PLACEHOLDER_PRICING[key] ?? DEFAULT_PRICING;
  return Object.freeze({
    pricingProfileId: buildPricingProfileId(providerKey, modelKey),
    providerKey,
    modelKey,
    inputTokenPrice: rates.input,
    outputTokenPrice: rates.output,
    currency: LLM_COST_DEFAULT_CURRENCY,
    pricingVersion: LLM_COST_PRICING_VERSION,
    effectiveDate,
    readOnly: true as const,
  });
}

export function seedDefaultPricingProfiles(effectiveDate: string): readonly LlmCostPricingProfile[] {
  const profiles: LlmCostPricingProfile[] = [];
  const modelMap: Record<(typeof LLM_PROVIDER_KEYS)[number], readonly string[]> = {
    gpt: Object.freeze(["gpt-4o-mini", "gpt-4o"]),
    ollama: Object.freeze(["llama3"]),
    claude: Object.freeze(["claude-3-5-sonnet", "claude-3-haiku"]),
    gemini: Object.freeze(["gemini-1.5-pro"]),
    local_models: Object.freeze(["local-default"]),
    future_providers: Object.freeze(["future-default"]),
  };
  for (const providerKey of LLM_PROVIDER_KEYS) {
    for (const modelKey of modelMap[providerKey]) {
      profiles.push(buildLlmCostPricingProfile(providerKey, modelKey, effectiveDate));
    }
  }
  return Object.freeze(profiles);
}

export function lookupPricingProfile(
  profiles: readonly LlmCostPricingProfile[],
  providerKey: string,
  modelKey: string
): LlmCostPricingProfile | null {
  return profiles.find((profile) => profile.providerKey === providerKey && profile.modelKey === modelKey) ?? null;
}
