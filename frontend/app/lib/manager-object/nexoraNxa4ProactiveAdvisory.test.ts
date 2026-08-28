import assert from "node:assert/strict";
import test from "node:test";
import { createProactiveExecutiveSignal } from "./nexoraNca5InitiativeIntelligence.ts";
import { composeNxa4MonitoringBoundaryResponse, evaluateNxa4ProactiveAdvisory, verifyNexoraNxa4 } from "./nexoraNxa4ProactiveAdvisory.ts";
import type { ExecutiveAttentionIntelligence } from "./managerObjectAttentionTypes.ts";
import type { ExecutiveInitiativeStrategy, ProactiveExecutiveSignal } from "./nexoraNca5InitiativeIntelligenceTypes.ts";
import type { ExecutiveSituation } from "./nexoraNxa3ExecutiveSituation.ts";
import type { NexoraConversationState } from "./nexoraNca2ConversationStateTypes.ts";

const situation = (overrides: Partial<ExecutiveSituation> = {}): ExecutiveSituation => ({
  identity: "NXA:3/ExecutiveContextSituationalAwareness", composedAtTurn: 4,
  goal: { title: "Improve Delivery", target: "96%", currentReality: "91%", gap: "5 points", status: "AT_RISK" },
  focus: { subjectId: "delivery", label: "Delivery", kind: "KPI", collectionKind: null, collectionMemberIds: [], comparisonIds: [], relatedSubjects: ["Capacity"] },
  investigation: { subjectId: "delivery", evidence: ["Delivery is 91%"], claims: [], causalStatus: "UNCONFIRMED" },
  advisory: { recommendation: null, reason: null, status: "NONE" },
  decision: { subjectId: null, state: "not-started", confirmationPending: false },
  execution: { subjectId: null, state: "NOT_STARTED", blocker: null },
  outcome: { state: "NOT_OBSERVED", baseline: "91", observed: null, goalImpact: "AT_RISK" },
  conversation: { referent: "Delivery", recentNeed: "ADVISE", pendingQuestion: null, latestManagerAssertion: null },
  change: { kind: "DATA", summary: "Delivery changed.", affectsGoalOrRecommendation: true },
  strongestUnresolvedIssue: null, conflicts: [], ...overrides,
});

const attention = (urgent = false, quiet = false): ExecutiveAttentionIntelligence => ({
  engineId: "MO:6/ExecutiveAttentionInterventionIntelligence", attentionState: quiet ? "NONE" : urgent ? "URGENT" : "ATTENTION",
  attentionItems: [], primaryAttention: null, secondaryItems: [], comparablePriority: false,
  interventionAssessment: {
    need: quiet ? "NOT_REQUIRED" : urgent ? "ESCALATION_REQUIRED" : "ACTION_REQUIRED",
    trigger: null,
    reason: "MO:6 established significance.",
    managerAuthorityRequired: true,
  },
  safeToContinueItems: [], doNotDisturb: quiet, goalRankingAvailable: true, stealsDirectFocus: false,
  inactionConsequence: "", unknowns: [], reasoningSummary: "authoritative attention", managerFacingText: "",
  usesLlm: false, commitsDecision: false, startsExecution: false, changesExecution: false, changesGoals: false, writesStageCoordinates: false,
});

const strategy = (signal: ReturnType<typeof createProactiveExecutiveSignal>, initiate = true): ExecutiveInitiativeStrategy => ({
  identity: "NCA:5/ProactiveExecutiveAdvisorConversationalInitiativeIntelligence", shouldInitiate: initiate,
  decision: { shouldInitiate: initiate, signal, reason: "candidate", priority: signal.critical ? "CRITICAL" : "HIGH", behavior: "WARN", interruption: { justified: initiate, reason: "candidate" }, value: 1, competingCount: 0 },
  strategy: { behavior: "WARN", subject: signal.subjectLabel, objective: "advise", reasonForInitiative: "candidate", evidence: signal.evidence, nextCapability: "MO:6", interruptionJustified: initiate, suppressRepeat: false, presentationIntent: { kind: "advisor-message", subject: signal.subjectLabel, reason: "candidate", importance: "HIGH", evidence: signal.evidence, recommendedNextStep: signal.nextStep ?? null }, timelineIntent: null },
  snapshot: null, response: null, question: null, commitsDecision: false, startsExecution: false, reason: "candidate",
});

const signal = (overrides: Partial<ProactiveExecutiveSignal> = {}) => createProactiveExecutiveSignal({
  previousValue: 91, currentValue: 87, targetValue: 96,
  significance: .84, relevance: .95, urgency: .72, novelty: 1, actionability: .8, confidence: .9,
  evidence: ["Validated Delivery observation: 87%"], nextStep: "check the new constraint before committing.",
  ...overrides,
  id: overrides.id ?? "delivery-change",
  family: overrides.family ?? "MATERIAL_CHANGE",
  source: overrides.source ?? "validated-data",
  subjectId: overrides.subjectId ?? "delivery",
  subjectLabel: overrides.subjectLabel ?? "Delivery",
  observation: overrides.observation ?? "Delivery fell from 91 to 87.",
});

