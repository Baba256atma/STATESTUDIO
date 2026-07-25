import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantActionMonitoringControlModel } from "./assistantActionMonitoringControlModel.ts";
import { AssistantActionMonitoringControlRegistry } from "./assistantActionMonitoringControlRegistry.ts";

const files = [
  "assistantActionMonitoringControlModel.test.ts",
  "assistantActionMonitoringControlModel.ts",
  "assistantActionMonitoringControlModelMetadata.ts",
  "assistantActionMonitoringControlModelPublic.ts",
  "assistantActionMonitoringControlModelTypes.ts",
  "assistantActionMonitoringControlModels.ts",
  "assistantActionMonitoringControlRelationships.ts",
  "assistantActionMonitoringControlStateModels.ts",
];

const modelModuleFiles = [
  "assistantActionMonitoringControlModel.ts",
  "assistantActionMonitoringControlModelMetadata.ts",
  "assistantActionMonitoringControlModelPublic.ts",
  "assistantActionMonitoringControlModelTypes.ts",
  "assistantActionMonitoringControlModels.ts",
  "assistantActionMonitoringControlRelationships.ts",
  "assistantActionMonitoringControlStateModels.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-9:3 consists of exactly eight Model artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-9:3 publishes canonical Model identity", () => {
  const model = AssistantActionMonitoringControlModel;
  assert.equal(
    model.identity.id,
    "ASSISTANT-9:3/ExecutiveActionMonitoringControlModel",
  );
  assert.equal(
    model.identity.namespace,
    "nexora.assistant.executive-action-monitoring-control.model",
  );
  assert.equal(model.identity.version, "1.0.0");
  assert.equal(model.identity.status, "Model");
  assert.equal(model.identity.stage, "ReadyForValidation");
  assert.equal(model.identity.readiness, "ReadyForValidation");
  assert.equal(model.identity.canonical, true);
  assert.equal(model.identity.mutable, false);
  assert.equal(
    model.identity.sourceRegistry,
    "ASSISTANT-9:2/ExecutiveActionMonitoringControlRegistry",
  );
  assert.equal(model.status, "Model");
  assert.equal(model.stage, "ReadyForValidation");
  assert.equal(model.readiness, "ReadyForValidation");
});

test("ASSISTANT-9:3 publishes exactly 14 models and 20 relationships", () => {
  const model = AssistantActionMonitoringControlModel;
  assert.equal(model.domainModels.length, 14);
  assert.equal(model.relationships.length, 20);
  assert.equal(model.stateModels.length, 9);
  assert.equal(model.statistics.domainModelCount, 14);
  assert.equal(model.statistics.relationshipCount, 20);
  assert.deepEqual(
    model.domainModels.map(({ name }) => name),
    [
      "ExecutiveActionMonitoringModel",
      "MonitoringSessionModel",
      "MonitoringStateModel",
      "ProgressTrackingModel",
      "KPIObservationModel",
      "GoalObservationModel",
      "RiskObservationModel",
      "AlertModel",
      "ExceptionModel",
      "ControlDecisionModel",
      "FeedbackModel",
      "MonitoringPolicyModel",
      "MonitoringContextModel",
      "MonitoringCapabilityModel",
    ],
  );
  assert.deepEqual(
    model.relationships.slice(0, 9).map(({
      source,
      relationshipType,
      target,
    }) => [source, relationshipType, target]),
    [
      ["ExecutiveActionMonitoringModel", "contains", "MonitoringSessionModel"],
      ["MonitoringSessionModel", "observes", "MonitoringStateModel"],
      ["MonitoringStateModel", "tracks", "ProgressTrackingModel"],
      ["ProgressTrackingModel", "records", "KPIObservationModel"],
      ["KPIObservationModel", "informs", "GoalObservationModel"],
      ["GoalObservationModel", "surfaces", "RiskObservationModel"],
      ["RiskObservationModel", "raises", "AlertModel"],
      ["AlertModel", "triggers", "ControlDecisionModel"],
      ["ControlDecisionModel", "produces", "FeedbackModel"],
    ],
  );
  assert.deepEqual(
    model.stateModels.map(({ name }) => name),
    [
      "Declared",
      "Registered",
      "MonitoringReady",
      "Observing",
      "Tracking",
      "Evaluating",
      "Controlled",
      "Completed",
      "Archived",
    ],
  );
});

