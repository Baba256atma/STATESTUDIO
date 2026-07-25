import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { AssistantActionMonitoringControlFreeze } from "./assistantActionMonitoringControlFreeze.ts";

const files = [
  "assistantActionMonitoringControlFreeze.test.ts",
  "assistantActionMonitoringControlFreeze.ts",
  "assistantActionMonitoringControlFreezeCompatibility.ts",
  "assistantActionMonitoringControlFreezeInventory.ts",
  "assistantActionMonitoringControlFreezeLock.ts",
  "assistantActionMonitoringControlFreezeMetadata.ts",
  "assistantActionMonitoringControlFreezePlatform.ts",
  "assistantActionMonitoringControlFreezePublicApi.ts",
];

const freezeModuleFiles = [
  "assistantActionMonitoringControlFreeze.ts",
  "assistantActionMonitoringControlFreezeCompatibility.ts",
  "assistantActionMonitoringControlFreezeInventory.ts",
  "assistantActionMonitoringControlFreezeLock.ts",
  "assistantActionMonitoringControlFreezeMetadata.ts",
  "assistantActionMonitoringControlFreezePlatform.ts",
  "assistantActionMonitoringControlFreezePublicApi.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-9:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-9:8 publishes canonical Freeze identity and lock", () => {
  const freeze = AssistantActionMonitoringControlFreeze;
  assert.equal(
    freeze.identity.id,
    "ASSISTANT-9:8/ExecutiveActionMonitoringControlFreeze",
  );
  assert.equal(
    freeze.identity.namespace,
    "nexora.assistant.executive-action-monitoring-control.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.identity.status, "Frozen");
  assert.equal(freeze.identity.stage, "ReadyForPublicIndex");
  assert.equal(freeze.identity.readiness, "ReadyForPublicIndex");
  assert.equal(freeze.identity.canonical, true);
  assert.equal(freeze.identity.mutable, false);
  assert.equal(
    freeze.identity.freezeLockId,
    "ASSISTANT-9-MONITORING-CONTROL-LOCKED",
  );
  assert.equal(
    freeze.lock.lockIdentifier,
    "ASSISTANT-9-MONITORING-CONTROL-LOCKED",
  );
  assert.equal(
    freeze.metadata.freezeLockId,
    "ASSISTANT-9-MONITORING-CONTROL-LOCKED",
  );
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(freeze.lock.permanent, true);
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.stage, "ReadyForPublicIndex");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
  assert.deepEqual([...freeze.release.declarations], [
    "Frozen",
    "ReadyForPublicIndex",
  ]);
});

test("ASSISTANT-9:8 publishes baselines, locks, and compatibility", () => {
  const freeze = AssistantActionMonitoringControlFreeze;
  assert.equal(freeze.baselines.length, 8);
  assert.equal(freeze.architecturalLocks.length, 12);
  assert.equal(freeze.compatibility.length, 8);
  assert.equal(freeze.statistics.baselineCount, 8);
  assert.equal(freeze.statistics.architecturalLockCount, 12);
  assert.equal(freeze.statistics.compatibilityCount, 8);
  assert.deepEqual(
    freeze.baselines.map(({ name }) => name),
    [
      "Foundation Baseline",
      "Registry Baseline",
      "Model Baseline",
      "Validation Baseline",
      "Manifest Baseline",
      "Platform Baseline",
      "Certification Baseline",
      "Freeze Baseline",
    ],
  );
  assert.deepEqual(
    freeze.architecturalLocks.map(({ name }) => name),
    [
      "Foundation Integrity",
      "Registry Integrity",
      "Model Integrity",
      "Validation Integrity",
      "Manifest Integrity",
      "Platform Integrity",
      "Certification Integrity",
      "Metadata Immutability",
      "Deterministic Ordering",
      "Runtime Exclusion",
      "Consumer Boundary",
      "Public API Stability",
    ],
  );
  assert.deepEqual(
    freeze.compatibility.map(({ name }) => name),
    [
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Manifest",
      "Platform",
      "Certification",
      "Public Index",
    ],
  );
});

