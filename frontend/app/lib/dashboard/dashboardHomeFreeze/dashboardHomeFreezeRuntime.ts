/**
 * MRP:10:10 — Dashboard Home freeze runtime validation and drift detection.
 */

import {
  DASHBOARD_HOME_CANONICAL_SECTION_ORDER,
  DASHBOARD_HOME_LAYOUT_ZONES,
  type DashboardHomeLayoutSectionId,
} from "../dashboardHomeLayout/dashboardHomeLayoutContract.ts";
import { validateDashboardHomeSectionOrder } from "../dashboardHomeLayout/dashboardHomeLayoutRuntime.ts";
import { CANONICAL_DASHBOARD_MODE_OWNER, DEFAULT_DASHBOARD_MODE } from "../dashboardModeRuntimeContract.ts";
import { MAIN_RIGHT_PANEL_TABS } from "../../ui/mainRightPanelContract.ts";
import { OBJECT_PANEL_DASHBOARD_ACTIONS } from "../../object-panel/objectPanelActionRouterContract.ts";
import { runDashboardHomeRuntimeQaMatrix } from "../dashboardHomeRuntimeQa/dashboardHomeRuntimeQaValidation.ts";
import {
  CANONICAL_DASHBOARD_HOME_MODE,
  CANONICAL_DASHBOARD_HOME_OWNER,
  DASHBOARD_HOME_ASSISTANT_INTEGRATION,
  DASHBOARD_HOME_EXECUTIVE_RESPONSIBILITIES,
  DASHBOARD_HOME_FREEZE_VERSION,
  DASHBOARD_HOME_FROZEN_CONTRACTS,
  DASHBOARD_HOME_FROZEN_HIERARCHY,
  DASHBOARD_HOME_FUTURE_EXTENSION_RULES,
  DASHBOARD_HOME_MVP_APPROVAL_STATUS,
  DASHBOARD_HOME_OBJECT_PANEL_INTEGRATION,
  DASHBOARD_HOME_OUT_OF_SCOPE,
  DASHBOARD_HOME_PERFORMANCE_FREEZE,
  DASHBOARD_HOME_ROUTING_FREEZE,
  DASHBOARD_HOME_UX_FREEZE,
  warnDashboardHomeFreezeBrake,
} from "./dashboardHomeFreezeContract.ts";
import { DASHBOARD_HOME_FREEZE_DEPRECATED } from "./dashboardHomeFreezeLegacyFindings.ts";

export type DashboardHomeFreezeCheckStatus = "pass" | "warning" | "fail";

export type DashboardHomeFreezeCheck = Readonly<{
  id: string;
  domain:
    | "hierarchy"
    | "ownership"
    | "routing"
    | "object_panel"
    | "assistant"
    | "ux"
    | "performance"
    | "legacy"
    | "contracts"
    | "qa";
  status: DashboardHomeFreezeCheckStatus;
  evidence: string;
}>;

export type DashboardHomeFreezeCertification = Readonly<{
  version: typeof DASHBOARD_HOME_FREEZE_VERSION;
  mvpStatus: typeof DASHBOARD_HOME_MVP_APPROVAL_STATUS;
  checks: readonly DashboardHomeFreezeCheck[];
  passCount: number;
  warningCount: number;
  failCount: number;
  verdict: "PASS" | "PASS_WITH_WARNINGS" | "FAIL";
}>;

export function detectDashboardHomeHierarchyDrift(
  actualSectionOrder: readonly DashboardHomeLayoutSectionId[]
): Readonly<{ drifted: boolean; expected: readonly DashboardHomeLayoutSectionId[]; actual: readonly DashboardHomeLayoutSectionId[] }> {
  const validation = validateDashboardHomeSectionOrder(actualSectionOrder);
  if (!validation.valid) {
    warnDashboardHomeFreezeBrake("Hierarchy drift detected.", {
      expected: validation.expectedSectionOrder,
      actual: validation.actualSectionOrder,
    });
  }
  return Object.freeze({
    drifted: !validation.valid,
    expected: validation.expectedSectionOrder,
    actual: validation.actualSectionOrder,
  });
}

