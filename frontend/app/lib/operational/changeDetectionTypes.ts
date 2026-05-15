export type OperationalChangeType =
  | "new_signal"
  | "resolved_signal"
  | "severity_increase"
  | "severity_decrease"
  | "trend_change"
  | "status_change"
  | "object_added"
  | "object_removed"
  | "stable";

export type OperationalChangeSeverity = "low" | "medium" | "high" | "critical";

export type OperationalChangeRecord = Readonly<{
  id: string;
  type: OperationalChangeType;
  objectId?: string;
  previousValue?: string;
  currentValue?: string;
  message: string;
  severity: OperationalChangeSeverity;
  detectedAt: string;
}>;

export type OperationalChangeSummary = Readonly<{
  totalChanges: number;
  criticalChanges: number;
  worseningCount: number;
  improvingCount: number;
  stableCount: number;
  affectedObjectIds: readonly string[];
  topChange?: OperationalChangeRecord;
  executiveSummary: string;
  generatedAt: string;
}>;
