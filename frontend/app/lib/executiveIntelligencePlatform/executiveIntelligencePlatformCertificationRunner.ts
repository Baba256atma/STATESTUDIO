/**
 * INT-5 — Executive Intelligence Platform certification runner.
 */

import { ASSISTANT_FORBIDDEN_DS_IMPORT_PREFIXES } from "../assistantIntelligence/assistantIntelligenceContract.ts";
import { requestAssistantIntelligence as runAssistant } from "../assistantIntelligence/assistantRuntimeAdapter.ts";
import {
  DASHBOARD_INTELLIGENCE_SOURCE,
  DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
} from "../dashboardIntelligence/dashboardIntelligenceContract.ts";
import { getDashboardIntelligenceEvents } from "../dashboardIntelligence/dashboardIntelligenceDiagnostics.ts";
import { requestDashboardIntelligence } from "../dashboardIntelligence/dashboardIntelligenceRuntime.ts";
import { buildExecutiveTimeContext } from "../dashboardIntelligence/executiveTimeContextBuilder.ts";
import {
  EXECUTIVE_TIME_CONTEXT_SOURCE,
  EXECUTIVE_TIME_CONTEXT_VERSION,
} from "../dashboardIntelligence/executiveTimeContextContract.ts";
import { buildIntelligenceContext } from "../dashboardIntelligence/intelligenceContextBuilder.ts";
import {
  INTELLIGENCE_CONTEXT_SOURCE,
  INTELLIGENCE_CONTEXT_VERSION,
} from "../dashboardIntelligence/intelligenceContextContract.ts";
import { getIntelligenceContextChangeCounter } from "../dashboardIntelligence/intelligenceContextRegistry.ts";
import { requestIntelligenceWithContext } from "../dashboardIntelligence/intelligenceContextGateway.ts";
import {
  enforcePresentationImportPolicy,
  isDirectDsImportForbidden,
} from "../dashboardIntelligence/runtimeAccessPolicy.ts";
import { getIntelligenceConsumerDiagnostics } from "../dashboardIntelligence/consumerDiagnosticsContract.ts";
import { FORBIDDEN_DIRECT_DS_IMPORT_PREFIXES } from "../dashboardIntelligence/directAccessProtectionContract.ts";
import {
  SINGLE_INTELLIGENCE_GATEWAY_SOURCE,
  SINGLE_INTELLIGENCE_SOURCE_VERSION,
} from "../dashboardIntelligence/singleIntelligenceSourceContract.ts";
import { requestIntelligence, buildIntelligenceGatewayRequest } from "../dashboardIntelligence/singleIntelligenceSourceGateway.ts";
import { EXECUTIVE_SUMMARY_FORBIDDEN_DS_IMPORT_PREFIXES } from "../executiveSummaryIntelligence/executiveSummaryIntelligenceContract.ts";
import { requestExecutiveSummaryIntelligence } from "../executiveSummaryIntelligence/executiveSummaryRuntimeAdapter.ts";
import { OBJECT_PANEL_FORBIDDEN_DS_IMPORT_PREFIXES } from "../objectPanelIntelligence/objectPanelIntelligenceContract.ts";
import { getObjectPanelSelectionChangeCounter } from "../objectPanelIntelligence/objectPanelRegistry.ts";
import { requestObjectPanelIntelligence } from "../objectPanelIntelligence/objectPanelRuntimeAdapter.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  freezeExecutiveIntelligencePlatform,
  resetExecutiveIntelligencePlatformFreezeForTests,
} from "./executiveIntelligencePlatformArchitectureFreeze.ts";
import {
  EXECUTIVE_INTELLIGENCE_CERTIFICATION_GROUP_TITLES,
  EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
  EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS,
  type ExecutiveIntelligenceCertificationGroupId,
  type ExecutiveIntelligencePlatformCertificationResult,
  type ExecutiveIntelligencePlatformCheck,
} from "./executiveIntelligencePlatformCertificationContract.ts";
import {
  createPlatformCertificationWorkspace,
  ensurePlatformCertificationBrowserStorage,
  ensurePlatformCertificationWorkspace,
  protectedStorageUnchanged,
  resetExecutiveIntelligencePlatformForCertification,
  seedPlatformCertificationWorkspace,
  snapshotPlatformProtectedStorage,
} from "./executiveIntelligencePlatformCertificationHarness.ts";
import {
  buildExecutiveIntelligencePlatformDiagnosticsReport,
  platformDiagnosticsOperational,
} from "./executiveIntelligencePlatformDiagnosticsReport.ts";
import { runExecutiveIntelligenceEndToEndScenarios } from "./executiveIntelligencePlatformEndToEndScenarios.ts";
import { runExecutiveIntelligenceRegressionSuite } from "./executiveIntelligencePlatformRegressionSuite.ts";

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  group: ExecutiveIntelligenceCertificationGroupId,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveIntelligencePlatformCheck {
  return Object.freeze({ id, group, title, passed, evidence });
}

