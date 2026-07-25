import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./assistantObjectContextManagementPublicIndex.ts";
import {
  assistantObjectContextManagementConsumerEntry,
  assistantObjectContextManagementFreezeReference,
  assistantObjectContextManagementPublicApiCount,
  assistantObjectContextManagementPublicApiRegistry,
  assistantObjectContextManagementPublicCompatibility,
  assistantObjectContextManagementPublicExports,
  assistantObjectContextManagementPublicIndexIdentity,
  assistantObjectContextManagementPublicIndexMetadata,
  assistantObjectContextManagementPublicIndexNamespace,
  assistantObjectContextManagementPublicIndexReadiness,
  assistantObjectContextManagementPublicIndexStatus,
  assistantObjectContextManagementPublicIndexVersion,
} from "./assistantObjectContextManagementPublicIndex.ts";

const files = [
  "assistantObjectContextManagementPublicIndex.test.ts",
  "assistantObjectContextManagementPublicIndex.ts",
];

const expectedExports = [
  "assistantObjectContextManagementConsumerEntry",
  "assistantObjectContextManagementFreezeReference",
  "assistantObjectContextManagementPublicApiCount",
  "assistantObjectContextManagementPublicApiRegistry",
  "assistantObjectContextManagementPublicCompatibility",
  "assistantObjectContextManagementPublicExports",
  "assistantObjectContextManagementPublicIndexIdentity",
  "assistantObjectContextManagementPublicIndexMetadata",
  "assistantObjectContextManagementPublicIndexNamespace",
  "assistantObjectContextManagementPublicIndexReadiness",
  "assistantObjectContextManagementPublicIndexStatus",
  "assistantObjectContextManagementPublicIndexVersion",
];

test("ASSISTANT-6:9 consists of exactly two Public Index artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-6:9 publishes exactly twelve immutable public exports", () => {
  assert.deepEqual(Object.keys(publicExports).sort(), expectedExports);
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(assistantObjectContextManagementPublicExports.length, 12);
  assert.equal(
    new Set(assistantObjectContextManagementPublicExports).size,
    12,
  );
  assert.equal(
    assistantObjectContextManagementPublicIndexMetadata.publicExportCount,
    12,
  );
});

test("ASSISTANT-6:9 publishes canonical identity, namespace, and version", () => {
  assert.equal(
    assistantObjectContextManagementPublicIndexIdentity.id,
    "ASSISTANT-6:9/ObjectContextManagementPublicIndex",
  );
  assert.equal(
    assistantObjectContextManagementPublicIndexIdentity.namespace,
    "nexora.assistant.object-context-management.public-index",
  );
  assert.equal(assistantObjectContextManagementPublicIndexVersion, "1.0.0");
  assert.equal(
    assistantObjectContextManagementPublicIndexIdentity.version,
    "1.0.0",
  );
});

test("ASSISTANT-6:9 publishes release status and readiness", () => {
  assert.deepEqual(assistantObjectContextManagementPublicIndexStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  });
  assert.equal(
    assistantObjectContextManagementPublicIndexReadiness,
    "ReadyForConsumer",
  );
  assert.equal(
    assistantObjectContextManagementPublicIndexIdentity.readiness,
    "ReadyForConsumer",
  );
});

test("ASSISTANT-6:9 publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    assistantObjectContextManagementPublicIndexNamespace.map(
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
    assistantObjectContextManagementPublicIndexNamespace.map(
      ({ order }) => order,
    ),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(
    assistantObjectContextManagementPublicIndexNamespace.length,
    9,
  );
  assert.equal(
    assistantObjectContextManagementPublicIndexMetadata
      .namespaceSectionCount,
    9,
  );
});

test("ASSISTANT-6:9 derives Public API Registry and count from Freeze only", () => {
  assert.equal(
    assistantObjectContextManagementPublicApiCount,
    assistantObjectContextManagementPublicApiRegistry.length,
  );
  assert.equal(
    assistantObjectContextManagementPublicApiCount,
    assistantObjectContextManagementFreezeReference.publicApiSurface.length,
  );
  assert.equal(
    assistantObjectContextManagementPublicIndexMetadata.publicApiCount,
    assistantObjectContextManagementPublicApiRegistry.length,
  );
  assert.equal(
    new Set(
      assistantObjectContextManagementPublicApiRegistry.map(
        ({ apiIdentifier }) => apiIdentifier,
      ),
    ).size,
    assistantObjectContextManagementPublicApiRegistry.length,
  );
  assert.deepEqual(
    assistantObjectContextManagementPublicApiRegistry.map(
      ({ order }) => order,
    ),
    assistantObjectContextManagementPublicApiRegistry.map(
      (_, index) => index + 1,
    ),
  );
  assert.equal(
    assistantObjectContextManagementPublicApiRegistry.every(
      ({ sourcePhase }) =>
        sourcePhase === "ASSISTANT-6:8/ObjectContextManagementFreeze",
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantObjectContextManagementPublicApiRegistry),
    true,
  );
  assert.equal(
    assistantObjectContextManagementPublicCompatibility,
    assistantObjectContextManagementFreezeReference.compatibility,
  );
});

test("ASSISTANT-6:9 declares the sole consumer entry", () => {
  assert.equal(
    assistantObjectContextManagementConsumerEntry.file,
    "assistantObjectContextManagementPublicIndex.ts",
  );
  assert.equal(
    assistantObjectContextManagementConsumerEntry
      .directArchitecturalImportsPermitted,
    false,
  );
  assert.equal(
    assistantObjectContextManagementPublicIndexMetadata.consumerEntry,
    "assistantObjectContextManagementPublicIndex.ts",
  );
  assert.equal(
    assistantObjectContextManagementFreezeReference.identity.id,
    "ASSISTANT-6:8/ObjectContextManagementFreeze",
  );
  assert.equal(
    assistantObjectContextManagementPublicIndexIdentity.sourceFreeze,
    "ASSISTANT-6:8/ObjectContextManagementFreeze",
  );
  assert.equal(
    assistantObjectContextManagementPublicIndexIdentity.lockIdentifier,
    "ASSISTANT-6-OBJECT-CONTEXT-MANAGEMENT-LOCKED",
  );
});

test("ASSISTANT-6:9 imports only Freeze and has no prohibited dependencies", () => {
  const source = readFileSync(
    new URL(
      "./assistantObjectContextManagementPublicIndex.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { AssistantObjectContextManagementFreeze } from "./assistantObjectContextManagementFreeze.ts";',
  ]);
  assert.equal(
    source.includes("assistantObjectContextManagementFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementModel"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementManifest"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementPlatform"),
    false,
  );
  assert.equal(
    source.includes("assistantObjectContextManagementCertification"),
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
    /from ["']\.\/assistantObjectContextManagement(?!Freeze\.ts["'])/
      .test(source),
    false,
  );
  assert.equal(
    Object.isFrozen(assistantObjectContextManagementPublicIndexIdentity),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantObjectContextManagementPublicIndexMetadata),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantObjectContextManagementPublicIndexNamespace),
    true,
  );
});
