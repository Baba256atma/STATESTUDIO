/**
 * LLM-MVP:4 — CC policy skip vs allow. L stays non-authoritative.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import {
  createInMemoryCallAllowancePolicy,
  createNexoraLlmUsageGuardedParticipant,
} from "./nexoraLlmUsageGuard.ts";
import type { NexoraLlmRuntimeAdapter } from "./nexoraLlmRuntimeContract.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function countingAdapter(): NexoraLlmRuntimeAdapter & { calls: number } {
  const adapter: NexoraLlmRuntimeAdapter & { calls: number } = {
    provider: "openai",
    calls: 0,
    complete() {
      adapter.calls += 1;
      return Object.freeze({ text: "Optional language overlay." });
    },
  };
  return adapter;
}

function run(
  utterance: string,
  options?: {
    readonly previous?: ReturnType<typeof executeNexoraConversationalExperience>;
    readonly llmParticipant?: ReturnType<typeof createNexoraLlmUsageGuardedParticipant>;
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
    messageIdSeed: options?.seed ?? `llm-mvp4-${utterance}`,
  });
}

test("N: allowed policy may return L while D stays manager-visible", () => {
  const adapter = countingAdapter();
  const policy = createInMemoryCallAllowancePolicy({ enabled: true, limit: 2 });
  const result = run("Focus on Capacity", {
    llmParticipant: createNexoraLlmUsageGuardedParticipant({
      adapter,
      evaluate: policy.evaluate,
    }),
    seed: "llm-mvp4-n",
  });
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.nexoraMessage.text, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.status, "succeeded");
  assert.equal(result.llmParticipantTurn?.contribution, "Optional language overlay.");
  assert.equal(adapter.calls, 1);
});

test("O: exhausted allowance skips provider and keeps D", () => {
  const adapter = countingAdapter();
  const policy = createInMemoryCallAllowancePolicy({ enabled: true, limit: 0 });
  const result = run("Focus on Capacity", {
    llmParticipant: createNexoraLlmUsageGuardedParticipant({
      adapter,
      evaluate: policy.evaluate,
    }),
    seed: "llm-mvp4-o",
  });
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.status, "skipped-by-policy");
  assert.equal(result.llmParticipantTurn?.policyReason, "ALLOWANCE_EXHAUSTED");
  assert.equal(result.llmParticipantTurn?.fallbackUsed, false);
  assert.equal(result.llmParticipantTurn?.contribution, null);
  assert.equal(adapter.calls, 0);
});

test("P: disabled policy skips provider and keeps D", () => {
  const adapter = countingAdapter();
  const policy = createInMemoryCallAllowancePolicy({ enabled: false, limit: 9 });
  const result = run("Focus on Capacity", {
    llmParticipant: createNexoraLlmUsageGuardedParticipant({
      adapter,
      evaluate: policy.evaluate,
    }),
    seed: "llm-mvp4-p",
  });
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.status, "skipped-by-policy");
  assert.equal(result.llmParticipantTurn?.policyReason, "LLM_DISABLED");
  assert.equal(adapter.calls, 0);
});

test("Q: policy infrastructure failure fails closed for LLM and open for D", () => {
  const adapter = countingAdapter();
  const result = run("Focus on Capacity", {
    llmParticipant: createNexoraLlmUsageGuardedParticipant({
      adapter,
      evaluate: () => {
        throw new Error("policy boom");
      },
    }),
    seed: "llm-mvp4-q",
  });
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.status, "skipped-by-policy");
  assert.equal(result.llmParticipantTurn?.policyReason, "CONFIGURATION_ERROR");
  assert.equal(adapter.calls, 0);
});

test("R/S: usage skip cannot mutate management state; L stays non-authoritative", () => {
  const adapter = countingAdapter();
  const policy = createInMemoryCallAllowancePolicy({ enabled: true, limit: 1 });
  const result = run("Focus on Capacity", {
    llmParticipant: createNexoraLlmUsageGuardedParticipant({
      adapter,
      evaluate: policy.evaluate,
    }),
    seed: "llm-mvp4-r",
  });
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(result.ncaTurn.reference.resolvedId, "obj-capacity");
  assert.equal(result.scenarioResult, null);
  assert.equal(result.decisionCommitmentResult, null);
  assert.equal(result.executionRuntime?.listExecutions().length ?? 0, 0);
  assert.equal(result.ecaOutcomeJudgment?.boundaries.writesOutcome, false);
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.writesLearning, false);
  assert.notEqual(result.response, result.llmParticipantTurn?.contribution);
});
