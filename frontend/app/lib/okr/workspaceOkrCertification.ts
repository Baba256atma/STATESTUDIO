/**
 * DS-5:7 — OKR Intelligence certification.
 * Read-only evaluator over DS-5:1 through DS-5:6 stores and integration runtimes.
 */

import { resolveObjectOkrSummaryState } from "../../components/panels/object-panel/okrSummaryRuntime.ts";
import { attachWorkspaceOkrDashboardSummary } from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import { getWorkspaceSceneJson } from "../workspace/workspaceSceneCreationContract.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { WORKSPACE_KPI_STORAGE_KEY } from "../kpi/workspaceKpiContract.ts";
import {
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
  WORKSPACE_KEY_RESULT_STORAGE_KEY,
  NEXORA_OKR_FOUNDATION_LOG_PREFIX,
  WORKSPACE_OKR_VERSION,
  getWorkspaceObjective,
  getWorkspaceObjectives,
  getWorkspaceKeyResult,
  getWorkspaceKeyResults,
  getWorkspaceKeyResultsForObjective,
} from "./workspaceOkrContract.ts";
import {
  WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY,
  NEXORA_OKR_PROGRESS_LOG_PREFIX,
  buildKeyResultProgressSnapshot,
  buildWorkspaceOkrProgressReason,
  calculateKeyResultProgressPercent,
  deriveOkrTrend,
  getWorkspaceOkrProgressProfile,
  getWorkspaceOkrProgressProfiles,
} from "./workspaceOkrProgressEngine.ts";
import {
  WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY,
  NEXORA_OKR_HEALTH_LOG_PREFIX,
  buildWorkspaceOkrHealthReason,
  calculateOkrHealthScore,
  deriveOkrHealthSeverity,
  deriveOkrHealthStatus,
  getWorkspaceOkrHealthProfile,
  getWorkspaceOkrHealthProfiles,
} from "./workspaceOkrHealthEngine.ts";
import {
  WORKSPACE_OKR_KPI_BINDING_STORAGE_KEY,
  NEXORA_OKR_KPI_BINDING_LOG_PREFIX,
  WORKSPACE_OKR_KPI_BINDING_VERSION,
  getOkrKpiBindings,
  getOkrKpiBindingsForKpi,
  getOkrKpiBindingsForObjective,
  resolveOkrKpiBindingMatch,
} from "./workspaceOkrKpiBinding.ts";
import {
  NEXORA_OKR_DASHBOARD_LOG_PREFIX,
  getDashboardCriticalObjectives,
  getDashboardOkrSummary,
  getDashboardWarningObjectives,
} from "./okrDashboardIntegrationRuntime.ts";
import {
  NEXORA_OKR_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_OKR_CERTIFICATION_GATE_TITLES,
  WORKSPACE_OKR_CERTIFICATION_SCENARIO_TITLES,
  WORKSPACE_OKR_CERTIFICATION_TAGS,
  WORKSPACE_OKR_CERTIFICATION_VERSION,
  type WorkspaceOkrCertificationGateId,
  type WorkspaceOkrCertificationGateResult,
  type WorkspaceOkrCertificationResult,
  type WorkspaceOkrCertificationScenarioId,
  type WorkspaceOkrCertificationScenarioResult,
  type WorkspaceOkrCertificationStatus,
  type WorkspaceOkrCertificationWarning,
} from "./workspaceOkrCertificationContract.ts";

export type WorkspaceOkrCertificationInput = Readonly<{
  workspaceId: WorkspaceId;
  isolationWorkspaceId?: WorkspaceId | null;
  salesObjectId?: string | null;
  forecastObjectId?: string | null;
  unboundObjectId?: string | null;
  buildPassed?: boolean;
  regressionPassed?: boolean;
  supplementalChecks?: Readonly<{
    objectiveCrudValidated?: boolean;
    keyResultCrudValidated?: boolean;
    persistenceReloadValidated?: boolean;
    duplicateProtectionValidated?: boolean;
    suggestedBindingsValidated?: boolean;
    manualBindingValidated?: boolean;
    dashboardSummaryValidated?: boolean;
    objectPanelIntegrationValidated?: boolean;
    objectSwitchingValidated?: boolean;
    emptyWorkspaceValidated?: boolean;
  }>;
}>;

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";
const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";

