"use client";

/**
 * AD-FE-HOOKS-01 — RightPanelHost controller.
 * Separates render-driving holds from imperative/event-only refs.
 * RightPanelHost remains a legacy isolated host (not primary MRP).
 */

import React from "react";
import { isValidRightPanelView } from "../../lib/ui/right-panel/rightPanelRouter";
import type { RightPanelView } from "../../lib/ui/right-panel/rightPanelTypes";
import type { PanelResolvedData, PanelSharedData } from "../../lib/panels/panelDataResolverTypes";
import type { PanelReadiness } from "../../lib/panels/panelDataReadiness";
import { buildPanelSharedDataSignature } from "../../lib/panels/panelDataContract";

/** Keep last value whose signature matches — Compiler-legal replace for render-time ref caches. */
export function useSignatureStableValue<T>(value: T, getSignature: (v: T) => string): T {
  const [held, setHeld] = React.useState(() => {
    let signature = "init";
    try {
      signature = getSignature(value);
    } catch {
      signature = "init-error";
    }
    return { signature, value };
  });
  let signature = "error";
  try {
    signature = getSignature(value);
  } catch {
    return value;
  }
  if (signature !== held.signature) {
    setHeld({ signature, value });
    return value;
  }
  return held.value;
}

export function useStableAggregatedPanelData(aggregatedPanelData: PanelSharedData): PanelSharedData {
  return useSignatureStableValue(aggregatedPanelData, (data) => buildPanelSharedDataSignature(data));
}

/**
 * Previous-valid-view hold (anti-flash for transient invalid views).
 * Preserves legacy behavior: only records when the valid view is `dashboard`.
 */
export function usePreviousValidViewHold(requestedView: RightPanelView): RightPanelView {
  const [previousValidView, setPreviousValidView] = React.useState<RightPanelView>("dashboard");
  React.useEffect(() => {
    if (isValidRightPanelView(requestedView) && requestedView === "dashboard") {
      setPreviousValidView((prev) => (prev === requestedView ? prev : requestedView));
    }
  }, [requestedView]);
  return isValidRightPanelView(requestedView) ? requestedView : previousValidView;
}

type RenderableMap = Partial<Record<Exclude<RightPanelView, null>, PanelResolvedData>>;

/** Anti-flash: preserve last renderable resolved panel per view via commit-owned state. */
export function useLastRenderableResolvedByView(): {
  selectBest: (
    viewToRender: RightPanelView,
    resolvedPanel: PanelResolvedData | null,
    nextIsRenderable: boolean,
    isManaged: boolean
  ) => PanelResolvedData | null;
  rememberRenderable: (
    viewToRender: RightPanelView,
    resolvedPanel: PanelResolvedData | null,
    nextIsRenderable: boolean,
    isManaged: boolean
  ) => void;
  clearSceneFamily: () => void;
} {
  const [lastByView, setLastByView] = React.useState<RenderableMap>({});

  const selectBest = React.useCallback(
    (
      viewToRender: RightPanelView,
      resolvedPanel: PanelResolvedData | null,
      nextIsRenderable: boolean,
      isManaged: boolean
    ) => {
      if (!isManaged || !viewToRender) return resolvedPanel;
      if (nextIsRenderable && resolvedPanel) return resolvedPanel;
      return lastByView[viewToRender] ?? resolvedPanel;
    },
    [lastByView]
  );

  const rememberRenderable = React.useCallback(
    (
      viewToRender: RightPanelView,
      resolvedPanel: PanelResolvedData | null,
      nextIsRenderable: boolean,
      isManaged: boolean
    ) => {
      if (!isManaged || !viewToRender || !nextIsRenderable || !resolvedPanel) return;
      setLastByView((prev) => {
        if (prev[viewToRender] === resolvedPanel) return prev;
        return { ...prev, [viewToRender]: resolvedPanel };
      });
    },
    []
  );

  const clearSceneFamily = React.useCallback(() => {
    setLastByView((prev) => {
      if (!prev.workspace && !prev.object && !prev.object_focus) return prev;
      return { ...prev, workspace: undefined, object: undefined, object_focus: undefined };
    });
  }, []);

  return { selectBest, rememberRenderable, clearSceneFamily };
}

/**
 * Payload hold synchronized after commit.
 * Ready snapshots survive loading frames; empty clears. No render-time ref I/O.
 */
export function usePayloadHold<T>(
  payload: T,
  resolve: (p: T) => PanelReadiness,
  active: boolean
): { safe: T; displayReadiness: PanelReadiness } {
  const [held, setHeld] = React.useState<T | null>(null);
  const current = resolve(payload);

  React.useEffect(() => {
    if (!active) {
      setHeld(null);
      return;
    }
    if (current === "ready") {
      setHeld(payload);
    } else if (current === "empty") {
      setHeld(null);
    }
  }, [active, current, payload]);

  const safe = (current === "ready" ? payload : active ? (held ?? payload) : payload) as T;
  return { safe, displayReadiness: resolve(safe) };
}

export type AdviceBundle = { panel: PanelSharedData; advice: unknown };

export function useAdviceBundleHold(
  panel: PanelSharedData,
  advice: unknown,
  readiness: PanelReadiness,
  active: boolean
): AdviceBundle {
  const [held, setHeld] = React.useState<AdviceBundle | null>(null);

  React.useEffect(() => {
    if (!active) {
      setHeld(null);
      return;
    }
    if (readiness === "ready") {
      setHeld({ panel, advice });
    } else if (readiness === "empty") {
      setHeld(null);
    }
  }, [active, readiness, panel, advice]);

  if (readiness === "ready" || !active) return { panel, advice };
  return held ?? { panel, advice };
}
