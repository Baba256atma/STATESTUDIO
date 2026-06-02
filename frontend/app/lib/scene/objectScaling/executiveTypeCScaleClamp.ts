/** E2:106 / E2:107 — Type-C MVP object scale limits for readable executive scenes. */

export const TYPE_C_MIN_OBJECT_SCALE = 0.25;
export const TYPE_C_MAX_ZONE_OBJECT_SCALE = 0.85;
export const TYPE_C_MAX_NORMAL_OBJECT_SCALE = 1.15;
export const TYPE_C_MAX_SELECTED_OBJECT_SCALE = 1.35;

/** @deprecated Use TYPE_C_MAX_NORMAL_OBJECT_SCALE */
export const TYPE_C_MAX_OBJECT_SCALE = TYPE_C_MAX_NORMAL_OBJECT_SCALE;

export function isZoneLikeExecutiveObject(obj: unknown): boolean {
  const record = obj as {
    label?: unknown;
    name?: unknown;
    type?: unknown;
    role?: unknown;
    semantic?: { category?: unknown; tags?: unknown[]; role?: unknown };
    tags?: unknown[];
  } | null;
  const type = String(record?.type ?? "").toLowerCase();
  const label = String(record?.label ?? record?.name ?? "").toLowerCase();
  const category = String(record?.semantic?.category ?? "").toLowerCase();
  const role = String(record?.role ?? record?.semantic?.role ?? "").toLowerCase();
  const tags = [...(Array.isArray(record?.semantic?.tags) ? record.semantic.tags : []), ...(Array.isArray(record?.tags) ? record.tags : [])]
    .map((tag) => String(tag).toLowerCase());

  if (["region", "area", "plane"].includes(type)) return true;
  if (/operations|pressure|flow|zone|region|area/.test(label)) return true;
  if (/operations|pressure|flow/.test(category)) return true;
  if (/operations|pressure|flow/.test(role)) return true;
  if (tags.some((tag) => tag.includes("pressure") || tag.includes("flow") || tag === "operations")) return true;
  return false;
}

export function clampExecutiveTypeCObjectScale(
  rawScale: number,
  options?: { selected?: boolean; zoneLike?: boolean }
): number {
  if (!Number.isFinite(rawScale)) return TYPE_C_MIN_OBJECT_SCALE;
  const maxScale = options?.selected
    ? TYPE_C_MAX_SELECTED_OBJECT_SCALE
    : options?.zoneLike
      ? TYPE_C_MAX_ZONE_OBJECT_SCALE
      : TYPE_C_MAX_NORMAL_OBJECT_SCALE;
  return Math.min(Math.max(rawScale, TYPE_C_MIN_OBJECT_SCALE), maxScale);
}
