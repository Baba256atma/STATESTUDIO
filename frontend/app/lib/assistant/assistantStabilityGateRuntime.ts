/**
 * MRP:11:2:8 — Assistant runtime stability gate.
 */

import {
  buildContextSummarySignature,
  buildDashboardExecutiveContextSummary,
} from "../assistant-bridge/assistantContextSyncContract.ts";
import { shouldSuppressLegacyDashboardHost } from "../dashboard/dashboardHomeReturnPath/dashboardHomeRuntimeTrace.ts";
import { MRP_CLEAN_TAB_OWNERS } from "../ui/mainRightPanelLegacyIsolation.ts";
import { CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1 } from "./assistantChatFirstFinalFreezeContract.ts";
import { ASSISTANT_INTELLIGENCE_CARD_LIMIT } from "./assistantIntelligenceCardsContract.ts";
import { getAssistantPanelVisibility } from "./assistantPanelDockRuntime.ts";
import { buildAssistantIntelligenceCards } from "./assistantIntelligenceCardsRuntime.ts";
import {
  getCachedAssistantPanelVisibilitySnapshot,
  isAssistantSupportAccordionPanelOpen,
  openAssistantSupportAccordionPanel,
  resetAssistantSupportAccordionForTests,
} from "./assistantSupportAccordionRuntime.ts";

export type AssistantStabilityGateComponent =
  | "AssistantSurface"
  | "IntelligenceCards"
  | "Accordion"
  | "SuggestedQuestions"
  | "ObjectContextBridge"
  | "DashboardBoundary";

export type AssistantStabilityGateStatus = "pass" | "fail";

export type AssistantStabilityGateResult = Readonly<{
  overall: AssistantStabilityGateStatus;
  components: Readonly<Record<AssistantStabilityGateComponent, AssistantStabilityGateStatus>>;
}>;

const STABILITY_GATE_COMPONENTS: readonly AssistantStabilityGateComponent[] = Object.freeze([
  "AssistantSurface",
  "IntelligenceCards",
  "Accordion",
  "SuggestedQuestions",
  "ObjectContextBridge",
  "DashboardBoundary",
]);

let stabilityGateLogged = false;

export function traceAssistantStabilityGateComponent(input: {
  component: AssistantStabilityGateComponent;
  status: AssistantStabilityGateStatus;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraAssistantStabilityGate]\ncomponent=${input.component}\nstatus=${input.status}`
  );
}

export function traceAssistantStabilityGateOverall(status: AssistantStabilityGateStatus): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(`[NexoraAssistantStabilityGate]\noverall=${status}`);
}

function validateAssistantSurfaceComponent(): AssistantStabilityGateStatus {
  const architecture = CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1.architecture;
  return architecture.assistantTab === "chat_first_integrated_main_right_panel_assistant_tab" &&
    architecture.chatHost === "executive_assistant_host_portal"
    ? "pass"
    : "fail";
}

function validateIntelligenceCardsComponent(): AssistantStabilityGateStatus {
  const cards = buildAssistantIntelligenceCards({
    selectedObjectId: "node-1",
    selectedObjectName: "Node 1",
    dashboardMode: "overview",
  });
  return cards.length <= ASSISTANT_INTELLIGENCE_CARD_LIMIT ? "pass" : "fail";
}

function validateAccordionComponent(): AssistantStabilityGateStatus {
  resetAssistantSupportAccordionForTests({ openPanelId: null });
  const before = getAssistantPanelVisibility();
  const after = getAssistantPanelVisibility();
  if (before !== after) return "fail";

  openAssistantSupportAccordionPanel("scenario");
  if (!isAssistantSupportAccordionPanelOpen("scenario")) return "fail";
  if (isAssistantSupportAccordionPanelOpen("insight")) return "fail";

  openAssistantSupportAccordionPanel("analytics");
  if (!isAssistantSupportAccordionPanelOpen("analytics")) return "fail";
  if (isAssistantSupportAccordionPanelOpen("scenario")) return "fail";

  const snapshot = getCachedAssistantPanelVisibilitySnapshot();
  return getAssistantPanelVisibility() === snapshot ? "pass" : "fail";
}

function validateSuggestedQuestionsComponent(): AssistantStabilityGateStatus {
  return CHAT_FIRST_ASSISTANT_FINAL_FREEZE_V1.architecture.suggestedQuestions ===
    "executive_questions_support_panel"
    ? "pass"
    : "fail";
}

function validateObjectContextBridgeComponent(): AssistantStabilityGateStatus {
  const summary = buildDashboardExecutiveContextSummary({
    dashboardMode: "overview",
    dashboardRouteObjectId: "obj-1",
    dashboardRouteObjectName: "Object 1",
    selectedObjectId: "obj-1",
    selectedObjectName: "Object 1",
    completionStatus: "active",
    routeType: "dashboard_direct",
  });
  const signatureA = buildContextSummarySignature(summary);
  const signatureB = buildContextSummarySignature(summary);
  return signatureA === signatureB && summary.source === "dashboard_runtime" ? "pass" : "fail";
}

function validateDashboardBoundaryComponent(): AssistantStabilityGateStatus {
  const assistantOwner = MRP_CLEAN_TAB_OWNERS.assistant;
  const dashboardOwner = MRP_CLEAN_TAB_OWNERS.dashboard;
  const suppressLegacy = shouldSuppressLegacyDashboardHost("overview");
  return assistantOwner.includes("MainRightPanelShell") &&
    dashboardOwner.includes("MainRightPanelShell") &&
    suppressLegacy
    ? "pass"
    : "fail";
}

export function runAssistantStabilityGate(): AssistantStabilityGateResult {
  const components = Object.freeze({
    AssistantSurface: validateAssistantSurfaceComponent(),
    IntelligenceCards: validateIntelligenceCardsComponent(),
    Accordion: validateAccordionComponent(),
    SuggestedQuestions: validateSuggestedQuestionsComponent(),
    ObjectContextBridge: validateObjectContextBridgeComponent(),
    DashboardBoundary: validateDashboardBoundaryComponent(),
  });

  const overall: AssistantStabilityGateStatus = Object.values(components).every(
    (status) => status === "pass"
  )
    ? "pass"
    : "fail";

  return Object.freeze({ overall, components });
}

export function traceAssistantStabilityGate(force = false): AssistantStabilityGateResult {
  if (process.env.NODE_ENV === "production") {
    return runAssistantStabilityGate();
  }

  if (stabilityGateLogged && !force) {
    return runAssistantStabilityGate();
  }

  stabilityGateLogged = true;
  const result = runAssistantStabilityGate();

  for (const component of STABILITY_GATE_COMPONENTS) {
    traceAssistantStabilityGateComponent({
      component,
      status: result.components[component],
    });
  }
  traceAssistantStabilityGateOverall(result.overall);

  return result;
}

/** Test-only reset. */
export function resetAssistantStabilityGateForTests(): void {
  stabilityGateLogged = false;
  resetAssistantSupportAccordionForTests();
}

declare global {
  interface Window {
    __NEXORA_ASSISTANT_STABILITY_GATE__?: AssistantStabilityGateResult;
  }
}

export function publishAssistantStabilityGateResult(result: AssistantStabilityGateResult): void {
  if (typeof window === "undefined") return;
  window.__NEXORA_ASSISTANT_STABILITY_GATE__ = result;
}
