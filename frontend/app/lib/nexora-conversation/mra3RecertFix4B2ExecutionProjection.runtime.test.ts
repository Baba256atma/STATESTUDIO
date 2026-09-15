/** MRA:3-RECERT-FIX4-B2 — Execution projection and refresh parity. */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import {
  createNexoraCanonicalExecutionRuntime,
  hydrateNexoraCanonicalExecutionRuntimeRecords,
  serializeNexoraCanonicalExecutionRuntimeState,
} from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectNexoraDecisionTheatreFoundation } from "../decision-theatre/nexoraDecisionTheatrePublicIndex.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function runJourney() {
  const decisionRuntime = createNexoraCanonicalDecisionRuntime();
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
  });
  const run = (
    utterance: string,
    previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  ) =>
    executeNexoraConversationalExperience({
      utterance,
      conversationContext: previous?.nextConversationContext,
      executiveContext: previous?.nextExecutiveContext,
      executiveSubjects: subjects,
      runtimeState: previous?.nextRuntimeState ?? initialState(),
      catalog,
      previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
      scenarioSession: previous?.nextScenarioSession ?? null,
      decisionSession: previous?.nextDecisionSession ?? null,
      decisionRuntime: decisionRuntime.adapter,
      executionRuntime,
      allowActiveStageContext: false,
      messageIdSeed: `fix4-b2-${utterance}`,
    });

  const scenario = run("Demand Surge");
  const approval = run("Approve Demand Surge.", scenario);
  const executionsBeforeStart = executionRuntime.listExecutions().length;
  const start = run("Start it.", approval);
  return {
    decisionRuntime,
    executionRuntime,
    approval,
    executionsBeforeStart,
    start,
    run,
  };
}

describe("MRA:3-RECERT-FIX4-B2 Execution projection parity", () => {
  it("keeps approval distinct, then CC:11 starts exactly one canonical Execution", () => {
    const result = runJourney();
    assert.equal(result.approval.decisionCommitmentResult?.decision?.status, "Approved");
    assert.equal(result.executionsBeforeStart, 0);
    assert.equal(result.executionRuntime.listExecutions().length, 1);
    assert.equal(result.executionRuntime.listExecutions()[0]?.status, "in-progress");
    assert.equal(result.decisionRuntime.adapter.listDecisions()[0]?.status, "Approved");
  });

  it("projects the canonical Execution through Manager–Object, NXA, and Theatre", () => {
    const result = runJourney();
    const execution = result.executionRuntime.listExecutions()[0]!;
    const journeyExecution = result.start.managerObjectTurn.journey.progressSignals.find(
      (signal) => signal.id === "execution",
    );
    assert.equal(journeyExecution?.value, "ACTIVE");
    assert.equal(result.start.trace.nxa3ExecutionState, "ACTIVE");

    const theatre = projectNexoraDecisionTheatreFoundation({
      stageState: result.start.nextRuntimeState,
      catalog,
      authoritativeDecisions: result.decisionRuntime.adapter.listDecisions().map((item) => ({
        decisionId: item.decisionId,
        title: item.title,
        status: item.status,
        scenarioId: item.scenarioId ?? null,
        committedBy: item.committedBy ?? null,
      })),
      authoritativeExecutions: [execution],
      executionStarted: true,
      executionRuntimeAvailable: true,
    });
    assert.equal(theatre.liveExecution?.executionId, execution.executionId);
    assert.equal(theatre.liveExecution?.canonicalStatus, "in-progress");
  });

  it("routes and answers canonical Execution-status questions without Scenario copy", () => {
    for (const utterance of [
      "Did it start?",
      "Is it running?",
      "What is the execution status?",
    ]) {
      assert.equal(
        resolveNexoraConversationalIntent({ utterance }).intent.kind,
        "execution-status",
      );
    }
    const result = runJourney();
    const status = result.run("Did it start?", result.start);
    assert.match(status.response, /execution has started|being executed|in-progress/i);
    assert.doesNotMatch(status.response, /scenario projection|scenario impact/i);
  });

  it("hydrates one started Execution and duplicate start reuses it", () => {
    const result = runJourney();
    const snapshot = serializeNexoraCanonicalExecutionRuntimeState(
      result.executionRuntime.getState(),
    );
    const hydratedRecords = hydrateNexoraCanonicalExecutionRuntimeRecords(
      snapshot,
      [],
    );
    const afterRefresh = createNexoraCanonicalExecutionRuntime({
      decisionRuntime: result.decisionRuntime.adapter,
      initialExecutions: hydratedRecords,
    });
    assert.equal(afterRefresh.listExecutions().length, 1);
    assert.equal(afterRefresh.listExecutions()[0]?.status, "in-progress");
    const duplicate = afterRefresh.createExecution({
      decisionId: result.decisionRuntime.adapter.listDecisions()[0]!.decisionId,
    });
    assert.equal(duplicate.status, "reused");
    assert.equal(afterRefresh.listExecutions().length, 1);
  });

  it("preserves preloaded canonical Execution projection", () => {
    const result = runJourney();
    const preloaded = result.executionRuntime.listExecutions();
    const runtime = createNexoraCanonicalExecutionRuntime({
      decisionRuntime: result.decisionRuntime.adapter,
      initialExecutions: preloaded,
    });
    assert.deepEqual(runtime.listExecutions(), preloaded);
  });
});
