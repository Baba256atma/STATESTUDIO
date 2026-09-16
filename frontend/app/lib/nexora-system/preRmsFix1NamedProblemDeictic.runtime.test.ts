/**
 * NPA-T PRE-RMS:FIX1 — Named Problem → deictic investigation fidelity.
 * Reuses SYS:1-FIX1 precedence. No new referent authority. No RMS.
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
import { resetCsvRealDataImportStoreForTests } from "@/app/lib/data-reality/csvRealDataImportStore.ts";

const ARCH = /\b(?:NPS:\d|ECA:\d|CC:\d{1,2}|CORE-OUT|CORE-INT|NCA-POST|DTH:\d|presentedSetKind|referent resolver)\b/i;
const CAPACITY = "ctx-problem-capacity";
const MARGIN = "ctx-problem-margin";
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  resetOutcomeObservationCaptureForTests();
  resetCsvRealDataImportStoreForTests();
  return createWorkspace("PRE-RMS:FIX1 Runtime Proofs").workspaceId;
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
    messageIdSeed: `pre-rms-fix1-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    previousUtterance: previous?.managerMessage.text ?? null,
    lastAppliedCommandId: previous?.commandResult?.command?.commandId ?? null,
  });
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

function assertZeroWrites(result: Turn) {
  assert.equal(result.npsUnderstanding?.commitsDecision, false);
  assert.equal(result.npsEvidenceCause?.writesScenario, false);
  assert.equal(result.npsOptionGeneration?.writesScenario, false);
  assert.equal(result.npsComparisonRecommendation?.commitsDecision, false);
  assert.equal(result.npsDecisionCommitment?.npsWritesDecision, false);
  assert.equal(result.npsDecisionCommitment?.startsExecution, false);
  assert.equal(result.npsExecutionMonitoring?.npsWritesExecution, false);
  assert.equal(result.npsOutcomeLearning?.writesOutcome, false);
  assert.equal(result.npsOutcomeLearning?.writesLearning, false);
}

function assertProblem(result: Turn, id: string, label: RegExp) {
  assert.equal(result.ecaWorkingContext?.activeSubject?.id, id);
  assert.equal(result.managerObjectTurn.activeObjectId, id);
  assert.equal(result.npsUnderstanding?.problemId, id);
  assert.match(result.response, label);
  assert.doesNotMatch(result.response, ARCH);
}

test("PRE-RMS:FIX1 intent — Let's work on Capacity Gap is named focus", () => {
  const intent = resolveNexoraConversationalIntent({ utterance: "Let's work on Capacity Gap." });
  assert.equal(intent.intent.kind, "focus");
  assert.match(intent.intent.targetHints[0]?.raw ?? "", /capacity gap/i);
});

test("PRE-RMS:FIX1 A — Show problems, name Capacity Gap, Investigate it", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  assertZeroWrites(work);
  assert.equal(work.npsUnderstanding?.problemId, CAPACITY);
  const investigate = run("Investigate it.", workspaceId, work);
  assertZeroWrites(investigate);
  assertProblem(investigate, CAPACITY, /Capacity Gap/i);
  assert.notEqual(investigate.npsUnderstanding?.problemId, MARGIN);
});

test("PRE-RMS:FIX1 B — Explain it after named Capacity Gap", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  const explain = run("Explain it.", workspaceId, work);
  assertZeroWrites(explain);
  assertProblem(explain, CAPACITY, /Capacity Gap/i);
});

test("PRE-RMS:FIX1 C — Tell me more about it after named Capacity Gap", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  const more = run("Tell me more about it.", workspaceId, work);
  assertZeroWrites(more);
  assertProblem(more, CAPACITY, /Capacity Gap/i);
});

test("PRE-RMS:FIX1 D — What is related to it after named Capacity Gap", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  const related = run("What is related to it?", workspaceId, work);
  assertZeroWrites(related);
  assert.equal(related.intentResult.intent.kind, "show-related");
  assert.doesNotMatch(related.response, /couldn't find a clear match for “Related To It”/i);
  assert.ok(
    related.ecaWorkingContext?.activeSubject?.id === CAPACITY ||
      related.managerObjectTurn.activeObjectId === CAPACITY ||
      related.npsUnderstanding?.problemId === CAPACITY,
  );
});

test("PRE-RMS:FIX1 E — Why is it important after named Capacity Gap", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  const why = run("Why is it important?", workspaceId, work);
  assertZeroWrites(why);
  assert.equal(why.ecaWorkingContext?.activeSubject?.id, CAPACITY, why.response);
  assert.equal(why.managerObjectTurn.activeObjectId, CAPACITY, why.response);
  assert.equal(why.npsUnderstanding?.problemId, CAPACITY, why.response);
  assert.notEqual(why.npsUnderstanding?.problemId, MARGIN);
  assert.doesNotMatch(why.response, ARCH);
});

test("PRE-RMS:FIX1 F — named override to Margin Pressure", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  const named = run("Tell me about Margin Pressure.", workspaceId, work);
  const investigate = run("Investigate it.", workspaceId, named);
  assertZeroWrites(investigate);
  assertProblem(investigate, MARGIN, /Margin Pressure/i);
});

test("PRE-RMS:FIX1 G — return to Capacity Gap", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const margin = run("Tell me about Margin Pressure.", workspaceId, listed);
  const work = run("Let's work on Capacity Gap.", workspaceId, margin);
  const investigate = run("Investigate it.", workspaceId, work);
  assertZeroWrites(investigate);
  assertProblem(investigate, CAPACITY, /Capacity Gap/i);
});

test("PRE-RMS:FIX1 H — Stage click regression", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const explain = afterClick(listed, CAPACITY, "Explain it.", workspaceId);
  assertProblem(explain, CAPACITY, /Capacity Gap/i);
  const investigate = run("Investigate it.", workspaceId, explain);
  assertZeroWrites(investigate);
  assertProblem(investigate, CAPACITY, /Capacity Gap/i);
});

test("PRE-RMS:FIX1 I — Problems collection remains usable", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  const compare = run("Compare the problems.", workspaceId, work);
  assertZeroWrites(compare);
  assert.equal(compare.ncaPost4Comparison?.candidateSet.collectionKind?.toLowerCase().replace(/s$/, ""), "problem");
  assert.ok(
    compare.ncaPost4Comparison?.candidateSet.candidateIds.includes(CAPACITY) &&
      compare.ncaPost4Comparison?.candidateSet.candidateIds.includes(MARGIN),
  );
});

test("PRE-RMS:FIX1 J — option comparison stays Options", () => {
  const workspaceId = setup();
  const work = run("Let's work on Capacity Gap.", workspaceId);
  const options = run("What options do we have?", workspaceId, work);
  const compare = run("Compare the options.", workspaceId, options);
  assertZeroWrites(compare);
  assert.equal(compare.npsUnderstanding?.problemId, CAPACITY);
  assert.doesNotMatch(
    compare.response,
    /Both Capacity Gap and Margin Pressure|Capacity Gap and Margin Pressure are the current comparison/i,
  );
  assert.match(compare.response, /external capacity|internal capacity|Capacity Expansion Plan/i);
});

test("PRE-RMS:FIX1 K — External preference still binds proceed-with-it", () => {
  const workspaceId = setup();
  const work = run("Let's work on Capacity Gap.", workspaceId);
  const options = run("What options do we have?", workspaceId, work);
  const prefer = run("I prefer External Capacity.", workspaceId, options);
  const proceed = run("Let's proceed with it.", workspaceId, prefer);
  assertZeroWrites(proceed);
  const external = proceed.npsComparisonRecommendation?.comparedOptions.find((item) =>
    /external/i.test(item.title),
  );
  assert.ok(external);
  assert.equal(proceed.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.equal(proceed.npsDecisionCommitment?.candidateOptionId, external.optionId);
});

test("PRE-RMS:FIX1 L — Investigate it without a singular referent does not invent Capacity Gap", () => {
  const workspaceId = setup();
  const investigate = run("Investigate it.", workspaceId);
  assertZeroWrites(investigate);
  assert.ok(
    investigate.npsUnderstanding?.problemOwnership !== "DETERMINED" ||
      investigate.npsUnderstanding?.action === "CLARIFY_PROBLEM" ||
      investigate.clarificationTurn?.action === "clarify" ||
      /which|clarify|which problem/i.test(investigate.response),
  );
});

test("PRE-RMS:FIX1 M — invalid named Problem is not established", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const unknown = run("Let's work on Capacity Problem X.", workspaceId, listed);
  assertZeroWrites(unknown);
  assert.notEqual(unknown.npsUnderstanding?.problemId, "capacity-problem-x");
  assert.ok(
    unknown.contextResult.context.resolutionStatus === "not-found" ||
      unknown.npsUnderstanding?.problemId == null ||
      unknown.npsUnderstanding?.problemId === MARGIN ||
      /couldn't find|not sure|which|clarify/i.test(unknown.response),
  );
});

test("PRE-RMS:FIX1 N — failed named lookup does not resurrect Margin Pressure on Investigate it", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const unknown = run("Let's work on Unknown Problem.", workspaceId, listed);
  const investigate = run("Investigate it.", workspaceId, unknown);
  assertZeroWrites(investigate);
  assert.ok(
    investigate.npsUnderstanding?.problemId !== MARGIN ||
      investigate.clarificationTurn?.action === "clarify" ||
      /which|clarify|couldn't find|not sure|clear match/i.test(investigate.response),
  );
});

test("PRE-RMS:FIX1 O + identity + live — named Capacity Gap without a click", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  assert.equal(work.npsUnderstanding?.problemId, CAPACITY);
  const explain = run("Explain it.", workspaceId, work);
  const investigate = run("Investigate it.", workspaceId, explain);
  const related = run("What is related to it?", workspaceId, investigate);
  const why = run("Why is it important?", workspaceId, related);
  assertZeroWrites(why);
  assert.equal(why.ecaWorkingContext?.activeSubject?.id, CAPACITY, why.response);
  assert.equal(why.managerObjectTurn.activeObjectId, CAPACITY, why.response);
  assert.equal(why.npsUnderstanding?.problemId, CAPACITY, why.response);
  assert.notEqual(why.npsUnderstanding?.problemId, MARGIN);
  assert.equal(investigate.ncaConversationState?.activeSubject?.id ?? CAPACITY, CAPACITY);
  const margin = run("Tell me about Margin Pressure.", workspaceId, why);
  const marginInvestigate = run("Investigate it.", workspaceId, margin);
  assertProblem(marginInvestigate, MARGIN, /Margin Pressure/i);
  const back = run("Let's work on Capacity Gap.", workspaceId, marginInvestigate);
  const backInvestigate = run("Investigate it.", workspaceId, back);
  assertZeroWrites(backInvestigate);
  assertProblem(backInvestigate, CAPACITY, /Capacity Gap/i);
});
