/**
 * MRP:8:1 — Unified Executive Workspace Registry + Catalog Contract.
 *
 * Registry describes. Dashboard decides. Workspace renders. Assistant requests.
 * Registry owns metadata only — never execution authority.
 */

import type { DashboardMode } from "./dashboardModeRuntimeContract.ts";
import type { ObjectPanelDashboardAction } from "../object-panel/objectPanelActionRouterContract.ts";
import type { AssistantExecutiveActionKind } from "../assistant-bridge/assistantDashboardBridgeContract.ts";

export const EXECUTIVE_WORKSPACE_REGISTRY_VERSION = "8.1.0";

export type ExecutiveWorkspaceId =
  | "overview"
  | "focus"
  | "analyze"
  | "compare"
  | "scenario"
  | "war_room"
  | "advisory"
  | "risk"
  | "timeline"
  | "simulation"
  | "decision_center"
  | "recommendations"
  | "governance"
  | "forecasting"
  | "optimization";

export type ExecutiveWorkspaceCategory =
  | "navigation"
  | "focus"
  | "analysis"
  | "comparison"
  | "planning"
  | "operations"
  | "intelligence"
  | "decision"
  | "governance"
  | "optimization";

export type ExecutiveWorkspaceAvailabilityState =
  | "available"
  | "disabled"
  | "experimental"
  | "deprecated"
  | "future";

export type ExecutiveWorkspaceLifecycleType = "persistent" | "session" | "transient";

export type ExecutiveWorkspaceOwner = "dashboard_runtime" | "workspace_ui";

export type ExecutiveWorkspaceCatalogEntry = Readonly<{
  id: ExecutiveWorkspaceId;
  name: string;
  category: ExecutiveWorkspaceCategory;
  /** Maps to NexoraWorkspaceState.dashboardMode when active. Null for future placeholders. */
  dashboardMode: DashboardMode | null;
  objectPanelAction: ObjectPanelDashboardAction | null;
  assistantAction: AssistantExecutiveActionKind | null;
  owner: ExecutiveWorkspaceOwner;
  availability: ExecutiveWorkspaceAvailabilityState;
  lifecycleType: ExecutiveWorkspaceLifecycleType;
  description: string;
  shellComponent: string | null;
  routeContract: string;
  futureCapabilityFlags: readonly string[];
}>;

export type ExecutiveWorkspaceOpenValidationInput = Readonly<{
  workspaceId?: unknown;
  dashboardMode?: unknown;
  objectPanelAction?: unknown;
  assistantAction?: unknown;
}>;

export type ExecutiveWorkspaceOpenValidationResult = Readonly<{
  valid: boolean;
  entry: ExecutiveWorkspaceCatalogEntry | null;
  reason: string;
}>;

const loggedBrakes = new Set<string>();

export function warnWorkspaceRegistryBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[WorkspaceRegistry][Brake]", { message, ...detail });
}

export function resetExecutiveWorkspaceRegistryForTests(): void {
  loggedBrakes.clear();
}

export const EXECUTIVE_WORKSPACE_CATALOG: Readonly<
  Record<ExecutiveWorkspaceId, ExecutiveWorkspaceCatalogEntry>
