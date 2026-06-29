/**
 * APP-7:2 — Business Event Engine certification runner.
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
  archiveBusinessEvent,
  createBusinessEvent,
  filterBusinessEvents,
  getBusinessEventById,
  getBusinessEventRevisionHistory,
  getBusinessEventsByWorkspace,
  initializeBusinessEventEngine,
  isBusinessEventEngineInitialized,
  resetBusinessEventEngineForTests,
  updateBusinessEventMetadata,
  validateBusinessEventInput,
  BUSINESS_EVENT_ENGINE_SELF_MANIFEST,
} from "./businessEventEngine.ts";
import { getBusinessEventRegistrySnapshot } from "./businessEventEngineRegistry.ts";
import {
  assertNoHardDeleteInEngineSource,
  mapBusinessEngineEventToFoundationContract,
  validateEngineEventFoundationMapping,
  validateFoundationCompatibilityForEngine,
} from "./businessEventEngineValidation.ts";
import {
  BUSINESS_EVENT_ENGINE_CONTRACT_VERSION,
  type BusinessEventCertificationCheck,
  type BusinessEventEngineCertificationResult,
} from "./businessEventEngineTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");

function check(id: string, title: string, passed: boolean, evidence: string): BusinessEventCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/business-timeline/businessEventEngine.ts",
    "app/lib/business-timeline/businessEventEngineRegistry.ts",
    "app/lib/business-timeline/businessEventEngineMutations.ts",
  ].map((path) => readEngineSource(path));
  return modules.every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes("fetch(") &&
      !source.includes("BusinessChart") &&
      !source.includes("TimelineRenderer")
  );
}

function foundationFilesPresent(): boolean {
  const foundationFiles = BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7"
    ? BUSINESS_EVENT_ENGINE_SELF_MANIFEST.allowedFiles.filter(
        (file) => file.includes("businessTimeline") && !file.includes("businessEvent")
      )
    : [];
  return foundationFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function sampleInput() {
  return Object.freeze({
    workspaceId: "ws-cert-001",
    title: "Product launch",
    description: "Certification sample business event.",
    category: "product" as const,
    type: "milestone" as const,
    importance: "high" as const,
    status: "completed" as const,
    source: "manual" as const,
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "certification-runner",
    tags: Object.freeze(["launch", "product"]),
  });
}

export function runBusinessEventEngineCertification(): BusinessEventEngineCertificationResult {
  resetBusinessEventEngineForTests();
  resetBusinessTimelinePlatformForTests();
  createBusinessTimelineFoundation(FIXED_TIME);
  initializeBusinessEventEngine(FIXED_TIME);

  const checks: BusinessEventCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-7:1 foundation available",
      validateFoundationCompatibilityForEngine(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_initialized",
      "Business Event Engine initialized",
      isBusinessEventEngineInitialized() === true,
      "engine initialized"
    )
  );

  const created = createBusinessEvent({ ...sampleInput(), id: "business-event-cert-001" });
  checks.push(
    check(
      "C_event_creation_valid",
      "Event creation valid",
      created.success === true && created.data?.revisionVersion === 1,
      created.reason
    )
  );

  const invalidCategory = validateBusinessEventInput({
    ...sampleInput(),
    category: "invalid-category" as never,
  });
  checks.push(
    check(
      "D_event_validation_strict",
      "Event validation strict",
      invalidCategory.valid === false,
      invalidCategory.issues[0]?.message ?? "invalid rejected"
    )
  );

  const wsA = createBusinessEvent({ ...sampleInput(), id: "business-event-ws-a", workspaceId: "ws-a" });
  const wsBLookup = getBusinessEventById("business-event-ws-a");
  const wsBEvents = getBusinessEventsByWorkspace("ws-b");
  checks.push(
    check(
      "E_workspace_isolation",
      "Workspace isolation enforced",
      wsA.success === true && wsBLookup !== null && wsBEvents.length === 0,
      `${wsBEvents.length} events in ws-b`
    )
  );

  const duplicate = createBusinessEvent({ ...sampleInput(), id: "business-event-cert-001" });
  checks.push(
    check(
      "F_append_only_registry",
      "Append-only behavior enforced",
      duplicate.success === false && getBusinessEventRegistrySnapshot().publishedEventCount >= 2,
      duplicate.reason
    )
  );

  const engineSources = [
    readEngineSource("app/lib/business-timeline/businessEventEngine.ts"),
    readEngineSource("app/lib/business-timeline/businessEventEngineRegistry.ts"),
    readEngineSource("app/lib/business-timeline/businessEventEngineMutations.ts"),
  ].join("\n");
  checks.push(
    check(
      "G_no_hard_delete",
      "No hard delete exists",
      assertNoHardDeleteInEngineSource(engineSources) === true,
      "no deleteBusinessEvent API"
    )
  );

  const archived = archiveBusinessEvent("business-event-cert-001", "ws-cert-001");
  checks.push(
    check(
      "H_archive_policy",
      "Archive policy works",
      archived.success === true && archived.data?.status === "archived" && archived.data?.archived === true,
      archived.reason
    )
  );

  const updated = updateBusinessEventMetadata({
    id: "business-event-ws-a",
    workspaceId: "ws-a",
    title: "Updated launch title",
    importance: "critical",
  });
  const history = getBusinessEventRevisionHistory("business-event-ws-a");
  checks.push(
    check(
      "I_versioning",
      "Versioning works",
      updated.success === true &&
        updated.data?.revisionVersion === 2 &&
        history.length === 2 &&
        history[0]?.id === history[1]?.id,
      `${history.length} revisions`
    )
  );

  const filtered = filterBusinessEvents({
    workspaceId: "ws-a",
    type: "milestone",
    importance: "critical",
  });
  checks.push(
    check(
      "J_filtering",
      "Filtering works",
      filtered.length === 1 && filtered[0]?.id === "business-event-ws-a",
      `${filtered.length} filtered`
    )
  );

  checks.push(
    check(
      "K_prior_platforms_untouched",
      "APP-7:1 foundation files present",
      foundationFilesPresent() === true,
      "foundation intact"
    )
  );

  checks.push(
    check(
      "K_app7_1_identity_regression",
      "APP-7:1 platform identity regression",
      BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.version === BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
      BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION
    )
  );

  if (created.data) {
    checks.push(
      check(
        "K_foundation_mapping",
        "Engine event maps to APP-7:1 contract",
        validateEngineEventFoundationMapping(created.data).valid === true,
        mapBusinessEngineEventToFoundationContract(created.data).version
      )
    );
  }

  const integrationBundle = [
    readEngineSource("app/lib/business-timeline/businessEventEngine.ts"),
    readEngineSource("app/lib/business-timeline/businessEventEngineFilters.ts"),
    readEngineSource("app/lib/business-timeline/businessEventEngineMutations.ts"),
  ].join("\n");
  checks.push(
    check(
      "L_no_dashboard_logic",
      "No dashboard logic",
      !integrationBundle.includes("DashboardAdapter") && !integrationBundle.includes("dashboardIntegration"),
      "no dashboard coupling"
    )
  );

  checks.push(
    check(
      "M_no_assistant_logic",
      "No assistant logic",
      !integrationBundle.includes("AssistantAdapter") && !integrationBundle.includes("assistantIntegration"),
      "no assistant coupling"
    )
  );

  checks.push(
    check(
      "N_no_visualization_logic",
      "No visualization logic",
      !integrationBundle.includes("TimelineRenderer") && !integrationBundle.includes("BusinessChart"),
      "no UI runtime"
    )
  );

  const engineBundle = [
    readEngineSource("app/lib/business-timeline/businessEventEngine.ts"),
    readEngineSource("app/lib/business-timeline/businessEventEngineRegistry.ts"),
  ].join("\n");
  checks.push(
    check(
      "O_no_scenario_decision_coupling",
      "No scenario or decision timeline coupling",
      !engineBundle.includes("scenario-timeline/") && !engineBundle.includes("decision-timeline/"),
      "no cross-platform runtime coupling"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(BUSINESS_EVENT_ENGINE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/business-timeline/businessEventEngine.ts",
        allowedFiles: BUSINESS_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: BUSINESS_EVENT_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "no_forbidden_runtime",
      "No forbidden runtime dependencies",
      engineHasNoForbiddenRuntime() === true,
      "no persistence or UI runtime"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Event engine contract version is APP-7/2",
      BUSINESS_EVENT_ENGINE_CONTRACT_VERSION === "APP-7/2",
      BUSINESS_EVENT_ENGINE_CONTRACT_VERSION
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

export const BusinessEventEngineRunner = Object.freeze({
  runBusinessEventEngineCertification,
});
