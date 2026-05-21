"use client";

import { createContext, useContext } from "react";

import type { AdaptiveGovernanceIntelligenceSnapshot } from "./adaptiveGovernanceTypes";

export type AdaptiveGovernanceIntelligenceContextValue = {
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  snapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  assistantGovernanceLine: string;
  governanceOversightActive: boolean;
  enterpriseSelfCalibrationActive: boolean;
  assistantCoherenceLine: string;
  enterpriseCoherenceActive: boolean;
  strategicAlignmentIntegrityActive: boolean;
  assistantCalibrationLine: string;
  strategicCalibrationActive: boolean;
  decisionQualityCognitionActive: boolean;
  assistantStabilityLine: string;
  executiveStabilityActive: boolean;
  pressureGovernanceActive: boolean;
  assistantAdaptationLine: string;
  organizationalEvolutionActive: boolean;
  adaptationGovernanceActive: boolean;
  assistantUnifiedGovernanceLine: string;
  unifiedGovernanceRuntimeActive: boolean;
  institutionalStrategicEvolutionConverged: boolean;
  assistantMetaCognitionLine: string;
  executiveMetaCognitionActive: boolean;
  strategicSelfAwarenessActive: boolean;
  assistantInstitutionalReflectionLine: string;
  institutionalReflectionActive: boolean;
  cognitiveEvolutionActive: boolean;
  assistantStrategicForesightLine: string;
  strategicForesightActive: boolean;
  futureStateIntelligenceActive: boolean;
  assistantMetaIntelligenceLine: string;
  unifiedStrategicConsciousnessActive: boolean;
  enterpriseMetaIntelligenceActive: boolean;
  assistantInstitutionalIntelligenceLine: string;
  autonomousInstitutionalIntelligenceActive: boolean;
  enterpriseCognitiveRuntimeComplete: boolean;
};

const AdaptiveGovernanceIntelligenceContext =
  createContext<AdaptiveGovernanceIntelligenceContextValue | null>(null);

export function AdaptiveGovernanceIntelligenceProvider({
  value,
  children,
}: {
  value: AdaptiveGovernanceIntelligenceContextValue;
  children: React.ReactNode;
}) {
  return (
    <AdaptiveGovernanceIntelligenceContext.Provider value={value}>
      {children}
    </AdaptiveGovernanceIntelligenceContext.Provider>
  );
}

export function useAdaptiveGovernanceIntelligenceContext(): AdaptiveGovernanceIntelligenceContextValue {
  const ctx = useContext(AdaptiveGovernanceIntelligenceContext);
  if (!ctx) {
    throw new Error(
      "useAdaptiveGovernanceIntelligenceContext must be used within AdaptiveGovernanceIntelligenceProvider"
    );
  }
  return ctx;
}

export function useAdaptiveGovernanceIntelligenceOptional(): AdaptiveGovernanceIntelligenceContextValue | null {
  return useContext(AdaptiveGovernanceIntelligenceContext);
}
