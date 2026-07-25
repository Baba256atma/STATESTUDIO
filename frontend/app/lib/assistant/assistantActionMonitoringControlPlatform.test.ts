import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantActionMonitoringControlPlatform } from "./assistantActionMonitoringControlPlatform.ts";

const files = [
  "assistantActionMonitoringControlPlatform.test.ts",
  "assistantActionMonitoringControlPlatform.ts",
  "assistantActionMonitoringControlPlatformCompatibility.ts",
  "assistantActionMonitoringControlPlatformComposition.ts",
  "assistantActionMonitoringControlPlatformGuarantees.ts",
  "assistantActionMonitoringControlPlatformInventory.ts",
  "assistantActionMonitoringControlPlatformMetadata.ts",
  "assistantActionMonitoringControlPlatformPublic.ts",
];

const platformModuleFiles = [
  "assistantActionMonitoringControlPlatform.ts",
  "assistantActionMonitoringControlPlatformCompatibility.ts",
  "assistantActionMonitoringControlPlatformComposition.ts",
  "assistantActionMonitoringControlPlatformGuarantees.ts",
  "assistantActionMonitoringControlPlatformInventory.ts",
  "assistantActionMonitoringControlPlatformMetadata.ts",
  "assistantActionMonitoringControlPlatformPublic.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-9:6 consists of exactly eight Platform artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-9:6 publishes canonical Platform identity", () => {
  const platform = AssistantActionMonitoringControlPlatform;
  assert.equal(
    platform.identity.id,
    "ASSISTANT-9:6/ExecutiveActionMonitoringControlPlatform",
  );
  assert.equal(
    platform.identity.namespace,
    "nexora.assistant.executive-action-monitoring-control.platform",
  );
  assert.equal(platform.identity.version, "1.0.0");
  assert.equal(platform.identity.status, "Platform");
  assert.equal(platform.identity.stage, "ReadyForCertification");
  assert.equal(platform.identity.readiness, "ReadyForCertification");
  assert.equal(platform.identity.canonical, true);
  assert.equal(platform.identity.mutable, false);
  assert.equal(
    platform.identity.manifestReference,
    "ASSISTANT-9:5/ExecutiveActionMonitoringControlManifest",
  );
  assert.equal(platform.status, "Platform");
  assert.equal(platform.stage, "ReadyForCertification");
  assert.equal(platform.readinessStatus, "ReadyForCertification");
});

