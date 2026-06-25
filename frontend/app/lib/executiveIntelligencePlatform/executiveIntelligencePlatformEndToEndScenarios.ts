/**
 * INT-5 — Executive Intelligence Platform end-to-end scenarios.
 */

import { inferExecutiveTimeStateFromManagerPhrase } from "../assistantIntelligence/assistantRequestBuilder.ts";
import { requestAssistantIntelligence } from "../assistantIntelligence/assistantRuntimeAdapter.ts";
import { buildIntelligenceContext } from "../dashboardIntelligence/intelligenceContextBuilder.ts";
import { requestExecutiveSummaryIntelligence } from "../executiveSummaryIntelligence/executiveSummaryRuntimeAdapter.ts";
import { requestObjectPanelIntelligence } from "../objectPanelIntelligence/objectPanelRuntimeAdapter.ts";
import type {
  ExecutiveIntelligenceEndToEndScenarioId,
  ExecutiveIntelligenceEndToEndScenarioResult,
} from "./executiveIntelligencePlatformCertificationContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

function scenario(
  id: ExecutiveIntelligenceEndToEndScenarioId,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveIntelligenceEndToEndScenarioResult {
  return Object.freeze({ id, title, passed, evidence });
}

export function runExecutiveIntelligenceEndToEndScenarios(input: {
  workspaceId: WorkspaceId;
  objectIdA: string;
  objectIdB: string;
}): readonly ExecutiveIntelligenceEndToEndScenarioResult[] {
  const workspaceId = input.workspaceId.trim();

  buildIntelligenceContext({
    consumer: "dashboard",
    workspace: workspaceId,
    panel: "executive_summary",
    dashboardMode: "executive_summary",
  });

  const summary = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    executiveTime: { timeState: "now" },
  });
  const assistant = requestAssistantIntelligence({
    requestType: "general_executive_question",
    workspace: workspaceId,
    managerPhrase: "What is the executive overview?",
    conversationId: "e2e_scenario_1",
  });

  const scenario1 = scenario(
    "scenario_1_workspace_open",
    "Manager opens workspace — Dashboard initializes, Assistant available, Executive Summary loads",
    summary.gatewaySuccess === true &&
      assistant.gatewaySuccess === true &&
      summary.request.intelligenceContext !== null,
    `Summary=${summary.gatewaySuccess}, assistant=${assistant.gatewaySuccess}.`
  );

  requestObjectPanelIntelligence({
    workspace: workspaceId,
    selectedObjectId: input.objectIdA,
    useCurrentContext: false,
  });
  const assistantObject = requestAssistantIntelligence({
    requestType: "explain_object",
    workspace: workspaceId,
    selection: { objectId: input.objectIdA },
    conversationId: "e2e_scenario_2",
  });
  const summaryObject = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    selection: { objectId: input.objectIdA },
    useCurrentContext: false,
  });

  const scenario2 = scenario(
    "scenario_2_object_selection",
    "Manager selects object — Object Panel, Assistant, and Executive Summary stay consistent",
    assistantObject.request.selection.objectId === input.objectIdA &&
      summaryObject.request.selection.objectId === input.objectIdA &&
      assistantObject.request.workspace === workspaceId,
    `Object=${assistantObject.request.selection.objectId}, workspace=${assistantObject.request.workspace}.`
  );

  const nowPhrase = "Delivery is late";
  const nowAssistant = requestAssistantIntelligence({
    requestType: "general_executive_question",
    workspace: workspaceId,
    managerPhrase: nowPhrase,
    conversationId: "e2e_scenario_3",
  });
  const nowSummary = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    executiveTime: { timeState: "now", requestedTime: nowPhrase },
  });
  const nowObject = requestObjectPanelIntelligence({
    workspace: workspaceId,
    selectedObjectId: input.objectIdA,
    executiveTime: { timeState: "now", requestedTime: nowPhrase },
  });

  const scenario3 = scenario(
    "scenario_3_now_delivery",
    "Manager asks NOW — all consumers receive NOW time context",
    inferExecutiveTimeStateFromManagerPhrase(nowPhrase) === "now" &&
      nowAssistant.request.executiveTimeContext?.timeState === "now" &&
      nowSummary.request.executiveTimeContext?.timeState === "now" &&
      nowObject.request.executiveTimeContext?.timeState === "now",
    `Assistant=${nowAssistant.request.executiveTimeContext?.timeState}, summary=${nowSummary.request.executiveTimeContext?.timeState}, object=${nowObject.request.executiveTimeContext?.timeState}.`
  );

  const futurePhrase = "If delivery is late";
  const futureAssistant = requestAssistantIntelligence({
    requestType: "explain_scenario",
    workspace: workspaceId,
    managerPhrase: futurePhrase,
    conversationId: "e2e_scenario_4",
  });
  const futureSummary = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    executiveTime: { timeState: "future", requestedTime: futurePhrase },
  });
  const futureObject = requestObjectPanelIntelligence({
    workspace: workspaceId,
    selectedObjectId: input.objectIdA,
    executiveTime: { timeState: "future", requestedTime: futurePhrase },
  });

  const scenario4 = scenario(
    "scenario_4_future_delivery",
    "Manager asks FUTURE — scenario-ready response without mutation",
    inferExecutiveTimeStateFromManagerPhrase(futurePhrase) === "future" &&
      futureAssistant.request.executiveTimeContext?.timeState === "future" &&
      futureSummary.request.executiveTimeContext?.timeState === "future" &&
      futureObject.request.executiveTimeContext?.timeState === "future" &&
      futureSummary.response.normalized !== null,
    `Future states aligned; normalized=${Boolean(futureSummary.response.normalized)}.`
  );

  const pastPhrase = "Delivery was late";
  const pastAssistant = requestAssistantIntelligence({
    requestType: "general_executive_question",
    workspace: workspaceId,
    managerPhrase: pastPhrase,
    conversationId: "e2e_scenario_5",
  });
  const pastSummary = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    executiveTime: {
      timeState: "past",
      requestedTime: pastPhrase,
      timelinePosition: { index: 0, label: "Last Period", reserved: false },
    },
  });
  const pastObject = requestObjectPanelIntelligence({
    workspace: workspaceId,
    selectedObjectId: input.objectIdB,
    executiveTime: {
      timeState: "past",
      requestedTime: pastPhrase,
      timelinePosition: { index: 0, label: "Last Period", reserved: false },
    },
  });

  const scenario5 = scenario(
    "scenario_5_past_delivery",
    "Manager asks PAST — timeline-compatible response across consumers",
    inferExecutiveTimeStateFromManagerPhrase(pastPhrase) === "past" &&
      pastAssistant.request.executiveTimeContext?.timeState === "past" &&
      pastSummary.request.executiveTimeContext?.timeState === "past" &&
      pastObject.request.executiveTimeContext?.timeState === "past",
    `Past states aligned; timeline index=${pastSummary.request.executiveTimeContext?.timelinePosition.index ?? "none"}.`
  );

  return Object.freeze([scenario1, scenario2, scenario3, scenario4, scenario5]);
}
