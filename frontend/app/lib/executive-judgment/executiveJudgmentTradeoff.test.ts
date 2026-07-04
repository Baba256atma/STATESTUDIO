import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY } from "./index.ts";
import { createExecutiveJudgmentContext, validateExecutiveJudgmentContext, type ExecutiveJudgmentContextItem } from "./executiveJudgmentContextEngine.ts";
import { evaluateExecutiveJudgmentEvidence, validateExecutiveJudgmentEvidence } from "./executiveJudgmentEvidenceEngine.ts";
import { analyzeExecutiveJudgmentConstraints, validateExecutiveJudgmentConstraints } from "./executiveJudgmentConstraintEngine.ts";
import {
  ExecutiveJudgmentTradeoffEngine,
  analyzeExecutiveJudgmentTradeoffs,
  buildExecutiveJudgmentTradeoffSnapshot,
  getExecutiveJudgmentTradeoffRegistry,
  normalizeExecutiveJudgmentTradeoffs,
  validateExecutiveJudgmentTradeoffs,
} from "./executiveJudgmentTradeoffEngine.ts";

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
      item("constraint.1", "Resource Constraint", "Resource Model", Object.freeze(["evidence.1"])),
      item("constraint.2", "Policy Constraint", "Policy Register", Object.freeze(["evidence.2"])),
    ]),
    availableAlternatives: Object.freeze([
      item("tradeoff.2", "Speed Quality Tension", "APP", Object.freeze(["evidence.2", "constraint.2"])),
      item("tradeoff.1", "Cost Benefit Tension", "APP", Object.freeze(["evidence.1", "constraint.1"])),
      item("tradeoff.1", "Cost Benefit Duplicate", "APP"),
    ]),
  });
}

function evidence() {
  return evaluateExecutiveJudgmentEvidence(context());
}

function constraints() {
  return analyzeExecutiveJudgmentConstraints(context(), evidence());
}

test("normalizes trade-offs", () => {
  const normalized = normalizeExecutiveJudgmentTradeoffs(context(), evidence(), constraints());
  assert.equal(normalized.contextId, "executive-judgment-context");
  assert.deepEqual(normalized.records.map((record) => record.tradeoffId), ["tradeoff.1", "tradeoff.2"]);
  assert.equal(normalized.records[0]?.tradeoffType, "cost-benefit");
  assert.equal(normalized.records[1]?.tradeoffType, "speed-quality");
});

test("removes duplicate trade-off identifiers", () => {
  const baseContext = createExecutiveJudgmentContext();
  const duplicatedContext = Object.freeze({
    ...baseContext,
    availableAlternatives: Object.freeze([
      item("tradeoff.1", "Cost Benefit", "APP"),
      item("tradeoff.1", "Cost Benefit Duplicate", "APP"),
      item("tradeoff.2", "Risk Return", "APP"),
    ]),
  });
  const duplicatedEvidence = evaluateExecutiveJudgmentEvidence(duplicatedContext);
  const duplicatedConstraints = analyzeExecutiveJudgmentConstraints(duplicatedContext, duplicatedEvidence);
  const normalized = normalizeExecutiveJudgmentTradeoffs(duplicatedContext, duplicatedEvidence, duplicatedConstraints);
  assert.deepEqual(normalized.duplicateIdsRemoved, ["tradeoff.1"]);
});

test("analyzes trade-off metadata", () => {
  const analyzed = analyzeExecutiveJudgmentTradeoffs(context(), evidence(), constraints());
  assert.equal(analyzed.assessments.length, 2);
  assert.equal(analyzed.assessments[0]?.dependency, "complete");
  assert.equal(analyzed.assessments[0]?.traceability, "complete");
  assert.equal(analyzed.assessments[0]?.criticality, "linked");
});

test("validates trade-off collection", () => {
  const validation = validateExecutiveJudgmentTradeoffs(analyzeExecutiveJudgmentTradeoffs(context(), evidence(), constraints()));
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("builds immutable trade-off snapshot", () => {
  const snapshot = buildExecutiveJudgmentTradeoffSnapshot(analyzeExecutiveJudgmentTradeoffs(context(), evidence(), constraints()));
  assert.equal(snapshot.tradeoffCount, 2);
  assert.equal(snapshot.validation.valid, true);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("publishes trade-off registry integrity", () => {
  const registry = getExecutiveJudgmentTradeoffRegistry();
  assert.equal(registry.registryId, "executive-judgment-tradeoff-registry");
  assert.equal(registry.phaseId, "APP-JUDGE-5");
  assert.equal(registry.domains.includes("speed-quality"), true);
  assert.equal(registry.compatibleInputs.includes("APP-JUDGE-4"), true);
});

test("exports public trade-off APIs", () => {
  assert.equal(typeof ExecutiveJudgmentTradeoffEngine.analyzeExecutiveJudgmentTradeoffs, "function");
  assert.equal(typeof ExecutiveJudgmentTradeoffEngine.normalizeExecutiveJudgmentTradeoffs, "function");
  assert.equal(typeof ExecutiveJudgmentTradeoffEngine.validateExecutiveJudgmentTradeoffs, "function");
  assert.equal(typeof ExecutiveJudgmentTradeoffEngine.buildExecutiveJudgmentTradeoffSnapshot, "function");
  assert.equal(typeof ExecutiveJudgmentTradeoffEngine.getExecutiveJudgmentTradeoffRegistry, "function");
});

test("produces deterministic fingerprints", () => {
  const left = buildExecutiveJudgmentTradeoffSnapshot(analyzeExecutiveJudgmentTradeoffs(context(), evidence(), constraints()));
  const right = buildExecutiveJudgmentTradeoffSnapshot(analyzeExecutiveJudgmentTradeoffs(context(), evidence(), constraints()));
  assert.equal(left.fingerprint, right.fingerprint);
});

test("keeps APP-JUDGE-1 through APP-JUDGE-4 compatibility", () => {
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.version, "APP-JUDGE-1");
  assert.equal(validateExecutiveJudgmentContext(context()).valid, true);
  assert.equal(validateExecutiveJudgmentEvidence(evidence()).valid, true);
  assert.equal(validateExecutiveJudgmentConstraints(constraints()).valid, true);
});

test("contains no forbidden runtime behavior in source", () => {
  const sources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentTradeoffEngine.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentTradeoffAnalyzer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentTradeoffNormalizer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentTradeoffValidation.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentTradeoffRegistry.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentTradeoffSnapshot.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("Math.random"), false);
  assert.equal(sources.includes("Date."), false);
  assert.equal(sources.includes("score"), false);
  assert.equal(sources.includes("rank"), false);
  assert.equal(sources.includes("recommend"), false);
  assert.equal(sources.includes("call LLM"), false);
});
