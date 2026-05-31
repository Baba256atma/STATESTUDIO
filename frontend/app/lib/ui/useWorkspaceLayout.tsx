"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  buildWorkspaceLayoutSignature,
  resolveWorkspaceLayoutContract,
  traceWorkspaceLayoutContract,
  workspaceHudPlacementStyle,
} from "./workspaceLayoutController";
import type { WorkspaceLayoutContract } from "./workspaceLayoutTypes";
import {
  EXECUTIVE_HUD_SSR_VIEWPORT,
  markExecutiveHudLayoutHydrated,
  traceHUDClientLayout,
  traceHUDSSRLayout,
  traceResponsiveLayoutApplied,
} from "../layout/executiveHudHydrationRuntime";
import { bucketViewportWidth } from "../layout/hudLayoutSignature";
import {
  buildViewportResizeSignature,
  scheduleViewportResizeCommit,
} from "../layout/viewportResizeRuntime";
import { recordHudLayoutWrite } from "../layout/hudLayoutLogGuard";
import { startIdleRuntimeWatchdog } from "../runtime/idleRuntimeWatchdog";
import { applyHudPreferencesToLayoutContract } from "./hudPreferencesController";
import { useHudPreferencesOptional } from "./useHudPreferences";
import {
  logWorkspaceLayoutMounted,
  logWorkspaceLayoutPresetChanged,
  logWorkspaceLayoutRestored,
} from "./workspaceLayoutInstrumentation";
import {
  getHudLayoutSnapshot,
  updateHudAnchor,
  type ExecutiveAnchorZone,
  type HudPanelId,
} from "../hud/hudAnchoringRuntime";
import {
  DEFAULT_WORKSPACE_LAYOUT_PRESET,
  persistWorkspaceLayoutPreset,
  readStoredWorkspaceLayoutPreset,
} from "./workspaceLayoutStore";
import type {
  WorkspaceHudPlacement,
  WorkspaceLayoutPreset,
  WorkspaceLayoutSettings,
} from "./workspaceLayoutTypes";

export type WorkspaceLayoutContextValue = {
  preset: WorkspaceLayoutPreset;
  settings: WorkspaceLayoutSettings;
  contract: WorkspaceLayoutContract;
  setPreset: (preset: WorkspaceLayoutPreset) => void;
  hudStyle: (panel: keyof WorkspaceLayoutContract["hud"]) => React.CSSProperties;
  getHudPlacement: (panel: keyof WorkspaceLayoutContract["hud"]) => WorkspaceHudPlacement;
};

const WorkspaceLayoutContext = createContext<WorkspaceLayoutContextValue | null>(null);

