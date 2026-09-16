/**
 * NPA-T SYS:1-FIX1 — Stage click → deictic referent ownership.
 * Repairs existing ECA/CC/MO precedence. Does not add a referent authority.
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

const ARCH = /\b(?:NPS:\d|ECA:\d|CC:\d{1,2}|CORE-OUT|CORE-INT|NCA-POST|DTH:\d)\b/i;
const CAPACITY = "ctx-problem-capacity";
const MARGIN = "ctx-problem-margin";
const OBJECT_CAPACITY = "obj-capacity";
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
  return createWorkspace("SYS:1-FIX1 Runtime Proofs").workspaceId;
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
    messageIdSeed: `sys-1-fix1-${utterance}`,
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

function assertSubject(result: Turn, id: string, label: RegExp) {
  assert.equal(result.nextRuntimeState.focusedSubject?.id, id);
  assert.equal(result.ecaWorkingContext?.activeSubject?.id, id);
  assert.equal(result.managerObjectTurn.activeObjectId, id);
  if (id === CAPACITY || id === MARGIN) {
    assert.equal(result.npsUnderstanding?.problemId, id);
  }
  assert.match(result.response, label);
  assert.doesNotMatch(result.response, ARCH);
}

test("SYS:1-FIX1 intent — What is related to it is show-related, not an Object name", () => {
  const intent = resolveNexoraConversationalIntent({ utterance: "What is related to it?" });
  assert.equal(intent.intent.kind, "show-related");
  assert.equal(intent.intent.targetHints.length, 0);
  assert.doesNotMatch(JSON.stringify(intent.intent.targetHints), /related to it/i);
});

test("SYS:1-FIX1 A — Show problems → click Capacity Gap → Explain it", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const explain = afterClick(listed, CAPACITY, "Explain it.", workspaceId);
  assertZeroWrites(explain);
  assertSubject(explain, CAPACITY, /Capacity Gap/i);
  assert.doesNotMatch(explain.response, /^Margin Pressure/i);
});

test("SYS:1-FIX1 B — click Margin Pressure → Explain it", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const explain = afterClick(listed, MARGIN, "Explain it.", workspaceId);
  assertZeroWrites(explain);
  assertSubject(explain, MARGIN, /Margin Pressure/i);
});

test("SYS:1-FIX1 C/D — Investigate it then Why stays on Capacity Gap", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const investigate = afterClick(listed, CAPACITY, "Investigate it.", workspaceId);
  assertZeroWrites(investigate);
  assert.equal(investigate.npsUnderstanding?.problemId, CAPACITY);
  assert.match(investigate.response, /Capacity Gap/i);
  const why = run("Why?", workspaceId, investigate);
  assertZeroWrites(why);
  assert.equal(why.npsUnderstanding?.problemId, CAPACITY);
  assert.match(why.response, /Capacity Gap/i);
});

test("SYS:1-FIX1 E — related to it uses Capacity, not Object Related To It", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const capacity = afterClick(listed, OBJECT_CAPACITY, "Explain it.", workspaceId);
  assert.equal(capacity.managerObjectTurn.activeObjectId, OBJECT_CAPACITY);
  const related = run("What is related to it?", workspaceId, capacity);
  assertZeroWrites(related);
  assert.doesNotMatch(related.response, /couldn't find a clear match for “Related To It”/i);
  assert.notEqual(related.intentResult.intent.kind, "explain");
  assert.ok(
    related.ecaWorkingContext?.activeSubject?.id === OBJECT_CAPACITY ||
      related.managerObjectTurn.activeObjectId === OBJECT_CAPACITY,
  );
  if (/Budget/i.test(related.response)) {
    assert.match(related.response, /Budget/i);
  }
});

test("SYS:1-FIX1 F — named override beats click", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const named = afterClick(listed, CAPACITY, "Explain Margin Pressure.", workspaceId);
  assertZeroWrites(named);
  assert.match(named.response, /Margin Pressure/i);
  assert.equal(named.npsUnderstanding?.problemId, MARGIN);
});

test("SYS:1-FIX1 G — topic switch releases click ownership", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const explain = afterClick(listed, CAPACITY, "Explain it.", workspaceId);
  assert.equal(explain.npsUnderstanding?.problemId, CAPACITY);
  const named = run("Tell me about Margin Pressure.", workspaceId, explain);
  const again = run("Explain it.", workspaceId, named);
  assertZeroWrites(again);
  assert.equal(again.npsUnderstanding?.problemId, MARGIN);
  assert.match(again.response, /Margin Pressure/i);
});

test("SYS:1-FIX1 H — Compare them still uses the Problems collection", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const compare = run("Compare them.", workspaceId, listed);
  assertZeroWrites(compare);
  assert.match(compare.response, /Capacity Gap|Margin Pressure|compar/i);
});

test("SYS:1-FIX1 I — collection knowledge remains after click", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const others = afterClick(listed, CAPACITY, "What are the other problems?", workspaceId);
  assertZeroWrites(others);
  const presented = others.nextExecutiveContext.presentedSet;
  assert.ok(
    presented?.kind === "problems" &&
      presented.subjectIds.includes(MARGIN) &&
      presented.subjectIds.includes(CAPACITY),
    "click must not erase the presented Problems collection",
  );
});

test("SYS:1-FIX1 J — Decision needed does not manufacture a candidate", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const capacity = afterClick(listed, OBJECT_CAPACITY, "What would we be committing to?", workspaceId);
  assertZeroWrites(capacity);
  assert.match(
    capacity.response,
    /no specific option|not currently under review|Decision is needed|no candidate|more than one option|which one would you be committing/i,
  );
  assert.equal(capacity.npsDecisionCommitment?.approvedDecisionId, null);
  assert.equal(capacity.npsDecisionCommitment?.startsExecution, false);
});

test("SYS:1-FIX1 K — ambiguous Investigate it without a strong singular referent clarifies", () => {
  const workspaceId = setup();
  const ambiguous = run("Investigate it.", workspaceId);
  assertZeroWrites(ambiguous);
  assert.ok(
    ambiguous.npsUnderstanding?.problemOwnership !== "DETERMINED" ||
      ambiguous.npsUnderstanding?.action === "CLARIFY_PROBLEM" ||
      Boolean(ambiguous.clarificationTurn?.action === "clarify") ||
      /which|which one|clarify|which problem/i.test(ambiguous.response),
  );
});

test("SYS:1-FIX1 L + live proof — click ownership, related, investigate, then named release", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const explain = afterClick(listed, CAPACITY, "Explain it.", workspaceId);
  assertZeroWrites(explain);
  assertSubject(explain, CAPACITY, /Capacity Gap/i);
  const related = run("What is related to it?", workspaceId, explain);
  assertZeroWrites(related);
  assert.doesNotMatch(related.response, /Related To It/i);
  assert.equal(related.npsUnderstanding?.problemId, CAPACITY);
  const investigate = run("Investigate it.", workspaceId, related);
  assertZeroWrites(investigate);
  assert.equal(investigate.npsUnderstanding?.problemId, CAPACITY);
  const named = run("Tell me about Margin Pressure.", workspaceId, investigate);
  const again = run("Explain it.", workspaceId, named);
  assertZeroWrites(again);
  assert.equal(again.npsUnderstanding?.problemId, MARGIN);
  assert.match(again.response, /Margin Pressure/i);
});
