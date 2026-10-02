/**
 * LLM-MVP:3 — provider-neutral runtime contract (deterministic adapters).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { emptyNexoraLlmManagementContext } from "./nexoraLlmManagementContext.ts";
import {
  createNexoraLlmRuntimeParticipant,
} from "./nexoraLlmRuntimeParticipant.ts";
import {
  buildNexoraLlmRuntimeUserPayload,
  executeNexoraLlmRuntime,
} from "./nexoraLlmRuntime.ts";
import {
  NEXORA_LLM_PARTICIPANT_SYSTEM_INSTRUCTION,
  NEXORA_LLM_RUNTIME_BOUNDARY,
  NEXORA_LLM_RUNTIME_DEFAULT_TIMEOUT_MS,
  NexoraLlmRuntimeAdapterError,
  nexoraLlmFirstCertifiedAdapterIdentity,
  nexoraLlmFirstCertifiedAdapterProvider,
  nexoraLlmRuntimeIdentity,
  type NexoraLlmRuntimeAdapter,
  type NexoraLlmRuntimeAdapterInput,
  type NexoraLlmRuntimeRequest,
} from "./nexoraLlmRuntimeContract.ts";

function fixtureRequest(
  overrides?: Partial<NexoraLlmRuntimeRequest>,
): NexoraLlmRuntimeRequest {
  return Object.freeze({
    turnId: "turn-runtime-1",
    deterministicResponse: "Focused on Capacity.",
    experienceStatus: "applied",
    managementContext: emptyNexoraLlmManagementContext("Focus on Capacity"),
    ...overrides,
  });
}

function adapter(
  complete: NexoraLlmRuntimeAdapter["complete"],
  provider = "openai",
): NexoraLlmRuntimeAdapter {
  return Object.freeze({ provider, complete });
}

test("LLM-MVP:3 runtime identity is an adapter seam, not Nexora architecture", () => {
  assert.equal(nexoraLlmRuntimeIdentity, "LLM-MVP:3/ProviderNeutralServerRuntime");
  assert.equal(
    nexoraLlmFirstCertifiedAdapterIdentity,
    "LLM-MVP:3/OpenAITextAdapter",
  );
  assert.equal(nexoraLlmFirstCertifiedAdapterProvider, "openai");
  assert.equal(NEXORA_LLM_RUNTIME_BOUNDARY.ownsCostPolicy, false);
  assert.equal(NEXORA_LLM_RUNTIME_BOUNDARY.ownsProviderRouter, false);
  assert.equal(NEXORA_LLM_RUNTIME_BOUNDARY.ownsByollm, false);
  assert.equal(NEXORA_LLM_RUNTIME_BOUNDARY.ownsJevProvider, false);
  assert.equal(NEXORA_LLM_RUNTIME_BOUNDARY.managerVisibleContribution, false);
  assert.equal(NEXORA_LLM_RUNTIME_DEFAULT_TIMEOUT_MS, 8_000);
  assert.match(NEXORA_LLM_PARTICIPANT_SYSTEM_INSTRUCTION, /non-authoritative/);
});

test("A: request normalization reaches the adapter contract", () => {
  let seen: NexoraLlmRuntimeAdapterInput | null = null;
  const request = fixtureRequest();
  executeNexoraLlmRuntime(
    request,
    adapter((input) => {
      seen = input;
      return Object.freeze({ text: "Optional overlay." });
    }),
  );
  assert.ok(seen);
  assert.equal(seen.request, request);
  assert.equal(seen.timeoutMs, 8_000);
  assert.equal(seen.systemInstruction, NEXORA_LLM_PARTICIPANT_SYSTEM_INSTRUCTION);
  assert.equal(seen.userPayload, buildNexoraLlmRuntimeUserPayload(request));
  assert.match(seen.userPayload, /Focused on Capacity/);
  assert.match(seen.userPayload, /LLM-MVP:2\/ManagementContextProjection/);
  assert.doesNotMatch(seen.userPayload, /OPENAI_API_KEY|sk-/);
});

test("B: provider-native success becomes the normalized Nexora runtime result", () => {
  const result = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() =>
      Object.freeze({
        text: "  Optional overlay.  ",
        provider: "openai",
        model: "gpt-4o-mini",
        requestId: "resp_123",
      }),
    ),
  );
  assert.equal(result.status, "ok");
  assert.equal(result.contribution, "Optional overlay.");
  assert.equal(result.failure, null);
  assert.equal(result.runtime.provider, "openai");
  assert.equal(result.runtime.model, "gpt-4o-mini");
  assert.equal(result.runtime.requestId, "resp_123");
  assert.equal(typeof result.runtime.latencyMs, "number");
});

test("C: provider-reported usage is captured; missing usage stays null", () => {
  const reported = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() =>
      Object.freeze({
        text: "ok",
        usage: Object.freeze({
          inputTokens: 11,
          outputTokens: 7,
          totalTokens: 18,
        }),
      }),
    ),
  );
  assert.equal(reported.usage.inputTokens, 11);
  assert.equal(reported.usage.outputTokens, 7);
  assert.equal(reported.usage.totalTokens, 18);

  const missing = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() => Object.freeze({ text: "ok" })),
  );
  assert.equal(missing.usage.inputTokens, null);
  assert.equal(missing.usage.outputTokens, null);
  assert.equal(missing.usage.totalTokens, null);
  assert.equal(missing.cost, null);
});

test("D: runtime metadata is represented when available", () => {
  const result = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() =>
      Object.freeze({
        text: "ok",
        model: "gpt-4o-mini",
        requestId: "req_meta",
      }),
    ),
  );
  assert.equal(result.runtime.provider, "openai");
  assert.equal(result.runtime.model, "gpt-4o-mini");
  assert.equal(result.runtime.requestId, "req_meta");
  assert.ok((result.runtime.latencyMs ?? -1) >= 0);
});

test("E: malformed provider result becomes INVALID_RESPONSE", () => {
  const result = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() => Object.freeze({ text: { reply: "nope", actions: [] } })),
  );
  assert.equal(result.status, "failed");
  assert.equal(result.contribution, null);
  assert.equal(result.failure?.category, "INVALID_RESPONSE");
});

test("F: empty contribution is EMPTY_RESPONSE and does not replace D", () => {
  const result = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() => Object.freeze({ text: "   " })),
  );
  assert.equal(result.status, "failed");
  assert.equal(result.contribution, null);
  assert.equal(result.failure?.category, "EMPTY_RESPONSE");
});

test("G: provider error becomes normalized failure", () => {
  const result = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() => {
      throw new NexoraLlmRuntimeAdapterError("PROVIDER_ERROR", "upstream");
    }),
  );
  assert.equal(result.status, "failed");
  assert.equal(result.failure?.category, "PROVIDER_ERROR");
  assert.equal(result.contribution, null);
});

test("H: timeout becomes normalized failure", () => {
  const result = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() => {
      throw new NexoraLlmRuntimeAdapterError("TIMEOUT", "deadline");
    }),
  );
  assert.equal(result.status, "failed");
  assert.equal(result.failure?.category, "TIMEOUT");
});

test("I: credentials are absent from client-facing request/result contracts", () => {
  const request = fixtureRequest();
  const result = executeNexoraLlmRuntime(
    request,
    adapter(() => Object.freeze({ text: "ok", requestId: "resp_no_secret" })),
  );
  const serialized = JSON.stringify({ request, result });
  assert.doesNotMatch(serialized, /OPENAI_API_KEY|ANTHROPIC_API_KEY|apiKey|sk-/i);
  const contract = readFileSync(
    new URL("./nexoraLlmRuntimeContract.ts", import.meta.url),
    "utf8",
  );
  const runtime = readFileSync(
    new URL("./nexoraLlmRuntime.ts", import.meta.url),
    "utf8",
  );
  const participant = readFileSync(
    new URL("./nexoraLlmRuntimeParticipant.ts", import.meta.url),
    "utf8",
  );
  for (const source of [contract, runtime, participant]) {
    assert.doesNotMatch(source, /OPENAI_API_KEY|ANTHROPIC_API_KEY|sk-/);
    assert.doesNotMatch(source, /\bfetch\s*\(/);
    assert.doesNotMatch(source, /from\s+["']openai["']/);
  }
});

test("not configured and extra failure categories stay normalized", () => {
  const none = executeNexoraLlmRuntime(fixtureRequest(), null);
  assert.equal(none.failure?.category, "NOT_CONFIGURED");
  const network = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() => {
      throw new NexoraLlmRuntimeAdapterError("NETWORK_ERROR", "offline");
    }),
  );
  assert.equal(network.failure?.category, "NETWORK_ERROR");
  const auth = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() => {
      throw new NexoraLlmRuntimeAdapterError("AUTH_ERROR", "denied");
    }),
  );
  assert.equal(auth.failure?.category, "AUTH_ERROR");
  const rate = executeNexoraLlmRuntime(
    fixtureRequest(),
    adapter(() => {
      throw new NexoraLlmRuntimeAdapterError("RATE_LIMIT", "slow down");
    }),
  );
  assert.equal(rate.failure?.category, "RATE_LIMIT");
});

test("runtime participant maps failure to CC-throw without leaking D replacement", () => {
  const participant = createNexoraLlmRuntimeParticipant(
    adapter(() => {
      throw new NexoraLlmRuntimeAdapterError("TIMEOUT", "deadline");
    }),
  );
  assert.throws(() =>
    participant.contribute(fixtureRequest()),
  );
  const ok = createNexoraLlmRuntimeParticipant(
    adapter(() => Object.freeze({ text: "overlay" })),
  );
  assert.equal(ok.contribute(fixtureRequest()).contribution, "overlay");
});
