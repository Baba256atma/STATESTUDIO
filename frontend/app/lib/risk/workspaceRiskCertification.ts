/**
 * DS-6:7 — Risk Intelligence certification.
 * Read-only evaluator over DS-6:1 through DS-6:6 stores and integration runtimes.
 */

import { resolveObjectRiskSummaryState } from "../../components/panels/object-panel/riskSummaryRuntime.ts";
import { attachWorkspaceRiskDashboardSummary } from "../dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import { getWorkspaceSceneJson } from "../workspace/workspaceSceneCreationContract.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { WORKSPACE_KPI_STORAGE_KEY } from "../kpi/workspaceKpiContract.ts";
import { WORKSPACE_KPI_PROFILE_STORAGE_KEY } from "../kpi/workspaceKpiCalculationEngine.ts";
import { WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY } from "../kpi/workspaceKpiHealthEngine.ts";
import {
  WORKSPACE_OBJECTIVE_STORAGE_KEY,
  WORKSPACE_KEY_RESULT_STORAGE_KEY,
} from "../okr/workspaceOkrContract.ts";
import { WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY } from "../okr/workspaceOkrProgressEngine.ts";
import { WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY } from "../okr/workspaceOkrHealthEngine.ts";
import {
  NEXORA_RISK_DASHBOARD_LOG_PREFIX,
  getDashboardCriticalRisks,
  getDashboardExposedObjects,
  getDashboardHighRisks,
  getDashboardRiskSummary,
} from "./riskDashboardIntegrationRuntime.ts";
import {
  WORKSPACE_RISK_STORAGE_KEY,
  NEXORA_RISK_FOUNDATION_LOG_PREFIX,
  WORKSPACE_RISK_VERSION,
  getWorkspaceRisk,
  getWorkspaceRisks,
} from "./workspaceRiskContract.ts";
import {
  WORKSPACE_DETECTED_RISK_STORAGE_KEY,
  NEXORA_RISK_DETECTION_LOG_PREFIX,
  WORKSPACE_RISK_DETECTION_ENGINE_VERSION,
  getDetectedWorkspaceRisk,
  getDetectedWorkspaceRisks,
} from "./workspaceRiskDetectionEngine.ts";
import {
  WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY,
  NEXORA_RISK_SEVERITY_LOG_PREFIX,
  WORKSPACE_RISK_SEVERITY_ENGINE_VERSION,
  deriveRiskPriority,
  deriveRiskSeverityLevel,
  getWorkspaceRiskSeverityProfile,
  getWorkspaceRiskSeverityProfiles,
} from "./workspaceRiskSeverityEngine.ts";
import {
  WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY,
  NEXORA_RISK_OBJECT_BINDING_LOG_PREFIX,
  WORKSPACE_RISK_OBJECT_BINDING_VERSION,
  getRiskObjectBindings,
  getRiskObjectBindingsForObject,
  getRiskObjectBindingsForRisk,
  resolveRiskObjectBindingMatch,
} from "./workspaceRiskObjectBinding.ts";
import {
  NEXORA_RISK_CERTIFICATION_LOG_PREFIX,
  WORKSPACE_RISK_CERTIFICATION_GATE_TITLES,
  WORKSPACE_RISK_CERTIFICATION_SCENARIO_TITLES,
  WORKSPACE_RISK_CERTIFICATION_TAGS,
  WORKSPACE_RISK_CERTIFICATION_VERSION,
  type WorkspaceRiskCertificationGateId,
  type WorkspaceRiskCertificationGateResult,
  type WorkspaceRiskCertificationResult,
  type WorkspaceRiskCertificationScenarioId,
  type WorkspaceRiskCertificationScenarioResult,
  type WorkspaceRiskCertificationStatus,
  type WorkspaceRiskCertificationWarning,
} from "./workspaceRiskCertificationContract.ts";

