import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveReasoningCertificationIndex.ts";
import {
  ExecutiveReasoningCertificationManifest,
  ExecutiveReasoningCertificationPlatform,
  ExecutiveReasoningCertificationRegistry,
  ExecutiveReasoningCertificationSummary,
  getExecutiveReasoningCertification,
  getExecutiveReasoningCertificationGateById,
  getExecutiveReasoningCertificationMetadata,
  getExecutiveReasoningCertificationSummary,
} from "./executiveReasoningCertificationIndex.ts";
import { ExecutiveReasoningCertificationRunner } from "./executiveReasoningCertificationRunner.ts";

test("publishes exactly eight approved public exports", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveReasoningCertificationManifest",
    "ExecutiveReasoningCertificationPlatform",
    "ExecutiveReasoningCertificationRegistry",
    "ExecutiveReasoningCertificationSummary",
    "getExecutiveReasoningCertification",
    "getExecutiveReasoningCertificationGateById",
    "getExecutiveReasoningCertificationMetadata",
    "getExecutiveReasoningCertificationSummary",
  ].sort());
  assert.equal(Object.keys(publicApi).length, 8);
});

test("defines exactly twelve immutable certification gates", () => {
  assert.equal(ExecutiveReasoningCertificationRegistry.totalGates, 12);
  assert.equal(ExecutiveReasoningCertificationRegistry.gates.length, 12);
  assert.equal(Object.isFrozen(ExecutiveReasoningCertificationRegistry.gates), true);
  assert.equal(ExecutiveReasoningCertificationRegistry.gates.every(Object.isFrozen), true);
  assert.deepEqual(
    ExecutiveReasoningCertificationRegistry.gates.map(({ title }) => title),
    [
      "Foundation Certification",
      "Registry Certification",
      "Model Certification",
      "Validation Certification",
      "Manifest Certification",
      "Platform Certification",
      "Ownership Certification",
      "Dependency Certification",
      "Public API Certification",
      "Compatibility Certification",
      "Immutability Certification",
      "Release Readiness Certification",
    ],
  );
  assert.equal(
    ExecutiveReasoningCertificationRegistry.gates.every(({ status }) => status === "PASS"),
    true,
  );
});

test("certification registry metadata is complete and placeholder-dated", () => {
  assert.equal(ExecutiveReasoningCertificationRegistry.certificationId, "ENG-6:7");
  assert.equal(ExecutiveReasoningCertificationRegistry.version, "1.0.0");
  assert.equal(
    ExecutiveReasoningCertificationRegistry.namespace,
    "nexora.engine.executive.reasoning.certification",
  );
  assert.equal(ExecutiveReasoningCertificationRegistry.certificationStatus, "CERTIFIED");
  assert.deepEqual([...ExecutiveReasoningCertificationRegistry.certifiedPhases], [
    "ENG-6:1",
    "ENG-6:2",
    "ENG-6:3",
    "ENG-6:4",
    "ENG-6:5",
    "ENG-6:6",
  ]);
  assert.equal(
    ExecutiveReasoningCertificationRegistry.certificationDatePlaceholder,
    "CERTIFICATION_DATE_UNSET",
  );
  assert.equal(ExecutiveReasoningCertificationRegistry.releaseTarget, "ENG-6:8");
  assert.ok(ExecutiveReasoningCertificationRegistry.rejectedDependencies.includes("BUS"));
  assert.ok(ExecutiveReasoningCertificationRegistry.rejectedDependencies.includes("OPS"));
  assert.ok(ExecutiveReasoningCertificationRegistry.allowedDependencies.includes("ENG-6:6"));
});

test("certification runner aggregates metadata only and reports CERTIFIED", () => {
  const result = ExecutiveReasoningCertificationRunner.run();
  assert.equal(Object.isFrozen(result), true);
  assert.equal(result.status, "CERTIFIED");
  assert.equal(result.passCount, 12);
  assert.equal(result.warningCount, 0);
  assert.equal(result.failCount, 0);
  assert.equal(result.totalGateCount, 12);
  assert.equal(result.freezeReadiness, "ReadyForFreeze");
  assert.deepEqual(ExecutiveReasoningCertificationRunner.run(), result);
});

test("certification summary is metadata-derived", () => {
  const summary = getExecutiveReasoningCertificationSummary();
  assert.equal(summary, ExecutiveReasoningCertificationSummary);
  assert.equal(summary.totalGates, 12);
  assert.equal(summary.passedGates, 12);
  assert.equal(summary.warningCount, 0);
  assert.equal(summary.failureCount, 0);
  assert.equal(summary.certificationStatus, "CERTIFIED");
  assert.equal(summary.freezeReadiness, "ReadyForFreeze");
  assert.equal(summary.nextPhase, "ENG-6:8");
  assert.equal(getExecutiveReasoningCertificationSummary(), summary);
});

test("platform aggregates registry, manifest, and gate lookup", () => {
  assert.equal(Object.isFrozen(ExecutiveReasoningCertificationPlatform), true);
  assert.equal(ExecutiveReasoningCertificationPlatform.registry, ExecutiveReasoningCertificationRegistry);
  assert.equal(ExecutiveReasoningCertificationPlatform.manifest, ExecutiveReasoningCertificationManifest);
  assert.equal(ExecutiveReasoningCertificationPlatform.summary, ExecutiveReasoningCertificationSummary);
  assert.equal(getExecutiveReasoningCertification(), ExecutiveReasoningCertificationPlatform);
  assert.equal(getExecutiveReasoningCertificationMetadata().certificationStatus, "CERTIFIED");
  assert.equal(getExecutiveReasoningCertificationMetadata().freezeReadiness, "ReadyForFreeze");
  assert.equal(
    getExecutiveReasoningCertificationGateById("eng-6-cert-gate-foundation")?.title,
    "Foundation Certification",
  );
  assert.equal(getExecutiveReasoningCertificationGateById("missing"), undefined);
  assert.equal(ExecutiveReasoningCertificationManifest.certifiedComponents.length, 6);
  assert.equal(Object.keys(ExecutiveReasoningCertificationPlatform.manifest).includes("gateInventory"), true);
});

test("public surface excludes runtime and AI APIs", () => {
  assert.ok(ExecutiveReasoningCertificationPlatform.ownership.neverOwns.includes("reasoning execution"));
  assert.equal(
    Object.keys(publicApi).every((name) => (
      !/Builder|Planner|Scorer|Executor|LLM|OpenAI|Query|Reflect/i.test(name)
    )),
    true,
  );
});
