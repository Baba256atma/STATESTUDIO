/**
 * B.22 — Adaptive bias shape + signature helper (no scenario-memory import; avoids cycles).
 */

export type NexoraAdaptiveBiasResult = {
  preferredOptionId?: string;
  discouragedOptionId?: string;
  preferredPosture?: string;
  discouragedPosture?: string;
  confidence: "low" | "medium" | "high";
  summary: string | null;
};

export function adaptiveBiasSignatureSuffix(bias: NexoraAdaptiveBiasResult | null | undefined): string {
  if (!bias) return "";
  const wp = String(bias.discouragedPosture ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 48);
  return `|b:${bias.confidence}:${bias.preferredOptionId ?? "-"}:${bias.discouragedOptionId ?? "-"}:${wp || "-"}`;
}
