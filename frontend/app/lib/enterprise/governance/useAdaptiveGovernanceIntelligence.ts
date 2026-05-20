"use client";

import { useEffect, useMemo, useRef } from "react";

import { institutionalStrategicAdaptationGovernanceLayer } from "./adaptation/institutionalStrategicAdaptationGovernanceLayer";
import { publishInstitutionalStrategicAdaptationGovernanceSnapshot } from "./adaptation/strategicAdaptationGovernancePublish";
import {
  reportAdaptationSyncInstability,
  reportTransformationContinuityViolation,
} from "./adaptation/strategicAdaptationGovernanceDiagnostics";
import { publishAdaptiveStrategicCalibrationSnapshot } from "./calibration/strategicCalibrationPublish";
import { adaptiveStrategicCalibrationLayer } from "./calibration/adaptiveStrategicCalibrationLayer";
import {
  reportCalibrationSyncInstability,
  reportRefinementContinuityViolation,
} from "./calibration/strategicCalibrationDiagnostics";
import { publishStrategicAlignmentIntegritySnapshot } from "./coherence/strategicCoherencePublish";
import { strategicAlignmentIntegrityLayer } from "./coherence/strategicAlignmentIntegrityLayer";
import {
  reportAlignmentContinuityViolation,
  reportCoherenceSyncInstability,
} from "./coherence/strategicCoherenceDiagnostics";
import { adaptiveGovernanceIntelligenceLayer } from "./adaptiveGovernanceIntelligenceLayer";
import { publishAdaptiveGovernanceIntelligenceSnapshot } from "./adaptiveGovernancePublish";
import {
  reportGovernanceSyncInstability,
  reportStrategicContinuityViolation,
} from "./adaptiveGovernanceDiagnostics";
import { institutionalStrategicPressureGovernanceLayer } from "./pressure/institutionalStrategicPressureGovernanceLayer";
import { publishInstitutionalStrategicPressureGovernanceSnapshot } from "./pressure/strategicPressureGovernancePublish";
import {
  reportPressureGovernanceSyncInstability,
  reportStabilityContinuityViolation,
} from "./pressure/strategicPressureGovernanceDiagnostics";
import { unifiedAdaptiveGovernanceRuntime } from "./runtime/unifiedAdaptiveGovernanceRuntime";
import { publishUnifiedAdaptiveGovernanceRuntimeSnapshot } from "./runtime/unifiedAdaptiveGovernancePublish";
import {
  reportInstitutionalContinuityViolation,
  reportUnifiedGovernanceSyncInstability,
} from "./runtime/unifiedAdaptiveGovernanceDiagnostics";
import type { AdaptiveGovernanceIntelligenceContextValue } from "./adaptiveGovernanceIntelligenceContext";
import type { InstitutionalCognitionConvergenceInput } from "./adaptiveGovernanceTypes";

export type UseAdaptiveGovernanceIntelligenceOptions = {
  enabled?: boolean;
  sessionHydrated?: boolean;
  continuityPreserved?: boolean;
  runtimeStable?: boolean;
  onboardingActive?: boolean;
  organizationId?: string;
  cognitionConverged?: boolean;
  fragilityElevated?: boolean;
  institutional?: InstitutionalCognitionConvergenceInput | null;
};

