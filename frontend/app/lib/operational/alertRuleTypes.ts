export type OperationalAlertSeverity = "info" | "warning" | "high" | "critical";

export type OperationalAlertRuleType =
  | "severity_threshold"
  | "propagation_threshold"
  | "fragility_threshold"
  | "risk_exposure_threshold"
  | "operational_degradation"
  | "critical_object"
  | "custom";

export type OperationalAlertRule = Readonly<{
  id: string;
  label: string;
  ruleType: OperationalAlertRuleType;
  enabled: boolean;
  threshold: number;
  severity: OperationalAlertSeverity;
  targetObjectIds?: readonly string[];
  createdAt: string;
  updatedAt: string;
}>;

export type OperationalAlertRecord = Readonly<{
  id: string;
  severity: OperationalAlertSeverity;
  objectId?: string;
  ruleId: string;
  title: string;
  message: string;
  triggeredBy: string;
  acknowledged: boolean;
  createdAt: string;
}>;

export type OperationalAlertEvaluationResult = Readonly<{
  alerts: readonly OperationalAlertRecord[];
  triggeredRuleIds: readonly string[];
  criticalAlertCount: number;
  warningAlertCount: number;
  generatedAt: string;
}>;
