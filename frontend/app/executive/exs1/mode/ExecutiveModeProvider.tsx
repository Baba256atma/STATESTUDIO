"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ExecutiveModeId } from "../shell/executiveCockpitTypes";
import {
  EXECUTIVE_MODE_TRANSITION_MS,
  getExecutiveModeConfig,
  type ExecutiveModeTransitionState,
} from "./ExecutiveModeConfig";
import { ExecutiveModeContext } from "./ExecutiveModeContext";

type Props = {
  readonly initialMode?: ExecutiveModeId;
  readonly children: ReactNode;
};

/**
 * ExecutiveModeProvider — pure UI state for active mode transitions.
 * Never touches Timeline, Pack selection, Explorer, or Runtime.
 */
export function ExecutiveModeProvider({
  initialMode = "Problem",
  children,
}: Props) {
  const [activeMode, setActiveModeState] =
    useState<ExecutiveModeId>(initialMode);
  const [previousMode, setPreviousMode] = useState<ExecutiveModeId | null>(
    null,
  );
  const [transitionState, setTransitionState] =
    useState<ExecutiveModeTransitionState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const setActiveMode = useCallback(
    (mode: ExecutiveModeId) => {
      if (mode === activeMode) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      setPreviousMode(activeMode);
      setTransitionState("exiting");

      timerRef.current = setTimeout(() => {
        setActiveModeState(mode);
        setTransitionState("entering");
        timerRef.current = setTimeout(() => {
          setTransitionState("active");
          timerRef.current = setTimeout(() => {
            setTransitionState("idle");
          }, 40);
        }, EXECUTIVE_MODE_TRANSITION_MS);
      }, Math.floor(EXECUTIVE_MODE_TRANSITION_MS / 2));
    },
    [activeMode],
  );

  const value = useMemo(
    () => ({
      activeMode,
      setActiveMode,
      previousMode,
      transitionState,
      config: getExecutiveModeConfig(activeMode),
    }),
    [activeMode, setActiveMode, previousMode, transitionState],
  );

  return (
    <ExecutiveModeContext.Provider value={value}>
      {children}
    </ExecutiveModeContext.Provider>
  );
}
