import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

/**
 * F10:3 — Organizational learning reflection (structured awareness, not analytics overload).
 */
export class OrganizationalLearningReflectionLayer {
  synthesizeOrganizationalLearningLine(
    strengths: readonly string[],
    fragilities: readonly string[]
  ): string {
    const strengthText = strengths.length > 0 ? strengths.slice(0, 2).join(" · ") : "forming";
    const fragilityText = fragilities.length > 0 ? fragilities.slice(0, 2).join(" · ") : "none flagged";
    return `Strengths ${strengthText} · watch ${fragilityText}`;
  }

  collectAdaptationSignals(stack: AdaptiveGovernanceIntelligenceSnapshot): string[] {
    const signals: string[] = [];
    if (stack.organizationalEvolutionActive) signals.push("organizational evolution");
    if (stack.adaptationGovernanceActive) signals.push("adaptation governance");
    if (stack.strategicCalibrationActive) signals.push("strategic calibration");
    if (stack.executiveStabilityActive) signals.push("stability discipline");
    return signals.length > 0 ? signals : ["institutional stack depth establishing"];
  }

  collectExecutiveLearningIndicators(
    stack: AdaptiveGovernanceIntelligenceSnapshot,
    cognitionConverged: boolean
  ): string[] {
    const indicators: string[] = [];
    if (cognitionConverged) indicators.push("cognition convergence");
    if (stack.decisionQualityCognitionActive) indicators.push("decision quality awareness");
    if (stack.executiveMetaCognitionActive) indicators.push("meta-cognitive reflection");
    if (stack.institutionalStrategicEvolutionConverged) indicators.push("governance evolution sync");
    return indicators;
  }

  collectInstitutionalStrengths(stack: AdaptiveGovernanceIntelligenceSnapshot): string[] {
    const strengths: string[] = [];
    if (stack.governanceOversightActive) strengths.push("governance oversight");
    if (stack.enterpriseCoherenceActive) strengths.push("coherence discipline");
    if (stack.executiveStabilityActive) strengths.push("executive stability");
    if (stack.unifiedGovernanceRuntimeActive) strengths.push("unified runtime");
    return strengths;
  }

  collectInstitutionalFragilities(
    fragilityElevated: boolean,
    stack: AdaptiveGovernanceIntelligenceSnapshot
  ): string[] {
    const fragilities: string[] = [];
    if (fragilityElevated) fragilities.push("operational fragility");
    if (stack.metaCognitionPosture === "attention") fragilities.push("reasoning continuity");
    if (!stack.enterpriseCoherenceActive) fragilities.push("coherence gaps");
    if (
      stack.metaCognitionPosture === "attention" ||
      stack.pressurePosture === "monitoring"
    ) {
      fragilities.push("elevated uncertainty");
    }
    return fragilities;
  }
}

export const organizationalLearningReflectionLayer = new OrganizationalLearningReflectionLayer();