export function validateDashboardHomeHierarchyFreeze(): DashboardHomeFreezeCheck[] {
  const drift = detectDashboardHomeHierarchyDrift(DASHBOARD_HOME_CANONICAL_SECTION_ORDER);
  const zoneCount = DASHBOARD_HOME_LAYOUT_ZONES.length;

  const frozenMatchesCanonical =
    JSON.stringify(DASHBOARD_HOME_FROZEN_HIERARCHY.executive_status) ===
      JSON.stringify(["executive_summary", "workspace_snapshot", "daily_readiness"]) &&
    JSON.stringify(DASHBOARD_HOME_FROZEN_HIERARCHY.executive_continuity) ===
      JSON.stringify(["recent_activity_timeline", "favorites_layer", "workspace_recovery"]);

  return [
    Object.freeze({
      id: "freeze_hierarchy_canonical_order",
      domain: "hierarchy" as const,
      status: drift.drifted ? ("fail" as const) : ("pass" as const),
      evidence: DASHBOARD_HOME_CANONICAL_SECTION_ORDER.join(" → "),
    }),
    Object.freeze({
      id: "freeze_hierarchy_four_zones",
      domain: "hierarchy" as const,
      status: zoneCount === 4 ? ("pass" as const) : ("fail" as const),
      evidence: `${zoneCount} zones frozen`,
    }),
    Object.freeze({
      id: "freeze_hierarchy_registry_matches_contract",
      domain: "hierarchy" as const,
      status: frozenMatchesCanonical ? ("pass" as const) : ("fail" as const),
      evidence: "DASHBOARD_HOME_FROZEN_HIERARCHY matches layout contract",
    }),
    Object.freeze({
      id: "freeze_readiness_before_timeline",
      domain: "hierarchy" as const,
      status:
        DASHBOARD_HOME_CANONICAL_SECTION_ORDER.indexOf("daily_readiness") <
        DASHBOARD_HOME_CANONICAL_SECTION_ORDER.indexOf("recent_activity_timeline")
          ? ("pass" as const)
          : ("fail" as const),
      evidence: "Readiness remains in Status Zone before Continuity Zone",
    }),
  ];
}

export function validateDashboardHomeOwnershipFreeze(): DashboardHomeFreezeCheck[] {
  return [
    Object.freeze({
      id: "freeze_ownership_four_pillars",
      domain: "ownership" as const,
      status: DASHBOARD_HOME_EXECUTIVE_RESPONSIBILITIES.length === 4 ? ("pass" as const) : ("fail" as const),
      evidence: DASHBOARD_HOME_EXECUTIVE_RESPONSIBILITIES.join(", "),
    }),
    Object.freeze({
      id: "freeze_out_of_scope_boundaries",
      domain: "ownership" as const,
      status: DASHBOARD_HOME_OUT_OF_SCOPE.length === 5 ? ("pass" as const) : ("fail" as const),
      evidence: DASHBOARD_HOME_OUT_OF_SCOPE.join(", "),
    }),
    Object.freeze({
      id: "freeze_canonical_home_owner",
      domain: "ownership" as const,
      status: Boolean(CANONICAL_DASHBOARD_HOME_OWNER) ? ("pass" as const) : ("fail" as const),
      evidence: CANONICAL_DASHBOARD_HOME_OWNER,
    }),
  ];
}

export function validateDashboardHomeRoutingFreeze(): DashboardHomeFreezeCheck[] {
  return [
    Object.freeze({
      id: "freeze_routing_overview_default",
      domain: "routing" as const,
      status:
        DASHBOARD_HOME_ROUTING_FREEZE.landingMode === DEFAULT_DASHBOARD_MODE &&
        CANONICAL_DASHBOARD_HOME_MODE === "overview"
          ? ("pass" as const)
          : ("fail" as const),
      evidence: `Landing mode: ${DASHBOARD_HOME_ROUTING_FREEZE.landingMode}`,
    }),
    Object.freeze({
      id: "freeze_routing_home_not_dedicated_mode",
      domain: "routing" as const,
      status: DASHBOARD_HOME_ROUTING_FREEZE.homeIsNotDedicatedMode ? ("pass" as const) : ("fail" as const),
      evidence: "Dashboard Home is overview landing — not a workspace mode",
    }),
    Object.freeze({
      id: "freeze_routing_mode_owner",
      domain: "routing" as const,
      status: DASHBOARD_HOME_ROUTING_FREEZE.modeOwner === CANONICAL_DASHBOARD_MODE_OWNER ? ("pass" as const) : ("fail" as const),
      evidence: CANONICAL_DASHBOARD_MODE_OWNER,
    }),
    Object.freeze({
      id: "freeze_routing_mrp_dashboard_default",
      domain: "routing" as const,
      status: DASHBOARD_HOME_ROUTING_FREEZE.defaultMrpTab === "dashboard" ? ("pass" as const) : ("fail" as const),
      evidence: "MRP Dashboard tab is default executive surface container",
    }),
  ];
}

