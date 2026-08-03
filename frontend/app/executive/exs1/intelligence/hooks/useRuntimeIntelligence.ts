"use client";

import { useContext } from "react";
import { ExecutiveRuntimeIntelligenceContext } from "../ExecutiveRuntimeIntelligenceProvider";

/**
 * Runtime Intelligence hook — signals, inbox, recommendation context.
 */
export function useRuntimeIntelligence() {
  const value = useContext(ExecutiveRuntimeIntelligenceContext);
  if (!value) {
    throw new Error(
      "useRuntimeIntelligence must be used within ExecutiveRuntimeIntelligenceProvider",
    );
  }
  return value;
}
