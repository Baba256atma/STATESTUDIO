import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./assistantActionMonitoringControlPublicIndex.ts";
import {
  assistantActionMonitoringControlPublicIndex,
  consumerEntryPoint,
  platformReference,
  publicApiRegistry,
  publicApiSurface,
  publicIndexId,
  publicIndexName,
  publicIndexNamespace,
  publicIndexReadiness,
  publicIndexStatus,
  publicIndexVersion,
  releaseMetadata,
} from "./assistantActionMonitoringControlPublicIndex.ts";

const files = [
  "assistantActionMonitoringControlPublicIndex.test.ts",
  "assistantActionMonitoringControlPublicIndex.ts",
];

const expectedExports = [
  "assistantActionMonitoringControlPublicIndex",
  "consumerEntryPoint",
  "platformReference",
  "publicApiRegistry",
  "publicApiSurface",
  "publicIndexId",
  "publicIndexName",
  "publicIndexNamespace",
  "publicIndexReadiness",
  "publicIndexStatus",
  "publicIndexVersion",
  "releaseMetadata",
];

test("ASSISTANT-9:9 consists of exactly two Public Index artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-9:9 publishes exactly twelve immutable public exports", () => {
  assert.deepEqual(Object.keys(publicExports).sort(), expectedExports);
  assert.equal(Object.keys(publicExports).length, publicApiSurface.length);
  assert.equal(publicApiSurface.length, 12);
  assert.equal(new Set(publicApiSurface).size, 12);
  assert.equal(
    assistantActionMonitoringControlPublicIndex.publicExportCount,
    publicApiSurface.length,
  );
  assert.deepEqual([...publicApiSurface].sort(), expectedExports);
});

test("ASSISTANT-9:9 publishes canonical identity and release readiness", () => {
  assert.equal(
    publicIndexId,
    "ASSISTANT-9:9/ExecutiveActionMonitoringControlPublicIndex",
  );
  assert.equal(
    publicIndexName,
    "Assistant Executive Action Monitoring & Control Public Index",
  );
  assert.equal(
    publicIndexNamespace,
    "nexora.assistant.executive-action-monitoring-control.public-index",
  );
  assert.equal(publicIndexVersion, "1.0.0");
  assert.deepEqual(publicIndexStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  });
  assert.equal(publicIndexReadiness, "ReadyForConsumer");
  assert.equal(
    assistantActionMonitoringControlPublicIndex.identity.id,
    publicIndexId,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.identity.namespace,
    publicIndexNamespace,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.identity.readiness,
    "ReadyForConsumer",
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.soleConsumerEntryPoint,
    true,
  );
  assert.deepEqual(releaseMetadata, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
    readiness: "ReadyForConsumer",
    version: "1.0.0",
    lockIdentifier: "ASSISTANT-9-MONITORING-CONTROL-LOCKED",
    sourceFreeze: "ASSISTANT-9:8/ExecutiveActionMonitoringControlFreeze",
    metadataOnly: true,
    immutable: true,
  });
  assert.equal(
    platformReference.lockIdentifier,
    "ASSISTANT-9-MONITORING-CONTROL-LOCKED",
  );
});

test("ASSISTANT-9:9 publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    assistantActionMonitoringControlPublicIndex.namespace.map(
      ({ section }) => section,
    ),
    [
      "Identity",
      "Release Information",
      "Consumer Entry",
      "Public Metadata",
      "Platform Reference",
      "Compatibility",
      "Public API Registry",
      "Statistics",
      "Release Declaration",
    ],
  );
  assert.deepEqual(
    assistantActionMonitoringControlPublicIndex.namespace.map(
      ({ order }) => order,
    ),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.namespace.length,
    9,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.namespaceSectionCount,
    assistantActionMonitoringControlPublicIndex.namespace.length,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.statistics
      .namespaceSectionCount,
    assistantActionMonitoringControlPublicIndex.namespace.length,
  );
});

