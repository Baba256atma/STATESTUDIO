import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./assistantExecutiveMemoryPublicIndex.ts";
import {
  assistantExecutiveMemoryConsumerEntry,
  assistantExecutiveMemoryFreezeReference,
  assistantExecutiveMemoryPublicApiCount,
  assistantExecutiveMemoryPublicApiRegistry,
  assistantExecutiveMemoryPublicCompatibility,
  assistantExecutiveMemoryPublicExports,
  assistantExecutiveMemoryPublicIndexIdentity,
  assistantExecutiveMemoryPublicIndexMetadata,
  assistantExecutiveMemoryPublicIndexNamespace,
  assistantExecutiveMemoryPublicIndexReadiness,
  assistantExecutiveMemoryPublicIndexStatus,
  assistantExecutiveMemoryPublicIndexVersion,
} from "./assistantExecutiveMemoryPublicIndex.ts";

const files = [
  "assistantExecutiveMemoryPublicIndex.test.ts",
  "assistantExecutiveMemoryPublicIndex.ts",
];

const expectedExports = [
  "assistantExecutiveMemoryConsumerEntry",
  "assistantExecutiveMemoryFreezeReference",
  "assistantExecutiveMemoryPublicApiCount",
  "assistantExecutiveMemoryPublicApiRegistry",
  "assistantExecutiveMemoryPublicCompatibility",
  "assistantExecutiveMemoryPublicExports",
  "assistantExecutiveMemoryPublicIndexIdentity",
  "assistantExecutiveMemoryPublicIndexMetadata",
  "assistantExecutiveMemoryPublicIndexNamespace",
  "assistantExecutiveMemoryPublicIndexReadiness",
  "assistantExecutiveMemoryPublicIndexStatus",
  "assistantExecutiveMemoryPublicIndexVersion",
];

test("ASSISTANT-2:9 consists of exactly two Public Index artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-2:9 publishes exactly twelve immutable public exports", () => {
  assert.deepEqual(Object.keys(publicExports).sort(), expectedExports);
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(assistantExecutiveMemoryPublicExports.length, 12);
  assert.equal(new Set(assistantExecutiveMemoryPublicExports).size, 12);
  assert.equal(
    assistantExecutiveMemoryPublicIndexMetadata.publicExportCount,
    12,
  );
});

test("ASSISTANT-2:9 publishes canonical identity, namespace, and version", () => {
  assert.equal(
    assistantExecutiveMemoryPublicIndexIdentity.id,
    "ASSISTANT-2:9/ExecutiveMemoryPublicIndex",
  );
  assert.equal(
    assistantExecutiveMemoryPublicIndexIdentity.namespace,
    "nexora.assistant.executive-memory.public-index",
  );
  assert.equal(assistantExecutiveMemoryPublicIndexVersion, "1.0.0");
  assert.equal(assistantExecutiveMemoryPublicIndexIdentity.version, "1.0.0");
});

test("ASSISTANT-2:9 publishes release status and readiness", () => {
  assert.deepEqual(assistantExecutiveMemoryPublicIndexStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  });
  assert.equal(
    assistantExecutiveMemoryPublicIndexReadiness,
    "ReadyForConsumer",
  );
  assert.equal(
    assistantExecutiveMemoryPublicIndexIdentity.readiness,
    "ReadyForConsumer",
  );
});

test("ASSISTANT-2:9 publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    assistantExecutiveMemoryPublicIndexNamespace.map(({ section }) => section),
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
    assistantExecutiveMemoryPublicIndexNamespace.map(({ order }) => order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(assistantExecutiveMemoryPublicIndexNamespace.length, 9);
  assert.equal(
    assistantExecutiveMemoryPublicIndexMetadata.namespaceSectionCount,
    9,
  );
});

test("ASSISTANT-2:9 derives Public API Registry and count from Freeze only", () => {
  assert.equal(
    assistantExecutiveMemoryPublicApiCount,
    assistantExecutiveMemoryPublicApiRegistry.length,
  );
  assert.equal(
    assistantExecutiveMemoryPublicApiCount,
    assistantExecutiveMemoryFreezeReference.publicApiSurface.length,
  );
  assert.equal(
    assistantExecutiveMemoryPublicIndexMetadata.publicApiCount,
    assistantExecutiveMemoryPublicApiRegistry.length,
  );
  assert.equal(
    new Set(
      assistantExecutiveMemoryPublicApiRegistry.map(({ apiIdentifier }) =>
        apiIdentifier
      ),
    ).size,
    assistantExecutiveMemoryPublicApiRegistry.length,
  );
  assert.deepEqual(
    assistantExecutiveMemoryPublicApiRegistry.map(({ order }) => order),
    assistantExecutiveMemoryPublicApiRegistry.map((_, index) => index + 1),
  );
  assert.equal(
    assistantExecutiveMemoryPublicApiRegistry.every(
      ({ sourcePhase }) =>
        sourcePhase === "ASSISTANT-2:8/ExecutiveMemoryFreeze",
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveMemoryPublicApiRegistry),
    true,
  );
  assert.equal(
    assistantExecutiveMemoryPublicCompatibility,
    assistantExecutiveMemoryFreezeReference.compatibility,
  );
});

test("ASSISTANT-2:9 declares the sole consumer entry", () => {
  assert.equal(
    assistantExecutiveMemoryConsumerEntry.file,
    "assistantExecutiveMemoryPublicIndex.ts",
  );
  assert.equal(
    assistantExecutiveMemoryConsumerEntry.directArchitecturalImportsPermitted,
    false,
  );
  assert.equal(
    assistantExecutiveMemoryPublicIndexMetadata.consumerEntry,
    "assistantExecutiveMemoryPublicIndex.ts",
  );
  assert.equal(
    assistantExecutiveMemoryFreezeReference.identity.id,
    "ASSISTANT-2:8/ExecutiveMemoryFreeze",
  );
  assert.equal(
    assistantExecutiveMemoryPublicIndexIdentity.sourceFreeze,
    "ASSISTANT-2:8/ExecutiveMemoryFreeze",
  );
});

test("ASSISTANT-2:9 imports only Freeze and has no prohibited dependencies", () => {
  const source = readFileSync(
    new URL("./assistantExecutiveMemoryPublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { AssistantExecutiveMemoryFreeze } from "./assistantExecutiveMemoryFreeze.ts";',
  ]);
  assert.equal(source.includes("assistantExecutiveMemoryFoundation"), false);
  assert.equal(source.includes("assistantExecutiveMemoryRegistry"), false);
  assert.equal(source.includes("assistantExecutiveMemoryModel"), false);
  assert.equal(source.includes("assistantExecutiveMemoryValidation"), false);
  assert.equal(source.includes("assistantExecutiveMemoryManifest"), false);
  assert.equal(source.includes("assistantExecutiveMemoryPlatform"), false);
  assert.equal(
    source.includes("assistantExecutiveMemoryCertification"),
    false,
  );
  assert.equal(source.includes("assistantConversation"), false);
  assert.equal(
    /from ["']\.\/assistantExecutiveMemory(?!Freeze\.ts["'])/.test(source),
    false,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveMemoryPublicIndexIdentity),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveMemoryPublicIndexMetadata),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveMemoryPublicIndexNamespace),
    true,
  );
});
