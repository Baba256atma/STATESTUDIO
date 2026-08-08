import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES as categories,
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_ABSENT_CAPABILITIES as absentCapabilities,
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_CAPABILITIES as capabilities,
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS as intents,
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCE_CATEGORY_MAP as sourceCategoryMap,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH as emptyBatch,
  areDirectorRuntimeAttentionSignalsEquivalent,
  areDirectorRuntimeAttentionSubjectsEqual,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  createDirectorRuntimeAttentionSignalGroup,
  deduplicateDirectorRuntimeAttentionSignals,
  directorRuntimeAttentionSignalContracts as layer,
  directorRuntimeAttentionSignalContractsCanonicalIdentity as canonicalIdentity,
  directorRuntimeAttentionSignalContractsRegistry as registry,
  getDirectorRuntimeAttentionSignalCategory,
  isAdvisorAttentionSignal,
  isExecutionAttentionSignal,
  isPerformanceAttentionSignal,
  isSuppressionAttentionSignal,
  isUserInteractionAttentionSignal,
  matchesDirectorRuntimeAttentionSignalCategory,
  matchesDirectorRuntimeAttentionSignalIntent,
  matchesDirectorRuntimeAttentionSignalSource,
  matchesDirectorRuntimeAttentionSignalSubject,
  normalizeDirectorRuntimeAttentionSignal,
  resolveDirectorRuntimeAttentionSignalCategory,
  validateDirectorRuntimeAttentionSignal,
  validateDirectorRuntimeAttentionSignalBatch,
  validateDirectorRuntimeAttentionSignalGroup,
  validateDirectorRuntimeAttentionSignalIdentity,
  validateDirectorRuntimeAttentionSignalIntent,
  verifyDirectorRuntimeAttentionSignalContracts,
  type DirectorRuntimeAttentionSignal,
} from "./directorRuntimeAttentionSignalContracts.ts";

const source = readFileSync(
  new URL("./directorRuntimeAttentionSignalContracts.ts", import.meta.url),
  "utf8",
);

const production = Object.freeze({
  subjectId: "Production",
  subjectKind: "object" as const,
});

function makeSignal(
  overrides: Partial<DirectorRuntimeAttentionSignal> = {},
): DirectorRuntimeAttentionSignal {
  return createDirectorRuntimeAttentionSignal({
    signalId: "sig-base",
    subject: production,
    source: "user-interaction",
    reason: "explicit-selection",
    scope: "subject",
    requestedLevel: "primary",
    persistence: "transient",
    intent: "request-focus",
    ...overrides,
  });
}

test("1. publishes exact DRI-6:2 identity, version, and namespace", () => {
  assert.deepEqual({
    phase: layer.phase,
    name: layer.name,
    identity: layer.identity,
    namespace: layer.namespace,
    version: layer.version,
    role: layer.role,
    status: layer.status,
  }, {
    phase: "DRI-6:2",
    name: "DirectorRuntimeAttentionSignalContracts",
    identity: "DRI-6:2/DirectorRuntimeAttentionSignalContracts",
    namespace: "nexora.dri.attention-focus.signal-contracts",
    version: "6.2.0",
    role: "AttentionSignalContracts",
    status: "SignalContractsReady",
  });
  assert.deepEqual(canonicalIdentity, {
    identity: "DRI-6:2/DirectorRuntimeAttentionSignalContracts",
    version: "6.2.0",
    namespace: "nexora.dri.attention-focus.signal-contracts",
    upstream: "DRI-6:1/DirectorRuntimeAttentionFocusFoundation",
  });
  assert.equal(Object.isFrozen(layer), true);
});

