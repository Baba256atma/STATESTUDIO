"use client";

import React from "react";

import type {
  ApprovalChainIntelligenceSurface,
  AuthorityReviewIntelligenceSurface,
  StakeholderImpactIntelligenceSurface,
} from "../../../../lib/ui/mrpWorkspace/governance/governanceApprovalLayerIntelligenceContract.ts";
import {
  governanceApprovalLayerStatusStyle,
  governanceIntelligenceQuestionStyle,
  governanceIntelligenceRowDetailStyle,
  governanceIntelligenceRowStyle,
  governanceIntelligenceShellStyle,
  governancePanelHeadlineStyle,
  governanceSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/governance/governanceVisualContract.ts";

export type GovernanceApprovalIntelligencePanelProps = Readonly<{
  intelligence:
    | ApprovalChainIntelligenceSurface
    | StakeholderImpactIntelligenceSurface
    | AuthorityReviewIntelligenceSurface;
  phase: "loading" | "ready" | "empty";
}>;

export function GovernanceApprovalIntelligencePanel(
  props: GovernanceApprovalIntelligencePanelProps
): React.ReactElement {
  const loading = props.phase === "loading";
  const { intelligence } = props;
  const warRoomOwnsCommitment =
    "warRoomOwnsCommitment" in intelligence ? intelligence.warRoomOwnsCommitment : false;

  return (
    <article
      data-nx={`governance-${intelligence.panelId}-panel`}
      data-governance-section={intelligence.panelId}
      data-governance-approval-read-only="true"
      data-governance-approval-overall-status={intelligence.overallStatus}
      data-governance-may-evaluate="true"
      data-governance-may-execute="false"
      data-governance-war-room-owns-commitment={warRoomOwnsCommitment ? "true" : "false"}
      style={governanceIntelligenceShellStyle()}
    >
      <div style={governanceSectionLabelStyle()}>{intelligence.label}</div>
      <div style={governancePanelHeadlineStyle("neutral")}>
        {intelligence.question} — {intelligence.overallStatus}
      </div>
      <p style={governanceIntelligenceRowDetailStyle()}>
        Governance evaluates approval posture only — no execution authority.
      </p>

      {loading ? (
        <p style={governanceIntelligenceRowDetailStyle()}>Loading approval intelligence…</p>
      ) : (
        intelligence.rows.map((row) => (
          <div
            key={row.id}
            data-governance-approval-row={row.id}
            data-governance-approval-status={row.status}
            style={governanceIntelligenceRowStyle()}
          >
            <div style={governanceIntelligenceQuestionStyle()}>{row.label}</div>
            <div style={governanceApprovalLayerStatusStyle(row.status)}>{row.status}</div>
            <p style={governanceIntelligenceRowDetailStyle()}>{row.detail}</p>
          </div>
        ))
      )}
    </article>
  );
}

export function ApprovalChainIntelligencePanel(
  props: Readonly<{
    intelligence: ApprovalChainIntelligenceSurface;
    phase: "loading" | "ready" | "empty";
  }>
): React.ReactElement {
  return <GovernanceApprovalIntelligencePanel intelligence={props.intelligence} phase={props.phase} />;
}

export function StakeholderImpactIntelligencePanel(
  props: Readonly<{
    intelligence: StakeholderImpactIntelligenceSurface;
    phase: "loading" | "ready" | "empty";
  }>
): React.ReactElement {
  return <GovernanceApprovalIntelligencePanel intelligence={props.intelligence} phase={props.phase} />;
}

export function AuthorityReviewIntelligencePanel(
  props: Readonly<{
    intelligence: AuthorityReviewIntelligenceSurface;
    phase: "loading" | "ready" | "empty";
  }>
): React.ReactElement {
  return <GovernanceApprovalIntelligencePanel intelligence={props.intelligence} phase={props.phase} />;
}

export default GovernanceApprovalIntelligencePanel;
