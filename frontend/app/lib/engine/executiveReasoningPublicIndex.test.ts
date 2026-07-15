import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveReasoningCertificationPlatform } from "./executiveReasoningCertificationIndex.ts";
import { ExecutiveReasoningFreezePlatform } from "./executiveReasoningFreezeIndex.ts";
import { ExecutiveReasoningManifestPlatform } from "./executiveReasoningManifestPlatform.ts";
import { ExecutiveReasoningModelPlatform } from "./executiveReasoningModelIndex.ts";
import {
  ExecutiveConfidenceLevels,
  ExecutiveEvidenceCategories,
  ExecutiveInferenceTypes,
  ExecutiveReasoningDomains,
  ExecutiveReasoningLifecycle,
  ExecutiveReasoningPipelineContracts,
  ExecutiveReasoningPipelineFoundation,
} from "./executiveReasoningPipelineFoundation.ts";
import { ExecutiveReasoningPlatform } from "./executiveReasoningPlatformIndex.ts";
import * as publicApi from "./executiveReasoningPublicIndex.ts";
import {
  ExecutiveReasoningPlatformPublicFoundation,
  ExecutiveReasoningPublicApiRegistry,
  ExecutiveReasoningPublicIndexDescription,
  ExecutiveReasoningPublicIndexId,
  ExecutiveReasoningPublicIndexName,
  ExecutiveReasoningPublicIndexNamespace,
  ExecutiveReasoningPublicIndexStatus,
  ExecutiveReasoningPublicIndexVersion,
  getExecutiveReasoningPublicApiRegistry,
  getExecutiveReasoningPublicFoundation,
  getExecutiveReasoningPublicMetadata,
  getExecutiveReasoningReleaseSummary,
} from "./executiveReasoningPublicIndex.ts";
import {
  ExecutiveReasoningCapabilityRegistry,
  ExecutiveReasoningComponentRegistry,
  ExecutiveReasoningLifecycleRegistry,
  ExecutiveReasoningRegistryMetadata,
} from "./executiveReasoningRegistryIndex.ts";
import { ExecutiveReasoningValidationPlatform } from "./executiveReasoningValidationPlatform.ts";

test("module exposes exactly twelve approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveReasoningPlatformPublicFoundation",
    "ExecutiveReasoningPublicApiRegistry",
    "ExecutiveReasoningPublicIndexDescription",
    "ExecutiveReasoningPublicIndexId",
    "ExecutiveReasoningPublicIndexName",
    "ExecutiveReasoningPublicIndexNamespace",
    "ExecutiveReasoningPublicIndexStatus",
    "ExecutiveReasoningPublicIndexVersion",
    "getExecutiveReasoningPublicApiRegistry",
    "getExecutiveReasoningPublicFoundation",
    "getExecutiveReasoningPublicMetadata",
    "getExecutiveReasoningReleaseSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 12);
});

test("public namespace contains exactly nine ordered immutable sections", () => {
  assert.deepEqual(Object.keys(ExecutiveReasoningPlatformPublicFoundation), [
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
    "platform",
    "certification",
    "freeze",
    "publicIndex",
  ]);
  assert.equal(Object.keys(ExecutiveReasoningPlatformPublicFoundation).length, 9);
  assert.equal(Object.isFrozen(ExecutiveReasoningPlatformPublicFoundation), true);
  assert.equal(
    Object.values(ExecutiveReasoningPlatformPublicFoundation).every(Object.isFrozen),
    true,
  );
});

test("every section references its originating approved public surface", () => {
  const ns = ExecutiveReasoningPlatformPublicFoundation;
  assert.equal(ns.foundation.foundation, ExecutiveReasoningPipelineFoundation);
  assert.equal(ns.foundation.contracts, ExecutiveReasoningPipelineContracts);
  assert.equal(ns.foundation.domains, ExecutiveReasoningDomains);
  assert.equal(ns.foundation.lifecycle, ExecutiveReasoningLifecycle);
  assert.equal(ns.foundation.evidenceCategories, ExecutiveEvidenceCategories);
  assert.equal(ns.foundation.confidenceLevels, ExecutiveConfidenceLevels);
  assert.equal(ns.foundation.inferenceTypes, ExecutiveInferenceTypes);
  assert.equal(ns.registry.components, ExecutiveReasoningComponentRegistry);
  assert.equal(ns.registry.capabilities, ExecutiveReasoningCapabilityRegistry);
  assert.equal(ns.registry.lifecycle, ExecutiveReasoningLifecycleRegistry);
  assert.equal(ns.registry.metadata, ExecutiveReasoningRegistryMetadata);
  assert.equal(ns.model, ExecutiveReasoningModelPlatform);
  assert.equal(ns.validation, ExecutiveReasoningValidationPlatform);
  assert.equal(ns.manifest, ExecutiveReasoningManifestPlatform);
  assert.equal(ns.platform, ExecutiveReasoningPlatform);
  assert.equal(ns.certification, ExecutiveReasoningCertificationPlatform);
  assert.equal(ns.freeze, ExecutiveReasoningFreezePlatform);
  assert.equal(ns.publicIndex.apiRegistry, ExecutiveReasoningPublicApiRegistry);
});

