import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import {
  EXECUTIVE_INBOX_COMPATIBILITY_REGISTRY,
  EXECUTIVE_INBOX_CONSUMER_REGISTRY,
  EXECUTIVE_INBOX_EXTENSION_REGISTRY,
  EXECUTIVE_INBOX_FUTURE_COMPATIBILITY,
  EXECUTIVE_INBOX_FUTURE_PHASE_KEYS,
  EXECUTIVE_INBOX_MUST_NOT_OWN,
  EXECUTIVE_INBOX_PLATFORM_CAPABILITIES,
  EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_PRINCIPLES,
  EXECUTIVE_INBOX_PUBLIC_API_REGISTRY,
  EXECUTIVE_INBOX_RELEASE_METADATA,
  EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY,
  EXECUTIVE_INBOX_SOURCE_TYPE_KEYS,
} from "./executiveInboxConstants.ts";
import {
  EXECUTIVE_INBOX_FREEZE_RULES,
  EXECUTIVE_INBOX_PLATFORM_IDENTITY,
  EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST,
  EXECUTIVE_INBOX_PUBLIC_API_RULES,
  ExecutiveInboxPlatformContract,
  buildExecutiveInboxFoundation,
  createExecutiveInboxFoundation,
  getExecutiveInboxContractVersionMetadata,
  getExecutiveInboxFutureCompatibility,
  getExecutiveInboxManifest,
  registerExecutiveInboxItem,
  registerExecutiveInboxSession,
  resolveExecutiveInboxContextExample,
  resolveExecutiveInboxItemExample,
  resolveExecutiveInboxSessionExample,
  resolveExecutiveInboxSourceExample,
  validateExecutiveInboxDependencies,
  validateExecutiveInboxFoundation,
} from "./executiveInboxContracts.ts";
import {
  ExecutiveInboxFoundation,
  getExecutiveInbox,
  isExecutiveInboxPlatformInitialized,
} from "./executiveInboxFoundation.ts";
import { getExecutiveInboxRegistry, registerMetadataExtension } from "./executiveInboxRegistry.ts";
import { resetExecutiveInboxPlatformForTests, runExecutiveInboxFoundation } from "./executiveInboxRunner.ts";
import {
  hasDuplicateIds,
  isExecutiveInboxSourceType,
  isReservedExecutiveInboxSessionId,
  validateExecutiveInboxContextContractShape,
  validateExecutiveInboxItemContractShape,
  validateExecutiveInboxItemRegistration,
  validateExecutiveInboxSessionContractShape,
  validateExecutiveInboxSessionRegistration,
  validateExecutiveInboxSourceContractShape,
  validatePlatformIdentity,
  validateSessionIdentity,
  validateWorkspaceIsolation,
} from "./executiveInboxValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetExecutiveInboxPlatformForTests();
});

test("exports APP-11 identity and contract vocabulary", () => {
  assert.equal(EXECUTIVE_INBOX_PLATFORM_IDENTITY.appId, "APP-11");
  assert.equal(EXECUTIVE_INBOX_PLATFORM_IDENTITY.title, "Executive Inbox");
  assert.equal(EXECUTIVE_INBOX_PLATFORM_IDENTITY.platformId, "executive-inbox-platform");
  assert.equal(EXECUTIVE_INBOX_PLATFORM_IDENTITY.version, EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION);
  assert.equal(EXECUTIVE_INBOX_SOURCE_TYPE_KEYS.length, 9);
});

test("validates inbox source enum guards", () => {
  assert.equal(isExecutiveInboxSourceType("scenario"), true);
  assert.equal(isExecutiveInboxSourceType("assistant"), true);
  assert.equal(isExecutiveInboxSourceType("invalid"), false);
});

test("validates inbox contract example shapes", () => {
  assert.equal(validateExecutiveInboxSourceContractShape(resolveExecutiveInboxSourceExample(FIXED_TIME)).valid, true);
  assert.equal(validateExecutiveInboxItemContractShape(resolveExecutiveInboxItemExample(FIXED_TIME)).valid, true);
  assert.equal(validateExecutiveInboxContextContractShape(resolveExecutiveInboxContextExample(FIXED_TIME)).valid, true);
  assert.equal(validateExecutiveInboxSessionContractShape(resolveExecutiveInboxSessionExample(FIXED_TIME)).valid, true);
  assert.equal(resolveExecutiveInboxSourceExample(FIXED_TIME).consumerOnly, true);
  assert.equal(resolveExecutiveInboxItemExample(FIXED_TIME).version, "APP-11/1");
});

