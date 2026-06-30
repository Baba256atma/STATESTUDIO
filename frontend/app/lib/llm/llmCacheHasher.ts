/**
 * LLM-13 — Deterministic cache hashing.
 */

import { createHash } from "node:crypto";

import { LLM_CACHE_KEY_SEPARATOR } from "./llmCacheContracts.ts";
import type { LlmCacheKeyInput } from "./llmCacheTypes.ts";

export function hashStableValue(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function buildPromptHash(prompt: string): string {
  return hashStableValue(prompt.trim());
}

export function buildContextHash(context: Readonly<Record<string, string>>): string {
  const normalized = Object.keys(context)
    .sort()
    .map((key) => `${key}=${context[key]}`)
    .join("&");
  return hashStableValue(normalized);
}

export function buildToolConfigurationHash(tools: readonly string[]): string {
  return hashStableValue([...tools].sort().join(","));
}

export function buildCacheKey(input: LlmCacheKeyInput): string {
  const parts = [
    input.provider,
    input.model,
    input.promptHash,
    input.contextHash,
    String(input.temperature),
    input.toolConfigurationHash,
    input.version,
  ];
  return hashStableValue(parts.join(LLM_CACHE_KEY_SEPARATOR));
}

export function buildCacheKeyDescriptor(input: LlmCacheKeyInput): string {
  return [
    input.provider,
    input.model,
    input.promptHash.slice(0, 12),
    input.contextHash.slice(0, 12),
    String(input.temperature),
    input.toolConfigurationHash.slice(0, 12),
    input.version,
  ].join(LLM_CACHE_KEY_SEPARATOR);
}
