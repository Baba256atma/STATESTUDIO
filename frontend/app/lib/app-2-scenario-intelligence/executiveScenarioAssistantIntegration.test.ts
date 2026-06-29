import assert from "node:assert/strict";
import test from "node:test";

import {
  adaptExecutiveScenarioWorkspaceViewToAssistantView,
  EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES,
  EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
} from "./executiveScenarioAssistantAdapter.ts";
import {
  resolveExecutiveScenarioAssistantView,
  resolveExecutiveScenarioAssistantViewProbeExample,
} from "./executiveScenarioAssistantResolver.ts";
import { runExecutiveScenarioAssistantIntegrationCertification } from "./executiveScenarioAssistantCertification.ts";
import { EXECUTIVE_SCENARIO_ASSISTANT_DIAGNOSTIC_CODES } from "./executiveScenarioAssistantDiagnostics.ts";
import {
  EXECUTIVE_SCENARIO_ASSISTANT_EVENT_NAMES,
  EXECUTIVE_SCENARIO_ASSISTANT_FOLLOW_UP_TOPIC_DEFINITIONS,
} from "./executiveScenarioAssistantTopics.ts";
import { EXECUTIVE_SCENARIO_ASSISTANT_EXPLANATION_SECTION_KINDS } from "./executiveScenarioAssistantView.ts";
import { resolveExecutiveScenarioWorkspaceViewProbeExample } from "./executiveScenarioWorkspaceResolver.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test("consumes workspace view by reference only", () => {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  const assistantView = resolveExecutiveScenarioAssistantView(
    Object.freeze({ workspaceView, generatedAt: FIXED_TIME, workspaceId: workspaceView.workspaceId })
  );

  assert.equal(assistantView.recommendationPortfolio, workspaceView.recommendationPortfolio);
  assert.equal(assistantView.conversationContext.packageId, workspaceView.packageId);
  assert.equal(assistantView.readOnly, true);
  assert.equal(assistantView.adapterVersion, "APP-2/11");
});

test("constructs assistant view with explanation sections", () => {
  const assistantView = resolveExecutiveScenarioAssistantViewProbeExample(FIXED_TIME);

  assert.equal(assistantView.explanationSections.length, EXECUTIVE_SCENARIO_ASSISTANT_EXPLANATION_SECTION_KINDS.length);
  assert.ok(assistantView.executiveHeadline.length > 0);
  assert.ok(assistantView.executiveSituation.length > 0);
  assert.ok(["ready", "partial", "unavailable"].includes(assistantView.assistantStatus));
});

test("projects recommendation portfolio without modification", () => {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  const assistantView = adaptExecutiveScenarioWorkspaceViewToAssistantView(
    Object.freeze({ workspaceView, generatedAt: FIXED_TIME })
  );

  assert.equal(assistantView.recommendationPortfolio, workspaceView.recommendationPortfolio);
  if (assistantView.recommendationPortfolio !== null) {
    assert.ok(assistantView.recommendationPortfolio.recommendations.length > 0);
  }
});

test("generates follow-up topics and evidence references", () => {
  const assistantView = resolveExecutiveScenarioAssistantViewProbeExample(FIXED_TIME);

  assert.ok(assistantView.followUpTopics.length > 0);
  assert.ok(assistantView.evidenceReferences.length > 0);
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_FOLLOW_UP_TOPIC_DEFINITIONS.length, 9);

  for (const topic of assistantView.followUpTopics) {
    assert.ok(topic.topicId);
    assert.ok(topic.label);
    assert.equal(topic.readOnly, true);
  }
});

test("enforces workspace isolation", () => {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  const assistantView = resolveExecutiveScenarioAssistantView(
    Object.freeze({ workspaceView, generatedAt: FIXED_TIME, workspaceId: "ws-other" })
  );

  assert.equal(assistantView.assistantStatus, "unavailable");
  assert.ok(assistantView.diagnostics.some((entry) => entry.code === "invalid_conversation_context"));
});

test("produces deterministic assistant projection", () => {
  const first = resolveExecutiveScenarioAssistantViewProbeExample(FIXED_TIME);
  const second = resolveExecutiveScenarioAssistantViewProbeExample(FIXED_TIME);

  assert.equal(first.executiveHeadline, second.executiveHeadline);
  assert.equal(first.explanationSections.length, second.explanationSections.length);
  assert.equal(first.followUpTopics.length, second.followUpTopics.length);
});

test("declares interpreter-only read-only rules", () => {
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.consumesWorkspaceViewOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.generatesIntelligence, false);
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.answersQuestions, false);
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.executesRecommendations, false);
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.formatsOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION, "APP-2/11");
});

test("defines assistant diagnostic and event vocabularies", () => {
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_DIAGNOSTIC_CODES.length, 7);
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_EVENT_NAMES.length, 6);
});

test("runExecutiveScenarioAssistantIntegrationCertification passes all gates", () => {
  const result = runExecutiveScenarioAssistantIntegrationCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 17);
});

test("does not throw for expected boundary cases", () => {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  assert.doesNotThrow(() =>
    resolveExecutiveScenarioAssistantView(
      Object.freeze({ workspaceView, generatedAt: FIXED_TIME, workspaceId: "ws-other" })
    )
  );
});
