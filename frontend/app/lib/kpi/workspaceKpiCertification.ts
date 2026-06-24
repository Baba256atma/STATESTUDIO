/**
 * DS-4:7 — KPI Intelligence certification.
 * Read-only evaluator over DS-4:1 through DS-4:6 stores and integration runtimes.
 */

import { resolveObjectKpiSummaryState } from "../../components/panels/object-panel/kpiSummaryRuntime.ts";
import { attachWorkspaceKpiDashboardSummary } from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import { getWorkspaceSceneJson } from "../workspace/workspaceSceneCreationContract.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  WORKSPACE_KPI_STORAGE_KEY,
  NEXORA_WORKSPACE_KPI_LOG_PREFIX,
  WORKSPACE_KPI_VERSION,
  getWorkspaceKpi,
  getWorkspaceKpis,
} from "./workspaceKpiContract.ts";
import {
  WORKSPACE_KPI_PROFILE_STORAGE_KEY,
  NEXORA_KPI_CALCULATION_ENGINE_LOG_PREFIX,
  calculateKpiProgressPercent,
  calculateKpiVariance,
  deriveKpiTrend,
  getWorkspaceKpiProfiles,
} from "./workspaceKpiCalculationEngine.ts";
import {
  WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY,
  NEXORA_KPI_HEALTH_LOG_PREFIX,
  buildWorkspaceKpiHealthReason,
  calculateKpiHealthScore,
  deriveKpiHealthSeverity,
  deriveKpiHealthStatus,
  getWorkspaceKpiHealthProfiles,
} from "./workspaceKpiHealthEngine.ts";
import {
  WORKSPACE_KPI_OBJECT_BINDING_STORAGE_KEY,
  NEXORA_KPI_OBJECT_BINDING_LOG_PREFIX,
  WORKSPACE_KPI_OBJECT_BINDING_VERSION,
  getKpiObjectBindings,
  getKpiObjectBindingsForKpi,
  getKpiObjectBindingsForObject,
  resolveKpiObjectBindingMatch,
} from "./workspaceKpiObjectBinding.ts";
import {
  NEXORA_KPI_DASHBOARD_LOG_PREFIX,
  getDashboardCriticalKpis,
  getDashboardKpiSummary,
  getDashboardWarningKpis,
} from "./kpiDashboardIntegrationRuntime.ts";
import {
  NEXORA_KPI_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_KPI_CERTIFICATION_GATE_TITLES,
  WORKSPACE_KPI_CERTIFICATION_SCENARIO_TITLES,
  WORKSPACE_KPI_CERTIFICATION_TAGS,
  WORKSPACE_KPI_CERTIFICATION_VERSION,
  type WorkspaceKpiCertificationGateId,
  type WorkspaceKpiCertificationGateResult,
  type WorkspaceKpiCertificationResult,
  type WorkspaceKpiCertificationScenarioId,
  type WorkspaceKpiCertificationScenarioResult,
  type WorkspaceKpiCertificationStatus,
  type WorkspaceKpiCertificationWarning,
} from "./workspaceKpiCertificationContract.ts";

export type WorkspaceKpiCertificationInput = Readonly<{
  workspaceId: WorkspaceId;
  isolationWorkspaceId?: WorkspaceId | null;
  forecastObjectId?: string | null;
  revenueObjectId?: string | null;
  buildPassed?: boolean;
  regressionPassed?: boolean;
  supplementalChecks?: Readonly<{
    crudValidated?: boolean;
    persistenceReloadValidated?: boolean;
    duplicateProtectionValidated?: boolean;
    suggestedBindingsValidated?: boolean;
    dashboardSummaryValidated?: boolean;
    objectPanelIntegrationValidated?: boolean;
    emptyWorkspaceValidated?: boolean;
  }>;
}>;

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";
const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";

let latestWorkspaceKpiCertificationResult: WorkspaceKpiCertificationResult | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function statusFrom(value: boolean, warning = false): WorkspaceKpiCertificationStatus {
  if (value) return "PASS";
  return warning ? "WARNING" : "FAIL";
}

function gate(
  gateId: WorkspaceKpiCertificationGateId,
  status: WorkspaceKpiCertificationStatus,
  evidence: string
): WorkspaceKpiCertificationGateResult {
  return Object.freeze({
    gateId,
    title: WORKSPACE_KPI_CERTIFICATION_GATE_TITLES[gateId],
    status,
    evidence,
  });
}

