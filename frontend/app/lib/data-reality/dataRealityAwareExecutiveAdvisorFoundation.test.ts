/**
 * P1:1 — Data-Reality-Aware Executive Advisor Foundation unit tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  DATA_REALITY_ADVISOR_ATTENTION_LEVELS,
  DATA_REALITY_ADVISOR_EVIDENCE_SOURCE_KINDS,
  DATA_REALITY_ADVISOR_INTENT_KINDS,
  DATA_REALITY_ADVISOR_STATES,
  DATA_REALITY_ADVISOR_SUBJECT_KINDS,
  DATA_REALITY_AWARE_ADVISOR_CORE_PRINCIPLE,
  DATA_REALITY_AWARE_ADVISOR_FOUNDATION_CAPABILITIES,
  DATA_REALITY_AWARE_ADVISOR_FOUNDATION_INVARIANTS,
  DATA_REALITY_AWARE_ADVISOR_FOUNDATION_PRINCIPLES,
  dataRealityAwareExecutiveAdvisorFoundationArchitecturalRole,
  dataRealityAwareExecutiveAdvisorFoundationIdentity,
  dataRealityAwareExecutiveAdvisorFoundationNamespace,
  dataRealityAwareExecutiveAdvisorFoundationPhase,
  dataRealityAwareExecutiveAdvisorFoundationVersion,
  getDataRealityAwareExecutiveAdvisorFoundationIdentity,
  getDataRealityAwareExecutiveAdvisorFoundationMetadata,
  isDataRealityAdvisorAttentionLevel,
  isDataRealityAdvisorEvidenceSourceKind,
  isDataRealityAdvisorIntentKind,
  isDataRealityAdvisorState,
  isDataRealityAdvisorSubjectKind,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";

const here = dirname(fileURLToPath(import.meta.url));
const foundationSourcePath = join(
  here,
  "dataRealityAwareExecutiveAdvisorFoundation.ts",
);
const contractsSourcePath = join(here, "dataRealityContracts.ts");

test("P1:1 identity", () => {
  const identity = getDataRealityAwareExecutiveAdvisorFoundationIdentity();
  assert.equal(
    dataRealityAwareExecutiveAdvisorFoundationIdentity,
    "P1:1/DataRealityAwareExecutiveAdvisorFoundation",
  );
  assert.equal(
    identity.identity,
    "P1:1/DataRealityAwareExecutiveAdvisorFoundation",
  );
  assert.equal(dataRealityAwareExecutiveAdvisorFoundationVersion, "1.0.0");
  assert.equal(identity.version, "1.0.0");
  assert.equal(
    dataRealityAwareExecutiveAdvisorFoundationNamespace,
    "nexora.data-reality.executive-advisor.foundation",
  );
  assert.equal(
    identity.namespace,
    "nexora.data-reality.executive-advisor.foundation",
  );
  assert.equal(dataRealityAwareExecutiveAdvisorFoundationPhase, "Foundation");
  assert.equal(identity.phase, "Foundation");
  assert.equal(
    dataRealityAwareExecutiveAdvisorFoundationArchitecturalRole,
    "DataRealityAwareExecutiveAdvisorFoundation",
  );
  assert.equal(
    identity.architecturalRole,
    "DataRealityAwareExecutiveAdvisorFoundation",
  );
});

test("P1:1 registry stability — subject kinds", () => {
  assert.deepEqual([...DATA_REALITY_ADVISOR_SUBJECT_KINDS], [
    "enterprise",
    "goal",
    "object",
    "kpi",
    "issue",
    "risk",
    "opportunity",
    "scenario",
    "decision",
    "execution",
  ]);
  assert.equal(DATA_REALITY_ADVISOR_SUBJECT_KINDS.length, 10);
});

test("P1:1 registry stability — advisor states", () => {
  assert.deepEqual([...DATA_REALITY_ADVISOR_STATES], [
    "unresolved",
    "stable",
    "watch",
    "risk",
    "critical",
    "opportunity",
  ]);
  assert.equal(DATA_REALITY_ADVISOR_STATES.length, 6);
});

test("P1:1 registry stability — intent kinds", () => {
  assert.deepEqual([...DATA_REALITY_ADVISOR_INTENT_KINDS], [
    "observe",
    "explain",
    "investigate",
    "compare",
    "prioritize",
    "recommend",
    "simulate",
    "decide",
    "act",
  ]);
  assert.equal(DATA_REALITY_ADVISOR_INTENT_KINDS.length, 9);
});

test("P1:1 registry stability — attention levels", () => {
  assert.deepEqual([...DATA_REALITY_ADVISOR_ATTENTION_LEVELS], [
    "none",
    "low",
    "medium",
    "high",
    "immediate",
  ]);
  assert.equal(DATA_REALITY_ADVISOR_ATTENTION_LEVELS.length, 5);
});

test("P1:1 registry stability — evidence source kinds", () => {
  assert.deepEqual([...DATA_REALITY_ADVISOR_EVIDENCE_SOURCE_KINDS], [
    "business-fact",
    "kpi",
    "executive-state",
    "object-binding",
    "trend",
    "comparison",
    "relationship",
  ]);
  assert.equal(DATA_REALITY_ADVISOR_EVIDENCE_SOURCE_KINDS.length, 7);
});

test("P1:1 registry stability — capabilities", () => {
  assert.deepEqual([...DATA_REALITY_AWARE_ADVISOR_FOUNDATION_CAPABILITIES], [
    "consume-certified-data-reality",
    "identify-executive-subject",
    "represent-executive-observation",
    "represent-evidence",
    "represent-attention",
    "represent-advisor-intent",
    "represent-executive-question",
    "represent-advisory-candidate",
    "support-object-aware-advisory-context",
    "support-stage-advisor-synchronization",
  ]);
  assert.equal(DATA_REALITY_AWARE_ADVISOR_FOUNDATION_CAPABILITIES.length, 10);
});

test("P1:1 type guards — valid and invalid values", () => {
  assert.equal(isDataRealityAdvisorSubjectKind("object"), true);
  assert.equal(isDataRealityAdvisorSubjectKind("widget"), false);
  assert.equal(isDataRealityAdvisorSubjectKind(null), false);

  assert.equal(isDataRealityAdvisorState("critical"), true);
  assert.equal(isDataRealityAdvisorState("normal"), false);
  assert.equal(isDataRealityAdvisorState(1), false);

  assert.equal(isDataRealityAdvisorIntentKind("investigate"), true);
  assert.equal(isDataRealityAdvisorIntentKind("chat"), false);

  assert.equal(isDataRealityAdvisorAttentionLevel("immediate"), true);
  assert.equal(isDataRealityAdvisorAttentionLevel("critical"), false);

  assert.equal(isDataRealityAdvisorEvidenceSourceKind("kpi"), true);
  assert.equal(isDataRealityAdvisorEvidenceSourceKind("llm"), false);
});

test("P1:1 invariants registry", () => {
  assert.equal(DATA_REALITY_AWARE_ADVISOR_FOUNDATION_INVARIANTS.length, 15);

  const requiredFragments = [
    "originate from certified Data Reality",
    "bypass the P0 reality pipeline",
    "KPI calculations must not be duplicated",
    "Executive-state resolution must not be duplicated",
    "Evidence and advisory meaning",
    "Observations must remain distinguishable from recommendations",
    "Advisory candidates must remain distinguishable from approved decisions",
    "resolve to unresolved",
    "remain deterministic",
    "never become the source of executive truth",
    "without mutating the underlying Data Reality snapshot",
    "independent from rendering technology",
    "without creating separate truth models",
    "No React, Three.js, UI, network, database, or LLM dependency",
    "constant registries must be immutable",
  ];

  for (const fragment of requiredFragments) {
    assert.ok(
      DATA_REALITY_AWARE_ADVISOR_FOUNDATION_INVARIANTS.some((invariant) =>
        invariant.includes(fragment),
      ),
      `missing invariant containing: ${fragment}`,
    );
  }
});

test("P1:1 principles and metadata", () => {
  assert.equal(
    DATA_REALITY_AWARE_ADVISOR_CORE_PRINCIPLE,
    "The Executive Advisor must reason from certified executive reality before generating advisory meaning.",
  );
  assert.deepEqual([...DATA_REALITY_AWARE_ADVISOR_FOUNDATION_PRINCIPLES], [
    "Reality before Advice",
    "Evidence before Recommendation",
    "Executive Meaning before Conversation",
    "Object Context before Generic Explanation",
    "Deterministic Context before Generative Language",
  ]);

  const metadata = getDataRealityAwareExecutiveAdvisorFoundationMetadata();
  assert.equal(
    metadata.identity.identity,
    "P1:1/DataRealityAwareExecutiveAdvisorFoundation",
  );
  assert.equal(
    metadata.capabilities,
    DATA_REALITY_AWARE_ADVISOR_FOUNDATION_CAPABILITIES,
  );
  assert.equal(
    metadata.invariants,
    DATA_REALITY_AWARE_ADVISOR_FOUNDATION_INVARIANTS,
  );
  assert.equal(
    metadata.principles,
    DATA_REALITY_AWARE_ADVISOR_FOUNDATION_PRINCIPLES,
  );
});

test("P1:1 immutability — exported registries and identity are frozen", () => {
  assert.equal(Object.isFrozen(DATA_REALITY_ADVISOR_SUBJECT_KINDS), true);
  assert.equal(Object.isFrozen(DATA_REALITY_ADVISOR_STATES), true);
  assert.equal(Object.isFrozen(DATA_REALITY_ADVISOR_INTENT_KINDS), true);
  assert.equal(Object.isFrozen(DATA_REALITY_ADVISOR_ATTENTION_LEVELS), true);
  assert.equal(
    Object.isFrozen(DATA_REALITY_ADVISOR_EVIDENCE_SOURCE_KINDS),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_AWARE_ADVISOR_FOUNDATION_CAPABILITIES),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_AWARE_ADVISOR_FOUNDATION_INVARIANTS),
    true,
  );
  assert.equal(
    Object.isFrozen(DATA_REALITY_AWARE_ADVISOR_FOUNDATION_PRINCIPLES),
    true,
  );
  assert.equal(
    Object.isFrozen(getDataRealityAwareExecutiveAdvisorFoundationIdentity()),
    true,
  );
  assert.equal(
    Object.isFrozen(getDataRealityAwareExecutiveAdvisorFoundationMetadata()),
    true,
  );
});

test("P1:1 upstream architecture — consumes P0 NexoraDataRealitySnapshot", () => {
  const foundationSource = readFileSync(foundationSourcePath, "utf8");
  const contractsSource = readFileSync(contractsSourcePath, "utf8");

  assert.ok(
    contractsSource.includes("export type NexoraDataRealitySnapshot"),
    "P0 contracts must own NexoraDataRealitySnapshot",
  );
  assert.ok(
    /import\s+type\s+\{\s*NexoraDataRealitySnapshot\s*\}\s+from\s+["']\.\/dataRealityContracts\.ts["']/.test(
      foundationSource,
    ),
    "P1:1 must import NexoraDataRealitySnapshot from dataRealityContracts",
  );
  assert.equal(
    /export\s+(type|interface)\s+NexoraDataRealitySnapshot\b/.test(
      foundationSource,
    ),
    false,
    "P1:1 must not redefine NexoraDataRealitySnapshot",
  );
  assert.ok(
    foundationSource.includes("dataRealitySnapshot: NexoraDataRealitySnapshot"),
    "Build input must use canonical P0 snapshot type",
  );
});

test("P1:1 dependency rule — no React / Three.js / UI / LLM / network clients", () => {
  const source = readFileSync(foundationSourcePath, "utf8");
  const forbidden = [
    /from\s+["']react["']/,
    /from\s+["']react\//,
    /from\s+["']next\//,
    /from\s+["']three["']/,
    /from\s+["']@react-three\//,
    /from\s+["']openai["']/,
    /from\s+["']@anthropic-ai\//,
    /from\s+["'][^"']*advisor[^"']*ui/i,
    /fetch\s*\(/,
  ];
  for (const pattern of forbidden) {
    assert.equal(
      pattern.test(source),
      false,
      `foundation must not match forbidden dependency pattern: ${pattern}`,
    );
  }
});
