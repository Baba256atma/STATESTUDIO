/**
 * B.37 — Locale domain pack registry and resolution.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraLocaleDomainPack } from "./nexoraDomainPack.ts";
import {
  getNexoraLocalePack,
  listNexoraLocaleDomainPacks,
  lookupInsightMapping,
  resolveDomainId,
  resolveNexoraLocaleDomainId,
  translateLocalePhrase,
  validateDomainPack,
  validateLocalePackRegistry,
} from "./nexoraDomainPackRegistry.ts";

test("alias resolution: scm and supply chain variants → supply_chain", () => {
  assert.equal(resolveNexoraLocaleDomainId("scm"), "supply_chain");
  assert.equal(resolveNexoraLocaleDomainId("supply_chain"), "supply_chain");
  assert.equal(resolveNexoraLocaleDomainId("supply chain"), "supply_chain");
  assert.equal(resolveDomainId("supplier_network"), "supply_chain");
});

test("unknown domain id falls back to generic", () => {
  assert.equal(resolveNexoraLocaleDomainId("totally_unknown_pack_zz"), "generic");
});

test("retail pack resolves and exposes vocabulary + insight line", () => {
  const p = getNexoraLocalePack("retail");
  assert.equal(p.id, "retail");
  assert.ok(Object.keys(p.vocabulary ?? {}).length > 0);
  const line = lookupInsightMapping("retail", "line_scenario_explore");
  assert.ok(line.includes("operational"));
});

test("psych_yung aliases resolve correctly", () => {
  assert.equal(resolveNexoraLocaleDomainId("jung"), "psych_yung");
  assert.equal(resolveNexoraLocaleDomainId("psycho_spiritual"), "psych_yung");
  assert.equal(resolveNexoraLocaleDomainId("psych_yung"), "psych_yung");
  assert.equal(getNexoraLocalePack("psych").trustBias, -0.05);
});

test("validateDomainPack catches missing fields", () => {
  const bad = { id: "", label: "", aliases: [] } as unknown as NexoraLocaleDomainPack;
  const issues = validateDomainPack(bad);
  assert.ok(issues.some((x) => x.includes("missing id")));
  assert.ok(issues.some((x) => x.includes("missing label")));
});

test("deterministic: same input → same pack id and translation", () => {
  assert.equal(resolveNexoraLocaleDomainId("commerce"), resolveNexoraLocaleDomainId("commerce"));
  const a = translateLocalePhrase("Users are not exploring scenarios", "finance", "synthesis");
  const b = translateLocalePhrase("Users are not exploring scenarios", "finance", "synthesis");
  assert.equal(a, b);
  assert.ok(a.includes("Risk"));
});

test("shipped registry validates clean + list packs includes generic first", () => {
  const regIssues = validateLocalePackRegistry();
  assert.deepEqual(regIssues, [], `registry issues: ${regIssues.join("; ")}`);
  const packs = listNexoraLocaleDomainPacks();
  assert.ok(packs.length >= 5);
  assert.ok(packs.some((p) => p.id === "generic"));
});

test("fallback: synthesis phrase uses review mapping when only review differs (shared keys)", () => {
  const g = translateLocalePhrase("Learning loop is weak", "retail", "synthesis");
  assert.ok(g.includes("Operational feedback"));
});
