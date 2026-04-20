"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { NexoraRunbookSurfaceHints } from "./nexoraRunbook";

const emptyHints: NexoraRunbookSurfaceHints = {
  commandBar: null,
  comparePanel: null,
  pipelineAfterAnalysis: null,
  pipelineAfterDecision: null,
  pipelineAfterOutcome: null,
};

type NexoraRunbookGuidanceContextValue = {
  hints: NexoraRunbookSurfaceHints;
  setHints: React.Dispatch<React.SetStateAction<NexoraRunbookSurfaceHints>>;
};

const NexoraRunbookGuidanceContext = createContext<NexoraRunbookGuidanceContextValue | null>(null);

export function NexoraRunbookGuidanceProvider({ children }: { children: React.ReactNode }) {
  const [hints, setHints] = useState<NexoraRunbookSurfaceHints>(emptyHints);
  const value = useMemo(() => ({ hints, setHints }), [hints]);
  return <NexoraRunbookGuidanceContext.Provider value={value}>{children}</NexoraRunbookGuidanceContext.Provider>;
}

export function useNexoraRunbookGuidanceOptional(): NexoraRunbookGuidanceContextValue | null {
  return useContext(NexoraRunbookGuidanceContext);
}