> = Object.freeze({
  overview: Object.freeze({
    id: "overview",
    name: "Overview",
    category: "navigation",
    dashboardMode: "overview",
    objectPanelAction: null,
    assistantAction: null,
    owner: "dashboard_runtime",
    availability: "available",
    lifecycleType: "persistent",
    description: "Default dashboard landing — executive summary and intelligence accordion.",
    shellComponent: null,
    routeContract: "dashboardModeRuntimeContract.ts",
    futureCapabilityFlags: Object.freeze([]),
  }),
  focus: Object.freeze({
    id: "focus",
    name: "Focus",
    category: "focus",
    dashboardMode: "focus",
    objectPanelAction: "focus",
    assistantAction: "FOCUS_OBJECT",
    owner: "workspace_ui",
    availability: "available",
    lifecycleType: "session",
    description: "Single-object executive focus workspace.",
    shellComponent: "FocusModeSurface",
    routeContract: "focus/focusModeContract.ts",
    futureCapabilityFlags: Object.freeze([]),
  }),
  analyze: Object.freeze({
    id: "analyze",
    name: "Analyze",
    category: "analysis",
    dashboardMode: "analyze",
    objectPanelAction: "analyze",
    assistantAction: "OPEN_ANALYZE",
    owner: "workspace_ui",
    availability: "available",
    lifecycleType: "session",
    description: "Object-scoped analysis workspace shell.",
    shellComponent: "AnalyzeWorkspaceShell",
    routeContract: "analyze/analyzeModeContract.ts",
    futureCapabilityFlags: Object.freeze([]),
  }),
  compare: Object.freeze({
    id: "compare",
    name: "Compare",
    category: "comparison",
    dashboardMode: "compare",
    objectPanelAction: "compare",
    assistantAction: "OPEN_COMPARE",
    owner: "workspace_ui",
    availability: "available",
    lifecycleType: "session",
    description: "Executive comparison workspace shell.",
    shellComponent: "CompareWorkspaceShell",
    routeContract: "compare/compareModeContract.ts",
    futureCapabilityFlags: Object.freeze([]),
  }),
  scenario: Object.freeze({
    id: "scenario",
    name: "Scenario",
    category: "planning",
    dashboardMode: "scenario",
    objectPanelAction: "scenario",
    assistantAction: "OPEN_SCENARIO",
    owner: "workspace_ui",
    availability: "available",
    lifecycleType: "session",
    description: "Scenario executive workspace foundation — explores possible futures only.",
    shellComponent: "ScenarioWorkspace",
    routeContract: "scenario/scenarioWorkspaceContract.ts",
    futureCapabilityFlags: Object.freeze(["future_simulation", "decision_comparison"]),
  }),
  war_room: Object.freeze({
    id: "war_room",
    name: "War Room",
    category: "operations",
    dashboardMode: "war_room",
    objectPanelAction: "war_room",
    assistantAction: "OPEN_WARROOM",
    owner: "workspace_ui",
    availability: "available",
    lifecycleType: "session",
    description: "War Room executive workspace foundation — owns commitment only.",
    shellComponent: "WarRoomWorkspace",
    routeContract: "warRoom/warRoomWorkspaceContract.ts",
    futureCapabilityFlags: Object.freeze([]),
  }),
  advisory: Object.freeze({
    id: "advisory",
    name: "Advisory",
    category: "decision",
    dashboardMode: "advisory",
    objectPanelAction: "advisory",
    assistantAction: null,
    owner: "workspace_ui",
    availability: "available",
    lifecycleType: "session",
    description: "Executive advisory workspace — recommendation intelligence inside MRP Dynamic Workspace.",
    shellComponent: "AdvisoryWorkspace",
    routeContract: "advisory/advisoryWorkspaceContract.ts",
    futureCapabilityFlags: Object.freeze(["advisory_suggestions", "recommendation_explainability"]),
  }),
  risk: Object.freeze({
    id: "risk",
    name: "Risk",
    category: "intelligence",
    dashboardMode: "risk",
    objectPanelAction: null,
    assistantAction: "OPEN_RISK",
    owner: "workspace_ui",
    availability: "available",
    lifecycleType: "session",
    description: "Risk executive workspace foundation — placeholder sections only.",
    shellComponent: "RiskWorkspace",
    routeContract: "risk/riskWorkspaceContract.ts",
    futureCapabilityFlags: Object.freeze(["risk_intelligence", "exposure_tracking"]),
  }),
  timeline: Object.freeze({
    id: "timeline",
    name: "Timeline",
    category: "intelligence",
    dashboardMode: "timeline",
    objectPanelAction: null,
    assistantAction: "OPEN_TIMELINE",
    owner: "workspace_ui",
    availability: "available",
    lifecycleType: "session",
    description: "Timeline executive workspace foundation — placeholder sections only.",
    shellComponent: "TimelineWorkspace",
    routeContract: "timeline/timelineWorkspaceContract.ts",
    futureCapabilityFlags: Object.freeze(["temporal_awareness", "decision_windows"]),
  }),
  simulation: Object.freeze({
    id: "simulation",
    name: "Simulation",
    category: "planning",
    dashboardMode: null,
    objectPanelAction: null,
    assistantAction: "OPEN_SIMULATION",
    owner: "workspace_ui",
    availability: "future",
    lifecycleType: "session",
    description: "Future simulation executive workspace — placeholder only.",
    shellComponent: null,
    routeContract: "simulation/simulationModeContract.ts",
    futureCapabilityFlags: Object.freeze(["scenario_simulation", "branching"]),
  }),
  decision_center: Object.freeze({
    id: "decision_center",
    name: "Decision Center",
    category: "decision",
    dashboardMode: null,
    objectPanelAction: null,
    assistantAction: "OPEN_DECISION_CENTER",
    owner: "workspace_ui",
    availability: "future",
    lifecycleType: "session",
    description: "Future decision center workspace — placeholder only.",
    shellComponent: null,
    routeContract: "decisionCenter/decisionCenterModeContract.ts",
    futureCapabilityFlags: Object.freeze(["decision_guidance", "tradeoff_analysis"]),
  }),
  recommendations: Object.freeze({
    id: "recommendations",
    name: "Recommendations",
    category: "decision",
    dashboardMode: null,
    objectPanelAction: null,
    assistantAction: "OPEN_RECOMMENDATIONS",
    owner: "workspace_ui",
    availability: "future",
    lifecycleType: "transient",
    description: "Future recommendations workspace — placeholder only.",
    shellComponent: null,
    routeContract: "recommendations/recommendationsModeContract.ts",
    futureCapabilityFlags: Object.freeze(["advisory_suggestions"]),
  }),
  governance: Object.freeze({
    id: "governance",
    name: "Governance",
    category: "governance",
    dashboardMode: "governance",
    objectPanelAction: null,
    assistantAction: null,
    owner: "workspace_ui",
    availability: "available",
    lifecycleType: "session",
    description:
      "Governance executive workspace — compliance review for policies, constraints, approval rules, and executive authority.",
    shellComponent: "GovernanceWorkspace",
    routeContract: "governance/governanceWorkspaceContract.ts",
    futureCapabilityFlags: Object.freeze(["policy_constraints", "accountability", "approval_workflow"]),
  }),
  forecasting: Object.freeze({
    id: "forecasting",
    name: "Forecasting",
    category: "intelligence",
    dashboardMode: null,
    objectPanelAction: null,
    assistantAction: null,
    owner: "workspace_ui",
    availability: "future",
    lifecycleType: "session",
    description: "Future forecasting executive workspace — placeholder only.",
    shellComponent: null,
    routeContract: "forecasting/forecastingModeContract.ts",
    futureCapabilityFlags: Object.freeze(["trajectory_projection", "predictive_signals"]),
  }),
  optimization: Object.freeze({
    id: "optimization",
    name: "Optimization",
    category: "optimization",
    dashboardMode: null,
    objectPanelAction: null,
    assistantAction: null,
    owner: "workspace_ui",
    availability: "future",
    lifecycleType: "session",
    description: "Future optimization executive workspace — placeholder only.",
    shellComponent: null,
    routeContract: "optimization/optimizationModeContract.ts",
    futureCapabilityFlags: Object.freeze(["resource_allocation", "efficiency_signals"]),
  }),
});

