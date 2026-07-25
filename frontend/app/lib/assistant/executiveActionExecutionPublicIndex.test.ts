import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./executiveActionExecutionPublicIndex.ts";
import {
  executiveActionExecutionCompatibility,
  executiveActionExecutionConsumerEntry,
  executiveActionExecutionIdentity,
  executiveActionExecutionMetadata,
  executiveActionExecutionPublicApiCount,
  executiveActionExecutionPublicApiRegistry,
  executiveActionExecutionPublicExports,
  executiveActionExecutionPublicIndex,
  executiveActionExecutionReadiness,
  executiveActionExecutionReleaseInformation,
  executiveActionExecutionStatus,
  executiveActionExecutionVersion,
} from "./executiveActionExecutionPublicIndex.ts";

const files = [
  "executiveActionExecutionPublicIndex.test.ts",
  "executiveActionExecutionPublicIndex.ts",
];

const expectedExports = [
  "executiveActionExecutionCompatibility",
  "executiveActionExecutionConsumerEntry",
  "executiveActionExecutionIdentity",
  "executiveActionExecutionMetadata",
  "executiveActionExecutionPublicApiCount",
  "executiveActionExecutionPublicApiRegistry",
  "executiveActionExecutionPublicExports",
  "executiveActionExecutionPublicIndex",
  "executiveActionExecutionReadiness",
  "executiveActionExecutionReleaseInformation",
  "executiveActionExecutionStatus",
  "executiveActionExecutionVersion",
];

test("ASSISTANT-8:9 consists of exactly two Public Index artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-8:9 publishes exactly twelve immutable public exports", () => {
  assert.deepEqual(Object.keys(publicExports).sort(), expectedExports);
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(executiveActionExecutionPublicExports.length, 12);
  assert.equal(new Set(executiveActionExecutionPublicExports).size, 12);
  assert.equal(executiveActionExecutionMetadata.publicExportCount, 12);
  assert.deepEqual(
    [...executiveActionExecutionPublicExports].sort(),
    expectedExports,
  );
});

test("ASSISTANT-8:9 publishes canonical identity and release readiness", () => {
  assert.equal(
    executiveActionExecutionIdentity.id,
    "ASSISTANT-8:9/ExecutiveActionExecutionPublicIndex",
  );
  assert.equal(
    executiveActionExecutionIdentity.namespace,
    "nexora.assistant.executive-action-execution.public-index",
  );
  assert.equal(executiveActionExecutionVersion, "1.0.0");
  assert.equal(executiveActionExecutionIdentity.version, "1.0.0");
  assert.equal(executiveActionExecutionIdentity.status, "Released");
  assert.equal(executiveActionExecutionIdentity.certification, "Certified");
  assert.equal(executiveActionExecutionIdentity.freeze, "Frozen");
  assert.equal(executiveActionExecutionIdentity.stability, "Stable");
  assert.equal(executiveActionExecutionIdentity.canonical, true);
  assert.equal(executiveActionExecutionIdentity.mutable, false);
  assert.deepEqual(executiveActionExecutionStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  });
  assert.equal(executiveActionExecutionReadiness, "ReadyForConsumer");
  assert.equal(
    executiveActionExecutionIdentity.readiness,
    "ReadyForConsumer",
  );
  assert.deepEqual(executiveActionExecutionReleaseInformation, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
    readiness: "ReadyForConsumer",
    version: "1.0.0",
    lockIdentifier: "ASSISTANT-8-EXECUTIVE-ACTION-EXECUTION-LOCKED",
    sourceFreeze: "ASSISTANT-8:8/ExecutiveActionExecutionFreeze",
    metadataOnly: true,
    immutable: true,
  });
});

test("ASSISTANT-8:9 publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    executiveActionExecutionPublicIndex.namespace.map(
      ({ section }) => section,
    ),
    [
      "Identity",
      "Metadata",
      "Status",
      "Readiness",
      "Compatibility",
      "Public API Registry",
      "Public Exports",
      "Consumer Entry",
      "Release Information",
    ],
  );
  assert.deepEqual(
    executiveActionExecutionPublicIndex.namespace.map(({ order }) => order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(executiveActionExecutionPublicIndex.namespace.length, 9);
  assert.equal(executiveActionExecutionMetadata.namespaceSectionCount, 9);
});

