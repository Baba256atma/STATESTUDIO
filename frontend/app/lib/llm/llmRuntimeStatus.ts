/**
 * LLM-3 — Runtime status and lifecycle contracts.
 */

import { LLM_RUNTIME_LIFECYCLE_KEYS, LLM_RUNTIME_STATUS_KEYS } from "./llmRuntimeContracts.ts";
import type { LlmRuntimeLifecycleKey, LlmRuntimeStatusKey } from "./llmRuntimeTypes.ts";

export function isLlmRuntimeStatus(value: string): value is LlmRuntimeStatusKey {
  return (LLM_RUNTIME_STATUS_KEYS as readonly string[]).includes(value);
}

export function isLlmRuntimeLifecycle(value: string): value is LlmRuntimeLifecycleKey {
  return (LLM_RUNTIME_LIFECYCLE_KEYS as readonly string[]).includes(value);
}

export function isLlmRuntimeTerminalStatus(status: LlmRuntimeStatusKey): boolean {
  return status === "completed" || status === "failed" || status === "cancelled" || status === "timed_out" || status === "dry_run";
}

export function isLlmRuntimeSuccessStatus(status: LlmRuntimeStatusKey): boolean {
  return status === "completed" || status === "dry_run";
}

export function resolveLlmRuntimeStatusForDryRun(dryRun: boolean): LlmRuntimeStatusKey {
  return dryRun ? "dry_run" : "completed";
}

export function getAllLlmRuntimeStatusKeys(): readonly LlmRuntimeStatusKey[] {
  return LLM_RUNTIME_STATUS_KEYS;
}

export function getAllLlmRuntimeLifecycleKeys(): readonly LlmRuntimeLifecycleKey[] {
  return LLM_RUNTIME_LIFECYCLE_KEYS;
}

export function resolveNextLifecycleStage(current: LlmRuntimeLifecycleKey): LlmRuntimeLifecycleKey | null {
  const index = LLM_RUNTIME_LIFECYCLE_KEYS.indexOf(current);
  if (index < 0 || index >= LLM_RUNTIME_LIFECYCLE_KEYS.length - 1) {
    return null;
  }
  return LLM_RUNTIME_LIFECYCLE_KEYS[index + 1] ?? null;
}
