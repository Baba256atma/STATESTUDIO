import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_REASONING_CONTRACT_VERSION,
  ExecutiveReasoningFoundation,
  createExecutiveReasoningRegistry,
  registerExecutiveReasoningPackage,
  type ExecutiveReasoningPackage,
  type ExecutiveReasoningRegistry,
} from "./executiveReasoningIndex.ts";
import { ExecutiveReasoningQueryLayer } from "./executiveReasoningQueryIndex.ts";
import {
  ExecutiveReasoningCertificationLayer,
  buildExecutiveReasoningExportBundle,
  compareExecutiveReasoningExportBundles,
  listExecutiveReasoningRegressionApiCoverage,
  runExecutiveReasoningCertification,
  runExecutiveReasoningRegression,
  validateExecutiveReasoningExportBundle,
} from "./executiveReasoningCertificationIndex.ts";

function metadata(tags: readonly string[]) {
  return Object.freeze({
    source: "app-reason-certification-test",
    description: "Reasoning certification metadata.",
    tags: Object.freeze([...tags]),
    contextPlatformVersion: "APP-CTX-4",
    metadataOnly: true as const,
  });
}

function reasoningPackage(): ExecutiveReasoningPackage {
  return Object.freeze({
    packageId: "executive-reasoning-certification-package",
    packageName: "Executive Reasoning Certification Package",
    contractVersion: EXECUTIVE_REASONING_CONTRACT_VERSION,
    version: "1.0.0",
    description: "Metadata-only package for certification export tests.",
    contracts: Object.freeze([
      Object.freeze({
        contractId: "executive-reasoning-certification-contract",
        label: "Certification Contract",
        description: "Certification contract metadata.",
        inputs: Object.freeze([
          Object.freeze({ inputId: "input.context", label: "Context", description: "Context input metadata.", required: true, contextSection: "workspace" }),
        ]),
        outputs: Object.freeze([
          Object.freeze({ outputId: "output.reasoning", label: "Output", description: "Output metadata.", metadataOnly: true }),
        ]),
        evidence: Object.freeze([
          Object.freeze({ evidenceId: "evidence.context", label: "Evidence", description: "Evidence metadata.", required: true }),
        ]),
        assumptions: Object.freeze([
          Object.freeze({ assumptionId: "assumption.context", label: "Assumption", description: "Assumption metadata.", uncertaintyImpact: "medium" }),
        ]),
        constraints: Object.freeze([
          Object.freeze({ constraintId: "constraint.context", label: "Constraint", description: "Constraint metadata.", severity: "warning" }),
        ]),
        confidence: Object.freeze({ required: true, evidenceRequired: true, assumptionRequired: true, explanation: "Confidence metadata." }),
        trace: Object.freeze({
          required: true,
          inputIds: Object.freeze(["input.context"]),
          outputIds: Object.freeze(["output.reasoning"]),
          evidenceIds: Object.freeze(["evidence.context"]),
          assumptionIds: Object.freeze(["assumption.context"]),
          constraintIds: Object.freeze(["constraint.context"]),
        }),
        metadata: metadata(Object.freeze(["domain:finance", "scope:workspace", "status:active"])),
      }),
    ]),
    metadata: metadata(Object.freeze(["domain:finance", "scope:workspace", "status:active"])),
  });
}

function registry(): ExecutiveReasoningRegistry {
  const created = createExecutiveReasoningRegistry();
  return registerExecutiveReasoningPackage(created, reasoningPackage()).registry;
}

test("generates export bundle", () => {
  const bundle = buildExecutiveReasoningExportBundle(registry());
  assert.equal(bundle.exportManifest.exportVersion, "APP-REASON-3");
  assert.equal(bundle.reasoningManifest.platformVersion, "APP-REASON-1");
  assert.equal(bundle.reasoningSnapshot.packageCount, 1);
  assert.equal(bundle.exportMetadata.contractCount, 1);
  assert.equal(bundle.metadataOnly, true);
});

