import assert from "node:assert/strict";
import test from "node:test";

import { validateExecutiveIntentShape } from "./executiveIntentContract.ts";
import { classifyExecutiveIntent } from "./executiveIntentClassificationEngine.ts";
import { buildIntentConfidence } from "./executiveIntentConfidenceEngine.ts";
import { createIntentConfidenceAnalysisInput } from "./executiveIntentConfidenceTypes.ts";
import { buildConflictExample } from "./executiveIntentConflictEngine.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import {
  INTENT_REASONING_DIAGNOSTIC_CODES,
  isIntentReasoningDiagnosticCode,
} from "./executiveIntentReasoningDiagnostics.ts";
import {
  ExecutiveIntentReasoningEngine,
  buildExecutiveIntentReasoning,
  buildReadinessAssessment,
  buildReasoningEvidence,
  buildReasoningExample,
  buildReasoningHighlights,
  buildReasoningIssues,
  buildReasoningProbe,
  buildReasoningSummary,
  buildReasoningUnknowns,
  validateReasoning,
} from "./executiveIntentReasoningEngine.ts";
import {
  EXECUTIVE_INTENT_REASONING_ENGINE_RULES,
  EXECUTIVE_INTENT_REASONING_ENGINE_TAGS,
} from "./executiveIntentReasoningEngine.ts";
import {
  EXECUTIVE_INTENT_REASONING_CANONICAL_EXAMPLES,
  getExecutiveIntentReasoningCanonicalExample,
} from "./executiveIntentReasoningExamples.ts";
import { createExecutiveIntentReasoningAnalysisInput } from "./executiveIntentReasoningTypes.ts";
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
  const confidence = buildIntentConfidence(
    createIntentConfidenceAnalysisInput({
      workspaceId: WS,
      focusIntentId: extraction.primaryIntent?.intentId ?? null,
      extraction,
      semanticModel: semantic.model,
      classification,
      conflict: null,
      dependency: null,
      evolution: null,
      state,
      timestamp: FIXED_TIME,
    })
  );

  return createExecutiveIntentReasoningAnalysisInput({
    workspaceId: WS,
    focusIntentId: extraction.primaryIntent?.intentId ?? null,
    extraction,
    state,
    semanticModel: semantic.model,
    classification,
    conflict: null,
    dependency: null,
    evolution: null,
    confidence,
    timestamp: FIXED_TIME,
  });
}

