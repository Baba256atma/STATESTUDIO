import assert from "node:assert/strict";
import test from "node:test";
import {
  ExecutiveOrchestrationCapabilityContract,
  ExecutiveOrchestrationDependencyContract,
  ExecutiveOrchestrationFoundation,
  ExecutiveOrchestrationLifecycleContract,
  ExecutiveOrchestrationResponsibilityContract,
} from "./executiveOrchestrationFoundation.ts";
import * as publicApi from "./executiveOrchestrationRegistryPlatform.ts";
import {
  ExecutiveOrchestrationCapabilityRegistry,
  ExecutiveOrchestrationComponentRegistry,
  ExecutiveOrchestrationCoordinationRegistry,
  ExecutiveOrchestrationDependencyRegistry,
  ExecutiveOrchestrationLifecycleRegistry,
  ExecutiveOrchestrationRegistryPlatform,
  getExecutiveOrchestrationRegistryEntryById,
  getExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";

const approvedExports = Object.freeze([
  "ExecutiveOrchestrationRegistryPlatform",
  "ExecutiveOrchestrationComponentRegistry",
  "ExecutiveOrchestrationCoordinationRegistry",
  "ExecutiveOrchestrationCapabilityRegistry",
  "ExecutiveOrchestrationLifecycleRegistry",
  "ExecutiveOrchestrationDependencyRegistry",
  "getExecutiveOrchestrationRegistryPlatform",
  "getExecutiveOrchestrationRegistryEntryById",
] as const);

test("publishes exactly eight approved public APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [...approvedExports].sort());
  assert.equal(Object.keys(publicApi).length, 8);
});

test("consumes ENG-8:1 only through approved foundation public API", () => {
  assert.equal(
    ExecutiveOrchestrationRegistryPlatform.foundation,
    ExecutiveOrchestrationFoundation,
  );
  assert.equal(ExecutiveOrchestrationRegistryPlatform.foundation.id, "ENG-8:1");
  assert.equal(
    ExecutiveOrchestrationRegistryPlatform.foundation.responsibilities,
    ExecutiveOrchestrationResponsibilityContract,
  );
  assert.equal(
    ExecutiveOrchestrationRegistryPlatform.foundation.capabilities,
    ExecutiveOrchestrationCapabilityContract,
  );
  assert.equal(
    ExecutiveOrchestrationRegistryPlatform.foundation.lifecycle,
    ExecutiveOrchestrationLifecycleContract,
  );
  assert.equal(
    ExecutiveOrchestrationRegistryPlatform.foundation.dependencies,
    ExecutiveOrchestrationDependencyContract,
  );
});