test("creates executive inbox foundation correctly", () => {
  assert.equal(isExecutiveInboxPlatformInitialized(), false);
  const init = createExecutiveInboxFoundation(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isExecutiveInboxPlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "APP-11/1");
  assert.equal(init.data?.supportedSourceTypes.length, 9);
});

test("registers inbox session and item", () => {
  createExecutiveInboxFoundation(FIXED_TIME);
  const session = registerExecutiveInboxSession(
    Object.freeze({
      sessionId: "executive-inbox-ws-test-001",
      workspaceId: "ws-test-001",
      label: "Test Inbox Session",
      description: "Foundation test session.",
      sourceTypes: Object.freeze(["scenario", "decision"]),
    }),
    FIXED_TIME
  );
  assert.equal(session.success, true);
  const item = registerExecutiveInboxItem(
    Object.freeze({
      itemId: "inbox-item-test-001",
      workspaceId: "ws-test-001",
      sessionId: "executive-inbox-ws-test-001",
      sourceType: "scenario",
      sourceReferenceId: "scenario-test-001",
      label: "Test Inbox Item",
      description: "Foundation test item.",
    }),
    FIXED_TIME
  );
  assert.equal(item.success, true);
});

test("rejects reserved inbox session ids", () => {
  assert.equal(isReservedExecutiveInboxSessionId("executive-inbox-system"), true);
  assert.equal(validateSessionIdentity("executive-inbox-system").valid, false);
});

test("builds immutable executive inbox manifest", () => {
  buildExecutiveInboxFoundation(FIXED_TIME);
  const manifest = getExecutiveInboxManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.manifestVersion, "APP-11/1");
  assert.equal(manifest.certifiedDependencies.length, 12);
  assert.equal(manifest.sourceProviderRegistry.length, 6);
  assert.equal(manifest.dependencyValidation.valid, true);
});

test("validates executive inbox foundation", () => {
  const report = validateExecutiveInboxFoundation(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.platformInitialized, true);
  assert.equal(report.registryValid, true);
  assert.equal(report.dependencyValid, true);
});

test("validates certified dependency gates", () => {
  const report = validateExecutiveInboxDependencies();
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.dependencies.length, 12);
  assert.ok(report.dependencies.find((entry) => entry.appId === "APP-10")?.present);
  assert.ok(report.dependencies.find((entry) => entry.appId === "DS")?.present);
  assert.ok(report.dependencies.find((entry) => entry.appId === "INT")?.present);
});

test("validates APP-11:1 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-inbox/executiveInboxFoundation.ts",
    allowedFiles: EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("exports extension, consumer, and compatibility registries", () => {
  assert.equal(EXECUTIVE_INBOX_EXTENSION_REGISTRY.length, 5);
  assert.equal(EXECUTIVE_INBOX_CONSUMER_REGISTRY.length, 4);
  assert.equal(EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY.length, 6);
  assert.equal(EXECUTIVE_INBOX_COMPATIBILITY_REGISTRY.length, 6);
  assert.equal(EXECUTIVE_INBOX_FUTURE_PHASE_KEYS.includes("aggregation_engine"), true);
});

test("enforces public API and freeze rules", () => {
  assert.equal(EXECUTIVE_INBOX_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(EXECUTIVE_INBOX_PUBLIC_API_RULES.noInboxAggregation, true);
  assert.equal(EXECUTIVE_INBOX_FREEZE_RULES.noPrioritization, true);
  assert.equal(EXECUTIVE_INBOX_FREEZE_RULES.noNotificationDelivery, true);
  assert.equal(EXECUTIVE_INBOX_FREEZE_RULES.consumerOnly, true);
});

test("validates platform identity session identity and workspace isolation", () => {
  assert.equal(validatePlatformIdentity(EXECUTIVE_INBOX_PLATFORM_IDENTITY).valid, true);
  assert.equal(validateSessionIdentity("executive-inbox-ws-001").valid, true);
  assert.equal(validateWorkspaceIsolation("ws-a", "ws-a").valid, true);
  assert.equal(validateWorkspaceIsolation("ws-a", "ws-b").valid, false);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["scenario", "decision", "scenario"]), true);
  assert.equal(hasDuplicateIds(["scenario", "decision"]), false);
});

