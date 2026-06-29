import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  getConfidenceRecordById,
  getConfidenceRecords,
  resetConfidenceEvolutionEngineForTests,
} from "./confidenceEvolutionEngine.ts";
import { resetConfidenceEvolutionPlatformForTests } from "./confidenceEvolutionRunner.ts";
import { resetConfidenceEvolutionQueryLayerForTests } from "./confidenceEvolutionQuery.ts";
import { resetConfidenceEvolutionTrendLayerForTests } from "./confidenceEvolutionTrend.ts";
import { resetConfidenceEvidenceReasonLayerForTests } from "./confidenceEvolutionEvidenceReason.ts";
import { resetConfidenceCalibrationLayerForTests } from "./confidenceEvolutionCalibration.ts";
import {
  createConfidenceEvolutionApi,
  getConfidenceEvolutionApi,
  getConfidenceEvolutionApiManifest,
  resetConfidenceEvolutionApiLayerForTests,
  validateConfidenceEvolutionApiContract,
  validateConfidenceEvolutionConsumerAccessRequest,
  CONFIDENCE_EVOLUTION_API_SELF_MANIFEST,
} from "./confidenceEvolutionApi.ts";
import { runConfidenceEvolutionApiCertification } from "./confidenceEvolutionApiRunner.ts";
import {
  CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_API_GROUP_KEYS,
} from "./confidenceEvolutionApiTypes.ts";
import { getConfidenceEvolutionConsumerContract } from "./confidenceEvolutionConsumerContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "./confidenceEvolutionContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-confidence-api-test-001";

function sampleRecord(id: string) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Confidence API ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "API test record.",
    evidenceReferences: Object.freeze(["api-test-evidence"]),
    createdAt: FIXED_TIME,
    tags: Object.freeze(["api-test"]),
  });
}

function bootstrap() {
  resetConfidenceEvolutionApiLayerForTests();
  resetConfidenceCalibrationLayerForTests();
  resetConfidenceEvidenceReasonLayerForTests();
  resetConfidenceEvolutionTrendLayerForTests();
  resetConfidenceEvolutionQueryLayerForTests();
  resetConfidenceEvolutionEngineForTests();
  resetConfidenceEvolutionPlatformForTests();
  createConfidenceEvolutionApi(FIXED_TIME);
}

test.beforeEach(() => {
  bootstrap();
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(CONFIDENCE_EVOLUTION_API_SELF_MANIFEST);
  assert.equal(
    manifestValidation.valid,
    true,
    manifestValidation.issues.map((issue) => issue.message).join("; ")
  );
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionApi.ts",
    allowedFiles: CONFIDENCE_EVOLUTION_API_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: CONFIDENCE_EVOLUTION_API_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("creates API facade with all groups", () => {
  const api = getConfidenceEvolutionApi();
  assert.equal(api.version, CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION);
  for (const group of CONFIDENCE_EVOLUTION_API_GROUP_KEYS) {
    assert.ok(group in api, group);
  }
});

test("records API delegates to APP-9:2 safely", () => {
  const api = getConfidenceEvolutionApi();
  const created = api.records.createRecord(sampleRecord("api-record-1"));
  assert.equal(created.success, true);
  const fetched = api.records.getRecordById("api-record-1");
  assert.equal(fetched.success, true);
  assert.equal(fetched.data?.id, "api-record-1");
});

test("query API delegates to APP-9:3 safely", () => {
  const api = getConfidenceEvolutionApi();
  api.records.createRecord(sampleRecord("api-query-1"));
  const query = api.query.queryConfidence({ workspaceId: WORKSPACE });
  assert.equal(query.success, true);
  assert.equal(query.data?.totalRecords, 1);
});

test("trend API delegates to APP-9:4 safely", () => {
  const api = getConfidenceEvolutionApi();
  api.records.createRecord(sampleRecord("api-trend-1"));
  api.records.createRecord(
    Object.freeze({
      ...sampleRecord("api-trend-2"),
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.75,
    })
  );
  const trend = api.trend.buildTrendModel({ workspaceId: WORKSPACE });
  assert.equal(trend.success, true);
  assert.equal(trend.data?.recordCount, 2);
});

test("evidenceReason API delegates to APP-9:5 safely", () => {
  const api = getConfidenceEvolutionApi();
  api.records.createRecord(sampleRecord("api-link-1"));
  const links = api.evidenceReason.buildEvidenceReasonModel({ workspaceId: WORKSPACE });
  assert.equal(links.success, true);
  assert.equal(links.data?.recordCount, 1);
});

test("calibration API delegates to APP-9:6 safely", () => {
  const api = getConfidenceEvolutionApi();
  api.records.createRecord(sampleRecord("api-calibration-1"));
  const calibration = api.calibration.buildCalibrationModel({ workspaceId: WORKSPACE });
  assert.equal(calibration.success, true);
  assert.equal(calibration.data?.recordCount, 1);
});

test("manifest is correct", () => {
  const manifest = getConfidenceEvolutionApiManifest(FIXED_TIME);
  assert.equal(manifest.version, CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION);
  assert.equal(manifest.appId, "APP-9");
  assert.equal(manifest.availableApiGroups.length, 6);
  assert.equal(manifest.consumerCompatibility.length, 7);
  assert.ok(manifest.directImportGuardNotes.includes("APP-9:7"));
});

test("consumer contracts are created", () => {
  const dashboard = getConfidenceEvolutionConsumerContract("DashboardConsumer");
  assert.ok(dashboard);
  assert.equal(dashboard?.readOnly, true);
  assert.equal(dashboard?.mutationAllowed, false);
});

test("workspace consumer has controlled write access", () => {
  const allowed = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "WorkspaceConsumer",
    apiGroup: "records",
    operation: "createRecord",
    mutation: true,
  });
  assert.equal(allowed.valid, true);
});

