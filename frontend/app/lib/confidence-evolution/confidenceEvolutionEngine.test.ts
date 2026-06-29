import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY,
} from "./confidenceEvolutionContracts.ts";
import { createConfidenceEvolutionFoundation } from "./confidenceEvolutionFoundation.ts";
import { resetConfidenceEvolutionPlatformForTests } from "./confidenceEvolutionRunner.ts";
import { validateConfidenceRecordContractShape } from "./confidenceEvolutionValidation.ts";
import {
  archiveConfidenceRecord,
  createConfidenceRecord,
  filterConfidenceRecords,
  getConfidenceRecordById,
  getConfidenceRecordsByWorkspace,
  getConfidenceRevisionHistory,
  initializeConfidenceEvolutionEngine,
  normalizeConfidenceRecord,
  resetConfidenceEvolutionEngineForTests,
  updateConfidenceMetadata,
  validateConfidenceRecord,
  validateConfidenceRecordInput,
  CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST,
} from "./confidenceEvolutionEngine.ts";
import {
  mapConfidenceEngineRecordToFoundationContract,
  validateFoundationCompatibilityForEngine,
} from "./confidenceEvolutionEngineValidation.ts";
import { runConfidenceEvolutionEngineCertification } from "./confidenceEvolutionEngineRunner.ts";
import { generateConfidenceRecordId } from "./confidenceEvolutionEngineRegistry.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-test-001";

function sampleInput(overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    workspaceId: WORKSPACE,
    title: "Confidence before market expansion",
    confidenceLevel: "high" as const,
    confidenceScore: 0.82,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "Executive confidence remains high after partner pipeline review.",
    createdAt: FIXED_TIME,
    tags: Object.freeze(["strategy", "expansion"]),
    ...overrides,
  });
}

