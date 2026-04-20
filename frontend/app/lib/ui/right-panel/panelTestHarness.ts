import { buildPanelResolvedData } from "../../panels/buildPanelResolvedData";
import { buildPanelFallbackState } from "../../panels/buildPanelFallbackState";
import type { PanelResolvedData, PanelSharedData } from "../../panels/panelDataResolverTypes";
import {
  CANONICAL_RIGHT_PANEL_VIEWS,
  type CanonicalRightPanelView,
  type RightPanelView,
} from "./rightPanelTypes";
import { isRightPanelActionIntent, type RightPanelActionIntent } from "./panelActionRouter";
import {
  isCanonicalRightPanelView,
  mapLegacyTabToRightPanelView,
  resolveRightPanelLegacyTabForView,
  resolveSafeRightPanelView,
} from "./rightPanelRouter";
import { resolveRightPanelAction as resolvePanelActionIntent } from "./panelActionRouter";

type HarnessTestState = "FULL_DATA" | "PARTIAL_DATA" | "EMPTY_DATA" | "INVALID_DATA";

type HarnessSnapshotRecord = {
  testState: HarnessTestState;
  view: string;
  resolvedView: CanonicalRightPanelView;
  resolverStatus: PanelResolvedData["status"] | "invalid";
  usedFallback: boolean;
  renderValid: boolean;
};

type HarnessRunResult = {
  passed: boolean;
  records: HarnessSnapshotRecord[];
};

/**
 * Test harness fixtures intentionally exercise partial and invalid panel payloads.
 * Keep the cast isolated here so the rest of the harness stays strongly typed.
 */
function asPanelSharedDataFixture(value: unknown): PanelSharedData {
  return value as PanelSharedData;
}

type HarnessWindow = Window & {
  __NEXORA_PANEL_TEST_SNAPSHOT__?: HarnessSnapshotRecord[];
};

const VALID_STATUSES = new Set<PanelResolvedData["status"]>([
  "ready",
  "partial",
  "fallback",
  "empty_but_guided",
]);

const RENDER_MANAGED_VIEWS = new Set<CanonicalRightPanelView>(CANONICAL_RIGHT_PANEL_VIEWS);

const SAFE_VIEW_CASES: Array<{
  input: unknown;
  expectedView: CanonicalRightPanelView | null;
  contractFamily: "canonical_safe_view";
}> = [
  { input: "advice", expectedView: "advice", contractFamily: "canonical_safe_view" },
  { input: "timeline", expectedView: "timeline", contractFamily: "canonical_safe_view" },
  { input: "war_room", expectedView: "war_room", contractFamily: "canonical_safe_view" },
  { input: "simulate", expectedView: "simulate", contractFamily: "canonical_safe_view" },
  { input: "compare", expectedView: "compare", contractFamily: "canonical_safe_view" },
  { input: "workspace", expectedView: "workspace", contractFamily: "canonical_safe_view" },
  { input: "bogus_view", expectedView: null, contractFamily: "canonical_safe_view" },
  { input: null, expectedView: null, contractFamily: "canonical_safe_view" },
  { input: undefined, expectedView: null, contractFamily: "canonical_safe_view" },
];

const LEGACY_MAPPING_CASES: Array<{
  input: string;
  expectedViews: CanonicalRightPanelView[];
  contractFamily: "legacy_tab_mapping";
}> = [
  { input: "object_focus", expectedViews: ["object"], contractFamily: "legacy_tab_mapping" },
  { input: "strategic_advice", expectedViews: ["advice"], contractFamily: "legacy_tab_mapping" },
  { input: "executive_dashboard", expectedViews: ["dashboard"], contractFamily: "legacy_tab_mapping" },
  { input: "risk_flow", expectedViews: ["risk"], contractFamily: "legacy_tab_mapping" },
  { input: "explanation", expectedViews: ["explanation"], contractFamily: "legacy_tab_mapping" },
  { input: "memory_insights", expectedViews: ["memory"], contractFamily: "legacy_tab_mapping" },
];

const ACTION_MAPPING_CASES: Array<{
  action: RightPanelActionIntent;
  expectedViews: CanonicalRightPanelView[];
  contractFamily: "action_mapping";
}> = [
  { action: "run_simulation", expectedViews: ["simulate"], contractFamily: "action_mapping" },
  { action: "compare_options", expectedViews: ["compare"], contractFamily: "action_mapping" },
  { action: "open_war_room", expectedViews: ["war_room"], contractFamily: "action_mapping" },
  { action: "open_risk_flow", expectedViews: ["risk"], contractFamily: "action_mapping" },
  { action: "why_this", expectedViews: ["advice"], contractFamily: "action_mapping" },
];

