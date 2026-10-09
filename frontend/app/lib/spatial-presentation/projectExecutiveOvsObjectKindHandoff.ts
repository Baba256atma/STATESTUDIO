/**
 * NPA-T OBJECT-TYPE-3D:HANDOFF-FIX1 — identity-safe Stage → OVS objectKind.
 *
 * Projection only. Does not own catalog, DTH type, VAI roles, or OVS primitives.
 * Does not infer family from labels, status, attention, ids, or DTH kpi grouping.
 * Management identity (`objectKind`) is the form cue when the stage category
 * is the generic business-object `kind`.
 */

export const projectExecutiveOvsObjectKindHandoffIdentity =
  "NPA-T OBJECT-TYPE-3D:HANDOFF-FIX1/IdentitySafeOvsObjectKind" as const;

function cue(value?: string | null): string {
  return `${value ?? ""}`.trim();
}

export function projectExecutiveOvsObjectKindHandoff(input: {
  readonly id?: string | null;
  readonly kind?: string | null;
  readonly objectKind?: string | null;
}): string {
  void input.id;
  const management = cue(input.objectKind);
  if (
    management.length > 0 &&
    management !== "object" &&
    management !== "unknown"
  ) {
    return management;
  }
  const kind = cue(input.kind);
  if (kind.length > 0 && kind !== "object") {
    return kind;
  }
  return kind.length > 0 ? kind : "object";
}
