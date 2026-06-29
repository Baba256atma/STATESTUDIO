import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildAssistantProbe,
} from "./executiveIntentAssistantIntegration.ts";
import {
  DASHBOARD_INTENT_DIAGNOSTIC_CODES,
  isDashboardIntentDiagnosticCode,
} from "./executiveIntentDashboardDiagnostics.ts";
import {
  EXECUTIVE_INTENT_DASHBOARD_LAYOUT,
} from "./executiveIntentDashboardLayouts.ts";
import {
  ExecutiveIntentDashboardIntegration,
  buildDashboardBadges,
  buildDashboardCards,
  buildDashboardExample,
  buildDashboardIntentModel,
  buildDashboardMetrics,
  buildDashboardProbe,
  buildDashboardSections,
  buildDashboardStatus,
  buildDashboardSummary,
  buildDashboardWidgets,
  validateDashboardModel,
} from "./executiveIntentDashboardIntegration.ts";
import {
  EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES,
  EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_TAGS,
} from "./executiveIntentDashboardIntegration.ts";
import {
  EXECUTIVE_INTENT_DASHBOARD_CANONICAL_EXAMPLES,
  getExecutiveIntentDashboardCanonicalExample,
} from "./executiveIntentDashboardExamples.ts";
import { buildReasoningExample, buildReasoningProbe } from "./executiveIntentReasoningEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WS = "ws-example-001";

test("builds dashboard summary from reasoning", () => {
  const reasoning = buildReasoningProbe(FIXED_TIME);
  const metrics = buildDashboardMetrics(reasoning);
  const cards = buildDashboardCards(reasoning);
  const badges = buildDashboardBadges(reasoning);
  const summary = buildDashboardSummary(reasoning, metrics, cards, badges);
  assert.ok(summary.headline.includes(reasoning.summary.intentLabel));
  assert.equal(summary.metricCount, metrics.length);
});

test("builds dashboard cards for ready objective", () => {
  const model = buildDashboardExample("ready-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.equal(model!.status, "ready");
  assert.ok(model!.cards.some((card) => card.cardKey === "executive_summary"));
  assert.ok(model!.cards.some((card) => card.cardKey === "intent"));
  assert.equal(validateDashboardModel(model!).valid, true);
});

test("builds dashboard metrics from reasoning", () => {
  const reasoning = buildReasoningProbe(FIXED_TIME);
  const metrics = buildDashboardMetrics(reasoning);
  assert.equal(metrics.length, 9);
  assert.ok(metrics.some((metric) => metric.metricKey === "confidence_score"));
  assert.ok(metrics.some((metric) => metric.metricKey === "unknown_count"));
  assert.ok(metrics.some((metric) => metric.metricKey === "issue_count"));
});

test("builds dashboard badges from reasoning flags", () => {
  const model = buildDashboardExample("conflict-heavy-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.ok(model!.badges.some((badge) => badge.badgeKey === "conflict_detected" && badge.active));
  assert.ok(model!.badges.some((badge) => badge.badgeKey === "future_compatible" && badge.active));
});

test("builds all dashboard sections", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.equal(model.sections.length, 14);
  const keys = model.sections.map((section) => section.sectionKey);
  assert.ok(keys.includes("executive_summary"));
  assert.ok(keys.includes("intent_overview"));
  assert.ok(keys.includes("current_state"));
  assert.ok(keys.includes("classification"));
  assert.ok(keys.includes("confidence"));
  assert.ok(keys.includes("readiness"));
  assert.ok(keys.includes("diagnostics"));
});

test("builds dashboard widgets metadata", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.equal(model.widgets.length, 8);
  assert.ok(model.widgets.some((widget) => widget.widgetKey === "summary"));
  assert.ok(model.widgets.some((widget) => widget.widgetKey === "confidence"));
});

test("displays readiness on blocked objective", () => {
  const model = buildDashboardExample("blocked-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.equal(model!.status, "blocked");
  assert.ok(model!.badges.some((badge) => badge.badgeKey === "blocked" && badge.active));
});

test("displays confidence panel content", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.ok(model.sections.some((section) => section.sectionKey === "confidence" && section.available));
  assert.ok(model.cards.some((card) => card.cardKey === "confidence"));
});