const PROTECTED_VIEW_CASES: Array<{
  view: CanonicalRightPanelView;
  contractFamily: "protected_view";
}> = [
  { view: "timeline", contractFamily: "protected_view" },
  { view: "advice", contractFamily: "protected_view" },
  { view: "war_room", contractFamily: "protected_view" },
  { view: "simulate", contractFamily: "protected_view" },
  { view: "compare", contractFamily: "protected_view" },
];

const DASHBOARD_DRIFT_GUARD_CASES: Array<{
  view: RightPanelView;
  contractFamily: "dashboard_drift_guard";
}> = [
  { view: "timeline", contractFamily: "dashboard_drift_guard" },
  { view: "advice", contractFamily: "dashboard_drift_guard" },
  { view: "war_room", contractFamily: "dashboard_drift_guard" },
  { view: "object", contractFamily: "dashboard_drift_guard" },
  { view: "risk", contractFamily: "dashboard_drift_guard" },
];

const LEGACY_TAB_RESOLUTION_CASES: Array<{
  view: RightPanelView;
  preferredLegacyTab: string | null;
  expectedTab: string | null;
  contractFamily: "legacy_tab_resolution";
}> = [
  { view: "object", preferredLegacyTab: null, expectedTab: "object", contractFamily: "legacy_tab_resolution" },
  {
    view: "object",
    preferredLegacyTab: "object_focus",
    expectedTab: "object_focus",
    contractFamily: "legacy_tab_resolution",
  },
  { view: "risk", preferredLegacyTab: null, expectedTab: "risk", contractFamily: "legacy_tab_resolution" },
  {
    view: "risk",
    preferredLegacyTab: "risk_flow",
    expectedTab: "risk_flow",
    contractFamily: "legacy_tab_resolution",
  },
];

const TEST_STATE_DATA: Record<HarnessTestState, PanelSharedData> = {
  FULL_DATA: asPanelSharedDataFixture({
    strategicAdvice: {
      summary: "Protect core throughput immediately.",
      why: "Supplier latency is propagating into service instability.",
      recommendation: "Activate backup supply.",
      risk_summary: "Delivery pressure is rising.",
      recommendations: ["Activate backup supply."],
      related_object_ids: ["obj_supply", "obj_delivery"],
      supporting_driver_labels: ["supplier latency"],
      primary_recommendation: {
        action: "Activate backup supply",
        impact_summary: "Stabilizes delivery.",
        tradeoff: null,
      },
      recommended_actions: [
        {
          action: "Activate backup supply",
          impact_summary: "Stabilizes delivery.",
          tradeoff: null,
        },
      ],
      confidence: null,
    },
    promptFeedback: {
      advice_feedback: { summary: "Fallback advice summary" },
      timeline_feedback: { summary: "Decision moved from detection to mitigation." },
    },
    decisionCockpit: {
      summary: "Executive cockpit is active.",
      happened: null,
      why_it_matters: null,
      what_to_do: null,
    },
    executiveSummary: {
      summary: "Executive summary available.",
      happened: null,
      why_it_matters: null,
      what_to_do: "Contain the disruption.",
    },
    simulation: {
      summary: "Simulation available.",
      impacted_nodes: ["obj_supply", "obj_delivery"],
      propagation: [],
      risk_delta: null,
    },
    timeline: {
      headline: "Timeline available.",
      summary: "Timeline available.",
      related_object_ids: ["obj_supply", "obj_delivery"],
      events: [
        {
          id: "before",
          label: "Detection",
          type: "state",
          order: 1,
          related_object_ids: ["obj_supply"],
        },
        {
          id: "after",
          label: "Mitigation",
          type: "state",
          order: 2,
          related_object_ids: ["obj_delivery"],
        },
      ],
      timeline: [],
      steps: [],
      stages: [],
    },
    risk: {
      summary: "Risk links available.",
      level: "medium",
      risk_level: "medium",
      drivers: [],
      sources: ["obj_supply"],
      edges: [],
    },
    canonicalRecommendation: { id: "rec_full" },
    decisionResult: { id: "result_full" },
    warRoom: {
      headline: "War room context available.",
      posture: "contain",
      priorities: ["protect delivery"],
      risks: ["supplier latency"],
      related_object_ids: ["obj_supply", "obj_delivery"],
      summary: "War room context available.",
      recommendation: "Activate backup supply.",
      simulation_summary: null,
      compare_summary: null,
      executive_summary: null,
      advice_summary: null,
    },
    compare: {
      summary: "Compare context available.",
      options: [],
      recommendation: null,
    },
    governance: {
      summary: "Governance context available.",
      happened: null,
      why_it_matters: null,
      what_to_do: null,
    },
    approval: { summary: "Approval context available.", status: "pending" },
    policy: { summary: "Policy context available.", status: "active" },
    strategicCouncil: {
      summary: "Council context available.",
      recommendation: null,
    },
    memoryEntries: [{ id: "memory_1" }],
  }),
  PARTIAL_DATA: asPanelSharedDataFixture({
    strategicAdvice: {
      summary: "A recommendation is forming.",
      title: null,
      why: null,
      recommendation: null,
      risk_summary: null,
      recommendations: [],
      related_object_ids: [],
      supporting_driver_labels: [],
      recommended_actions: [],
      primary_recommendation: null,
      confidence: null,
    },
    executiveSummary: {
      summary: null,
      happened: null,
      why_it_matters: null,
      what_to_do: "Review the current recommendation.",
    },
    timeline: {
      headline: null,
      summary: "Only a high-level timeline summary exists.",
      related_object_ids: [],
      events: [],
      timeline: [],
      steps: [],
      stages: [],
    },
  }),
  EMPTY_DATA: asPanelSharedDataFixture({}),
  INVALID_DATA: asPanelSharedDataFixture({
    strategicAdvice: "invalid",
    timeline: 42,
    decisionCockpit: "invalid",
    risk: false,
    memoryEntries: [],
  }),
};

