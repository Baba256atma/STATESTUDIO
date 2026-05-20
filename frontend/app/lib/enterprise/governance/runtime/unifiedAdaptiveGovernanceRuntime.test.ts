import { describe, expect, it } from "vitest";

import { unifiedAdaptiveGovernanceRuntime } from "./unifiedAdaptiveGovernanceRuntime";
import { synchronizeEnterpriseGovernanceStack } from "../synchronizeEnterpriseGovernanceStack";

describe("unified adaptive governance runtime F9:6", () => {
  it("synchronizes full F9 stack with unified runtime convergence", () => {
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

    expect(stack.unifiedAdaptiveGovernanceRuntime).not.toBeNull();
    expect(stack.unifiedGovernanceRuntimeActive).toBe(true);
    expect(stack.assistantUnifiedGovernanceLine.length).toBeGreaterThan(0);
    expect(stack.strategicCoherence).not.toBeNull();
    expect(stack.strategicAdaptationGovernance).not.toBeNull();
  });

  it("merges unified headline when strategic evolution converged", () => {
    const base = synchronizeEnterpriseGovernanceStack({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      institutional: {
        convergenceDepth: 5,
        enterpriseEvolutionActive: true,
        institutionalCognitionConverged: true,
      },
      cognitionConverged: true,
      fragilityElevated: false,
    });

    const merged = unifiedAdaptiveGovernanceRuntime.synchronize({
      enabled: true,
      sessionHydrated: true,
      continuityPreserved: true,
      runtimeStable: true,
      onboardingActive: false,
      organizationId: "nexora-ops",
      institutional: {
        convergenceDepth: 5,
        enterpriseEvolutionActive: true,
        institutionalCognitionConverged: true,
      },
      cognitionConverged: true,
      fragilityElevated: false,
    });

    const runtime = merged.unifiedAdaptiveGovernanceRuntime;
    expect(runtime).not.toBeNull();
    if (runtime && merged.unifiedGovernanceRuntimeActive) {
      expect(merged.governanceHeadline).toBe(runtime.unifiedGovernanceHeadline);
    }
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

    expect(stack.evolutionConvergencePosture).toBe("attention");
    expect(stack.unifiedGovernanceHeadline).toContain("continuity attention");
  });
});
