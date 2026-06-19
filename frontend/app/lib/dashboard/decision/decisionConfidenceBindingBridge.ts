import {
  explainDecisionConfidence,
  resetAssistantConfidenceBindingForTests,
} from "../../decision/AssistantConfidenceBridge.ts";
import {
  resolveDashboardConfidenceBinding,
  resetDashboardConfidenceBindingForTests,
} from "../../decision/DashboardConfidenceBinding.ts";
import type {
  AssistantConfidenceBindingView,
  DashboardConfidenceBindingView,
  DecisionConfidenceBindingBuildInput,
} from "../../decision/decisionConfidenceBindingContract.ts";

export type DashboardConfidenceWorkspaceContextView = Readonly<{
  objectId: string;
  objectName: string;
  confidenceBinding: DashboardConfidenceBindingView | null;
  assistantConfidenceBinding: AssistantConfidenceBindingView | null;
}>;

export function attachDashboardConfidenceBinding(
  context: DashboardConfidenceWorkspaceContextView | null,
  input: DecisionConfidenceBindingBuildInput
): DashboardConfidenceWorkspaceContextView | null {
  if (!context) return null;

  const dashboard = resolveDashboardConfidenceBinding(input);
  const assistant = explainDecisionConfidence(input);

  return Object.freeze({
    ...context,
    confidenceBinding: dashboard.view,
    assistantConfidenceBinding: assistant.view,
  });
}

export function resetDecisionConfidenceBindingBridgeForTests(): void {
  resetDashboardConfidenceBindingForTests();
  resetAssistantConfidenceBindingForTests();
}
