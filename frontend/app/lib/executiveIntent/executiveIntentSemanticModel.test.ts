import assert from "node:assert/strict";
import test from "node:test";

import { validateExecutiveIntentShape } from "./executiveIntentContract.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import {
  INTENT_SEMANTIC_DIAGNOSTIC_CODES,
  isIntentSemanticDiagnosticCode,
} from "./executiveIntentSemanticDiagnostics.ts";
import {
  INTENT_SEMANTIC_CANONICAL_EXAMPLES,
  getIntentSemanticCanonicalExample,
} from "./executiveIntentSemanticExamples.ts";
import {
  SEMANTIC_ACTION_TYPE_KEYS,
  SEMANTIC_BUSINESS_DIMENSION_KEYS,
  mapActionVerbToActionType,
} from "./executiveIntentSemanticRules.ts";
import {
  ExecutiveIntentSemanticModelEngine,
  buildExecutiveIntentSemanticModel,
  buildExecutiveIntentSemanticModelFromExample,
  buildExecutiveIntentSemanticModelProbeExample,
  normalizeAssumptions,
  normalizeBusinessDimension,
  normalizeConstraints,
  normalizeExecutiveIntent,
  normalizeTimeHorizon,
  resolveSemanticUnknowns,
  validateSemanticModel,
} from "./executiveIntentSemanticModel.ts";
import {
  EXECUTIVE_INTENT_SEMANTIC_MODEL_RULES,
  EXECUTIVE_INTENT_SEMANTIC_MODEL_TAGS,
} from "./executiveIntentSemanticModel.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WS = "ws-example-001";

function extractAndNormalize(text: string, languageCode: string = "en") {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text,
      workspaceId: WS,
      owner: "executive-owner",
      languageCode,
      generatedAt: FIXED_TIME,
    })
  );
  return buildExecutiveIntentSemanticModel(extraction, FIXED_TIME);
}

test("builds semantic model for financial increase profit objective", () => {
  const result = buildExecutiveIntentSemanticModelFromExample("increase-profit", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.model.businessDimension, "financial");
  assert.equal(result!.model.actionType, "increase");
  assert.equal(result!.model.primaryGoal?.actionVerb, "increase");
  assert.ok(result!.model.targetMeasure?.explicitText?.includes("20"));
  assert.equal(result!.model.readOnly, true);
  assert.equal(validateSemanticModel(result!.model).valid, true);
});

test("normalizes reduce costs and operational risk objectives", () => {
  const costs = buildExecutiveIntentSemanticModelFromExample("reduce-costs", WS, "executive-owner", FIXED_TIME);
  const risk = buildExecutiveIntentSemanticModelFromExample("reduce-operational-risk", WS, "executive-owner", FIXED_TIME);
  assert.equal(costs?.model.actionType, "reduce");
  assert.equal(costs?.model.businessDimension, "financial");
  assert.equal(risk?.model.businessDimension, "risk");
  assert.equal(risk?.model.actionType, "protect");
});

test("normalizes growth market expansion and technology modernization", () => {
  const expand = buildExecutiveIntentSemanticModelFromExample("expand-new-market", WS, "executive-owner", FIXED_TIME);
  const tech = buildExecutiveIntentSemanticModelFromExample("modernize-technology", WS, "executive-owner", FIXED_TIME);
  assert.equal(expand?.model.businessDimension, "strategy");
  assert.equal(expand?.model.actionType, "expand");
  assert.equal(tech?.model.businessDimension, "technology");
  assert.equal(tech?.model.actionType, "transform");
});

test("normalizes hiring objective into people dimension", () => {
  const result = buildExecutiveIntentSemanticModelFromExample("hire-engineers", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.model.businessDimension, "people");
  assert.equal(result?.model.actionType, "create");
});

test("normalizes customer satisfaction objective", () => {
  const result = buildExecutiveIntentSemanticModelFromExample(
    "improve-customer-satisfaction",
    WS,
    "executive-owner",
    FIXED_TIME
  );
  assert.ok(result?.model.primaryGoal);
  assert.equal(result?.model.businessDimension, "customer");
  assert.equal(result?.model.actionType, "optimize");
});

test("detects multiple goals in semantic flags", () => {
  const result = buildExecutiveIntentSemanticModelFromExample("multiple-goals", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.model.flags.multipleGoals, true);
  assert.ok(result?.model.goals.length >= 2);
  assert.ok(result?.diagnostics.some((entry) => entry.code === "semantic_multiple_goals"));
});

test("represents incomplete objective with unknowns", () => {
  const result = buildExecutiveIntentSemanticModelFromExample(
    "incomplete-objective",
    WS,
    "executive-owner",
    FIXED_TIME
  );
  assert.equal(result?.status, "incomplete");
  assert.ok(result?.model.unknowns.length > 0);
  assert.equal(result?.model.flags.incompleteObjective, true);
});

