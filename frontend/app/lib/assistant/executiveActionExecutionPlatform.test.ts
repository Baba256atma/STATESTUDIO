import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveActionExecutionPlatform } from "./executiveActionExecutionPlatform.ts";

const files = [
  "executionPlatformCapabilities.ts",
  "executionPlatformCompatibility.ts",
  "executionPlatformExtensions.ts",
  "executionPlatformGuarantees.ts",
  "executionPlatformInventory.ts",
  "executionPlatformMetadata.ts",
  "executiveActionExecutionPlatform.test.ts",
  "executiveActionExecutionPlatform.ts",
];

const platformModuleFiles = [
  "executionPlatformCapabilities.ts",
  "executionPlatformCompatibility.ts",
  "executionPlatformExtensions.ts",
  "executionPlatformGuarantees.ts",
  "executionPlatformInventory.ts",
  "executionPlatformMetadata.ts",
  "executiveActionExecutionPlatform.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-8:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-8:6 publishes canonical Platform identity", () => {
  const platform = ExecutiveActionExecutionPlatform;
  assert.equal(
    platform.identity.id,
    "ASSISTANT-8:6/ExecutiveActionExecutionPlatform",
  );
  assert.equal(
    platform.identity.namespace,
    "nexora.assistant.executive-action-execution.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.identity.status, "Platform");
  assert.equal(platform.identity.stage, "ReadyForCertification");
  assert.equal(platform.identity.canonical, true);
  assert.equal(platform.identity.mutable, false);
  assert.equal(
    platform.identity.sourceManifest,
    "ASSISTANT-8:5/ExecutiveActionExecutionManifest",
  );
  assert.equal(platform.status, "Platform");
  assert.equal(platform.stage, "ReadyForCertification");
  assert.equal(platform.readinessStatus, "ReadyForCertification");
});

test("ASSISTANT-8:6 publishes capabilities, 18 guarantees, and 12 extensions", () => {
  const platform = ExecutiveActionExecutionPlatform;
  assert.equal(platform.capabilities.length, 10);
  assert.equal(platform.guarantees.length, 18);
  assert.equal(platform.extensions.length, 12);
  assert.equal(platform.compatibility.phases.length, 5);
  assert.equal(platform.statistics.platformCapabilityCount, 10);
  assert.equal(platform.statistics.platformGuaranteeCount, 18);
  assert.equal(platform.statistics.platformExtensionCount, 12);
  assert.deepEqual(
    platform.capabilities.map(({ name }) => name),
    [
      "Executive Action Execution",
      "Execution Progress Tracking",
      "Execution State Management",
      "Execution Health Visibility",
      "Execution Feedback Management",
      "Execution Exception Representation",
      "Execution Checkpoint Representation",
      "Execution Summary Publication",
      "Execution Timeline Representation",
      "Platform Metadata Publication",
    ],
  );
  assert.deepEqual(
    platform.guarantees.map(({ name }) => name),
    [
      "Canonical Identity",
      "Immutable Metadata",
      "Deterministic Structure",
      "Manifest Compatibility",
      "Validation Compatibility",
      "Registry Compatibility",
      "Foundation Compatibility",
      "Stable Contracts",
      "Stable Models",
      "Stable Relationships",
      "Stable Lifecycle",
      "Stable Policies",
      "Inventory Integrity",
      "Metadata Completeness",
      "Consumer Consistency",
      "Extension Safety",
      "Version Consistency",
      "Platform Stability",
    ],
  );
  assert.deepEqual(
    platform.extensions.map(({ name }) => name),
    [
      "Execution Types",
      "Execution States",
      "Progress Types",
      "Exception Types",
      "Feedback Types",
      "Health Indicators",
      "Checkpoint Types",
      "Summary Types",
      "Policy Extensions",
      "Metadata Extensions",
      "Relationship Extensions",
      "Future Platform Extensions",
    ],
  );
  assert.deepEqual(
    platform.compatibility.phases.map(({ name }) => name),
    [
      "ASSISTANT-8:1 Foundation",
      "ASSISTANT-8:2 Registry",
      "ASSISTANT-8:3 Model",
      "ASSISTANT-8:4 Validation",
      "ASSISTANT-8:5 Manifest",
    ],
  );
  assert.deepEqual([...platform.readiness.declarations], [
    "ReadyForCertification",
    "Canonical",
    "Deterministic",
    "Immutable",
    "Metadata Complete",
    "Manifest Derived",
    "Platform Stable",
  ]);
  assert.equal(platform.capabilities.every(Object.isFrozen), true);
  assert.equal(platform.guarantees.every(Object.isFrozen), true);
  assert.equal(platform.extensions.every(Object.isFrozen), true);
  assert.deepEqual(
    platform.guarantees.map(({ order }) => order),
    platform.guarantees.map((_, index) => index + 1),
  );
  assert.deepEqual(
    platform.extensions.map(({ order }) => order),
    platform.extensions.map((_, index) => index + 1),
  );
});

test("ASSISTANT-8:6 derives inventory exclusively from Manifest", () => {
  const platform = ExecutiveActionExecutionPlatform;
  assert.equal(platform.composition.manifest, platform.manifest);
  assert.equal(
    platform.composition.inventory,
    platform.manifest.inventory,
  );
  assert.equal(
    platform.inventory.manifestInventory,
    platform.manifest.inventory,
  );
  assert.equal(
    platform.inventory.manifestTotals,
    platform.manifest.inventory.totals,
  );
  assert.equal(
    platform.inventory.inventoryTotals,
    platform.manifest.inventory.totals,
  );
  assert.equal(
    platform.inventory.validationTotals.ruleCount,
    platform.manifest.inventory.totals.validationRuleCount,
  );
  assert.equal(
    platform.inventory.validationTotals.gateCount,
    platform.manifest.inventory.totals.validationGateCount,
  );
  assert.equal(
    platform.inventory.relationshipTotals.relationshipModelCount,
    platform.manifest.inventory.totals.relationshipModelCount,
  );
  assert.equal(
    platform.inventory.publishedInventoryCount,
    platform.manifest.summary.publishedInventoryCount,
  );
  assert.equal(
    platform.statistics.publishedInventoryCount,
    platform.manifest.summary.publishedInventoryCount,
  );
  assert.equal(platform.inventory.duplicatedDefinitions, false);
  assert.equal(platform.inventory.independentlyMaintainedCounts, false);
  assert.equal(platform.inventory.recalculatedMetadata, false);
  assert.equal(platform.inventory.reconstructedInventories, false);
  assert.equal(platform.canonicalCompositionRuleSatisfied, true);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(platform.inventory), true);
  assert.deepEqual(platform.composition.layers, [
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
  ]);
});

