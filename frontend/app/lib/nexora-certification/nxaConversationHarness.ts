/**
 * NXA:6-PREP conversation harness.
 * Drives the existing CC:5 executor. Isolated catalog/state per run.
 */

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "../conversational-control/executiveContextSnapshot.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionState,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NxaConversationCase, NxaConversationTurnExpectation } from "./nxaConversationFixtureSchema.ts";
import {
  firstPathDivergence,
  projectConversationPathTrace,
  type NxaConversationPathTrace,
} from "./nxaConversationPathTrace.ts";

export type NxaHarnessTurnResult = Readonly<{
  turnIndex: number;
  utterance: string;
  passed: boolean;
  failureKind: "none" | "response" | "stage-effect" | "path";
  expected: unknown;
  actual: unknown;
  response: string;
  path: NxaConversationPathTrace;
  firstDivergence: ReturnType<typeof firstPathDivergence>;
}>;

export type NxaHarnessCaseResult = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  firstFailingTurn: number | null;
  turns: readonly NxaHarnessTurnResult[];
  reproduction: string;
  diagnostic: string;
}>;

export type NxaHarnessRunResult = Readonly<{
  identity: "NXA:6-PREP/ConversationHarness";
  passed: boolean;
  durationMs: number;
  totals: Readonly<{ cases: number; passed: number; failed: number; skipped: number }>;
  cases: readonly NxaHarnessCaseResult[];
}>;

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function restoredContext(subjectId: string, label: string) {
  return createEmptyNexoraExecutiveContextSnapshot({
    currentSubject: Object.freeze({
      subjectId,
      subjectKind: "problem",
      canonicalName: label,
      source: "runtime",
      turnIndex: 1,
    }),
    currentProblem: Object.freeze({
      subjectId,
      subjectKind: "problem",
      canonicalName: label,
      source: "runtime",
      turnIndex: 1,
    }),
    turnIndex: 1,
  });
}

function classifyStage(state: NexoraMVPObjectInteractionState): "none" | "focus" | "collection" {
  if (state.collectionContext) return "collection";
  if (state.focusedSubject) return "focus";
  return "none";
}