function statusRank(status: HarnessSnapshotRecord["resolverStatus"]) {
  if (status === "ready") return 4;
  if (status === "partial") return 3;
  if (status === "fallback") return 2;
  if (status === "empty_but_guided") return 1;
  return 0;
}

function logDev(tag: string, payload: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console[tag === "warn" ? "warn" : "error"](payload.message, payload);
  }
}

function resolveHarnessSafeView(input: unknown): RightPanelView {
  if (typeof input === "string" && isCanonicalRightPanelView(input)) {
    return resolveSafeRightPanelView(input);
  }
  return null;
}

function validateRouterOutput(
  input: unknown,
  resolvedView: RightPanelView,
  expectedViewType: string
) {
  if (resolvedView === null) {
    logDev("error", {
      message: "[Nexora][TestHarness][RouterFail]",
      input,
      resolvedView,
      expectedViewType,
      reason: "Expected a canonical panel view but received null.",
    });
    return false;
  }
  if (!isCanonicalRightPanelView(resolvedView)) {
    logDev("error", {
      message: "[Nexora][TestHarness][RouterFail]",
      input,
      resolvedView,
      expectedViewType,
      reason: "Resolved value is not a canonical panel view.",
    });
    return false;
  }
  return true;
}

function validateResolverContract(
  view: CanonicalRightPanelView,
  resolved: PanelResolvedData
) {
  if (!VALID_STATUSES.has(resolved.status)) {
    logDev("error", {
      message: "[Nexora][TestHarness][ResolverFail]",
      view,
      status: resolved.status,
    });
    return false;
  }
  return true;
}

function validateFallbackSafety(
  view: CanonicalRightPanelView,
  resolved: PanelResolvedData
) {
  if (resolved.status !== "fallback" && resolved.status !== "empty_but_guided") {
    return true;
  }
  const fallback = buildPanelFallbackState(view, resolved.status, resolved.missingFields);
  const hasGuidance = Boolean(fallback.title || fallback.message || fallback.suggestedActionLabel);
  if (!hasGuidance) {
    logDev("error", {
      message: "[Nexora][TestHarness][FallbackFail]",
      view,
      fallback,
    });
    return false;
  }
  return true;
}

function simulateRightPanelRender(
  view: CanonicalRightPanelView,
  panelData: PanelSharedData
): HarnessSnapshotRecord {
  const resolved = buildPanelResolvedData(view, panelData);
  const resolvedSafeView = resolveSafeRightPanelView(view);
  const safeView = resolvedSafeView ?? null;
  const shouldFallback = !RENDER_MANAGED_VIEWS.has(view);
  const reason =
    resolvedSafeView == null
      ? "invalid_view"
      : !RENDER_MANAGED_VIEWS.has(view)
        ? "missing_component"
        : null;
  const usedFallback =
    shouldFallback ||
    resolved.status === "fallback" ||
    resolved.status === "empty_but_guided";
  const renderValid =
    shouldFallback ||
    RENDER_MANAGED_VIEWS.has(view) ||
    usedFallback;

  if (!renderValid) {
    logDev("error", {
      message: "[Nexora][TestHarness][RenderFail]",
      view,
      resolvedStatus: resolved.status,
      usedFallback,
      reason,
    });
  }

  return {
    testState: "FULL_DATA",
    view,
    resolvedView: safeView ?? view,
    resolverStatus: resolved.status,
    usedFallback,
    renderValid,
  };
}