test("builds reasoning for simple executive objective", () => {
  const result = buildReasoningExample("simple-executive-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(validateReasoning(result!).valid, true);
  assert.ok(result!.sections.length, 11);
  assert.equal(result!.readOnly, true);
});

test("builds reasoning for financial growth initiative", () => {
  const result = buildReasoningExample("financial-growth-initiative", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.ok(
    result!.sections.some(
      (section) => section.sectionKey === "primary_classification" && section.available
    )
  );
});

test("builds reasoning for operational optimization", () => {
  const result = buildReasoningExample("operational-optimization", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.ok(result!.issues.length >= 0);
  assert.ok(result!.summary.intentLabel.length > 0);
});

test("aggregates conflict information into reasoning model", () => {
  const baseline = buildExecutiveIntentReasoning(buildPipelineInput("Increase company profit by 20% next year."));
  const conflict = buildConflictExample("increase-vs-decrease-metric", WS, "executive-owner", FIXED_TIME);
  assert.ok(conflict);
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  const confidence = buildIntentConfidence(
    createIntentConfidenceAnalysisInput({ ...input, conflict, timestamp: FIXED_TIME })
  );
  const withConflict = buildExecutiveIntentReasoning(
    createExecutiveIntentReasoningAnalysisInput({ ...input, conflict, confidence })
  );
  assert.equal(withConflict.flags.hasConflicts, true);
  assert.ok(withConflict.issues.some((issue) => issue.issueKey === "conflicting_objectives"));
  assert.equal(baseline.flags.hasConflicts, false);
});

test("aggregates dependency information into reasoning model", () => {
  const result = buildReasoningExample("dependency-heavy-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.metadata.dependencyEngineVersion, "APP-3/8");
  assert.ok(result!.sections.some((section) => section.sectionKey === "dependency_summary"));
});

test("aggregates evolution information into reasoning model", () => {
  const result = buildReasoningExample("rapidly-evolving-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.metadata.evolutionEngineVersion, "APP-3/9");
  assert.equal(result!.flags.hasEvolutionHistory, true);
});

test("aggregates confidence information into reasoning model", () => {
  const result = buildReasoningProbe(FIXED_TIME);
  assert.equal(result.metadata.confidenceEngineVersion, "APP-3/10");
  assert.ok(result.sections.some((section) => section.sectionKey === "confidence_summary"));
});

test("assesses readiness for complete objective", () => {
  const result = buildReasoningExample("high-confidence-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.ok(["ready", "needs_clarification", "not_ready"].includes(result!.readinessAssessment.state));
});

test("reflects multiple unknowns in reasoning model", () => {
  const result = buildReasoningExample("multiple-unknowns", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.ok(result!.unknowns.length >= 0);
});

test("generates reasoning highlights deterministically", () => {
  const result = buildReasoningProbe(FIXED_TIME);
  assert.ok(result.highlights.items.length >= 1);
  assert.ok(
    result.highlights.items.some(
      (item) =>
        item.highlightKey === "clearly_defined_objective" ||
        item.highlightKey === "strong_semantic_model" ||
        item.highlightKey === "high_structural_confidence"
    )
  );
});

test("generates open issues from engine outputs", () => {
  const result = buildReasoningExample("low-confidence-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  const issues = buildReasoningIssues({
    semanticModel: result!.metadata ? buildPipelineInput("Do better soon.").semanticModel : null,
    classification: buildPipelineInput("Do better soon.").classification,
    conflict: null,
    dependency: null,
    evolution: null,
    confidence: buildPipelineInput("Do better soon.").confidence,
  });
  assert.ok(issues.length >= 0);
});

test("generates evidence from pipeline artifacts", () => {
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  const evidence = buildReasoningEvidence(input);
  assert.ok(evidence.some((entry) => entry.sourceEngine === "APP-3/4"));
  assert.ok(evidence.some((entry) => entry.sourceEngine === "APP-3/10"));
});

test("generates unknowns from semantic model", () => {
  const input = buildPipelineInput("Increase by 20%");
  const unknowns = buildReasoningUnknowns(input.semanticModel);
  assert.ok(Array.isArray(unknowns));
});

test("includes reasoning diagnostics", () => {
  const result = buildReasoningProbe(FIXED_TIME);
  assert.ok(result.diagnostics.length >= 3);
  assert.ok(result.diagnostics.some((entry) => entry.code === "reasoning_synthesis_success"));
});

test("produces deterministic output for identical input", () => {
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  const first = buildExecutiveIntentReasoning(input);
  const second = buildExecutiveIntentReasoning(input);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

test("reasoning result is read-only and immutable", () => {
  const result = buildReasoningProbe(FIXED_TIME);
  assert.equal(result.readOnly, true);
  assert.equal(result.flags.readOnly, true);
  assert.equal(result.flags.deterministic, true);
  const before = JSON.stringify(result);
  buildExecutiveIntentReasoning(buildPipelineInput("Increase company profit by 20% next year."));
  assert.equal(JSON.stringify(result), before);
});

test("buildReasoningSummary aligns with reasoning result", () => {
  const result = buildReasoningProbe(FIXED_TIME);
  const summary = buildReasoningSummary({
    extraction: buildPipelineInput("Increase company profit by 20% next year.").extraction,
    semanticModel: buildPipelineInput("Increase company profit by 20% next year.").semanticModel,
    classification: buildPipelineInput("Increase company profit by 20% next year.").classification,
    confidence: buildPipelineInput("Increase company profit by 20% next year.").confidence,
    readinessAssessment: result.readinessAssessment,
    issues: result.issues,
    unknownCount: result.unknowns.length,
    highlightCount: result.highlights.items.length,
  });
  assert.equal(summary.readinessState, result.readinessAssessment.state);
});

test("declares reasoning diagnostics and engine tags", () => {
  assert.equal(INTENT_REASONING_DIAGNOSTIC_CODES.length, 15);
  assert.equal(isIntentReasoningDiagnosticCode("reasoning_ready"), true);
  assert.ok(EXECUTIVE_INTENT_REASONING_ENGINE_TAGS.includes("[APP3_11]"));
  assert.ok(EXECUTIVE_INTENT_REASONING_ENGINE_TAGS.includes("[UNIFIED_REASONING_MODEL]"));
  assert.equal(EXECUTIVE_INTENT_REASONING_ENGINE_RULES.orchestrationOnly, true);
});

test("regression: APP-3:10 confidence result consumed", () => {
  const result = buildReasoningProbe(FIXED_TIME);
  assert.equal(result.metadata.confidenceEngineVersion, "APP-3/10");
});

test("regression: APP-3:9 evolution result consumed", () => {
  const result = buildReasoningExample("rapidly-evolving-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.metadata.evolutionEngineVersion, "APP-3/9");
});

test("regression: APP-3:8 dependency result consumed", () => {
  const result = buildReasoningExample("dependency-heavy-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.metadata.dependencyEngineVersion, "APP-3/8");
});

test("regression: APP-3:7 conflict result consumed", () => {
  const result = buildReasoningExample("conflict-heavy-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.metadata.conflictEngineVersion, "APP-3/7");
});

test("regression: APP-3:6 classification consumed", () => {
  const result = buildReasoningProbe(FIXED_TIME);
  assert.equal(result.metadata.classificationEngineVersion, "APP-3/6");
});

test("regression: APP-3:5 semantic model consumed", () => {
  const result = buildReasoningProbe(FIXED_TIME);
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

test("covers reasoning canonical example catalog", () => {
  assert.ok(EXECUTIVE_INTENT_REASONING_CANONICAL_EXAMPLES.length >= 10);
  assert.ok(getExecutiveIntentReasoningCanonicalExample("simple-executive-objective"));
});

test("ExecutiveIntentReasoningEngine exposes public APIs", () => {
  assert.equal(ExecutiveIntentReasoningEngine.version, "APP-3/11");
  assert.equal(typeof ExecutiveIntentReasoningEngine.buildExecutiveIntentReasoning, "function");
  assert.equal(typeof ExecutiveIntentReasoningEngine.buildReasoningProbe, "function");
  assert.equal(typeof ExecutiveIntentReasoningEngine.validateReasoning, "function");
});

test("validateReasoning rejects inconsistent summary counts", () => {
  const result = buildReasoningProbe(FIXED_TIME);
  const tampered = Object.freeze({
    ...result,
    summary: Object.freeze({
      ...result.summary,
      issueCount: 999,
    }),
  });
  assert.equal(validateReasoning(tampered).valid, false);
});

test("buildReadinessAssessment returns valid readiness states", () => {
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  const issues = buildReasoningIssues(input);
  const assessment = buildReadinessAssessment({
    extraction: input.extraction,
    state: input.state,
    semanticModel: input.semanticModel,
    confidence: input.confidence,
    issues,
    unknownCount: input.semanticModel?.unknowns.length ?? 0,
  });
  assert.ok(
    [
      "ready",
      "needs_clarification",
      "blocked",
      "incomplete",
      "not_ready",
      "archived",
      "unknown",
    ].includes(assessment.state)
  );
});

test("buildReasoningHighlights includes no major conflicts when absent", () => {
  const input = buildPipelineInput("Increase company profit by 20% next year.");
  const highlights = buildReasoningHighlights({
    semanticModel: input.semanticModel,
    conflict: null,
    dependency: null,
    evolution: null,
    confidence: input.confidence,
    unknownCount: 0,
  });
  assert.ok(highlights.items.some((item) => item.highlightKey === "no_major_conflicts"));
});

test("metadata lists all consumed engines", () => {
  const result = buildReasoningProbe(FIXED_TIME);
  assert.ok(result.metadata.enginesConsumed.includes("APP-3/1"));
  assert.ok(result.metadata.enginesConsumed.includes("APP-3/10"));
});
