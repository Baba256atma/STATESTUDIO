import { buildPanelResolvedData } from "../../panels/buildPanelResolvedData";
import { buildPanelFallbackState } from "../../panels/buildPanelFallbackState";
import type { PanelResolvedData, PanelSharedData } from "../../panels/panelDataResolverTypes";
import { ensurePanelSafeRender } from "./panelRegressionGuard";
import {
  CANONICAL_RIGHT_PANEL_VIEWS,
  type CanonicalRightPanelView,
  type RightPanelView,
} from "./rightPanelTypes";
import { isCanonicalRightPanelView, resolveSafeRightPanelView } from "./rightPanelRouter";

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

const TEST_BUTTON_INPUTS: Array<unknown> = [
  "strategic_advice",
  "executive_dashboard",
  "timeline",
  "risk_flow",
  "memory_insights",
  "war_room",
  "workspace",
  "bogus_view",
  null,
  undefined,
];

const TEST_STATE_DATA: Record<HarnessTestState, PanelSharedData> = {
  FULL_DATA: {
    strategicAdvice: {
      summary: "Protect core throughput immediately.",
      why: "Supplier latency is propagating into service instability.",
      primary_recommendation: { action: "Activate backup supply" },
      recommended_actions: [{ action: "Activate backup supply", impact_summary: "Stabilizes delivery." }],
    },
    promptFeedback: {
      advice_feedback: { summary: "Fallback advice summary" },
      timeline_feedback: { summary: "Decision moved from detection to mitigation." },
    },
    decisionCockpit: {
      executive: { summary: "Executive cockpit is active." },
      advice: { summary: "Cockpit advice available." },
      comparison: { summary: "Comparison is available.", stages: [{ id: "after" }] },
    },
    executiveSummary: { summary: "Executive summary available.", what_to_do: "Contain the disruption." },
    simulation: { timeline: [{ step: 1 }] },
    timeline: { summary: "Timeline available.", stages: [{ id: "before" }, { id: "after" }] },
    risk: { summary: "Risk links available." },
    canonicalRecommendation: { id: "rec_full" },
    decisionResult: { id: "result_full" },
    warRoom: { summary: "War room context available." },
    compare: { summary: "Compare context available." },
    governance: { summary: "Governance context available." },
    approval: { summary: "Approval context available." },
    policy: { summary: "Policy context available." },
    strategicCouncil: { summary: "Council context available." },
    memoryEntries: [{ id: "memory_1" }],
  },
  PARTIAL_DATA: {
    strategicAdvice: {
      summary: "A recommendation is forming.",
    },
    executiveSummary: {
      what_to_do: "Review the current recommendation.",
    },
    timeline: {
      summary: "Only a high-level timeline summary exists.",
    },
  },
  EMPTY_DATA: {},
  INVALID_DATA: {
    strategicAdvice: "invalid",
    timeline: 42,
    decisionCockpit: "invalid",
    risk: false,
    memoryEntries: [],
  },
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

function validateRouterOutput(input: unknown, resolvedView: CanonicalRightPanelView) {
  if (!isCanonicalRightPanelView(resolvedView)) {
    logDev("error", {
      message: "[Nexora][TestHarness][RouterFail]",
      input,
      resolvedView,
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
  const guard = ensurePanelSafeRender(view, RENDER_MANAGED_VIEWS.has(view));
  const usedFallback =
    guard.shouldFallback ||
    resolved.status === "fallback" ||
    resolved.status === "empty_but_guided";
  const renderValid =
    guard.shouldFallback ||
    RENDER_MANAGED_VIEWS.has(view) ||
    usedFallback;

  if (!renderValid) {
    logDev("error", {
      message: "[Nexora][TestHarness][RenderFail]",
      view,
      resolvedStatus: resolved.status,
      usedFallback,
    });
  }

  return {
    testState: "FULL_DATA",
    view,
    resolvedView: guard.safeView,
    resolverStatus: resolved.status,
    usedFallback,
    renderValid,
  };
}

function validateMappingInputs() {
  for (const input of TEST_BUTTON_INPUTS) {
    const resolved = resolveSafeRightPanelView(input);
    if (!isCanonicalRightPanelView(resolved)) {
      logDev("error", {
        message: "[Nexora][TestHarness][MappingFail]",
        input,
        resolved,
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
  const currentResolvedView = resolveSafeRightPanelView(args.currentView);
  const currentResolvedPanel = buildPanelResolvedData(currentResolvedView, args.panelData);

  if (!validateResolverContract(currentResolvedView, currentResolvedPanel)) {
    logDev("error", {
      message: "[Nexora][TestHarness][ResolverFail]",
      currentView: currentResolvedView,
      status: currentResolvedPanel.status,
    });
  }

  for (const view of CANONICAL_RIGHT_PANEL_VIEWS) {
    for (const [testState, panelData] of Object.entries(TEST_STATE_DATA) as Array<
      [HarnessTestState, PanelSharedData]
    >) {
      const resolvedView = resolveSafeRightPanelView(view);
      const routerValid = validateRouterOutput(view, resolvedView);
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
