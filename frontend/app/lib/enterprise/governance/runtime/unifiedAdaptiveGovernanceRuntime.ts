import { synchronizeEnterpriseGovernanceStack } from "../synchronizeEnterpriseGovernanceStack";
import type { ResolveAdaptiveGovernanceIntelligenceInput } from "../resolveAdaptiveGovernanceIntelligence";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../adaptiveGovernanceTypes";
import { mergeUnifiedAdaptiveGovernanceRuntime } from "./mergeUnifiedAdaptiveGovernanceRuntime";
import { resolveUnifiedAdaptiveGovernanceRuntime } from "./resolveUnifiedAdaptiveGovernanceRuntime";
import { unifiedGovernanceRuntimeSynchronizationGovernance } from "./unifiedGovernanceRuntimeSynchronizationGovernance";
import type { UnifiedAdaptiveGovernanceRuntimeSnapshot } from "./unifiedAdaptiveGovernanceTypes";

/**
 * F9:6 — Unified adaptive governance runtime (F9:1–F9:5 convergence + strategic evolution).
 */
export class UnifiedAdaptiveGovernanceRuntime {
  private lastSnapshot: UnifiedAdaptiveGovernanceRuntimeSnapshot | null = null;
  private lastStackSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null = null;

  synchronize(
    input: ResolveAdaptiveGovernanceIntelligenceInput
  ): AdaptiveGovernanceIntelligenceSnapshot {
    const stack = synchronizeEnterpriseGovernanceStack(input);

    const runtime = resolveUnifiedAdaptiveGovernanceRuntime({
      enabled: input.enabled,
      sessionHydrated: input.sessionHydrated,
      continuityPreserved: input.continuityPreserved,
      runtimeStable: input.runtimeStable,
      onboardingActive: input.onboardingActive,
      organizationId: input.organizationId,
      institutional: input.institutional ?? null,
      stack,
      continuityPreserved: input.continuityPreserved,
      cognitionConverged: input.cognitionConverged,
      fragilityElevated: input.fragilityElevated,
    });

    const merged = mergeUnifiedAdaptiveGovernanceRuntime(stack, runtime);
    this.lastSnapshot = runtime;
    this.lastStackSnapshot = merged;
    return merged;
  }

  getLastRuntimeSnapshot(): UnifiedAdaptiveGovernanceRuntimeSnapshot | null {
    return this.lastSnapshot;
  }

  getLastStackSnapshot(): AdaptiveGovernanceIntelligenceSnapshot | null {
    return this.lastStackSnapshot;
  }

  shouldPublish(): boolean {
    return unifiedGovernanceRuntimeSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    this.lastStackSnapshot = null;
    unifiedGovernanceRuntimeSynchronizationGovernance.reset();
  }
}

export const unifiedAdaptiveGovernanceRuntime = new UnifiedAdaptiveGovernanceRuntime();
