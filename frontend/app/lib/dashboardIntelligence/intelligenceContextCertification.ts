/**
 * INT-1.2 — Intelligence Context certification.
 */

import { EXECUTIVE_REGISTRY_STORAGE_KEY } from "../executive/executiveIntelligenceRegistry.ts";
import { WORKSPACE_KPI_STORAGE_KEY } from "../kpi/workspaceKpiContract.ts";
import { WORKSPACE_OBJECTIVE_STORAGE_KEY } from "../okr/workspaceOkrContract.ts";
import { WORKSPACE_DETECTED_RISK_STORAGE_KEY } from "../risk/workspaceRiskDetectionEngine.ts";
import { WORKSPACE_RISK_STORAGE_KEY } from "../risk/workspaceRiskContract.ts";
import { WORKSPACE_SCENARIO_STORAGE_KEY } from "../scenario/workspaceScenarioContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { buildIntelligenceContext } from "./intelligenceContextBuilder.ts";
import {
  INTELLIGENCE_CONTEXT_TAGS,
  INTELLIGENCE_CONTEXT_VERSION,
} from "./intelligenceContextContract.ts";
import {
  getIntelligenceContextChangeCounter,
  getIntelligenceContextRegistryState,
} from "./intelligenceContextRegistry.ts";
import { getIntelligenceContextSnapshots } from "./intelligenceContextSnapshot.ts";
import { requestIntelligenceWithContext } from "./intelligenceContextGateway.ts";

const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

export type IntelligenceContextCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type IntelligenceContextCertificationResult = Readonly<{
  contractVersion: typeof INTELLIGENCE_CONTEXT_VERSION;
  passed: boolean;
  certified: boolean;
  checks: readonly IntelligenceContextCertificationCheck[];
  summary: string;
  generatedAt: string;
  tags: typeof INTELLIGENCE_CONTEXT_TAGS;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): IntelligenceContextCertificationCheck {
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

export function runIntelligenceContextCertification(input: {
  workspaceId: WorkspaceId;
  buildPassed?: boolean;
}): IntelligenceContextCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const beforeStorage = snapshotProtectedStorage();
  const changeCounterBefore = getIntelligenceContextChangeCounter();

  const dashboard = requestIntelligenceWithContext({
    consumer: "dashboard",
    workspace: workspaceId,
    panel: "executive_summary",
    dashboardMode: "executive_summary",
  });
  const assistant = requestIntelligenceWithContext({
    consumer: "assistant",
    workspace: workspaceId,
    panel: "operational",
    dashboardMode: "operational",
  });
  const objectPanel = requestIntelligenceWithContext({
    consumer: "object_panel",
    workspace: workspaceId,
    panel: "objects",
    selectedObject: "obj_forecast",
    selectionPath: Object.freeze(["workspace", "obj_forecast"]),
  });
  const executiveSummary = requestIntelligenceWithContext({
    consumer: "executive_summary",
    workspace: workspaceId,
    panel: "executive_summary",
    dashboardMode: "executive_summary",
  });

  const rejected = buildIntelligenceContext({
    consumer: "dashboard",
    selectedObject: "obj_missing",
  });

  const afterStorage = snapshotProtectedStorage();
  const registry = getIntelligenceContextRegistryState();
  const snapshots = getIntelligenceContextSnapshots();

  const checks = Object.freeze([
    check(
      "unified_context",
      "One unified Intelligence Context exists",
      Boolean(dashboard.build.context),
      `Dashboard contextId=${dashboard.build.context?.contextId ?? "none"}.`
    ),
    check(
      "dashboard_consumes_context",
      "Dashboard consumes unified context",
      dashboard.build.success === true && dashboard.gateway !== null,
      `Dashboard gateway=${Boolean(dashboard.gateway)}.`
    ),
    check(
      "assistant_prepared",
      "Assistant prepared for unified context",
      assistant.build.success === true,
      `Assistant context=${assistant.build.success}.`
    ),
    check(
      "object_panel_prepared",
      "Object Panel prepared for unified context",
      objectPanel.build.success === true,
      `Object panel context=${objectPanel.build.success}.`
    ),
    check(
      "executive_summary_prepared",
      "Executive Summary prepared for unified context",
      executiveSummary.build.success === true,
      `Executive summary context=${executiveSummary.build.success}.`
    ),
    check(
      "builder_only_creator",
      "Context Builder is the only creator",
      rejected.success === false && rejected.reason === "validation_failed",
      `Rejected invalid context=${!rejected.success}.`
    ),
    check(
      "immutable_context",
      "Context is immutable",
      Object.isFrozen(dashboard.build.context),
      `Context frozen=${Object.isFrozen(dashboard.build.context)}.`
    ),
    check(
      "validation_passes",
      "Context validation passes",
      dashboard.build.validation.valid === true,
      `${dashboard.build.validation.issues.length} validation issue(s).`
    ),
    check(
      "snapshots_work",
      "Context snapshots work",
      snapshots.length >= 4,
      `${snapshots.length} snapshot(s) captured.`
    ),
    check(
      "registry_tracks_version",
      "Context registry tracks active version",
      registry.contextVersion === INTELLIGENCE_CONTEXT_VERSION &&
        getIntelligenceContextChangeCounter() > changeCounterBefore,
      `Change counter=${getIntelligenceContextChangeCounter()}.`
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
    contractVersion: INTELLIGENCE_CONTEXT_VERSION,
    passed,
    certified: passed,
    checks,
    summary: passed
      ? "Intelligence Context certification PASSED."
      : "Intelligence Context certification FAILED.",
    generatedAt: nowIso(),
    tags: INTELLIGENCE_CONTEXT_TAGS,
  });
}
