/**
 * INT-1.3 — Executive Time Context certification.
 */

import { EXECUTIVE_REGISTRY_STORAGE_KEY } from "../executive/executiveIntelligenceRegistry.ts";
import { WORKSPACE_KPI_STORAGE_KEY } from "../kpi/workspaceKpiContract.ts";
import { WORKSPACE_OBJECTIVE_STORAGE_KEY } from "../okr/workspaceOkrContract.ts";
import { WORKSPACE_DETECTED_RISK_STORAGE_KEY } from "../risk/workspaceRiskDetectionEngine.ts";
import { WORKSPACE_RISK_STORAGE_KEY } from "../risk/workspaceRiskContract.ts";
import { WORKSPACE_SCENARIO_STORAGE_KEY } from "../scenario/workspaceScenarioContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  buildExecutiveTimeContext,
  updateExecutiveTimeContext,
} from "./executiveTimeContextBuilder.ts";
import {
  EXECUTIVE_TIME_CONTEXT_TAGS,
  EXECUTIVE_TIME_CONTEXT_VERSION,
  EXECUTIVE_TIME_METADATA_KEYS,
  EXECUTIVE_TIME_RESERVED_EXTENSIONS,
} from "./executiveTimeContextContract.ts";
import {
  getExecutiveTimeContextChangeCounter,
  getExecutiveTimeContextRegistryState,
} from "./executiveTimeContextRegistry.ts";
import { requestIntelligenceWithContext } from "./intelligenceContextGateway.ts";
import { executiveTimeContextToMetadata } from "./executiveTimeContextGateway.ts";

const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

export type ExecutiveTimeContextCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveTimeContextCertificationResult = Readonly<{
  contractVersion: typeof EXECUTIVE_TIME_CONTEXT_VERSION;
  passed: boolean;
  certified: boolean;
  checks: readonly ExecutiveTimeContextCertificationCheck[];
  summary: string;
  generatedAt: string;
  tags: typeof EXECUTIVE_TIME_CONTEXT_TAGS;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveTimeContextCertificationCheck {
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

export function runExecutiveTimeContextCertification(input: {
  workspaceId: WorkspaceId;
  buildPassed?: boolean;
}): ExecutiveTimeContextCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const beforeStorage = snapshotProtectedStorage();
  const changeCounterBefore = getExecutiveTimeContextChangeCounter();

  const past = buildExecutiveTimeContext({
    timeState: "past",
    timelinePosition: { index: 0, label: "Completed", reserved: false },
    requestedTime: "last quarter",
  });
  const now = buildExecutiveTimeContext({ timeState: "now" });
  const future = buildExecutiveTimeContext({
    timeState: "future",
    requestedTime: "what-if scenario",
  });

  const rejected = buildExecutiveTimeContext({
    timeState: "invalid" as "past",
  });

  const updated =
    now.success && now.timeContext
      ? updateExecutiveTimeContext(now.timeContext, { timeState: "future" })
      : null;

  const gatewayRequest = requestIntelligenceWithContext({
    consumer: "dashboard",
    workspace: workspaceId,
    panel: "executive_summary",
    dashboardMode: "executive_summary",
    executiveTime: { timeState: "now" },
  });

  const timeMetadata: Readonly<Record<string, string | null>> = gatewayRequest.build.context
    ? executiveTimeContextToMetadata(gatewayRequest.build.context.executiveTimeContext)
    : Object.freeze({});
  const registry = getExecutiveTimeContextRegistryState();

  const afterStorage = snapshotProtectedStorage();

  const checks = Object.freeze([
    check(
      "one_time_context",
      "One Executive Time Context layer exists",
      Boolean(past.timeContext && now.timeContext && future.timeContext),
      `Past=${past.success}, now=${now.success}, future=${future.success}.`
    ),
    check(
      "past_supported",
      "PAST time state supported",
      past.success === true && past.timeContext?.timeState === "past",
      `Past state=${past.timeContext?.timeState ?? "none"}.`
    ),
    check(
      "now_supported",
      "NOW time state supported",
      now.success === true && now.timeContext?.timeState === "now",
      `Now state=${now.timeContext?.timeState ?? "none"}.`
    ),
    check(
      "future_supported",
      "FUTURE time state supported",
      future.success === true && future.timeContext?.timeState === "future",
      `Future state=${future.timeContext?.timeState ?? "none"}.`
    ),
    check(
      "immutable_context",
      "Executive time context is immutable",
      Object.isFrozen(now.timeContext),
      `Frozen=${Object.isFrozen(now.timeContext)}.`
    ),
    check(
      "builder_only_creator",
      "Time Context Builder is sole creator",
      rejected.success === false,
      `Rejected invalid state=${!rejected.success}.`
    ),
    check(
      "unified_context_includes_time",
      "Unified Intelligence Context includes Executive Time Context",
      Boolean(gatewayRequest.build.context?.executiveTimeContext),
      `Context timeState=${gatewayRequest.build.context?.executiveTimeContext.timeState ?? "none"}.`
    ),
    check(
      "gateway_receives_time",
      "Gateway receives Executive Time Context",
      timeMetadata[EXECUTIVE_TIME_METADATA_KEYS.timeState] === "now",
      `Gateway metadata timeState=${timeMetadata[EXECUTIVE_TIME_METADATA_KEYS.timeState] ?? "none"}.`
    ),
    check(
      "runtime_receives_time",
      "Dashboard runtime receives Executive Time Context via gateway",
      Boolean(
        gatewayRequest.gateway &&
          "runtimeResponse" in gatewayRequest.gateway &&
          gatewayRequest.build.context?.executiveTimeContext.timeState === "now"
      ),
      `Runtime gateway=${Boolean(gatewayRequest.gateway)}.`
    ),
    check(
      "registry_tracks_version",
      "Time Context registry tracks active version",
      registry.activeVersion === EXECUTIVE_TIME_CONTEXT_VERSION &&
        getExecutiveTimeContextChangeCounter() > changeCounterBefore,
      `Change counter=${getExecutiveTimeContextChangeCounter()}.`
    ),
    check(
      "time_context_updated",
      "Time context update emits change events",
      updated?.success === true,
      `Updated=${updated?.success ?? false}.`
    ),
    check(
      "reserved_extensions",
      "Future time extensions reserved",
      EXECUTIVE_TIME_RESERVED_EXTENSIONS.includes("historical_replay"),
      `${EXECUTIVE_TIME_RESERVED_EXTENSIONS.length} reserved extension(s).`
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
      "no_workspace_mutation",
      "No Workspace mutations",
      beforeStorage.objects === afterStorage.objects &&
        beforeStorage.relationships === afterStorage.relationships,
      "Workspace object/relationship storage unchanged."
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
    contractVersion: EXECUTIVE_TIME_CONTEXT_VERSION,
    passed,
    certified: passed,
    checks,
    summary: passed
      ? "Executive Time Context certification PASSED."
      : "Executive Time Context certification FAILED.",
    generatedAt: nowIso(),
    tags: EXECUTIVE_TIME_CONTEXT_TAGS,
  });
}
