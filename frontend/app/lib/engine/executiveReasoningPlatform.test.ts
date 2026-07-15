import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveReasoningPlatformIndex.ts";
import {
  ExecutiveReasoningPlatform,
  ExecutiveReasoningPlatformMetadata,
  ExecutiveReasoningPlatformRegistry,
  ExecutiveReasoningPlatformSummary,
  getExecutiveReasoningPlatform,
  getExecutiveReasoningPlatformMetadata,
  getExecutiveReasoningPlatformRegistry,
  getExecutiveReasoningPlatformSummary,
} from "./executiveReasoningPlatformIndex.ts";
import { ExecutiveReasoningPipelineFoundation } from "./executiveReasoningPipelineFoundation.ts";
import { ExecutiveReasoningModelPlatform } from "./executiveReasoningModelIndex.ts";
import { ExecutiveReasoningManifest } from "./executiveReasoningManifestPlatform.ts";
import { ExecutiveReasoningValidationPlatform } from "./executiveReasoningValidationPlatform.ts";
import { ExecutiveReasoningPlatformReadiness } from "./executiveReasoningPlatformReadiness.ts";

test("publishes exactly eight approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveReasoningPlatform",
    "ExecutiveReasoningPlatformMetadata",
    "ExecutiveReasoningPlatformRegistry",
    "ExecutiveReasoningPlatformSummary",
    "getExecutiveReasoningPlatform",
    "getExecutiveReasoningPlatformMetadata",
    "getExecutiveReasoningPlatformRegistry",
    "getExecutiveReasoningPlatformSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 8);
});

test("platform contains exactly six required sections without modification of priors", () => {
  assert.deepEqual(Object.keys(ExecutiveReasoningPlatform), [
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
    "platform",
  ]);
  assert.equal(Object.keys(ExecutiveReasoningPlatform).length, 6);
  assert.equal(Object.isFrozen(ExecutiveReasoningPlatform), true);
  assert.equal(ExecutiveReasoningPlatform.foundation, ExecutiveReasoningPipelineFoundation);
  assert.equal(ExecutiveReasoningPlatform.model, ExecutiveReasoningModelPlatform);
  assert.equal(ExecutiveReasoningPlatform.validation, ExecutiveReasoningValidationPlatform);
  assert.equal(ExecutiveReasoningPlatform.manifest, ExecutiveReasoningManifest);
});

test("platform metadata is immutable and deterministic", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningPlatformMetadata), true);
  assert.equal(ExecutiveReasoningPlatformMetadata.platformId, "ENG-6:6");
  assert.equal(ExecutiveReasoningPlatformMetadata.platformName, "Executive Reasoning Platform");
  assert.equal(ExecutiveReasoningPlatformMetadata.version, "1.0.0");
  assert.equal(ExecutiveReasoningPlatformMetadata.namespace, "nexora.engine.executive.reasoning.platform");
  assert.equal(ExecutiveReasoningPlatformMetadata.owner, "ENG-6");
  assert.equal(ExecutiveReasoningPlatformMetadata.releaseStatus, "Published");
  assert.equal(ExecutiveReasoningPlatformMetadata.metadataOnly, true);
  assert.equal(ExecutiveReasoningPlatformMetadata.runtimeFree, true);
  assert.equal(ExecutiveReasoningPlatformMetadata.deterministic, true);
  assert.equal(ExecutiveReasoningPlatformMetadata.nextPhase, "ENG-6:7");
  assert.equal(getExecutiveReasoningPlatformMetadata(), ExecutiveReasoningPlatformMetadata);
});

test("platform registry accurately reflects all prior phases", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningPlatformRegistry), true);
  assert.equal(ExecutiveReasoningPlatformRegistry.registeredPhases.length, 6);
  assert.deepEqual(
    ExecutiveReasoningPlatformRegistry.registeredPhases.map(({ phase }) => phase),
    ["ENG-6:1", "ENG-6:2", "ENG-6:3", "ENG-6:4", "ENG-6:5", "ENG-6:6"],
  );
  assert.equal(ExecutiveReasoningPlatformRegistry.registeredModels.length, 8);
  assert.equal(ExecutiveReasoningPlatformRegistry.registeredComponents.length, 8);
  assert.equal(ExecutiveReasoningPlatformRegistry.registeredValidationDomains.length, 10);
  assert.equal(ExecutiveReasoningPlatformRegistry.registeredPublicApis.length, 38);
  assert.equal(
    ExecutiveReasoningPlatformRegistry.registeredPublicApis.filter(
      ({ originatingPhase }) => originatingPhase === "ENG-6:5",
    ).length,
    8,
  );
  assert.equal(getExecutiveReasoningPlatformRegistry(), ExecutiveReasoningPlatformRegistry);
});

test("platform summary is metadata-derived", () => {
  const summary = getExecutiveReasoningPlatformSummary();
  assert.equal(summary, ExecutiveReasoningPlatformSummary);
  assert.equal(Object.isFrozen(summary), true);
  assert.equal(summary.totalPhases, 6);
  assert.equal(summary.totalComponents, 8);
  assert.equal(summary.totalCapabilities, 8);
  assert.equal(summary.totalModels, 8);
  assert.equal(summary.totalRelationships, 6);
  assert.equal(summary.totalValidationDomains, 10);
  assert.equal(summary.totalValidationRules, 30);
  assert.equal(summary.totalPublicApis, 38);
  assert.equal(summary.releaseReadiness, "ReadyForCertification");
  assert.equal(getExecutiveReasoningPlatformSummary(), getExecutiveReasoningPlatformSummary());
});

test("platform readiness reports READY based solely on declared metadata", () => {
  assert.equal(ExecutiveReasoningPlatformReadiness.Foundation, "PASS");
  assert.equal(ExecutiveReasoningPlatformReadiness.Registry, "PASS");
  assert.equal(ExecutiveReasoningPlatformReadiness.Model, "PASS");
  assert.equal(ExecutiveReasoningPlatformReadiness.Validation, "PASS");
  assert.equal(ExecutiveReasoningPlatformReadiness.Manifest, "PASS");
  assert.equal(ExecutiveReasoningPlatformReadiness.platformStatus, "READY");
  assert.equal(ExecutiveReasoningPlatform.platform.readiness, ExecutiveReasoningPlatformReadiness);
});

test("helpers and ownership exclude runtime and AI surfaces", () => {
  assert.equal(getExecutiveReasoningPlatform(), ExecutiveReasoningPlatform);
  assert.ok(ExecutiveReasoningPlatform.platform.ownership.neverOwns.includes("reasoning execution"));
  assert.ok(ExecutiveReasoningPlatform.platform.ownership.neverOwns.includes("confidence calculation"));
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Planner|Scorer|Executor|LLM|OpenAI|Query|Reflect/i.test(name)
    )),
    true,
  );
});
