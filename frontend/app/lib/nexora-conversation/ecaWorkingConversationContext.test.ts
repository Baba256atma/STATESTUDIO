import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { CanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaning.ts";
import {
  composeEcaWorkingConversationContext,
  type EcaStageContext,
  type EcaSubject,
} from "./ecaWorkingConversationContext.ts";

const subjects: readonly EcaSubject[] = Object.freeze([
  { id: "capacity-gap", label: "Capacity Gap", kind: "problem" },
  { id: "demand-surge", label: "Demand Surge", kind: "scenario" },
  { id: "delivery-risk", label: "Delivery Risk", kind: "risk" },
  { id: "execution-a", label: "Execution A", kind: "execution" },
]);

const stage: EcaStageContext = {
  available: true,
  workspace: "executive",
  focus: subjects[0],
  selected: null,
  visible: Object.freeze([subjects[0], subjects[1]]),
  collection: null,
  theatreSceneId: "scene-1",
};

function meaning(overrides: Partial<CanonicalManagerMeaning> = {}): CanonicalManagerMeaning {
  return {
    identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
    rawUtterance: "Explain Capacity Gap.",
    preparedUtterance: "explain capacity gap",
    communicativeIntent: "ASK_EXPLANATION",
    requestedOperation: "EXPLAIN",
    subject: { subjectId: "capacity-gap", canonicalName: "Capacity Gap", lexicalHint: "Capacity Gap", subjectKind: "problem" },
    objectReference: { subjectId: "capacity-gap", canonicalName: "Capacity Gap", lexicalHint: "Capacity Gap", subjectKind: "problem" },
    questionType: "EXPLANATION",
    requestedDepth: "STANDARD",
    modality: "INTERROGATIVE",
    polarity: "AFFIRMATIVE",
    confidence: "HIGH",
    ambiguity: { unresolved: false, reason: "none", candidates: [] },
    semanticEvidence: { operationCues: [], objectCues: [], speechActCues: [], reasoningPath: "feature-frame-interpreter", usesLlm: false },
    selectedAuthority: "NCA",
    commitsDecision: false,
    startsExecution: false,
    inventsBusinessTruth: false,
    ...overrides,
  };
}

describe("NPA-T ECA:1 working conversation context", () => {
  it("preserves a subject for a pronoun follow-up", () => {
    const first = composeEcaWorkingConversationContext({ utterance: "Explain Capacity Gap.", meaning: meaning(), stage, subjects });
    const second = composeEcaWorkingConversationContext({
      utterance: "Why is it important?",
      meaning: meaning({ rawUtterance: "Why is it important?", preparedUtterance: "why is it important?", communicativeIntent: "ASK_WHY", requestedOperation: "NONE", questionType: "GOAL_RELEVANCE", objectReference: { subjectId: null, canonicalName: null, lexicalHint: "it", subjectKind: null }, subject: { subjectId: null, canonicalName: null, lexicalHint: "it", subjectKind: null } }),
      stage,
      subjects,
      recentSubjects: [first.activeSubject!],
    });
    assert.equal(second.activeSubject?.id, "capacity-gap");
    assert.equal(second.confidence, "MEDIUM");
  });

  it("switches subject while preserving Stage focus separately", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "Now tell me about Demand Surge.",
      meaning: meaning({ objectReference: { subjectId: "demand-surge", canonicalName: "Demand Surge", lexicalHint: "Demand Surge", subjectKind: "scenario" }, subject: { subjectId: "demand-surge", canonicalName: "Demand Surge", lexicalHint: "Demand Surge", subjectKind: "scenario" } }),
      stage,
      subjects,
    });
    assert.equal(result.activeSubject?.id, "demand-surge");
    assert.equal(result.stageContext.focus?.id, "capacity-gap");
  });

  it("keeps collection questions from inheriting the focused object", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "How many Executions do we have?",
      meaning: meaning({ requestedOperation: "STATUS", questionType: "STATUS", objectReference: { subjectId: null, canonicalName: null, lexicalHint: "Executions", subjectKind: null }, subject: null }),
      stage: { ...stage, collection: { kind: "EXECUTION", label: "Executions", members: [subjects[3]] } },
      subjects,
    });
    assert.equal(result.activeSubject, null);
    assert.equal(result.activeCollection?.kind, "EXECUTION");
  });

  it("clarifies ambiguity instead of guessing", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "Explain it.",
      meaning: meaning({ objectReference: { subjectId: null, canonicalName: null, lexicalHint: "it", subjectKind: null }, subject: null, ambiguity: { unresolved: true, reason: "multiple-objects", candidates: [] } }),
      stage,
      subjects,
      explicitAmbiguity: true,
    });
    assert.equal(result.interactionMode, "CLARIFY");
    assert.deepEqual(result.continuation.options, ["Capacity Gap", "Demand Surge"]);
  });

  it("keeps knowledge intent read-only and gates mutation proposals", () => {
    const knowledge = composeEcaWorkingConversationContext({ utterance: "What is Capacity Gap?", meaning: meaning({ questionType: "EXPLANATION", requestedOperation: "EXPLAIN" }), stage, subjects });
    assert.equal(knowledge.interactionMode, "READ");
    const proposal = composeEcaWorkingConversationContext({ utterance: "Add Supplier Delay as a Risk.", meaning: meaning({ objectReference: { subjectId: null, canonicalName: "Supplier Delay", lexicalHint: "Supplier Delay", subjectKind: "risk" }, subject: { subjectId: null, canonicalName: "Supplier Delay", lexicalHint: "Supplier Delay", subjectKind: "risk" } }), stage, subjects });
    assert.equal(proposal.interactionMode, "PROPOSE_MUTATION");
    assert.equal(proposal.mutationProposal?.requiresExplicitConfirmation, true);
    assert.equal(proposal.mutationProposal?.executed, false);
  });

  it("retains source and field semantics without certifying them", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "What does this CSV field mean?",
      meaning: meaning({ objectReference: { subjectId: null, canonicalName: null, lexicalHint: "CSV field", subjectKind: null }, subject: null }),
      stage,
      subjects,
      dataContext: { sourceId: "csv-1", sourceLabel: "Delivery CSV", fieldId: "delay_days", fieldLabel: "Delay Days", semanticStatus: "PROPOSED", evidenceRefs: [] },
    });
    assert.equal(result.activeDataSource?.semanticStatus, "PROPOSED");
    assert.equal(result.activeDataSource?.fieldId, "delay_days");
  });

  it("marks working context session-scoped and does not invent refresh durability", () => {
    const result = composeEcaWorkingConversationContext({ utterance: "Explain Capacity Gap.", meaning: meaning(), stage, subjects });
    assert.equal(result.conversationContext.sessionScoped, true);
    assert.equal(result.provenance.includes("NEX-CONV:1/2 working context"), false);
  });

  it("A. simple continuity keeps Capacity Gap", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "Why is it important?",
      meaning: meaning({ objectReference: { subjectId: null, canonicalName: null, lexicalHint: "it", subjectKind: null }, subject: null, communicativeIntent: "ASK_WHY", requestedOperation: "NONE" }),
      stage,
      subjects,
      recentSubjects: [subjects[0]],
    });
    assert.equal(result.activeSubject?.label, "Capacity Gap");
    assert.equal(result.interactionMode, "READ");
  });

  it("B. pronoun evidence follows Delivery Risk, not Stage focus", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "What evidence supports it?",
      meaning: meaning({ objectReference: { subjectId: null, canonicalName: null, lexicalHint: "it", subjectKind: null }, subject: null, communicativeIntent: "ASK_EVIDENCE", requestedOperation: "EVIDENCE", questionType: "EVIDENCE" }),
      stage,
      subjects,
      recentSubjects: [subjects[2]],
    });
    assert.equal(result.activeSubject?.id, "delivery-risk");
    assert.equal(result.stageContext.focus?.id, "capacity-gap");
    assert.equal(result.managerIntent.operation, "EVIDENCE");
  });

  it("C. subject switching retains both comparison references", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "Compare them.",
      meaning: meaning({ objectReference: null, subject: null, communicativeIntent: "ASK_COMPARISON", requestedOperation: "COMPARE", questionType: "COMPARISON" }),
      stage,
      subjects,
      recentSubjects: [subjects[1], subjects[0]],
      conversationState: { activeComparison: { candidateIds: ["capacity-gap", "demand-surge"], criterion: "RISK" } } as never,
    });
    assert.deepEqual(result.references.filter((reference) => reference.role === "RECENT_SUBJECT").map((reference) => reference.subject.id), ["demand-surge"]);
    assert.equal(result.references.some((reference) => reference.subject.id === "capacity-gap"), true);
    assert.equal(result.decisionContext.comparisonSubjects.length, 2);
  });

  it("D. collection questions stay separate from Stage focus", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "How many Executions do we have?",
      meaning: meaning({ objectReference: null, subject: null, requestedOperation: "STATUS", questionType: "STATUS" }),
      stage: { ...stage, collection: { kind: "EXECUTION", label: "Executions", members: [subjects[3]] } },
      subjects,
    });
    assert.equal(result.activeSubject, null);
    assert.equal(result.activeCollection?.kind, "EXECUTION");
  });

  it("E. ambiguity uses bounded explicit candidates", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "Explain it.",
      meaning: meaning({ objectReference: null, subject: null, ambiguity: { unresolved: true, reason: "multiple-objects", candidates: [subjects[0], subjects[1]].map((subject) => ({ subjectId: subject.id, canonicalName: subject.label, lexicalHint: subject.label, subjectKind: subject.kind })) } }),
      stage,
      subjects,
    });
    assert.equal(result.interactionMode, "CLARIFY");
    assert.deepEqual(result.continuation.options, ["Capacity Gap", "Demand Surge"]);
    assert.match(result.continuation.safeNext, /subject/i);
  });

  it("F. knowledge intent remains read-only", () => {
    const result = composeEcaWorkingConversationContext({ utterance: "What is Capacity Gap?", meaning: meaning({ requestedOperation: "EXPLAIN", questionType: "EXPLANATION" }), stage, subjects });
    assert.equal(result.interactionMode, "READ");
    assert.equal(result.mutationProposal, null);
  });

  it("G. mutation is proposed but never executed", () => {
    const result = composeEcaWorkingConversationContext({ utterance: "Add Supplier Delay as a Risk.", meaning: meaning({ objectReference: { subjectId: null, canonicalName: "Supplier Delay", lexicalHint: "Supplier Delay", subjectKind: "risk" }, subject: { subjectId: null, canonicalName: "Supplier Delay", lexicalHint: "Supplier Delay", subjectKind: "risk" } }), stage, subjects });
    assert.equal(result.interactionMode, "PROPOSE_MUTATION");
    assert.equal(result.mutationProposal?.executed, false);
    assert.equal(result.mutationProposal?.canonicalWriter, "canonicalRiskWriter");
  });

  it("H. data context preserves candidate semantic status and provenance", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "Is CAP_AV capacity availability?",
      meaning: meaning({ objectReference: null, subject: null, questionType: "EXPLANATION" }),
      stage,
      subjects,
      dataContext: { sourceId: "csv-1", sourceLabel: "Capacity CSV", fieldId: "CAP_AV", fieldLabel: "CAP_AV", semanticStatus: "PROPOSED", evidenceRefs: ["column-1"] },
    });
    assert.equal(result.activeDataSource?.semanticStatus, "PROPOSED");
    assert.deepEqual(result.activeDataSource?.evidenceRefs, ["column-1"]);
  });

  it("I. comparison criterion changes without decision commitment", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "What if our priority is delivery speed?",
      meaning: meaning({ objectReference: null, subject: null, requestedOperation: "COMPARE", questionType: "COMPARISON" }),
      stage,
      subjects,
      conversationState: { activeComparison: { candidateIds: ["capacity-gap", "demand-surge"], criterion: "DELIVERY_IMPACT" } } as never,
    });
    assert.equal(result.decisionContext.criterion, "DELIVERY_IMPACT");
    assert.equal(result.mutationProposal, null);
  });

  it("J. WHO-to-NEXT diagnostics keep unknown WHY explicit", () => {
    const result = composeEcaWorkingConversationContext({ utterance: "Explain Capacity Gap.", meaning: meaning(), stage, subjects });
    assert.equal(result.diagnostics.who, "manager");
    assert.equal(result.diagnostics.what, "Capacity Gap");
    assert.equal(result.diagnostics.where, "executive");
    assert.equal(result.diagnostics.how, "EXPLAIN");
    assert.equal(result.diagnostics.why, null);
    assert.match(result.diagnostics.next, /Answer|investigate/);
  });

  it("explicit current meaning outranks active and Stage context", () => {
    const result = composeEcaWorkingConversationContext({
      utterance: "Explain Demand Surge.",
      meaning: meaning({ objectReference: { subjectId: "demand-surge", canonicalName: "Demand Surge", lexicalHint: "Demand Surge", subjectKind: "scenario" }, subject: { subjectId: "demand-surge", canonicalName: "Demand Surge", lexicalHint: "Demand Surge", subjectKind: "scenario" } }),
      stage,
      subjects,
      recentSubjects: [subjects[0]],
      conversationState: { activeSubject: { id: "capacity-gap", name: "Capacity Gap", kind: "problem" } } as never,
    });
    assert.equal(result.activeSubject?.id, "demand-surge");
  });

  it("MRA:3-FIX1 collection ordinal outranks leftover meaning objectReference", () => {
    const margin = { id: "margin-pressure", label: "Margin Pressure", kind: "problem" } as const;
    const gap = subjects[0]!;
    const result = composeEcaWorkingConversationContext({
      utterance: "go back to the first problem",
      meaning: meaning({
        objectReference: {
          subjectId: margin.id,
          canonicalName: margin.label,
          lexicalHint: margin.label,
          subjectKind: "problem",
        },
      }),
      stage,
      subjects: [...subjects, margin],
      conversationState: {
        activeSubject: { id: margin.id, name: margin.label, kind: "problem" },
        lastCollection: {
          kind: "PROBLEM",
          items: ["Capacity Gap", "Margin Pressure"],
          memberIds: ["capacity-gap", "margin-pressure"],
        },
      } as never,
    });
    assert.equal(result.activeSubject?.id, "capacity-gap");
    assert.equal(result.activeSubject?.label, gap.label);
  });
});