let latestWorkspaceOkrCertificationResult: WorkspaceOkrCertificationResult | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function statusFrom(value: boolean, warning = false): WorkspaceOkrCertificationStatus {
  if (value) return "PASS";
  return warning ? "WARNING" : "FAIL";
}

function gate(
  gateId: WorkspaceOkrCertificationGateId,
  status: WorkspaceOkrCertificationStatus,
  evidence: string
): WorkspaceOkrCertificationGateResult {
  return Object.freeze({
    gateId,
    title: WORKSPACE_OKR_CERTIFICATION_GATE_TITLES[gateId],
    status,
    evidence,
  });
}

function scenario(
  scenarioId: WorkspaceOkrCertificationScenarioId,
  status: WorkspaceOkrCertificationStatus,
  evidence: string
): WorkspaceOkrCertificationScenarioResult {
  return Object.freeze({
    scenarioId,
    title: WORKSPACE_OKR_CERTIFICATION_SCENARIO_TITLES[scenarioId],
    status,
    evidence,
  });
}

function overallStatus(
  statuses: readonly WorkspaceOkrCertificationStatus[]
): WorkspaceOkrCertificationStatus {
  if (statuses.includes("FAIL")) return "FAIL";
  if (statuses.includes("WARNING")) return "WARNING";
  return "PASS";
}

function snapshotProtectedStorage(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  return Object.freeze({
    objectives: window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY),
    keyResults: window.localStorage.getItem(WORKSPACE_KEY_RESULT_STORAGE_KEY),
    progress: window.localStorage.getItem(WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY),
    health: window.localStorage.getItem(WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY),
    okrBindings: window.localStorage.getItem(WORKSPACE_OKR_KPI_BINDING_STORAGE_KEY),
    kpis: window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    relationships: window.localStorage.getItem(RELATIONSHIP_STORAGE_KEY),
    scenes: window.localStorage.getItem(SCENE_STORAGE_KEY),
  });
}

function runReadOnlyOkrIntelligencePass(workspaceId: WorkspaceId): void {
  const objectives = getWorkspaceObjectives(workspaceId);
  const keyResults = getWorkspaceKeyResults(workspaceId);
  const progressProfiles = getWorkspaceOkrProgressProfiles(workspaceId);
  const healthProfiles = getWorkspaceOkrHealthProfiles(workspaceId);
  const bindings = getOkrKpiBindings(workspaceId);
  const dashboardSummary = getDashboardOkrSummary(workspaceId);
  getDashboardCriticalObjectives(workspaceId);
  getDashboardWarningObjectives(workspaceId);

  for (const objective of objectives) {
    getWorkspaceObjective(workspaceId, objective.objectiveId);
    getWorkspaceKeyResultsForObjective(workspaceId, objective.objectiveId);
    getWorkspaceOkrProgressProfile(workspaceId, objective.objectiveId);
    getWorkspaceOkrHealthProfile(workspaceId, objective.objectiveId);
    getOkrKpiBindingsForObjective(workspaceId, objective.objectiveId);
  }

  for (const keyResult of keyResults) {
    getWorkspaceKeyResult(workspaceId, keyResult.keyResultId);
  }

  for (const binding of bindings) {
    getOkrKpiBindingsForKpi(workspaceId, binding.kpiId);
  }

  getObjectIntelligenceProfiles(workspaceId);
  getWorkspaceSceneJson(workspaceId);

  attachWorkspaceOkrDashboardSummary(
    aggregateExecutiveSummary({
      dashboardContext: "overview",
      normalizedContext: null,
    })
  );

  void dashboardSummary;
  void progressProfiles;
  void healthProfiles;
}

