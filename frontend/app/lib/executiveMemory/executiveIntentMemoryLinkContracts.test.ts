import assert from "node:assert/strict";
import test from "node:test";

import { resolveExecutiveIntentExample, validateExecutiveIntentShape } from "../executiveIntent/executiveIntentContract.ts";
import { buildExecutiveMemoryRecordExample } from "./executiveMemoryBuilder.ts";
import { initializeExecutiveMemoryPlatform, resetExecutiveMemoryPlatformForTests } from "./executiveMemoryPlatform.ts";
import { registerExecutiveMemoryProvider } from "./executiveMemoryRegistry.ts";
import { validateExecutiveMemoryRecordShape } from "./executiveMemoryRecordValidation.ts";
import { initializeExecutiveMemoryRetrievalEngine, resetExecutiveMemoryRetrievalEngineForTests } from "./executiveMemoryRetrievalEngine.ts";
import {
  createExecutiveMemory,
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "./executiveMemoryStorageEngine.ts";
import {
  EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION,
  EXECUTIVE_INTENT_MEMORY_LINK_ERROR_CODES,
} from "./executiveIntentMemoryLinkConstants.ts";
import {
  createExecutiveIntentMemoryLinkMetadata,
  createExecutiveIntentMemoryLinkVersion,
} from "./executiveIntentMemoryLinkModel.ts";
import {
  archiveIntentMemoryLink,
  createIntentMemoryLink,
  getExecutiveIntentMemoryLinkStatistics,
  getIntentMemoryLinkById,
  getIntentMemoryLinks,
  getIntentMemoryLinksByDecision,
  getIntentMemoryLinksByGoal,
  getIntentMemoryLinksByIntent,
  getIntentMemoryLinksByMemory,
  getIntentMemoryLinksByScenario,
  hasIntentMemoryLink,
  initializeExecutiveIntentMemoryLinkEngine,
  inspectIntentMemoryLinkGraph,
  registerExecutiveIntentLinkTarget,
  resetExecutiveIntentMemoryLinkEngineForTests,
  restoreIntentMemoryLink,
  updateIntentMemoryLink,
  validateIntentMemoryLink,
} from "./executiveIntentMemoryLinkEngine.ts";
import {
  EXECUTIVE_INTENT_MEMORY_LINK_IDENTITY,
  EXECUTIVE_INTENT_MEMORY_LINK_SELF_MANIFEST,
  ExecutiveIntentMemoryLinkContracts,
} from "./executiveIntentMemoryLinkContracts.ts";
import { findExecutiveMemoriesByIntent } from "./executiveMemoryRetrievalEngine.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const UPDATE_TIME = "2026-01-02T00:00:00.000Z";

function registerLinkingEnvironment(): { intentId: string; memoryId: string; workspaceId: string } {
  initializeExecutiveMemoryPlatform(FIXED_TIME);
  registerExecutiveMemoryProvider(
    Object.freeze({
      providerId: "executive-memory-foundation-provider",
      label: "Foundation Provider",
      version: "1.0.0",
      supportedCategories: Object.freeze(["decision", "goal", "evidence"] as const),
    }),
    FIXED_TIME
  );
  initializeExecutiveMemoryStorageEngine(FIXED_TIME);
  initializeExecutiveMemoryRetrievalEngine(FIXED_TIME);
  initializeExecutiveIntentMemoryLinkEngine(FIXED_TIME);

  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);

  registerExecutiveIntentLinkTarget(
    Object.freeze({
      intentId: intent.intentId,
      workspaceId: record.workspaceId,
      goalIds: Object.freeze([record.goal!.goalId]),
      scenarioIds: Object.freeze([record.scenario!.scenarioId]),
      decisionIds: Object.freeze([record.decision!.decisionId]),
      evidenceIds: Object.freeze([record.evidence[0]!.evidenceId]),
      referenceIds: Object.freeze([record.references[0]!.referenceId]),
    }),
    FIXED_TIME
  );

  return { intentId: intent.intentId, memoryId: record.id, workspaceId: record.workspaceId };
}