test("registers twelve components, nine targets, eight capabilities", () => {
  assert.equal(ExecutiveOrchestrationComponentRegistry.length, 12);
  assert.equal(ExecutiveOrchestrationCoordinationRegistry.length, 9);
  assert.equal(ExecutiveOrchestrationCapabilityRegistry.length, 8);
  assert.deepEqual(
    ExecutiveOrchestrationComponentRegistry.map(({ name }) => name),
    [
      "Pipeline Orchestrator",
      "Engine Coordinator",
      "Dependency Coordinator",
      "Execution Sequence Coordinator",
      "Parallel Coordination Descriptor",
      "Context Propagation Coordinator",
      "Result Aggregator",
      "Completion Coordinator",
      "Failure Routing Coordinator",
      "Advisor Handoff Coordinator",
      "BUS Coordination Gateway",
      "OPS Coordination Gateway",
    ],
  );
  assert.deepEqual(
    ExecutiveOrchestrationCoordinationRegistry.map(({ name }) => name),
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
  assert.deepEqual(
    ExecutiveOrchestrationCapabilityRegistry.map(({ capabilityId }) => capabilityId),
    ExecutiveOrchestrationCapabilityContract.capabilities.map(({ id }) => id),
  );
  assert.equal(
    new Set(ExecutiveOrchestrationCoordinationRegistry.map(({ targetId }) => targetId)).size,
    9,
  );
});

test("lifecycle stages are ordered with Idle first and Complete terminal", () => {
  assert.equal(ExecutiveOrchestrationLifecycleRegistry.length, 8);
  assert.deepEqual(
    ExecutiveOrchestrationLifecycleRegistry.map(({ stageId }) => stageId),
    [...ExecutiveOrchestrationLifecycleContract.ordering],
  );
  assert.equal(ExecutiveOrchestrationLifecycleRegistry[0]?.stageId, "Idle");
  assert.equal(ExecutiveOrchestrationLifecycleRegistry[0]?.sequence, 1);
  assert.equal(ExecutiveOrchestrationLifecycleRegistry[0]?.previousStageId, null);
  const complete = ExecutiveOrchestrationLifecycleRegistry[7];
  assert.equal(complete?.stageId, "Complete");
  assert.equal(complete?.terminal, true);
  assert.equal(complete?.nextStageId, null);
  assert.deepEqual(
    ExecutiveOrchestrationLifecycleRegistry.map(({ sequence }) => sequence),
    [1, 2, 3, 4, 5, 6, 7, 8],
  );
  for (let index = 0; index < ExecutiveOrchestrationLifecycleRegistry.length; index += 1) {
    const current = ExecutiveOrchestrationLifecycleRegistry[index];
    const previous = index === 0 ? null : ExecutiveOrchestrationLifecycleRegistry[index - 1];
    const next = index === ExecutiveOrchestrationLifecycleRegistry.length - 1
      ? null
      : ExecutiveOrchestrationLifecycleRegistry[index + 1];
    assert.equal(current?.previousStageId, previous?.stageId ?? null);
    assert.equal(current?.nextStageId, next?.stageId ?? null);
  }
});

test("every responsibility has exactly one primary owner", () => {
  const foundationResponsibilityIds =
    ExecutiveOrchestrationResponsibilityContract.responsibilities.map(({ id }) => id);
  assert.equal(foundationResponsibilityIds.length, 12);
  assert.equal(ExecutiveOrchestrationRegistryPlatform.responsibilities.length, 12);

  for (const responsibilityId of foundationResponsibilityIds) {
    const primaryOwners = ExecutiveOrchestrationComponentRegistry.filter((entry) =>
      entry.ownedResponsibilities.some(
        (owned) =>
          owned.responsibilityId === responsibilityId && owned.role === "PrimaryOwner",
      )
    );
    assert.equal(primaryOwners.length, 1, responsibilityId);
    const registryEntry = ExecutiveOrchestrationRegistryPlatform.responsibilities.find(
      (entry) => entry.responsibilityId === responsibilityId,
    );
    assert.equal(registryEntry?.primaryOwnerComponentId, primaryOwners[0]?.componentId);
  }
});

test("all registry ids are globally unique and cross-references resolve", () => {
  const allEntries = Object.freeze([
    ...ExecutiveOrchestrationComponentRegistry,
    ...ExecutiveOrchestrationCoordinationRegistry,
    ...ExecutiveOrchestrationCapabilityRegistry,
    ...ExecutiveOrchestrationLifecycleRegistry,
    ...ExecutiveOrchestrationDependencyRegistry,
    ...ExecutiveOrchestrationRegistryPlatform.responsibilities,
    ...ExecutiveOrchestrationRegistryPlatform.executionModes,
    ...ExecutiveOrchestrationRegistryPlatform.routingRelationships,
  ]);
  const ids = allEntries.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);

  const componentIds = new Set(
    ExecutiveOrchestrationComponentRegistry.map(({ componentId }) => componentId),
  );
  const capabilityIds = new Set(
    ExecutiveOrchestrationCapabilityRegistry.map(({ capabilityId }) => capabilityId),
  );
  const lifecycleIds = new Set(
    ExecutiveOrchestrationLifecycleRegistry.map(({ stageId }) => stageId),
  );
  const dependencyIds = new Set(
    ExecutiveOrchestrationDependencyRegistry.map(({ dependencyId }) => dependencyId),
  );
  const targetIds = new Set(
    ExecutiveOrchestrationCoordinationRegistry.map(({ targetId }) => targetId),
  );

  for (const entry of ExecutiveOrchestrationComponentRegistry) {
    for (const capabilityId of entry.supportedCapabilities) {
      assert.equal(capabilityIds.has(capabilityId), true);
    }
    for (const stageId of entry.lifecycleParticipation) {
      assert.equal(lifecycleIds.has(stageId), true);
    }
    for (const dependencyId of entry.dependencyIds) {
      assert.equal(dependencyIds.has(dependencyId), true);
    }
    for (const targetId of entry.coordinationTargets) {
      assert.equal(targetIds.has(targetId), true);
    }
  }

  for (const entry of ExecutiveOrchestrationCapabilityRegistry) {
    assert.equal(componentIds.has(entry.ownerComponentId), true);
    for (const targetId of entry.supportedTargetIds) {
      assert.equal(targetIds.has(targetId), true);
    }
    for (const dependencyId of entry.requiredDependencyIds) {
      assert.equal(dependencyIds.has(dependencyId), true);
    }
    for (const stageId of entry.lifecycleStageIds) {
      assert.equal(lifecycleIds.has(stageId), true);
    }
  }

  for (const entry of ExecutiveOrchestrationLifecycleRegistry) {
    for (const componentId of entry.participatingComponentIds) {
      assert.equal(componentIds.has(componentId), true);
    }
    for (const capabilityId of entry.allowedCapabilityIds) {
      assert.equal(capabilityIds.has(capabilityId), true);
    }
  }
});

