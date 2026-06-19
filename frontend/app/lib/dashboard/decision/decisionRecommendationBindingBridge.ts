import {
  explainDecisionRecommendation,
  resetAssistantDecisionBindingForTests,
} from "../../decision/AssistantDecisionBridge.ts";
import {
  resolveDashboardDecisionBinding,
  resetDashboardDecisionBindingForTests,
} from "../../decision/DashboardDecisionBinding.ts";
import type {
  DashboardDecisionBindingView,
  DecisionBindingBuildInput,
} from "../../decision/decisionBindingContract.ts";
import type { AssistantDecisionBindingView } from "../../decision/decisionBindingContract.ts";

export type DashboardDecisionWorkspaceContextView = Readonly<{
  objectId: string;
  objectName: string;
  decisionBinding: DashboardDecisionBindingView | null;
  assistantDecisionBinding: AssistantDecisionBindingView | null;
}>;

export function attachDashboardDecisionBinding(
  context: DashboardDecisionWorkspaceContextView | null,
  input: DecisionBindingBuildInput
): DashboardDecisionWorkspaceContextView | null {
  if (!context) return null;

  const dashboard = resolveDashboardDecisionBinding(input);
  const assistant = explainDecisionRecommendation(input);

  return Object.freeze({
    ...context,
    decisionBinding: dashboard.view,
    assistantDecisionBinding: assistant.view,
  });
}

export function resetDecisionRecommendationBindingBridgeForTests(): void {
  resetDashboardDecisionBindingForTests();
  resetAssistantDecisionBindingForTests();
}
