/**
 * B.38 — Domain pack QA gate.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraLocaleDomainPack } from "./nexoraDomainPack.ts";
import {
  evaluateAllDomainPacksQA,
  evaluateDomainPackCoverage,
  getDomainPackQAStatus,
  REQUIRED_KEYS,
  runDomainPackQAAndLogDev,
  toSafeLocaleDomainIdForPack,
} from "./nexoraDomainPackQA.ts";
import { getNexoraLocalePack, listNexoraLocaleDomainPacks, REQUIRED_INSIGHT_MAPPING_KEYS } from "./nexoraDomainPackRegistry.ts";

test("shipped retail pack evaluates to ready", () => {
  const p = getNexoraLocalePack("retail");
  const r = evaluateDomainPackCoverage(p);
  assert.equal(r.status, "ready");
  assert.ok(r.score >= 0.75);
});

test("missing insight mappings → invalid", () => {
  const bad: NexoraLocaleDomainPack = {
    id: "broken",
    label: "Broken",
    aliases: ["broken"],
    insightMapping: {},
    reviewMapping: {},
    synthesisMapping: {},
    vocabulary: {},
  };
  const r = evaluateDomainPackCoverage(bad);
  assert.equal(r.status, "invalid");
  assert.ok(r.issues.some((x) => x.includes("insight")));
});

test("half insight coverage → partial or invalid depending on score", () => {
  const halfInsight: Record<string, string> = {};
  for (let i = 0; i < REQUIRED_INSIGHT_MAPPING_KEYS.length; i += 1) {
    const k = REQUIRED_INSIGHT_MAPPING_KEYS[i];
    halfInsight[k] = i % 2 === 0 ? "ok" : "";
  }
  const p: NexoraLocaleDomainPack = {
    id: "half",
    label: "Half",
    aliases: ["half"],
    insightMapping: halfInsight,
    reviewMapping: {},
    synthesisMapping: {},
    vocabulary: {},
  };
  const r = evaluateDomainPackCoverage(p);
  assert.ok(r.status === "partial" || r.status === "invalid");
});

test("generic pack always ready", () => {
  const g = getNexoraLocalePack("generic");
  const r = evaluateDomainPackCoverage(g);
  assert.equal(r.status, "ready");
  assert.equal(getDomainPackQAStatus("generic"), "ready");
});

test("deterministic scoring for same pack", () => {
  const p = getNexoraLocalePack("finance");
  assert.deepEqual(evaluateDomainPackCoverage(p), evaluateDomainPackCoverage(p));
});

test("full registry QA returns one report per pack", () => {
  const all = evaluateAllDomainPacksQA();
  assert.equal(all.length, listNexoraLocaleDomainPacks().length);
  assert.ok(all.every((r) => r.domainId));
  const sig = runDomainPackQAAndLogDev().map((x) => x.status).join(",");
  assert.ok(sig.length > 0);
});

test("toSafeLocaleDomainIdForPack leaves known domains unchanged", () => {
  assert.equal(toSafeLocaleDomainIdForPack("retail"), "retail");
  assert.equal(toSafeLocaleDomainIdForPack("unknown_xyz_abc"), "generic");
});

test("REQUIRED_KEYS exposes insight + semantic review + synthesis groups", () => {
  assert.ok(REQUIRED_KEYS.insight.length >= 10);
  assert.deepEqual(REQUIRED_KEYS.review, ["low_compare", "low_decision", "low_outcome"]);
  assert.deepEqual(REQUIRED_KEYS.synthesis, ["summary", "finding", "priority"]);
});

test("injected registry duplicate issue marks pack invalid", () => {
  const p = getNexoraLocalePack("retail");
  const r = evaluateDomainPackCoverage(p, {
    registryIssues: ['duplicate alias "foo" on retail and supply_chain'],
  });
  assert.equal(r.status, "invalid");
  assert.ok(r.issues.some((x) => x.includes("duplicate alias")));
});
