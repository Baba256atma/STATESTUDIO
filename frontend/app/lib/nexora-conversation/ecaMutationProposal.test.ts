import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  composeEcaWorkingConversationContext,
  isEcaMutationCancellation,
  isEcaMutationConfirmation,
  type EcaStageContext,
  type EcaSubject,
} from "./ecaWorkingConversationContext.ts";

const subjects: readonly EcaSubject[] = Object.freeze([
  { id: "delivery", label: "Delivery Performance", kind: "object" },
  { id: "risk-capacity", label: "Capacity Risk", kind: "risk" },
  { id: "risk-supplier", label: "Supplier Delay", kind: "risk" },
]);

const stage: EcaStageContext = Object.freeze({
  available: true,
  workspace: "executive",
  focus: subjects[0],
  selected: null,
  visible: Object.freeze([...subjects]),
  collection: null,
  theatreSceneId: "scene-1",
});

function meaning(utterance: string): CanonicalManagerMeaning {
  return {
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: utterance,
    preparedUtterance: utterance.toLowerCase(),
    communicativeIntent: "ASK_INFORMATION",
    requestedOperation: "NONE",
    subject: null,
    objectReference: null,
    questionType: "NONE",
    requestedDepth: "STANDARD",
    modality: "IMPERATIVE",
    polarity: "AFFIRMATIVE",
    confidence: "HIGH",
    ambiguity: { unresolved: false, reason: "none", candidates: [] },
    semanticEvidence: { operationCues: [], objectCues: [], speechActCues: [], reasoningPath: "feature-frame-interpreter", usesLlm: false },
    selectedAuthority: "NCA",
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
  };
}

function compose(utterance: string) {
  return composeEcaWorkingConversationContext({ utterance, meaning: meaning(utterance), stage, subjects });
}

describe("NPA-T ECA:1-FIX1 mutation proposal", () => {
  it("A. recognizes an explicit ADD and creates a read-only proposal", () => {
    const result = compose("Add Supplier Delay as a Risk.");
    assert.equal(result.interactionMode, "PROPOSE_MUTATION");
    assert.equal(result.mutationProposal?.operation, "ADD");
    assert.equal(result.mutationProposal?.targetType, "RISK");
    assert.equal(result.mutationProposal?.proposedName, "Supplier Delay");
    assert.equal(result.mutationProposal?.requiresExplicitConfirmation, true);
    assert.equal(result.mutationProposal?.executed, false);
    assert.equal(result.mutationProposal?.canonicalWriter, null);
  });

  it("B. recognizes natural ADD variants without keyword-only risk detection", () => {
    for (const utterance of ["Create a risk called Supplier Delay.", "Make Supplier Delay a Risk.", "I want Supplier Delay added as a risk."]) {
      assert.equal(compose(utterance).mutationProposal?.operation, "ADD", utterance);
    }
    assert.equal(compose("What is Supplier Delay?").mutationProposal, null);
    assert.equal(compose("Could Supplier Delay be a Risk?").mutationProposal, null);
  });

  it("C. recognizes confirmation and cancellation language as helpers only", () => {
    assert.equal(isEcaMutationConfirmation("Add it."), true);
    assert.equal(isEcaMutationConfirmation("Yes, add the risk."), true);
    assert.equal(isEcaMutationCancellation("Never mind."), true);
    assert.equal(isEcaMutationCancellation("No."), true);
  });

  it("D. unresolved REMOVE target requires clarification and never guesses", () => {
    const result = compose("Remove the risk.");
    assert.equal(result.mutationProposal?.operation, "REMOVE");
    assert.equal(result.mutationProposal?.status, "NEEDS_CLARIFICATION");
  });

  it("E. knowledge and hypothesis questions remain non-mutating", () => {
    for (const utterance of [
      "Explain Supplier Delay.",
      "Is Supplier Delay causing this?",
      "What would happen if Supplier Delay became a risk?",
    ]) {
      assert.equal(compose(utterance).mutationProposal, null, utterance);
    }
  });

  it("F. duplicate identity is left to the canonical authority", () => {
    const result = compose("Add Supplier Delay as a Risk.");
    assert.equal(result.mutationProposal?.provenance.includes("ECA:1 explicit mutation recognition"), true);
    assert.equal(result.mutationProposal?.canonicalWriter, null);
  });

  it("G. proposal carries stable source and session-only provenance", () => {
    const result = compose("Add Supplier Delay as a Risk.");
    assert.match(result.mutationProposal?.proposalId ?? "", /^eca-proposal-add-/);
    assert.equal(result.mutationProposal?.sourceTurnId, "Add Supplier Delay as a Risk.");
    assert.equal(result.conversationContext.sessionScoped, true);
  });

  it("H. no writer or Stage mutation is represented by the proposal", () => {
    const result = compose("Add Supplier Delay as a Risk.");
    assert.equal(result.stageContext.focus?.id, "delivery");
    assert.equal(result.mutationProposal?.executed, false);
    assert.equal(result.mutationProposal?.canonicalWriter, null);
  });

  it("I. data uncertainty remains separate from mutation confirmation", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "Add this as a Risk.",
      meaning: meaning("Add this as a Risk."),
      stage,
      subjects,
      dataContext: { sourceId: "csv-1", sourceLabel: "Delivery CSV", fieldId: "CAP_AV", fieldLabel: "CAP_AV", semanticStatus: "PROPOSED", evidenceRefs: ["csv-1:CAP_AV"] },
    });
    assert.equal(result.activeDataSource?.semanticStatus, "PROPOSED");
    assert.equal(result.mutationProposal?.executed, false);
  });

  it("J. Decision and Execution imperatives are not ECA object mutations", () => {
    assert.equal(compose("Approve Scenario A.").mutationProposal, null);
    assert.equal(compose("Start Execution A.").mutationProposal, null);
  });
});