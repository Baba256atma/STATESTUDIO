import { describe, expect, it } from "vitest";

import { mergeStrategicAdaptationGovernance } from "./mergeStrategicAdaptationGovernance";
import { resolveInstitutionalStrategicAdaptationGovernance } from "./resolveInstitutionalStrategicAdaptationGovernance";
import { synchronizeEnterpriseGovernanceStack } from "../synchronizeEnterpriseGovernanceStack";

describe("institutional strategic adaptation governance F9:5", () => {
  it("synchronizes full F9 stack with adaptation governance fields", () => {
    const stack = synchronizeEnterpriseGovernanceStack({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      institutional: {
        convergenceDepth: 5,
        historicalCognitionActive: true,
        behavioralLearningActive: true,
        resilienceEvolutionActive: true,
        strategicEvolutionActive: true,
        cognitiveCultureActive: true,
        enterpriseEvolutionActive: true,
        institutionalCognitionConverged: true,
      },
      cognitionConverged: true,
      fragilityElevated: false,
    });

    expect(stack.strategicAdaptationGovernance).not.toBeNull();
    expect(stack.adaptationGovernanceActive).toBe(true);
    expect(stack.assistantAdaptationLine.length).toBeGreaterThan(0);
  });

  it("merges evolution headline when organizational evolution active", () => {
    const adaptation = resolveInstitutionalStrategicAdaptationGovernance({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      institutional: {
        enterpriseEvolutionActive: true,
        strategicEvolutionActive: true,
        resilienceEvolutionActive: true,
        convergenceDepth: 5,
        institutionalCognitionConverged: true,
      },
      adaptiveGovernance: null,
      strategicCoherence: null,
      strategicCalibration: null,
      strategicPressure: null,
      fragilityElevated: false,
      governanceOversightActive: true,
      enterpriseCoherenceActive: true,
      strategicCalibrationActive: true,
      executiveStabilityActive: true,
      pressureGovernanceActive: true,
      cognitionConverged: true,
    });

    const base = synchronizeEnterpriseGovernanceStack({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      institutional: null,
      cognitionConverged: true,
      fragilityElevated: false,
    });

    const merged = mergeStrategicAdaptationGovernance(base, adaptation);
    expect(merged.strategicAdaptationGovernance?.signature).toBe(adaptation.signature);
    if (adaptation.organizationalEvolutionActive) {
      expect(merged.governanceHeadline).toBe(adaptation.evolutionHeadline);
    }
  });

  it("uses attention posture when continuity is not preserved", () => {
    const adaptation = resolveInstitutionalStrategicAdaptationGovernance({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: false,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      institutional: null,
      adaptiveGovernance: null,
      strategicCoherence: null,
      strategicCalibration: null,
      strategicPressure: null,
      fragilityElevated: true,
      governanceOversightActive: false,
      enterpriseCoherenceActive: false,
      strategicCalibrationActive: false,
      executiveStabilityActive: false,
      pressureGovernanceActive: false,
      cognitionConverged: false,
    });

    expect(adaptation.adaptationPosture).toBe("attention");
    expect(adaptation.evolutionHeadline).toContain("continuity requires institutional attention");
  });
});
