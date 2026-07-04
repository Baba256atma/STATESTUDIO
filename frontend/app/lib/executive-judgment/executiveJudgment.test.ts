import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY } from "./index.ts";
import { createExecutiveJudgmentContext, validateExecutiveJudgmentContext, type ExecutiveJudgmentContextItem } from "./executiveJudgmentContextEngine.ts";
import { evaluateExecutiveJudgmentEvidence, validateExecutiveJudgmentEvidence } from "./executiveJudgmentEvidenceEngine.ts";
import { analyzeExecutiveJudgmentConstraints, validateExecutiveJudgmentConstraints } from "./executiveJudgmentConstraintEngine.ts";
import { analyzeExecutiveJudgmentTradeoffs, validateExecutiveJudgmentTradeoffs } from "./executiveJudgmentTradeoffEngine.ts";
import { balanceExecutiveJudgmentRiskOpportunity, validateExecutiveJudgmentRiskOpportunity } from "./executiveJudgmentRiskOpportunityEngine.ts";
import {
  ExecutiveJudgmentEngine,
  buildExecutiveJudgmentSnapshot,
  createExecutiveJudgment,
  getExecutiveJudgmentRegistry,
  normalizeExecutiveJudgment,
  synthesizeExecutiveJudgment,
  validateExecutiveJudgment,
} from "./executiveJudgmentEngine.ts";

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
      item("evidence.2", "Growth Evidence", "KPI Platform", Object.freeze(["kpi.1"])),
    ]),
    constraints: Object.freeze([
      item("constraint.1", "Resource Constraint", "Resource Model", Object.freeze(["evidence.1"])),
      item("constraint.2", "Policy Constraint", "Policy Register", Object.freeze(["evidence.2"])),
    ]),
    availableAlternatives: Object.freeze([
      item("alternative.viable", "Viable Alternative", "APP", Object.freeze(["evidence.1"])),
      item("alternative.blocked", "Blocked Alternative", "APP", Object.freeze(["evidence.2", "constraint.1"])),
      item("alternative.uncertain", "Uncertain Alternative", "APP"),
      item("tradeoff.1", "Execution Strategic Gain", "APP", Object.freeze(["evidence.1", "constraint.1"])),
      item("opportunity.1", "Strategic Gain Opportunity", "Opportunity Platform", Object.freeze(["evidence.2", "tradeoff.1"])),
    ]),
    risks: Object.freeze([
      item("risk.1", "Execution Risk", "Risk Platform", Object.freeze(["evidence.1", "constraint.1", "tradeoff.1"])),
    ]),
  });
}

function evidence() {
  return evaluateExecutiveJudgmentEvidence(context());
}

function constraints() {
  return analyzeExecutiveJudgmentConstraints(context(), evidence());
}

function tradeoffs() {
  return analyzeExecutiveJudgmentTradeoffs(context(), evidence(), constraints());
}

function balances() {
  return balanceExecutiveJudgmentRiskOpportunity(context(), evidence(), constraints(), tradeoffs());
}

test("synthesizes executive judgment", () => {
  const judgment = synthesizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances());
  assert.equal(judgment.judgmentId, "judgment.executive-judgment-context");
  assert.equal(judgment.metadata.metadataOnly, true);
  assert.equal(judgment.deterministic, true);
});

test("normalizes executive judgment inputs", () => {
  const normalized = normalizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances());
  assert.equal(normalized.evidenceIds.length, 2);
  assert.equal(normalized.constraintIds.length, 2);
  assert.equal(normalized.tradeoffIds.includes("tradeoff.1"), true);
  assert.equal(normalized.balanceIds.length, 1);
});

test("consumes upstream assessments", () => {
  const judgment = createExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances());
  assert.deepEqual(judgment.evidenceBasis, ["evidence.1", "evidence.2"]);
  assert.deepEqual(judgment.constraintBasis, ["constraint.1", "constraint.2"]);
  assert.equal(judgment.tradeoffBasis.includes("tradeoff.1"), true);
  assert.equal(judgment.riskOpportunityBasis.length, 1);
});

