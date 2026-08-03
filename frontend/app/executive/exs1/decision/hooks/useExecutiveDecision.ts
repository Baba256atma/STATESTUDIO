"use client";

import { useContext } from "react";
import { useExecutiveMode } from "../../mode/hooks/useExecutiveMode";
import { ExecutiveDecisionContext } from "../ExecutiveDecisionProvider";

/**
 * Executive Decision hook — active only when Executive Mode = Decision.
 */
export function useExecutiveDecision() {
  const ctx = useContext(ExecutiveDecisionContext);
  if (!ctx) {
    throw new Error(
      "useExecutiveDecision must be used within ExecutiveDecisionProvider",
    );
  }
  const { activeMode } = useExecutiveMode();
  const isActive = activeMode === "Decision";

  return {
    ...ctx,
    isActive,
    activeMode,
  };
}
