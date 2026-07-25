import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./assistantConversationPublicIndex.ts";
import {
  assistantConversationConsumerEntry,
  assistantConversationFreezeReference,
  assistantConversationPublicApiCount,
  assistantConversationPublicApiRegistry,
  assistantConversationPublicCompatibility,
  assistantConversationPublicExports,
  assistantConversationPublicIndexIdentity,
  assistantConversationPublicIndexMetadata,
  assistantConversationPublicIndexNamespace,
  assistantConversationPublicIndexReadiness,
  assistantConversationPublicIndexStatus,
  assistantConversationPublicIndexVersion,
} from "./assistantConversationPublicIndex.ts";

const files = [
  "assistantConversationPublicIndex.test.ts",
  "assistantConversationPublicIndex.ts",
];

const expectedExports = [
  "assistantConversationConsumerEntry",
  "assistantConversationFreezeReference",
  "assistantConversationPublicApiCount",
  "assistantConversationPublicApiRegistry",
  "assistantConversationPublicCompatibility",
  "assistantConversationPublicExports",
  "assistantConversationPublicIndexIdentity",
  "assistantConversationPublicIndexMetadata",
  "assistantConversationPublicIndexNamespace",
  "assistantConversationPublicIndexReadiness",
  "assistantConversationPublicIndexStatus",
  "assistantConversationPublicIndexVersion",
];

test("ASSISTANT-1:9 consists of exactly two Public Index artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-1:9 publishes exactly twelve immutable public exports", () => {
  assert.deepEqual(Object.keys(publicExports).sort(), expectedExports);
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(assistantConversationPublicExports.length, 12);
  assert.equal(new Set(assistantConversationPublicExports).size, 12);
  assert.equal(
    assistantConversationPublicIndexMetadata.publicExportCount,
    12,
  );
});

test("ASSISTANT-1:9 publishes canonical identity, namespace, and version", () => {
  assert.equal(
    assistantConversationPublicIndexIdentity.id,
    "ASSISTANT-1:9/ConversationPublicIndex",
  );
  assert.equal(
    assistantConversationPublicIndexIdentity.namespace,
    "nexora.assistant.conversation.public-index",
  );
  assert.equal(assistantConversationPublicIndexVersion, "1.0.0");
  assert.equal(assistantConversationPublicIndexIdentity.version, "1.0.0");
});

test("ASSISTANT-1:9 publishes release status and readiness", () => {
  assert.deepEqual(assistantConversationPublicIndexStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  });
  assert.equal(assistantConversationPublicIndexReadiness, "ReadyForConsumer");
  assert.equal(
    assistantConversationPublicIndexIdentity.readiness,
    "ReadyForConsumer",
  );
});

test("ASSISTANT-1:9 publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    assistantConversationPublicIndexNamespace.map(({ section }) => section),
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
    assistantConversationPublicIndexNamespace.map(({ order }) => order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(assistantConversationPublicIndexNamespace.length, 9);
  assert.equal(
    assistantConversationPublicIndexMetadata.namespaceSectionCount,
    9,
  );
});

test("ASSISTANT-1:9 derives Public API Registry and count from Freeze only", () => {
  assert.equal(
    assistantConversationPublicApiCount,
    assistantConversationPublicApiRegistry.length,
  );
  assert.equal(
    assistantConversationPublicApiCount,
    assistantConversationFreezeReference.publicApiSurface.length,
  );
  assert.equal(
    assistantConversationPublicIndexMetadata.publicApiCount,
    assistantConversationPublicApiRegistry.length,
  );
  assert.equal(
    new Set(
      assistantConversationPublicApiRegistry.map(({ apiIdentifier }) =>
        apiIdentifier
      ),
    ).size,
    assistantConversationPublicApiRegistry.length,
  );
  assert.deepEqual(
    assistantConversationPublicApiRegistry.map(({ order }) => order),
    assistantConversationPublicApiRegistry.map((_, index) => index + 1),
  );
  assert.equal(
    assistantConversationPublicApiRegistry.every(
      ({ sourcePhase }) => sourcePhase === "ASSISTANT-1:8/ConversationFreeze",
    ),
    true,
  );
  assert.equal(Object.isFrozen(assistantConversationPublicApiRegistry), true);
  assert.equal(
    assistantConversationPublicCompatibility,
    assistantConversationFreezeReference.compatibility,
  );
});

test("ASSISTANT-1:9 declares the sole consumer entry", () => {
  assert.equal(
    assistantConversationConsumerEntry.file,
    "assistantConversationPublicIndex.ts",
  );
  assert.equal(
    assistantConversationConsumerEntry.directArchitecturalImportsPermitted,
    false,
  );
  assert.equal(
    assistantConversationPublicIndexMetadata.consumerEntry,
    "assistantConversationPublicIndex.ts",
  );
  assert.equal(
    assistantConversationFreezeReference.identity.id,
    "ASSISTANT-1:8/ConversationFreeze",
  );
  assert.equal(
    assistantConversationPublicIndexIdentity.sourceFreeze,
    "ASSISTANT-1:8/ConversationFreeze",
  );
});

test("ASSISTANT-1:9 imports only Freeze and has no prohibited dependencies", () => {
  const source = readFileSync(
    new URL("./assistantConversationPublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { AssistantConversationFreeze } from "./assistantConversationFreeze.ts";',
  ]);
  assert.equal(source.includes("assistantConversationFoundation"), false);
  assert.equal(source.includes("assistantConversationRegistry"), false);
  assert.equal(source.includes("assistantConversationModel"), false);
  assert.equal(source.includes("assistantConversationValidation"), false);
  assert.equal(source.includes("assistantConversationManifest"), false);
  assert.equal(source.includes("assistantConversationPlatform"), false);
  assert.equal(source.includes("assistantConversationCertification"), false);
  assert.equal(
    /from ["']\.\/assistantConversation(?!Freeze\.ts["'])/.test(source),
    false,
  );
  assert.equal(
    Object.isFrozen(assistantConversationPublicIndexIdentity),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantConversationPublicIndexMetadata),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantConversationPublicIndexNamespace),
    true,
  );
});