function validateMappingInputs() {
  for (const testCase of SAFE_VIEW_CASES) {
    const resolved = resolveHarnessSafeView(testCase.input);
    const passed = resolved === testCase.expectedView;
    if (!passed) {
      logDev("error", {
        message: "[Nexora][TestHarness][MappingFail]",
        contractFamily: testCase.contractFamily,
        input: testCase.input,
        targetView: resolved,
        expectedViewType: "CanonicalRightPanelView | null",
        expectedView: testCase.expectedView,
        reason: "Safe-view resolution does not match the canonical runtime contract.",
      });
    }
  }

  for (const testCase of LEGACY_MAPPING_CASES) {
    const resolved = mapLegacyTabToRightPanelView(testCase.input);
    if (!testCase.expectedViews.includes(resolved as CanonicalRightPanelView)) {
      logDev("error", {
        message: "[Nexora][TestHarness][MappingFail]",
        contractFamily: testCase.contractFamily,
        input: testCase.input,
        targetView: resolved,
        expectedViewType: "CanonicalRightPanelView",
        expectedView: testCase.expectedViews,
        reason: "Legacy tab mapping does not match the canonical panel contract.",
      });
    }
  }

  for (const testCase of ACTION_MAPPING_CASES) {
    if (!isRightPanelActionIntent(testCase.action)) {
      logDev("error", {
        message: "[Nexora][TestHarness][MappingFail]",
        contractFamily: testCase.contractFamily,
        action: testCase.action,
        targetView: null,
        expectedViewType: "RightPanelActionIntent",
        expectedView: testCase.expectedViews,
        reason: "Action identifier is not recognized by the shared action contract.",
      });
      continue;
    }
    const resolved = resolvePanelActionIntent(testCase.action, "dashboard");
    if (!testCase.expectedViews.includes(resolved.targetView as CanonicalRightPanelView)) {
      logDev("error", {
        message: "[Nexora][TestHarness][MappingFail]",
        contractFamily: testCase.contractFamily,
        action: testCase.action,
        targetView: resolved.targetView,
        expectedViewType: "CanonicalRightPanelView",
        expectedView: testCase.expectedViews,
        reason: "Action mapping is out of sync with the shared panel-action contract.",
      });
    }
  }

  for (const testCase of LEGACY_TAB_RESOLUTION_CASES) {
    const resolved = resolveRightPanelLegacyTabForView(testCase.view, testCase.preferredLegacyTab);
    if (resolved !== testCase.expectedTab) {
      logDev("error", {
        message: "[Nexora][TestHarness][MappingFail]",
        contractFamily: testCase.contractFamily,
        input: `${testCase.view}:${testCase.preferredLegacyTab ?? "null"}`,
        targetView: resolved,
        expectedViewType: "legacy_tab",
        expectedView: testCase.expectedTab,
        reason: "Legacy tab resolution drifted from the concrete-view preservation contract.",
      });
    }
  }

  for (const testCase of PROTECTED_VIEW_CASES) {
    const resolved = resolveHarnessSafeView(testCase.view);
    if (resolved !== testCase.view) {
      logDev("error", {
        message: "[Nexora][TestHarness][MappingFail]",
        contractFamily: testCase.contractFamily,
        input: testCase.view,
        targetView: resolved,
        expectedViewType: "CanonicalRightPanelView",
        expectedView: testCase.view,
        reason: "Protected view did not preserve its concrete canonical identity.",
      });
    }
    if (resolved === "dashboard" || resolved === null) {
      logDev("error", {
        message: "[Nexora][TestHarness][ProtectedViewDrift]",
        contractFamily: testCase.contractFamily,
        input: testCase.view,
        targetView: resolved,
        expectedViewType: "CanonicalRightPanelView",
        expectedView: testCase.view,
        reason: "Protected view drifted into dashboard or null.",
      });
    }
  }

  for (const testCase of DASHBOARD_DRIFT_GUARD_CASES) {
    const resolved = resolveHarnessSafeView(testCase.view);
    if (resolved === "dashboard" || resolved === null) {
      logDev("error", {
        message: "[Nexora][TestHarness][DashboardDrift]",
        contractFamily: testCase.contractFamily,
        input: testCase.view,
        targetView: resolved,
        expectedViewType: "CanonicalRightPanelView",
        expectedView: testCase.view,
        reason: "Concrete panel drifted into dashboard or null.",
      });
    }
  }
}