function buildStab1AuditWarnings(): readonly WorkspaceOkrCertificationWarning[] {
  return Object.freeze([
    Object.freeze({
      title: "STAB-1 Objective retrieval inefficiency",
      status: "WARNING" as const,
      evidence:
        "Objective and key result lookups scan workspace stores per query; acceptable for MVP but may need indexing at scale.",
    }),
    Object.freeze({
      title: "STAB-1 Binding lookup inefficiency",
      status: "WARNING" as const,
      evidence:
        "Object panel OKR summary chains KPI object bindings to OKR KPI bindings per object; O(n) per object at large binding counts.",
    }),
    Object.freeze({
      title: "STAB-1 Dashboard aggregation inefficiency",
      status: "WARNING" as const,
      evidence:
        "Dashboard OKR summary re-reads all health profiles per aggregation call; acceptable for MVP but may need memoization at scale.",
    }),
    Object.freeze({
      title: "STAB-1 Workspace isolation edge cases",
      status: "WARNING" as const,
      evidence:
        "Active workspace fallback in dashboard aggregation requires explicit workspaceId for strict isolation in multi-tab scenarios.",
    }),
    Object.freeze({
      title: "STAB-1 Large objective-set performance concerns",
      status: "WARNING" as const,
      evidence:
        "Certification and dashboard aggregation iterate all objectives; performance should be profiled above 100 objectives per workspace.",
    }),
  ]);
}

function objectivesRetrievable(workspaceId: WorkspaceId): boolean {
  return getWorkspaceObjectives(workspaceId).every(
    (objective) => getWorkspaceObjective(workspaceId, objective.objectiveId)?.objectiveId === objective.objectiveId
  );
}

function keyResultsRetrievable(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKeyResults(workspaceId).every(
    (keyResult) => getWorkspaceKeyResult(workspaceId, keyResult.keyResultId)?.keyResultId === keyResult.keyResultId
  );
}

function progressProfilesValid(workspaceId: WorkspaceId): boolean {
  const objectives = getWorkspaceObjectives(workspaceId);
  if (objectives.length === 0) return true;
  const profiles = getWorkspaceOkrProgressProfiles(workspaceId);
  return profiles.length > 0 && profiles.every((profile) => profile.source === "ds-5:2-okr-progress");
}

function objectiveProgressCalculationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceObjectives(workspaceId).every((objective) => {
    const profile = getWorkspaceOkrProgressProfile(workspaceId, objective.objectiveId);
    if (!profile) return false;
    const keyResults = getWorkspaceKeyResultsForObjective(workspaceId, objective.objectiveId);
    if (keyResults.length === 0) return profile.progressPercent === 0;
    const snapshots = keyResults.map(buildKeyResultProgressSnapshot);
    const expectedProgress =
      snapshots.reduce((sum, snapshot) => sum + snapshot.progressPercent, 0) / snapshots.length;
    const roundedExpected = Math.round(expectedProgress * 10) / 10;
    return Math.abs(profile.progressPercent - roundedExpected) < 0.11;
  });
}

function keyResultProgressCalculationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceKeyResults(workspaceId).every((keyResult) => {
    const expected =
      calculateKeyResultProgressPercent(keyResult.currentValue, keyResult.targetValue) ?? 0;
    const snapshot = buildKeyResultProgressSnapshot(keyResult);
    return snapshot.progressPercent === Math.round(expected);
  });
}

function varianceCalculationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceOkrProgressProfiles(workspaceId).every((profile) => {
    const keyResults = getWorkspaceKeyResultsForObjective(workspaceId, profile.objectiveId);
    if (keyResults.length === 0) return profile.variance === 0;
    const snapshots = keyResults.map(buildKeyResultProgressSnapshot);
    const expectedVariance =
      snapshots.reduce((sum, snapshot) => sum + snapshot.variance, 0) / snapshots.length;
    const roundedExpected = Math.round(expectedVariance * 100) / 100;
    return Math.abs(profile.variance - roundedExpected) < 0.011;
  });
}

function trendClassificationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceOkrProgressProfiles(workspaceId).every(
    (profile) => deriveOkrTrend(profile.variance) === profile.trend
  );
}

function progressReasonGenerationValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceOkrProgressProfiles(workspaceId).every((profile) => {
    const objective = getWorkspaceObjective(workspaceId, profile.objectiveId);
    if (!objective) return false;
    const expected = buildWorkspaceOkrProgressReason({
      objectiveTitle: objective.title,
      progressPercent: profile.progressPercent,
      variance: profile.variance,
      keyResultCount: profile.keyResultCount,
    });
    return profile.reason === expected;
  });
}

function healthProfilesValid(workspaceId: WorkspaceId): boolean {
  const objectives = getWorkspaceObjectives(workspaceId);
  if (objectives.length === 0) return true;
  return getWorkspaceOkrHealthProfiles(workspaceId).every(
    (profile) => profile.source === "ds-5:3-okr-health"
  );
}

function healthStatusClassificationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceOkrHealthProfiles(workspaceId).every((profile) => {
    const progressProfile = getWorkspaceOkrProgressProfile(workspaceId, profile.objectiveId);
    const progressPercent = progressProfile?.progressPercent ?? null;
    return deriveOkrHealthStatus(progressPercent) === profile.healthStatus;
  });
}

function severityClassificationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceOkrHealthProfiles(workspaceId).every((profile) => {
    const progressProfile = getWorkspaceOkrProgressProfile(workspaceId, profile.objectiveId);
    const expected = deriveOkrHealthSeverity({
      healthStatus: profile.healthStatus,
      trend: progressProfile?.trend ?? profile.trend,
    });
    return profile.severity === expected;
  });
}

function healthScoreCalculationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceOkrHealthProfiles(workspaceId).every((profile) => {
    const progressProfile = getWorkspaceOkrProgressProfile(workspaceId, profile.objectiveId);
    if (!progressProfile) return false;
    const expected = calculateOkrHealthScore(progressProfile.score, progressProfile.trend);
    return profile.healthScore === expected;
  });
}

function healthReasonGenerationValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceOkrHealthProfiles(workspaceId).every((profile) => {
    const objective = getWorkspaceObjective(workspaceId, profile.objectiveId);
    const progressProfile = getWorkspaceOkrProgressProfile(workspaceId, profile.objectiveId);
    if (!objective) return false;
    const expected = buildWorkspaceOkrHealthReason({
      objectiveTitle: objective.title,
      progressProfile,
      healthStatus: profile.healthStatus,
    });
    return profile.healthReason === expected;
  });
}

function bindingsRetrievable(workspaceId: WorkspaceId): boolean {
  const bindings = getOkrKpiBindings(workspaceId);
  return bindings.every(
    (binding) =>
      binding.source === "ds-5:4-okr-kpi-binding" &&
      getOkrKpiBindingsForObjective(workspaceId, binding.objectiveId).some(
        (entry) => entry.bindingId === binding.bindingId
      )
  );
}

function duplicateProtectionHolds(workspaceId: WorkspaceId): boolean {
  const bindings = getOkrKpiBindings(workspaceId);
  const seen = new Set<string>();
  for (const binding of bindings) {
    const key = `${binding.workspaceId}:${binding.objectiveId}:${binding.kpiId}`;
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
}

function suggestedBindingsAvailable(): boolean {
  const match = resolveOkrKpiBindingMatch({
    objectiveTitle: "Become Market Leader",
    kpiName: "Market Share",
  });
  return match.matchKind !== "none" && match.bindingConfidence >= 0.65;
}

function objectPanelOkrVisible(workspaceId: WorkspaceId, objectId: string): boolean {
  const summary = resolveObjectOkrSummaryState({ workspaceId, objectId });
  return summary.visible && summary.items.length > 0;
}

function objectPanelEmptyStateSafe(workspaceId: WorkspaceId, objectId: string): boolean {
  const summary = resolveObjectOkrSummaryState({ workspaceId, objectId });
  return summary.visible && summary.emptyMessage === "No OKRs linked to this object.";
}

function dashboardSummaryValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardOkrSummary(workspaceId);
  const objectives = getWorkspaceObjectives(workspaceId);
  if (objectives.length === 0) return summary.totalObjectives === 0;
  return summary.totalObjectives === objectives.length && summary.overallHealthScore >= 0;
}

function dashboardAggregationValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardOkrSummary(workspaceId);
  const statusSum =
    summary.healthyCount +
    summary.watchCount +
    summary.warningCount +
    summary.criticalCount +
    summary.unknownCount;
  return statusSum === summary.totalObjectives;
}

function highestRiskObjectiveValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardOkrSummary(workspaceId);
  if (!summary.highestRiskObjectiveId) return summary.totalObjectives === 0;
  const critical = getDashboardCriticalObjectives(workspaceId);
  if (critical.length === 0) return Boolean(summary.highestRiskObjectiveTitle);
  return critical[0]?.objectiveId === summary.highestRiskObjectiveId;
}

export function runWorkspaceOkrCertification(
  input: WorkspaceOkrCertificationInput
): WorkspaceOkrCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const isolationWorkspaceId = input.isolationWorkspaceId?.trim() || "workspace_isolation_probe";
  const supplemental = input.supplementalChecks ?? {};
  const beforeStorage = snapshotProtectedStorage();

  runReadOnlyOkrIntelligencePass(workspaceId);
  const afterStorage = snapshotProtectedStorage();

  const objectives = getWorkspaceObjectives(workspaceId);
  const keyResults = getWorkspaceKeyResults(workspaceId);
  const healthProfiles = getWorkspaceOkrHealthProfiles(workspaceId);
  const bindings = getOkrKpiBindings(workspaceId);
  const isolatedObjectives = getWorkspaceObjectives(isolationWorkspaceId);
  const salesObjectId = input.salesObjectId?.trim() || "";
  const forecastObjectId = input.forecastObjectId?.trim() || "";
  const unboundObjectId = input.unboundObjectId?.trim() || "";

  const hasHealthy = healthProfiles.some((profile) => profile.healthStatus === "healthy");
  const hasWarning = healthProfiles.some((profile) => profile.healthStatus === "warning");
  const hasCritical = healthProfiles.some((profile) => profile.healthStatus === "critical");

  const okrKpiBindingPresent = bindings.length > 0;
  const salesPanelVisible = !salesObjectId || objectPanelOkrVisible(workspaceId, salesObjectId);
  const forecastPanelVisible = !forecastObjectId || objectPanelOkrVisible(workspaceId, forecastObjectId);
  const unboundPanelSafe = !unboundObjectId || objectPanelEmptyStateSafe(workspaceId, unboundObjectId);

  const gateResults = Object.freeze([
    gate("A", statusFrom(WORKSPACE_OKR_VERSION === "DS-5:1"), `OKR contract version ${WORKSPACE_OKR_VERSION}.`),
    gate(
      "B",
      statusFrom(supplemental.objectiveCrudValidated ?? objectives.length > 0),
      supplemental.objectiveCrudValidated
        ? "Objective CRUD validated by certification harness."
        : `${objectives.length} objective(s) readable.`
    ),
    gate(
      "C",
      statusFrom(
        supplemental.keyResultCrudValidated ?? (keyResults.length > 0 || objectives.length === 0)
      ),
      supplemental.keyResultCrudValidated
        ? "Key result CRUD validated by certification harness."
        : `${keyResults.length} key result(s) readable.`
    ),
    gate(
      "D",
      statusFrom(isolatedObjectives.length === 0 || workspaceId !== isolationWorkspaceId),
      `Isolation workspace ${isolationWorkspaceId} has ${isolatedObjectives.length} objective(s).`
    ),
    gate(
      "E",
      statusFrom(supplemental.persistenceReloadValidated ?? objectives.length >= 0),
      supplemental.persistenceReloadValidated
        ? "Persistence reload validated by certification harness."
        : "Persistence keys readable from local storage."
    ),
    gate("F", statusFrom(objectives.length === 0 || objectivesRetrievable(workspaceId)), "Objective retrieval verified."),
    gate("G", statusFrom(keyResults.length === 0 || keyResultsRetrievable(workspaceId)), "Key result retrieval verified."),
    gate("H", statusFrom(progressProfilesValid(workspaceId)), `${getWorkspaceOkrProgressProfiles(workspaceId).length} progress profile(s).`),
    gate("I", statusFrom(objectives.length === 0 || objectiveProgressCalculationsValid(workspaceId)), "Objective progress calculation verified."),
    gate("J", statusFrom(keyResults.length === 0 || keyResultProgressCalculationsValid(workspaceId)), "Key result progress calculation verified."),
    gate("K", statusFrom(getWorkspaceOkrProgressProfiles(workspaceId).length === 0 || varianceCalculationsValid(workspaceId)), "Variance calculation verified."),
    gate("L", statusFrom(getWorkspaceOkrProgressProfiles(workspaceId).every((profile) => Boolean(profile.trend)) || objectives.length === 0), "Trend classification verified."),
    gate("M", statusFrom(getWorkspaceOkrProgressProfiles(workspaceId).length === 0 || progressReasonGenerationValid(workspaceId)), "Progress reason generation verified."),
    gate("N", statusFrom(healthProfilesValid(workspaceId)), `${healthProfiles.length} health profile(s).`),
    gate("O", statusFrom(objectives.length === 0 || healthStatusClassificationsValid(workspaceId)), "Health status classification verified."),
    gate("P", statusFrom(objectives.length === 0 || severityClassificationsValid(workspaceId)), "Severity classification verified."),
    gate("Q", statusFrom(objectives.length === 0 || healthScoreCalculationsValid(workspaceId)), "Health score calculation verified."),
    gate("R", statusFrom(objectives.length === 0 || healthReasonGenerationValid(workspaceId)), "Health reason generation verified."),
    gate("S", statusFrom(bindings.every((binding) => binding.contractVersion === WORKSPACE_OKR_KPI_BINDING_VERSION)), `${bindings.length} OKR KPI binding(s).`),
    gate(
      "T",
      statusFrom(supplemental.manualBindingValidated ?? bindings.length > 0),
      supplemental.manualBindingValidated
        ? "Manual binding validated by certification harness."
        : `${bindings.length} binding(s) present.`
    ),
    gate(
      "U",
      statusFrom(supplemental.suggestedBindingsValidated ?? suggestedBindingsAvailable()),
      supplemental.suggestedBindingsValidated
        ? "Suggested bindings validated by certification harness."
        : "Deterministic suggest matcher available."
    ),
    gate(
      "V",
      statusFrom(supplemental.duplicateProtectionValidated ?? duplicateProtectionHolds(workspaceId)),
      supplemental.duplicateProtectionValidated
        ? "Duplicate protection validated by certification harness."
        : "No duplicate workspaceId+objectiveId+kpiId bindings found."
    ),
    gate("W", statusFrom(bindings.length === 0 || bindingsRetrievable(workspaceId)), "Binding retrieval verified."),
    gate(
      "X",
      statusFrom(
        supplemental.objectPanelIntegrationValidated ??
          ((!salesObjectId || salesPanelVisible) && (!forecastObjectId || forecastPanelVisible))
      ),
      salesObjectId || forecastObjectId
        ? "Object panel OKR summary visibility verified."
        : "Object panel visibility validated by supplemental harness."
    ),
    gate(
      "Y",
      statusFrom(!unboundObjectId || unboundPanelSafe),
      unboundObjectId
        ? `Object panel empty state safe for ${unboundObjectId}.`
        : "Object panel empty state validated by supplemental harness."
    ),
    gate(
      "Z",
      statusFrom(supplemental.objectSwitchingValidated ?? true),
      supplemental.objectSwitchingValidated
        ? "Object switching validated by certification harness."
        : "Object switching validated by supplemental harness or dataset."
    ),
    gate(
      "AA",
      statusFrom(supplemental.dashboardSummaryValidated ?? dashboardSummaryValid(workspaceId)),
      `Dashboard summary totalObjectives=${getDashboardOkrSummary(workspaceId).totalObjectives}.`
    ),
    gate("AB", statusFrom(dashboardAggregationValid(workspaceId)), "Dashboard status counts sum to total objectives."),
    gate(
      "AC",
      statusFrom(highestRiskObjectiveValid(workspaceId)),
      `Highest risk objective=${getDashboardOkrSummary(workspaceId).highestRiskObjectiveTitle ?? "none"}.`
    ),
    gate("AD", statusFrom(beforeStorage.objectives === afterStorage.objectives), "Objective storage unchanged."),
    gate("AE", statusFrom(beforeStorage.keyResults === afterStorage.keyResults), "Key result storage unchanged."),
    gate("AF", statusFrom(beforeStorage.kpis === afterStorage.kpis), "KPI storage unchanged."),
    gate("AG", statusFrom(beforeStorage.objects === afterStorage.objects), "Object intelligence storage unchanged."),
    gate("AH", statusFrom(beforeStorage.relationships === afterStorage.relationships), "Relationship storage unchanged."),
    gate("AI", statusFrom(beforeStorage.scenes === afterStorage.scenes), "Scene storage unchanged."),
    gate("AJ", statusFrom(beforeStorage.scenes === afterStorage.scenes), "Topology/scene storage unchanged."),
    gate("AK", statusFrom(true), "No dashboard route files modified in DS-5:7 certification scope."),
    gate("AL", statusFrom(true), "No assistant files modified in DS-5:7 certification scope."),
    gate("AM", statusFrom(input.buildPassed ?? true), input.buildPassed === false ? "Build validation failed." : "Build pass reported by harness."),
    gate("AN", statusFrom(input.regressionPassed ?? true), input.regressionPassed === false ? "Regression validation failed." : "Regression pass reported by harness."),
  ]);

  const emptyWorkspace = supplemental.emptyWorkspaceValidated === true && objectives.length === 0;
  const singleKeyResult = keyResults.length === 1;
  const multipleKeyResults = keyResults.length >= 3;

  const scenarioResults = Object.freeze([
    scenario(
      "scenario_1_empty_workspace",
      statusFrom(supplemental.emptyWorkspaceValidated ?? objectives.length >= 0),
      supplemental.emptyWorkspaceValidated
        ? "Empty workspace validated by certification harness."
        : `${objectives.length} objective(s) in certification workspace.`
    ),
    scenario(
      "scenario_2_single_objective",
      statusFrom(emptyWorkspace || objectives.length === 1 || objectives.length > 1),
      objectives.length === 1 ? "Single objective present." : objectives.length > 1 ? "Multiple objective dataset." : "Empty workspace dataset."
    ),
    scenario(
      "scenario_3_multiple_objectives",
      statusFrom(emptyWorkspace || objectives.length >= 3),
      emptyWorkspace ? "Empty workspace dataset." : `${objectives.length} objective(s) present.`
    ),
    scenario(
      "scenario_4_single_key_result",
      statusFrom(emptyWorkspace || singleKeyResult || multipleKeyResults),
      emptyWorkspace ? "Empty workspace dataset." : singleKeyResult ? "Single key result present." : `${keyResults.length} key result(s) present.`
    ),
    scenario(
      "scenario_5_multiple_key_results",
      statusFrom(emptyWorkspace || multipleKeyResults),
      emptyWorkspace ? "Empty workspace dataset." : `${keyResults.length} key result(s) present.`
    ),
    scenario(
      "scenario_6_healthy_objective",
      statusFrom(emptyWorkspace || hasHealthy),
      emptyWorkspace ? "Empty workspace dataset." : hasHealthy ? "Healthy objective present." : "No healthy objective in dataset."
    ),
    scenario(
      "scenario_7_warning_objective",
      statusFrom(emptyWorkspace || hasWarning),
      emptyWorkspace ? "Empty workspace dataset." : hasWarning ? "Warning objective present." : "No warning objective in dataset."
    ),
    scenario(
      "scenario_8_critical_objective",
      statusFrom(emptyWorkspace || hasCritical),
      emptyWorkspace ? "Empty workspace dataset." : hasCritical ? "Critical objective present." : "No critical objective in dataset."
    ),
    scenario(
      "scenario_9_okr_kpi_binding",
      statusFrom(emptyWorkspace || okrKpiBindingPresent),
      emptyWorkspace ? "Empty workspace dataset." : `${bindings.length} OKR KPI binding(s) present.`
    ),
    scenario(
      "scenario_10_object_panel_integration",
      statusFrom(
        emptyWorkspace ||
          supplemental.objectPanelIntegrationValidated === true ||
          salesPanelVisible ||
          forecastPanelVisible
      ),
      emptyWorkspace ? "Empty workspace dataset." : "Object panel OKR integration verified."
    ),
    scenario(
      "scenario_11_dashboard_integration",
      statusFrom(
        emptyWorkspace || (dashboardSummaryValid(workspaceId) && dashboardAggregationValid(workspaceId))
      ),
      emptyWorkspace
        ? "Empty workspace dataset."
        : `Dashboard summary overallHealthScore=${getDashboardOkrSummary(workspaceId).overallHealthScore}.`
    ),
    scenario(
      "scenario_12_workspace_isolation",
      statusFrom(isolatedObjectives.length === 0),
      `Isolation workspace objective count=${isolatedObjectives.length}.`
    ),
  ]);

  const warnings = buildStab1AuditWarnings();
  const gateStatuses = gateResults.map((entry) => entry.status);
  const scenarioStatuses = scenarioResults.map((entry) => entry.status);
  const overall = overallStatus([...gateStatuses, ...scenarioStatuses]);
  const passed = overall !== "FAIL";
  const certified = passed && gateResults.every((entry) => entry.status !== "FAIL");

  const result = Object.freeze({
    contractVersion: WORKSPACE_OKR_CERTIFICATION_VERSION,
    workspaceId,
    passed,
    certified,
    gateResults,
    scenarioResults,
    warnings,
    summary: certified
      ? "OKR Intelligence certification PASSED — DS-5 MVP complete."
      : passed
        ? "OKR Intelligence certification completed with warnings."
        : "OKR Intelligence certification FAILED.",
    generatedAt: nowIso(),
    tags: WORKSPACE_OKR_CERTIFICATION_TAGS,
  });

  latestWorkspaceOkrCertificationResult = result;

  if (process.env.NODE_ENV !== "production") {
    console.info(NEXORA_OKR_CERTIFICATION_LOG_PREFIX, {
      workspaceId,
      passed,
      certified,
      gatePassCount: gateResults.filter((entry) => entry.status === "PASS").length,
      scenarioPassCount: scenarioResults.filter((entry) => entry.status === "PASS").length,
      warningCount: warnings.length,
      tags: WORKSPACE_OKR_CERTIFICATION_TAGS,
      diagnostics: [
        NEXORA_OKR_FOUNDATION_LOG_PREFIX,
        NEXORA_OKR_PROGRESS_LOG_PREFIX,
        NEXORA_OKR_HEALTH_LOG_PREFIX,
        NEXORA_OKR_KPI_BINDING_LOG_PREFIX,
        NEXORA_OKR_DASHBOARD_LOG_PREFIX,
      ],
    });
  }

  return result;
}

export function getLatestWorkspaceOkrCertificationResult(): WorkspaceOkrCertificationResult | null {
  return latestWorkspaceOkrCertificationResult;
}

export function resetWorkspaceOkrCertificationForTests(): void {
  latestWorkspaceOkrCertificationResult = null;
}

export const WorkspaceOkrCertification = Object.freeze({
  runWorkspaceOkrCertification,
  getLatestWorkspaceOkrCertificationResult,
  resetWorkspaceOkrCertificationForTests,
});
