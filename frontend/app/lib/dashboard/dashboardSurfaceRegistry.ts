/**
 * Dashboard Surface Registry — hosts executive intelligence surfaces.
 * Phase 6:6 activates Institutional Alignment Surface.
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import { CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID } from "./executiveSummary/executiveSummaryContract.ts";
import { reportDashboardRegistry } from "./dashboardRuntimeLogging.ts";

export type DashboardSurfaceId =
  | "operational"
  | "risk"
  | "scenario"
  | "timeline"
  | "war_room"
  | "decision"
  | "decision_guidance"
  | "governance"
  | "strategic_alignment"
  | "policy_constraint"
  | "stakeholder_intelligence"
  | "consensus_intelligence"
  | "institutional_alignment"
  | "executive_summary";

export type DashboardSurfaceStatus = "placeholder" | "active" | "delegated";

export type DashboardSurfaceEntry = Readonly<{
  id: DashboardSurfaceId;
  title: string;
  description: string;
  status: DashboardSurfaceStatus;
  intelligenceDomain: string;
  surfaceComponent?: string;
}>;

export const DASHBOARD_SURFACE_REGISTRY_VERSION = "6.6.0";

export const CANONICAL_DASHBOARD_DEFAULT_LANDING_SURFACE_ID = CANONICAL_EXECUTIVE_SUMMARY_SURFACE_ID;

export const DASHBOARD_SURFACE_REGISTRY: Readonly<Record<DashboardSurfaceId, DashboardSurfaceEntry>> =
  Object.freeze({
    operational: Object.freeze({
      id: "operational",
      title: "Operational Intelligence",
      description: "Live operational awareness — health, objects, signals, pressure, and demand.",
      status: "active",
      intelligenceDomain: "operational",
      surfaceComponent: "OperationalIntelligenceSurface",
    }),
    risk: Object.freeze({
      id: "risk",
      title: "Risk Intelligence",
      description: "Executive risk awareness — exposure, momentum, confidence, and attention.",
      status: "active",
      intelligenceDomain: "risk",
      surfaceComponent: "RiskIntelligenceSurface",
    }),
    scenario: Object.freeze({
      id: "scenario",
      title: "Scenario Intelligence",
      description: "Executive scenario exploration — options, impacts, tradeoffs, and investigation paths.",
      status: "active",
      intelligenceDomain: "scenario",
      surfaceComponent: "ScenarioIntelligenceSurface",
    }),
    timeline: Object.freeze({
      id: "timeline",
      title: "Timeline Intelligence",
      description: "Temporal executive awareness — momentum, pressure, drift, and decision windows.",
      status: "active",
      intelligenceDomain: "timeline",
      surfaceComponent: "TimelineIntelligenceSurface",
    }),
    war_room: Object.freeze({
      id: "war_room",
      title: "War Room Intelligence",
      description: "Executive decision workspace — unified operational, risk, timeline, and scenario context.",
      status: "active",
      intelligenceDomain: "war_room",
      surfaceComponent: "WarRoomIntelligenceSurface",
    }),
    decision: Object.freeze({
      id: "decision",
      title: "Executive Advisory",
      description: "Structured executive guidance — focus, priorities, narrative, and investigation suggestions.",
      status: "active",
      intelligenceDomain: "advisory",
      surfaceComponent: "ExecutiveAdvisorySurface",
    }),
    decision_guidance: Object.freeze({
      id: "decision_guidance",
      title: "Decision Guidance",
      description:
        "Executive decision intelligence — advisory focus, confidence, explainability, tradeoffs, and context.",
      status: "active",
      intelligenceDomain: "decision_guidance",
      surfaceComponent: "DecisionGuidanceSurface",
    }),
    governance: Object.freeze({
      id: "governance",
      title: "Governance Intelligence",
      description:
        "Institutional alignment awareness — policies, constraints, accountability, and governance attention.",
      status: "active",
      intelligenceDomain: "governance",
      surfaceComponent: "GovernanceIntelligenceSurface",
    }),
    strategic_alignment: Object.freeze({
      id: "strategic_alignment",
      title: "Strategic Alignment",
      description:
        "Institutional direction awareness — objectives, tradeoffs, tension, and strategic attention.",
      status: "active",
      intelligenceDomain: "strategic_alignment",
      surfaceComponent: "StrategicAlignmentSurface",
    }),
    policy_constraint: Object.freeze({
      id: "policy_constraint",
      title: "Policy & Constraint Intelligence",
      description:
        "Institutional boundary awareness — policies, constraints, severity, and policy attention.",
      status: "active",
      intelligenceDomain: "policy_constraint",
      surfaceComponent: "PolicyConstraintIntelligenceSurface",
    }),
    stakeholder_intelligence: Object.freeze({
      id: "stakeholder_intelligence",
      title: "Stakeholder Intelligence",
      description:
        "Organizational impact awareness — visibility, alignment, tension, support, and stakeholder attention.",
      status: "active",
      intelligenceDomain: "stakeholder_intelligence",
      surfaceComponent: "StakeholderIntelligenceSurface",
    }),
    consensus_intelligence: Object.freeze({
      id: "consensus_intelligence",
      title: "Consensus Intelligence",
      description:
        "Institutional alignment awareness — consensus level, alignment zones, divergence, and tension.",
      status: "active",
      intelligenceDomain: "consensus_intelligence",
      surfaceComponent: "ConsensusIntelligenceSurface",
    }),
    institutional_alignment: Object.freeze({
      id: "institutional_alignment",
      title: "Institutional Alignment",
      description:
        "Executive institutional command center — governance, strategy, policy, stakeholder, and consensus coherence.",
      status: "active",
      intelligenceDomain: "institutional_alignment",
      surfaceComponent: "InstitutionalAlignmentSurface",
    }),
    executive_summary: Object.freeze({
      id: "executive_summary",
      title: "Executive Summary",
      description: "Strategic overview — what requires executive attention right now.",
      status: "active",
      intelligenceDomain: "executive_summary",
      surfaceComponent: "ExecutiveSummarySurface",
    }),
  });

const DASHBOARD_CONTEXT_TO_SURFACE: Readonly<Record<DashboardContext, DashboardSurfaceId>> = Object.freeze({
  overview: "executive_summary",
  sources: "operational",
  scenario: "scenario",
  risk: "risk",
  war_room: "war_room",
  timeline: "timeline",
  settings: "operational",
});

let registryLogged = false;

export function resolveDashboardSurfaceForContext(context: DashboardContext): DashboardSurfaceId {
  return DASHBOARD_CONTEXT_TO_SURFACE[context] ?? CANONICAL_DASHBOARD_DEFAULT_LANDING_SURFACE_ID;
}

export function resolveDefaultDashboardLandingSurface(): DashboardSurfaceId {
  return CANONICAL_DASHBOARD_DEFAULT_LANDING_SURFACE_ID;
}

export function getDashboardSurfaceEntry(surfaceId: DashboardSurfaceId): DashboardSurfaceEntry {
  return DASHBOARD_SURFACE_REGISTRY[surfaceId];
}

export function listDashboardSurfaceIds(): readonly DashboardSurfaceId[] {
  return Object.freeze(Object.keys(DASHBOARD_SURFACE_REGISTRY) as DashboardSurfaceId[]);
}

export function initializeDashboardSurfaceRegistry(): void {
  if (registryLogged) return;
  registryLogged = true;
  reportDashboardRegistry({
    version: DASHBOARD_SURFACE_REGISTRY_VERSION,
    surfaceCount: listDashboardSurfaceIds().length,
    surfaces: listDashboardSurfaceIds(),
  });
}

export function resetDashboardSurfaceRegistryForTests(): void {
  registryLogged = false;
}
