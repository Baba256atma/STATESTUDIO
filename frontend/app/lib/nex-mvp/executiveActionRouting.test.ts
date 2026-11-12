import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraSubjectOperation, activateSubjectOperation } from "../../executive/nex-mvp/presentation/NexoraSubjectOperation.tsx";
import { NexoraCausalInvestigationView } from "../../executive/nex-mvp/stage/NexoraCausalInvestigationView.tsx";
import { NexoraDecisionDomainControls } from "../../executive/nex-mvp/stage/NexoraDecisionDomainControls.tsx";
import { createDeck, resetDeckRegistryForTests, setDeckRegistryStorageForTests } from "../deck/nexoraDeckRegistry.ts";
import { NEXORA_EXECUTIVE_DECK_ID } from "../deck/nexoraDeckIdentityContract.ts";
import { createManagerWorkspaceFromEntry } from "../workspace/managerWorkspaceEntry.ts";
import { BUSINESS_DEMO_WORKSPACE_ID, DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { deleteWorkspace, resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import {
  createCausalHypothesis,
  createCausalInvestigation,
  createCausalObservation,
  getCausalHypothesis,
  listCausalHypothesisReviews,
  resetCausalInvestigationDomainForTests,
} from "../scene-org/canonicalCausalInvestigationDomain.ts";
import {
  approveManagerDecision,
  createDecisionGoal,
  createDecisionScenario,
  createExecutionPlan,
  createManagerDecision,
  getDecisionScenario,
  getManagerDecision,
  resetDecisionDomainForTests,
} from "../scene-org/canonicalDecisionDomain.ts";
import { createCanonicalObject, resetCanonicalObjectsForTests } from "../scene-org/canonicalObjectRegistry.ts";
import {
  publishCausalInvestigationUiSelection,
  resetCausalInvestigationUiSessionForTests,
  setCausalInvestigationUiStorageForTests,
} from "../scene-org/causalInvestigationUiSession.ts";
import {
  planExecutivePresentationAction,
  routeExecutivePresentationActions,
  type ExecutiveActionResolutionContext,
} from "./executiveActionRouting.ts";
import { getNexoraMVPSubjectPresentationFixture } from "./nexoraMVPPresentationFixtures.ts";
import {
  deriveNexoraMVPPresentationViewModel,
  type NexoraMVPPresentationAvailableAction,
} from "./nexoraMVPPresentationState.ts";

const T0 = "2026-11-12T12:00:00.000Z";

function memory(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear() { values.clear(); },
    getItem(key: string) { return values.get(key) ?? null; },
    key(index: number) { return [...values.keys()][index] ?? null; },
    removeItem(key: string) { values.delete(key); },
    setItem(key: string, value: string) { values.set(key, value); },
  };
}

function setup() {
  const store = memory();
  resetWorkspaceRegistryForTests();
  resetDeckRegistryForTests();
  setDeckRegistryStorageForTests(store);
  resetCanonicalObjectsForTests(store);
  resetCausalInvestigationDomainForTests(store);
  resetDecisionDomainForTests(store);
  setCausalInvestigationUiStorageForTests(store);
  return store;
}

function teardown(workspaceIds: readonly string[]) {
  for (const workspaceId of workspaceIds) deleteWorkspace(workspaceId);
  resetCausalInvestigationUiSessionForTests();
  resetDecisionDomainForTests();
  resetCausalInvestigationDomainForTests();
  resetCanonicalObjectsForTests();
  resetDeckRegistryForTests();
  resetWorkspaceRegistryForTests();
}

function context(patch: Partial<ExecutiveActionResolutionContext> & Pick<ExecutiveActionResolutionContext, "workspaceId" | "sourceObjectId">): ExecutiveActionResolutionContext {
  return Object.freeze({
    deckId: "production",
    demoProfileId: null,
    sourceInActiveCatalog: true,
    sourceWorkspaceId: patch.workspaceId,
    ...patch,
  });
}

function fixtureActions(subjectId: string): readonly NexoraMVPPresentationAvailableAction[] {
  return getNexoraMVPSubjectPresentationFixture(subjectId)?.actions ?? [];
}

function operationView(subjectId: string, label: string) {
  return deriveNexoraMVPPresentationViewModel({
    presentationState: "operation",
    workspace: "overview",
    environmentIntent: "neutral",
    subjectId,
    subjectKind: "object",
    subjectLabel: label,
  });
}

test("manufacturing Production actions no longer silently select fixture subjects", () => {
  const routed = routeExecutivePresentationActions(fixtureActions("obj-capacity"), context({
    workspaceId: DEMO_WORKSPACE_ID,
    deckId: "manufacturing",
    demoProfileId: "manufacturing",
    sourceObjectId: "obj-capacity",
    sourceWorkspaceId: DEMO_WORKSPACE_ID,
  }));
  const domain = routed.filter((action) => action.domainAction != null);
  assert.deepEqual(domain.map((action) => action.label), [
    "Investigate Problem",
    "Review Decision",
    "Open Scenario",
  ]);
  for (const action of domain) {
    assert.equal(action.available, false);
    assert.equal(action.targetSubjectId, undefined);
    assert.equal(action.domainAction?.targetId, undefined);
    assert.match(action.disabledReason ?? "", /Demo|unavailable|No /);
    assert.equal((action.disabledReason ?? "").includes("ctx-"), false);
    const calls: string[] = [];
    activateSubjectOperation(action, () => { calls.push(action.id); });
    assert.deepEqual(calls, []);
    assert.equal(planExecutivePresentationAction(action, context({
      workspaceId: DEMO_WORKSPACE_ID,
      deckId: "manufacturing",
      demoProfileId: "manufacturing",
      sourceObjectId: "obj-capacity",
      sourceWorkspaceId: DEMO_WORKSPACE_ID,
    })).kind, "rejected");
  }
  const html = renderToStaticMarkup(React.createElement(NexoraSubjectOperation, {
    viewModel: { ...operationView("obj-capacity", "Production"), availableActions: routed },
    onAction: () => { throw new Error("unavailable action was dispatched"); },
  }));
  assert.match(html, /No Decision is available for review in this Demo/);
  assert.match(html, /No Scenario is associated with this object in this Demo/);
  assert.match(html, /NexoCause is unavailable in a protected Demo/);
  assert.equal(html.includes("ctx-problem-capacity"), false);
  assert.equal(html.includes("ctx-decision-capacity"), false);
  assert.equal(html.includes("ctx-scenario-capacity"), false);
});

test("project and business demos do not inherit manufacturing fixture targets", () => {
  const project = routeExecutivePresentationActions(fixtureActions("obj-capacity"), context({
    workspaceId: DEMO_WORKSPACE_ID,
    deckId: "project",
    demoProfileId: "project",
    sourceObjectId: "obj-capacity",
    sourceWorkspaceId: DEMO_WORKSPACE_ID,
  }));
  assert.equal(project.some((action) => action.domainAction?.targetId != null), false);
  assert.equal(project.some((action) => (action.targetSubjectId ?? "").startsWith("ctx-")), false);
  const businessSource = `business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:revenue`;
  const business = routeExecutivePresentationActions(fixtureActions(businessSource), context({
    workspaceId: BUSINESS_DEMO_WORKSPACE_ID,
    deckId: NEXORA_EXECUTIVE_DECK_ID,
    sourceObjectId: businessSource,
    sourceWorkspaceId: BUSINESS_DEMO_WORKSPACE_ID,
  }));
  assert.deepEqual(business, []);
});

test("canonical targets open their domain and missing targets stay explained", () => {
  setup();
  const company = createManagerWorkspaceFromEntry({ name: "Action Routing", kind: "BUSINESS" });
  const other = createManagerWorkspaceFromEntry({ name: "Other Company", kind: "BUSINESS" });
  assert.ok(company && other);
  if (!company || !other) return;
  try {
    const production = createDeck({ workspaceId: company.workspaceId, name: "Production", kind: "DEPARTMENT" });
    const finance = createDeck({ workspaceId: company.workspaceId, name: "Finance", kind: "DEPARTMENT" });
    assert.equal(production.ok && finance.ok, true);
    if (!production.ok || !finance.ok) return;
    const machine = createCanonicalObject({
      workspaceId: company.workspaceId,
      objectType: "MACHINE",
      displayName: "Production",
      deckId: production.value.deckId,
      now: T0,
    });
    assert.equal(machine.ok, true);
    if (!machine.ok) return;
    const investigation = createCausalInvestigation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      title: "Capacity pressure",
      problemStatement: "Production is above the intended band.",
      now: T0,
    });
    assert.equal(investigation.ok, true);
    if (!investigation.ok) return;
    const observation = createCausalObservation({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "Used capacity is above the band.",
      canonicalObjectId: machine.value.canonicalObjectId,
      now: T0,
    });
    assert.equal(observation.ok, true);
    if (!observation.ok) return;
    const hypothesis = createCausalHypothesis({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      investigationId: investigation.value.investigationId,
      statement: "The band was exceeded because available hours fell.",
      observationIds: [observation.value.observationId],
      canonicalObjectIds: [machine.value.canonicalObjectId],
      now: T0,
    });
    assert.equal(hypothesis.ok, true);
    if (!hypothesis.ok) return;
    const goal = createDecisionGoal({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Restore the band",
      now: T0,
    });
    assert.equal(goal.ok, true);
    if (!goal.ok) return;
    const scenario = createDecisionScenario({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Add a shift",
      goalId: goal.value.goalId,
      now: T0,
    });
    const unrelatedScenario = createDecisionScenario({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Unrelated scenario",
      goalId: goal.value.goalId,
      now: T0,
    });
    assert.equal(scenario.ok && unrelatedScenario.ok, true);
    if (!scenario.ok || !unrelatedScenario.ok) return;
    const decision = createManagerDecision({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Expand capacity",
      scenarioId: scenario.value.scenarioId,
      now: T0,
    });
    const unrelated = createManagerDecision({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Unrelated decision",
      scenarioId: unrelatedScenario.value.scenarioId,
      now: T0,
    });
    assert.equal(decision.ok && unrelated.ok, true);
    if (!decision.ok || !unrelated.ok) return;
    assert.equal(approveManagerDecision({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      decisionId: decision.value.decisionId,
      now: T0,
    }).ok, true);
    const plan = createExecutionPlan({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      name: "Staff the shift",
      decisionId: decision.value.decisionId,
      organizationalObjectId: machine.value.canonicalObjectId,
      now: T0,
    });
    assert.equal(plan.ok, true);
    if (!plan.ok) return;

    const live = context({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      sourceObjectId: machine.value.canonicalObjectId,
    });
    const beforeDecision = getManagerDecision(company.workspaceId, decision.value.decisionId);
    const beforeScenario = getDecisionScenario(company.workspaceId, scenario.value.scenarioId);
    const beforeReviews = listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId).length;
    const routed = routeExecutivePresentationActions([], live);
    const investigate = routed.find((action) => action.domainAction?.identity === "investigate-problem");
    const review = routed.find((action) => action.domainAction?.identity === "review-decision");
    const openScenario = routed.find((action) => action.domainAction?.identity === "open-scenario");
    assert.equal(investigate?.available, true);
    assert.equal(investigate?.domainAction?.targetId, investigation.value.investigationId);
    assert.equal(review?.available, true);
    assert.equal(review?.domainAction?.targetId, decision.value.decisionId);
    assert.notEqual(review?.domainAction?.targetId, unrelated.value.decisionId);
    assert.equal(openScenario?.available, true);
    assert.equal(openScenario?.domainAction?.targetId, scenario.value.scenarioId);

    const opened: NexoraMVPPresentationAvailableAction[] = [];
    activateSubjectOperation(investigate!, (action) => { opened.push(action); });
    const investigationPlan = planExecutivePresentationAction(opened[0]!, live);
    assert.equal(investigationPlan.kind, "open-investigation");
    if (investigationPlan.kind !== "open-investigation") return;
    assert.equal(investigationPlan.canonicalObjectId, machine.value.canonicalObjectId);
    publishCausalInvestigationUiSelection(investigationPlan.workspaceId, investigationPlan.deckId, {
      investigationId: investigationPlan.investigationId,
      hypothesisId: null,
      canonicalObjectId: investigationPlan.canonicalObjectId,
    });
    const investigationHtml = renderToStaticMarkup(React.createElement(NexoraCausalInvestigationView, {
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      onOpenDecision: () => undefined,
    }));
    assert.match(investigationHtml, /Capacity pressure/);
    assert.equal(getCausalHypothesis(company.workspaceId, hypothesis.value.hypothesisId)?.status, "PROPOSED");
    assert.equal(listCausalHypothesisReviews(company.workspaceId, hypothesis.value.hypothesisId).length, beforeReviews);

    const reviewPlan = planExecutivePresentationAction(review!, live);
    assert.equal(reviewPlan.kind, "open-decision");
    if (reviewPlan.kind !== "open-decision") return;
    const reviewHtml = renderToStaticMarkup(React.createElement(NexoraDecisionDomainControls, {
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      focusRecordId: reviewPlan.decisionId,
      onInspect: () => undefined,
    }));
    assert.match(reviewHtml, /Expand capacity/);
    assert.match(reviewHtml, /Review does not approve or reject this Decision/);
    assert.equal(getManagerDecision(company.workspaceId, decision.value.decisionId)?.lifecycleStatus, beforeDecision?.lifecycleStatus);
    assert.equal(getManagerDecision(company.workspaceId, decision.value.decisionId)?.approvedAt, beforeDecision?.approvedAt);

    const scenarioPlan = planExecutivePresentationAction(openScenario!, live);
    assert.equal(scenarioPlan.kind, "open-scenario");
    if (scenarioPlan.kind !== "open-scenario") return;
    const scenarioHtml = renderToStaticMarkup(React.createElement(NexoraDecisionDomainControls, {
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      focusRecordId: scenarioPlan.scenarioId,
      onInspect: () => undefined,
    }));
    assert.match(scenarioHtml, /Add a shift/);
    assert.match(scenarioHtml, /This Scenario is a proposal/);
    assert.equal(getDecisionScenario(company.workspaceId, scenario.value.scenarioId)?.updatedAt, beforeScenario?.updatedAt);
    assert.equal(getDecisionScenario(company.workspaceId, scenario.value.scenarioId)?.lifecycleStatus, "PROPOSED");

    const missing = routeExecutivePresentationActions([], context({
      workspaceId: company.workspaceId,
      deckId: finance.value.deckId,
      sourceObjectId: machine.value.canonicalObjectId,
      sourceInActiveCatalog: true,
    }));
    assert.equal(missing.every((action) => action.available === false), true);
    assert.match(missing[0]?.disabledReason ?? "", /no longer available in this Deck/);

    const stale = routeExecutivePresentationActions(fixtureActions("obj-capacity"), context({
      workspaceId: company.workspaceId,
      deckId: production.value.deckId,
      sourceObjectId: "obj-capacity",
      sourceInActiveCatalog: false,
      sourceWorkspaceId: null,
    }));
    assert.equal(stale.find((action) => action.label === "Investigate Problem")?.disabledReason, "The selected object is no longer available in this Deck.");

    const crossed = routeExecutivePresentationActions([], context({
      workspaceId: other.workspaceId,
      deckId: production.value.deckId,
      sourceObjectId: machine.value.canonicalObjectId,
      sourceWorkspaceId: company.workspaceId,
    }));
    assert.match(crossed[0]?.disabledReason ?? "", /another Workspace/);

    const executiveObject = createCanonicalObject({
      workspaceId: company.workspaceId,
      objectType: "MACHINE",
      displayName: "Executive Production",
      deckId: NEXORA_EXECUTIVE_DECK_ID,
      now: T0,
    });
    assert.equal(executiveObject.ok, true);
    if (!executiveObject.ok) return;
    const executive = routeExecutivePresentationActions([], context({
      workspaceId: company.workspaceId,
      deckId: NEXORA_EXECUTIVE_DECK_ID,
      sourceObjectId: executiveObject.value.canonicalObjectId,
    }));
    assert.match(executive.find((action) => action.domainAction?.identity === "investigate-problem")?.disabledReason ?? "", /department Deck/);
    assert.match(executive.find((action) => action.domainAction?.identity === "review-decision")?.disabledReason ?? "", /No Decision is available for review/);
  } finally {
    teardown([company.workspaceId, other.workspaceId]);
  }
});

test("the shell dispatches domain actions before fixture subject selection", () => {
  const source = readFileSync(new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url), "utf8");
  const handler = source.slice(source.indexOf("const onPresentationAction"), source.indexOf("const onIntelligenceAction"));
  assert.match(handler, /planExecutivePresentationAction/);
  assert.ok(handler.indexOf("planExecutivePresentationAction") < handler.indexOf("onSelectSubject"));
  assert.equal(handler.includes("approveManagerDecision"), false);
  assert.equal(handler.includes("commitCausalScenarioHandoff"), false);
  const routing = readFileSync(new URL("./executiveActionRouting.ts", import.meta.url), "utf8");
  assert.equal(routing.includes("approveManagerDecision"), false);
  assert.equal(routing.includes("commitCausalScenarioHandoff"), false);
  assert.equal(routing.includes("reviewCausalHypothesis"), false);
});
