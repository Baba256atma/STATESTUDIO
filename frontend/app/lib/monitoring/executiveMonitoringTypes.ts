export type MonitoringStatus =
  | "stable"
  | "watch"
  | "elevated"
  | "critical";

export type MonitoringTrend =
  | "improving"
  | "stable"
  | "degrading"
  | "volatile";

export type MonitoringLifecycle =
  | "emerging"
  | "active"
  | "persistent"
  | "recovering"
  | "resolved";

export interface ExecutiveMonitoringSignal {
  id: string;
  title: string;
  summary: string;
  relatedObjectIds: string[];
  monitoringStatus: MonitoringStatus;
  trend?: MonitoringTrend;
  confidence: number;
  urgencyScore: number;
  recommendedAttention?: string;
  domainId?: string;
  createdAt: number;
}

export type ExecutiveMonitoringOverlayState = {
  topSignalId?: string;
  monitoringStatus: MonitoringStatus;
  lifecycle: MonitoringLifecycle;
  urgencyScore: number;
  relatedObjectIds: string[];
  executiveSummary: string;
};
