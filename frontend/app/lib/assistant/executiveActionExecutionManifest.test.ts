import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveActionExecutionManifest } from "./executiveActionExecutionManifest.ts";

const files = [
  "executionManifestCompatibility.ts",
  "executionManifestExports.ts",
  "executionManifestInventory.ts",
  "executionManifestMetadata.ts",
  "executionManifestReadiness.ts",
  "executionManifestSummary.ts",
  "executiveActionExecutionManifest.test.ts",
  "executiveActionExecutionManifest.ts",
];

const manifestModuleFiles = [
  "executionManifestCompatibility.ts",
  "executionManifestExports.ts",
  "executionManifestInventory.ts",
  "executionManifestMetadata.ts",
  "executionManifestReadiness.ts",
  "executionManifestSummary.ts",
  "executiveActionExecutionManifest.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-8:5 consists of exactly eight Manifest artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-8:5 publishes canonical Manifest identity", () => {
  const manifest = ExecutiveActionExecutionManifest;
  assert.equal(
    manifest.identity.id,
    "ASSISTANT-8:5/ExecutiveActionExecutionManifest",
  );
  assert.equal(
    manifest.identity.namespace,
    "nexora.assistant.executive-action-execution.manifest",
  );
  assert.equal(manifest.identity.version, "1.0.0");
  assert.equal(manifest.identity.status, "Manifest");
  assert.equal(manifest.identity.stage, "ReadyForPlatform");
  assert.equal(manifest.identity.canonical, true);
  assert.equal(manifest.identity.mutable, false);
  assert.equal(
    manifest.identity.sourceValidation,
    "ASSISTANT-8:4/ExecutiveActionExecutionValidation",
  );
  assert.equal(manifest.status, "Manifest");
  assert.equal(manifest.stage, "ReadyForPlatform");
  assert.equal(manifest.readinessStatus, "ReadyForPlatform");
});

test("ASSISTANT-8:5 derives inventory exclusively through Validation", () => {
  const manifest = ExecutiveActionExecutionManifest;
  const validation = manifest.validation;
  assert.equal(
    manifest.inventory.contractsInventory,
    validation.model.registry.contracts,
  );
  assert.equal(
    manifest.inventory.capabilitiesInventory,
    validation.model.registry.capabilities,
  );
  assert.equal(
    manifest.inventory.lifecycleStatesInventory,
    validation.model.registry.lifecycle,
  );
  assert.equal(
    manifest.inventory.executionStatesInventory,
    validation.model.registry.executionStates,
  );
  assert.equal(
    manifest.inventory.progressTypesInventory,
    validation.model.registry.progressTypes,
  );
  assert.equal(
    manifest.inventory.exceptionTypesInventory,
    validation.model.registry.exceptionTypes,
  );
  assert.equal(
    manifest.inventory.feedbackTypesInventory,
    validation.model.registry.feedbackTypes,
  );
  assert.equal(
    manifest.inventory.policiesInventory,
    validation.model.registry.policies,
  );
  assert.equal(
    manifest.inventory.domainModelsInventory,
    validation.model.domainModels,
  );
  assert.equal(
    manifest.inventory.relationshipModelsInventory,
    validation.model.relationships,
  );
  assert.equal(
    manifest.inventory.validationCategoriesInventory,
    validation.categories,
  );
  assert.equal(
    manifest.inventory.validationRulesInventory,
    validation.rules,
  );
  assert.equal(
    manifest.inventory.validationGatesInventory,
    validation.gates,
  );
  assert.equal(
    manifest.inventory.metadataDefinitionsInventory,
    validation.model.registry.metadata.definitions,
  );
  assert.equal(
    manifest.inventory.sourceValidationPlatform,
    validation.platform,
  );
  assert.equal(
    manifest.inventory.sourceValidationManifest,
    validation.manifest,
  );
  assert.equal(
    manifest.inventory.sourceValidationMetadata,
    validation.metadata,
  );
  assert.equal(manifest.inventory.source, validation);
  assert.equal(manifest.inventory.duplicatedDefinitions, false);
  assert.equal(manifest.inventory.independentlyMaintainedCounts, false);
  assert.equal(manifest.inventory.recalculatedMetadata, false);
  assert.equal(manifest.inventory.reconstructedInventories, false);
  assert.equal(manifest.canonicalInventoryRuleSatisfied, true);
  assert.equal(
    manifest.inventory.totals.validationRuleCount,
    validation.platform.validationRuleCount,
  );
  assert.equal(
    manifest.inventory.totals.validationGateCount,
    validation.platform.validationGateCount,
  );
  assert.equal(
    manifest.inventory.totals.validationCategoryCount,
    validation.platform.validationCategoryCount,
  );
  assert.equal(
    manifest.inventory.totals.domainModelCount,
    validation.model.domainModels.length,
  );
  assert.equal(
    manifest.inventory.totals.contractCount,
    validation.model.registry.contracts.length,
  );
});

