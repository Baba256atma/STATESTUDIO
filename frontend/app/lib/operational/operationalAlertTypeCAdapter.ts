import type { TypeCAlert } from "../typec/typeCAlerts.ts";
import type { OperationalAlertSeverity } from "./alertRuleTypes.ts";

/** Maps D3 operational alert severity to Type-C alert levels (read-only bridge; does not merge alert lists). */
export function mapOperationalAlertSeverityToTypeCLevel(severity: OperationalAlertSeverity): TypeCAlert["level"] {
  if (severity === "critical") return "critical";
  if (severity === "high" || severity === "warning") return "warning";
  return "info";
}
