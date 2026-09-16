/**
 * NPA-A VAI:8 — Experiment-to-Decision Integration identity.
 * Handoff only. Not a Scenario, Decision, Execution, Outcome, or Learning authority.
 */

export const vaiExperimentDecisionIdentity = "NPA-A VAI:8/ExperimentToDecisionIntegration" as const;
export const vaiExperimentDecisionVersion = "1.0.0" as const;
export const vaiExperimentDecisionNamespace = "nexora.vai.experiment-scenario-handoff" as const;
export const vaiExperimentDecisionPhase = "VAI:8" as const;

export function getVaiExperimentDecisionIdentity() {
  return Object.freeze({
    id: vaiExperimentDecisionIdentity,
    version: vaiExperimentDecisionVersion,
    namespace: vaiExperimentDecisionNamespace,
    phase: vaiExperimentDecisionPhase,
  });
}
