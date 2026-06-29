import assert from "node:assert/strict";
import test from "node:test";

import { EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES } from "./executiveIntentAssistantIntegration.ts";
import { EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES } from "./executiveIntentDashboardIntegration.ts";
import {
  EXECUTIVE_INTENT_CERTIFICATION_GATE_DEFINITIONS,
  EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES,
  EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS,
  EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION,
  EXECUTIVE_INTENT_PLATFORM_IDENTITY,
  EXECUTIVE_INTENT_PLATFORM_PHASE_VERSIONS,
  EXECUTIVE_INTENT_PLATFORM_PUBLIC_APIS,
} from "./executiveIntentPlatformCertificationContract.ts";
import {
  ExecutiveIntentPlatformCertification,
  buildExecutiveIntentCertificationSummary,
  runExecutiveIntentEndToEndCertification,
  runExecutiveIntentPlatformCertification,
  runExecutiveIntentRegression,
  validateExecutiveIntentPlatform,
} from "./executiveIntentPlatformCertification.ts";
import { EXECUTIVE_INTENT_REASONING_ENGINE_RULES } from "./executiveIntentReasoningEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test("platform identity declares executive intent platform", () => {
  assert.equal(EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformId, "executive-intent-platform");
  assert.equal(EXECUTIVE_INTENT_PLATFORM_IDENTITY.platformVersion, "APP-3/14");
  assert.equal(EXECUTIVE_INTENT_PLATFORM_IDENTITY.readOnly, true);
});

