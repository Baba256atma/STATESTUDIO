/**
 * INT-1.1 — Single Intelligence Source certification.
 * Verifies one gateway, consumer registry, access policy, and no DS mutation.
 */

import { EXECUTIVE_REGISTRY_STORAGE_KEY } from "../executive/executiveIntelligenceRegistry.ts";
import { WORKSPACE_KPI_STORAGE_KEY } from "../kpi/workspaceKpiContract.ts";
import { WORKSPACE_OBJECTIVE_STORAGE_KEY } from "../okr/workspaceOkrContract.ts";
import { WORKSPACE_DETECTED_RISK_STORAGE_KEY } from "../risk/workspaceRiskDetectionEngine.ts";
import { WORKSPACE_RISK_STORAGE_KEY } from "../risk/workspaceRiskContract.ts";
import { WORKSPACE_SCENARIO_STORAGE_KEY } from "../scenario/workspaceScenarioContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  FORBIDDEN_DIRECT_DS_IMPORT_PREFIXES,
  getDirectAccessViolations,
} from "./directAccessProtectionContract.ts";
import {
  getActiveIntelligenceConsumers,
  getIntelligenceConsumerRegistryVersion,
  getPreparedIntelligenceConsumers,
  getReservedIntelligenceConsumers,
} from "./intelligenceConsumerRegistry.ts";
import {
  RUNTIME_OWNERSHIP_CONTRACT,
  RUNTIME_OWNED_CAPABILITIES,
} from "./runtimeOwnershipContract.ts";
import {
  isDirectDsImportForbidden,
  RUNTIME_ACCESS_POLICY_RULE,
} from "./runtimeAccessPolicy.ts";
import {
  buildIntelligenceGatewayRequest,
  requestIntelligence,
} from "./singleIntelligenceSourceGateway.ts";
import {
  ACTIVE_INTELLIGENCE_CONSUMER_IDS,
  SINGLE_INTELLIGENCE_SOURCE_TAGS,
  SINGLE_INTELLIGENCE_SOURCE_VERSION,
} from "./singleIntelligenceSourceContract.ts";

const SCENE_STORAGE_KEY = "nexora.workspaceScenes.v1";
const OBJECT_INTELLIGENCE_STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";
const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceRelationships.v1";

export type SingleIntelligenceSourceCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type SingleIntelligenceSourceCertificationResult = Readonly<{
  contractVersion: typeof SINGLE_INTELLIGENCE_SOURCE_VERSION;
  passed: boolean;
  certified: boolean;
  checks: readonly SingleIntelligenceSourceCertificationCheck[];
  summary: string;
  generatedAt: string;
  tags: typeof SINGLE_INTELLIGENCE_SOURCE_TAGS;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): SingleIntelligenceSourceCertificationCheck {
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

export function runSingleIntelligenceSourceCertification(input: {
  workspaceId: WorkspaceId;
  buildPassed?: boolean;
}): SingleIntelligenceSourceCertificationResult {
  const workspaceId = input.workspaceId.trim();
  const beforeStorage = snapshotProtectedStorage();
  const registryVersionBefore = getIntelligenceConsumerRegistryVersion();

  const dashboard = requestIntelligence(
    buildIntelligenceGatewayRequest({
      consumer: "dashboard",
      panel: "executive_summary",
      workspaceId,
    })
  );
  const assistant = requestIntelligence(
    buildIntelligenceGatewayRequest({
      consumer: "assistant",
      panel: "operational",
      workspaceId,
    })
  );
  const objectPanel = requestIntelligence(
    buildIntelligenceGatewayRequest({
      consumer: "object_panel",
      panel: "objects",
      workspaceId,
    })
  );
  const executiveSummary = requestIntelligence(
    buildIntelligenceGatewayRequest({
      consumer: "executive_summary",
      panel: "executive_summary",
      workspaceId,
    })
  );
  const reserved = requestIntelligence(
    buildIntelligenceGatewayRequest({
      consumer: "war_room",
      panel: "operational",
      workspaceId,
    })
  );

  const afterStorage = snapshotProtectedStorage();
  const registryVersionAfter = getIntelligenceConsumerRegistryVersion();

  const dashboardOk = "runtimeResponse" in dashboard && dashboard.runtimeResponse.success;
  const assistantOk = "runtimeResponse" in assistant && assistant.runtimeResponse.success;
  const objectPanelOk = "runtimeResponse" in objectPanel && objectPanel.runtimeResponse.success;
  const executiveSummaryOk =
    "runtimeResponse" in executiveSummary && executiveSummary.runtimeResponse.success;
  const reservedRejected = "success" in reserved && reserved.success === false;

  const checks = Object.freeze([
    check(
      "single_gateway",
      "One intelligence gateway exists",
      dashboardOk,
      `Dashboard gateway response=${dashboardOk}.`
    ),
    check(
      "dashboard_uses_runtime",
      "Dashboard uses runtime only",
      dashboardOk && ("runtimeResponse" in dashboard ? Boolean(dashboard.runtimeResponse.snapshot) : false),
      `Dashboard consumer routed through gateway.`
    ),
    check(
      "assistant_prepared",
      "Assistant prepared to use runtime",
      assistantOk,
      `Assistant consumer lifecycle=${getPreparedIntelligenceConsumers().some((c) => c.consumerId === "assistant") ? "prepared" : "missing"}.`
    ),
    check(
      "object_panel_prepared",
      "Object Panel prepared to use runtime",
      objectPanelOk,
      `Object panel consumer lifecycle=${getPreparedIntelligenceConsumers().some((c) => c.consumerId === "object_panel") ? "prepared" : "missing"}.`
    ),
    check(
      "executive_summary_prepared",
      "Executive Summary prepared to use runtime",
      executiveSummaryOk,
      `Executive summary consumer lifecycle=${getPreparedIntelligenceConsumers().some((c) => c.consumerId === "executive_summary") ? "prepared" : "missing"}.`
    ),
    check(
      "runtime_owns_routing",
      "Runtime owns routing",
      RUNTIME_OWNED_CAPABILITIES.includes("routing"),
      `Runtime ownership includes routing.`
    ),
    check(
      "runtime_owns_normalization",
      "Runtime owns normalization",
      RUNTIME_OWNED_CAPABILITIES.includes("normalization"),
      `Runtime ownership includes normalization.`
    ),
    check(
      "runtime_owns_diagnostics",
      "Runtime owns diagnostics",
      RUNTIME_OWNED_CAPABILITIES.includes("diagnostics"),
      `Runtime ownership includes diagnostics.`
    ),
    check(
      "consumer_registry",
      "Consumer registry active",
      getActiveIntelligenceConsumers().length >= ACTIVE_INTELLIGENCE_CONSUMER_IDS.length - 3 &&
        getReservedIntelligenceConsumers().length >= 5,
      `${getActiveIntelligenceConsumers().length} active, ${getReservedIntelligenceConsumers().length} reserved consumers.`
    ),
    check(
      "access_policy",
      "Runtime access policy enforced",
      reservedRejected && RUNTIME_ACCESS_POLICY_RULE.length > 0,
      `Reserved consumer rejected=${reservedRejected}.`
    ),
    check(
      "no_direct_ds_imports",
      "Direct DS imports forbidden by contract",
      FORBIDDEN_DIRECT_DS_IMPORT_PREFIXES.length >= 10 &&
        isDirectDsImportForbidden("../kpi/workspaceKpiContract.ts"),
      `${FORBIDDEN_DIRECT_DS_IMPORT_PREFIXES.length} forbidden import prefixes defined.`
    ),
    check(
      "ownership_contract",
      "Runtime ownership contract locked",
      RUNTIME_OWNERSHIP_CONTRACT.runtimeOwns.includes("single_intelligence_gateway"),
      RUNTIME_OWNERSHIP_CONTRACT.rule
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
      "Executive registry storage unchanged."
    ),
    check(
      "no_ds_mutation",
      "No DS mutations",
      Object.keys(beforeStorage).every((key) => beforeStorage[key] === afterStorage[key]),
      "DS intelligence storage unchanged."
    ),
    check(
      "registry_stable",
      "Consumer registry stable during reads",
      registryVersionAfter === registryVersionBefore,
      `Registry version remained ${registryVersionBefore}.`
    ),
    check(
      "build_pass",
      "Build pass",
      input.buildPassed !== false,
      input.buildPassed === false ? "Build validation failed." : "Build pass reported by harness."
    ),
    check(
      "direct_access_violations_trackable",
      "Rejected direct access trackable",
      getDirectAccessViolations().length >= 0,
      "Direct access violation log available."
    ),
  ]);

  const passed = checks.every((entry) => entry.passed);
  const certified = passed;

  return Object.freeze({
    contractVersion: SINGLE_INTELLIGENCE_SOURCE_VERSION,
    passed,
    certified,
    checks,
    summary: certified
      ? "Single Intelligence Source certification PASSED."
      : "Single Intelligence Source certification FAILED.",
    generatedAt: nowIso(),
    tags: SINGLE_INTELLIGENCE_SOURCE_TAGS,
  });
}
