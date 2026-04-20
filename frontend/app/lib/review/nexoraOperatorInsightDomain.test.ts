/**
 * B.35 — Domain-aware operator insight copy (deterministic).
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraPilotSynthesis } from "./nexoraPilotSynthesis.ts";
import {
  buildDomainAwareOperatorInsightHint,
  buildDomainAwareOperatorInsightLine,
  normalizeOperatorInsightDomain,
} from "./nexoraOperatorInsightDomain.ts";

const lowCompareModerate: NexoraPilotSynthesis = {
  overallStatus: "moderate",
  summary: "Nexora is analytically strong but user engagement is still shallow.",
  keyFindings: ["Users are not exploring scenarios"],
  priorities: ["Improve compare visibility"],
};

test("generic: low scenario exploration uses generic scenario line + compare hint", () => {
  const line = buildDomainAwareOperatorInsightLine({ synthesis: lowCompareModerate, domainId: null });
  const hint = buildDomainAwareOperatorInsightHint({ synthesis: lowCompareModerate, domainId: null });
  assert.equal(line, "System insight: explore more scenarios to improve decisions.");
  assert.equal(hint, "Try: explore scenarios more.");
});

test("retail: low scenario exploration uses retail-specific line + hint", () => {
  const line = buildDomainAwareOperatorInsightLine({ synthesis: lowCompareModerate, domainId: "retail" });
  const hint = buildDomainAwareOperatorInsightHint({ synthesis: lowCompareModerate, domainId: "retail" });
  assert.equal(line, "System insight: compare more operational paths before acting.");
  assert.equal(hint, "Try: compare more operating paths.");
});

test("supply_chain: weak learning loop uses downstream-outcomes line + outcome hint slot", () => {
  const synthesis: NexoraPilotSynthesis = {
    overallStatus: "moderate",
    summary: "Nexora is capable but signals are mixed — tighten workflows before scaling the pilot.",
    keyFindings: ["Learning loop is weak"],
    priorities: ["Improve outcome capture UX"],
  };
  const line = buildDomainAwareOperatorInsightLine({ synthesis, domainId: "supplier_network" });
  const hint = buildDomainAwareOperatorInsightHint({ synthesis, domainId: "scm" });
  assert.equal(line, "System insight: capture downstream outcomes to improve flow learning.");
  assert.equal(hint, "Try: record what happened after key decisions.");
});

test("finance: strong state uses finance-specific strong line", () => {
  const synthesis: NexoraPilotSynthesis = {
    overallStatus: "strong",
    summary: "Nexora is performing well and ready for controlled pilot.",
    keyFindings: [],
    priorities: [],
  };
  const line = buildDomainAwareOperatorInsightLine({ synthesis, domainId: "finance" });
  assert.equal(line, "System insight: decision quality is stable. Continue the current discipline.");
  assert.equal(buildDomainAwareOperatorInsightHint({ synthesis, domainId: "finance" }), null);
});

test("psych_yung: low decision engagement uses interpretive integration line", () => {
  const synthesis: NexoraPilotSynthesis = {
    overallStatus: "moderate",
    summary: "Nexora is capable but signals are mixed — tighten workflows before scaling the pilot.",
    keyFindings: ["Decision engagement is low"],
    priorities: [],
  };
  for (const domainId of ["psych_yung", "psych", "jung", "psycho_spiritual_demo"]) {
    const norm = normalizeOperatorInsightDomain(domainId);
    assert.equal(norm, "psych_yung");
    const line = buildDomainAwareOperatorInsightLine({ synthesis, domainId });
    assert.equal(line, "System insight: interpretations are not yet being fully integrated.");
  }
});

test("unknown domain id falls back to generic wording", () => {
  const line = buildDomainAwareOperatorInsightLine({ synthesis: lowCompareModerate, domainId: "devops_xyz" });
  assert.equal(normalizeOperatorInsightDomain("devops_xyz"), "generic");
  assert.equal(line, "System insight: explore more scenarios to improve decisions.");
});

test("same input yields identical line and hint (deterministic)", () => {
  const a = buildDomainAwareOperatorInsightLine({ synthesis: lowCompareModerate, domainId: "commerce" });
  const b = buildDomainAwareOperatorInsightLine({ synthesis: lowCompareModerate, domainId: "commerce" });
  assert.equal(a, b);
  assert.equal(
    buildDomainAwareOperatorInsightHint({ synthesis: lowCompareModerate, domainId: "commerce" }),
    buildDomainAwareOperatorInsightHint({ synthesis: lowCompareModerate, domainId: "commerce" }),
  );
});
