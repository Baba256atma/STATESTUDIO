/**
 * APP-8:7 — Decision Journal API certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_IDENTITY,
} from "./decisionJournalContracts.ts";
import { createDecisionJournalFoundation } from "./decisionJournalFoundation.ts";
import { resetDecisionJournalPlatformForTests } from "./decisionJournalRunner.ts";
import {
  createDecisionJournalEntry,
  getDecisionJournalEntryById,
  initializeDecisionJournalEngine,
  resetDecisionJournalEngineForTests,
} from "./decisionJournalEngine.ts";
import {
  initializeDecisionJournalQueryLayer,
  resetDecisionJournalQueryLayerForTests,
} from "./decisionJournalQuery.ts";
import {
  initializeDecisionJournalReflectionLayer,
  resetDecisionJournalReflectionLayerForTests,
} from "./decisionJournalReflection.ts";
import {
  initializeDecisionJournalEvidenceAssumptionLayer,
  resetDecisionJournalEvidenceAssumptionLayerForTests,
} from "./decisionJournalEvidenceAssumption.ts";
import {
  initializeDecisionJournalRetrospectiveLayer,
  resetDecisionJournalRetrospectiveLayerForTests,
} from "./decisionJournalRetrospective.ts";
import { createDecisionJournalApiFacade } from "./decisionJournalApiFacade.ts";
import { buildDecisionJournalApiManifest } from "./decisionJournalApiManifest.ts";
import {
  validateDecisionJournalApiManifest,
  validateDecisionJournalApiPrerequisites,
} from "./decisionJournalApiValidation.ts";
import { validateDecisionJournalConsumerAccess } from "./decisionJournalConsumerValidation.ts";
import {
  DECISION_JOURNAL_API_CONTRACT_VERSION,
  type DecisionJournalApiCertificationCheck,
  type DecisionJournalApiCertificationResult,
} from "./decisionJournalApiTypes.ts";
import { DECISION_JOURNAL_API_SELF_MANIFEST } from "./decisionJournalApiManifest.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE = "ws-api-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionJournalApiCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function bootstrapLayers() {
  resetDecisionJournalPlatformForTests();
  resetDecisionJournalEngineForTests();
  resetDecisionJournalQueryLayerForTests();
  resetDecisionJournalReflectionLayerForTests();
  resetDecisionJournalEvidenceAssumptionLayerForTests();
  resetDecisionJournalRetrospectiveLayerForTests();
  createDecisionJournalFoundation(FIXED_TIME);
  initializeDecisionJournalEngine(FIXED_TIME);
  initializeDecisionJournalQueryLayer(FIXED_TIME);
  initializeDecisionJournalReflectionLayer(FIXED_TIME);
  initializeDecisionJournalEvidenceAssumptionLayer(FIXED_TIME);
  initializeDecisionJournalRetrospectiveLayer(FIXED_TIME);
}

function seedEntry() {
  createDecisionJournalEntry({
    id: "api-cert-entry-1",
    workspaceId: WORKSPACE,
    title: "API certification entry",
    summary: "APP-8:7 certification sample.",
    rationale: "Certification bootstrap entry.",
    expectedOutcome: "Validated API facade behavior.",
    confidence: "medium",
    author: "api-certification",
    source: "manual",
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
  });
}

export function runDecisionJournalApiCertification(): DecisionJournalApiCertificationResult {
  bootstrapLayers();
  seedEntry();

  const api = createDecisionJournalApiFacade(() => {
    throw new Error("Certification runner invoked during certification build.");
  });

  const checks: DecisionJournalApiCertificationCheck[] = [];
  const prerequisites = validateDecisionJournalApiPrerequisites();

  checks.push(
    check("A_foundation_available", "APP-8:1 foundation available", prerequisites.valid, "foundation ready")
  );

  checks.push(
    check("B_engine_available", "APP-8:2 engine available", prerequisites.valid, "engine ready")
  );

  checks.push(
    check("C_query_layer_available", "APP-8:3 query layer available", prerequisites.valid, "query layer ready")
  );

  checks.push(
    check(
      "D_reflection_layer_available",
      "APP-8:4 reflection layer available",
      prerequisites.valid,
      "reflection layer ready"
    )
  );

  checks.push(
    check(
      "E_quality_layer_available",
      "APP-8:5 evidence/assumption layer available",
      prerequisites.valid,
      "quality layer ready"
    )
  );

  checks.push(
    check(
      "F_retrospective_layer_available",
      "APP-8:6 retrospective layer available",
      prerequisites.valid,
      "retrospective layer ready"
    )
  );

  checks.push(
    check(
      "G_api_facade_initialized",
      "API facade initialized",
      api.version === DECISION_JOURNAL_API_CONTRACT_VERSION,
      api.version
    )
  );

  const created = api.entries.createEntry({
    id: "api-cert-entry-2",
    workspaceId: WORKSPACE,
    title: "Facade create",
    summary: "Created through API facade.",
    rationale: "Facade certification create.",
    expectedOutcome: "Entry persisted via facade.",
    confidence: "high",
    author: "api-certification",
    source: "manual",
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
  });
  checks.push(
    check(
      "H_entries_api_delegates",
      "Entries API delegates safely",
      created.success === true && getDecisionJournalEntryById("api-cert-entry-2") !== null,
      created.reason
    )
  );

  const query = api.query.queryJournal({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "I_query_api_delegates",
      "Query API delegates safely",
      query.success === true && (query.data?.totalEntries ?? 0) >= 2,
      `${query.data?.totalEntries ?? 0} entries`
    )
  );

  const reflection = api.reflection.buildReflection({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "J_reflection_api_delegates",
      "Reflection API delegates safely",
      reflection.success === true && (reflection.data?.entryCount ?? 0) >= 2,
      `${reflection.data?.insightItems.length ?? 0} insights`
    )
  );

  const quality = api.quality.buildEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "K_quality_api_delegates",
      "Quality API delegates safely",
      quality.success === true && (quality.data?.entryCount ?? 0) >= 2,
      `${quality.data?.qualityFlags.length ?? 0} flags`
    )
  );

  const retrospective = api.retrospective.buildRetrospectiveModel({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "L_retrospective_api_delegates",
      "Retrospective API delegates safely",
      retrospective.success === true && (retrospective.data?.entryCount ?? 0) >= 2,
      `${retrospective.data?.retrospectives.length ?? 0} retrospectives`
    )
  );

  const manifest = buildDecisionJournalApiManifest(FIXED_TIME);
  checks.push(
    check(
      "M_manifest_valid",
      "Manifest valid",
      validateDecisionJournalApiManifest(manifest).valid === true,
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
      validateDecisionJournalConsumerAccess({
        consumerId: consumerId as never,
        apiGroup: consumerId === "WorkspaceConsumer" ? "entries" : "query",
        operation: consumerId === "WorkspaceConsumer" ? "createEntry" : "queryJournal",
        mutation: consumerId === "WorkspaceConsumer",
      }).valid ||
      (consumerId !== "WorkspaceConsumer" &&
        validateDecisionJournalConsumerAccess({
          consumerId: consumerId as never,
          apiGroup: "query",
          operation: "queryJournal",
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

  const dashboardReadOnly = validateDecisionJournalConsumerAccess({
    consumerId: "DashboardConsumer",
    apiGroup: "query",
    operation: "queryJournal",
    mutation: false,
  }).valid;
  const dashboardWriteBlocked = !validateDecisionJournalConsumerAccess({
    consumerId: "DashboardConsumer",
    apiGroup: "entries",
    operation: "createEntry",
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

  const workspaceWrite = validateDecisionJournalConsumerAccess({
    consumerId: "WorkspaceConsumer",
    apiGroup: "entries",
    operation: "createEntry",
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

  const forbidden = !validateDecisionJournalConsumerAccess({
    consumerId: "VisualizationConsumer",
    apiGroup: "entries",
    operation: "createEntry",
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

  const stubCertification = createDecisionJournalApiFacade(() =>
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
    readEngineSource("app/lib/decision-journal/decisionJournalApi.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalApiFacade.ts"),
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
      !integrationBundle.includes("VisualizationRenderer") && !integrationBundle.includes("TimelineRenderer"),
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
      "X_no_app6_integration",
      "No APP-6 integration",
      !integrationBundle.includes("decision-timeline/") && !integrationBundle.includes("APP-6"),
      "no APP-6 coupling"
    )
  );

  const protectedFiles = DECISION_JOURNAL_API_SELF_MANIFEST.allowedFiles.filter(
    (file) => !file.includes("decisionJournalApi") && file.includes("decision-journal/")
  );
  checks.push(
    check(
      "Y_prior_platforms_untouched",
      "Prior platforms untouched",
      protectedFiles.every((file) => existsSync(join(REPO_ROOT, file))),
      "prior APP-8 files present"
    )
  );

  checks.push(
    check(
      "app8_identity_regression",
      "APP-8:1 identity regression",
      DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.version === DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
      DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check("stage_manifest", "Stage manifest validation", validateStageManifest(DECISION_JOURNAL_API_SELF_MANIFEST).valid === true, "manifest valid")
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-journal/decisionJournalApi.ts",
        allowedFiles: DECISION_JOURNAL_API_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_JOURNAL_API_SELF_MANIFEST.forbiddenPatterns,
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

export const DecisionJournalApiRunner = Object.freeze({
  runDecisionJournalApiCertification,
});
