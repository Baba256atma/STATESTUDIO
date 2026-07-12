import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveRequestIntentPlatformCertificationIndex.ts";
import { ExecutiveRequestIntentCertificationCompatibility, ExecutiveRequestIntentCertificationManifest, ExecutiveRequestIntentCertificationRegistry, ExecutiveRequestIntentPlatformCertification, getExecutiveRequestIntentCertificationSummary, getExecutiveRequestIntentCompatibilitySummary, getExecutiveRequestIntentPlatformCertification } from "./executiveRequestIntentPlatformCertificationIndex.ts";

test("canonical certification immutably aggregates registry, compatibility, and manifest", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentPlatformCertification), true);
  assert.equal(ExecutiveRequestIntentPlatformCertification.registry, ExecutiveRequestIntentCertificationRegistry);
  assert.equal(ExecutiveRequestIntentPlatformCertification.compatibility, ExecutiveRequestIntentCertificationCompatibility);
  assert.equal(ExecutiveRequestIntentPlatformCertification.manifest, ExecutiveRequestIntentCertificationManifest);
});

test("certification registry contains exactly twelve certified unique gates", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentCertificationRegistry), true);
  assert.equal(ExecutiveRequestIntentCertificationRegistry.length, 12);
  assert.equal(ExecutiveRequestIntentCertificationRegistry.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveRequestIntentCertificationRegistry.map(({ identifier }) => identifier)).size, 12);
  assert.equal(ExecutiveRequestIntentCertificationRegistry.every(({ status }) => status === "Certified"), true);
});

test("compatibility metadata covers all eight required architectural targets", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentCertificationCompatibility), true);
  assert.equal(ExecutiveRequestIntentCertificationCompatibility.length, 8);
  assert.equal(ExecutiveRequestIntentCertificationCompatibility.every(Object.isFrozen), true);
  assert.deepEqual(ExecutiveRequestIntentCertificationCompatibility.map(({ target }) => target), [
    "ENG-1 Executive Engine Foundation", "ENG-2:8 Freeze", "ENG-2:9 Public Index",
    "Executive Engine Architecture", "BUS Layer", "OPS Layer", "Advisor Layer", "Core Platform",
  ]);
});

test("manifest references six approved public indices and preserves ownership", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentCertificationManifest), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentCertificationManifest.platformReferences), true);
  assert.equal(Object.values(ExecutiveRequestIntentCertificationManifest.platformReferences).every(Object.isFrozen), true);
  assert.equal(ExecutiveRequestIntentCertificationManifest.dependencyReferences.length, 6);
  assert.equal(ExecutiveRequestIntentCertificationManifest.dependencyReferences.every((reference) => reference.endsWith("Index.ts")), true);
  assert.equal(ExecutiveRequestIntentCertificationManifest.architecturalSummary.ownershipPreserved, true);
  assert.equal(ExecutiveRequestIntentCertificationManifest.architecturalSummary.collisionSafe, true);
});

test("release-readiness and summaries are complete and deterministic", () => {
  const certification = getExecutiveRequestIntentCertificationSummary();
  const compatibility = getExecutiveRequestIntentCompatibilitySummary();
  assert.equal(certification.certifiedGateCount, 12);
  assert.equal(certification.freezeReadiness, "ReadyForFreeze");
  assert.equal(compatibility.compatibilityCount, 8);
  assert.equal(Object.isFrozen(certification), true);
  assert.equal(Object.isFrozen(compatibility), true);
  assert.equal(ExecutiveRequestIntentCertificationManifest.releaseReadiness.publicApiStatus, "Stable");
  assert.equal(ExecutiveRequestIntentCertificationManifest.releaseReadiness.ownershipStatus, "Safe");
  assert.equal(ExecutiveRequestIntentCertificationManifest.releaseReadiness.namespaceStatus, "Stable");
  assert.equal(ExecutiveRequestIntentCertificationManifest.releaseReadiness.metadataStatus, "Complete");
});

test("helper returns the canonical deterministic certification reference", () => {
  assert.equal(getExecutiveRequestIntentPlatformCertification(), ExecutiveRequestIntentPlatformCertification);
  assert.equal(getExecutiveRequestIntentCertificationSummary(), ExecutiveRequestIntentCertificationManifest.certificationSummary);
  assert.equal(getExecutiveRequestIntentCompatibilitySummary(), ExecutiveRequestIntentCertificationManifest.compatibilitySummary);
});

test("public API exposes exactly seven approved symbols", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveRequestIntentPlatformCertification", "ExecutiveRequestIntentCertificationRegistry",
    "ExecutiveRequestIntentCertificationCompatibility", "ExecutiveRequestIntentCertificationManifest",
    "getExecutiveRequestIntentPlatformCertification", "getExecutiveRequestIntentCertificationSummary",
    "getExecutiveRequestIntentCompatibilitySummary",
  ].sort());
});
