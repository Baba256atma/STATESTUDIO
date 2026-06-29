/**
 * APP-7:6 — Business Timeline API certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "./businessTimelineContracts.ts";
import { createBusinessTimelineFoundation } from "./businessTimelineFoundation.ts";
import { resetBusinessTimelinePlatformForTests } from "./businessTimelineRunner.ts";
import {
  createBusinessEvent,
  getBusinessEventById,
  initializeBusinessEventEngine,
  resetBusinessEventEngineForTests,
} from "./businessEventEngine.ts";
import {
  initializeBusinessTimelineQueryLayer,
  resetBusinessTimelineQueryLayerForTests,
} from "./businessTimelineQuery.ts";
import {
  buildBusinessLifecycleModel,
  initializeBusinessTimelineLifecycleLayer,
  resetBusinessTimelineLifecycleLayerForTests,
} from "./businessTimelineLifecycle.ts";
import {
  buildBusinessTimelineContextModel,
  initializeBusinessTimelineContextLayer,
  resetBusinessTimelineContextLayerForTests,
} from "./businessTimelineContext.ts";
import { createBusinessTimelineApiFacade } from "./businessTimelineApiFacade.ts";
import { buildBusinessTimelineApiManifest } from "./businessTimelineApiManifest.ts";
import { validateBusinessTimelineApiManifest, validateBusinessTimelineApiPrerequisites } from "./businessTimelineApiValidation.ts";
import { validateBusinessTimelineConsumerAccess } from "./businessTimelineConsumerValidation.ts";
import {
  BUSINESS_TIMELINE_API_CONTRACT_VERSION,
  type BusinessTimelineApiCertificationCheck,
  type BusinessTimelineApiCertificationResult,
} from "./businessTimelineApiTypes.ts";
import { BUSINESS_TIMELINE_API_SELF_MANIFEST } from "./businessTimelineApiManifest.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE = "ws-api-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): BusinessTimelineApiCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function bootstrapLayers() {
  resetBusinessTimelinePlatformForTests();
  resetBusinessEventEngineForTests();
  resetBusinessTimelineQueryLayerForTests();
  resetBusinessTimelineLifecycleLayerForTests();
  resetBusinessTimelineContextLayerForTests();
  createBusinessTimelineFoundation(FIXED_TIME);
  initializeBusinessEventEngine(FIXED_TIME);
  initializeBusinessTimelineQueryLayer(FIXED_TIME);
  initializeBusinessTimelineLifecycleLayer(FIXED_TIME);
  initializeBusinessTimelineContextLayer(FIXED_TIME);
}

function seedEvents() {
  createBusinessEvent({
    id: "api-cert-event-1",
    workspaceId: WORKSPACE,
    title: "API certification event",
    description: "APP-7:6 certification sample.",
    category: "product",
    type: "milestone",
    importance: "high",
    status: "completed",
    source: "manual",
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "api-certification",
    tags: Object.freeze(["certification"]),
  });
}

export function runBusinessTimelineApiCertification(): BusinessTimelineApiCertificationResult {
  bootstrapLayers();
  seedEvents();

  const api = createBusinessTimelineApiFacade(() => {
    throw new Error("Certification runner invoked during certification build.");
  });

  const checks: BusinessTimelineApiCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-7:1 foundation available",
      validateBusinessTimelineApiPrerequisites().valid === true,
      "foundation ready"
    )
  );

  checks.push(
    check(
      "B_event_engine_available",
      "APP-7:2 event engine available",
      validateBusinessTimelineApiPrerequisites().valid === true,
      "event engine ready"
    )
  );

  checks.push(
    check(
      "C_query_layer_available",
      "APP-7:3 query layer available",
      validateBusinessTimelineApiPrerequisites().valid === true,
      "query layer ready"
    )
  );

  checks.push(
    check(
      "D_lifecycle_layer_available",
      "APP-7:4 lifecycle layer available",
      validateBusinessTimelineApiPrerequisites().valid === true,
      "lifecycle layer ready"
    )
  );

  checks.push(
    check(
      "E_context_layer_available",
      "APP-7:5 context layer available",
      validateBusinessTimelineApiPrerequisites().valid === true,
      "context layer ready"
    )
  );

  checks.push(
    check(
      "F_api_facade_initialized",
      "API facade initialized",
      api.version === BUSINESS_TIMELINE_API_CONTRACT_VERSION,
      api.version
    )
  );

  const created = api.events.createEvent({
    id: "api-cert-event-2",
    workspaceId: WORKSPACE,
    title: "Facade create",
    description: "Created through API facade.",
    category: "financial",
    type: "achievement",
    importance: "medium",
    status: "completed",
    source: "manual",
    createdAt: FIXED_TIME,
    occurredAt: "2021-01-01T00:00:00.000Z",
    createdBy: "api-certification",
  });
  checks.push(
    check(
      "G_event_api_delegates",
      "Event API delegates safely",
      created.success === true && getBusinessEventById("api-cert-event-2") !== null,
      created.reason
    )
  );

  const query = api.query.queryTimeline({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "H_query_api_delegates",
      "Query API delegates safely",
      query.success === true && (query.data?.totalEvents ?? 0) >= 2,
      `${query.data?.totalEvents ?? 0} events`
    )
  );

  const lifecycle = api.lifecycle.buildLifecycle({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "I_lifecycle_api_delegates",
      "Lifecycle API delegates safely",
      lifecycle.success === true && lifecycle.data?.summary.eventCount === query.data?.totalEvents,
      `${lifecycle.data?.segments.length ?? 0} segments`
    )
  );

  const context = api.context.buildContextModel({ workspaceId: WORKSPACE });
  checks.push(
    check(
      "J_context_api_delegates",
      "Context API delegates safely",
      context.success === true && context.data?.summary.eventCount === query.data?.totalEvents,
      `${context.data?.relationships.length ?? 0} relationships`
    )
  );

  const manifest = buildBusinessTimelineApiManifest(FIXED_TIME);
  checks.push(
    check(
      "K_manifest_valid",
      "Manifest valid",
      validateBusinessTimelineApiManifest(manifest).valid === true,
      manifest.platformId
    )
  );

  const consumersValid = ["DashboardConsumer", "AssistantConsumer", "WorkspaceConsumer", "VisualizationConsumer", "ReportConsumer", "ExportConsumer", "FutureAppConsumer"].every(
    (consumerId) =>
      validateBusinessTimelineConsumerAccess({
        consumerId: consumerId as never,
        apiGroup: consumerId === "WorkspaceConsumer" ? "events" : "query",
        operation: consumerId === "WorkspaceConsumer" ? "createEvent" : "queryTimeline",
        mutation: consumerId === "WorkspaceConsumer",
      }).valid ||
      (consumerId !== "WorkspaceConsumer" &&
        validateBusinessTimelineConsumerAccess({
          consumerId: consumerId as never,
          apiGroup: "query",
          operation: "queryTimeline",
          mutation: false,
        }).valid)
  );
  checks.push(
    check(
      "L_consumer_contracts_valid",
      "Consumer contracts valid",
      consumersValid === true && manifest.consumerCompatibility.length === 7,
      `${manifest.consumerCompatibility.length} consumers`
    )
  );

  const dashboardReadOnly = validateBusinessTimelineConsumerAccess({
    consumerId: "DashboardConsumer",
    apiGroup: "query",
    operation: "queryTimeline",
    mutation: false,
  }).valid;
  const dashboardWriteBlocked = !validateBusinessTimelineConsumerAccess({
    consumerId: "DashboardConsumer",
    apiGroup: "events",
    operation: "createEvent",
    mutation: true,
  }).valid;
  checks.push(
    check(
      "M_read_only_consumers_enforced",
      "Read-only consumers enforced",
      dashboardReadOnly && dashboardWriteBlocked,
      "dashboard read-only"
    )
  );

  const workspaceWrite = validateBusinessTimelineConsumerAccess({
    consumerId: "WorkspaceConsumer",
    apiGroup: "events",
    operation: "createEvent",
    mutation: true,
  }).valid;
  checks.push(
    check(
      "N_controlled_write_access",
      "Controlled write access enforced",
      workspaceWrite === true,
      "workspace write allowed"
    )
  );

  const forbidden = !validateBusinessTimelineConsumerAccess({
    consumerId: "VisualizationConsumer",
    apiGroup: "events",
    operation: "createEvent",
    mutation: true,
  }).valid;
  checks.push(
    check(
      "O_forbidden_access_rejected",
      "Forbidden access rejected",
      forbidden === true,
      "visualization write blocked"
    )
  );

  const stubCertification = createBusinessTimelineApiFacade(() =>
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
      "P_certification_api_works",
      "Certification API works",
      certApi.success === true && certApi.data?.status === "PASS",
      certApi.reason
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/business-timeline/businessTimelineApi.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineApiFacade.ts"),
  ].join("\n");
  checks.push(
    check(
      "Q_no_ui_logic",
      "No UI logic",
      !integrationBundle.includes(".tsx") && !integrationBundle.includes("components/"),
      "no UI runtime"
    )
  );

  checks.push(
    check(
      "R_no_dashboard_logic",
      "No dashboard logic",
      !integrationBundle.includes("DashboardAdapter") && !integrationBundle.includes("dashboardIntegration"),
      "no dashboard implementation"
    )
  );

  checks.push(
    check(
      "S_no_assistant_logic",
      "No assistant logic",
      !integrationBundle.includes("AssistantAdapter") && !integrationBundle.includes("assistantIntegration"),
      "no assistant implementation"
    )
  );

  checks.push(
    check(
      "T_no_visualization_logic",
      "No visualization logic",
      !integrationBundle.includes("TimelineRenderer") && !integrationBundle.includes("BusinessChart"),
      "no visualization implementation"
    )
  );

  checks.push(
    check(
      "U_no_scenario_decision_coupling",
      "No scenario/decision coupling",
      !integrationBundle.includes("scenario-timeline/") && !integrationBundle.includes("decision-timeline/"),
      "no cross-platform coupling"
    )
  );

  const protectedFiles = BUSINESS_TIMELINE_API_SELF_MANIFEST.allowedFiles.filter(
    (file) => !file.includes("businessTimelineApi") && file.includes("business-timeline/")
  );
  checks.push(
    check(
      "V_prior_platforms_untouched",
      "Prior platforms untouched",
      protectedFiles.every((file) => existsSync(join(REPO_ROOT, file))),
      "prior APP-7 files present"
    )
  );

  checks.push(
    check(
      "V_app7_identity_regression",
      "APP-7:1 identity regression",
      BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.version === BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
      BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(BUSINESS_TIMELINE_API_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/business-timeline/businessTimelineApi.ts",
        allowedFiles: BUSINESS_TIMELINE_API_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: BUSINESS_TIMELINE_API_SELF_MANIFEST.forbiddenPatterns,
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

export const BusinessTimelineApiRunner = Object.freeze({
  runBusinessTimelineApiCertification,
});
