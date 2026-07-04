import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveContextBuilder } from "./executiveContextIndex.ts";
import { ExecutiveContextQueryLayer } from "./executiveContextQueryIndex.ts";
import {
  ExecutiveContextCertificationLayer,
  buildExecutiveContextExportBundle,
  compareExecutiveContextExportBundles,
  listExecutiveContextRegressionApiCoverage,
  runExecutiveContextCertification,
  runExecutiveContextRegression,
  validateExecutiveContextExportBundle,
} from "./executiveContextCertificationIndex.ts";

test("generates executive context export bundle", () => {
  const bundle = buildExecutiveContextExportBundle();

  assert.equal(bundle.exportManifest.exportVersion, "APP-CTX-3");
  assert.equal(bundle.exportMetadata.contextVersion, "APP-CTX-1");
  assert.equal(bundle.contextSnapshot.entryCount, 13);
});

test("validates executive context export bundle", () => {
  assert.equal(validateExecutiveContextExportBundle(buildExecutiveContextExportBundle()).valid, true);
});

test("compares executive context export bundles", () => {
  const left = buildExecutiveContextExportBundle();
  const right = buildExecutiveContextExportBundle();

  assert.equal(compareExecutiveContextExportBundles(left, right).equal, true);
});

test("passes executive context certification", () => {
  assert.equal(runExecutiveContextCertification().status, "PASS");
});

test("returns executive context certification gates", () => {
  const certification = runExecutiveContextCertification();

  assert.equal(certification.gates.length, 10);
  assert.equal(certification.gates.every((gate) => gate.passed), true);
  assert.equal(certification.diagnostics.every((diagnostic) => diagnostic.severity === "info"), true);
});

test("passes executive context regression", () => {
  const regression = runExecutiveContextRegression();

  assert.equal(regression.status, "PASS");
  assert.equal(regression.failed, 0);
  assert.equal(regression.entries.length, 3);
});

test("returns executive context regression API coverage", () => {
  const coverage = listExecutiveContextRegressionApiCoverage();

  assert.equal(coverage.includes("ExecutiveContextBuilder"), true);
  assert.equal(coverage.includes("ExecutiveContextQueryLayer"), true);
  assert.equal(coverage.includes("ExecutiveContextCertificationLayer"), true);
});

test("exports manifest metadata", () => {
  const bundle = buildExecutiveContextExportBundle();

  assert.equal(bundle.contextManifest.contextVersion, "APP-CTX-1");
  assert.equal(bundle.contextManifest.consumedAppDomainPlatform, "APP-DOM-4");
});

test("exports snapshot metadata", () => {
  const bundle = buildExecutiveContextExportBundle();

  assert.equal(bundle.contextSnapshot.metadataOnly, true);
  assert.equal(bundle.exportMetadata.snapshotEntryCount, bundle.contextSnapshot.entryCount);
});

test("uses deterministic export fingerprint", () => {
  const first = buildExecutiveContextExportBundle();
  const second = buildExecutiveContextExportBundle();

  assert.equal(first.fingerprint, second.fingerprint);
});

test("exports public certification APIs", () => {
  assert.equal(typeof ExecutiveContextCertificationLayer.buildExecutiveContextExportBundle, "function");
  assert.equal(typeof ExecutiveContextCertificationLayer.runExecutiveContextCertification, "function");
  assert.equal(Object.isFrozen(ExecutiveContextCertificationLayer), true);
});

test("keeps APP-CTX-1 compatibility", () => {
  assert.equal(ExecutiveContextBuilder.isExecutiveContextValid(ExecutiveContextBuilder.createExecutiveContext()), true);
});

test("keeps APP-CTX-2 compatibility", () => {
  const snapshot = ExecutiveContextQueryLayer.buildExecutiveContextSnapshot(ExecutiveContextBuilder.createExecutiveContext());

  assert.equal(ExecutiveContextQueryLayer.validateExecutiveContextSnapshot(snapshot).valid, true);
});

test("keeps APP-DOM compatibility", () => {
  assert.equal(ExecutiveContextBuilder.buildExecutiveContextManifest().consumedAppDomainPlatform, "APP-DOM-4");
});

test("does not expose runtime intelligence behavior", () => {
  const coverage = listExecutiveContextRegressionApiCoverage().join(" ");

  assert.equal(coverage.includes("execute"), false);
  assert.equal(coverage.includes("infer"), false);
  assert.equal(coverage.includes("score"), false);
  assert.equal(coverage.includes("rank"), false);
});
