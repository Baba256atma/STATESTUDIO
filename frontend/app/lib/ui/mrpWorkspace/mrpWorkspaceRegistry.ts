/**
 * MRP:3:4 — Canonical MRP workspace registry (Section C).
 */

import type {
  MrpWorkspaceId,
  MrpWorkspaceRegistryEntry,
} from "./mrpWorkspaceLoaderContract.ts";

export const MRP_WORKSPACE_IDS: readonly MrpWorkspaceId[] = Object.freeze([
  "executive_summary",
  "operational",
  "risk",
  "timeline",
  "compare",
  "scenario",
  "war_room",
  "advisory",
  "governance",
]);

export const MRP_WORKSPACE_REGISTRY: Readonly<Record<MrpWorkspaceId, MrpWorkspaceRegistryEntry>> =
  Object.freeze({
    executive_summary: Object.freeze({
      id: "executive_summary",
      title: "Executive Summary",
      description: "Executive system condition scan — 5–10 second overview.",
      loaderStatus: "foundation",
      mountTarget: "executive_summary_workspace",
    }),
    operational: Object.freeze({
      id: "operational",
      title: "Operational",
      description: "Operational condition scan for selected scope — foundation mount.",
      loaderStatus: "foundation",
      mountTarget: "operational_workspace",
    }),
    risk: Object.freeze({
      id: "risk",
      title: "Risk",
      description: "Risk posture overview — foundation mount.",
      loaderStatus: "foundation",
      mountTarget: "risk_workspace",
    }),
    timeline: Object.freeze({
      id: "timeline",
      title: "Timeline",
      description: "Timeline posture overview — foundation mount.",
      loaderStatus: "foundation",
      mountTarget: "timeline_workspace",
    }),
    compare: Object.freeze({
      id: "compare",
      title: "Compare",
      description: "Compare workspace — dashboard runtime comparison mount.",
      loaderStatus: "delegated",
      mountTarget: "dashboard_runtime",
    }),
    scenario: Object.freeze({
      id: "scenario",
      title: "Scenario",
      description: "Scenario exploration workspace — foundation mount.",
      loaderStatus: "foundation",
      mountTarget: "scenario_workspace",
    }),
    war_room: Object.freeze({
      id: "war_room",
      title: "War Room",
      description: "War room commitment workspace — foundation mount.",
      loaderStatus: "foundation",
      mountTarget: "war_room_workspace",
    }),
    advisory: Object.freeze({
      id: "advisory",
      title: "Advisory",
      description: "Executive advisory workspace — recommendation foundation mount.",
      loaderStatus: "foundation",
      mountTarget: "advisory_workspace",
    }),
    governance: Object.freeze({
      id: "governance",
      title: "Governance",
      description: "Governance compliance workspace — approval, policy, and authority foundation mount.",
      loaderStatus: "foundation",
      mountTarget: "governance_workspace",
    }),
  });

export function getMrpWorkspaceRegistryEntry(
  workspaceId: MrpWorkspaceId
): MrpWorkspaceRegistryEntry {
  return MRP_WORKSPACE_REGISTRY[workspaceId];
}

export function listMrpWorkspaceRegistryEntries(): readonly MrpWorkspaceRegistryEntry[] {
  return MRP_WORKSPACE_IDS.map((id) => MRP_WORKSPACE_REGISTRY[id]);
}

export function isMrpWorkspaceId(value: unknown): value is MrpWorkspaceId {
  return typeof value === "string" && (MRP_WORKSPACE_IDS as readonly string[]).includes(value);
}

export function resetMrpWorkspaceRegistryForTests(): void {
  // Registry is frozen — test helper reserved for future mutable registries.
}
