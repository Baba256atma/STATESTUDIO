"use client";

import React, { memo } from "react";

import { useAdaptiveGovernanceIntelligenceOptional } from "../../../lib/enterprise/governance";
import { EnterpriseAdaptiveGovernanceStrip } from "./EnterpriseAdaptiveGovernanceStrip";

function EnterpriseAdaptiveGovernanceHostComponent(): React.ReactElement | null {
  const governance = useAdaptiveGovernanceIntelligenceOptional();
  if (!governance?.visible || !governance.snapshot) return null;
  return <EnterpriseAdaptiveGovernanceStrip governance={governance.snapshot} />;
}

export const EnterpriseAdaptiveGovernanceHost = memo(EnterpriseAdaptiveGovernanceHostComponent);
