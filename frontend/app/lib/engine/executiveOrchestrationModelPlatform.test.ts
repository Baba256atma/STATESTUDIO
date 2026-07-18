import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  ExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";
import {
  ExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import * as publicApi from "./executiveOrchestrationModelPlatform.ts";
import {
  ExecutiveAdvisorHandoffModel,
  ExecutiveCoordinationRouteModel,
  ExecutiveDependencyChainModel,
  ExecutiveExecutionGroupModel,
  ExecutiveExecutionStageModel,
  ExecutiveOrchestrationModelPlatform,
  ExecutiveOrchestrationPlanModel,
  ExecutiveOrchestrationRequestModel,
  getExecutiveOrchestrationModelById,
  getExecutiveOrchestrationModelPlatform,
} from "./executiveOrchestrationModelPlatform.ts";

const requiredFiles = Object.freeze([
  "executiveOrchestrationModelTypes.ts",
  "executiveOrchestrationRequestModel.ts",
  "executiveOrchestrationPlanModel.ts",
  "executiveExecutionStageModel.ts",
  "executiveCoordinationRouteModel.ts",
  "executiveDependencyChainModel.ts",
  "executiveExecutionGroupModel.ts",
  "executiveAdvisorHandoffModel.ts",
  "executiveOrchestrationModelPlatform.ts",
  "executiveOrchestrationModelPlatform.test.ts",
] as const);

const approvedExports = Object.freeze([
  "ExecutiveOrchestrationRequestModel",
  "ExecutiveOrchestrationPlanModel",
  "ExecutiveExecutionStageModel",
  "ExecutiveCoordinationRouteModel",
  "ExecutiveDependencyChainModel",
  "ExecutiveExecutionGroupModel",
  "ExecutiveAdvisorHandoffModel",
  "ExecutiveOrchestrationModelPlatform",
  "getExecutiveOrchestrationModelPlatform",
  "getExecutiveOrchestrationModelById",
] as const);

test("exactly ten required ENG-8:3 files exist", () => {
  const dir = dirname(fileURLToPath(import.meta.url));
  for (const file of requiredFiles) {
    assert.equal(readFileSync(join(dir, file), "utf8").length > 0, true);
  }
  assert.equal(requiredFiles.length, 10);
});

test("publishes exactly ten approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [...approvedExports].sort());
  assert.equal(Object.keys(publicApi).length, 10);
});

test("seven canonical models are frozen and metadata-only", () => {
  const models = [
    ExecutiveOrchestrationRequestModel,
    ExecutiveOrchestrationPlanModel,
    ExecutiveExecutionStageModel,
    ExecutiveCoordinationRouteModel,
    ExecutiveDependencyChainModel,
    ExecutiveExecutionGroupModel,
    ExecutiveAdvisorHandoffModel,
  ];
  assert.equal(models.length, 7);
  assert.equal(models.every(Object.isFrozen), true);
  assert.equal(models.every(({ metadataOnly }) => metadataOnly === true), true);
  assert.equal(models.every(({ runtimeFree }) => runtimeFree === true), true);
  assert.equal(
    models.every(({ executesOrchestration }) => executesOrchestration === false),
    true,
  );
  assert.deepEqual(
    ExecutiveOrchestrationModelPlatform.modelRegistry.kinds,
    [
      "Request",
      "Plan",
      "ExecutionStage",
      "CoordinationRoute",
      "DependencyChain",
      "ExecutionGroup",
      "AdvisorHandoff",
    ],
  );
  assert.equal(ExecutiveOrchestrationModelPlatform.modelRegistry.entries.length, 7);
});

test("model relationships and dependency chain metadata are valid", () => {
  assert.deepEqual([...ExecutiveOrchestrationModelPlatform.relationshipChain], [
    "Request",
    "Plan",
    "ExecutionStage",
    "CoordinationRoute",
    "ExecutionGroup",
    "AdvisorHandoff",
  ]);
  assert.equal(
    ExecutiveOrchestrationModelPlatform.relationships.every(
      ({ direction, executesRelationship }) =>
        direction === "Forward" && executesRelationship === false,
    ),
    true,
  );
  assert.equal(ExecutiveDependencyChainModel.chainLinks.length, 7);
  assert.deepEqual(
    ExecutiveDependencyChainModel.chainLinks.map(({ ordering }) => ordering),
    [1, 2, 3, 4, 5, 6, 7],
  );
  assert.equal(
    ExecutiveDependencyChainModel.publicDependencyReferences.every(
      ({ runtimeInvocationAllowed }) => runtimeInvocationAllowed === false,
    ),
    true,
  );
});

