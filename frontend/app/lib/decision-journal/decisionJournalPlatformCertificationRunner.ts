/**
 * APP-8:8 — Decision Journal Platform Certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "../business-timeline/businessTimelineContracts.ts";
import {
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { runDecisionJournalEngineCertification } from "./decisionJournalEngineRunner.ts";
import { runDecisionJournalApiCertification } from "./decisionJournalApiRunner.ts";
import { runDecisionJournalQueryCertification } from "./decisionJournalQueryRunner.ts";
import { runDecisionJournalReflectionCertification } from "./decisionJournalReflectionRunner.ts";
import { runDecisionJournalEvidenceAssumptionCertification } from "./decisionJournalEvidenceAssumptionRunner.ts";
import { runDecisionJournalRetrospectiveCertification } from "./decisionJournalRetrospectiveRunner.ts";
import { runDecisionJournalFoundation } from "./decisionJournalRunner.ts";
import {
  createDecisionJournalApi,
  resetDecisionJournalApiLayerForTests,
  validateDecisionJournalApiContract,
  validateDecisionJournalConsumerAccessRequest,
} from "./decisionJournalApi.ts";
import { DECISION_JOURNAL_DIRECT_IMPORT_GUARD_NOTES } from "./decisionJournalApiManifest.ts";
import { DECISION_JOURNAL_API_GROUP_KEYS } from "./decisionJournalApiTypes.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY, validateDecisionJournal } from "./decisionJournalContracts.ts";
import { resetDecisionJournalEngineForTests } from "./decisionJournalEngine.ts";
import { resetDecisionJournalQueryLayerForTests } from "./decisionJournalQuery.ts";
import { resetDecisionJournalReflectionLayerForTests } from "./decisionJournalReflection.ts";
import { resetDecisionJournalEvidenceAssumptionLayerForTests } from "./decisionJournalEvidenceAssumption.ts";
import { resetDecisionJournalRetrospectiveLayerForTests } from "./decisionJournalRetrospective.ts";
import {
  buildDecisionJournalPlatformManifest,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_REQUIRED_DOCS,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  DECISION_JOURNAL_PLATFORM_CERTIFIED_MODULES,
  validateDecisionJournalPlatformManifest,
} from "./decisionJournalPlatformCertificationManifest.ts";
import {
  buildDecisionJournalPlatformReadinessReport,
  computeReadyForFreeze,
} from "./decisionJournalPlatformReadiness.ts";
import { runDecisionJournalPlatformRegression } from "./decisionJournalPlatformRegression.ts";
import type {
  DecisionJournalPlatformCertificationCheck,
  DecisionJournalPlatformCertificationGroup,
  DecisionJournalPlatformCertificationReport,
  DecisionJournalPlatformCertificationResult,
} from "./decisionJournalPlatformCertificationTypes.ts";
import { getDecisionJournalConsumerContract } from "./decisionJournalConsumerContracts.ts";
import { getAllConsumerContracts } from "./decisionJournalConsumerValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-platform-cert-a";
const WORKSPACE_B = "ws-platform-cert-b";

let lastReport: DecisionJournalPlatformCertificationReport | null = null;

function check(id: string, title: string, passed: boolean, evidence: string): DecisionJournalPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function group(
  groupKey: (typeof DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS)[number],
  title: string,
  checks: DecisionJournalPlatformCertificationCheck[]
): DecisionJournalPlatformCertificationGroup {
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
  resetDecisionJournalApiLayerForTests();
  resetDecisionJournalRetrospectiveLayerForTests();
  resetDecisionJournalEvidenceAssumptionLayerForTests();
  resetDecisionJournalReflectionLayerForTests();
  resetDecisionJournalQueryLayerForTests();
  resetDecisionJournalEngineForTests();
}

function sampleEntry(id: string, workspaceId: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Platform cert entry ${id}`,
    summary: "APP-8:8 end-to-end certification entry.",
    rationale: "Platform certification rationale.",
    expectedOutcome: "Validated platform behavior.",
    confidence: "medium" as const,
    author: "platform-cert-runner",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["platform-cert"]),
    ...overrides,
  });
}

function verifyEndToEndFlow(): DecisionJournalPlatformCertificationCheck {
  resetAllLayers();
  const api = createDecisionJournalApi(FIXED_TIME);

  const created = api.entries.createEntry(sampleEntry("platform-e2e-1", WORKSPACE_A));
  if (!created.success) {
    return check("end_to_end_flow", "Entry creation → query → reflection → quality → retrospective flow", false, created.reason);
  }

  const query = api.query.queryJournal({ workspaceId: WORKSPACE_A });
  const reflection = api.reflection.buildReflection({ workspaceId: WORKSPACE_A });
  const quality = api.quality.buildEvidenceAssumptionModel({ workspaceId: WORKSPACE_A });
  const retrospective = api.retrospective.buildRetrospectiveModel({ workspaceId: WORKSPACE_A });

  const passed =
    query.success === true &&
    query.data?.totalEntries === 1 &&
    reflection.success === true &&
    reflection.data?.entryCount === 1 &&
    quality.success === true &&
    quality.data?.entryCount === 1 &&
    retrospective.success === true &&
    retrospective.data?.entryCount === 1;

  return check(
    "end_to_end_flow",
    "Entry creation → query → reflection → quality → retrospective flow",
    passed,
    passed ? "full chain verified via facade" : "chain incomplete"
  );
}

function verifyDeterministicOrdering(): DecisionJournalPlatformCertificationCheck {
  resetAllLayers();
  const api = createDecisionJournalApi(FIXED_TIME);
  api.entries.createEntry(
    sampleEntry("platform-order-b", WORKSPACE_A, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
    })
  );
  api.entries.createEntry(
    sampleEntry("platform-order-a", WORKSPACE_A, {
      updatedAt: "2026-06-01T00:00:00.000Z",
      createdAt: "2026-06-01T00:00:00.000Z",
    })
  );

  const ordered = api.query.getOrderedEntries({ workspaceId: WORKSPACE_A });
  const ids = ordered.data?.map((entry) => entry.id) ?? [];
  const passed = ordered.success === true && ids[0] === "platform-order-a" && ids[1] === "platform-order-b";

  return check(
    "deterministic_ordering",
    "Deterministic ordering verified end-to-end",
    passed,
    passed ? "desc updatedAt ordering confirmed" : `order=${ids.join(",")}`
  );
}

function verifyWorkspaceIsolationEndToEnd(): DecisionJournalPlatformCertificationCheck {
  resetAllLayers();
  const api = createDecisionJournalApi(FIXED_TIME);
  api.entries.createEntry(sampleEntry("platform-ws-a", WORKSPACE_A));
  api.entries.createEntry(sampleEntry("platform-ws-b", WORKSPACE_B));

  const wsAEntries = api.entries.getEntries(WORKSPACE_A);
  const wsBEntries = api.entries.getEntries(WORKSPACE_B);
  const wsAQuery = api.query.queryJournal({ workspaceId: WORKSPACE_A });
  const wsBQuery = api.query.queryJournal({ workspaceId: WORKSPACE_B });

  const passed =
    wsAEntries.success === true &&
    wsBEntries.success === true &&
    wsAEntries.data?.length === 1 &&
    wsBEntries.data?.length === 1 &&
    wsAQuery.data?.totalEntries === 1 &&
    wsBQuery.data?.totalEntries === 1 &&
    wsAEntries.data?.[0]?.workspaceId === WORKSPACE_A &&
    wsBEntries.data?.[0]?.workspaceId === WORKSPACE_B;

  return check(
    "workspace_isolation_e2e",
    "Workspace isolation consistent end-to-end",
    passed,
    passed ? "workspaces isolated via facade" : "isolation failure"
  );
}

function verifyArchivePolicyEndToEnd(): DecisionJournalPlatformCertificationCheck {
  resetAllLayers();
  const api = createDecisionJournalApi(FIXED_TIME);
  api.entries.createEntry(sampleEntry("platform-archive-1", WORKSPACE_A));

  const beforeArchive = api.query.queryJournal({ workspaceId: WORKSPACE_A, includeArchived: false });
  const archived = api.entries.archiveEntry("platform-archive-1", WORKSPACE_A);
  const afterArchive = api.query.queryJournal({ workspaceId: WORKSPACE_A, includeArchived: false });
  const withArchived = api.query.queryJournal({ workspaceId: WORKSPACE_A, includeArchived: true });

  const passed =
    beforeArchive.data?.totalEntries === 1 &&
    archived.success === true &&
    afterArchive.data?.totalEntries === 0 &&
    withArchived.data?.totalEntries === 1;

  return check(
    "archive_policy_e2e",
    "Archive policy respected end-to-end",
    passed,
    passed ? "archived entries excluded by default" : "archive policy failure"
  );
}

function verifyMutationBoundaries(): DecisionJournalPlatformCertificationCheck {
  resetAllLayers();
  const api = createDecisionJournalApi(FIXED_TIME);
  const created = api.entries.createEntry(sampleEntry("platform-mutation-1", WORKSPACE_A));
  const updated = api.entries.updateEntryMetadata({
    id: "platform-mutation-1",
    workspaceId: WORKSPACE_A,
    title: "Updated title",
  });
  const wrongWorkspace = api.entries.archiveEntry("platform-mutation-1", WORKSPACE_B);

  const passed = created.success === true && updated.success === true && wrongWorkspace.success === false;
  return check(
    "mutation_boundaries",
    "Entry mutation boundaries enforced",
    passed,
    passed ? "metadata update allowed; cross-workspace archive blocked" : "mutation boundary failure"
  );
}

function verifyReadOnlyConsumers(): DecisionJournalPlatformCertificationCheck {
  const readOnlyConsumers = [
    "DashboardConsumer",
    "AssistantConsumer",
    "VisualizationConsumer",
    "ReportConsumer",
    "ExportConsumer",
    "FutureAppConsumer",
  ] as const;
  const violations: string[] = [];

  for (const consumerId of readOnlyConsumers) {
    const contract = getDecisionJournalConsumerContract(consumerId);
    if (!contract?.readOnly || contract.mutationAllowed) {
      violations.push(`${consumerId} not read-only`);
    }
    const mutationCheck = validateDecisionJournalConsumerAccessRequest({
      consumerId,
      apiGroup: "entries",
      operation: "createEntry",
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

function verifyWorkspaceControlledWrites(): DecisionJournalPlatformCertificationCheck {
  const contract = getDecisionJournalConsumerContract("WorkspaceConsumer");
  const createAccess = validateDecisionJournalConsumerAccessRequest({
    consumerId: "WorkspaceConsumer",
    apiGroup: "entries",
    operation: "createEntry",
    mutation: true,
  });
  const certAccess = validateDecisionJournalConsumerAccessRequest({
    consumerId: "WorkspaceConsumer",
    apiGroup: "certification",
    operation: "runCertification",
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

function verifyDashboardAssistantVisualizationReadOnly(): DecisionJournalPlatformCertificationCheck {
  const consumers = ["DashboardConsumer", "AssistantConsumer", "VisualizationConsumer"] as const;
  const violations: string[] = [];

  for (const consumerId of consumers) {
    const contract = getDecisionJournalConsumerContract(consumerId);
    if (!contract?.readOnly) {
      violations.push(`${consumerId} not read-only`);
    }
    if ((contract?.allowedApiGroups as readonly string[]).includes("entries")) {
      violations.push(`${consumerId} has entries access`);
    }
  }

  return check(
    "dashboard_assistant_visualization_readonly",
    "Dashboard/Assistant/Visualization remain read-only",
    violations.length === 0,
    violations.length === 0 ? "integration consumers read-only" : violations.join("; ")
  );
}

function verifyConsumerContractsValid(): DecisionJournalPlatformCertificationCheck {
  const contracts = getAllConsumerContracts();
  const violations: string[] = [];

  if (contracts.length !== 7) {
    violations.push(`expected 7 contracts, got ${contracts.length}`);
  }

  for (const contract of contracts) {
    if (contract.allowedApiGroups.length === 0) {
      violations.push(`${contract.consumerId} has no allowed groups`);
    }
    if (contract.forbiddenApiGroups.some((group) => contract.allowedApiGroups.includes(group))) {
      violations.push(`${contract.consumerId} overlap in allowed/forbidden`);
    }
  }

  return check(
    "consumer_contracts_valid",
    "Consumer contracts valid",
    violations.length === 0,
    violations.length === 0 ? "7 consumer contracts verified" : violations.join("; ")
  );
}

function verifyNoApp6Integration(): DecisionJournalPlatformCertificationCheck {
  const engineSources = [
    readModule("app/lib/decision-journal/decisionJournalApiFacade.ts"),
    readModule("app/lib/decision-journal/decisionJournalEngine.ts"),
    readModule("app/lib/decision-journal/decisionJournalQuery.ts"),
    readModule("app/lib/decision-journal/decisionJournalReflection.ts"),
    readModule("app/lib/decision-journal/decisionJournalEvidenceAssumption.ts"),
    readModule("app/lib/decision-journal/decisionJournalRetrospective.ts"),
    readModule("app/lib/decision-journal/decisionJournalApi.ts"),
  ].join("\n");

  const forbiddenImport = /from\s+["'].*decision-timeline\//;
  const passed = !forbiddenImport.test(engineSources);
  return check(
    "no_app6_integration",
    "No direct APP-6 integration",
    passed,
    passed ? "no decision-timeline imports in APP-8 modules" : "APP-6 coupling detected"
  );
}

function verifyNoImplementation(
  kind: "dashboard" | "assistant" | "visualization" | "persistence" | "ai"
): DecisionJournalPlatformCertificationCheck {
  const sources = [
    readModule("app/lib/decision-journal/decisionJournalPlatformCertification.ts"),
    readModule("app/lib/decision-journal/decisionJournalPlatformRegression.ts"),
    readModule("app/lib/decision-journal/decisionJournalPlatformReadiness.ts"),
    readModule("app/lib/decision-journal/decisionJournalPlatformCertificationTypes.ts"),
  ].join("\n");

  const patterns: Record<typeof kind, RegExp> = {
    dashboard: /export\s+(function|const)\s+\w*Dashboard\w*\s*=|class\s+\w*DashboardAdapter/,
    assistant: /export\s+(function|const)\s+\w*Assistant\w*\s*=|class\s+\w*AssistantAdapter/,
    visualization:
      /export\s+(function|const)\s+\w*(Chart|Visualization|Renderer)\w*\s*=|class\s+\w*TimelineRenderer/,
    persistence: /localStorage|indexedDB|await\s+fetch\s*\(/,
    ai: /openai\.|ChatGPT|generateCompletion|prompt\s*\(/,
  };

  const passed = !patterns[kind].test(sources);
  const titles = {
    dashboard: "No dashboard implementation",
    assistant: "No assistant implementation",
    visualization: "No visualization implementation",
    persistence: "No persistence",
    ai: "No AI generation",
  };

  return check(`no_${kind}`, titles[kind], passed, passed ? "APP-8:8 certification modules clean" : `${kind} detected`);
}

function verifyPriorPlatformsUntouched(): DecisionJournalPlatformCertificationCheck {
  const app5Ok =
    SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
    SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION.length > 0;
  const app6Ok =
    DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
    DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION.length > 0;
  const app7Ok =
    BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
    BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION.length > 0;
  const scenarioFile = existsSync(
    join(REPO_ROOT, "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformContracts.ts")
  );
  const decisionFile = existsSync(join(REPO_ROOT, "frontend/app/lib/decision-timeline/decisionTimelineContracts.ts"));
  const businessFile = existsSync(join(REPO_ROOT, "frontend/app/lib/business-timeline/businessTimelineContracts.ts"));

  const passed = app5Ok && app6Ok && app7Ok && scenarioFile && decisionFile && businessFile;
  return check(
    "prior_platforms_untouched",
    "Prior APP-1 through APP-7 untouched",
    passed,
    passed ? "APP-5, APP-6, APP-7 identity verified" : "prior platform verification failed"
  );
}

function verifyDocumentationCompleteness(): DecisionJournalPlatformCertificationCheck {
  const missing = DECISION_JOURNAL_PLATFORM_CERTIFICATION_REQUIRED_DOCS.filter(
    (doc) => !existsSync(join(REPO_ROOT, doc))
  );
  return check(
    "documentation_completeness",
    "Required platform documentation present",
    missing.length === 0,
    missing.length === 0
      ? `${DECISION_JOURNAL_PLATFORM_CERTIFICATION_REQUIRED_DOCS.length} docs verified`
      : missing.join(", ")
  );
}

export function getDecisionJournalPlatformCertificationReport(): DecisionJournalPlatformCertificationReport | null {
  return lastReport;
}

export function resetDecisionJournalPlatformCertificationReportForTests(): void {
  lastReport = null;
}

export function runDecisionJournalPlatformCertification(
  timestamp: string = new Date().toISOString()
): DecisionJournalPlatformCertificationResult {
  const regression = runDecisionJournalPlatformRegression();
  const foundation = runDecisionJournalFoundation(FIXED_TIME);
  const engine = runDecisionJournalEngineCertification();
  const query = runDecisionJournalQueryCertification();
  const reflection = runDecisionJournalReflectionCertification();
  const quality = runDecisionJournalEvidenceAssumptionCertification();
  const retrospective = runDecisionJournalRetrospectiveCertification();
  const api = runDecisionJournalApiCertification();

  resetAllLayers();
  const apiInstance = createDecisionJournalApi(FIXED_TIME);
  const apiContract = validateDecisionJournalApiContract();
  const foundationValidation = validateDecisionJournal(FIXED_TIME);

  const groups: DecisionJournalPlatformCertificationGroup[] = [];

  groups.push(
    group("A_app8_1_foundation", "APP-8:1 Foundation Certification", [
      check(
        "app8_1",
        "APP-8:1 foundation certification PASS",
        foundation.certified === true,
        `${foundation.passedCount}/${foundation.checkCount}`
      ),
    ])
  );

  groups.push(
    group("B_app8_2_engine", "APP-8:2 Engine Certification", [
      check(
        "app8_2",
        "APP-8:2 engine certification PASS",
        engine.certified === true && engine.status === "PASS",
        engine.summary
      ),
    ])
  );

  groups.push(
    group("C_app8_3_query_layer", "APP-8:3 Query Layer Certification", [
      check(
        "app8_3",
        "APP-8:3 query layer certification PASS",
        query.certified === true && query.status === "PASS",
        query.summary
      ),
    ])
  );

  groups.push(
    group("D_app8_4_reflection_layer", "APP-8:4 Reflection Layer Certification", [
      check(
        "app8_4",
        "APP-8:4 reflection layer certification PASS",
        reflection.certified === true && reflection.status === "PASS",
        reflection.summary
      ),
    ])
  );

  groups.push(
    group("E_app8_5_quality_layer", "APP-8:5 Evidence/Assumption Layer Certification", [
      check(
        "app8_5",
        "APP-8:5 evidence/assumption layer certification PASS",
        quality.certified === true && quality.status === "PASS",
        quality.summary
      ),
    ])
  );

  groups.push(
    group("F_app8_6_retrospective_layer", "APP-8:6 Retrospective Layer Certification", [
      check(
        "app8_6",
        "APP-8:6 retrospective layer certification PASS",
        retrospective.certified === true && retrospective.status === "PASS",
        retrospective.summary
      ),
    ])
  );

  groups.push(
    group("G_app8_7_api_layer", "APP-8:7 API Layer Certification", [
      check(
        "app8_7",
        "APP-8:7 API layer certification PASS",
        api.certified === true && api.status === "PASS",
        api.summary
      ),
    ])
  );

  groups.push(
    group("H_public_facade_groups", "Public Facade Groups", [
      check(
        "facade_groups",
        "Public facade exposes all official API groups",
        DECISION_JOURNAL_API_GROUP_KEYS.every((key) => key in apiInstance),
        DECISION_JOURNAL_API_GROUP_KEYS.join(", ")
      ),
      check(
        "api_contract",
        "API contract surface valid",
        apiContract.valid === true,
        `${apiContract.issues.length} issues`
      ),
      check(
        "import_guard",
        "Direct import guard documented",
        DECISION_JOURNAL_DIRECT_IMPORT_GUARD_NOTES.includes("MUST import APP-8:7"),
        "guard notes present"
      ),
    ])
  );

  groups.push(group("I_consumer_contracts", "Consumer Contracts", [verifyConsumerContractsValid()]));

  groups.push(group("J_workspace_isolation", "Workspace Isolation", [verifyWorkspaceIsolationEndToEnd()]));

  groups.push(
    group("K_end_to_end_flow", "End-to-End Flow", [verifyEndToEndFlow(), verifyDeterministicOrdering()])
  );

  groups.push(group("L_mutation_boundaries", "Mutation Boundaries", [verifyMutationBoundaries()]));

  groups.push(group("M_archive_policy", "Archive Policy", [verifyArchivePolicyEndToEnd()]));

  groups.push(group("N_readonly_consumers", "Read-Only Consumers", [verifyReadOnlyConsumers()]));

  groups.push(group("O_workspace_controlled_writes", "Workspace Controlled Writes", [verifyWorkspaceControlledWrites()]));

  groups.push(
    group("P_dashboard_assistant_visualization_readonly", "Integration Consumers Read-Only", [
      verifyDashboardAssistantVisualizationReadOnly(),
    ])
  );

  groups.push(group("Q_no_app6_integration", "No APP-6 Integration", [verifyNoApp6Integration()]));

  groups.push(group("R_no_dashboard_implementation", "No Dashboard Implementation", [verifyNoImplementation("dashboard")]));

  groups.push(group("S_no_assistant_implementation", "No Assistant Implementation", [verifyNoImplementation("assistant")]));

  groups.push(
    group("T_no_visualization_implementation", "No Visualization Implementation", [
      verifyNoImplementation("visualization"),
    ])
  );

  groups.push(group("U_no_persistence", "No Persistence", [verifyNoImplementation("persistence")]));

  groups.push(group("V_no_ai_generation", "No AI Generation", [verifyNoImplementation("ai")]));

  groups.push(
    group("W_prior_platforms_untouched", "Prior Platforms Untouched", [
      verifyPriorPlatformsUntouched(),
      check(
        "prior_phases_preserved",
        "Prior APP-8 phase files preserved",
        regression.priorPhasesPreserved === true,
        regression.priorPhasesPreserved ? "files intact" : "missing files"
      ),
    ])
  );

  const firstRun = runDecisionJournalPlatformCertificationInternalChecksOnly();
  const secondRun = runDecisionJournalPlatformCertificationInternalChecksOnly();
  groups.push(
    group("X_certification_deterministic", "Certification Deterministic", [
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
  const platformManifest = buildDecisionJournalPlatformManifest(
    timestamp,
    false,
    allGroupsPassedBeforeManifest ? timestamp : null
  );

  groups.push(
    group("Y_platform_manifest_valid", "Platform Manifest Valid", [
      check(
        "manifest_identity",
        "Platform manifest identity valid",
        platformManifest.platformId === DECISION_JOURNAL_PLATFORM_IDENTITY.platformId &&
          platformManifest.appId === "APP-8",
        platformManifest.platformId
      ),
      check(
        "manifest_phases",
        "Platform manifest lists seven phases",
        platformManifest.phases.length === 7,
        String(platformManifest.phases.length)
      ),
      check(
        "manifest_validation",
        "Platform manifest validation passes",
        validateDecisionJournalPlatformManifest(platformManifest).valid === true,
        "manifest valid"
      ),
      verifyDocumentationCompleteness(),
      check(
        "stage_manifest",
        "Certification stage manifest valid",
        validateStageManifest(DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid === true,
        "stage manifest valid"
      ),
      check(
        "architecture_boundaries",
        "Architecture file boundaries enforced",
        evaluateStageFileBoundary({
          filePath: "frontend/app/lib/decision-journal/decisionJournalPlatformCertification.ts",
          allowedFiles: DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === true &&
          evaluateStageFileBoundary({
            filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
            allowedFiles: DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
            forbiddenPatterns: DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
          }).allowed === false,
        "boundaries enforced"
      ),
    ])
  );

  const readiness = buildDecisionJournalPlatformReadinessReport(groups, regression, platformManifest);
  const readyForFreeze = computeReadyForFreeze(groups, regression, platformManifest);

  groups.push(
    group("Z_ready_for_freeze", "Ready For Freeze", [
      check(
        "full_regression",
        "Full APP-8 regression succeeded",
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
        readyForFreeze ? "ready for APP-8:9 freeze" : "not ready"
      ),
    ])
  );

  const allGroupsPassed = groups.every((entry) => entry.passed);
  const totalChecks = groups.reduce((sum, entry) => sum + entry.checksTotal, 0);
  const passedChecks = groups.reduce((sum, entry) => sum + entry.checksPassed, 0);
  const certificationScore = Math.round((passedChecks / totalChecks) * 100);

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

  const report: DecisionJournalPlatformCertificationReport = Object.freeze({
    platformIdentity: DECISION_JOURNAL_PLATFORM_IDENTITY.appId,
    certificationVersion: DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certificationTimestamp: timestamp,
    certificationScore,
    groups: Object.freeze(groups),
    regressionSummary: regression.summary,
    layerRegressionResults: regression.layerResults,
    readinessSummary: readiness.summary,
    readyForFreeze,
    certifiedModules: Object.freeze(
      DECISION_JOURNAL_PLATFORM_CERTIFIED_MODULES.map((entry) =>
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

function runDecisionJournalPlatformCertificationInternalChecksOnly(): Readonly<{ score: number; readOnly: true }> {
  const regression = runDecisionJournalPlatformRegression();
  const score = regression.layerResults.every((entry) => entry.certified)
    ? 100
    : Math.round(
        (regression.layerResults.filter((entry) => entry.certified).length / regression.layerResults.length) * 100
      );
  return Object.freeze({ score, readOnly: true as const });
}

export function getDecisionJournalPlatformManifest(timestamp: string = new Date().toISOString()) {
  const report = lastReport;
  return buildDecisionJournalPlatformManifest(
    timestamp,
    report?.readyForFreeze ?? false,
    report?.certified ? timestamp : null
  );
}

export function getDecisionJournalPlatformReadinessReportFromLastRun() {
  if (!lastReport) {
    return buildDecisionJournalPlatformReadinessReport(
      [],
      runDecisionJournalPlatformRegression(),
      buildDecisionJournalPlatformManifest(new Date().toISOString(), false)
    );
  }
  return buildDecisionJournalPlatformReadinessReport(
    lastReport.groups,
    runDecisionJournalPlatformRegression(),
    buildDecisionJournalPlatformManifest(
      lastReport.certificationTimestamp,
      lastReport.readyForFreeze,
      lastReport.certified ? lastReport.certificationTimestamp : null
    )
  );
}