test("ASSISTANT-9:6 publishes exactly 18 guarantees and 12 compatibility declarations", () => {
  const platform = AssistantActionMonitoringControlPlatform;
  assert.equal(platform.guarantees.length, 18);
  assert.equal(platform.compatibility.length, 12);
  assert.equal(platform.statistics.platformGuaranteeCount, 18);
  assert.equal(platform.statistics.compatibilityCount, 12);
  assert.deepEqual(
    platform.guarantees.map(({ name }) => name),
    [
      "Metadata-only platform",
      "Immutable composition",
      "Canonical identities",
      "Deterministic ordering",
      "Validation-derived inventories",
      "Manifest-derived composition",
      "No runtime monitoring",
      "No runtime control",
      "No KPI calculations",
      "No scheduling",
      "No persistence",
      "No networking",
      "No AI execution",
      "No rendering",
      "No workflow execution",
      "Certification compatibility",
      "Freeze compatibility",
      "Public Index compatibility",
    ],
  );
  assert.deepEqual(
    platform.compatibility.map(({ name }) => name),
    [
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Manifest",
      "Certification",
      "Freeze",
      "Public Index",
      "TypeScript",
      "ESLint",
      "Canonical Architecture",
      "Nexora Platform Standard",
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
  assert.deepEqual(
    platform.guarantees.map(({ order }) => order),
    platform.guarantees.map((_, index) => index + 1),
  );
  assert.deepEqual(
    platform.compatibility.map(({ order }) => order),
    platform.compatibility.map((_, index) => index + 1),
  );
});

test("ASSISTANT-9:6 derives inventory exclusively from Manifest", () => {
  const platform = AssistantActionMonitoringControlPlatform;
  const manifest = platform.manifest;
  assert.equal(platform.composition.manifest, manifest);
  assert.equal(
    platform.composition.foundation,
    manifest.inventory.foundationInventory,
  );
  assert.equal(
    platform.composition.registry,
    manifest.inventory.registryInventory,
  );
  assert.equal(
    platform.composition.validation,
    manifest.validation,
  );
  assert.equal(
    platform.inventory.foundationInventory,
    manifest.inventory.foundationInventory,
  );
  assert.equal(
    platform.inventory.modelInventory,
    manifest.inventory.modelInventory,
  );
  assert.equal(
    platform.inventory.relationshipInventory,
    manifest.inventory.relationshipInventory,
  );
  assert.equal(
    platform.inventory.capabilityInventory,
    manifest.inventory.capabilityInventory,
  );
  assert.equal(
    platform.inventory.contractInventory,
    manifest.inventory.contractInventory,
  );
  assert.equal(
    platform.inventory.lifecycleInventory,
    manifest.inventory.lifecycleInventory,
  );
  assert.equal(
    platform.inventory.policyInventory,
    manifest.inventory.policyInventory,
  );
  assert.equal(
    platform.inventory.validationInventory,
    manifest.inventory.validationInventory,
  );
  assert.equal(platform.inventory.manifestInventory, manifest.inventory);
  assert.equal(
    platform.inventory.totals.modelKindCount,
    manifest.inventory.totals.modelKindCount,
  );
  assert.equal(
    platform.inventory.totals.relationshipKindCount,
    manifest.inventory.totals.relationshipKindCount,
  );
  assert.equal(
    platform.inventory.totals.validationRuleCount,
    manifest.inventory.totals.validationRuleCount,
  );
  assert.equal(
    platform.inventory.totals.capabilityCount,
    manifest.inventory.totals.capabilityCount,
  );
  assert.equal(
    platform.inventory.totals.contractCount,
    manifest.inventory.totals.contractCount,
  );
  assert.equal(
    platform.inventory.totals.lifecycleStateCount,
    manifest.inventory.totals.lifecycleStateCount,
  );
  assert.equal(
    platform.inventory.totals.policyCount,
    manifest.inventory.totals.policyCount,
  );
  assert.equal(platform.inventory.duplicatedDefinitions, false);
  assert.equal(platform.inventory.independentlyMaintainedCounts, false);
  assert.equal(platform.inventory.recalculatedMetadata, false);
  assert.equal(platform.inventory.reconstructedInventories, false);
  assert.equal(platform.canonicalInventoryRuleSatisfied, true);
  assert.deepEqual(platform.composition.layers, [
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
  ]);
  assert.equal(Object.isFrozen(platform), true);
  assert.equal(Object.isFrozen(platform.inventory), true);
});

test("ASSISTANT-9:6 consumes Manifest only and forbids runtime behavior", () => {
  const platform = AssistantActionMonitoringControlPlatform;
  assert.deepEqual(
    readImports("assistantActionMonitoringControlPlatform.ts"),
    [
      "./assistantActionMonitoringControlManifest.ts",
      "./assistantActionMonitoringControlPlatformComposition.ts",
      "./assistantActionMonitoringControlPlatformCompatibility.ts",
      "./assistantActionMonitoringControlPlatformGuarantees.ts",
      "./assistantActionMonitoringControlPlatformInventory.ts",
      "./assistantActionMonitoringControlPlatformMetadata.ts",
      "./assistantActionMonitoringControlPlatformPublic.ts",
    ],
  );
  for (const fileName of platformModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./assistantActionMonitoringControlManifest.ts"
        || importPath === "./assistantActionMonitoringControlPlatform.ts"
        || importPath
          === "./assistantActionMonitoringControlPlatformComposition.ts"
        || importPath
          === "./assistantActionMonitoringControlPlatformCompatibility.ts"
        || importPath
          === "./assistantActionMonitoringControlPlatformGuarantees.ts"
        || importPath
          === "./assistantActionMonitoringControlPlatformInventory.ts"
        || importPath
          === "./assistantActionMonitoringControlPlatformMetadata.ts"
        || importPath
          === "./assistantActionMonitoringControlPlatformPublic.ts";
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
        importPath.includes("assistantActionMonitoringControlValidation"),
        false,
      );
      assert.equal(
        importPath.includes(
          "assistantActionMonitoringControlCertification",
        ),
        false,
      );
    }
  }
  assert.deepEqual(platform.upstreamDependencies, [
    "ASSISTANT-9:5 Executive Action Monitoring & Control Manifest",
  ]);
  assert.equal(
    platform.manifest.identity.id,
    "ASSISTANT-9:5/ExecutiveActionMonitoringControlManifest",
  );
  assert.deepEqual(platform.publicApiSurface, [
    "AssistantActionMonitoringControlPlatform",
  ]);
  assert.equal(platform.runtime, false);
  assert.equal(platform.monitoringRuntime, false);
  assert.equal(platform.controlRuntime, false);
  assert.equal(platform.kpiCalculations, false);
  assert.equal(platform.persistence, false);
  assert.equal(platform.services, false);
  assert.equal(platform.factories, false);
  assert.equal(platform.ui, false);
  assert.equal(platform.metadataOnly, true);
  assert.equal(platform.immutable, true);
});
