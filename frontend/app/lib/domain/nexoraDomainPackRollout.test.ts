/**
 * B.39 — Domain pack rollout gate.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraDomainPackQAReport } from "./nexoraDomainPackQA.ts";
import {
  evaluateAllDomainPackRollouts,
  evaluateDomainPackRollout,
  evaluateDomainPackRolloutFromPack,
  isDomainPackAllowedForPilot,
  isDomainPackAllowedForProduct,
  runDomainPackRolloutAndLogDev,
} from "./nexoraDomainPackRollout.ts";
import { getNexoraLocalePack } from "./nexoraDomainPackRegistry.ts";

test("unknown domain string → dev_only (ambiguous generic resolution)", () => {
  const r = evaluateDomainPackRollout("totally_unknown_workspace_domain_zz");
  assert.equal(r.status, "dev_only");
  assert.ok(r.reasons.some((x) => x.includes("Unknown")));
});

test("psych_yung: pilot_ready without product approval", () => {
  const r = evaluateDomainPackRollout("psych_yung");
  assert.equal(r.status, "pilot_ready");
  assert.ok(r.reasons.some((x) => x.includes("product") || x.includes("Product")));
});

test("finance: product_ready with explicit product approval and high QA score", () => {
  const r = evaluateDomainPackRollout("finance");
  assert.equal(r.status, "product_ready");
});

test("invalid QA snapshot → dev_only", () => {
  const pack = getNexoraLocalePack("finance");
  const badQa: NexoraDomainPackQAReport = {
    domainId: "finance",
    status: "invalid",
    score: 0.2,
    coverage: { insight: 0, review: 0, synthesis: 0, vocabulary: 0 },
    issues: ["broken"],
  };
  const r = evaluateDomainPackRolloutFromPack(pack, badQa);
  assert.equal(r.status, "dev_only");
});

test("partial QA snapshot → dev_only (conservative)", () => {
  const pack = getNexoraLocalePack("retail");
  const partialQa: NexoraDomainPackQAReport = {
    domainId: "retail",
    status: "partial",
    score: 0.8,
    coverage: { insight: 0.9, review: 0.7, synthesis: 0.9, vocabulary: 0.7 },
    issues: ["incomplete"],
  };
  const r = evaluateDomainPackRolloutFromPack(pack, partialQa);
  assert.equal(r.status, "dev_only");
});

test("helper booleans: product implies pilot", () => {
  assert.equal(isDomainPackAllowedForProduct("finance"), true);
  assert.equal(isDomainPackAllowedForPilot("finance"), true);
  assert.equal(isDomainPackAllowedForProduct("psych_yung"), false);
  assert.equal(isDomainPackAllowedForPilot("psych_yung"), true);
});

test("deterministic rollout for same domain", () => {
  assert.deepEqual(evaluateDomainPackRollout("retail"), evaluateDomainPackRollout("retail"));
});

test("full registry rollout evaluation completes", () => {
  const all = evaluateAllDomainPackRollouts();
  assert.ok(all.length >= 5);
  const sig = runDomainPackRolloutAndLogDev().map((x) => `${x.domainId}:${x.status}`).join(",");
  assert.ok(sig.includes("generic"));
});

test("generic pack is product_ready", () => {
  const r = evaluateDomainPackRollout("generic");
  assert.equal(r.status, "product_ready");
});
