import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ExecutiveContextBuilder,
  buildExecutiveContextManifest,
  validateExecutiveContextManifest,
} from "./executiveContextIndex.ts";
import {
  ExecutiveContextQueryLayer,
  buildExecutiveContextSnapshot,
  buildExecutiveContextSummary,
  compareExecutiveContextSnapshots,
  diffExecutiveContextSnapshots,
  filterExecutiveContext,
  findConstraintContext,
  findDomainContext,
  findGoalContext,
  findIntentContext,
  findKpiContext,
  findObjectContext,
  findRiskContext,
  findScenarioContext,
  findSimulationContext,
  findTimelineContext,
  findWorkspaceContext,
  inspectExecutiveContext,
  queryExecutiveContext,
  validateExecutiveContextSnapshot,
} from "./executiveContextQueryIndex.ts";

function fixtureContext() {
  return ExecutiveContextBuilder.createExecutiveContext({
    contextId: "context.query.fixture",
    workspace: { workspaceId: "workspace.query", workspaceName: "Query Workspace" },
    domain: { selectedDomainIds: ["DOM-1", "DOM-7"], appDomainPlatformVersion: "APP-DOM-4" },
    objects: { objectIds: ["object.alpha"] },
    kpis: { kpiIds: ["kpi.margin"] },
    risks: { riskIds: ["risk.delivery"] },
    scenario: { scenarioId: "scenario.query", scenarioLabel: "Query Scenario" },
    timeline: { timelineId: "timeline.query", periodLabel: "Query Period" },
    simulation: { simulationId: "simulation.query", simulationLabel: "Query Simulation", metadataOnly: true },
    intent: { intentId: "intent.query", intentLabel: "Query Intent", description: "Intent metadata." },
    goal: { goalId: "goal.query", goalLabel: "Query Goal", description: "Goal metadata." },
    constraints: { constraintIds: ["constraint.query"], notes: ["Constraint metadata."] },
  });
}

test("queries executive context", () => {
  assert.equal(queryExecutiveContext(fixtureContext()).length, 13);
});

test("filters executive context", () => {
  const results = filterExecutiveContext(fixtureContext(), { contains: "workspace.query" });

  assert.equal(results.some((entry) => entry.section === "workspace"), true);
});

test("looks up workspace context", () => {
  assert.equal(findWorkspaceContext(fixtureContext()).value?.workspaceId, "workspace.query");
});

test("looks up domain context", () => {
  assert.deepEqual(findDomainContext(fixtureContext()).value?.selectedDomainIds, ["DOM-1", "DOM-7"]);
});

test("looks up object context", () => {
  assert.deepEqual(findObjectContext(fixtureContext()).value?.objectIds, ["object.alpha"]);
});

test("looks up KPI context", () => {
  assert.deepEqual(findKpiContext(fixtureContext()).value?.kpiIds, ["kpi.margin"]);
});

test("looks up risk context", () => {
  assert.deepEqual(findRiskContext(fixtureContext()).value?.riskIds, ["risk.delivery"]);
});

test("looks up scenario context", () => {
  assert.equal(findScenarioContext(fixtureContext()).value?.scenarioId, "scenario.query");
});

test("looks up timeline context", () => {
  assert.equal(findTimelineContext(fixtureContext()).value?.timelineId, "timeline.query");
});

test("looks up simulation context", () => {
  assert.equal(findSimulationContext(fixtureContext()).value?.metadataOnly, true);
});

test("looks up intent context", () => {
  assert.equal(findIntentContext(fixtureContext()).value?.intentId, "intent.query");
});

test("looks up goal context", () => {
  assert.equal(findGoalContext(fixtureContext()).value?.goalId, "goal.query");
});

test("looks up constraint context", () => {
  assert.deepEqual(findConstraintContext(fixtureContext()).value?.constraintIds, ["constraint.query"]);
});

test("inspects executive context", () => {
  const inspection = inspectExecutiveContext(fixtureContext());

  assert.equal(inspection.valid, true);
  assert.equal(inspection.sections.includes("goal"), true);
});

test("generates executive context summary", () => {
  assert.equal(buildExecutiveContextSummary(fixtureContext()).includes("context.query.fixture"), true);
});

test("builds executive context snapshot", () => {
  const snapshot = buildExecutiveContextSnapshot(fixtureContext());

  assert.equal(snapshot.entryCount, 13);
  assert.equal(snapshot.metadataOnly, true);
});

test("validates executive context snapshot", () => {
  assert.equal(validateExecutiveContextSnapshot(buildExecutiveContextSnapshot(fixtureContext())).valid, true);
});

test("compares executive context snapshots", () => {
  const left = buildExecutiveContextSnapshot(fixtureContext());
  const right = buildExecutiveContextSnapshot(fixtureContext());

  assert.equal(compareExecutiveContextSnapshots(left, right), true);
});

test("diffs executive context snapshots", () => {
  const left = buildExecutiveContextSnapshot(fixtureContext());
  const right = buildExecutiveContextSnapshot(
    ExecutiveContextBuilder.updateExecutiveContext(fixtureContext(), { goal: { goalId: "goal.changed", goalLabel: "Changed", description: "Changed metadata." } })
  );
  const diff = diffExecutiveContextSnapshots(left, right);

  assert.equal(diff.equal, false);
  assert.equal(diff.entries.some((entry) => entry.section === "goal" && entry.type === "modified"), true);
});

test("keeps manifest deterministic", () => {
  const first = buildExecutiveContextManifest();
  const second = buildExecutiveContextManifest();

  assert.equal(first.fingerprint, second.fingerprint);
  assert.equal(validateExecutiveContextManifest(first).valid, true);
});

test("exports public query APIs", () => {
  assert.equal(typeof ExecutiveContextQueryLayer.queryExecutiveContext, "function");
  assert.equal(typeof ExecutiveContextQueryLayer.buildExecutiveContextSnapshot, "function");
  assert.equal(Object.isFrozen(ExecutiveContextQueryLayer), true);
});

test("keeps APP-CTX-1 compatibility", () => {
  assert.equal(ExecutiveContextBuilder.isExecutiveContextValid(fixtureContext()), true);
});

test("keeps APP-DOM compatibility", () => {
  assert.equal(buildExecutiveContextManifest().consumedAppDomainPlatform, "APP-DOM-4");
});

test("query layer consumes APP-CTX facade only", () => {
  const query = readFileSync("app/lib/app-context/executiveContextQuery.ts", "utf8");
  const inspection = readFileSync("app/lib/app-context/executiveContextInspection.ts", "utf8");

  assert.equal(query.includes("./executiveContextIndex.ts"), true);
  assert.equal(inspection.includes("./executiveContextIndex.ts"), true);
  assert.equal(query.includes("../dom/"), false);
  assert.equal(inspection.includes("../app-dom/"), false);
});

test("does not expose runtime intelligence behavior", () => {
  const source = [
    readFileSync("app/lib/app-context/executiveContextQuery.ts", "utf8"),
    readFileSync("app/lib/app-context/executiveContextInspection.ts", "utf8"),
    readFileSync("app/lib/app-context/executiveContextSnapshot.ts", "utf8"),
  ].join(" ");

  assert.equal(source.includes("execute"), false);
  assert.equal(source.includes("infer"), false);
  assert.equal(source.includes("score"), false);
  assert.equal(source.includes("rank"), false);
});
