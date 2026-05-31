import type { ObjectInfoFieldId, ObjectInfoHierarchyLevel } from "./executiveObjectInformationHierarchy";
import { OBJECT_INFO_HIERARCHY } from "./executiveObjectInformationHierarchy";

export type ObjectInfoDisclosureView = "summary" | "standard" | "detailed";

export const DEFAULT_OBJECT_INFO_DISCLOSURE_VIEW: ObjectInfoDisclosureView = "standard";

const VIEW_LEVELS: Record<ObjectInfoDisclosureView, readonly ObjectInfoHierarchyLevel[]> = {
  summary: ["PRIMARY"],
  standard: ["PRIMARY", "SECONDARY"],
  detailed: ["PRIMARY", "SECONDARY", "CONTEXT", "ADVANCED"],
};

const logKeys = new Set<string>();

export function resolveObjectInfoDisclosureLevels(
  view: ObjectInfoDisclosureView = DEFAULT_OBJECT_INFO_DISCLOSURE_VIEW
): readonly ObjectInfoHierarchyLevel[] {
  return VIEW_LEVELS[view];
}

export function isObjectInfoFieldVisible(
  fieldId: ObjectInfoFieldId,
  view: ObjectInfoDisclosureView = DEFAULT_OBJECT_INFO_DISCLOSURE_VIEW
): boolean {
  const levels = resolveObjectInfoDisclosureLevels(view);
  return levels.some((level) => OBJECT_INFO_HIERARCHY[level].includes(fieldId));
}

export function logProgressiveDisclosure(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][ProgressiveDisclosure]", payload);
}

export function resetObjectInfoProgressiveDisclosureLogsForTests(): void {
  logKeys.clear();
}