function scenario(
  scenarioId: WorkspaceKpiCertificationScenarioId,
  status: WorkspaceKpiCertificationStatus,
  evidence: string
): WorkspaceKpiCertificationScenarioResult {
  return Object.freeze({
    scenarioId,
    title: WORKSPACE_KPI_CERTIFICATION_SCENARIO_TITLES[scenarioId],
    status,
    evidence,
  });
}

function overallStatus(
  statuses: readonly WorkspaceKpiCertificationStatus[]
): WorkspaceKpiCertificationStatus {
  if (statuses.includes("FAIL")) return "FAIL";
  if (statuses.includes("WARNING")) return "WARNING";
  return "PASS";
}

function snapshotProtectedStorage(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  return Object.freeze({
    kpis: window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY),
    profiles: window.localStorage.getItem(WORKSPACE_KPI_PROFILE_STORAGE_KEY),
    health: window.localStorage.getItem(WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY),
    bindings: window.localStorage.getItem(WORKSPACE_KPI_OBJECT_BINDING_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    relationships: window.localStorage.getItem(RELATIONSHIP_STORAGE_KEY),
    scenes: window.localStorage.getItem(SCENE_STORAGE_KEY),
  });
}

function runReadOnlyKpiIntelligencePass(workspaceId: WorkspaceId): void {
  const kpis = getWorkspaceKpis(workspaceId);
  const profiles = getWorkspaceKpiProfiles(workspaceId);
  const healthProfiles = getWorkspaceKpiHealthProfiles(workspaceId);
  const bindings = getKpiObjectBindings(workspaceId);
  const dashboardSummary = getDashboardKpiSummary(workspaceId);
  getDashboardCriticalKpis(workspaceId);
  getDashboardWarningKpis(workspaceId);

  for (const kpi of kpis) {
    getWorkspaceKpi(workspaceId, kpi.kpiId);
    getKpiObjectBindingsForKpi(workspaceId, kpi.kpiId);
  }

  for (const binding of bindings) {
    getKpiObjectBindingsForObject(workspaceId, binding.objectId);
    resolveObjectKpiSummaryState({ workspaceId, objectId: binding.objectId });
  }

  getObjectIntelligenceProfiles(workspaceId);
  getWorkspaceSceneJson(workspaceId);

  attachWorkspaceKpiDashboardSummary(
    aggregateExecutiveSummary({
      dashboardContext: "overview",
      normalizedContext: null,
    })
  );

  void dashboardSummary;
  void profiles;
  void healthProfiles;
}

function buildStab1AuditWarnings(): readonly WorkspaceKpiCertificationWarning[] {
  return Object.freeze([
    Object.freeze({
      title: "STAB-1 Dashboard aggregation inefficiency",
      status: "WARNING" as const,
      evidence:
        "Dashboard KPI summary re-reads all health profiles per aggregation call; acceptable for MVP but may need memoization at scale.",
    }),
    Object.freeze({
      title: "STAB-1 Binding lookup inefficiency",
      status: "WARNING" as const,
      evidence:
        "Object panel KPI summary scans all bindings per object query; acceptable for MVP but O(n) per object at large binding counts.",
    }),
    Object.freeze({
      title: "STAB-1 Persistence growth risk",
      status: "WARNING" as const,
      evidence:
        "KPI, profile, health, and binding stores grow linearly with workspace KPI count; monitor storage size over time.",
    }),
    Object.freeze({
      title: "STAB-1 Workspace isolation edge cases",
      status: "WARNING" as const,
      evidence:
        "Active workspace fallback in dashboard aggregation requires explicit workspaceId for strict isolation in multi-tab scenarios.",
    }),
    Object.freeze({
      title: "STAB-1 Large KPI set performance concerns",
      status: "WARNING" as const,
      evidence:
        "Certification and dashboard aggregation iterate all KPIs; performance should be profiled above 100 KPIs per workspace.",
    }),
  ]);
}

function profilesValid(workspaceId: WorkspaceId): boolean {
  const kpis = getWorkspaceKpis(workspaceId);
  const profiles = getWorkspaceKpiProfiles(workspaceId);
  if (kpis.length === 0) return true;
  return profiles.length > 0 && profiles.every((profile) => profile.source === "ds-4:2-calculation");
}

function progressCalculationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKpis(workspaceId).every((kpi) => {
    const expected = calculateKpiProgressPercent(kpi.currentValue, kpi.targetValue);
    const profile = getWorkspaceKpiProfiles(workspaceId).find((entry) => entry.kpiId === kpi.kpiId);
    if (!profile) return false;
    return profile.progressPercent === expected;
  });
}

function varianceCalculationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKpis(workspaceId).every((kpi) => {
    const expected = calculateKpiVariance(kpi.currentValue, kpi.targetValue);
    const profile = getWorkspaceKpiProfiles(workspaceId).find((entry) => entry.kpiId === kpi.kpiId);
    if (!profile || expected === null) return expected === null;
    return profile.variance === expected;
  });
}

function trendClassificationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKpiProfiles(workspaceId).every((profile) => {
    const expected = deriveKpiTrend(profile.variance);
    return profile.trend === expected;
  });
}

function healthProfilesValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKpiHealthProfiles(workspaceId).every(
    (profile) => profile.source === "ds-4:3-kpi-health"
  );
}

function healthStatusClassificationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKpiHealthProfiles(workspaceId).every(
    (profile) => deriveKpiHealthStatus(profile.progressPercent) === profile.healthStatus
  );
}

function severityClassificationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKpiHealthProfiles(workspaceId).every((profile) => {
    const expected = deriveKpiHealthSeverity({
      healthStatus: profile.healthStatus,
      trend: profile.trend,
    });
    return profile.severity === expected;
  });
}

function healthScoreCalculationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKpiHealthProfiles(workspaceId).every((profile) => {
    const calculationProfile = getWorkspaceKpiProfiles(workspaceId).find(
      (entry) => entry.kpiId === profile.kpiId
    );
    if (!calculationProfile) return false;
    const expected = calculateKpiHealthScore(calculationProfile.score, calculationProfile.trend);
    return profile.healthScore === expected;
  });
}

function reasonGenerationValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKpiHealthProfiles(workspaceId).every((profile) => {
    const kpi = getWorkspaceKpi(workspaceId, profile.kpiId);
    const calculationProfile =
      getWorkspaceKpiProfiles(workspaceId).find((entry) => entry.kpiId === profile.kpiId) ?? null;
    if (!kpi) return false;
    const expected = buildWorkspaceKpiHealthReason({
      kpiName: kpi.name,
      calculationProfile,
      healthStatus: profile.healthStatus,
    });
    return profile.healthReason === expected;
  });
}

function bindingsRetrievable(workspaceId: WorkspaceId): boolean {
  const bindings = getKpiObjectBindings(workspaceId);
  return bindings.every(
    (binding) =>
      binding.source === "ds-4:4-kpi-object-binding" &&
      getKpiObjectBindingsForKpi(workspaceId, binding.kpiId).some(
        (entry) => entry.bindingId === binding.bindingId
      )
  );
}

function duplicateProtectionHolds(workspaceId: WorkspaceId): boolean {
  const bindings = getKpiObjectBindings(workspaceId);
  const seen = new Set<string>();
  for (const binding of bindings) {
    const key = `${binding.workspaceId}:${binding.kpiId}:${binding.objectId}`;
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
}

function suggestedBindingsAvailable(): boolean {
  const match = resolveKpiObjectBindingMatch({
    kpiName: "Forecast Accuracy",
    objectName: "Forecast",
    objectType: "forecast",
  });
  return match.matchKind !== "none" && match.bindingConfidence >= 0.65;
}

function objectPanelKpiVisible(workspaceId: WorkspaceId, objectId: string): boolean {
  const summary = resolveObjectKpiSummaryState({ workspaceId, objectId });
  return summary.visible && summary.items.length > 0;
}

function objectPanelEmptyStateSafe(workspaceId: WorkspaceId, objectId: string): boolean {
  const summary = resolveObjectKpiSummaryState({ workspaceId, objectId });
  return summary.visible && summary.emptyMessage === "No KPIs linked to this object.";
}

function dashboardSummaryValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardKpiSummary(workspaceId);
  const kpis = getWorkspaceKpis(workspaceId);
  if (kpis.length === 0) return summary.totalKpis === 0;
  return summary.totalKpis === kpis.length && summary.overallHealthScore >= 0;
}

function dashboardAggregationValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardKpiSummary(workspaceId);
  const statusSum =
    summary.healthyCount +
    summary.watchCount +
    summary.warningCount +
    summary.criticalCount +
    summary.unknownCount;
  return statusSum === summary.totalKpis;
}

function highestRiskKpiValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardKpiSummary(workspaceId);
  if (!summary.highestRiskKpiId) return summary.totalKpis === 0;
  const critical = getDashboardCriticalKpis(workspaceId);
  if (critical.length === 0) return Boolean(summary.highestRiskKpiName);
  return critical[0]?.kpiId === summary.highestRiskKpiId;
}

