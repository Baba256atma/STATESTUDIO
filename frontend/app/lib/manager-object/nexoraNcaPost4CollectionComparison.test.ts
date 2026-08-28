import assert from "node:assert/strict";
import test from "node:test";
import {
  interpretExecutiveComparisonMeaning,
  isExecutiveComparisonCriterionAnswer,
  resolveCollectionComparison,
  resolveExecutiveComparisonCandidateSet,
  type ActiveComparisonContext,
} from "./nexoraNcaPost4CollectionComparison.ts";

const capacity = Object.freeze({ id: "ctx-problem-capacity", name: "Capacity Gap", kind: "PROBLEM" });
const margin = Object.freeze({ id: "ctx-problem-margin", name: "Margin Pressure", kind: "PROBLEM" });
const demand = Object.freeze({ id: "ctx-scenario-demand", name: "Demand Surge", kind: "SCENARIO" });
const pricing = Object.freeze({ id: "ctx-scenario-pricing", name: "Pricing Response", kind: "SCENARIO" });
const catalog = Object.freeze([capacity, margin, demand, pricing]);

function candidates(utterance: string, options: {
  explicit?: typeof catalog;
  collection?: { kind: string; members: typeof catalog; establishedAtTurn: number } | null;
  comparison?: ActiveComparisonContext | null;
} = {}) {
  const meaning = interpretExecutiveComparisonMeaning({
    utterance, intentKind: "compare", activeComparison: options.comparison ?? null,
  });
  return resolveExecutiveComparisonCandidateSet({
    meaning, explicitReferences: options.explicit ?? Object.freeze([]),
    activeCollection: options.collection ?? null, activeComparison: options.comparison ?? null,
    catalogReferences: catalog, turn: 5,
  });
}

test("active Problems collection outranks stale Demand Surge advisory context", () => {
  const set = candidates("which one is more serious for the company?", {
    collection: { kind: "PROBLEM", members: Object.freeze([capacity, margin]), establishedAtTurn: 4 },
  });
  assert.equal(set.source, "ACTIVE_COLLECTION");
  assert.equal(set.collectionKind, "PROBLEM");
  assert.deepEqual(set.candidateIds, [capacity.id, margin.id]);
  const result = resolveCollectionComparison({ candidateSet: set, historicalAdvisorySubject: demand.id });
  assert.equal(result.advisoryCompatible, false);
  assert.equal(result.advisoryEligible, false);
  assert.doesNotMatch(result.response ?? "", /Demand Surge|aligns better|Comparison complete/);
});

test("explicit references outrank an active collection", () => {
  const set = candidates("compare Demand Surge and Pricing Response", {
    explicit: Object.freeze([demand, pricing]),
    collection: { kind: "PROBLEM", members: Object.freeze([capacity, margin]), establishedAtTurn: 4 },
  });
  assert.equal(set.source, "EXPLICIT_REFERENCES");
  assert.deepEqual(set.candidateIds, [demand.id, pricing.id]);
});

test("current compatible collection wins in both direction changes", () => {
  const problems = candidates("compare them", {
    collection: { kind: "PROBLEM", members: Object.freeze([capacity, margin]), establishedAtTurn: 3 },
  });
  const scenarios = candidates("compare them", {
    collection: { kind: "SCENARIO", members: Object.freeze([demand, pricing]), establishedAtTurn: 4 },
  });
  assert.deepEqual(problems.candidateIds, [capacity.id, margin.id]);
  assert.deepEqual(scenarios.candidateIds, [demand.id, pricing.id]);
});

test("semantic modes and criteria remain distinct", () => {
  const cases = [
    ["compare them", "COMPARE", "UNSPECIFIED"],
    ["which is more urgent?", "PRIORITIZE", "URGENCY"],
    ["what is the difference between them?", "DIFFERENCE", "UNSPECIFIED"],
    ["which affects Delivery more?", "IMPACT", "DELIVERY_IMPACT"],
    ["which has stronger evidence?", "PRIORITIZE", "EVIDENCE_STRENGTH"],
    ["which has bigger financial impact?", "IMPACT", "FINANCIAL_IMPACT"],
  ] as const;
  for (const [utterance, mode, criterion] of cases) {
    const meaning = interpretExecutiveComparisonMeaning({ utterance, intentKind: "compare" });
    assert.equal(meaning.mode, mode);
    assert.equal(meaning.criterion, criterion);
  }
});

