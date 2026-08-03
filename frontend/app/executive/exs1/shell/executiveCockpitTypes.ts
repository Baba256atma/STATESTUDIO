/**
 * EXS-1.5 — Executive Cockpit Shell types.
 * Permanent UI foundation. No runtime / business logic.
 */

export type ExecutiveThemeMode = "day" | "night" | "auto";

export type ExecutiveNavId =
  | "Home"
  | "Model"
  | "Objects"
  | "Data"
  | "Journal"
  | "Search"
  | "Settings";

export type ExecutiveExplorerKind =
  | "model"
  | "objects"
  | "data"
  | "journal"
  | "search"
  | null;

export type ExecutiveModeId =
  | "Goal"
  | "Problem"
  | "Analysis"
  | "Scenario"
  | "Decision"
  | "Execution"
  | "Monitoring"
  | "War Room";

export type ExecutiveTimelineLens = "day" | "week" | "month" | "year";

export type ExecutiveAdvisorTab = "Assist" | "Insight";

export type ExecutiveContextSnapshot = {
  readonly company: string;
  readonly model: string;
  readonly pack: string;
  readonly lens: ExecutiveTimelineLens;
  readonly theme: ExecutiveThemeMode;
  readonly liveStatus: string;
};

export type ExecutiveFloatingPanelKind =
  | "add-object"
  | "delete-object"
  | "import-csv"
  | "rename"
  | "wizard"
  | "scenario-wizard"
  | "decision-wizard"
  | "execution-new-task"
  | "execution-assign-owner"
  | "execution-change-status"
  | "execution-notes"
  | "monitoring-notes"
  | "data-wizard"
  | "properties"
  | null;

export const EXECUTIVE_NAV_ITEMS: readonly ExecutiveNavId[] = Object.freeze([
  "Home",
  "Model",
  "Objects",
  "Data",
  "Journal",
  "Search",
  "Settings",
]);

export const EXECUTIVE_MODES: readonly ExecutiveModeId[] = Object.freeze([
  "Goal",
  "Problem",
  "Analysis",
  "Scenario",
  "Decision",
  "Execution",
  "Monitoring",
  "War Room",
]);

export const EXECUTIVE_TIMELINE_LENSES: readonly ExecutiveTimelineLens[] =
  Object.freeze(["day", "week", "month", "year"]);

export function navToExplorer(nav: ExecutiveNavId): ExecutiveExplorerKind {
  switch (nav) {
    case "Model":
      return "model";
    case "Objects":
      return "objects";
    case "Data":
      return "data";
    case "Journal":
      return "journal";
    case "Search":
      return "search";
    default:
      return null;
  }
}

export function explorerTitle(kind: ExecutiveExplorerKind): string {
  switch (kind) {
    case "model":
      return "Model Explorer";
    case "objects":
      return "Object Explorer";
    case "data":
      return "Data Catalog";
    case "journal":
      return "Journal Explorer";
    case "search":
      return "Search";
    default:
      return "";
  }
}
