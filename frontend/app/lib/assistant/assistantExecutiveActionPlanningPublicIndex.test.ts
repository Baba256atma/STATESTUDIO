import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./assistantExecutiveActionPlanningPublicIndex.ts";
import {
  assistantExecutiveActionPlanningConsumerEntry,
  assistantExecutiveActionPlanningFreezeReference,
  assistantExecutiveActionPlanningPublicApiCount,
  assistantExecutiveActionPlanningPublicApiRegistry,
  assistantExecutiveActionPlanningPublicCompatibility,
  assistantExecutiveActionPlanningPublicExports,
  assistantExecutiveActionPlanningPublicIndexIdentity,
  assistantExecutiveActionPlanningPublicIndexMetadata,
  assistantExecutiveActionPlanningPublicIndexNamespace,
  assistantExecutiveActionPlanningPublicIndexReadiness,
  assistantExecutiveActionPlanningPublicIndexStatus,
  assistantExecutiveActionPlanningPublicIndexVersion,
} from "./assistantExecutiveActionPlanningPublicIndex.ts";

const files = [
  "assistantExecutiveActionPlanningPublicIndex.test.ts",
  "assistantExecutiveActionPlanningPublicIndex.ts",
];

const expectedExports = [
  "assistantExecutiveActionPlanningConsumerEntry",
  "assistantExecutiveActionPlanningFreezeReference",
  "assistantExecutiveActionPlanningPublicApiCount",
  "assistantExecutiveActionPlanningPublicApiRegistry",
  "assistantExecutiveActionPlanningPublicCompatibility",
  "assistantExecutiveActionPlanningPublicExports",
  "assistantExecutiveActionPlanningPublicIndexIdentity",
  "assistantExecutiveActionPlanningPublicIndexMetadata",
  "assistantExecutiveActionPlanningPublicIndexNamespace",
  "assistantExecutiveActionPlanningPublicIndexReadiness",
  "assistantExecutiveActionPlanningPublicIndexStatus",
  "assistantExecutiveActionPlanningPublicIndexVersion",
];

test("ASSISTANT-7:9 consists of exactly two Public Index artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-7:9 publishes exactly twelve immutable public exports", () => {
  assert.deepEqual(Object.keys(publicExports).sort(), expectedExports);
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(assistantExecutiveActionPlanningPublicExports.length, 12);
  assert.equal(
    new Set(assistantExecutiveActionPlanningPublicExports).size,
    12,
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexMetadata.publicExportCount,
    12,
  );
});

test("ASSISTANT-7:9 publishes canonical identity, namespace, and version", () => {
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexIdentity.id,
    "ASSISTANT-7:9/ExecutiveActionPlanningPublicIndex",
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexIdentity.namespace,
    "nexora.assistant.executive-action-planning.public-index",
  );
  assert.equal(assistantExecutiveActionPlanningPublicIndexVersion, "1.0.0");
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexIdentity.version,
    "1.0.0",
  );
});

test("ASSISTANT-7:9 publishes release status and readiness", () => {
  assert.deepEqual(assistantExecutiveActionPlanningPublicIndexStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  });
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexReadiness,
    "ReadyForConsumer",
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexIdentity.readiness,
    "ReadyForConsumer",
  );
});

test("ASSISTANT-7:9 publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    assistantExecutiveActionPlanningPublicIndexNamespace.map(
      ({ section }) => section,
    ),
    [
      "Identity",
      "Metadata",
      "Namespace",
      "Version",
      "Status",
      "Readiness",
      "Public API Registry",
      "Consumer Entry",
      "Freeze Reference",
    ],
  );
  assert.deepEqual(
    assistantExecutiveActionPlanningPublicIndexNamespace.map(
      ({ order }) => order,
    ),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexNamespace.length,
    9,
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexMetadata
      .namespaceSectionCount,
    9,
  );
});

test("ASSISTANT-7:9 derives Public API Registry and count from Freeze only", () => {
  assert.equal(
    assistantExecutiveActionPlanningPublicApiCount,
    assistantExecutiveActionPlanningPublicApiRegistry.length,
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicApiCount,
    assistantExecutiveActionPlanningFreezeReference.publicApiSurface.length,
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexMetadata.publicApiCount,
    assistantExecutiveActionPlanningPublicApiRegistry.length,
  );
  assert.equal(
    new Set(
      assistantExecutiveActionPlanningPublicApiRegistry.map(
        ({ apiIdentifier }) => apiIdentifier,
      ),
    ).size,
    assistantExecutiveActionPlanningPublicApiRegistry.length,
  );
  assert.deepEqual(
    assistantExecutiveActionPlanningPublicApiRegistry.map(
      ({ order }) => order,
    ),
    assistantExecutiveActionPlanningPublicApiRegistry.map(
      (_, index) => index + 1,
    ),
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicApiRegistry.every(
      ({ sourcePhase }) =>
        sourcePhase === "ASSISTANT-7:8/ExecutiveActionPlanningFreeze",
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveActionPlanningPublicApiRegistry),
    true,
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicCompatibility.freezeCompatible,
    true,
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicCompatibility.freezeCompatibility,
    assistantExecutiveActionPlanningFreezeReference.compatibility,
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexMetadata
      .canonicalInventoryRuleSatisfied,
    true,
  );
});

test("ASSISTANT-7:9 declares the sole consumer entry", () => {
  assert.equal(
    assistantExecutiveActionPlanningConsumerEntry.file,
    "assistantExecutiveActionPlanningPublicIndex.ts",
  );
  assert.equal(
    assistantExecutiveActionPlanningConsumerEntry
      .directArchitecturalImportsPermitted,
    false,
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexMetadata.consumerEntry,
    "assistantExecutiveActionPlanningPublicIndex.ts",
  );
  assert.equal(
    assistantExecutiveActionPlanningFreezeReference.identity.id,
    "ASSISTANT-7:8/ExecutiveActionPlanningFreeze",
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexIdentity.sourceFreeze,
    "ASSISTANT-7:8/ExecutiveActionPlanningFreeze",
  );
  assert.equal(
    assistantExecutiveActionPlanningPublicIndexIdentity.lockIdentifier,
    "ASSISTANT-7-EXECUTIVE-ACTION-PLANNING-LOCKED",
  );
});

test("ASSISTANT-7:9 imports only Freeze and has no prohibited dependencies", () => {
  const source = readFileSync(
    new URL(
      "./assistantExecutiveActionPlanningPublicIndex.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { AssistantExecutiveActionPlanningFreeze } from "./assistantExecutiveActionPlanningFreeze.ts";',
  ]);
  assert.equal(
    source.includes("assistantExecutiveActionPlanningFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningModel"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningManifest"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningPlatform"),
    false,
  );
  assert.equal(
    source.includes("assistantExecutiveActionPlanningCertification"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagement"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestration"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.equal(
    /from ["']\.\/assistantExecutiveActionPlanning(?!Freeze\.ts["'])/
      .test(source),
    false,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveActionPlanningPublicIndexIdentity),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveActionPlanningPublicIndexMetadata),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveActionPlanningPublicIndexNamespace),
    true,
  );
});