export function WorkspaceLayoutProvider(props: { children: React.ReactNode }): React.ReactElement {
  const [preset, setPresetState] = useState<WorkspaceLayoutPreset>(DEFAULT_WORKSPACE_LAYOUT_PRESET);
  const [viewportWidth, setViewportWidth] = useState<number>(EXECUTIVE_HUD_SSR_VIEWPORT.width);
  const mountedRef = useRef(false);
  const hudPreferences = useHudPreferencesOptional();

  React.useLayoutEffect(() => {
    const stored = readStoredWorkspaceLayoutPreset();
    setPresetState(stored);
    logWorkspaceLayoutRestored(stored);
    document.documentElement.setAttribute("data-nx-layout-preset", stored);
  }, []);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logWorkspaceLayoutMounted();
  }, []);

  useEffect(() => {
    traceHUDSSRLayout();
    markExecutiveHudLayoutHydrated();
    startIdleRuntimeWatchdog();
    const width = Math.round(window.innerWidth);
    setViewportWidth((previousWidth) => {
      const previousSignature = buildViewportResizeSignature(previousWidth);
      const nextSignature = buildViewportResizeSignature(width);
      return previousSignature === nextSignature ? previousWidth : width;
    });
    traceHUDClientLayout(width);
    traceResponsiveLayoutApplied(width);
  }, []);

  const viewportSignatureRef = useRef(buildViewportResizeSignature(EXECUTIVE_HUD_SSR_VIEWPORT.width));
  const viewportBucketRef = useRef(bucketViewportWidth(EXECUTIVE_HUD_SSR_VIEWPORT.width));

  useEffect(() => {
    return scheduleViewportResizeCommit(() => {
      const width = Math.round(window.innerWidth);
      const nextSignature = buildViewportResizeSignature(width);
      if (nextSignature === viewportSignatureRef.current) return;
      viewportSignatureRef.current = nextSignature;
      viewportBucketRef.current = bucketViewportWidth(width);
      setViewportWidth(width);
      recordHudLayoutWrite("resize");
      traceResponsiveLayoutApplied(width);
    });
  }, []);

  const baseContract = useMemo(
    () => resolveWorkspaceLayoutContract(preset, viewportWidth),
    [preset, viewportWidth]
  );

  const contract = useMemo(
    () =>
      hudPreferences
        ? applyHudPreferencesToLayoutContract(baseContract, hudPreferences.preferences)
        : baseContract,
    [baseContract, hudPreferences?.preferences]
  );

  const lastHudLayoutSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    const layoutSignature = buildWorkspaceLayoutSignature(contract);
    if (lastHudLayoutSignatureRef.current === layoutSignature) {
      return;
    }
    lastHudLayoutSignatureRef.current = layoutSignature;
    recordHudLayoutWrite("layout");
    traceWorkspaceLayoutContract(contract);
    (Object.keys(contract.hud) as Array<keyof WorkspaceLayoutContract["hud"]>).forEach((panelId) => {
      const placement = contract.hud[panelId];
      updateHudAnchor(panelId as HudPanelId, {
        dockZone: placement.anchor as ExecutiveAnchorZone,
        anchorPosition: {
          top: placement.top,
          left: placement.left,
          right: placement.right,
          bottom: placement.bottom,
          transform: placement.transform,
        },
        visible: placement.visible,
        collapsedState: placement.sizeMode === "compact",
        maxWidth: placement.maxWidth,
        zIndex: placement.zIndex,
      });
    });
    getHudLayoutSnapshot();
  }, [contract]);

  const setPreset = useCallback(
    (next: WorkspaceLayoutPreset) => {
      if (next === preset) return;
      logWorkspaceLayoutPresetChanged(next);
      setPresetState(next);
      persistWorkspaceLayoutPreset(next);
      document.documentElement.setAttribute("data-nx-layout-preset", next);
    },
    [preset]
  );

  const value = useMemo<WorkspaceLayoutContextValue>(() => {
    const settings: WorkspaceLayoutSettings = { preset };
    return {
      preset,
      settings,
      contract,
      setPreset,
      hudStyle: (panel) => workspaceHudPlacementStyle(panel, contract.hud[panel], contract.transitionMs),
      getHudPlacement: (panel) => contract.hud[panel],
    };
  }, [contract, preset, setPreset]);

  return <WorkspaceLayoutContext.Provider value={value}>{props.children}</WorkspaceLayoutContext.Provider>;
}

export function useWorkspaceLayout(): WorkspaceLayoutContextValue {
  const ctx = useContext(WorkspaceLayoutContext);
  if (!ctx) {
    throw new Error("useWorkspaceLayout must be used within WorkspaceLayoutProvider");
  }
  return ctx;
}

/** Safe fallback for surfaces outside provider (should not happen in Type-C). */
export function useWorkspaceLayoutOptional(): WorkspaceLayoutContextValue | null {
  return useContext(WorkspaceLayoutContext);
}

export function useWorkspaceLayoutSignature(): string {
  const ctx = useWorkspaceLayoutOptional();
  return ctx ? buildWorkspaceLayoutSignature(ctx.contract) : DEFAULT_WORKSPACE_LAYOUT_PRESET;
}
