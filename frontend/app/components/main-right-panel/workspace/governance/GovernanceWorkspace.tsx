"use client";

import React from "react";

import { traceGovernancePolicyIntelligenceOnce } from "../../../../lib/ui/mrpWorkspace/governance/governancePolicyConstraintIntelligenceRuntime.ts";
import { traceGovernanceApprovalLayerOnce } from "../../../../lib/ui/mrpWorkspace/governance/governanceApprovalLayerIntelligenceRuntime.ts";
import { traceGovernanceDecisionGateOnce } from "../../../../lib/ui/mrpWorkspace/governance/governanceDecisionGateRuntime.ts";
import {
  hydrateGovernanceWorkspaceStateOnMount,
  teardownGovernanceWorkspaceStateOnUnmount,
  traceGovernanceFoundationOnce,
  traceGovernanceRuntimeOnce,
} from "../../../../lib/ui/mrpWorkspace/governance/governanceWorkspaceRuntime.ts";
import { traceGovernanceFoundationBoundaryOnce } from "../../../../lib/ui/mrpWorkspace/governance/governanceWorkspaceFoundationBoundary.ts";
import { useGovernanceWorkspaceView } from "../../../../lib/ui/mrpWorkspace/governance/useGovernanceWorkspaceState.ts";
import { useSyncGovernanceWorkspaceContext } from "../../../../lib/ui/mrpWorkspace/governance/useSyncGovernanceWorkspaceContext.ts";
import {
  governanceHeaderPurposeStyle,
  governanceHeaderSubtitleStyle,
  governanceHeaderTitleStyle,
  governanceInsightGridStyle,
  governanceWorkspaceShellStyle,
  traceGovernanceVisualPassOnce,
} from "../../../../lib/ui/mrpWorkspace/governance/governanceVisualContract.ts";
import { GovernanceWorkspacePanel } from "./GovernanceWorkspacePanel.tsx";
import { PolicyAlignmentIntelligencePanel } from "./PolicyAlignmentIntelligencePanel.tsx";
import { ConstraintReviewIntelligencePanel } from "./ConstraintReviewIntelligencePanel.tsx";
import {
  ApprovalChainIntelligencePanel,
  AuthorityReviewIntelligencePanel,
  StakeholderImpactIntelligencePanel,
} from "./GovernanceApprovalIntelligencePanel.tsx";
import { GovernanceDecisionGatePanel } from "./GovernanceDecisionGatePanel.tsx";

export type GovernanceWorkspaceProps = Readonly<{
  mountKey: string;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectType?: string | null;
  selectedObjectStatus?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export function GovernanceWorkspace(props: GovernanceWorkspaceProps): React.ReactElement {
  const view = useGovernanceWorkspaceView();

  useSyncGovernanceWorkspaceContext({
    selectedObjectId: props.selectedObjectId,
    selectedObjectLabel: props.selectedObjectLabel,
    routeObjectId: props.routeObjectId,
    routeObjectName: props.routeObjectName,
  });

  React.useEffect(() => {
    hydrateGovernanceWorkspaceStateOnMount(props.mountKey);
    traceGovernanceFoundationOnce(props.mountKey);
    traceGovernanceRuntimeOnce(props.mountKey);
    traceGovernanceVisualPassOnce(props.mountKey);
    traceGovernanceFoundationBoundaryOnce(props.mountKey);
    traceGovernancePolicyIntelligenceOnce(props.mountKey);
    traceGovernanceApprovalLayerOnce(props.mountKey);
    traceGovernanceDecisionGateOnce(props.mountKey);

    return () => {
      teardownGovernanceWorkspaceStateOnUnmount(props.mountKey);
    };
  }, [props.mountKey]);

  return (
    <div
      id="nexora-governance-workspace"
      data-nx="governance-workspace"
      data-mrp-workspace-id="governance"
      data-mrp-workspace-mount-key={props.mountKey}
      data-governance-phase={view.phase}
      data-governance-revision={view.revision}
      data-governance-object-selected={view.selectedObjectId ? "true" : "false"}
      data-governance-runtime-source={view.source}
      data-governance-visual-pass="true"
      data-governance-policy-intelligence="true"
      data-governance-constraint-intelligence="true"
      data-governance-approval-layer="true"
      data-governance-decision-gate="true"
      data-governance-decision-outcome={view.decisionGate.outcome}
      data-governance-owns-review-only="true"
      data-mrp-governance-runtime="true"
      style={governanceWorkspaceShellStyle()}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <h2 style={governanceHeaderTitleStyle()}>{view.title}</h2>
        <p style={governanceHeaderSubtitleStyle()}>{view.subtitle}</p>
        <p style={governanceHeaderPurposeStyle()}>{view.scanPurpose}</p>
      </header>

      <section
        data-nx="governance-workspace-panels"
        aria-label="Governance review panels"
        style={governanceInsightGridStyle()}
      >
        {view.panels
          .filter((panel) => panel.id === "governance_summary")
          .map((panel) => (
            <GovernanceWorkspacePanel key={panel.id} panel={panel} />
          ))}
        <PolicyAlignmentIntelligencePanel
          intelligence={view.policyIntelligence}
          phase={view.phase}
        />
        <ConstraintReviewIntelligencePanel
          intelligence={view.constraintIntelligence}
          phase={view.phase}
        />
        <ApprovalChainIntelligencePanel
          intelligence={view.approvalLayerIntelligence.approvalChain}
          phase={view.phase}
        />
        <StakeholderImpactIntelligencePanel
          intelligence={view.approvalLayerIntelligence.stakeholderImpact}
          phase={view.phase}
        />
        <AuthorityReviewIntelligencePanel
          intelligence={view.approvalLayerIntelligence.authorityReview}
          phase={view.phase}
        />
        <GovernanceDecisionGatePanel decisionGate={view.decisionGate} phase={view.phase} />
      </section>
    </div>
  );
}

export default GovernanceWorkspace;
