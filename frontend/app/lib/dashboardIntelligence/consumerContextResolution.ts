/**
 * INT-1.2 — Consumer context resolution helpers.
 * Prevents cross-consumer panel/mode leakage from the unified context registry.
 */

import type {
  DashboardIntelligenceMode,
  DashboardIntelligencePanelId,
} from "./dashboardIntelligenceContract.ts";
import type { BuildExecutiveTimeContextInput } from "./executiveTimeContextContract.ts";
import type {
  IntelligenceTimelinePosition,
  UnifiedIntelligenceContext,
} from "./intelligenceContextContract.ts";
import { getIntelligenceConsumer } from "./intelligenceConsumerRegistry.ts";
import type { IntelligenceConsumerId } from "./singleIntelligenceSourceContract.ts";

export function resolveConsumerPanel(input: {
  consumer: IntelligenceConsumerId;
  panel?: DashboardIntelligencePanelId | null;
  platformContext: UnifiedIntelligenceContext | null;
  defaultPanel: DashboardIntelligencePanelId;
}): DashboardIntelligencePanelId {
  if (input.panel) return input.panel;
  const registration = getIntelligenceConsumer(input.consumer);
  const platformPanel = input.platformContext?.panel ?? null;
  if (platformPanel && registration?.allowedPanels.includes(platformPanel)) {
    return platformPanel;
  }
  return input.defaultPanel;
}

export function resolveConsumerDashboardMode(input: {
  consumer: IntelligenceConsumerId;
  dashboardMode?: DashboardIntelligenceMode | null;
  platformContext: UnifiedIntelligenceContext | null;
  defaultMode: DashboardIntelligenceMode;
  panel: DashboardIntelligencePanelId;
}): DashboardIntelligenceMode {
  if (input.dashboardMode) return input.dashboardMode;
  const registration = getIntelligenceConsumer(input.consumer);
  const platformMode = input.platformContext?.dashboardMode ?? null;
  if (platformMode && registration?.allowedModes.includes(platformMode)) {
    return platformMode;
  }
  return input.defaultMode;
}

export function resolveExecutiveTimeTimelinePosition(input: {
  executiveTime?: BuildExecutiveTimeContextInput | null;
  timeState: BuildExecutiveTimeContextInput["timeState"];
  platformTimelinePosition: IntelligenceTimelinePosition | null;
}): Partial<IntelligenceTimelinePosition> | null {
  if (input.executiveTime?.timelinePosition != null) {
    return input.executiveTime.timelinePosition;
  }
  const inherited = input.platformTimelinePosition;
  if (
    input.timeState === "past" &&
    inherited?.reserved === true &&
    inherited.index == null
  ) {
    return null;
  }
  return inherited;
}

export const ConsumerContextResolution = Object.freeze({
  resolveConsumerPanel,
  resolveConsumerDashboardMode,
  resolveExecutiveTimeTimelinePosition,
});