test("public metadata reports Released, Certified, Frozen, and Stable", () => {
  const metadata = getExecutiveReasoningPublicMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(Object.isFrozen(metadata.status), true);
  assert.equal(ExecutiveReasoningPublicIndexId, "ENG-6:9");
  assert.equal(ExecutiveReasoningPublicIndexVersion, "1.0.0");
  assert.equal(ExecutiveReasoningPublicIndexName, "Executive Reasoning Public Index");
  assert.match(ExecutiveReasoningPublicIndexDescription, /public release surface/i);
  assert.equal(
    ExecutiveReasoningPublicIndexNamespace,
    "nexora.engine.executive.reasoning.public",
  );
  assert.equal(ExecutiveReasoningPublicIndexStatus.released, "Released");
  assert.equal(ExecutiveReasoningPublicIndexStatus.certified, "Certified");
  assert.equal(ExecutiveReasoningPublicIndexStatus.frozen, "Frozen");
  assert.equal(ExecutiveReasoningPublicIndexStatus.stable, "Stable");
  assert.equal(metadata.releaseStatus, "Released");
  assert.equal(metadata.certificationStatus, "Certified");
  assert.equal(metadata.freezeStatus, "Frozen");
  assert.equal(metadata.publicApiStatus, "Stable");
});

test("public API registry aggregates ENG-6:1 through ENG-6:9 uniquely", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningPublicApiRegistry), true);
  assert.equal(ExecutiveReasoningPublicApiRegistry.every(Object.isFrozen), true);
  assert.equal(
    new Set(ExecutiveReasoningPublicApiRegistry.map(({ name }) => name)).size,
    ExecutiveReasoningPublicApiRegistry.length,
  );
  assert.equal(ExecutiveReasoningPublicApiRegistry.filter(({ originatingPhase }) => originatingPhase === "ENG-6:1").length, 7);
  assert.equal(ExecutiveReasoningPublicApiRegistry.filter(({ originatingPhase }) => originatingPhase === "ENG-6:2").length, 7);
  assert.equal(ExecutiveReasoningPublicApiRegistry.filter(({ originatingPhase }) => originatingPhase === "ENG-6:3").length, 8);
  assert.equal(ExecutiveReasoningPublicApiRegistry.filter(({ originatingPhase }) => originatingPhase === "ENG-6:4").length, 8);
  assert.equal(ExecutiveReasoningPublicApiRegistry.filter(({ originatingPhase }) => originatingPhase === "ENG-6:5").length, 8);
  assert.equal(ExecutiveReasoningPublicApiRegistry.filter(({ originatingPhase }) => originatingPhase === "ENG-6:6").length, 8);
  assert.equal(ExecutiveReasoningPublicApiRegistry.filter(({ originatingPhase }) => originatingPhase === "ENG-6:7").length, 8);
  assert.equal(ExecutiveReasoningPublicApiRegistry.filter(({ originatingPhase }) => originatingPhase === "ENG-6:8").length, 7);
  assert.equal(ExecutiveReasoningPublicApiRegistry.filter(({ originatingPhase }) => originatingPhase === "ENG-6:9").length, 12);
  assert.equal(ExecutiveReasoningPublicApiRegistry.length, 73);
  assert.equal(
    ExecutiveReasoningPublicApiRegistry.every(
      ({ stability, releaseStatus }) => stability === "Stable" && releaseStatus === "Released",
    ),
    true,
  );
});

test("helpers return deterministic immutable metadata only", () => {
  assert.equal(getExecutiveReasoningPublicFoundation(), ExecutiveReasoningPlatformPublicFoundation);
  assert.equal(getExecutiveReasoningPublicApiRegistry(), ExecutiveReasoningPublicApiRegistry);
  assert.equal(getExecutiveReasoningPublicMetadata(), getExecutiveReasoningPublicMetadata());
  assert.equal(getExecutiveReasoningReleaseSummary(), getExecutiveReasoningReleaseSummary());
  assert.equal(Object.isFrozen(getExecutiveReasoningPublicMetadata()), true);
  assert.equal(Object.isFrozen(getExecutiveReasoningReleaseSummary()), true);
  const summary = getExecutiveReasoningReleaseSummary();
  assert.equal(summary.sectionCount, 9);
  assert.equal(summary.publicApiCount, ExecutiveReasoningPublicApiRegistry.length);
  assert.equal(summary.releaseStatus, "Released");
  assert.equal(summary.certificationStatus, "Certified");
  assert.equal(summary.freezeStatus, "Frozen");
  assert.equal(summary.publicApiStatus, "Stable");
  assert.equal(summary.lockIdentifier, "ENG-6-LOCKED");
});

test("public surface exposes no runtime, AI, or internal leakage APIs", () => {
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Runner|Planner|Scorer|Executor|LLM|OpenAI|Query|Reflect|Internal|Private/i.test(name)
    )),
    true,
  );
});