test("normalizes constraints and assumptions from explicit markers", () => {
  const result = extractAndNormalize(
    "Increase profit by 10% next year assuming stable demand without increasing headcount."
  );
  assert.ok(result.model.constraints.length > 0);
  assert.ok(result.model.assumptions.length > 0);
  assert.equal(result.model.flags.hasConstraints, true);
  assert.equal(result.model.flags.hasAssumptions, true);
});

test("normalizes time horizon from explicit references", () => {
  const result = extractAndNormalize("Increase company profit by 20% next year.");
  assert.equal(result.model.timeHorizon.kind, "long_term");
  assert.notEqual(result.model.timeHorizon.label, "Unknown");
});

test("resolveSemanticUnknowns lists missing explicit information", () => {
  const result = extractAndNormalize("Increase company profit by 20% next year.");
  assert.ok(result.model.unknowns.some((entry) => entry.kind === "actor"));
  assert.ok(result.model.unknowns.some((entry) => entry.kind === "constraint"));
});

test("produces deterministic semantic normalization", () => {
  const first = buildExecutiveIntentSemanticModelProbeExample(FIXED_TIME);
  const second = buildExecutiveIntentSemanticModelProbeExample(FIXED_TIME);
  assert.equal(first.modelId, second.modelId);
  assert.equal(first.model.businessDimension, second.model.businessDimension);
  assert.deepEqual(
    first.model.diagnostics.map((entry) => entry.code),
    second.model.diagnostics.map((entry) => entry.code)
  );
});

test("does not mutate extraction input", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Increase company profit by 20% next year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  const before = JSON.stringify(extraction);
  normalizeExecutiveIntent(extraction, FIXED_TIME);
  assert.equal(JSON.stringify(extraction), before);
});

test("declares business dimensions and action types", () => {
  assert.equal(SEMANTIC_BUSINESS_DIMENSION_KEYS.length, 13);
  assert.equal(SEMANTIC_ACTION_TYPE_KEYS.length, 13);
  assert.equal(mapActionVerbToActionType("modernize"), "transform");
  assert.equal(INTENT_SEMANTIC_DIAGNOSTIC_CODES.length, 15);
  assert.equal(isIntentSemanticDiagnosticCode("semantic_model_ready"), true);
});

test("declares semantic flags on model", () => {
  const result = buildExecutiveIntentSemanticModelProbeExample(FIXED_TIME);
  assert.equal(result.model.flags.futureCompatible, true);
  assert.equal(result.model.flags.readOnly, true);
  assert.equal(typeof result.model.flags.requiresClarification, "boolean");
  assert.ok(EXECUTIVE_INTENT_SEMANTIC_MODEL_TAGS.includes("[APP3_5]"));
  assert.equal(EXECUTIVE_INTENT_SEMANTIC_MODEL_RULES.noInference, true);
});

test("regression: APP-3:4 extraction feeds semantic model", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Increase company profit by 20% next year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  assert.equal(extraction.engineVersion, "APP-3/4");
  const semantic = buildExecutiveIntentSemanticModel(extraction, FIXED_TIME);
  assert.equal(semantic.model.versionMetadata.extractionEngineVersion, "APP-3/4");
  assert.ok(semantic.model.primaryGoal);
});

test("regression: APP-3:1 contract shape preserved through pipeline", () => {
  const result = buildExecutiveIntentSemanticModelProbeExample(FIXED_TIME);
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
  assert.equal(result.model.workspaceId, WS);
});

test("regression: APP-3:2 state resolution works on extracted intent", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Increase company profit by 20% next year.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  const state = resolveExecutiveIntentStateResult(
    Object.freeze({
      intent: extraction.primaryIntent,
      intentId: extraction.primaryIntent!.intentId,
      workspaceId: WS,
      evaluatedAt: FIXED_TIME,
      proposedLifecycleTransition: null,
    })
  );
  assert.equal(state.structuralHealth, "healthy");
});

test("covers semantic canonical example catalog", () => {
  assert.ok(INTENT_SEMANTIC_CANONICAL_EXAMPLES.length >= 10);
  assert.ok(getIntentSemanticCanonicalExample("increase-profit"));
});

test("ExecutiveIntentSemanticModelEngine exposes public APIs", () => {
  assert.equal(ExecutiveIntentSemanticModelEngine.version, "APP-3/5");
  assert.equal(typeof ExecutiveIntentSemanticModelEngine.normalizeConstraints, "function");
  assert.equal(typeof ExecutiveIntentSemanticModelEngine.buildSemanticSummary, "function");
});

test("normalize helper functions produce read-only outputs", () => {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text: "Mitigate supply chain risk without increasing cost.",
      workspaceId: WS,
      owner: "executive-owner",
      generatedAt: FIXED_TIME,
    })
  );
  assert.ok(normalizeConstraints(extraction.constraints).every((entry) => entry.readOnly));
  assert.ok(normalizeAssumptions(extraction.assumptions).every((entry) => entry.readOnly));
  assert.equal(
    normalizeTimeHorizon(extraction.timeReferences[0] ?? null, FIXED_TIME).readOnly,
    true
  );
  assert.equal(
    normalizeBusinessDimension(extraction.primaryIntent, extraction.targets[0] ?? null),
    "risk"
  );
});
