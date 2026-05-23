"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  buildWorkspaceLayoutSignature,
  resolveWorkspaceLayoutContract,
  traceWorkspaceLayoutContract,
  workspaceHudPlacementStyle,
} from "./workspaceLayoutController";
import { useViewportWidthListener } from "../dom/useDomListener";
import type { WorkspaceLayoutContract } from "./workspaceLayoutTypes";
import { applyHudPreferencesToLayoutContract } from "./hudPreferencesController";
import { useHudPreferencesOptional } from "./useHudPreferences";
import {
  logWorkspaceLayoutMounted,
  logWorkspaceLayoutPresetChanged,
  logWorkspaceLayoutRestored,
} from "./workspaceLayoutInstrumentation";
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
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
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

  useViewportWidthListener(setViewportWidth, "WorkspaceLayoutProvider");

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

  useEffect(() => {
    traceWorkspaceLayoutContract(contract);
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
      hudStyle: (panel) => workspaceHudPlacementStyle(contract.hud[panel], contract.transitionMs),
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