test("ASSISTANT-8:6 consumes Manifest only and forbids runtime behavior", () => {
  const platform = ExecutiveActionExecutionPlatform;
  assert.deepEqual(readImports("executiveActionExecutionPlatform.ts"), [
    "./executiveActionExecutionManifest.ts",
    "./executionPlatformCapabilities.ts",
    "./executionPlatformCompatibility.ts",
    "./executionPlatformExtensions.ts",
    "./executionPlatformGuarantees.ts",
    "./executionPlatformInventory.ts",
    "./executionPlatformMetadata.ts",
  ]);
  for (const fileName of platformModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./executiveActionExecutionManifest.ts"
        || importPath === "./executionPlatformCapabilities.ts"
        || importPath === "./executionPlatformCompatibility.ts"
        || importPath === "./executionPlatformExtensions.ts"
        || importPath === "./executionPlatformGuarantees.ts"
        || importPath === "./executionPlatformInventory.ts"
        || importPath === "./executionPlatformMetadata.ts";
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
        importPath.includes("executiveActionExecutionValidation"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionCertification"),
        false,
      );
    }
  }
  assert.deepEqual(platform.upstreamDependencies, [
    "ASSISTANT-8:5 Executive Action Execution Manifest",
  ]);
  assert.equal(
    platform.manifest.identity.id,
    "ASSISTANT-8:5/ExecutiveActionExecutionManifest",
  );
  assert.deepEqual(platform.publicApiSurface, [
    "ExecutiveActionExecutionPlatform",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.executionEngine, false);
  assert.equal(platform.workflowRuntime, false);
  assert.equal(platform.scheduler, false);
  assert.equal(platform.monitoringServices, false);
  assert.equal(platform.automation, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.orchestration, false);
  assert.equal(platform.apis, false);
  assert.equal(platform.aiReasoning, false);
  assert.equal(platform.ui, false);
  assert.equal(platform.metadataOnly, true);
  assert.equal(platform.immutable, true);
});
