import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as publicApi from "./executiveOrchestrationFoundation.ts";
import {
  ExecutiveOrchestrationCapabilityContract,
  ExecutiveOrchestrationDependencyContract,
  ExecutiveOrchestrationFoundation,
  ExecutiveOrchestrationLifecycleContract,
  ExecutiveOrchestrationResponsibilityContract,
  getExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";

const requiredFiles = Object.freeze([
  "executiveOrchestrationFoundationTypes.ts",
  "executiveOrchestrationResponsibilityContract.ts",
  "executiveOrchestrationDependencyContract.ts",
  "executiveOrchestrationLifecycleContract.ts",
  "executiveOrchestrationCapabilityContract.ts",
  "executiveOrchestrationFoundation.ts",
  "executiveOrchestrationFoundation.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveOrchestrationFoundation",
  "ExecutiveOrchestrationResponsibilityContract",
  "ExecutiveOrchestrationDependencyContract",
  "ExecutiveOrchestrationLifecycleContract",
  "ExecutiveOrchestrationCapabilityContract",
  "getExecutiveOrchestrationFoundation",
] as const);

test("exactly seven required ENG-8:1 files exist", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 7);
});

test("publishes exactly the approved public APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [...approvedExports].sort());
  assert.equal(Object.keys(publicApi).length, 6);
});

test("foundation and contracts are deeply frozen metadata-only surfaces", () => {
  assert.equal(Object.isFrozen(ExecutiveOrchestrationFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationResponsibilityContract), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationDependencyContract), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationLifecycleContract), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationCapabilityContract), true);
  assert.equal(ExecutiveOrchestrationFoundation.metadataOnly, true);
  assert.equal(ExecutiveOrchestrationFoundation.runtimeFree, true);
  assert.equal(ExecutiveOrchestrationFoundation.id, "ENG-8:1");
  assert.equal(ExecutiveOrchestrationFoundation.nextPhase, "ENG-8:2");
  assert.equal(ExecutiveOrchestrationFoundation.status.readyForRegistry, "ReadyForRegistry");
  assert.equal(
    ExecutiveOrchestrationFoundation.architecturalBoundaries.performsOrchestration,
    false,
  );
  assert.equal(
    ExecutiveOrchestrationFoundation.architecturalBoundaries.performsScheduling,
    false,
  );
  assert.equal(
    ExecutiveOrchestrationFoundation.architecturalBoundaries.performsQueuing,
    false,
  );
  assert.equal(
    ExecutiveOrchestrationFoundation.architecturalBoundaries.performsStateManagement,
    false,
  );
  assert.equal(
    ExecutiveOrchestrationFoundation.architecturalBoundaries.performsBusinessLogic,
    false,
  );
});

test("lifecycle ordering is correct and non-executing", () => {
  assert.deepEqual([...ExecutiveOrchestrationLifecycleContract.ordering], [
    "Idle",
    "ReceiveRequest",
    "PreparePipeline",
    "ResolveDependencies",
    "CoordinateExecution",
    "AggregateResults",
    "PrepareResponse",
    "Complete",
  ]);
  assert.deepEqual(
    ExecutiveOrchestrationLifecycleContract.stages.map(({ id }) => id),
    [...ExecutiveOrchestrationLifecycleContract.ordering],
  );
  assert.equal(
    ExecutiveOrchestrationLifecycleContract.stages.every(({ executesStage }) =>
      executesStage === false
    ),
    true,
  );
  assert.equal(ExecutiveOrchestrationLifecycleContract.stages.every(Object.isFrozen), true);
});

test("dependency declarations are correct", () => {
  assert.deepEqual([...ExecutiveOrchestrationDependencyContract.rules.allowed], [
    "ENG-1",
    "ENG-2",
    "ENG-3",
    "ENG-4",
    "ENG-5",
    "ENG-6",
    "ENG-7",
    "BUS Public APIs",
    "OPS Public APIs",
    "Advisor Public APIs",
  ]);
  assert.deepEqual([...ExecutiveOrchestrationDependencyContract.rules.forbidden], [
    "CORE",
    "Database",
    "Storage",
    "API",
    "UI",
    "React",
    "Next.js",
    "HTTP",
    "Queue",
    "Scheduler",
    "Runtime execution",
  ]);
  assert.equal(ExecutiveOrchestrationDependencyContract.rules.direction, "ForwardOnly");
  assert.equal(ExecutiveOrchestrationDependencyContract.rules.publicApiOnly, true);
});

test("responsibility and capability registries are immutable", () => {
  assert.equal(ExecutiveOrchestrationResponsibilityContract.responsibilities.length, 12);
  assert.equal(ExecutiveOrchestrationResponsibilityContract.coordinationTargets.length, 9);
  assert.deepEqual(
    ExecutiveOrchestrationResponsibilityContract.coordinationTargets.map(({ name }) => name),
    [
      "Executive Request",
      "Intent Resolution",
      "Context Assembly",
      "Planning",
      "Reasoning",
      "Decision",
      "BUS Platforms",
      "OPS Platforms",
      "Advisor",
    ],
  );
  assert.equal(
    ExecutiveOrchestrationResponsibilityContract.responsibilities.every(
      ({ executesOrchestration }) => executesOrchestration === false,
    ),
    true,
  );
  assert.equal(ExecutiveOrchestrationCapabilityContract.capabilities.length, 8);
  assert.deepEqual(
    ExecutiveOrchestrationCapabilityContract.capabilities.map(({ id }) => id),
    [
      "sequential-orchestration",
      "parallel-orchestration",
      "dependency-resolution",
      "result-aggregation",
      "failure-propagation",
      "completion-synchronization",
      "advisor-routing",
      "pipeline-coordination",
    ],
  );
  assert.equal(
    ExecutiveOrchestrationCapabilityContract.capabilities.every(
      ({ implementsCapability }) => implementsCapability === false,
    ),
    true,
  );
  assert.equal(ExecutiveOrchestrationCapabilityContract.capabilities.every(Object.isFrozen), true);
});

test("helper returns immutable foundation and no runtime behavior is exported", () => {
  assert.equal(getExecutiveOrchestrationFoundation(), ExecutiveOrchestrationFoundation);
  assert.equal(Object.isFrozen(getExecutiveOrchestrationFoundation()), true);
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Scheduler|Queue|Runner|Executor|Worker|Async|Promise|EventBus|Processor|OrchestratorEngine/i
        .test(name)
    )),
    true,
  );

  const dir = dirname(fileURLToPath(import.meta.url));
  for (
    const file of requiredFiles.filter((name) =>
      !name.endsWith(".test.ts") && name !== "executiveOrchestrationFoundationTypes.ts"
    )
  ) {
    const source = readFileSync(join(dir, file), "utf8");
    assert.equal(/setTimeout\s*\(|setInterval\s*\(|\bPromise\b|\basync\s+function\b|\bawait\b|EventEmitter/i.test(source), false);
    assert.equal(/from ["'].*\/(bus|ops|ui|persistence|database|react|next)/i.test(source), false);
    assert.equal(/readFileSync|readdirSync|import\(/i.test(source), false);
  }
});
