"use client";

import React from "react";

import type { TimelineWorkspaceCardView } from "../../../../lib/ui/mrpWorkspace/timeline/timelineWorkspaceContract.ts";
import {
  timelineCardDetailStyle,
  timelineCardHeadlineStyle,
  timelineCardStyle,
  timelineSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/timeline/timelineVisualContract.ts";

export type TimelineWorkspaceCardProps = Readonly<{
  card: TimelineWorkspaceCardView;
}>;

export function TimelineWorkspaceCard(props: TimelineWorkspaceCardProps): React.ReactElement {
  const { card } = props;

  return (
    <article
      data-nx="timeline-workspace-card"
      data-timeline-section={card.id}
      style={timelineCardStyle(card.tone)}
    >
      <div style={timelineSectionLabelStyle()}>{card.label}</div>
      <div style={timelineCardHeadlineStyle(card.tone)}>{card.headline}</div>
      <p style={timelineCardDetailStyle()}>{card.detail}</p>
    </article>
  );
}

export default TimelineWorkspaceCard;
