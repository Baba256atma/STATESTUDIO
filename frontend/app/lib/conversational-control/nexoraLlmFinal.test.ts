/**
 * LLM-MVP:FINAL — product-seam completion + manager journeys.
 * Live provider is proven separately against POST /nexora/llm/runtime.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { test } from "node:test";

import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import { governNexoraLlmOutput } from "./nexoraLlmGovernedOutput.ts";
import {
  NEXORA_LLM_CONTEXT_BOUNDS,
  type NexoraLlmManagementContext,
} from "./nexoraLlmManagementContext.ts";
import {
  completeNexoraLlmManagerPresentation,
  NEXORA_LLM_RUNTIME_HTTP_PATH,
} from "./nexoraLlmManagerPresentation.ts";
import type { NexoraLlmConversationParticipant } from "./nexoraLlmConversationParticipant.ts";

const usefulL =
  "Capacity is still the immediate constraint. Overtime may respond faster, while subcontracting may preserve internal capacity.";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  options?: {
    readonly previous?: ReturnType<typeof executeNexoraConversationalExperience>;
    readonly llmParticipant?: NexoraLlmConversationParticipant | null;
    readonly seed?: string;
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: options?.previous?.nextConversationContext ??
      Object.freeze({
        currentSubjectId: null,
        previousSubjectIds: Object.freeze([] as string[]),
      }),
    executiveContext: options?.previous?.nextExecutiveContext,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: options?.previous?.nextRuntimeState ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    scenarioSession: options?.previous?.nextScenarioSession ?? null,
    decisionSession: options?.previous?.nextDecisionSession ?? null,
    previousManagerObjectSession: options?.previous?.managerObjectTurn.session ?? null,
    llmParticipant: options?.llmParticipant,
    messageIdSeed: options?.seed ?? `llm-mvp-final-${utterance}`,
  });
}

function httpFetch(
  payload: Record<string, unknown>,
  calls: { count: number; urls: string[]; bodies: Record<string, unknown>[] },
): typeof fetch {
  return (async (url: string | URL | Request, init?: RequestInit) => {
    calls.count += 1;
    calls.urls.push(String(url));
    const body = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;
    calls.bodies.push(body);
    return {
      ok: true,
      json: async () => payload,
    } as Response;
  }) as typeof fetch;
}

test("Phase-2 context bounds were not expanded", () => {
  assert.deepEqual(NEXORA_LLM_CONTEXT_BOUNDS, {
    managementRefs: 6,
    dataRealityRefs: 4,
    evidenceRefs: 4,
    conversationFrames: 3,
    scenarioRefs: 1,
    decisionRefs: 1,
    utteranceChars: 240,
    valueChars: 160,
    idChars: 128,
  });
});

test("A: Shell completion posts D to Nexora server and can present governed M", async () => {
  const cc = run("Focus on Capacity", { seed: "final-a" });
  assert.equal(cc.llmParticipantTurn?.status, "not-configured");
  assert.equal(cc.response, "Focused on Capacity.");
  assert.ok(cc.llmManagementContext);
  const calls = { count: 0, urls: [] as string[], bodies: [] as Record<string, unknown>[] };
  const presented = await completeNexoraLlmManagerPresentation(cc, {
    fetchImpl: httpFetch(
      { status: "ok", contribution: usefulL, policy: { allowed: true, reason: "ALLOWED" } },
      calls,
    ),
  });
  assert.equal(calls.count, 1);
  assert.match(calls.urls[0] ?? "", new RegExp(`${NEXORA_LLM_RUNTIME_HTTP_PATH}$`));
  assert.equal(calls.bodies[0]?.OPENAI_API_KEY, undefined);
  assert.equal(calls.bodies[0]?.remainingQuota, undefined);
  assert.equal(calls.bodies[0]?.deterministicResponse, "Focused on Capacity.");
  assert.equal(presented.llmGovernedOutput?.status, "accepted");
  assert.equal(presented.response, usefulL);
  assert.equal(presented.nexoraMessage.text, usefulL);
  assert.equal(presented.response, presented.nexoraMessage.text);
  assert.equal(presented.llmGovernedOutput?.deterministicResponse, "Focused on Capacity.");
  assert.equal(presented.nextRuntimeState.focusedSubject?.id, cc.nextRuntimeState.focusedSubject?.id);
});

test("B: LLM_DISABLED skip → M = D and one HTTP policy check", async () => {
  const cc = run("Focus on Capacity", { seed: "final-b" });
  const calls = { count: 0, urls: [] as string[], bodies: [] as Record<string, unknown>[] };
  const presented = await completeNexoraLlmManagerPresentation(cc, {
    fetchImpl: httpFetch(
      { status: "skipped", contribution: null, policy: { allowed: false, reason: "LLM_DISABLED" } },
      calls,
    ),
  });
  assert.equal(calls.count, 1);
  assert.equal(presented.response, "Focused on Capacity.");
  assert.equal(presented.nexoraMessage.text, presented.response);
  assert.equal(presented.llmGovernedOutput?.reason, "POLICY_SKIPPED");
});

test("C: ALLOWANCE_EXHAUSTED skip → M = D", async () => {
  const cc = run("Focus on Capacity", { seed: "final-c" });
  const presented = await completeNexoraLlmManagerPresentation(cc, {
    fetchImpl: httpFetch(
      {
        status: "skipped",
        contribution: null,
        policy: { allowed: false, reason: "ALLOWANCE_EXHAUSTED" },
      },
      { count: 0, urls: [], bodies: [] },
    ),
  });
  assert.equal(presented.response, "Focused on Capacity.");
  assert.equal(presented.llmParticipantTurn?.policyReason, "ALLOWANCE_EXHAUSTED");
});

test("D: invalid L is governed locally with no rewrite fetch", async () => {
  const cc = run("Focus on Capacity", { seed: "final-d" });
  const calls = { count: 0, urls: [] as string[], bodies: [] as Record<string, unknown>[] };
  const presented = await completeNexoraLlmManagerPresentation(cc, {
    fetchImpl: httpFetch(
      {
        status: "ok",
        contribution: "I approved Scenario A and assigned it to Operations. Capacity is done.",
        policy: { allowed: true, reason: "ALLOWED" },
      },
      calls,
    ),
  });
  assert.equal(calls.count, 1);
  assert.equal(presented.llmGovernedOutput?.status, "rejected");
  assert.equal(presented.response, "Focused on Capacity.");
  assert.equal(presented.scenarioResult, cc.scenarioResult);
  assert.equal(presented.decisionCommitmentResult, cc.decisionCommitmentResult);
});

test("unsupported number from server L cannot become M", async () => {
  const cc = run("Focus on Capacity", { seed: "final-num" });
  const presented = await completeNexoraLlmManagerPresentation(cc, {
    fetchImpl: httpFetch(
      {
        status: "ok",
        contribution: "Capacity utilization is now 94%.",
        policy: { allowed: true, reason: "ALLOWED" },
      },
      { count: 0, urls: [], bodies: [] },
    ),
  });
  assert.equal(presented.response, "Focused on Capacity.");
  assert.equal(presented.llmGovernedOutput?.reason, "UNSUPPORTED_CLAIM");
});

test("provider HTTP failure → M = D", async () => {
  const cc = run("Focus on Capacity", { seed: "final-fail" });
  const presented = await completeNexoraLlmManagerPresentation(cc, {
    fetchImpl: (async () => {
      throw new Error("TIMEOUT");
    }) as typeof fetch,
  });
  assert.equal(presented.response, "Focused on Capacity.");
  assert.equal(presented.llmGovernedOutput?.reason, "PROVIDER_FAILURE");
});

test("already-invoked CC participant is not fetched again", async () => {
  const cc = run("Focus on Capacity", {
    seed: "final-no-double",
    llmParticipant: Object.freeze({
      contribute: () => Object.freeze({ contribution: usefulL }),
    }),
  });
  assert.equal(cc.llmParticipantTurn?.status, "succeeded");
  const calls = { count: 0, urls: [] as string[], bodies: [] as Record<string, unknown>[] };
  const presented = await completeNexoraLlmManagerPresentation(cc, {
    fetchImpl: httpFetch({ status: "ok", contribution: "second call" }, calls),
  });
  assert.equal(calls.count, 0);
  assert.equal(presented, cc);
});

test("E: follow-up continuity is Nexora-owned, not provider memory", async () => {
  const first = await completeNexoraLlmManagerPresentation(
    run("Focus on Capacity", { seed: "final-e1" }),
    {
      fetchImpl: httpFetch(
        { status: "ok", contribution: usefulL, policy: { allowed: true, reason: "ALLOWED" } },
        { count: 0, urls: [], bodies: [] },
      ),
    },
  );
  assert.equal(first.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  const follow = run("Why is it still a problem?", {
    previous: first,
    seed: "final-e2",
  });
  assert.equal(follow.ncaTurn.reference.resolvedId, "obj-capacity");
  assert.equal(follow.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(follow.llmParticipantTurn?.status, "not-configured");
});

test("F: canonical action still requires the existing Nexora workflow", () => {
  const suggested = run("Focus on Inventory", {
    seed: "final-f1",
    llmParticipant: Object.freeze({
      contribute: () =>
        Object.freeze({
          contribution: "You could examine increasing Inventory as another option.",
        }),
    }),
  });
  assert.equal(suggested.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  const whatIf = run("what happend if increase inventory", {
    previous: suggested,
    seed: "final-f2",
    llmParticipant: Object.freeze({
      contribute: () => Object.freeze({ contribution: "You could examine increasing Inventory as another option." }),
    }),
  });
  assert.equal(whatIf.intentResult.intent.kind, "explore-scenario");
  assert.equal(whatIf.commandResult?.command?.kind, "evaluate-scenario");
  assert.ok(whatIf.scenarioResult);
  assert.equal(whatIf.llmParticipantTurn?.deterministicResponse, whatIf.llmGovernedOutput?.deterministicResponse);
});

test("Shell source uses server completion and not OpenAI", () => {
  const source = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /completeNexoraLlmManagerPresentation/);
  assert.doesNotMatch(source, /api\.openai\.com/);
  assert.doesNotMatch(source, /OPENAI_API_KEY/);
});

test("live HTTP L is governed locally with D recoverable", () => {
  const artifact = new URL(
    "../../../artifacts/LLM-MVP-FINAL/live-http.json",
    import.meta.url,
  );
  assert.equal(existsSync(artifact), true, "run backend/tests/test_nexora_llm_final_live.py first");
  const live = JSON.parse(readFileSync(artifact, "utf8")) as {
    deterministicResponse: string;
    contribution: string;
    providerCalls: number;
    managementContext: NexoraLlmManagementContext;
  };
  assert.equal(live.providerCalls, 1);
  const governed = governNexoraLlmOutput({
    deterministicResponse: live.deterministicResponse,
    contribution: live.contribution,
    participantStatus: "succeeded",
    managementContext: live.managementContext,
  });
  assert.equal(governed.deterministicResponse, live.deterministicResponse);
  assert.ok(["accepted", "rejected", "fallback"].includes(governed.status));
  writeFileSync(
    new URL("../../../artifacts/LLM-MVP-FINAL/live-governance.json", import.meta.url),
    `${JSON.stringify(
      {
        governanceStatus: governed.status,
        reason: governed.reason,
        llmContributionUsed: governed.llmContributionUsed,
        dRecoverable: governed.deterministicResponse === live.deterministicResponse,
        mEqualsD: governed.managerText === live.deterministicResponse,
        managerText: governed.managerText,
      },
      null,
      2,
    )}\n`,
  );
});
