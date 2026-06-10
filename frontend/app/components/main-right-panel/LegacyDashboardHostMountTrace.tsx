"use client";

import React, { useEffect } from "react";

import { traceMrp10Runtime } from "../../lib/dashboard/dashboardHomeReturnPath/dashboardHomeRuntimeTrace";

export type LegacyDashboardHostMountTraceProps = Readonly<{
  children: React.ReactNode;
}>;

/** Dev-only mount trace for legacy RightPanelHost passed as legacyDashboardHost. */
export function LegacyDashboardHostMountTrace(
  props: LegacyDashboardHostMountTraceProps
): React.ReactElement {
  useEffect(() => {
    traceMrp10Runtime("legacyDashboardHost mounted");
  }, []);

  return <>{props.children}</>;
}

export default LegacyDashboardHostMountTrace;