test("2. sole immediate dependency is DRI-6:1 Foundation", () => {
  assert.equal(
    layer.upstreamDependency,
    "DRI-6:1/DirectorRuntimeAttentionFocusFoundation",
  );
  assert.equal(registry.dependency, layer.upstreamDependency);
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(
    [...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeAttentionFocusFoundation"],
  );
  assert.doesNotMatch(
    source,
    /directorRuntimeAdaptivePresentation|directorRuntimeInteraction|directorRuntimeScene|directorRuntimeStateContext|directorRuntimeIntegration/,
  );
});

test("3. canonical signal categories and intents", () => {
  assert.deepEqual([...categories], [
    "interaction", "state", "goal", "performance", "problem",
    "scenario", "decision", "execution", "advisor", "system",
  ]);
  assert.deepEqual([...intents], [
    "request-focus",
    "request-support",
    "request-context",
    "request-awareness",
    "request-suppression",
  ]);
  assert.equal(categories.length, 10);
  assert.equal(intents.length, 5);
});

test("4. source-to-category mapping is complete and deterministic", () => {
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("user-interaction"), "interaction");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("runtime-state"), "state");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("goal"), "goal");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("kpi"), "performance");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("koi"), "performance");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("problem"), "problem");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("scenario"), "scenario");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("decision"), "decision");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("execution"), "execution");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("advisor"), "advisor");
  assert.equal(resolveDirectorRuntimeAttentionSignalCategory("system"), "system");
  assert.equal(Object.keys(sourceCategoryMap).length, 11);
  assert.deepEqual(sourceCategoryMap, { ...sourceCategoryMap });
  assert.equal(Object.isFrozen(sourceCategoryMap), true);
});

test("5. valid and invalid signal identity", () => {
  assert.equal(validateDirectorRuntimeAttentionSignalIdentity({ signalId: "sig-1" }).valid, true);
  assert.equal(validateDirectorRuntimeAttentionSignalIdentity({ signalId: "  " }).valid, false);
  assert.equal(validateDirectorRuntimeAttentionSignalIdentity({}).valid, false);
});

test("6. valid canonical attention signal", () => {
  const signal = makeSignal({
    origin: { source: "user-interaction", originId: "click-1" },
    correlationId: "corr-1",
  });
  assert.equal(validateDirectorRuntimeAttentionSignal(signal).valid, true);
  assert.equal(getDirectorRuntimeAttentionSignalCategory(signal), "interaction");
});

test("7. rejects invalid nested subject, source, reason, scope, level, persistence, intent", () => {
  assert.equal(validateDirectorRuntimeAttentionSignal({
    ...makeSignal(),
    subject: { subjectId: "", subjectKind: "object" },
  }).valid, false);
  assert.equal(validateDirectorRuntimeAttentionSignal({
    ...makeSignal(),
    source: "mouse",
  }).valid, false);
  assert.equal(validateDirectorRuntimeAttentionSignal({
    ...makeSignal(),
    reason: "click",
  }).valid, false);
  assert.equal(validateDirectorRuntimeAttentionSignal({
    ...makeSignal(),
    scope: "everywhere",
  }).valid, false);
  assert.equal(validateDirectorRuntimeAttentionSignal({
    ...makeSignal(),
    requestedLevel: "critical",
  }).valid, false);
  assert.equal(validateDirectorRuntimeAttentionSignal({
    ...makeSignal(),
    persistence: "forever",
  }).valid, false);
  assert.equal(validateDirectorRuntimeAttentionSignalIntent("request-win").valid, false);
  assert.equal(validateDirectorRuntimeAttentionSignal({
    ...makeSignal(),
    intent: "request-win",
  }).valid, false);
});

test("8. valid and invalid signal groups and batches", () => {
  const group = createDirectorRuntimeAttentionSignalGroup({
    groupId: "advisor-topic-1",
    signals: [
      makeSignal({ signalId: "a", requestedLevel: "primary", intent: "request-focus" }),
      makeSignal({
        signalId: "b",
        subject: { subjectId: "Shipping", subjectKind: "object" },
        source: "kpi",
        reason: "warning",
        requestedLevel: "secondary",
        intent: "request-support",
      }),
    ],
  });
  assert.equal(validateDirectorRuntimeAttentionSignalGroup(group).valid, true);
  assert.equal(validateDirectorRuntimeAttentionSignalGroup({
    groupId: "",
    signals: [makeSignal()],
  }).valid, false);

  const batch = createDirectorRuntimeAttentionSignalBatch({
    batchId: "batch-1",
    signals: group.signals,
  });
  assert.equal(validateDirectorRuntimeAttentionSignalBatch(batch).valid, true);
  assert.equal(validateDirectorRuntimeAttentionSignalBatch({
    signals: [{ ...makeSignal(), intent: "bad" }],
  }).valid, false);
});

test("9. empty batch validity and immutability", () => {
  assert.equal(validateDirectorRuntimeAttentionSignalBatch(emptyBatch).valid, true);
  assert.deepEqual(emptyBatch.signals, []);
  assert.equal(Object.isFrozen(emptyBatch), true);
  assert.equal(Object.isFrozen(emptyBatch.signals), true);
  assert.throws(() => {
    (emptyBatch as unknown as { signals: unknown[] }).signals = [1];
  });
});

