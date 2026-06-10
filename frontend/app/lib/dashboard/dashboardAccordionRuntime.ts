/**
 * Canonical Dashboard Accordion Runtime — single owner for panel registration,
 * ordering, expansion state, and persistence.
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "./dashboardContextTypes.ts";
import {
  CANONICAL_DASHBOARD_ACCORDION_OWNER,
  type DashboardAccordionExpansionState,
  type DashboardAccordionPanelAction,
  type DashboardAccordionPanelContract,
  type DashboardAccordionRuntimeState,
} from "./dashboardAccordionPanelContract.ts";
import { buildAccordionPanelsFromContext } from "./dashboardAccordionContextPanels.ts";
import { initializeDashboardAccordionRegistry } from "./dashboardAccordionRegistry.ts";
import {
  buildAccordionContextSignature,
  loadAccordionPersistence,
  saveAccordionPersistence,
} from "./dashboardAccordionPersistence.ts";
import {
  reportDashboardAccordion,
  reportPanelCollapsed,
  reportPanelExpanded,
} from "./dashboardAccordionLogging.ts";
import { measureDashboardOperation } from "./dashboardPerformanceMetrics.ts";
import { recordDashboardAccordionUpdateFrequency } from "./dashboardPerformanceRegression.ts";

let lastRuntimeSignature: string | null = null;

function expansionSnapshotFromPanels(
  panels: readonly DashboardAccordionPanelContract[]
): Readonly<Record<string, DashboardAccordionExpansionState>> {
  const next: Record<string, DashboardAccordionExpansionState> = {};
  for (const panel of panels) {
    next[panel.panelId] = panel.expansionState;
  }
  return Object.freeze(next);
}

function applyPanelAction(
  panels: readonly DashboardAccordionPanelContract[],
  action: DashboardAccordionPanelAction
): DashboardAccordionPanelContract[] {
  switch (action.type) {
    case "expand_one":
      return panels.map((panel) =>
        panel.panelId === action.panelId ? Object.freeze({ ...panel, expansionState: "expanded" }) : panel
      );
    case "collapse_one":
      return panels.map((panel) =>
        panel.panelId === action.panelId ? Object.freeze({ ...panel, expansionState: "collapsed" }) : panel
      );
    case "expand_multiple": {
      const expandSet = new Set(action.panelIds);
      return panels.map((panel) =>
        expandSet.has(panel.panelId) ? Object.freeze({ ...panel, expansionState: "expanded" }) : panel
      );
    }
    case "collapse_all":
      return panels.map((panel) => Object.freeze({ ...panel, expansionState: "collapsed" }));
    case "toggle":
      return panels.map((panel) =>
        panel.panelId === action.panelId
          ? Object.freeze({
              ...panel,
              expansionState: panel.expansionState === "expanded" ? "collapsed" : "expanded",
            })
          : panel
      );
    case "restore":
      return panels.map((panel) =>
        Object.freeze({
          ...panel,
          expansionState: action.expansionByPanelId[panel.panelId] ?? panel.expansionState,
        })
      );
    default:
      return [...panels];
  }
}

export function initializeDashboardAccordionRuntime(input: {
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
}): DashboardAccordionRuntimeState {
  return measureDashboardOperation(
    "accordionUpdate",
    () => {
      initializeDashboardAccordionRegistry();

      const contextSignature = buildAccordionContextSignature({
        dashboardContext: input.dashboardContext,
        normalizedContextId: input.normalizedContext?.id ?? null,
      });

      const persistedExpansion = loadAccordionPersistence(contextSignature);
      const panels = buildAccordionPanelsFromContext({
        dashboardContext: input.dashboardContext,
        normalizedContext: input.normalizedContext,
        persistedExpansion,
        contextSignature,
      });

      const runtimeSignature = `${contextSignature}:${panels.map((panel) => panel.panelId).join("|")}`;
      if (lastRuntimeSignature !== runtimeSignature) {
        lastRuntimeSignature = runtimeSignature;
        reportDashboardAccordion({
          phase: "runtime_init",
          owner: CANONICAL_DASHBOARD_ACCORDION_OWNER,
          contextSignature,
          panelCount: panels.length,
          expandedPanelIds: panels
            .filter((panel) => panel.expansionState === "expanded")
            .map((panel) => panel.panelId),
        });
      }

      return Object.freeze({
        contextSignature,
        panels: Object.freeze(panels),
        expandedPanelIds: Object.freeze(
          panels.filter((panel) => panel.expansionState === "expanded").map((panel) => panel.panelId)
        ),
      });
    },
    { phase: "accordion_runtime_init", dashboardContext: input.dashboardContext }
  );
}

export function reduceDashboardAccordionRuntime(
  state: DashboardAccordionRuntimeState,
  action: DashboardAccordionPanelAction
): DashboardAccordionRuntimeState {
  const panels = applyPanelAction(state.panels, action);
  const snapshot = expansionSnapshotFromPanels(panels);
  saveAccordionPersistence(state.contextSignature, snapshot);

  const expandedPanels = panels.filter((panel) => panel.expansionState === "expanded");

  if (action.type === "expand_one" || action.type === "expand_multiple" || action.type === "toggle") {
    const targetId =
      action.type === "expand_multiple"
        ? action.panelIds[action.panelIds.length - 1]
        : action.type === "toggle" || action.type === "expand_one"
          ? action.panelId
          : null;
    const target = targetId ? panels.find((panel) => panel.panelId === targetId) : null;
    if (target && target.expansionState === "expanded") {
      reportPanelExpanded({
        panelId: target.panelId,
        panelType: target.panelType,
        contextSignature: state.contextSignature,
        expandedCount: expandedPanels.length,
      });
    }
  }

  if (action.type === "collapse_one" || action.type === "collapse_all" || action.type === "toggle") {
    const targetId = action.type === "collapse_all" ? null : action.panelId;
    const target = targetId ? panels.find((panel) => panel.panelId === targetId) : null;
    if (action.type === "collapse_all" || (target && target.expansionState === "collapsed")) {
      reportPanelCollapsed({
        panelId: target?.panelId ?? "all",
        panelType: target?.panelType ?? "all",
        contextSignature: state.contextSignature,
        expandedCount: expandedPanels.length,
      });
    }
  }

  recordDashboardAccordionUpdateFrequency({
    action: action.type,
    contextSignature: state.contextSignature,
    expandedCount: expandedPanels.length,
  });

  return Object.freeze({
    contextSignature: state.contextSignature,
    panels: Object.freeze(panels),
    expandedPanelIds: Object.freeze(expandedPanels.map((panel) => panel.panelId)),
  });
}

export function expandAccordionPanel(
  state: DashboardAccordionRuntimeState,
  panelId: string
): DashboardAccordionRuntimeState {
  return reduceDashboardAccordionRuntime(state, { type: "expand_one", panelId });
}

export function collapseAccordionPanel(
  state: DashboardAccordionRuntimeState,
  panelId: string
): DashboardAccordionRuntimeState {
  return reduceDashboardAccordionRuntime(state, { type: "collapse_one", panelId });
}

export function expandAccordionPanels(
  state: DashboardAccordionRuntimeState,
  panelIds: readonly string[]
): DashboardAccordionRuntimeState {
  return reduceDashboardAccordionRuntime(state, { type: "expand_multiple", panelIds });
}

export function collapseAllAccordionPanels(
  state: DashboardAccordionRuntimeState
): DashboardAccordionRuntimeState {
  return reduceDashboardAccordionRuntime(state, { type: "collapse_all" });
}

export function toggleAccordionPanel(
  state: DashboardAccordionRuntimeState,
  panelId: string
): DashboardAccordionRuntimeState {
  return reduceDashboardAccordionRuntime(state, { type: "toggle", panelId });
}

export function resetDashboardAccordionRuntimeForTests(): void {
  lastRuntimeSignature = null;
}
