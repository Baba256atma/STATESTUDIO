import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { EXECUTIVE_OPERATIONS_DEMO_DATASET_ID } from "../data-reality/demo/executiveOperationsDemoDataset.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { bootstrapCanonicalDecisionsFromFlowFixtures } from "../conversational-control/executiveDecisionStatusProjection.ts";
import { hostNmiLiveManagementIntelligence } from "../nmi/nmiLivePipeline.ts";
import { isRealManagerWorkspaceId } from "../workspace/liveManagerDataWorkspaceGuard.ts";
import {
  bindWorkflowMode,
  createManagerWorkspace,
} from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "./nexoraMVPDataRealityAwareStageExperience.ts";
import {
  applyNexoraMVPFlowDomainAction,
  containNexoraMVPFlowDomainForManagerWorkspace,
  createEmptyNexoraMVPFlowDomainState,
  createInitialNexoraMVPFlowDomainState,
  isNexoraMVPProductFixtureDecisionId,
} from "./nexoraMVPExecutiveFlow.ts";
import { createInitialNexoraMVPFlowDecisionRecords } from "./nexoraMVPExecutiveFlowFixtures.ts";
import {
  createEmptyNexoraMVPObjectInteractionCatalog,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "./nexoraMVPObjectInteraction.ts";

const FIXTURE_LABELS = [
  "Margin Pressure",
  "Capacity Gap",
  "Pricing Response",
  "Demand Surge",
  "Capacity Expansion Plan",
  "Approve Repricing",
  "Expand Capacity",
  "Pricing Rollout",
  "Capacity Expansion",
] as const;

beforeEach(() => {
  resetWorkspaceRegistryForTests();
});

function containedExperience() {
  return resolveNexoraMVPDataRealityAwareStageExperience({
    baseCatalog: createEmptyNexoraMVPObjectInteractionCatalog(),
    suppressUnownedDemoDataset: true,
  });
}

test("demo_workspace keeps the product fixture composition", () => {
  assert.equal(isRealManagerWorkspaceId(DEMO_WORKSPACE_ID), false);
  const flow = createInitialNexoraMVPFlowDomainState();
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const demo = resolveNexoraMVPDataRealityAwareStageExperience();
  const live = hostNmiLiveManagementIntelligence({ catalog: demo.catalog });
  const text = JSON.stringify({ flow, catalog, nodes: live.overlayMapNodes, subjects: live.advisorBundle.subjects });
  for (const label of FIXTURE_LABELS) assert.match(text, new RegExp(label));
  assert.equal(demo.runtimeState.datasetIdentity.datasetId, EXECUTIVE_OPERATIONS_DEMO_DATASET_ID);
  assert.equal(
    bootstrapCanonicalDecisionsFromFlowFixtures(createInitialNexoraMVPFlowDecisionRecords())
      .every((record) => record.workspaceId === null),
    true,
  );
});

test("a clean BUSINESS workspace receives no fixture management truth", () => {
  const clean = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  assert.ok(clean);
  assert.equal(isRealManagerWorkspaceId(clean.workspaceId), true);
  const experience = containedExperience();
  const live = hostNmiLiveManagementIntelligence({ catalog: experience.catalog });
  const flow = containNexoraMVPFlowDomainForManagerWorkspace(createInitialNexoraMVPFlowDomainState(), {
    workspaceId: clean.workspaceId,
    decisions: bootstrapCanonicalDecisionsFromFlowFixtures(createInitialNexoraMVPFlowDecisionRecords()),
    executions: [],
  });
  const text = JSON.stringify({
    catalog: experience.catalog,
    nodes: live.overlayMapNodes,
    subjects: live.advisorBundle.subjects,
    flow,
  });
  for (const label of FIXTURE_LABELS) assert.doesNotMatch(text, new RegExp(label));
  assert.equal(experience.catalog.contextSubjects.length, 0);
  assert.equal(experience.catalog.objects.length, 0);
  assert.equal(experience.usesActiveDataSource, false);
  assert.notEqual(experience.runtimeState.datasetIdentity.datasetId, EXECUTIVE_OPERATIONS_DEMO_DATASET_ID);
  assert.equal(flow.decisions.length, 0);
  assert.equal(flow.executions.length, 0);
  assert.equal(flow.timelineEvents.length, 0);
  assert.equal(flow.journalPacks.length, 0);
});

test("a clean PROJECT workspace receives no fixture management truth", () => {
  const project = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(project);
  const experience = containedExperience();
  const live = hostNmiLiveManagementIntelligence({ catalog: experience.catalog });
  const text = JSON.stringify(live.advisorBundle.subjects);
  assert.doesNotMatch(text, /Capacity Gap|Margin Pressure|Pricing Response/);
  assert.equal(live.overlayMapNodes.length, 0);
});

test("fixture Decisions are not assigned to the active real workspace", () => {
  const clean = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  assert.ok(clean);
  const seeded = bootstrapCanonicalDecisionsFromFlowFixtures(createInitialNexoraMVPFlowDecisionRecords())
    .map((record) => Object.freeze({ ...record, workspaceId: clean.workspaceId }));
  const contained = containNexoraMVPFlowDomainForManagerWorkspace(createInitialNexoraMVPFlowDomainState(), {
    workspaceId: clean.workspaceId,
    decisions: seeded,
    executions: [],
  });
  assert.equal(contained.decisions.length, 0);
  assert.equal(isNexoraMVPProductFixtureDecisionId("ctx-decision-reprice"), true);
  assert.equal(isNexoraMVPProductFixtureDecisionId("decision-clean-lumber"), false);
});

test("a legitimate manager Decision can still be created", () => {
  const clean = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  assert.ok(clean);
  const runtime = createNexoraCanonicalDecisionRuntime({
    authorityId: "fix1-real-decision",
    initialDecisions: [],
  });
  const empty = createEmptyNexoraMVPFlowDomainState();
  const prepared = Object.freeze({
    ...empty,
    decisions: Object.freeze([
      Object.freeze({
        id: "decision-clean-lumber",
        status: "under-review" as const,
        locked: false,
        sourceScenarioId: null,
        sourceProblemId: null,
        objectId: null,
        label: "Buy lumber",
      }),
    ]),
  });
  const result = applyNexoraMVPFlowDomainAction(
    prepared,
    { actionId: "approve-lumber", subjectId: "decision-clean-lumber", kind: "approve-decision" },
    { decisionRuntime: runtime.adapter, managerWorkspaceId: clean.workspaceId },
  );
  assert.equal(result.ok, true);
  const owned = runtime.adapter.getDecision("decision-clean-lumber");
  assert.equal(owned?.workspaceId, clean.workspaceId);
  assert.equal(runtime.adapter.getDecision("ctx-decision-reprice"), null);
  assert.equal(runtime.adapter.getDecision("ctx-decision-capacity"), null);
  const visible = containNexoraMVPFlowDomainForManagerWorkspace(result.ok ? result.state : empty, {
    workspaceId: clean.workspaceId,
    decisions: runtime.adapter.listDecisions(),
    executions: [],
  });
  assert.deepEqual(visible.decisions.map((record) => record.id), ["decision-clean-lumber"]);
});

test("workflow dial changes do not permit fixtures for a real workspace", () => {
  const clean = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  assert.ok(clean);
  for (const workflowMode of ["overview", "problem", "scenario", "decision", "execution"] as const) {
    const bound: Readonly<{ workspaceId: string; workflowMode: typeof workflowMode }> =
      bindWorkflowMode({ workspaceId: clean.workspaceId, workflowMode });
    assert.equal(bound.workspaceId, clean.workspaceId);
    assert.equal(isRealManagerWorkspaceId(bound.workspaceId), true);
    assert.equal(isRealManagerWorkspaceId(workflowMode), false);
  }
});

test("switching demo and real workspaces follows the fixture policy", () => {
  const clean = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(clean);
  assert.ok(factory);
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(isRealManagerWorkspaceId(DEMO_WORKSPACE_ID), false);
  setActiveWorkspace(clean.workspaceId);
  assert.equal(isRealManagerWorkspaceId(clean.workspaceId), true);
  setActiveWorkspace(factory.workspaceId);
  assert.equal(isRealManagerWorkspaceId(factory.workspaceId), true);
  setActiveWorkspace(DEMO_WORKSPACE_ID);
  assert.equal(isRealManagerWorkspaceId(DEMO_WORKSPACE_ID), false);
  const demo = resolveNexoraMVPDataRealityAwareStageExperience();
  assert.match(JSON.stringify(demo.catalog.contextSubjects), /Capacity Gap/);
  const real = containedExperience();
  assert.doesNotMatch(JSON.stringify(real.catalog), /Capacity Gap|Margin Pressure/);
});
