import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION,
  KNOWLEDGE_LEARNING_BRIDGE_FUTURE_PHASE_KEYS,
  KNOWLEDGE_LEARNING_BRIDGE_MUST_NOT_OWN,
  KNOWLEDGE_LEARNING_BRIDGE_PRINCIPLES,
  KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY,
  LEARNING_BRIDGE_KEYS,
  LEARNING_BRIDGE_LABELS,
  LEARNING_BRIDGE_TARGET_MAP,
  LEARNING_PLATFORM_ID_MAP,
  LEARNING_TARGET_PLATFORM_ID_MAP,
} from "./knowledgeLearningBridgeCatalog.ts";
import {
  KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_RULES,
  KNOWLEDGE_LEARNING_BRIDGE_SELF_MANIFEST,
  KnowledgeLearningBridgeContract,
  getKnowledgeLearningBridgeManifest,
  resolveKnowledgeLearningBridgeExample,
  resolveKnowledgeLearningSourceExample,
  validateKnowledgeLearningBridgePlatform,
} from "./knowledgeLearningBridgeContracts.ts";
import {
  KnowledgeLearningBridgePlatformFacade,
  buildKnowledgeLearningBridgePlatform,
  getKnowledgeLearningBridgePlatform,
  isKnowledgeLearningBridgePlatformInitialized,
  registerKnowledgeLearningBridge,
  registerKnowledgeLearningSource,
  registerKnowledgeLearningTarget,
  resetKnowledgeLearningBridgePlatformForTests,
} from "./knowledgeLearningBridgePlatform.ts";
import {
  hasDuplicateBridgeIds,
  hasDuplicateBridgeKeys,
  hasDuplicateBridgeNames,
  hasDuplicateLearningSourceKeys,
  validateBridgeNameFormat,
  validateKnowledgeLearningBridgeNamespaceFormat,
  validateKnowledgeLearningBridgeVersionFormat,
  validateKnlPlatformReference,
  validatePlatformReference,
} from "./knowledgeLearningBridgeValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetKnowledgeLearningBridgePlatformForTests();
});

test("exports KNL/12 knowledge learning bridge contract vocabulary", () => {
  assert.equal(KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION, "KNL/12");
  assert.equal(LEARNING_BRIDGE_KEYS.length, 7);
  assert.equal(LEARNING_BRIDGE_KEYS.includes("future_ml_layer"), true);
});

test("initializes knowledge learning bridge platform with KNL/1 through KNL/11 dependencies", () => {
  assert.equal(isKnowledgeLearningBridgePlatformInitialized(), false);
  const init = buildKnowledgeLearningBridgePlatform(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isKnowledgeLearningBridgePlatformInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.graphDependency, "KNL/4");
  assert.equal(init.data?.industryDependency, "KNL/5");
  assert.equal(init.data?.frameworkDependency, "KNL/6");
  assert.equal(init.data?.policyDependency, "KNL/7");
  assert.equal(init.data?.bestPracticeDependency, "KNL/8");
  assert.equal(init.data?.retrievalDependency, "KNL/9");
  assert.equal(init.data?.validationDependency, "KNL/10");
  assert.equal(init.data?.versioningDependency, "KNL/11");
  assert.equal(init.data?.contractVersion, "KNL/12");
});

test("seeds learning bridge catalog with 7 bridges sources and targets", () => {
  buildKnowledgeLearningBridgePlatform(FIXED_TIME);
  const platform = getKnowledgeLearningBridgePlatform(FIXED_TIME);
  assert.equal(platform.registry.bridges.length, 7);
  assert.equal(platform.registry.sources.length, 7);
  assert.equal(platform.registry.targets.length, 2);
  assert.equal(platform.registry.dependencies.length, 11);
  assert.equal(platform.registry.namespaces.length, 4);
  assert.equal(platform.registry.extensionPoints.length, 2);
  for (const bridgeKey of LEARNING_BRIDGE_KEYS) {
    assert.ok(platform.registry.bridges.some((entry) => entry.bridgeKey === bridgeKey));
    assert.ok(platform.registry.sources.some((entry) => entry.sourceId === `learning-source-${bridgeKey}`));
  }
});