function buildLinkInput(
  linkId: string,
  env: { intentId: string; memoryId: string; workspaceId: string },
  relationship: "intent_memory" | "intent_goal" | "intent_scenario" | "intent_decision",
  extras: Record<string, string | null> = {}
) {
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  return Object.freeze({
    linkId,
    intentId: env.intentId,
    memoryId: relationship === "intent_memory" ? env.memoryId : null,
    workspaceId: env.workspaceId,
    relationship,
    linkType: "primary" as const,
    goalId: relationship === "intent_goal" ? record.goal!.goalId : null,
    scenarioId: relationship === "intent_scenario" ? record.scenario!.scenarioId : null,
    decisionId: relationship === "intent_decision" ? record.decision!.decisionId : null,
    evidenceId: null,
    referenceId: null,
    ...extras,
    metadata: createExecutiveIntentMemoryLinkMetadata({
      label: `${relationship} link`,
      notes: "Certification link example.",
      createdBy: "executive-owner",
      sourceModule: "executive-intent-memory-link",
    }),
    version: createExecutiveIntentMemoryLinkVersion({
      versionId: `version-${linkId}`,
      semanticVersion: "1.0.0",
      createdAt: FIXED_TIME,
    }),
    createdAt: FIXED_TIME,
    updatedAt: FIXED_TIME,
  });
}

test.beforeEach(() => {
  resetExecutiveMemoryPlatformForTests();
  resetExecutiveMemoryStorageEngineForTests();
  resetExecutiveMemoryRetrievalEngineForTests();
  resetExecutiveIntentMemoryLinkEngineForTests();
});

test("exports APP-4:5 linking identity and extends APP-3 and APP-4 phases", () => {
  assert.equal(EXECUTIVE_INTENT_MEMORY_LINK_IDENTITY.phaseId, "APP-4/5");
  assert.equal(EXECUTIVE_INTENT_MEMORY_LINK_CONTRACT_VERSION, "APP-4/5");
  assert.equal(ExecutiveIntentMemoryLinkContracts.version, "APP-4/5");
});

test("creates and retrieves intent memory links", () => {
  const env = registerLinkingEnvironment();
  const created = createIntentMemoryLink(buildLinkInput("link-001", env, "intent_memory"));
  assert.equal(created.success, true);
  assert.equal(hasIntentMemoryLink("link-001"), true);
  const link = getIntentMemoryLinkById("link-001");
  assert.ok(link);
  assert.equal(link?.intentId, env.intentId);
  assert.equal(link?.memoryId, env.memoryId);
});

test("updates intent memory links with version preservation", () => {
  const env = registerLinkingEnvironment();
  createIntentMemoryLink(buildLinkInput("link-update-001", env, "intent_memory"));
  const updated = updateIntentMemoryLink(
    "link-update-001",
    Object.freeze({ linkType: "supporting", metadata: Object.freeze({ notes: "Updated notes." }) }),
    UPDATE_TIME
  );
  assert.equal(updated.success, true);
  assert.equal(updated.data?.linkType, "supporting");
  assert.notEqual(updated.data?.version.semanticVersion, "1.0.0");
  assert.equal(updated.data?.metadata.notes, "Updated notes.");
});

test("archives and restores intent memory links", () => {
  const env = registerLinkingEnvironment();
  createIntentMemoryLink(buildLinkInput("link-archive-001", env, "intent_memory"));
  const archived = archiveIntentMemoryLink("link-archive-001", UPDATE_TIME);
  assert.equal(archived.success, true);
  assert.equal(archived.data?.lifecycle, "archived");
  assert.ok(archived.data?.archivedAt);

  const restored = restoreIntentMemoryLink("link-archive-001", UPDATE_TIME);
  assert.equal(restored.success, true);
  assert.equal(restored.data?.lifecycle, "active");
});

test("remove performs archive only", () => {
  const env = registerLinkingEnvironment();
  createIntentMemoryLink(buildLinkInput("link-remove-001", env, "intent_memory"));
  const removed = archiveIntentMemoryLink("link-remove-001", UPDATE_TIME);
  assert.equal(removed.success, true);
  assert.ok(getIntentMemoryLinkById("link-remove-001"));
});

test("rejects duplicate active links", () => {
  const env = registerLinkingEnvironment();
  assert.equal(createIntentMemoryLink(buildLinkInput("link-dup-a", env, "intent_memory")).success, true);
  const duplicate = createIntentMemoryLink(buildLinkInput("link-dup-b", env, "intent_memory"));
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, EXECUTIVE_INTENT_MEMORY_LINK_ERROR_CODES.duplicateLink);
});

test("rejects orphan links when intent is not registered", () => {
  registerLinkingEnvironment();
  const orphan = createIntentMemoryLink(
    buildLinkInput("link-orphan-intent", { intentId: "intent-unregistered", memoryId: "memory-record-example-001", workspaceId: "ws-memory-record-001" }, "intent_memory")
  );
  assert.equal(orphan.success, false);
  assert.equal(orphan.error?.code, EXECUTIVE_INTENT_MEMORY_LINK_ERROR_CODES.validationFailure);
});

test("rejects orphan links when memory does not exist", () => {
  const env = registerLinkingEnvironment();
  const orphan = createIntentMemoryLink(
    Object.freeze({
      ...buildLinkInput("link-orphan-memory", env, "intent_memory"),
      memoryId: "memory-does-not-exist",
    })
  );
  assert.equal(orphan.success, false);
  assert.match(orphan.reason, /not found/i);
});

