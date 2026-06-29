import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_INTENT_CONTRACT_VERSION,
  EXECUTIVE_INTENT_FUTURE_COMPATIBILITY,
  EXECUTIVE_INTENT_FUTURE_PHASE_KEYS,
  EXECUTIVE_INTENT_IDENTITY,
  EXECUTIVE_INTENT_FREEZE_RULES,
  EXECUTIVE_INTENT_LIFECYCLE_DEFINITIONS,
  EXECUTIVE_INTENT_MANDATORY_METADATA_FIELDS,
  EXECUTIVE_INTENT_MUST_NOT_OWN,
  EXECUTIVE_INTENT_PUBLIC_API_RULES,
  EXECUTIVE_INTENT_RESERVED_FIELDS,
  EXECUTIVE_INTENT_RESERVED_IDS,
  EXECUTIVE_INTENT_RESERVED_NAMESPACES,
  EXECUTIVE_INTENT_SELF_MANIFEST,
  EXECUTIVE_INTENT_TAGS,
  EXECUTIVE_INTENT_TERMINAL_LIFECYCLE_STAGES,
  EXECUTIVE_INTENT_TERMINAL_STATUSES,
  ExecutiveIntentContract,
  INTENT_CATEGORY_KEYS,
  INTENT_LIFECYCLE_KEYS,
  INTENT_PRIORITY_KEYS,
  INTENT_RELATION_TYPE_KEYS,
  INTENT_SCOPE_KEYS,
  INTENT_SOURCE_KEYS,
  INTENT_STATUS_KEYS,
  getExecutiveIntentContractVersionMetadata,
  getExecutiveIntentFutureCompatibility,
  isIntentCategory,
  isIntentLifecycleStage,
  isIntentPriority,
  isIntentRelationType,
  isIntentScope,
  isIntentSource,
  isIntentStatus,
  resolveExecutiveIntentExample,
  resolveExecutiveIntentMetadataExample,
  validateExecutiveIntentShape,
  validateIntentMetadataShape,
} from "./executiveIntentContract.ts";
import {
  EXECUTIVE_INTENT_DEFAULT_LIMITS,
  EXECUTIVE_INTENT_PRIORITY_RANK,
} from "./executiveIntentConstants.ts";
import {
  hasDuplicateIds,
  isReservedIntentId,
  isReservedIntentNamespace,
  validateCustomMetadataKeys,
} from "./executiveIntentValidation.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test("exports APP-3 identity and contract vocabulary", () => {
  assert.equal(EXECUTIVE_INTENT_IDENTITY.appId, "APP-3");
  assert.equal(EXECUTIVE_INTENT_IDENTITY.title, "Executive Intent");
  assert.equal(EXECUTIVE_INTENT_IDENTITY.version, EXECUTIVE_INTENT_CONTRACT_VERSION);
  assert.equal(INTENT_CATEGORY_KEYS.length, 11);
  assert.equal(INTENT_PRIORITY_KEYS.length, 5);
  assert.equal(INTENT_STATUS_KEYS.length, 6);
  assert.equal(INTENT_SCOPE_KEYS.length, 7);
  assert.equal(INTENT_LIFECYCLE_KEYS.length, 7);
  assert.equal(INTENT_SOURCE_KEYS.length, 7);
  assert.equal(INTENT_RELATION_TYPE_KEYS.length, 8);
  for (const tag of [
    "[APP3_1]",
    "[EXECUTIVE_INTENT_FOUNDATION]",
    "[EXECUTIVE_INTENT_CONTRACT]",
    "[METADATA_ONLY]",
    "[ARCHITECTURE_SAFE]",
    "[BACKWARD_COMPATIBLE]",
  ]) {
    assert.ok(EXECUTIVE_INTENT_TAGS.includes(tag as (typeof EXECUTIVE_INTENT_TAGS)[number]), tag);
  }
});

test("validates enum correctness through type guards", () => {
  assert.equal(isIntentCategory("strategic"), true);
  assert.equal(isIntentCategory("risk_reduction"), true);
  assert.equal(isIntentCategory("unknown"), false);
  assert.equal(isIntentPriority("critical"), true);
  assert.equal(isIntentPriority("very_low"), true);
  assert.equal(isIntentStatus("paused"), true);
  assert.equal(isIntentScope("business_unit"), true);
  assert.equal(isIntentLifecycleStage("approved"), true);
  assert.equal(isIntentSource("workspace"), true);
  assert.equal(isIntentRelationType("depends_on"), true);
  assert.equal(isIntentRelationType("conflicts_with"), true);
});

test("validates executive intent example shape and type compatibility", () => {
  const example = resolveExecutiveIntentExample();
  const metadata = resolveExecutiveIntentMetadataExample();

  assert.equal(validateExecutiveIntentShape(example).valid, true);
  assert.equal(validateIntentMetadataShape(metadata).valid, true);
  assert.equal(example.readOnly, true);
  assert.equal(metadata.readOnly, true);
  assert.equal(example.contractVersion, "APP-3/1");
  assert.equal(example.intentId, metadata.intentId);
  assert.equal(example.workspaceId, metadata.workspaceId);
});

test("declares priority rank ordering", () => {
  assert.ok(EXECUTIVE_INTENT_PRIORITY_RANK.critical > EXECUTIVE_INTENT_PRIORITY_RANK.high);
  assert.ok(EXECUTIVE_INTENT_PRIORITY_RANK.high > EXECUTIVE_INTENT_PRIORITY_RANK.medium);
  assert.ok(EXECUTIVE_INTENT_PRIORITY_RANK.very_low < EXECUTIVE_INTENT_PRIORITY_RANK.low);
});

