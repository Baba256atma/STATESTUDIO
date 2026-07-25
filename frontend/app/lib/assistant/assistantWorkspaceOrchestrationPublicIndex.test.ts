import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import * as publicExports from "./assistantWorkspaceOrchestrationPublicIndex.ts";
import {
  assistantWorkspaceOrchestrationConsumerEntry,
  assistantWorkspaceOrchestrationFreezeReference,
  assistantWorkspaceOrchestrationPublicApiCount,
  assistantWorkspaceOrchestrationPublicApiRegistry,
  assistantWorkspaceOrchestrationPublicCompatibility,
  assistantWorkspaceOrchestrationPublicExports,
  assistantWorkspaceOrchestrationPublicIndexIdentity,
  assistantWorkspaceOrchestrationPublicIndexMetadata,
  assistantWorkspaceOrchestrationPublicIndexNamespace,
  assistantWorkspaceOrchestrationPublicIndexReadiness,
  assistantWorkspaceOrchestrationPublicIndexStatus,
  assistantWorkspaceOrchestrationPublicIndexVersion,
} from "./assistantWorkspaceOrchestrationPublicIndex.ts";

const files = [
  "assistantWorkspaceOrchestrationPublicIndex.test.ts",
  "assistantWorkspaceOrchestrationPublicIndex.ts",
];

const expectedExports = [
  "assistantWorkspaceOrchestrationConsumerEntry",
  "assistantWorkspaceOrchestrationFreezeReference",
  "assistantWorkspaceOrchestrationPublicApiCount",
  "assistantWorkspaceOrchestrationPublicApiRegistry",
  "assistantWorkspaceOrchestrationPublicCompatibility",
  "assistantWorkspaceOrchestrationPublicExports",
  "assistantWorkspaceOrchestrationPublicIndexIdentity",
  "assistantWorkspaceOrchestrationPublicIndexMetadata",
  "assistantWorkspaceOrchestrationPublicIndexNamespace",
  "assistantWorkspaceOrchestrationPublicIndexReadiness",
  "assistantWorkspaceOrchestrationPublicIndexStatus",
  "assistantWorkspaceOrchestrationPublicIndexVersion",
];

test("ASSISTANT-5:9 consists of exactly two Public Index artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("ASSISTANT-5:9 publishes exactly twelve immutable public exports", () => {
  assert.deepEqual(Object.keys(publicExports).sort(), expectedExports);
  assert.equal(Object.keys(publicExports).length, 12);
  assert.equal(assistantWorkspaceOrchestrationPublicExports.length, 12);
  assert.equal(
    new Set(assistantWorkspaceOrchestrationPublicExports).size,
    12,
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexMetadata.publicExportCount,
    12,
  );
});

test("ASSISTANT-5:9 publishes canonical identity, namespace, and version", () => {
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexIdentity.id,
    "ASSISTANT-5:9/WorkspaceOrchestrationPublicIndex",
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexIdentity.namespace,
    "nexora.assistant.workspace-orchestration.public-index",
  );
  assert.equal(assistantWorkspaceOrchestrationPublicIndexVersion, "1.0.0");
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexIdentity.version,
    "1.0.0",
  );
});

test("ASSISTANT-5:9 publishes release status and readiness", () => {
  assert.deepEqual(assistantWorkspaceOrchestrationPublicIndexStatus, {
    release: "Released",
    certification: "Certified",
    freeze: "Frozen",
    stability: "Stable",
  });
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexReadiness,
    "ReadyForConsumer",
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexIdentity.readiness,
    "ReadyForConsumer",
  );
});

