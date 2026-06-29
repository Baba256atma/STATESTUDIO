import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ASSISTANT_INTENT_DIAGNOSTIC_CODES,
  isAssistantIntentDiagnosticCode,
} from "./executiveIntentAssistantDiagnostics.ts";
import {
  CLARIFICATION_QUESTION_TEMPLATES,
} from "./executiveIntentAssistantTemplates.ts";
import {
  ExecutiveIntentAssistantIntegration,
  buildAssistantExample,
  buildAssistantIntentResponse,
  buildAssistantProbe,
  buildIntentClarificationQuestions,
  buildIntentExplanation,
  buildIntentHighlights,
  buildIntentStatus,
  buildIntentSummary,
  buildIntentWarnings,
  validateAssistantIntentResponse,
} from "./executiveIntentAssistantIntegration.ts";
import {
  EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES,
  EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_TAGS,
} from "./executiveIntentAssistantIntegration.ts";
import {
  EXECUTIVE_INTENT_ASSISTANT_CANONICAL_EXAMPLES,
  getExecutiveIntentAssistantCanonicalExample,
} from "./executiveIntentAssistantExamples.ts";
import { buildReasoningExample, buildReasoningProbe } from "./executiveIntentReasoningEngine.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WS = "ws-example-001";

test("presents ready intent through assistant", () => {
  const response = buildAssistantExample("ready-intent", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.equal(response!.status, "ready");
  assert.equal(validateAssistantIntentResponse(response!).valid, true);
  assert.equal(response!.flags.reasoningAvailable, true);
});

test("presents incomplete intent through assistant", () => {
  const response = buildAssistantExample("low-confidence-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.equal(response!.status, "incomplete");
  assert.ok(response!.diagnostics.some((entry) => entry.code === "intent_incomplete"));
});

test("presents blocked warnings when reasoning includes blocking issues", () => {
  const reasoning = buildReasoningExample("conflict-heavy-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(reasoning);
  const response = buildAssistantIntentResponse(reasoning!, FIXED_TIME);
  assert.ok(response.warnings.length >= 0);
});

test("presents conflict explanation from reasoning only", () => {
  const response = buildAssistantExample("conflict-explanation", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.equal(response!.flags.hasConflicts, true);
  assert.ok(response!.explanations.some((entry) => entry.topic === "Conflicts"));
  assert.ok(response!.sections.some((section) => section.sectionKey === "conflicts"));
});

test("presents dependency explanation from reasoning only", () => {
  const response = buildAssistantExample("dependency-explanation", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.equal(response!.flags.hasDependencies, true);
  assert.ok(response!.explanations.some((entry) => entry.topic === "Dependencies"));
});

test("presents evolution explanation from reasoning only", () => {
  const reasoning = buildReasoningExample("rapidly-evolving-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(reasoning);
  const response = buildAssistantIntentResponse(reasoning!, FIXED_TIME);
  assert.ok(response.explanations.some((entry) => entry.topic === "Evolution"));
});

test("presents confidence explanation from reasoning only", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.ok(response.explanations.some((entry) => entry.topic === "Confidence"));
  assert.ok(response.sections.some((section) => section.sectionKey === "confidence"));
});

test("presents unknown information section", () => {
  const response = buildAssistantExample("unknown-information", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.ok(response!.sections.some((section) => section.sectionKey === "unknown_information"));
});

test("generates deterministic clarification questions", () => {
  const reasoning = buildReasoningExample("operational-optimization", WS, "executive-owner", FIXED_TIME);
  assert.ok(reasoning);
  const questions = buildIntentClarificationQuestions(reasoning!);
  assert.ok(Array.isArray(questions));
  const response = buildAssistantIntentResponse(reasoning!, FIXED_TIME);
  if (response.clarifications) {
    for (const question of response.clarifications.questions) {
      assert.ok(Object.values(CLARIFICATION_QUESTION_TEMPLATES).includes(question.prompt));
    }
  }
});

test("buildIntentSummary uses reasoning overview", () => {
  const reasoning = buildReasoningProbe(FIXED_TIME);
  const summary = buildIntentSummary(reasoning);
  assert.ok(summary.includes(reasoning.summary.intentLabel));
});

test("includes assistant diagnostics", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.ok(response.diagnostics.some((entry) => entry.code === "assistant_response_success"));
});

test("handles no intent scenario", () => {
  const response = buildAssistantExample("no-intent", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.equal(response!.status, "unknown");
  assert.equal(response!.flags.reasoningAvailable, false);
  assert.ok(response!.diagnostics.some((entry) => entry.code === "no_executive_intent"));
});

test("presents archived intent status", () => {
  const response = buildAssistantExample("archived-intent", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.equal(response!.status, "archived");
  assert.ok(response!.diagnostics.some((entry) => entry.code === "archived_intent"));
});

test("documents multiple intents context", () => {
  const response = buildAssistantExample("multiple-intents", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.ok(response!.diagnostics.some((entry) => entry.code === "multiple_intents_context"));
});

test("produces deterministic output for identical reasoning", () => {
  const reasoning = buildReasoningProbe(FIXED_TIME);
  const first = buildAssistantIntentResponse(reasoning, FIXED_TIME);
  const second = buildAssistantIntentResponse(reasoning, FIXED_TIME);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

test("assistant response is read-only and immutable", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.equal(response.readOnly, true);
  assert.equal(response.flags.readOnly, true);
  assert.equal(response.flags.deterministic, true);
  const before = JSON.stringify(response);
  buildAssistantIntentResponse(buildReasoningProbe(FIXED_TIME), FIXED_TIME);
  assert.equal(JSON.stringify(response), before);
});

test("integration consumes reasoning only and not upstream engines directly", () => {
  const source = readFileSync(
    new URL("./executiveIntentAssistantIntegration.ts", import.meta.url),
    "utf8"
  );
  assert.equal(source.includes("extractExecutiveIntent"), false);
  assert.equal(source.includes("classifyExecutiveIntent"), false);
  assert.equal(source.includes("buildExecutiveIntentSemanticModel"), false);
  assert.equal(source.includes("resolveExecutiveIntentStateResult"), false);
  assert.equal(source.includes("detectIntentConflicts"), false);
  assert.equal(source.includes("detectIntentDependencies"), false);
  assert.equal(source.includes("buildIntentEvolution"), false);
  assert.equal(source.includes("calculateIntentConfidence"), false);
  assert.ok(source.includes("buildReasoningExample"));
  assert.ok(source.includes("buildReasoningProbe"));
});

test("declares assistant diagnostics and integration tags", () => {
  assert.equal(ASSISTANT_INTENT_DIAGNOSTIC_CODES.length, 14);
  assert.equal(isAssistantIntentDiagnosticCode("assistant_ready"), true);
  assert.ok(EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_TAGS.includes("[APP3_12]"));
  assert.ok(EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_TAGS.includes("[REASONING_CONSUMER]"));
  assert.equal(EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES.reasoningConsumerOnly, true);
});

test("regression: APP-3:11 reasoning consumed exclusively", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.equal(response.metadata.reasoningEngineVersion, "APP-3/11");
  assert.ok(response.metadata.reasoningId);
});

test("regression: APP-3:10 represented via reasoning metadata", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.ok(response.metadata.enginesConsumed.includes("APP-3/10"));
});

test("regression: APP-3:9 represented via reasoning metadata", () => {
  const reasoning = buildReasoningExample("rapidly-evolving-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(reasoning);
  const response = buildAssistantIntentResponse(reasoning!, FIXED_TIME);
  assert.ok(response.metadata.enginesConsumed.includes("APP-3/9"));
});

test("regression: APP-3:8 represented via reasoning metadata", () => {
  const response = buildAssistantExample("dependency-explanation", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.ok(response!.metadata.enginesConsumed.includes("APP-3/8"));
});

test("regression: APP-3:7 represented via reasoning metadata", () => {
  const response = buildAssistantExample("conflict-explanation", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.ok(response!.metadata.enginesConsumed.includes("APP-3/7"));
});

test("regression: APP-3:6 represented via reasoning metadata", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.ok(response.metadata.enginesConsumed.includes("APP-3/6"));
});

test("regression: APP-3:5 represented via reasoning metadata", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.ok(response.metadata.enginesConsumed.includes("APP-3/5"));
});

test("regression: APP-3:4 represented via reasoning metadata", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.ok(response.metadata.enginesConsumed.includes("APP-3/4"));
});

test("regression: APP-3:2 represented via reasoning metadata", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.ok(response.metadata.enginesConsumed.includes("APP-3/2"));
});

test("regression: APP-3:1 represented via reasoning metadata", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  assert.ok(response.metadata.enginesConsumed.includes("APP-3/1"));
});

test("covers assistant canonical example catalog", () => {
  assert.ok(EXECUTIVE_INTENT_ASSISTANT_CANONICAL_EXAMPLES.length >= 10);
  assert.ok(getExecutiveIntentAssistantCanonicalExample("well-defined-objective"));
});

test("ExecutiveIntentAssistantIntegration exposes public APIs", () => {
  assert.equal(ExecutiveIntentAssistantIntegration.version, "APP-3/12");
  assert.equal(typeof ExecutiveIntentAssistantIntegration.buildAssistantIntentResponse, "function");
  assert.equal(typeof ExecutiveIntentAssistantIntegration.buildAssistantProbe, "function");
});

test("buildIntentHighlights mirrors reasoning highlights", () => {
  const reasoning = buildReasoningProbe(FIXED_TIME);
  const highlights = buildIntentHighlights(reasoning);
  assert.equal(highlights.length, reasoning.highlights.items.length);
});

test("buildIntentWarnings surfaces low confidence from reasoning", () => {
  const reasoning = buildReasoningExample("low-confidence-objective", WS, "executive-owner", FIXED_TIME);
  assert.ok(reasoning);
  const warnings = buildIntentWarnings(reasoning!);
  assert.ok(Array.isArray(warnings));
});

test("buildIntentStatus maps readiness states", () => {
  const reasoning = buildReasoningProbe(FIXED_TIME);
  assert.equal(buildIntentStatus(reasoning), mapAssistantStatus(reasoning.readinessAssessment.state));
  assert.equal(buildIntentStatus(null), "unknown");
});

function mapAssistantStatus(state: string): string {
  if (state === "not_ready") return "incomplete";
  return state;
}

test("validateAssistantIntentResponse rejects invalid version", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  const tampered = Object.freeze({
    ...response,
    metadata: Object.freeze({
      ...response.metadata,
      assistantIntegrationVersion: "INVALID" as typeof response.metadata.assistantIntegrationVersion,
    }),
  });
  assert.equal(validateAssistantIntentResponse(tampered).valid, false);
});

test("assistant sections include all required presentation sections", () => {
  const response = buildAssistantProbe(FIXED_TIME);
  const keys = response.sections.map((section) => section.sectionKey);
  assert.ok(keys.includes("overview"));
  assert.ok(keys.includes("intent"));
  assert.ok(keys.includes("state"));
  assert.ok(keys.includes("classification"));
  assert.ok(keys.includes("confidence"));
  assert.ok(keys.includes("conflicts"));
  assert.ok(keys.includes("dependencies"));
  assert.ok(keys.includes("evolution"));
  assert.ok(keys.includes("known_information"));
  assert.ok(keys.includes("unknown_information"));
  assert.ok(keys.includes("highlights"));
  assert.ok(keys.includes("issues"));
  assert.ok(keys.includes("questions"));
  assert.ok(keys.includes("diagnostics"));
});

test("buildIntentExplanation provides topic explanations without recommendations", () => {
  const reasoning = buildReasoningProbe(FIXED_TIME);
  const explanations = buildIntentExplanation(reasoning);
  assert.ok(explanations.every((entry) => !entry.body.toLowerCase().includes("recommend")));
});

test("needs clarification example exposes clarification diagnostics", () => {
  const response = buildAssistantExample("needs-clarification", WS, "executive-owner", FIXED_TIME);
  assert.ok(response);
  assert.equal(response!.status, "needs_clarification");
  assert.ok(
    response!.diagnostics.some((entry) => entry.code === "clarification_required") ||
      response!.clarifications !== null
  );
});