export function validateObjectPanelIntegrationFreeze(): DashboardHomeFreezeCheck[] {
  return [
    Object.freeze({
      id: "freeze_object_panel_five_actions",
      domain: "object_panel" as const,
      status:
        DASHBOARD_HOME_OBJECT_PANEL_INTEGRATION.actions.length === 5 &&
        OBJECT_PANEL_DASHBOARD_ACTIONS.length === 5
          ? ("pass" as const)
          : ("fail" as const),
      evidence: OBJECT_PANEL_DASHBOARD_ACTIONS.join(", "),
    }),
    Object.freeze({
      id: "freeze_object_panel_launches_modes",
      domain: "object_panel" as const,
      status:
        DASHBOARD_HOME_OBJECT_PANEL_INTEGRATION.behavior === "launch_dashboard_mode"
          ? ("pass" as const)
          : ("fail" as const),
      evidence: "Object Panel launches dashboard modes — never replaces home",
    }),
    Object.freeze({
      id: "freeze_object_panel_home_preserved",
      domain: "object_panel" as const,
      status: DASHBOARD_HOME_OBJECT_PANEL_INTEGRATION.homePreserved ? ("pass" as const) : ("fail" as const),
      evidence: "Dashboard Home remains root workspace on return",
    }),
  ];
}

export function validateAssistantIntegrationFreeze(): DashboardHomeFreezeCheck[] {
  return [
    Object.freeze({
      id: "freeze_assistant_two_tabs",
      domain: "assistant" as const,
      status:
        DASHBOARD_HOME_ASSISTANT_INTEGRATION.mrpTabs.length === 2 &&
        MAIN_RIGHT_PANEL_TABS.length === 2
          ? ("pass" as const)
          : ("fail" as const),
      evidence: MAIN_RIGHT_PANEL_TABS.join(" + "),
    }),
    Object.freeze({
      id: "freeze_assistant_home_dashboard_tab_only",
      domain: "assistant" as const,
      status: DASHBOARD_HOME_ASSISTANT_INTEGRATION.homeExclusiveToDashboardTab ? ("pass" as const) : ("fail" as const),
      evidence: "Dashboard Home belongs exclusively to Dashboard tab",
    }),
    Object.freeze({
      id: "freeze_assistant_does_not_replace_home",
      domain: "assistant" as const,
      status: DASHBOARD_HOME_ASSISTANT_INTEGRATION.prohibited.includes("assistant_replaces_home")
        ? ("pass" as const)
        : ("fail" as const),
      evidence: "Assistant owns chat/guidance — not landing surface",
    }),
  ];
}

export function validateDashboardHomeContractFreeze(): DashboardHomeFreezeCheck[] {
  return DASHBOARD_HOME_FROZEN_CONTRACTS.map((contract) =>
    Object.freeze({
      id: `freeze_contract_${contract.id}`,
      domain: "contracts" as const,
      status: contract.status === DASHBOARD_HOME_MVP_APPROVAL_STATUS ? ("pass" as const) : ("fail" as const),
      evidence: `${contract.title} — ${contract.status}`,
    })
  );
}

