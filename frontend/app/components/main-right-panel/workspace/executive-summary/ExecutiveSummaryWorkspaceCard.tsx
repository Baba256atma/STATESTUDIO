"use client";

import React from "react";

import type {
  ExecutiveSummarySystemStatus,
  ExecutiveSummaryWorkspaceCardView,
} from "../../../../lib/ui/mrpWorkspace/executiveSummary/executiveSummaryWorkspaceContract.ts";
import { EXECUTIVE_SUMMARY_SYSTEM_STATUS_LABELS } from "../../../../lib/ui/mrpWorkspace/executiveSummary/executiveSummaryWorkspaceContract.ts";
import {
  executiveSummaryCardDetailStyle,
  executiveSummaryCardHeadlineStyle,
  executiveSummaryCardStyle,
  executiveSummarySectionLabelStyle,
  executiveSummarySystemStatusDotStyle,
  executiveSummarySystemStatusIndicatorStyle,
} from "../../../../lib/ui/mrpWorkspace/executiveSummary/executiveSummaryVisualContract.ts";

export type ExecutiveSummaryWorkspaceCardProps = Readonly<{
  card: ExecutiveSummaryWorkspaceCardView;
  activeSystemStatus?: ExecutiveSummarySystemStatus | null;
}>;

export function ExecutiveSummaryWorkspaceCard(
  props: ExecutiveSummaryWorkspaceCardProps
): React.ReactElement {
  const { card } = props;
  const showStatusIndicator =
    card.id === "system_status" && props.activeSystemStatus != null;

  return (
    <article
      data-nx="executive-summary-workspace-card"
      data-executive-summary-section={card.id}
      style={executiveSummaryCardStyle(card.tone)}
    >
      <div style={executiveSummarySectionLabelStyle()}>{card.label}</div>
      <div style={executiveSummaryCardHeadlineStyle(card.tone)}>{card.headline}</div>
      {showStatusIndicator && props.activeSystemStatus ? (
        <div
          style={executiveSummarySystemStatusIndicatorStyle(props.activeSystemStatus)}
          aria-label={`System status ${EXECUTIVE_SUMMARY_SYSTEM_STATUS_LABELS[props.activeSystemStatus]}`}
        >
          <span
            style={executiveSummarySystemStatusDotStyle(props.activeSystemStatus)}
            aria-hidden
          />
          {EXECUTIVE_SUMMARY_SYSTEM_STATUS_LABELS[props.activeSystemStatus]}
        </div>
      ) : null}
      <p style={executiveSummaryCardDetailStyle()}>{card.detail}</p>
    </article>
  );
}

export default ExecutiveSummaryWorkspaceCard;
