import type { NexoraB8PanelContext } from "./panelDataContract";
import { dedupeNexoraDevLog } from "../debug/panelConsoleTraceDedupe";

type HudPipelineCtx = {
  posture: string | null;
  tradeoff: string | null;
  nextMove: string | null;
  objectIds: string[];
  drivers: Array<{ id: string; label: string; score?: number }>;
  fragilityLevel: string;
  summary: string;
};

function trim(s: string | null | undefined): string | null {
  const t = String(s ?? "").trim();
  return t.length ? t : null;
}

/** Map B.8 HUD pipeline ref → contract slice (no re-derivation of B.7). */
export function nexoraB8PanelContextFromHudRef(ctx: HudPipelineCtx): NexoraB8PanelContext {
  return {
    posture: trim(ctx.posture),
    tradeoff: trim(ctx.tradeoff),
    nextMove: trim(ctx.nextMove),
    objectIds: Array.isArray(ctx.objectIds) ? ctx.objectIds.map(String).filter(Boolean) : [],
    drivers: (ctx.drivers ?? []).map((d) => ({
      id: String(d.id ?? ""),
      label: String(d.label ?? ""),
      score: typeof d.score === "number" ? d.score : undefined,
    })),
    fragilityLevel: trim(ctx.fragilityLevel) ?? null,
    summary: trim(ctx.summary) ?? null,
  };
}

export function extractNexoraB8FromSharedData(data: { nexoraB8PanelContext?: unknown } | null | undefined): NexoraB8PanelContext | null {
  const raw = data?.nexoraB8PanelContext;
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const posture = trim(typeof o.posture === "string" ? o.posture : null);
  const summary = trim(typeof o.summary === "string" ? o.summary : null);
  const nextMove = trim(typeof o.nextMove === "string" ? o.nextMove : null);
  if (!posture && !summary && !nextMove) return null;
  const tradeoff = trim(typeof o.tradeoff === "string" ? o.tradeoff : null);
  const fragilityLevel = trim(typeof o.fragilityLevel === "string" ? o.fragilityLevel : null);
  const objectIds = Array.isArray(o.objectIds) ? o.objectIds.map(String).filter(Boolean) : [];
  const drivers = Array.isArray(o.drivers)
    ? o.drivers.map((d) => {
        const dr = d && typeof d === "object" ? (d as Record<string, unknown>) : {};
        return {
          id: String(dr.id ?? ""),
          label: String(dr.label ?? ""),
          score: typeof dr.score === "number" ? dr.score : undefined,
        };
      })
    : [];
  return { posture, tradeoff, nextMove, objectIds, drivers, fragilityLevel, summary };
}

export function buildB9MeaningSignature(panel: string, ctx: NexoraB8PanelContext): string {
  const topDrivers = (ctx.drivers ?? [])
    .slice(0, 3)
    .map((d) => d.label)
    .join(";");
  return [
    panel,
    ctx.posture ?? "",
    ctx.tradeoff ?? "",
    ctx.nextMove ?? "",
    (ctx.objectIds ?? []).join(","),
    ctx.fragilityLevel ?? "",
    topDrivers,
    (ctx.summary ?? "").slice(0, 80),
  ].join("|");
}

// Module-scoped guard to stop identical B9 emits before dedupe logger is called.
const LAST_B9_TRACE_SIG_BY_PANEL = new Map<string, string>();

/** Dev-only; deduped via `dedupeNexoraDevLog` (stable payload signature). */
export function traceNexoraB9PanelMeaningEnriched(panel: string, ctx: NexoraB8PanelContext): void {
  const sig = buildB9MeaningSignature(panel, ctx);
  if (LAST_B9_TRACE_SIG_BY_PANEL.get(panel) === sig) return;
  LAST_B9_TRACE_SIG_BY_PANEL.set(panel, sig);
  dedupeNexoraDevLog("[Nexora][B9] panel_meaning_enriched", panel, { sig });
}

export function buildSimulationStubSummary(ctx: NexoraB8PanelContext): string | null {
  const p = ctx.posture ?? "Current decision";
  const frag = ctx.fragilityLevel ? `Fragility: ${ctx.fragilityLevel}. ` : "";
  const tail = (ctx.summary ?? "").trim().slice(0, 140);
  const line = `${frag}Posture «${p}».${tail ? ` ${tail}` : ""}`.trim();
  return line.length ? line : null;
}

export function buildCompareAnchorSummary(ctx: NexoraB8PanelContext): string | null {
  const p = ctx.posture ?? "current posture";
  const n = ctx.objectIds?.length ?? 0;
  const top = (ctx.drivers ?? []).map((d) => d.label).filter(Boolean)[0];
  const parts = [`Comparing against decision posture: ${p}.`];
  if (top) parts.push(`Top driver theme: ${top}.`);
  if (n > 0) parts.push(`Highlighted objects: ${n}.`);
  return parts.join(" ");
}

export function buildSimulateMeaningRows(ctx: NexoraB8PanelContext): Array<{ label: string; text: string }> {
  const rows: Array<{ label: string; text: string }> = [];
  if (ctx.posture) rows.push({ label: "Posture", text: ctx.posture });
  if (ctx.tradeoff) rows.push({ label: "Tradeoff", text: ctx.tradeoff });
  if (ctx.nextMove) rows.push({ label: "Next move", text: ctx.nextMove });
  return rows;
}

export function buildCompareMeaningCue(ctx: NexoraB8PanelContext): string[] {
  const lines: string[] = [];
  if (ctx.posture) lines.push(`Current posture: ${ctx.posture}`);
  const top = (ctx.drivers ?? []).map((d) => d.label).filter(Boolean)[0];
  if (top) lines.push(`Top driver: ${top}`);
  const n = ctx.objectIds?.length ?? 0;
  if (n) lines.push(`Affected highlights: ${n} object${n === 1 ? "" : "s"}`);
  return lines.slice(0, 3);
}

export function buildAdviceWhyLines(ctx: NexoraB8PanelContext): string[] {
  const lines: string[] = [];
  if (ctx.fragilityLevel) lines.push(`Fragility: ${ctx.fragilityLevel}.`);
  const tops = (ctx.drivers ?? [])
    .map((d) => d.label)
    .filter(Boolean)
    .slice(0, 2);
  if (tops.length) lines.push(`Drivers: ${tops.join(" · ")}.`);
  const n = ctx.objectIds?.length ?? 0;
  if (n) lines.push(`Scene focus: ${n} highlighted object${n === 1 ? "" : "s"}.`);
  if (ctx.nextMove) lines.push(`Recommended next move: ${ctx.nextMove}`);
  return lines.slice(0, 4);
}
