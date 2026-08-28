import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createEmptyNexoraExecutiveContextSnapshot,
  freezeExecutiveContextReference,
  type NexoraExecutiveContextSnapshot,
} from "../conversational-control/executiveContextSnapshot.ts";
import { projectConversationPathTrace } from "../nexora-certification/nxaConversationPathTrace.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { interpretExecutiveComparisonMeaning } from "./nexoraNcaPost4CollectionComparison.ts";
import {
  evaluateNxa5ExecutiveJudgment,
  type Nxa5JudgmentCandidate,
} from "./nexoraNxa5ExecutiveJudgment.ts";
import type { ExecutiveCollectionComparisonResult } from "./nexoraNcaPost4CollectionComparison.ts";
import type { ExecutiveSituation } from "./nexoraNxa3ExecutiveSituation.ts";
import type { ExecutiveAttentionIntelligence } from "./managerObjectAttentionTypes.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const problemIds = Object.freeze(["ctx-problem-capacity", "ctx-problem-margin"]);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(
  utterance: string,
  previous?: Turn,
  executiveContext?: NexoraExecutiveContextSnapshot,
): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext:
      executiveContext ??
      previous?.nextExecutiveContext ??
      createEmptyNexoraExecutiveContextSnapshot(),
    executiveSubjects: subjects,
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nxa5-fix3b-${utterance}`,
  });
}

function path(utterance: string, result: Turn) {
  return projectConversationPathTrace({ utterance, inheritedSubjectId: null, result });
}

function dialogue(result: Turn): NonNullable<Turn["ncaConversationState"]> {
  assert.ok(result.ncaConversationState);
  return result.ncaConversationState;
}

function situation(result: Turn): NonNullable<Turn["executiveSituation"]> {
  assert.ok(result.executiveSituation);
  return result.executiveSituation;
}

function problems(): Turn {
  const result = run("show me problems");
  assert.deepEqual(dialogue(result).lastCollection?.memberIds, problemIds);
  assert.deepEqual(result.nextRuntimeState.collectionContext?.objectIds, problemIds);
  return result;
}

function ambiguousImportance(): { collection: Turn; clarification: Turn } {
  const collection = problems();
  const clarification = run("which one of prolems is important?", collection);
  return { collection, clarification };
}

function assertProblemsStage(result: Turn, utterance: string): void {
  const trace = path(utterance, result);
  assert.equal(trace.readWrite, "read");
  assert.equal(trace.dirInstruction, "NO_CHANGE");
  assert.equal(trace.stageMode, "collection");
  assert.equal(trace.focusId, null);
  assert.deepEqual(trace.collectionMemberIds, problemIds);
  assert.equal(result.shouldCommitRuntime, false);
}

describe("NXA:5-FIX3B ambiguous importance clarification", () => {
  it("B1 — exact diagnosed conversation asks one bounded criterion question without ranking", () => {
    const { clarification } = ambiguousImportance();
    const meaning = interpretExecutiveComparisonMeaning({
      utterance: "which one of prolems is important?",
      intentKind: clarification.intentResult.intent.kind,
      activeCollectionPresent: true,
    });
    assert.equal(meaning.criterionAmbiguous, true);
    assert.equal(meaning.criterion, "UNSPECIFIED");
    assert.deepEqual(clarification.ncaPost4Comparison?.candidateSet.candidateIds, problemIds);
    assert.equal(clarification.ncaPost4Comparison?.preferredCandidateId, null);
    assert.equal(clarification.executiveJudgment, null);
    assert.match(clarification.response, /^Important in which sense—/);
    assert.doesNotMatch(clarification.response, /Capacity Gap (?:is|has)|Margin Pressure (?:is|has)/i);
    assert.equal(dialogue(clarification).pendingQuestion?.purpose, "comparison-criterion");
    assert.equal(dialogue(clarification).pendingQuestion?.expectedInformation, "PRIORITY");
    assert.equal(dialogue(clarification).pendingQuestion?.status, "ACTIVE");
    assert.deepEqual(dialogue(clarification).activeComparison?.candidateIds, problemIds);
    assert.equal(dialogue(clarification).activeComparison?.criterion, "UNSPECIFIED");
    assertProblemsStage(clarification, "which one of prolems is important?");
  });

  it("B2 — one-word urgency answers the pending question and returns criterion-specific insufficiency", () => {
    const { clarification } = ambiguousImportance();
    const urgency = run("urgency", clarification);
    assert.equal(urgency.ncaDialogueMove, "ANSWER_NEXORA");
    assert.equal(dialogue(urgency).lastAnswer?.kind, "PRIORITY");
    assert.equal(dialogue(urgency).pendingQuestion, null);
    assert.equal(urgency.ncaPost4Comparison?.criterion, "URGENCY");
    assert.deepEqual(urgency.ncaPost4Comparison?.candidateSet.candidateIds, problemIds);
    assert.equal(urgency.executiveJudgment?.preferredCandidateId, null);
    assert.match(urgency.response, /comparable urgency evidence/i);
    assert.match(urgency.response, /another explicit criterion/i);
    assertProblemsStage(urgency, "urgency");
  });

  it("B3 — an explicit urgency criterion evaluates directly without redundant clarification", () => {
    const collection = problems();
    const urgency = run("which one is more urgent?", collection);
    assert.equal(urgency.ncaPost4Comparison?.criterion, "URGENCY");
    assert.equal(dialogue(urgency).pendingQuestion?.purpose === "comparison-criterion", false);
    assert.doesNotMatch(urgency.response, /Important in which sense/i);
    assert.match(urgency.response, /urgency/i);
    assertProblemsStage(urgency, "which one is more urgent?");
  });

  it("B4 — Goal impact uses an authoritative Goal and reports missing Goal context otherwise", () => {
    const collection = problems();
    const goalContext: NexoraExecutiveContextSnapshot = Object.freeze({
      ...collection.nextExecutiveContext,
      currentGoal: freezeExecutiveContextReference({
        subjectId: "goal-delivery",
        subjectKind: "goal",
        canonicalName: "Improve Delivery Reliability",
        source: "conversation",
        turnIndex: collection.nextExecutiveContext.turnIndex,
      }),
    });
    const withGoal = run("which one affects the current goal more?", collection, goalContext);
    assert.equal(withGoal.ncaPost4Comparison?.criterion, "GOAL_IMPACT", JSON.stringify({
      response: withGoal.response,
      intent: withGoal.intentResult.intent.kind,
      scenario: withGoal.scenarioResult,
      nlu: withGoal.naturalLanguageUnderstanding,
      post3: withGoal.ncaPost3Diagnostics,
    }));
    assert.equal(situation(withGoal).goal?.title, "Improve Delivery Reliability");
    assert.doesNotMatch(withGoal.response, /more important overall/i);
    assert.doesNotMatch(withGoal.response, /causes? the Goal/i);
    assertProblemsStage(withGoal, "which one affects the current goal more?");

    const withoutGoal = run("which one affects the goal more?", collection);
    assert.equal(withoutGoal.ncaPost4Comparison?.criterion, "GOAL_IMPACT");
    assert.equal(situation(withoutGoal).goal, null);
    assert.equal(withoutGoal.executiveJudgment?.preferredCandidateId, null);
    assert.match(withoutGoal.response, /authoritative active Goal/i);
    assertProblemsStage(withoutGoal, "which one affects the goal more?");
  });

  it("B5/B6 — investigation priority and explicit overall importance remain distinct", () => {
    const collection = problems();
    const investigation = run("which should we investigate first?", collection);
    assert.equal(investigation.ncaPost4Comparison?.criterion, "INVESTIGATION_PRIORITY");
    assert.doesNotMatch(investigation.response, /more important overall|urgency evidence/i);
    assertProblemsStage(investigation, "which should we investigate first?");

    const overall = run("which one is more important overall?", collection);
    assert.equal(overall.ncaPost4Comparison?.criterion, "OVERALL_SIGNIFICANCE");
    assert.equal(overall.executiveJudgment?.preferredCandidateId, null);
    assert.doesNotMatch(overall.response, /Important in which sense/i);
    assert.match(overall.response, /overall-significance basis/i);
    assert.match(overall.response, /another explicit criterion/i);
    assertProblemsStage(overall, "which one is more important overall?");
  });

  it("B7 — evidence-sufficient risk comparison stays criterion-specific", () => {
    const candidates: readonly Nxa5JudgmentCandidate[] = [
      {
        id: "capacity",
        label: "Capacity Gap",
        kind: "problem",
        goalAlignment: "DIRECT",
        materiality: "HIGH",
        urgency: "MODERATE",
        riskExposure: "MODERATE",
        evidenceStrength: "MODERATE",
        consequence: "Delivery commitment may remain unsupported.",
        uncertainties: ["Capacity adequacy under expected workload is not yet verified."],
        constraints: [],
        feasible: true,
        reversibility: "REVERSIBLE",
        gains: ["reduces the most Decision-relevant uncertainty"],
        sacrifices: ["Margin analysis starts one step later."],
        learningValue: "HIGH",
        managerPreference: false,
        timeSensitive: false,
      },
      {
        id: "margin",
        label: "Margin Pressure",
        kind: "problem",
        goalAlignment: "RELATED",
        materiality: "HIGH",
        urgency: "LOW",
        riskExposure: "HIGH",
        evidenceStrength: "MODERATE",
        consequence: "Financial exposure may continue.",
        uncertainties: ["Comparable impact is not quantified."],
        constraints: [],
        feasible: true,
        reversibility: "PARTIAL",
        gains: ["improves cash and margin understanding"],
        sacrifices: ["Delivery uncertainty remains unresolved."],
        learningValue: "MODERATE",
        managerPreference: false,
        timeSensitive: false,
      },
    ];
    const situation = {
      identity: "NXA:3/ExecutiveContextSituationalAwareness",
      composedAtTurn: 3,
      goal: { title: "Improve Delivery", target: "96%", currentReality: "91%", gap: "5 points", status: "AT_RISK" },
      focus: {
        subjectId: "problems",
        label: "Problems",
        kind: "collection",
        collectionKind: "problem",
        collectionMemberIds: ["capacity", "margin"],
        comparisonIds: ["capacity", "margin"],
        relatedSubjects: ["Capacity Gap"],
      },
      investigation: { subjectId: null, evidence: [], claims: [], causalStatus: "UNCONFIRMED" },
      advisory: { recommendation: null, reason: null, status: "NONE" },
      decision: { subjectId: null, state: "not-started", confirmationPending: false },
      execution: { subjectId: null, state: "NOT_STARTED", blocker: null },
      outcome: { state: "NOT_OBSERVED", baseline: null, observed: null, goalImpact: null },
      conversation: { referent: "Problems", recentNeed: "ADVISE", pendingQuestion: null, latestManagerAssertion: null },
      change: { kind: "NONE", summary: null, affectsGoalOrRecommendation: false },
      strongestUnresolvedIssue: "Capacity adequacy is unknown.",
      conflicts: [],
    } as ExecutiveSituation;
    const attention = {
      attentionState: "ATTENTION",
      interventionAssessment: { need: "INTERVENTION_RECOMMENDED" },
    } as unknown as ExecutiveAttentionIntelligence;
    const comparison: ExecutiveCollectionComparisonResult = {
      candidateSet: {
        source: "ACTIVE_COLLECTION",
        collectionKind: "problem",
        candidateIds: ["capacity", "margin"],
        candidates: [
          { id: "capacity", label: "Capacity Gap", kind: "problem" },
          { id: "margin", label: "Margin Pressure", kind: "problem" },
        ],
        requestedRelation: "PRIORITIZE",
        criterion: "RISK",
        confidence: "HIGH",
        resolvedFromTurn: 2,
      },
      mode: "PRIORITIZE",
      criterion: "RISK",
      evidenceState: "SUFFICIENT",
      preferredCandidateId: null,
      ordering: [],
      reasons: [],
      uncertainty: [],
      advisoryCompatible: false,
      advisoryEligible: false,
      primaryOwner: "COLLECTION_COMPARISON",
      commitsDecision: false,
      startsExecution: false,
      businessMutations: [],
      response: null,
    };
    const judgment = evaluateNxa5ExecutiveJudgment({
      situation,
      attention,
      comparison,
      candidates,
      judgmentType: "RISK_PRIORITY",
      criterion: "RISK",
    });
    assert.equal(judgment.preferredCandidateId, "margin");
    assert.equal(judgment.criterion, "RISK");
    assert.match(judgment.managerMessage, /risk exposure/i);
    assert.doesNotMatch(judgment.managerMessage, /more important overall/i);
    assert.equal(judgment.writesStage, false);
    assert.equal(judgment.commitsDecision, false);

    const collection = problems();
    const evidence = run("which one has stronger evidence?", collection);
    assert.equal(evidence.ncaPost4Comparison?.criterion, "EVIDENCE_STRENGTH");
    assert.doesNotMatch(evidence.response, /Important in which sense/i);
    assert.doesNotMatch(evidence.response, /more important overall/i);
    assertProblemsStage(evidence, "which one has stronger evidence?");
  });

  it("B8 — an ambiguous deictic comparison without subjects requests them", () => {
    const result = run("which one is more important?");
    assert.equal(result.ncaPost4Comparison, null);
    assert.equal(result.executiveJudgment, null);
    assert.match(result.response, /Which Problems or objects do you want me to compare\?/i);
    assert.equal(dialogue(result).pendingQuestion?.purpose, "comparison-subjects");
    assert.equal(dialogue(result).pendingQuestion?.expectedInformation, "ENTITY");
    assert.equal(result.shouldCommitRuntime, false);
    assert.equal(result.nextRuntimeState.focusedSubject, null);
  });

  it("B9 — an unrelated collection command is not consumed as the criterion answer", () => {
    const { clarification } = ambiguousImportance();
    const decisions = run("show decisions", clarification);
    assert.notEqual(decisions.ncaDialogueMove, "ANSWER_NEXORA");
    assert.equal(dialogue(decisions).lastAnswer, null);
    assert.equal(decisions.intentResult.intent.kind, "show-decisions");
    assert.match(decisions.response, /Decision/i);
  });

  it("continuation proof — the offered evidence-strength criterion reuses the same subjects", () => {
    const { clarification } = ambiguousImportance();
    const urgency = run("urgency", clarification);
    assert.match(urgency.response, /evidence strength/i);
    const evidence = run("evidence strength", urgency);
    assert.equal(evidence.ncaPost4Comparison?.criterion, "EVIDENCE_STRENGTH");
    assert.deepEqual(evidence.ncaPost4Comparison?.candidateSet.candidateIds, problemIds);
    assert.equal(evidence.executiveJudgment?.preferredCandidateId, null);
    assert.doesNotMatch(evidence.response, /more important overall/i);
    assertProblemsStage(evidence, "evidence strength");
  });

  it("B10 — FIX3A typo Explain remains read-only and preserves Scenarios", () => {
    const scenarios = run("show scenarios");
    const explained = run("exlpain Demand Surge", scenarios);
    const trace = path("exlpain Demand Surge", explained);
    assert.equal(explained.intentResult.intent.kind, "explain-scenario");
    assert.equal(trace.readWrite, "read");
    assert.equal(trace.dirInstruction, "NO_CHANGE");
    assert.equal(trace.stageMode, "collection");
    assert.equal(trace.focusId, null);
    assert.equal(explained.shouldCommitRuntime, false);
  });
});
