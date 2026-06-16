"use client";

import React from "react";

import type { ScenarioWorkspaceCardView } from "../../../../lib/ui/mrpWorkspace/scenario/scenarioWorkspaceContract.ts";
import {
  scenarioCardDetailStyle,
  scenarioCardHeadlineStyle,
  scenarioCardStyle,
  scenarioSectionLabelStyle,
} from "../../../../lib/ui/mrpWorkspace/scenario/scenarioVisualContract.ts";

export type ScenarioWorkspaceCardProps = Readonly<{
  card: ScenarioWorkspaceCardView;
}>;

export function ScenarioWorkspaceCard(props: ScenarioWorkspaceCardProps): React.ReactElement {
  const { card } = props;

  return (
    <article
      data-nx="scenario-workspace-card"
      data-scenario-section={card.id}
      style={scenarioCardStyle(card.tone)}
    >
      <div style={scenarioSectionLabelStyle()}>{card.label}</div>
      <div style={scenarioCardHeadlineStyle(card.tone)}>{card.headline}</div>
      <p style={scenarioCardDetailStyle()}>{card.detail}</p>
    </article>
  );
}

export default ScenarioWorkspaceCard;
