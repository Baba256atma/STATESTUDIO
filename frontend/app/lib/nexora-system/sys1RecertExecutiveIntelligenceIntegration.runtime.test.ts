/**
 * NPA-T SYS:1-RECERT — Executive Intelligence Integration Recertification.
 * Observes FIX1 + FIX2 plus the SYS:1 chain. Does not add capabilities.
 */
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import { toNexoraConversationContextSnapshot } from "@/app/lib/conversational-control/executiveContextProjection.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { resolveNexoraConversationalIntent } from "@/app/lib/conversational-control/conversationalIntentResolver.ts";
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

const ARCH = /\b(?:NPS:\d|ECA:\d|CC:\d{1,2}|CORE-OUT|CORE-INT|NCA-POST|DTH:\d|presentedSetKind|candidateId|referent resolver|canonical writer)\b/i;
const CAPACITY = "ctx-problem-capacity";
const MARGIN = "ctx-problem-margin";
const OBJECT_CAPACITY = "obj-capacity";
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
  return createWorkspace("SYS:1-RECERT Runtime Proofs").workspaceId;
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
    messageIdSeed: `sys-1-recert-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    previousUtterance: previous?.managerMessage.text ?? null,
    lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null,
  });
}

function seedCsv() {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName: "data-ux3-ambiguous.csv",
    fileSize: AMBIGUOUS_CSV.length,
    csvText: AMBIGUOUS_CSV,
    importId: "sys-1-recert:data-ux3-ambiguous.csv",
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

function afterClick(previous: Turn, subjectId: string, utterance: string, workspaceId: string) {
  const click = clickSubject(previous, subjectId);
  return run(utterance, workspaceId, previous, {
    runtimeState: click.clickedState,
    previousManagerObjectSession: click.clickedSession,
    executiveContext: click.synced.nextContext,
  });
}

function assertCapacityEverywhere(result: Turn) {
  assert.equal(result.nextRuntimeState.focusedSubject?.id, CAPACITY);
  assert.equal(result.ecaWorkingContext?.activeSubject?.id, CAPACITY);
  assert.equal(result.managerObjectTurn.activeObjectId, CAPACITY);
  assert.equal(result.npsUnderstanding?.problemId, CAPACITY);
  assert.match(result.response, /Capacity Gap/i);
  assert.doesNotMatch(result.response, ARCH);
}

function namedOption(turn: Turn, which: "external" | "internal") {
  const options = turn.npsComparisonRecommendation?.comparedOptions ?? [];
  return which === "external"
    ? options.find((item) => /external/i.test(item.title)) ?? null
    : options.find((item) => /internal/i.test(item.title) || /expansion/i.test(item.title)) ?? null;
}

function assertOptionDomain(result: Turn) {
  assert.doesNotMatch(
    result.response,
    /Both Capacity Gap and Margin Pressure|Capacity Gap and Margin Pressure are the current comparison/i,
  );
  const labels = (result.ncaPost4Comparison?.candidateSet.candidates ?? []).map((item) => item.label).join(" ");
  assert.doesNotMatch(labels, /Margin Pressure/i);
  assert.match(
    `${result.response} ${labels}`,
    /external capacity|internal capacity|Capacity Expansion Plan/i,
  );
}

function toOptions(workspaceId: string) {
  const listed = run("Show me the problems.", workspaceId);
  const explained = afterClick(listed, CAPACITY, "Explain it.", workspaceId);
  const options = run("What options do we have?", workspaceId, explained);
  return { listed, explained, options };
}

const outcomeFacts: NpsCanonicalFacts = Object.freeze({
  problem: Object.freeze({
    problemId: CAPACITY,
    problemLabel: "Capacity Gap",
    confidence: "HIGH",
    observedFrom: "SYS:1-RECERT",
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
  stageFocusId: "ctx-scenario-demand",
  conversationSubjectId: MARGIN,
});

test("SYS:1-RECERT A — Stage click fidelity: Capacity Gap everywhere", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const explain = afterClick(listed, CAPACITY, "Explain it.", workspaceId);
  npsZeroWrite(explain);
  assertCapacityEverywhere(explain);
  assert.doesNotMatch(explain.response, /^Margin Pressure/i);
});

test("SYS:1-RECERT B — relationship deictic uses the active referent", () => {
  const intent = resolveNexoraConversationalIntent({ utterance: "What is related to it?" });
  assert.equal(intent.intent.kind, "show-related");
  assert.doesNotMatch(JSON.stringify(intent.intent.targetHints), /related to it/i);
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const explain = afterClick(listed, OBJECT_CAPACITY, "Explain it.", workspaceId);
  const related = run("What is related to it?", workspaceId, explain);
  npsZeroWrite(related);
  assert.doesNotMatch(related.response, /couldn't find a clear match for “Related To It”/i);
  assert.notEqual(related.intentResult.intent.kind, "explain");
  assert.ok(
    related.ecaWorkingContext?.activeSubject?.id === OBJECT_CAPACITY ||
      related.managerObjectTurn.activeObjectId === OBJECT_CAPACITY ||
      related.npsUnderstanding?.problemId === CAPACITY,
  );
  assert.doesNotMatch(related.response, ARCH);
});

test("SYS:1-RECERT C — investigation continuity stays on Capacity Gap", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const investigate = afterClick(listed, CAPACITY, "Investigate it.", workspaceId);
  npsZeroWrite(investigate);
  assert.equal(investigate.npsUnderstanding?.problemId, CAPACITY);
  const why = run("Why?", workspaceId, investigate);
  npsZeroWrite(why);
  assert.equal(why.npsUnderstanding?.problemId, CAPACITY);
  assert.equal(why.npsEvidenceCause?.problemId, CAPACITY);
  assert.match(why.response, /Capacity Gap/i);
});

test("SYS:1-RECERT D — option comparison is Options, not Problems", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  npsZeroWrite(options);
  assert.equal(options.npsUnderstanding?.problemId, CAPACITY);
  assert.equal(options.npsOptionGeneration?.problemId, CAPACITY);
  assert.equal(options.npsOptionGeneration?.writesScenario, false);
  const compare = run("Compare the options.", workspaceId, options);
  npsZeroWrite(compare);
  assert.equal(compare.npsUnderstanding?.problemId, CAPACITY);
  assertOptionDomain(compare);
  assert.match(compare.ncaConversationState?.lastCollection?.kind ?? "", /problem/i);
});

test("SYS:1-RECERT E — deictic compare them keeps the Option set", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare them.", workspaceId, options);
  npsZeroWrite(compare);
  assert.equal(compare.npsUnderstanding?.problemId, CAPACITY);
  assertOptionDomain(compare);
});

test("SYS:1-RECERT F — recommendation is over Options", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare the options.", workspaceId, options);
  const recommend = run("Which one do you recommend, and why?", workspaceId, compare);
  npsZeroWrite(recommend);
  assert.doesNotMatch(recommend.response, /Neither clearly dominates\. Capacity Gap and Margin Pressure/i);
  const external = namedOption(recommend, "external");
  assert.ok(external);
  assert.equal(recommend.npsComparisonRecommendation?.recommendedOptionId, external.optionId);
  assert.equal(recommend.npsDecisionCommitment?.approvedDecisionId, null);
  assert.doesNotMatch(recommend.response, ARCH);
});

test("SYS:1-RECERT G — preference fidelity is External Capacity", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const prefer = run("I prefer External Capacity.", workspaceId, run("Compare the options.", workspaceId, options));
  npsZeroWrite(prefer);
  const external = namedOption(prefer, "external");
  assert.ok(external);
  assert.equal(prefer.ecaCommitmentJudgment?.commitmentState, "PREFERENCE");
  assert.equal(prefer.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.match(prefer.npsDecisionCommitment?.managerPreference ?? "", /external/i);
  assert.equal(prefer.npsDecisionCommitment?.approvedDecisionId, null);
});

test("SYS:1-RECERT H — proceed-with-it keeps External as commitment and confirmation candidate", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const prefer = run("I prefer External Capacity.", workspaceId, run("Compare the options.", workspaceId, options));
  const review = run("What would we be committing to?", workspaceId, prefer);
  npsZeroWrite(review);
  const external = namedOption(review, "external");
  assert.ok(external);
  assert.equal(review.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.match(review.response, /external capacity|overflow/i);
  const proceed = run("Let's proceed with it.", workspaceId, review);
  npsZeroWrite(proceed);
  assert.equal(proceed.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.equal(proceed.npsDecisionCommitment?.candidateOptionId, external.optionId);
  assert.match(proceed.response, /external capacity|overflow/i);
  assert.doesNotMatch(proceed.response, /You’re choosing temporary capacity|Approve Temporarily increase internal capacity/i);
  const conditions = proceed.npsDecisionCommitment?.unresolvedConditions ?? [];
  if (conditions.length > 0) {
    assert.ok(conditions.some((item) => /external|supplier/i.test(item)));
  }
});

test("SYS:1-RECERT I — stale Yes after topic change writes 0 Decisions", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const prefer = run("I prefer External Capacity.", workspaceId, options);
  const proceed = run("Let's proceed with it.", workspaceId, prefer);
  const topic = run("Tell me about Margin Pressure.", workspaceId, proceed);
  const yes = run("Yes.", workspaceId, topic);
  npsZeroWrite(yes);
  assert.equal(yes.npsDecisionCommitment?.approvedDecisionId ?? null, null);
  assert.equal(yes.npsDecisionCommitment?.npsWritesDecision, false);
  assert.notEqual(yes.decisionCommitmentResult?.status, "applied");
});

test("SYS:1-RECERT J — recommendation and preference alone write 0 Decisions", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const recommend = run("Which one do you recommend?", workspaceId, options);
  const prefer = run("I prefer External Capacity.", workspaceId, recommend);
  npsZeroWrite(recommend);
  npsZeroWrite(prefer);
  assert.equal(recommend.npsDecisionCommitment?.approvedDecisionId, null);
  assert.equal(prefer.npsDecisionCommitment?.approvedDecisionId, null);
});

test("SYS:1-RECERT K — no Approved Decision means 0 Execution writes", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const start = run("Start it.", workspaceId, options);
  npsZeroWrite(start);
  assert.equal(start.npsExecutionMonitoring?.npsWritesExecution, false);
  if (!start.npsDecisionCommitment?.approvedDecisionId) {
    assert.equal(start.npsExecutionMonitoring?.executionId, null);
    assert.notEqual(start.npsPath?.currentState, "EXECUTING");
  }
});

test("SYS:1-RECERT L — monitoring identity agrees across surfaces when present", () => {
  const workspaceId = setup();
  const going = run("How is it going?", workspaceId, run("Let's work on Capacity Gap.", workspaceId));
  npsZeroWrite(going);
  const npsId = going.npsExecutionMonitoring?.executionId ?? null;
  const ecaId = going.ecaLiveExecutionJudgment?.executionId ?? null;
  if (npsId || ecaId) {
    assert.equal(npsId, ecaId);
    const npsStatus = going.npsExecutionMonitoring?.executionStatus ?? null;
    const ecaStatus = going.ecaLiveExecutionJudgment?.executionStatus ?? going.ecaLiveExecutionJudgment?.liveState ?? null;
    if (npsStatus && ecaStatus) {
      assert.equal(String(npsStatus).toLowerCase(), String(ecaStatus).toLowerCase());
    }
  } else {
    assert.notEqual(going.npsPath?.currentState, "EXECUTING");
  }
});

test("SYS:1-RECERT M — execution completion alone is not success", () => {
  const workspaceId = setup();
  const worked = run("Did it work?", workspaceId, run("Let's work on Capacity Gap.", workspaceId));
  npsZeroWrite(worked);
  assert.notEqual(worked.npsOutcomeLearning?.resolutionStatus, "RESOLVED");
  const completeWithoutOutcome = composeNpsOutcomeLearning({
    pathFacts: outcomeFacts,
    observation: {
      decisionId: "dec-capacity-1",
      decisionTitle: "External Capacity",
      executionId: "exec-capacity-1",
      executionStatus: "completed",
      executionTitle: "External Capacity rollout",
      measure: "OTD",
      evidencePresent: false,
    },
  });
  assert.notEqual(completeWithoutOutcome.resolutionStatus, "RESOLVED");
  assert.equal(completeWithoutOutcome.writesOutcome, false);
});

test("SYS:1-RECERT N — 91 → 94 with Goal 96 is REASSESSMENT", () => {
  const partial = composeNpsOutcomeLearning({
    pathFacts: outcomeFacts,
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
  assert.equal(partial.attribution, "NOT_ESTABLISHED");
  assert.equal(partial.writesOutcome, false);
  assert.doesNotMatch(partial.managerProjection.text, ARCH);
});

test("SYS:1-RECERT O — observed >= Goal is RESOLVED without Problem mutation", () => {
  const resolved = composeNpsOutcomeLearning({
    pathFacts: outcomeFacts,
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
  assert.equal(resolved.writesGoal, false);
  assert.equal(resolved.npsWritesDecision, false);
});

test("SYS:1-RECERT topic switch is not a sticky Stage lock", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const explain = afterClick(listed, CAPACITY, "Explain it.", workspaceId);
  assert.equal(explain.npsUnderstanding?.problemId, CAPACITY);
  const named = run("Tell me about Margin Pressure.", workspaceId, explain);
  const again = run("Explain it.", workspaceId, named);
  npsZeroWrite(again);
  assert.equal(again.npsUnderstanding?.problemId, MARGIN);
  assert.match(again.response, /Margin Pressure/i);
  const back = run("Let's work on Capacity Gap.", workspaceId, again);
  npsZeroWrite(back);
  assert.equal(back.npsUnderstanding?.problemId, CAPACITY);
});

test("SYS:1-RECERT data/evidence: BKL stays unconfirmed", () => {
  const workspaceId = setup();
  seedCsv();
  const listed = run("Explain this CSV.", workspaceId);
  const bkl = run("What does BKL mean?", workspaceId, listed);
  npsZeroWrite(bkl);
  assert.doesNotMatch(bkl.response, /BKL means backlog/i);
  const evidence = run("What evidence do we have for Capacity Gap?", workspaceId, bkl);
  npsZeroWrite(evidence);
  assert.notEqual(evidence.npsEvidenceCause?.causalStatus, "CONFIRMED_CAUSE");
  assert.equal(evidence.npsEvidenceCause?.confirmedCause, null);
});

test("SYS:1-RECERT evidence/cause: contributor is not confirmed cause", () => {
  const workspaceId = setup();
  const work = run("Let's work on Capacity Gap.", workspaceId);
  const contributing = run("What seems to be contributing to Capacity Gap?", workspaceId, work);
  npsZeroWrite(contributing);
  assert.equal(contributing.npsEvidenceCause?.problemId, CAPACITY);
  assert.equal(contributing.npsEvidenceCause?.confirmedCause, null);
  const support = run("What evidence supports that?", workspaceId, contributing);
  npsZeroWrite(support);
  assert.notEqual(support.npsEvidenceCause?.causalStatus, "CONFIRMED_CAUSE");
});

test("SYS:1-RECERT live — bounded /executive journey after FIX1 and FIX2", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  npsZeroWrite(listed);
  assert.doesNotMatch(listed.response, ARCH);

  const explain = afterClick(listed, CAPACITY, "Explain it.", workspaceId);
  assertCapacityEverywhere(explain);

  const related = run("What is related to it?", workspaceId, explain);
  npsZeroWrite(related);
  assert.doesNotMatch(related.response, /Related To It/i);

  const nextInvestigate = run("What should I investigate next?", workspaceId, related);
  npsZeroWrite(nextInvestigate);
  assert.equal(nextInvestigate.npsUnderstanding?.problemId, CAPACITY);

  const support = run("What evidence supports that?", workspaceId, nextInvestigate);
  assert.equal(support.npsEvidenceCause?.problemId, CAPACITY);
  assert.equal(support.npsEvidenceCause?.confirmedCause, null);

  const options = run("What options do we have?", workspaceId, support);
  assert.equal(options.npsUnderstanding?.problemId, CAPACITY);
  assert.ok((options.npsOptionGeneration?.optionCandidates?.length ?? 0) >= 2);

  const compare = run("Compare the options.", workspaceId, options);
  assertOptionDomain(compare);
  assert.equal(compare.npsUnderstanding?.problemId, CAPACITY);

  const deictic = run("Compare them.", workspaceId, compare);
  assertOptionDomain(deictic);

  const recommend = run("Which one do you recommend, and why?", workspaceId, deictic);
  const external = namedOption(recommend, "external");
  assert.ok(external);
  assert.equal(recommend.npsComparisonRecommendation?.recommendedOptionId, external.optionId);
  assert.equal(recommend.npsDecisionCommitment?.approvedDecisionId, null);

  const prefer = run("I prefer External Capacity.", workspaceId, recommend);
  assert.equal(prefer.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.equal(prefer.npsDecisionCommitment?.approvedDecisionId, null);

  const review = run("What would we be committing to?", workspaceId, prefer);
  assert.equal(review.ecaCommitmentJudgment?.target?.id, external.optionId);

  const proceed = run("Let's proceed with it.", workspaceId, review);
  npsZeroWrite(proceed);
  assert.equal(proceed.npsUnderstanding?.problemId, CAPACITY);
  assert.equal(proceed.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.equal(proceed.npsDecisionCommitment?.candidateOptionId, external.optionId);
  assert.doesNotMatch(proceed.response, ARCH);

  const confirm = run("Yes.", workspaceId, proceed);
  npsZeroWrite(confirm);
  assert.equal(confirm.npsDecisionCommitment?.npsWritesDecision, false);

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
  const fix = run("Fix it.", workspaceId, going);
  npsZeroWrite(fix);
  assert.equal(fix.npsExecutionMonitoring?.npsWritesExecution, false);

  const worked = run("Did it work?", workspaceId, fix);
  assert.notEqual(worked.npsOutcomeLearning?.resolutionStatus, "RESOLVED");
  const caused = run("Did External Capacity cause the improvement?", workspaceId, worked);
  assert.equal(caused.npsOutcomeLearning?.attribution, "NOT_ESTABLISHED");
  assert.doesNotMatch(caused.response, ARCH);
  const solved = run("Is Capacity Gap solved?", workspaceId, caused);
  assert.notEqual(solved.npsOutcomeLearning?.resolutionStatus, "RESOLVED");
  const next = run("What should we do next?", workspaceId, solved);
  npsZeroWrite(next);
  assert.equal(next.npsUnderstanding?.problemId, CAPACITY);
  assert.doesNotMatch(next.response, ARCH);
});