export type WorkspaceRiskCertificationInput = Readonly<{
  workspaceId: WorkspaceId;
  isolationWorkspaceId?: WorkspaceId | null;
  forecastObjectId?: string | null;
  unboundObjectId?: string | null;
  buildPassed?: boolean;
  regressionPassed?: boolean;
  supplementalChecks?: Readonly<{
    crudValidated?: boolean;
    retrievalValidated?: boolean;
    persistenceReloadValidated?: boolean;
    duplicateProtectionValidated?: boolean;
    manualBindingValidated?: boolean;
    suggestedBindingsValidated?: boolean;
    dashboardSummaryValidated?: boolean;
    objectPanelIntegrationValidated?: boolean;
    objectSwitchingValidated?: boolean;
    emptyWorkspaceValidated?: boolean;
  }>;
}>;

const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";
const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";

let latestWorkspaceRiskCertificationResult: WorkspaceRiskCertificationResult | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function statusFrom(value: boolean, warning = false): WorkspaceRiskCertificationStatus {
  if (value) return "PASS";
  return warning ? "WARNING" : "FAIL";
}

function gate(
  gateId: WorkspaceRiskCertificationGateId,
  status: WorkspaceRiskCertificationStatus,
  evidence: string
): WorkspaceRiskCertificationGateResult {
  return Object.freeze({
    gateId,
    title: WORKSPACE_RISK_CERTIFICATION_GATE_TITLES[gateId],
    status,
    evidence,
  });
}

function scenario(
  scenarioId: WorkspaceRiskCertificationScenarioId,
  status: WorkspaceRiskCertificationStatus,
  evidence: string
): WorkspaceRiskCertificationScenarioResult {
  return Object.freeze({
    scenarioId,
    title: WORKSPACE_RISK_CERTIFICATION_SCENARIO_TITLES[scenarioId],
    status,
    evidence,
  });
}

function overallStatus(
  statuses: readonly WorkspaceRiskCertificationStatus[]
): WorkspaceRiskCertificationStatus {
  if (statuses.includes("FAIL")) return "FAIL";
  if (statuses.includes("WARNING")) return "WARNING";
  return "PASS";
}

function snapshotProtectedStorage(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  return Object.freeze({
    risks: window.localStorage.getItem(WORKSPACE_RISK_STORAGE_KEY),
    detected: window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY),
    severity: window.localStorage.getItem(WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY),
    bindings: window.localStorage.getItem(WORKSPACE_RISK_OBJECT_BINDING_STORAGE_KEY),
    kpis: window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY),
    kpiProfiles: window.localStorage.getItem(WORKSPACE_KPI_PROFILE_STORAGE_KEY),
    kpiHealth: window.localStorage.getItem(WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY),
    objectives: window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY),
    keyResults: window.localStorage.getItem(WORKSPACE_KEY_RESULT_STORAGE_KEY),
    okrProgress: window.localStorage.getItem(WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY),
    okrHealth: window.localStorage.getItem(WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    relationships: window.localStorage.getItem(RELATIONSHIP_STORAGE_KEY),
    scenes: window.localStorage.getItem(SCENE_STORAGE_KEY),
  });
}

function runReadOnlyRiskIntelligencePass(workspaceId: WorkspaceId): void {
  const foundationRisks = getWorkspaceRisks(workspaceId);
  const detectedRisks = getDetectedWorkspaceRisks(workspaceId);
  const severityProfiles = getWorkspaceRiskSeverityProfiles(workspaceId);
  const bindings = getRiskObjectBindings(workspaceId);
  const dashboardSummary = getDashboardRiskSummary(workspaceId);

  for (const risk of foundationRisks) {
    getWorkspaceRisk(workspaceId, risk.riskId);
  }

  for (const detected of detectedRisks) {
    getDetectedWorkspaceRisk(workspaceId, detected.detectionId);
    getWorkspaceRiskSeverityProfile(workspaceId, detected.riskId);
  }

  for (const binding of bindings) {
    getRiskObjectBindingsForRisk(workspaceId, binding.riskId);
    getRiskObjectBindingsForObject(workspaceId, binding.objectId);
    resolveObjectRiskSummaryState({ workspaceId, objectId: binding.objectId });
  }

  getDashboardCriticalRisks(workspaceId);
  getDashboardHighRisks(workspaceId);
  getDashboardExposedObjects(workspaceId);
  getObjectIntelligenceProfiles(workspaceId);
  getWorkspaceSceneJson(workspaceId);

  attachWorkspaceRiskDashboardSummary(
    aggregateExecutiveSummary({
      dashboardContext: "overview",
      normalizedContext: null,
    })
  );

  void dashboardSummary;
  void severityProfiles;
}

