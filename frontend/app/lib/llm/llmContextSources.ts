/**
 * LLM-5 — Context source definitions.
 */

import {
  LLM_CONTEXT_CONTRACT_VERSION,
  LLM_CONTEXT_PLACEHOLDER_SOURCE_KEYS,
  LLM_CONTEXT_SOURCE_KEYS,
  LLM_CONTEXT_SOURCE_LABELS,
} from "./llmContextContracts.ts";
import type { LlmContextSourceKey, LlmContextSourceRegistration } from "./llmContextTypes.ts";

export function isLlmContextSourceKey(value: string): value is LlmContextSourceKey {
  return (LLM_CONTEXT_SOURCE_KEYS as readonly string[]).includes(value);
}

export function isLlmContextPlaceholderSource(sourceKey: LlmContextSourceKey): boolean {
  return (LLM_CONTEXT_PLACEHOLDER_SOURCE_KEYS as readonly string[]).includes(sourceKey);
}

export function buildLlmContextSourceRegistration(
  sourceKey: LlmContextSourceKey,
  timestamp: string
): LlmContextSourceRegistration {
  return Object.freeze({
    sourceId: `context-source-${sourceKey}`,
    sourceKey,
    label: LLM_CONTEXT_SOURCE_LABELS[sourceKey],
    description: `Abstract ${LLM_CONTEXT_SOURCE_LABELS[sourceKey]} — approved references only, no direct data access.`,
    version: LLM_CONTEXT_CONTRACT_VERSION,
    placeholder: isLlmContextPlaceholderSource(sourceKey),
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function getAllLlmContextSourceKeys(): readonly LlmContextSourceKey[] {
  return LLM_CONTEXT_SOURCE_KEYS;
}

export function getLlmContextSourceOrder(sourceKey: LlmContextSourceKey): number {
  return LLM_CONTEXT_SOURCE_KEYS.indexOf(sourceKey);
}
