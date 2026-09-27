/**
 * NPA-T OBJECT-TYPE-3D:HANDOFF-FIX1 — identity-safe Stage → OVS objectKind.
 *
 * Projection only. Does not own catalog, DTH type, VAI roles, or OVS primitives.
 * Does not infer family from labels, status, attention, or DTH kpi grouping.
 */

import { NEXORA_MVP_CANONICAL_RISK_OBJECT_ID } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";

export const projectExecutiveOvsObjectKindHandoffIdentity =
  "NPA-T OBJECT-TYPE-3D:HANDOFF-FIX1/IdentitySafeOvsObjectKind" as const;

export function projectExecutiveOvsObjectKindHandoff(input: {
  readonly id?: string | null;
  readonly kind?: string | null;
}): string {
  const kind = `${input.kind ?? ""}`.trim();
  if (kind.length > 0 && kind !== "object") {
    return kind;
  }
  if (`${input.id ?? ""}`.trim() === NEXORA_MVP_CANONICAL_RISK_OBJECT_ID) {
    return "risk";
  }
  return kind.length > 0 ? kind : "object";
}
