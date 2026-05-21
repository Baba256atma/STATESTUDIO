"use client";

import type React from "react";
import { memo } from "react";

import { selectLatestExecutiveInteractionStabilitySnapshot } from "../../lib/runtime-foundation/executiveInteractionStabilitySelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "../../lib/runtime-foundation/enterpriseRuntimeFoundationSelectors";
import { selectLatestExecutiveOperationalReliabilitySnapshot } from "../../lib/runtime-foundation/operationalReliabilitySelectors";
import { MVPReadinessDashboard } from "./MVPReadinessDashboard";

/**
 * Readonly host — reads runtime-foundation stores without mutating scene, routing, or panels.
 */
function MVPReadinessDashboardHostComponent(props: {
  organizationId?: string;
  showDevDetails?: boolean;
}): React.ReactElement {
  const organizationId = props.organizationId?.trim() || "nexora-default";
  const showDevDetails = props.showDevDetails ?? process.env.NODE_ENV !== "production";

  const foundation = selectLatestMVPStrategicReadinessSnapshot(organizationId);
  const operational = selectLatestExecutiveOperationalReliabilitySnapshot(organizationId);
  const interaction = selectLatestExecutiveInteractionStabilitySnapshot(organizationId);

  return (
    <MVPReadinessDashboard
      organizationId={organizationId}
      foundation={foundation}
      operational={operational}
      interaction={interaction}
      showDevDetails={showDevDetails}
    />
  );
}

export const MVPReadinessDashboardHost = memo(MVPReadinessDashboardHostComponent);
