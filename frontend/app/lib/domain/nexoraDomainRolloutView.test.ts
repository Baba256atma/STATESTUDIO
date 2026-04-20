/**
 * B.40 — Domain rollout view rows + runtime fallback wiring.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCurrentDomainRuntimeState,
  buildDomainRolloutViewRows,
} from "./nexoraDomainRolloutView.ts";
import { evaluateAllDomainPacksQA } from "./nexoraDomainPackQA.ts";
import {
  evaluateAllDomainPackRollouts,
  isAmbiguousGenericDomainResolution,
  toSafeLocaleDomainIdForRollout,
} from "./nexoraDomainPackRollout.ts";
import { listNexoraLocaleDomainPacks, resolveNexoraLocaleDomainId } from "./nexoraDomainPackRegistry.ts";

test("rows include all registered domains", () => {
  const rows = buildDomainRolloutViewRows();
  const packs = listNexoraLocaleDomainPacks();
  assert.equal(rows.length, packs.length);
  const ids = new Set(rows.map((r) => r.domainId));
  for (const p of packs) assert.ok(ids.has(p.id));
});

test("rollout + QA status merge matches underlying evaluators", () => {
  const rows = buildDomainRolloutViewRows();
  const qa = evaluateAllDomainPacksQA();
  const rollout = evaluateAllDomainPackRollouts();
  const qaBy = new Map(qa.map((r) => [r.domainId, r]));
  const roBy = new Map(rollout.map((r) => [r.domainId, r]));
  for (const row of rows) {
    assert.equal(row.qaStatus, qaBy.get(row.domainId)?.status);
    assert.equal(row.qaScore, qaBy.get(row.domainId)?.score);
    assert.equal(row.rolloutStatus, roBy.get(row.domainId)?.status);
  }
});

test("runtime fallback state matches B.39 rollout safety composition", () => {
  const requested = "retail";
  const resolved = resolveNexoraLocaleDomainId(requested);
  const effective = toSafeLocaleDomainIdForRollout(requested);
  const ambiguous = isAmbiguousGenericDomainResolution(requested, resolved);
  const rt = buildCurrentDomainRuntimeState(requested);
  assert.equal(rt.requestedDomainId, requested);
  assert.equal(rt.effectiveDomainId, effective);
  assert.equal(rt.fallbackActive, effective !== resolved || ambiguous);
});

test("deterministic row ordering: generic first, then lexicographic domainId", () => {
  const rows = buildDomainRolloutViewRows();
  assert.equal(rows[0]?.domainId, "generic");
  const rest = rows.slice(1).map((r) => r.domainId);
  const sorted = [...rest].sort((a, b) => a.localeCompare(b));
  assert.deepEqual(rest, sorted);
});

test("sample registry: finance product_ready, psych_yung pilot_ready, generic product_ready", () => {
  const rows = buildDomainRolloutViewRows();
  const by = new Map(rows.map((r) => [r.domainId, r]));
  assert.equal(by.get("finance")?.rolloutStatus, "product_ready");
  assert.equal(by.get("psych_yung")?.rolloutStatus, "pilot_ready");
  assert.equal(by.get("generic")?.rolloutStatus, "product_ready");
  assert.equal(by.get("finance")?.qaStatus, "ready");
});

test("pilot mode: unknown workspace forces generic effective domain and fallback", () => {
  const prev = process.env.NEXT_PUBLIC_NEXORA_PRODUCT_MODE;
  process.env.NEXT_PUBLIC_NEXORA_PRODUCT_MODE = "pilot";
  try {
    const rt = buildCurrentDomainRuntimeState("totally_unknown_workspace_domain_zz");
    assert.equal(rt.effectiveDomainId, "generic");
    assert.equal(rt.fallbackActive, true);
  } finally {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_NEXORA_PRODUCT_MODE;
    else process.env.NEXT_PUBLIC_NEXORA_PRODUCT_MODE = prev;
  }
});
