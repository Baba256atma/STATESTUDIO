import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveActionExecutionFoundation } from "./executiveActionExecutionFoundation.ts";

const files = [
  "executiveActionExecutionCapabilities.ts",
  "executiveActionExecutionContracts.ts",
  "executiveActionExecutionFoundation.test.ts",
  "executiveActionExecutionFoundation.ts",
  "executiveActionExecutionLifecycle.ts",
  "executiveActionExecutionMetadata.ts",
  "executiveActionExecutionPolicies.ts",
  "executiveActionExecutionTypes.ts",
];

test("ASSISTANT-8:1 consists of exactly eight Foundation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-8:1 publishes canonical Foundation identity", () => {
  const foundation = ExecutiveActionExecutionFoundation;
  assert.equal(
    foundation.identity.id,
    "ASSISTANT-8:1/ExecutiveActionExecutionFoundation",
  );
  assert.equal(foundation.identity.version, "1.0.0");
  assert.equal(foundation.identity.status, "Foundation");
  assert.equal(foundation.identity.stage, "ReadyForRegistry");
  assert.equal(foundation.identity.layer, "Assistant");
  assert.equal(foundation.identity.domain, "Executive Action Execution");
  assert.equal(foundation.identity.canonical, true);
  assert.equal(foundation.identity.mutable, false);
  assert.equal(foundation.status, "Foundation");
  assert.equal(foundation.stage, "ReadyForRegistry");
  assert.equal(foundation.readiness, "ReadyForRegistry");
  assert.equal(
    foundation.identity.sourceExecutiveActionPlanning,
    "ASSISTANT-7:9/ExecutiveActionPlanningPublicIndex",
  );
});

test("ASSISTANT-8:1 publishes contracts, capabilities, lifecycle, and policies", () => {
  const foundation = ExecutiveActionExecutionFoundation;
  assert.equal(foundation.contracts.length, 12);
  assert.equal(foundation.capabilities.length, 10);
  assert.equal(foundation.lifecycle.length, 9);
  assert.equal(foundation.executionStates.length, 9);
  assert.equal(foundation.progressTypes.length, 6);
  assert.equal(foundation.exceptionTypes.length, 8);
  assert.equal(foundation.feedbackTypes.length, 6);
  assert.equal(foundation.policies.length, 8);
  assert.equal(foundation.responsibilities.length, 8);
  assert.deepEqual(
    foundation.contracts.map(({ name }) => name),
    [
      "ExecutiveAction",
      "ExecutionPlan",
      "ExecutionStep",
      "ExecutionProgress",
      "ExecutionState",
      "ExecutionResult",
      "ExecutionFeedback",
      "ExecutionException",
      "ExecutionCheckpoint",
      "ExecutionSnapshot",
      "ExecutionHealth",
      "ExecutionSummary",
    ],
  );
  assert.deepEqual(
    foundation.lifecycle.map(({ name }) => name),
    [
      "Declared",
      "Prepared",
      "Queued",
      "Running",
      "Monitoring",
      "Paused",
      "Completed",
      "Cancelled",
      "Archived",
    ],
  );
  assert.equal(
    foundation.contracts.every(({ executable }) => !executable),
    true,
  );
  assert.equal(
    foundation.capabilities.every(({ implemented }) => !implemented),
    true,
  );
  assert.equal(
    foundation.lifecycle.every(({ transitionsAtRuntime }) =>
      !transitionsAtRuntime),
    true,
  );
});

test("ASSISTANT-8:1 metadata is immutable, unique, and dynamically counted", () => {
  const foundation = ExecutiveActionExecutionFoundation;
  const records = [
    ...foundation.contracts,
    ...foundation.capabilities,
    ...foundation.lifecycle,
    ...foundation.executionStates,
    ...foundation.progressTypes,
    ...foundation.exceptionTypes,
    ...foundation.feedbackTypes,
    ...foundation.policies,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(foundation.metadata), true);
  assert.equal(
    foundation.constants.contractCount,
    foundation.contracts.length,
  );
  assert.equal(
    foundation.constants.capabilityCount,
    foundation.capabilities.length,
  );
  assert.equal(
    foundation.constants.policyCount,
    foundation.policies.length,
  );
  assert.equal(
    foundation.inventory.contractCount,
    foundation.contracts.length,
  );
  assert.deepEqual(
    foundation.contracts.map(({ order }) => order),
    foundation.contracts.map((_, index) => index + 1),
  );
});

test("ASSISTANT-8:1 consumes ASSISTANT-7 Public Index only and forbids runtime", () => {
  const foundation = ExecutiveActionExecutionFoundation;
  const source = readFileSync(
    new URL("./executiveActionExecutionFoundation.ts", import.meta.url),
    "utf8",
  );
  const importSources = [
    ...source.matchAll(/from ["'](\.\/[^"']+)["']/g),
  ].map((match) => match[1]);
  assert.deepEqual(importSources, [
    "./assistantExecutiveActionPlanningPublicIndex.ts",
    "./executiveActionExecutionCapabilities.ts",
    "./executiveActionExecutionContracts.ts",
    "./executiveActionExecutionLifecycle.ts",
    "./executiveActionExecutionMetadata.ts",
    "./executiveActionExecutionPolicies.ts",
  ]);
  assert.equal(
    source.includes("assistantExecutiveActionPlanningFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningModel"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningFreeze"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagement"),
    false,
  );
  assert.deepEqual(foundation.upstreamDependencies, [
    "ASSISTANT-7:9 Executive Action Planning Public Index",
  ]);
  assert.equal(
    foundation.executiveActionPlanningPublicIndex.id,
    "ASSISTANT-7:9/ExecutiveActionPlanningPublicIndex",
  );
  assert.deepEqual(foundation.publicApiSurface, [
    "ExecutiveActionExecutionFoundation",
  ]);
  assert.equal(foundation.runtime, false);
  assert.equal(foundation.executionEngine, false);
  assert.equal(foundation.scheduler, false);
  assert.equal(foundation.workflowEngine, false);
  assert.equal(foundation.services, false);
  assert.equal(foundation.persistence, false);
  assert.equal(foundation.monitoringRuntime, false);
  assert.equal(foundation.orchestrationLogic, false);
  assert.equal(foundation.aiReasoning, false);
  assert.equal(foundation.ui, false);
});
