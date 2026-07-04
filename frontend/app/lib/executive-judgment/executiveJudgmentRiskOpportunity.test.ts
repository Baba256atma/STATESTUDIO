import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY } from "./index.ts";
import { createExecutiveJudgmentContext, validateExecutiveJudgmentContext, type ExecutiveJudgmentContextItem } from "./executiveJudgmentContextEngine.ts";
import { evaluateExecutiveJudgmentEvidence, validateExecutiveJudgmentEvidence } from "./executiveJudgmentEvidenceEngine.ts";
import { analyzeExecutiveJudgmentConstraints, validateExecutiveJudgmentConstraints } from "./executiveJudgmentConstraintEngine.ts";
import { analyzeExecutiveJudgmentTradeoffs, validateExecutiveJudgmentTradeoffs } from "./executiveJudgmentTradeoffEngine.ts";
import {
  ExecutiveJudgmentRiskOpportunityEngine,
  balanceExecutiveJudgmentRiskOpportunity,
  buildExecutiveJudgmentRiskOpportunitySnapshot,
  getExecutiveJudgmentRiskOpportunityRegistry,
  normalizeExecutiveJudgmentRiskOpportunity,
  validateExecutiveJudgmentRiskOpportunity,
} from "./executiveJudgmentRiskOpportunityEngine.ts";

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
      item("evidence.1", "Execution Evidence", "Document Store", Object.freeze(["doc.1"])),
      item("evidence.2", "Growth Evidence", "KPI Platform", Object.freeze(["kpi.1"])),
    ]),
    constraints: Object.freeze([
      item("constraint.1", "Execution Constraint", "Policy Register", Object.freeze(["evidence.1"])),
      item("constraint.2", "Resource Constraint", "Resource Model", Object.freeze(["evidence.2"])),
    ]),
    availableAlternatives: Object.freeze([
      item("tradeoff.1", "Execution Strategic Gain", "APP", Object.freeze(["evidence.1", "constraint.1"])),
      item("opportunity.1", "Strategic Gain Opportunity", "Opportunity Platform", Object.freeze(["evidence.2", "tradeoff.1", "scenario.1"])),
      item("opportunity.2", "Growth Opportunity", "Opportunity Platform", Object.freeze(["evidence.2", "alternative.1"])),
    ]),
    scenarios: Object.freeze([
      item("scenario.1", "Strategic Scenario", "Scenario Platform"),
    ]),
    risks: Object.freeze([
      item("risk.1", "Execution Risk", "Risk Platform", Object.freeze(["evidence.1", "constraint.1", "tradeoff.1"])),
      item("risk.1", "Execution Risk Duplicate", "Risk Platform", Object.freeze(["evidence.1"])),
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

test("normalizes risks", () => {
  const normalized = normalizeExecutiveJudgmentRiskOpportunity(context(), evidence(), constraints(), tradeoffs());
  assert.equal(normalized.risks[0]?.riskId, "risk.1");
  assert.equal(normalized.risks[0]?.references.includes("evidence.1"), true);
});

test("normalizes opportunities", () => {
  const normalized = normalizeExecutiveJudgmentRiskOpportunity(context(), evidence(), constraints(), tradeoffs());
  assert.deepEqual(normalized.opportunities.map((entry) => entry.opportunityId), ["opportunity.1", "opportunity.2"]);
  assert.equal(normalized.opportunities[0]?.references.includes("scenario.1"), true);
});

test("normalizes risk opportunity balances", () => {
  const normalized = normalizeExecutiveJudgmentRiskOpportunity(context(), evidence(), constraints(), tradeoffs());
  assert.equal(normalized.records.length, 2);
  assert.equal(normalized.records[0]?.balanceType, "execution-risk-strategic-gain");
  assert.equal(normalized.records[0]?.relatedEvidenceIds.includes("evidence.1"), true);
  assert.equal(normalized.records[0]?.relatedTradeoffIds.includes("tradeoff.1"), true);
});

test("removes duplicate balance records", () => {
  const baseContext = context();
  const duplicatedContext = Object.freeze({
    ...baseContext,
    risks: Object.freeze([
      item("risk.1", "Execution Risk", "Risk Platform", Object.freeze(["evidence.1"])),
      item("risk.1", "Execution Risk Duplicate", "Risk Platform", Object.freeze(["evidence.1"])),
    ]),
    availableAlternatives: Object.freeze([
      item("opportunity.1", "Strategic Gain Opportunity", "Opportunity Platform", Object.freeze(["evidence.2"])),
    ]),
  });
  const duplicatedEvidence = evaluateExecutiveJudgmentEvidence(duplicatedContext);
  const duplicatedConstraints = analyzeExecutiveJudgmentConstraints(duplicatedContext, duplicatedEvidence);
  const duplicatedTradeoffs = analyzeExecutiveJudgmentTradeoffs(duplicatedContext, duplicatedEvidence, duplicatedConstraints);
  const normalized = normalizeExecutiveJudgmentRiskOpportunity(duplicatedContext, duplicatedEvidence, duplicatedConstraints, duplicatedTradeoffs);
  assert.deepEqual(normalized.duplicateIdsRemoved, ["balance.risk.1.opportunity.1"]);
});

test("balances risk opportunity metadata", () => {
  const balanced = balanceExecutiveJudgmentRiskOpportunity(context(), evidence(), constraints(), tradeoffs());
  assert.equal(balanced.assessments.length, 2);
  assert.equal(balanced.assessments[0]?.dependency, "complete");
  assert.equal(balanced.assessments[0]?.relationship, "linked");
  assert.equal(balanced.assessments[0]?.timeHorizon, "long-term");
});

test("validates risk opportunity balance", () => {
  const validation = validateExecutiveJudgmentRiskOpportunity(balanceExecutiveJudgmentRiskOpportunity(context(), evidence(), constraints(), tradeoffs()));
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("builds immutable risk opportunity snapshot", () => {
  const snapshot = buildExecutiveJudgmentRiskOpportunitySnapshot(balanceExecutiveJudgmentRiskOpportunity(context(), evidence(), constraints(), tradeoffs()));
  assert.equal(snapshot.balanceCount, 2);
  assert.equal(snapshot.riskCount, 1);
  assert.equal(snapshot.opportunityCount, 2);
  assert.equal(snapshot.validation.valid, true);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("publishes risk opportunity registry integrity", () => {
  const registry = getExecutiveJudgmentRiskOpportunityRegistry();
  assert.equal(registry.registryId, "executive-judgment-risk-opportunity-registry");
  assert.equal(registry.phaseId, "APP-JUDGE-6");
  assert.equal(registry.domains.includes("execution-risk-strategic-gain"), true);
  assert.equal(registry.compatibleInputs.includes("APP-JUDGE-5"), true);
});

test("exports public risk opportunity APIs", () => {
  assert.equal(typeof ExecutiveJudgmentRiskOpportunityEngine.balanceExecutiveJudgmentRiskOpportunity, "function");
  assert.equal(typeof ExecutiveJudgmentRiskOpportunityEngine.normalizeExecutiveJudgmentRiskOpportunity, "function");
  assert.equal(typeof ExecutiveJudgmentRiskOpportunityEngine.validateExecutiveJudgmentRiskOpportunity, "function");
  assert.equal(typeof ExecutiveJudgmentRiskOpportunityEngine.buildExecutiveJudgmentRiskOpportunitySnapshot, "function");
  assert.equal(typeof ExecutiveJudgmentRiskOpportunityEngine.getExecutiveJudgmentRiskOpportunityRegistry, "function");
});

test("produces deterministic fingerprints", () => {
  const left = buildExecutiveJudgmentRiskOpportunitySnapshot(balanceExecutiveJudgmentRiskOpportunity(context(), evidence(), constraints(), tradeoffs()));
  const right = buildExecutiveJudgmentRiskOpportunitySnapshot(balanceExecutiveJudgmentRiskOpportunity(context(), evidence(), constraints(), tradeoffs()));
  assert.equal(left.fingerprint, right.fingerprint);
});

test("keeps APP-JUDGE-1 through APP-JUDGE-5 compatibility", () => {
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.version, "APP-JUDGE-1");
  assert.equal(validateExecutiveJudgmentContext(context()).valid, true);
  assert.equal(validateExecutiveJudgmentEvidence(evidence()).valid, true);
  assert.equal(validateExecutiveJudgmentConstraints(constraints()).valid, true);
  assert.equal(validateExecutiveJudgmentTradeoffs(tradeoffs()).valid, true);
});

test("contains no forbidden runtime behavior in source", () => {
  const sources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentRiskOpportunityEngine.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentRiskOpportunityBalancer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentRiskOpportunityNormalizer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentRiskOpportunityValidation.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentRiskOpportunityRegistry.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentRiskOpportunitySnapshot.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("Math.random"), false);
  assert.equal(sources.includes("Date."), false);
  assert.equal(sources.includes("score"), false);
  assert.equal(sources.includes("rank"), false);
  assert.equal(sources.includes("recommend"), false);
  assert.equal(sources.includes("call LLM"), false);
});