function compareWithPreviousSnapshot(records: HarnessSnapshotRecord[]) {
  if (typeof window === "undefined") return;
  const harnessWindow = window as HarnessWindow;
  const previous = harnessWindow.__NEXORA_PANEL_TEST_SNAPSHOT__ ?? [];
  const previousMap = new Map(previous.map((record) => [`${record.view}:${record.testState}`, record]));

  for (const record of records) {
    const prior = previousMap.get(`${record.view}:${record.testState}`);
    if (!prior) continue;
    const degraded =
      statusRank(record.resolverStatus) < statusRank(prior.resolverStatus) ||
      (!record.renderValid && prior.renderValid);
    if (degraded && process.env.NODE_ENV !== "production") {
      console.warn("[Nexora][RegressionDetected]", {
        previous: prior,
        current: record,
      });
    }
  }

  harnessWindow.__NEXORA_PANEL_TEST_SNAPSHOT__ = records;
}

export function runPanelConsistencyTestHarness(args: {
  currentView: RightPanelView;
  panelData: PanelSharedData;
}): HarnessRunResult {
  if (process.env.NODE_ENV === "production") {
    return { passed: true, records: [] };
  }

  validateMappingInputs();

  const records: HarnessSnapshotRecord[] = [];
  const currentResolvedView = args.currentView
    ? resolveSafeRightPanelView(args.currentView)
    : null;

  if (args.currentView && !currentResolvedView) {
    logDev("error", {
      message: "[Nexora][TestHarness][MappingFail]",
      contractFamily: "runtime_current_view",
      input: args.currentView,
      targetView: currentResolvedView,
      expectedViewType: "CanonicalRightPanelView",
      reason: "RightPanelHost passed an invalid current view into the runtime-safe router.",
    });
    return { passed: false, records: [] };
  }

  const currentResolvedPanel = currentResolvedView
    ? buildPanelResolvedData(currentResolvedView, args.panelData)
    : null;

  if (currentResolvedView && currentResolvedPanel) {
    if (!validateRouterOutput(args.currentView, currentResolvedView, "CanonicalRightPanelView")) {
      logDev("error", {
        message: "[Nexora][TestHarness][RouterFail]",
        input: args.currentView,
        resolvedView: currentResolvedView,
        expectedViewType: "CanonicalRightPanelView",
        reason: "Current view did not survive runtime-safe resolution.",
      });
    } else if (!validateResolverContract(currentResolvedView, currentResolvedPanel)) {
      logDev("error", {
        message: "[Nexora][TestHarness][ResolverFail]",
        currentView: currentResolvedView,
        status: currentResolvedPanel.status,
      });
    }
  }

  for (const view of CANONICAL_RIGHT_PANEL_VIEWS) {
    for (const [testState, panelData] of Object.entries(TEST_STATE_DATA) as Array<
      [HarnessTestState, PanelSharedData]
    >) {
      const resolvedView = resolveSafeRightPanelView(view);
      if (!resolvedView) {
        logDev("error", {
          message: "[Nexora][TestHarness][RouterFail]",
          input: view,
          resolvedView,
          expectedViewType: "CanonicalRightPanelView",
          reason: "Canonical panel view failed runtime-safe resolution.",
        });
        continue;
      }
      const routerValid = validateRouterOutput(view, resolvedView, "CanonicalRightPanelView");
      const resolved = buildPanelResolvedData(resolvedView, panelData);
      const resolverValid = validateResolverContract(resolvedView, resolved);
      const fallbackValid =
        testState === "EMPTY_DATA"
          ? validateFallbackSafety(resolvedView, resolved)
          : true;
      const simulated = simulateRightPanelRender(resolvedView, panelData);
      const record: HarnessSnapshotRecord = {
        ...simulated,
        testState,
        view,
        resolvedView,
      };
      records.push(record);

      if (!(routerValid && resolverValid && fallbackValid && record.renderValid)) {
        logDev("error", {
          message: "[Nexora][TestHarness][RenderFail]",
          currentView: currentResolvedView,
          testState,
          record,
        });
      }
    }
  }

  compareWithPreviousSnapshot(records);

  return {
    passed: records.every((record) => record.renderValid && record.resolverStatus !== "invalid"),
    records,
  };
}
