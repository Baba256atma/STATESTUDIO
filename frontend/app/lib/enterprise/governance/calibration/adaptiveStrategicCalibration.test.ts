import { describe, expect, it } from "vitest";

import { mergeStrategicCalibration } from "./mergeStrategicCalibration";
import { resolveAdaptiveStrategicCalibration } from "./resolveAdaptiveStrategicCalibration";
import { synchronizeEnterpriseGovernanceStack } from "../synchronizeEnterpriseGovernanceStack";

describe("adaptive strategic calibration F9:3", () => {
  it("synchronizes full F9 governance stack with calibration fields", () => {
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

    expect(stack.strategicCoherence).not.toBeNull();
    expect(stack.strategicCalibration).not.toBeNull();
    expect(stack.calibrationPosture).not.toBe("idle");
    expect(stack.strategicPressureGovernance).not.toBeNull();
    expect(stack.pressureGovernanceActive).toBe(true);
  });

  it("merges calibration headline when strategic calibration active", () => {
    const calibration = resolveAdaptiveStrategicCalibration({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      adaptiveGovernance: null,
      strategicCoherence: null,
      enterpriseCoherenceActive: false,
      governanceOversightActive: false,
      cognitionConverged: true,
      fragilityElevated: false,
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

    const merged = mergeStrategicCalibration(base, calibration);
    expect(merged.strategicCalibration?.signature).toBe(calibration.signature);
    expect(merged.assistantCalibrationLine.length).toBeGreaterThan(0);
  });
});