test("certification contract exposes required tags", () => {
  assert.ok(EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS.includes("[APP3_14]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS.includes("[EXECUTIVE_INTENT_PLATFORM_CERTIFIED]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS.includes("[PIPELINE_CERTIFIED]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS.includes("[END_TO_END_CERTIFIED]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS.includes("[CONSUMER_CERTIFIED]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS.includes("[ARCHITECTURE_CERTIFIED]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS.includes("[BACKWARD_COMPATIBLE]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_TAGS.includes("[PLATFORM_READY]"));
});

test("certification contract defines gates A through Z", () => {
  assert.equal(EXECUTIVE_INTENT_CERTIFICATION_GATE_DEFINITIONS.length, 26);
  assert.equal(EXECUTIVE_INTENT_CERTIFICATION_GATE_DEFINITIONS[0]?.gateKey, "A");
  assert.equal(EXECUTIVE_INTENT_CERTIFICATION_GATE_DEFINITIONS[25]?.gateKey, "Z");
});

test("public APIs are declared in certification contract", () => {
  assert.ok(EXECUTIVE_INTENT_PLATFORM_PUBLIC_APIS.includes("runExecutiveIntentPlatformCertification"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_PUBLIC_APIS.includes("runExecutiveIntentRegression"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_PUBLIC_APIS.includes("runExecutiveIntentEndToEndCertification"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_PUBLIC_APIS.includes("buildExecutiveIntentCertificationSummary"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_PUBLIC_APIS.includes("validateExecutiveIntentPlatform"));
});

test("platform facade exposes all public certification APIs", () => {
  assert.equal(typeof ExecutiveIntentPlatformCertification.runExecutiveIntentPlatformCertification, "function");
  assert.equal(typeof ExecutiveIntentPlatformCertification.runExecutiveIntentRegression, "function");
  assert.equal(typeof ExecutiveIntentPlatformCertification.runExecutiveIntentEndToEndCertification, "function");
  assert.equal(typeof ExecutiveIntentPlatformCertification.buildExecutiveIntentCertificationSummary, "function");
  assert.equal(typeof ExecutiveIntentPlatformCertification.validateExecutiveIntentPlatform, "function");
  assert.equal(ExecutiveIntentPlatformCertification.version, EXECUTIVE_INTENT_PLATFORM_CERTIFICATION_VERSION);
});

test("runExecutiveIntentRegression covers APP-3 phases with APP-3/3 deferred", () => {
  const regression = runExecutiveIntentRegression(FIXED_TIME);

  assert.equal(regression.passed, true);
  assert.equal(regression.failedCount, 0);
  assert.equal(regression.phases.length, 13);

  const phaseIds = regression.phases.map((entry) => entry.phaseId);
  assert.ok(phaseIds.includes("APP-3/1"));
  assert.ok(phaseIds.includes("APP-3/2"));
  assert.ok(phaseIds.includes("APP-3/4"));
  assert.ok(phaseIds.includes("APP-3/13"));

  const deferred = regression.phases.find((entry) => entry.phaseId === "APP-3/3");
  assert.equal(deferred?.skipped, true);
  assert.equal(deferred?.passed, true);
});

test("runExecutiveIntentEndToEndCertification passes full pipeline", () => {
  const endToEnd = runExecutiveIntentEndToEndCertification({
    timestamp: FIXED_TIME,
  });

  assert.equal(endToEnd.passed, true);
  assert.equal(endToEnd.deterministic, true);
  assert.equal(endToEnd.stagesFailed.length, 0);
  assert.ok(endToEnd.stagesPassed.includes("extraction"));
  assert.ok(endToEnd.stagesPassed.includes("semantic"));
  assert.ok(endToEnd.stagesPassed.includes("classification"));
  assert.ok(endToEnd.stagesPassed.includes("conflict"));
  assert.ok(endToEnd.stagesPassed.includes("dependency"));
  assert.ok(endToEnd.stagesPassed.includes("evolution"));
  assert.ok(endToEnd.stagesPassed.includes("confidence"));
  assert.ok(endToEnd.stagesPassed.includes("reasoning"));
  assert.ok(endToEnd.stagesPassed.includes("assistant"));
  assert.ok(endToEnd.stagesPassed.includes("dashboard"));
});

test("end-to-end certification is deterministic for fixed timestamp", () => {
  const first = runExecutiveIntentEndToEndCertification({ timestamp: FIXED_TIME });
  const second = runExecutiveIntentEndToEndCertification({ timestamp: FIXED_TIME });

  assert.equal(first.passed, second.passed);
  assert.equal(first.deterministic, true);
  assert.equal(second.deterministic, true);
  assert.deepEqual(first.stagesPassed, second.stagesPassed);
});

test("runExecutiveIntentPlatformCertification passes all gates A-Z", () => {
  const result = runExecutiveIntentPlatformCertification(FIXED_TIME);

  assert.equal(result.passed, true);
  assert.equal(result.readOnly, true);
  assert.equal(result.gates.length, 26);
  assert.equal(result.endToEndPassed, true);
  assert.equal(result.regressionPassed, true);
  assert.equal(result.consumerCertificationPassed, true);
  assert.equal(result.summary.platformReady, true);
  assert.equal(result.summary.failedGates, 0);

  for (const gate of result.gates) {
    assert.equal(gate.passed, true, `Gate ${gate.gateKey} (${gate.label}) failed: ${gate.message}`);
  }
});

test("validateExecutiveIntentPlatform accepts certified result", () => {
  const result = runExecutiveIntentPlatformCertification(FIXED_TIME);
  const validation = validateExecutiveIntentPlatform(result);

  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
  assert.equal(validation.readOnly, true);
});

test("buildExecutiveIntentCertificationSummary reflects gate outcomes", () => {
  const result = runExecutiveIntentPlatformCertification(FIXED_TIME);
  const summary = buildExecutiveIntentCertificationSummary({
    gates: result.gates,
    timestamp: FIXED_TIME,
  });

  assert.equal(summary.passed, true);
  assert.equal(summary.totalGates, 26);
  assert.equal(summary.passedGates, 26);
  assert.equal(summary.platformReady, true);
  assert.equal(summary.readOnly, true);
});

test("architecture rules enforce read-only certification-only scope", () => {
  assert.equal(EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.readOnly, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.noStorage, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.noReact, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.noRecommendations, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.noScenarioExecution, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_ARCHITECTURE_RULES.backwardCompatible, true);
});

test("assistant and dashboard integration rules require reasoning consumer only", () => {
  assert.equal(EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES.reasoningConsumerOnly, true);
  assert.equal(EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES.reasoningConsumerOnly, true);
  assert.equal(EXECUTIVE_INTENT_REASONING_ENGINE_RULES.readOnly, true);
});

test("phase version map includes APP-3/1 through APP-3/14 with APP-3/3 deferred", () => {
  assert.equal(EXECUTIVE_INTENT_PLATFORM_PHASE_VERSIONS["APP-3/1"], "APP-3/1");
  assert.equal(EXECUTIVE_INTENT_PLATFORM_PHASE_VERSIONS["APP-3/3"], null);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_PHASE_VERSIONS["APP-3/14"], "APP-3/14");
});

test("platform certification result is frozen", () => {
  const result = runExecutiveIntentPlatformCertification(FIXED_TIME);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
  assert.equal(Object.isFrozen(result.summary), true);
  assert.equal(Object.isFrozen(result.metadata), true);
});
