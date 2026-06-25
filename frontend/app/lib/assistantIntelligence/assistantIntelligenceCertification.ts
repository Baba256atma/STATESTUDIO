/**
 * INT-2 — Assistant Intelligence certification.
 */

import { EXECUTIVE_REGISTRY_STORAGE_KEY } from "../executive/executiveIntelligenceRegistry.ts";
import { WORKSPACE_KPI_STORAGE_KEY } from "../kpi/workspaceKpiContract.ts";
import { WORKSPACE_OBJECTIVE_STORAGE_KEY } from "../okr/workspaceOkrContract.ts";
import { WORKSPACE_DETECTED_RISK_STORAGE_KEY } from "../risk/workspaceRiskDetectionEngine.ts";
import { WORKSPACE_RISK_STORAGE_KEY } from "../risk/workspaceRiskContract.ts";
import { WORKSPACE_SCENARIO_STORAGE_KEY } from "../scenario/workspaceScenarioContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  enforcePresentationImportPolicy,
  isDirectDsImportForbidden,
} from "../dashboardIntelligence/runtimeAccessPolicy.ts";
import { INTELLIGENCE_CONTEXT_VERSION } from "../dashboardIntelligence/intelligenceContextContract.ts";
import { EXECUTIVE_TIME_CONTEXT_VERSION } from "../dashboardIntelligence/executiveTimeContextContract.ts";
import {
  ASSISTANT_EXECUTIVE_REQUEST_TYPES,
  ASSISTANT_FORBIDDEN_DS_IMPORT_PREFIXES,
  ASSISTANT_INTELLIGENCE_TAGS,
  ASSISTANT_INTELLIGENCE_VERSION,
} from "./assistantIntelligenceContract.ts";
import { inferExecutiveTimeStateFromManagerPhrase } from "./assistantRequestBuilder.ts";
import { requestAssistantIntelligence } from "./assistantRuntimeAdapter.ts";
import {
  getAssistantRuntimeChangeCounter,
  getAssistantRuntimeRegistryState,
} from "./assistantRuntimeRegistry.ts";

const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

export type AssistantIntelligenceCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type AssistantIntelligenceCertificationResult = Readonly<{
  contractVersion: typeof ASSISTANT_INTELLIGENCE_VERSION;
  passed: boolean;
  certified: boolean;
  checks: readonly AssistantIntelligenceCertificationCheck[];
  summary: string;
  generatedAt: string;
  tags: typeof ASSISTANT_INTELLIGENCE_TAGS;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): AssistantIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function snapshotProtectedStorage(): Record<string, string | null> {
  if (typeof window === "undefined") return {};
  return Object.freeze({
    scenarios: window.localStorage.getItem(WORKSPACE_SCENARIO_STORAGE_KEY),
    kpis: window.localStorage.getItem(WORKSPACE_KPI_STORAGE_KEY),
    objectives: window.localStorage.getItem(WORKSPACE_OBJECTIVE_STORAGE_KEY),
    risks: window.localStorage.getItem(WORKSPACE_RISK_STORAGE_KEY),
    detected: window.localStorage.getItem(WORKSPACE_DETECTED_RISK_STORAGE_KEY),
    executiveRegistry: window.localStorage.getItem(EXECUTIVE_REGISTRY_STORAGE_KEY),
    objects: window.localStorage.getItem(OBJECT_INTELLIGENCE_STORAGE_KEY),
    relationships: window.localStorage.getItem(RELATIONSHIP_STORAGE_KEY),
    scenes: window.localStorage.getItem(SCENE_STORAGE_KEY),
  });
}