test("ASSISTANT-8:9 derives Public API Registry and count from Freeze only", () => {
  assert.equal(
    executiveActionExecutionPublicApiCount,
    executiveActionExecutionPublicApiRegistry.length,
  );
  assert.equal(
    executiveActionExecutionPublicApiCount,
    executiveActionExecutionPublicIndex.freeze.publicApiSurface.length,
  );
  assert.equal(
    executiveActionExecutionMetadata.publicApiCount,
    executiveActionExecutionPublicApiRegistry.length,
  );
  assert.equal(
    new Set(
      executiveActionExecutionPublicApiRegistry.map(
        ({ apiIdentifier }) => apiIdentifier,
      ),
    ).size,
    executiveActionExecutionPublicApiRegistry.length,
  );
  assert.deepEqual(
    executiveActionExecutionPublicApiRegistry.map(({ order }) => order),
    executiveActionExecutionPublicApiRegistry.map((_, index) => index + 1),
  );
  assert.equal(
    executiveActionExecutionPublicApiRegistry.every(({ sourcePhase }) =>
      sourcePhase === "ASSISTANT-8:8/ExecutiveActionExecutionFreeze"),
    true,
  );
  assert.equal(
    Object.isFrozen(executiveActionExecutionPublicApiRegistry),
    true,
  );
  assert.equal(
    executiveActionExecutionCompatibility.freezeCompatible,
    true,
  );
  assert.equal(
    executiveActionExecutionCompatibility.sourceFreeze,
    "ASSISTANT-8:8/ExecutiveActionExecutionFreeze",
  );
  assert.equal(
    executiveActionExecutionCompatibility.freezeCompatibility,
    executiveActionExecutionPublicIndex.freeze.compatibility,
  );
  assert.equal(
    executiveActionExecutionMetadata.canonicalInventoryRuleSatisfied,
    true,
  );
});

test("ASSISTANT-8:9 declares the sole consumer entry", () => {
  assert.equal(
    executiveActionExecutionConsumerEntry.file,
    "executiveActionExecutionPublicIndex.ts",
  );
  assert.equal(
    executiveActionExecutionConsumerEntry
      .directArchitecturalImportsPermitted,
    false,
  );
  assert.equal(
    executiveActionExecutionMetadata.consumerEntry,
    "executiveActionExecutionPublicIndex.ts",
  );
  assert.equal(
    executiveActionExecutionPublicIndex.freeze.identity.id,
    "ASSISTANT-8:8/ExecutiveActionExecutionFreeze",
  );
  assert.equal(
    executiveActionExecutionIdentity.sourceFreeze,
    "ASSISTANT-8:8/ExecutiveActionExecutionFreeze",
  );
  assert.equal(
    executiveActionExecutionIdentity.lockIdentifier,
    "ASSISTANT-8-EXECUTIVE-ACTION-EXECUTION-LOCKED",
  );
  assert.deepEqual(
    [...executiveActionExecutionConsumerEntry.prohibitedDirectImports],
    [
      "ASSISTANT-8:1 Executive Action Execution Foundation",
      "ASSISTANT-8:2 Executive Action Execution Registry",
      "ASSISTANT-8:3 Executive Action Execution Model",
      "ASSISTANT-8:4 Executive Action Execution Validation",
      "ASSISTANT-8:5 Executive Action Execution Manifest",
      "ASSISTANT-8:6 Executive Action Execution Platform",
      "ASSISTANT-8:7 Executive Action Execution Certification",
      "ASSISTANT-8:8 Executive Action Execution Freeze",
    ],
  );
});

test("ASSISTANT-8:9 imports only Freeze and has no prohibited dependencies", () => {
  const source = readFileSync(
    new URL("./executiveActionExecutionPublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { ExecutiveActionExecutionFreeze } from "./executiveActionExecutionFreeze.ts";',
  ]);
  assert.equal(
    source.includes("executiveActionExecutionFoundation"),
    false,
  );
  assert.equal(
    source.includes("executiveActionExecutionRegistry"),
    false,
  );
  assert.equal(source.includes("executiveActionExecutionModel"), false);
  assert.equal(
    source.includes("executiveActionExecutionValidation"),
    false,
  );
  assert.equal(
    source.includes("executiveActionExecutionManifest"),
    false,
  );
  assert.equal(
    source.includes("executiveActionExecutionPlatform"),
    false,
  );
  assert.equal(
    source.includes("executiveActionExecutionCertification"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanning"),
    false,
  );
  assert.equal(
    /from ["']\.\/executiveActionExecution(?!Freeze\.ts["'])/
      .test(source),
    false,
  );
  assert.deepEqual(
    executiveActionExecutionPublicIndex.upstreamDependencies,
    ["ASSISTANT-8:8 Executive Action Execution Freeze"],
  );
  assert.equal(executiveActionExecutionPublicIndex.runtime, false);
  assert.equal(executiveActionExecutionPublicIndex.executionEngine, false);
  assert.equal(executiveActionExecutionPublicIndex.services, false);
  assert.equal(executiveActionExecutionPublicIndex.persistence, false);
  assert.equal(executiveActionExecutionPublicIndex.orchestration, false);
  assert.equal(Object.isFrozen(executiveActionExecutionIdentity), true);
  assert.equal(Object.isFrozen(executiveActionExecutionMetadata), true);
  assert.equal(Object.isFrozen(executiveActionExecutionPublicIndex), true);
  assert.equal(
    Object.isFrozen(executiveActionExecutionPublicIndex.namespace),
    true,
  );
});
