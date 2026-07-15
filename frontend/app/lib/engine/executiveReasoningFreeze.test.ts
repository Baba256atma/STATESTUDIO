import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveReasoningFreezeIndex.ts";
import {
  ExecutiveReasoningCompatibility,
  ExecutiveReasoningExtensionPolicy,
  ExecutiveReasoningFreezeMetadata,
  ExecutiveReasoningFreezePlatform,
  ExecutiveReasoningFreezeRegistry,
  getExecutiveReasoningFreeze,
  getExecutiveReasoningFreezeMetadata,
  getExecutiveReasoningFreezeSummary,
} from "./executiveReasoningFreezeIndex.ts";
import { ExecutiveReasoningPipelineFoundation } from "./executiveReasoningPipelineFoundation.ts";
import { ExecutiveReasoningModelPlatform } from "./executiveReasoningModelIndex.ts";
import { ExecutiveReasoningManifest } from "./executiveReasoningManifestPlatform.ts";
import { ExecutiveReasoningPlatform } from "./executiveReasoningPlatformIndex.ts";
import { ExecutiveReasoningValidationPlatform } from "./executiveReasoningValidationPlatform.ts";
import { ExecutiveReasoningCertificationPlatform } from "./executiveReasoningCertificationIndex.ts";

test("publishes exactly eight approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveReasoningCompatibility",
    "ExecutiveReasoningExtensionPolicy",
    "ExecutiveReasoningFreezeMetadata",
    "ExecutiveReasoningFreezePlatform",
    "ExecutiveReasoningFreezeRegistry",
    "getExecutiveReasoningFreeze",
    "getExecutiveReasoningFreezeMetadata",
    "getExecutiveReasoningFreezeSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 8);
});

test("freeze platform contains exactly eight required sections without modifying priors", () => {
  assert.deepEqual(Object.keys(ExecutiveReasoningFreezePlatform), [
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
    "platform",
    "certification",
    "freeze",
  ]);
  assert.equal(Object.keys(ExecutiveReasoningFreezePlatform).length, 8);
  assert.equal(Object.isFrozen(ExecutiveReasoningFreezePlatform), true);
  assert.equal(ExecutiveReasoningFreezePlatform.foundation, ExecutiveReasoningPipelineFoundation);
  assert.equal(ExecutiveReasoningFreezePlatform.model, ExecutiveReasoningModelPlatform);
  assert.equal(ExecutiveReasoningFreezePlatform.validation, ExecutiveReasoningValidationPlatform);
  assert.equal(ExecutiveReasoningFreezePlatform.manifest, ExecutiveReasoningManifest);
  assert.equal(ExecutiveReasoningFreezePlatform.platform, ExecutiveReasoningPlatform);
  assert.equal(ExecutiveReasoningFreezePlatform.certification, ExecutiveReasoningCertificationPlatform);
});

test("freeze metadata is deeply immutable with FROZEN release status", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningFreezeMetadata), true);
  assert.equal(ExecutiveReasoningFreezeMetadata.freezeId, "ENG-6:8");
  assert.equal(ExecutiveReasoningFreezeMetadata.freezeVersion, "1.0.0");
  assert.equal(ExecutiveReasoningFreezeMetadata.namespace, "nexora.engine.executive.reasoning.freeze");
  assert.equal(ExecutiveReasoningFreezeMetadata.freezeStatus, "FROZEN");
  assert.equal(ExecutiveReasoningFreezeMetadata.certificationStatus, "CERTIFIED");
  assert.equal(ExecutiveReasoningFreezeMetadata.releaseStatus, "FROZEN");
  assert.equal(ExecutiveReasoningFreezeMetadata.metadataOnly, true);
  assert.equal(ExecutiveReasoningFreezeMetadata.runtimeFree, true);
  assert.equal(ExecutiveReasoningFreezeMetadata.deterministic, true);
  assert.equal(ExecutiveReasoningFreezeMetadata.publicApiStability, "StableAndFrozen");
  assert.equal(ExecutiveReasoningFreezeMetadata.readiness, "ReadyForPublicIndex");
  assert.equal(getExecutiveReasoningFreezeMetadata(), ExecutiveReasoningFreezeMetadata);
});

