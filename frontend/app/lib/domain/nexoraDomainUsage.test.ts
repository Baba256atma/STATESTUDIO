/**
 * B.41 — Domain usage storage + aggregation.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDomainUsageSummary,
  clearDomainUsage,
  describeDomainAdoption,
  logDomainUsage,
  loadDomainUsage,
  NEXORA_DOMAIN_USAGE_STORAGE_KEY,
  NEXORA_DOMAIN_USAGE_MAX_RECORDS,
  type NexoraDomainUsageRecord,
} from "./nexoraDomainUsage.ts";
import { ensureBrowserLocalStorageHarness } from "../test-harness/browserLocalStorageHarness.ts";

function installMockWindow(): { cleanup: () => void } {
  const cleanup = ensureBrowserLocalStorageHarness({
    includeEventDispatch: true,
    clearIfPresent: true,
  });
  return { cleanup };
}

test("logging works", () => {
  const { cleanup } = installMockWindow();
  try {
    clearDomainUsage();
    logDomainUsage({
      domainRequested: "retail",
      domainResolved: "retail",
      domainEffective: "retail",
      timestamp: 10_000,
    });
    assert.ok(window.localStorage.getItem(NEXORA_DOMAIN_USAGE_STORAGE_KEY));
    const rows = loadDomainUsage();
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.domainResolved, "retail");
  } finally {
    cleanup();
  }
});

test("FIFO cap enforced", () => {
  const { cleanup } = installMockWindow();
  try {
    clearDomainUsage();
    for (let i = 0; i < NEXORA_DOMAIN_USAGE_MAX_RECORDS + 5; i += 1) {
      logDomainUsage({
        domainRequested: "finance",
        domainResolved: "finance",
        domainEffective: "generic",
        timestamp: 1000 + i,
      });
    }
    const rows = loadDomainUsage();
    assert.equal(rows.length, NEXORA_DOMAIN_USAGE_MAX_RECORDS);
    assert.equal(rows[0]?.timestamp, 1005);
    assert.equal(rows[rows.length - 1]?.timestamp, 1000 + NEXORA_DOMAIN_USAGE_MAX_RECORDS + 4);
  } finally {
    cleanup();
  }
});

test("aggregation + fallback detection", () => {
  const records: NexoraDomainUsageRecord[] = [
    { domainRequested: "retail", domainResolved: "retail", domainEffective: "retail", timestamp: 1 },
    { domainRequested: "retail", domainResolved: "retail", domainEffective: "generic", timestamp: 2 },
    { domainRequested: "retail", domainResolved: "retail", domainEffective: "generic", timestamp: 3 },
    { domainRequested: "x", domainResolved: "finance", domainEffective: "finance", timestamp: 4 },
  ];
  const s = buildDomainUsageSummary(records);
  const retail = s.find((x) => x.domainId === "retail");
  const fin = s.find((x) => x.domainId === "finance");
  assert.ok(retail);
  assert.equal(retail.totalRequests, 3);
  assert.equal(retail.effectiveUses, 1);
  assert.equal(retail.fallbackCount, 2);
  assert.ok(Math.abs(retail.fallbackRate - 2 / 3) < 1e-9);
  assert.ok(fin);
  assert.equal(fin.fallbackCount, 0);
  assert.equal(fin.fallbackRate, 0);
});

test("sorting stable: totalRequests desc then domainId", () => {
  const records: NexoraDomainUsageRecord[] = [
    { domainRequested: "a", domainResolved: "finance", domainEffective: "finance", timestamp: 1 },
    { domainRequested: "b", domainResolved: "retail", domainEffective: "retail", timestamp: 2 },
    { domainRequested: "c", domainResolved: "retail", domainEffective: "retail", timestamp: 3 },
  ];
  const s = buildDomainUsageSummary(records);
  assert.deepEqual(
    s.map((x) => x.domainId),
    ["retail", "finance"],
  );
});

test("describeDomainAdoption is deterministic", () => {
  const a: NexoraDomainUsageRecord[] = [
    { domainRequested: "r", domainResolved: "retail", domainEffective: "retail", timestamp: 1 },
    { domainRequested: "r", domainResolved: "retail", domainEffective: "retail", timestamp: 2 },
    { domainRequested: "r", domainResolved: "retail", domainEffective: "retail", timestamp: 3 },
  ];
  const s1 = buildDomainUsageSummary(a);
  const m1 = describeDomainAdoption(s1);
  const m2 = describeDomainAdoption(s1);
  assert.equal(m1, m2);
  assert.ok(m1.length > 0);
});

test("describeDomainAdoption: high global fallback", () => {
  const records: NexoraDomainUsageRecord[] = [
    { domainRequested: "r", domainResolved: "retail", domainEffective: "generic", timestamp: 1 },
    { domainRequested: "r", domainResolved: "retail", domainEffective: "generic", timestamp: 2 },
    { domainRequested: "r", domainResolved: "retail", domainEffective: "generic", timestamp: 3 },
    { domainRequested: "r", domainResolved: "retail", domainEffective: "retail", timestamp: 4 },
  ];
  const msg = describeDomainAdoption(buildDomainUsageSummary(records));
  assert.ok(msg.includes("generic"), msg);
});
