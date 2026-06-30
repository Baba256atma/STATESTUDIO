import assert from "node:assert/strict";
import test from "node:test";

import { SMM_PLATFORM_CONTRACT_VERSION } from "./smmPlatformContracts.ts";
import { resetSmmPlatformFoundationForTests } from "./smmPlatformExports.ts";
import {
  SMM_DOMAIN_CONTRACT_VERSION,
  SMM_DOMAIN_FOUNDATION_DEPENDENCY,
  SMM_DOMAIN_MODEL_KEYS,
  SMM_DOMAIN_MUST_NOT_OWN,
  SMM_DOMAIN_PRINCIPLES,
  SMM_DOMAIN_PUBLIC_API_REGISTRY,
} from "./sharedMentalModelContracts.ts";
import {
  SharedMentalModelDomainPlatform,
  buildSharedMentalModelContracts,
  getSharedMentalModelContractRegistry,
  getSharedMentalModelManifest,
  resetSharedMentalModelDomainLayerForTests,
  validateSharedMentalModelContracts,
} from "./sharedMentalModelExports.ts";
import {
  isSharedMentalModelArtifactKey,
  isSharedMentalModelDomainKey,
  isSharedMentalModelRegistryFrozen,
} from "./sharedMentalModelRegistry.ts";
import type {
  SharedAssumption,
  SharedBelief,
  SharedConstraint,
  SharedExecutiveView,
  SharedMentalModel,
  SharedModelMetadata,
  SharedModelReference,
  SharedModelSnapshot,
  SharedModelVersion,
  SharedNarrative,
  SharedOrganizationView,
  SharedPerspective,
  SharedScenarioView,
  SharedWorkspaceView,
} from "./sharedMentalModelTypes.ts";
import {
  validateDomainIdentityUniqueness,
  validateSharedMentalModelVersionFormat,
  validateSharedModelMetadata,
} from "./sharedMentalModelValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllSmmLayersForTests(): void {
  resetSharedMentalModelDomainLayerForTests();
  resetSmmPlatformFoundationForTests();
}

function buildMetadata(): SharedModelMetadata {
  return Object.freeze({
    metadataId: "meta-001",
    contractVersion: "SMM/2",
    foundationVersion: "SMM/1",
    label: "Test metadata",
    tags: Object.freeze(["test"]),
    createdAt: FIXED_TIME,
    readOnly: true as const,
  });
}

test.beforeEach(() => {
  resetAllSmmLayersForTests();
});

test("exports SMM/2 domain contract vocabulary", () => {
  assert.equal(SMM_DOMAIN_CONTRACT_VERSION, "SMM/2");
  assert.equal(SMM_DOMAIN_FOUNDATION_DEPENDENCY, "SMM/1");
  assert.equal(SMM_DOMAIN_MODEL_KEYS.length, 14);
  assert.equal(SMM_DOMAIN_PUBLIC_API_REGISTRY.length, 4);
});

test("builds immutable domain registries", () => {
  const result = buildSharedMentalModelContracts(FIXED_TIME);
  assert.equal(result.success, true);
  assert.equal(isSharedMentalModelRegistryFrozen(), true);
  const registry = getSharedMentalModelContractRegistry();
  assert.equal(registry.domainCount, 14);
  assert.equal(registry.contractCount, 14);
  assert.equal(registry.artifactCount, 5);
  assert.ok(registry.versionCount > 0);
  assert.ok(registry.extensionCount > 0);
  for (const domain of registry.domainRegistry) {
    assert.equal(domain.interfaceOnly, true);
    assert.equal(domain.contractVersion, "SMM/2");
    assert.equal(domain.foundationVersion, "SMM/1");
  }
});

test("validates contract registry after build", () => {
  buildSharedMentalModelContracts(FIXED_TIME);
  const validation = validateSharedMentalModelContracts();
  assert.equal(validation.valid, true);
  assert.equal(validateDomainIdentityUniqueness(getSharedMentalModelContractRegistry()).valid, true);
});

test("generates domain manifest with compatibility", () => {
  buildSharedMentalModelContracts(FIXED_TIME);
  const manifest = getSharedMentalModelManifest();
  assert.equal(manifest.version, "SMM/2");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.compatibility.includes("SMM/1"));
  assert.equal(manifest.domainModelKeys.length, 14);
});

