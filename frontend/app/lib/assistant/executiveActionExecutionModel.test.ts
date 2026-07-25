import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveActionExecutionModel } from "./executiveActionExecutionModel.ts";
import { ExecutiveActionExecutionRegistry } from "./executiveActionExecutionRegistry.ts";

const files = [
  "executionDomainModels.ts",
  "executionModelCatalog.ts",
  "executionModelMetadata.ts",
  "executionModelTypes.ts",
  "executionModelUtilities.ts",
  "executionRelationships.ts",
  "executiveActionExecutionModel.test.ts",
  "executiveActionExecutionModel.ts",
];

const modelModuleFiles = [
  "executionDomainModels.ts",
  "executionModelCatalog.ts",
  "executionModelMetadata.ts",
  "executionModelTypes.ts",
  "executionModelUtilities.ts",
  "executionRelationships.ts",
  "executiveActionExecutionModel.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-8:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-8:3 publishes canonical Model identity", () => {
  const model = ExecutiveActionExecutionModel;
  assert.equal(
    model.identity.id,
    "ASSISTANT-8:3/ExecutiveActionExecutionModel",
  );
  assert.equal(
    model.identity.namespace,
    "nexora.assistant.executive-action-execution.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.identity.status, "Model");
  assert.equal(model.identity.stage, "ReadyForValidation");
  assert.equal(model.identity.canonical, true);
  assert.equal(model.identity.mutable, false);
  assert.equal(
    model.identity.sourceRegistry,
    "ASSISTANT-8:2/ExecutiveActionExecutionRegistry",
  );
  assert.equal(model.status, "Model");
  assert.equal(model.stage, "ReadyForValidation");
  assert.equal(model.readiness, "ReadyForValidation");
});

test("ASSISTANT-8:3 publishes complete domain models, relationships, and catalogs", () => {
  const model = ExecutiveActionExecutionModel;
  assert.equal(model.domainModels.length, 16);
  assert.equal(model.relationships.length, 9);
  assert.equal(model.attributes.length, 13);
  assert.equal(model.categories.length, 10);
  assert.equal(model.catalog.progress.length, 6);
  assert.equal(model.catalog.health.length, 5);
  assert.equal(model.catalog.exceptions.length, 8);
  assert.equal(model.catalog.feedback.length, 6);
  assert.equal(model.catalog.priorities.length, 5);
  assert.equal(model.catalog.timeline.length, 6);
  assert.equal(
    model.statistics.domainModelCount,
    model.domainModels.length,
  );
  assert.equal(
    model.statistics.relationshipCount,
    model.relationships.length,
  );
  assert.deepEqual(
    model.domainModels.map(({ name }) => name),
    [
      "ExecutiveActionModel",
      "ExecutionPlanModel",
      "ExecutionStepModel",
      "ExecutionProgressModel",
      "ExecutionStateModel",
      "ExecutionResultModel",
      "ExecutionCheckpointModel",
      "ExecutionSnapshotModel",
      "ExecutionHealthModel",
      "ExecutionExceptionModel",
      "ExecutionFeedbackModel",
      "ExecutionSummaryModel",
      "ExecutionDependencyModel",
      "ExecutionOwnershipModel",
      "ExecutionPriorityModel",
      "ExecutionTimelineModel",
    ],
  );
  assert.deepEqual(
    model.relationships.map(({
      source,
      relationshipType,
      target,
    }) => [source, relationshipType, target]),
    [
      ["ExecutionPlanModel", "contains", "ExecutiveActionModel"],
      ["ExecutiveActionModel", "contains", "ExecutionStepModel"],
      ["ExecutionStepModel", "reports", "ExecutionProgressModel"],
      ["ExecutionProgressModel", "updates", "ExecutionStateModel"],
      ["ExecutionStateModel", "produces", "ExecutionResultModel"],
      ["ExecutionExceptionModel", "affects", "ExecutionHealthModel"],
      ["ExecutionFeedbackModel", "improves", "ExecutionSummaryModel"],
      ["ExecutionCheckpointModel", "validates", "ExecutionProgressModel"],
      ["ExecutionTimelineModel", "records", "ExecutionSnapshotModel"],
    ],
  );
  assert.deepEqual(
    model.catalog.health.map(({ name }) => name),
    ["Excellent", "Healthy", "Attention", "Warning", "Critical"],
  );
  assert.deepEqual(
    model.catalog.priorities.map(({ name }) => name),
    ["Critical", "High", "Normal", "Low", "Deferred"],
  );
  assert.deepEqual(
    model.catalog.timeline.map(({ name }) => name),
    [
      "Execution Start",
      "Checkpoint",
      "Progress Update",
      "Completion",
      "Cancellation",
      "Archival",
    ],
  );
});

test("ASSISTANT-8:3 metadata is immutable, deterministic, and Registry-linked", () => {
  const model = ExecutiveActionExecutionModel;
  const records = [
    ...model.domainModels,
    ...model.relationships,
    ...model.attributes,
    ...model.categories,
    ...model.catalog.progress,
    ...model.catalog.health,
    ...model.catalog.exceptions,
    ...model.catalog.feedback,
    ...model.catalog.priorities,
    ...model.catalog.timeline,
  ];
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(model), true);
  assert.equal(Object.isFrozen(model.identity), true);
  assert.equal(Object.isFrozen(model.metadata), true);
  assert.equal(Object.isFrozen(model.catalog), true);
  assert.deepEqual(
    model.domainModels.map(({ order }) => order),
    model.domainModels.map((_, index) => index + 1),
  );
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(
    model.domainModels.every(({ sourceRegistry }) =>
      sourceRegistry === "ASSISTANT-8:2/ExecutiveActionExecutionRegistry"),
    true,
  );
  assert.equal(
    model.domainModels.every(({ readiness }) =>
      readiness === "ReadyForValidation"),
    true,
  );
  assert.equal(
    model.domainModels.every(({ executable }) => !executable),
    true,
  );
  const registryIds = new Set([
    ...ExecutiveActionExecutionRegistry.contracts.map(({ id }) => id),
    ...ExecutiveActionExecutionRegistry.policies.map(({ id }) => id),
    ExecutiveActionExecutionRegistry.identity.id,
  ]);
  assert.equal(
    model.domainModels.every(({ registryReference }) =>
      registryIds.has(registryReference)),
    true,
  );
  assert.equal(
    model.registry.identity.id,
    "ASSISTANT-8:2/ExecutiveActionExecutionRegistry",
  );
});