test.beforeEach(() => {
  resetConfidenceEvolutionEngineForTests();
  resetConfidenceEvolutionPlatformForTests();
  createConfidenceEvolutionFoundation(FIXED_TIME);
  initializeConfidenceEvolutionEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionEngine.ts",
    allowedFiles: CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("creates confidence records with required fields", () => {
  const result = createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-test-001" });
  assert.equal(result.success, true, result.reason);
  assert.ok(result.data);
  assert.equal(result.data.revisionVersion, 1);
  assert.equal(result.data.readOnly, true);
  assert.equal(result.data.id, "confidence-evolution-record-test-001");
  assert.equal(result.data.status, "draft");
});

test("normalizes confidence record input", () => {
  const normalized = normalizeConfidenceRecord({
    ...sampleInput(),
    notes: "  trimmed notes  ",
    tags: Object.freeze(["  tag-a  ", "tag-a"]),
  });
  assert.equal(normalized.notes, "trimmed notes");
  assert.equal(normalized.tags.length, 1);
  assert.equal(normalized.updatedAt, FIXED_TIME);
});

test("rejects missing required fields", () => {
  const validation = validateConfidenceRecordInput({
    ...sampleInput(),
    title: "",
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "title"));
});

test("rejects invalid confidence level", () => {
  const validation = validateConfidenceRecordInput({
    ...sampleInput(),
    confidenceLevel: "invalid-level" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "confidenceLevel"));
});

test("rejects invalid source", () => {
  const validation = validateConfidenceRecordInput({
    ...sampleInput(),
    source: "unknown-source" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "source"));
});

test("rejects invalid reason", () => {
  const validation = validateConfidenceRecordInput({
    ...sampleInput(),
    reason: "invalid-reason" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "reason"));
});

test("rejects invalid status", () => {
  const validation = validateConfidenceRecordInput({
    ...sampleInput(),
    status: "deleted" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "status"));
});

test("enforces workspace isolation", () => {
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-ws-a", workspaceId: "ws-a" });
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-ws-b", workspaceId: "ws-b" });
  assert.equal(getConfidenceRecordsByWorkspace("ws-a").length, 1);
  assert.equal(getConfidenceRecordsByWorkspace("ws-b").length, 1);
  assert.equal(getConfidenceRecordById("confidence-evolution-record-ws-a")?.workspaceId, "ws-a");
});

test("enforces append-only registry", () => {
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-dup" });
  const duplicate = createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-dup" });
  assert.equal(duplicate.success, false);
});

test("preserves stable record id across revisions", () => {
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-stable" });
  const updated = updateConfidenceMetadata({
    id: "confidence-evolution-record-stable",
    workspaceId: WORKSPACE,
    title: "Updated title",
  });
  assert.equal(updated.success, true);
  assert.equal(updated.data?.id, "confidence-evolution-record-stable");
  const history = getConfidenceRevisionHistory("confidence-evolution-record-stable");
  assert.equal(history.length, 2);
  assert.equal(history[0]?.id, history[1]?.id);
});

test("generates deterministic record ids", () => {
  const id = generateConfidenceRecordId("ws-seq", 42);
  assert.equal(id, "confidence-evolution-record-ws-seq-000042");
  const created = createConfidenceRecord(sampleInput());
  assert.equal(created.success, true);
  assert.match(created.data!.id, /^confidence-evolution-record-ws-test-001-\d{6}$/);
});

test("preserves immutable linked ids after assignment", () => {
  createConfidenceRecord({
    ...sampleInput(),
    id: "confidence-evolution-record-links",
    decisionId: "decision-001",
    scenarioId: "scenario-001",
    journalEntryId: "journal-001",
  });
  const updated = updateConfidenceMetadata({
    id: "confidence-evolution-record-links",
    workspaceId: WORKSPACE,
    confidenceLevel: "medium",
  });
  assert.equal(updated.success, true);
  assert.equal(updated.data?.decisionId, "decision-001");
  assert.equal(updated.data?.scenarioId, "scenario-001");
  assert.equal(updated.data?.journalEntryId, "journal-001");
});

test("increments revision version on metadata update", () => {
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-rev" });
  const first = updateConfidenceMetadata({
    id: "confidence-evolution-record-rev",
    workspaceId: WORKSPACE,
    reason: "new_evidence",
  });
  const second = updateConfidenceMetadata({
    id: "confidence-evolution-record-rev",
    workspaceId: WORKSPACE,
    confidenceScore: 0.9,
  });
  assert.equal(first.data?.revisionVersion, 2);
  assert.equal(second.data?.revisionVersion, 3);
  assert.equal(getConfidenceRevisionHistory("confidence-evolution-record-rev").length, 3);
});

test("archives records without deleting them", () => {
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-archive" });
  const archived = archiveConfidenceRecord("confidence-evolution-record-archive", WORKSPACE);
  assert.equal(archived.success, true);
  assert.equal(archived.data?.status, "archived");
  assert.equal(archived.data?.archived, true);
  assert.ok(getConfidenceRecordById("confidence-evolution-record-archive"));
});

test("filters by confidence level source reason status and tag", () => {
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-f1", status: "active" });
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-f2", source: "evidence" });
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-f3", confidenceLevel: "low" });
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-f4", reason: "risk_changed" });
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-f5", tags: Object.freeze(["alpha"]) });

  assert.ok(filterConfidenceRecords({ workspaceId: WORKSPACE, status: "active" }).length >= 1);
  assert.ok(filterConfidenceRecords({ workspaceId: WORKSPACE, source: "evidence" }).length >= 1);
  assert.ok(filterConfidenceRecords({ workspaceId: WORKSPACE, confidenceLevel: "low" }).length >= 1);
  assert.ok(filterConfidenceRecords({ workspaceId: WORKSPACE, reason: "risk_changed" }).length >= 1);
  assert.ok(filterConfidenceRecords({ workspaceId: WORKSPACE, tag: "alpha" }).length >= 1);
});

test("filters by date range", () => {
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-date" });
  const filtered = filterConfidenceRecords({
    workspaceId: WORKSPACE,
    createdAtFrom: FIXED_TIME,
    createdAtTo: FIXED_TIME,
    updatedAtFrom: FIXED_TIME,
    updatedAtTo: FIXED_TIME,
  });
  assert.ok(filtered.some((record) => record.id === "confidence-evolution-record-date"));
});

test("excludes archived records by default", () => {
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-active" });
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-archived", status: "archived" });
  const defaultFilter = filterConfidenceRecords({ workspaceId: WORKSPACE });
  assert.ok(defaultFilter.every((record) => !record.archived));
});

test("includes archived records when requested", () => {
  createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-inc-arch", status: "archived" });
  const withArchived = filterConfidenceRecords({ workspaceId: WORKSPACE, includeArchived: true });
  assert.ok(withArchived.some((record) => record.archived));
});

test("maps engine records to APP-9:1 foundation contract", () => {
  const created = createConfidenceRecord({ ...sampleInput(), id: "confidence-evolution-record-map" });
  assert.equal(created.success, true);
  const mapped = mapConfidenceEngineRecordToFoundationContract(created.data!);
  assert.equal(validateConfidenceRecordContractShape(mapped).valid, true);
  assert.equal(mapped.version, CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION);
});

test("validates APP-9:1 foundation compatibility", () => {
  assert.equal(validateFoundationCompatibilityForEngine(FIXED_TIME).valid, true);
});

test("validateConfidenceRecord delegates to input validation", () => {
  const validation = validateConfidenceRecord({ ...sampleInput(), confidenceScore: 2 });
  assert.equal(validation.valid, false);
});

test("runs confidence evolution engine certification", () => {
  const result = runConfidenceEvolutionEngineCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 18);
});

test("exports APP-9 platform identity unchanged", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.version, "APP-9/1");
});