test("regression: APP-10 platform remains valid", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("registers metadata extensions", () => {
  buildExecutiveInboxFoundation(FIXED_TIME);
  const extension = registerMetadataExtension(
    Object.freeze({
      extensionId: "inbox-metadata-test",
      label: "Test Metadata Extension",
      description: "Foundation metadata extension test.",
    })
  );
  assert.equal(extension.success, true);
});

test("getExecutiveInbox returns platform state", () => {
  buildExecutiveInboxFoundation(FIXED_TIME);
  const state = getExecutiveInbox(FIXED_TIME);
  assert.equal(state.platformId, "executive-inbox-platform");
  assert.equal(state.initialized, true);
});

test("runs executive inbox foundation certification", () => {
  const certification = runExecutiveInboxFoundation(FIXED_TIME);
  assert.equal(certification.certified, true);
  assert.equal(certification.phase, "APP-11/1");
  assert.equal(certification.failedCount, 0);
  assert.ok(certification.checks.every((entry) => entry.passed));
});

test("exports executive inbox platform contract bundle", () => {
  assert.equal(ExecutiveInboxPlatformContract.version, "APP-11/1");
  assert.equal(typeof ExecutiveInboxPlatformContract.validateExecutiveInboxFoundation, "function");
  assert.equal(typeof ExecutiveInboxPlatformContract.getExecutiveInboxManifest, "function");
});

test("ExecutiveInboxFoundation namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveInboxFoundation.buildExecutiveInboxFoundation, "function");
  assert.equal(typeof ExecutiveInboxFoundation.getExecutiveInbox, "function");
  assert.equal(ExecutiveInboxFoundation.version, "APP-11/1");
});

test("validates inbox session and item registration shape", () => {
  assert.equal(
    validateExecutiveInboxSessionRegistration(
      Object.freeze({
        sessionId: "executive-inbox-ws-valid",
        workspaceId: "ws-valid",
        label: "Valid",
        description: "Valid session.",
        sourceTypes: Object.freeze(["scenario"]),
      })
    ).valid,
    true
  );
  assert.equal(
    validateExecutiveInboxItemRegistration(
      Object.freeze({
        itemId: "inbox-item-valid",
        workspaceId: "ws-valid",
        sessionId: "executive-inbox-ws-valid",
        sourceType: "scenario",
        sourceReferenceId: "ref-valid",
        label: "Valid",
        description: "Valid item.",
      })
    ).valid,
    true
  );
});

test("future engine registry reserves inbox engines without implementation", () => {
  assert.equal(EXECUTIVE_INBOX_FUTURE_COMPATIBILITY.aggregationEngineReady, false);
  assert.equal(EXECUTIVE_INBOX_FUTURE_COMPATIBILITY.notificationEngineReady, false);
  assert.equal(getExecutiveInboxFutureCompatibility().metadataOnly, true);
});

test("public API registry includes required foundation exports", () => {
  assert.ok(EXECUTIVE_INBOX_PUBLIC_API_REGISTRY.includes("buildExecutiveInboxFoundation"));
  assert.ok(EXECUTIVE_INBOX_PUBLIC_API_REGISTRY.includes("validateExecutiveInboxFoundation"));
  assert.ok(EXECUTIVE_INBOX_PUBLIC_API_REGISTRY.includes("getExecutiveInboxManifest"));
  assert.ok(EXECUTIVE_INBOX_PUBLIC_API_REGISTRY.includes("runExecutiveInboxFoundation"));
});

test("contract version metadata and platform capabilities declared", () => {
  const metadata = getExecutiveInboxContractVersionMetadata();
  assert.equal(metadata.contractVersion, "APP-11/1");
  assert.equal(EXECUTIVE_INBOX_PLATFORM_CAPABILITIES.includes("inbox_contracts"), true);
  assert.equal(EXECUTIVE_INBOX_PLATFORM_PRINCIPLES.includes("executive_inbox_is_consumer_only"), true);
  assert.equal(EXECUTIVE_INBOX_MUST_NOT_OWN.includes("workflow_execution"), true);
  assert.equal(EXECUTIVE_INBOX_RELEASE_METADATA.readOnly, true);
});

test("registry snapshot reflects seeded defaults", () => {
  buildExecutiveInboxFoundation(FIXED_TIME);
  const registry = getExecutiveInboxRegistry();
  assert.equal(registry.sourceTypes.length, 9);
  assert.equal(registry.snapshot.sourceTypeCount, 9);
});