test("ASSISTANT-8:3 consumes Registry only and forbids runtime behavior", () => {
  const model = ExecutiveActionExecutionModel;
  assert.deepEqual(readImports("executiveActionExecutionModel.ts"), [
    "./executionDomainModels.ts",
    "./executionModelCatalog.ts",
    "./executionModelMetadata.ts",
    "./executionRelationships.ts",
    "./executiveActionExecutionRegistry.ts",
  ]);
  for (const fileName of modelModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./executiveActionExecutionRegistry.ts"
        || importPath === "./executionModelTypes.ts"
        || importPath === "./executionModelUtilities.ts"
        || importPath === "./executionModelMetadata.ts"
        || importPath === "./executionModelCatalog.ts"
        || importPath === "./executionDomainModels.ts"
        || importPath === "./executionRelationships.ts";
      assert.equal(
        allowed,
        true,
        `${fileName} imports forbidden module ${importPath}`,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionFoundation"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionValidation"),
        false,
      );
      assert.equal(
        importPath.includes("assistantExecutiveActionPlanning"),
        false,
      );
    }
  }
  assert.equal(
    readImports("executionModelTypes.ts").length,
    0,
  );
  assert.deepEqual(readImports("executionModelUtilities.ts"), [
    "./executionModelTypes.ts",
  ]);
  assert.deepEqual(model.upstreamDependencies, [
    "ASSISTANT-8:2 Executive Action Execution Registry",
  ]);
  assert.deepEqual(model.publicApiSurface, [
    "ExecutiveActionExecutionModel",
  ]);
  assert.equal(model.runtime, false);
  assert.equal(model.executionEngine, false);
  assert.equal(model.workflowRuntime, false);
  assert.equal(model.scheduler, false);
  assert.equal(model.monitoringServices, false);
  assert.equal(model.automation, false);
  assert.equal(model.persistence, false);
  assert.equal(model.orchestration, false);
  assert.equal(model.apis, false);
  assert.equal(model.aiReasoning, false);
  assert.equal(model.ui, false);
  assert.equal(model.metadataOnly, true);
  assert.equal(model.immutable, true);
});
