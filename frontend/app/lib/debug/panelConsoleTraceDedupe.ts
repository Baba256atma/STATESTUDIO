/**
 * Dev-only deduped panel traces. Module-scoped so calls are safe inside conditionals (no Rules of Hooks issues).
 */

type PanelTraceKind = "PanelComponent" | "PanelThinRender";

const lastSigByKey = new Map<string, string>();

function takeIfChanged(mapKey: string, signature: string): boolean {
  if (lastSigByKey.get(mapKey) === signature) return false;
  lastSigByKey.set(mapKey, signature);
  return true;
}

export function dedupePanelConsoleTrace(
  kind: PanelTraceKind,
  panel: string,
  dedupeSlot: string,
  fields: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  const mapKey = `${kind}\0${panel}\0${dedupeSlot}`;
  let sig: string;
  try {
    sig = JSON.stringify(fields);
  } catch {
    sig = "__unserializable__";
  }
  if (!takeIfChanged(mapKey, sig)) return;
  if (kind === "PanelComponent") {
    console.log("[Nexora][Trace][PanelComponent]", { panel, ...fields });
  } else {
    console.log("[Nexora][PanelThinRender] accepted", { panel, ...fields });
  }
}

export function dedupeNexoraDevLog(message: string, dedupeSlot: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const mapKey = `${message}\0${dedupeSlot}`;
  let sig: string;
  try {
    sig = JSON.stringify(payload);
  } catch {
    sig = "__unserializable__";
  }
  if (!takeIfChanged(mapKey, sig)) return;
  console.log(message, payload);
}

/**
 * Dev-only: `[NEXORA][CASE_FALLBACK]` once per (panel, reason) until the optional signature changes.
 * Console output stays `{ panel, reason }` only; signature is used for dedupe only.
 */
export function dedupeCaseFallbackLog(
  panel: string,
  reason: string,
  signatureFields?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  const mapKey = `CASE_FALLBACK\0${panel}\0${reason}`;
  let sig: string;
  try {
    sig = JSON.stringify(signatureFields ?? {});
  } catch {
    sig = "__unserializable__";
  }
  if (!takeIfChanged(mapKey, sig)) return;
  console.log("[NEXORA][CASE_FALLBACK]", { panel, reason });
}
