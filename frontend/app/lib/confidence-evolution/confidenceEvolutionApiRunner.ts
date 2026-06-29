/**
 * APP-9:7 — Confidence Evolution API certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "./confidenceEvolutionContracts.ts";
import { createConfidenceEvolutionFoundation } from "./confidenceEvolutionFoundation.ts";
import { resetConfidenceEvolutionPlatformForTests } from "./confidenceEvolutionRunner.ts";
import {
  createConfidenceRecord,
  getConfidenceRecordById,
  initializeConfidenceEvolutionEngine,
  resetConfidenceEvolutionEngineForTests,
} from "./confidenceEvolutionEngine.ts";
import {
  initializeConfidenceEvolutionQueryLayer,
  resetConfidenceEvolutionQueryLayerForTests,
} from "./confidenceEvolutionQuery.ts";
import {
  initializeConfidenceEvolutionTrendLayer,
  resetConfidenceEvolutionTrendLayerForTests,
} from "./confidenceEvolutionTrend.ts";
import {
  initializeConfidenceEvidenceReasonLayer,
  resetConfidenceEvidenceReasonLayerForTests,
} from "./confidenceEvolutionEvidenceReason.ts";
import {
  initializeConfidenceCalibrationLayer,
  resetConfidenceCalibrationLayerForTests,
} from "./confidenceEvolutionCalibration.ts";
import { createConfidenceEvolutionApiFacade } from "./confidenceEvolutionApiFacade.ts";
import { buildConfidenceEvolutionApiManifest, CONFIDENCE_EVOLUTION_API_SELF_MANIFEST } from "./confidenceEvolutionApiManifest.ts";
import {
  validateConfidenceEvolutionApiManifest,
  validateConfidenceEvolutionApiPrerequisites,
} from "./confidenceEvolutionApiValidation.ts";
import { validateConfidenceEvolutionConsumerAccess } from "./confidenceEvolutionConsumerValidation.ts";
import {
  CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
  type ConfidenceEvolutionApiCertificationCheck,
  type ConfidenceEvolutionApiCertificationResult,
} from "./confidenceEvolutionApiTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE = "ws-confidence-api-cert-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ConfidenceEvolutionApiCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleRecord(id: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `API certification ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "APP-9:7 certification record.",
    evidenceReferences: Object.freeze(["api-cert-evidence"]),
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function bootstrapLayers() {
  resetConfidenceCalibrationLayerForTests();
  resetConfidenceEvidenceReasonLayerForTests();
  resetConfidenceEvolutionTrendLayerForTests();
  resetConfidenceEvolutionQueryLayerForTests();
  resetConfidenceEvolutionEngineForTests();
  resetConfidenceEvolutionPlatformForTests();
  createConfidenceEvolutionFoundation(FIXED_TIME);
  initializeConfidenceEvolutionEngine(FIXED_TIME);
  initializeConfidenceEvolutionQueryLayer(FIXED_TIME);
  initializeConfidenceEvolutionTrendLayer(FIXED_TIME);
  initializeConfidenceEvidenceReasonLayer(FIXED_TIME);
  initializeConfidenceCalibrationLayer(FIXED_TIME);
}

function seedRecord() {
  createConfidenceRecord(
    sampleRecord("confidence-api-cert-1", {
      updatedAt: "2026-01-01T00:00:00.000Z",
      confidenceScore: 0.55,
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-api-cert-2", {
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.72,
      reason: "new_evidence",
      source: "evidence",
    })
  );
}

export function runConfidenceEvolutionApiCertification(): ConfidenceEvolutionApiCertificationResult {
  bootstrapLayers();
  seedRecord();

  const api = createConfidenceEvolutionApiFacade(() => {
    throw new Error("Certification runner invoked during certification build.");
  });

  const checks: ConfidenceEvolutionApiCertificationCheck[] = [];
  const prerequisites = validateConfidenceEvolutionApiPrerequisites();

  checks.push(
    check("A_foundation_available", "APP-9:1 foundation available", prerequisites.valid, "foundation ready")
  );
  checks.push(
    check("B_engine_available", "APP-9:2 engine available", prerequisites.valid, "engine ready")
  );
  checks.push(
    check("C_query_layer_available", "APP-9:3 query layer available", prerequisites.valid, "query layer ready")
  );
  checks.push(
    check("D_trend_layer_available", "APP-9:4 trend layer available", prerequisites.valid, "trend layer ready")
  );
  checks.push(
    check(
      "E_evidence_reason_layer_available",
      "APP-9:5 evidence/reason layer available",
      prerequisites.valid,
      "evidence/reason layer ready"
    )
  );
  checks.push(
    check(
      "F_calibration_layer_available",
      "APP-9:6 calibration layer available",
      prerequisites.valid,
      "calibration layer ready"
    )
  );

  checks.push(
    check(
      "G_api_facade_initialized",
      "API facade initialized",
      api.version === CONFIDENCE_EVOLUTION_API_CONTRACT_VERSION,
      api.version
    )
  );

  const created = api.records.createRecord(
    sampleRecord("confidence-api-cert-3", {
      updatedAt: "2026-03-01T00:00:00.000Z",
      confidenceScore: 0.68,
    })
  );
  checks.push(
    check(
      "H_records_api_delegates",
      "Records API delegates safely",
      created.success === true && getConfidenceRecordById("confidence-api-cert-3") !== null,
      created.reason
    )
  );

  const query = api.query.queryConfidence({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "I_query_api_delegates",
      "Query API delegates safely",
      query.success === true && (query.data?.totalRecords ?? 0) >= 3,
      `${query.data?.totalRecords ?? 0} records`
    )
  );

  const trend = api.trend.buildTrendModel({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "J_trend_api_delegates",
      "Trend API delegates safely",
      trend.success === true && (trend.data?.recordCount ?? 0) >= 3,
      trend.data?.direction ?? "unknown"
    )
  );

  const evidenceReason = api.evidenceReason.buildEvidenceReasonModel({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "K_evidence_reason_api_delegates",
      "Evidence/reason API delegates safely",
      evidenceReason.success === true && (evidenceReason.data?.recordCount ?? 0) >= 3,
      `${evidenceReason.data?.linkCount ?? 0} links`
    )
  );

  const calibration = api.calibration.buildCalibrationModel({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "L_calibration_api_delegates",
      "Calibration API delegates safely",
      calibration.success === true && (calibration.data?.recordCount ?? 0) >= 3,
      `${calibration.data?.recordCalibrations.length ?? 0} calibrations`
    )
  );

  const manifest = buildConfidenceEvolutionApiManifest(FIXED_TIME);
  checks.push(
    check(
      "M_manifest_valid",
      "Manifest valid",
      validateConfidenceEvolutionApiManifest(manifest).valid === true,
      manifest.platformId
    )
  );

  const consumersValid = [
    "DashboardConsumer",
    "AssistantConsumer",
    "WorkspaceConsumer",
    "VisualizationConsumer",
    "ReportConsumer",
    "ExportConsumer",
    "FutureAppConsumer",
  ].every(
    (consumerId) =>
      validateConfidenceEvolutionConsumerAccess({
        consumerId: consumerId as never,
        apiGroup: consumerId === "WorkspaceConsumer" ? "records" : "query",
        operation: consumerId === "WorkspaceConsumer" ? "createRecord" : "queryConfidence",
        mutation: consumerId === "WorkspaceConsumer",
      }).valid ||
      (consumerId !== "WorkspaceConsumer" &&
        validateConfidenceEvolutionConsumerAccess({
          consumerId: consumerId as never,
          apiGroup: "query",
          operation: "queryConfidence",
          mutation: false,
        }).valid)
  );
  checks.push(
    check(
      "N_consumer_contracts_valid",
      "Consumer contracts valid",
      consumersValid === true && manifest.consumerCompatibility.length === 7,
      `${manifest.consumerCompatibility.length} consumers`
    )
  );

  const dashboardReadOnly = validateConfidenceEvolutionConsumerAccess({
    consumerId: "DashboardConsumer",
    apiGroup: "query",
    operation: "queryConfidence",
    mutation: false,
  }).valid;
  const dashboardWriteBlocked = !validateConfidenceEvolutionConsumerAccess({
    consumerId: "DashboardConsumer",
    apiGroup: "records",
    operation: "createRecord",
    mutation: true,
  }).valid;
  checks.push(
    check(
      "O_read_only_consumers_enforced",
      "Read-only consumers enforced",
      dashboardReadOnly && dashboardWriteBlocked,
      "dashboard read-only"
    )
  );

  const workspaceWrite = validateConfidenceEvolutionConsumerAccess({
    consumerId: "WorkspaceConsumer",
    apiGroup: "records",
    operation: "createRecord",
    mutation: true,
  }).valid;
  checks.push(
    check(
      "P_workspace_controlled_write_enforced",
      "Workspace controlled write enforced",
      workspaceWrite === true,
      "workspace write allowed"
    )
  );

  const forbidden = !validateConfidenceEvolutionConsumerAccess({
    consumerId: "VisualizationConsumer",
    apiGroup: "records",
    operation: "createRecord",
    mutation: true,
  }).valid;
  checks.push(
    check(
      "Q_forbidden_access_rejected",
      "Forbidden access rejected",
      forbidden === true,
      "visualization write blocked"
    )
  );

  const stubCertification = createConfidenceEvolutionApiFacade(() =>
    Object.freeze({
      certified: true,
      status: "PASS" as const,
      summary: "stub",
      checks: Object.freeze([]),
      score: 100,
      readOnly: true as const,
    })
  );
  const certApi = stubCertification.certification.runCertification();
  checks.push(
    check(
      "R_certification_api_works",
      "Certification API works",
      certApi.success === true && certApi.data?.status === "PASS",
      certApi.reason
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionApi.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionApiFacade.ts"),
  ].join("\n");
  checks.push(
    check(
      "S_no_ui_logic",
      "No UI logic",
      !integrationBundle.includes(".tsx") && !integrationBundle.includes("components/"),
      "no UI runtime"
    )
  );
  checks.push(
    check(
      "T_no_dashboard_implementation",
      "No dashboard implementation",
      !integrationBundle.includes("DashboardAdapter") && !integrationBundle.includes("dashboardIntegration"),
      "no dashboard implementation"
    )
  );
  checks.push(
    check(
      "U_no_assistant_implementation",
      "No assistant implementation",
      !integrationBundle.includes("AssistantAdapter") && !integrationBundle.includes("assistantIntegration"),
      "no assistant implementation"
    )
  );
  checks.push(
    check(
      "V_no_visualization_implementation",
      "No visualization implementation",
      !integrationBundle.includes("VisualizationRenderer") && !integrationBundle.includes("ConfidenceChart"),
      "no visualization implementation"
    )
  );
  checks.push(
    check(
      "W_no_persistence",
      "No persistence",
      !integrationBundle.includes("localStorage") &&
        !integrationBundle.includes("indexedDB") &&
        !integrationBundle.includes("fetch("),
      "no persistence runtime"
    )
  );
  checks.push(
    check(
      "X_no_app678_integration",
      "No APP-6/7/8 integration",
      !integrationBundle.includes("decision-timeline/") &&
        !integrationBundle.includes("business-timeline/") &&
        !integrationBundle.includes("decision-journal/"),
      "no APP-6/7/8 coupling"
    )
  );

  checks.push(
    check(
      "Y_prior_platforms_untouched",
      "Prior platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9" &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionFoundation.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibration.ts")),
      "identities and prior layers intact"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(CONFIDENCE_EVOLUTION_API_SELF_MANIFEST).valid === true,
      CONFIDENCE_EVOLUTION_API_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionApi.ts",
        allowedFiles: CONFIDENCE_EVOLUTION_API_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CONFIDENCE_EVOLUTION_API_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;
  const score = Math.round((passedCount / checks.length) * 100);

  return Object.freeze({
    certified: failedCount === 0,
    status: failedCount === 0 ? ("PASS" as const) : ("FAIL" as const),
    summary: `${passedCount}/${checks.length} certification checks passed.`,
    checks: Object.freeze(checks),
    score,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionApiRunner = Object.freeze({
  runConfidenceEvolutionApiCertification,
});
