"use client";

import React from "react";

import type {
  OperationalActivityLevel,
  OperationalStatus,
  OperationalWorkspaceCardView,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalWorkspaceContract.ts";
import {
  OPERATIONAL_ACTIVITY_LABELS,
  OPERATIONAL_STATUS_LABELS,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalWorkspaceContract.ts";
import {
  operationalActivityLevelChipStyle,
  operationalActivityLevelDotStyle,
  operationalActivityLevelScaleStyle,
  operationalCardDetailStyle,
  operationalCardHeadlineStyle,
  operationalCardStyle,
  operationalSectionLabelStyle,
  operationalStatusDotStyle,
  operationalStatusIndicatorStyle,
} from "../../../../lib/ui/mrpWorkspace/operational/operationalVisualContract.ts";

export type OperationalWorkspaceCardProps = Readonly<{
  card: OperationalWorkspaceCardView;
  activeOperationalStatus?: OperationalStatus | null;
  statusOptions?: readonly OperationalStatus[];
  activeActivityLevel?: OperationalActivityLevel | null;
  activityOptions?: readonly OperationalActivityLevel[];
}>;

export function OperationalWorkspaceCard(
  props: OperationalWorkspaceCardProps
): React.ReactElement {
  const { card } = props;
  const showStatusScale =
    card.id === "operational_status" &&
    props.activeOperationalStatus != null &&
    Array.isArray(props.statusOptions);
  const showActivityScale =
    card.id === "activity_level" &&
    props.activeActivityLevel != null &&
    Array.isArray(props.activityOptions);

  return (
    <article
      data-nx="operational-workspace-card"
      data-operational-section={card.id}
      style={operationalCardStyle(card.tone)}
    >
      <div style={operationalSectionLabelStyle()}>{card.label}</div>
      <div style={operationalCardHeadlineStyle(card.tone)}>{card.headline}</div>
      {showStatusScale && props.activeOperationalStatus ? (
        <div
          style={operationalStatusIndicatorStyle(props.activeOperationalStatus)}
          aria-label={`Operational status ${OPERATIONAL_STATUS_LABELS[props.activeOperationalStatus]}`}
        >
          <span
            style={operationalStatusDotStyle(props.activeOperationalStatus)}
            aria-hidden
          />
          {OPERATIONAL_STATUS_LABELS[props.activeOperationalStatus]}
        </div>
      ) : null}
      {showActivityScale ? (
        <div role="list" aria-label="Activity level scale" style={operationalActivityLevelScaleStyle()}>
          {(props.activityOptions ?? []).map((level: OperationalActivityLevel) => {
            const active = level === props.activeActivityLevel;
            return (
              <span
                key={level}
                role="listitem"
                style={operationalActivityLevelChipStyle(level, active)}
              >
                <span style={operationalActivityLevelDotStyle(level)} aria-hidden />
                {OPERATIONAL_ACTIVITY_LABELS[level]}
              </span>
            );
          })}
        </div>
      ) : null}
      <p style={operationalCardDetailStyle()}>{card.detail}</p>
    </article>
  );
}

export default OperationalWorkspaceCard;
