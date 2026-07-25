import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./assistantExecutiveGuidancePublicIndex.ts";
import {
  assistantExecutiveGuidanceConsumerEntry,
  assistantExecutiveGuidanceFreezeReference,
  assistantExecutiveGuidancePublicApiCount,
  assistantExecutiveGuidancePublicApiRegistry,
  assistantExecutiveGuidancePublicCompatibility,
  assistantExecutiveGuidancePublicExports,
  assistantExecutiveGuidancePublicIndexIdentity,
  assistantExecutiveGuidancePublicIndexMetadata,
  assistantExecutiveGuidancePublicIndexNamespace,
  assistantExecutiveGuidancePublicIndexReadiness,
  assistantExecutiveGuidancePublicIndexStatus,
  assistantExecutiveGuidancePublicIndexVersion,
} from "./assistantExecutiveGuidancePublicIndex.ts";

const files = [
  "assistantExecutiveGuidancePublicIndex.test.ts",
  "assistantExecutiveGuidancePublicIndex.ts",
];

const expectedExports = [
  "assistantExecutiveGuidanceConsumerEntry",
  "assistantExecutiveGuidanceFreezeReference",
  "assistantExecutiveGuidancePublicApiCount",
  "assistantExecutiveGuidancePublicApiRegistry",
  "assistantExecutiveGuidancePublicCompatibility",
  "assistantExecutiveGuidancePublicExports",
  "assistantExecutiveGuidancePublicIndexIdentity",
  "assistantExecutiveGuidancePublicIndexMetadata",
  "assistantExecutiveGuidancePublicIndexNamespace",
  "assistantExecutiveGuidancePublicIndexReadiness",
  "assistantExecutiveGuidancePublicIndexStatus",
  "assistantExecutiveGuidancePublicIndexVersion",
];

test("ASSISTANT-4:9 consists of exactly two Public Index artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-4:9 publishes exactly twelve immutable public exports", () => {
  assert.deepEqual(Object.keys(publicExports).sort(), expectedExports);
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(assistantExecutiveGuidancePublicExports.length, 12);
  assert.equal(new Set(assistantExecutiveGuidancePublicExports).size, 12);
  assert.equal(
    assistantExecutiveGuidancePublicIndexMetadata.publicExportCount,
    12,
  );
});

test("ASSISTANT-4:9 publishes canonical identity, namespace, and version", () => {
  assert.equal(
    assistantExecutiveGuidancePublicIndexIdentity.id,
    "ASSISTANT-4:9/ExecutiveGuidancePublicIndex",
  );
  assert.equal(
    assistantExecutiveGuidancePublicIndexIdentity.namespace,
    "nexora.assistant.executive-guidance.public-index",
  );
  assert.equal(assistantExecutiveGuidancePublicIndexVersion, "1.0.0");
  assert.equal(assistantExecutiveGuidancePublicIndexIdentity.version, "1.0.0");
});

test("ASSISTANT-4:9 publishes release status and readiness", () => {
  assert.deepEqual(assistantExecutiveGuidancePublicIndexStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  });
  assert.equal(
    assistantExecutiveGuidancePublicIndexReadiness,
    "ReadyForConsumer",
  );
  assert.equal(
    assistantExecutiveGuidancePublicIndexIdentity.readiness,
    "ReadyForConsumer",
  );
});

test("ASSISTANT-4:9 publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    assistantExecutiveGuidancePublicIndexNamespace.map(
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
    assistantExecutiveGuidancePublicIndexNamespace.map(({ order }) => order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(assistantExecutiveGuidancePublicIndexNamespace.length, 9);
  assert.equal(
    assistantExecutiveGuidancePublicIndexMetadata.namespaceSectionCount,
    9,
  );
});

test("ASSISTANT-4:9 derives Public API Registry and count from Freeze only", () => {
  assert.equal(
    assistantExecutiveGuidancePublicApiCount,
    assistantExecutiveGuidancePublicApiRegistry.length,
  );
  assert.equal(
    assistantExecutiveGuidancePublicApiCount,
    assistantExecutiveGuidanceFreezeReference.publicApiSurface.length,
  );
  assert.equal(
    assistantExecutiveGuidancePublicIndexMetadata.publicApiCount,
    assistantExecutiveGuidancePublicApiRegistry.length,
  );
  assert.equal(
    new Set(
      assistantExecutiveGuidancePublicApiRegistry.map(({ apiIdentifier }) =>
        apiIdentifier
      ),
    ).size,
    assistantExecutiveGuidancePublicApiRegistry.length,
  );
  assert.deepEqual(
    assistantExecutiveGuidancePublicApiRegistry.map(({ order }) => order),
    assistantExecutiveGuidancePublicApiRegistry.map((_, index) => index + 1),
  );
  assert.equal(
    assistantExecutiveGuidancePublicApiRegistry.every(
      ({ sourcePhase }) =>
        sourcePhase === "ASSISTANT-4:8/ExecutiveGuidanceFreeze",
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveGuidancePublicApiRegistry),
    true,
  );
  assert.equal(
    assistantExecutiveGuidancePublicCompatibility,
    assistantExecutiveGuidanceFreezeReference.compatibility,
  );
});

test("ASSISTANT-4:9 declares the sole consumer entry", () => {
  assert.equal(
    assistantExecutiveGuidanceConsumerEntry.file,
    "assistantExecutiveGuidancePublicIndex.ts",
  );
  assert.equal(
    assistantExecutiveGuidanceConsumerEntry
      .directArchitecturalImportsPermitted,
    false,
  );
  assert.equal(
    assistantExecutiveGuidancePublicIndexMetadata.consumerEntry,
    "assistantExecutiveGuidancePublicIndex.ts",
  );
  assert.equal(
    assistantExecutiveGuidanceFreezeReference.identity.id,
    "ASSISTANT-4:8/ExecutiveGuidanceFreeze",
  );
  assert.equal(
    assistantExecutiveGuidancePublicIndexIdentity.sourceFreeze,
    "ASSISTANT-4:8/ExecutiveGuidanceFreeze",
  );
  assert.equal(
    assistantExecutiveGuidancePublicIndexIdentity.lockIdentifier,
    "ASSISTANT-4-EXECUTIVE-GUIDANCE-LOCKED",
  );
});

test("ASSISTANT-4:9 imports only Freeze and has no prohibited dependencies", () => {
  const source = readFileSync(
    new URL("./assistantExecutiveGuidancePublicIndex.ts", import.meta.url),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { AssistantExecutiveGuidanceFreeze } from "./assistantExecutiveGuidanceFreeze.ts";',
  ]);
  assert.equal(
    source.includes("assistantExecutiveGuidanceFoundation"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidanceRegistry"), false);
  assert.equal(source.includes("assistantExecutiveGuidanceModel"), false);
  assert.equal(
    source.includes("assistantExecutiveGuidanceValidation"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidanceManifest"), false);
  assert.equal(source.includes("assistantExecutiveGuidancePlatform"), false);
  assert.equal(
    source.includes("assistantExecutiveGuidanceCertification"),
    false,
  );
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.equal(
    /from ["']\.\/assistantExecutiveGuidance(?!Freeze\.ts["'])/.test(source),
    false,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveGuidancePublicIndexIdentity),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveGuidancePublicIndexMetadata),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantExecutiveGuidancePublicIndexNamespace),
    true,
  );
});
