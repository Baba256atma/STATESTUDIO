/** Emit audit logs only when the serialized output payload changed. */

const lastLoggedPayload = new Map<string, string>();

function serializeAuditPayload(payload: Record<string, unknown>): string {
  return JSON.stringify(payload, Object.keys(payload).sort());
}

export function shouldEmitAuditLog(
  auditName: string,
  inputKey: string,
  payload: Record<string, unknown>
): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const dedupeKey = `${auditName}::${inputKey}`;
  const serialized = serializeAuditPayload(payload);
  if (lastLoggedPayload.get(dedupeKey) === serialized) return false;
  lastLoggedPayload.set(dedupeKey, serialized);
  return true;
}

export function resetAuditLogDeduperForTests(): void {
  lastLoggedPayload.clear();
}
