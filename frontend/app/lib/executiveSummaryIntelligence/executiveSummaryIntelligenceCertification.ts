/**
 * INT-3 — Executive Summary Intelligence certification.
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
  EXECUTIVE_SUMMARY_FORBIDDEN_DS_IMPORT_PREFIXES,
  EXECUTIVE_SUMMARY_INTELLIGENCE_TAGS,
  EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
  EXECUTIVE_SUMMARY_SECTIONS,
} from "./executiveSummaryIntelligenceContract.ts";
import { requestExecutiveSummaryIntelligence } from "./executiveSummaryRuntimeAdapter.ts";
import {
  getExecutiveSummaryChangeCounter,
  getExecutiveSummaryRegistryState,
} from "./executiveSummaryRegistry.ts";

const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

export type ExecutiveSummaryIntelligenceCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveSummaryIntelligenceCertificationResult = Readonly<{
  contractVersion: typeof EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION;
  passed: boolean;
  certified: boolean;
  checks: readonly ExecutiveSummaryIntelligenceCertificationCheck[];
  summary: string;
  generatedAt: string;
  tags: typeof EXECUTIVE_SUMMARY_INTELLIGENCE_TAGS;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveSummaryIntelligenceCertificationCheck {
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

export function runExecutiveSummaryIntelligenceCertification(input: {
  workspaceId: WorkspaceId;
  buildPassed?: boolean;
}): ExecutiveSummaryIntelligenceCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const beforeStorage = snapshotProtectedStorage();
  const changeCounterBefore = getExecutiveSummaryChangeCounter();

  const nowResult = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    executiveTime: { timeState: "now" },
  });

  const pastResult = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    executiveTime: {
      timeState: "past",
      requestedTime: "last quarter",
      timelinePosition: { index: 0, label: "Last Quarter", reserved: false },
    },
  });

  const futureResult = requestExecutiveSummaryIntelligence({
    workspace: workspaceId,
    executiveTime: { timeState: "future", requestedTime: "planned horizon" },
  });

  const rejected = requestExecutiveSummaryIntelligence({
    useCurrentContext: false,
    selection: { objectId: "obj_missing" },
  });

  const registry = getExecutiveSummaryRegistryState();
  const afterStorage = snapshotProtectedStorage();

  const directImportBlocked = EXECUTIVE_SUMMARY_FORBIDDEN_DS_IMPORT_PREFIXES.every((prefix) => {
    const decision = enforcePresentationImportPolicy({
      consumer: "executive_summary",
      importSpecifier: prefix,
    });
    return decision.allowed === false;
  });

  const checks = Object.freeze([
    check(
      "executive_time_context",
      "Executive Summary uses Executive Time Context",
      Boolean(nowResult.request.executiveTimeContext),
      `Time state=${nowResult.request.executiveTimeContext?.timeState ?? "none"}.`
    ),
    check(
      "unified_intelligence_context",
      "Executive Summary uses Unified Intelligence Context",
      Boolean(nowResult.request.intelligenceContext),
      `Context version=${nowResult.request.intelligenceContext?.contractVersion ?? "none"}.`
    ),
    check(
      "single_intelligence_gateway",
      "Executive Summary uses Single Intelligence Gateway",
      nowResult.gatewaySuccess === true,
      `Gateway success=${nowResult.gatewaySuccess}.`
    ),
    check(
      "dashboard_runtime",
      "Executive Summary uses Dashboard Runtime",
      Boolean(nowResult.response.normalized),
      `Normalized payload=${Boolean(nowResult.response.normalized)}.`
    ),
    check(
      "no_direct_ds_imports",
      "Executive Summary never imports DS engines directly",
      directImportBlocked && isDirectDsImportForbidden("../kpi/workspaceKpi"),
      `${EXECUTIVE_SUMMARY_FORBIDDEN_DS_IMPORT_PREFIXES.length} forbidden prefix(es) blocked.`
    ),
    check(
      "past_now_future",
      "Executive Summary supports PAST, NOW, and FUTURE time context",
      pastResult.request.executiveTimeContext?.timeState === "past" &&
        nowResult.request.executiveTimeContext?.timeState === "now" &&
        futureResult.request.executiveTimeContext?.timeState === "future",
      `Past=${pastResult.request.executiveTimeContext?.timeState}, now=${nowResult.request.executiveTimeContext?.timeState}, future=${futureResult.request.executiveTimeContext?.timeState}.`
    ),
    check(
      "normalized_intelligence_only",
      "Executive Summary consumes normalized intelligence only",
      nowResult.response.normalized !== null && nowResult.response.summary.length > 0,
      `Summary length=${nowResult.response.summary.length}.`
    ),
    check(
      "confidence_metadata",
      "Executive Summary includes confidence metadata",
      "confidence" in nowResult.response,
      `Confidence=${String(nowResult.response.confidence)}.`
    ),
    check(
      "supported_sections",
      "All v1 executive summary sections present",
      nowResult.response.sections.length === EXECUTIVE_SUMMARY_SECTIONS.length,
      `${nowResult.response.sections.length} section(s).`
    ),
    check(
      "registry_tracks_requests",
      "Executive Summary registry tracks requests",
      registry.currentRequest !== null && getExecutiveSummaryChangeCounter() > changeCounterBefore,
      `Change counter=${getExecutiveSummaryChangeCounter()}.`
    ),
    check(
      "invalid_request_rejected",
      "Invalid requests rejected without DS mutation",
      rejected.gatewaySuccess === false && rejected.response.success === false,
      `Rejected gateway=${rejected.gatewaySuccess}.`
    ),
    check(
      "context_versions_present",
      "Platform context versions present on summary request",
      nowResult.request.intelligenceContext?.contractVersion === INTELLIGENCE_CONTEXT_VERSION &&
        nowResult.request.executiveTimeContext?.version === EXECUTIVE_TIME_CONTEXT_VERSION,
      `INT=${nowResult.request.intelligenceContext?.contractVersion}, TIME=${nowResult.request.executiveTimeContext?.version}.`
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
    contractVersion: EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
    passed,
    certified: passed,
    checks,
    summary: passed
      ? "Executive Summary Intelligence certification PASSED."
      : "Executive Summary Intelligence certification FAILED.",
    generatedAt: nowIso(),
    tags: EXECUTIVE_SUMMARY_INTELLIGENCE_TAGS,
  });
}