test("execution modes and advisor handoff model are correct", () => {
  assert.deepEqual([...ExecutiveExecutionGroupModel.supportedExecutionModes], [
    "Sequential",
    "Parallel",
    "Conditional",
    "Synchronized",
    "Aggregated",
    "Handoff",
  ]);
  assert.equal(ExecutiveExecutionGroupModel.groups.length, 6);
  assert.equal(ExecutiveExecutionGroupModel.sequentialExecutionGroup.mode, "Sequential");
  assert.equal(ExecutiveExecutionGroupModel.parallelExecutionGroup.mode, "Parallel");
  assert.equal(ExecutiveAdvisorHandoffModel.kind, "AdvisorHandoff");
  assert.equal(ExecutiveAdvisorHandoffModel.handoffTemplate.destination, "advisor");
  assert.equal(ExecutiveAdvisorHandoffModel.handoffTemplate.executesHandoff, false);
  assert.equal(ExecutiveOrchestrationPlanModel.completionState.metadataOnly, true);
  assert.equal(ExecutiveOrchestrationPlanModel.failureRoute.metadataOnly, true);
  assert.equal(ExecutiveOrchestrationPlanModel.resultAggregation.metadataOnly, true);
  assert.equal(ExecutiveExecutionStageModel.stageTemplates.length, 8);
  assert.equal(ExecutiveCoordinationRouteModel.routeTemplates.length, 8);
});

test("helpers return canonical models and consume public surfaces only", () => {
  assert.equal(getExecutiveOrchestrationModelPlatform(), ExecutiveOrchestrationModelPlatform);
  assert.equal(
    getExecutiveOrchestrationModelById("eng-8-model-request"),
    ExecutiveOrchestrationRequestModel,
  );
  assert.equal(
    getExecutiveOrchestrationModelById("eng-8-model-plan"),
    ExecutiveOrchestrationPlanModel,
  );
  assert.equal(
    getExecutiveOrchestrationModelById("eng-8-model-execution-stage"),
    ExecutiveExecutionStageModel,
  );
  assert.equal(
    getExecutiveOrchestrationModelById("eng-8-model-coordination-route"),
    ExecutiveCoordinationRouteModel,
  );
  assert.equal(
    getExecutiveOrchestrationModelById("eng-8-model-dependency-chain"),
    ExecutiveDependencyChainModel,
  );
  assert.equal(
    getExecutiveOrchestrationModelById("eng-8-model-execution-group"),
    ExecutiveExecutionGroupModel,
  );
  assert.equal(
    getExecutiveOrchestrationModelById("eng-8-model-advisor-handoff"),
    ExecutiveAdvisorHandoffModel,
  );
  assert.equal(getExecutiveOrchestrationModelById("missing-model"), undefined);

  assert.equal(
    ExecutiveOrchestrationModelPlatform.foundation,
    ExecutiveOrchestrationFoundation,
  );
  assert.equal(
    ExecutiveOrchestrationModelPlatform.registry,
    ExecutiveOrchestrationRegistryPlatform,
  );
  assert.deepEqual(ExecutiveOrchestrationModelPlatform.consumedSurfaces, {
    foundation: "executiveOrchestrationFoundation.ts",
    registry: "executiveOrchestrationRegistryPlatform.ts",
  });
  assert.equal(Object.isFrozen(ExecutiveOrchestrationModelPlatform), true);
  assert.equal(ExecutiveOrchestrationModelPlatform.status.readyForValidation, "ReadyForValidation");
  assert.equal(ExecutiveOrchestrationModelPlatform.metadata.readyForValidation, true);
  assert.equal(ExecutiveOrchestrationModelPlatform.deeplyFrozen, true);

  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Runner|Executor|Scheduler|Queue|Promise|Async|EventBus|Workflow|Service|Reducer/i
        .test(name)
    )),
    true,
  );
});
