import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantActionMonitoringControlManifest } from "./assistantActionMonitoringControlManifest.ts";

const files = [
  "assistantActionMonitoringControlManifest.test.ts",
  "assistantActionMonitoringControlManifest.ts",
  "assistantActionMonitoringControlManifestCompatibility.ts",
  "assistantActionMonitoringControlManifestExports.ts",
  "assistantActionMonitoringControlManifestInventory.ts",
  "assistantActionMonitoringControlManifestMetadata.ts",
  "assistantActionMonitoringControlManifestPublic.ts",
  "assistantActionMonitoringControlManifestReadiness.ts",
];

const manifestModuleFiles = [
  "assistantActionMonitoringControlManifest.ts",
  "assistantActionMonitoringControlManifestCompatibility.ts",
  "assistantActionMonitoringControlManifestExports.ts",
  "assistantActionMonitoringControlManifestInventory.ts",
  "assistantActionMonitoringControlManifestMetadata.ts",
  "assistantActionMonitoringControlManifestPublic.ts",
  "assistantActionMonitoringControlManifestReadiness.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-9:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-9:5 publishes canonical Manifest identity", () => {
  const manifest = AssistantActionMonitoringControlManifest;
  assert.equal(
    manifest.identity.id,
    "ASSISTANT-9:5/ExecutiveActionMonitoringControlManifest",
  );
  assert.equal(
    manifest.identity.namespace,
    "nexora.assistant.executive-action-monitoring-control.manifest",
  );
  assert.equal(manifest.identity.version, "1.0.0");
  assert.equal(manifest.identity.status, "Manifest");
  assert.equal(manifest.identity.stage, "ReadyForPlatform");
  assert.equal(manifest.identity.readiness, "ReadyForPlatform");
  assert.equal(manifest.identity.canonical, true);
  assert.equal(manifest.identity.mutable, false);
  assert.equal(
    manifest.identity.sourceValidation,
    "ASSISTANT-9:4/ExecutiveActionMonitoringControlValidation",
  );
  assert.equal(manifest.status, "Manifest");
  assert.equal(manifest.stage, "ReadyForPlatform");
  assert.equal(manifest.readinessStatus, "ReadyForPlatform");
});

test("ASSISTANT-9:5 publishes exactly 10 Validation-Platform-derived sections", () => {
  const manifest = AssistantActionMonitoringControlManifest;
  const platform = manifest.validation.platform;
  assert.equal(manifest.sections.length, 10);
  assert.equal(manifest.statistics.sectionCount, 10);
  assert.deepEqual(
    manifest.sections.map(({ section }) => section),
    [
      "Foundation Inventory",
      "Registry Inventory",
      "Model Inventory",
      "Relationship Inventory",
      "Capability Inventory",
      "Contract Inventory",
      "Lifecycle Inventory",
      "Policy Inventory",
      "Validation Inventory",
      "Platform Readiness",
    ],
  );
  assert.equal(
    manifest.inventory.foundationInventory,
    platform.inventories.foundation,
  );
  assert.equal(
    manifest.inventory.registryInventory,
    platform.inventories.registry,
  );
  assert.equal(
    manifest.inventory.modelInventory,
    platform.inventories.domainModels,
  );
  assert.equal(
    manifest.inventory.relationshipInventory,
    platform.inventories.relationships,
  );
  assert.equal(
    manifest.inventory.capabilityInventory,
    platform.inventories.capabilities,
  );
  assert.equal(
    manifest.inventory.contractInventory,
    platform.inventories.contracts,
  );
  assert.equal(
    manifest.inventory.lifecycleInventory,
    platform.inventories.lifecycle,
  );
  assert.equal(
    manifest.inventory.policyInventory,
    platform.inventories.policies,
  );
  assert.equal(
    manifest.inventory.totals.validationCategoryCount,
    platform.inventoryTotals.validationCategoryCount,
  );
  assert.equal(
    manifest.inventory.totals.validationRuleCount,
    platform.inventoryTotals.validationRuleCount,
  );
  assert.equal(
    manifest.inventory.totals.capabilityCount,
    platform.inventoryTotals.capabilityCount,
  );
  assert.equal(
    manifest.inventory.totals.contractCount,
    platform.inventoryTotals.contractCount,
  );
  assert.equal(
    manifest.inventory.totals.modelKindCount,
    platform.inventoryTotals.modelKindCount,
  );
  assert.equal(
    manifest.inventory.totals.relationshipKindCount,
    platform.inventoryTotals.relationshipKindCount,
  );
  assert.equal(
    manifest.inventory.totals.lifecycleStateCount,
    platform.inventoryTotals.lifecycleStateCount,
  );
  assert.equal(
    manifest.inventory.totals.policyCount,
    platform.inventoryTotals.policyCount,
  );
  assert.equal(manifest.inventory.sourceValidationPlatform, platform);
  assert.equal(manifest.inventory.duplicatedDefinitions, false);
  assert.equal(manifest.inventory.independentlyMaintainedCounts, false);
  assert.equal(manifest.inventory.recalculatedMetadata, false);
  assert.equal(manifest.inventory.reconstructedInventories, false);
  assert.equal(manifest.canonicalInventoryRuleSatisfied, true);
});

