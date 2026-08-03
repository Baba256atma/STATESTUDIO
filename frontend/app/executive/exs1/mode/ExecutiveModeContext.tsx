"use client";

import { createContext } from "react";
import type { ExecutiveModeId } from "../shell/executiveCockpitTypes";
import type {
  ExecutiveModeTransitionState,
  ExecutiveModeVisualConfig,
} from "./ExecutiveModeConfig";

export type ExecutiveModeContextValue = {
  readonly activeMode: ExecutiveModeId;
  readonly setActiveMode: (mode: ExecutiveModeId) => void;
  readonly previousMode: ExecutiveModeId | null;
  readonly transitionState: ExecutiveModeTransitionState;
  readonly config: ExecutiveModeVisualConfig;
};

export const ExecutiveModeContext =
  createContext<ExecutiveModeContextValue | null>(null);
