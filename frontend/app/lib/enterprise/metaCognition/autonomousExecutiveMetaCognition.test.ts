import { describe, expect, it } from "vitest";

import { unifiedAdaptiveGovernanceRuntime } from "../governance/runtime/unifiedAdaptiveGovernanceRuntime";

describe("autonomous executive meta-cognition F10:1", () => {
  it("synchronizes full intelligence stack with meta-cognition fields", () => {
    const stack = unifiedAdaptiveGovernanceRuntime.synchronize({
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

    expect(stack.autonomousExecutiveMetaCognition).not.toBeNull();
    expect(stack.strategicSelfAwarenessActive).toBe(true);
    expect(stack.assistantMetaCognitionLine.length).toBeGreaterThan(0);
    expect(stack.unifiedAdaptiveGovernanceRuntime).not.toBeNull();
    expect(stack.institutionalStrategicReflection).not.toBeNull();
    expect(stack.autonomousStrategicForesight).not.toBeNull();
  });

  it("uses attention posture when continuity is not preserved", () => {
    const stack = unifiedAdaptiveGovernanceRuntime.synchronize({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: false,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      institutional: null,
      cognitionConverged: false,
      fragilityElevated: true,
    });

    expect(stack.metaCognitionPosture).toBe("attention");
    expect(stack.reflectionHeadline).toContain("continuity attention");
  });
});