export function useAdaptiveGovernanceIntelligence(
  options: UseAdaptiveGovernanceIntelligenceOptions = {}
): AdaptiveGovernanceIntelligenceContextValue {
  const {
    enabled: enabledOption = true,
    sessionHydrated = true,
    continuityPreserved = true,
    runtimeStable = true,
    onboardingActive = false,
    organizationId = "nexora-default",
    cognitionConverged = false,
    fragilityElevated = false,
    institutional = null,
  } = options;

  const enabled = enabledOption && sessionHydrated;
  const lastSignatureRef = useRef<string | null>(null);
  const lastCoherenceSignatureRef = useRef<string | null>(null);
  const lastCalibrationSignatureRef = useRef<string | null>(null);
  const lastPressureSignatureRef = useRef<string | null>(null);
  const lastAdaptationSignatureRef = useRef<string | null>(null);
  const lastUnifiedRuntimeSignatureRef = useRef<string | null>(null);

  const snapshot = useMemo(() => {
    if (!enabled) return null;

    if (!continuityPreserved) {
      reportStrategicContinuityViolation(
        "adaptive governance cognition paused — continuity not preserved"
      );
      reportAlignmentContinuityViolation(
        "strategic alignment integrity paused — coherence continuity not preserved"
      );
      reportRefinementContinuityViolation(
        "strategic calibration paused — refinement continuity not preserved"
      );
      reportStabilityContinuityViolation(
        "strategic pressure governance paused — executive stability continuity not preserved"
      );
      reportTransformationContinuityViolation(
        "strategic adaptation governance paused — transformation continuity not preserved"
      );
      reportInstitutionalContinuityViolation(
        "unified adaptive governance paused — institutional strategic evolution continuity not preserved"
      );
    }

    return adaptiveGovernanceIntelligenceLayer.synchronize({
      enabled: true,
      sessionHydrated,
      continuityPreserved,
      runtimeStable,
      onboardingActive,
      organizationId,
      institutional,
      cognitionConverged,
      fragilityElevated,
    });
  }, [
    enabled,
    sessionHydrated,
    continuityPreserved,
    runtimeStable,
    onboardingActive,
    organizationId,
    institutional,
    cognitionConverged,
    fragilityElevated,
  ]);

  useEffect(() => {
    if (!snapshot?.unifiedAdaptiveGovernanceRuntime) return;
    const runtime = snapshot.unifiedAdaptiveGovernanceRuntime;
    if (runtime.signature === lastUnifiedRuntimeSignatureRef.current) return;
    if (!unifiedAdaptiveGovernanceRuntime.shouldPublish()) {
      reportUnifiedGovernanceSyncInstability(
        "unified runtime publish paced — skipping redundant evolution convergence snapshot"
      );
      return;
    }
    lastUnifiedRuntimeSignatureRef.current = runtime.signature;
    publishUnifiedAdaptiveGovernanceRuntimeSnapshot(runtime);
  }, [snapshot?.unifiedAdaptiveGovernanceRuntime]);

  useEffect(() => {
    if (!snapshot?.strategicAdaptationGovernance) return;
    const adaptation = snapshot.strategicAdaptationGovernance;
    if (adaptation.signature === lastAdaptationSignatureRef.current) return;
    if (!institutionalStrategicAdaptationGovernanceLayer.shouldPublish()) {
      reportAdaptationSyncInstability(
        "adaptation publish paced — skipping redundant evolution governance snapshot"
      );
      return;
    }
    lastAdaptationSignatureRef.current = adaptation.signature;
    publishInstitutionalStrategicAdaptationGovernanceSnapshot(adaptation);
  }, [snapshot?.strategicAdaptationGovernance]);

  useEffect(() => {
    if (!snapshot?.strategicPressureGovernance) return;
    const pressure = snapshot.strategicPressureGovernance;
    if (pressure.signature === lastPressureSignatureRef.current) return;
    if (!institutionalStrategicPressureGovernanceLayer.shouldPublish()) {
      reportPressureGovernanceSyncInstability(
        "pressure governance publish paced — skipping redundant stability snapshot"
      );
      return;
    }
    lastPressureSignatureRef.current = pressure.signature;
    publishInstitutionalStrategicPressureGovernanceSnapshot(pressure);
  }, [snapshot?.strategicPressureGovernance]);

  useEffect(() => {
    if (!snapshot?.strategicCalibration) return;
    const calibration = snapshot.strategicCalibration;
    if (calibration.signature === lastCalibrationSignatureRef.current) return;
    if (!adaptiveStrategicCalibrationLayer.shouldPublish()) {
      reportCalibrationSyncInstability(
        "calibration publish paced — skipping redundant strategic calibration snapshot"
      );
      return;
    }
    lastCalibrationSignatureRef.current = calibration.signature;
    publishAdaptiveStrategicCalibrationSnapshot(calibration);
  }, [snapshot?.strategicCalibration]);

  useEffect(() => {
    if (!snapshot?.strategicCoherence) return;
    const coherence = snapshot.strategicCoherence;
    if (coherence.signature === lastCoherenceSignatureRef.current) return;
    if (!strategicAlignmentIntegrityLayer.shouldPublish()) {
      reportCoherenceSyncInstability(
        "coherence publish paced — skipping redundant alignment integrity snapshot"
      );
      return;
    }
    lastCoherenceSignatureRef.current = coherence.signature;
    publishStrategicAlignmentIntegritySnapshot(coherence);
  }, [snapshot?.strategicCoherence]);

  useEffect(() => {
    if (!snapshot) return;
    if (snapshot.signature === lastSignatureRef.current) return;
    if (!adaptiveGovernanceIntelligenceLayer.shouldPublish()) {
      reportGovernanceSyncInstability(
        "governance publish paced — skipping redundant adaptive governance snapshot"
      );
      return;
    }
    lastSignatureRef.current = snapshot.signature;
    publishAdaptiveGovernanceIntelligenceSnapshot(snapshot);
  }, [snapshot]);

  return useMemo(
    () => ({
      enabled: Boolean(snapshot),
      hydrated: snapshot?.hydrated ?? false,
      visible: snapshot?.visible ?? false,
      snapshot,
      assistantGovernanceLine: snapshot?.assistantGovernanceLine ?? "",
      governanceOversightActive: snapshot?.governanceOversightActive ?? false,
      enterpriseSelfCalibrationActive: snapshot?.enterpriseSelfCalibrationActive ?? false,
      assistantCoherenceLine: snapshot?.assistantCoherenceLine ?? "",
      enterpriseCoherenceActive: snapshot?.enterpriseCoherenceActive ?? false,
      strategicAlignmentIntegrityActive:
        snapshot?.strategicAlignmentIntegrityActive ?? false,
      assistantCalibrationLine: snapshot?.assistantCalibrationLine ?? "",
      strategicCalibrationActive: snapshot?.strategicCalibrationActive ?? false,
      decisionQualityCognitionActive: snapshot?.decisionQualityCognitionActive ?? false,
      assistantStabilityLine: snapshot?.assistantStabilityLine ?? "",
      executiveStabilityActive: snapshot?.executiveStabilityActive ?? false,
      pressureGovernanceActive: snapshot?.pressureGovernanceActive ?? false,
      assistantAdaptationLine: snapshot?.assistantAdaptationLine ?? "",
      organizationalEvolutionActive: snapshot?.organizationalEvolutionActive ?? false,
      adaptationGovernanceActive: snapshot?.adaptationGovernanceActive ?? false,
      assistantUnifiedGovernanceLine: snapshot?.assistantUnifiedGovernanceLine ?? "",
      unifiedGovernanceRuntimeActive: snapshot?.unifiedGovernanceRuntimeActive ?? false,
      institutionalStrategicEvolutionConverged:
        snapshot?.institutionalStrategicEvolutionConverged ?? false,
    }),
    [snapshot]
  );
}
