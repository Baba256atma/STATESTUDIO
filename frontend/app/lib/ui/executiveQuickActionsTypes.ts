/** E2:16 — Executive quick actions dock contracts. */
// E2:17 Executive workspace personalization
// D4 Decision intelligence integration
// D6 Simulation execution workflows
// D7 Advisory recommendations
// D8 Strategic memory actions
// D10 Production operational controls

export type ExecutiveQuickActionId = "analyze" | "simulate" | "compare" | "snapshot";

/** Reserved for future dock slots — not rendered in E2:16. */
export type ExecutiveQuickActionFutureId = "replay" | "export" | "report" | "approve" | "monitor";

export type ExecutiveQuickActionsDockDensity = "expanded" | "collapsed" | "minimal";

export type ExecutiveQuickActionDefinition = {
  id: ExecutiveQuickActionId;
  label: string;
  icon: string;
  hint: string;
  disabled?: boolean;
};

export type ExecutiveQuickActionsContext = {
  hasObjectSelection: boolean;
  analyzeLabel: string;
};

export type ExecutiveQuickActionsDockModel = {
  context: ExecutiveQuickActionsContext;
  actions: ExecutiveQuickActionDefinition[];
  density: ExecutiveQuickActionsDockDensity;
};

export const EXECUTIVE_QUICK_ACTION_ICONS: Record<ExecutiveQuickActionId, string> = {
  analyze: "⌕",
  simulate: "▶",
  compare: "⇄",
  snapshot: "◫",
};

export const EXECUTIVE_QUICK_ACTION_BASE_LABELS: Record<ExecutiveQuickActionId, string> = {
  analyze: "Analyze",
  simulate: "Simulate",
  compare: "Compare",
  snapshot: "Snapshot",
};

export const EXECUTIVE_QUICK_ACTION_FUTURE_SLOTS: readonly ExecutiveQuickActionFutureId[] = [
  "replay",
  "export",
  "report",
  "approve",
  "monitor",
] as const;

/** Vertical offset when stacked above the timeline HUD (px). */
export const EXECUTIVE_QUICK_ACTIONS_ABOVE_TIMELINE_OFFSET_PX = 132;

export function buildExecutiveQuickActionsModel(input: {
  hasObjectSelection: boolean;
  density?: ExecutiveQuickActionsDockDensity;
  disabledActions?: Partial<Record<ExecutiveQuickActionId, boolean>>;
}): ExecutiveQuickActionsDockModel {
  const analyzeLabel = input.hasObjectSelection ? "Analyze Object" : "Analyze System";
  const actions: ExecutiveQuickActionDefinition[] = (
    ["analyze", "simulate", "compare", "snapshot"] as ExecutiveQuickActionId[]
  ).map((id) => ({
    id,
    label: id === "analyze" ? analyzeLabel : EXECUTIVE_QUICK_ACTION_BASE_LABELS[id],
    icon: EXECUTIVE_QUICK_ACTION_ICONS[id],
    hint:
      id === "analyze"
        ? input.hasObjectSelection
          ? "Analyze the selected object"
          : "Analyze current system state"
        : id === "simulate"
          ? "Run scenario simulation"
          : id === "compare"
            ? "Compare scenarios or decisions"
            : "Capture executive snapshot",
    disabled: input.disabledActions?.[id] === true,
  }));

  return {
    context: {
      hasObjectSelection: input.hasObjectSelection,
      analyzeLabel,
    },
    actions,
    density: input.density ?? "expanded",
  };
}
