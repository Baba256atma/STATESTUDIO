import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveActionExecutionFreeze } from "./executiveActionExecutionFreeze.ts";

const files = [
  "executionFreezeBaselines.ts",
  "executionFreezeCompatibility.ts",
  "executionFreezeExtensions.ts",
  "executionFreezeLock.ts",
  "executionFreezeMetadata.ts",
  "executionFreezeRelease.ts",
  "executiveActionExecutionFreeze.test.ts",
  "executiveActionExecutionFreeze.ts",
];

const freezeModuleFiles = [
  "executionFreezeBaselines.ts",
  "executionFreezeCompatibility.ts",
  "executionFreezeExtensions.ts",
  "executionFreezeLock.ts",
  "executionFreezeMetadata.ts",
  "executionFreezeRelease.ts",
  "executiveActionExecutionFreeze.ts",
] as const;

const readImports = (fileName: string): string[] => {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
  return [...source.matchAll(/from ["'](\.\/[^"']+)["']/g)].map(
    (match) => match[1],
  );
};

test("ASSISTANT-8:8 consists of exactly eight Freeze artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-8:8 publishes canonical Freeze identity and lock", () => {
  const freeze = ExecutiveActionExecutionFreeze;
  assert.equal(
    freeze.identity.id,
    "ASSISTANT-8:8/ExecutiveActionExecutionFreeze",
  );
  assert.equal(
    freeze.identity.namespace,
    "nexora.assistant.executive-action-execution.freeze",
  );
  assert.equal(freeze.identity.version, "1.0.0");
  assert.equal(freeze.identity.status, "Frozen");
  assert.equal(freeze.identity.stage, "ReadyForPublicIndex");
  assert.equal(freeze.identity.canonical, true);
  assert.equal(freeze.identity.mutable, false);
  assert.equal(
    freeze.identity.lockIdentifier,
    "ASSISTANT-8-EXECUTIVE-ACTION-EXECUTION-LOCKED",
  );
  assert.equal(
    freeze.lock.lockIdentifier,
    "ASSISTANT-8-EXECUTIVE-ACTION-EXECUTION-LOCKED",
  );
  assert.equal(
    freeze.release.lockIdentifier,
    "ASSISTANT-8-EXECUTIVE-ACTION-EXECUTION-LOCKED",
  );
  assert.equal(
    freeze.metadata.lockIdentifier,
    "ASSISTANT-8-EXECUTIVE-ACTION-EXECUTION-LOCKED",
  );
  assert.equal(freeze.lock.status, "Locked");
  assert.equal(freeze.lock.mutationAllowed, false);
  assert.equal(freeze.lock.permanent, true);
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.stage, "ReadyForPublicIndex");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
});

test("ASSISTANT-8:8 publishes exactly 8 baselines, compatibility, and extensions", () => {
  const freeze = ExecutiveActionExecutionFreeze;
  assert.equal(freeze.baselines.length, 8);
  assert.equal(freeze.compatibility.length, 8);
  assert.equal(freeze.extensions.length, 8);
  assert.equal(freeze.statistics.baselineCount, 8);
  assert.equal(freeze.statistics.compatibilityCount, 8);
  assert.equal(freeze.statistics.extensionCount, 8);
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
      "Release Baseline",
    ],
  );
  assert.deepEqual(
    freeze.compatibility.map(({ name }) => name),
    [
      "Foundation Compatible",
      "Registry Compatible",
      "Model Compatible",
      "Validation Compatible",
      "Manifest Compatible",
      "Platform Compatible",
      "Certification Compatible",
      "Public Index Ready",
    ],
  );
  assert.deepEqual(
    freeze.extensions.map(({ name }) => name),
    [
      "Execution Extension",
      "Progress Extension",
      "State Extension",
      "Health Extension",
      "Feedback Extension",
      "Exception Extension",
      "Metadata Extension",
      "Future Compatibility Extension",
    ],
  );
  assert.deepEqual([...freeze.guarantees], [
    "canonical",
    "deterministic",
    "immutable",
    "certification-backed",
    "inventory complete",
    "metadata complete",
    "platform compatible",
    "consumer safe",
  ]);
});

