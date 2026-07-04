import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY,
} from "./index.ts";
import { createExecutiveJudgmentContext, validateExecutiveJudgmentContext, type ExecutiveJudgmentContextItem } from "./executiveJudgmentContextEngine.ts";
import {
  ExecutiveJudgmentEvidenceEngine,
  buildExecutiveJudgmentEvidenceSnapshot,
  evaluateExecutiveJudgmentEvidence,
  getExecutiveJudgmentEvidenceRegistry,
  normalizeExecutiveJudgmentEvidence,
  validateExecutiveJudgmentEvidence,
} from "./executiveJudgmentEvidenceEngine.ts";

function item(id: string, label: string, source: string, references: readonly string[] = Object.freeze([])): ExecutiveJudgmentContextItem {
  return Object.freeze({
    id,
    label,
    description: `${label} metadata.`,
    source,
    references: Object.freeze([...references]),
    metadataOnly: true,
  });
}

function context() {
  return createExecutiveJudgmentContext({
    availableEvidence: Object.freeze([
      item("evidence.2", "Metric Evidence", "KPI Platform", Object.freeze(["kpi.1", "object.1"])),
      item("evidence.1", "Document Evidence", "Document Store", Object.freeze(["doc.1"])),
      item("evidence.1", "Duplicate Evidence", "Document Store"),
    ]),
  });
}

test("normalizes evidence", () => {
  const normalized = normalizeExecutiveJudgmentEvidence(context());
  assert.equal(normalized.contextId, "executive-judgment-context");
  assert.deepEqual(normalized.records.map((record) => record.evidenceId), ["evidence.1", "evidence.2"]);
  assert.equal(normalized.records[0]?.evidenceType, "document");
  assert.equal(normalized.records[1]?.evidenceType, "metric");
});

test("removes duplicate evidence identifiers", () => {
  const baseContext = createExecutiveJudgmentContext();
  const duplicatedContext = Object.freeze({
    ...baseContext,
    availableEvidence: Object.freeze([
      item("evidence.1", "Evidence", "Document Store"),
      item("evidence.1", "Evidence Duplicate", "Document Store"),
      item("evidence.2", "Evidence 2", "KPI Platform"),
    ]),
  });
  const normalized = normalizeExecutiveJudgmentEvidence(duplicatedContext);
  assert.deepEqual(normalized.duplicateIdsRemoved, ["evidence.1"]);
});

test("evaluates evidence metadata", () => {
  const evaluated = evaluateExecutiveJudgmentEvidence(context());
  assert.equal(evaluated.assessments.length, 2);
  assert.equal(evaluated.assessments[1]?.coverage, "complete");
  assert.equal(evaluated.assessments[1]?.traceability, "complete");
  assert.equal(evaluated.assessments[1]?.reliability, "source-present");
});

test("validates evidence collection", () => {
  const validation = validateExecutiveJudgmentEvidence(evaluateExecutiveJudgmentEvidence(context()));
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("builds immutable evidence snapshot", () => {
  const snapshot = buildExecutiveJudgmentEvidenceSnapshot(evaluateExecutiveJudgmentEvidence(context()));
  assert.equal(snapshot.evidenceCount, 2);
  assert.equal(snapshot.validation.valid, true);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("publishes evidence registry integrity", () => {
  const registry = getExecutiveJudgmentEvidenceRegistry();
  assert.equal(registry.registryId, "executive-judgment-evidence-registry");
  assert.equal(registry.phaseId, "APP-JUDGE-3");
  assert.equal(registry.dimensions.includes("traceability"), true);
  assert.equal(registry.compatibleInputs.includes("APP-JUDGE-2"), true);
});

test("exports public evidence APIs", () => {
  assert.equal(typeof ExecutiveJudgmentEvidenceEngine.evaluateExecutiveJudgmentEvidence, "function");
  assert.equal(typeof ExecutiveJudgmentEvidenceEngine.normalizeExecutiveJudgmentEvidence, "function");
  assert.equal(typeof ExecutiveJudgmentEvidenceEngine.validateExecutiveJudgmentEvidence, "function");
  assert.equal(typeof ExecutiveJudgmentEvidenceEngine.buildExecutiveJudgmentEvidenceSnapshot, "function");
  assert.equal(typeof ExecutiveJudgmentEvidenceEngine.getExecutiveJudgmentEvidenceRegistry, "function");
});

test("produces deterministic fingerprints", () => {
  const left = buildExecutiveJudgmentEvidenceSnapshot(evaluateExecutiveJudgmentEvidence(context()));
  const right = buildExecutiveJudgmentEvidenceSnapshot(evaluateExecutiveJudgmentEvidence(context()));
  assert.equal(left.fingerprint, right.fingerprint);
});

test("keeps APP-JUDGE-1 and APP-JUDGE-2 compatibility", () => {
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.version, "APP-JUDGE-1");
  assert.equal(validateExecutiveJudgmentContext(context()).valid, true);
});

test("contains no forbidden runtime behavior in source", () => {
  const sources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentEvidenceEngine.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentEvidenceEvaluator.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentEvidenceNormalizer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentEvidenceValidation.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentEvidenceRegistry.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentEvidenceSnapshot.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("Math.random"), false);
  assert.equal(sources.includes("Date."), false);
  assert.equal(sources.includes("score"), false);
  assert.equal(sources.includes("rank"), false);
  assert.equal(sources.includes("recommend"), false);
  assert.equal(sources.includes("call LLM"), false);
});