export function listExecutiveWorkspaceIds(): readonly ExecutiveWorkspaceId[] {
  return Object.freeze(Object.keys(EXECUTIVE_WORKSPACE_CATALOG) as ExecutiveWorkspaceId[]);
}

export function getExecutiveWorkspaceEntry(
  id: ExecutiveWorkspaceId
): ExecutiveWorkspaceCatalogEntry {
  return EXECUTIVE_WORKSPACE_CATALOG[id];
}

export function resolveExecutiveWorkspaceByDashboardMode(
  mode: DashboardMode
): ExecutiveWorkspaceCatalogEntry | null {
  for (const entry of Object.values(EXECUTIVE_WORKSPACE_CATALOG)) {
    if (entry.dashboardMode === mode) return entry;
  }
  return null;
}

export function resolveExecutiveWorkspaceByObjectPanelAction(
  action: ObjectPanelDashboardAction
): ExecutiveWorkspaceCatalogEntry | null {
  for (const entry of Object.values(EXECUTIVE_WORKSPACE_CATALOG)) {
    if (entry.objectPanelAction === action) return entry;
  }
  return null;
}

export function resolveExecutiveWorkspaceByAssistantAction(
  action: AssistantExecutiveActionKind
): ExecutiveWorkspaceCatalogEntry | null {
  for (const entry of Object.values(EXECUTIVE_WORKSPACE_CATALOG)) {
    if (entry.assistantAction === action) return entry;
  }
  return null;
}

export function isDedicatedExecutiveWorkspaceMode(mode: DashboardMode): boolean {
  const entry = resolveExecutiveWorkspaceByDashboardMode(mode);
  return entry !== null && entry.id !== "overview" && entry.availability === "available";
}

export function isExecutiveWorkspaceOpenable(entry: ExecutiveWorkspaceCatalogEntry): boolean {
  return (
    entry.availability === "available" &&
    entry.dashboardMode !== null &&
    entry.id !== "overview"
  );
}

