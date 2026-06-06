import { buildSelectionSignature } from "./selectionSignature";
import { recordNullSelectionWritePrevented } from "../debug/startupNoiseAudit";

export function normalizeSelectedObjectId(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function shouldCommitSelectedObjectId(
  prev: string | null | undefined,
  next: string | null | undefined
): boolean {
  const same = normalizeSelectedObjectId(prev) === normalizeSelectedObjectId(next);
  if (same && normalizeSelectedObjectId(prev) == null) {
    recordNullSelectionWritePrevented();
  }
  return !same;
}

export function buildObjectSelectionSignature(selection: unknown): string {
  if (selection == null) return "null";
  const record = selection as {
    focused_object?: string | null;
    highlighted_objects?: unknown;
    dim_unrelated_objects?: boolean;
  };
  const highlighted = Array.isArray(record.highlighted_objects)
    ? record.highlighted_objects.filter((id): id is string => typeof id === "string")
    : [];
  const dimUnrelated = record.dim_unrelated_objects === true;
  return JSON.stringify({
    ...JSON.parse(
      buildSelectionSignature({
        focusedId: typeof record.focused_object === "string" ? record.focused_object : null,
        highlightedIds: highlighted,
        source: "system",
      })
    ),
    d: dimUnrelated,
  });
}

export function shouldCommitObjectSelection(prev: unknown, next: unknown): boolean {
  if (prev == null && next == null) {
    recordNullSelectionWritePrevented();
    return false;
  }
  if (buildObjectSelectionSignature(prev) === buildObjectSelectionSignature(next)) {
    return false;
  }
  return true;
}
