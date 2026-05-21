import { autonomousExecutiveMetaCognitionLayer } from "../../metaCognition/autonomousExecutiveMetaCognitionLayer";
import { mergeExecutiveMetaCognition } from "../../metaCognition/mergeExecutiveMetaCognition";
import { institutionalStrategicReflectionLayer } from "../../metaCognition/reflection/institutionalStrategicReflectionLayer";
import { mergeInstitutionalStrategicReflection } from "../../metaCognition/reflection/mergeInstitutionalStrategicReflection";
import { autonomousStrategicForesightLayer } from "../../metaCognition/foresight/autonomousStrategicForesightLayer";
import { mergeAutonomousStrategicForesight } from "../../metaCognition/foresight/mergeAutonomousStrategicForesight";
import { unifiedStrategicConsciousnessRuntime } from "../../metaCognition/consciousness/unifiedStrategicConsciousnessRuntime";
import { mergeUnifiedStrategicConsciousness } from "../../metaCognition/consciousness/mergeUnifiedStrategicConsciousness";
import { autonomousInstitutionalIntelligenceRuntime } from "../../metaCognition/institutionalRuntime/autonomousInstitutionalIntelligenceRuntime";
import { mergeAutonomousInstitutionalIntelligence } from "../../metaCognition/institutionalRuntime/mergeAutonomousInstitutionalIntelligence";
import { synchronizeEnterpriseGovernanceStack } from "../synchronizeEnterpriseGovernanceStack";
import type { ResolveAdaptiveGovernanceIntelligenceInput } from "../resolveAdaptiveGovernanceIntelligence";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../adaptiveGovernanceTypes";
import { mergeUnifiedAdaptiveGovernanceRuntime } from "./mergeUnifiedAdaptiveGovernanceRuntime";
import { resolveUnifiedAdaptiveGovernanceRuntime } from "./resolveUnifiedAdaptiveGovernanceRuntime";
import { unifiedGovernanceRuntimeSynchronizationGovernance } from "./unifiedGovernanceRuntimeSynchronizationGovernance";
import type { UnifiedAdaptiveGovernanceRuntimeSnapshot } from "./unifiedAdaptiveGovernanceTypes";

/**
 * F9:6 + F10:1–F10:6 — Complete enterprise cognitive runtime (F-Series completion).
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

    const stackWithRuntime = mergeUnifiedAdaptiveGovernanceRuntime(stack, runtime);

    const metaCognition = autonomousExecutiveMetaCognitionLayer.synchronize({
      enabled: input.enabled,
      sessionHydrated: input.sessionHydrated,
      continuityPreserved: input.continuityPreserved,
      runtimeStable: input.runtimeStable,
      onboardingActive: input.onboardingActive,
      organizationId: input.organizationId,
      governanceStack: stackWithRuntime,
      cognitionConverged: input.cognitionConverged,
      fragilityElevated: input.fragilityElevated,
    });

    const stackWithMeta = mergeExecutiveMetaCognition(stackWithRuntime, metaCognition);

    const reflection = institutionalStrategicReflectionLayer.synchronize({
      enabled: input.enabled,
      sessionHydrated: input.sessionHydrated,
      continuityPreserved: input.continuityPreserved,
      runtimeStable: input.runtimeStable,
      onboardingActive: input.onboardingActive,
      organizationId: input.organizationId,
      intelligenceStack: stackWithMeta,
      cognitionConverged: input.cognitionConverged,
      fragilityElevated: input.fragilityElevated,
    });

    const stackWithReflection = mergeInstitutionalStrategicReflection(stackWithMeta, reflection);

    const foresight = autonomousStrategicForesightLayer.synchronize({
      enabled: input.enabled,
      sessionHydrated: input.sessionHydrated,
      continuityPreserved: input.continuityPreserved,
      runtimeStable: input.runtimeStable,
      onboardingActive: input.onboardingActive,
      organizationId: input.organizationId,
      intelligenceStack: stackWithReflection,
      cognitionConverged: input.cognitionConverged,
      fragilityElevated: input.fragilityElevated,
    });

    const stackWithForesight = mergeAutonomousStrategicForesight(stackWithReflection, foresight);

    const consciousness = unifiedStrategicConsciousnessRuntime.synchronize({
      enabled: input.enabled,
      sessionHydrated: input.sessionHydrated,
      continuityPreserved: input.continuityPreserved,
      runtimeStable: input.runtimeStable,
      onboardingActive: input.onboardingActive,
      organizationId: input.organizationId,
      intelligenceStack: stackWithForesight,
      cognitionConverged: input.cognitionConverged,
      fragilityElevated: input.fragilityElevated,
    });

    const stackWithConsciousness = mergeUnifiedStrategicConsciousness(stackWithForesight, consciousness);

    const institutional = autonomousInstitutionalIntelligenceRuntime.synchronize({
      enabled: input.enabled,
      sessionHydrated: input.sessionHydrated,
      continuityPreserved: input.continuityPreserved,
      runtimeStable: input.runtimeStable,
      onboardingActive: input.onboardingActive,
      organizationId: input.organizationId,
      intelligenceStack: stackWithConsciousness,
      cognitionConverged: input.cognitionConverged,
      fragilityElevated: input.fragilityElevated,
    });

    const merged = mergeAutonomousInstitutionalIntelligence(stackWithConsciousness, institutional);
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
    autonomousExecutiveMetaCognitionLayer.reset();
    institutionalStrategicReflectionLayer.reset();
    autonomousStrategicForesightLayer.reset();
    unifiedStrategicConsciousnessRuntime.reset();
    autonomousInstitutionalIntelligenceRuntime.reset();
  }
}

export const unifiedAdaptiveGovernanceRuntime = new UnifiedAdaptiveGovernanceRuntime();
