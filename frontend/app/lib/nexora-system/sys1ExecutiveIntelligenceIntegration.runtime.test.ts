/**
 * NPA-T SYS:1 — Executive Intelligence Integration Audit.
 * Observes certified ECA / NPS / CC / Theatre connections. Does not add capabilities.
 */
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import { toNexoraConversationContextSnapshot } from "@/app/lib/conversational-control/executiveContextProjection.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  activateManagerObjectFromClick,
  createEmptyManagerObjectSession,
} from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import { syncNexoraExecutiveContextFromRuntimeState } from "@/app/lib/nex-mvp/nexoraMVPExecutiveContextAwareness.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { resetWorkspaceRiskStoreForTests } from "@/app/lib/risk/workspaceRiskContract.ts";
import { ensureBrowserLocalStorageHarness } from "@/app/lib/test-harness/browserLocalStorageHarness.ts";
import { createWorkspace, resetWorkspaceRegistryForTests } from "@/app/lib/workspace/workspaceRegistryStore.ts";
import { resetOutcomeObservationCaptureForTests } from "@/app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  csvImportCandidateId,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "@/app/lib/data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  suggestCsvColumnMappings,
} from "@/app/lib/data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "@/app/lib/data-reality/csvSemanticUnderstanding.ts";
import { composeNpsOutcomeLearning } from "@/app/lib/nexora-problem-solving/npsOutcomeLearning.ts";
import type { NpsCanonicalFacts } from "@/app/lib/nexora-problem-solving/npsProblemSolvingPath.ts";

const ARCH = /\b(?:NPS:\d|ECA:\d|CC:\d{1,2}|CORE-OUT|CORE-INT|NCA-POST|DTH:\d)\b/i;
const CAPACITY = "ctx-problem-capacity";
const MARGIN = "ctx-problem-margin";
const DEMAND = "ctx-scenario-demand";
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const AMBIGUOUS_CSV = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  resetOutcomeObservationCaptureForTests();
  resetCsvRealDataImportStoreForTests();
  return createWorkspace("SYS:1 Runtime Proofs").workspaceId;
}

afterEach(() => {
  resetCsvRealDataImportStoreForTests();
});