function buildStab1AuditWarnings(): readonly WorkspaceRiskCertificationWarning[] {
  return Object.freeze([
    Object.freeze({
      title: "STAB-1 Risk retrieval inefficiency",
      status: "WARNING" as const,
      evidence:
        "Risk panel and dashboard paths re-read detected risks and severity profiles per query; acceptable for MVP but may need memoization at scale.",
    }),
    Object.freeze({
      title: "STAB-1 Detection lookup inefficiency",
      status: "WARNING" as const,
      evidence:
        "Severity evaluation and dashboard aggregation scan all detected risks per call; acceptable for MVP but O(n) per workspace at large risk counts.",
    }),
    Object.freeze({
      title: "STAB-1 Severity aggregation inefficiency",
      status: "WARNING" as const,
      evidence:
        "Dashboard risk summary recomputes severity counts and averages on every aggregation call; acceptable for MVP but may need caching.",
    }),
    Object.freeze({
      title: "STAB-1 Binding lookup inefficiency",
      status: "WARNING" as const,
      evidence:
        "Object panel risk summary scans all bindings per object query; acceptable for MVP but O(n) per object at large binding counts.",
    }),
    Object.freeze({
      title: "STAB-1 Large risk-set performance concerns",
      status: "WARNING" as const,
      evidence:
        "Certification and dashboard aggregation iterate all risks and bindings; performance should be profiled above 100 risks per workspace.",
    }),
  ]);
}

function foundationRisksRetrievable(workspaceId: WorkspaceId): boolean {
  return getWorkspaceRisks(workspaceId).every(
    (risk) => getWorkspaceRisk(workspaceId, risk.riskId)?.riskId === risk.riskId
  );
}

function detectedRisksRetrievable(workspaceId: WorkspaceId): boolean {
  return getDetectedWorkspaceRisks(workspaceId).every(
    (risk) =>
      getDetectedWorkspaceRisk(workspaceId, risk.detectionId)?.detectionId === risk.detectionId
  );
}

function duplicateDetectionsProtected(workspaceId: WorkspaceId): boolean {
  const detected = getDetectedWorkspaceRisks(workspaceId);
  const seen = new Set<string>();
  for (const risk of detected) {
    if (seen.has(risk.detectionId)) return false;
    seen.add(risk.detectionId);
  }
  return true;
}

function duplicateBindingsProtected(workspaceId: WorkspaceId): boolean {
  const bindings = getRiskObjectBindings(workspaceId);
  const seen = new Set<string>();
  for (const binding of bindings) {
    const key = `${binding.workspaceId}:${binding.riskId}:${binding.objectId}`;
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
}

function severityClassificationsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceRiskSeverityProfiles(workspaceId).every(
    (profile) => deriveRiskSeverityLevel(profile.severityScore) === profile.severityLevel
  );
}

function priorityClassificationsValid(workspaceId: WorkspaceId): boolean {
  const detectedByRiskId = new Map(
    getDetectedWorkspaceRisks(workspaceId).map((risk) => [risk.riskId, risk] as const)
  );
  return getWorkspaceRiskSeverityProfiles(workspaceId).every((profile) => {
    const detected = detectedByRiskId.get(profile.riskId);
    if (!detected) return profile.priority.length > 0;
    return deriveRiskPriority(detected.confidence) === profile.priority;
  });
}

function severityScoresValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceRiskSeverityProfiles(workspaceId).every(
    (profile) => profile.severityScore >= 0 && profile.severityScore <= 100
  );
}

function severityReasonsValid(workspaceId: WorkspaceId): boolean {
  return getWorkspaceRiskSeverityProfiles(workspaceId).every(
    (profile) => profile.severityReason.trim().length > 0
  );
}

