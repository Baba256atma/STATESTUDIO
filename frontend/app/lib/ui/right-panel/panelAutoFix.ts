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

function applyMinimalDataRecovery(
  view: RightPanelView,
  panelData: PanelSharedData | null | undefined
): PanelSharedData | null {
  const safeData = panelData ? { ...panelData } : {};

  if (view === "advice") {
    const advice = isObject(safeData.strategicAdvice) ? safeData.strategicAdvice : {};
    return {
      ...safeData,
      strategicAdvice: {
        summary: hasText(advice.summary) ? advice.summary : "No recommendation available yet",
        recommended_actions: hasItems(advice.recommended_actions) ? advice.recommended_actions : [],
        ...advice,
      },
    };
  }

  if (view === "risk") {
    const risk = isObject(safeData.risk) ? safeData.risk : {};
    return {
      ...safeData,
      risk: {
        summary: hasText(risk.summary) ? risk.summary : "No risk data available",
        level: hasText(risk.level) ? risk.level : "low",
        ...risk,
      },
    };
  }

  if (view === "memory") {
    const memory = isObject(safeData.memory) ? safeData.memory : {};
    return {
      ...safeData,
      memory: {
        ...memory,
        entries: hasItems(memory.entries) ? memory.entries : [],
      },
    };
  }

  return panelData ?? null;
}

function needsDataRecovery(view: RightPanelView, panelData: PanelSharedData | null | undefined) {
  if (view === "advice") {
    const advice = isObject(panelData?.strategicAdvice) ? panelData?.strategicAdvice : null;
    return !advice || !hasItems(advice.recommended_actions);
  }
  if (view === "risk") {
    const risk = isObject(panelData?.risk) ? panelData?.risk : null;
    return !risk || !hasText(risk.summary);
  }
  if (view === "memory") {
    const memory = isObject(panelData?.memory) ? panelData?.memory : null;
    return !memory || !hasItems(memory.entries);
  }
  return false;
}

function traceAutoFix(
  originalView: RightPanelView | null | undefined,
  fixedView: RightPanelView,
  fixType: AutoFixType,
  resolverStatus?: PanelSafeStatus
) {
  if (process.env.NODE_ENV !== "production" && fixType !== "none") {
    console.warn("[Nexora][AutoFix]", {
      originalView: originalView ?? null,
      fixedView,
      fixType,
      resolverStatus: resolverStatus ?? null,
    });
  }
}

export function autoFixRightPanelState(args: AutoFixArgs): AutoFixResult {
  const normalizedView = resolveSafeRightPanelView(args.view);
  const safeData = args.panelData ?? null;
  const invalidView = !args.view || !isCanonicalRightPanelView(args.view);
  const originalSafeView = invalidView ? normalizedView : args.view;

  if (args.resolverStatus === "empty_but_guided") {
    traceAutoFix(args.view, originalSafeView, "fallback_applied", args.resolverStatus);
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
    const fixedView = originalSafeView;
    const fixType = invalidView ? "view_normalized" : "fallback_applied";
    traceAutoFix(args.view, fixedView, fixType, args.resolverStatus);
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
    traceAutoFix(args.view, normalizedView, "data_recovered", args.resolverStatus);
    return {
      fixedView: normalizedView,
      fixedContextId: args.contextId ?? null,
      fixedPanelData: applyMinimalDataRecovery(normalizedView, safeData),
      fixType: "data_recovered",
    };
  }

  if (invalidView) {
    traceAutoFix(args.view, normalizedView, "view_normalized", args.resolverStatus);
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
