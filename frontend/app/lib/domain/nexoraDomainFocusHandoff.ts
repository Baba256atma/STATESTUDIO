/**
 * B.46 — Standup-ready copy of B.45 focus.
 * B.47 — Optional date / domain / status in the header (plain text, deterministic).
 */

import type { NexoraActionHeadline } from "./nexoraDomainActionHeadline.ts";

export type NexoraFocusHandoffContext = {
  date?: string | null;
  domainId?: string | null;
  status?: string | null;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local calendar YYYY-MM-DD (operator “today” for standups). */
export function formatDateYYYYMMDD(input: Date | string): string | null {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return null;
    return `${input.getFullYear()}-${pad2(input.getMonth() + 1)}-${pad2(input.getDate())}`;
  }
  const s = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const t = Date.parse(s);
  if (Number.isNaN(t)) return null;
  const d = new Date(t);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * Normalizes optional handoff fields; drops invalid or empty values.
 */
export function buildFocusHandoffContext(input: {
  domainId?: string | null;
  priority?: string | null;
  date?: Date | string | null;
}): NexoraFocusHandoffContext {
  const out: NexoraFocusHandoffContext = {};
  if (input.date != null) {
    const d = formatDateYYYYMMDD(input.date);
    if (d) out.date = d;
  }
  const dom = input.domainId != null ? String(input.domainId).trim() : "";
  if (dom) out.domainId = dom;
  const st = input.priority != null ? String(input.priority).trim().toLowerCase() : "";
  if (st) out.status = st;
  return out;
}

function normalizeContextDate(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  return formatDateYYYYMMDD(t);
}

function contextHeaderLine(ctx?: NexoraFocusHandoffContext): string | null {
  if (!ctx) return null;
  const parts: string[] = [];
  const dNorm = ctx.date != null ? normalizeContextDate(String(ctx.date)) : null;
  if (dNorm) parts.push(dNorm);
  const dom = ctx.domainId?.trim();
  if (dom) parts.push(dom);
  const st = ctx.status?.trim().toLowerCase();
  if (st) parts.push(st);
  return parts.length ? parts.join(" | ") : null;
}

/**
 * Shareable micro-update for standups / Slack. Hint omitted when absent.
 * Without usable context fields, uses the original B.46 `Nexora Focus:` header.
 */
export function formatFocusForStandup(headline: NexoraActionHeadline, context?: NexoraFocusHandoffContext): string {
  const h = headline.headline.trim();
  const hint = headline.hint?.trim();
  const extra = contextHeaderLine(context);
  const label = extra ? `Nexora Focus (${extra}):` : "Nexora Focus:";
  let body = `${label}\n${h}`;
  if (hint) {
    body += `\n\n${hint}`;
  }
  return `${body}\n`;
}

export function logFocusCopiedDev(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][B46] focus_copied");
}

export function syncDomainFocusHandoffDebug(text: string): void {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
  const w = window as Window & { __NEXORA_DEBUG__?: Record<string, unknown> };
  w.__NEXORA_DEBUG__ = { ...(w.__NEXORA_DEBUG__ ?? {}) };
  w.__NEXORA_DEBUG__.domainFocusHandoff = text;
}