export function validateExecutiveWorkspaceOpenRequest(
  input: ExecutiveWorkspaceOpenValidationInput
): ExecutiveWorkspaceOpenValidationResult {
  let entry: ExecutiveWorkspaceCatalogEntry | null = null;

  if (typeof input.workspaceId === "string") {
    const id = input.workspaceId.trim().toLowerCase() as ExecutiveWorkspaceId;
    entry = EXECUTIVE_WORKSPACE_CATALOG[id] ?? null;
    if (!entry) {
      warnWorkspaceRegistryBrake("Missing workspace definition.", { workspaceId: input.workspaceId });
      return Object.freeze({ valid: false, entry: null, reason: "missing_workspace_definition" });
    }
  } else if (typeof input.dashboardMode === "string") {
    entry = resolveExecutiveWorkspaceByDashboardMode(
      input.dashboardMode.trim().toLowerCase() as DashboardMode
    );
    if (!entry) {
      warnWorkspaceRegistryBrake("Registry mismatch.", { dashboardMode: input.dashboardMode });
      return Object.freeze({ valid: false, entry: null, reason: "registry_mismatch" });
    }
  } else if (typeof input.objectPanelAction === "string") {
    entry = resolveExecutiveWorkspaceByObjectPanelAction(
      input.objectPanelAction.trim().toLowerCase() as ObjectPanelDashboardAction
    );
    if (!entry) {
      warnWorkspaceRegistryBrake("Invalid route.", { objectPanelAction: input.objectPanelAction });
      return Object.freeze({ valid: false, entry: null, reason: "invalid_route" });
    }
  } else if (typeof input.assistantAction === "string") {
    entry = resolveExecutiveWorkspaceByAssistantAction(
      input.assistantAction.trim().toUpperCase() as AssistantExecutiveActionKind
    );
    if (!entry) {
      warnWorkspaceRegistryBrake("Invalid route.", { assistantAction: input.assistantAction });
      return Object.freeze({ valid: false, entry: null, reason: "invalid_route" });
    }
  } else {
    warnWorkspaceRegistryBrake("Missing workspace definition.");
    return Object.freeze({ valid: false, entry: null, reason: "missing_workspace_definition" });
  }

  if (entry.availability === "future") {
    warnWorkspaceRegistryBrake("Invalid lifecycle state.", {
      workspaceId: entry.id,
      availability: entry.availability,
    });
    return Object.freeze({ valid: false, entry, reason: "workspace_not_available" });
  }

  if (entry.availability === "disabled" || entry.availability === "deprecated") {
    warnWorkspaceRegistryBrake("Invalid lifecycle state.", {
      workspaceId: entry.id,
      availability: entry.availability,
    });
    return Object.freeze({ valid: false, entry, reason: "workspace_disabled" });
  }

  if (!entry.dashboardMode) {
    warnWorkspaceRegistryBrake("Invalid route.", { workspaceId: entry.id });
    return Object.freeze({ valid: false, entry, reason: "invalid_route" });
  }

  if (entry.owner !== "workspace_ui" && entry.id !== "overview") {
    warnWorkspaceRegistryBrake("Unauthorized workspace ownership.", {
      workspaceId: entry.id,
      owner: entry.owner,
    });
    return Object.freeze({ valid: false, entry, reason: "unauthorized_workspace_ownership" });
  }

  return Object.freeze({ valid: true, entry, reason: "workspace_validated" });
}

export function detectDuplicateExecutiveWorkspaceDefinitions(): readonly string[] {
  const duplicates: string[] = [];
  const dashboardModeMap = new Map<string, string>();
  const panelActionMap = new Map<string, string>();
  const assistantActionMap = new Map<string, string>();

  for (const entry of Object.values(EXECUTIVE_WORKSPACE_CATALOG)) {
    if (entry.dashboardMode) {
      const existing = dashboardModeMap.get(entry.dashboardMode);
      if (existing) {
        duplicates.push(`dashboardMode:${entry.dashboardMode}:${existing}+${entry.id}`);
        warnWorkspaceRegistryBrake("Duplicate workspace ID.", {
          field: "dashboardMode",
          value: entry.dashboardMode,
          existing,
          duplicate: entry.id,
        });
      } else {
        dashboardModeMap.set(entry.dashboardMode, entry.id);
      }
    }
    if (entry.objectPanelAction) {
      const existing = panelActionMap.get(entry.objectPanelAction);
      if (existing) {
        duplicates.push(`objectPanelAction:${entry.objectPanelAction}:${existing}+${entry.id}`);
      } else {
        panelActionMap.set(entry.objectPanelAction, entry.id);
      }
    }
    if (entry.assistantAction) {
      const existing = assistantActionMap.get(entry.assistantAction);
      if (existing) {
        duplicates.push(`assistantAction:${entry.assistantAction}:${existing}+${entry.id}`);
      } else {
        assistantActionMap.set(entry.assistantAction, entry.id);
      }
    }
  }

  return Object.freeze(duplicates);
}
