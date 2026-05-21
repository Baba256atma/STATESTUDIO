import { institutionalStrategicAdaptationGovernanceLayer } from "./adaptation/institutionalStrategicAdaptationGovernanceLayer";
import { adaptiveStrategicCalibrationLayer } from "./calibration/adaptiveStrategicCalibrationLayer";
import { institutionalStrategicPressureGovernanceLayer } from "./pressure/institutionalStrategicPressureGovernanceLayer";
import { strategicAlignmentIntegrityLayer } from "./coherence/strategicAlignmentIntegrityLayer";
import { governanceSynchronizationGovernance } from "./governanceSynchronizationGovernance";
import { autonomousExecutiveMetaCognitionLayer } from "../metaCognition/autonomousExecutiveMetaCognitionLayer";
import { institutionalStrategicReflectionLayer } from "../metaCognition/reflection/institutionalStrategicReflectionLayer";
import { autonomousStrategicForesightLayer } from "../metaCognition/foresight/autonomousStrategicForesightLayer";
import { unifiedStrategicConsciousnessRuntime } from "../metaCognition/consciousness/unifiedStrategicConsciousnessRuntime";
import { autonomousInstitutionalIntelligenceRuntime } from "../metaCognition/institutionalRuntime/autonomousInstitutionalIntelligenceRuntime";
import { unifiedAdaptiveGovernanceRuntime } from "./runtime/unifiedAdaptiveGovernanceRuntime";
import type { ResolveAdaptiveGovernanceIntelligenceInput } from "./resolveAdaptiveGovernanceIntelligence";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "./adaptiveGovernanceTypes";

/**
 * F9 — Adaptive governance intelligence layer (delegates to unified F9:6 runtime).
 */
export class AdaptiveGovernanceIntelligenceLayer {
  private lastSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null = null;

  synchronize(
    input: ResolveAdaptiveGovernanceIntelligenceInput
  ): AdaptiveGovernanceIntelligenceSnapshot {
    const snapshot = unifiedAdaptiveGovernanceRuntime.synchronize(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): AdaptiveGovernanceIntelligenceSnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return governanceSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    governanceSynchronizationGovernance.reset();
    strategicAlignmentIntegrityLayer.reset();
    adaptiveStrategicCalibrationLayer.reset();
    institutionalStrategicPressureGovernanceLayer.reset();
    institutionalStrategicAdaptationGovernanceLayer.reset();
    unifiedAdaptiveGovernanceRuntime.reset();
    autonomousExecutiveMetaCognitionLayer.reset();
    institutionalStrategicReflectionLayer.reset();
    autonomousStrategicForesightLayer.reset();
    unifiedStrategicConsciousnessRuntime.reset();
    autonomousInstitutionalIntelligenceRuntime.reset();
  }
}

export const adaptiveGovernanceIntelligenceLayer = new AdaptiveGovernanceIntelligenceLayer();
