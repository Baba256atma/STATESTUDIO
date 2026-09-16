/**
 * NPA-A VAI:7 — Interactive Analysis & What-If identity.
 * Temporary analytical experiment. Not Scenario, Decision, Evidence, or Outcome.
 */

export const vaiWhatIfIdentity = "NPA-A VAI:7/InteractiveAnalysisWhatIf" as const;
export const vaiWhatIfVersion = "1.0.0" as const;
export const vaiWhatIfNamespace = "nexora.vai.what-if-experiment" as const;
export const vaiWhatIfPhase = "VAI:7" as const;

export function getVaiWhatIfIdentity() {
  return Object.freeze({
    id: vaiWhatIfIdentity,
    version: vaiWhatIfVersion,
    namespace: vaiWhatIfNamespace,
    phase: vaiWhatIfPhase,
  });
}
