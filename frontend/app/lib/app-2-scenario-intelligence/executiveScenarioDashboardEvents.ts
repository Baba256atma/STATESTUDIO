/**
 * APP-2:12 — Executive Scenario Dashboard events.
 * Event definitions only — no event bus implementation.
 */

export const EXECUTIVE_SCENARIO_DASHBOARD_EVENTS_VERSION = "APP-2/12" as const;

export type ExecutiveScenarioDashboardEventName =
  | "DashboardViewCreated"
  | "DashboardRefreshed"
  | "CardExpanded"
  | "CardCollapsed"
  | "AlertOpened"
  | "EvidenceViewed";

export type ExecutiveScenarioDashboardEvent = Readonly<{
  eventName: ExecutiveScenarioDashboardEventName;
  workspaceId: string;
  scenarioId: string | null;
  cardId: string | null;
  timestamp: string;
  readOnly: true;
}>;

export const EXECUTIVE_SCENARIO_DASHBOARD_EVENT_NAMES = Object.freeze([
  "DashboardViewCreated",
  "DashboardRefreshed",
  "CardExpanded",
  "CardCollapsed",
  "AlertOpened",
  "EvidenceViewed",
] as const satisfies readonly ExecutiveScenarioDashboardEventName[]);

export function createExecutiveScenarioDashboardEvent(
  input: Omit<ExecutiveScenarioDashboardEvent, "readOnly">
): ExecutiveScenarioDashboardEvent {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function describeExecutiveScenarioDashboardEvent(
  eventName: ExecutiveScenarioDashboardEventName
): string {
  switch (eventName) {
    case "DashboardViewCreated":
      return "ExecutiveScenarioDashboardView created from workspace view.";
    case "DashboardRefreshed":
      return "Dashboard refresh requested; workspace view reloaded without intelligence rebuild.";
    case "CardExpanded":
      return "Dashboard card expanded for executive monitoring.";
    case "CardCollapsed":
      return "Dashboard card collapsed.";
    case "AlertOpened":
      return "Dashboard alert opened for executive review.";
    case "EvidenceViewed":
      return "Dashboard card evidence reference viewed.";
    default:
      return "Unknown dashboard integration event.";
  }
}
