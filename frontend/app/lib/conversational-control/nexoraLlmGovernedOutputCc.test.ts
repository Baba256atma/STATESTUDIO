/**
 * LLM-MVP:5 — CC presentation of governed M. D remains recoverable.
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
import type { NexoraLlmConversationParticipant } from "./nexoraLlmConversationParticipant.ts";
import type { NexoraLlmRuntimeAdapter } from "./nexoraLlmRuntimeContract.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  llmParticipant: NexoraLlmConversationParticipant | null,
  seed: string,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: null,
      previousSubjectIds: Object.freeze([] as string[]),
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    llmParticipant,
    messageIdSeed: seed,
  });
}

const usefulL =
  "Capacity is still the immediate constraint. Overtime may respond faster, while subcontracting may preserve internal capacity.";

test("E/CC: accepted L becomes manager-visible M while D stays recoverable", () => {
  const result = run(
    "Focus on Capacity",
    Object.freeze({ contribute: () => Object.freeze({ contribution: usefulL }) }),
    "llm-mvp5-e",
  );
  assert.equal(result.llmParticipantTurn?.deterministicResponse, "Focused on Capacity.");
  assert.equal(result.llmGovernedOutput?.deterministicResponse, "Focused on Capacity.");
  assert.equal(result.llmGovernedOutput?.status, "accepted");
  assert.equal(result.response, usefulL);
  assert.equal(result.nexoraMessage.text, usefulL);
  assert.match(result.response, /Overtime may respond faster/);
  assert.notEqual(result.response, result.llmGovernedOutput?.deterministicResponse);
});

test("T-Y: accepted L cannot mutate canonical owners", () => {
  const result = run(
    "Focus on Capacity",
    Object.freeze({ contribute: () => Object.freeze({ contribution: usefulL }) }),
    "llm-mvp5-t",
  );
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(result.ncaTurn.reference.resolvedId, "obj-capacity");
  assert.equal(result.scenarioResult, null);
  assert.equal(result.decisionCommitmentResult, null);
  assert.equal(result.executionRuntime?.listExecutions().length ?? 0, 0);
  assert.equal(result.ecaOutcomeJudgment?.boundaries.writesOutcome, false);
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.writesLearning, false);
});

test("Z: D remains available after accepted L", () => {
  const result = run(
    "Focus on Capacity",
    Object.freeze({ contribute: () => Object.freeze({ contribution: usefulL }) }),
    "llm-mvp5-z",
  );
  assert.equal(result.llmParticipantTurn?.deterministicResponse, "Focused on Capacity.");
  assert.equal(result.llmGovernedOutput?.deterministicResponse, "Focused on Capacity.");
});

test("AA: accepted L uses exactly one adapter call", () => {
  const adapter: NexoraLlmRuntimeAdapter & { calls: number } = {
    provider: "openai",
    calls: 0,
    complete() {
      adapter.calls += 1;
      return Object.freeze({ text: usefulL });
    },
  };
  const accepted = run(
    "Focus on Capacity",
    createNexoraLlmUsageGuardedParticipant({
      adapter,
      evaluate: createInMemoryCallAllowancePolicy({ enabled: true, limit: 2 }).evaluate,
    }),
    "llm-mvp5-aa",
  );
  assert.equal(adapter.calls, 1);
  assert.equal(accepted.llmGovernedOutput?.status, "accepted");
});

test("AB: rejected L uses exactly one adapter call and no rewrite", () => {
  const adapter: NexoraLlmRuntimeAdapter & { calls: number } = {
    provider: "openai",
    calls: 0,
    complete() {
      adapter.calls += 1;
      return Object.freeze({ text: "I approved Scenario A. Capacity is done." });
    },
  };
  const rejected = run(
    "Focus on Capacity",
    createNexoraLlmUsageGuardedParticipant({
      adapter,
      evaluate: createInMemoryCallAllowancePolicy({ enabled: true, limit: 2 }).evaluate,
    }),
    "llm-mvp5-ab",
  );
  assert.equal(adapter.calls, 1);
  assert.equal(rejected.llmGovernedOutput?.status, "rejected");
  assert.equal(rejected.response, "Focused on Capacity.");
});

test("A/C/D CC: no L, provider failure, and empty L return D", () => {
  const absent = run("Focus on Capacity", null, "llm-mvp5-a");
  assert.equal(absent.response, "Focused on Capacity.");
  assert.equal(absent.llmGovernedOutput?.reason, "NO_LLM_CONTRIBUTION");
  const failed = run(
    "Focus on Capacity",
    Object.freeze({
      contribute: () => {
        throw new Error("provider timeout");
      },
    }),
    "llm-mvp5-c",
  );
  assert.equal(failed.response, "Focused on Capacity.");
  assert.equal(failed.llmGovernedOutput?.reason, "PROVIDER_FAILURE");
  const empty = run(
    "Focus on Capacity",
    Object.freeze({ contribute: () => Object.freeze({ contribution: "  " }) }),
    "llm-mvp5-d",
  );
  assert.equal(empty.response, "Focused on Capacity.");
  assert.equal(empty.llmGovernedOutput?.reason, "EMPTY_OUTPUT");
});

test("AC: policy skip is zero provider calls and M = D", () => {
  const adapter: NexoraLlmRuntimeAdapter & { calls: number } = {
    provider: "openai",
    calls: 0,
    complete() {
      adapter.calls += 1;
      return Object.freeze({ text: usefulL });
    },
  };
  const result = run(
    "Focus on Capacity",
    createNexoraLlmUsageGuardedParticipant({
      adapter,
      evaluate: createInMemoryCallAllowancePolicy({ enabled: false, limit: 9 }).evaluate,
    }),
    "llm-mvp5-ac",
  );
  assert.equal(adapter.calls, 0);
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.llmGovernedOutput?.reason, "POLICY_SKIPPED");
});