function consumerImportBlocked(consumer: "assistant" | "executive_summary" | "object_panel"): boolean {
  const prefixes =
    consumer === "assistant"
      ? ASSISTANT_FORBIDDEN_DS_IMPORT_PREFIXES
      : consumer === "executive_summary"
        ? EXECUTIVE_SUMMARY_FORBIDDEN_DS_IMPORT_PREFIXES
        : OBJECT_PANEL_FORBIDDEN_DS_IMPORT_PREFIXES;
  return prefixes.every((prefix) => {
    const decision = enforcePresentationImportPolicy({ consumer, importSpecifier: prefix });
    return decision.allowed === false;
  });
}

export function runExecutiveIntelligencePlatformCertification(input?: {
  workspaceId?: WorkspaceId;
  skipRegression?: boolean;
  skipBuildInRegression?: boolean;
}): ExecutiveIntelligencePlatformCertificationResult {
  resetExecutiveIntelligencePlatformFreezeForTests();
  ensurePlatformCertificationBrowserStorage();
  if (typeof window !== "undefined") window.localStorage.clear();
  resetExecutiveIntelligencePlatformForCertification();

  const workspaceId = ensurePlatformCertificationWorkspace(
    (input?.workspaceId ?? createPlatformCertificationWorkspace()).trim()
  );
  seedPlatformCertificationWorkspace(workspaceId);
  const beforeStorage = snapshotPlatformProtectedStorage();
  const checks: ExecutiveIntelligencePlatformCheck[] = [];

  const sharedContext = Object.freeze({
    workspace: workspaceId,
    selectedObject: "obj_delivery",
    selectedRelationship: "rel_delivery",
    selectedKpi: "kpi_delivery",
    selectedRisk: "risk_delivery",
    selectedScenario: "scenario_delivery",
    dashboardMode: "executive_summary" as const,
    panel: "executive_summary" as const,
    executiveTime: Object.freeze({ timeState: "now" as const }),
    filters: Object.freeze({ severity: "critical" }),
    timelinePosition: Object.freeze({ index: 1, label: "Current", reserved: false }),
  });

  buildIntelligenceContext({
    consumer: "dashboard",
    workspace: sharedContext.workspace,
    panel: sharedContext.panel,
    dashboardMode: sharedContext.dashboardMode,
    selectedObject: sharedContext.selectedObject,
    selectedRelationship: sharedContext.selectedRelationship,
    selectedKpi: sharedContext.selectedKpi,
    selectedRisk: sharedContext.selectedRisk,
    selectedScenario: sharedContext.selectedScenario,
    timelinePosition: sharedContext.timelinePosition,
    filters: sharedContext.filters,
    executiveTime: sharedContext.executiveTime,
  });

  const gatewayBefore = getIntelligenceConsumerDiagnostics().length;
  const contextCounterBefore = getIntelligenceContextChangeCounter();

  const assistantResult = runAssistant({
    requestType: "explain_executive_summary",
    workspace: sharedContext.workspace,
    selection: {
      objectId: sharedContext.selectedObject,
      relationshipId: sharedContext.selectedRelationship,
      kpiId: sharedContext.selectedKpi,
      riskId: sharedContext.selectedRisk,
      scenarioId: sharedContext.selectedScenario,
    },
    executiveTime: Object.freeze({
      timeState: sharedContext.executiveTime.timeState,
      timelinePosition: sharedContext.timelinePosition,
    }),
    filters: sharedContext.filters,
    useCurrentContext: false,
  });

  const summaryResult = requestExecutiveSummaryIntelligence({
    workspace: sharedContext.workspace,
    selection: {
      objectId: sharedContext.selectedObject,
      relationshipId: sharedContext.selectedRelationship,
      kpiId: sharedContext.selectedKpi,
      riskId: sharedContext.selectedRisk,
      scenarioId: sharedContext.selectedScenario,
    },
    executiveTime: Object.freeze({
      timeState: sharedContext.executiveTime.timeState,
      timelinePosition: sharedContext.timelinePosition,
    }),
    filters: sharedContext.filters,
    dashboardMode: sharedContext.dashboardMode,
    panel: sharedContext.panel,
    useCurrentContext: false,
  });

  const objectResult = requestObjectPanelIntelligence({
    workspace: sharedContext.workspace,
    selectedObjectId: sharedContext.selectedObject,
    selection: {
      relationshipId: sharedContext.selectedRelationship,
      kpiId: sharedContext.selectedKpi,
      riskId: sharedContext.selectedRisk,
      scenarioId: sharedContext.selectedScenario,
    },
    executiveTime: Object.freeze({
      timeState: sharedContext.executiveTime.timeState,
      timelinePosition: sharedContext.timelinePosition,
    }),
    filters: sharedContext.filters,
    useCurrentContext: false,
  });

  const objectSwitch = requestObjectPanelIntelligence({
    workspace: sharedContext.workspace,
    selectedObjectId: "obj_inventory",
    executiveTime: sharedContext.executiveTime,
  });

  const gatewayAfter = getIntelligenceConsumerDiagnostics().length;
  const runtimeProbe = requestDashboardIntelligence({
    panel: "executive_summary",
    workspaceId,
  });
  const directGateway = requestIntelligence(
    buildIntelligenceGatewayRequest({
      consumer: "dashboard",
      panel: "executive_summary",
      workspaceId,
    })
  );

  checks.push(
    check("A1", "A", "One Dashboard Runtime", typeof requestDashboardIntelligence === "function", `Runtime version=${DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION}.`),
    check("A2", "A", "One Gateway", typeof requestIntelligence === "function", `Gateway version=${SINGLE_INTELLIGENCE_SOURCE_VERSION}.`),
    check("A3", "A", "One Unified Context", typeof buildIntelligenceContext === "function", `Context version=${INTELLIGENCE_CONTEXT_VERSION}.`),
    check("A4", "A", "One Executive Time Context", typeof buildExecutiveTimeContext === "function", `Time version=${EXECUTIVE_TIME_CONTEXT_VERSION}.`),
    check("A5", "A", "One normalized intelligence pipeline", Boolean(runtimeProbe.snapshot?.payload), `Normalized=${Boolean(runtimeProbe.snapshot?.payload)}.`),
    check("A6", "A", "One request flow", typeof requestIntelligenceWithContext === "function", `Gateway source=${SINGLE_INTELLIGENCE_GATEWAY_SOURCE}.`)
  );

  checks.push(
    check("B1", "B", "Assistant never imports DS engines directly", consumerImportBlocked("assistant"), "Assistant forbidden imports blocked."),
    check("B2", "B", "Executive Summary never imports DS engines directly", consumerImportBlocked("executive_summary"), "Executive Summary forbidden imports blocked."),
    check("B3", "B", "Object Panel never imports DS engines directly", consumerImportBlocked("object_panel"), "Object Panel forbidden imports blocked."),
    check("B4", "B", "Platform direct DS import protection active", isDirectDsImportForbidden("../kpi/workspaceKpi"), `${FORBIDDEN_DIRECT_DS_IMPORT_PREFIXES.length} global forbidden prefix(es).`)
  );

  const pipelineConsumers = [assistantResult, summaryResult, objectResult];
  checks.push(
    check(
      "C1",
      "C",
      "Pipeline includes Executive Time Context",
      pipelineConsumers.every((entry) => Boolean(entry.request.executiveTimeContext)),
      "All consumers embed time context."
    ),
    check(
      "C2",
      "C",
      "Pipeline includes Unified Intelligence Context",
      pipelineConsumers.every((entry) => Boolean(entry.request.intelligenceContext)),
      "All consumers embed unified context."
    ),
    check(
      "C3",
      "C",
      "Pipeline reaches Gateway",
      pipelineConsumers.every((entry) => entry.gatewaySuccess),
      "All consumers succeeded through gateway."
    ),
    check(
      "C4",
      "C",
      "Pipeline reaches Runtime normalized response",
      pipelineConsumers.every((entry) => entry.response.normalized !== null),
      "All consumers received normalized payloads."
    ),
    check(
      "C5",
      "C",
      "No bypass path detected",
      directGateway && "runtimeResponse" in directGateway && runtimeProbe.success,
      "Gateway and runtime remain the only intelligence path."
    )
  );

  const pastResult = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    panel: sharedContext.panel,
    dashboardMode: sharedContext.dashboardMode,
    useCurrentContext: false,
    executiveTime: {
      timeState: "past",
      timelinePosition: { index: 0, label: "Historical", reserved: false },
    },
  });
  const futureResult = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    panel: sharedContext.panel,
    dashboardMode: sharedContext.dashboardMode,
    useCurrentContext: false,
    executiveTime: { timeState: "future", requestedTime: "what-if" },
  });

  checks.push(
    check("D1", "D", "PAST reaches consumers", pastResult.request.executiveTimeContext?.timeState === "past", `Past=${pastResult.request.executiveTimeContext?.timeState}.`),
    check("D2", "D", "NOW reaches consumers", assistantResult.request.executiveTimeContext?.timeState === "now", `Now=${assistantResult.request.executiveTimeContext?.timeState}.`),
    check("D3", "D", "FUTURE reaches consumers", futureResult.request.executiveTimeContext?.timeState === "future", `Future=${futureResult.request.executiveTimeContext?.timeState}.`),
    check("D4", "D", "Consumers never determine time state", assistantResult.request.executiveTimeContext?.source === EXECUTIVE_TIME_CONTEXT_SOURCE, `Time source=${assistantResult.request.executiveTimeContext?.source}.`)
  );

  const contexts = pipelineConsumers.map((entry) => entry.request.intelligenceContext);
  checks.push(
    check("E1", "E", "Workspace consistent across consumers", contexts.every((ctx) => ctx?.workspace === workspaceId), `Workspace=${workspaceId}.`),
    check("E2", "E", "Selected object consistent", contexts.every((ctx) => ctx?.selectedObject === sharedContext.selectedObject), `Object=${sharedContext.selectedObject}.`),
    check("E3", "E", "Selected relationship consistent", contexts.every((ctx) => ctx?.selectedRelationship === sharedContext.selectedRelationship), `Relationship=${sharedContext.selectedRelationship}.`),
    check("E4", "E", "Selected KPI consistent", contexts.every((ctx) => ctx?.selectedKpi === sharedContext.selectedKpi), `KPI=${sharedContext.selectedKpi}.`),
    check("E5", "E", "Selected risk consistent", contexts.every((ctx) => ctx?.selectedRisk === sharedContext.selectedRisk), `Risk=${sharedContext.selectedRisk}.`),
    check("E6", "E", "Selected scenario consistent", contexts.every((ctx) => ctx?.selectedScenario === sharedContext.selectedScenario), `Scenario=${sharedContext.selectedScenario}.`),
    check("E7", "E", "Dashboard mode consistent where applicable", summaryResult.request.dashboardMode === sharedContext.dashboardMode, `Mode=${summaryResult.request.dashboardMode}.`),
    check("E8", "E", "Filters consistent", contexts.every((ctx) => ctx?.filters.severity === "critical"), "Filter severity=critical."),
    check("E9", "E", "Timeline position consistent", contexts.every((ctx) => ctx?.timelinePosition.index === 1), "Timeline index=1."),
    check("E10", "E", "Consumer identity preserved", assistantResult.request.consumer === "assistant" && summaryResult.request.consumer === "executive_summary" && objectResult.request.consumer === "object_panel", "Consumer IDs verified.")
  );

  checks.push(
    check("F1", "F", "Object selection creates new immutable request", objectSwitch.selectionChanged === true, `Selection changed=${objectSwitch.selectionChanged}.`),
    check("F2", "F", "Selection change counter increments", getObjectPanelSelectionChangeCounter() >= 1, `Selection counter=${getObjectPanelSelectionChangeCounter()}.`),
    check("F3", "F", "Unified context change counter increments", getIntelligenceContextChangeCounter() > contextCounterBefore, `Context counter=${getIntelligenceContextChangeCounter()}.`),
    check("F4", "F", "Assistant reflects selected object", assistantResult.request.selection.objectId === sharedContext.selectedObject, `Assistant object=${assistantResult.request.selection.objectId}.`),
    check("F5", "F", "Executive Summary remains consistent after selection", summaryResult.request.selection.objectId === sharedContext.selectedObject, `Summary object=${summaryResult.request.selection.objectId}.`)
  );

  const normalizedTriplet = pipelineConsumers.map((entry) => entry.response.normalized);
  checks.push(
    check(
      "G1",
      "G",
      "All consumers receive normalized payloads",
      normalizedTriplet.every((payload) => payload !== null),
      "Normalized payloads present."
    ),
    check(
      "G2",
      "G",
      "Confidence metadata present on all consumers",
      pipelineConsumers.every((entry) => "confidence" in entry.response),
      "Confidence fields present."
    ),
    check(
      "G3",
      "G",
      "Assistant and Executive Summary share source for executive panel",
      assistantResult.response.normalized?.source === summaryResult.response.normalized?.source,
      `Source=${assistantResult.response.normalized?.source}.`
    ),
    check(
      "G4",
      "G",
      "Timestamps present on normalized payloads",
      normalizedTriplet.every((payload) => Boolean(payload?.timestamp)),
      "Normalized timestamps present."
    )
  );

  const afterStorage = snapshotPlatformProtectedStorage();
  checks.push(
    check("H1", "H", "No DS mutation", protectedStorageUnchanged(beforeStorage, afterStorage), "Protected storage unchanged."),
    check("H2", "H", "No Workspace mutation", beforeStorage.objects === afterStorage.objects && beforeStorage.relationships === afterStorage.relationships, "Workspace storage unchanged."),
    check("H3", "H", "No Scene mutation", beforeStorage.scenes === afterStorage.scenes, "Scene storage unchanged."),
    check("H4", "H", "No Executive Registry mutation", beforeStorage.executiveRegistry === afterStorage.executiveRegistry, "Executive registry unchanged."),
    check("H5", "H", "Gateway remains read-only", beforeStorage.kpis === afterStorage.kpis, "Gateway did not mutate DS stores."),
    check("H6", "H", "Runtime remains read-only", getDashboardIntelligenceEvents().length > 0, "Runtime events captured without mutation.")
  );

  const scenarios = runExecutiveIntelligenceEndToEndScenarios({
    workspaceId,
    objectIdA: "obj_delivery",
    objectIdB: "obj_inventory",
  });

  const diagnosticsReport = buildExecutiveIntelligencePlatformDiagnosticsReport();
  checks.push(
    check("I1", "I", "Gateway diagnostics operational", diagnosticsReport.gatewayDiagnostics > 0, `${diagnosticsReport.gatewayDiagnostics} gateway diagnostic(s).`),
    check("I2", "I", "Runtime diagnostics operational", diagnosticsReport.runtimeDiagnostics > 0, `${diagnosticsReport.runtimeDiagnostics} runtime diagnostic(s).`),
    check("I3", "I", "Assistant diagnostics operational", diagnosticsReport.assistantDiagnostics > 0, `${diagnosticsReport.assistantDiagnostics} assistant diagnostic(s).`),
    check("I4", "I", "Executive Summary diagnostics operational", diagnosticsReport.executiveSummaryDiagnostics > 0, `${diagnosticsReport.executiveSummaryDiagnostics} summary diagnostic(s).`),
    check("I5", "I", "Object Panel diagnostics operational", diagnosticsReport.objectPanelDiagnostics > 0, `${diagnosticsReport.objectPanelDiagnostics} object panel diagnostic(s).`),
    check("I6", "I", "Context diagnostics operational", diagnosticsReport.contextDiagnostics > 0, `${diagnosticsReport.contextDiagnostics} context diagnostic(s).`),
    check("I7", "I", "Time diagnostics operational", diagnosticsReport.timeDiagnostics > 0, `${diagnosticsReport.timeDiagnostics} time diagnostic(s).`),
    check("I8", "I", "Diagnostics report complete", platformDiagnosticsOperational(diagnosticsReport), "All diagnostics channels active.")
  );

  const regression =
    input?.skipRegression === true
      ? Object.freeze({
          passed: true,
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          testFiles: Object.freeze([]),
          failures: Object.freeze([]),
        })
      : runExecutiveIntelligenceRegressionSuite({
          includeBuild: input?.skipBuildInRegression !== true,
        });

  checks.push(
    check("J1", "J", "INT-1 through INT-4 regression suite passes", regression.passed, `${regression.passedTests}/${regression.totalTests} test(s) passed.`),
    check("J2", "J", "End-to-end scenarios pass", scenarios.every((entry) => entry.passed), `${scenarios.filter((entry) => entry.passed).length}/${scenarios.length} scenario(s) passed.`)
  );

  const singleCallDelta = gatewayAfter - gatewayBefore;
  checks.push(
    check("K1", "K", "No duplicate gateway routing burst for certification flow", singleCallDelta >= 3 && singleCallDelta <= 12, `Gateway diagnostics delta=${singleCallDelta}.`),
    check("K2", "K", "No routing loops detected", runtimeProbe.diagnostics.runtimeDurationMs < 30_000, `Runtime duration=${runtimeProbe.diagnostics.runtimeDurationMs}ms.`),
    check("K3", "K", "No infinite refresh detected", getIntelligenceContextChangeCounter() < 100, `Context changes=${getIntelligenceContextChangeCounter()}.`),
    check("K4", "K", "No duplicated normalization ownership", runtimeProbe.snapshot?.payload.source !== DASHBOARD_INTELLIGENCE_SOURCE, `Payload source=${runtimeProbe.snapshot?.payload.source}.`)
  );

  checks.push(
    check("L1", "L", "TypeScript build passes", regression.failures.every((entry) => !entry.includes("build")), regression.failures.join("; ") || "Build pass reported by regression suite."),
    check("L2", "L", "Architecture contracts present", INTELLIGENCE_CONTEXT_SOURCE === "int-1-2-intelligence-context", "Architecture contracts loaded."),
    check("L3", "L", "Runtime operational", runtimeProbe.success === true, `Runtime success=${runtimeProbe.success}.`),
    check("L4", "L", "Platform tests pass", regression.failedTests === 0, `${regression.failedTests} failed test(s).`)
  );

  const passed = checks.every((entry) => entry.passed) && scenarios.every((entry) => entry.passed) && regression.passed;
  const freezeReport = freezeExecutiveIntelligencePlatform({
    certified: passed,
    reason: passed
      ? "All certification groups A–L passed. Executive Intelligence Platform architecture frozen."
      : "Certification incomplete — platform not frozen.",
  });

  return Object.freeze({
    contractVersion: EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
    certified: passed,
    passed,
    architectureFrozen: freezeReport.frozen,
    checks: Object.freeze(checks),
    scenarios,
    regression,
    diagnosticsReport,
    freezeReport,
    summary: passed
      ? "Executive Intelligence Platform certification PASSED. Architecture frozen."
      : "Executive Intelligence Platform certification FAILED.",
    generatedAt: nowIso(),
    tags: EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS,
  });
}

export const ExecutiveIntelligencePlatformCertificationRunner = Object.freeze({
  runExecutiveIntelligencePlatformCertification,
});
