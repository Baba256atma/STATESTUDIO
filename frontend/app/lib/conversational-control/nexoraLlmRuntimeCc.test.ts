/**
 * LLM-MVP:3 — CC:5 integration with the provider-neutral runtime participant.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { NEXORA_NCA1_BOUNDARY } from "@/app/lib/manager-object/nexoraNca1ConversationTypes.ts";
import { NEXORA_ADVISOR_ROLE } from "@/app/lib/manager-object/nexoraNxa1ExecutiveAdvisorContract.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { CONVERSATIONAL_EXPERIENCE_BOUNDARY } from "./conversationalExperience.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import { nexoraLlmManagementContextIdentity } from "./nexoraLlmManagementContext.ts";
import { NEXORA_LLM_PARTICIPANT_BOUNDARY } from "./nexoraLlmConversationParticipant.ts";
import { createNexoraLlmRuntimeParticipant } from "./nexoraLlmRuntimeParticipant.ts";
import {
  NexoraLlmRuntimeAdapterError,
  type NexoraLlmRuntimeAdapter,
  type NexoraLlmRuntimeAdapterInput,
} from "./nexoraLlmRuntimeContract.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function adapter(
  complete: NexoraLlmRuntimeAdapter["complete"],
): NexoraLlmRuntimeAdapter {
  return Object.freeze({ provider: "openai", complete });
}

function run(
  utterance: string,
  options?: {
    readonly previous?: ReturnType<typeof executeNexoraConversationalExperience>;
    readonly llmParticipant?: ReturnType<typeof createNexoraLlmRuntimeParticipant> | null;
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
    messageIdSeed: options?.seed ?? `llm-mvp3-${utterance}`,
  });
}

test("J: no provider configured keeps certified deterministic CC:5 result", () => {
  const result = run("Focus on Capacity", { seed: "llm-mvp3-j" });
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.nexoraMessage.text, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.status, "not-configured");
  assert.equal(result.llmParticipantTurn?.contribution, null);
  assert.equal(result.llmParticipantTurn?.fallbackUsed, true);
  assert.equal(NEXORA_LLM_PARTICIPANT_BOUNDARY.usesLiveProvider, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(NEXORA_NCA1_BOUNDARY.usesLiveLlm, false);
  assert.equal(NEXORA_ADVISOR_ROLE, "Executive Decision Advisor");
});

test("K: runtime-compatible participant returns L while D stays manager-visible", () => {
  const participant = createNexoraLlmRuntimeParticipant(
    adapter(() => Object.freeze({ text: "Optional language overlay." })),
  );
  const result = run("Focus on Capacity", {
    llmParticipant: participant,
    seed: "llm-mvp3-k",
  });
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.nexoraMessage.text, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.status, "succeeded");
  assert.equal(result.llmParticipantTurn?.contribution, "Optional language overlay.");
  assert.equal(result.llmParticipantTurn?.deterministicResponse, result.response);
  assert.notEqual(result.response, result.llmParticipantTurn?.contribution);
});

test("K2: L matching D text still leaves D as manager-visible authority", () => {
  const participant = createNexoraLlmRuntimeParticipant(
    adapter(() => Object.freeze({ text: "Focused on Capacity." })),
  );
  const result = run("Focus on Capacity", {
    llmParticipant: participant,
    seed: "llm-mvp3-k2",
  });
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.nexoraMessage.text, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.contribution, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.deterministicResponse, result.response);
  assert.equal(result.scenarioResult, null);
  assert.equal(result.decisionCommitmentResult, null);
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(result.ncaTurn.reference.resolvedId, "obj-capacity");
});

test("L: runtime failure falls back to D", () => {
  const participant = createNexoraLlmRuntimeParticipant(
    adapter(() => {
      throw new NexoraLlmRuntimeAdapterError("PROVIDER_ERROR", "boom");
    }),
  );
  const result = run("Focus on Capacity", {
    llmParticipant: participant,
    seed: "llm-mvp3-l",
  });
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.status, "failed");
  assert.equal(result.llmParticipantTurn?.fallbackUsed, true);
  assert.equal(result.llmParticipantTurn?.contribution, null);
});

test("M: provider contribution cannot change the resolved referent", () => {
  const participant = createNexoraLlmRuntimeParticipant(
    adapter(() => Object.freeze({ text: "The subject is Revenue." })),
  );
  const focused = run("Focus on Capacity", {
    llmParticipant: participant,
    seed: "llm-mvp3-m-focus",
  });
  const explained = run("Explain it.", {
    previous: focused,
    llmParticipant: participant,
    seed: "llm-mvp3-m-explain",
  });
  assert.equal(explained.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(explained.nextConversationContext.currentSubjectId, "obj-capacity");
  assert.equal(explained.ncaTurn.reference.resolvedId, "obj-capacity");
  assert.notEqual(explained.response, "The subject is Revenue.");
});

test("N: provider output cannot directly change Scenario/Decision/Execution/Outcome/Learning", () => {
  const participant = createNexoraLlmRuntimeParticipant(
    adapter(() =>
      Object.freeze({
        text: JSON.stringify({
          actions: [{ type: "commitDecision", id: "D-1" }],
          scenario: "S-1",
        }),
      }),
    ),
  );
  const result = run("Focus on Capacity", {
    llmParticipant: participant,
    seed: "llm-mvp3-n",
  });
  assert.equal(result.scenarioResult, null);
  assert.equal(result.nextScenarioSession, null);
  assert.equal(result.decisionCommitmentResult, null);
  assert.equal(result.nextDecisionSession, null);
  assert.equal(result.executionRuntime?.listExecutions().length ?? 0, 0);
  assert.equal(result.ecaOutcomeJudgment?.boundaries.writesOutcome, false);
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.writesLearning, false);
});

test("O: runtime receives Phase-2 bounded management context, not a second reconstruction", () => {
  let seen: NexoraLlmRuntimeAdapterInput | null = null;
  const participant = createNexoraLlmRuntimeParticipant(
    adapter((input) => {
      seen = input;
      return Object.freeze({ text: "overlay" });
    }),
  );
  run("Focus on Capacity", {
    llmParticipant: participant,
    seed: "llm-mvp3-o",
  });
  assert.ok(seen);
  assert.equal(
    seen.request.managementContext.identity,
    nexoraLlmManagementContextIdentity,
  );
  assert.equal(seen.request.managementContext.subject.canonicalId, "obj-capacity");
  assert.equal(seen.request.deterministicResponse, "Focused on Capacity.");
  assert.doesNotMatch(JSON.stringify(seen.request.managementContext), /rawCsv|OPENAI_API_KEY/);
});

test("CC and Shell remain free of vendor SDKs and secret names", () => {
  const orchestrator = readFileSync(
    new URL("./conversationalExperienceOrchestrator.ts", import.meta.url),
    "utf8",
  );
  const participant = readFileSync(
    new URL("./nexoraLlmConversationParticipant.ts", import.meta.url),
    "utf8",
  );
  const context = readFileSync(
    new URL("./nexoraLlmManagementContext.ts", import.meta.url),
    "utf8",
  );
  const shell = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  for (const source of [orchestrator, participant, context, shell]) {
    assert.doesNotMatch(source, /openai|anthropic|ollama|jev/i);
    assert.doesNotMatch(source, /\bfetch\s*\(/);
    assert.doesNotMatch(source, /OPENAI_API_KEY|ANTHROPIC_API_KEY/);
  }
  assert.doesNotMatch(
    shell,
    /nexoraLlmRuntime|createNexoraLlmRuntimeParticipant/,
  );
});