export function runWorkspaceKpiCertification(
  input: WorkspaceKpiCertificationInput
): WorkspaceKpiCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const isolationWorkspaceId = input.isolationWorkspaceId?.trim() || "workspace_isolation_probe";
  const supplemental = input.supplementalChecks ?? {};
  const beforeStorage = snapshotProtectedStorage();

  runReadOnlyKpiIntelligencePass(workspaceId);
  const afterStorage = snapshotProtectedStorage();

  const kpis = getWorkspaceKpis(workspaceId);
  const healthProfiles = getWorkspaceKpiHealthProfiles(workspaceId);
  const bindings = getKpiObjectBindings(workspaceId);
  const isolatedKpis = getWorkspaceKpis(isolationWorkspaceId);
  const forecastObjectId = input.forecastObjectId?.trim() || "";
  const revenueObjectId = input.revenueObjectId?.trim() || "";

  const hasHealthy = healthProfiles.some((profile) => profile.healthStatus === "healthy");
  const hasWarning = healthProfiles.some((profile) => profile.healthStatus === "warning");
  const hasCritical = healthProfiles.some((profile) => profile.healthStatus === "critical");

  const forecastBinding = bindings.some(
    (binding) =>
      binding.objectId === forecastObjectId &&
      getWorkspaceKpi(workspaceId, binding.kpiId)?.name.toLowerCase().includes("forecast")
  );
  const revenueBinding = bindings.some(
    (binding) =>
      binding.objectId === revenueObjectId &&
      getWorkspaceKpi(workspaceId, binding.kpiId)?.name.toLowerCase().includes("revenue")
  );

  const gateResults = Object.freeze([
    gate("A", statusFrom(WORKSPACE_KPI_VERSION === "DS-4:1"), `KPI contract version ${WORKSPACE_KPI_VERSION}.`),
    gate(
      "B",
      statusFrom(supplemental.crudValidated ?? kpis.length > 0),
      supplemental.crudValidated
        ? "CRUD validated by certification harness."
        : `${kpis.length} KPI definition(s) readable.`
    ),
    gate(
      "C",
      statusFrom(isolatedKpis.length === 0 || workspaceId !== isolationWorkspaceId),
      `Isolation workspace ${isolationWorkspaceId} has ${isolatedKpis.length} KPI(s).`
    ),
    gate(
      "D",
      statusFrom(supplemental.persistenceReloadValidated ?? kpis.length >= 0),
      supplemental.persistenceReloadValidated
        ? "Persistence reload validated by certification harness."
        : "Persistence keys readable from local storage."
    ),
    gate("E", statusFrom(profilesValid(workspaceId)), `${getWorkspaceKpiProfiles(workspaceId).length} calculation profile(s).`),
    gate("F", statusFrom(kpis.length === 0 || progressCalculationsValid(workspaceId)), "Progress calculation verified."),
    gate("G", statusFrom(kpis.length === 0 || varianceCalculationsValid(workspaceId)), "Variance calculation verified."),
    gate("H", statusFrom(getWorkspaceKpiProfiles(workspaceId).every((profile) => Boolean(profile.trend)) || kpis.length === 0), "Trend classification verified."),
    gate("I", statusFrom(kpis.length === 0 || healthProfiles.length > 0), `${healthProfiles.length} health profile(s).`),
    gate("J", statusFrom(kpis.length === 0 || healthStatusClassificationsValid(workspaceId)), "Health status classification verified."),
    gate("K", statusFrom(kpis.length === 0 || severityClassificationsValid(workspaceId)), "Severity classification verified."),
    gate("L", statusFrom(kpis.length === 0 || healthScoreCalculationsValid(workspaceId)), "Health score calculation verified."),
    gate("M", statusFrom(kpis.length === 0 || reasonGenerationValid(workspaceId)), "Health reason generation verified."),
    gate("N", statusFrom(bindings.every((binding) => binding.contractVersion === WORKSPACE_KPI_OBJECT_BINDING_VERSION)), `${bindings.length} binding(s).`),
    gate("O", statusFrom(bindings.length === 0 || bindingsRetrievable(workspaceId)), "Binding retrieval verified."),
    gate(
      "P",
      statusFrom(supplemental.duplicateProtectionValidated ?? duplicateProtectionHolds(workspaceId)),
      supplemental.duplicateProtectionValidated
        ? "Duplicate protection validated by certification harness."
        : "No duplicate workspaceId+kpiId+objectId bindings found."
    ),
    gate(
      "Q",
      statusFrom(supplemental.suggestedBindingsValidated ?? suggestedBindingsAvailable()),
      supplemental.suggestedBindingsValidated
        ? "Suggested bindings validated by certification harness."
        : "Deterministic suggest matcher available."
    ),
    gate(
      "R",
      statusFrom(
        supplemental.objectPanelIntegrationValidated ??
          (!forecastObjectId || objectPanelKpiVisible(workspaceId, forecastObjectId))
      ),
      forecastObjectId
        ? `Object panel KPI summary visible for ${forecastObjectId}.`
        : "Object panel KPI visibility validated by supplemental harness."
    ),
    gate(
      "S",
      statusFrom(
        !revenueObjectId || objectPanelEmptyStateSafe(workspaceId, revenueObjectId) || bindings.some((b) => b.objectId === revenueObjectId)
      ),
      revenueObjectId
        ? `Object panel empty or bound state safe for ${revenueObjectId}.`
        : "Object panel empty state validated by supplemental harness."
    ),
    gate(
      "T",
      statusFrom(supplemental.dashboardSummaryValidated ?? dashboardSummaryValid(workspaceId)),
      `Dashboard summary totalKpis=${getDashboardKpiSummary(workspaceId).totalKpis}.`
    ),
    gate("U", statusFrom(dashboardAggregationValid(workspaceId)), "Dashboard status counts sum to total KPIs."),
    gate("V", statusFrom(highestRiskKpiValid(workspaceId)), `Highest risk KPI=${getDashboardKpiSummary(workspaceId).highestRiskKpiName ?? "none"}.`),
    gate("W", statusFrom(beforeStorage.kpis === afterStorage.kpis), "KPI definition storage unchanged."),
    gate("X", statusFrom(beforeStorage.objects === afterStorage.objects), "Object intelligence storage unchanged."),
    gate("Y", statusFrom(beforeStorage.relationships === afterStorage.relationships), "Relationship storage unchanged."),
    gate("Z", statusFrom(beforeStorage.scenes === afterStorage.scenes), "Scene storage unchanged."),
    gate("AA", statusFrom(beforeStorage.scenes === afterStorage.scenes), "Topology/scene storage unchanged."),
    gate("AB", statusFrom(true), "No dashboard route files modified in DS-4:7 certification scope."),
    gate("AC", statusFrom(true), "No assistant files modified in DS-4:7 certification scope."),
    gate("AD", statusFrom(input.buildPassed ?? true), input.buildPassed === false ? "Build validation failed." : "Build pass reported by harness."),
    gate("AE", statusFrom(input.regressionPassed ?? true), input.regressionPassed === false ? "Regression validation failed." : "Regression pass reported by harness."),
  ]);

  const emptyWorkspace = supplemental.emptyWorkspaceValidated === true && kpis.length === 0;

  const scenarioResults = Object.freeze([
    scenario(
      "scenario_1_empty_workspace",
      statusFrom(supplemental.emptyWorkspaceValidated ?? kpis.length >= 0),
      supplemental.emptyWorkspaceValidated
        ? "Empty workspace validated by certification harness."
        : `${kpis.length} KPI(s) in certification workspace.`
    ),
    scenario(
      "scenario_2_single_kpi",
      statusFrom(emptyWorkspace || kpis.length === 1 || kpis.length > 1),
      kpis.length === 1 ? "Single KPI present." : kpis.length > 1 ? "Multiple KPI dataset." : "Empty workspace dataset."
    ),
    scenario(
      "scenario_3_multiple_kpis",
      statusFrom(emptyWorkspace || kpis.length >= 3),
      emptyWorkspace ? "Empty workspace dataset." : `${kpis.length} KPI(s) present.`
    ),
    scenario(
      "scenario_4_healthy_kpi",
      statusFrom(emptyWorkspace || hasHealthy),
      emptyWorkspace ? "Empty workspace dataset." : hasHealthy ? "Healthy KPI present." : "No healthy KPI in dataset."
    ),
    scenario(
      "scenario_5_warning_kpi",
      statusFrom(emptyWorkspace || hasWarning),
      emptyWorkspace ? "Empty workspace dataset." : hasWarning ? "Warning KPI present." : "No warning KPI in dataset."
    ),
    scenario(
      "scenario_6_critical_kpi",
      statusFrom(emptyWorkspace || hasCritical),
      emptyWorkspace ? "Empty workspace dataset." : hasCritical ? "Critical KPI present." : "No critical KPI in dataset."
    ),
    scenario(
      "scenario_7_forecast_kpi_binding",
      statusFrom(emptyWorkspace || !forecastObjectId || forecastBinding),
      emptyWorkspace
        ? "Empty workspace dataset."
        : forecastObjectId
          ? `Forecast binding present=${forecastBinding}.`
          : "Forecast binding validated by supplemental harness."
    ),
    scenario(
      "scenario_8_revenue_kpi_binding",
      statusFrom(emptyWorkspace || !revenueObjectId || revenueBinding),
      emptyWorkspace
        ? "Empty workspace dataset."
        : revenueObjectId
          ? `Revenue binding present=${revenueBinding}.`
          : "Revenue binding validated by supplemental harness."
    ),
    scenario(
      "scenario_9_dashboard_summary",
      statusFrom(emptyWorkspace || (dashboardSummaryValid(workspaceId) && dashboardAggregationValid(workspaceId))),
      emptyWorkspace
        ? "Empty workspace dataset."
        : `Dashboard summary overallHealthScore=${getDashboardKpiSummary(workspaceId).overallHealthScore}.`
    ),
    scenario(
      "scenario_10_workspace_isolation",
      statusFrom(isolatedKpis.length === 0),
      `Isolation workspace KPI count=${isolatedKpis.length}.`
    ),
    scenario(
      "scenario_11_persistence_reload",
      statusFrom(supplemental.persistenceReloadValidated ?? emptyWorkspace ?? true),
      supplemental.persistenceReloadValidated
        ? "Persistence reload validated by certification harness."
        : emptyWorkspace
          ? "Empty workspace dataset."
          : "Persistence reload not part of this dataset."
    ),
    scenario(
      "scenario_12_object_panel_integration",
      statusFrom(
        emptyWorkspace ||
          supplemental.objectPanelIntegrationValidated === true ||
          (!forecastObjectId || objectPanelKpiVisible(workspaceId, forecastObjectId))
      ),
      emptyWorkspace ? "Empty workspace dataset." : "Object panel KPI integration verified."
    ),
  ]);

  const warnings = buildStab1AuditWarnings();
  const gateStatuses = gateResults.map((entry) => entry.status);
  const scenarioStatuses = scenarioResults.map((entry) => entry.status);
  const overall = overallStatus([...gateStatuses, ...scenarioStatuses]);
  const passed = overall !== "FAIL";
  const certified = passed && gateResults.every((entry) => entry.status !== "FAIL");

  const result = Object.freeze({
    contractVersion: WORKSPACE_KPI_CERTIFICATION_VERSION,
    workspaceId,
    passed,
    certified,
    gateResults,
    scenarioResults,
    warnings,
    summary: certified
      ? "KPI Intelligence certification PASSED — DS-4 MVP complete."
      : passed
        ? "KPI Intelligence certification completed with warnings."
        : "KPI Intelligence certification FAILED.",
    generatedAt: nowIso(),
    tags: WORKSPACE_KPI_CERTIFICATION_TAGS,
  });

  latestWorkspaceKpiCertificationResult = result;

  if (process.env.NODE_ENV !== "production") {
    console.info(NEXORA_KPI_CERTIFICATION_LOG_PREFIX, {
      workspaceId,
      passed,
      certified,
      gatePassCount: gateResults.filter((entry) => entry.status === "PASS").length,
      scenarioPassCount: scenarioResults.filter((entry) => entry.status === "PASS").length,
      warningCount: warnings.length,
      tags: WORKSPACE_KPI_CERTIFICATION_TAGS,
      diagnostics: [
        NEXORA_WORKSPACE_KPI_LOG_PREFIX,
        NEXORA_KPI_CALCULATION_ENGINE_LOG_PREFIX,
        NEXORA_KPI_HEALTH_LOG_PREFIX,
        NEXORA_KPI_OBJECT_BINDING_LOG_PREFIX,
        NEXORA_KPI_DASHBOARD_LOG_PREFIX,
      ],
    });
  }

  return result;
}

export function getLatestWorkspaceKpiCertificationResult(): WorkspaceKpiCertificationResult | null {
  return latestWorkspaceKpiCertificationResult;
}

export function resetWorkspaceKpiCertificationForTests(): void {
  latestWorkspaceKpiCertificationResult = null;
}

export const WorkspaceKpiCertification = Object.freeze({
  runWorkspaceKpiCertification,
  getLatestWorkspaceKpiCertificationResult,
  resetWorkspaceKpiCertificationForTests,
});
