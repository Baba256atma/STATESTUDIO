/**
 * Standard Dashboard Accordion Panel Contract — Phase 3:3.
 * All dashboard surfaces must use this contract; no custom panel contracts.
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { DashboardSurfaceId } from "./dashboardSurfaceRegistry.ts";
import type { NormalizedDashboardContext } from "./dashboardContextTypes.ts";
import type { DashboardSurfaceVisualBundle } from "./dashboardVisualSignalContract.ts";

export const DASHBOARD_ACCORDION_CONTRACT_VERSION = "3.5.0";

export const CANONICAL_DASHBOARD_ACCORDION_OWNER = "dashboardAccordionRuntime";

export type DashboardAccordionPanelType = DashboardSurfaceId;

export type DashboardAccordionExpansionState = "expanded" | "collapsed";

export type DashboardAccordionPanelHeader = Readonly<{
  title: string;
  status: string;
  summary: string;
  indicators: readonly string[];
  iconKey: string;
}>;

export type DashboardAccordionPanelContext = Readonly<{
  dashboardContext: DashboardContext;
  normalizedContextId: string | null;
  objectId: string | null;
  scenarioId: string | null;
  reason: string | null;
}>;

export type DashboardAccordionPanelContract = Readonly<{
  panelId: string;
  panelType: DashboardAccordionPanelType;
  priority: number;
  header: DashboardAccordionPanelHeader;
  /** Phase 3:5 — executive visual signals for header + body micro charts. */
  visualBundle: DashboardSurfaceVisualBundle;
  panelContext: DashboardAccordionPanelContext;
  expansionState: DashboardAccordionExpansionState;
  /** Structural body slot — populated by accordion runtime / surface delegates. */
  bodySlot:
    | "placeholder"
    | "executive_delegate"
    | "visual_signal"
    | "operational_intelligence"
    | "risk_intelligence"
    | "timeline_intelligence"
    | "scenario_intelligence"
    | "war_room_intelligence"
    | "executive_advisory"
    | "decision_guidance"
    | "governance_intelligence"
    | "strategic_alignment_intelligence"
    | "policy_constraint_intelligence"
    | "stakeholder_intelligence"
    | "consensus_intelligence"
    | "institutional_alignment";
}>;

export type DashboardAccordionRuntimeState = Readonly<{
  contextSignature: string;
  panels: readonly DashboardAccordionPanelContract[];
  expandedPanelIds: readonly string[];
}>;

export type DashboardAccordionPanelAction =
  | { type: "expand_one"; panelId: string }
  | { type: "collapse_one"; panelId: string }
  | { type: "expand_multiple"; panelIds: readonly string[] }
  | { type: "collapse_all" }
  | { type: "toggle"; panelId: string }
  | { type: "restore"; expansionByPanelId: Readonly<Record<string, DashboardAccordionExpansionState>> };
