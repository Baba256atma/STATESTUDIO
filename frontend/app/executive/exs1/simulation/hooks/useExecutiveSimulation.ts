"use client";

import { useContext } from "react";
import { ExecutiveSimulationContext } from "../ExecutiveSimulationProvider";

/**
 * Executive Simulation hook — sessions, run, comparison, decision candidates.
 */
export function useExecutiveSimulation() {
  const value = useContext(ExecutiveSimulationContext);
  if (!value) {
    throw new Error(
      "useExecutiveSimulation must be used within ExecutiveSimulationProvider",
    );
  }
  return value;
}
