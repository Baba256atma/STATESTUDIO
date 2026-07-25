import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantActionMonitoringControlFoundation } from "./assistantActionMonitoringControlFoundation.ts";
import { AssistantActionMonitoringControlRegistry } from "./assistantActionMonitoringControlRegistry.ts";

const files = [
  "assistantActionMonitoringControlRegistry.test.ts",
  "assistantActionMonitoringControlRegistry.ts",
  "assistantActionMonitoringControlRegistryEntries.ts",
  "assistantActionMonitoringControlRegistryIdentity.ts",
  "assistantActionMonitoringControlRegistryLookup.ts",
  "assistantActionMonitoringControlRegistryMetadata.ts",
  "assistantActionMonitoringControlRegistryPublic.ts",
  "assistantActionMonitoringControlRegistryTypes.ts",
];

const registryModuleFiles = [
  "assistantActionMonitoringControlRegistry.ts",
  "assistantActionMonitoringControlRegistryEntries.ts",
  "assistantActionMonitoringControlRegistryIdentity.ts",
  "assistantActionMonitoringControlRegistryLookup.ts",
  "assistantActionMonitoringControlRegistryMetadata.ts",
  "assistantActionMonitoringControlRegistryPublic.ts",
  "assistantActionMonitoringControlRegistryTypes.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-9:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-9:2 publishes canonical Registry identity", () => {
  const registry = AssistantActionMonitoringControlRegistry;
  assert.equal(
    registry.identity.id,
    "ASSISTANT-9:2/ExecutiveActionMonitoringControlRegistry",
  );
  assert.equal(
    registry.identity.namespace,
    "nexora.assistant.executive-action-monitoring-control.registry",
  );
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.identity.status, "Registry");
  assert.equal(registry.identity.stage, "ReadyForModel");
  assert.equal(registry.identity.readiness, "ReadyForModel");
  assert.equal(registry.identity.canonical, true);
  assert.equal(registry.identity.mutable, false);
  assert.equal(
    registry.identity.sourceFoundation,
    "ASSISTANT-9:1/ExecutiveActionMonitoringControlFoundation",
  );
  assert.equal(registry.status, "Registry");
  assert.equal(registry.stage, "ReadyForModel");
  assert.equal(registry.readiness, "ReadyForModel");
});

test("ASSISTANT-9:2 publishes complete Foundation-derived collections", () => {
  const registry = AssistantActionMonitoringControlRegistry;
  const foundation = AssistantActionMonitoringControlFoundation;
  assert.equal(Object.keys(registry.collections).length, 12);
  assert.equal(registry.statistics.collectionCount, 12);
  assert.equal(registry.collections.monitoringDomains.length, 8);
  assert.equal(registry.collections.monitoringStates.length, 8);
  assert.equal(registry.collections.progressStates.length, 6);
  assert.equal(registry.collections.kpiObservationTypes.length, 5);
  assert.equal(registry.collections.goalObservationTypes.length, 5);
  assert.equal(registry.collections.riskCategories.length, 4);
  assert.equal(registry.collections.alertCategories.length, 4);
  assert.equal(registry.collections.exceptionCategories.length, 5);
  assert.equal(registry.collections.feedbackCategories.length, 5);
  assert.equal(registry.collections.controlActionCategories.length, 7);
  assert.equal(
    registry.collections.monitoringPolicies.length,
    foundation.policies.length,
  );
  assert.equal(
    registry.collections.capabilities.length,
    foundation.capabilities.length,
  );
  assert.deepEqual(
    registry.collections.monitoringPolicies.map(
      ({ sourceFoundationReference }) => sourceFoundationReference,
    ),
    foundation.policies.map(({ id }) => id),
  );
  assert.deepEqual(
    registry.collections.capabilities.map(
      ({ sourceFoundationReference }) => sourceFoundationReference,
    ),
    foundation.capabilities.map(({ id }) => id),
  );
  assert.deepEqual(
    registry.relationships.map(({ sourceGroup, targetGroup }) => [
      sourceGroup,
      targetGroup,
    ]),
    [
      ["MonitoringDomain", "MonitoringState"],
      ["MonitoringState", "ProgressState"],
      ["ProgressState", "AlertCategory"],
      ["AlertCategory", "ControlActionCategory"],
      ["ControlActionCategory", "FeedbackCategory"],
    ],
  );
  assert.deepEqual([...registry.policies], [
    "Immutable",
    "Deterministic",
    "Metadata-only",
    "Versioned",
    "Canonical",
    "Foundation-derived",
    "Model-ready",
  ]);
});

