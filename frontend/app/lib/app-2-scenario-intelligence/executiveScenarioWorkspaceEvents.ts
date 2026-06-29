/**
 * APP-2:10 — Executive Scenario Workspace integration events.
 * Event definitions only — no event bus implementation.
 */

export const EXECUTIVE_SCENARIO_WORKSPACE_EVENTS_VERSION = "APP-2/10" as const;

export type ExecutiveScenarioWorkspaceEventName =
  | "PackageLoaded"
  | "PackageRefreshed"
  | "ScenarioSelected"
  | "ScenarioChanged"
  | "WorkspaceChanged"
  | "PackageUnavailable";

export type ExecutiveScenarioWorkspaceEvent = Readonly<{
  eventName: ExecutiveScenarioWorkspaceEventName;
  workspaceId: string;
  scenarioId: string | null;
  packageId: string | null;
  timestamp: string;
  readOnly: true;
}>;

export const EXECUTIVE_SCENARIO_WORKSPACE_EVENT_NAMES = Object.freeze([
  "PackageLoaded",
  "PackageRefreshed",
  "ScenarioSelected",
  "ScenarioChanged",
  "WorkspaceChanged",
  "PackageUnavailable",
] as const satisfies readonly ExecutiveScenarioWorkspaceEventName[]);

export function createExecutiveScenarioWorkspaceEvent(
  input: Omit<ExecutiveScenarioWorkspaceEvent, "readOnly">
): ExecutiveScenarioWorkspaceEvent {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function describeExecutiveScenarioWorkspaceEvent(
  eventName: ExecutiveScenarioWorkspaceEventName
): string {
  switch (eventName) {
    case "PackageLoaded":
      return "ExecutiveScenarioPackage loaded into workspace adapter.";
    case "PackageRefreshed":
      return "ExecutiveScenarioPackage refresh requested; package reloaded without intelligence rebuild.";
    case "ScenarioSelected":
      return "Active scenario selected within workspace boundary.";
    case "ScenarioChanged":
      return "Active scenario changed within workspace boundary.";
    case "WorkspaceChanged":
      return "Workspace context changed; package validation required.";
    case "PackageUnavailable":
      return "ExecutiveScenarioPackage unavailable for workspace integration.";
    default:
      return "Unknown workspace integration event.";
  }
}
