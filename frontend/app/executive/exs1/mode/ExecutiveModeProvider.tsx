"use client";

import { useMemo, type ReactNode } from "react";
import type { ExecutiveModeId } from "../shell/executiveCockpitTypes";
import { useRuntimeMode } from "../runtime";
import { ExecutiveModeContext } from "./ExecutiveModeContext";

type Props = {
  readonly initialMode?: ExecutiveModeId;
  readonly children: ReactNode;
};

/**
 * ExecutiveModeProvider — Runtime-backed Mode surface.
 * Mode lives in Executive Runtime; this provider only republishes for hooks.
 */
export function ExecutiveModeProvider({ children }: Props) {
  const runtime = useRuntimeMode();
  const value = useMemo(
    () => ({
      activeMode: runtime.activeMode,
      setActiveMode: runtime.setActiveMode,
      previousMode: runtime.previousMode,
      transitionState: runtime.transitionState,
      config: runtime.config,
    }),
    [runtime],
  );

  return (
    <ExecutiveModeContext.Provider value={value}>
      {children}
    </ExecutiveModeContext.Provider>
  );
}
