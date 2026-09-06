import assert from "node:assert/strict";
import test from "node:test";

import { createWorkspace, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import { ensureBrowserLocalStorageHarness } from "../test-harness/browserLocalStorageHarness.ts";
import { getWorkspaceRisks, resetWorkspaceRiskStoreForTests } from "../risk/workspaceRiskContract.ts";
import { composeEcaWorkingConversationContext, type EcaStageContext, type EcaSubject } from "./ecaWorkingConversationContext.ts";
import { handoffEcaRiskMutation } from "./ecaRiskMutationHandoff.ts";
import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";

const subjects: readonly EcaSubject[] = Object.freeze([{ id: "delivery", label: "Delivery Performance", kind: "object" }]);
const stage: EcaStageContext = Object.freeze({ available: true, workspace: "executive", focus: subjects[0], selected: null, visible: subjects, collection: null, theatreSceneId: null });
const meaning = (utterance: string): CanonicalManagerMeaning => ({
  identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding", rawUtterance: utterance, preparedUtterance: utterance.toLowerCase(), communicativeIntent: "ASK_INFORMATION", requestedOperation: "NONE", subject: null, objectReference: null, questionType: "NONE", requestedDepth: "STANDARD", modality: "IMPERATIVE", polarity: "AFFIRMATIVE", confidence: "HIGH", ambiguity: { unresolved: false, reason: "none", candidates: [] }, semanticEvidence: { operationCues: [], objectCues: [], speechActCues: [], reasoningPath: "feature-frame-interpreter", usesLlm: false }, selectedAuthority: "NCA", commitsDecision: false, startsExecution: false, inventsBusinessTruth: false,
});

function proposal() {
  return composeEcaWorkingConversationContext({ utterance: "Add Supplier Delay as a Risk.", meaning: meaning("Add Supplier Delay as a Risk."), stage, subjects }).mutationProposal!;
}

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  return createWorkspace("ECA Risk Handoff").workspaceId;
}

test("A. confirmed ECA proposal hands off exactly once to the canonical Risk writer", () => {
  const workspaceId = setup();
  const current = proposal();
  const result = handoffEcaRiskMutation({ workspaceId, proposal: current, confirmation: { confirmed: true, source: "MANAGER_CONVERSATION", proposalId: current.proposalId, turnId: "turn-confirm" } });
  assert.equal(result.status, "CREATED");
  assert.equal(getWorkspaceRisks(workspaceId).length, 1);
  assert.equal(handoffEcaRiskMutation({ workspaceId, proposal: current, confirmation: { confirmed: true, source: "MANAGER_CONVERSATION", proposalId: current.proposalId, turnId: "turn-confirm" } }).status, "ALREADY_EXISTS");
  assert.equal(getWorkspaceRisks(workspaceId).length, 1);
});

test("B. cancellation or missing confirmation performs no write", () => {
  const workspaceId = setup();
  const current = proposal();
  assert.equal(handoffEcaRiskMutation({ workspaceId, proposal: current, confirmation: null }).status, "REJECTED");
  assert.equal(getWorkspaceRisks(workspaceId).length, 0);
});

test("C. stale or replaced proposal cannot be confirmed", () => {
  const workspaceId = setup();
  const current = proposal();
  const stale = { ...current, status: "CANCELLED" as const };
  assert.equal(handoffEcaRiskMutation({ workspaceId, proposal: stale, confirmation: { confirmed: true, source: "MANAGER_CONVERSATION", proposalId: current.proposalId, turnId: "turn-late" } }).status, "REJECTED");
});

test("D. Decision, Execution, and Problem proposals are isolated from the Risk writer", () => {
  const workspaceId = setup();
  const current = proposal();
  for (const targetType of ["DECISION", "EXECUTION", "PROBLEM"]) {
    const isolated = { ...current, targetType };
    assert.equal(handoffEcaRiskMutation({ workspaceId, proposal: isolated, confirmation: { confirmed: true, source: "MANAGER_CONVERSATION", proposalId: current.proposalId, turnId: "turn-isolated" } }).status, "REJECTED");
  }
  assert.equal(getWorkspaceRisks(workspaceId).length, 0);
});