import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  buildConfidenceEvolutionPlatformManifest,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  validateConfidenceEvolutionPlatformManifest,
} from "./confidenceEvolutionPlatformCertificationManifest.ts";
import {
  ConfidenceEvolutionPlatformCertification,
  getConfidenceEvolutionPlatformCertificationReport,
  getConfidenceEvolutionPlatformManifest,
  resetConfidenceEvolutionPlatformCertificationReportForTests,
  runConfidenceEvolutionPlatformCertification,
  runConfidenceEvolutionPlatformRegression,
  validateConfidenceEvolutionPlatform,
} from "./confidenceEvolutionPlatformCertification.ts";
import { CONFIDENCE_EVOLUTION_API_GROUP_KEYS } from "./confidenceEvolutionApiTypes.ts";
import { createConfidenceEvolutionApi } from "./confidenceEvolutionApi.ts";
import { validateConfidenceEvolutionConsumerAccessRequest } from "./confidenceEvolutionApi.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-platform-test-001";

function sampleRecord(id: string) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Platform test ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "Platform test record.",
    evidenceReferences: Object.freeze(["platform-test-evidence"]),
    createdAt: FIXED_TIME,
    tags: Object.freeze(["platform-test"]),
  });
}

test.beforeEach(() => {
  resetConfidenceEvolutionPlatformCertificationReportForTests();
});

test("exports APP-9/8 platform certification contract", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "APP-9/8");
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS.length, 28);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformCertification.ts",
    allowedFiles: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("validates platform manifest", () => {
  const manifest = buildConfidenceEvolutionPlatformManifest(FIXED_TIME, false);
  const validation = validateConfidenceEvolutionPlatformManifest(manifest);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(manifest.phases.length, 7);
  assert.equal(manifest.consumers.length, 7);
  assert.equal(manifest.certificationGroups.length, 28);
  assert.equal(manifest.appId, "APP-9");
});

test("validates confidence evolution platform without mutation", () => {
  const validation = validateConfidenceEvolutionPlatform(FIXED_TIME);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(validation.readOnly, true);
});

test("runs full APP-9 platform regression", () => {
  const regression = runConfidenceEvolutionPlatformRegression();
  assert.equal(regression.success, true, regression.summary);
  assert.equal(regression.layersTotal, 7);
  assert.equal(regression.layersPassed, 7);
  assert.equal(regression.priorPhasesPreserved, true);
  assert.ok(regression.layerResults.every((entry) => entry.certified));
  assert.ok(regression.layerResults.every((entry) => entry.score === 100));
});

test("all phase certifications pass via regression", () => {
  const regression = runConfidenceEvolutionPlatformRegression();
  const layerIds = regression.layerResults.map((entry) => entry.layerId);
  assert.deepEqual(layerIds, [
    "APP-9/1",
    "APP-9/2",
    "APP-9/3",
    "APP-9/4",
    "APP-9/5",
    "APP-9/6",
    "APP-9/7",
  ]);
});

test("certifies complete APP-9 confidence evolution platform", () => {
  const certification = runConfidenceEvolutionPlatformCertification(FIXED_TIME);
  assert.equal(certification.status, "PASS", certification.summary);
  assert.equal(certification.certified, true);
  assert.equal(certification.readyForFreeze, true);
  assert.equal(certification.certificationScore, 100);
  assert.equal(certification.report.finalPlatformStatus, "CERTIFIED");
  assert.equal(certification.report.groups.length, 28);
  assert.ok(certification.report.groups.every((group) => group.passed));
  assert.equal(certification.failures.length, 0);

  const cached = getConfidenceEvolutionPlatformCertificationReport();
  assert.ok(cached);
  assert.equal(cached?.certified, true);
});

test("public API verification through facade", () => {
  const api = createConfidenceEvolutionApi(FIXED_TIME);
  for (const group of CONFIDENCE_EVOLUTION_API_GROUP_KEYS) {
    assert.ok(group in api, group);
  }
});

test("end-to-end confidence flow via facade", () => {
  const api = createConfidenceEvolutionApi(FIXED_TIME);
  api.records.createRecord(sampleRecord("platform-flow-1"));
  const query = api.query.queryConfidence({ workspaceId: WORKSPACE });
  const trend = api.trend.buildTrendModel({ workspaceId: WORKSPACE });
  const links = api.evidenceReason.buildEvidenceReasonModel({ workspaceId: WORKSPACE });
  const calibration = api.calibration.buildCalibrationModel({ workspaceId: WORKSPACE });
  assert.equal(query.success, true);
  assert.equal(trend.success, true);
  assert.equal(links.success, true);
  assert.equal(calibration.success, true);
});

test("workspace isolation end-to-end", () => {
  const api = createConfidenceEvolutionApi(FIXED_TIME);
  api.records.createRecord(Object.freeze({ ...sampleRecord("platform-ws-a"), workspaceId: "ws-platform-a" }));
  api.records.createRecord(Object.freeze({ ...sampleRecord("platform-ws-b"), workspaceId: "ws-platform-b" }));
  const wsA = api.query.queryConfidence({ workspaceId: "ws-platform-a" });
  const wsB = api.query.queryConfidence({ workspaceId: "ws-platform-b" });
  assert.equal(wsA.data?.totalRecords, 1);
  assert.equal(wsB.data?.totalRecords, 1);
});

test("archive policy end-to-end", () => {
  const archiveWorkspace = "ws-platform-archive-only";
  const api = createConfidenceEvolutionApi(FIXED_TIME);
  api.records.createRecord(Object.freeze({ ...sampleRecord("platform-archive-test"), workspaceId: archiveWorkspace }));
  assert.equal(api.query.queryConfidence({ workspaceId: archiveWorkspace }).data?.totalRecords, 1);
  api.records.archiveRecord("platform-archive-test", archiveWorkspace);
  assert.equal(api.query.queryConfidence({ workspaceId: archiveWorkspace }).data?.totalRecords, 0);
  assert.equal(
    api.query.queryConfidence({ workspaceId: archiveWorkspace, includeArchived: true }).data?.totalRecords,
    1
  );
});

test("read-only consumer enforcement", () => {
  const blocked = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "DashboardConsumer",
    apiGroup: "records",
    operation: "createRecord",
    mutation: true,
  });
  assert.equal(blocked.valid, false);
});

test("controlled write consumer enforcement", () => {
  const allowed = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "WorkspaceConsumer",
    apiGroup: "records",
    operation: "createRecord",
    mutation: true,
  });
  assert.equal(allowed.valid, true);
});

test("readyForFreeze true only when all gates pass", () => {
  const certification = runConfidenceEvolutionPlatformCertification(FIXED_TIME);
  assert.equal(certification.readyForFreeze, true);
  const manifest = getConfidenceEvolutionPlatformManifest(FIXED_TIME);
  assert.equal(manifest.readyForFreeze, true);
  assert.ok(manifest.certifiedAt);
});

test("platform certification bundle exports", () => {
  assert.equal(typeof ConfidenceEvolutionPlatformCertification.runConfidenceEvolutionPlatformCertification, "function");
  assert.equal(typeof ConfidenceEvolutionPlatformCertification.runConfidenceEvolutionPlatformRegression, "function");
});
