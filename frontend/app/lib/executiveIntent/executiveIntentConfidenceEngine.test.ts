import assert from "node:assert/strict";
import test from "node:test";

import { validateExecutiveIntentShape } from "./executiveIntentContract.ts";
import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { buildConflictExample } from "./executiveIntentConflictEngine.ts";
import { buildEvolutionExampleSet, buildIntentEvolution } from "./executiveIntentEvolutionEngine.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import {
  INTENT_CONFIDENCE_DIAGNOSTIC_CODES,
  isIntentConfidenceDiagnosticCode,
} from "./executiveIntentConfidenceDiagnostics.ts";
import {
  ExecutiveIntentConfidenceEngine,
  buildConfidenceExample,
  buildConfidenceProbe,
  buildConfidenceSummary,
  buildIntentConfidence,
  calculateIntentConfidence,
  resolveConfidenceBreakdown,
  resolveConfidenceFactors,
  resolveConfidenceLevel,
  validateConfidence,
} from "./executiveIntentConfidenceEngine.ts";
import {
  CONFIDENCE_FACTOR_WEIGHTS,
  CONFIDENCE_LEVEL_THRESHOLDS,
} from "./executiveIntentConfidenceRules.ts";
import {
  EXECUTIVE_INTENT_CONFIDENCE_ENGINE_RULES,
  EXECUTIVE_INTENT_CONFIDENCE_ENGINE_TAGS,
} from "./executiveIntentConfidenceEngine.ts";
import {
  INTENT_CONFIDENCE_CANONICAL_EXAMPLES,
  getIntentConfidenceCanonicalExample,
} from "./executiveIntentConfidenceExamples.ts";
import { createIntentConfidenceAnalysisInput } from "./executiveIntentConfidenceTypes.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WS = "ws-example-001";

function buildPipelineInput(text: string) {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text,
      workspaceId: WS,
      owner: "executive-owner",
      languageCode: "en",
      generatedAt: FIXED_TIME,
    })
  );
  const semantic = buildExecutiveIntentSemanticModel(extraction, FIXED_TIME);
  const classification = classifyExecutiveIntent(semantic.model, FIXED_TIME);
  const state = extraction.primaryIntent
    ? resolveExecutiveIntentStateResult(
        Object.freeze({
          intent: extraction.primaryIntent,
          intentId: extraction.primaryIntent.intentId,
          workspaceId: WS,
          evaluatedAt: FIXED_TIME,
          proposedLifecycleTransition: null,
        })
      )
    : null;
  const dependency = null;

  return createIntentConfidenceAnalysisInput({
    workspaceId: WS,
    focusIntentId: extraction.primaryIntent?.intentId ?? null,
    extraction,
    semanticModel: semantic.model,
    classification,
    conflict: null,
    dependency,
    evolution: null,
    state,
    timestamp: FIXED_TIME,
  });
}

