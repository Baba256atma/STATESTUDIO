/**
 * SVIE:1:3 — Phase 1 certification contract.
 *
 * Certifies SVIE Foundation (1:1) and Health Visualization Layer (1:2) without
 * regressing certified MRP, Advisory, Governance, Assistant, launcher, or topology systems.
 */

export const SVIE_PHASE1_CERTIFICATION_TAG = "[SVIE_PHASE1_CERTIFIED]" as const;

export const SVIE_PHASE1_CERTIFICATION_VERSION = "1.3.0" as const;

export type SviePhase1CertificationGateId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export type SviePhase1CertificationGateStatus = "PASS" | "FAIL" | "WARN";

export type SviePhase1CertificationGate = Readonly<{
  id: SviePhase1CertificationGateId;
  name: string;
  status: SviePhase1CertificationGateStatus;
  detail: string;
}>;

export type SviePhase1ValidationCheckId =
  | "scene_loads"
  | "objects_receive_health"
  | "topology_unchanged"
  | "object_selection_unchanged"
  | "advisory_workspace"
  | "governance_workspace"
  | "mrp_certified"
  | "assistant_certified"
  | "workspace_launcher_certified"
  | "no_route_regressions";

export type SviePhase1ValidationCheck = Readonly<{
  id: SviePhase1ValidationCheckId;
  label: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type SviePhase1CertificationResult = Readonly<{
  tag: typeof SVIE_PHASE1_CERTIFICATION_TAG;
  version: typeof SVIE_PHASE1_CERTIFICATION_VERSION;
  gates: readonly SviePhase1CertificationGate[];
  validationChecks: readonly SviePhase1ValidationCheck[];
  consoleAudit: Readonly<{
    forbiddenPatterns: readonly string[];
    violations: readonly string[];
    status: "PASS" | "FAIL";
  }>;
  runtimeWarnings: readonly string[];
  certified: boolean;
  finalStatus: "PASS" | "PASS WITH WARNINGS" | "FAIL";
}>;

/**
 * Console patterns that must not appear during certification transitions.
 *
 * Note: `[WorkspaceLauncherState][Brake]` on identical route re-click is expected
 * correct behavior (validated in MRP 5C gate D) and is not listed here.
 */
export const SVIE_PHASE1_FORBIDDEN_CONSOLE_PATTERNS: readonly string[] = Object.freeze([
  "[Nexora][DashboardRedirect]",
  "[Nexora][LegacySurfaceBlocked]",
  "[Router][INVALID_VIEW]",
  "[AdvisoryRouteMismatch]",
  "[MRP_CONTENT_STALE]",
  "[MRP_HEADER_CONTENT_MISMATCH]",
  "[TopologyPositioning][Brake]",
  "[TopologyConnection][Brake]",
  "[TopologyCamera][Brake]",
  "[Nexora][TopologyPositionMismatch]",
  "[WorkspaceLauncher][Brake]",
  "[WorkspaceEntryPoint][Brake]",
  "[WorkspaceLaunchTransition][Brake]",
  "[WorkspaceRegistry][Brake]",
]);