test("ASSISTANT-8:8 republishes Certification metadata without reconstruction", () => {
  const freeze = ExecutiveActionExecutionFreeze;
  assert.equal(
    freeze.frozenInventories,
    freeze.certification.platform.inventory,
  );
  assert.equal(
    freeze.frozenPlatformGuarantees,
    freeze.certification.platform.guarantees,
  );
  assert.equal(
    freeze.frozenCertification,
    freeze.certification.results,
  );
  assert.equal(
    freeze.release.frozenInventories,
    freeze.certification.platform.inventory,
  );
  assert.equal(
    freeze.release.frozenGuarantees,
    freeze.certification.platform.guarantees,
  );
  assert.equal(
    freeze.release.certificationResults,
    freeze.certification.results,
  );
  assert.equal(freeze.release.duplicatedDefinitions, false);
  assert.equal(freeze.release.independentlyMaintainedCounts, false);
  assert.equal(freeze.release.reconstructedInventories, false);
  assert.equal(freeze.canonicalFreezeRuleSatisfied, true);
  assert.equal(freeze.release.publicIndexEligibility, "Eligible");
  assert.equal(
    freeze.baselines[0].sourcePhase,
    freeze.certification.platform.manifest.validation.model.registry
      .foundation.identity.id,
  );
  assert.equal(
    freeze.baselines[6].sourcePhase,
    freeze.certification.identity.id,
  );
  assert.equal(Object.isFrozen(freeze), true);
  assert.equal(Object.isFrozen(freeze.lock), true);
  assert.equal(Object.isFrozen(freeze.release), true);
  assert.equal(freeze.baselines.every(Object.isFrozen), true);
  assert.equal(freeze.compatibility.every(Object.isFrozen), true);
  assert.equal(freeze.extensions.every(Object.isFrozen), true);
  assert.deepEqual(
    freeze.baselines.map(({ order }) => order),
    freeze.baselines.map((_, index) => index + 1),
  );
});

test("ASSISTANT-8:8 consumes Certification only and forbids runtime behavior", () => {
  const freeze = ExecutiveActionExecutionFreeze;
  assert.deepEqual(readImports("executiveActionExecutionFreeze.ts"), [
    "./executiveActionExecutionCertification.ts",
    "./executionFreezeBaselines.ts",
    "./executionFreezeCompatibility.ts",
    "./executionFreezeExtensions.ts",
    "./executionFreezeLock.ts",
    "./executionFreezeMetadata.ts",
    "./executionFreezeRelease.ts",
  ]);
  for (const fileName of freezeModuleFiles) {
    const imports = readImports(fileName);
    for (const importPath of imports) {
      const allowed =
        importPath === "./executiveActionExecutionCertification.ts"
        || importPath === "./executionFreezeBaselines.ts"
        || importPath === "./executionFreezeCompatibility.ts"
        || importPath === "./executionFreezeExtensions.ts"
        || importPath === "./executionFreezeLock.ts"
        || importPath === "./executionFreezeMetadata.ts"
        || importPath === "./executionFreezeRelease.ts";
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
        importPath.includes("executiveActionExecutionManifest"),
        false,
      );
      assert.equal(
        importPath.includes("executiveActionExecutionPlatform"),
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
    "ASSISTANT-8:7 Executive Action Execution Certification",
  ]);
  assert.equal(
    freeze.certification.identity.id,
    "ASSISTANT-8:7/ExecutiveActionExecutionCertification",
  );
  assert.deepEqual(freeze.publicApiSurface, [
    "ExecutiveActionExecutionFreeze",
  ]);
  assert.equal(freeze.executableLogic, false);
  assert.equal(freeze.runtime, false);
  assert.equal(freeze.executionEngine, false);
  assert.equal(freeze.workflowRuntime, false);
  assert.equal(freeze.scheduler, false);
  assert.equal(freeze.monitoringServices, false);
  assert.equal(freeze.automation, false);
  assert.equal(freeze.persistence, false);
  assert.equal(freeze.orchestration, false);
  assert.equal(freeze.apis, false);
  assert.equal(freeze.aiReasoning, false);
  assert.equal(freeze.ui, false);
  assert.equal(freeze.metadataOnly, true);
  assert.equal(freeze.immutable, true);
});
