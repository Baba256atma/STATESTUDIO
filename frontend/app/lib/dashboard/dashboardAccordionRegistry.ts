/**
 * Dashboard Accordion Registry — canonical panel definitions for executive surfaces.
 */

import type { DashboardAccordionPanelType } from "./dashboardAccordionPanelContract.ts";
import { getDashboardSurfaceEntry } from "./dashboardSurfaceRegistry.ts";
import { reportDashboardAccordionRegistry } from "./dashboardAccordionLogging.ts";

export type DashboardAccordionRegistryEntry = Readonly<{
  panelType: DashboardAccordionPanelType;
  defaultPriority: number;
  defaultStatus: string;
  defaultSummary: string;
  defaultIndicators: readonly string[];
  iconKey: string;
  intelligenceDomain: string;
}>;

export const DASHBOARD_ACCORDION_REGISTRY_VERSION = "3.3.0";

/** Higher priority value sorts earlier (more executive-critical). */
export const DASHBOARD_ACCORDION_REGISTRY: Readonly<Record<DashboardAccordionPanelType, DashboardAccordionRegistryEntry>> =
  Object.freeze({
    risk: Object.freeze({
      panelType: "risk",
      defaultPriority: 100,
      defaultStatus: "Monitoring",
      defaultSummary: "Active risks and propagation posture.",
      defaultIndicators: ["risk_level", "fragility"],
      iconKey: "risk",
      intelligenceDomain: "risk",
    }),
    operational: Object.freeze({
      panelType: "operational",
      defaultPriority: 90,
      defaultStatus: "Live",
      defaultSummary: "Operational signals and executive status.",
      defaultIndicators: ["ops_health", "signal_count"],
      iconKey: "operational",
      intelligenceDomain: "operational",
    }),
    war_room: Object.freeze({
      panelType: "war_room",
      defaultPriority: 95,
      defaultStatus: "Standby",
      defaultSummary: "War room decision support and pressure paths.",
      defaultIndicators: ["pressure_paths", "response_options"],
      iconKey: "war_room",
      intelligenceDomain: "war_room",
    }),
    timeline: Object.freeze({
      panelType: "timeline",
      defaultPriority: 80,
      defaultStatus: "Tracking",
      defaultSummary: "Timeline state and temporal decision context.",
      defaultIndicators: ["timeline_state", "milestones"],
      iconKey: "timeline",
      intelligenceDomain: "timeline",
    }),
    decision_guidance: Object.freeze({
      panelType: "decision_guidance",
      defaultPriority: 72,
      defaultStatus: "Guiding",
      defaultSummary: "Unified executive decision preparation workspace.",
      defaultIndicators: ["decision_focus", "guidance_state"],
      iconKey: "decision_guidance",
      intelligenceDomain: "decision_guidance",
    }),
    governance: Object.freeze({
      panelType: "governance",
      defaultPriority: 71,
      defaultStatus: "Evaluating",
      defaultSummary: "Institutional alignment, constraints, and accountability awareness.",
      defaultIndicators: ["governance_alignment", "governance_attention"],
      iconKey: "governance",
      intelligenceDomain: "governance",
    }),
    strategic_alignment: Object.freeze({
      panelType: "strategic_alignment",
      defaultPriority: 69,
      defaultStatus: "Aligning",
      defaultSummary: "Strategic objectives, direction, and institutional alignment evaluation.",
      defaultIndicators: ["alignment_score", "strategic_attention"],
      iconKey: "strategic_alignment",
      intelligenceDomain: "strategic_alignment",
    }),
    policy_constraint: Object.freeze({
      panelType: "policy_constraint",
      defaultPriority: 68,
      defaultStatus: "Evaluating",
      defaultSummary: "Policy boundaries, constraints, and institutional guardrail awareness.",
      defaultIndicators: ["policy_alignment", "constraint_severity"],
      iconKey: "policy_constraint",
      intelligenceDomain: "policy_constraint",
    }),
    stakeholder_intelligence: Object.freeze({
      panelType: "stakeholder_intelligence",
      defaultPriority: 67,
      defaultStatus: "Mapping",
      defaultSummary: "Organizational impact, alignment, tension, and stakeholder awareness.",
      defaultIndicators: ["stakeholder_impact", "stakeholder_attention"],
      iconKey: "stakeholder_intelligence",
      intelligenceDomain: "stakeholder_intelligence",
    }),
    consensus_intelligence: Object.freeze({
      panelType: "consensus_intelligence",
      defaultPriority: 66,
      defaultStatus: "Evaluating",
      defaultSummary: "Institutional alignment, convergence, divergence, and consensus attention.",
      defaultIndicators: ["consensus_level", "consensus_attention"],
      iconKey: "consensus_intelligence",
      intelligenceDomain: "consensus_intelligence",
    }),
    institutional_alignment: Object.freeze({
      panelType: "institutional_alignment",
      defaultPriority: 65,
      defaultStatus: "Command",
      defaultSummary: "Executive institutional command center — organizational coherence awareness.",
      defaultIndicators: ["institutional_health", "institutional_attention"],
      iconKey: "institutional_alignment",
      intelligenceDomain: "institutional_alignment",
    }),
    decision: Object.freeze({
      panelType: "decision",
      defaultPriority: 70,
      defaultStatus: "Ready",
      defaultSummary: "Decision options and council posture.",
      defaultIndicators: ["decision_options", "council_state"],
      iconKey: "decision",
      intelligenceDomain: "decision",
    }),
    scenario: Object.freeze({
      panelType: "scenario",
      defaultPriority: 75,
      defaultStatus: "Comparing",
      defaultSummary: "Scenario branches and comparison intelligence.",
      defaultIndicators: ["branch_count", "compare_state"],
      iconKey: "scenario",
      intelligenceDomain: "scenario",
    }),
    executive_summary: Object.freeze({
      panelType: "executive_summary",
      defaultPriority: 60,
      defaultStatus: "Overview",
      defaultSummary: "Executive-level overview and decision momentum.",
      defaultIndicators: ["momentum", "posture"],
      iconKey: "executive_summary",
      intelligenceDomain: "executive_summary",
    }),
  });

let registryLogged = false;

export function getDashboardAccordionRegistryEntry(
  panelType: DashboardAccordionPanelType
): DashboardAccordionRegistryEntry {
  return DASHBOARD_ACCORDION_REGISTRY[panelType];
}

export function listDashboardAccordionPanelTypes(): readonly DashboardAccordionPanelType[] {
  return Object.freeze(Object.keys(DASHBOARD_ACCORDION_REGISTRY) as DashboardAccordionPanelType[]);
}

export function resolveAccordionPanelTitle(panelType: DashboardAccordionPanelType): string {
  return getDashboardSurfaceEntry(panelType).title;
}

export function initializeDashboardAccordionRegistry(): void {
  if (registryLogged) return;
  registryLogged = true;
  reportDashboardAccordionRegistry({
    version: DASHBOARD_ACCORDION_REGISTRY_VERSION,
    panelCount: listDashboardAccordionPanelTypes().length,
    panelTypes: listDashboardAccordionPanelTypes(),
  });
}

export function resetDashboardAccordionRegistryForTests(): void {
  registryLogged = false;
}
