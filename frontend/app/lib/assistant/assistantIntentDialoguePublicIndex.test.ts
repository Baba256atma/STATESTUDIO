import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./assistantIntentDialoguePublicIndex.ts";
import {
  assistantIntentDialogueConsumerEntry,
  assistantIntentDialogueFreezeReference,
  assistantIntentDialoguePublicApiCount,
  assistantIntentDialoguePublicApiRegistry,
  assistantIntentDialoguePublicCompatibility,
  assistantIntentDialoguePublicExports,
  assistantIntentDialoguePublicIndexIdentity,
  assistantIntentDialoguePublicIndexMetadata,
  assistantIntentDialoguePublicIndexNamespace,
  assistantIntentDialoguePublicIndexReadiness,
  assistantIntentDialoguePublicIndexStatus,
  assistantIntentDialoguePublicIndexVersion,
} from "./assistantIntentDialoguePublicIndex.ts";

const files = [
  "assistantIntentDialoguePublicIndex.test.ts",
  "assistantIntentDialoguePublicIndex.ts",
];

const expectedExports = [
  "assistantIntentDialogueConsumerEntry",
  "assistantIntentDialogueFreezeReference",
  "assistantIntentDialoguePublicApiCount",
  "assistantIntentDialoguePublicApiRegistry",
  "assistantIntentDialoguePublicCompatibility",
  "assistantIntentDialoguePublicExports",
  "assistantIntentDialoguePublicIndexIdentity",
  "assistantIntentDialoguePublicIndexMetadata",
  "assistantIntentDialoguePublicIndexNamespace",
  "assistantIntentDialoguePublicIndexReadiness",
  "assistantIntentDialoguePublicIndexStatus",
  "assistantIntentDialoguePublicIndexVersion",
];

test("ASSISTANT-3:9 consists of exactly two Public Index artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-3:9 publishes exactly twelve immutable public exports", () => {
  assert.deepEqual(Object.keys(publicExports).sort(), expectedExports);
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(assistantIntentDialoguePublicExports.length, 12);
  assert.equal(new Set(assistantIntentDialoguePublicExports).size, 12);
  assert.equal(
    assistantIntentDialoguePublicIndexMetadata.publicExportCount,
    12,
  );
});

test("ASSISTANT-3:9 publishes canonical identity, namespace, and version", () => {
  assert.equal(
    assistantIntentDialoguePublicIndexIdentity.id,
    "ASSISTANT-3:9/IntentDialogueUnderstandingPublicIndex",
  );
  assert.equal(
    assistantIntentDialoguePublicIndexIdentity.namespace,
    "nexora.assistant.intent-dialogue.public-index",
  );
  assert.equal(assistantIntentDialoguePublicIndexVersion, "1.0.0");
  assert.equal(assistantIntentDialoguePublicIndexIdentity.version, "1.0.0");
});

test("ASSISTANT-3:9 publishes release status and readiness", () => {
  assert.deepEqual(assistantIntentDialoguePublicIndexStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  });
  assert.equal(
    assistantIntentDialoguePublicIndexReadiness,
    "ReadyForConsumer",
  );
  assert.equal(
    assistantIntentDialoguePublicIndexIdentity.readiness,
    "ReadyForConsumer",
  );
});

test("ASSISTANT-3:9 publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    assistantIntentDialoguePublicIndexNamespace.map(({ section }) => section),
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
    assistantIntentDialoguePublicIndexNamespace.map(({ order }) => order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(assistantIntentDialoguePublicIndexNamespace.length, 9);
  assert.equal(
    assistantIntentDialoguePublicIndexMetadata.namespaceSectionCount,
    9,
  );
});

test("ASSISTANT-3:9 derives Public API Registry and count from Freeze only", () => {
  assert.equal(
    assistantIntentDialoguePublicApiCount,
    assistantIntentDialoguePublicApiRegistry.length,
  );
  assert.equal(
    assistantIntentDialoguePublicApiCount,
    assistantIntentDialogueFreezeReference.publicApiSurface.length,
  );
  assert.equal(
    assistantIntentDialoguePublicIndexMetadata.publicApiCount,
    assistantIntentDialoguePublicApiRegistry.length,
  );
  assert.equal(
    new Set(
      assistantIntentDialoguePublicApiRegistry.map(({ apiIdentifier }) =>
        apiIdentifier
      ),
    ).size,
    assistantIntentDialoguePublicApiRegistry.length,
  );
  assert.deepEqual(
    assistantIntentDialoguePublicApiRegistry.map(({ order }) => order),
    assistantIntentDialoguePublicApiRegistry.map((_, index) => index + 1),
  );
  assert.equal(
    assistantIntentDialoguePublicApiRegistry.every(
      ({ sourcePhase }) =>
        sourcePhase === "ASSISTANT-3:8/IntentDialogueUnderstandingFreeze",
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantIntentDialoguePublicApiRegistry),
    true,
  );
  assert.equal(
    assistantIntentDialoguePublicCompatibility,
    assistantIntentDialogueFreezeReference.compatibility,
  );
});

test("ASSISTANT-3:9 declares the sole consumer entry", () => {
  assert.equal(
    assistantIntentDialogueConsumerEntry.file,
    "assistantIntentDialoguePublicIndex.ts",
  );
  assert.equal(
    assistantIntentDialogueConsumerEntry.directArchitecturalImportsPermitted,
    false,
  );
  assert.equal(
    assistantIntentDialoguePublicIndexMetadata.consumerEntry,
    "assistantIntentDialoguePublicIndex.ts",
  );
  assert.equal(
    assistantIntentDialogueFreezeReference.identity.id,
    "ASSISTANT-3:8/IntentDialogueUnderstandingFreeze",
  );
  assert.equal(
    assistantIntentDialoguePublicIndexIdentity.sourceFreeze,
    "ASSISTANT-3:8/IntentDialogueUnderstandingFreeze",
  );
  assert.equal(
    assistantIntentDialoguePublicIndexIdentity.lockIdentifier,
    "ASSISTANT-3-INTENT-DIALOGUE-UNDERSTANDING-LOCKED",
  );
});

test("ASSISTANT-3:9 imports only Freeze and has no prohibited dependencies", () => {
  const source = readFileSync(
    new URL("./assistantIntentDialoguePublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { AssistantIntentDialogueFreeze } from "./assistantIntentDialogueFreeze.ts";',
  ]);
  assert.equal(source.includes("assistantIntentDialogueFoundation"), false);
  assert.equal(source.includes("assistantIntentDialogueRegistry"), false);
  assert.equal(source.includes("assistantIntentDialogueModel"), false);
  assert.equal(source.includes("assistantIntentDialogueValidation"), false);
  assert.equal(source.includes("assistantIntentDialogueManifest"), false);
  assert.equal(source.includes("assistantIntentDialoguePlatform"), false);
  assert.equal(
    source.includes("assistantIntentDialogueCertification"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.equal(
    /from ["']\.\/assistantIntentDialogue(?!Freeze\.ts["'])/.test(source),
    false,
  );
  assert.equal(
    Object.isFrozen(assistantIntentDialoguePublicIndexIdentity),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantIntentDialoguePublicIndexMetadata),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantIntentDialoguePublicIndexNamespace),
    true,
  );
});