test("validates export bundle", () => {
  const validation = validateExecutiveReasoningExportBundle(buildExecutiveReasoningExportBundle(registry()));
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("compares matching export bundles", () => {
  const currentRegistry = registry();
  const left = buildExecutiveReasoningExportBundle(currentRegistry);
  const right = buildExecutiveReasoningExportBundle(currentRegistry);
  const comparison = compareExecutiveReasoningExportBundles(left, right);
  assert.equal(comparison.equal, true);
  assert.equal(comparison.diagnostics.length, 0);
});

test("compares different export bundles", () => {
  const left = buildExecutiveReasoningExportBundle(createExecutiveReasoningRegistry());
  const right = buildExecutiveReasoningExportBundle(registry());
  const comparison = compareExecutiveReasoningExportBundles(left, right);
  assert.equal(comparison.equal, false);
  assert.equal(comparison.diagnostics.length, 1);
});

test("runs certification pass", () => {
  const certification = runExecutiveReasoningCertification(registry());
  assert.equal(certification.status, "PASS");
  assert.equal(certification.gates.every((gate) => gate.passed), true);
});

test("publishes certification gates", () => {
  const certification = runExecutiveReasoningCertification(registry());
  assert.deepEqual(
    certification.gates.map((gate) => gate.gateId),
    [
      "app-reason-1-pass",
      "app-reason-2-pass",
      "manifest-valid",
      "snapshot-valid",
      "export-bundle-valid",
      "query-surface-valid",
      "public-api-coverage-valid",
      "deterministic-reproducibility",
      "metadata-only-boundary",
      "immutable-registry",
    ]
  );
});

test("runs regression pass", () => {
  const regression = runExecutiveReasoningRegression();
  assert.equal(regression.status, "PASS");
  assert.equal(regression.failed, 0);
  assert.equal(regression.metadataOnly, true);
});

test("lists regression API coverage", () => {
  const coverage = listExecutiveReasoningRegressionApiCoverage();
  assert.equal(coverage.includes("ExecutiveReasoningFoundation"), true);
  assert.equal(coverage.includes("ExecutiveReasoningQueryLayer"), true);
  assert.equal(coverage.includes("ExecutiveReasoningCertificationLayer"), true);
  assert.equal(new Set(coverage).size, coverage.length);
});

test("includes manifest metadata", () => {
  const bundle = buildExecutiveReasoningExportBundle(registry());
  assert.equal(bundle.reasoningManifest.supportedContractVersion, EXECUTIVE_REASONING_CONTRACT_VERSION);
  assert.equal(bundle.validationMetadata.manifestValidation.valid, true);
});

test("includes snapshot metadata", () => {
  const bundle = buildExecutiveReasoningExportBundle(registry());
  assert.equal(bundle.reasoningSnapshot.entries.length, 1);
  assert.equal(bundle.reasoningSnapshot.deterministic, true);
  assert.equal(bundle.validationMetadata.snapshotValidation.valid, true);
});

test("uses deterministic fingerprint", () => {
  const currentRegistry = registry();
  const left = buildExecutiveReasoningExportBundle(currentRegistry);
  const right = buildExecutiveReasoningExportBundle(currentRegistry);
  assert.equal(left.fingerprint, right.fingerprint);
});

test("exports public certification APIs", () => {
  assert.equal(typeof ExecutiveReasoningCertificationLayer.buildExecutiveReasoningExportBundle, "function");
  assert.equal(typeof ExecutiveReasoningCertificationLayer.validateExecutiveReasoningExportBundle, "function");
  assert.equal(typeof ExecutiveReasoningCertificationLayer.compareExecutiveReasoningExportBundles, "function");
  assert.equal(typeof ExecutiveReasoningCertificationLayer.runExecutiveReasoningCertification, "function");
  assert.equal(typeof ExecutiveReasoningCertificationLayer.runExecutiveReasoningRegression, "function");
});

test("keeps APP-REASON-1 compatibility", () => {
  const currentRegistry = registry();
  assert.equal(ExecutiveReasoningFoundation.validateExecutiveReasoningRegistry(currentRegistry).valid, true);
  assert.equal(ExecutiveReasoningFoundation.validateExecutiveReasoningManifest(ExecutiveReasoningFoundation.buildExecutiveReasoningManifest(currentRegistry)).valid, true);
});

test("keeps APP-REASON-2 compatibility", () => {
  const currentRegistry = registry();
  const snapshot = ExecutiveReasoningQueryLayer.buildExecutiveReasoningSnapshot(currentRegistry);
  assert.equal(ExecutiveReasoningQueryLayer.validateExecutiveReasoningSnapshot(snapshot).valid, true);
  assert.equal(ExecutiveReasoningQueryLayer.findReasoningPackagesByDomain(currentRegistry, "finance").length, 1);
});

test("keeps APP-CTX compatibility through APP-REASON public facade", () => {
  assert.equal(ExecutiveReasoningFoundation.validateExecutiveReasoningFoundation().valid, true);
});

test("is strict TypeScript source without direct internals", () => {
  const sources = [
    readFileSync("app/lib/app-reason/executiveReasoningExportTypes.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningExport.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningCertification.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningRegression.ts", "utf8"),
    readFileSync("app/lib/app-reason/executiveReasoningCertificationIndex.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes("../app-context/"), false);
  assert.equal(sources.includes("../dom/"), false);
  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("execute reasoning"), false);
  assert.equal(sources.includes("LLM"), false);
});
