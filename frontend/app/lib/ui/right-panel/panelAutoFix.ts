import type { PanelSafeStatus, PanelSharedData } from "../../panels/panelDataResolverTypes";
import type { RightPanelView } from "./rightPanelTypes";
import { isCanonicalRightPanelView, resolveSafeRightPanelView } from "./rightPanelRouter";

type AutoFixType =
  | "none"
  | "view_normalized"
  | "fallback_applied"
  | "data_recovered"
  | "safe_redirect";

type AutoFixArgs = {
  view: RightPanelView | null | undefined;
  contextId?: string | null;
  panelData?: PanelSharedData | null;
  resolverStatus?: PanelSafeStatus;
};

type AutoFixResult = {
  fixedView: RightPanelView;
  fixedContextId?: string | null;
  fixedPanelData?: PanelSharedData | null;
  fixType: AutoFixType;
};

type LooseRecord = Record<string, unknown>;
type PanelDataReadiness = "empty" | "partial" | "full";

function isObject(value: unknown): value is LooseRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isEmptyObject(value: unknown) {
  return isObject(value) && Object.keys(value).length === 0;
}

function hasItems(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasNonEmptyRecord(value: unknown) {
  return isObject(value) && Object.keys(value).length > 0;
}

function getSafeAutoFixView(view: RightPanelView | null | undefined): RightPanelView {
  const resolved = resolveSafeRightPanelView(view);
  if (resolved && isCanonicalRightPanelView(resolved)) {
    return resolved;
  }
  if (view && isCanonicalRightPanelView(view)) {
    return view;
  }
  return "dashboard";
}

function getPanelSliceForView(view: RightPanelView, panelData: PanelSharedData | null | undefined): unknown {
  if (!panelData) return null;

  switch (view) {
    case "advice":
      return panelData.advice ?? panelData.strategicAdvice ?? null;
    case "timeline":
    case "decision_timeline":
      return panelData.timeline ?? null;
    case "dashboard":
      return panelData.dashboard ?? panelData.decisionCockpit ?? panelData.executiveSummary ?? null;
    case "simulate":
      return panelData.simulation ?? null;
    case "war_room":
      return panelData.warRoom ?? null;
    case "compare":
      return panelData.compare ?? null;
    case "conflict":
      return panelData.conflict ?? null;
    case "risk":
      return panelData.risk ?? panelData.fragility ?? null;
    case "fragility":
      return panelData.fragility ?? panelData.risk ?? null;
    case "memory":
      return panelData.memory ?? null;
    case "strategic_command":
      return panelData.strategicCommand ?? panelData.dashboard ?? panelData.decisionCockpit ?? null;
    case "decision_governance":
      return panelData.governance ?? null;
    case "decision_policy":
      return panelData.policy ?? null;
    case "executive_approval":
      return panelData.approval ?? null;
    case "decision_council":
      return panelData.strategicCouncil ?? null;
    default:
      return null;
  }
}

function getPanelDataReadiness(view: RightPanelView, panelData: PanelSharedData | null | undefined): PanelDataReadiness {
  const slice = getPanelSliceForView(view, panelData);
  if (hasItems(slice)) return "full";
  const record = isObject(slice) ? slice : null;
  if (!record) return hasText(slice) ? "partial" : "empty";

  const hasArray = (...keys: string[]) => keys.some((key) => hasItems(record[key]));
  const hasAnyText = (...keys: string[]) => keys.some((key) => hasText(record[key]));

  if (view === "advice") {
    if (hasArray("recommended_actions", "recommendations") || isObject(record.primary_recommendation)) return "full";
    return hasAnyText("summary", "why", "recommendation", "title", "risk_summary") || hasNonEmptyRecord(record)
      ? "partial"
      : "empty";
  }

  if (view === "timeline" || view === "decision_timeline") {
    if (hasArray("events", "steps", "stages", "timeline", "markers", "phases")) return "full";
    return hasAnyText("headline", "summary", "label", "type") || hasNonEmptyRecord(record) ? "partial" : "empty";
  }

  if (view === "compare") {
    if (hasArray("options", "comparison")) return "full";
    return hasAnyText("summary", "recommendation") || hasNonEmptyRecord(record) ? "partial" : "empty";
  }

  if (view === "conflict" || view === "risk" || view === "fragility") {
    if (hasArray("drivers", "sources", "edges", "conflicts", "tradeoffs", "tensions", "conflict_points")) return "full";
    return hasAnyText("summary", "headline", "posture", "level", "risk_level") || hasNonEmptyRecord(record)
      ? "partial"
      : "empty";
  }

  if (view === "memory") {
    if (hasArray("entries")) return "full";
    return hasAnyText("summary") || hasNonEmptyRecord(record) ? "partial" : "empty";
  }

  if (
    view === "dashboard" ||
    view === "simulate" ||
    view === "war_room" ||
    view === "strategic_command"
  ) {
    if (hasArray("options", "compare", "decision_blocks", "priorities", "risks", "recommended_actions", "impacted_nodes", "affected_objects")) {
      return "full";
    }
    return hasAnyText(
      "summary",
      "recommendation",
      "headline",
      "posture",
      "executive_summary",
      "simulation_summary",
      "compare_summary",
      "advice_summary",
      "happened",
      "why_it_matters",
      "what_to_do"
    ) || hasNonEmptyRecord(record)
      ? "partial"
      : "empty";
  }

  if (view === "decision_governance" || view === "decision_policy" || view === "executive_approval" || view === "decision_council") {
    if (hasArray("recommended_actions", "options", "decision_blocks")) return "full";
    return hasAnyText("summary", "status", "recommendation", "happened", "why_it_matters", "what_to_do") ||
      hasNonEmptyRecord(record)
      ? "partial"
      : "empty";
  }

  return hasNonEmptyRecord(record) ? "partial" : "empty";
}

function summarizeDataShape(value: unknown) {
  if (value == null) return "null";
  if (Array.isArray(value)) return `array(${value.length})`;
  if (isObject(value)) return `object(${Object.keys(value).length})`;
  return typeof value;
}

function applyMinimalDataRecovery(
  _view: RightPanelView,
  panelData: PanelSharedData | null | undefined
): PanelSharedData | null {
  return panelData ?? null;
}

function needsDataRecovery(_view: RightPanelView, _panelData: PanelSharedData | null | undefined) {
  return false;
}

function tracePanelAutoFix(
  label: "input" | "keep_current" | "repair_applied" | "demotion_blocked" | "fallback_reason",
  detail: Record<string, unknown>
) {
  if (process.env.NODE_ENV !== "production") {
    const method = label === "fallback_reason" ? console.warn : console.log;
    method("[Nexora][panelAutoFix]", {
      label,
      ...detail,
    });
  }
}

export function autoFixRightPanelState(args: AutoFixArgs): AutoFixResult {
  const normalizedView = getSafeAutoFixView(args.view);
  const safeData = args.panelData ?? null;
  const invalidView = !args.view || !isCanonicalRightPanelView(args.view);
  const originalSafeView = invalidView ? normalizedView : getSafeAutoFixView(args.view);
  const readiness = getPanelDataReadiness(normalizedView, safeData);

  tracePanelAutoFix("input", {
    currentView: args.view ?? null,
    normalizedView,
    resolverStatus: args.resolverStatus ?? null,
    readiness,
    dataShape: summarizeDataShape(getPanelSliceForView(normalizedView, safeData)),
  });

  if (readiness !== "empty") {
    if (invalidView) {
      tracePanelAutoFix("repair_applied", {
        currentView: args.view ?? null,
        proposedView: normalizedView,
        resolverStatus: args.resolverStatus ?? null,
        readiness,
        reason: "view_normalized_keep_renderable_panel",
      });
      return {
        fixedView: normalizedView,
        fixedContextId: args.contextId ?? null,
        fixedPanelData: safeData,
        fixType: "view_normalized",
      };
    }

    if (args.resolverStatus === "empty_but_guided" || args.resolverStatus == null || args.resolverStatus === "fallback") {
      tracePanelAutoFix("demotion_blocked", {
        currentView: args.view ?? null,
        proposedView: originalSafeView,
        resolverStatus: args.resolverStatus ?? null,
        readiness,
        reason: "current_panel_still_renderable",
      });
    } else {
      tracePanelAutoFix("keep_current", {
        currentView: args.view ?? null,
        proposedView: originalSafeView,
        resolverStatus: args.resolverStatus ?? null,
        readiness,
      });
    }
    return {
      fixedView: originalSafeView,
      fixedContextId: args.contextId ?? null,
      fixedPanelData: safeData,
      fixType: "none",
    };
  }

  if (args.resolverStatus === "empty_but_guided") {
    tracePanelAutoFix("fallback_reason", {
      currentView: args.view ?? null,
      proposedView: originalSafeView,
      resolverStatus: args.resolverStatus,
      readiness,
      reason: "resolver_empty_but_guided",
    });
    return {
      fixedView: originalSafeView,
      fixedContextId: args.contextId ?? null,
      fixedPanelData: safeData,
      fixType: "fallback_applied",
    };
  }

  if (
    args.resolverStatus == null ||
    safeData == null ||
    isEmptyObject(safeData)
  ) {
    const fixedView: RightPanelView = originalSafeView;
    const fixType = invalidView ? "view_normalized" : "fallback_applied";
    tracePanelAutoFix(invalidView ? "repair_applied" : "fallback_reason", {
      currentView: args.view ?? null,
      proposedView: fixedView,
      resolverStatus: args.resolverStatus ?? null,
      readiness,
      reason: invalidView ? "invalid_view_normalized" : "missing_or_empty_panel_data",
    });
    return {
      fixedView,
      fixedContextId: args.contextId ?? null,
      fixedPanelData: safeData,
      fixType,
    };
  }

  if (
    (args.resolverStatus === "partial" || args.resolverStatus === "fallback") &&
    needsDataRecovery(normalizedView, safeData)
  ) {
    tracePanelAutoFix("repair_applied", {
      currentView: args.view ?? null,
      proposedView: normalizedView,
      resolverStatus: args.resolverStatus ?? null,
      readiness,
      reason: "minimal_data_recovery",
    });
    return {
      fixedView: normalizedView,
      fixedContextId: args.contextId ?? null,
      fixedPanelData: applyMinimalDataRecovery(normalizedView, safeData),
      fixType: "data_recovered",
    };
  }

  if (invalidView) {
    tracePanelAutoFix("repair_applied", {
      currentView: args.view ?? null,
      proposedView: normalizedView,
      resolverStatus: args.resolverStatus ?? null,
      readiness,
      reason: "invalid_view_normalized",
    });
    return {
      fixedView: normalizedView,
      fixedContextId: args.contextId ?? null,
      fixedPanelData: safeData,
      fixType: "view_normalized",
    };
  }

  return {
    fixedView: normalizedView,
    fixedContextId: args.contextId ?? null,
    fixedPanelData: safeData,
    fixType: "none",
  };
}