test("ASSISTANT-9:3 models are unique, Registry-linked, and immutable", () => {
  const model = AssistantActionMonitoringControlModel;
  const registryIds = new Set(
    AssistantActionMonitoringControlRegistry.entries.map(({ id }) => id),
  );
  registryIds.add(AssistantActionMonitoringControlRegistry.identity.id);
  assert.equal(
    new Set(model.domainModels.map(({ id }) => id)).size,
    14,
  );
  assert.equal(
    new Set(model.relationships.map(({ id }) => id)).size,
    20,
  );
  assert.equal(model.domainModels.every(Object.isFrozen), true);
  assert.equal(model.relationships.every(Object.isFrozen), true);
  assert.equal(model.stateModels.every(Object.isFrozen), true);
  assert.equal(Object.isFrozen(model), true);
  assert.deepEqual(
    model.domainModels.map(({ order }) => order),
    model.domainModels.map((_, index) => index + 1),
  );
  assert.deepEqual(
    model.relationships.map(({ order }) => order),
    model.relationships.map((_, index) => index + 1),
  );
  assert.equal(
    model.domainModels.every(({ parentRegistryReference }) =>
      registryIds.has(parentRegistryReference)),
    true,
  );
  assert.equal(
    model.domainModels.every(({ policyReference }) =>
      registryIds.has(policyReference)),
    true,
  );
  assert.equal(
    model.domainModels.every(({ executable }) => !executable),
    true,
  );
  assert.equal(
    model.stateModels.every(({ transitionsAtRuntime }) =>
      !transitionsAtRuntime),
    true,
  );
  assert.equal(
    model.relationships.every(({ registryReference }) =>
      registryReference
        === "ASSISTANT-9:2/ExecutiveActionMonitoringControlRegistry"),
    true,
  );
});

test("ASSISTANT-9:3 consumes Registry only and forbids runtime behavior", () => {
  const model = AssistantActionMonitoringControlModel;
  assert.deepEqual(
    readImports("assistantActionMonitoringControlModel.ts"),
    [
      "./assistantActionMonitoringControlModelMetadata.ts",
      "./assistantActionMonitoringControlModelPublic.ts",
      "./assistantActionMonitoringControlModels.ts",
      "./assistantActionMonitoringControlRelationships.ts",
      "./assistantActionMonitoringControlStateModels.ts",
      "./assistantActionMonitoringControlRegistry.ts",
    ],
  );
  for (const fileName of modelModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./assistantActionMonitoringControlRegistry.ts"
        || importPath === "./assistantActionMonitoringControlModel.ts"
        || importPath
          === "./assistantActionMonitoringControlModelMetadata.ts"
        || importPath
          === "./assistantActionMonitoringControlModelPublic.ts"
        || importPath
          === "./assistantActionMonitoringControlModelTypes.ts"
        || importPath === "./assistantActionMonitoringControlModels.ts"
        || importPath
          === "./assistantActionMonitoringControlRelationships.ts"
        || importPath
          === "./assistantActionMonitoringControlStateModels.ts";
      assert.equal(
        allowed,
        true,
        `${fileName} imports forbidden module ${importPath}`,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlFoundation"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlValidation"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecution"),
        false,
      );
    }
  }
  assert.equal(
    readImports("assistantActionMonitoringControlModelTypes.ts").length,
    0,
  );
  assert.deepEqual(model.upstreamDependencies, [
    "ASSISTANT-9:2 Executive Action Monitoring & Control Registry",
  ]);
  assert.equal(
    model.registry.identity.id,
    "ASSISTANT-9:2/ExecutiveActionMonitoringControlRegistry",
  );
  assert.deepEqual(model.publicApiSurface, [
    "AssistantActionMonitoringControlModel",
  ]);
  assert.equal(model.runtime, false);
  assert.equal(model.monitoringRuntime, false);
  assert.equal(model.controlRuntime, false);
  assert.equal(model.kpiCalculations, false);
  assert.equal(model.alertExecution, false);
  assert.equal(model.scheduler, false);
  assert.equal(model.persistence, false);
  assert.equal(model.services, false);
  assert.equal(model.factories, false);
  assert.equal(model.ui, false);
  assert.equal(model.metadataOnly, true);
  assert.equal(model.immutable, true);
});