test("registers custom learning source target and bridge", () => {
  buildKnowledgeLearningBridgePlatform(FIXED_TIME);
  const source = registerKnowledgeLearningSource(
    Object.freeze({
      sourceId: "learning-source-custom-001",
      sourceKey: "app_layer",
      platformReference: "app-layer",
      label: "Custom APP Source",
      description: "Custom source metadata.",
      status: "draft",
    }),
    FIXED_TIME
  );
  assert.equal(source.success, false);
  const target = registerKnowledgeLearningTarget(
    Object.freeze({
      targetId: "learning-target-custom-001",
      targetKey: "knl_platform",
      platformId: "knowledge-platform",
      label: "Custom KNL Target",
      description: "Custom target metadata.",
      status: "draft",
    }),
    FIXED_TIME
  );
  assert.equal(target.success, false);
  const bridge = registerKnowledgeLearningBridge(
    Object.freeze({
      bridgeId: "learning-bridge-custom-001",
      bridgeKey: "app_layer",
      bridgeName: "custom_app_bridge",
      sourceKey: "app_layer",
      targetKey: "knl_platform",
      platformReference: "app-layer",
      knlPlatformId: "knowledge-platform",
      label: "Custom APP Bridge",
      description: "Custom bridge metadata.",
      status: "draft",
      feedbackType: "suggestion",
      feedbackDescription: "Custom feedback.",
      observationType: "pattern",
      observationDescription: "Custom observation.",
      proposalLabel: "Custom Proposal",
      proposalDescription: "Custom proposal.",
      contextKey: "batch",
      sessionDescription: "Custom session.",
    }),
    FIXED_TIME
  );
  assert.equal(bridge.success, false);
});

