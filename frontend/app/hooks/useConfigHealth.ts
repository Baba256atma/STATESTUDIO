import { useMemo } from "react";
import { getActiveKpiDefs, getActiveLoopTemplates } from "../lib/config/customerConfig";
import { validateCustomerConfig } from "../lib/config/validateCustomerConfig";

export function useConfigHealth(): { hasIssues: boolean; issueCount: number } {
  const v = useMemo(
    () => validateCustomerConfig({ kpis: getActiveKpiDefs(), loops: getActiveLoopTemplates() }),
    []
  );

  return { hasIssues: v.issues.length > 0, issueCount: v.issues.length };
}
