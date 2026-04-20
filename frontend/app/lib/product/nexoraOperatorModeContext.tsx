"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import { emitNexoraModeChangedDev, persistNexoraMode, readStoredNexoraMode, type NexoraMode } from "./nexoraMode.ts";
import { getNexoraProductMode } from "./nexoraProductMode.ts";

type NexoraOperatorModeContextValue = {
  nexoraMode: NexoraMode;
  setNexoraMode: (mode: NexoraMode) => void;
};

const NexoraOperatorModeContext = createContext<NexoraOperatorModeContextValue | null>(null);

export function NexoraOperatorModeProvider(props: { children: React.ReactNode }): React.ReactElement {
  const [nexoraMode, setNexoraModeState] = useState<NexoraMode>(() => {
    if (getNexoraProductMode() === "pilot") {
      persistNexoraMode("adaptive");
      return "adaptive";
    }
    return readStoredNexoraMode() ?? "adaptive";
  });

  const setNexoraMode = useCallback((mode: NexoraMode) => {
    setNexoraModeState((prev) => {
      if (prev === mode) return prev;
      persistNexoraMode(mode);
      emitNexoraModeChangedDev(prev, mode);
      return mode;
    });
  }, []);

  const value = useMemo(() => ({ nexoraMode, setNexoraMode }), [nexoraMode, setNexoraMode]);

  return <NexoraOperatorModeContext.Provider value={value}>{props.children}</NexoraOperatorModeContext.Provider>;
}

export function useNexoraOperatorMode(): NexoraOperatorModeContextValue {
  const v = useContext(NexoraOperatorModeContext);
  if (!v) {
    throw new Error("useNexoraOperatorMode requires NexoraOperatorModeProvider");
  }
  return v;
}

/** For CommandHeader when tests omit the provider. */
export function useNexoraOperatorModeOptional(): NexoraOperatorModeContextValue | null {
  return useContext(NexoraOperatorModeContext);
}
