import { describe, expect, it } from "vitest";

import { mergeStrategicPressureGovernance } from "./mergeStrategicPressureGovernance";
import { resolveInstitutionalStrategicPressureGovernance } from "./resolveInstitutionalStrategicPressureGovernance";
import { synchronizeEnterpriseGovernanceStack } from "../synchronizeEnterpriseGovernanceStack";

describe("institutional strategic pressure governance F9:4", () => {
  it("synchronizes full F9 stack with pressure governance fields", () => {
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

    expect(stack.strategicPressureGovernance).not.toBeNull();
    expect(stack.pressureGovernanceActive).toBe(true);
    expect(stack.assistantStabilityLine.length).toBeGreaterThan(0);
  });

  it("merges stability headline when executive stability active", () => {
    const pressure = resolveInstitutionalStrategicPressureGovernance({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      adaptiveGovernance: null,
      strategicCoherence: null,
      strategicCalibration: null,
      fragilityElevated: false,
      governanceOversightActive: true,
      strategicCalibrationActive: true,
      enterpriseCoherenceActive: true,
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

    const merged = mergeStrategicPressureGovernance(base, pressure);
    expect(merged.strategicPressureGovernance?.signature).toBe(pressure.signature);
    if (pressure.executiveStabilityActive) {
      expect(merged.governanceHeadline).toBe(pressure.stabilityHeadline);
    }
  });

  it("uses attention posture when continuity is not preserved", () => {
    const pressure = resolveInstitutionalStrategicPressureGovernance({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: false,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      adaptiveGovernance: null,
      strategicCoherence: null,
      strategicCalibration: null,
      fragilityElevated: true,
      governanceOversightActive: false,
      strategicCalibrationActive: false,
      enterpriseCoherenceActive: false,
      cognitionConverged: false,
    });

    expect(pressure.pressurePosture).toBe("attention");
    expect(pressure.stabilityHeadline).toContain("continuity attention");
  });
});
