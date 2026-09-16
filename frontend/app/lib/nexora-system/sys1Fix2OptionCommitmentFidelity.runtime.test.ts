/**
 * NPA-T SYS:1-FIX2 — Option comparison → preference → commitment candidate fidelity.
 * Repairs existing NCA-POST:4 / ECA:8 / NPS:5–6 handoff. No new authority.
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
import { resetCsvRealDataImportStoreForTests } from "@/app/lib/data-reality/csvRealDataImportStore.ts";

const ARCH = /\b(?:NPS:\d|ECA:\d|CC:\d{1,2}|CORE-OUT|CORE-INT|NCA-POST|DTH:\d|presentedSetKind|candidateId|referent resolver)\b/i;
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
  return createWorkspace("SYS:1-FIX2 Runtime Proofs").workspaceId;
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
    messageIdSeed: `sys-1-fix2-${utterance}`,
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

function assertZeroCanonicalWrites(result: Turn) {
  assert.equal(result.npsUnderstanding?.commitsDecision, false);
  assert.equal(result.npsComparisonRecommendation?.commitsDecision, false);
  assert.equal(result.npsDecisionCommitment?.npsWritesDecision, false);
  assert.equal(result.npsDecisionCommitment?.startsExecution, false);
  assert.equal(result.npsExecutionMonitoring?.npsWritesExecution, false);
  assert.equal(result.npsOutcomeLearning?.writesOutcome, false);
  assert.equal(result.npsOutcomeLearning?.writesLearning, false);
  assert.equal(result.npsDecisionCommitment?.approvedDecisionId ?? null, null);
  assert.notEqual(result.decisionCommitmentResult?.status, "applied");
}

function namedOption(
  turn: Turn,
  which: "external" | "internal",
) {
  const options = turn.npsComparisonRecommendation?.comparedOptions ?? [];
  return which === "external"
    ? options.find((item) => /external/i.test(item.title)) ?? null
    : options.find((item) => /internal/i.test(item.title) || /expansion/i.test(item.title)) ?? null;
}

function assertOptionNotProblemComparison(result: Turn) {
  assert.doesNotMatch(
    result.response,
    /Both Capacity Gap and Margin Pressure|Capacity Gap and Margin Pressure are the current comparison/i,
  );
  const kind = result.ncaPost4Comparison?.candidateSet.collectionKind ?? "";
  if (result.ncaPost4Comparison) {
    assert.match(kind, /option|scenario/i);
  }
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

test("SYS:1-FIX2 A — explicit option comparison is the Option domain", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare the options.", workspaceId, options);
  assertZeroCanonicalWrites(compare);
  assert.equal(compare.npsUnderstanding?.problemId, CAPACITY);
  assertOptionNotProblemComparison(compare);
  assert.match(compare.ncaConversationState?.lastCollection?.kind ?? "", /problem/i);
  assert.doesNotMatch(compare.response, ARCH);
});

test("SYS:1-FIX2 B — explicit problem comparison stays Problems", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare the problems.", workspaceId, options);
  assertZeroCanonicalWrites(compare);
  assert.equal(compare.ncaPost4Comparison?.candidateSet.collectionKind?.toLowerCase().replace(/s$/, ""), "problem");
  assert.ok(
    compare.ncaPost4Comparison?.candidateSet.candidateIds.includes(CAPACITY) &&
      compare.ncaPost4Comparison?.candidateSet.candidateIds.includes(MARGIN),
  );
});

test("SYS:1-FIX2 C — deictic compare them keeps the Option pair", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare them.", workspaceId, options);
  assertZeroCanonicalWrites(compare);
  assertOptionNotProblemComparison(compare);
});

test("SYS:1-FIX2 D — recommendation is over Options, not Problem ranking", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare the options.", workspaceId, options);
  const recommend = run("Which one do you recommend, and why?", workspaceId, compare);
  assertZeroCanonicalWrites(recommend);
  assert.doesNotMatch(recommend.response, /Neither clearly dominates\. Capacity Gap and Margin Pressure/i);
  const external = namedOption(recommend, "external");
  assert.ok(external);
  assert.equal(recommend.npsComparisonRecommendation?.recommendedOptionId, external.optionId);
  assert.match(recommend.response, /external capacity|overflow/i);
});

test("SYS:1-FIX2 E — I prefer External Capacity", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare the options.", workspaceId, options);
  const prefer = run("I prefer External Capacity.", workspaceId, compare);
  assertZeroCanonicalWrites(prefer);
  const external = namedOption(prefer, "external");
  assert.ok(external);
  assert.equal(prefer.ecaCommitmentJudgment?.commitmentState, "PREFERENCE");
  assert.equal(prefer.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.match(prefer.npsDecisionCommitment?.managerPreference ?? "", /external/i);
  assert.match(prefer.response, /external capacity|overflow/i);
});

test("SYS:1-FIX2 F/G — preference then proceed keeps External as confirmation candidate", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare the options.", workspaceId, options);
  const prefer = run("I prefer External Capacity.", workspaceId, compare);
  const proceed = run("Let's proceed with it.", workspaceId, prefer);
  assertZeroCanonicalWrites(proceed);
  const external = namedOption(proceed, "external");
  const internal = namedOption(proceed, "internal");
  assert.ok(external);
  assert.equal(proceed.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.equal(proceed.npsDecisionCommitment?.candidateOptionId, external.optionId);
  assert.notEqual(proceed.npsDecisionCommitment?.candidateOptionId, internal?.optionId);
  assert.match(proceed.response, /external capacity|overflow/i);
  assert.doesNotMatch(proceed.response, /You’re choosing temporary capacity|Approve Temporarily increase internal capacity/i);
  assert.equal(
    proceed.managerObjectTurn.session.ecaCommitmentSession?.pendingTargetId,
    external.optionId,
  );
});

test("SYS:1-FIX2 H — External availability condition stays with External", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare the options.", workspaceId, options);
  const prefer = run("I prefer External Capacity.", workspaceId, compare);
  const proceed = run("Let's proceed with it.", workspaceId, prefer);
  const external = namedOption(proceed, "external");
  assert.equal(proceed.npsDecisionCommitment?.candidateOptionId, external?.optionId);
  assert.ok(
    (proceed.npsDecisionCommitment?.unresolvedConditions ?? []).some((item) =>
      /external|supplier/i.test(item),
    ) ||
      /external|supplier/i.test(proceed.response),
  );
});

test("SYS:1-FIX2 I — opposite preference does not overwrite recommendation", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const compare = run("Compare the options.", workspaceId, options);
  const recommend = run("Which one do you recommend, and why?", workspaceId, compare);
  const external = namedOption(recommend, "external");
  const internal = namedOption(recommend, "internal");
  assert.ok(external && internal);
  assert.equal(recommend.npsComparisonRecommendation?.recommendedOptionId, external.optionId);
  const prefer = run("I prefer Internal Capacity.", workspaceId, recommend);
  assertZeroCanonicalWrites(prefer);
  assert.equal(prefer.npsComparisonRecommendation?.recommendedOptionId, external.optionId);
  assert.equal(prefer.ecaCommitmentJudgment?.target?.id, internal.optionId);
  const proceed = run("Let's proceed with my preference.", workspaceId, prefer);
  assert.equal(proceed.ecaCommitmentJudgment?.target?.id, internal.optionId);
  assert.doesNotMatch(
    (proceed.npsDecisionCommitment?.unresolvedConditions ?? []).join(" "),
    /Qualified external capacity must be available/i,
  );
});

test("SYS:1-FIX2 J — explicit candidate override", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const prefer = run("I prefer External Capacity.", workspaceId, options);
  const override = run("Actually, let’s proceed with Internal Capacity.", workspaceId, prefer);
  const internal = namedOption(override, "internal");
  assert.ok(internal);
  assert.equal(override.ecaCommitmentJudgment?.target?.id, internal.optionId);
});

test("SYS:1-FIX2 K — topic change does not resurrect External commitment", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const prefer = run("I prefer External Capacity.", workspaceId, options);
  const topic = run("Tell me about Margin Pressure.", workspaceId, prefer);
  const proceed = run("Let's proceed with it.", workspaceId, topic);
  assertZeroCanonicalWrites(proceed);
  assert.notEqual(proceed.npsUnderstanding?.problemId, CAPACITY);
  const note = `${proceed.response} ${proceed.ecaCommitmentJudgment?.managerFacingNote ?? ""}`;
  assert.ok(
    proceed.ecaCommitmentJudgment?.target == null ||
      proceed.ecaCommitmentJudgment.targetResolution === "AMBIGUOUS" ||
      proceed.ecaCommitmentJudgment.targetResolution === "UNKNOWN" ||
      /which|clarify|under review|Margin Pressure/i.test(note),
  );
  assert.notEqual(proceed.npsDecisionCommitment?.candidateOptionId, namedOption(prefer, "external")?.optionId);
});

test("SYS:1-FIX2 L — stale Yes after topic change writes 0 Decisions", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const prefer = run("I prefer External Capacity.", workspaceId, options);
  const proceed = run("Let's proceed with it.", workspaceId, prefer);
  const topic = run("Tell me about Margin Pressure.", workspaceId, proceed);
  const yes = run("Yes.", workspaceId, topic);
  assertZeroCanonicalWrites(yes);
  assert.equal(yes.npsDecisionCommitment?.approvedDecisionId ?? null, null);
});

test("SYS:1-FIX2 M — Decision needed without a candidate is not invented", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const review = afterClick(listed, CAPACITY, "What would we be committing to?", workspaceId);
  assertZeroCanonicalWrites(review);
  assert.match(
    review.response,
    /no specific option|not currently under review|Decision is needed|no candidate|more than one option|which one would you be committing/i,
  );
});

test("SYS:1-FIX2 N — Start it without Approved Decision writes 0 Execution", () => {
  const workspaceId = setup();
  const { options } = toOptions(workspaceId);
  const start = run("Start it.", workspaceId, options);
  assertZeroCanonicalWrites(start);
  assert.equal(start.npsExecutionMonitoring?.npsWritesExecution, false);
});

test("SYS:1-FIX2 O + identity trace — External survives comparison → preference → confirmation", () => {
  const workspaceId = setup();
  const { listed, explained, options } = toOptions(workspaceId);
  assert.equal(explained.npsUnderstanding?.problemId, CAPACITY);
  const compare = run("Compare the options.", workspaceId, options);
  const recommend = run("Which one do you recommend, and why?", workspaceId, compare);
  const prefer = run("I prefer External Capacity.", workspaceId, recommend);
  const review = run("What would we be committing to?", workspaceId, prefer);
  const proceed = run("Let's proceed with it.", workspaceId, review);
  assertZeroCanonicalWrites(listed);
  assertZeroCanonicalWrites(proceed);
  const external = namedOption(proceed, "external");
  assert.ok(external);
  const comparisonIds = (compare.ncaPost4Comparison?.candidateSet.candidateIds ?? compare.npsComparisonRecommendation?.comparedOptions.map((item) => item.optionId) ?? []).join(" ");
  assert.match(comparisonIds, new RegExp(external.optionId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(recommend.npsComparisonRecommendation?.recommendedOptionId, external.optionId);
  assert.equal(prefer.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.equal(review.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.match(review.response, /external capacity|overflow/i);
  assert.equal(proceed.npsDecisionCommitment?.candidateOptionId, external.optionId);
  assert.equal(proceed.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.doesNotMatch(proceed.response, ARCH);
});

test("SYS:1-FIX2 live proof — problems, click, options, prefer External, no execution", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  const explained = afterClick(listed, CAPACITY, "Explain it.", workspaceId);
  const options = run("What options do we have?", workspaceId, explained);
  const compare = run("Compare the options.", workspaceId, options);
  const recommend = run("Which one do you recommend, and why?", workspaceId, compare);
  const prefer = run("I prefer External Capacity.", workspaceId, recommend);
  const review = run("What would we be committing to?", workspaceId, prefer);
  const proceed = run("Let's proceed with it.", workspaceId, review);
  const ready = run("Are we ready to execute?", workspaceId, proceed);
  const start = run("Start it.", workspaceId, ready);
  const external = namedOption(proceed, "external");
  assert.ok(external);
  assert.equal(compare.npsUnderstanding?.problemId, CAPACITY);
  assertOptionNotProblemComparison(compare);
  assert.equal(prefer.ecaCommitmentJudgment?.target?.id, external.optionId);
  assert.equal(proceed.npsDecisionCommitment?.candidateOptionId, external.optionId);
  assert.equal(start.npsDecisionCommitment?.approvedDecisionId ?? null, null);
  assert.equal(start.npsExecutionMonitoring?.npsWritesExecution, false);
  assert.doesNotMatch(start.response, ARCH);
});
