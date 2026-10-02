/**
 * LLM-MVP:1 — Optional CC:5 LLM participant seam.
 * Deterministic fakes only. No network, keys, or vendor SDKs.
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
import {
  invokeNexoraLlmConversationParticipant,
  NEXORA_LLM_PARTICIPANT_BOUNDARY,
  nexoraLlmConversationParticipantIdentity,
  type NexoraLlmConversationParticipant,
} from "./nexoraLlmConversationParticipant.ts";

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
    messageIdSeed: options?.seed ?? `llm-mvp1-${utterance}`,
  });
}

function successfulParticipant(
  contribution = "Optional language overlay.",
): NexoraLlmConversationParticipant {
  return Object.freeze({
    contribute: () => Object.freeze({ contribution }),
  });
}

test("LLM-MVP:1 identity does not claim Advisor, provider, or mutation ownership", () => {
  assert.equal(
    nexoraLlmConversationParticipantIdentity,
    "LLM-MVP:1/ConversationParticipantSeam",
  );
  assert.equal(NEXORA_LLM_PARTICIPANT_BOUNDARY.isAdvisor, false);
  assert.equal(NEXORA_LLM_PARTICIPANT_BOUNDARY.isConversationAuthority, false);
  assert.equal(NEXORA_LLM_PARTICIPANT_BOUNDARY.isReferentAuthority, false);
  assert.equal(NEXORA_LLM_PARTICIPANT_BOUNDARY.mutatesCanonicalState, false);
  assert.equal(NEXORA_LLM_PARTICIPANT_BOUNDARY.usesLiveProvider, false);
  assert.equal(NEXORA_LLM_PARTICIPANT_BOUNDARY.ownsMemory, false);
  assert.equal(NEXORA_NCA1_BOUNDARY.usesLiveLlm, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(NEXORA_ADVISOR_ROLE, "Executive Decision Advisor");
});

test("A: no participant preserves certified deterministic CC:5 result", () => {
  const result = run("Focus on Capacity", { seed: "llm-mvp1-a" });
  assert.equal(result.status, "applied");
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.nexoraMessage.text, "Focused on Capacity.");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(result.llmParticipantTurn?.status, "not-configured");
  assert.equal(result.llmParticipantTurn?.invoked, false);
  assert.equal(result.llmParticipantTurn?.fallbackUsed, true);
  assert.equal(result.llmParticipantTurn?.contribution, null);
  assert.equal(result.llmParticipantTurn?.deterministicResponse, result.response);
});

test("B: successful fake participant is invoked after resolution and keeps D as response", () => {
  let seenTurnId: string | null = null;
  let seenDeterministic: string | null = null;
  const participant: NexoraLlmConversationParticipant = Object.freeze({
    contribute(request) {
      seenTurnId = request.turnId;
      seenDeterministic = request.deterministicResponse;
      assert.equal(request.managementContext.subject.canonicalId, "obj-capacity");
      assert.equal("contextRefs" in request, false);
      assert.equal(
        JSON.stringify(request.managementContext).includes("Optional language overlay."),
        false,
      );
      return Object.freeze({ contribution: "Optional language overlay." });
    },
  });
  const result = run("Focus on Capacity", {
    llmParticipant: participant,
    seed: "llm-mvp1-b",
  });
  assert.equal(result.status, "applied");
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.nexoraMessage.text, "Focused on Capacity.");
  assert.equal(result.llmParticipantTurn?.status, "succeeded");
  assert.equal(result.llmParticipantTurn?.invoked, true);
  assert.equal(result.llmParticipantTurn?.fallbackUsed, false);
  assert.equal(result.llmParticipantTurn?.contribution, "Optional language overlay.");
  assert.equal(result.llmParticipantTurn?.deterministicResponse, "Focused on Capacity.");
  assert.equal(seenDeterministic, "Focused on Capacity.");
  assert.equal(seenTurnId, result.nexoraMessage.id);
});

test("C: participant output cannot change referent or current subject", () => {
  const focused = run("Focus on Capacity", {
    llmParticipant: successfulParticipant("Now talking about Budget."),
    seed: "llm-mvp1-c-focus",
  });
  const explained = run("Explain it.", {
    previous: focused,
    llmParticipant: successfulParticipant("The subject is Revenue."),
    seed: "llm-mvp1-c-explain",
  });
  assert.equal(explained.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(explained.nextConversationContext.currentSubjectId, "obj-capacity");
  assert.equal(explained.ncaTurn.reference.resolvedId, "obj-capacity");
  assert.notEqual(explained.response, "The subject is Revenue.");
});

test("D: participant cannot mutate Scenario, Decision, Execution, Outcome, or Learning", () => {
  const result = run("Focus on Capacity", {
    llmParticipant: successfulParticipant("Created scenario S-1 and committed decision D-1."),
    seed: "llm-mvp1-d",
  });
  assert.equal(result.scenarioResult, null);
  assert.equal(result.nextScenarioSession, null);
  assert.equal(result.decisionCommitmentResult, null);
  assert.equal(result.nextDecisionSession, null);
  assert.equal(result.executionRuntime?.listExecutions().length ?? 0, 0);
  assert.equal(result.ecaOutcomeJudgment?.boundaries.writesOutcome, false);
  assert.equal(result.ecaLearningClosureJudgment?.boundaries.writesLearning, false);
});

test("E: participant throw falls back to deterministic CC response", () => {
  const participant: NexoraLlmConversationParticipant = Object.freeze({
    contribute() {
      throw new Error("participant boom");
    },
  });
  const result = run("Focus on Capacity", {
    llmParticipant: participant,
    seed: "llm-mvp1-e",
  });
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.nexoraMessage.text, "Focused on Capacity.");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(result.llmParticipantTurn?.status, "failed");
  assert.equal(result.llmParticipantTurn?.fallbackUsed, true);
  assert.equal(result.llmParticipantTurn?.contribution, null);
});

test("F: empty, malformed, and async results are rejected with deterministic fallback", () => {
  const empty = run("Focus on Capacity", {
    llmParticipant: Object.freeze({
      contribute: () => Object.freeze({ contribution: "   " }),
    }),
    seed: "llm-mvp1-f-empty",
  });
  assert.equal(empty.response, "Focused on Capacity.");
  assert.equal(empty.llmParticipantTurn?.status, "rejected");
  assert.equal(empty.llmParticipantTurn?.fallbackUsed, true);

  const malformed = run("Focus on Capacity", {
    llmParticipant: Object.freeze({
      contribute: () => Object.freeze({ contribution: null }),
    }),
    seed: "llm-mvp1-f-null",
  });
  assert.equal(malformed.response, "Focused on Capacity.");
  assert.equal(malformed.llmParticipantTurn?.status, "rejected");

  const asyncLike = invokeNexoraLlmConversationParticipant({
    participant: Object.freeze({
      contribute: () =>
        Promise.resolve(Object.freeze({ contribution: "late" })) as unknown as {
          readonly contribution: string | null;
        },
    }),
    turnId: "async",
    deterministicResponse: "Focused on Capacity.",
    experienceStatus: "applied",
  });
  assert.equal(asyncLike.status, "rejected");
  assert.equal(asyncLike.fallbackUsed, true);
});

test("G: existing canonical action still runs through CC with participant enabled", () => {
  const inventory = run("Focus on Inventory", {
    llmParticipant: successfulParticipant("I invented a parallel scenario."),
    seed: "llm-mvp1-g-focus",
  });
  assert.equal(inventory.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  const whatIf = run("what happend if increase inventory", {
    previous: inventory,
    llmParticipant: successfulParticipant("Created Decision Inventory-X."),
    seed: "llm-mvp1-g-whatif",
  });
  assert.equal(whatIf.intentResult.intent.kind, "explore-scenario");
  assert.equal(whatIf.commandResult?.command?.kind, "evaluate-scenario");
  assert.ok(whatIf.scenarioResult);
  assert.equal(whatIf.nextRuntimeState.focusedSubject?.id, "obj-inventory");
  assert.equal(whatIf.response, whatIf.llmParticipantTurn?.deterministicResponse);
  assert.notEqual(whatIf.response, "Created Decision Inventory-X.");
  assert.equal(whatIf.decisionCommitmentResult, null);
});

test("H: CC participant seam has no vendor or network dependency", () => {
  const participantSource = readFileSync(
    new URL("./nexoraLlmConversationParticipant.ts", import.meta.url),
    "utf8",
  );
  const contextSource = readFileSync(
    new URL("./nexoraLlmManagementContext.ts", import.meta.url),
    "utf8",
  );
  const orchestratorSource = readFileSync(
    new URL("./conversationalExperienceOrchestrator.ts", import.meta.url),
    "utf8",
  );
  for (const source of [participantSource, contextSource, orchestratorSource]) {
    assert.doesNotMatch(source, /openai|anthropic|ollama|jev/i);
    assert.doesNotMatch(source, /\bfetch\s*\(/);
    assert.doesNotMatch(source, /OPENAI_API_KEY|ANTHROPIC_API_KEY/);
  }
  assert.match(participantSource, /managementContext/);
  assert.doesNotMatch(participantSource, /contextRefs/);
});