test("ASSISTANT-8:5 publishes complete compatibility and readiness metadata", () => {
  const manifest = ExecutiveActionExecutionManifest;
  assert.deepEqual(
    manifest.compatibility.phases.map(({ name }) => name),
    [
      "ASSISTANT-8:1 Foundation",
      "ASSISTANT-8:2 Registry",
      "ASSISTANT-8:3 Model",
      "ASSISTANT-8:4 Validation",
    ],
  );
  assert.equal(manifest.compatibility.foundationCompatible, true);
  assert.equal(manifest.compatibility.registryCompatible, true);
  assert.equal(manifest.compatibility.modelCompatible, true);
  assert.equal(manifest.compatibility.validationCompatible, true);
  assert.deepEqual([...manifest.readiness.declarations], [
    "ReadyForPlatform",
    "Validated",
    "Canonical",
    "Immutable",
    "Metadata Complete",
    "Deterministic",
    "Stable",
  ]);
  assert.equal(manifest.readiness.readiness, "ReadyForPlatform");
  assert.equal(manifest.summary.foundationStatus, "Foundation");
  assert.equal(manifest.summary.registryStatus, "Registry");
  assert.equal(manifest.summary.modelStatus, "Model");
  assert.equal(manifest.summary.validationStatus, "Validation");
  assert.equal(manifest.summary.manifestStatus, "Manifest");
  assert.equal(manifest.summary.canonicalInventoryCompliance, "Compliant");
  assert.equal(manifest.summary.platformEligibility, "Eligible");
  assert.equal(
    manifest.summary.publishedInventoryCount,
    Object.keys(manifest.inventory)
      .filter((key) => key.endsWith("Inventory")).length,
  );
  assert.equal(
    manifest.exports.inventoryTotals,
    manifest.inventory.totals,
  );
  assert.equal(manifest.exports.runtimeExports, false);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.inventory), true);
  assert.equal(Object.isFrozen(manifest.summary), true);
  assert.equal(Object.isFrozen(manifest.exports), true);
});

test("ASSISTANT-8:5 consumes Validation only and forbids runtime behavior", () => {
  const manifest = ExecutiveActionExecutionManifest;
  assert.deepEqual(readImports("executiveActionExecutionManifest.ts"), [
    "./executiveActionExecutionValidation.ts",
    "./executionManifestCompatibility.ts",
    "./executionManifestExports.ts",
    "./executionManifestInventory.ts",
    "./executionManifestMetadata.ts",
    "./executionManifestReadiness.ts",
    "./executionManifestSummary.ts",
  ]);
  for (const fileName of manifestModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./executiveActionExecutionValidation.ts"
        || importPath === "./executionManifestCompatibility.ts"
        || importPath === "./executionManifestExports.ts"
        || importPath === "./executionManifestInventory.ts"
        || importPath === "./executionManifestMetadata.ts"
        || importPath === "./executionManifestReadiness.ts"
        || importPath === "./executionManifestSummary.ts";
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
        importPath.includes("executiveActionExecutionRegistry"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionModel"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionPlatform"),
        false,
      );
    }
  }
  assert.deepEqual(manifest.upstreamDependencies, [
    "ASSISTANT-8:4 Executive Action Execution Validation",
  ]);
  assert.equal(
    manifest.validation.identity.id,
    "ASSISTANT-8:4/ExecutiveActionExecutionValidation",
  );
  assert.deepEqual(manifest.publicApiSurface, [
    "ExecutiveActionExecutionManifest",
  ]);
  assert.equal(manifest.runtime, false);
  assert.equal(manifest.executionEngine, false);
  assert.equal(manifest.workflowRuntime, false);
  assert.equal(manifest.scheduler, false);
  assert.equal(manifest.monitoringServices, false);
  assert.equal(manifest.automation, false);
  assert.equal(manifest.persistence, false);
  assert.equal(manifest.orchestration, false);
  assert.equal(manifest.apis, false);
  assert.equal(manifest.aiReasoning, false);
  assert.equal(manifest.ui, false);
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.immutable, true);
});
