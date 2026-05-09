import type { TypeCAIExecutiveInsight } from "./aiTypeCExecutiveInsight.ts";
import type { TypeCExecutiveSummary } from "./typeCExecutiveSummary.ts";

export type TypeCExecutiveActionKind =
  | "analyze_object"
  | "explain_risk"
  | "monitor_signal"
  | "open_scenario"
  | "compare_options";

export type TypeCExecutiveAction = {
  id: string;
  kind: TypeCExecutiveActionKind;
  label: string;
  disabled?: boolean;
  reason?: string;
  targetObjectId?: string | null;
};

function hasSignals(summary: TypeCExecutiveSummary): boolean {
  return summary.why.length > 0 || summary.riskNotes.length > 0 || summary.nextActions.length > 0;
}

export function buildTypeCExecutiveActions(input: {
  summary: TypeCExecutiveSummary;
  aiInsight?: TypeCAIExecutiveInsight | null;
  selectedObjectId?: string | null;
}): TypeCExecutiveAction[] {
  const { summary, selectedObjectId = null } = input;
  const hasSelectedObject = Boolean(selectedObjectId);
  const meaningfulSignals = hasSignals(summary);

  return [
    {
      id: "typec_action_analyze_object",
      kind: "analyze_object",
      label: "Analyze Object",
      disabled: !hasSelectedObject,
      reason: hasSelectedObject ? "selected_object_available" : "missing_selected_object",
      targetObjectId: selectedObjectId,
    },
    {
      id: "typec_action_explain_risk",
      kind: "explain_risk",
      label: "Explain Risk",
      disabled: !meaningfulSignals,
      reason: meaningfulSignals ? "summary_signals_available" : "missing_summary_signals",
    },
    {
      id: "typec_action_monitor_signal",
      kind: "monitor_signal",
      label: "Monitor Signal",
      disabled: summary.riskNotes.length === 0 && summary.why.length === 0,
      reason: summary.riskNotes.length || summary.why.length ? "risk_or_why_signal_available" : "missing_risk_signal",
    },
    {
      id: "typec_action_open_scenario",
      kind: "open_scenario",
      label: "Open Scenario",
      disabled: false,
      reason: "scenario_review_available",
    },
    {
      id: "typec_action_compare_options",
      kind: "compare_options",
      label: "Compare Options",
      disabled: false,
      reason: "compare_available",
    },
  ];
}