export function validateDashboardHomeUxPerformanceFreeze(): DashboardHomeFreezeCheck[] {
  return [
    Object.freeze({
      id: "freeze_ux_executive_tone",
      domain: "ux" as const,
      status: DASHBOARD_HOME_UX_FREEZE.tone.length === 4 ? ("pass" as const) : ("fail" as const),
      evidence: DASHBOARD_HOME_UX_FREEZE.tone.join(", "),
    }),
    Object.freeze({
      id: "freeze_ux_no_wallboard_drift",
      domain: "ux" as const,
      status: DASHBOARD_HOME_UX_FREEZE.prohibitedDrift.includes("operations_wallboard") ? ("pass" as const) : ("fail" as const),
      evidence: "Prohibited drift patterns documented",
    }),
    Object.freeze({
      id: "freeze_performance_loop_prohibitions",
      domain: "performance" as const,
      status: DASHBOARD_HOME_PERFORMANCE_FREEZE.prohibited.length >= 5 ? ("pass" as const) : ("fail" as const),
      evidence: DASHBOARD_HOME_PERFORMANCE_FREEZE.prohibited.join(", "),
    }),
    Object.freeze({
      id: "freeze_extension_rules_documented",
      domain: "contracts" as const,
      status:
        DASHBOARD_HOME_FUTURE_EXTENSION_RULES.prohibitedWithoutMigration.includes("replace_dashboard_home")
          ? ("pass" as const)
          : ("fail" as const),
      evidence: "Future hierarchy changes require migration approval",
    }),
  ];
}

export function validateDashboardHomeLegacyFreeze(): DashboardHomeFreezeCheck[] {
  return [
    Object.freeze({
      id: "freeze_legacy_right_rail_deprecated",
      domain: "legacy" as const,
      status:
        DASHBOARD_HOME_FREEZE_DEPRECATED.legacyRightRailDashboards.length >= 2 ? ("pass" as const) : ("fail" as const),
      evidence: `${DASHBOARD_HOME_FREEZE_DEPRECATED.legacyRightRailDashboards.length} legacy paths marked deprecated`,
    }),
    Object.freeze({
      id: "freeze_legacy_reuse_policy",
      domain: "legacy" as const,
      status: Boolean(DASHBOARD_HOME_FREEZE_DEPRECATED.reusePolicy) ? ("pass" as const) : ("fail" as const),
      evidence: DASHBOARD_HOME_FREEZE_DEPRECATED.reusePolicy,
    }),
  ];
}

export function validateDashboardHomeQaBaseline(): DashboardHomeFreezeCheck {
  const qa = runDashboardHomeRuntimeQaMatrix();
  return Object.freeze({
    id: "freeze_qa_baseline_mrp_10_9",
    domain: "qa" as const,
    status: qa.failCount === 0 ? ("pass" as const) : ("fail" as const),
    evidence: `MRP:10:9 QA matrix — ${qa.passCount} pass, ${qa.warningCount} warn, ${qa.failCount} fail`,
  });
}

export function runDashboardHomeFreezeCertification(): DashboardHomeFreezeCertification {
  const checks: DashboardHomeFreezeCheck[] = [
    ...validateDashboardHomeHierarchyFreeze(),
    ...validateDashboardHomeOwnershipFreeze(),
    ...validateDashboardHomeRoutingFreeze(),
    ...validateObjectPanelIntegrationFreeze(),
    ...validateAssistantIntegrationFreeze(),
    ...validateDashboardHomeContractFreeze(),
    ...validateDashboardHomeUxPerformanceFreeze(),
    ...validateDashboardHomeLegacyFreeze(),
    validateDashboardHomeQaBaseline(),
  ];

  const passCount = checks.filter((entry) => entry.status === "pass").length;
  const warningCount = checks.filter((entry) => entry.status === "warning").length;
  const failCount = checks.filter((entry) => entry.status === "fail").length;

  let verdict: DashboardHomeFreezeCertification["verdict"] = "PASS";
  if (failCount > 0) verdict = "FAIL";
  else if (warningCount > 0) verdict = "PASS_WITH_WARNINGS";

  return Object.freeze({
    version: DASHBOARD_HOME_FREEZE_VERSION,
    mvpStatus: DASHBOARD_HOME_MVP_APPROVAL_STATUS,
    checks: Object.freeze(checks),
    passCount,
    warningCount,
    failCount,
    verdict,
  });
}
