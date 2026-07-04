import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY } from "./index.ts";
import { createExecutiveJudgmentContext, validateExecutiveJudgmentContext, type ExecutiveJudgmentContextItem } from "./executiveJudgmentContextEngine.ts";
import { evaluateExecutiveJudgmentEvidence, validateExecutiveJudgmentEvidence } from "./executiveJudgmentEvidenceEngine.ts";
import {
  ExecutiveJudgmentConstraintEngine,
  analyzeExecutiveJudgmentConstraints,
  buildExecutiveJudgmentConstraintSnapshot,
  getExecutiveJudgmentConstraintRegistry,
  normalizeExecutiveJudgmentConstraints,
  validateExecutiveJudgmentConstraints,
} from "./executiveJudgmentConstraintEngine.ts";

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
      item("evidence.1", "Evidence", "Document Store", Object.freeze(["doc.1"])),
      item("evidence.2", "Metric Evidence", "KPI Platform", Object.freeze(["kpi.1", "object.1"])),
    ]),
    constraints: Object.freeze([
      item("constraint.2", "Resource Constraint", "Resource Model", Object.freeze(["evidence.1", "resource.1"])),
      item("constraint.1", "Policy Constraint", "Policy Register", Object.freeze(["evidence.1"])),
      item("constraint.1", "Policy Constraint Duplicate", "Policy Register"),
    ]),
  });
}

function evidence() {
  return evaluateExecutiveJudgmentEvidence(context());
}

test("normalizes constraints", () => {
  const normalized = normalizeExecutiveJudgmentConstraints(context(), evidence());
  assert.equal(normalized.contextId, "executive-judgment-context");
  assert.deepEqual(normalized.records.map((record) => record.constraintId), ["constraint.1", "constraint.2"]);
  assert.equal(normalized.records[0]?.constraintType, "policy");
  assert.equal(normalized.records[1]?.constraintType, "resource");
});

test("removes duplicate constraint identifiers", () => {
  const baseContext = createExecutiveJudgmentContext();
  const duplicatedContext = Object.freeze({
    ...baseContext,
    constraints: Object.freeze([
      item("constraint.1", "Constraint", "Policy Register"),
      item("constraint.1", "Constraint Duplicate", "Policy Register"),
      item("constraint.2", "Constraint 2", "Resource Model"),
    ]),
  });
  const normalized = normalizeExecutiveJudgmentConstraints(duplicatedContext, evaluateExecutiveJudgmentEvidence(duplicatedContext));
  assert.deepEqual(normalized.duplicateIdsRemoved, ["constraint.1"]);
});

test("analyzes constraint metadata", () => {
  const analyzed = analyzeExecutiveJudgmentConstraints(context(), evidence());
  assert.equal(analyzed.assessments.length, 2);
  assert.equal(analyzed.assessments[0]?.dependency, "partial");
  assert.equal(analyzed.assessments[0]?.traceability, "partial");
  assert.equal(analyzed.assessments[0]?.criticality, "linked");
});

test("validates constraint collection", () => {
  const validation = validateExecutiveJudgmentConstraints(analyzeExecutiveJudgmentConstraints(context(), evidence()));
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("builds immutable constraint snapshot", () => {
  const snapshot = buildExecutiveJudgmentConstraintSnapshot(analyzeExecutiveJudgmentConstraints(context(), evidence()));
  assert.equal(snapshot.constraintCount, 2);
  assert.equal(snapshot.validation.valid, true);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("publishes constraint registry integrity", () => {
  const registry = getExecutiveJudgmentConstraintRegistry();
  assert.equal(registry.registryId, "executive-judgment-constraint-registry");
  assert.equal(registry.phaseId, "APP-JUDGE-4");
  assert.equal(registry.dimensions.includes("criticality"), true);
  assert.equal(registry.compatibleInputs.includes("APP-JUDGE-3"), true);
});

test("exports public constraint APIs", () => {
  assert.equal(typeof ExecutiveJudgmentConstraintEngine.analyzeExecutiveJudgmentConstraints, "function");
  assert.equal(typeof ExecutiveJudgmentConstraintEngine.normalizeExecutiveJudgmentConstraints, "function");
  assert.equal(typeof ExecutiveJudgmentConstraintEngine.validateExecutiveJudgmentConstraints, "function");
  assert.equal(typeof ExecutiveJudgmentConstraintEngine.buildExecutiveJudgmentConstraintSnapshot, "function");
  assert.equal(typeof ExecutiveJudgmentConstraintEngine.getExecutiveJudgmentConstraintRegistry, "function");
});

test("produces deterministic fingerprints", () => {
  const left = buildExecutiveJudgmentConstraintSnapshot(analyzeExecutiveJudgmentConstraints(context(), evidence()));
  const right = buildExecutiveJudgmentConstraintSnapshot(analyzeExecutiveJudgmentConstraints(context(), evidence()));
  assert.equal(left.fingerprint, right.fingerprint);
});

test("keeps APP-JUDGE-1 through APP-JUDGE-3 compatibility", () => {
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.version, "APP-JUDGE-1");
  assert.equal(validateExecutiveJudgmentContext(context()).valid, true);
  assert.equal(validateExecutiveJudgmentEvidence(evidence()).valid, true);
});

test("contains no forbidden runtime behavior in source", () => {
  const sources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentConstraintEngine.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentConstraintAnalyzer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentConstraintNormalizer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentConstraintValidation.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentConstraintRegistry.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentConstraintSnapshot.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("Math.random"), false);
  assert.equal(sources.includes("Date."), false);
  assert.equal(sources.includes("score"), false);
  assert.equal(sources.includes("rank"), false);
  assert.equal(sources.includes("recommend"), false);
  assert.equal(sources.includes("call LLM"), false);
});