test("10. signal normalization trims IDs without changing semantics", () => {
  const input = {
    signalId: "  sig-123  ",
    subject: production,
    source: "kpi" as const,
    reason: "warning" as const,
    scope: "scene" as const,
    requestedLevel: "secondary" as const,
    persistence: "session" as const,
    intent: "request-support" as const,
    origin: { source: "kpi" as const, originId: "  origin-9  " },
    correlationId: "  corr  ",
    groupId: "  ",
  };
  const snapshot = JSON.stringify(input);
  const normalized = normalizeDirectorRuntimeAttentionSignal(input);
  assert.equal(JSON.stringify(input), snapshot);
  assert.equal(normalized.signalId, "sig-123");
  assert.equal(normalized.origin?.originId, "origin-9");
  assert.equal(normalized.correlationId, "corr");
  assert.equal(normalized.groupId, undefined);
  assert.equal(normalized.requestedLevel, "secondary");
  assert.equal(normalized.source, "kpi");
  assert.equal(normalized.intent, "request-support");
  assert.equal(Object.isFrozen(normalized), true);
});

test("11. subject matching requires kind and id", () => {
  assert.equal(
    areDirectorRuntimeAttentionSubjectsEqual(production, {
      subjectId: "Production",
      subjectKind: "object",
    }),
    true,
  );
  assert.equal(
    areDirectorRuntimeAttentionSubjectsEqual(production, {
      subjectId: "Production",
      subjectKind: "kpi",
    }),
    false,
  );
  const signal = makeSignal();
  assert.equal(matchesDirectorRuntimeAttentionSignalSubject(signal, production), true);
  assert.equal(
    matchesDirectorRuntimeAttentionSignalSubject(signal, {
      subjectId: "Production",
      subjectKind: "kpi",
    }),
    false,
  );
});

test("12. structural equivalence and non-equivalence", () => {
  const a = makeSignal({ signalId: "same" });
  const b = makeSignal({ signalId: "same" });
  const c = makeSignal({ signalId: "same", reason: "warning" });
  assert.equal(areDirectorRuntimeAttentionSignalsEquivalent(a, b), true);
  assert.equal(areDirectorRuntimeAttentionSignalsEquivalent(a, c), false);
});

test("13. exact deduplication preserves order and semantic distinctions", () => {
  const a = makeSignal({ signalId: "a" });
  const b = makeSignal({
    signalId: "b",
    source: "kpi",
    reason: "warning",
    requestedLevel: "secondary",
    intent: "request-support",
  });
  const aDup = makeSignal({ signalId: "a" });
  const deduped = deduplicateDirectorRuntimeAttentionSignals([a, b, aDup]);
  assert.equal(deduped.length, 2);
  assert.equal(deduped[0]?.signalId, "a");
  assert.equal(deduped[1]?.signalId, "b");

  const sameSubjectDifferentSource = deduplicateDirectorRuntimeAttentionSignals([
    makeSignal({ signalId: "u", source: "user-interaction", requestedLevel: "primary" }),
    makeSignal({
      signalId: "k",
      source: "kpi",
      reason: "warning",
      requestedLevel: "secondary",
      intent: "request-support",
    }),
  ]);
  assert.equal(sameSubjectDifferentSource.length, 2);

  const differentReasons = deduplicateDirectorRuntimeAttentionSignals([
    makeSignal({ signalId: "r1", reason: "risk" }),
    makeSignal({ signalId: "r2", reason: "warning" }),
  ]);
  assert.equal(differentReasons.length, 2);

  const differentLevels = deduplicateDirectorRuntimeAttentionSignals([
    makeSignal({ signalId: "l1", requestedLevel: "primary" }),
    makeSignal({ signalId: "l2", requestedLevel: "secondary", intent: "request-support" }),
  ]);
  assert.equal(differentLevels.length, 2);
});

test("14. conflicting signals coexist without resolution", () => {
  const batch = createDirectorRuntimeAttentionSignalBatch({
    signals: [
      makeSignal({
        signalId: "user-primary",
        source: "user-interaction",
        requestedLevel: "primary",
        intent: "request-focus",
      }),
      makeSignal({
        signalId: "kpi-secondary",
        source: "kpi",
        reason: "warning",
        requestedLevel: "secondary",
        intent: "request-support",
      }),
    ],
  });
  assert.equal(validateDirectorRuntimeAttentionSignalBatch(batch).valid, true);
  assert.equal(batch.signals.length, 2);
  assert.equal(batch.signals[0]?.requestedLevel, "primary");
  assert.equal(batch.signals[1]?.requestedLevel, "secondary");
  assert.doesNotMatch(source, /resolveAttentionPriority|chooseWinningSignal|rankAttentionSignals/);
});

