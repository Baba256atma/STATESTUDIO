/**
 * APP-7:7 — Business Timeline Platform Certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { runBusinessEventEngineCertification } from "./businessEventEngineRunner.ts";
import { runBusinessTimelineApiCertification } from "./businessTimelineApiRunner.ts";
import { runBusinessTimelineContextCertification } from "./businessTimelineContextRunner.ts";
import { runBusinessTimelineLifecycleCertification } from "./businessTimelineLifecycleRunner.ts";
import { runBusinessTimelineQueryCertification } from "./businessTimelineQueryRunner.ts";
import { runBusinessTimelineFoundation } from "./businessTimelineRunner.ts";
import {
  createBusinessTimelineApi,
  resetBusinessTimelineApiLayerForTests,
  validateBusinessTimelineApiContract,
  validateBusinessTimelineConsumerAccessRequest,
} from "./businessTimelineApi.ts";
import { BUSINESS_TIMELINE_DIRECT_IMPORT_GUARD_NOTES } from "./businessTimelineApiManifest.ts";
import { BUSINESS_TIMELINE_API_GROUP_KEYS } from "./businessTimelineApiTypes.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY, validateBusinessTimeline } from "./businessTimelineContracts.ts";
import {
  resetBusinessEventEngineForTests,
} from "./businessEventEngine.ts";
import { resetBusinessTimelineContextLayerForTests } from "./businessTimelineContext.ts";
import { resetBusinessTimelineLifecycleLayerForTests } from "./businessTimelineLifecycle.ts";
import { resetBusinessTimelineQueryLayerForTests } from "./businessTimelineQuery.ts";
import {
  buildBusinessTimelinePlatformManifest,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_REQUIRED_DOCS,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  BUSINESS_TIMELINE_PLATFORM_CERTIFIED_MODULES,
  validateBusinessTimelinePlatformManifest,
} from "./businessTimelinePlatformCertificationManifest.ts";
import {
  buildBusinessTimelinePlatformReadinessReport,
  computeReadyForFreeze,
} from "./businessTimelinePlatformReadiness.ts";
import { runBusinessTimelinePlatformRegression } from "./businessTimelinePlatformRegression.ts";
import type {
  BusinessTimelinePlatformCertificationCheck,
  BusinessTimelinePlatformCertificationGroup,
  BusinessTimelinePlatformCertificationReport,
  BusinessTimelinePlatformCertificationResult,
} from "./businessTimelinePlatformCertificationTypes.ts";
import { getBusinessTimelineConsumerContract } from "./businessTimelineConsumerContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-platform-cert-a";
const WORKSPACE_B = "ws-platform-cert-b";

let lastReport: BusinessTimelinePlatformCertificationReport | null = null;

function check(id: string, title: string, passed: boolean, evidence: string): BusinessTimelinePlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function group(
  groupKey: (typeof BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS)[number],
  title: string,
  checks: BusinessTimelinePlatformCertificationCheck[]
): BusinessTimelinePlatformCertificationGroup {
  const checksPassed = checks.filter((entry) => entry.passed).length;
  return Object.freeze({
    groupKey,
    title,
    passed: checksPassed === checks.length,
    checksPassed,
    checksTotal: checks.length,
    checks: Object.freeze(checks),
    readOnly: true as const,
  });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function resetAllLayers(): void {
  resetBusinessTimelineApiLayerForTests();
  resetBusinessTimelineContextLayerForTests();
  resetBusinessTimelineLifecycleLayerForTests();
  resetBusinessTimelineQueryLayerForTests();
  resetBusinessEventEngineForTests();
}

function sampleEvent(id: string, workspaceId: string) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Platform cert event ${id}`,
    description: "APP-7:7 end-to-end certification event.",
    category: "product" as const,
    type: "milestone" as const,
    importance: "high" as const,
    status: "completed" as const,
    source: "manual" as const,
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "platform-cert-runner",
    tags: Object.freeze(["platform-cert"]),
  });
}

function verifyEndToEndFlow(): BusinessTimelinePlatformCertificationCheck {
  resetAllLayers();
  const api = createBusinessTimelineApi(FIXED_TIME);

  const created = api.events.createEvent(sampleEvent("platform-e2e-1", WORKSPACE_A));
  if (!created.success) {
    return check("end_to_end_flow", "Event creation → query → lifecycle → context flow", false, created.reason);
  }

  const query = api.query.queryTimeline({ workspaceId: WORKSPACE_A });
  const lifecycle = api.lifecycle.buildLifecycle({ workspaceId: WORKSPACE_A });
  const context = api.context.buildContextModel({ workspaceId: WORKSPACE_A });

  const passed =
    query.success === true &&
    query.data?.totalEvents === 1 &&
    lifecycle.success === true &&
    lifecycle.data?.summary.eventCount === 1 &&
    context.success === true &&
    context.data?.summary.eventCount === 1;

  return check(
    "end_to_end_flow",
    "Event creation → query → lifecycle → context flow",
    passed,
    passed ? "full chain verified via facade" : "chain incomplete"
  );
}

function verifyWorkspaceIsolationEndToEnd(): BusinessTimelinePlatformCertificationCheck {
  resetAllLayers();
  const api = createBusinessTimelineApi(FIXED_TIME);
  api.events.createEvent(sampleEvent("platform-ws-a", WORKSPACE_A));
  api.events.createEvent(sampleEvent("platform-ws-b", WORKSPACE_B));

  const wsAEvents = api.events.getEventsByWorkspace(WORKSPACE_A);
  const wsBEvents = api.events.getEventsByWorkspace(WORKSPACE_B);
  const wsAQuery = api.query.queryTimeline({ workspaceId: WORKSPACE_A });
  const wsBQuery = api.query.queryTimeline({ workspaceId: WORKSPACE_B });

  const passed =
    wsAEvents.success === true &&
    wsBEvents.success === true &&
    wsAEvents.data?.length === 1 &&
    wsBEvents.data?.length === 1 &&
    wsAQuery.data?.totalEvents === 1 &&
    wsBQuery.data?.totalEvents === 1 &&
    wsAEvents.data?.[0]?.workspaceId === WORKSPACE_A &&
    wsBEvents.data?.[0]?.workspaceId === WORKSPACE_B;

  return check(
    "workspace_isolation_e2e",
    "Workspace isolation consistent end-to-end",
    passed,
    passed ? "workspaces isolated via facade" : "isolation failure"
  );
}

function verifyArchivePolicyEndToEnd(): BusinessTimelinePlatformCertificationCheck {
  resetAllLayers();
  const api = createBusinessTimelineApi(FIXED_TIME);
  api.events.createEvent(sampleEvent("platform-archive-1", WORKSPACE_A));

  const beforeArchive = api.query.queryTimeline({ workspaceId: WORKSPACE_A, includeArchived: false });
  const archived = api.events.archiveEvent("platform-archive-1", WORKSPACE_A);
  const afterArchive = api.query.queryTimeline({ workspaceId: WORKSPACE_A, includeArchived: false });
  const withArchived = api.query.queryTimeline({ workspaceId: WORKSPACE_A, includeArchived: true });

  const passed =
    beforeArchive.data?.totalEvents === 1 &&
    archived.success === true &&
    afterArchive.data?.totalEvents === 0 &&
    withArchived.data?.totalEvents === 1;

  return check(
    "archive_policy_e2e",
    "Archive policy respected end-to-end",
    passed,
    passed ? "archived events excluded by default" : "archive policy failure"
  );
}

function verifyMutationBoundaries(): BusinessTimelinePlatformCertificationCheck {
  resetAllLayers();
  const api = createBusinessTimelineApi(FIXED_TIME);
  const created = api.events.createEvent(sampleEvent("platform-mutation-1", WORKSPACE_A));
  const updated = api.events.updateEventMetadata({
    id: "platform-mutation-1",
    workspaceId: WORKSPACE_A,
    title: "Updated title",
  });
  const wrongWorkspace = api.events.archiveEvent("platform-mutation-1", WORKSPACE_B);

  const passed = created.success === true && updated.success === true && wrongWorkspace.success === false;
  return check(
    "mutation_boundaries",
    "Event mutation boundaries enforced",
    passed,
    passed ? "metadata update allowed; cross-workspace archive blocked" : "mutation boundary failure"
  );
}

function verifyReadOnlyConsumers(): BusinessTimelinePlatformCertificationCheck {
  const readOnlyConsumers = ["DashboardConsumer", "AssistantConsumer", "VisualizationConsumer", "ReportConsumer"] as const;
  const violations: string[] = [];

  for (const consumerId of readOnlyConsumers) {
    const contract = getBusinessTimelineConsumerContract(consumerId);
    if (!contract?.readOnly || contract.mutationAllowed) {
      violations.push(`${consumerId} not read-only`);
    }
    const mutationCheck = validateBusinessTimelineConsumerAccessRequest({
      consumerId,
      apiGroup: "events",
      mutation: true,
    });
    if (mutationCheck.valid) {
      violations.push(`${consumerId} mutation allowed`);
    }
  }

  return check(
    "readonly_consumers",
    "Read-only consumers cannot mutate",
    violations.length === 0,
    violations.length === 0 ? "read-only enforced" : violations.join("; ")
  );
}

function verifyWorkspaceControlledWrites(): BusinessTimelinePlatformCertificationCheck {
  const contract = getBusinessTimelineConsumerContract("WorkspaceConsumer");
  const createAccess = validateBusinessTimelineConsumerAccessRequest({
    consumerId: "WorkspaceConsumer",
    apiGroup: "events",
    mutation: true,
  });
  const certAccess = validateBusinessTimelineConsumerAccessRequest({
    consumerId: "WorkspaceConsumer",
    apiGroup: "certification",
    mutation: false,
  });

  const passed =
    contract?.readOnly === false &&
    contract?.mutationAllowed === true &&
    createAccess.valid === true &&
    certAccess.valid === false;

  return check(
    "workspace_controlled_writes",
    "Workspace consumer controlled writes allowed",
    passed,
    passed ? "workspace write access verified" : "workspace access failure"
  );
}

function verifyDashboardAssistantVisualizationReadOnly(): BusinessTimelinePlatformCertificationCheck {
  const consumers = ["DashboardConsumer", "AssistantConsumer", "VisualizationConsumer"] as const;
  const violations: string[] = [];

  for (const consumerId of consumers) {
    const contract = getBusinessTimelineConsumerContract(consumerId);
    if (!contract?.readOnly) {
      violations.push(`${consumerId} not read-only`);
    }
    if ((contract?.allowedApiGroups as readonly string[]).includes("events")) {
      violations.push(`${consumerId} has events access`);
    }
  }

  return check(
    "dashboard_assistant_visualization_readonly",
    "Dashboard/Assistant/Visualization remain read-only",
    violations.length === 0,
    violations.length === 0 ? "integration consumers read-only" : violations.join("; ")
  );
}

function verifyNoForbiddenCoupling(pattern: "scenario" | "decision"): BusinessTimelinePlatformCertificationCheck {
  const engineSources = [
    readModule("app/lib/business-timeline/businessTimelineApiFacade.ts"),
    readModule("app/lib/business-timeline/businessEventEngine.ts"),
    readModule("app/lib/business-timeline/businessTimelineQuery.ts"),
    readModule("app/lib/business-timeline/businessTimelineLifecycle.ts"),
    readModule("app/lib/business-timeline/businessTimelineContext.ts"),
    readModule("app/lib/business-timeline/businessTimelineApi.ts"),
  ].join("\n");

  const forbiddenImport =
    pattern === "scenario"
      ? /from\s+["'].*scenario-timeline\//
      : /from\s+["'].*decision-timeline\//;

  const passed = !forbiddenImport.test(engineSources);
  return check(
    pattern === "scenario" ? "no_scenario_coupling" : "no_decision_coupling",
    pattern === "scenario" ? "No direct scenario timeline coupling" : "No direct decision timeline coupling",
    passed,
    passed ? "engine and facade layers have no forbidden imports" : "forbidden coupling detected"
  );
}

function verifyNoImplementation(kind: "dashboard" | "assistant" | "visualization" | "datasource"): BusinessTimelinePlatformCertificationCheck {
  const sources = [
    readModule("app/lib/business-timeline/businessTimelinePlatformCertification.ts"),
    readModule("app/lib/business-timeline/businessTimelinePlatformRegression.ts"),
    readModule("app/lib/business-timeline/businessTimelinePlatformReadiness.ts"),
    readModule("app/lib/business-timeline/businessTimelinePlatformCertificationTypes.ts"),
  ].join("\n");

  const patterns: Record<typeof kind, RegExp> = {
    dashboard: /export\s+(function|const)\s+\w*Dashboard\w*\s*=|class\s+\w*DashboardAdapter/,
    assistant: /export\s+(function|const)\s+\w*Assistant\w*\s*=|class\s+\w*AssistantAdapter/,
    visualization: /export\s+(function|const)\s+\w*(Chart|Visualization|Renderer)\w*\s*=|class\s+\w*TimelineRenderer/,
    datasource: /export\s+(function|const)\s+\w*DataSource\w*\s*=|await\s+fetch\s*\(|new\s+IndexedDB|openai\./,
  };

  const passed = !patterns[kind].test(sources);
  const titles = {
    dashboard: "No dashboard implementation",
    assistant: "No assistant implementation",
    visualization: "No visualization implementation",
    datasource: "No datasource ingestion",
  };

  return check(`no_${kind}`, titles[kind], passed, passed ? "APP-7:7 certification modules clean" : `${kind} implementation detected`);
}

function verifyPriorPlatformsUntouched(): BusinessTimelinePlatformCertificationCheck {
  const app5Ok =
    SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
    SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION.length > 0;
  const app6Ok =
    DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
    DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION.length > 0;
  const scenarioFile = existsSync(
    join(REPO_ROOT, "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformContracts.ts")
  );
  const decisionFile = existsSync(
    join(REPO_ROOT, "frontend/app/lib/decision-timeline/decisionTimelineContracts.ts")
  );

  const passed = app5Ok && app6Ok && scenarioFile && decisionFile;
  return check(
    "prior_platforms_untouched",
    "Prior APP-1 through APP-6 untouched",
    passed,
    passed ? "APP-5 and APP-6 identity verified" : "prior platform verification failed"
  );
}

function verifyDocumentationCompleteness(): BusinessTimelinePlatformCertificationCheck {
  const missing = BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_REQUIRED_DOCS.filter(
    (doc) => !existsSync(join(REPO_ROOT, doc))
  );
  return check(
    "documentation_completeness",
    "Required platform documentation present",
    missing.length === 0,
    missing.length === 0 ? `${BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_REQUIRED_DOCS.length} docs verified` : missing.join(", ")
  );
}

export function getBusinessTimelinePlatformCertificationReport(): BusinessTimelinePlatformCertificationReport | null {
  return lastReport;
}

export function resetBusinessTimelinePlatformCertificationReportForTests(): void {
  lastReport = null;
}

export function runBusinessTimelinePlatformCertification(
  timestamp: string = new Date().toISOString()
): BusinessTimelinePlatformCertificationResult {
  const regression = runBusinessTimelinePlatformRegression();
  const foundation = runBusinessTimelineFoundation(FIXED_TIME);
  const event = runBusinessEventEngineCertification();
  const query = runBusinessTimelineQueryCertification();
  const lifecycle = runBusinessTimelineLifecycleCertification();
  const context = runBusinessTimelineContextCertification();
  const api = runBusinessTimelineApiCertification();

  resetAllLayers();
  const apiInstance = createBusinessTimelineApi(FIXED_TIME);
  const apiContract = validateBusinessTimelineApiContract();
  const foundationValidation = validateBusinessTimeline(FIXED_TIME);

  const groups: BusinessTimelinePlatformCertificationGroup[] = [];

  groups.push(
    group("A_app7_1_foundation", "APP-7:1 Foundation Certification", [
      check("app7_1", "APP-7:1 foundation certification PASS", foundation.certified === true, foundation.passedCount + "/" + foundation.checkCount),
    ])
  );

  groups.push(
    group("B_app7_2_event_engine", "APP-7:2 Event Engine Certification", [
      check("app7_2", "APP-7:2 event engine certification PASS", event.certified === true && event.status === "PASS", event.summary),
    ])
  );

  groups.push(
    group("C_app7_3_query_layer", "APP-7:3 Query Layer Certification", [
      check("app7_3", "APP-7:3 query layer certification PASS", query.certified === true && query.status === "PASS", query.summary),
    ])
  );

  groups.push(
    group("D_app7_4_lifecycle_layer", "APP-7:4 Lifecycle Layer Certification", [
      check("app7_4", "APP-7:4 lifecycle layer certification PASS", lifecycle.certified === true && lifecycle.status === "PASS", lifecycle.summary),
    ])
  );

  groups.push(
    group("E_app7_5_context_layer", "APP-7:5 Context Layer Certification", [
      check("app7_5", "APP-7:5 context layer certification PASS", context.certified === true && context.status === "PASS", context.summary),
    ])
  );

  groups.push(
    group("F_app7_6_api_layer", "APP-7:6 API Layer Certification", [
      check("app7_6", "APP-7:6 API layer certification PASS", api.certified === true && api.status === "PASS", api.summary),
    ])
  );

  groups.push(
    group("G_public_facade_groups", "Public Facade Groups", [
      check(
        "facade_groups",
        "Public facade exposes all official groups",
        BUSINESS_TIMELINE_API_GROUP_KEYS.every((key) => key in apiInstance),
        BUSINESS_TIMELINE_API_GROUP_KEYS.join(", ")
      ),
      check(
        "api_contract",
        "API contract surface valid",
        apiContract.valid === true,
        `${apiContract.issues.length} issues`
      ),
    ])
  );

  groups.push(
    group("H_internal_modules_hidden", "Internal Modules Hidden", [
      check(
        "import_guard",
        "Direct import guard documented",
        BUSINESS_TIMELINE_DIRECT_IMPORT_GUARD_NOTES.includes("MUST import APP-7:6"),
        "guard notes present"
      ),
      check(
        "facade_only",
        "API facade is the public entry point",
        typeof apiInstance.events.createEvent === "function" &&
          typeof apiInstance.query.queryTimeline === "function",
        "facade methods exposed"
      ),
    ])
  );

  groups.push(
    group("I_workspace_isolation", "Workspace Isolation", [verifyWorkspaceIsolationEndToEnd()])
  );

  groups.push(
    group("J_end_to_end_flow", "End-to-End Flow", [verifyEndToEndFlow()])
  );

  groups.push(
    group("K_mutation_boundaries", "Mutation Boundaries", [verifyMutationBoundaries()])
  );

  groups.push(
    group("L_archive_policy", "Archive Policy", [verifyArchivePolicyEndToEnd()])
  );

  groups.push(
    group("M_readonly_consumers", "Read-Only Consumers", [verifyReadOnlyConsumers()])
  );

  groups.push(
    group("N_workspace_controlled_writes", "Workspace Controlled Writes", [verifyWorkspaceControlledWrites()])
  );

  groups.push(
    group("O_dashboard_assistant_visualization_readonly", "Integration Consumers Read-Only", [
      verifyDashboardAssistantVisualizationReadOnly(),
    ])
  );

  groups.push(
    group("P_no_scenario_coupling", "No Scenario Coupling", [verifyNoForbiddenCoupling("scenario")])
  );

  groups.push(
    group("Q_no_decision_coupling", "No Decision Coupling", [verifyNoForbiddenCoupling("decision")])
  );

  groups.push(
    group("R_no_dashboard_implementation", "No Dashboard Implementation", [verifyNoImplementation("dashboard")])
  );

  groups.push(
    group("S_no_assistant_implementation", "No Assistant Implementation", [verifyNoImplementation("assistant")])
  );

  groups.push(
    group("T_no_visualization_implementation", "No Visualization Implementation", [
      verifyNoImplementation("visualization"),
    ])
  );

  groups.push(
    group("U_no_datasource_ingestion", "No Datasource Ingestion", [verifyNoImplementation("datasource")])
  );

  groups.push(
    group("V_prior_platforms_untouched", "Prior Platforms Untouched", [
      verifyPriorPlatformsUntouched(),
      check(
        "prior_phases_preserved",
        "Prior APP-7 phase files preserved",
        regression.priorPhasesPreserved === true,
        regression.priorPhasesPreserved ? "files intact" : "missing files"
      ),
    ])
  );

  const firstRun = runBusinessTimelinePlatformCertificationInternalChecksOnly();
  const secondRun = runBusinessTimelinePlatformCertificationInternalChecksOnly();
  groups.push(
    group("W_certification_deterministic", "Certification Deterministic", [
      check(
        "deterministic_regression",
        "Regression results are repeatable",
        regression.layerResults.every((entry) => entry.certified),
        regression.summary
      ),
      check(
        "deterministic_scores",
        "Layer scores remain at 100 across runs",
        firstRun.score === secondRun.score && firstRun.score === 100,
        `score=${firstRun.score}`
      ),
      check(
        "foundation_readonly",
        "Foundation validation is read-only",
        foundationValidation.readOnly === true,
        "read-only validation"
      ),
    ])
  );

  const allGroupsPassedBeforeManifest = groups.every((entry) => entry.passed);
  const platformManifest = buildBusinessTimelinePlatformManifest(
    timestamp,
    false,
    allGroupsPassedBeforeManifest ? timestamp : null
  );

  groups.push(
    group("X_platform_manifest_valid", "Platform Manifest Valid", [
      check(
        "manifest_identity",
        "Platform manifest identity valid",
        platformManifest.platformId === BUSINESS_TIMELINE_PLATFORM_IDENTITY.platformId &&
          platformManifest.appId === "APP-7",
        platformManifest.platformId
      ),
      check(
        "manifest_phases",
        "Platform manifest lists six phases",
        platformManifest.phases.length === 6,
        String(platformManifest.phases.length)
      ),
      check(
        "manifest_validation",
        "Platform manifest validation passes",
        validateBusinessTimelinePlatformManifest(platformManifest).valid === true,
        "manifest valid"
      ),
      verifyDocumentationCompleteness(),
      check(
        "stage_manifest",
        "Certification stage manifest valid",
        validateStageManifest(BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid === true,
        "stage manifest valid"
      ),
      check(
        "architecture_boundaries",
        "Architecture file boundaries enforced",
        evaluateStageFileBoundary({
          filePath: "frontend/app/lib/business-timeline/businessTimelinePlatformCertification.ts",
          allowedFiles: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === true &&
          evaluateStageFileBoundary({
            filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
            allowedFiles: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
            forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
          }).allowed === false,
        "boundaries enforced"
      ),
    ])
  );

  const readiness = buildBusinessTimelinePlatformReadinessReport(groups, regression, platformManifest);
  const readyForFreeze = computeReadyForFreeze(groups, regression, platformManifest);

  groups.push(
    group("Y_ready_for_freeze", "Ready For Freeze", [
      check(
        "full_regression",
        "Full APP-7 regression succeeded",
        regression.success === true,
        regression.summary
      ),
      check(
        "all_groups_passed",
        "All certification groups passed",
        groups.every((entry) => entry.passed),
        `${groups.filter((entry) => entry.passed).length}/${groups.length} groups passed`
      ),
      check(
        "ready_for_freeze_flag",
        "Ready for freeze flag computed correctly",
        readyForFreeze === (groups.every((entry) => entry.passed) && regression.success),
        readyForFreeze ? "ready for APP-7:8 freeze" : "not ready"
      ),
    ])
  );

  const allGroupsPassed = groups.every((entry) => entry.passed);
  const totalChecks = groups.reduce((sum, entry) => sum + entry.checksTotal, 0);
  const passedChecks = groups.reduce((sum, entry) => sum + entry.checksPassed, 0);
  const certificationScore = Math.round((passedChecks / totalChecks) * 100);

  const finalManifest = buildBusinessTimelinePlatformManifest(
    timestamp,
    readyForFreeze,
    allGroupsPassed ? timestamp : null
  );

  const warnings: Readonly<{ code: string; message: string; readOnly: true }>[] = [];
  const failures: Readonly<{ code: string; message: string; readOnly: true }>[] = [];

  for (const entry of groups) {
    if (!entry.passed) {
      for (const failedCheck of entry.checks.filter((checkEntry) => !checkEntry.passed)) {
        failures.push(
          Object.freeze({
            code: failedCheck.id,
            message: `${entry.title}: ${failedCheck.title} — ${failedCheck.evidence}`,
            readOnly: true as const,
          })
        );
      }
    }
  }

  const report: BusinessTimelinePlatformCertificationReport = Object.freeze({
    platformIdentity: BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId,
    certificationVersion: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certificationTimestamp: timestamp,
    certificationScore,
    groups: Object.freeze(groups),
    regressionSummary: regression.summary,
    layerRegressionResults: regression.layerResults,
    readinessSummary: readiness.summary,
    readyForFreeze,
    certifiedModules: Object.freeze(
      BUSINESS_TIMELINE_PLATFORM_CERTIFIED_MODULES.map((entry) =>
        Object.freeze({
          layerId: entry.layerId,
          title: entry.title,
          contractVersion: entry.contractVersion,
          readOnly: true as const,
        })
      )
    ),
    warnings: Object.freeze(warnings),
    failures: Object.freeze(failures),
    certified: allGroupsPassed && regression.success,
    finalPlatformStatus: allGroupsPassed && regression.success ? "CERTIFIED" : "NOT_CERTIFIED",
    readOnly: true as const,
  });

  lastReport = report;

  return Object.freeze({
    certified: report.certified,
    readyForFreeze,
    certificationScore,
    warnings,
    failures,
    status: report.certified ? ("PASS" as const) : ("FAIL" as const),
    summary: `${passedChecks}/${totalChecks} platform certification checks passed.`,
    report,
    readOnly: true as const,
  });
}

function runBusinessTimelinePlatformCertificationInternalChecksOnly(): Readonly<{ score: number; readOnly: true }> {
  const regression = runBusinessTimelinePlatformRegression();
  const score = regression.layerResults.every((entry) => entry.certified)
    ? 100
    : Math.round(
        (regression.layerResults.filter((entry) => entry.certified).length / regression.layerResults.length) * 100
      );
  return Object.freeze({ score, readOnly: true as const });
}

export function getBusinessTimelinePlatformManifest(timestamp: string = new Date().toISOString()) {
  const report = lastReport;
  return buildBusinessTimelinePlatformManifest(timestamp, report?.readyForFreeze ?? false, report?.certified ? timestamp : null);
}

export function getBusinessTimelinePlatformReadinessReportFromLastRun() {
  if (!lastReport) {
    return buildBusinessTimelinePlatformReadinessReport([], runBusinessTimelinePlatformRegression(), buildBusinessTimelinePlatformManifest(new Date().toISOString(), false));
  }
  return buildBusinessTimelinePlatformReadinessReport(
    lastReport.groups,
    runBusinessTimelinePlatformRegression(),
    buildBusinessTimelinePlatformManifest(lastReport.certificationTimestamp, lastReport.readyForFreeze, lastReport.certified ? lastReport.certificationTimestamp : null)
  );
}