test("defines interface-only domain model shapes", () => {
  const metadata = buildMetadata();
  const mentalModel: SharedMentalModel = Object.freeze({
    modelId: "model-001",
    modelVersion: "SMM/2",
    scopeKey: "workspace",
    label: "Workspace model",
    description: "Reference model",
    contentRef: "content-ref-001",
    metadata,
    readOnly: true as const,
  });
  const belief: SharedBelief = Object.freeze({
    beliefId: "belief-001",
    modelId: "model-001",
    statementRef: "statement-ref-001",
    confidenceRef: "confidence-ref-001",
    scopeKey: "workspace",
    metadata,
    readOnly: true as const,
  });
  const assumption: SharedAssumption = Object.freeze({
    assumptionId: "assumption-001",
    modelId: "model-001",
    statementRef: "assumption-ref-001",
    scopeKey: "scenario",
    metadata,
    readOnly: true as const,
  });
  const constraint: SharedConstraint = Object.freeze({
    constraintId: "constraint-001",
    modelId: "model-001",
    ruleRef: "rule-ref-001",
    scopeKey: "organization",
    metadata,
    readOnly: true as const,
  });
  const perspective: SharedPerspective = Object.freeze({
    perspectiveId: "perspective-001",
    modelId: "model-001",
    viewpointRef: "viewpoint-ref-001",
    scopeKey: "executive",
    metadata,
    readOnly: true as const,
  });
  const narrative: SharedNarrative = Object.freeze({
    narrativeId: "narrative-001",
    modelId: "model-001",
    storyRef: "story-ref-001",
    scopeKey: "scenario",
    metadata,
    readOnly: true as const,
  });
  const executiveView: SharedExecutiveView = Object.freeze({
    viewId: "view-exec-001",
    modelId: "model-001",
    executiveRef: "exec-ref-001",
    summaryRef: "summary-ref-001",
    metadata,
    readOnly: true as const,
  });
  const organizationView: SharedOrganizationView = Object.freeze({
    viewId: "view-org-001",
    modelId: "model-001",
    organizationRef: "org-ref-001",
    summaryRef: "summary-ref-001",
    metadata,
    readOnly: true as const,
  });
  const workspaceView: SharedWorkspaceView = Object.freeze({
    viewId: "view-ws-001",
    modelId: "model-001",
    workspaceRef: "ws-ref-001",
    summaryRef: "summary-ref-001",
    metadata,
    readOnly: true as const,
  });
  const scenarioView: SharedScenarioView = Object.freeze({
    viewId: "view-scenario-001",
    modelId: "model-001",
    scenarioRef: "scenario-ref-001",
    summaryRef: "summary-ref-001",
    metadata,
    readOnly: true as const,
  });
  const snapshot: SharedModelSnapshot = Object.freeze({
    snapshotId: "snap-001",
    modelId: "model-001",
    modelVersion: "SMM/2",
    payloadRef: "payload-ref-001",
    capturedAt: FIXED_TIME,
    metadata,
    readOnly: true as const,
  });
  const reference: SharedModelReference = Object.freeze({
    referenceId: "ref-001",
    modelId: "model-001",
    targetRef: "target-ref-001",
    scopeKey: "workspace",
    metadata,
    readOnly: true as const,
  });
  const version: SharedModelVersion = Object.freeze({
    versionId: "ver-001",
    modelId: "model-001",
    versionLabel: "SMM/2",
    compatibility: Object.freeze(["SMM/1", "SMM/2"]),
    metadata,
    readOnly: true as const,
  });
  assert.equal(mentalModel.modelId, "model-001");
  assert.equal(belief.beliefId, "belief-001");
  assert.equal(assumption.assumptionId, "assumption-001");
  assert.equal(constraint.constraintId, "constraint-001");
  assert.equal(perspective.perspectiveId, "perspective-001");
  assert.equal(narrative.narrativeId, "narrative-001");
  assert.equal(executiveView.viewId, "view-exec-001");
  assert.equal(organizationView.viewId, "view-org-001");
  assert.equal(workspaceView.viewId, "view-ws-001");
  assert.equal(scenarioView.viewId, "view-scenario-001");
  assert.equal(snapshot.snapshotId, "snap-001");
  assert.equal(reference.referenceId, "ref-001");
  assert.equal(version.versionId, "ver-001");
  assert.equal(validateSharedModelMetadata(metadata).valid, true);
});

test("validates domain and artifact keys", () => {
  buildSharedMentalModelContracts(FIXED_TIME);
  assert.equal(isSharedMentalModelDomainKey("mental_model"), true);
  assert.equal(isSharedMentalModelDomainKey("unknown"), false);
  assert.equal(isSharedMentalModelArtifactKey("belief"), true);
  assert.equal(isSharedMentalModelArtifactKey("executive_view"), false);
});

test("validates version format and SMM-1 compatibility", () => {
  assert.equal(validateSharedMentalModelVersionFormat("SMM/2"), true);
  assert.equal(validateSharedMentalModelVersionFormat("LLM/1"), false);
  buildSharedMentalModelContracts(FIXED_TIME);
  const registry = getSharedMentalModelContractRegistry();
  assert.ok(registry.versionRegistry[0].compatibility.includes(SMM_PLATFORM_CONTRACT_VERSION));
});

test("exposes stable public exports", () => {
  buildSharedMentalModelContracts(FIXED_TIME);
  assert.equal(typeof SharedMentalModelDomainPlatform.buildSharedMentalModelContracts, "function");
  assert.equal(SharedMentalModelDomainPlatform.version, "SMM/2");
  assert.ok(SMM_DOMAIN_PRINCIPLES.includes("interface_only_domain_contracts"));
  assert.ok(SMM_DOMAIN_MUST_NOT_OWN.includes("conflict_detection"));
});

test("requires SMM-1 foundation without modifying it", async () => {
  const { readFile } = await import("node:fs/promises");
  const smm1Files = [
    "smmPlatformContracts.ts",
    "smmPlatformExports.ts",
    "smmPlatformRegistry.ts",
  ];
  for (const file of smm1Files) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    buildSharedMentalModelContracts(FIXED_TIME);
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement inference or runtime services", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "sharedMentalModelContracts.ts",
    "sharedMentalModelTypes.ts",
    "sharedMentalModelRegistry.ts",
    "sharedMentalModelValidation.ts",
    "sharedMentalModelManifest.ts",
    "sharedMentalModelExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
    assert.equal(source.includes("similarity("), false, `${file} must not implement similarity`);
    assert.equal(source.includes("align("), false, `${file} must not implement alignment`);
  }
});