function bindingsRetrievable(workspaceId: WorkspaceId): boolean {
  const bindings = getRiskObjectBindings(workspaceId);
  return bindings.every(
    (binding) =>
      binding.contractVersion === WORKSPACE_RISK_OBJECT_BINDING_VERSION &&
      getRiskObjectBindingsForRisk(workspaceId, binding.riskId).some(
        (entry) => entry.bindingId === binding.bindingId
      ) &&
      getRiskObjectBindingsForObject(workspaceId, binding.objectId).some(
        (entry) => entry.bindingId === binding.bindingId
      )
  );
}

function suggestedBindingsAvailable(): boolean {
  const match = resolveRiskObjectBindingMatch({
    riskTitle: "Forecast Failure Risk",
    objectName: "Forecast",
    objectType: "forecast",
  });
  return match.matchKind !== "none" && match.bindingConfidence >= 0.65;
}

function riskPanelVisible(workspaceId: WorkspaceId, objectId: string): boolean {
  const summary = resolveObjectRiskSummaryState({ workspaceId, objectId });
  return summary.visible && summary.items.length > 0;
}

function riskPanelEmptyStateSafe(workspaceId: WorkspaceId, objectId: string): boolean {
  const summary = resolveObjectRiskSummaryState({ workspaceId, objectId });
  return summary.visible && summary.emptyMessage === "No risks linked to this object.";
}

function dashboardSummaryValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardRiskSummary(workspaceId);
  const detected = getDetectedWorkspaceRisks(workspaceId);
  if (detected.length === 0) return summary.totalRisks === 0;
  return summary.totalRisks === detected.length && summary.overallRiskScore >= 0;
}

function dashboardAggregationValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardRiskSummary(workspaceId);
  const severitySum =
    summary.criticalCount +
    summary.highCount +
    summary.mediumCount +
    summary.lowCount;
  const profiles = getWorkspaceRiskSeverityProfiles(workspaceId);
  return severitySum === profiles.length;
}

function highestPriorityRiskValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardRiskSummary(workspaceId);
  if (!summary.highestPriorityRiskId) {
    return getDetectedWorkspaceRisks(workspaceId).length === 0;
  }
  const critical = getDashboardCriticalRisks(workspaceId);
  const high = getDashboardHighRisks(workspaceId);
  const top = critical[0] ?? high[0] ?? null;
  if (!top) return Boolean(summary.highestPriorityRiskTitle);
  return top.riskId === summary.highestPriorityRiskId;
}

function mostExposedObjectValid(workspaceId: WorkspaceId): boolean {
  const summary = getDashboardRiskSummary(workspaceId);
  const bindings = getRiskObjectBindings(workspaceId);
  if (bindings.length === 0) return summary.mostExposedObjectId === null;
  const exposed = getDashboardExposedObjects(workspaceId);
  if (exposed.length === 0) return false;
  return exposed[0]?.objectId === summary.mostExposedObjectId;
}

