import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_INTENT_CONTRACT_VERSION,
  validateExecutiveIntentShape,
} from "./executiveIntentContract.ts";
import {
  INTENT_EXTRACTION_DIAGNOSTIC_CODES,
  isIntentExtractionDiagnosticCode,
} from "./executiveIntentExtractionDiagnostics.ts";
import {
  INTENT_EXTRACTION_CANONICAL_EXAMPLES,
  getIntentExtractionCanonicalExample,
} from "./executiveIntentExtractionExamples.ts";
import {
  ExecutiveIntentExtractionEngine,
  extractExecutiveIntent,
  extractExecutiveIntentBatch,
  extractExecutiveIntentExample,
  extractIntentActors,
  extractIntentAssumptions,
  extractIntentConstraints,
  extractIntentEvidence,
  extractIntentTargets,
  extractIntentTimeReferences,
  validateExtractionResult,
} from "./executiveIntentExtractionEngine.ts";
import {
  EXECUTIVE_INTENT_EXTRACTION_ENGINE_RULES,
  EXECUTIVE_INTENT_EXTRACTION_ENGINE_TAGS,
} from "./executiveIntentExtractionEngine.ts";
import {
  INTENT_EXTRACTION_SPANISH_LANGUAGE_ADAPTER,
  resolveIntentExtractionLanguageAdapter,
} from "./executiveIntentExtractionRules.ts";
import {
  resolveExecutiveIntentStateResult,
} from "./executiveIntentStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WS = "ws-example-001";

function buildRequest(text: string, overrides: Partial<Parameters<typeof extractExecutiveIntent>[0]> = {}) {
  return Object.freeze({
    text,
    workspaceId: WS,
    owner: "executive-owner",
    languageCode: "en",
    generatedAt: FIXED_TIME,
    ...overrides,
  });
}