test("ASSISTANT-9:2 entries are unique, ordered, and immutable", () => {
  const registry = AssistantActionMonitoringControlRegistry;
  const entries = registry.entries;
  assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
  assert.equal(entries.every(Object.isFrozen), true);
  assert.equal(entries.every(({ version }) => version === "1.0.0"), true);
  assert.equal(entries.every(({ status }) => status === "Registered"), true);
  assert.equal(entries.every(({ executable }) => !executable), true);
  assert.equal(entries.every(({ metadataOnly }) => metadataOnly), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(registry.collections), true);
  assert.equal(Object.isFrozen(registry.lookup), true);
  assert.equal(registry.statistics.entryCount, entries.length);
  for (const collection of Object.values(registry.collections)) {
    assert.deepEqual(
      collection.map(({ order }) => order),
      collection.map((_, index) => index + 1),
    );
  }
  assert.equal(
    registry.lookup.resolveById(entries[0].id)?.id,
    entries[0].id,
  );
  assert.equal(
    registry.lookup.resolveByGroupAndName(
      "MonitoringDomain",
      "Executive",
    )?.canonicalName,
    "Executive",
  );
  assert.equal(
    entries.every(({ sourceFoundationReference }) =>
      typeof sourceFoundationReference === "string"
      && sourceFoundationReference.length > 0),
    true,
  );
});

test("ASSISTANT-9:2 consumes Foundation only and forbids runtime behavior", () => {
  const registry = AssistantActionMonitoringControlRegistry;
  assert.deepEqual(
    readImports("assistantActionMonitoringControlRegistry.ts"),
    [
      "./assistantActionMonitoringControlFoundation.ts",
      "./assistantActionMonitoringControlRegistryEntries.ts",
      "./assistantActionMonitoringControlRegistryIdentity.ts",
      "./assistantActionMonitoringControlRegistryLookup.ts",
      "./assistantActionMonitoringControlRegistryMetadata.ts",
      "./assistantActionMonitoringControlRegistryPublic.ts",
    ],
  );
  for (const fileName of registryModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./assistantActionMonitoringControlFoundation.ts"
        || importPath === "./assistantActionMonitoringControlRegistry.ts"
        || importPath
          === "./assistantActionMonitoringControlRegistryEntries.ts"
        || importPath
          === "./assistantActionMonitoringControlRegistryIdentity.ts"
        || importPath
          === "./assistantActionMonitoringControlRegistryLookup.ts"
        || importPath
          === "./assistantActionMonitoringControlRegistryMetadata.ts"
        || importPath
          === "./assistantActionMonitoringControlRegistryPublic.ts"
        || importPath
          === "./assistantActionMonitoringControlRegistryTypes.ts";
      assert.equal(
        allowed,
        true,
        `${fileName} imports forbidden module ${importPath}`,
      );
      assert.equal(
        importPath.includes("executiveActionExecution"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlModel"),
        false,
      );
    }
  }
  assert.equal(readImports("assistantActionMonitoringControlRegistryTypes.ts").length, 0);
  assert.deepEqual(registry.upstreamDependencies, [
    "ASSISTANT-9:1 Executive Action Monitoring & Control Foundation",
  ]);
  assert.equal(
    registry.foundation.identity.id,
    "ASSISTANT-9:1/ExecutiveActionMonitoringControlFoundation",
  );
  assert.deepEqual(registry.publicApiSurface, [
    "AssistantActionMonitoringControlRegistry",
  ]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.monitoringRuntime, false);
  assert.equal(registry.controlRuntime, false);
  assert.equal(registry.kpiEvaluation, false);
  assert.equal(registry.alertExecution, false);
  assert.equal(registry.scheduler, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.services, false);
  assert.equal(registry.factories, false);
  assert.equal(registry.ui, false);
  assert.equal(registry.metadataOnly, true);
  assert.equal(registry.immutable, true);
});
