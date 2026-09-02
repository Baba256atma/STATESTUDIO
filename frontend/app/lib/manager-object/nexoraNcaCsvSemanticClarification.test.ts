import assert from "node:assert/strict";
import test from "node:test";
import type { NexoraConversationState } from "./nexoraNca2ConversationStateTypes.ts";
import {
  beginNcaCsvSemanticClarification,
  resolveNcaCsvSemanticReply,
} from "./nexoraNcaCsvSemanticClarification.ts";

const need = Object.freeze({
  fieldId: "csv:overview:capacity-csv:field:cap-av",
  sourceColumn: "CAP_AV",
  sourceContextId: "csv:overview:capacity-csv",
  workspaceId: "overview" as const,
  question: "Does CAP_AV represent available production capacity?",
  proposedMeaning: "Available Production Capacity",
});

function emptySession(): Readonly<{ activeObjectId: null; previousActiveObjectId: null; activationSource: "none"; pendingClarification: null; ncaConversationState: NexoraConversationState | null }> {
  return Object.freeze({ activeObjectId: null, previousActiveObjectId: null, activationSource: "none", pendingClarification: null, ncaConversationState: null });
}

test("DATA-UX:3 uses the existing NCA:2 pending question as the sole referent", () => {
    const session = beginNcaCsvSemanticClarification(emptySession(), need);
    assert.equal(session.pendingClarification, null);
    assert.deepEqual(session.ncaConversationState?.pendingQuestion, {
      askedBy: "NEXORA",
      question: need.question,
      purpose: "csv-semantic-clarification",
      relatedSubjectId: need.fieldId,
      relatedSubjectName: "CAP_AV",
      relatedGoal: null,
      expectedInformation: "FREE_TEXT",
      valid: true,
      expiresOn: "answered",
      askedAtTurn: 0,
      status: "ACTIVE",
      questionPurpose: "CLARIFY_CSV_FIELD_MEANING",
    });
  });

for (const [utterance, disposition] of [
    ["Yes.", "answer"],
    ["No, it means available machine hours.", "answer"],
    ["CAP_AV is the number of machine hours still available.", "answer"],
    ["I don't know.", "unknown"],
    ["Ask me later.", "defer"],
  ] as const) {
  test(`DATA-UX:3 preserves the pending field for ${utterance}`, () => {
    const session = beginNcaCsvSemanticClarification(emptySession(), need);
    const result = resolveNcaCsvSemanticReply(session, utterance);
    assert.equal(result?.fieldId, need.fieldId);
    assert.equal(result?.disposition, disposition);
    assert.equal(result?.nextSession.ncaConversationState?.pendingQuestion, null);
  });
}

test("DATA-UX:3 does not intercept ordinary Advisor conversation", () => {
    assert.equal(resolveNcaCsvSemanticReply(emptySession(), "Yes"), null);
  });

test("DATA-UX:5-FIX1 pending CSV clarification ignores unrelated questions", () => {
  const session = beginNcaCsvSemanticClarification(emptySession(), need);
  assert.equal(resolveNcaCsvSemanticReply(session, "What is Capacity Gap?"), null);
  assert.equal(session.ncaConversationState?.pendingQuestion?.relatedSubjectId, need.fieldId);
});
