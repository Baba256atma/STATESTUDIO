import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { AppDomainPlatformFreeze } from "../app-dom/appDomainPlatformFreezeIndex.ts";
import {
  ExecutiveContextBuilder,
  buildExecutiveContextManifest,
  cloneExecutiveContext,
  createExecutiveContext,
  freezeExecutiveContext,
  getExecutiveContextIdentity,
  isExecutiveContextValid,
  updateExecutiveContext,
  validateExecutiveContext,
  validateExecutiveContextManifest,
} from "./executiveContextIndex.ts";

test("creates executive context", () => {
  const context = createExecutiveContext();

  assert.equal(context.identity.contextVersion, "APP-CTX-1");
  assert.equal(context.validation.valid, true);
  assert.equal(context.metadataOnly, true);
});

test("builds workspace context", () => {
  const context = createExecutiveContext({ workspace: { workspaceId: "workspace.alpha", workspaceName: "Alpha" } });

  assert.equal(context.workspace.workspaceId, "workspace.alpha");
});

test("builds domain context", () => {
  const context = createExecutiveContext({ domain: { selectedDomainIds: ["DOM-1", "DOM-7"], appDomainPlatformVersion: "APP-DOM-4" } });

  assert.deepEqual(context.domain.selectedDomainIds, ["DOM-1", "DOM-7"]);
});

test("builds object context", () => {
  const context = createExecutiveContext({ objects: { objectIds: ["object.1", "object.2"] } });

  assert.deepEqual(context.objects.objectIds, ["object.1", "object.2"]);
});

test("builds KPI context", () => {
  const context = createExecutiveContext({ kpis: { kpiIds: ["kpi.revenue"] } });

  assert.deepEqual(context.kpis.kpiIds, ["kpi.revenue"]);
});

test("builds risk context", () => {
  const context = createExecutiveContext({ risks: { riskIds: ["risk.delivery"] } });

  assert.deepEqual(context.risks.riskIds, ["risk.delivery"]);
});

test("builds scenario context", () => {
  const context = createExecutiveContext({ scenario: { scenarioId: "scenario.base", scenarioLabel: "Base" } });

  assert.equal(context.scenario.scenarioId, "scenario.base");
});

test("builds timeline context", () => {
  const context = createExecutiveContext({ timeline: { timelineId: "timeline.q1", periodLabel: "Q1" } });

  assert.equal(context.timeline.periodLabel, "Q1");
});

test("builds simulation context", () => {
  const context = createExecutiveContext({ simulation: { simulationId: "simulation.placeholder", simulationLabel: "Placeholder", metadataOnly: true } });

  assert.equal(context.simulation.metadataOnly, true);
});

test("builds intent context", () => {
  const context = createExecutiveContext({ intent: { intentId: "intent.align", intentLabel: "Align", description: "Align metadata." } });

  assert.equal(context.intent.intentId, "intent.align");
});

test("builds goal context", () => {
  const context = createExecutiveContext({ goal: { goalId: "goal.growth", goalLabel: "Growth", description: "Growth metadata." } });

  assert.equal(context.goal.goalLabel, "Growth");
});

test("builds constraint context", () => {
  const context = createExecutiveContext({ constraints: { constraintIds: ["constraint.budget"], notes: ["Budget metadata."] } });

  assert.deepEqual(context.constraints.constraintIds, ["constraint.budget"]);
});

test("clones executive context", () => {
  const context = createExecutiveContext({ contextId: "context.clone" });
  const clone = cloneExecutiveContext(context);

  assert.notEqual(clone, context);
  assert.equal(clone.identity.contextId, context.identity.contextId);
});

test("freezes executive context", () => {
  const context = freezeExecutiveContext(createExecutiveContext());

  assert.equal(Object.isFrozen(context), true);
  assert.equal(Object.isFrozen(context.metadata), true);
});

test("validates executive context", () => {
  const context = createExecutiveContext();

  assert.equal(validateExecutiveContext(context).valid, true);
  assert.equal(isExecutiveContextValid(context), true);
});

test("gets executive context identity", () => {
  const context = createExecutiveContext({ contextId: "context.identity" });

  assert.equal(getExecutiveContextIdentity(context).contextId, "context.identity");
});

test("updates executive context", () => {
  const context = updateExecutiveContext(createExecutiveContext(), { goal: { goalId: "goal.updated", goalLabel: "Updated", description: "Updated metadata." } });

  assert.equal(context.goal.goalId, "goal.updated");
});

test("builds executive context manifest", () => {
  const manifest = buildExecutiveContextManifest();

  assert.equal(manifest.contextVersion, "APP-CTX-1");
  assert.equal(manifest.consumedAppDomainPlatform, "APP-DOM-4");
  assert.equal(manifest.contextSections.includes("constraints"), true);
});

test("validates executive context manifest", () => {
  assert.equal(validateExecutiveContextManifest(buildExecutiveContextManifest()).valid, true);
});

test("uses deterministic manifest fingerprint", () => {
  const first = buildExecutiveContextManifest();
  const second = buildExecutiveContextManifest();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("exports public builder APIs", () => {
  assert.equal(typeof ExecutiveContextBuilder.createExecutiveContext, "function");
  assert.equal(typeof ExecutiveContextBuilder.buildExecutiveContextManifest, "function");
  assert.equal(Object.isFrozen(ExecutiveContextBuilder), true);
});

test("keeps APP-DOM compatibility", () => {
  assert.equal(AppDomainPlatformFreeze.runAppDomainPlatformFreeze().status, "PASS");
});

test("builder consumes only APP-DOM platform freeze", () => {
  const builder = readFileSync("app/lib/app-context/executiveContextBuilder.ts", "utf8");
  const manifest = readFileSync("app/lib/app-context/executiveContextManifest.ts", "utf8");

  assert.equal(builder.includes("../app-dom/appDomainPlatformFreezeIndex.ts"), true);
  assert.equal(manifest.includes("../app-dom/appDomainPlatformFreezeIndex.ts"), true);
  assert.equal(builder.includes("../dom/"), false);
  assert.equal(manifest.includes("../dom/"), false);
});

test("does not expose runtime intelligence behavior", () => {
  const source = [
    readFileSync("app/lib/app-context/executiveContextBuilder.ts", "utf8"),
    readFileSync("app/lib/app-context/executiveContextManifest.ts", "utf8"),
  ].join(" ");

  assert.equal(source.includes("execute"), false);
  assert.equal(source.includes("infer"), false);
  assert.equal(source.includes("score"), false);
  assert.equal(source.includes("rank"), false);
  assert.equal(source.includes("analysis"), false);
});
