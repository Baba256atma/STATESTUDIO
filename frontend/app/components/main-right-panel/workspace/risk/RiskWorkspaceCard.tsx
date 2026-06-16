"use client";

import React from "react";

import type { RiskWorkspaceCardView } from "../../../../lib/ui/mrpWorkspace/risk/riskWorkspaceContract.ts";
import {
  riskCardDetailStyle,
  riskCardHeadlineStyle,
  riskCardStyle,
  riskSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/risk/riskVisualContract.ts";

export type RiskWorkspaceCardProps = Readonly<{
  card: RiskWorkspaceCardView;
}>;

export function RiskWorkspaceCard(props: RiskWorkspaceCardProps): React.ReactElement {
  const { card } = props;

  return (
    <article
      data-nx="risk-workspace-card"
      data-risk-section={card.id}
      style={riskCardStyle(card.tone)}
    >
      <div style={riskSectionLabelStyle()}>{card.label}</div>
      <div style={riskCardHeadlineStyle(card.tone)}>{card.headline}</div>
      <p style={riskCardDetailStyle()}>{card.detail}</p>
    </article>
  );
}

export default RiskWorkspaceCard;