test("ASSISTANT-9:9 derives Public API Registry exclusively from Freeze", () => {
  const freeze = assistantActionMonitoringControlPublicIndex.freeze;
  assert.equal(
    publicApiRegistry.length,
    freeze.publicApiSurface.length,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.publicApiCount,
    publicApiRegistry.length,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.statistics.publicApiCount,
    freeze.publicApiSurface.length,
  );
  assert.deepEqual(
    publicApiRegistry.map(({ exportName }) => exportName),
    [...freeze.publicApiSurface],
  );
  assert.deepEqual(
    publicApiRegistry.map(({ apiIdentifier }) => apiIdentifier),
    [...freeze.publicApiSurface],
  );
  assert.deepEqual(
    publicApiRegistry.map(({ order }) => order),
    publicApiRegistry.map((_, index) => index + 1),
  );
  assert.equal(
    publicApiRegistry.every(({ sourcePhase }) =>
      sourcePhase === "ASSISTANT-9:8/ExecutiveActionMonitoringControlFreeze"),
    true,
  );
  assert.equal(Object.isFrozen(publicApiRegistry), true);
  assert.equal(
    assistantActionMonitoringControlPublicIndex.compatibility
      .freezeCompatible,
    true,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.compatibility
      .freezeCompatibility,
    freeze.compatibility,
  );
});

test("ASSISTANT-9:9 declares the sole consumer entry", () => {
  assert.equal(
    consumerEntryPoint.file,
    "assistantActionMonitoringControlPublicIndex.ts",
  );
  assert.equal(consumerEntryPoint.declaration, "SoleConsumerEntryPoint");
  assert.equal(
    consumerEntryPoint.supportedImport,
    "assistantActionMonitoringControlPublicIndex",
  );
  assert.equal(
    consumerEntryPoint.directArchitecturalImportsPermitted,
    false,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.freeze.identity.id,
    "ASSISTANT-9:8/ExecutiveActionMonitoringControlFreeze",
  );
  assert.deepEqual(
    [...consumerEntryPoint.prohibitedDirectImports],
    [
      "ASSISTANT-9:1 Executive Action Monitoring & Control Foundation",
      "ASSISTANT-9:2 Executive Action Monitoring & Control Registry",
      "ASSISTANT-9:3 Executive Action Monitoring & Control Model",
      "ASSISTANT-9:4 Executive Action Monitoring & Control Validation",
      "ASSISTANT-9:5 Executive Action Monitoring & Control Manifest",
      "ASSISTANT-9:6 Executive Action Monitoring & Control Platform",
      "ASSISTANT-9:7 Executive Action Monitoring & Control Certification",
      "ASSISTANT-9:8 Executive Action Monitoring & Control Freeze",
    ],
  );
});

test("ASSISTANT-9:9 imports only Freeze and has no prohibited dependencies", () => {
  const source = readFileSync(
    new URL(
      "./assistantActionMonitoringControlPublicIndex.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { AssistantActionMonitoringControlFreeze } from "./assistantActionMonitoringControlFreeze.ts";',
  ]);
  assert.equal(
    source.includes("assistantActionMonitoringControlFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantActionMonitoringControlRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantActionMonitoringControlModel"),
    false,
  );
  assert.equal(
    source.includes("assistantActionMonitoringControlValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantActionMonitoringControlManifest"),
    false,
  );
  assert.equal(
    source.includes("assistantActionMonitoringControlPlatform"),
    false,
  );
  assert.equal(
    source.includes("assistantActionMonitoringControlCertification"),
    false,
  );
  assert.equal(
    /from ["']\.\/assistantActionMonitoringControl(?!Freeze\.ts["'])/
      .test(source),
    false,
  );
  assert.deepEqual(
    assistantActionMonitoringControlPublicIndex.upstreamDependencies,
    ["ASSISTANT-9:8 Executive Action Monitoring & Control Freeze"],
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.runtime,
    false,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.monitoringRuntime,
    false,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.controlRuntime,
    false,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.kpiCalculations,
    false,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.persistence,
    false,
  );
  assert.equal(
    assistantActionMonitoringControlPublicIndex.services,
    false,
  );
  assert.equal(
    Object.isFrozen(assistantActionMonitoringControlPublicIndex),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantActionMonitoringControlPublicIndex.namespace),
    true,
  );
});
