/**
 * Phase 3:5 — Resolves visual bundles for accordion panels.
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "./dashboardContextTypes.ts";
import type { DashboardAccordionPanelType } from "./dashboardAccordionPanelContract.ts";
import type { DashboardSurfaceVisualBundle } from "./dashboardVisualSignalContract.ts";
import { getDashboardSurfaceVisualBundle } from "./dashboardSurfaceVisualRegistry.ts";
import {
  reportDashboardVisual,
  reportImpactCard,
  reportMicroChart,
  reportTrendIndicator,
  reportVisualSignal,
} from "./dashboardVisualSignalLogging.ts";

export function resolveDashboardSurfaceVisualBundle(input: {
  panelType: DashboardAccordionPanelType;
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
}): DashboardSurfaceVisualBundle {
  const bundle = getDashboardSurfaceVisualBundle(input.panelType);

  reportVisualSignal(input.panelType, {
    context: input.dashboardContext,
    normalizedId: input.normalizedContext?.id ?? null,
    version: "3.5.0",
  });
  reportImpactCard(bundle.impactCard, input.panelType);
  reportTrendIndicator(
    input.panelType,
    bundle.headerSignals.trendDirection,
    bundle.headerSignals.summaryValue
  );
  bundle.microCharts.forEach((chart) => reportMicroChart(chart, input.panelType));
  reportDashboardVisual(input.panelType, {
    chartCount: bundle.microCharts.length,
    impactLevel: bundle.impactCard.impactLevel,
    status: bundle.statusIndicator,
  });

  return bundle;
}
