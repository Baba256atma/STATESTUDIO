export type NexoraSelectionInput = {
  focusedId?: string | null;
  highlightedIds?: string[] | null;
  source?: "scene" | "panel" | "scanner" | "chat" | "system";
};

/**
 * B.2 / B.6 / B.7–stable selection fingerprint: only focus + highlight ids (no dim, timestamps, or UI flags).
 */
export function buildSelectionSignature(input: NexoraSelectionInput): string {
  const focused = input.focusedId ?? null;
  const highlights = Array.isArray(input.highlightedIds)
    ? Array.from(new Set(input.highlightedIds)).sort()
    : [];
  return JSON.stringify({ f: focused, h: highlights });
}

export function traceNexoraSelectionGuard(
  nextSig: string,
  prevSig: string | null,
  source: NexoraSelectionInput["source"] | undefined
): void {
  if (process.env.NODE_ENV === "production") return;
  const skipped = nextSig === prevSig;
  console.log("[Nexora][SelectionGuard]", { nextSig, prevSig, skipped, source });
}

/** Maps unified reaction `source` to a coarse guard channel (dev trace only; not part of the signature). */
export function selectionGuardSourceFromReaction(reactionSource: string | undefined): NexoraSelectionInput["source"] {
  const s = String(reactionSource ?? "").toLowerCase();
  if (s.includes("scan") || s.includes("fragil")) return "scanner";
  if (s.includes("panel") || s.includes("command")) return "panel";
  if (s.includes("chat") || s.includes("message")) return "chat";
  if (s.includes("scene") || s.includes("click") || s.includes("user") || s.includes("focus")) return "scene";
  return "system";
}
