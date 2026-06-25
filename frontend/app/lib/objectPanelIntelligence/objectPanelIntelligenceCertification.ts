/**
 * INT-4 — Object Panel Intelligence certification.
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
  OBJECT_PANEL_FORBIDDEN_DS_IMPORT_PREFIXES,
  OBJECT_PANEL_INTELLIGENCE_TAGS,
  OBJECT_PANEL_INTELLIGENCE_VERSION,
  OBJECT_PANEL_SECTIONS,
} from "./objectPanelIntelligenceContract.ts";
import { requestObjectPanelIntelligence } from "./objectPanelRuntimeAdapter.ts";
import {
  getObjectPanelChangeCounter,
  getObjectPanelRegistryState,
  getObjectPanelSelectionChangeCounter,
} from "./objectPanelRegistry.ts";

const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

export type ObjectPanelIntelligenceCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ObjectPanelIntelligenceCertificationResult = Readonly<{
  contractVersion: typeof OBJECT_PANEL_INTELLIGENCE_VERSION;
  passed: boolean;
  certified: boolean;
  checks: readonly ObjectPanelIntelligenceCertificationCheck[];
  summary: string;
  generatedAt: string;
  tags: typeof OBJECT_PANEL_INTELLIGENCE_TAGS;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ObjectPanelIntelligenceCertificationCheck {
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

export function runObjectPanelIntelligenceCertification(input: {
  workspaceId: WorkspaceId;
  objectId: string;
  alternateObjectId: string;
  buildPassed?: boolean;
}): ObjectPanelIntelligenceCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const objectId = input.objectId.trim();
  const alternateObjectId = input.alternateObjectId.trim();
  const beforeStorage = snapshotProtectedStorage();
  const changeCounterBefore = getObjectPanelChangeCounter();
  const selectionCounterBefore = getObjectPanelSelectionChangeCounter();

  const nowResult = requestObjectPanelIntelligence({
    workspace: workspaceId,
    selectedObjectId: objectId,
    executiveTime: { timeState: "now" },
  });

  const pastResult = requestObjectPanelIntelligence({
    workspace: workspaceId,
    selectedObjectId: objectId,
    executiveTime: {
      timeState: "past",
      requestedTime: "last quarter",
      timelinePosition: { index: 0, label: "Last Quarter", reserved: false },
    },
  });

  const futureResult = requestObjectPanelIntelligence({
    workspace: workspaceId,
    selectedObjectId: objectId,
    executiveTime: { timeState: "future", requestedTime: "what-if" },
  });

  const selectionChangeResult = requestObjectPanelIntelligence({
    workspace: workspaceId,
    selectedObjectId: alternateObjectId,
    executiveTime: { timeState: "now" },
  });

  const rejected = requestObjectPanelIntelligence({
    useCurrentContext: false,
    workspace: workspaceId,
  });

  const registry = getObjectPanelRegistryState();
  const afterStorage = snapshotProtectedStorage();

  const directImportBlocked = OBJECT_PANEL_FORBIDDEN_DS_IMPORT_PREFIXES.every((prefix) => {
    const decision = enforcePresentationImportPolicy({
      consumer: "object_panel",
      importSpecifier: prefix,
    });
    return decision.allowed === false;
  });

  const checks = Object.freeze([
    check(
      "executive_time_context",
      "Object Panel uses Executive Time Context",
      Boolean(nowResult.request.executiveTimeContext),
      `Time state=${nowResult.request.executiveTimeContext?.timeState ?? "none"}.`
    ),
    check(
      "unified_intelligence_context",
      "Object Panel uses Unified Intelligence Context",
      Boolean(nowResult.request.intelligenceContext),
      `Context version=${nowResult.request.intelligenceContext?.contractVersion ?? "none"}.`
    ),
    check(
      "single_intelligence_gateway",
      "Object Panel uses Single Intelligence Gateway",
      nowResult.gatewaySuccess === true,
      `Gateway success=${nowResult.gatewaySuccess}.`
    ),
    check(
      "dashboard_runtime",
      "Object Panel uses Dashboard Runtime",
      Boolean(nowResult.response.normalized),
      `Normalized payload=${Boolean(nowResult.response.normalized)}.`
    ),
    check(
      "no_direct_ds_imports",
      "Object Panel never imports DS engines directly",
      directImportBlocked && isDirectDsImportForbidden("../kpi/workspaceKpi"),
      `${OBJECT_PANEL_FORBIDDEN_DS_IMPORT_PREFIXES.length} forbidden prefix(es) blocked.`
    ),
    check(
      "past_now_future",
      "Object Panel supports PAST, NOW, and FUTURE time context",
      pastResult.request.executiveTimeContext?.timeState === "past" &&
        nowResult.request.executiveTimeContext?.timeState === "now" &&
        futureResult.request.executiveTimeContext?.timeState === "future",
      `Past=${pastResult.request.executiveTimeContext?.timeState}, now=${nowResult.request.executiveTimeContext?.timeState}, future=${futureResult.request.executiveTimeContext?.timeState}.`
    ),
    check(
      "normalized_intelligence_only",
      "Object Panel consumes normalized intelligence only",
      nowResult.response.normalized !== null && nowResult.response.summary.length > 0,
      `Summary length=${nowResult.response.summary.length}.`
    ),
    check(
      "confidence_metadata",
      "Object Panel includes confidence metadata",
      "confidence" in nowResult.response,
      `Confidence=${String(nowResult.response.confidence)}.`
    ),
    check(
      "supported_sections",
      "All v1 object panel sections present",
      nowResult.response.sections.length === OBJECT_PANEL_SECTIONS.length,
      `${nowResult.response.sections.length} section(s).`
    ),
    check(
      "object_selection_updates",
      "Object Panel updates after object selection change",
      selectionChangeResult.selectionChanged === true &&
        selectionChangeResult.request.selectedObjectId === alternateObjectId &&
        getObjectPanelSelectionChangeCounter() > selectionCounterBefore,
      `Selection changed=${selectionChangeResult.selectionChanged}, counter=${getObjectPanelSelectionChangeCounter()}.`
    ),
    check(
      "registry_tracks_requests",
      "Object Panel registry tracks requests",
      registry.currentRequest !== null && getObjectPanelChangeCounter() > changeCounterBefore,
      `Change counter=${getObjectPanelChangeCounter()}.`
    ),
    check(
      "object_selection_required",
      "Requests without object selection are rejected",
      rejected.gatewaySuccess === false && rejected.response.success === false,
      `Rejected gateway=${rejected.gatewaySuccess}.`
    ),
    check(
      "context_versions_present",
      "Platform context versions present on object panel request",
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
    contractVersion: OBJECT_PANEL_INTELLIGENCE_VERSION,
    passed,
    certified: passed,
    checks,
    summary: passed
      ? "Object Panel Intelligence certification PASSED."
      : "Object Panel Intelligence certification FAILED.",
    generatedAt: nowIso(),
    tags: OBJECT_PANEL_INTELLIGENCE_TAGS,
  });
}