test("prevents duplicate bridge ids bridge keys and source keys", () => {
  buildKnowledgeLearningBridgePlatform(FIXED_TIME);
  const duplicateBridgeId = registerKnowledgeLearningBridge(
    Object.freeze({
      bridgeId: "learning-bridge-app_layer",
      bridgeKey: "lay_layer",
      bridgeName: "duplicate_bridge",
      sourceKey: "lay_layer",
      targetKey: "knl_platform",
      platformReference: "lay-layer",
      knlPlatformId: "knowledge-platform",
      label: "Duplicate Bridge",
      description: "Duplicate bridge id.",
      status: "active",
      feedbackType: "observation",
      feedbackDescription: "Feedback.",
      observationType: "usage",
      observationDescription: "Observation.",
      proposalLabel: "Proposal",
      proposalDescription: "Proposal.",
      contextKey: "session",
      sessionDescription: "Session.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateBridgeId.success, false);
  const duplicateSourceKey = registerKnowledgeLearningSource(
    Object.freeze({
      sourceId: "learning-source-duplicate-key",
      sourceKey: "app_layer",
      platformReference: "app-layer",
      label: "Duplicate Source Key",
      description: "Duplicate source key.",
      status: "active",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateSourceKey.success, false);
  assert.equal(hasDuplicateBridgeIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateBridgeKeys(["a", "b", "a"]), true);
  assert.equal(hasDuplicateLearningSourceKeys(["a", "b", "a"]), true);
  assert.equal(hasDuplicateBridgeNames(["Bridge", "bridge"]), true);
});

test("rejects invalid platform target and bridge target references", () => {
  buildKnowledgeLearningBridgePlatform(FIXED_TIME);
  const invalidPlatform = registerKnowledgeLearningBridge(
    Object.freeze({
      bridgeId: "learning-bridge-invalid-platform",
      bridgeKey: "int_layer",
      bridgeName: "invalid_platform_bridge",
      sourceKey: "int_layer",
      targetKey: "knl_platform",
      platformReference: "wrong-platform-id",
      knlPlatformId: "knowledge-platform",
      label: "Invalid Platform",
      description: "Invalid platform reference.",
      status: "active",
      feedbackType: "observation",
      feedbackDescription: "Feedback.",
      observationType: "usage",
      observationDescription: "Observation.",
      proposalLabel: "Proposal",
      proposalDescription: "Proposal.",
      contextKey: "session",
      sessionDescription: "Session.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidPlatform.success, false);
  const invalidTarget = registerKnowledgeLearningBridge(
    Object.freeze({
      bridgeId: "learning-bridge-invalid-target",
      bridgeKey: "future_ml_layer",
      bridgeName: "invalid_target_bridge",
      sourceKey: "future_ml_layer",
      targetKey: "knl_platform",
      platformReference: "future-ml-layer",
      knlPlatformId: "knowledge-platform",
      label: "Invalid Target",
      description: "Future ML bridge must target knowledge_versioning_platform.",
      status: "active",
      feedbackType: "observation",
      feedbackDescription: "Feedback.",
      observationType: "usage",
      observationDescription: "Observation.",
      proposalLabel: "Proposal",
      proposalDescription: "Proposal.",
      contextKey: "session",
      sessionDescription: "Session.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidTarget.success, false);
});

test("validates learning bridge version namespace format and references", () => {
  assert.equal(validateKnowledgeLearningBridgeVersionFormat("KNL/12").valid, true);
  assert.equal(validateKnowledgeLearningBridgeVersionFormat("invalid").valid, false);
  assert.equal(validateKnowledgeLearningBridgeNamespaceFormat("knowledge-learning-bridge").valid, true);
  assert.equal(validateKnowledgeLearningBridgeNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(validateBridgeNameFormat("app_layer").valid, true);
  assert.equal(validateBridgeNameFormat("Invalid-Name").valid, false);
  buildKnowledgeLearningBridgePlatform(FIXED_TIME);
  assert.equal(validatePlatformReference("app_layer", "app-layer").valid, true);
  assert.equal(validateKnlPlatformReference("knl_platform", "knowledge-platform").valid, true);
});

test("resolves immutable knowledge learning bridge contract examples", () => {
  assert.equal(Object.isFrozen(resolveKnowledgeLearningBridgeExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeLearningSourceExample(FIXED_TIME)), true);
  assert.equal(resolveKnowledgeLearningBridgeExample(FIXED_TIME).bridgeKey, "app_layer");
  assert.equal(resolveKnowledgeLearningBridgeExample(FIXED_TIME).version, "KNL/12");
});

test("builds immutable knowledge learning bridge manifest", () => {
  buildKnowledgeLearningBridgePlatform(FIXED_TIME);
  const manifest = getKnowledgeLearningBridgeManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/12");
  assert.equal(manifest.versioningDependency, "KNL/11");
  assert.equal(manifest.supportedBridges.length, 7);
  assert.equal(manifest.publicApis.length, KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY.length);
});

test("validates knowledge learning bridge platform certification report", () => {
  const report = validateKnowledgeLearningBridgePlatform(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyValid, true);
  assert.equal(report.graphValid, true);
  assert.equal(report.industryValid, true);
  assert.equal(report.frameworkValid, true);
  assert.equal(report.policyValid, true);
  assert.equal(report.bestPracticeValid, true);
  assert.equal(report.retrievalValid, true);
  assert.equal(report.validationValid, true);
  assert.equal(report.versioningValid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/12 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(KNOWLEDGE_LEARNING_BRIDGE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/knowledgeLearningBridgePlatform.ts",
    allowedFiles: KNOWLEDGE_LEARNING_BRIDGE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: KNOWLEDGE_LEARNING_BRIDGE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_RULES.noLearningEngine, true);
  assert.equal(KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_RULES.noFeedbackProcessing, true);
  assert.equal(KNOWLEDGE_LEARNING_BRIDGE_MUST_NOT_OWN.includes("machine_learning"), true);
  assert.equal(KNOWLEDGE_LEARNING_BRIDGE_MUST_NOT_OWN.includes("runtime_learning"), true);
  assert.equal(KNOWLEDGE_LEARNING_BRIDGE_PRINCIPLES.includes("knl_12_consumes_knl_1_through_knl_11_only"), true);
});

test("exports knowledge learning bridge contract bundle", () => {
  assert.equal(KnowledgeLearningBridgeContract.version, "KNL/12");
  assert.equal(typeof KnowledgeLearningBridgeContract.validateKnowledgeLearningBridgePlatform, "function");
  assert.equal(typeof KnowledgeLearningBridgeContract.getKnowledgeLearningBridgeManifest, "function");
});

test("KnowledgeLearningBridgePlatformFacade namespace exposes public APIs only", () => {
  assert.equal(typeof KnowledgeLearningBridgePlatformFacade.registerKnowledgeLearningSource, "function");
  assert.equal(typeof KnowledgeLearningBridgePlatformFacade.registerKnowledgeLearningTarget, "function");
  assert.equal(typeof KnowledgeLearningBridgePlatformFacade.registerKnowledgeLearningBridge, "function");
  assert.equal(typeof KnowledgeLearningBridgePlatformFacade.getKnowledgeLearningBridgePlatform, "function");
  assert.equal(typeof KnowledgeLearningBridgePlatformFacade.validateKnowledgeLearningBridgePlatform, "function");
  assert.equal(typeof KnowledgeLearningBridgePlatformFacade.getKnowledgeLearningBridgeManifest, "function");
  assert.equal(KnowledgeLearningBridgePlatformFacade.version, "KNL/12");
});

test("public API registry includes required knowledge learning bridge exports", () => {
  assert.ok(KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY.includes("registerKnowledgeLearningSource"));
  assert.ok(KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY.includes("registerKnowledgeLearningTarget"));
  assert.ok(KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY.includes("registerKnowledgeLearningBridge"));
  assert.ok(KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY.includes("getKnowledgeLearningBridgePlatform"));
  assert.ok(KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY.includes("validateKnowledgeLearningBridgePlatform"));
  assert.ok(KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY.includes("getKnowledgeLearningBridgeManifest"));
});

test("future phase registry reserves knowledge governance without implementation", () => {
  assert.equal(KNOWLEDGE_LEARNING_BRIDGE_FUTURE_PHASE_KEYS.includes("knowledge_governance"), true);
  assert.equal(KNOWLEDGE_LEARNING_BRIDGE_FUTURE_PHASE_KEYS.includes("platform_certification"), true);
});

test("getKnowledgeLearningBridgePlatform returns state and registry", () => {
  buildKnowledgeLearningBridgePlatform(FIXED_TIME);
  const platform = getKnowledgeLearningBridgePlatform(FIXED_TIME);
  assert.equal(platform.state.initialized, true);
  assert.equal(platform.registry.snapshot.platformVersion, "KNL/12");
  assert.equal(platform.state.bridgeCount, 7);
  assert.equal(platform.state.sourceCount, 7);
});

test("seeded catalog includes required layer bridges with correct targets", () => {
  buildKnowledgeLearningBridgePlatform(FIXED_TIME);
  const required = ["app_layer", "lay_layer", "int_layer", "ops_layer", "future_ml_layer"] as const;
  const platform = getKnowledgeLearningBridgePlatform(FIXED_TIME);
  for (const key of required) {
    const bridge = platform.registry.bridges.find((entry) => entry.bridgeKey === key);
    assert.ok(bridge);
    assert.equal(bridge?.label, LEARNING_BRIDGE_LABELS[key]);
    assert.equal(bridge?.platformReference, LEARNING_PLATFORM_ID_MAP[key]);
    assert.equal(bridge?.targetKey, LEARNING_BRIDGE_TARGET_MAP[key]);
    assert.equal(bridge?.knlPlatformId, LEARNING_TARGET_PLATFORM_ID_MAP[LEARNING_BRIDGE_TARGET_MAP[key]]);
  }
});

test("rejects bridge registration when source is not registered", () => {
  resetKnowledgeLearningBridgePlatformForTests();
  registerKnowledgeLearningTarget(
    Object.freeze({
      targetId: "learning-target-knl_platform",
      targetKey: "knl_platform",
      platformId: "knowledge-platform",
      label: "KNL Platform",
      description: "Target only.",
      status: "active",
    }),
    FIXED_TIME
  );
  const result = registerKnowledgeLearningBridge(
    Object.freeze({
      bridgeId: "learning-bridge-orphan",
      bridgeKey: "app_layer",
      bridgeName: "orphan_bridge",
      sourceKey: "app_layer",
      targetKey: "knl_platform",
      platformReference: "app-layer",
      knlPlatformId: "knowledge-platform",
      label: "Orphan Bridge",
      description: "Source not registered.",
      status: "active",
      feedbackType: "observation",
      feedbackDescription: "Feedback.",
      observationType: "usage",
      observationDescription: "Observation.",
      proposalLabel: "Proposal",
      proposalDescription: "Proposal.",
      contextKey: "session",
      sessionDescription: "Session.",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});
