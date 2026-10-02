/**
 * LLM-MVP:3 — execute a provider-neutral Nexora LLM runtime request.
 *
 * Network and vendor SDKs belong in a server adapter, not CC.
 * This module normalizes adapter output and does not mutate Nexora truth.
 */

import { nexoraLlmManagementContextIdentity } from "./nexoraLlmManagementContext.ts";
import {
  NEXORA_LLM_PARTICIPANT_SYSTEM_INSTRUCTION,
  NEXORA_LLM_RUNTIME_DEFAULT_TIMEOUT_MS,
  NexoraLlmRuntimeAdapterError,
  type NexoraLlmProviderCompletion,
  type NexoraLlmRuntimeAdapter,
  type NexoraLlmRuntimeCost,
  type NexoraLlmRuntimeFailure,
  type NexoraLlmRuntimeFailureCategory,
  type NexoraLlmRuntimeMeta,
  type NexoraLlmRuntimeRequest,
  type NexoraLlmRuntimeResult,
  type NexoraLlmRuntimeUsage,
} from "./nexoraLlmRuntimeContract.ts";

const EMPTY_USAGE: NexoraLlmRuntimeUsage = Object.freeze({
  inputTokens: null,
  outputTokens: null,
  totalTokens: null,
});

function freezeResult(result: NexoraLlmRuntimeResult): NexoraLlmRuntimeResult {
  return Object.freeze({
    ...result,
    failure: result.failure ? Object.freeze({ ...result.failure }) : null,
    runtime: Object.freeze({ ...result.runtime }),
    usage: Object.freeze({ ...result.usage }),
    cost: result.cost ? Object.freeze({ ...result.cost }) : null,
  });
}

function tokenOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function usageOf(completion: NexoraLlmProviderCompletion | null): NexoraLlmRuntimeUsage {
  const raw = completion?.usage;
  if (!raw) return EMPTY_USAGE;
  return Object.freeze({
    inputTokens: tokenOrNull(raw.inputTokens),
    outputTokens: tokenOrNull(raw.outputTokens),
    totalTokens: tokenOrNull(raw.totalTokens),
  });
}

function costOf(completion: NexoraLlmProviderCompletion | null): NexoraLlmRuntimeCost | null {
  const raw = completion?.cost;
  if (
    !raw ||
    typeof raw.amount !== "number" ||
    !Number.isFinite(raw.amount) ||
    typeof raw.currency !== "string" ||
    !raw.currency.trim()
  ) {
    return null;
  }
  return Object.freeze({ amount: raw.amount, currency: raw.currency.trim() });
}

function failed(input: {
  readonly category: NexoraLlmRuntimeFailureCategory;
  readonly message: string;
  readonly runtime: NexoraLlmRuntimeMeta;
  readonly usage?: NexoraLlmRuntimeUsage;
  readonly cost?: NexoraLlmRuntimeCost | null;
}): NexoraLlmRuntimeResult {
  const failure: NexoraLlmRuntimeFailure = Object.freeze({
    category: input.category,
    message: input.message,
  });
  return freezeResult({
    contribution: null,
    status: "failed",
    failure,
    runtime: input.runtime,
    usage: input.usage ?? EMPTY_USAGE,
    cost: input.cost ?? null,
  });
}

export function buildNexoraLlmRuntimeUserPayload(
  request: NexoraLlmRuntimeRequest,
): string {
  return JSON.stringify({
    turnId: request.turnId,
    experienceStatus: request.experienceStatus,
    deterministicResponse: request.deterministicResponse,
    managementContext: request.managementContext,
  });
}

function isRuntimeRequest(value: unknown): value is NexoraLlmRuntimeRequest {
  if (value == null || typeof value !== "object") return false;
  const request = value as Partial<NexoraLlmRuntimeRequest>;
  return (
    typeof request.turnId === "string" &&
    request.turnId.trim() !== "" &&
    typeof request.deterministicResponse === "string" &&
    typeof request.experienceStatus === "string" &&
    request.managementContext != null &&
    typeof request.managementContext === "object" &&
    request.managementContext.identity === nexoraLlmManagementContextIdentity
  );
}

function textOf(completion: NexoraLlmProviderCompletion): string | null {
  const text = completion.text;
  if (typeof text !== "string") return null;
  const trimmed = text.trim();
  return trimmed === "" ? "" : trimmed;
}

export function executeNexoraLlmRuntime(
  request: NexoraLlmRuntimeRequest | null | undefined,
  adapter: NexoraLlmRuntimeAdapter | null | undefined,
  options?: Readonly<{ readonly timeoutMs?: number }>,
): NexoraLlmRuntimeResult {
  const timeoutMs =
    options?.timeoutMs != null && options.timeoutMs > 0
      ? options.timeoutMs
      : NEXORA_LLM_RUNTIME_DEFAULT_TIMEOUT_MS;
  const runtimeBase = Object.freeze({
    provider: adapter?.provider ?? "none",
    model: null as string | null,
    requestId: null as string | null,
    latencyMs: 0,
  });

  if (!adapter) {
    return failed({
      category: "NOT_CONFIGURED",
      message: "Nexora LLM runtime adapter is not configured.",
      runtime: runtimeBase,
    });
  }
  if (!isRuntimeRequest(request)) {
    return failed({
      category: "INVALID_RESPONSE",
      message: "Nexora LLM runtime request is invalid.",
      runtime: { ...runtimeBase, provider: adapter.provider },
    });
  }

  const started = Date.now();
  try {
    const completion = adapter.complete(
      Object.freeze({
        request,
        systemInstruction: NEXORA_LLM_PARTICIPANT_SYSTEM_INSTRUCTION,
        userPayload: buildNexoraLlmRuntimeUserPayload(request),
        timeoutMs,
      }),
    );
    const latencyMs = Date.now() - started;
    const runtime: NexoraLlmRuntimeMeta = Object.freeze({
      provider: completion.provider?.trim() || adapter.provider,
      model: typeof completion.model === "string" ? completion.model : null,
      requestId:
        typeof completion.requestId === "string" ? completion.requestId : null,
      latencyMs,
    });
    if (completion == null || typeof completion !== "object") {
      return failed({
        category: "INVALID_RESPONSE",
        message: "Provider completion was not an object.",
        runtime,
      });
    }
    const text = textOf(completion);
    const usage = usageOf(completion);
    const cost = costOf(completion);
    if (text == null) {
      return failed({
        category: "INVALID_RESPONSE",
        message: "Provider completion text was malformed.",
        runtime,
        usage,
        cost,
      });
    }
    if (text === "") {
      return failed({
        category: "EMPTY_RESPONSE",
        message: "Provider returned an empty contribution.",
        runtime,
        usage,
        cost,
      });
    }
    return freezeResult({
      contribution: text,
      status: "ok",
      failure: null,
      runtime,
      usage,
      cost,
    });
  } catch (error) {
    const latencyMs = Date.now() - started;
    if (error instanceof NexoraLlmRuntimeAdapterError) {
      return failed({
        category: error.category,
        message: error.message,
        runtime: { ...runtimeBase, provider: adapter.provider, latencyMs },
      });
    }
    return failed({
      category: "PROVIDER_ERROR",
      message: "Provider adapter failed.",
      runtime: { ...runtimeBase, provider: adapter.provider, latencyMs },
    });
  }
}