test("materially ambiguous importance remains unresolved until a criterion is established", () => {
  for (const utterance of [
    "which one is important?",
    "which one is more important?",
    "which one matters most?",
    "which one has higher priority?",
  ]) {
    const meaning = interpretExecutiveComparisonMeaning({ utterance, intentKind: "compare" });
    assert.equal(meaning.active, true, utterance);
    assert.equal(meaning.criterion, "UNSPECIFIED", utterance);
    assert.equal(meaning.criterionAmbiguous, true, utterance);
    assert.equal(meaning.ambiguityReason, "MATERIAL_IMPORTANCE_AMBIGUITY", utterance);
  }
  const explicit = interpretExecutiveComparisonMeaning({
    utterance: "which one is more important overall?",
    intentKind: "compare",
  });
  assert.equal(explicit.criterion, "OVERALL_SIGNIFICANCE");
  assert.equal(explicit.criterionAmbiguous, false);
  const forBusiness = interpretExecutiveComparisonMeaning({
    utterance: "which one is more important for business?",
    intentKind: "compare",
  });
  assert.equal(forBusiness.criterion, "UNSPECIFIED");
  assert.equal(forBusiness.criterionAmbiguous, true);
});

test("a pending criterion token stays comparison even if upstream intent looks like focus", () => {
  const comparison: ActiveComparisonContext = Object.freeze({
    candidateIds: Object.freeze([capacity.id, margin.id]), candidateKind: "SCENARIO",
    mode: "PRIORITIZE", criterion: "UNSPECIFIED", establishedAtTurn: 4, sourceCollectionTurn: 3,
  });
  const meaning = interpretExecutiveComparisonMeaning({
    utterance: "risk", intentKind: "focus", activeComparison: comparison,
  });
  assert.equal(meaning.active, true);
  assert.equal(meaning.criterion, "RISK");
  assert.equal(isExecutiveComparisonCriterionAnswer("risk"), true);
  assert.equal(isExecutiveComparisonCriterionAnswer("show risks"), false);
});

test("an established comparison criterion resolves otherwise ambiguous follow-up wording", () => {
  const comparison: ActiveComparisonContext = Object.freeze({
    candidateIds: Object.freeze([capacity.id, margin.id]), candidateKind: "PROBLEM",
    mode: "PRIORITIZE", criterion: "URGENCY", establishedAtTurn: 4, sourceCollectionTurn: 3,
  });
  const meaning = interpretExecutiveComparisonMeaning({
    utterance: "which one matters most?", intentKind: "unknown", activeComparison: comparison,
  });
  assert.equal(meaning.criterion, "URGENCY");
  assert.equal(meaning.criterionAmbiguous, false);
});

test("why and criterion shift reuse active comparison candidates", () => {
  const comparison: ActiveComparisonContext = Object.freeze({
    candidateIds: Object.freeze([capacity.id, margin.id]), candidateKind: "PROBLEM",
    mode: "PRIORITIZE", criterion: "DELIVERY_IMPACT", establishedAtTurn: 4, sourceCollectionTurn: 3,
  });
  const why = candidates("why?", { comparison });
  assert.equal(why.source, "ACTIVE_COMPARISON");
  assert.deepEqual(why.candidateIds, [capacity.id, margin.id]);
  const financialMeaning = interpretExecutiveComparisonMeaning({
    utterance: "what about financially?", intentKind: "unknown", activeComparison: comparison,
  });
  assert.equal(financialMeaning.active, true);
  assert.equal(financialMeaning.criterion, "FINANCIAL_IMPACT");
});

test("empty and one-member sets never borrow stale history", () => {
  const empty = candidates("which is worse?", {
    collection: { kind: "GOAL", members: Object.freeze([]), establishedAtTurn: 2 },
  });
  assert.equal(empty.source, "ACTIVE_COLLECTION");
  assert.deepEqual(empty.candidateIds, []);
  const one = candidates("which is worse?", {
    collection: { kind: "RISK", members: Object.freeze([demand]), establishedAtTurn: 2 },
  });
  const result = resolveCollectionComparison({ candidateSet: one, historicalAdvisorySubject: capacity.id });
  assert.equal(result.evidenceState, "INSUFFICIENT");
  assert.match(result.response ?? "", /only current|nothing else/i);
  assert.equal(result.preferredCandidateId, null);
});

test("ambiguous priority follow-ups retain an active collection despite upstream focus or explain labels", () => {
  for (const [utterance, intentKind] of [
    ["which one is important?", "focus"],
    ["which one matters most?", "focus"],
    ["which one is urgent?", "explain"],
    ["which one should I investigate first?", "explain"],
    ["which needs attention?", "focus"],
  ] as const) {
    const meaning = interpretExecutiveComparisonMeaning({
      utterance,
      intentKind,
      activeComparison: null,
      activeCollectionPresent: true,
    });
    assert.equal(meaning.active, true, utterance);
  }
});

test("plain navigation does not become comparison merely because a collection exists", () => {
  const meaning = interpretExecutiveComparisonMeaning({
    utterance: "focus on Margin Pressure",
    intentKind: "focus",
    activeComparison: null,
    activeCollectionPresent: true,
  });
  assert.equal(meaning.active, false);
});
