import { describe, expect, it } from "vitest";

import { synthesizeEnterpriseStrategicCoherence } from "./synthesizeEnterpriseStrategicCoherence";
import { resolveStrategicAlignmentIntegrity } from "./resolveStrategicAlignmentIntegrity";
import { mergeEnterpriseGovernanceSnapshot } from "./mergeEnterpriseGovernanceSnapshot";
import { resolveAdaptiveGovernanceIntelligence } from "../resolveAdaptiveGovernanceIntelligence";

describe("strategic alignment integrity F9:2", () => {
  it("synthesizes coherence from adaptive governance canonical", () => {
    const governance = resolveAdaptiveGovernanceIntelligence({
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

    const coherence = synthesizeEnterpriseStrategicCoherence({
      organizationId: "nexora-ops",
      adaptiveGovernance: governance.canonical,
      governanceOversightActive: governance.governanceOversightActive,
      enterpriseSelfCalibrationActive: governance.enterpriseSelfCalibrationActive,
      continuityPreserved: true,
      cognitionConverged: true,
      fragilityElevated: false,
    });

    expect(coherence).not.toBeNull();
    expect(coherence?.strategicAlignment).toBe("harmonized");
  });

  it("merges coherence into governance stack snapshot", () => {
    const governance = resolveAdaptiveGovernanceIntelligence({
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

    const coherence = resolveStrategicAlignmentIntegrity({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      adaptiveGovernance: governance.canonical,
      governanceOversightActive: false,
      enterpriseSelfCalibrationActive: false,
      cognitionConverged: true,
      fragilityElevated: false,
    });

    const merged = mergeEnterpriseGovernanceSnapshot(governance, coherence);
    expect(merged.strategicCoherence?.signature).toBe(coherence.signature);
    expect(merged.assistantCoherenceLine.length).toBeGreaterThan(0);
  });
});
