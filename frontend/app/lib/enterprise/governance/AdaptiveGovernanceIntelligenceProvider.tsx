"use client";

import React from "react";

import { ExecutiveAdaptiveGovernanceShellSync } from "./ExecutiveAdaptiveGovernanceShellSync";
import {
  AdaptiveGovernanceIntelligenceProvider as GovernanceContextProvider,
} from "./adaptiveGovernanceIntelligenceContext";
import { useAdaptiveGovernanceIntelligence } from "./useAdaptiveGovernanceIntelligence";
import type { InstitutionalCognitionConvergenceInput } from "./adaptiveGovernanceTypes";

export type AdaptiveGovernanceIntelligenceRootProviderProps = {
  children: React.ReactNode;
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

/**
 * F9:1 — Single provider boundary for adaptive governance (anti-flash: one context, no nesting).
 */
export function AdaptiveGovernanceIntelligenceRootProvider(
  props: AdaptiveGovernanceIntelligenceRootProviderProps
) {
  const value = useAdaptiveGovernanceIntelligence({
    enabled: props.enabled,
    sessionHydrated: props.sessionHydrated,
    continuityPreserved: props.continuityPreserved,
    runtimeStable: props.runtimeStable,
    onboardingActive: props.onboardingActive,
    organizationId: props.organizationId,
    cognitionConverged: props.cognitionConverged,
    fragilityElevated: props.fragilityElevated,
    institutional: props.institutional,
  });

  return (
    <GovernanceContextProvider value={value}>
      <ExecutiveAdaptiveGovernanceShellSync />
      {props.children}
    </GovernanceContextProvider>
  );
}