test("classifies viable alternatives", () => {
  const judgment = synthesizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances());
  assert.equal(judgment.supportedAlternatives.some((alternative) => alternative.alternativeId === "alternative.viable"), true);
});

test("classifies blocked alternatives", () => {
  const judgment = synthesizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances());
  assert.equal(judgment.blockedAlternatives.some((alternative) => alternative.alternativeId === "alternative.blocked"), true);
  assert.equal(judgment.blockingFactors.includes("constraint.1"), true);
});

test("classifies uncertain alternatives", () => {
  const judgment = synthesizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances());
  assert.equal(judgment.uncertainAlternatives.some((alternative) => alternative.alternativeId === "alternative.uncertain"), true);
});

test("classifies judgment posture", () => {
  const judgment = synthesizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances());
  assert.equal(judgment.judgmentPosture, "READY_WITH_CONSTRAINTS");
  assert.equal(judgment.judgmentReadiness, "conditional");
});

test("validates executive judgment", () => {
  const validation = validateExecutiveJudgment(synthesizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances()));
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("builds immutable judgment snapshot", () => {
  const snapshot = buildExecutiveJudgmentSnapshot(synthesizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances()));
  assert.equal(snapshot.validation.valid, true);
  assert.equal(snapshot.supportedAlternativeCount, 2);
  assert.equal(snapshot.blockedAlternativeCount, 2);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("publishes judgment registry integrity", () => {
  const registry = getExecutiveJudgmentRegistry();
  assert.equal(registry.registryId, "executive-judgment-engine-registry");
  assert.equal(registry.phaseId, "APP-JUDGE-7");
  assert.equal(registry.postures.includes("READY_TO_DECIDE"), true);
  assert.equal(registry.compatibleInputs.includes("APP-JUDGE-6"), true);
});

test("exports public judgment APIs", () => {
  assert.equal(typeof ExecutiveJudgmentEngine.createExecutiveJudgment, "function");
  assert.equal(typeof ExecutiveJudgmentEngine.synthesizeExecutiveJudgment, "function");
  assert.equal(typeof ExecutiveJudgmentEngine.normalizeExecutiveJudgment, "function");
  assert.equal(typeof ExecutiveJudgmentEngine.validateExecutiveJudgment, "function");
  assert.equal(typeof ExecutiveJudgmentEngine.buildExecutiveJudgmentSnapshot, "function");
  assert.equal(typeof ExecutiveJudgmentEngine.getExecutiveJudgmentRegistry, "function");
});

test("produces deterministic fingerprints", () => {
  const left = buildExecutiveJudgmentSnapshot(synthesizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances()));
  const right = buildExecutiveJudgmentSnapshot(synthesizeExecutiveJudgment(context(), evidence(), constraints(), tradeoffs(), balances()));
  assert.equal(left.fingerprint, right.fingerprint);
});

test("keeps APP-JUDGE-1 through APP-JUDGE-6 compatibility", () => {
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.version, "APP-JUDGE-1");
  assert.equal(validateExecutiveJudgmentContext(context()).valid, true);
  assert.equal(validateExecutiveJudgmentEvidence(evidence()).valid, true);
  assert.equal(validateExecutiveJudgmentConstraints(constraints()).valid, true);
  assert.equal(validateExecutiveJudgmentTradeoffs(tradeoffs()).valid, true);
  assert.equal(validateExecutiveJudgmentRiskOpportunity(balances()).valid, true);
});

test("contains no forbidden runtime behavior in source", () => {
  const sources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentEngine.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentSynthesizer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentNormalizer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentValidation.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentRegistry.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentSnapshot.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("Math.random"), false);
  assert.equal(sources.includes("Date."), false);
  assert.equal(sources.includes("call LLM"), false);
  assert.equal(sources.includes("generate prompts"), false);
  assert.equal(sources.includes("coach"), false);
  assert.equal(sources.includes("free-form"), false);
});
