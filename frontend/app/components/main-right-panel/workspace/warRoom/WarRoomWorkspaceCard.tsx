"use client";

import React from "react";

import type { WarRoomWorkspaceCardView } from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomWorkspaceContract.ts";
import {
  warRoomCardDetailStyle,
  warRoomCardHeadlineStyle,
  warRoomCardStyle,
  warRoomSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/warRoom/warRoomVisualContract.ts";

export type WarRoomWorkspaceCardProps = Readonly<{
  card: WarRoomWorkspaceCardView;
}>;

export function WarRoomWorkspaceCard(props: WarRoomWorkspaceCardProps): React.ReactElement {
  const { card } = props;

  return (
    <article
      data-nx="war-room-workspace-card"
      data-war-room-section={card.id}
      style={warRoomCardStyle(card.tone)}
    >
      <div style={warRoomSectionLabelStyle()}>{card.label}</div>
      <div style={warRoomCardHeadlineStyle(card.tone)}>{card.headline}</div>
      <p style={warRoomCardDetailStyle()}>{card.detail}</p>
    </article>
  );
}

export default WarRoomWorkspaceCard;
