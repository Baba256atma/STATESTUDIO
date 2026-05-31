const globalPanelLogSet = new Set<string>();
const permanentPanelLogSet = new Set<string>();

export function logPanelOnce(
  label: string,
  payload: Record<string, unknown>,
  ttlMs?: number
): void {
  if (process.env.NODE_ENV === "production") return;
  const resolvedTtl =
    ttlMs ??
    (label.includes("[Nexora][PanelDataUpdate]") || label.includes("[Nexora][PanelBlankGuard]") ? 12000 : 2000);
  const signature = payload.signature ?? payload;
  const key = JSON.stringify({ label, signature });
  if (globalPanelLogSet.has(key)) return;
  globalPanelLogSet.add(key);
  console.warn(label, payload);
  setTimeout(() => {
    globalPanelLogSet.delete(key);
  }, resolvedTtl);
}

export function logPanelOncePermanent(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const signature = payload.signature ?? payload;
  const key = JSON.stringify({ label, signature });
  if (permanentPanelLogSet.has(key)) return;
  permanentPanelLogSet.add(key);
  console.warn(label, payload);
}

export function resetPanelLogSignatureForTests(): void {
  globalPanelLogSet.clear();
  permanentPanelLogSet.clear();
}
