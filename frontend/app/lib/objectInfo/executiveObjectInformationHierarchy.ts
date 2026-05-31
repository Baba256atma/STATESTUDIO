/** E2:54 — Executive object information hierarchy contract. */

export type ObjectInfoHierarchyLevel = "PRIMARY" | "SECONDARY" | "CONTEXT" | "ADVANCED";

export type ObjectInfoFieldId =
  | "objectName"
  | "objectType"
  | "health"
  | "riskLevel"
  | "frsi"
  | "readiness"
  | "summary"
  | "criticalDependencyCount"
  | "keySignals"
  | "relationships"
  | "metadata"
  | "classification"
  | "diagnostics"
  | "debugData"
  | "extendedAnalysis";

export const OBJECT_INFO_HIERARCHY: Record<ObjectInfoHierarchyLevel, readonly ObjectInfoFieldId[]> = {
  PRIMARY: ["objectName", "health", "riskLevel", "frsi", "readiness"],
  SECONDARY: ["summary", "criticalDependencyCount", "keySignals"],
  CONTEXT: ["relationships", "metadata", "classification"],
  ADVANCED: ["diagnostics", "debugData", "extendedAnalysis"],
};

export const DEFAULT_VISIBLE_OBJECT_INFO_LEVELS: readonly ObjectInfoHierarchyLevel[] = Object.freeze([
  "PRIMARY",
  "SECONDARY",
]);

const logKeys = new Set<string>();

export function logObjectInfoHierarchy(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][ObjectInfoHierarchy]", payload);
}

export function isObjectInfoFieldInLevel(
  fieldId: ObjectInfoFieldId,
  level: ObjectInfoHierarchyLevel
): boolean {
  return OBJECT_INFO_HIERARCHY[level].includes(fieldId);
}

export function resetObjectInfoHierarchyLogsForTests(): void {
  logKeys.clear();
}
