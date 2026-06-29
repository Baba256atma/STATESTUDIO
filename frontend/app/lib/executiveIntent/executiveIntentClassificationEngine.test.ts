import assert from "node:assert/strict";
import test from "node:test";

import { validateExecutiveIntentShape } from "./executiveIntentContract.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import {
  INTENT_CLASSIFICATION_DIAGNOSTIC_CODES,
  isIntentClassificationDiagnosticCode,
} from "./executiveIntentClassificationDiagnostics.ts";
import {
  ExecutiveIntentClassificationEngine,
  buildClassificationExample,
  buildClassificationProbe,
  classifyExecutiveIntent,
  classifySemanticModel,
  resolveClassificationFlags,
  resolvePrimaryClassification,
  resolveSecondaryClassifications,
  validateClassification,
} from "./executiveIntentClassificationEngine.ts";
import {
  EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_RULES,
  EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_TAGS,
} from "./executiveIntentClassificationEngine.ts";
import {
  INTENT_CLASSIFICATION_CANONICAL_EXAMPLES,
  getIntentClassificationCanonicalExample,
} from "./executiveIntentClassificationExamples.ts";
import {
  resolveDimensionClass,
  resolveKeywordClasses,
} from "./executiveIntentClassificationRules.ts";
import {
  INTENT_TAXONOMY_CLASS_KEYS,
  sortIntentClasses,
} from "./executiveIntentClassificationTaxonomy.ts";
import type { ExecutiveIntentSemanticModel } from "./executiveIntentSemanticTypes.ts";
import {
  buildExecutiveIntentSemanticModel,
  buildExecutiveIntentSemanticModelFromExample,
  buildExecutiveIntentSemanticModelProbeExample,
} from "./executiveIntentSemanticModel.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WS = "ws-example-001";

function classifyFromText(text: string) {
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
  return classifyExecutiveIntent(semantic.model, FIXED_TIME);
}

function keywordModel(
  label: string,
  extras: Readonly<{ target?: string; known?: readonly string[] }> = Object.freeze({})
): ExecutiveIntentSemanticModel {
  return Object.freeze({
    primaryGoal: Object.freeze({
      goalId: "goal-1",
      intentId: null,
      label,
      actionType: "increase" as const,
      actionVerb: "increase",
      rawPhrase: label,
      readOnly: true as const,
    }),
    targetEntity: extras.target
      ? Object.freeze({
          targetId: "target-1",
          entityLabel: extras.target,
          entityType: null,
          readOnly: true as const,
        })
      : null,
    desiredFutureState: null,
    knownInformation: extras.known ?? Object.freeze([]),
    businessObjects: Object.freeze([]),
  }) as ExecutiveIntentSemanticModel;
}

function classifyFromSemanticExample(exampleId: string) {
  const semantic = buildExecutiveIntentSemanticModelFromExample(
    exampleId,
    WS,
    "executive-owner",
    FIXED_TIME
  );
  assert.ok(semantic, exampleId);
  return classifyExecutiveIntent(semantic!.model, FIXED_TIME);
}

test("classifies financial increase profit intent", () => {
  const result = buildClassificationExample("increase-profit", WS, "executive-owner", FIXED_TIME);
  assert.ok(result);
  assert.equal(result!.primaryClass?.classId, "financial");
  assert.equal(result!.flags.multiClass, false);
  assert.equal(result!.readOnly, true);
  assert.equal(validateClassification(result!).valid, true);
});

test("classifies reduce cost as financial", () => {
  const result = buildClassificationExample("reduce-cost", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.primaryClass?.classId, "financial");
});

test("classifies market expansion as growth with strategic secondary", () => {
  const result = buildClassificationExample("expand-market", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.primaryClass?.classId, "growth");
  assert.ok(result?.secondaryClasses.some((entry) => entry.classId === "strategic"));
  assert.equal(result?.flags.compositeIntent, true);
});

test("classifies digital transformation as transformation with technology secondary", () => {
  const result = buildClassificationExample("digital-transformation", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.primaryClass?.classId, "transformation");
  assert.ok(result?.secondaryClasses.some((entry) => entry.classId === "technology"));
});

test("classifies compliance initiative", () => {
  const result = buildClassificationExample("compliance-initiative", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.primaryClass?.classId, "compliance");
});

test("classifies customer experience objective", () => {
  const result = buildClassificationExample("customer-experience", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.primaryClass?.classId, "customer");
});

test("classifies operational efficiency objective", () => {
  const result = buildClassificationExample("operational-efficiency", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.primaryClass?.classId, "operational");
});

test("classifies risk reduction objective", () => {
  const result = classifyFromSemanticExample("reduce-operational-risk");
  assert.equal(result.primaryClass?.classId, "risk");
});

test("classifies innovation program", () => {
  const result = buildClassificationExample("innovation-program", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.primaryClass?.classId, "innovation");
});

test("classifies hiring initiative with resource secondary", () => {
  const result = buildClassificationExample("hiring-initiative", WS, "executive-owner", FIXED_TIME);
  assert.equal(result?.primaryClass?.classId, "people");
  assert.ok(result?.secondaryClasses.some((entry) => entry.classId === "resource"));
});

test("classifies technology modernization objective", () => {
  const result = classifyFromSemanticExample("modernize-technology");
  assert.equal(result.primaryClass?.classId, "transformation");
});

test("supports governance classification from explicit governance language", () => {
  const result = classifyFromText("Improve board governance oversight without increasing headcount.");
  assert.ok(result.allClasses.includes("governance"));
});

