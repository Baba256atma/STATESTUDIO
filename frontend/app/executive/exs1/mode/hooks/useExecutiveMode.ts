"use client";

import { useContext } from "react";
import { ExecutiveModeContext } from "../ExecutiveModeContext";

/**
 * Pure UI hook for Executive Mode orchestration.
 * No runtime dependency.
 */
export function useExecutiveMode() {
  const value = useContext(ExecutiveModeContext);
  if (!value) {
    throw new Error(
      "useExecutiveMode must be used within ExecutiveModeProvider",
    );
  }
  return value;
}
