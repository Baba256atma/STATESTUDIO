"use client";

import { useEffect, useMemo, useState } from "react";

import {
  resolveExecutiveWorkspaceLayoutMetrics,
  type ExecutiveWorkspaceLayoutMetrics,
} from "./executiveWorkspaceLayout";
import {
  EXECUTIVE_HUD_SSR_VIEWPORT,
  isExecutiveHudLayoutHydrated,
  subscribeExecutiveHudLayoutHydration,
} from "../layout/executiveHudHydrationRuntime";
import {
  buildViewportResizeSignature,
  scheduleViewportResizeCommit,
} from "../layout/viewportResizeRuntime";
import {
  logExecutiveResponsiveWorkspaceApplied,
  logExecutiveWorkspaceLayoutInitialized,
} from "./executiveWorkspaceInstrumentation";
import { useWorkspaceLayoutOptional } from "./useWorkspaceLayout";

export type UseExecutiveWorkspaceLayoutOptions = {
  leftCommandOpen?: boolean;
  leftDockExpanded?: boolean;
  rightDockExpanded?: boolean;
  leftSceneDockVisible?: boolean;
  rightObjectDockVisible?: boolean;
  rightAssistantVisible?: boolean;
  rightAssistantExpanded?: boolean;
  leftCommandVisible?: boolean;
};

export function useExecutiveWorkspaceLayout(
  options?: UseExecutiveWorkspaceLayoutOptions
): ExecutiveWorkspaceLayoutMetrics {
  const workspaceLayout = useWorkspaceLayoutOptional();
  const [viewportWidth, setViewportWidth] = useState<number>(EXECUTIVE_HUD_SSR_VIEWPORT.width);

  useEffect(() => {
    let lastSignature = buildViewportResizeSignature(EXECUTIVE_HUD_SSR_VIEWPORT.width);

    const apply = () => {
      const nextWidth = Math.round(window.innerWidth);
      const nextSignature = buildViewportResizeSignature(nextWidth);
      if (nextSignature === lastSignature) return;
      lastSignature = nextSignature;
      setViewportWidth((previousWidth) => {
        const previousSignature = buildViewportResizeSignature(previousWidth);
        return previousSignature === nextSignature ? previousWidth : nextWidth;
      });
    };

    const unsubscribe = subscribeExecutiveHudLayoutHydration(apply);
    if (isExecutiveHudLayoutHydrated()) apply();
    const unsubscribeResize = scheduleViewportResizeCommit(apply);
    return () => {
      unsubscribe();
      unsubscribeResize();
    };
  }, []);

  const metrics = useMemo(
    () =>
      resolveExecutiveWorkspaceLayoutMetrics(viewportWidth, {
        leftCommandOpen: options?.leftCommandOpen,
        leftDockExpanded: options?.leftDockExpanded,
        rightDockExpanded: options?.rightDockExpanded,
        leftSceneDockVisible: options?.leftSceneDockVisible,
        rightObjectDockVisible: options?.rightObjectDockVisible,
        rightAssistantVisible: options?.rightAssistantVisible,
        rightAssistantExpanded: options?.rightAssistantExpanded,
        leftCommandVisible: options?.leftCommandVisible,
        rightAssistantWidthPx: workspaceLayout?.contract.rightRailWidthPx,
      }),
    [
      viewportWidth,
      options?.leftCommandOpen,
      options?.leftDockExpanded,
      options?.rightDockExpanded,
      options?.leftSceneDockVisible,
      options?.rightObjectDockVisible,
      options?.rightAssistantVisible,
      options?.rightAssistantExpanded,
      options?.leftCommandVisible,
      workspaceLayout?.contract.rightRailWidthPx,
    ]
  );

  useEffect(() => {
    logExecutiveWorkspaceLayoutInitialized(metrics);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional once-per-mount layout init log
  }, []);

  useEffect(() => {
    logExecutiveResponsiveWorkspaceApplied(metrics);
  }, [metrics]);

  return metrics;
}
