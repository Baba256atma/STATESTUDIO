"use client";

import { useContext } from "react";
import { ExecutiveModeContext } from "../ExecutiveModeContext";

/**
 * Executive Mode hook — Runtime-backed via ExecutiveModeProvider.
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
