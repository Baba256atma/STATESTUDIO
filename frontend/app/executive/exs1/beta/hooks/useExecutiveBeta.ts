"use client";

import { useContext } from "react";
import { ExecutiveBetaContext } from "../ExecutiveBetaProvider";

/**
 * Executive Beta hook — flags, demos, validation, recovery, audit.
 */
export function useExecutiveBeta() {
  const value = useContext(ExecutiveBetaContext);
  if (!value) {
    throw new Error(
      "useExecutiveBeta must be used within ExecutiveBetaProvider",
    );
  }
  return value;
}
