/**
 * B.46 / B.47 — Focus standup formatter + optional context header.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFocusHandoffContext,
  formatFocusForStandup,
} from "./nexoraDomainFocusHandoff.ts";
import type { NexoraActionHeadline } from "./nexoraDomainActionHeadline.ts";

test("headline only (no hint) — B.46 preserved without context", () => {
  const h: NexoraActionHeadline = { headline: "Focus: reduce fallback in retail." };
  const out = formatFocusForStandup(h);
  assert.equal(out, "Nexora Focus:\nFocus: reduce fallback in retail.\n");
  assert.ok(!out.includes("\n\n"));
});

test("headline + hint — B.46 preserved without context", () => {
  const h: NexoraActionHeadline = {
    headline: "Focus: reduce fallback in retail.",
    hint: "Start with mapping or vocabulary fixes.",
  };
  const out = formatFocusForStandup(h);
  assert.equal(
    out,
    "Nexora Focus:\nFocus: reduce fallback in retail.\n\nStart with mapping or vocabulary fixes.\n",
  );
});

test("no actions case", () => {
  const h: NexoraActionHeadline = { headline: "No immediate action required." };
  assert.equal(formatFocusForStandup(h), "Nexora Focus:\nNo immediate action required.\n");
});

test("formatting stable", () => {
  const h: NexoraActionHeadline = { headline: "A", hint: "B" };
  assert.equal(formatFocusForStandup(h), formatFocusForStandup(h));
});

test("with date only (B.47)", () => {
  const h: NexoraActionHeadline = { headline: "Focus: x." };
  const out = formatFocusForStandup(h, { date: "2026-04-19" });
  assert.equal(out, "Nexora Focus (2026-04-19):\nFocus: x.\n");
});

test("with date + domain (B.47)", () => {
  const h: NexoraActionHeadline = { headline: "Focus: reduce fallback in retail." };
  const out = formatFocusForStandup(h, { date: "2026-04-19", domainId: "retail" });
  assert.equal(out, "Nexora Focus (2026-04-19 | retail):\nFocus: reduce fallback in retail.\n");
});

test("with full context date | domain | status (B.47)", () => {
  const h: NexoraActionHeadline = {
    headline: "Focus: reduce fallback in retail.",
    hint: "Start with mapping or vocabulary fixes.",
  };
  const out = formatFocusForStandup(h, { date: "2026-04-19", domainId: "retail", status: "high" });
  assert.equal(
    out,
    "Nexora Focus (2026-04-19 | retail | high):\nFocus: reduce fallback in retail.\n\nStart with mapping or vocabulary fixes.\n",
  );
});

test("missing/invalid context omitted safely", () => {
  const h: NexoraActionHeadline = { headline: "X" };
  assert.equal(formatFocusForStandup(h, {}), "Nexora Focus:\nX\n");
  assert.equal(formatFocusForStandup(h, { date: "not-a-date", domainId: "   ", status: "" }), "Nexora Focus:\nX\n");
});

test("deterministic output", () => {
  const h: NexoraActionHeadline = { headline: "A", hint: "B" };
  const ctx = { date: "2026-01-02", domainId: "finance", status: "medium" };
  assert.equal(formatFocusForStandup(h, ctx), formatFocusForStandup(h, ctx));
});

test("buildFocusHandoffContext formats date and lowercases status", () => {
  const d = new Date(2026, 3, 19);
  const c = buildFocusHandoffContext({
    date: d,
    domainId: "  retail  ",
    priority: " HIGH ",
  });
  assert.equal(c.date, "2026-04-19");
  assert.equal(c.domainId, "retail");
  assert.equal(c.status, "high");
});

test("no extra whitespace (trim inputs)", () => {
  const h: NexoraActionHeadline = {
    headline: "  spaced headline.  ",
    hint: "  spaced hint.  ",
  };
  const out = formatFocusForStandup(h);
  assert.ok(!out.startsWith(" "));
  assert.ok(!out.includes("  spaced"));
  assert.ok(out.includes("spaced headline."));
  assert.ok(out.endsWith("\n") && !out.endsWith("\n\n\n"));
});
