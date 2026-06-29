import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  buildBusinessTimelinePlatformManifest,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  validateBusinessTimelinePlatformManifest,
} from "./businessTimelinePlatformCertificationManifest.ts";
import {
  BusinessTimelinePlatformCertification,
  getBusinessTimelinePlatformCertificationReport,
  getBusinessTimelinePlatformManifest,
  resetBusinessTimelinePlatformCertificationReportForTests,
  runBusinessTimelinePlatformCertification,
  runBusinessTimelinePlatformRegression,
  validateBusinessTimelinePlatform,
} from "./businessTimelinePlatformCertification.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetBusinessTimelinePlatformCertificationReportForTests();
});

test("exports APP-7/7 platform certification contract", () => {
  assert.equal(BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "APP-7/7");
  assert.equal(BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS.length, 25);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/business-timeline/businessTimelinePlatformCertification.ts",
    allowedFiles: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("validates platform manifest", () => {
  const manifest = buildBusinessTimelinePlatformManifest(FIXED_TIME, false);
  const validation = validateBusinessTimelinePlatformManifest(manifest);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(manifest.phases.length, 6);
  assert.equal(manifest.consumers.length, 7);
  assert.equal(manifest.certificationGroups.length, 25);
  assert.equal(manifest.appId, "APP-7");
});

test("validates business timeline platform without mutation", () => {
  const validation = validateBusinessTimelinePlatform(FIXED_TIME);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(validation.readOnly, true);
});

test("runs full APP-7 platform regression", () => {
  const regression = runBusinessTimelinePlatformRegression();
  assert.equal(regression.success, true, regression.summary);
  assert.equal(regression.layersTotal, 6);
  assert.equal(regression.layersPassed, 6);
  assert.equal(regression.priorPhasesPreserved, true);
  assert.ok(regression.layerResults.every((entry) => entry.certified));
  assert.ok(regression.layerResults.every((entry) => entry.score === 100));
});

test("certifies complete APP-7 business timeline platform", () => {
  const certification = runBusinessTimelinePlatformCertification(FIXED_TIME);
  assert.equal(certification.status, "PASS", certification.summary);
  assert.equal(certification.certified, true);
  assert.equal(certification.readyForFreeze, true);
  assert.equal(certification.certificationScore, 100);
  assert.equal(certification.report.finalPlatformStatus, "CERTIFIED");
  assert.equal(certification.report.groups.length, 25);
  assert.ok(certification.report.groups.every((group) => group.passed));
  assert.equal(certification.failures.length, 0);

  const cached = getBusinessTimelinePlatformCertificationReport();
  assert.ok(cached);
  assert.equal(cached?.certificationVersion, "APP-7/7");
});

test("all phase certification groups pass", () => {
  const certification = runBusinessTimelinePlatformCertification(FIXED_TIME);
  const phaseGroups = [
    "A_app7_1_foundation",
    "B_app7_2_event_engine",
    "C_app7_3_query_layer",
    "D_app7_4_lifecycle_layer",
    "E_app7_5_context_layer",
    "F_app7_6_api_layer",
  ] as const;

  for (const groupKey of phaseGroups) {
    const entry = certification.report.groups.find((group) => group.groupKey === groupKey);
    assert.ok(entry, groupKey);
    assert.equal(entry?.passed, true, `${groupKey}: ${entry?.checks.map((c) => c.evidence).join("; ")}`);
  }
});

test("verifies public API and consumer contract groups", () => {
  const certification = runBusinessTimelinePlatformCertification(FIXED_TIME);
  const facadeGroup = certification.report.groups.find((group) => group.groupKey === "G_public_facade_groups");
  const readonlyGroup = certification.report.groups.find((group) => group.groupKey === "M_readonly_consumers");
  const workspaceGroup = certification.report.groups.find((group) => group.groupKey === "N_workspace_controlled_writes");

  assert.equal(facadeGroup?.passed, true);
  assert.equal(readonlyGroup?.passed, true);
  assert.equal(workspaceGroup?.passed, true);
});

test("verifies end-to-end flow and workspace isolation groups", () => {
  const certification = runBusinessTimelinePlatformCertification(FIXED_TIME);
  const e2e = certification.report.groups.find((group) => group.groupKey === "J_end_to_end_flow");
  const isolation = certification.report.groups.find((group) => group.groupKey === "I_workspace_isolation");
  const archive = certification.report.groups.find((group) => group.groupKey === "L_archive_policy");

  assert.equal(e2e?.passed, true);
  assert.equal(isolation?.passed, true);
  assert.equal(archive?.passed, true);
});

test("verifies no forbidden coupling groups", () => {
  const certification = runBusinessTimelinePlatformCertification(FIXED_TIME);
  const forbiddenGroups = [
    "P_no_scenario_coupling",
    "Q_no_decision_coupling",
    "R_no_dashboard_implementation",
    "S_no_assistant_implementation",
    "T_no_visualization_implementation",
    "U_no_datasource_ingestion",
  ] as const;

  for (const groupKey of forbiddenGroups) {
    const entry = certification.report.groups.find((group) => group.groupKey === groupKey);
    assert.equal(entry?.passed, true, groupKey);
  }
});

test("readyForFreeze true only when all gates pass", () => {
  const certification = runBusinessTimelinePlatformCertification(FIXED_TIME);
  const freezeGroup = certification.report.groups.find((group) => group.groupKey === "Y_ready_for_freeze");
  assert.equal(freezeGroup?.passed, true);
  assert.equal(certification.readyForFreeze, true);
  assert.equal(certification.report.readyForFreeze, true);

  const manifest = getBusinessTimelinePlatformManifest(FIXED_TIME);
  assert.equal(manifest.readyForFreeze, true);
});

test("BusinessTimelinePlatformCertification namespace exposes public APIs", () => {
  assert.equal(typeof BusinessTimelinePlatformCertification.runBusinessTimelinePlatformCertification, "function");
  assert.equal(typeof BusinessTimelinePlatformCertification.runBusinessTimelinePlatformRegression, "function");
  assert.equal(typeof BusinessTimelinePlatformCertification.getBusinessTimelinePlatformManifest, "function");
  assert.equal(typeof BusinessTimelinePlatformCertification.validateBusinessTimelinePlatform, "function");
  assert.equal(typeof BusinessTimelinePlatformCertification.getBusinessTimelinePlatformCertificationReport, "function");
});
