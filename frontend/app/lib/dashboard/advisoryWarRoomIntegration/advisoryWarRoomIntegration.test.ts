import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_WAR_ROOM_INTEGRATION_VERSION,
  CANONICAL_ADVISORY_WAR_ROOM_INTEGRATION_OWNER,
} from "./advisoryWarRoomIntegrationContract.ts";
import { ADVISORY_WAR_ROOM_INTEGRATION_REGISTRY, listIntegrationParticipants } from "./advisoryWarRoomIntegrationRegistry.ts";
import { buildAdvisoryWarRoomIntegrationBundle } from "./advisoryWarRoomIntegrationPropagation.ts";
import {
  getAdvisoryWarRoomIntegrationForDecisionGuidance,
  getAdvisoryWarRoomIntegrationForExecutiveSummary,
  getAdvisoryWarRoomIntegrationForWarRoom,
  initializeAdvisoryWarRoomIntegrationRuntime,
  resetAdvisoryWarRoomIntegrationRuntimeForTests,
} from "./advisoryWarRoomIntegrationRuntime.ts";
import { resetAdvisoryWarRoomIntegrationLoggingForTests } from "./advisoryWarRoomIntegrationLogging.ts";
import {
  resetAdvisoryWarRoomIntegrationProtectionForTests,
  runAdvisoryWarRoomIntegrationProtection,
  validateIntegrationRegistry,
} from "./advisoryWarRoomIntegrationProtection.ts";
import { aggregateExecutiveSummary } from "../executiveSummary/executiveSummaryAggregation.ts";
import { aggregateDecisionGuidance } from "../decisionGuidance/decisionGuidanceAggregation.ts";
import { resetDecisionGuidanceRuntimeForTests } from "../decisionGuidance/decisionGuidanceRuntime.ts";
import { resetAdvisoryExplainabilityRuntimeForTests } from "../executiveAdvisory/explainability/advisoryExplainabilityRuntime.ts";
import { resetAdvisoryConfidenceRuntimeForTests } from "../executiveAdvisory/confidence/advisoryConfidenceRuntime.ts";
import { resetAdvisoryAggregationRuntimeForTests } from "../executiveAdvisory/aggregation/advisoryAggregationRuntime.ts";
import { resetExecutiveAdvisoryRuntimeForTests } from "../executiveAdvisory/executiveAdvisoryRuntime.ts";
import { resetWarRoomIntelligenceRuntimeForTests } from "../warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import { resetScenarioIntelligenceRuntimeForTests } from "../scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { resetTimelineIntelligenceRuntimeForTests } from "../timelineIntelligence/timelineIntelligenceRuntime.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../riskIntelligence/riskIntelligenceRuntime.ts";
import { resetOperationalIntelligenceRuntimeForTests } from "../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { resetExecutiveSummaryRuntimeForTests } from "../executiveSummary/executiveSummaryRuntime.ts";
import { runArchitectureFreezeValidationPass, resetArchitectureFreezeRuntimeForTests } from "../../architecture/nexoraArchitectureFreezeRuntime.ts";

const feedInput = {
  dashboardContext: "war_room" as const,
  normalizedContext: null,
  timelineActive: true,
};

test.beforeEach(() => {
  resetAdvisoryWarRoomIntegrationRuntimeForTests();
  resetAdvisoryWarRoomIntegrationLoggingForTests();
  resetAdvisoryWarRoomIntegrationProtectionForTests();
  resetDecisionGuidanceRuntimeForTests();
  resetAdvisoryExplainabilityRuntimeForTests();
  resetAdvisoryConfidenceRuntimeForTests();
  resetAdvisoryAggregationRuntimeForTests();
  resetExecutiveAdvisoryRuntimeForTests();
  resetWarRoomIntelligenceRuntimeForTests();
  resetScenarioIntelligenceRuntimeForTests();
  resetTimelineIntelligenceRuntimeForTests();
  resetRiskIntelligenceRuntimeForTests();
  resetOperationalIntelligenceRuntimeForTests();
  resetExecutiveSummaryRuntimeForTests();
  resetArchitectureFreezeRuntimeForTests();
});