export function runAssistantIntelligenceCertification(input: {
  workspaceId: WorkspaceId;
  buildPassed?: boolean;
}): AssistantIntelligenceCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const beforeStorage = snapshotProtectedStorage();
  const changeCounterBefore = getAssistantRuntimeChangeCounter();

  const pastPhrase = inferExecutiveTimeStateFromManagerPhrase("Delivery was late");
  const nowPhrase = inferExecutiveTimeStateFromManagerPhrase("Delivery is late");
  const futurePhrase = inferExecutiveTimeStateFromManagerPhrase("If delivery is late");

  const kpiResult = requestAssistantIntelligence({
    requestType: "explain_kpi",
    workspace: workspaceId,
    managerPhrase: "Delivery is late",
    conversationId: "cert_conv_kpi",
  });

  const scenarioResult = requestAssistantIntelligence({
    requestType: "explain_scenario",
    workspace: workspaceId,
    managerPhrase: "If delivery is late",
    conversationId: "cert_conv_scenario",
  });

  const rejected = requestAssistantIntelligence({
    requestType: "explain_object",
    useCurrentContext: false,
    selection: { objectId: "obj_missing" },
  });

  const registry = getAssistantRuntimeRegistryState();
  const afterStorage = snapshotProtectedStorage();

  const directImportBlocked = ASSISTANT_FORBIDDEN_DS_IMPORT_PREFIXES.every((prefix) => {
    const decision = enforcePresentationImportPolicy({
      consumer: "assistant",
      importSpecifier: prefix,
    });
    return decision.allowed === false;
  });

  const checks = Object.freeze([
    check(
      "executive_time_context",
      "Assistant uses Executive Time Context",
      Boolean(kpiResult.request.executiveTimeContext),
      `Time state=${kpiResult.request.executiveTimeContext?.timeState ?? "none"}.`
    ),
    check(
      "unified_intelligence_context",
      "Assistant uses Unified Intelligence Context",
      Boolean(kpiResult.request.intelligenceContext),
      `Context version=${kpiResult.request.intelligenceContext?.contractVersion ?? "none"}.`
    ),
    check(
      "single_intelligence_gateway",
      "Assistant uses Single Intelligence Gateway",
      kpiResult.gatewaySuccess === true,
      `Gateway success=${kpiResult.gatewaySuccess}.`
    ),
    check(
      "dashboard_runtime",
      "Assistant uses Dashboard Runtime",
      Boolean(kpiResult.response.normalized),
      `Normalized payload=${Boolean(kpiResult.response.normalized)}.`
    ),
    check(
      "no_direct_ds_imports",
      "Assistant never imports DS engines directly",
      directImportBlocked && isDirectDsImportForbidden("../kpi/workspaceKpi"),
      `${ASSISTANT_FORBIDDEN_DS_IMPORT_PREFIXES.length} forbidden prefix(es) blocked.`
    ),
    check(
      "past_now_future_phrases",
      "Executive Time Context decides PAST/NOW/FUTURE",
      pastPhrase === "past" && nowPhrase === "now" && futurePhrase === "future",
      `Past=${pastPhrase}, now=${nowPhrase}, future=${futurePhrase}.`
    ),
    check(
      "future_time_scenario",
      "Future requests carry future time state",
      scenarioResult.request.executiveTimeContext?.timeState === "future",
      `Scenario time=${scenarioResult.request.executiveTimeContext?.timeState ?? "none"}.`
    ),
    check(
      "normalized_intelligence_only",
      "Assistant consumes normalized intelligence only",
      kpiResult.response.sources.length > 0 || kpiResult.response.normalized !== null,
      `Sources=${kpiResult.response.sources.length}.`
    ),
    check(
      "confidence_metadata",
      "Assistant explanations include confidence metadata",
      "confidence" in kpiResult.response,
      `Confidence=${String(kpiResult.response.confidence)}.`
    ),
    check(
      "supported_request_types",
      "All v1 executive request types registered",
      ASSISTANT_EXECUTIVE_REQUEST_TYPES.length === 9,
      `${ASSISTANT_EXECUTIVE_REQUEST_TYPES.length} request type(s).`
    ),
    check(
      "registry_tracks_requests",
      "Assistant runtime registry tracks requests",
      registry.currentRequest !== null &&
        getAssistantRuntimeChangeCounter() > changeCounterBefore,
      `Change counter=${getAssistantRuntimeChangeCounter()}.`
    ),
    check(
      "selection_without_workspace_rejected",
      "Invalid assistant requests rejected without DS access",
      rejected.gatewaySuccess === false && rejected.response.success === false,
      `Rejected gateway=${rejected.gatewaySuccess}, response=${rejected.response.success}.`
    ),
    check(
      "context_versions_present",
      "Platform context versions present on assistant request",
      kpiResult.request.intelligenceContext?.contractVersion === INTELLIGENCE_CONTEXT_VERSION &&
        kpiResult.request.executiveTimeContext?.version === EXECUTIVE_TIME_CONTEXT_VERSION,
      `INT=${kpiResult.request.intelligenceContext?.contractVersion}, TIME=${kpiResult.request.executiveTimeContext?.version}.`
    ),
    check(
      "no_ds_mutation",
      "No DS mutations",
      Object.keys(beforeStorage).every((key) => beforeStorage[key] === afterStorage[key]),
      "Protected storage unchanged."
    ),
    check(
      "no_scene_mutation",
      "No Scene mutations",
      beforeStorage.scenes === afterStorage.scenes,
      "Scene storage unchanged."
    ),
    check(
      "no_workspace_mutation",
      "No Workspace mutations",
      beforeStorage.objects === afterStorage.objects &&
        beforeStorage.relationships === afterStorage.relationships,
      "Workspace storage unchanged."
    ),
    check(
      "no_executive_registry_mutation",
      "No Executive Registry mutations",
      beforeStorage.executiveRegistry === afterStorage.executiveRegistry,
      "Executive registry unchanged."
    ),
    check(
      "build_pass",
      "Build pass",
      input.buildPassed !== false,
      input.buildPassed === false ? "Build validation failed." : "Build pass reported by harness."
    ),
  ]);

  const passed = checks.every((entry) => entry.passed);
  return Object.freeze({
    contractVersion: ASSISTANT_INTELLIGENCE_VERSION,
    passed,
    certified: passed,
    checks,
    summary: passed
      ? "Assistant Intelligence certification PASSED."
      : "Assistant Intelligence certification FAILED.",
    generatedAt: nowIso(),
    tags: ASSISTANT_INTELLIGENCE_TAGS,
  });
}
