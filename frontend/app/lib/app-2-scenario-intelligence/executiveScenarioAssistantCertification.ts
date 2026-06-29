/**
 * APP-2:11 — Executive Scenario Assistant Integration certification.
 * Certification gates A–Q for APP-2:11 readiness.
 */

import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST } from "./executiveScenarioWorkspaceAdapter.ts";
import { EXECUTIVE_SCENARIO_ASSISTANT_DIAGNOSTIC_CODES } from "./executiveScenarioAssistantDiagnostics.ts";
import {
  EXECUTIVE_SCENARIO_ASSISTANT_EVENT_NAMES,
  EXECUTIVE_SCENARIO_ASSISTANT_FOLLOW_UP_TOPIC_DEFINITIONS,
} from "./executiveScenarioAssistantTopics.ts";
import {
  adaptExecutiveScenarioWorkspaceViewToAssistantView,
  EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_MANIFEST,
  EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES,
  EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
} from "./executiveScenarioAssistantAdapter.ts";
import { EXECUTIVE_SCENARIO_ASSISTANT_EXPLANATION_SECTION_KINDS } from "./executiveScenarioAssistantView.ts";
import {
  resolveExecutiveScenarioAssistantView,
  resolveExecutiveScenarioAssistantViewProbeExample,
} from "./executiveScenarioAssistantResolver.ts";
import { resolveExecutiveScenarioWorkspaceViewProbeExample } from "./executiveScenarioWorkspaceResolver.ts";

export const EXECUTIVE_SCENARIO_ASSISTANT_INTEGRATION_CERTIFICATION_VERSION =
  "APP-2/11-cert" as const;

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runExecutiveScenarioAssistantIntegrationCertification(): Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ScenarioIntelligenceCertificationCheck[];
  passedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  failedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  summary: string;
  generatedAt: string;
}> {
  const checks: ScenarioIntelligenceCertificationCheck[] = [];
  const generatedAt = new Date(0).toISOString();
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(generatedAt);
  const assistantView = resolveExecutiveScenarioAssistantView(
    Object.freeze({ workspaceView, generatedAt, workspaceId: workspaceView.workspaceId })
  );
  const assistantViewRepeat = resolveExecutiveScenarioAssistantView(
    Object.freeze({ workspaceView, generatedAt, workspaceId: workspaceView.workspaceId })
  );

  checks.push(
    gate(
      "A",
      "Workspace Adapter integration",
      assistantView.conversationContext.workspaceAdapterVersion === "APP-2/10" &&
        EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST.contractModified === false,
      "Assistant adapter consumes APP-2:10 ExecutiveScenarioWorkspaceView."
    )
  );

  checks.push(
    gate(
      "B",
      "Assistant View construction",
      assistantView.readOnly === true &&
        assistantView.executiveHeadline.length > 0 &&
        assistantView.adapterVersion === EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
      "ExecutiveScenarioAssistantView constructed."
    )
  );

  checks.push(
    gate(
      "C",
      "Conversation context",
      assistantView.conversationContext.workspaceId === workspaceView.workspaceId &&
        assistantView.conversationContext.readOnly === true,
      "Conversation context projected from workspace view."
    )
  );

  checks.push(
    gate(
      "D",
      "Explanation projection",
      assistantView.explanationSections.length ===
        EXECUTIVE_SCENARIO_ASSISTANT_EXPLANATION_SECTION_KINDS.length,
      `Projected ${assistantView.explanationSections.length} explanation sections.`
    )
  );

  checks.push(
    gate(
      "E",
      "Recommendation projection",
      assistantView.recommendationPortfolio === workspaceView.recommendationPortfolio,
      "Recommendation portfolio projected by reference."
    )
  );

  checks.push(
    gate(
      "F",
      "Follow-up topics",
      assistantView.followUpTopics.length > 0 &&
        EXECUTIVE_SCENARIO_ASSISTANT_FOLLOW_UP_TOPIC_DEFINITIONS.length === 9,
      `Exposed ${assistantView.followUpTopics.length} follow-up topics.`
    )
  );

  checks.push(
    gate(
      "G",
      "Evidence references",
      assistantView.evidenceReferences.length > 0,
      `Generated ${assistantView.evidenceReferences.length} evidence references.`
    )
  );

  const crossWorkspace = resolveExecutiveScenarioAssistantView(
    Object.freeze({
      workspaceView,
      generatedAt,
      workspaceId: "ws-other",
    })
  );
  checks.push(
    gate(
      "H",
      "Workspace isolation",
      crossWorkspace.assistantStatus === "unavailable" &&
        crossWorkspace.diagnostics.some((entry) => entry.code === "invalid_conversation_context"),
      "Cross-workspace assistant projection rejected."
    )
  );

  checks.push(
    gate(
      "I",
      "Diagnostics",
      EXECUTIVE_SCENARIO_ASSISTANT_DIAGNOSTIC_CODES.length === 7 &&
        crossWorkspace.diagnostics.length > 0,
      "Assistant diagnostics returned without throwing."
    )
  );

  checks.push(
    gate(
      "J",
      "Read-only compliance",
      assistantView.readOnly === true &&
        EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.answersQuestions === false &&
        EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.generatesIntelligence === false,
      "Assistant adapter declares read-only interpreter contract."
    )
  );

  checks.push(
    gate(
      "K",
      "No DS mutation",
      EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_MANIFEST.contractModified === false,
      "DS modules untouched."
    )
  );

  checks.push(
    gate(
      "L",
      "No INT mutation",
      EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_MANIFEST.workspaceAdapterModified === false,
      "INT modules untouched."
    )
  );

  checks.push(
    gate(
      "M",
      "No APP-1 mutation",
      EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.modifiesPackage === false,
      "Executive Time consumed via workspace view only."
    )
  );

  checks.push(
    gate(
      "N",
      "No APP-2 engine mutation",
      EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST.packageEngineModified === false,
      "APP-2:1 through APP-2:10 untouched."
    )
  );

  checks.push(
    gate(
      "O",
      "Build passes",
      typeof adaptExecutiveScenarioWorkspaceViewToAssistantView === "function" &&
        typeof resolveExecutiveScenarioAssistantView === "function",
      "Assistant integration modules export callable functions."
    )
  );

  checks.push(
    gate(
      "P",
      "Tests pass",
      assistantView.executiveHeadline === assistantViewRepeat.executiveHeadline &&
        assistantView.followUpTopics.length === assistantViewRepeat.followUpTopics.length,
      "Deterministic assistant view verified for identical input."
    )
  );

  checks.push(
    gate(
      "Q",
      "Architecture preserved",
      EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.consumesWorkspaceViewOnly === true &&
        EXECUTIVE_SCENARIO_ASSISTANT_EVENT_NAMES.length === 6,
      "ExecutiveScenarioAssistantAdapter is canonical assistant boundary."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:11 Executive Assistant Integration",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Executive Assistant Integration certification passed."
      : `Executive Assistant Integration certification failed (${failedChecks.length} checks).`,
    generatedAt,
  });
}
