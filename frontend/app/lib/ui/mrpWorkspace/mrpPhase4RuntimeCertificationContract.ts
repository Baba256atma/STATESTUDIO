/**
 * MRP:4G — Phase 4 Runtime Certification contract.
 *
 * Validates runtime integrity across all Phase 4 certified workspaces.
 * No new features — certification and freeze tags only.
 */

import type { DashboardContext } from "../mainRightPanelContract.ts";
import type { DashboardMode } from "../../dashboard/dashboardModeRuntimeContract.ts";
import type { MrpWorkspaceId, MrpWorkspaceMountTarget } from "./mrpWorkspaceLoaderContract.ts";

export const MRP_PHASE4_RUNTIME_CERTIFICATION_VERSION = "4G.1.0";

export const MRP_PHASE4_RUNTIME_CERTIFIED_TAG = "[MRP_PHASE4_RUNTIME_CERTIFIED]" as const;
export const MRP_EXECUTIVE_INTELLIGENCE_LAYER_COMPLETE_TAG =
  "[MRP_EXECUTIVE_INTELLIGENCE_LAYER_COMPLETE]" as const;

export type MrpPhase4RuntimeGateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K";

export type MrpPhase4RuntimeCertificationVerdict = "PASS" | "PASS WITH WARNINGS" | "FAIL";

export type MrpPhase4RuntimeGate = Readonly<{
  id: MrpPhase4RuntimeGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type MrpPhase4RuntimeValidationStep = Readonly<{
  step: MrpPhase4RuntimeWorkspaceId;
  dashboardMode: DashboardMode;
  dashboardContext: DashboardContext;
  expectedWorkspaceId: MrpWorkspaceId;
  expectedMountTarget: MrpWorkspaceMountTarget;
}>;

export type MrpPhase4RuntimeWorkspaceId =
  | "executive_summary"
  | "operational"
  | "risk"
  | "timeline"
  | "scenario"
  | "war_room";

export const MRP_PHASE4_CERTIFIED_WORKSPACE_IDS: readonly MrpPhase4RuntimeWorkspaceId[] =
  Object.freeze([
    "executive_summary",
    "operational",
    "risk",
    "timeline",
    "scenario",
    "war_room",
  ]);

/** Canonical validation path: Object Selection → workspaces → back → assistant → dashboard. */
export const MRP_PHASE4_RUNTIME_VALIDATION_PATH: readonly MrpPhase4RuntimeValidationStep[] =
  Object.freeze([
    Object.freeze({
      step: "executive_summary",
      dashboardMode: "overview",
      dashboardContext: "overview",
      expectedWorkspaceId: "executive_summary",
      expectedMountTarget: "executive_summary_workspace",
    }),
    Object.freeze({
      step: "operational",
      dashboardMode: "overview",
      dashboardContext: "sources",
      expectedWorkspaceId: "operational",
      expectedMountTarget: "operational_workspace",
    }),
    Object.freeze({
      step: "risk",
      dashboardMode: "overview",
      dashboardContext: "risk",
      expectedWorkspaceId: "risk",
      expectedMountTarget: "risk_workspace",
    }),
    Object.freeze({
      step: "timeline",
      dashboardMode: "overview",
      dashboardContext: "timeline",
      expectedWorkspaceId: "timeline",
      expectedMountTarget: "timeline_workspace",
    }),
    Object.freeze({
      step: "scenario",
      dashboardMode: "overview",
      dashboardContext: "scenario",
      expectedWorkspaceId: "scenario",
      expectedMountTarget: "scenario_workspace",
    }),
    Object.freeze({
      step: "war_room",
      dashboardMode: "overview",
      dashboardContext: "war_room",
      expectedWorkspaceId: "war_room",
      expectedMountTarget: "war_room_workspace",
    }),
  ]);

export type MrpPhase4RuntimeCertificationResult = Readonly<{
  verdict: MrpPhase4RuntimeCertificationVerdict;
  certifiedAt: string;
  version: string;
  gates: readonly MrpPhase4RuntimeGate[];
  warnings: readonly string[];
  blockers: readonly string[];
  validationPathSteps: number;
  certifiedWorkspaceCount: number;
  freezeTags: readonly string[];
}>;