test("freeze registry describes certified and frozen inventories", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningFreezeRegistry), true);
  assert.equal(ExecutiveReasoningFreezeRegistry.certifiedPhases.length, 7);
  assert.equal(ExecutiveReasoningFreezeRegistry.frozenPhases.length, 7);
  assert.equal(ExecutiveReasoningFreezeRegistry.frozenComponents.length, 8);
  assert.equal(ExecutiveReasoningFreezeRegistry.frozenModels.length, 8);
  assert.equal(ExecutiveReasoningFreezeRegistry.frozenValidationDomains.length, 10);
  assert.equal(ExecutiveReasoningFreezeRegistry.frozenPublicApis.length, 54);
  assert.equal(
    ExecutiveReasoningFreezeRegistry.frozenPublicApis.every(({ freezeStatus }) => freezeStatus === "FROZEN"),
    true,
  );
});

test("compatibility and extension policies are fully defined", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningCompatibility), true);
  assert.equal(ExecutiveReasoningCompatibility.backwardCompatibility.status, "Compatible");
  assert.equal(ExecutiveReasoningCompatibility.forwardCompatibility.status, "ForwardCompatible");
  assert.equal(ExecutiveReasoningCompatibility.namespaceCompatibility.status, "Compatible");
  assert.equal(ExecutiveReasoningCompatibility.platformCompatibility.status, "FrozenCompatible");
  assert.equal(ExecutiveReasoningCompatibility.modelCompatibility.status, "Compatible");
  assert.equal(ExecutiveReasoningCompatibility.registryCompatibility.status, "Compatible");
  assert.equal(ExecutiveReasoningCompatibility.certificationCompatibility.status, "Compatible");
  assert.equal(ExecutiveReasoningCompatibility.publicApiCompatibility.status, "Stable");
  assert.equal(ExecutiveReasoningCompatibility.publicApiStability, "StableAndFrozen");
  assert.equal(ExecutiveReasoningCompatibility.declarationCount, 8);

  assert.equal(Object.isFrozen(ExecutiveReasoningExtensionPolicy), true);
  assert.equal(ExecutiveReasoningExtensionPolicy.rules.length, 6);
  assert.equal(ExecutiveReasoningExtensionPolicy.publicApiExtensionPolicy, "Frozen");
  assert.equal(ExecutiveReasoningExtensionPolicy.newCapabilityPolicy, "FutureEnginePhasesOnly");
  assert.equal(ExecutiveReasoningExtensionPolicy.existingContractModificationPolicy, "ProhibitedAfterFreeze");
});

test("freeze summary is metadata-derived and ready for public index", () => {
  const summary = getExecutiveReasoningFreezeSummary();
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(summary.totalFrozenPhases, 7);
  assert.equal(summary.totalFrozenComponents, 8);
  assert.equal(summary.totalFrozenModels, 8);
  assert.equal(summary.totalFrozenValidationDomains, 10);
  assert.equal(summary.totalFrozenPublicApis, 54);
  assert.equal(summary.certificationStatus, "CERTIFIED");
  assert.equal(summary.freezeReadiness, "FROZEN");
  assert.equal(summary.publicReleaseReadiness, "ReadyForPublicIndex");
  assert.equal(summary.nextPhase, "ENG-6:9");
  assert.equal(getExecutiveReasoningFreezeSummary(), summary);
});

test("helpers and ownership exclude runtime and AI surfaces", () => {
  assert.equal(getExecutiveReasoningFreeze(), ExecutiveReasoningFreezePlatform);
  assert.equal(ExecutiveReasoningFreezePlatform.freeze.registry, ExecutiveReasoningFreezeRegistry);
  assert.equal(ExecutiveReasoningFreezePlatform.freeze.compatibility, ExecutiveReasoningCompatibility);
  assert.equal(ExecutiveReasoningFreezePlatform.freeze.extensionPolicy, ExecutiveReasoningExtensionPolicy);
  assert.ok(ExecutiveReasoningFreezePlatform.freeze.ownership.neverOwns.includes("reasoning execution"));
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Planner|Scorer|Executor|LLM|OpenAI|Query|Reflect/i.test(name)
    )),
    true,
  );
});
