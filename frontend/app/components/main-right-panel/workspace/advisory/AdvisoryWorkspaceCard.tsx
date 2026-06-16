"use client";

import React from "react";

import type { AdvisoryWorkspaceCardView } from "../../../../lib/ui/mrpWorkspace/advisory/advisoryWorkspaceContract.ts";
import {
  advisoryCardDetailStyle,
  advisoryCardHeadlineStyle,
  advisoryCardStyle,
  advisorySectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/advisory/advisoryVisualContract.ts";

export type AdvisoryWorkspaceCardProps = Readonly<{
  card: AdvisoryWorkspaceCardView;
}>;

export function AdvisoryWorkspaceCard(props: AdvisoryWorkspaceCardProps): React.ReactElement {
  const { card } = props;

  return (
    <article
      data-nx="advisory-workspace-card"
      data-advisory-section={card.id}
      style={advisoryCardStyle(card.tone)}
    >
      <div style={advisorySectionLabelStyle()}>{card.label}</div>
      <div style={advisoryCardHeadlineStyle(card.tone)}>{card.headline}</div>
      <p style={advisoryCardDetailStyle()}>{card.detail}</p>
    </article>
  );
}

export default AdvisoryWorkspaceCard;
