"use client";

import { useContext } from "react";
import { useExecutiveMode } from "../../mode/hooks/useExecutiveMode";
import { ScenarioSelectionContext } from "../ScenarioSelectionManager";

/**
 * Scenario Experience hook — active only conceptually in Scenario mode.
 * Selection state persists; UI surfaces gate on activeMode === "Scenario".
 */
export function useScenarioExperience() {
  const selection = useContext(ScenarioSelectionContext);
  if (!selection) {
    throw new Error(
      "useScenarioExperience must be used within ScenarioSelectionManager",
    );
  }
  const { activeMode } = useExecutiveMode();
  const isActive = activeMode === "Scenario";

  return {
    ...selection,
    isActive,
    activeMode,
  };
}
