import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  buildDecisionJournalPlatformManifest,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  validateDecisionJournalPlatformManifest,
} from "./decisionJournalPlatformCertificationManifest.ts";
import {
  DecisionJournalPlatformCertification,
  getDecisionJournalPlatformCertificationReport,
  getDecisionJournalPlatformManifest,
  resetDecisionJournalPlatformCertificationReportForTests,
  runDecisionJournalPlatformCertification,
  runDecisionJournalPlatformRegression,
  validateDecisionJournalPlatform,
} from "./decisionJournalPlatformCertification.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetDecisionJournalPlatformCertificationReportForTests();
});

test("exports APP-8/8 platform certification contract", () => {
  assert.equal(DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "APP-8/8");
  assert.equal(DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS.length, 26);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-journal/decisionJournalPlatformCertification.ts",
    allowedFiles: DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("validates platform manifest", () => {
  const manifest = buildDecisionJournalPlatformManifest(FIXED_TIME, false);
  const validation = validateDecisionJournalPlatformManifest(manifest);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(manifest.phases.length, 7);
  assert.equal(manifest.consumers.length, 7);
  assert.equal(manifest.certificationGroups.length, 26);
  assert.equal(manifest.appId, "APP-8");
});

test("validates decision journal platform without mutation", () => {
  const validation = validateDecisionJournalPlatform(FIXED_TIME);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(validation.readOnly, true);
});

test("runs full APP-8 platform regression", () => {
  const regression = runDecisionJournalPlatformRegression();
  assert.equal(regression.success, true, regression.summary);
  assert.equal(regression.layersTotal, 7);
  assert.equal(regression.layersPassed, 7);
  assert.equal(regression.priorPhasesPreserved, true);
  assert.ok(regression.layerResults.every((entry) => entry.certified));
  assert.ok(regression.layerResults.every((entry) => entry.score === 100));
});

test("certifies complete APP-8 decision journal platform", () => {
  const certification = runDecisionJournalPlatformCertification(FIXED_TIME);
  assert.equal(certification.status, "PASS", certification.summary);
  assert.equal(certification.certified, true);
  assert.equal(certification.readyForFreeze, true);
  assert.equal(certification.certificationScore, 100);
  assert.equal(certification.report.finalPlatformStatus, "CERTIFIED");
  assert.equal(certification.report.groups.length, 26);
  assert.ok(certification.report.groups.every((group) => group.passed));
  assert.equal(certification.failures.length, 0);

  const cached = getDecisionJournalPlatformCertificationReport();
  assert.ok(cached);
  assert.equal(cached?.certificationVersion, "APP-8/8");
});

test("all phase certification groups pass", () => {
  const certification = runDecisionJournalPlatformCertification(FIXED_TIME);
  const phaseGroups = [
    "A_app8_1_foundation",
    "B_app8_2_engine",
    "C_app8_3_query_layer",
    "D_app8_4_reflection_layer",
    "E_app8_5_quality_layer",
    "F_app8_6_retrospective_layer",
    "G_app8_7_api_layer",
  ] as const;

  for (const groupKey of phaseGroups) {
    const entry = certification.report.groups.find((group) => group.groupKey === groupKey);
    assert.ok(entry, groupKey);
    assert.equal(entry?.passed, true, `${groupKey}: ${entry?.checks.map((c) => c.evidence).join("; ")}`);
  }
});

test("verifies public API and consumer contract groups", () => {
  const certification = runDecisionJournalPlatformCertification(FIXED_TIME);
  const facadeGroup = certification.report.groups.find((group) => group.groupKey === "H_public_facade_groups");
  const consumerGroup = certification.report.groups.find((group) => group.groupKey === "I_consumer_contracts");
  const readonlyGroup = certification.report.groups.find((group) => group.groupKey === "N_readonly_consumers");
  const workspaceGroup = certification.report.groups.find((group) => group.groupKey === "O_workspace_controlled_writes");

  assert.equal(facadeGroup?.passed, true);
  assert.equal(consumerGroup?.passed, true);
  assert.equal(readonlyGroup?.passed, true);
  assert.equal(workspaceGroup?.passed, true);
});

test("verifies end-to-end flow and workspace isolation groups", () => {
  const certification = runDecisionJournalPlatformCertification(FIXED_TIME);
  const e2e = certification.report.groups.find((group) => group.groupKey === "K_end_to_end_flow");
  const isolation = certification.report.groups.find((group) => group.groupKey === "J_workspace_isolation");
  const archive = certification.report.groups.find((group) => group.groupKey === "M_archive_policy");
  const mutation = certification.report.groups.find((group) => group.groupKey === "L_mutation_boundaries");

  assert.equal(e2e?.passed, true);
  assert.equal(isolation?.passed, true);
  assert.equal(archive?.passed, true);
  assert.equal(mutation?.passed, true);
});

test("verifies no forbidden coupling groups", () => {
  const certification = runDecisionJournalPlatformCertification(FIXED_TIME);
  const forbiddenGroups = [
    "Q_no_app6_integration",
    "R_no_dashboard_implementation",
    "S_no_assistant_implementation",
    "T_no_visualization_implementation",
    "U_no_persistence",
    "V_no_ai_generation",
  ] as const;

  for (const groupKey of forbiddenGroups) {
    const entry = certification.report.groups.find((group) => group.groupKey === groupKey);
    assert.equal(entry?.passed, true, groupKey);
  }
});

test("readyForFreeze true only when all gates pass", () => {
  const certification = runDecisionJournalPlatformCertification(FIXED_TIME);
  const freezeGroup = certification.report.groups.find((group) => group.groupKey === "Z_ready_for_freeze");
  assert.equal(freezeGroup?.passed, true);
  assert.equal(certification.readyForFreeze, true);
  assert.equal(certification.report.readyForFreeze, true);

  const manifest = getDecisionJournalPlatformManifest(FIXED_TIME);
  assert.equal(manifest.readyForFreeze, true);
});

test("DecisionJournalPlatformCertification namespace exposes public APIs", () => {
  assert.equal(typeof DecisionJournalPlatformCertification.runDecisionJournalPlatformCertification, "function");
  assert.equal(typeof DecisionJournalPlatformCertification.runDecisionJournalPlatformRegression, "function");
  assert.equal(typeof DecisionJournalPlatformCertification.getDecisionJournalPlatformManifest, "function");
  assert.equal(typeof DecisionJournalPlatformCertification.validateDecisionJournalPlatform, "function");
  assert.equal(typeof DecisionJournalPlatformCertification.getDecisionJournalPlatformCertificationReport, "function");
});
