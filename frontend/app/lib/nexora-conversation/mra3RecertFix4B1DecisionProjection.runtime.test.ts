/** MRA:3-RECERT-FIX4-B1 — Decision projection and refresh parity. */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createNexoraCanonicalDecisionRuntime,
  hydrateNexoraCanonicalDecisionRuntimeRecords,
  serializeNexoraCanonicalDecisionRuntimeState,
} from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { bootstrapCanonicalDecisionsFromFlowFixtures } from "../conversational-control/executiveDecisionStatusProjection.ts";
import { resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPFlowDomainState,
  projectNexoraMVPCatalogDecisionStatusesFromFlowDomain,
  projectNexoraMVPFlowDecisionsFromCanonicalRuntime,
} from "../nex-mvp/nexoraMVPExecutiveFlow.ts";
import { createInitialNexoraMVPFlowDecisionRecords } from "../nex-mvp/nexoraMVPExecutiveFlowFixtures.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

describe("MRA:3-RECERT-FIX4-B1 Decision projection parity", () => {
  it("projects a session-created CC:10 Decision without dropping fixture Decisions", () => {
    const initial = bootstrapCanonicalDecisionsFromFlowFixtures(
      createInitialNexoraMVPFlowDecisionRecords(),
    );
    const runtime = createNexoraCanonicalDecisionRuntime({ initialDecisions: initial });
    runtime.adapter.transitionDecision({
      decisionId: "cc10:decision:ctx-scenario-demand",
      action: "approve",
      title: "Demand Surge",
      subjectIds: ["ctx-scenario-demand"],
      scenarioId: "ctx-scenario-demand",
    });

    const flow = projectNexoraMVPFlowDecisionsFromCanonicalRuntime(
      createInitialNexoraMVPFlowDomainState(),
      runtime.adapter,
    );
    assert.equal(flow.decisions.length, initial.length + 1);
    assert.equal(
      flow.decisions.find((item) => item.id === "cc10:decision:ctx-scenario-demand")?.status,
      "approved",
    );
    assert.ok(flow.decisions.some((item) => item.id === initial[0]?.decisionId));

    const stageCatalog = projectNexoraMVPCatalogDecisionStatusesFromFlowDomain(catalog, flow);
    assert.equal(
      stageCatalog.contextSubjects.find(
        (item) => item.id === "cc10:decision:ctx-scenario-demand",
      )?.status,
      "approved",
    );
  });

  it("hydrates the existing canonical Runtime snapshot after shell refresh", () => {
    const fixtures = bootstrapCanonicalDecisionsFromFlowFixtures(
      createInitialNexoraMVPFlowDecisionRecords(),
    );
    const beforeRefresh = createNexoraCanonicalDecisionRuntime({ initialDecisions: fixtures });
    beforeRefresh.adapter.transitionDecision({
      decisionId: "cc10:decision:ctx-scenario-demand",
      action: "approve",
      title: "Demand Surge",
      scenarioId: "ctx-scenario-demand",
    });

    const snapshot = serializeNexoraCanonicalDecisionRuntimeState(beforeRefresh.getState());
    const afterRefresh = createNexoraCanonicalDecisionRuntime({
      initialDecisions: hydrateNexoraCanonicalDecisionRuntimeRecords(snapshot, fixtures),
    });
    assert.equal(
      afterRefresh.adapter.getDecision("cc10:decision:ctx-scenario-demand")?.status,
      "Approved",
    );
    assert.equal(
      afterRefresh.adapter.listDecisions().filter(
        (item) => item.decisionId === "cc10:decision:ctx-scenario-demand",
      ).length,
      1,
    );
  });

  it("routes approval-status questions through the existing Decision status intent", () => {
    for (const utterance of [
      "Did we approve it?",
      "Is it approved?",
      "What is the decision status?",
    ]) {
      assert.equal(
        resolveNexoraConversationalIntent({ utterance }).intent.kind,
        "decision-status",
      );
    }
  });

  it("reports the canonical approval and approval alone does not start Execution", () => {
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
        messageIdSeed: `fix4-b1-${utterance}`,
      });

    const scenario = run("Demand Surge");
    const approval = run("Approve Demand Surge.", scenario);
    const status = run("Did we approve it?", approval);

    assert.equal(decisionRuntime.adapter.listDecisions().length, 1);
    assert.equal(decisionRuntime.adapter.listDecisions()[0]?.status, "Approved");
    assert.equal(executionRuntime.listExecutions().length, 0);
    assert.equal(status.intentResult.intent.kind, "decision-status");
    assert.match(status.response, /approved|made the decision|committed/i);
    assert.doesNotMatch(status.response, /no current decision requirement/i);
  });
});
