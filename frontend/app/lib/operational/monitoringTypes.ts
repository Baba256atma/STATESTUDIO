export type OperationalMonitoringStatus =
  | "idle"
  | "watching"
  | "degraded"
  | "critical"
  | "recovering"
  | "unknown";

export type OperationalTrend = "improving" | "stable" | "degrading" | "volatile" | "unknown";

/** Single normalized operational item surfaced to monitoring UI. */
export type OperationalMonitoringSignal = Readonly<{
  id: string;
  sourceId: string;
  objectId?: string;
  label: string;
  severity: number;
  trend: OperationalTrend;
  message: string;
  detectedAt: string;
  confidence: number;
}>;

/** Aggregate read model for live operational intelligence panels. */
export type OperationalMonitoringSnapshot = Readonly<{
  id: string;
  status: OperationalMonitoringStatus;
  trend: OperationalTrend;
  signals: readonly OperationalMonitoringSignal[];
  affectedObjectIds: readonly string[];
  topRiskObjectId?: string;
  summary: string;
  recommendedFocus: string;
  updatedAt: string;
}>;