test("calculates high confidence for complete intent", () => {
  const result = buildConfidenceExample("high-confidence-intent", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.ok(result!.aggregateScore >= 70);
  assert.ok(["very_high", "high"].includes(result!.level));
  assert.equal(validateConfidence(result!).valid, true);
});

test("reports incomplete extraction with lower confidence", () => {
  const result = buildConfidenceExample("incomplete-extraction", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.ok(result!.aggregateScore <= 60);
  assert.ok(["low", "very_low", "medium", "unknown"].includes(result!.level));
  const extractionFactor = result!.breakdown.factors.find(
    (factor) => factor.factorKey === "extraction_completeness"
  );
  assert.ok(extractionFactor);
  assert.ok(extractionFactor!.rawScore <= 70);
});

test("reflects missing semantic information", () => {
  const result = buildConfidenceExample("missing-target", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  const semanticFactor = result!.breakdown.factors.find(
    (factor) => factor.factorKey === "semantic_completeness"
  );
  assert.ok(semanticFactor);
  assert.ok(semanticFactor!.rawScore < 100);
});

test("reflects stable evolution history", () => {
  const result = buildConfidenceExample("stable-long-lived-strategy", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.metadata.evolutionEngineVersion, "APP-3/9");
  const evolutionFactor = result!.breakdown.factors.find(
    (factor) => factor.factorKey === "evolution_stability"
  );
  assert.ok(evolutionFactor);
  assert.ok(evolutionFactor!.rawScore >= 75);
});

test("reflects rapid evolution history", () => {
  const result = buildConfidenceExample("rapidly-changing-strategy", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  const evolutionFactor = result!.breakdown.factors.find(
    (factor) => factor.factorKey === "evolution_stability"
  );
  assert.ok(evolutionFactor);
});

test("reflects conflict impact on confidence", () => {
  const baseline = buildPipelineInput("Increase company profit by 20% next year.");
  const baselineResult = calculateIntentConfidence(baseline);
  const conflict = buildConflictExample("increase-vs-decrease-metric", WS, "executive-owner", FIXED_TIME);
  assert.ok(conflict);
  const conflictResult = calculateIntentConfidence(
    createIntentConfidenceAnalysisInput({ ...baseline, conflict })
  );
  const conflictFactor = conflictResult.breakdown.factors.find(
    (factor) => factor.factorKey === "conflict_impact"
  );
  assert.ok(conflictFactor);
  assert.ok(conflictFactor!.rawScore < 100);
  assert.equal(conflictResult.flags.conflictAffected, true);
  assert.ok(conflictResult.aggregateScore <= baselineResult.aggregateScore + 5);
});

test("reflects dependency complexity", () => {
  const result = buildConfidenceExample("complex-dependency-graph", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  const dependencyFactor = result!.breakdown.factors.find(
    (factor) => factor.factorKey === "dependency_complexity"
  );
  assert.ok(dependencyFactor);
  assert.ok(result!.metadata.dependencyEngineVersion);
});

test("reflects unknown information penalty", () => {
  const result = buildConfidenceExample("unknown-information", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  const unknownFactor = result!.breakdown.factors.find(
    (factor) => factor.factorKey === "unknown_information"
  );
  assert.ok(unknownFactor);
  assert.ok(unknownFactor!.rawScore < 100);
});

test("reports low confidence for vague objective", () => {
  const result = buildConfidenceExample("low-confidence-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.ok(result!.aggregateScore <= 55);
  assert.ok(["very_low", "low", "unknown"].includes(result!.level));
});

test("evaluates readiness factor", () => {
  const complete = buildConfidenceProbe(FIXED_TIME);
  const incomplete = buildConfidenceExample("incomplete-extraction", WS, "executive-owner", FIXED_TIME);
  assert.ok(incomplete);
  const completeReadiness = complete.breakdown.factors.find((factor) => factor.factorKey === "readiness");
  const incompleteReadiness = incomplete!.breakdown.factors.find(
    (factor) => factor.factorKey === "readiness"
  );
  assert.ok(completeReadiness);
  assert.ok(incompleteReadiness);
  assert.ok(completeReadiness!.rawScore > incompleteReadiness!.rawScore);
});

test("applies deterministic factor weighting", () => {
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  const factors = resolveConfidenceFactors(input);
  assert.equal(factors.length, 11);
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  assert.ok(Math.abs(totalWeight - 1) < 0.001);
  for (const factor of factors) {
    assert.equal(factor.weight, CONFIDENCE_FACTOR_WEIGHTS[factor.factorKey]);
    assert.equal(factor.weightedScore, Math.max(0, Math.min(100, Math.round(factor.rawScore * factor.weight))));
  }
});

test("builds confidence breakdown with required fields", () => {
  const input = buildPipelineInput("Reduce operating cost by 8% next year.");
  const factors = resolveConfidenceFactors(input);
  const breakdown = resolveConfidenceBreakdown(factors, FIXED_TIME);
  assert.equal(breakdown.factors.length, 11);
  for (const factor of breakdown.factors) {
    assert.ok(factor.factorName.length > 0);
    assert.ok(typeof factor.rawScore === "number");
    assert.ok(typeof factor.weightedScore === "number");
    assert.ok(factor.diagnostic.length > 0);
    assert.ok(factor.explanation.length > 0);
    assert.ok(typeof factor.contribution === "number");
    assert.ok(typeof factor.blocking === "boolean");
    assert.equal(factor.futureCompatible, true);
    assert.equal(factor.readOnly, true);
  }
});

test("resolveConfidenceLevel maps thresholds deterministically", () => {
  assert.equal(resolveConfidenceLevel(95), "very_high");
  assert.equal(resolveConfidenceLevel(80), "high");
  assert.equal(resolveConfidenceLevel(60), "medium");
  assert.equal(resolveConfidenceLevel(40), "low");
  assert.equal(resolveConfidenceLevel(20), "very_low");
  assert.equal(resolveConfidenceLevel(5), "unknown");
  assert.equal(CONFIDENCE_LEVEL_THRESHOLDS.length, 5);
});

test("produces deterministic output for identical input", () => {
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  const first = calculateIntentConfidence(input);
  const second = calculateIntentConfidence(input);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

test("confidence result is read-only and immutable", () => {
  const result = buildConfidenceProbe(FIXED_TIME);
  assert.equal(result.readOnly, true);
  assert.equal(result.flags.readOnly, true);
  assert.equal(result.flags.deterministic, true);
  assert.equal(result.summary.readOnly, true);
  const before = JSON.stringify(result);
  buildIntentConfidence(buildPipelineInput("Increase company profit by 20% next year."));
  assert.equal(JSON.stringify(result), before);
});

test("buildConfidenceSummary matches result flags", () => {
  const result = buildConfidenceProbe(FIXED_TIME);
  const summary = buildConfidenceSummary(result);
  assert.equal(summary.level, result.level);
  assert.equal(summary.aggregateScore, result.aggregateScore);
  assert.equal(summary.readyForReasoning, result.flags.readyForReasoning);
});

test("declares confidence diagnostics and engine tags", () => {
  assert.equal(INTENT_CONFIDENCE_DIAGNOSTIC_CODES.length, 16);
  assert.equal(isIntentConfidenceDiagnosticCode("confidence_high"), true);
  assert.ok(EXECUTIVE_INTENT_CONFIDENCE_ENGINE_TAGS.includes("[APP3_10]"));
  assert.ok(EXECUTIVE_INTENT_CONFIDENCE_ENGINE_TAGS.includes("[UNDERSTANDING_CONFIDENCE]"));
  assert.equal(EXECUTIVE_INTENT_CONFIDENCE_ENGINE_RULES.noBusinessPrediction, true);
  assert.equal(EXECUTIVE_INTENT_CONFIDENCE_ENGINE_RULES.noRecommendations, true);
});

test("regression: APP-3:9 evolution result consumed", () => {
  const evolutionSet = buildEvolutionExampleSet("version-chain");
  assert.ok(evolutionSet);
  const evolution = buildIntentEvolution(
    Object.freeze({
      workspaceId: WS,
      records: evolutionSet!.records,
      focusIntentId: evolutionSet!.focusIntentId,
      timestamp: FIXED_TIME,
      readOnly: true as const,
    })
  );
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  const result = calculateIntentConfidence(
    createIntentConfidenceAnalysisInput({ ...input, evolution })
  );
  assert.equal(result.metadata.evolutionEngineVersion, "APP-3/9");
});

test("regression: APP-3:8 dependency result consumed", () => {
  const result = buildConfidenceExample("complex-dependency-graph", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.metadata.dependencyEngineVersion, "APP-3/8");
});

test("regression: APP-3:7 conflict result consumed", () => {
  const conflict = buildConflictExample("increase-vs-decrease-metric", WS, "executive-owner", FIXED_TIME);
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  const result = calculateIntentConfidence(
    createIntentConfidenceAnalysisInput({ ...input, conflict })
  );
  assert.equal(result.metadata.conflictEngineVersion, "APP-3/7");
});

test("regression: APP-3:6 classification consumed", () => {
  const result = buildConfidenceProbe(FIXED_TIME);
  assert.equal(result.metadata.classificationEngineVersion, "APP-3/6");
});

test("regression: APP-3:5 semantic model consumed", () => {
  const result = buildConfidenceProbe(FIXED_TIME);
  assert.equal(result.metadata.semanticModelVersion, "APP-3/5");
});

test("regression: APP-3:4 extraction pipeline preserved", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Increase company profit by 20% next year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  assert.equal(extraction.engineVersion, "APP-3/4");
});

test("regression: APP-3:2 state consumed", () => {
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  assert.ok(input.state);
  assert.equal(input.state!.engineVersion, "APP-3/2");
});

test("regression: APP-3:1 contract shape preserved", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Increase company profit by 20% next year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  assert.ok(extraction.primaryIntent);
  assert.equal(validateExecutiveIntentShape(extraction.primaryIntent!).valid, true);
});

test("covers confidence canonical example catalog", () => {
  assert.ok(INTENT_CONFIDENCE_CANONICAL_EXAMPLES.length >= 10);
  assert.ok(getIntentConfidenceCanonicalExample("high-confidence-intent"));
});

test("ExecutiveIntentConfidenceEngine exposes public APIs", () => {
  assert.equal(ExecutiveIntentConfidenceEngine.version, "APP-3/10");
  assert.equal(typeof ExecutiveIntentConfidenceEngine.buildIntentConfidence, "function");
  assert.equal(typeof ExecutiveIntentConfidenceEngine.calculateIntentConfidence, "function");
  assert.equal(typeof ExecutiveIntentConfidenceEngine.resolveConfidenceFactors, "function");
  assert.equal(typeof ExecutiveIntentConfidenceEngine.resolveConfidenceLevel, "function");
  assert.equal(typeof ExecutiveIntentConfidenceEngine.resolveConfidenceBreakdown, "function");
  assert.equal(typeof ExecutiveIntentConfidenceEngine.validateConfidence, "function");
  assert.equal(typeof ExecutiveIntentConfidenceEngine.buildConfidenceSummary, "function");
  assert.equal(typeof ExecutiveIntentConfidenceEngine.buildConfidenceExample, "function");
  assert.equal(typeof ExecutiveIntentConfidenceEngine.buildConfidenceProbe, "function");
});

test("classification ambiguity reduces classification determinism score", () => {
  const vague = buildConfidenceExample("low-confidence-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(vague);
  const classificationFactor = vague!.breakdown.factors.find(
    (factor) => factor.factorKey === "classification_determinism"
  );
  assert.ok(classificationFactor);
  assert.ok(classificationFactor!.rawScore <= 70);
});

test("validateConfidence rejects inconsistent aggregate score", () => {
  const result = buildConfidenceProbe(FIXED_TIME);
  const tampered = Object.freeze({
    ...result,
    aggregateScore: 0,
    breakdown: Object.freeze({
      ...result.breakdown,
      aggregateScore: 0,
    }),
  });
  assert.equal(validateConfidence(tampered).valid, false);
});