test("15. inspection helpers", () => {
  const user = makeSignal();
  const kpi = makeSignal({
    signalId: "kpi-1",
    source: "kpi",
    reason: "warning",
    requestedLevel: "secondary",
    intent: "request-support",
  });
  const advisor = makeSignal({ signalId: "adv", source: "advisor", reason: "advisor-relevance" });
  const execution = makeSignal({
    signalId: "exec",
    source: "execution",
    reason: "execution-relevance",
  });
  const suppression = makeSignal({
    signalId: "sup",
    requestedLevel: "suppressed",
    intent: "request-suppression",
  });

  assert.equal(isUserInteractionAttentionSignal(user), true);
  assert.equal(isPerformanceAttentionSignal(kpi), true);
  assert.equal(isAdvisorAttentionSignal(advisor), true);
  assert.equal(isExecutionAttentionSignal(execution), true);
  assert.equal(isSuppressionAttentionSignal(suppression), true);
  assert.equal(matchesDirectorRuntimeAttentionSignalSource(kpi, "kpi"), true);
  assert.equal(matchesDirectorRuntimeAttentionSignalCategory(kpi, "performance"), true);
  assert.equal(matchesDirectorRuntimeAttentionSignalIntent(user, "request-focus"), true);
});

test("16. foundation compatibility and capability boundaries", () => {
  const verification = verifyDirectorRuntimeAttentionSignalContracts();
  assert.equal(verification.ok, true);
  assert.equal(verification.foundationCompatible, true);
  assert.deepEqual([...capabilities], [
    "SignalDefinition",
    "SignalCategorization",
    "SignalGrouping",
    "SignalBatching",
    "SignalValidation",
    "SignalNormalization",
    "SignalInspection",
    "SignalEquivalence",
    "SignalDeduplication",
  ]);
  assert.deepEqual([...absentCapabilities], [
    "PriorityResolution",
    "FocusBinding",
    "PathOrchestration",
    "TransitionOrchestration",
  ]);
});

test("17. no priority, rendering, binding, path, or transition behavior", () => {
  assert.doesNotMatch(source, /\b(?:priority|weight|score|rank|confidence|importance|winner)\s*[?:]/);
  assert.doesNotMatch(
    source,
    /\b(?:color|opacity|scale|position|glow|pulse|camera|zoom|material|geometry|cssClass|animation)\b\s*[?:]/,
  );
  assert.doesNotMatch(source, /function\s+(?:bindSignalToScene|buildFocusContext|deriveFocusState)\s*\(/);
  assert.doesNotMatch(source, /function\s+(?:findPath|resolvePath|propagateAttention|buildAttentionGraph)\s*\(/);
  assert.doesNotMatch(source, /function\s+(?:focusTransition|attentionTransition)\s*\(/);
  assert.doesNotMatch(source, /function\s+(?:resolveAttentionPriority|selectPrimaryAttention|rankAttentionSignals|chooseWinningSignal)\s*\(/);
});

test("18. verification success, determinism, and input immutability", () => {
  const first = verifyDirectorRuntimeAttentionSignalContracts();
  const second = verifyDirectorRuntimeAttentionSignalContracts();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(first.signalCategoryCount, 10);
  assert.equal(first.signalIntentCount, 5);
  assert.equal(first.sourceCategoryMapCount, 11);
  assert.equal(first.capabilityCount, 9);
  assert.equal(first.invariantCount, 12);
  assert.equal(Object.isFrozen(first), true);

  const mutable = {
    signalId: "mut",
    subject: { subjectId: "X", subjectKind: "object" as const },
    source: "system" as const,
    reason: "system-relevance" as const,
    scope: "global" as const,
    requestedLevel: "background" as const,
    persistence: "persistent" as const,
    intent: "request-awareness" as const,
  };
  const snap = JSON.stringify(mutable);
  validateDirectorRuntimeAttentionSignal(mutable);
  normalizeDirectorRuntimeAttentionSignal(mutable);
  deduplicateDirectorRuntimeAttentionSignals([mutable, mutable]);
  assert.equal(JSON.stringify(mutable), snap);
});
