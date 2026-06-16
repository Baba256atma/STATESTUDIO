/**
 * MRP:5C — Final Runtime Smoke Certification contract.
 *
 * Certification and validation only — no new features.
 */

import type { DashboardMode } from "../../dashboard/dashboardModeRuntimeContract.ts";
import type { MrpWorkspaceId } from "./mrpWorkspaceLoaderContract.ts";

export const MRP_5C_FINAL_RUNTIME_CERTIFICATION_TAG =
  "[MRP_5C_FINAL_RUNTIME_CERTIFICATION]" as const;

export const MRP_5C_CERTIFICATION_VERSION = "5C.0.0" as const;

export type Mrp5cCertificationGateId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export type Mrp5cCertificationGateStatus = "PASS" | "FAIL" | "WARN";

export type Mrp5cCertificationGate = Readonly<{
  id: Mrp5cCertificationGateId;
  name: string;
  status: Mrp5cCertificationGateStatus;
  detail: string;
}>;

export type Mrp5cCertificationResult = Readonly<{
  tag: typeof MRP_5C_FINAL_RUNTIME_CERTIFICATION_TAG;
  version: typeof MRP_5C_CERTIFICATION_VERSION;
  gates: readonly Mrp5cCertificationGate[];
  runtimeWarnings: readonly string[];
  certified: boolean;
  finalStatus: "PASS" | "PASS WITH WARNINGS" | "FAIL";
}>;

/** Expected MRP workspace for canonical dashboard modes (header ↔ content parity). */
export const MRP_5C_HEADER_CONTENT_EXPECTED: Readonly<
  Record<
    Extract<
      DashboardMode,
      "focus" | "analyze" | "compare" | "scenario" | "war_room" | "advisory" | "governance"
    >,
    MrpWorkspaceId
  >
> = Object.freeze({
  focus: "executive_summary",
  analyze: "risk",
  compare: "compare",
  scenario: "scenario",
  war_room: "war_room",
  advisory: "advisory",
  governance: "governance",
});

export const MRP_5C_HEADER_CONTENT_MOUNT_TARGETS: Readonly<
  Record<
    Extract<
      DashboardMode,
      "focus" | "analyze" | "compare" | "scenario" | "war_room" | "advisory" | "governance"
    >,
    readonly string[]
  >
> = Object.freeze({
  focus: Object.freeze(["dashboard_runtime", "executive_summary_workspace"]),
  analyze: Object.freeze(["loader_shell", "risk_workspace"]),
  compare: Object.freeze(["dashboard_runtime"]),
  scenario: Object.freeze(["scenario_workspace"]),
  war_room: Object.freeze(["war_room_workspace"]),
  advisory: Object.freeze(["advisory_workspace"]),
  governance: Object.freeze(["governance_workspace"]),
});

export const MRP_5C_FORBIDDEN_CONSOLE_PATTERNS: readonly string[] = Object.freeze([
  "[WorkspaceLauncherState][Brake]",
  "[Nexora][DashboardRedirect]",
  "[Nexora][LegacySurfaceBlocked]",
  "[Router][INVALID_VIEW]",
  "[AdvisoryRouteMismatch]",
  "[MRP_CONTENT_STALE]",
  "[MRP_HEADER_CONTENT_MISMATCH]",
]);