test("integration contract is canonical", () => {
  assert.equal(CANONICAL_ADVISORY_WAR_ROOM_INTEGRATION_OWNER, "advisoryWarRoomIntegrationRuntime");
  assert.equal(ADVISORY_WAR_ROOM_INTEGRATION_VERSION, "5.6.0");
});

test("integration registry lists three participants", () => {
  const participants = listIntegrationParticipants();
  assert.equal(ADVISORY_WAR_ROOM_INTEGRATION_REGISTRY.length, 3);
  assert.ok(participants.includes("war_room"));
  assert.ok(participants.includes("executive_advisory"));
  assert.ok(participants.includes("decision_guidance"));
});

test("integration bundle produces six domains and trace", () => {
  const bundle = buildAdvisoryWarRoomIntegrationBundle(feedInput);
  assert.ok(bundle.intake.situationOverview.length > 0);
  assert.ok(bundle.transformation.advisoryContext.metadata.reasoningTrace);
  assert.ok(bundle.confidencePropagation.drivers.length >= 0);
  assert.ok(bundle.explainabilityPropagation.reasoningPath.includes("↓"));
  assert.ok(bundle.tradeoffPropagation.tradeoffs.length >= 1);
  assert.ok(bundle.guidanceDelivery.snapshot.decisionFocus.focus);
  assert.equal(bundle.trace.pathLabel, "War Room ↓ Advisory ↓ Decision Guidance");
  assert.equal(bundle.trace.steps.length, 6);
});

test("decision guidance consumes integration propagation", () => {
  const model = aggregateDecisionGuidance(feedInput);
  const integration = getAdvisoryWarRoomIntegrationForDecisionGuidance(feedInput);
  assert.equal(model.snapshot.decisionFocus.focus, integration.guidanceDelivery.snapshot.decisionFocus.focus);
});

test("executive summary consumes integration feed", () => {
  const summary = aggregateExecutiveSummary({
    dashboardContext: "war_room",
    normalizedContext: null,
    timelineActive: true,
  });
  assert.ok(summary.aggregationSources.includes("advisory_war_room_integration"));
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  assert.ok(attentionCard?.secondaryValue.includes("Consensus:"));
  assert.ok(attentionCard?.secondaryValue.includes("Institutional:"));
});

test("war room consumes integration feed", () => {
  const bundle = getAdvisoryWarRoomIntegrationForWarRoom(feedInput);
  assert.equal(bundle.intake.readiness, "ready");
  assert.ok(bundle.tradeoffPropagation.summary.length > 0);
});

test("integration logging tags emit", () => {
  const logs: string[] = [];
  const originalInfo = globalThis.console.info;
  globalThis.console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string") logs.push(args[0]);
  };
  try {
    initializeAdvisoryWarRoomIntegrationRuntime(feedInput);
    assert.ok(logs.includes("[Nexora][AdvisoryWarRoomIntegration]"));
    assert.ok(logs.includes("[Nexora][WarRoomIntake]"));
    assert.ok(logs.includes("[Nexora][AdvisoryTransformation]"));
    assert.ok(logs.includes("[Nexora][ConfidencePropagation]"));
    assert.ok(logs.includes("[Nexora][ExplainabilityPropagation]"));
    assert.ok(logs.includes("[Nexora][TradeoffPropagation]"));
    assert.ok(logs.includes("[Nexora][GuidanceDelivery]"));
  } finally {
    globalThis.console.info = originalInfo;
  }
});

test("architecture protection validates registry", () => {
  const warnings = validateIntegrationRegistry();
  assert.equal(warnings.length, 0);
  const protection = runAdvisoryWarRoomIntegrationProtection();
  assert.equal(protection.length, 0);
});

test("approved getters share cached bundle", () => {
  const warRoom = getAdvisoryWarRoomIntegrationForWarRoom(feedInput);
  const summary = getAdvisoryWarRoomIntegrationForExecutiveSummary(feedInput);
  assert.equal(warRoom.trace.pathLabel, summary.trace.pathLabel);
});

test("architecture freeze includes advisory war room integration", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  const check = validation.checks.find((item) => item.id === "dashboard.advisory_war_room_integration");
  assert.ok(check?.passed);
  assert.ok(validation.contractCount >= 28);
});
