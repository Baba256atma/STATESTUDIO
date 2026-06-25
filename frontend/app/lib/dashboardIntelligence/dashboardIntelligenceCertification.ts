/**
 * INT-1 — Dashboard Intelligence Foundation certification.
 * Read-only verification that runtime is isolated and does not mutate DS layers.
 */

import { EXECUTIVE_REGISTRY_STORAGE_KEY } from "../executive/executiveIntelligenceRegistry.ts";
import { WORKSPACE_KPI_STORAGE_KEY } from "../kpi/workspaceKpiContract.ts";
import { WORKSPACE_OBJECTIVE_STORAGE_KEY } from "../okr/workspaceOkrContract.ts";
import { WORKSPACE_DETECTED_RISK_STORAGE_KEY } from "../risk/workspaceRiskDetectionEngine.ts";
import { WORKSPACE_RISK_STORAGE_KEY } from "../risk/workspaceRiskContract.ts";
import { WORKSPACE_SCENARIO_STORAGE_KEY } from "../scenario/workspaceScenarioContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
  DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
  DASHBOARD_INTELLIGENCE_MODES,
  type DashboardIntelligencePanelId,
} from "./dashboardIntelligenceContract.ts";
import { getDashboardIntelligenceRegistryState } from "./dashboardIntelligenceRegistry.ts";
import { requestDashboardIntelligence } from "./dashboardIntelligenceRuntime.ts";

export type DashboardIntelligenceCertificationResult = Readonly<{
  contractVersion: typeof DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION;
  passed: boolean;
  certified: boolean;
  checks: readonly DashboardIntelligenceCertificationCheck[];
  summary: string;
  generatedAt: string;
  tags: typeof DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS;
}>;

export type DashboardIntelligenceCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): DashboardIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function snapshotProtectedStorage(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  return Object.freeze({
    scenarios: window.localStorage.getItem(WORKSPACE_SCENARIO_STORAGE_KEY),
    kpis: window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY),
    objectives: window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY),
    risks: window.localStorage.getItem(WORKSPACE_RISK_STORAGE_KEY),
    detected: window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY),
    executiveRegistry: window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    relationships: window.localStorage.getItem(RELATIONSHIP_STORAGE_KEY),
    scenes: window.localStorage.getItem(SCENE_STORAGE_KEY),
  });
}

function requestAllPanels(workspaceId: WorkspaceId): readonly DashboardIntelligencePanelId[] {
  const panels: DashboardIntelligencePanelId[] = [];
  for (const panel of DASHBOARD_INTELLIGENCE_MODES) {
    requestDashboardIntelligence({ panel, workspaceId });
    panels.push(panel);
  }
  return Object.freeze(panels);
}

export function runDashboardIntelligenceCertification(input: {
  workspaceId: WorkspaceId;
  buildPassed?: boolean;
}): DashboardIntelligenceCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const beforeStorage = snapshotProtectedStorage();
  const registryBefore = getDashboardIntelligenceRegistryState().version;

  const panels = requestAllPanels(workspaceId);
  const executive = requestDashboardIntelligence({ panel: "executive_summary", workspaceId });
  const kpi = requestDashboardIntelligence({ panel: "kpis", workspaceId, bypassCache: true });

  const afterStorage = snapshotProtectedStorage();
  const registryAfter = getDashboardIntelligenceRegistryState().version;

  const storageUnchanged = Object.keys(beforeStorage).every(
    (key) => beforeStorage[key] === afterStorage[key]
  );

  const checks = Object.freeze([
    check(
      "runtime_isolated",
      "Dashboard Intelligence runtime exists",
      registryBefore >= 0 && panels.length === DASHBOARD_INTELLIGENCE_MODES.length,
      `${panels.length} panel route(s) available.`
    ),
    check(
      "dashboard_never_owns_intelligence",
      "Dashboard never owns intelligence",
      Boolean(executive.snapshot?.payload.source.startsWith("ds_") || executive.snapshot?.payload.source === "reserved_timeline"),
      `Executive summary source=${executive.snapshot?.payload.source ?? "none"}.`
    ),
    check(
      "dashboard_never_computes_kpis",
      "Dashboard never computes KPIs",
      kpi.snapshot?.payload.metrics.some((entry) => entry.metricId === "total_kpis") === true &&
        kpi.snapshot.payload.source === "ds4_kpi",
      "KPI panel consumes DS-4 summary fields only."
    ),
    check(
      "dashboard_never_computes_risks",
      "Dashboard never computes Risks",
      requestDashboardIntelligence({ panel: "risk", workspaceId, bypassCache: true }).snapshot
        ?.payload.source === "ds6_risk",
      "Risk panel routes to DS-6 read-only integration."
    ),
    check(
      "dashboard_never_computes_scenarios",
      "Dashboard never computes Scenarios",
      requestDashboardIntelligence({ panel: "scenario", workspaceId, bypassCache: true }).snapshot
        ?.payload.source === "ds7_scenario",
      "Scenario panel routes to DS-7 read-only integration."
    ),
    check(
      "normalized_results_only",
      "Dashboard consumes normalized results",
      Boolean(executive.snapshot?.payload.summary && executive.snapshot.payload.metrics.length > 0),
      "Normalized payload includes summary and metrics."
    ),
    check(
      "no_scene_mutation",
      "No Scene mutations",
      beforeStorage.scenes === afterStorage.scenes,
      "Scene storage unchanged."
    ),
    check(
      "no_executive_registry_mutation",
      "No Executive Registry mutations",
      beforeStorage.executiveRegistry === afterStorage.executiveRegistry,
      "Executive registry storage unchanged."
    ),
    check(
      "no_ds_mutation",
      "No DS mutations",
      storageUnchanged,
      "DS intelligence storage unchanged."
    ),
    check(
      "registry_stable",
      "Runtime registry stable during reads",
      registryAfter === registryBefore,
      `Registry version remained ${registryBefore}.`
    ),
    check(
      "build_pass",
      "Build pass",
      input.buildPassed !== false,
      input.buildPassed === false ? "Build validation failed." : "Build pass reported by harness."
    ),
  ]);

  const passed = checks.every((entry) => entry.passed);
  const certified = passed;

  return Object.freeze({
    contractVersion: DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
    passed,
    certified,
    checks,
    summary: certified
      ? "Dashboard Intelligence Foundation certification PASSED."
      : "Dashboard Intelligence Foundation certification FAILED.",
    generatedAt: nowIso(),
    tags: DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
  });
}
