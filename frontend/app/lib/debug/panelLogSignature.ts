const globalPanelLogSet = new Set<string>();

export function logPanelOnce(
  label: string,
  payload: Record<string, unknown>,
  ttlMs?: number
): void {
  if (process.env.NODE_ENV === "production") return;
  const resolvedTtl =
    ttlMs ??
    (label.includes("[Nexora][PanelDataUpdate]") || label.includes("[Nexora][PanelBlankGuard]") ? 12000 : 2000);
  const key = JSON.stringify({ label, payload });
  if (globalPanelLogSet.has(key)) return;
  globalPanelLogSet.add(key);
  console.warn(label, payload);
  setTimeout(() => {
    globalPanelLogSet.delete(key);
  }, resolvedTtl);
}