test("ASSISTANT-9:5 publishes complete compatibility and readiness metadata", () => {
  const manifest = AssistantActionMonitoringControlManifest;
  assert.deepEqual(
    manifest.compatibility.phases.map(({ name }) => name),
    [
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Platform",
      "Certification",
      "Freeze",
      "Public Index",
    ],
  );
  assert.equal(manifest.compatibility.foundationCompatible, true);
  assert.equal(manifest.compatibility.platformCompatible, true);
  assert.equal(manifest.readiness.readiness, "ReadyForPlatform");
  assert.deepEqual([...manifest.readiness.declarations], [
    "ReadyForPlatform",
    "Validated",
    "Canonical",
    "Immutable",
    "Metadata Complete",
    "Validation Derived",
    "Platform Ready",
  ]);
  assert.equal(
    manifest.platformSummary.validationStatus,
    manifest.validation.platform.validationStatus,
  );
  assert.equal(
    manifest.platformSummary.supportedModels,
    manifest.validation.platform.inventoryTotals.modelKindCount,
  );
  assert.equal(manifest.exports.runtimeExports, false);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.inventory), true);
  assert.equal(Object.isFrozen(manifest.sections), true);
});

test("ASSISTANT-9:5 consumes Validation only and forbids runtime behavior", () => {
  const manifest = AssistantActionMonitoringControlManifest;
  assert.deepEqual(
    readImports("assistantActionMonitoringControlManifest.ts"),
    [
      "./assistantActionMonitoringControlValidation.ts",
      "./assistantActionMonitoringControlManifestCompatibility.ts",
      "./assistantActionMonitoringControlManifestExports.ts",
      "./assistantActionMonitoringControlManifestInventory.ts",
      "./assistantActionMonitoringControlManifestMetadata.ts",
      "./assistantActionMonitoringControlManifestPublic.ts",
      "./assistantActionMonitoringControlManifestReadiness.ts",
    ],
  );
  for (const fileName of manifestModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./assistantActionMonitoringControlValidation.ts"
        || importPath === "./assistantActionMonitoringControlManifest.ts"
        || importPath
          === "./assistantActionMonitoringControlManifestCompatibility.ts"
        || importPath
          === "./assistantActionMonitoringControlManifestExports.ts"
        || importPath
          === "./assistantActionMonitoringControlManifestInventory.ts"
        || importPath
          === "./assistantActionMonitoringControlManifestMetadata.ts"
        || importPath
          === "./assistantActionMonitoringControlManifestPublic.ts"
        || importPath
          === "./assistantActionMonitoringControlManifestReadiness.ts";
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
        importPath.includes("assistantActionMonitoringControlRegistry"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlModel"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlPlatform"),
        false,
      );
    }
  }
  assert.deepEqual(manifest.upstreamDependencies, [
    "ASSISTANT-9:4 Executive Action Monitoring & Control Validation",
  ]);
  assert.equal(
    manifest.validation.identity.id,
    "ASSISTANT-9:4/ExecutiveActionMonitoringControlValidation",
  );
  assert.deepEqual(manifest.publicApiSurface, [
    "AssistantActionMonitoringControlManifest",
  ]);
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.monitoringRuntime, false);
  assert.equal(manifest.controlRuntime, false);
  assert.equal(manifest.kpiCalculations, false);
  assert.equal(manifest.persistence, false);
  assert.equal(manifest.services, false);
  assert.equal(manifest.factories, false);
  assert.equal(manifest.ui, false);
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.immutable, true);
});