test("maps sales marketing and sustainability taxonomy dimensions", () => {
  assert.equal(resolveDimensionClass("sales"), "sales");
  assert.equal(resolveDimensionClass("marketing"), "marketing");
  assert.equal(resolveDimensionClass("supply_chain"), "supply_chain");
});

test("supports sales and marketing keyword classification rules", () => {
  const salesKeywords = resolveKeywordClasses(
    keywordModel("Increase sales pipeline conversion by 10%")
  );
  const marketingKeywords = resolveKeywordClasses(
    keywordModel("Improve marketing brand awareness this year")
  );
  assert.ok(salesKeywords.includes("sales"));
  assert.ok(marketingKeywords.includes("marketing"));
});

test("supports sustainability keyword classification rules", () => {
  const keywords = resolveKeywordClasses(
    keywordModel("Reduce carbon emissions to improve sustainability by 20%", {
      known: Object.freeze(["dimension:risk"]),
    })
  );
  assert.ok(keywords.includes("sustainability"));
});

test("supports supply chain classification", () => {
  const result = classifyFromText("Mitigate supply chain risk exposure without increasing cost.");
  assert.ok(result.allClasses.includes("supply_chain"));
});

test("detects composite and hybrid multi-label intents", () => {
  const result = classifyFromText("Increase profit by 10%. Expand market share by 15%.");
  assert.equal(result.flags.multiClass, true);
  assert.equal(result.flags.compositeIntent, true);
  assert.equal(result.flags.hybridIntent, true);
  assert.ok(result.diagnostics.some((entry) => entry.code === "multi_label_classification"));
  assert.ok(result.diagnostics.some((entry) => entry.code === "composite_intent_detected"));
});

test("handles unknown classification for incomplete objective", () => {
  const result = buildClassificationExample("unknown-classification", WS, "executive-owner", FIXED_TIME);
  assert.ok(result?.flags.customClassification || result?.status === "partial" || result?.status === "unknown");
});

test("returns deterministic class ordering", () => {
  const first = buildClassificationProbe(FIXED_TIME);
  const second = buildClassificationProbe(FIXED_TIME);
  assert.deepEqual(first.allClasses, second.allClasses);
  assert.equal(first.classificationId, second.classificationId);
  assert.deepEqual(
    sortIntentClasses(first.allClasses),
    first.allClasses
  );
});

test("does not mutate semantic model input", () => {
  const semantic = buildExecutiveIntentSemanticModelProbeExample(FIXED_TIME);
  const before = JSON.stringify(semantic.model);
  classifySemanticModel(semantic.model, FIXED_TIME);
  assert.equal(JSON.stringify(semantic.model), before);
});

test("declares taxonomy classes and diagnostics vocabulary", () => {
  assert.equal(INTENT_TAXONOMY_CLASS_KEYS.length, 18);
  assert.equal(INTENT_CLASSIFICATION_DIAGNOSTIC_CODES.length, 13);
  assert.equal(isIntentClassificationDiagnosticCode("classification_success"), true);
  assert.ok(EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_TAGS.includes("[APP3_6]"));
  assert.equal(EXECUTIVE_INTENT_CLASSIFICATION_ENGINE_RULES.noConfidence, true);
});

test("resolvePrimaryClassification and resolveSecondaryClassifications are consistent", () => {
  const semantic = buildExecutiveIntentSemanticModelProbeExample(FIXED_TIME);
  const primary = resolvePrimaryClassification(semantic.model);
  const secondary = resolveSecondaryClassifications(semantic.model, primary);
  const result = classifyExecutiveIntent(semantic.model, FIXED_TIME);
  assert.equal(result.primaryClass?.classId, primary?.classId);
  assert.deepEqual(
    result.secondaryClasses.map((entry) => entry.classId),
    secondary.map((entry) => entry.classId)
  );
});

test("resolveClassificationFlags marks read-only deterministic outputs", () => {
  const result = buildClassificationProbe(FIXED_TIME);
  assert.equal(result.flags.readOnly, true);
  assert.equal(result.flags.deterministic, true);
  assert.equal(result.flags.futureCompatible, true);
});

test("regression: APP-3:5 semantic model feeds classification", () => {
  const semantic = buildExecutiveIntentSemanticModelProbeExample(FIXED_TIME);
  const result = classifyExecutiveIntent(semantic.model, FIXED_TIME);
  assert.equal(result.metadata.semanticModelVersion, "APP-3/5");
  assert.equal(result.semanticModelId, semantic.model.modelId);
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
  const semantic = buildExecutiveIntentSemanticModel(extraction, FIXED_TIME);
  const result = classifyExecutiveIntent(semantic.model, FIXED_TIME);
  assert.equal(extraction.engineVersion, "APP-3/4");
  assert.equal(result.primaryClass?.classId, "financial");
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

test("regression: APP-3:2 state resolution on extracted intent", () => {
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

test("covers classification canonical example catalog", () => {
  assert.ok(INTENT_CLASSIFICATION_CANONICAL_EXAMPLES.length >= 12);
  assert.ok(getIntentClassificationCanonicalExample("increase-profit"));
});

test("ExecutiveIntentClassificationEngine exposes public APIs", () => {
  assert.equal(ExecutiveIntentClassificationEngine.version, "APP-3/6");
  assert.equal(typeof ExecutiveIntentClassificationEngine.classifyExecutiveIntent, "function");
  assert.equal(typeof ExecutiveIntentClassificationEngine.buildClassificationProbe, "function");
});
