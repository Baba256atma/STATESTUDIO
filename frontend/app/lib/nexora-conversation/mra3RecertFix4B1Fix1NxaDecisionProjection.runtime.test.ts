/** MRA:3-RECERT-FIX4-B1-FIX1 — NXA Decision projection parity. */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createNexoraCanonicalDecisionRuntime,
  hydrateNexoraCanonicalDecisionRuntimeRecords,
  serializeNexoraCanonicalDecisionRuntimeState,
} from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPFlowDomainState,
  projectNexoraMVPCatalogDecisionStatusesFromFlowDomain,
  projectNexoraMVPFlowDecisionsFromCanonicalRuntime,
} from "../nex-mvp/nexoraMVPExecutiveFlow.ts";
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

function createJourney(
  decisionRuntime = createNexoraCanonicalDecisionRuntime(),
) {
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
  });
  let previous: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
  const run = (utterance: string) => {
    previous = executeNexoraConversationalExperience({
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
      messageIdSeed: `fix4-b1-fix1-${utterance}`,
    });
    return previous;
  };
  return { decisionRuntime, executionRuntime, run };
}

describe("MRA:3-RECERT-FIX4-B1-FIX1 NXA Decision projection parity", () => {
  it("projects the one approved CC:10 Decision through Manager–Object, NXA, Advisor, and Stage", () => {
    const journey = createJourney();
    const beforeApproval = journey.run("Demand Surge");
    assert.equal(beforeApproval.managerObjectTurn.journey.decisionState, "none");
    assert.equal(beforeApproval.trace.nxa3DecisionState, "none");

    const approval = journey.run("Approve Demand Surge.");
    const decision = journey.decisionRuntime.adapter.listDecisions()[0]!;
    assert.equal(journey.decisionRuntime.adapter.listDecisions().length, 1);
    assert.equal(decision.status, "Approved");
    assert.equal(approval.managerObjectTurn.journey.decisionState, "committed");
    assert.equal(approval.trace.nxa3DecisionState, "committed");
    assert.ok(approval.executiveSituation);
    assert.equal(approval.executiveSituation.decision.subjectId, decision.decisionId);
    assert.equal(journey.executionRuntime.listExecutions().length, 0);

    const status = journey.run("Did we approve it?");
    assert.equal(status.trace.nxa3DecisionState, "committed");
    assert.match(status.response, /approved|committed decision/i);

    const flow = projectNexoraMVPFlowDecisionsFromCanonicalRuntime(
      createInitialNexoraMVPFlowDomainState(),
      journey.decisionRuntime.adapter,
    );
    const stageCatalog = projectNexoraMVPCatalogDecisionStatusesFromFlowDomain(
      catalog,
      flow,
    );
    assert.equal(
      stageCatalog.contextSubjects.find((item) => item.id === decision.decisionId)
        ?.status,
      "approved",
    );
  });

  it("preserves committed NXA Decision state after canonical hydration", () => {
    const beforeRefresh = createJourney();
    beforeRefresh.run("Demand Surge");
    beforeRefresh.run("Approve Demand Surge.");
    const snapshot = serializeNexoraCanonicalDecisionRuntimeState(
      beforeRefresh.decisionRuntime.getState(),
    );
    const afterRefreshRuntime = createNexoraCanonicalDecisionRuntime({
      initialDecisions: hydrateNexoraCanonicalDecisionRuntimeRecords(snapshot, []),
    });
    const afterRefresh = createJourney(afterRefreshRuntime);
    const status = afterRefresh.run("What is the decision status?");

    assert.equal(afterRefreshRuntime.adapter.listDecisions().length, 1);
    assert.equal(afterRefreshRuntime.adapter.listDecisions()[0]?.status, "Approved");
    assert.equal(status.managerObjectTurn.journey.decisionState, "committed");
    assert.equal(status.trace.nxa3DecisionState, "committed");
    assert.match(status.response, /approved|committed decision/i);
    assert.equal(afterRefresh.executionRuntime.listExecutions().length, 0);
  });
});