test("displays conflict panel for conflict-heavy objective", () => {
  const model = buildDashboardExample("conflict-heavy-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.equal(model!.flags.hasConflicts, true);
  assert.ok(model!.widgets.some((widget) => widget.widgetKey === "conflict" && widget.available));
});

test("displays dependency panel for dependency-heavy objective", () => {
  const model = buildDashboardExample("dependency-heavy-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.equal(model!.flags.hasDependencies, true);
  assert.ok(model!.cards.some((card) => card.cardKey === "dependency"));
});

test("displays evolution panel for evolution history", () => {
  const reasoning = buildReasoningExample("rapidly-evolving-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(reasoning);
  const model = buildDashboardIntentModel(reasoning!, FIXED_TIME);
  assert.equal(model.flags.hasEvolutionHistory, true);
  assert.ok(model.widgets.some((widget) => widget.widgetKey === "evolution"));
});

test("displays unknown information panel", () => {
  const model = buildDashboardExample("multiple-unknowns", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.ok(model!.widgets.some((widget) => widget.widgetKey === "unknowns"));
});

test("includes dashboard diagnostics", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.ok(model.diagnostics.some((entry) => entry.code === "dashboard_model_success"));
});

test("handles archived objective display", () => {
  const model = buildDashboardExample("archived-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.equal(model!.status, "archived");
  assert.ok(model!.diagnostics.some((entry) => entry.code === "archived_intent"));
});

test("produces deterministic output for identical reasoning", () => {
  const reasoning = buildReasoningProbe(FIXED_TIME);
  const first = buildDashboardIntentModel(reasoning, FIXED_TIME);
  const second = buildDashboardIntentModel(reasoning, FIXED_TIME);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

test("dashboard model is read-only and immutable", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.equal(model.readOnly, true);
  assert.equal(model.flags.readOnly, true);
  assert.equal(model.flags.deterministic, true);
  const before = JSON.stringify(model);
  buildDashboardIntentModel(buildReasoningProbe(FIXED_TIME), FIXED_TIME);
  assert.equal(JSON.stringify(model), before);
});

test("integration consumes reasoning only and not upstream engines directly", () => {
  const source = readFileSync(
    new URL("./executiveIntentDashboardIntegration.ts", import.meta.url),
    "utf8"
  );
  assert.equal(source.includes("extractExecutiveIntent"), false);
  assert.equal(source.includes("classifyExecutiveIntent"), false);
  assert.equal(source.includes("buildExecutiveIntentSemanticModel"), false);
  assert.equal(source.includes("resolveExecutiveIntentStateResult"), false);
  assert.equal(source.includes("detectIntentConflicts"), false);
  assert.equal(source.includes("detectIntentDependencies"), false);
  assert.equal(source.includes("buildIntentEvolution"), false);
  assert.equal(source.includes("calculateIntentConfidence"), false);
  assert.equal(source.includes("buildExecutiveIntentReasoning"), false);
  assert.ok(source.includes("buildReasoningExample"));
  assert.ok(source.includes("buildReasoningProbe"));
});

test("declares dashboard diagnostics and integration tags", () => {
  assert.equal(DASHBOARD_INTENT_DIAGNOSTIC_CODES.length, 12);
  assert.equal(isDashboardIntentDiagnosticCode("dashboard_ready"), true);
  assert.ok(EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_TAGS.includes("[APP3_13]"));
  assert.ok(EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_TAGS.includes("[REASONING_CONSUMER]"));
  assert.equal(EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES.noUiRendering, true);
});

test("regression: APP-3:12 assistant remains separate presentation consumer", () => {
  const dashboard = buildDashboardProbe(FIXED_TIME);
  const assistant = buildAssistantProbe(FIXED_TIME);
  assert.equal(dashboard.metadata.reasoningId, assistant.metadata.reasoningId);
  assert.equal(dashboard.metadata.reasoningEngineVersion, "APP-3/11");
  assert.equal(assistant.metadata.reasoningEngineVersion, "APP-3/11");
});

test("regression: APP-3:11 reasoning consumed exclusively", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.equal(model.metadata.reasoningEngineVersion, "APP-3/11");
  assert.ok(model.metadata.reasoningId);
});

test("regression: APP-3:10 represented via reasoning metadata", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.ok(model.metadata.enginesConsumed.includes("APP-3/10"));
});

test("regression: APP-3:9 represented via reasoning metadata", () => {
  const reasoning = buildReasoningExample("rapidly-evolving-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(reasoning);
  const model = buildDashboardIntentModel(reasoning!, FIXED_TIME);
  assert.ok(model.metadata.enginesConsumed.includes("APP-3/9"));
});

test("regression: APP-3:8 represented via reasoning metadata", () => {
  const model = buildDashboardExample("dependency-heavy-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.ok(model!.metadata.enginesConsumed.includes("APP-3/8"));
});

test("regression: APP-3:7 represented via reasoning metadata", () => {
  const model = buildDashboardExample("conflict-heavy-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.ok(model!.metadata.enginesConsumed.includes("APP-3/7"));
});

test("regression: APP-3:6 represented via reasoning metadata", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.ok(model.metadata.enginesConsumed.includes("APP-3/6"));
});

test("regression: APP-3:5 represented via reasoning metadata", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.ok(model.metadata.enginesConsumed.includes("APP-3/5"));
});

test("regression: APP-3:4 represented via reasoning metadata", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.ok(model.metadata.enginesConsumed.includes("APP-3/4"));
});

test("regression: APP-3:2 represented via reasoning metadata", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.ok(model.metadata.enginesConsumed.includes("APP-3/2"));
});

test("regression: APP-3:1 represented via reasoning metadata", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  assert.ok(model.metadata.enginesConsumed.includes("APP-3/1"));
});

test("covers dashboard canonical example catalog", () => {
  assert.ok(EXECUTIVE_INTENT_DASHBOARD_CANONICAL_EXAMPLES.length >= 10);
  assert.ok(getExecutiveIntentDashboardCanonicalExample("executive-overview"));
});

test("ExecutiveIntentDashboardIntegration exposes public APIs", () => {
  assert.equal(ExecutiveIntentDashboardIntegration.version, "APP-3/13");
  assert.equal(typeof ExecutiveIntentDashboardIntegration.buildDashboardIntentModel, "function");
  assert.equal(typeof ExecutiveIntentDashboardIntegration.buildDashboardProbe, "function");
});

test("validateDashboardModel rejects inconsistent summary", () => {
  const model = buildDashboardProbe(FIXED_TIME);
  const tampered = Object.freeze({
    ...model,
    status: "unknown" as typeof model.status,
  });
  assert.equal(validateDashboardModel(tampered).valid, false);
});

test("buildDashboardStatus maps reasoning readiness", () => {
  const reasoning = buildReasoningProbe(FIXED_TIME);
  assert.equal(buildDashboardStatus(reasoning), buildDashboardStatus(reasoning));
  assert.equal(buildDashboardStatus(null), "unknown");
});

test("layout metadata references canonical panels", () => {
  assert.equal(EXECUTIVE_INTENT_DASHBOARD_LAYOUT.panels.length, 8);
  const model = buildDashboardProbe(FIXED_TIME);
  assert.equal(model.metadata.layoutId, EXECUTIVE_INTENT_DASHBOARD_LAYOUT.layoutId);
});

test("low confidence example surfaces warning badges and diagnostics", () => {
  const model = buildDashboardExample("low-confidence", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.ok(model!.diagnostics.some((entry) => entry.code === "low_confidence") || model!.flags.lowConfidence);
});

test("incomplete objective example surfaces incomplete diagnostic", () => {
  const model = buildDashboardExample("incomplete-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.equal(model!.status, "incomplete");
  assert.ok(model!.diagnostics.some((entry) => entry.code === "incomplete_intent"));
});

test("executive overview example builds full dashboard model", () => {
  const model = buildDashboardExample("executive-overview", WS, "executive-owner", FIXED_TIME);
  assert.ok(model);
  assert.ok(model!.cards.some((card) => card.cardKey === "executive_summary"));
});