test("extracts single financial intent from canonical example", () => {
  const result = extractExecutiveIntentExample("financial-goal", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.ok(result.primaryIntent);
  assert.equal(result.primaryIntent.metadata.category, "financial");
  assert.equal(result.goals[0]?.actionVerb, "increase");
  assert.ok(result.targets[0]?.valueLabel?.includes("20"));
  assert.equal(result.timeReferences.some((entry) => entry.phrase === "next year"), true);
  assert.equal(validateExtractionResult(result!).valid, true);
});

test("extracts growth operational technology and compliance objectives", () => {
  for (const exampleId of [
    "growth-goal",
    "operational-improvement",
    "technology-modernization",
    "compliance",
    "cost-reduction",
  ]) {
    const result = extractExecutiveIntentExample(exampleId, WS, "executive-owner", FIXED_TIME);
    assert.ok(result, exampleId);
    assert.ok(result!.primaryIntent, exampleId);
    assert.equal(validateExecutiveIntentShape(result!.primaryIntent!).valid, true, exampleId);
  }
});

test("extracts risk reduction with constraints", () => {
  const result = extractExecutiveIntent(buildRequest("Mitigate supply chain risk exposure without increasing cost."));
  assert.ok(result.primaryIntent);
  assert.equal(result.primaryIntent!.metadata.category, "risk_reduction");
  assert.ok(result.constraints.length > 0);
  assert.ok(result.diagnostics.codes.includes("successful_extraction"));
});

test("extracts hiring intent with time reference", () => {
  const result = extractExecutiveIntent(buildRequest("Hire 50 engineers for the project by Q3."));
  assert.ok(result.primaryIntent);
  assert.equal(result.goals[0]?.actionVerb, "hire");
  assert.ok(result.timeReferences.some((entry) => entry.normalizedLabel === "Q3"));
});

test("detects multiple intents", () => {
  const result = extractExecutiveIntent(buildRequest("Increase profit by 10%. Reduce cost by 5%."));
  assert.equal(result.intents.length, 2);
  assert.ok(result.diagnostics.codes.includes("multiple_intents_found"));
});

test("fails empty input", () => {
  const result = extractExecutiveIntent(buildRequest("   "));
  assert.equal(result.status, "failed");
  assert.ok(result.diagnostics.codes.includes("empty_input"));
  assert.equal(result.primaryIntent, null);
});

test("fails incomplete request missing target", () => {
  const result = extractExecutiveIntent(buildRequest("Increase by 20%"));
  assert.equal(result.status, "failed");
  assert.ok(result.diagnostics.codes.includes("target_not_specified"));
});

test("extracts explicit priority when stated", () => {
  const result = extractExecutiveIntent(buildRequest("High priority: reduce cost by 5% next year."));
  assert.ok(result.primaryIntent);
  assert.equal(result.primaryIntent!.metadata.priority, "high");
  assert.equal(result.metadata.explicitPriority, true);
});

test("extracts assumptions and evidence explicitly", () => {
  const assumptionText = "Increase profit by 10% next year assuming market stability.";
  const evidenceText = "Reduce cost by 5% based on Q4 audit report.";
  assert.ok(extractIntentAssumptions(assumptionText).length > 0);
  assert.ok(extractIntentEvidence(evidenceText).length > 0);
});

test("extracts actors when explicitly named", () => {
  const actors = extractIntentActors("CEO approved increase profit by 10%.");
  assert.ok(actors.some((entry) => entry.role === "CEO"));
});

test("supports multilingual adapters without English-only hardcoding", () => {
  assert.equal(resolveIntentExtractionLanguageAdapter("es").languageCode, "es");
  assert.equal(resolveIntentExtractionLanguageAdapter("en").languageCode, "en");
  assert.notEqual(
    INTENT_EXTRACTION_SPANISH_LANGUAGE_ADAPTER.actionVerbs.length,
    0
  );
  const spanish = extractExecutiveIntent(
    buildRequest("Aumentar beneficios de la empresa en 20% el proximo ano.", { languageCode: "es" })
  );
  assert.ok(spanish.primaryIntent);
  assert.equal(spanish.metadata.languageCode, "es");
});

test("produces deterministic extraction output", () => {
  const request = buildRequest("Increase company profit by 20% next year.");
  const first = extractExecutiveIntent(request);
  const second = extractExecutiveIntent(request);
  assert.equal(first.extractionId, second.extractionId);
  assert.equal(first.primaryIntent?.intentId, second.primaryIntent?.intentId);
  assert.deepEqual(
    first.diagnostics.codes,
    second.diagnostics.codes
  );
});

test("batch extraction aggregates results", () => {
  const batch = extractExecutiveIntentBatch(
    Object.freeze([
      buildRequest("Increase profit by 10% next year."),
      buildRequest(""),
    ])
  );
  assert.equal(batch.results.length, 2);
  assert.equal(batch.successCount + batch.partialCount + batch.failedCount, 2);
});

test("validates extraction result against APP-3:1 contract", () => {
  const result = extractExecutiveIntent(buildRequest("Increase company profit by 20% next year."));
  const validation = validateExtractionResult(result);
  assert.equal(validation.valid, true);
  assert.equal(result.contractVersion, EXECUTIVE_INTENT_CONTRACT_VERSION);
  assert.equal(result.engineVersion, "APP-3/4");
});

test("regression: extracted intent passes APP-3:2 state resolution", () => {
  const result = extractExecutiveIntent(buildRequest("Increase company profit by 20% next year."));
  assert.ok(result.primaryIntent);
  const state = resolveExecutiveIntentStateResult(
    Object.freeze({
      intent: result.primaryIntent,
      intentId: result.primaryIntent!.intentId,
      workspaceId: result.primaryIntent!.workspaceId,
      evaluatedAt: FIXED_TIME,
      proposedLifecycleTransition: null,
    })
  );
  assert.equal(state.structuralHealth, "healthy");
  assert.equal(state.state.stateCategory, "draft");
});

test("does not mutate input request text", () => {
  const text = "Increase company profit by 20% next year.";
  const before = text;
  extractExecutiveIntent(buildRequest(text));
  assert.equal(text, before);
});

test("declares diagnostics vocabulary and engine tags", () => {
  assert.equal(INTENT_EXTRACTION_DIAGNOSTIC_CODES.length, 16);
  assert.equal(isIntentExtractionDiagnosticCode("successful_extraction"), true);
  assert.ok(EXECUTIVE_INTENT_EXTRACTION_ENGINE_TAGS.includes("[APP3_4]"));
  assert.equal(EXECUTIVE_INTENT_EXTRACTION_ENGINE_RULES.noInference, true);
});

test("covers canonical example catalog", () => {
  assert.ok(INTENT_EXTRACTION_CANONICAL_EXAMPLES.length >= 10);
  assert.ok(getIntentExtractionCanonicalExample("financial-goal"));
  assert.equal(getIntentExtractionCanonicalExample("missing"), null);
});

test("extracts component helpers independently", () => {
  const text = "Increase profit by 20% next year.";
  assert.ok(extractIntentTargets(text).length > 0);
  assert.ok(extractIntentTimeReferences(text).length > 0);
});

test("ExecutiveIntentExtractionEngine facade exposes public APIs", () => {
  assert.equal(typeof ExecutiveIntentExtractionEngine.extractExecutiveIntent, "function");
  assert.equal(ExecutiveIntentExtractionEngine.version, "APP-3/4");
});

test("maintains APP-3:1 contract shape compatibility", () => {
  const result = extractExecutiveIntent(buildRequest("Increase company profit by 20% next year."));
  assert.ok(result.primaryIntent);
  assert.equal(validateExecutiveIntentShape(result.primaryIntent!).valid, true);
  assert.equal(result.primaryIntent!.readOnly, true);
});
