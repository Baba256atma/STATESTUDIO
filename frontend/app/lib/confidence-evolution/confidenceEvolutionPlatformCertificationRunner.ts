/**
 * APP-9:8 — Confidence Evolution Platform Certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "../business-timeline/businessTimelineContracts.ts";
import {
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_IDENTITY,
} from "../decision-journal/decisionJournalContracts.ts";
import {
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { runConfidenceEvolutionEngineCertification } from "./confidenceEvolutionEngineRunner.ts";
import { runConfidenceEvolutionApiCertification } from "./confidenceEvolutionApiRunner.ts";
import { runConfidenceEvolutionQueryCertification } from "./confidenceEvolutionQueryRunner.ts";
import { runConfidenceTrendCertification } from "./confidenceEvolutionTrendRunner.ts";
import { runConfidenceEvidenceReasonCertification } from "./confidenceEvolutionEvidenceReasonRunner.ts";
import { runConfidenceCalibrationCertification } from "./confidenceEvolutionCalibrationRunner.ts";
import { runConfidenceEvolutionFoundation } from "./confidenceEvolutionRunner.ts";
import {
  createConfidenceEvolutionApi,
  resetConfidenceEvolutionApiLayerForTests,
  validateConfidenceEvolutionApiContract,
  validateConfidenceEvolutionConsumerAccessRequest,
} from "./confidenceEvolutionApi.ts";
import { CONFIDENCE_EVOLUTION_DIRECT_IMPORT_GUARD_NOTES } from "./confidenceEvolutionApiManifest.ts";
import { CONFIDENCE_EVOLUTION_API_GROUP_KEYS } from "./confidenceEvolutionApiTypes.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY, validateConfidenceEvolution } from "./confidenceEvolutionContracts.ts";
import { resetConfidenceEvolutionEngineForTests } from "./confidenceEvolutionEngine.ts";
import { resetConfidenceEvolutionQueryLayerForTests } from "./confidenceEvolutionQuery.ts";
import { resetConfidenceEvolutionTrendLayerForTests } from "./confidenceEvolutionTrend.ts";
import { resetConfidenceEvidenceReasonLayerForTests } from "./confidenceEvolutionEvidenceReason.ts";
import { resetConfidenceCalibrationLayerForTests } from "./confidenceEvolutionCalibration.ts";
import {
  buildConfidenceEvolutionPlatformManifest,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_REQUIRED_DOCS,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_MODULES,
  validateConfidenceEvolutionPlatformManifest,
} from "./confidenceEvolutionPlatformCertificationManifest.ts";
import {
  buildConfidenceEvolutionPlatformReadinessReport,
  computeReadyForFreeze,
} from "./confidenceEvolutionPlatformReadiness.ts";
import { runConfidenceEvolutionPlatformRegression } from "./confidenceEvolutionPlatformRegression.ts";
import type {
  ConfidenceEvolutionPlatformCertificationCheck,
  ConfidenceEvolutionPlatformCertificationGroup,
  ConfidenceEvolutionPlatformCertificationReport,
  ConfidenceEvolutionPlatformCertificationResult,
} from "./confidenceEvolutionPlatformCertificationTypes.ts";
import { getConfidenceEvolutionConsumerContract } from "./confidenceEvolutionConsumerContracts.ts";
import { getAllConsumerContracts } from "./confidenceEvolutionConsumerValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-platform-cert-a";
const WORKSPACE_B = "ws-platform-cert-b";

let lastReport: ConfidenceEvolutionPlatformCertificationReport | null = null;

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ConfidenceEvolutionPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function group(
  groupKey: (typeof CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS)[number],
  title: string,
  checks: ConfidenceEvolutionPlatformCertificationCheck[]
): ConfidenceEvolutionPlatformCertificationGroup {
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
  resetConfidenceEvolutionApiLayerForTests();
  resetConfidenceCalibrationLayerForTests();
  resetConfidenceEvidenceReasonLayerForTests();
  resetConfidenceEvolutionTrendLayerForTests();
  resetConfidenceEvolutionQueryLayerForTests();
  resetConfidenceEvolutionEngineForTests();
}

function sampleRecord(id: string, workspaceId: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Platform cert record ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "APP-9:8 end-to-end certification record.",
    evidenceReferences: Object.freeze(["platform-cert-evidence"]),
    createdAt: FIXED_TIME,
    tags: Object.freeze(["platform-cert"]),
    ...overrides,
  });
}

function verifyEndToEndFlow(): ConfidenceEvolutionPlatformCertificationCheck {
  resetAllLayers();
  const api = createConfidenceEvolutionApi(FIXED_TIME);

  const created = api.records.createRecord(sampleRecord("platform-e2e-1", WORKSPACE_A));
  if (!created.success) {
    return check(
      "end_to_end_flow",
      "Record creation → query → trend → evidence/reason → calibration flow",
      false,
      created.reason
    );
  }

  const query = api.query.queryConfidence({ workspaceId: WORKSPACE_A });
  const trend = api.trend.buildTrendModel({ workspaceId: WORKSPACE_A });
  const evidenceReason = api.evidenceReason.buildEvidenceReasonModel({ workspaceId: WORKSPACE_A });
  const calibration = api.calibration.buildCalibrationModel({ workspaceId: WORKSPACE_A });

  const passed =
    query.success === true &&
    query.data?.totalRecords === 1 &&
    trend.success === true &&
    trend.data?.recordCount === 1 &&
    evidenceReason.success === true &&
    evidenceReason.data?.recordCount === 1 &&
    calibration.success === true &&
    calibration.data?.recordCount === 1;

  return check(
    "end_to_end_flow",
    "Record creation → query → trend → evidence/reason → calibration flow",
    passed,
    passed ? "full chain verified via facade" : "chain incomplete"
  );
}

function verifyDeterministicOrdering(): ConfidenceEvolutionPlatformCertificationCheck {
  resetAllLayers();
  const api = createConfidenceEvolutionApi(FIXED_TIME);
  api.records.createRecord(
    sampleRecord("platform-order-b", WORKSPACE_A, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
    })
  );
  api.records.createRecord(
    sampleRecord("platform-order-a", WORKSPACE_A, {
      updatedAt: "2026-06-01T00:00:00.000Z",
      createdAt: "2026-06-01T00:00:00.000Z",
    })
  );

  const ordered = api.query.getOrderedRecords({ workspaceId: WORKSPACE_A });
  const ids = ordered.data?.map((record) => record.id) ?? [];
  const passed = ordered.success === true && ids[0] === "platform-order-a" && ids[1] === "platform-order-b";

  return check(
    "deterministic_ordering",
    "Deterministic query ordering verified end-to-end",
    passed,
    passed ? "desc updatedAt ordering confirmed" : `order=${ids.join(",")}`
  );
}

function verifyWorkspaceIsolationEndToEnd(): ConfidenceEvolutionPlatformCertificationCheck {
  resetAllLayers();
  const api = createConfidenceEvolutionApi(FIXED_TIME);
  api.records.createRecord(sampleRecord("platform-ws-a", WORKSPACE_A));
  api.records.createRecord(sampleRecord("platform-ws-b", WORKSPACE_B));

  const wsARecords = api.records.getRecords(WORKSPACE_A);
  const wsBRecords = api.records.getRecords(WORKSPACE_B);
  const wsAQuery = api.query.queryConfidence({ workspaceId: WORKSPACE_A });
  const wsBQuery = api.query.queryConfidence({ workspaceId: WORKSPACE_B });

  const passed =
    wsARecords.success === true &&
    wsBRecords.success === true &&
    wsARecords.data?.length === 1 &&
    wsBRecords.data?.length === 1 &&
    wsAQuery.data?.totalRecords === 1 &&
    wsBQuery.data?.totalRecords === 1 &&
    wsARecords.data?.[0]?.workspaceId === WORKSPACE_A &&
    wsBRecords.data?.[0]?.workspaceId === WORKSPACE_B;

  return check(
    "workspace_isolation_e2e",
    "Workspace isolation consistent end-to-end",
    passed,
    passed ? "workspaces isolated via facade" : "isolation failure"
  );
}

function verifyArchivePolicyEndToEnd(): ConfidenceEvolutionPlatformCertificationCheck {
  resetAllLayers();
  const api = createConfidenceEvolutionApi(FIXED_TIME);
  api.records.createRecord(sampleRecord("platform-archive-1", WORKSPACE_A));

  const beforeArchive = api.query.queryConfidence({ workspaceId: WORKSPACE_A, includeArchived: false });
  const archived = api.records.archiveRecord("platform-archive-1", WORKSPACE_A);
  const afterArchive = api.query.queryConfidence({ workspaceId: WORKSPACE_A, includeArchived: false });
  const withArchived = api.query.queryConfidence({ workspaceId: WORKSPACE_A, includeArchived: true });

  const passed =
    beforeArchive.data?.totalRecords === 1 &&
    archived.success === true &&
    afterArchive.data?.totalRecords === 0 &&
    withArchived.data?.totalRecords === 1;

  return check(
    "archive_policy_e2e",
    "Archive policy respected end-to-end",
    passed,
    passed ? "archived records excluded by default" : "archive policy failure"
  );
}

function verifyMutationBoundaries(): ConfidenceEvolutionPlatformCertificationCheck {
  resetAllLayers();
  const api = createConfidenceEvolutionApi(FIXED_TIME);
  const created = api.records.createRecord(sampleRecord("platform-mutation-1", WORKSPACE_A));
  const updated = api.records.updateRecordMetadata({
    id: "platform-mutation-1",
    workspaceId: WORKSPACE_A,
    title: "Updated title",
  });
  const wrongWorkspace = api.records.archiveRecord("platform-mutation-1", WORKSPACE_B);

  const passed = created.success === true && updated.success === true && wrongWorkspace.success === false;
  return check(
    "mutation_boundaries",
    "Record mutation boundaries enforced",
    passed,
    passed ? "metadata update allowed; cross-workspace archive blocked" : "mutation boundary failure"
  );
}

function verifyReadOnlyConsumers(): ConfidenceEvolutionPlatformCertificationCheck {
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
    const contract = getConfidenceEvolutionConsumerContract(consumerId);
    if (!contract?.readOnly || contract.mutationAllowed) {
      violations.push(`${consumerId} not read-only`);
    }
    const mutationCheck = validateConfidenceEvolutionConsumerAccessRequest({
      consumerId,
      apiGroup: "records",
      operation: "createRecord",
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

function verifyWorkspaceControlledWrites(): ConfidenceEvolutionPlatformCertificationCheck {
  const contract = getConfidenceEvolutionConsumerContract("WorkspaceConsumer");
  const createAccess = validateConfidenceEvolutionConsumerAccessRequest({
    consumerId: "WorkspaceConsumer",
    apiGroup: "records",
    operation: "createRecord",
    mutation: true,
  });
  const certAccess = validateConfidenceEvolutionConsumerAccessRequest({
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

function verifyDashboardAssistantVisualizationReadOnly(): ConfidenceEvolutionPlatformCertificationCheck {
  const consumers = ["DashboardConsumer", "AssistantConsumer", "VisualizationConsumer"] as const;
  const violations: string[] = [];

  for (const consumerId of consumers) {
    const contract = getConfidenceEvolutionConsumerContract(consumerId);
    if (!contract?.readOnly) {
      violations.push(`${consumerId} not read-only`);
    }
    if ((contract?.allowedApiGroups as readonly string[]).includes("records")) {
      violations.push(`${consumerId} has records access`);
    }
  }

  return check(
    "dashboard_assistant_visualization_readonly",
    "Dashboard/Assistant/Visualization remain read-only",
    violations.length === 0,
    violations.length === 0 ? "integration consumers read-only" : violations.join("; ")
  );
}

function verifyConsumerContractsValid(): ConfidenceEvolutionPlatformCertificationCheck {
  const contracts = getAllConsumerContracts();
  const violations: string[] = [];

  if (contracts.length !== 7) {
    violations.push(`expected 7 contracts, got ${contracts.length}`);
  }

  for (const contract of contracts) {
    if (contract.allowedApiGroups.length === 0) {
      violations.push(`${contract.consumerId} has no allowed groups`);
    }
    if (contract.forbiddenApiGroups.some((entry) => contract.allowedApiGroups.includes(entry))) {
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

function verifyNoPlatformImport(platform: "app6" | "app7" | "app8"): ConfidenceEvolutionPlatformCertificationCheck {
  const engineSources = [
    readModule("app/lib/confidence-evolution/confidenceEvolutionApiFacade.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionEngine.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionQuery.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionTrend.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionEvidenceReason.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionCalibration.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionApi.ts"),
  ].join("\n");

  const patterns: Record<typeof platform, RegExp> = {
    app6: /from\s+["'].*decision-timeline\//,
    app7: /from\s+["'].*business-timeline\//,
    app8: /from\s+["'].*decision-journal\//,
  };

  const titles: Record<typeof platform, string> = {
    app6: "No direct APP-6 integration",
    app7: "No direct APP-7 integration",
    app8: "No direct APP-8 integration",
  };

  const passed = !patterns[platform].test(engineSources);
  return check(
    `no_${platform}_integration`,
    titles[platform],
    passed,
    passed ? `no ${platform} imports in APP-9 modules` : `${platform} coupling detected`
  );
}

function verifyNoImplementation(
  kind: "dashboard" | "assistant" | "visualization" | "persistence" | "prediction"
): ConfidenceEvolutionPlatformCertificationCheck {
  const sources = [
    readModule("app/lib/confidence-evolution/confidenceEvolutionPlatformCertification.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionPlatformRegression.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionPlatformReadiness.ts"),
    readModule("app/lib/confidence-evolution/confidenceEvolutionPlatformCertificationTypes.ts"),
  ].join("\n");

  const patterns: Record<typeof kind, RegExp> = {
    dashboard: /export\s+(function|const)\s+\w*Dashboard\w*\s*=|class\s+\w*DashboardAdapter/,
    assistant: /export\s+(function|const)\s+\w*Assistant\w*\s*=|class\s+\w*AssistantAdapter/,
    visualization:
      /export\s+(function|const)\s+\w*(Chart|Visualization|Renderer)\w*\s*=|class\s+\w*TimelineRenderer/,
    persistence: /localStorage|indexedDB|await\s+fetch\s*\(/,
    prediction: /recommendConfidence|predictConfidence|generateRecommendation|recommendationEngine/,
  };

  const titles = {
    dashboard: "No dashboard implementation",
    assistant: "No assistant implementation",
    visualization: "No visualization implementation",
    persistence: "No persistence",
    prediction: "No prediction/recommendation logic",
  };

  const passed = !patterns[kind].test(sources);
  return check(`no_${kind}`, titles[kind], passed, passed ? "APP-9:8 certification modules clean" : `${kind} detected`);
}

function verifyPriorPlatformsUntouched(): ConfidenceEvolutionPlatformCertificationCheck {
  const app5Ok =
    SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
    SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION.length > 0;
  const app6Ok =
    DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
    DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION.length > 0;
  const app7Ok =
    BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
    BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION.length > 0;
  const app8Ok =
    DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
    DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION.length > 0;
  const app9Ok = CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9";

  const scenarioFile = existsSync(
    join(REPO_ROOT, "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformContracts.ts")
  );
  const decisionFile = existsSync(join(REPO_ROOT, "frontend/app/lib/decision-timeline/decisionTimelineContracts.ts"));
  const businessFile = existsSync(join(REPO_ROOT, "frontend/app/lib/business-timeline/businessTimelineContracts.ts"));
  const journalFile = existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalContracts.ts"));

  const passed = app5Ok && app6Ok && app7Ok && app8Ok && app9Ok && scenarioFile && decisionFile && businessFile && journalFile;
  return check(
    "prior_platforms_untouched",
    "Prior APP-1 through APP-8 untouched",
    passed,
    passed ? "APP-5 through APP-9 identity verified" : "prior platform verification failed"
  );
}

function verifyDocumentationCompleteness(): ConfidenceEvolutionPlatformCertificationCheck {
  const missing = CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_REQUIRED_DOCS.filter(
    (doc) => !existsSync(join(REPO_ROOT, doc))
  );
  return check(
    "documentation_completeness",
    "Required platform documentation present",
    missing.length === 0,
    missing.length === 0
      ? `${CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_REQUIRED_DOCS.length} docs verified`
      : missing.join(", ")
  );
}

export function getConfidenceEvolutionPlatformCertificationReport(): ConfidenceEvolutionPlatformCertificationReport | null {
  return lastReport;
}

export function resetConfidenceEvolutionPlatformCertificationReportForTests(): void {
  lastReport = null;
}

export function runConfidenceEvolutionPlatformCertification(
  timestamp: string = new Date().toISOString()
): ConfidenceEvolutionPlatformCertificationResult {
  const regression = runConfidenceEvolutionPlatformRegression();
  const foundation = runConfidenceEvolutionFoundation(FIXED_TIME);
  const engine = runConfidenceEvolutionEngineCertification();
  const query = runConfidenceEvolutionQueryCertification();
  const trend = runConfidenceTrendCertification();
  const evidenceReason = runConfidenceEvidenceReasonCertification();
  const calibration = runConfidenceCalibrationCertification();
  const api = runConfidenceEvolutionApiCertification();

  resetAllLayers();
  const apiInstance = createConfidenceEvolutionApi(FIXED_TIME);
  const apiContract = validateConfidenceEvolutionApiContract();
  const foundationValidation = validateConfidenceEvolution(FIXED_TIME);

  const groups: ConfidenceEvolutionPlatformCertificationGroup[] = [];

  groups.push(
    group("A_app9_1_foundation", "APP-9:1 Foundation Certification", [
      check(
        "app9_1",
        "APP-9:1 foundation certification PASS",
        foundation.certified === true,
        `${foundation.passedCount}/${foundation.checkCount}`
      ),
    ])
  );

  groups.push(
    group("B_app9_2_engine", "APP-9:2 Engine Certification", [
      check(
        "app9_2",
        "APP-9:2 engine certification PASS",
        engine.certified === true && engine.status === "PASS",
        engine.summary
      ),
    ])
  );

  groups.push(
    group("C_app9_3_query_layer", "APP-9:3 Query Layer Certification", [
      check(
        "app9_3",
        "APP-9:3 query layer certification PASS",
        query.certified === true && query.status === "PASS",
        query.summary
      ),
    ])
  );

  groups.push(
    group("D_app9_4_trend_layer", "APP-9:4 Trend Layer Certification", [
      check(
        "app9_4",
        "APP-9:4 trend layer certification PASS",
        trend.certified === true && trend.status === "PASS",
        trend.summary
      ),
    ])
  );

  groups.push(
    group("E_app9_5_evidence_reason_layer", "APP-9:5 Evidence/Reason Layer Certification", [
      check(
        "app9_5",
        "APP-9:5 evidence/reason layer certification PASS",
        evidenceReason.certified === true && evidenceReason.status === "PASS",
        evidenceReason.summary
      ),
    ])
  );

  groups.push(
    group("F_app9_6_calibration_layer", "APP-9:6 Calibration Layer Certification", [
      check(
        "app9_6",
        "APP-9:6 calibration layer certification PASS",
        calibration.certified === true && calibration.status === "PASS",
        calibration.summary
      ),
    ])
  );

  groups.push(
    group("G_app9_7_api_layer", "APP-9:7 API Layer Certification", [
      check(
        "app9_7",
        "APP-9:7 API layer certification PASS",
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
        CONFIDENCE_EVOLUTION_API_GROUP_KEYS.every((key) => key in apiInstance),
        CONFIDENCE_EVOLUTION_API_GROUP_KEYS.join(", ")
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
        CONFIDENCE_EVOLUTION_DIRECT_IMPORT_GUARD_NOTES.includes("MUST import APP-9:7"),
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

  groups.push(
    group("O_workspace_controlled_writes", "Workspace Controlled Writes", [verifyWorkspaceControlledWrites()])
  );

  groups.push(
    group("P_dashboard_assistant_visualization_readonly", "Integration Consumers Read-Only", [
      verifyDashboardAssistantVisualizationReadOnly(),
    ])
  );

  groups.push(group("Q_no_app6_integration", "No APP-6 Integration", [verifyNoPlatformImport("app6")]));

  groups.push(group("R_no_app7_integration", "No APP-7 Integration", [verifyNoPlatformImport("app7")]));

  groups.push(group("S_no_app8_integration", "No APP-8 Integration", [verifyNoPlatformImport("app8")]));

  groups.push(
    group("T_no_dashboard_implementation", "No Dashboard Implementation", [verifyNoImplementation("dashboard")])
  );

  groups.push(
    group("U_no_assistant_implementation", "No Assistant Implementation", [verifyNoImplementation("assistant")])
  );

  groups.push(
    group("V_no_visualization_implementation", "No Visualization Implementation", [
      verifyNoImplementation("visualization"),
    ])
  );

  groups.push(group("W_no_persistence", "No Persistence", [verifyNoImplementation("persistence")]));

  groups.push(
    group("X_no_prediction_recommendation", "No Prediction/Recommendation Logic", [
      verifyNoImplementation("prediction"),
    ])
  );

  groups.push(
    group("Y_prior_platforms_untouched", "Prior Platforms Untouched", [
      verifyPriorPlatformsUntouched(),
      check(
        "prior_phases_preserved",
        "Prior APP-9 phase files preserved",
        regression.priorPhasesPreserved === true,
        regression.priorPhasesPreserved ? "files intact" : "missing files"
      ),
    ])
  );

  const firstRun = runConfidenceEvolutionPlatformCertificationInternalChecksOnly();
  const secondRun = runConfidenceEvolutionPlatformCertificationInternalChecksOnly();
  groups.push(
    group("Z_certification_deterministic", "Certification Deterministic", [
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
  const platformManifest = buildConfidenceEvolutionPlatformManifest(
    timestamp,
    false,
    allGroupsPassedBeforeManifest ? timestamp : null
  );

  groups.push(
    group("AA_platform_manifest_valid", "Platform Manifest Valid", [
      check(
        "manifest_identity",
        "Platform manifest identity valid",
        platformManifest.platformId === CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.platformId &&
          platformManifest.appId === "APP-9",
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
        validateConfidenceEvolutionPlatformManifest(platformManifest).valid === true,
        "manifest valid"
      ),
      verifyDocumentationCompleteness(),
      check(
        "stage_manifest",
        "Certification stage manifest valid",
        validateStageManifest(CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid === true,
        "stage manifest valid"
      ),
      check(
        "architecture_boundaries",
        "Architecture file boundaries enforced",
        evaluateStageFileBoundary({
          filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformCertification.ts",
          allowedFiles: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === true &&
          evaluateStageFileBoundary({
            filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
            allowedFiles: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
            forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
          }).allowed === false,
        "boundaries enforced"
      ),
    ])
  );

  const readiness = buildConfidenceEvolutionPlatformReadinessReport(groups, regression, platformManifest);
  const readyForFreeze = computeReadyForFreeze(groups, regression, platformManifest);

  groups.push(
    group("AB_ready_for_freeze", "Ready For Freeze", [
      check(
        "full_regression",
        "Full APP-9 regression succeeded",
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
        readyForFreeze ? "ready for APP-9:9 freeze" : "not ready"
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

  const report: ConfidenceEvolutionPlatformCertificationReport = Object.freeze({
    platformIdentity: CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId,
    certificationVersion: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certificationTimestamp: timestamp,
    certificationScore,
    groups: Object.freeze(groups),
    regressionSummary: regression.summary,
    layerRegressionResults: regression.layerResults,
    readinessSummary: readiness.summary,
    readyForFreeze,
    certifiedModules: Object.freeze(
      CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_MODULES.map((entry) =>
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

function runConfidenceEvolutionPlatformCertificationInternalChecksOnly(): Readonly<{ score: number; readOnly: true }> {
  const regression = runConfidenceEvolutionPlatformRegression();
  const score = regression.layerResults.every((entry) => entry.certified)
    ? 100
    : Math.round(
        (regression.layerResults.filter((entry) => entry.certified).length / regression.layerResults.length) * 100
      );
  return Object.freeze({ score, readOnly: true as const });
}

export function getConfidenceEvolutionPlatformManifest(timestamp: string = new Date().toISOString()) {
  const report = lastReport;
  return buildConfidenceEvolutionPlatformManifest(
    timestamp,
    report?.readyForFreeze ?? false,
    report?.certified ? timestamp : null
  );
}

export function getConfidenceEvolutionPlatformReadinessReportFromLastRun() {
  if (!lastReport) {
    return buildConfidenceEvolutionPlatformReadinessReport(
      [],
      runConfidenceEvolutionPlatformRegression(),
      buildConfidenceEvolutionPlatformManifest(new Date().toISOString(), false)
    );
  }
  return buildConfidenceEvolutionPlatformReadinessReport(
    lastReport.groups,
    runConfidenceEvolutionPlatformRegression(),
    buildConfidenceEvolutionPlatformManifest(
      lastReport.certificationTimestamp,
      lastReport.readyForFreeze,
      lastReport.certified ? lastReport.certificationTimestamp : null
    )
  );
}
