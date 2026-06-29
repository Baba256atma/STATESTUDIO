import assert from "node:assert/strict";
import test from "node:test";

import {
  INTENT_CONTEXT_DIAGNOSTIC_CODES,
  isIntentContextDiagnosticCode,
} from "./executiveIntentContextDiagnostics.ts";
import {
  INTENT_CONTEXT_CANONICAL_EXAMPLES,
  getIntentContextCanonicalExample,
} from "./executiveIntentContextExamples.ts";
import { collectContextRulesApplied } from "./executiveIntentContextRules.ts";
import {
  ExecutiveIntentContextEngine,
  buildBusinessContext,
  buildConstraintContext,
  buildContextFromExample,
  buildContextProbe,
  buildContextSummary,
  buildExecutiveIntentContext,
  buildObjectContext,
  buildRelationshipContext,
  buildStakeholderContext,
  buildWorkspaceContext,
  createExecutiveIntentContextAnalysisInput,
  validateContext,
} from "./executiveIntentContextEngine.ts";
import {
  EXECUTIVE_INTENT_CONTEXT_ENGINE_RULES,
  EXECUTIVE_INTENT_CONTEXT_ENGINE_TAGS,
} from "./executiveIntentContextEngine.ts";
import { extractExecutiveIntent } from "./executiveIntentExtractionEngine.ts";
import { runExecutiveIntentPlatform } from "./executiveIntentPlatformRunner.ts";
import { runExecutiveIntentPlatformFreezeRegression } from "./executiveIntentPlatformFreezeRegression.ts";
import { buildExecutiveIntentSemanticModel } from "./executiveIntentSemanticModel.ts";
import { resolveExecutiveIntentStateResult } from "./executiveIntentStateEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WS = "ws-context-test-001";
const OWNER = "executive-context-owner";

function buildAnalysisInput(text: string) {
  const extraction = extractExecutiveIntent(
    Object.freeze({
      text,
      workspaceId: WS,
      owner: OWNER,
      languageCode: "en",
      generatedAt: FIXED_TIME,
    })
  );
  const semanticModel = buildExecutiveIntentSemanticModel(extraction, FIXED_TIME).model;
  const intent = extraction.primaryIntent;
  const state = intent
    ? resolveExecutiveIntentStateResult(
        Object.freeze({
          intent,
          intentId: intent.intentId,
          workspaceId: WS,
          evaluatedAt: FIXED_TIME,
          proposedLifecycleTransition: null,
        })
      )
    : null;
  return createExecutiveIntentContextAnalysisInput({
    intent,
    state,
    semanticModel,
    timestamp: FIXED_TIME,
  });
}

test("builds context for financial increase profit objective", () => {
  const context = buildExecutiveIntentContext(
    buildAnalysisInput("Increase company profit by 20% next year.")
  );
  assert.equal(context.business.businessDomain, "financial");
  assert.equal(context.flags.businessReady, true);
  assert.equal(context.flags.workspaceReady, true);
  assert.equal(context.readOnly, true);
  assert.equal(validateContext(context).valid, true);
  assert.ok(context.diagnostics.some((entry) => entry.code === "context_ready"));
});

test("builds workspace context section", () => {
  const input = buildAnalysisInput("Increase company profit by 20% next year.");
  const scope = "workspace" as const;
  const workspace = buildWorkspaceContext(input.intent, input.state, scope);
  assert.equal(workspace.workspaceId, WS);
  assert.equal(workspace.scope, "workspace");
  assert.equal(workspace.readOnly, true);
});

test("builds business context section", () => {
  const input = buildAnalysisInput("Reduce operating cost by 8% next year.");
  const business = buildBusinessContext(input.intent, input.semanticModel);
  assert.equal(business.businessDomain, "financial");
  assert.equal(business.actionType, "reduce");
  assert.equal(business.readOnly, true);
});

test("builds object context from semantic targets and references", () => {
  const input = buildAnalysisInput("Increase company profit by 20% next year.");
  const objects = buildObjectContext(input.intent, input.semanticModel);
  assert.ok(objects.length >= 0);
  assert.equal(objects.every((entry) => entry.readOnly === true), true);
});

