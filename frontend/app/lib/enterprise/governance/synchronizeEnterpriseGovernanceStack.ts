import { adaptiveStrategicCalibrationLayer } from "./calibration/adaptiveStrategicCalibrationLayer";
import { mergeStrategicCalibration } from "./calibration/mergeStrategicCalibration";
import { mergeStrategicAdaptationGovernance } from "./adaptation/mergeStrategicAdaptationGovernance";
import { institutionalStrategicAdaptationGovernanceLayer } from "./adaptation/institutionalStrategicAdaptationGovernanceLayer";
import { mergeStrategicPressureGovernance } from "./pressure/mergeStrategicPressureGovernance";
import { institutionalStrategicPressureGovernanceLayer } from "./pressure/institutionalStrategicPressureGovernanceLayer";
import { mergeEnterpriseGovernanceSnapshot } from "./coherence/mergeEnterpriseGovernanceSnapshot";
import { strategicAlignmentIntegrityLayer } from "./coherence/strategicAlignmentIntegrityLayer";
import { resolveAdaptiveGovernanceIntelligence } from "./resolveAdaptiveGovernanceIntelligence";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "./adaptiveGovernanceTypes";
import type { ResolveAdaptiveGovernanceIntelligenceInput } from "./resolveAdaptiveGovernanceIntelligence";

/**
 * F9 — Enterprise governance stack pipeline: F9:1 → F9:2 → F9:3 → F9:4 → F9:5.
 */
export function synchronizeEnterpriseGovernanceStack(
  input: ResolveAdaptiveGovernanceIntelligenceInput
): AdaptiveGovernanceIntelligenceSnapshot {
  const governance = resolveAdaptiveGovernanceIntelligence(input);

  const coherence = strategicAlignmentIntegrityLayer.synchronize({
    enabled: input.enabled,
    sessionHydrated: input.sessionHydrated,
    continuityPreserved: input.continuityPreserved,
    runtimeStable: input.runtimeStable,
    onboardingActive: input.onboardingActive,
    organizationId: input.organizationId,
    adaptiveGovernance: governance.canonical,
    governanceOversightActive: governance.governanceOversightActive,
    enterpriseSelfCalibrationActive: governance.enterpriseSelfCalibrationActive,
    cognitionConverged: input.cognitionConverged,
    fragilityElevated: input.fragilityElevated,
  });

  const stackWithCoherence = mergeEnterpriseGovernanceSnapshot(governance, coherence);

  const calibration = adaptiveStrategicCalibrationLayer.synchronize({
    enabled: input.enabled,
    sessionHydrated: input.sessionHydrated,
    continuityPreserved: input.continuityPreserved,
    runtimeStable: input.runtimeStable,
    onboardingActive: input.onboardingActive,
    organizationId: input.organizationId,
    adaptiveGovernance: governance.canonical,
    strategicCoherence: coherence.canonical,
    enterpriseCoherenceActive: coherence.enterpriseCoherenceActive,
    governanceOversightActive: governance.governanceOversightActive,
    cognitionConverged: input.cognitionConverged,
    fragilityElevated: input.fragilityElevated,
  });

  const stackWithCalibration = mergeStrategicCalibration(stackWithCoherence, calibration);

  const pressure = institutionalStrategicPressureGovernanceLayer.synchronize({
    enabled: input.enabled,
    sessionHydrated: input.sessionHydrated,
    continuityPreserved: input.continuityPreserved,
    runtimeStable: input.runtimeStable,
    onboardingActive: input.onboardingActive,
    organizationId: input.organizationId,
    adaptiveGovernance: governance.canonical,
    strategicCoherence: coherence.canonical,
    strategicCalibration: calibration.canonical,
    fragilityElevated: input.fragilityElevated,
    governanceOversightActive: governance.governanceOversightActive,
    strategicCalibrationActive: calibration.strategicCalibrationActive,
    enterpriseCoherenceActive: coherence.enterpriseCoherenceActive,
    cognitionConverged: input.cognitionConverged,
  });

  const stackWithPressure = mergeStrategicPressureGovernance(stackWithCalibration, pressure);

  const adaptation = institutionalStrategicAdaptationGovernanceLayer.synchronize({
    enabled: input.enabled,
    sessionHydrated: input.sessionHydrated,
    continuityPreserved: input.continuityPreserved,
    runtimeStable: input.runtimeStable,
    onboardingActive: input.onboardingActive,
    organizationId: input.organizationId,
    institutional: input.institutional ?? null,
    adaptiveGovernance: governance.canonical,
    strategicCoherence: coherence.canonical,
    strategicCalibration: calibration.canonical,
    strategicPressure: pressure.canonical,
    fragilityElevated: input.fragilityElevated,
    governanceOversightActive: governance.governanceOversightActive,
    enterpriseCoherenceActive: coherence.enterpriseCoherenceActive,
    strategicCalibrationActive: calibration.strategicCalibrationActive,
    executiveStabilityActive: pressure.executiveStabilityActive,
    pressureGovernanceActive: pressure.pressureGovernanceActive,
    cognitionConverged: input.cognitionConverged,
  });

  return mergeStrategicAdaptationGovernance(stackWithPressure, adaptation);
}