test("dependencies represent ENG-1 through ENG-7 plus BUS OPS Advisor with no runtime invocation", () => {
  assert.equal(ExecutiveOrchestrationDependencyRegistry.length, 10);
  assert.deepEqual(
    ExecutiveOrchestrationDependencyRegistry.map(({ name }) => name),
    [
      "ENG-1 Executive Engine Public API",
      "ENG-2 Executive Request and Intent Public API",
      "ENG-3 Executive Intent Resolution Public API",
      "ENG-4 Executive Context Public API",
      "ENG-5 Executive Planning Public API",
      "ENG-6 Executive Reasoning Public API",
      "ENG-7 Executive Decision Public API",
      "BUS Public APIs",
      "OPS Public APIs",
      "Advisor Public APIs",
    ],
  );
  assert.equal(
    ExecutiveOrchestrationDependencyRegistry.every(
      ({ runtimeInvocationAllowed, publicApiOnly }) =>
        runtimeInvocationAllowed === false && publicApiOnly === true,
    ),
    true,
  );
  assert.deepEqual(
    [...ExecutiveOrchestrationDependencyContract.rules.allowed],
    [
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
    ],
  );
});

test("registries are deeply frozen and lookup is deterministic", () => {
  assert.equal(Object.isFrozen(ExecutiveOrchestrationRegistryPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationComponentRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationCoordinationRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationCapabilityRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationLifecycleRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveOrchestrationDependencyRegistry), true);
  assert.equal(ExecutiveOrchestrationComponentRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationCoordinationRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationCapabilityRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationLifecycleRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveOrchestrationDependencyRegistry.every(Object.isFrozen), true);
  assert.equal(
    ExecutiveOrchestrationComponentRegistry.every((entry) =>
      Object.isFrozen(entry.ownedResponsibilities)
      && Object.isFrozen(entry.coordinationTargets)
      && Object.isFrozen(entry.supportedCapabilities)
      && Object.isFrozen(entry.executionModes)
      && Object.isFrozen(entry.lifecycleParticipation)
      && Object.isFrozen(entry.dependencyIds)
    ),
    true,
  );

  const known = getExecutiveOrchestrationRegistryEntryById("eng-8-comp-pipeline-orchestrator");
  assert.equal(known, ExecutiveOrchestrationComponentRegistry[0]);
  assert.equal(getExecutiveOrchestrationRegistryEntryById("eng-8-life-Complete")?.kind, "LifecycleStage");
  assert.equal(getExecutiveOrchestrationRegistryEntryById("missing-id"), undefined);
  assert.equal(getExecutiveOrchestrationRegistryPlatform(), ExecutiveOrchestrationRegistryPlatform);
  assert.equal(ExecutiveOrchestrationRegistryPlatform.status.readyForModel, "ReadyForModel");
  assert.equal(ExecutiveOrchestrationRegistryPlatform.registryMetadata.readyForModel, true);
  assert.equal(ExecutiveOrchestrationRegistryPlatform.registryMetadata.status, "Stable");
  assert.equal(ExecutiveOrchestrationRegistryPlatform.registryMetadata.architectureMode, "MetadataOnly");
  assert.equal(ExecutiveOrchestrationRegistryPlatform.registryMetadata.runtimeBehavior, "None");
  assert.equal(ExecutiveOrchestrationRegistryPlatform.deeplyFrozen, true);
  assert.equal(ExecutiveOrchestrationRegistryPlatform.readyForModel, true);

  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Runner|Executor|Scheduler|Queue|Promise|Async|EventBus|Reducer|Handler|Container|Injector/i
        .test(name)
    )),
    true,
  );
});