test("builds relationship context from intent relations", () => {
  const input = buildAnalysisInput("Increase company profit by 20% next year.");
  const relationships = buildRelationshipContext(input.intent);
  assert.equal(Array.isArray(relationships), true);
  assert.equal(relationships.every((entry) => entry.readOnly === true), true);
});

test("builds stakeholder context from owner and actors", () => {
  const input = buildAnalysisInput("Increase company profit by 20% next year.");
  const stakeholders = buildStakeholderContext(input.intent, input.semanticModel);
  assert.ok(stakeholders.some((entry) => entry.stakeholderType === "owner"));
});

test("builds constraint context from explicit constraints", () => {
  const input = buildAnalysisInput(
    "Increase profit by 20% next year assuming stable market conditions within budget constraints."
  );
  const constraints = buildConstraintContext(input.intent, input.semanticModel);
  assert.equal(constraints.every((entry) => entry.readOnly === true), true);
});

test("builds technology initiative context", () => {
  const context = buildContextFromExample("technology-initiative", WS, OWNER, FIXED_TIME);
  assert.ok(context);
  assert.equal(context!.business.businessDomain, "technology");
  assert.equal(context!.business.actionType, "transform");
});

test("builds cross-department objective context", () => {
  const context = buildContextFromExample("cross-department-objective", WS, OWNER, FIXED_TIME);
  assert.ok(context);
  assert.equal(context!.scope, "cross_department");
});

test("builds minimal context with incomplete diagnostics", () => {
  const context = buildContextFromExample("minimal-context", WS, OWNER, FIXED_TIME);
  assert.ok(context);
  assert.equal(context!.flags.incomplete, true);
  assert.ok(context!.diagnostics.some((entry) => entry.code === "context_incomplete"));
});

test("builds unknown context when inputs are missing", () => {
  const context = buildContextFromExample("unknown-context", WS, OWNER, FIXED_TIME);
  assert.ok(context);
  assert.equal(context!.flags.unknown, true);
  assert.ok(context!.diagnostics.some((entry) => entry.code === "context_intent_missing"));
  assert.ok(context!.diagnostics.some((entry) => entry.code === "unknown_context"));
});

test("buildContextSummary aligns with context sections", () => {
  const context = buildExecutiveIntentContext(
    buildAnalysisInput("Improve cash flow by 12% next year.")
  );
  const summary = buildContextSummary(context);
  assert.equal(summary.objectCount, context.objects.length);
  assert.equal(summary.knownCount, context.knownContext.length);
  assert.equal(summary.unknownCount, context.unknownContext.length);
  assert.equal(summary.readOnly, true);
});