function run(
  utterance: string,
  workspaceId: string,
  previous?: Turn,
  overlay?: {
    readonly runtimeState?: Turn["nextRuntimeState"];
    readonly previousManagerObjectSession?: Turn["managerObjectTurn"]["session"];
    readonly executiveContext?: Turn["nextExecutiveContext"];
    readonly previousUtterance?: string | null;
  },
): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: overlay?.executiveContext
      ? toNexoraConversationContextSnapshot(overlay.executiveContext)
      : previous?.nextConversationContext ?? {
          currentSubjectId: null,
          previousSubjectIds: [],
          currentWorkspaceId: workspaceId,
        },
    executiveContext:
      overlay?.executiveContext ??
      previous?.nextExecutiveContext ??
      createEmptyNexoraExecutiveContextSnapshot({ currentWorkspaceId: workspaceId }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState:
      overlay?.runtimeState ??
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession:
      overlay?.previousManagerObjectSession ??
      previous?.managerObjectTurn.session ??
      createEmptyManagerObjectSession(),
    messageIdSeed: `sys-1-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    previousUtterance: overlay?.previousUtterance ?? previous?.managerMessage.text ?? null,
    lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null,
  });
}

function seedCsv() {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName: "data-ux3-ambiguous.csv",
    fileSize: AMBIGUOUS_CSV.length,
    csvText: AMBIGUOUS_CSV,
    importId: "sys-1:data-ux3-ambiguous.csv",
    importedAt: "2026-09-15T00:00:00.000Z",
  });
  const parse = parseCsvDeterministically(AMBIGUOUS_CSV);
  saveCsvImportCandidate(
    Object.freeze({
      workspaceId: "overview",
      candidateId: csvImportCandidateId("overview", "data-ux3-ambiguous.csv"),
      fileName: "data-ux3-ambiguous.csv",
      status: "preview",
      input,
      parse,
      mapping: interpretCsvSemantics({
        input,
        parse,
        structural: suggestCsvColumnMappings(parse.columns, input.importId),
      }),
      prepared: null,
      error: null,
      replacementSourceContextId: null,
    }),
  );
}

function npsZeroWrite(result: Turn) {
  assert.equal(result.npsUnderstanding?.commitsDecision, false);
  assert.equal(result.npsUnderstanding?.startsExecution, false);
  assert.equal(result.npsEvidenceCause?.writesScenario, false);
  assert.equal(result.npsOptionGeneration?.writesScenario, false);
  assert.equal(result.npsComparisonRecommendation?.commitsDecision, false);
  assert.equal(result.npsDecisionCommitment?.npsWritesDecision, false);
  assert.equal(result.npsDecisionCommitment?.startsExecution, false);
  assert.equal(result.npsExecutionMonitoring?.npsWritesExecution, false);
  assert.equal(result.npsOutcomeLearning?.writesOutcome, false);
  assert.equal(result.npsOutcomeLearning?.writesLearning, false);
  assert.equal(result.npsOutcomeLearning?.learningDurable, false);
}

function theatreDoesNotContradictNps(result: Turn) {
  const intent = result.decisionTheatre?.sceneIntent.intentKind ?? null;
  const nps = result.npsPath?.currentState ?? null;
  const executionId = result.npsExecutionMonitoring?.executionId ?? null;
  const approved = result.npsDecisionCommitment?.approvedDecisionId ?? null;
  if (nps === "COMPARING_OPTIONS" || nps === "OPTIONS_AVAILABLE" || nps === "RECOMMENDATION_READY") {
    if (!executionId) {
      assert.notEqual(intent, "REVIEW_EXECUTION");
    }
    if (!approved) {
      assert.notEqual(intent, "REVIEW_COMMITMENT");
    }
  }
  if (nps === "AWAITING_COMMITMENT" && !approved) {
    assert.notEqual(intent, "REVIEW_EXECUTION");
  }
}

function clickSubject(previous: Turn, subjectId: string) {
  const clickedState = selectNexoraMVPInteractionSubject(previous.nextRuntimeState, subjectId, catalog);
  const synced = syncNexoraExecutiveContextFromRuntimeState({
    previousContext: previous.nextExecutiveContext,
    nextState: clickedState,
    syncSource: "runtime",
    executiveSubjects: subjects,
    catalog,
  });
  const clickedSession = activateManagerObjectFromClick(
    previous.managerObjectTurn.session,
    clickedState.focusedSubject?.id ?? subjectId,
  );
  return { clickedState, synced, clickedSession };
}

test("SYS:1 A — ECA ↔ NPS referent: Capacity Gap → investigate it → why?", () => {
  const workspaceId = setup();
  const work = run("Let's work on Capacity Gap.", workspaceId);
  npsZeroWrite(work);
  assert.equal(work.npsUnderstanding?.problemId, CAPACITY);
  const investigate = run("Investigate it.", workspaceId, work);
  npsZeroWrite(investigate);
  assert.equal(investigate.npsUnderstanding?.problemId, CAPACITY);
  assert.doesNotMatch(investigate.response, ARCH);
  const why = run("Why?", workspaceId, investigate);
  npsZeroWrite(why);
  assert.equal(why.npsUnderstanding?.problemId, CAPACITY);
  assert.equal(why.npsEvidenceCause?.problemId, CAPACITY);
  assert.match(why.response, /Capacity Gap/i);
  assert.doesNotMatch(why.response, ARCH);
  theatreDoesNotContradictNps(why);
});

test("SYS:1 B — Stage click ↔ Advisor: Capacity Gap then Demand Surge", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const clickCapacity = clickSubject(listed, CAPACITY);
  assert.equal(clickCapacity.clickedState.focusedSubject?.id, CAPACITY);
  const explain = run("Explain it.", workspaceId, listed, {
    runtimeState: clickCapacity.clickedState,
    previousManagerObjectSession: clickCapacity.clickedSession,
    executiveContext: clickCapacity.synced.nextContext,
  });
  npsZeroWrite(explain);
  assert.equal(explain.nextRuntimeState.focusedSubject?.id, CAPACITY);
  assert.match(explain.response, /Capacity Gap/i);
  assert.doesNotMatch(explain.response, ARCH);

  const clickDemand = clickSubject(explain, DEMAND);
  const more = run("Tell me more about it.", workspaceId, explain, {
    runtimeState: clickDemand.clickedState,
    previousManagerObjectSession: clickDemand.clickedSession,
    executiveContext: clickDemand.synced.nextContext,
  });
  npsZeroWrite(more);
  assert.match(more.response, /Demand Surge/i);
  const unrelated = run("What is the Goal for Capacity Gap?", workspaceId, more);
  npsZeroWrite(unrelated);
  assert.match(unrelated.response, /goal|Capacity Gap|temporary capacity/i);
  assert.doesNotMatch(unrelated.response, ARCH);
});

test("SYS:1 C — Data ↔ Evidence: unconfirmed BKL stays unconfirmed", () => {
  const workspaceId = setup();
  seedCsv();
  const listed = run("Explain this CSV.", workspaceId);
  npsZeroWrite(listed);
  const bkl = run("What does BKL mean?", workspaceId, listed);
  npsZeroWrite(bkl);
  assert.doesNotMatch(bkl.response, /BKL means backlog/i);
  assert.match(bkl.response, /BKL/i);
  const evidence = run("What evidence does this give us about Capacity Gap?", workspaceId, bkl);
  npsZeroWrite(evidence);
  assert.notEqual(evidence.npsEvidenceCause?.causalStatus, "CONFIRMED_CAUSE");
  assert.equal(evidence.npsEvidenceCause?.confirmedCause, null);
});

test("SYS:1 D/E — Evidence ↔ NPS and NPS ↔ Scenario: no confirmed cause, no Scenario write", () => {
  const workspaceId = setup();
  const work = run("Let's work on Capacity Gap.", workspaceId);
  const causing = run("What seems to be contributing?", workspaceId, work);
  npsZeroWrite(causing);
  assert.equal(causing.npsEvidenceCause?.problemId, CAPACITY);
  assert.equal(causing.npsEvidenceCause?.confirmedCause, null);
  const options = run("What options do we have?", workspaceId, causing);
  npsZeroWrite(options);
  assert.equal(options.npsOptionGeneration?.writesScenario, false);
  assert.ok((options.npsOptionGeneration?.optionCandidates?.length ?? 0) >= 1);
  theatreDoesNotContradictNps(options);
});

test("SYS:1 F/G/K — Recommendation ≠ Decision; Decision ≠ Execution; stale Yes is safe", () => {
  const workspaceId = setup();
  const work = run("Let's work on Capacity Gap.", workspaceId);
  const recommend = run("Which one do you recommend?", workspaceId, run("What options do we have?", workspaceId, work));
  npsZeroWrite(recommend);
  assert.equal(recommend.npsDecisionCommitment?.approvedDecisionId, null);
  const notDecision = run("So that's our Decision?", workspaceId, recommend);
  npsZeroWrite(notDecision);
  assert.equal(notDecision.npsDecisionCommitment?.approvedDecisionId, null);
  assert.match(notDecision.response, /not an approved Decision|has not been approved|not been approved|preference|recommend/i);
  theatreDoesNotContradictNps(notDecision);

  const prefer = run("I prefer External Capacity.", workspaceId, notDecision);
  const proceed = run("Let's proceed.", workspaceId, prefer);
  npsZeroWrite(proceed);
  assert.equal(proceed.npsDecisionCommitment?.approvedDecisionId, null);
  assert.equal(proceed.npsExecutionMonitoring?.executionId, null);

  const topic = run("Tell me about Margin Pressure.", workspaceId, proceed);
  const staleYes = run("Yes.", workspaceId, topic);
  npsZeroWrite(staleYes);
  assert.equal(staleYes.npsDecisionCommitment?.npsWritesDecision, false);
  assert.equal(staleYes.npsExecutionMonitoring?.npsWritesExecution, false);
  assert.notEqual(staleYes.npsPath?.currentState, "EXECUTING");
  assert.ok(
    staleYes.npsUnderstanding?.problemId === MARGIN ||
      staleYes.npsUnderstanding?.problemId === CAPACITY ||
      staleYes.npsUnderstanding?.problemId == null,
  );
});

test("SYS:1 H/I/J — Monitoring/Outcome/NPS distinctions and reassessment compose", () => {
  const workspaceId = setup();
  const work = run("Let's work on Capacity Gap.", workspaceId);
  const going = run("How is it going?", workspaceId, work);
  npsZeroWrite(going);
  assert.equal(going.npsExecutionMonitoring?.npsWritesExecution, false);
  if (going.npsExecutionMonitoring?.executionId == null) {
    assert.notEqual(going.npsPath?.currentState, "EXECUTING");
  }
  const worked = run("Did it work?", workspaceId, going);
  npsZeroWrite(worked);
  assert.notEqual(worked.npsOutcomeLearning?.resolutionStatus, "RESOLVED");
  const facts: NpsCanonicalFacts = Object.freeze({
    problem: Object.freeze({
      problemId: CAPACITY,
      problemLabel: "Capacity Gap",
      confidence: "HIGH",
      observedFrom: "SYS:1 audit",
    }),
    investigationPresent: true,
    evidenceState: "PARTIAL",
    causeHypothesesAvailable: true,
    scenarioIds: Object.freeze(["ctx-scenario-capacity"]),
    comparisonAvailable: true,
    recommendationReady: true,
    awaitingCommitment: false,
    approvedDecisionId: "dec-capacity-1",
    execution: Object.freeze({
      present: true,
      executionId: "exec-capacity-1",
      status: "COMPLETED" as const,
      observedFrom: "CC:11 Execution",
    }),
    outcome: Object.freeze({ observed: true, problemResolved: null }),
    stageFocusId: DEMAND,
    conversationSubjectId: MARGIN,
  });
  const partial = composeNpsOutcomeLearning({
    pathFacts: facts,
    observation: {
      decisionId: "dec-capacity-1",
      decisionTitle: "External Capacity",
      executionId: "exec-capacity-1",
      executionStatus: "completed",
      executionTitle: "External Capacity rollout",
      measure: "OTD",
      baseline: 91,
      goal: 96,
      expected: 96,
      observed: 94,
      evidencePresent: true,
    },
  });
  assert.equal(partial.resolutionStatus, "PARTIALLY_RESOLVED");
  assert.equal(partial.path.currentState, "REASSESSMENT");
  assert.equal(partial.writesOutcome, false);
  const resolved = composeNpsOutcomeLearning({
    pathFacts: facts,
    observation: {
      decisionId: "dec-capacity-1",
      decisionTitle: "External Capacity",
      executionId: "exec-capacity-1",
      executionStatus: "completed",
      executionTitle: "External Capacity rollout",
      measure: "OTD",
      baseline: 91,
      goal: 96,
      expected: 96,
      observed: 96.4,
      evidencePresent: true,
    },
  });
  assert.equal(resolved.path.currentState, "RESOLVED");
  assert.equal(resolved.writesOutcome, false);
  assert.equal(resolved.npsWritesDecision, false);
});

test("SYS:1 L — Competing Stage/collection/stale Scenario cannot replace stronger active Problem", () => {
  const workspaceId = setup();
  const work = run("Let's work on Capacity Gap.", workspaceId);
  assert.equal(work.npsUnderstanding?.problemId, CAPACITY);
  const collection = run("Show me the scenarios.", workspaceId, work);
  npsZeroWrite(collection);
  const options = run("What options do we have?", workspaceId, collection);
  npsZeroWrite(options);
  assert.equal(options.npsUnderstanding?.problemId, CAPACITY);
  assert.equal(options.npsOptionGeneration?.problemId, CAPACITY);
  const clickDemand = clickSubject(options, DEMAND);
  const compare = run("Compare them.", workspaceId, options, {
    runtimeState: clickDemand.clickedState,
    previousManagerObjectSession: clickDemand.clickedSession,
    executiveContext: clickDemand.synced.nextContext,
  });
  npsZeroWrite(compare);
  assert.equal(compare.npsUnderstanding?.problemId, CAPACITY);
  assert.notEqual(compare.npsUnderstanding?.problemId, DEMAND);
  theatreDoesNotContradictNps(compare);
});

test("SYS:1 live — bounded /executive Advisor + Theatre journey", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  npsZeroWrite(listed);
  assert.doesNotMatch(listed.response, ARCH);
  theatreDoesNotContradictNps(listed);

  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  assert.equal(work.npsUnderstanding?.problemId, CAPACITY);
  npsZeroWrite(work);
  theatreDoesNotContradictNps(work);

  const explain = run("Explain it.", workspaceId, work);
  assert.equal(explain.npsUnderstanding?.problemId, CAPACITY);
  assert.match(explain.response, /Capacity Gap/i);

  const evidence = run("What evidence do we have?", workspaceId, explain);
  assert.equal(evidence.npsEvidenceCause?.problemId, CAPACITY);
  assert.equal(evidence.npsEvidenceCause?.confirmedCause, null);

  const contributing = run("What seems to be contributing?", workspaceId, evidence);
  assert.notEqual(contributing.npsEvidenceCause?.causalStatus, "CONFIRMED_CAUSE");

  const options = run("What options do we have?", workspaceId, contributing);
  assert.ok((options.npsOptionGeneration?.optionCandidates?.length ?? 0) >= 1);

  const compare = run("Compare them.", workspaceId, options);
  assert.equal(compare.npsComparisonRecommendation?.problemId, CAPACITY);
  theatreDoesNotContradictNps(compare);

  const recommend = run("Which one do you recommend?", workspaceId, compare);
  assert.equal(recommend.npsDecisionCommitment?.approvedDecisionId, null);

  const notDecision = run("So that's our Decision?", workspaceId, recommend);
  assert.equal(notDecision.npsDecisionCommitment?.approvedDecisionId, null);

  const prefer = run("I prefer External Capacity.", workspaceId, notDecision);
  assert.equal(prefer.npsDecisionCommitment?.approvedDecisionId, null);

  const proceed = run("Let's proceed.", workspaceId, prefer);
  assert.equal(proceed.npsDecisionCommitment?.startsExecution, false);

  const confirm = run("Yes.", workspaceId, proceed);
  npsZeroWrite(confirm);
  if (confirm.npsDecisionCommitment?.approvedDecisionId) {
    assert.ok(
      confirm.npsExecutionMonitoring?.executionId == null ||
        confirm.npsExecutionMonitoring.readinessStatus === "ALREADY_EXECUTING",
    );
  }

  const ready = run("Are we ready to execute?", workspaceId, confirm);
  npsZeroWrite(ready);
  const start = run("Start it.", workspaceId, ready);
  npsZeroWrite(start);
  if (!start.npsDecisionCommitment?.approvedDecisionId) {
    assert.equal(start.npsExecutionMonitoring?.executionId, null);
    assert.notEqual(start.npsPath?.currentState, "EXECUTING");
  }

  const going = run("How is it going?", workspaceId, start);
  npsZeroWrite(going);
  const worked = run("Did it work?", workspaceId, going);
  assert.notEqual(worked.npsOutcomeLearning?.resolutionStatus, "RESOLVED");
  const solved = run("Is Capacity Gap solved?", workspaceId, worked);
  assert.notEqual(solved.npsOutcomeLearning?.resolutionStatus, "RESOLVED");
  const next = run("What should we do now?", workspaceId, solved);
  npsZeroWrite(next);
  assert.equal(next.npsUnderstanding?.problemId, CAPACITY);
  assert.doesNotMatch(next.response, ARCH);
  theatreDoesNotContradictNps(next);
});