test("ASSISTANT-9:8 republishes Platform inventories without recalculation", () => {
  const freeze = AssistantActionMonitoringControlFreeze;
  const platformInventory = freeze.certification.platform.inventory;
  assert.equal(
    freeze.frozenPlatformInventory,
    platformInventory,
  );
  assert.equal(
    freeze.inventory.foundationInventory,
    platformInventory.foundationInventory,
  );
  assert.equal(
    freeze.inventory.registryInventory,
    platformInventory.registryInventory,
  );
  assert.equal(
    freeze.inventory.modelInventory,
    platformInventory.modelInventory,
  );
  assert.equal(
    freeze.inventory.relationshipInventory,
    platformInventory.relationshipInventory,
  );
  assert.equal(
    freeze.inventory.capabilityInventory,
    platformInventory.capabilityInventory,
  );
  assert.equal(
    freeze.inventory.contractInventory,
    platformInventory.contractInventory,
  );
  assert.equal(
    freeze.inventory.lifecycleInventory,
    platformInventory.lifecycleInventory,
  );
  assert.equal(
    freeze.inventory.policyInventory,
    platformInventory.policyInventory,
  );
  assert.equal(
    freeze.inventory.validationInventory,
    platformInventory.validationInventory,
  );
  assert.equal(
    freeze.inventory.manifestInventory,
    platformInventory.manifestInventory,
  );
  assert.equal(freeze.inventory.platformInventory, platformInventory);
  assert.equal(freeze.inventory.totals, platformInventory.totals);
  assert.equal(
    freeze.inventory.certificationInventory.criteria,
    freeze.certification.criteria,
  );
  assert.equal(freeze.inventory.duplicatedDefinitions, false);
  assert.equal(freeze.inventory.independentlyMaintainedCounts, false);
  assert.equal(freeze.inventory.recalculatedMetadata, false);
  assert.equal(freeze.inventory.reconstructedInventories, false);
  assert.equal(freeze.canonicalFreezeRuleSatisfied, true);
  assert.equal(
    freeze.publicApi.publicApiInventory.length,
    freeze.certification.platform.publicApiSurface.length,
  );
  assert.equal(
    freeze.publicApi.consumerEntryDeclaration.file,
    "assistantActionMonitoringControlPublicIndex.ts",
  );
  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(freeze.lock), true);
  assert.equal(Object.isFrozen(freeze.inventory), true);
});

test("ASSISTANT-9:8 consumes Certification only and forbids runtime behavior", () => {
  const freeze = AssistantActionMonitoringControlFreeze;
  assert.deepEqual(
    readImports("assistantActionMonitoringControlFreeze.ts"),
    [
      "./assistantActionMonitoringControlCertification.ts",
      "./assistantActionMonitoringControlFreezeCompatibility.ts",
      "./assistantActionMonitoringControlFreezeInventory.ts",
      "./assistantActionMonitoringControlFreezeLock.ts",
      "./assistantActionMonitoringControlFreezeMetadata.ts",
      "./assistantActionMonitoringControlFreezePlatform.ts",
      "./assistantActionMonitoringControlFreezePublicApi.ts",
    ],
  );
  for (const fileName of freezeModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath
          === "./assistantActionMonitoringControlCertification.ts"
        || importPath === "./assistantActionMonitoringControlFreeze.ts"
        || importPath
          === "./assistantActionMonitoringControlFreezeCompatibility.ts"
        || importPath
          === "./assistantActionMonitoringControlFreezeInventory.ts"
        || importPath
          === "./assistantActionMonitoringControlFreezeLock.ts"
        || importPath
          === "./assistantActionMonitoringControlFreezeMetadata.ts"
        || importPath
          === "./assistantActionMonitoringControlFreezePlatform.ts"
        || importPath
          === "./assistantActionMonitoringControlFreezePublicApi.ts";
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
        importPath.includes("assistantActionMonitoringControlManifest"),
        false,
      );
      assert.equal(
        importPath.includes("assistantActionMonitoringControlPlatform"),
        false,
      );
      assert.equal(
        importPath.includes("PublicIndex")
          || importPath.includes("publicIndex"),
        false,
      );
    }
  }
  assert.deepEqual(freeze.upstreamDependencies, [
    "ASSISTANT-9:7 Executive Action Monitoring & Control Certification",
  ]);
  assert.equal(
    freeze.certification.identity.id,
    "ASSISTANT-9:7/ExecutiveActionMonitoringControlCertification",
  );
  assert.deepEqual(freeze.publicApiSurface, [
    "AssistantActionMonitoringControlFreeze",
  ]);
  assert.equal(freeze.executableLogic, false);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.monitoringRuntime, false);
  assert.equal(freeze.controlRuntime, false);
  assert.equal(freeze.kpiCalculations, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.services, false);
  assert.equal(freeze.factories, false);
  assert.equal(freeze.ui, false);
  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
});
