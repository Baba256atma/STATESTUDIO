/** D9:10:4 — MVP executive readiness dashboard display types. */

import type { ExecutiveInteractionStabilitySnapshot } from "../../lib/runtime-foundation/executiveInteractionStabilityTypes";
import type { ExecutiveOperationalReliabilitySnapshot } from "../../lib/runtime-foundation/operationalReliabilityTypes";
import type { MVPStrategicReadinessSnapshot } from "../../lib/runtime-foundation/enterpriseRuntimeFoundationTypes";

export type MVPReadinessStatus = "not_ready" | "monitored" | "stable" | "mvp_ready";

export type RuntimeHealthDisplayItem = {
  id: string;
  label: string;
  value: string;
  tone: "neutral" | "positive" | "caution" | "risk";
};

export type ExecutiveReadinessSignal = {
  signalId: string;
  label: string;
  summary: string;
};

export type MVPReadinessDisplayModel = {
  readinessStatus: MVPReadinessStatus;
  runtimeHealth: string;
  uiStability: string;
  panelStability: string;
  sceneStability: string;
  chatPipelineStability: string;
  trustLevel: string;
  currentRisk: string;
  recommendedNextCheck: string;
  overallHeadline: string;
  confidencePercent: number | null;
  healthItems: readonly RuntimeHealthDisplayItem[];
  signals: readonly ExecutiveReadinessSignal[];
  hasRuntimeData: boolean;
};

export type MVPReadinessRuntimeInput = {
  organizationId: string;
  foundation: MVPStrategicReadinessSnapshot | null;
  operational: ExecutiveOperationalReliabilitySnapshot | null;
  interaction: ExecutiveInteractionStabilitySnapshot | null;
};

export type MVPReadinessDashboardProps = {
  organizationId?: string;
  foundation?: MVPStrategicReadinessSnapshot | null;
  operational?: ExecutiveOperationalReliabilitySnapshot | null;
  interaction?: ExecutiveInteractionStabilitySnapshot | null;
  showDevDetails?: boolean;
  showPilotFeedback?: boolean;
  className?: string;
};
