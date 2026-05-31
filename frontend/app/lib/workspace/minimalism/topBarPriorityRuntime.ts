import { auditedResolve } from "../../audit/auditedResolve";
import type {
  TopBarOverflowItemId,
  TopBarPrimaryBlockId,
  TopBarPriorityInput,
  TopBarPrioritySnapshot,
} from "./executiveMinimalismTypes";
import { logExecutiveMinimalism } from "./executiveMinimalismInstrumentation";

const ACTION_OVERFLOW_IDS = new Set<TopBarOverflowItemId>([
  "analyze",
  "compare",
  "load_template",
  "save_workspace",
  "load_workspace",
]);

const DEFAULT_PRIMARY: TopBarPrimaryBlockId[] = ["frsi", "scenario", "decision", "workspace_controls"];

const OVERFLOW_SECONDARY: TopBarOverflowItemId[] = [
  "readiness",
  "mini_insight",
  "analyze",
  "compare",
  "load_template",
  "save_workspace",
  "load_workspace",
];

const OVERFLOW_UTILITIES: TopBarOverflowItemId[] = [
  "hud_settings",
  "layout_preset",
  "view_mode",
  "developer_tools",
  "sandbox",
  "diagnostics",
];

export const TOP_BAR_OVERFLOW_LABELS: Record<TopBarOverflowItemId, string> = {
  readiness: "Readiness",
  mini_insight: "Insight",
  analyze: "Analyze",
  compare: "Compare",
  load_template: "Template",
  save_workspace: "Save Workspace",
  load_workspace: "Load Workspace",
  hud_settings: "HUD Settings",
  layout_preset: "Layout Preset",
  view_mode: "Day / Night",
  developer_tools: "Developer Tools",
  sandbox: "Sandbox",
  diagnostics: "Diagnostics",
};

/** Resolve which command bar elements stay visible vs overflow for executive minimalism. */
export function resolveTopBarPriority(input: TopBarPriorityInput = {}): TopBarPrioritySnapshot {
  const viewportWidth = input.viewportWidth ?? 1440;
  const quickActionsVisible = input.quickActionsVisible ?? false;
  const statusHudVisible = input.statusHudVisible ?? true;

  return auditedResolve({
    auditName: "Minimalism",
    inputs: {
      kind: "topBarPriority",
      viewportWidth,
      quickActionsVisible,
      statusHudVisible,
      commandBarVisible: input.commandBarVisible ?? true,
    },
    compute: () => {
      const compact = viewportWidth < 1100;
      const mobile = viewportWidth < 768;

      const overflowItems: TopBarOverflowItemId[] = [...OVERFLOW_SECONDARY];
      if (quickActionsVisible) {
        overflowItems.push("analyze", "compare", "load_template", "save_workspace", "load_workspace");
      }
      if (compact) {
        overflowItems.push("readiness");
      }
      if (mobile) {
        overflowItems.push("layout_preset", "view_mode");
      }
      overflowItems.push(...OVERFLOW_UTILITIES.filter((item) => !overflowItems.includes(item)));

      return {
        primaryBlocks: DEFAULT_PRIMARY,
        overflowItems: [...new Set(overflowItems)],
        showMiniInsight: !statusHudVisible && !compact,
        showInlineActions: !quickActionsVisible && !compact,
        compactStatusBlocks: compact,
      };
    },
    formatLogPayload: (snapshot) => ({
      viewportWidth,
      primaryBlocks: snapshot.primaryBlocks,
      overflowCount: snapshot.overflowItems.length,
      showInlineActions: snapshot.showInlineActions,
      showMiniInsight: snapshot.showMiniInsight,
    }),
    log: logExecutiveMinimalism,
  });
}

export function isTopBarBlockVisible(blockId: TopBarPrimaryBlockId, snapshot: TopBarPrioritySnapshot): boolean {
  return snapshot.primaryBlocks.includes(blockId);
}

export function isTopBarItemOverflow(itemId: TopBarOverflowItemId, snapshot: TopBarPrioritySnapshot): boolean {
  return snapshot.overflowItems.includes(itemId);
}

export function isTopBarActionOverflow(actionId: string, snapshot: TopBarPrioritySnapshot): boolean {
  if (ACTION_OVERFLOW_IDS.has(actionId as TopBarOverflowItemId)) {
    return isTopBarItemOverflow(actionId as TopBarOverflowItemId, snapshot);
  }
  return snapshot.overflowItems.includes("analyze") && ["simulate", "snapshot", "replay"].includes(actionId);
}