test("defines lifecycle stages in deterministic order", () => {
  assert.equal(EXECUTIVE_INTENT_LIFECYCLE_DEFINITIONS.length, 7);
  assert.equal(EXECUTIVE_INTENT_LIFECYCLE_DEFINITIONS[0]?.key, "created");
  assert.equal(EXECUTIVE_INTENT_LIFECYCLE_DEFINITIONS[6]?.key, "archived");
  assert.equal((EXECUTIVE_INTENT_TERMINAL_STATUSES as readonly string[]).includes("archived"), true);
  assert.equal((EXECUTIVE_INTENT_TERMINAL_LIFECYCLE_STAGES as readonly string[]).includes("completed"), true);
});

test("prevents reserved identifiers and duplicate ids", () => {
  assert.equal(isReservedIntentId("intent-system"), true);
  assert.equal(isReservedIntentId("intent-example-001"), false);
  assert.equal(isReservedIntentNamespace("nexora.intent.reserved"), true);
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b", "c"]), false);

  const invalidMetadata = resolveExecutiveIntentMetadataExample();
  const withReservedId = Object.freeze({
    ...invalidMetadata,
    intentId: "intent-system",
  });
  assert.equal(validateIntentMetadataShape(withReservedId).valid, false);
});

test("validates custom metadata reserved namespaces and limits", () => {
  const valid = validateCustomMetadataKeys(Object.freeze({ "custom.field": "value" }));
  assert.equal(valid.valid, true);

  const reserved = validateCustomMetadataKeys(
    Object.freeze({ "nexora.intent.reserved": "blocked" })
  );
  assert.equal(reserved.valid, false);
});

test("declares future compatibility and reserved extension fields", () => {
  assert.equal(EXECUTIVE_INTENT_FUTURE_PHASE_KEYS.length, 9);
  assert.equal(EXECUTIVE_INTENT_RESERVED_FIELDS.length, 9);
  assert.equal(EXECUTIVE_INTENT_FUTURE_COMPATIBILITY.metadataOnly, true);
  assert.equal(EXECUTIVE_INTENT_FUTURE_COMPATIBILITY.extractionReady, true);
  assert.equal(EXECUTIVE_INTENT_FUTURE_COMPATIBILITY.memoryReady, true);
  assert.equal(getExecutiveIntentFutureCompatibility().readOnly, true);
});

test("declares mandatory metadata fields and default limits", () => {
  assert.equal(EXECUTIVE_INTENT_MANDATORY_METADATA_FIELDS.length, 24);
  assert.equal(EXECUTIVE_INTENT_MANDATORY_METADATA_FIELDS.includes("confidenceReference"), true);
  assert.equal(EXECUTIVE_INTENT_MANDATORY_METADATA_FIELDS.includes("conflictReference"), true);
  assert.equal(EXECUTIVE_INTENT_DEFAULT_LIMITS.maxTags, 32);
  assert.equal(EXECUTIVE_INTENT_RESERVED_IDS.length, 4);
  assert.equal(EXECUTIVE_INTENT_RESERVED_NAMESPACES.length, 4);
});

test("documents freeze rules, public API rules, and isolation manifest", () => {
  assert.equal(EXECUTIVE_INTENT_FREEZE_RULES.contractImmutable, true);
  assert.equal(EXECUTIVE_INTENT_FREEZE_RULES.metadataOnly, true);
  assert.equal(EXECUTIVE_INTENT_PUBLIC_API_RULES.noStorage, true);
  assert.equal(EXECUTIVE_INTENT_PUBLIC_API_RULES.noAssistantIntegration, true);
  assert.ok(EXECUTIVE_INTENT_MUST_NOT_OWN.includes("intent_extraction"));
  assert.ok(EXECUTIVE_INTENT_MUST_NOT_OWN.includes("recommendation_engine"));
  assert.ok(EXECUTIVE_INTENT_MUST_NOT_OWN.includes("scenario_generator"));
  const manifestValidation = validateStageManifest(EXECUTIVE_INTENT_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.join("; "));
});

test("exports contract version metadata and contract facade", () => {
  const metadata = getExecutiveIntentContractVersionMetadata();
  assert.equal(metadata.contractVersion, "APP-3/1");
  assert.equal(metadata.platform, "nexora-type-c");
  assert.equal(ExecutiveIntentContract.version, "APP-3/1");
  assert.equal(typeof ExecutiveIntentContract.resolveExecutiveIntentExample, "function");
});

test("keeps APP-3 contract files inside stage allowlist", () => {
  for (const filePath of EXECUTIVE_INTENT_SELF_MANIFEST.allowedFiles.filter((entry) =>
    entry.endsWith(".ts")
  )) {
    const boundary = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_INTENT_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_INTENT_SELF_MANIFEST.forbiddenPatterns,
    });
    assert.equal(boundary.allowed, true, `${filePath}: ${boundary.message}`);
  }
});

test("rejects identity mismatch and read-only violations", () => {
  const example = resolveExecutiveIntentExample();
  const mismatched = Object.freeze({
    ...example,
    intentId: "intent-other",
  });
  assert.equal(validateExecutiveIntentShape(mismatched).valid, false);

  const notReadOnly = Object.freeze({
    ...example,
    readOnly: false as const,
  });
  assert.equal(validateExecutiveIntentShape(notReadOnly).valid, false);
});

test("rejects duplicate relation and dependency identifiers", () => {
  const metadata = resolveExecutiveIntentMetadataExample();
  const withDuplicateTags = Object.freeze({
    ...metadata,
    tags: Object.freeze([
      Object.freeze({ tagId: "tag-1", label: "A", readOnly: true as const }),
      Object.freeze({ tagId: "tag-1", label: "B", readOnly: true as const }),
    ]),
  });
  assert.equal(validateIntentMetadataShape(withDuplicateTags).valid, false);
});
