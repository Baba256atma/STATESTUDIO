"use client";

import { useEffect } from "react";

import { useAdaptiveGovernanceIntelligenceContext } from "./adaptiveGovernanceIntelligenceContext";

export function ExecutiveAdaptiveGovernanceShellSync() {
  const { snapshot } = useAdaptiveGovernanceIntelligenceContext();

  useEffect(() => {
    const root = document.documentElement;
    if (!snapshot?.enabled) {
      root.removeAttribute("data-nexora-governance-posture");
      root.removeAttribute("data-nexora-governance-oversight");
      root.removeAttribute("data-nexora-enterprise-self-calibration");
      root.removeAttribute("data-nexora-coherence-posture");
      root.removeAttribute("data-nexora-enterprise-coherence");
      root.removeAttribute("data-nexora-alignment-integrity");
      root.removeAttribute("data-nexora-calibration-posture");
      root.removeAttribute("data-nexora-strategic-calibration");
      root.removeAttribute("data-nexora-decision-quality-cognition");
      root.removeAttribute("data-nexora-pressure-posture");
      root.removeAttribute("data-nexora-executive-stability");
      root.removeAttribute("data-nexora-pressure-governance");
      root.removeAttribute("data-nexora-adaptation-posture");
      root.removeAttribute("data-nexora-organizational-evolution");
      root.removeAttribute("data-nexora-adaptation-governance");
      root.removeAttribute("data-nexora-evolution-convergence");
      root.removeAttribute("data-nexora-unified-governance-runtime");
      root.removeAttribute("data-nexora-strategic-evolution-converged");
      return;
    }

    root.setAttribute("data-nexora-governance-posture", snapshot.oversightPosture);
    root.setAttribute(
      "data-nexora-governance-oversight",
      snapshot.governanceOversightActive ? "true" : "false"
    );
    root.setAttribute(
      "data-nexora-enterprise-self-calibration",
      snapshot.enterpriseSelfCalibrationActive ? "true" : "false"
    );
    root.setAttribute("data-nexora-coherence-posture", snapshot.coherencePosture);
    root.setAttribute(
      "data-nexora-enterprise-coherence",
      snapshot.enterpriseCoherenceActive ? "true" : "false"
    );
    root.setAttribute(
      "data-nexora-alignment-integrity",
      snapshot.strategicAlignmentIntegrityActive ? "true" : "false"
    );
    root.setAttribute("data-nexora-calibration-posture", snapshot.calibrationPosture);
    root.setAttribute(
      "data-nexora-strategic-calibration",
      snapshot.strategicCalibrationActive ? "true" : "false"
    );
    root.setAttribute(
      "data-nexora-decision-quality-cognition",
      snapshot.decisionQualityCognitionActive ? "true" : "false"
    );
    root.setAttribute("data-nexora-pressure-posture", snapshot.pressurePosture);
    root.setAttribute(
      "data-nexora-executive-stability",
      snapshot.executiveStabilityActive ? "true" : "false"
    );
    root.setAttribute(
      "data-nexora-pressure-governance",
      snapshot.pressureGovernanceActive ? "true" : "false"
    );
    root.setAttribute("data-nexora-adaptation-posture", snapshot.adaptationPosture);
    root.setAttribute(
      "data-nexora-organizational-evolution",
      snapshot.organizationalEvolutionActive ? "true" : "false"
    );
    root.setAttribute(
      "data-nexora-adaptation-governance",
      snapshot.adaptationGovernanceActive ? "true" : "false"
    );
    root.setAttribute("data-nexora-evolution-convergence", snapshot.evolutionConvergencePosture);
    root.setAttribute(
      "data-nexora-unified-governance-runtime",
      snapshot.unifiedGovernanceRuntimeActive ? "true" : "false"
    );
    root.setAttribute(
      "data-nexora-strategic-evolution-converged",
      snapshot.institutionalStrategicEvolutionConverged ? "true" : "false"
    );

    return () => {
      root.removeAttribute("data-nexora-governance-posture");
      root.removeAttribute("data-nexora-governance-oversight");
      root.removeAttribute("data-nexora-enterprise-self-calibration");
      root.removeAttribute("data-nexora-coherence-posture");
      root.removeAttribute("data-nexora-enterprise-coherence");
      root.removeAttribute("data-nexora-alignment-integrity");
      root.removeAttribute("data-nexora-calibration-posture");
      root.removeAttribute("data-nexora-strategic-calibration");
      root.removeAttribute("data-nexora-decision-quality-cognition");
      root.removeAttribute("data-nexora-pressure-posture");
      root.removeAttribute("data-nexora-executive-stability");
      root.removeAttribute("data-nexora-pressure-governance");
      root.removeAttribute("data-nexora-adaptation-posture");
      root.removeAttribute("data-nexora-organizational-evolution");
      root.removeAttribute("data-nexora-adaptation-governance");
      root.removeAttribute("data-nexora-evolution-convergence");
      root.removeAttribute("data-nexora-unified-governance-runtime");
      root.removeAttribute("data-nexora-strategic-evolution-converged");
    };
  }, [snapshot]);

  return null;
}
