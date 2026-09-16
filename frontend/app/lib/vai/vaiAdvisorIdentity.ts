/**
 * NPA-T VAI:4 — Advisor Variable Analysis identity.
 * Read-only conversational projection. Not a second Advisor or intent authority.
 */

export const vaiAdvisorAnalysisIdentity = "NPA-T VAI:4/AdvisorVariableAnalysis" as const;
export const vaiAdvisorAnalysisVersion = "1.0.0" as const;
export const vaiAdvisorAnalysisNamespace = "nexora.vai.advisor-analysis" as const;
export const vaiAdvisorAnalysisPhase = "VAI:4" as const;

export function getVaiAdvisorAnalysisIdentity() {
  return Object.freeze({
    id: vaiAdvisorAnalysisIdentity,
    version: vaiAdvisorAnalysisVersion,
    namespace: vaiAdvisorAnalysisNamespace,
    phase: vaiAdvisorAnalysisPhase,
  });
}