test("dashboard consumer has read-only access", () => {
  const allowed = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "DashboardConsumer",
    apiGroup: "query",
    operation: "queryConfidence",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("assistant consumer has read-only access", () => {
  const allowed = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "AssistantConsumer",
    apiGroup: "trend",
    operation: "buildTrendModel",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("visualization consumer has read-only access", () => {
  const allowed = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "VisualizationConsumer",
    apiGroup: "query",
    operation: "getOrderedRecords",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("report consumer has read-only access", () => {
  const allowed = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "ReportConsumer",
    apiGroup: "calibration",
    operation: "buildCalibrationModel",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("export consumer has read-only access", () => {
  const allowed = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "ExportConsumer",
    apiGroup: "certification",
    operation: "runCertification",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("forbidden API access is rejected", () => {
  const blocked = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "DashboardConsumer",
    apiGroup: "records",
    operation: "createRecord",
    mutation: true,
  });
  assert.equal(blocked.valid, false);
});

test("invalid consumer is rejected", () => {
  const blocked = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "InvalidConsumer" as never,
    apiGroup: "query",
    operation: "queryConfidence",
    mutation: false,
  });
  assert.equal(blocked.valid, false);
});

test("certification API works", () => {
  const api = getConfidenceEvolutionApi();
  const result = api.certification.runCertification();
  assert.equal(result.success, true);
  assert.equal(result.data?.status, "PASS");
});

test("no direct internal module mutation through facade reads", () => {
  const api = getConfidenceEvolutionApi();
  api.records.createRecord(sampleRecord("api-readonly-1"));
  const before = getConfidenceRecords(WORKSPACE);
  api.query.queryConfidence({ workspaceId: WORKSPACE });
  api.trend.buildTrendModel({ workspaceId: WORKSPACE });
  api.evidenceReason.buildEvidenceReasonModel({ workspaceId: WORKSPACE });
  api.calibration.buildCalibrationModel({ workspaceId: WORKSPACE });
  const after = getConfidenceRecords(WORKSPACE);
  assert.equal(before.length, after.length);
  assert.deepEqual(before[0], after[0]);
});

test("APP-9:1 through APP-9:6 compatibility via contract validation", () => {
  const validation = validateConfidenceEvolutionApiContract();
  assert.equal(validation.valid, true);
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
});

test("calibration scoring helpers work through facade", () => {
  const api = getConfidenceEvolutionApi();
  const score = api.calibration.calculateCalibrationScore(0.75, 0.75);
  assert.equal(score.success, true);
  assert.ok((score.data ?? 0) > 0);
});

test("trend helpers work through facade", () => {
  const api = getConfidenceEvolutionApi();
  api.records.createRecord(sampleRecord("api-delta-1"));
  api.records.createRecord(
    Object.freeze({
      ...sampleRecord("api-delta-2"),
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.8,
    })
  );
  const deltas = api.trend.calculateDeltas(WORKSPACE);
  assert.equal(deltas.success, true);
  assert.equal(deltas.data?.length, 1);
});

test("record retrieval via facade matches engine registry", () => {
  const api = getConfidenceEvolutionApi();
  api.records.createRecord(sampleRecord("api-match-1"));
  const facadeRecord = api.records.getRecordById("api-match-1");
  const engineRecord = getConfidenceRecordById("api-match-1");
  assert.equal(facadeRecord.data?.id, engineRecord?.id);
});

test("certification runner passes all checks", () => {
  const result = runConfidenceEvolutionApiCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.score, 100);
  assert.ok(result.checks.every((entry) => entry.passed));
});
