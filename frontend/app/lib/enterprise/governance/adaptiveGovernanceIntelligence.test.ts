import { describe, expect, it } from "vitest";

import { synthesizeAdaptiveGovernanceCognition } from "./synthesizeAdaptiveGovernanceCognition";
import { resolveAdaptiveGovernanceIntelligence } from "./resolveAdaptiveGovernanceIntelligence";

describe("adaptive governance intelligence F9:1", () => {
  it("synthesizes canonical governance when institutional depth is present", () => {
    const cognition = synthesizeAdaptiveGovernanceCognition({
      organizationId: "nexora-ops",
      institutional: {
        convergenceDepth: 4,
        historicalCognitionActive: true,
        behavioralLearningActive: true,
        resilienceEvolutionActive: true,
        strategicEvolutionActive: true,
        cognitiveCultureActive: false,
        enterpriseEvolutionActive: false,
        institutionalCognitionConverged: false,
      },
      continuityPreserved: true,
      cognitionConverged: true,
      fragilityElevated: false,
    });

    expect(cognition).not.toBeNull();
    expect(cognition?.governanceStability).toBe("stable");
    expect(cognition?.strategicAlignment).toBe("forming");
  });

  it("resolves oversight-active snapshot when aligned and stable", () => {
    const snapshot = resolveAdaptiveGovernanceIntelligence({
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

    expect(snapshot.oversightPosture).toBe("oversight_active");
    expect(snapshot.governanceOversightActive).toBe(true);
    expect(snapshot.assistantGovernanceLine).toContain("without claiming executive replacement");
  });
});