test("rejects invalid link type on validation", () => {
  const env = registerLinkingEnvironment();
  const created = createIntentMemoryLink(buildLinkInput("link-invalid-type", env, "intent_memory"));
  assert.equal(created.success, true);
  const invalid = Object.freeze({
    ...created.data!,
    linkType: "semantic_match" as never,
  });
  assert.equal(validateIntentMemoryLink(invalid).valid, false);
});

test("finds links by intent goal scenario and decision", () => {
  const env = registerLinkingEnvironment();
  createIntentMemoryLink(buildLinkInput("link-goal", env, "intent_goal"));
  createIntentMemoryLink(buildLinkInput("link-scenario", env, "intent_scenario"));
  createIntentMemoryLink(buildLinkInput("link-decision", env, "intent_decision"));
  createIntentMemoryLink(buildLinkInput("link-memory", env, "intent_memory"));

  assert.equal(getIntentMemoryLinksByIntent(env.intentId).length, 4);
  assert.equal(getIntentMemoryLinksByMemory(env.memoryId).length, 1);
  assert.equal(getIntentMemoryLinksByGoal(buildExecutiveMemoryRecordExample(FIXED_TIME).goal!.goalId).length, 1);
  assert.equal(getIntentMemoryLinksByScenario(buildExecutiveMemoryRecordExample(FIXED_TIME).scenario!.scenarioId).length, 1);
  assert.equal(getIntentMemoryLinksByDecision(buildExecutiveMemoryRecordExample(FIXED_TIME).decision!.decisionId).length, 1);
});

test("inspects direct link graph relationships", () => {
  const env = registerLinkingEnvironment();
  createIntentMemoryLink(buildLinkInput("link-graph-001", env, "intent_memory"));
  const graph = inspectIntentMemoryLinkGraph({ intentId: env.intentId });
  assert.equal(graph.directRelationshipCount, 1);
  assert.equal(graph.linkedMemoryIds[0], env.memoryId);
  assert.equal(graph.linkedIntentIds[0], env.intentId);
});

test("computes lightweight link statistics", () => {
  const env = registerLinkingEnvironment();
  createIntentMemoryLink(buildLinkInput("link-stats-001", env, "intent_memory"));
  archiveIntentMemoryLink("link-stats-001", UPDATE_TIME);
  createIntentMemoryLink(buildLinkInput("link-stats-002", env, "intent_goal"));

  const stats = getExecutiveIntentMemoryLinkStatistics();
  assert.equal(stats.totalLinks, 2);
  assert.equal(stats.activeLinks, 1);
  assert.equal(stats.archivedLinks, 1);
  assert.ok(stats.linksByIntent[env.intentId] >= 2);
});

test("preserves deterministic ordering for link lists", () => {
  const env = registerLinkingEnvironment();
  createIntentMemoryLink(buildLinkInput("link-order-b", env, "intent_memory"));
  createIntentMemoryLink(buildLinkInput("link-order-a", env, "intent_goal"));
  const links = getIntentMemoryLinks();
  assert.deepEqual(
    links.map((entry) => entry.linkId),
    ["link-order-a", "link-order-b"]
  );
});

test("validates link metadata and lifecycle before commit", () => {
  const env = registerLinkingEnvironment();
  const invalid = createIntentMemoryLink(
    Object.freeze({
      ...buildLinkInput("link-invalid-lifecycle", env, "intent_memory"),
      linkType: "invalid_type" as never,
    })
  );
  assert.equal(invalid.success, false);
});

test("validates APP-4:5 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_INTENT_MEMORY_LINK_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveMemory/executiveIntentMemoryLinkEngine.ts",
      allowedFiles: EXECUTIVE_INTENT_MEMORY_LINK_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_INTENT_MEMORY_LINK_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("regression: APP-3 executive intent contracts remain valid", () => {
  const intent = resolveExecutiveIntentExample(FIXED_TIME);
  assert.equal(validateExecutiveIntentShape(intent).valid, true);
});

test("regression: APP-4:2 record contracts remain valid", () => {
  assert.equal(validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample(FIXED_TIME)).valid, true);
});

test("regression: APP-4:3 storage and APP-4:4 retrieval remain operational", () => {
  const env = registerLinkingEnvironment();
  assert.equal(findExecutiveMemoriesByIntent(buildExecutiveMemoryRecordExample(FIXED_TIME).intent!.intentId).records.length, 1);
  assert.equal(getIntentMemoryLinksByMemory(env.memoryId).length, 0);
});