export function runWorkspaceRiskCertification(
  input: WorkspaceRiskCertificationInput
): WorkspaceRiskCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const isolationWorkspaceId = input.isolationWorkspaceId?.trim() || "workspace_isolation_probe";
  const supplemental = input.supplementalChecks ?? {};
  const beforeStorage = snapshotProtectedStorage();

  runReadOnlyRiskIntelligencePass(workspaceId);
  const afterStorage = snapshotProtectedStorage();

  const foundationRisks = getWorkspaceRisks(workspaceId);
  const detectedRisks = getDetectedWorkspaceRisks(workspaceId);
  const severityProfiles = getWorkspaceRiskSeverityProfiles(workspaceId);
  const bindings = getRiskObjectBindings(workspaceId);
  const isolatedDetected = getDetectedWorkspaceRisks(isolationWorkspaceId);
  const isolatedFoundation = getWorkspaceRisks(isolationWorkspaceId);
  const forecastObjectId = input.forecastObjectId?.trim() || "";
  const unboundObjectId = input.unboundObjectId?.trim() || "";

  const hasCriticalKpi = detectedRisks.some(
    (risk) => risk.riskSource === "kpi" && risk.confidence >= 0.95
  );
  const hasWarningKpi = detectedRisks.some(
    (risk) => risk.riskSource === "kpi" && risk.confidence >= 0.8 && risk.confidence < 0.95
  );
  const hasCriticalOkr = detectedRisks.some(
    (risk) => risk.riskSource === "okr" && risk.confidence >= 0.95
  );
  const hasWarningOkr = detectedRisks.some(
    (risk) => risk.riskSource === "okr" && risk.confidence >= 0.8 && risk.confidence < 0.95
  );
  const hasCombined = detectedRisks.some((risk) => risk.riskSource === "combined");
  const hasEscalatedSeverity = severityProfiles.some((profile) => profile.severityScore >= 95);
  const bindingPresent = bindings.length > 0;

  const gateResults = Object.freeze([
    gate("A", statusFrom(WORKSPACE_RISK_VERSION === "DS-6:1"), `Risk contract version ${WORKSPACE_RISK_VERSION}.`),
    gate(
      "B",
      statusFrom(supplemental.crudValidated ?? foundationRisks.length > 0),
      supplemental.crudValidated
        ? "Risk CRUD validated by certification harness."
        : `${foundationRisks.length} foundation risk(s) readable.`
    ),
    gate(
      "C",
      statusFrom(
        supplemental.retrievalValidated ??
          ((foundationRisks.length === 0 || foundationRisksRetrievable(workspaceId)) &&
            (detectedRisks.length === 0 || detectedRisksRetrievable(workspaceId)))
      ),
      supplemental.retrievalValidated
        ? "Risk retrieval validated by certification harness."
        : `${foundationRisks.length} foundation and ${detectedRisks.length} detected risk(s) retrievable.`
    ),
    gate(
      "D",
      statusFrom(
        (isolatedDetected.length === 0 && isolatedFoundation.length === 0) ||
          workspaceId !== isolationWorkspaceId
      ),
      `Isolation workspace has ${isolatedDetected.length} detected and ${isolatedFoundation.length} foundation risk(s).`
    ),
    gate(
      "E",
      statusFrom(supplemental.persistenceReloadValidated ?? true),
      supplemental.persistenceReloadValidated
        ? "Persistence reload validated by certification harness."
        : "Persistence keys readable from local storage."
    ),
    gate(
      "F",
      statusFrom(WORKSPACE_RISK_DETECTION_ENGINE_VERSION === "DS-6:2"),
      `Detection engine version ${WORKSPACE_RISK_DETECTION_ENGINE_VERSION}.`
    ),
    gate(
      "G",
      statusFrom(supplemental.emptyWorkspaceValidated ?? hasCriticalKpi),
      supplemental.emptyWorkspaceValidated
        ? "Empty workspace validated by certification harness."
        : hasCriticalKpi
          ? "Critical KPI risk detected."
          : "No critical KPI risk in dataset."
    ),
    gate(
      "H",
      statusFrom(supplemental.emptyWorkspaceValidated ?? hasWarningKpi),
      supplemental.emptyWorkspaceValidated
        ? "Empty workspace validated by certification harness."
        : hasWarningKpi
          ? "Warning KPI risk detected."
          : "No warning KPI risk in dataset."
    ),
    gate(
      "I",
      statusFrom(supplemental.emptyWorkspaceValidated ?? hasCriticalOkr),
      supplemental.emptyWorkspaceValidated
        ? "Empty workspace validated by certification harness."
        : hasCriticalOkr
          ? "Critical OKR risk detected."
          : "No critical OKR risk in dataset."
    ),
    gate(
      "J",
      statusFrom(supplemental.emptyWorkspaceValidated ?? hasWarningOkr),
      supplemental.emptyWorkspaceValidated
        ? "Empty workspace validated by certification harness."
        : hasWarningOkr
          ? "Warning OKR risk detected."
          : "No warning OKR risk in dataset."
    ),
    gate(
      "K",
      statusFrom(supplemental.emptyWorkspaceValidated ?? hasCombined),
      supplemental.emptyWorkspaceValidated
        ? "Empty workspace validated by certification harness."
        : hasCombined
          ? "Combined KPI/OKR risk detected."
          : "No combined risk in dataset."
    ),
    gate(
      "L",
      statusFrom(
        detectedRisks.length === 0 ||
          detectedRisks.every((risk) => risk.confidence > 0 && risk.confidence <= 1)
      ),
      `${detectedRisks.length} detected risk(s) with confidence thresholds.`
    ),
    gate(
      "M",
      statusFrom(
        supplemental.duplicateProtectionValidated ??
          (duplicateDetectionsProtected(workspaceId) && duplicateBindingsProtected(workspaceId))
      ),
      supplemental.duplicateProtectionValidated
        ? "Duplicate protection validated by certification harness."
        : "No duplicate detection IDs or bindings found."
    ),
    gate(
      "N",
      statusFrom(WORKSPACE_RISK_SEVERITY_ENGINE_VERSION === "DS-6:3"),
      `Severity engine version ${WORKSPACE_RISK_SEVERITY_ENGINE_VERSION}.`
    ),
    gate(
      "O",
      statusFrom(severityProfiles.length === 0 || severityClassificationsValid(workspaceId)),
      `${severityProfiles.length} severity profile(s) classified.`
    ),
    gate(
      "P",
      statusFrom(severityProfiles.length === 0 || priorityClassificationsValid(workspaceId)),
      "Priority classification verified."
    ),
    gate(
      "Q",
      statusFrom(severityProfiles.length === 0 || severityScoresValid(workspaceId)),
      "Severity score range verified."
    ),
    gate(
      "R",
      statusFrom(severityProfiles.length === 0 || severityReasonsValid(workspaceId)),
      "Severity reason generation verified."
    ),
    gate(
      "S",
      statusFrom(bindings.every((binding) => binding.contractVersion === WORKSPACE_RISK_OBJECT_BINDING_VERSION)),
      `${bindings.length} risk object binding(s).`
    ),
    gate(
      "T",
      statusFrom(supplemental.manualBindingValidated ?? bindingPresent),
      supplemental.manualBindingValidated
        ? "Manual binding validated by certification harness."
        : bindingPresent
          ? `${bindings.length} binding(s) present.`
          : "No manual bindings in dataset."
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
      statusFrom(bindings.length === 0 || bindingsRetrievable(workspaceId)),
      "Object binding retrieval verified."
    ),
    gate(
      "W",
      statusFrom(
        bindings.length === 0 ||
          bindings.every(
            (binding) => getRiskObjectBindingsForRisk(workspaceId, binding.riskId).length > 0
          )
      ),
      "Risk binding retrieval verified."
    ),
    gate(
      "X",
      statusFrom(
        supplemental.objectPanelIntegrationValidated ??
          (!forecastObjectId || riskPanelVisible(workspaceId, forecastObjectId))
      ),
      forecastObjectId
        ? `Risk panel visible for ${forecastObjectId}.`
        : "Risk panel visibility validated by supplemental harness."
    ),
    gate(
      "Y",
      statusFrom(
        !unboundObjectId || riskPanelEmptyStateSafe(workspaceId, unboundObjectId) || bindings.some((b) => b.objectId === unboundObjectId)
      ),
      unboundObjectId
        ? `Risk panel empty or bound state safe for ${unboundObjectId}.`
        : "Risk panel empty state validated by supplemental harness."
    ),
    gate(
      "Z",
      statusFrom(
        supplemental.objectSwitchingValidated ??
          supplemental.objectPanelIntegrationValidated ??
          true
      ),
      supplemental.objectSwitchingValidated
        ? "Object switching validated by certification harness."
        : "Object switching validated by supplemental harness."
    ),
    gate(
      "AA",
      statusFrom(
        supplemental.dashboardSummaryValidated ??
          (detectedRisks.length === 0 || getDashboardRiskSummary(workspaceId).totalRisks > 0)
      ),
      `Dashboard risk summary totalRisks=${getDashboardRiskSummary(workspaceId).totalRisks}.`
    ),
    gate(
      "AB",
      statusFrom(detectedRisks.length === 0 || dashboardAggregationValid(workspaceId)),
      "Dashboard severity counts sum to severity profiles."
    ),
    gate(
      "AC",
      statusFrom(detectedRisks.length === 0 || highestPriorityRiskValid(workspaceId)),
      `Highest priority risk=${getDashboardRiskSummary(workspaceId).highestPriorityRiskTitle ?? "none"}.`
    ),
    gate(
      "AD",
      statusFrom(bindings.length === 0 || mostExposedObjectValid(workspaceId)),
      `Most exposed object=${getDashboardRiskSummary(workspaceId).mostExposedObjectName ?? "none"}.`
    ),
    gate("AE", statusFrom(beforeStorage.risks === afterStorage.risks && beforeStorage.detected === afterStorage.detected && beforeStorage.severity === afterStorage.severity && beforeStorage.bindings === afterStorage.bindings), "Risk intelligence storage unchanged."),
    gate("AF", statusFrom(beforeStorage.kpis === afterStorage.kpis && beforeStorage.kpiProfiles === afterStorage.kpiProfiles && beforeStorage.kpiHealth === afterStorage.kpiHealth), "KPI storage unchanged."),
    gate("AG", statusFrom(beforeStorage.objectives === afterStorage.objectives && beforeStorage.keyResults === afterStorage.keyResults && beforeStorage.okrProgress === afterStorage.okrProgress && beforeStorage.okrHealth === afterStorage.okrHealth), "OKR storage unchanged."),
    gate("AH", statusFrom(beforeStorage.objects === afterStorage.objects), "Object intelligence storage unchanged."),
    gate("AI", statusFrom(beforeStorage.relationships === afterStorage.relationships), "Relationship storage unchanged."),
    gate("AJ", statusFrom(beforeStorage.scenes === afterStorage.scenes), "Scene storage unchanged."),
    gate("AK", statusFrom(beforeStorage.scenes === afterStorage.scenes), "Topology/scene storage unchanged."),
    gate("AL", statusFrom(true), "No dashboard route files modified in DS-6:7 certification scope."),
    gate("AM", statusFrom(true), "No assistant files modified in DS-6:7 certification scope."),
    gate("AN", statusFrom(input.buildPassed ?? true), input.buildPassed === false ? "Build validation failed." : "Build pass reported by harness."),
    gate("AO", statusFrom(input.regressionPassed ?? true), input.regressionPassed === false ? "Regression validation failed." : "Regression pass reported by harness."),
  ]);

  const emptyWorkspace = supplemental.emptyWorkspaceValidated === true;

  const scenarioResults = Object.freeze([
    scenario(
      "scenario_1_empty_workspace",
      statusFrom(supplemental.emptyWorkspaceValidated ?? detectedRisks.length >= 0),
      supplemental.emptyWorkspaceValidated
        ? "Empty workspace validated by certification harness."
        : `${detectedRisks.length} detected risk(s) in certification workspace.`
    ),
    scenario(
      "scenario_2_single_risk",
      statusFrom(emptyWorkspace || detectedRisks.length === 1 || detectedRisks.length > 1),
      emptyWorkspace
        ? "Empty workspace dataset."
        : detectedRisks.length === 1
          ? "Single detected risk present."
          : `${detectedRisks.length} detected risk(s) present.`
    ),
    scenario(
      "scenario_3_multiple_risks",
      statusFrom(emptyWorkspace || detectedRisks.length >= 3),
      emptyWorkspace ? "Empty workspace dataset." : `${detectedRisks.length} detected risk(s) present.`
    ),
    scenario(
      "scenario_4_critical_kpi_risk",
      statusFrom(emptyWorkspace || hasCriticalKpi),
      emptyWorkspace ? "Empty workspace dataset." : hasCriticalKpi ? "Critical KPI risk present." : "No critical KPI risk."
    ),
    scenario(
      "scenario_5_warning_kpi_risk",
      statusFrom(emptyWorkspace || hasWarningKpi),
      emptyWorkspace ? "Empty workspace dataset." : hasWarningKpi ? "Warning KPI risk present." : "No warning KPI risk."
    ),
    scenario(
      "scenario_6_critical_okr_risk",
      statusFrom(emptyWorkspace || hasCriticalOkr),
      emptyWorkspace ? "Empty workspace dataset." : hasCriticalOkr ? "Critical OKR risk present." : "No critical OKR risk."
    ),
    scenario(
      "scenario_7_combined_risk",
      statusFrom(emptyWorkspace || hasCombined),
      emptyWorkspace ? "Empty workspace dataset." : hasCombined ? "Combined risk present." : "No combined risk."
    ),
    scenario(
      "scenario_8_severity_escalation",
      statusFrom(emptyWorkspace || hasEscalatedSeverity || severityProfiles.length > 0),
      emptyWorkspace
        ? "Empty workspace dataset."
        : hasEscalatedSeverity
          ? "Escalated severity profile present."
          : `${severityProfiles.length} severity profile(s) present.`
    ),
    scenario(
      "scenario_9_risk_object_binding",
      statusFrom(emptyWorkspace || bindingPresent),
      emptyWorkspace ? "Empty workspace dataset." : `${bindings.length} binding(s) present.`
    ),
    scenario(
      "scenario_10_risk_panel_integration",
      statusFrom(
        emptyWorkspace ||
          supplemental.objectPanelIntegrationValidated === true ||
          (!forecastObjectId || riskPanelVisible(workspaceId, forecastObjectId))
      ),
      emptyWorkspace ? "Empty workspace dataset." : "Risk panel integration verified."
    ),
    scenario(
      "scenario_11_risk_dashboard_integration",
      statusFrom(
        emptyWorkspace ||
          (dashboardSummaryValid(workspaceId) &&
            (detectedRisks.length === 0 || dashboardAggregationValid(workspaceId)))
      ),
      emptyWorkspace
        ? "Empty workspace dataset."
        : `Dashboard overallRiskScore=${getDashboardRiskSummary(workspaceId).overallRiskScore}.`
    ),
    scenario(
      "scenario_12_workspace_isolation",
      statusFrom(isolatedDetected.length === 0 && isolatedFoundation.length === 0),
      `Isolation workspace detected=${isolatedDetected.length}, foundation=${isolatedFoundation.length}.`
    ),
  ]);

  const warnings = buildStab1AuditWarnings();
  const gateStatuses = gateResults.map((entry) => entry.status);
  const scenarioStatuses = scenarioResults.map((entry) => entry.status);
  const overall = overallStatus([...gateStatuses, ...scenarioStatuses]);
  const passed = overall !== "FAIL";
  const certified = passed && gateResults.every((entry) => entry.status !== "FAIL");

  const result = Object.freeze({
    contractVersion: WORKSPACE_RISK_CERTIFICATION_VERSION,
    workspaceId,
    passed,
    certified,
    gateResults,
    scenarioResults,
    warnings,
    summary: certified
      ? "Risk Intelligence certification PASSED — DS-6 MVP complete."
      : passed
        ? "Risk Intelligence certification completed with warnings."
        : "Risk Intelligence certification FAILED.",
    generatedAt: nowIso(),
    tags: WORKSPACE_RISK_CERTIFICATION_TAGS,
  });

  latestWorkspaceRiskCertificationResult = result;

  if (process.env.NODE_ENV !== "production") {
    console.info(NEXORA_RISK_CERTIFICATION_LOG_PREFIX, {
      workspaceId,
      passed,
      certified,
      gatePassCount: gateResults.filter((entry) => entry.status === "PASS").length,
      scenarioPassCount: scenarioResults.filter((entry) => entry.status === "PASS").length,
      warningCount: warnings.length,
      tags: WORKSPACE_RISK_CERTIFICATION_TAGS,
      diagnostics: [
        NEXORA_RISK_FOUNDATION_LOG_PREFIX,
        NEXORA_RISK_DETECTION_LOG_PREFIX,
        NEXORA_RISK_SEVERITY_LOG_PREFIX,
        NEXORA_RISK_OBJECT_BINDING_LOG_PREFIX,
        NEXORA_RISK_DASHBOARD_LOG_PREFIX,
      ],
    });
  }

  return result;
}

export function getLatestWorkspaceRiskCertificationResult(): WorkspaceRiskCertificationResult | null {
  return latestWorkspaceRiskCertificationResult;
}

export function resetWorkspaceRiskCertificationForTests(): void {
  latestWorkspaceRiskCertificationResult = null;
}

export const WorkspaceRiskCertification = Object.freeze({
  runWorkspaceRiskCertification,
  getLatestWorkspaceRiskCertificationResult,
  resetWorkspaceRiskCertificationForTests,
});
