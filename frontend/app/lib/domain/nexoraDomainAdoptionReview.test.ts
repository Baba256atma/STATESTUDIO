/**
 * B.42 — Domain adoption review rules + ordering.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDomainAdoptionReviewFromSignals,
  buildDomainAdoptionReviews,
  describeDomainAdoptionHealth,
  type NexoraDomainAdoptionReview,
} from "./nexoraDomainAdoptionReview.ts";

test("dev_only → experimental", () => {
  const r = buildDomainAdoptionReviewFromSignals({
    domainId: "retail",
    domainLabel: "Retail",
    rolloutStatus: "dev_only",
    qaStatus: "ready",
    qaScore: 0.99,
    totalRequests: 50,
    fallbackRate: 0,
  });
  assert.equal(r.status, "experimental");
  assert.equal(r.issues[0], "Domain not yet rolled out");
  assert.ok(r.recommendations.some((x) => x.includes("dev")));
});

test("low QA → unstable", () => {
  const r = buildDomainAdoptionReviewFromSignals({
    domainId: "finance",
    domainLabel: "Finance",
    rolloutStatus: "product_ready",
    qaStatus: "invalid",
    qaScore: 0.2,
    totalRequests: 10,
    fallbackRate: 0,
  });
  assert.equal(r.status, "unstable");
  assert.ok(r.recommendations.some((x) => x.includes("QA")));
});

test("ready QA but score < 0.75 → unstable", () => {
  const r = buildDomainAdoptionReviewFromSignals({
    domainId: "finance",
    domainLabel: "Finance",
    rolloutStatus: "product_ready",
    qaStatus: "ready",
    qaScore: 0.5,
    totalRequests: 10,
    fallbackRate: 0,
  });
  assert.equal(r.status, "unstable");
});

test("high fallback → fallback_heavy", () => {
  const r = buildDomainAdoptionReviewFromSignals({
    domainId: "retail",
    domainLabel: "Retail",
    rolloutStatus: "product_ready",
    qaStatus: "ready",
    qaScore: 0.95,
    totalRequests: 5,
    fallbackRate: 0.6,
  });
  assert.equal(r.status, "fallback_heavy");
  assert.ok(r.recommendations.some((x) => x.toLowerCase().includes("mapping")));
});

test("low usage → underused", () => {
  const r = buildDomainAdoptionReviewFromSignals({
    domainId: "supply_chain",
    domainLabel: "Supply chain",
    rolloutStatus: "product_ready",
    qaStatus: "ready",
    qaScore: 0.95,
    totalRequests: 1,
    fallbackRate: 0,
  });
  assert.equal(r.status, "underused");
});

test("healthy domain", () => {
  const r = buildDomainAdoptionReviewFromSignals({
    domainId: "finance",
    domainLabel: "Finance",
    rolloutStatus: "product_ready",
    qaStatus: "ready",
    qaScore: 0.95,
    totalRequests: 10,
    fallbackRate: 0.1,
  });
  assert.equal(r.status, "healthy");
  assert.ok(r.recommendations.includes("No immediate action"));
});

test("deterministic ordering worst → best", () => {
  const rank: Record<string, number> = {
    experimental: 0,
    unstable: 1,
    fallback_heavy: 2,
    underused: 3,
    healthy: 4,
  };
  const rows: NexoraDomainAdoptionReview[] = [
    buildDomainAdoptionReviewFromSignals({
      domainId: "z",
      domainLabel: "Z",
      rolloutStatus: "product_ready",
      qaStatus: "ready",
      qaScore: 0.95,
      totalRequests: 10,
      fallbackRate: 0,
    }),
    buildDomainAdoptionReviewFromSignals({
      domainId: "a",
      domainLabel: "A",
      rolloutStatus: "dev_only",
      qaStatus: "ready",
      qaScore: 0.95,
      totalRequests: 10,
      fallbackRate: 0,
    }),
    buildDomainAdoptionReviewFromSignals({
      domainId: "m",
      domainLabel: "M",
      rolloutStatus: "product_ready",
      qaStatus: "ready",
      qaScore: 0.95,
      totalRequests: 5,
      fallbackRate: 0.6,
    }),
  ];
  rows.sort((x, y) => {
    const ra = rank[x.status] ?? 99;
    const rb = rank[y.status] ?? 99;
    if (ra !== rb) return ra - rb;
    return x.domainId.localeCompare(y.domainId);
  });
  assert.deepEqual(
    rows.map((r) => r.status),
    ["experimental", "fallback_heavy", "healthy"],
  );
});

test("buildDomainAdoptionReviews matches registry size and sorts", () => {
  const rank: Record<string, number> = {
    experimental: 0,
    unstable: 1,
    fallback_heavy: 2,
    underused: 3,
    healthy: 4,
  };
  const all = buildDomainAdoptionReviews();
  assert.ok(all.length >= 5);
  for (let i = 1; i < all.length; i += 1) {
    const prev = all[i - 1]!;
    const cur = all[i]!;
    const rp = rank[prev.status] ?? 99;
    const rc = rank[cur.status] ?? 99;
    assert.ok(rc >= rp, `${cur.domainId} after ${prev.domainId}`);
    if (rc === rp) {
      assert.ok(prev.domainId.localeCompare(cur.domainId) <= 0);
    }
  }
});

test("recommendations match status", () => {
  const cases: Array<{ status: string; needle: string }> = [
    { status: "experimental", needle: "pilot" },
    { status: "unstable", needle: "QA" },
    { status: "fallback_heavy", needle: "mapping" },
    { status: "underused", needle: "visibility" },
    { status: "healthy", needle: "No immediate action" },
  ];
  for (const c of cases) {
    const r = buildDomainAdoptionReviewFromSignals({
      domainId: "x",
      domainLabel: "X",
      rolloutStatus: c.status === "experimental" ? "dev_only" : "product_ready",
      qaStatus:
        c.status === "unstable"
          ? "invalid"
          : c.status === "healthy" || c.status === "underused" || c.status === "fallback_heavy"
            ? "ready"
            : "ready",
      qaScore: c.status === "unstable" ? 0.1 : 0.95,
      totalRequests: c.status === "underused" ? 0 : c.status === "fallback_heavy" ? 5 : 10,
      fallbackRate: c.status === "fallback_heavy" ? 0.6 : 0,
    });
    assert.equal(r.status, c.status, c.status);
    assert.ok(
      r.recommendations.some((line) => line.toLowerCase().includes(c.needle.toLowerCase())),
      `${c.status}: ${r.recommendations.join(" | ")}`,
    );
  }
});

test("describeDomainAdoptionHealth deterministic", () => {
  const healthyOnly: NexoraDomainAdoptionReview[] = [
    buildDomainAdoptionReviewFromSignals({
      domainId: "a",
      domainLabel: "A",
      rolloutStatus: "product_ready",
      qaStatus: "ready",
      qaScore: 0.95,
      totalRequests: 10,
      fallbackRate: 0,
    }),
  ];
  assert.equal(describeDomainAdoptionHealth(healthyOnly), describeDomainAdoptionHealth(healthyOnly));
  assert.ok(describeDomainAdoptionHealth(healthyOnly).includes("healthy"));
});