test("ASSISTANT-5:9 publishes exactly nine ordered namespace sections", () => {
  assert.deepEqual(
    assistantWorkspaceOrchestrationPublicIndexNamespace.map(
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
    assistantWorkspaceOrchestrationPublicIndexNamespace.map(
      ({ order }) => order,
    ),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
  assert.equal(assistantWorkspaceOrchestrationPublicIndexNamespace.length, 9);
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexMetadata.namespaceSectionCount,
    9,
  );
});

test("ASSISTANT-5:9 derives Public API Registry and count from Freeze only", () => {
  assert.equal(
    assistantWorkspaceOrchestrationPublicApiCount,
    assistantWorkspaceOrchestrationPublicApiRegistry.length,
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicApiCount,
    assistantWorkspaceOrchestrationFreezeReference.publicApiSurface.length,
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexMetadata.publicApiCount,
    assistantWorkspaceOrchestrationPublicApiRegistry.length,
  );
  assert.equal(
    new Set(
      assistantWorkspaceOrchestrationPublicApiRegistry.map(
        ({ apiIdentifier }) => apiIdentifier,
      ),
    ).size,
    assistantWorkspaceOrchestrationPublicApiRegistry.length,
  );
  assert.deepEqual(
    assistantWorkspaceOrchestrationPublicApiRegistry.map(({ order }) => order),
    assistantWorkspaceOrchestrationPublicApiRegistry.map(
      (_, index) => index + 1,
    ),
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicApiRegistry.every(
      ({ sourcePhase }) =>
        sourcePhase === "ASSISTANT-5:8/WorkspaceOrchestrationFreeze",
    ),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantWorkspaceOrchestrationPublicApiRegistry),
    true,
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicCompatibility,
    assistantWorkspaceOrchestrationFreezeReference.compatibility,
  );
});

test("ASSISTANT-5:9 declares the sole consumer entry", () => {
  assert.equal(
    assistantWorkspaceOrchestrationConsumerEntry.file,
    "assistantWorkspaceOrchestrationPublicIndex.ts",
  );
  assert.equal(
    assistantWorkspaceOrchestrationConsumerEntry
      .directArchitecturalImportsPermitted,
    false,
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexMetadata.consumerEntry,
    "assistantWorkspaceOrchestrationPublicIndex.ts",
  );
  assert.equal(
    assistantWorkspaceOrchestrationFreezeReference.identity.id,
    "ASSISTANT-5:8/WorkspaceOrchestrationFreeze",
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexIdentity.sourceFreeze,
    "ASSISTANT-5:8/WorkspaceOrchestrationFreeze",
  );
  assert.equal(
    assistantWorkspaceOrchestrationPublicIndexIdentity.lockIdentifier,
    "ASSISTANT-5-WORKSPACE-ORCHESTRATION-LOCKED",
  );
});

test("ASSISTANT-5:9 imports only Freeze and has no prohibited dependencies", () => {
  const source = readFileSync(
    new URL(
      "./assistantWorkspaceOrchestrationPublicIndex.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const imports = source.match(/^import .* from .*;$/gm) ?? [];
  assert.deepEqual(imports, [
    'import { AssistantWorkspaceOrchestrationFreeze } from "./assistantWorkspaceOrchestrationFreeze.ts";',
  ]);
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationFoundation"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationRegistry"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationModel"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationValidation"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationManifest"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationPlatform"),
    false,
  );
  assert.equal(
    source.includes("assistantWorkspaceOrchestrationCertification"),
    false,
  );
  assert.equal(source.includes("assistantExecutiveGuidance"), false);
  assert.equal(source.includes("assistantIntentDialogue"), false);
  assert.equal(source.includes("assistantExecutiveMemory"), false);
  assert.equal(source.includes("assistantConversation"), false);
  assert.equal(
    /from ["']\.\/assistantWorkspaceOrchestration(?!Freeze\.ts["'])/
      .test(source),
    false,
  );
  assert.equal(
    Object.isFrozen(assistantWorkspaceOrchestrationPublicIndexIdentity),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantWorkspaceOrchestrationPublicIndexMetadata),
    true,
  );
  assert.equal(
    Object.isFrozen(assistantWorkspaceOrchestrationPublicIndexNamespace),
    true,
  );
});
