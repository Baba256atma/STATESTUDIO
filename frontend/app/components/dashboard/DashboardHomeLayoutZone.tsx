"use client";

import React from "react";

import type {
  DashboardHomeLayoutZoneId,
  DashboardHomeVisualWeight,
} from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutContract";
import { getDashboardHomeZoneDefinition } from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutRuntime";
import {
  buildDashboardHomeZoneStyle,
  dashboardHomeLayoutSpacing,
} from "../../lib/dashboard/dashboardHomeLayout/dashboardHomeLayoutTheme";
import { nx } from "../ui/nexoraTheme";

export type DashboardHomeLayoutZoneProps = Readonly<{
  zoneId: DashboardHomeLayoutZoneId;
  visualWeight?: DashboardHomeVisualWeight;
  children: React.ReactNode;
}>;

export function DashboardHomeLayoutZone(props: DashboardHomeLayoutZoneProps): React.ReactElement {
  const definition = getDashboardHomeZoneDefinition(props.zoneId);
  const visualWeight = props.visualWeight ?? definition?.visualWeight ?? "medium";
  const title = definition?.title ?? props.zoneId;
  const purpose = definition?.purpose ?? "";

  return (
    <section
      data-nx="dashboard-home-layout-zone"
      data-zone-id={props.zoneId}
      data-visual-weight={visualWeight}
      aria-label={title}
      style={buildDashboardHomeZoneStyle({ visualWeight })}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: dashboardHomeLayoutSpacing.zoneLabelGap,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: nx.lowMuted,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        {purpose ? (
          <div style={{ color: nx.textSoft, fontSize: 11, lineHeight: 1.4 }}>{purpose}</div>
        ) : null}
      </header>
      <div
        data-nx="dashboard-home-zone-content"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: dashboardHomeLayoutSpacing.sectionGap,
          minWidth: 0,
        }}
      >
        {props.children}
      </div>
    </section>
  );
}

export default DashboardHomeLayoutZone;