test("produces deterministic output for identical input", () => {
  const input = buildAnalysisInput("Increase company profit by 20% next year.");
  const first = buildExecutiveIntentContext(input);
  const second = buildExecutiveIntentContext(input);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

test("context result is read-only and immutable", () => {
  const context = buildContextProbe(FIXED_TIME);
  assert.equal(Object.isFrozen(context), true);
  assert.equal(Object.isFrozen(context.objects), true);
  assert.equal(Object.isFrozen(context.diagnostics), true);
  assert.equal(Object.isFrozen(context.metadata), true);
});

test("declares context diagnostics vocabulary", () => {
  assert.equal(INTENT_CONTEXT_DIAGNOSTIC_CODES.length, 16);
  assert.equal(isIntentContextDiagnosticCode("context_ready"), true);
  assert.equal(isIntentContextDiagnosticCode("workspace_context_ready"), true);
  assert.equal(isIntentContextDiagnosticCode("not_a_code"), false);
});

test("declares context engine tags and rules", () => {
  assert.ok(EXECUTIVE_INTENT_CONTEXT_ENGINE_TAGS.includes("[APP3_3_1]"));
  assert.ok(EXECUTIVE_INTENT_CONTEXT_ENGINE_TAGS.includes("[MAINTENANCE_RELEASE]"));
  assert.ok(EXECUTIVE_INTENT_CONTEXT_ENGINE_TAGS.includes("[NON_BREAKING]"));
  assert.equal(EXECUTIVE_INTENT_CONTEXT_ENGINE_RULES.noReasoning, true);
  assert.equal(EXECUTIVE_INTENT_CONTEXT_ENGINE_RULES.noRecommendations, true);
  assert.equal(EXECUTIVE_INTENT_CONTEXT_ENGINE_RULES.readOnly, true);
});

test("covers context canonical example catalog", () => {
  assert.equal(INTENT_CONTEXT_CANONICAL_EXAMPLES.length, 8);
  for (const example of INTENT_CONTEXT_CANONICAL_EXAMPLES) {
    assert.equal(getIntentContextCanonicalExample(example.exampleId)?.exampleId, example.exampleId);
  }
});

test("ExecutiveIntentContextEngine exposes public APIs", () => {
  assert.equal(typeof ExecutiveIntentContextEngine.buildExecutiveIntentContext, "function");
  assert.equal(typeof ExecutiveIntentContextEngine.buildWorkspaceContext, "function");
  assert.equal(typeof ExecutiveIntentContextEngine.buildBusinessContext, "function");
  assert.equal(typeof ExecutiveIntentContextEngine.buildObjectContext, "function");
  assert.equal(typeof ExecutiveIntentContextEngine.buildRelationshipContext, "function");
  assert.equal(typeof ExecutiveIntentContextEngine.buildConstraintContext, "function");
  assert.equal(typeof ExecutiveIntentContextEngine.buildStakeholderContext, "function");
  assert.equal(typeof ExecutiveIntentContextEngine.validateContext, "function");
  assert.equal(typeof ExecutiveIntentContextEngine.buildContextSummary, "function");
  assert.equal(typeof ExecutiveIntentContextEngine.buildContextProbe, "function");
  assert.equal(ExecutiveIntentContextEngine.version, "APP-3.3.1");
});

test("context rules remain explicit-only without inference", () => {
  const rules = collectContextRulesApplied();
  assert.ok(rules.includes("explicit_intent_metadata_only"));
  assert.ok(rules.includes("explicit_semantic_model_only"));
});

test("regression: APP-3:15 platform freeze remains certified", () => {
  const platform = runExecutiveIntentPlatform(FIXED_TIME);
  assert.equal(platform.certified, true);
  assert.equal(platform.released, true);
  assert.equal(platform.platformStatus, "FROZEN");
});

test("regression: APP-3:1 through APP-3:14 freeze regression still passes", () => {
  const regression = runExecutiveIntentPlatformFreezeRegression(FIXED_TIME);
  assert.equal(regression.certified, true);
  assert.equal(regression.status, "PASS");
  assert.equal(regression.failedPhases.length, 0);
  assert.equal(regression.architectureDriftDetected, false);
});

test("validateContext rejects inconsistent summary counts", () => {
  const probe = buildContextProbe(FIXED_TIME);
  const invalid = Object.freeze({
    ...probe,
    summary: Object.freeze({
      ...probe.summary,
      objectCount: probe.objects.length + 1,
    }),
  });
  const validation = validateContext(invalid as typeof probe);
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.includes("object count")));
});

test("context engine includes known and unknown context sections", () => {
  const context = buildExecutiveIntentContext(
    buildAnalysisInput("Increase company profit by 20% next year.")
  );
  assert.ok(context.knownContext.length > 0);
  assert.equal(typeof context.knownContext[0], "string");
  assert.equal(Array.isArray(context.unknownContext), true);
});

test("builds multi-object context example", () => {
  const context = buildContextFromExample("multi-object-context", WS, OWNER, FIXED_TIME);
  assert.ok(context);
  assert.equal(context!.business.businessDomain, "financial");
});

test("builds business and financial objective examples", () => {
  const business = buildContextFromExample("business-objective", WS, OWNER, FIXED_TIME);
  const financial = buildContextFromExample("financial-objective", WS, OWNER, FIXED_TIME);
  assert.equal(business?.business.businessDomain, "strategy");
  assert.equal(financial?.business.businessDomain, "financial");
});