function sameIds(actual: readonly string[], expected: readonly string[]): boolean {
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

function evaluateTurn(
  expect: NxaConversationTurnExpectation | undefined,
  input: {
    readonly response: string;
    readonly path: NxaConversationPathTrace;
    readonly status: string;
    readonly executionState: string | null | undefined;
    readonly confirmationPending: boolean | undefined;
  },
): Pick<NxaHarnessTurnResult, "passed" | "failureKind" | "expected" | "actual" | "firstDivergence"> {
  if (!expect) {
    return { passed: true, failureKind: "none", expected: null, actual: null, firstDivergence: null };
  }
  const responseFail =
    (expect.responseIncludes ?? []).some((part) => !new RegExp(part, "i").test(input.response)) ||
    (expect.responseExcludes ?? []).some((part) => new RegExp(part, "i").test(input.response));
  if (responseFail) {
    return {
      passed: false,
      failureKind: "response",
      expected: { includes: expect.responseIncludes, excludes: expect.responseExcludes },
      actual: input.response,
      firstDivergence: { field: "response", expected: expect.responseIncludes ?? expect.responseExcludes, actual: input.response },
    };
  }
  if (expect.intentKind && expect.intentKind !== input.path.resolvedIntent) {
    return {
      passed: false,
      failureKind: "path",
      expected: expect.intentKind,
      actual: input.path.resolvedIntent,
      firstDivergence: { field: "resolvedIntent", expected: expect.intentKind, actual: input.path.resolvedIntent },
    };
  }
  if (expect.readWrite && expect.readWrite !== input.path.readWrite) {
    return {
      passed: false,
      failureKind: "path",
      expected: expect.readWrite,
      actual: input.path.readWrite,
      firstDivergence: { field: "readWrite", expected: expect.readWrite, actual: input.path.readWrite },
    };
  }
  const stageChanged = expect.stageEffect === "none"
    ? input.path.readWrite === "write"
    : Boolean(expect.stageEffect && expect.stageEffect !== input.path.stageMode);
  const stageFail =
    stageChanged ||
    (expect.focusId !== undefined && expect.focusId !== input.path.focusId) ||
    (expect.collectionCategory !== undefined && expect.collectionCategory !== input.path.activeCollection) ||
    (expect.collectionMemberIds && !sameIds(input.path.collectionMemberIds, expect.collectionMemberIds));
  if (stageFail) {
    return {
      passed: false,
      failureKind: "stage-effect",
      expected: {
        stageEffect: expect.stageEffect,
        focusId: expect.focusId,
        collectionCategory: expect.collectionCategory,
        collectionMemberIds: expect.collectionMemberIds,
      },
      actual: {
        stageMode: input.path.stageMode,
        focusId: input.path.focusId,
        collection: input.path.activeCollection,
        members: input.path.collectionMemberIds,
      },
      firstDivergence: {
        field: "stage",
        expected: expect.stageEffect ?? expect.focusId ?? expect.collectionMemberIds,
        actual: input.path.stageMode,
      },
    };
  }
  if (expect.confirmationPending === false && /confirmation-required/i.test(input.status)) {
    return {
      passed: false,
      failureKind: "path",
      expected: { confirmationPending: false },
      actual: input.status,
      firstDivergence: { field: "confirmation", expected: false, actual: input.status },
    };
  }
  if (expect.executionActive === false && input.executionState === "ACTIVE") {
    return {
      passed: false,
      failureKind: "path",
      expected: { executionActive: false },
      actual: input.executionState,
      firstDivergence: { field: "execution", expected: false, actual: input.executionState },
    };
  }
  const pathDivergence = expect.path ? firstPathDivergence(input.path, expect.path) : null;
  if (pathDivergence) {
    return {
      passed: false,
      failureKind: "path",
      expected: pathDivergence.expected,
      actual: pathDivergence.actual,
      firstDivergence: pathDivergence,
    };
  }
  return { passed: true, failureKind: "none", expected: expect, actual: input.path, firstDivergence: null };
}

export function runConversationCase(testCase: NxaConversationCase): NxaHarnessCaseResult {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const subjects = projectManagerObjectConversationalSubjects(catalog);
  let runtime = initialState();
  if (testCase.setup?.focusId) {
    runtime = selectNexoraMVPInteractionSubject(runtime, testCase.setup.focusId, catalog);
  }
  const focused = runtime.focusedSubject;
  let previous: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
  const turns: NxaHarnessTurnResult[] = [];
  let firstFailingTurn: number | null = null;

  testCase.turns.forEach((turn, index) => {
    const inherited = runtime.focusedSubject?.id ?? previous?.nextRuntimeState.focusedSubject?.id ?? null;
    const result = executeNexoraConversationalExperience({
      utterance: turn.utterance,
      runtimeState: runtime,
      catalog,
      executiveSubjects: subjects,
      conversationContext: testCase.setup?.restoreConversation && inherited && !previous
        ? Object.freeze({ currentSubjectId: inherited })
        : previous?.nextConversationContext,
      executiveContext: testCase.setup?.restoreConversation && focused && !previous
        ? restoredContext(focused.id, focused.label)
        : previous?.nextExecutiveContext,
      previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
      scenarioSession: previous?.nextScenarioSession ?? null,
      decisionSession: previous?.nextDecisionSession ?? null,
      messageIdSeed: `nxa6-prep-${testCase.id}-${index}`,
    });
    runtime = result.nextRuntimeState;
    previous = result;
    const path = projectConversationPathTrace({
      utterance: turn.utterance,
      inheritedSubjectId: inherited,
      result,
    });
    const judged = evaluateTurn(turn.expect, {
      response: result.response,
      path,
      status: result.status,
      executionState: result.trace.nxa3ExecutionState,
      confirmationPending: result.status === "confirmation-required",
    });
    if (!judged.passed && firstFailingTurn == null) firstFailingTurn = index;
    turns.push(Object.freeze({
      turnIndex: index,
      utterance: turn.utterance,
      response: result.response,
      path,
      ...judged,
    }));
  });

  if (testCase.queueParityCategory && previous) {
    const focusedStart = testCase.setup?.focusId
      ? selectNexoraMVPInteractionSubject(initialState(), testCase.setup.focusId, catalog)
      : initialState();
    const queue = openNexoraMVPExecutiveQueueCollection(
      focusedStart,
      testCase.queueParityCategory,
      catalog,
    );
    const advisorMembers = previous.nextRuntimeState.collectionContext?.objectIds ?? [];
    const queueMembers = queue.collectionContext?.objectIds ?? [];
    if (!sameIds(advisorMembers, queueMembers) || previous.nextRuntimeState.collectionContext?.category !== queue.collectionContext?.category) {
      if (firstFailingTurn == null) firstFailingTurn = testCase.turns.length - 1;
      turns.push(Object.freeze({
        turnIndex: testCase.turns.length,
        utterance: `queue:${testCase.queueParityCategory}`,
        passed: false,
        failureKind: "stage-effect" as const,
        expected: queueMembers,
        actual: advisorMembers,
        response: "",
        path: projectConversationPathTrace({
          utterance: "queue-parity",
          result: previous,
        }),
        firstDivergence: { field: "queueParity", expected: queueMembers, actual: advisorMembers },
      }));
    }
  }

  if (testCase.navigationProbe === "back-forward" && previous) {
    const afterBack = stepBackNexoraMVPObjectInteraction(runtime, catalog);
    const afterForward = stepForwardNexoraMVPObjectInteraction(afterBack, catalog);
    const backOk = afterBack.collectionContext?.category === "problem";
    const forwardOk = afterForward.focusedSubject?.id === "ctx-problem-capacity";
    if (!backOk || !forwardOk) {
      if (firstFailingTurn == null) firstFailingTurn = testCase.turns.length - 1;
      turns.push(Object.freeze({
        turnIndex: testCase.turns.length,
        utterance: "back/forward",
        passed: false,
        failureKind: "stage-effect" as const,
        expected: { back: "problem", forward: "ctx-problem-capacity" },
        actual: {
          back: afterBack.collectionContext?.category ?? null,
          forward: afterForward.focusedSubject?.id ?? null,
        },
        response: "",
        path: projectConversationPathTrace({ utterance: "back/forward", result: previous }),
        firstDivergence: { field: "navigation", expected: "back-collection/forward-focus", actual: classifyStage(afterBack) },
      }));
    }
  }

  const passed = firstFailingTurn == null;
  const fail = turns.find((turn) => !turn.passed);
  const diagnostic = passed
    ? `${testCase.id} passed`
    : `${testCase.id} failed at turn ${firstFailingTurn} (${fail?.failureKind}): ${fail?.firstDivergence?.field} expected ${JSON.stringify(fail?.firstDivergence?.expected)} actual ${JSON.stringify(fail?.firstDivergence?.actual)}`;
  return Object.freeze({
    id: testCase.id,
    title: testCase.title,
    passed,
    firstFailingTurn,
    turns: Object.freeze(turns),
    reproduction: `runConversationCase(${testCase.id})`,
    diagnostic,
  });
}

export function runConversationHarness(
  cases: readonly NxaConversationCase[],
): NxaHarnessRunResult {
  const started = Date.now();
  const results = cases.map(runConversationCase);
  const failed = results.filter((item) => !item.passed).length;
  return Object.freeze({
    identity: "NXA:6-PREP/ConversationHarness",
    passed: failed === 0,
    durationMs: Date.now() - started,
    totals: Object.freeze({
      cases: results.length,
      passed: results.length - failed,
      failed,
      skipped: 0,
    }),
    cases: Object.freeze(results),
  });
}

export function renderHarnessMarkdown(result: NxaHarnessRunResult): string {
  const lines = [
    `# NXA:6-PREP conversation harness`,
    "",
    `Passed: ${result.passed}. ${result.totals.passed}/${result.totals.cases} cases in ${result.durationMs}ms. Skipped: ${result.totals.skipped}.`,
    "",
  ];
  for (const item of result.cases) {
    lines.push(`## ${item.id} — ${item.passed ? "PASS" : "FAIL"}`);
    lines.push(item.diagnostic);
    if (!item.passed) lines.push(`Reproduction: ${item.reproduction}`);
    lines.push("");
  }
  return lines.join("\n");
}
