import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createExecutiveJudgmentContext, type ExecutiveJudgmentContextItem } from "./executiveJudgmentContextEngine.ts";
import { evaluateExecutiveJudgmentEvidence } from "./executiveJudgmentEvidenceEngine.ts";
import { analyzeExecutiveJudgmentConstraints } from "./executiveJudgmentConstraintEngine.ts";
import { analyzeExecutiveJudgmentTradeoffs } from "./executiveJudgmentTradeoffEngine.ts";
import { balanceExecutiveJudgmentRiskOpportunity } from "./executiveJudgmentRiskOpportunityEngine.ts";
import { synthesizeExecutiveJudgment, validateExecutiveJudgment } from "./executiveJudgmentEngine.ts";
import {
  ExecutiveJudgmentExplanationEngine,
  buildExecutiveJudgmentExplanation,
  buildExecutiveJudgmentExplanationSnapshot,
  createExecutiveJudgmentExplanation,
  getExecutiveJudgmentExplanationRegistry,
  normalizeExecutiveJudgmentExplanation,
  validateExecutiveJudgmentExplanation,
} from "./executiveJudgmentExplanationEngine.ts";

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

function judgment() {
  const context = createExecutiveJudgmentContext({
    availableEvidence: Object.freeze([
      item("evidence.1", "Evidence", "Document Store", Object.freeze(["doc.1"])),
      item("evidence.2", "Growth Evidence", "KPI Platform", Object.freeze(["kpi.1"])),
    ]),
    constraints: Object.freeze([
      item("constraint.1", "Resource Constraint", "Resource Model", Object.freeze(["evidence.1"])),
    ]),
    availableAlternatives: Object.freeze([
      item("alternative.viable", "Viable Alternative", "APP", Object.freeze(["evidence.1"])),
      item("alternative.blocked", "Blocked Alternative", "APP", Object.freeze(["evidence.2", "constraint.1"])),
      item("tradeoff.1", "Execution Strategic Gain", "APP", Object.freeze(["evidence.1", "constraint.1"])),
      item("opportunity.1", "Strategic Gain Opportunity", "Opportunity Platform", Object.freeze(["evidence.2", "tradeoff.1"])),
    ]),
    risks: Object.freeze([
      item("risk.1", "Execution Risk", "Risk Platform", Object.freeze(["evidence.1", "constraint.1", "tradeoff.1"])),
    ]),
  });
  const evidence = evaluateExecutiveJudgmentEvidence(context);
  const constraints = analyzeExecutiveJudgmentConstraints(context, evidence);
  const tradeoffs = analyzeExecutiveJudgmentTradeoffs(context, evidence, constraints);
  const balances = balanceExecutiveJudgmentRiskOpportunity(context, evidence, constraints, tradeoffs);
  return synthesizeExecutiveJudgment(context, evidence, constraints, tradeoffs, balances);
}

test("generates structured explanation", () => {
  const explanation = createExecutiveJudgmentExplanation(judgment());
  assert.equal(explanation.explanationType, "structured-judgment-explanation");
  assert.equal(explanation.judgmentId, "judgment.executive-judgment-context");
  assert.equal(explanation.metadata.metadataOnly, true);
});

test("builds section hierarchy", () => {
  const explanation = buildExecutiveJudgmentExplanation(judgment());
  assert.equal(explanation.sections.length, 11);
  assert.deepEqual(
    explanation.sections.map((section) => section.sectionType),
    [
      "executive-summary",
      "evidence-basis",
      "constraint-basis",
      "tradeoff-basis",
      "risk-opportunity-basis",
      "alternative-analysis",
      "blocking-factors",
      "decision-boundaries",
      "known-gaps",
      "supporting-metadata",
      "validation-summary",
    ]
  );
});

test("builds traceability map", () => {
  const explanation = buildExecutiveJudgmentExplanation(judgment());
  assert.equal(explanation.traceabilityMap.some((entry) => entry.sourceType === "evidence" && entry.sourceId === "evidence.1"), true);
  assert.equal(explanation.traceabilityMap.some((entry) => entry.sourceType === "alternative" && entry.sourceId === "alternative.viable"), true);
});

test("generates structured summaries", () => {
  const explanation = normalizeExecutiveJudgmentExplanation(judgment());
  const alternativeSection = explanation.sections.find((section) => section.sectionType === "alternative-analysis");
  assert.equal(alternativeSection?.metrics.supportedCount, 2);
  assert.equal(alternativeSection?.metrics.blockedCount, 2);
});

test("normalizes explanation metadata", () => {
  const explanation = normalizeExecutiveJudgmentExplanation(judgment());
  assert.equal(explanation.explanationId, "explanation.judgment.executive-judgment-context");
  assert.equal(explanation.referencedAssessments.includes("evidence.1"), true);
  assert.equal(explanation.referencedObjects.includes("alternative.blocked"), true);
});

test("validates explanation", () => {
  const validation = validateExecutiveJudgmentExplanation(buildExecutiveJudgmentExplanation(judgment()));
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("builds immutable explanation snapshot", () => {
  const snapshot = buildExecutiveJudgmentExplanationSnapshot(buildExecutiveJudgmentExplanation(judgment()));
  assert.equal(snapshot.sectionCount, 11);
  assert.equal(snapshot.validation.valid, true);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("publishes explanation registry integrity", () => {
  const registry = getExecutiveJudgmentExplanationRegistry();
  assert.equal(registry.registryId, "executive-judgment-explanation-registry");
  assert.equal(registry.phaseId, "APP-JUDGE-8");
  assert.equal(registry.sectionTypes.includes("evidence-basis"), true);
  assert.equal(registry.compatibleInputs.includes("APP-JUDGE-7"), true);
});

test("exports public explanation APIs", () => {
  assert.equal(typeof ExecutiveJudgmentExplanationEngine.createExecutiveJudgmentExplanation, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationEngine.buildExecutiveJudgmentExplanation, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationEngine.normalizeExecutiveJudgmentExplanation, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationEngine.validateExecutiveJudgmentExplanation, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationEngine.buildExecutiveJudgmentExplanationSnapshot, "function");
  assert.equal(typeof ExecutiveJudgmentExplanationEngine.getExecutiveJudgmentExplanationRegistry, "function");
});

test("produces deterministic fingerprints", () => {
  const left = buildExecutiveJudgmentExplanationSnapshot(buildExecutiveJudgmentExplanation(judgment()));
  const right = buildExecutiveJudgmentExplanationSnapshot(buildExecutiveJudgmentExplanation(judgment()));
  assert.equal(left.fingerprint, right.fingerprint);
});

test("keeps APP-JUDGE-1 through APP-JUDGE-7 compatibility", () => {
  assert.equal(validateExecutiveJudgment(judgment()).valid, true);
});

test("contains no forbidden runtime behavior in source", () => {
  const sources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentExplanationEngine.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentExplanationBuilder.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentExplanationNormalizer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentExplanationValidation.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentExplanationRegistry.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentExplanationSnapshot.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("Math.random"), false);
  assert.equal(sources.includes("Date."), false);
  assert.equal(sources.includes("call LLM"), false);
  assert.equal(sources.includes("generate prompts"), false);
  assert.equal(sources.includes("coach"), false);
  assert.equal(sources.includes("persuade"), false);
  assert.equal(sources.includes("fetch("), false);
});
