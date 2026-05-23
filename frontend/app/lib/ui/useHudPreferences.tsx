"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { getRegisteredHudPanels } from "./hudPanelRegistry";
import {
  isHudPanelVisible,
  resolveAssistantRailSide,
  resolveHudPanelDock,
  resolveHudPanelSize,
} from "./hudPreferencesController";
import {
  logHudDockChanged,
  logHudPreferenceRestored,
  logHudPreferencesMounted,
  logHudSizeChanged,
  logHudVisibilityChanged,
} from "./hudPreferencesInstrumentation";
import { mergeHudPreferences, persistHudPreferences, readStoredHudPreferences } from "./hudPreferencesStore";
import type {
  HudDockPosition,
  HudPanelId,
  HudPreferences,
  HudSizeMode,
  HudVisibilityState,
} from "./hudPreferencesTypes";

export type HudPreferencesContextValue = {
  preferences: HudPreferences;
  isPanelVisible: (panelId: HudPanelId) => boolean;
  getPanelSize: (panelId: HudPanelId, layoutDefault?: HudSizeMode) => HudSizeMode;
  getPanelDock: (panelId: HudPanelId) => HudDockPosition;
  assistantRailSide: "left" | "right";
  setPanelVisibility: (panelId: HudPanelId, visibility: HudVisibilityState) => void;
  setPanelSize: (panelId: HudPanelId, size: HudSizeMode) => void;
  setPanelDock: (panelId: HudPanelId, dock: HudDockPosition) => void;
};

const HudPreferencesContext = createContext<HudPreferencesContextValue | null>(null);

export function HudPreferencesProvider(props: { children: React.ReactNode }): React.ReactElement {
  const [preferences, setPreferences] = useState<HudPreferences>(() => readStoredHudPreferences());
  const mountedRef = useRef(false);

  React.useLayoutEffect(() => {
    const stored = readStoredHudPreferences();
    setPreferences(stored);
    logHudPreferenceRestored(getRegisteredHudPanels().length);
  }, []);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logHudPreferencesMounted();
  }, []);

  const commitPreferences = useCallback((patch: Partial<HudPreferences>) => {
    setPreferences((prev) => {
      const next = mergeHudPreferences({
        visibility: { ...prev.visibility, ...patch.visibility },
        size: { ...prev.size, ...patch.size },
        dock: { ...prev.dock, ...patch.dock },
      });
      persistHudPreferences(next);
      return next;
    });
  }, []);

  const setPanelVisibility = useCallback(
    (panelId: HudPanelId, visibility: HudVisibilityState) => {
      logHudVisibilityChanged(panelId, visibility);
      commitPreferences({ visibility: { [panelId]: visibility } });
    },
    [commitPreferences]
  );

  const setPanelSize = useCallback(
    (panelId: HudPanelId, size: HudSizeMode) => {
      logHudSizeChanged(panelId, size);
      commitPreferences({ size: { [panelId]: size } });
    },
    [commitPreferences]
  );

  const setPanelDock = useCallback(
    (panelId: HudPanelId, dock: HudDockPosition) => {
      logHudDockChanged(panelId, dock);
      commitPreferences({ dock: { [panelId]: dock } });
    },
    [commitPreferences]
  );

  const value = useMemo<HudPreferencesContextValue>(
    () => ({
      preferences,
      isPanelVisible: (panelId) => isHudPanelVisible(preferences, panelId),
      getPanelSize: (panelId, layoutDefault = "normal") => resolveHudPanelSize(preferences, panelId, layoutDefault),
      getPanelDock: (panelId) => resolveHudPanelDock(preferences, panelId),
      assistantRailSide: resolveAssistantRailSide(preferences),
      setPanelVisibility,
      setPanelSize,
      setPanelDock,
    }),
    [preferences, setPanelDock, setPanelSize, setPanelVisibility]
  );

  return <HudPreferencesContext.Provider value={value}>{props.children}</HudPreferencesContext.Provider>;
}

export function useHudPreferences(): HudPreferencesContextValue {
  const ctx = useContext(HudPreferencesContext);
  if (!ctx) {
    throw new Error("useHudPreferences must be used within HudPreferencesProvider");
  }
  return ctx;
}

export function useHudPreferencesOptional(): HudPreferencesContextValue | null {
  return useContext(HudPreferencesContext);
}