function evaluate(candidate = signal(), overrides: Record<string, unknown> = {}) {
  return evaluateNxa4ProactiveAdvisory({ situation: situation(), attention: attention(), initiative: strategy(candidate), candidate, ...overrides });
}

test("NXA:4 boundary is a composition policy, not a duplicate authority", () => assert.deepEqual(verifyNexoraNxa4(), { ok: true }));

test("A material KPI deterioration linked to the Goal speaks without inventing cause", () => {
  const result = evaluate();
  assert.equal(result.disposition, "SPEAK");
  assert.equal(result.goalRelevance, "DIRECT");
  assert.match(result.managerMessage!, /91 to 87/);
  assert.doesNotMatch(result.managerMessage!, /caused by/);
});

test("Noise and process-only state are intelligent silence", () => {
  assert.equal(evaluate(signal({ significance: .1, urgency: .1, actionability: .1 })).disposition, "SUPPRESS");
  assert.equal(evaluate(signal({ processOnly: true })).managerMessage, null);
});

test("An unchanged prior intervention is suppressed but material deterioration re-evaluates", () => {
  const prior = { signalId: "delivery-change", subjectId: "delivery", family: "MATERIAL_CHANGE", fingerprint: "prior", behavior: "WARN", priority: "HIGH", observation: "Delivery fell.", currentValue: 87 };
  const conversation = { lastInitiativeSnapshot: prior, dismissedInitiativeKeys: [], suppressedInitiativeKeys: [] } as unknown as NexoraConversationState;
  assert.equal(evaluate(signal(), { conversation }).disposition, "SUPPRESS");
  assert.equal(evaluate(signal({ currentValue: 80, critical: true, urgency: .95 }), { conversation, attention: attention(true) }).disposition, "ESCALATE");
});

test("Manager override and high-value focus defer ordinary interruption, not critical escalation", () => {
  assert.equal(evaluate(signal({ subjectId: "capacity", subjectLabel: "Capacity" }), { managerOverride: true }).disposition, "DEFER");
  assert.equal(evaluate(signal({ subjectId: "minor-kpi", subjectLabel: "Minor KPI" }), { managerFocusImportance: "CRITICAL" }).disposition, "DEFER");
  assert.equal(evaluate(signal({ family: "DECISION_RISK", subjectId: "capacity", subjectLabel: "Capacity", critical: true, urgency: .95 }), { managerOverride: true, attention: attention(true) }).disposition, "ESCALATE");
});

test("Decision premise invalidation and execution blocker escalate without mutating CC truth", () => {
  for (const family of ["ASSUMPTION_INVALIDATION", "EXECUTION_DRIFT"] as const) {
    const result = evaluateNxa4ProactiveAdvisory({ situation: situation({ decision: { subjectId: "decision-1", state: "approved", confirmationPending: false }, execution: { subjectId: "execution-1", state: "ACTIVE", blocker: "Capacity unavailable" } }), attention: attention(true), initiative: strategy(signal({ family, critical: true, urgency: .95 })), candidate: signal({ family, critical: true, urgency: .95 }) });
    assert.equal(result.disposition, "ESCALATE");
    assert.equal(result.commitsDecision, false); assert.equal(result.changesExecution, false); assert.equal(result.writesStage, false);
  }
});

test("Positive and partial Outcomes preserve causal uncertainty", () => {
  for (const currentValue of [96, 94]) {
    const result = evaluate(signal({ family: "OUTCOME_CHANGE", currentValue, positive: true, observation: `Delivery improved to ${currentValue}.`, nextStep: null }));
    assert.equal(result.disposition, "SPEAK");
    assert.match(result.managerMessage!, /does not by itself establish causality/);
  }
});

test("A material Opportunity can speak; weak evidence defers and cannot warn confidently", () => {
  assert.equal(evaluate(signal({ family: "OPPORTUNITY", positive: true, observation: "New capacity makes the lower-cost scenario viable." })).disposition, "SPEAK");
  const weak = evaluate(signal({ family: "RISK_ESCALATION", confidence: .3, evidence: [], critical: false, urgency: .4 }));
  assert.equal(weak.disposition, "DEFER"); assert.equal(weak.managerMessage, null);
});

test("Generic policy covers Problem, Risk, Decision, Execution, and Outcome families", () => {
  const families = ["MATERIAL_CHANGE", "RISK_ESCALATION", "DECISION_RISK", "EXECUTION_DRIFT", "OUTCOME_CHANGE"] as const;
  assert.deepEqual(families.map((family) => evaluate(signal({ family })).candidate?.category), families);
});

test("Monitoring response is honest when no runtime monitoring exists", () => {
  assert.match(composeNxa4MonitoringBoundaryResponse(false), /not continuously monitoring/i);
  assert.match(composeNxa4MonitoringBoundaryResponse(false), /when new data or observations enter/i);
});
