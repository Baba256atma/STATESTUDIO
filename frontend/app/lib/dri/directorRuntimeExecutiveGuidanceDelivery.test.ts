import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES as audiences,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_BOUNDARY as boundary,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS as channels,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_PUBLIC_TYPE_NAMES as publicTypeNames,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS as reasons,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_IDS as ruleIds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER as ruleOrder,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES as statuses,
  deliverDirectorExecutiveGuidance,
  directorRuntimeExecutiveGuidanceDelivery as delivery,
  directorRuntimeExecutiveGuidanceDeliveryApiNames as apiNames,
  directorRuntimeExecutiveGuidanceDeliveryCanonicalIdentity as canonicalIdentity,
  directorRuntimeExecutiveGuidanceDeliveryRegistry as registry,
  resolveDirectorExecutiveGuidanceDeliveryChannel,
  verifyDirectorRuntimeExecutiveGuidanceDelivery,
  type DirectorRuntimeExecutiveGuidanceComposedItem,
  type DirectorRuntimeExecutiveGuidanceComposition,
  type DirectorRuntimeExecutiveGuidanceCompositionPath,
  type DirectorRuntimeExecutiveGuidanceCompositionRelationship,
  type DirectorRuntimeExecutiveGuidanceDeliveryContext,
  type DirectorRuntimeExecutiveGuidanceDeliveryInput,
  type DirectorRuntimeExecutiveGuidanceItem,
  type DirectorRuntimeExecutiveGuidanceProvenance,
  type DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy,
} from "./directorRuntimeExecutiveGuidanceDelivery.ts";

import {
  directorRuntimeExecutiveGuidanceCompositionIdentity,
  verifyDirectorRuntimeExecutiveGuidanceComposition,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceComposition";
import { verifyDirectorRuntimeExecutiveGuidanceResolution } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceResolution";
import { verifyDirectorRuntimeExecutiveGuidanceContracts } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceContracts";
import { verifyDirectorRuntimeExecutiveGuidanceFoundation } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation";
import { verifyDirectorRuntimeAttentionFocusPublicIndex } from
  "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeExecutiveGuidanceDelivery.ts", import.meta.url),
  "utf8",
);

const emptyProvenance: DirectorRuntimeExecutiveGuidanceProvenance =
  Object.freeze({
    sourceReferences: Object.freeze([]),
    derivedFromGuidanceIds: Object.freeze([]),
  });

function makeGuidance(
  overrides: Partial<DirectorRuntimeExecutiveGuidanceItem> & {
    guidanceId: string;
  },
): DirectorRuntimeExecutiveGuidanceItem {
  return Object.freeze({
    guidanceId: overrides.guidanceId,
    guidanceKind: overrides.guidanceKind ?? "direct-attention",
    target: Object.freeze(
      overrides.target ?? {
        targetKind: "object" as const,
        targetId: "production",
      },
    ),
    importance: overrides.importance ?? "important",
    urgency: overrides.urgency ?? "soon",
    intent: overrides.intent ?? "warn",
    source: Object.freeze(
      overrides.source ?? {
        sourceKind: "attention-output" as const,
        sourceId: "attention.production-risk",
      },
    ),
  });
}

function makeItem(
  candidateId: string,
  tier: DirectorRuntimeExecutiveGuidanceComposedItem["priorityTier"],
  role: DirectorRuntimeExecutiveGuidanceComposedItem["role"],
  ordinal: number,
  guidanceOverrides: Partial<DirectorRuntimeExecutiveGuidanceItem> & {
    guidanceId: string;
  },
): DirectorRuntimeExecutiveGuidanceComposedItem {
  const guidance = makeGuidance(guidanceOverrides);
  return Object.freeze({
    candidateId,
    guidanceId: guidance.guidanceId,
    priorityTier: tier,
    role,
    ordinal,
    guidance,
    provenance: emptyProvenance,
    resolutionReasons: Object.freeze(["eligible" as const]),
  });
}

function makeComposition(input: {
  readonly primary: DirectorRuntimeExecutiveGuidanceComposedItem | null;
  readonly supporting?: readonly DirectorRuntimeExecutiveGuidanceComposedItem[];
  readonly contextual?: readonly DirectorRuntimeExecutiveGuidanceComposedItem[];
  readonly background?: readonly DirectorRuntimeExecutiveGuidanceComposedItem[];
  readonly relationships?: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[];
  readonly paths?: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[];
  readonly deferredCandidateIds?: readonly string[];
  readonly suppressedCandidateIds?: readonly string[];
  readonly rejectedCandidateIds?: readonly string[];
  readonly unresolvedCandidateIds?: readonly string[];
  readonly omitTraces?: boolean;
}): DirectorRuntimeExecutiveGuidanceComposition {
  const supporting = input.supporting ?? [];
  const contextual = input.contextual ?? [];
  const background = input.background ?? [];
  const active = [
    ...(input.primary === null ? [] : [input.primary]),
    ...supporting,
    ...contextual,
    ...background,
  ];
  const traces = input.omitTraces
    ? Object.freeze([])
    : Object.freeze(
        active.map((item) =>
          Object.freeze({
            candidateId: item.candidateId,
            guidanceId: item.guidanceId,
            resolutionStatus: "selected" as const,
            compositionTier: item.priorityTier,
            compositionRole: item.role,
          })),
      );
  return Object.freeze({
    compositionId: "composition.production-risk",
    requestId: "request.production-risk",
    primary: input.primary,
    supporting: Object.freeze([...supporting]),
    contextual: Object.freeze([...contextual]),
    background: Object.freeze([...background]),
    relationships: Object.freeze([...(input.relationships ?? [])]),
    paths: Object.freeze([...(input.paths ?? [])]),
    groups: Object.freeze([]),
    traces,
    deferredCandidateIds: Object.freeze([
      ...(input.deferredCandidateIds ?? []),
    ]),
    suppressedCandidateIds: Object.freeze([
      ...(input.suppressedCandidateIds ?? []),
    ]),
    rejectedCandidateIds: Object.freeze([
      ...(input.rejectedCandidateIds ?? []),
    ]),
    unresolvedCandidateIds: Object.freeze([
      ...(input.unresolvedCandidateIds ?? []),
    ]),
    summary: Object.freeze({
      activeItemCount: active.length,
      primaryCount: (input.primary === null ? 0 : 1) as 0 | 1,
      supportingCount: supporting.length,
      contextualCount: contextual.length,
      backgroundCount: background.length,
      relationshipCount: (input.relationships ?? []).length,
      pathCount: (input.paths ?? []).length,
      deferredReferenceCount: (input.deferredCandidateIds ?? []).length,
      suppressedReferenceCount: (input.suppressedCandidateIds ?? []).length,
      rejectedReferenceCount: (input.rejectedCandidateIds ?? []).length,
      unresolvedReferenceCount: (input.unresolvedCandidateIds ?? []).length,
    }),
  });
}

function defaultPolicy(
  overrides: Partial<DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy> =
    {},
): DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy {
  return Object.freeze({
    allowDelivery: true,
    allowInterruption: true,
    preserveFocus: false,
    preserveContext: false,
    preferredChannel: "director",
    fallbackChannel: null,
    ...overrides,
  });
}

function defaultContext(
  overrides: Partial<DirectorRuntimeExecutiveGuidanceDeliveryContext> = {},
): DirectorRuntimeExecutiveGuidanceDeliveryContext {
  return Object.freeze({
    activeFocusId: null,
    activeContextId: null,
    requestedChannel: null,
    ...overrides,
  });
}

function deliver(
  composition: DirectorRuntimeExecutiveGuidanceComposition,
  policy: DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy = defaultPolicy(),
  context: DirectorRuntimeExecutiveGuidanceDeliveryContext = defaultContext(),
) {
  const input: DirectorRuntimeExecutiveGuidanceDeliveryInput = {
    deliveryId: "delivery.production-risk",
    composition,
    policy,
    context,
  };
  return deliverDirectorExecutiveGuidance(input);
}

const samplePrimary = makeItem(
  "candidate.production-risk",
  "primary",
  "attention-anchor",
  0,
  { guidanceId: "guidance.production-risk" },
);

const sampleSupporting = makeItem(
  "candidate.delivery-kpi",
  "supporting",
  "supporting-evidence",
  1,
  {
    guidanceId: "guidance.delivery-kpi",
    guidanceKind: "surface-evidence",
    intent: "explain",
    importance: "important",
    urgency: "soon",
  },
);

const sampleContextual = makeItem(
  "candidate.production-path",
  "contextual",
  "path-explanation",
  2,
  {
    guidanceId: "guidance.production-impact-path",
    guidanceKind: "explain-path",
    intent: "explain",
    importance: "supporting",
    urgency: "none",
    target: { targetKind: "path", targetId: "production-impact-path" },
    source: {
      sourceKind: "path-evidence",
      sourceId: "path.production-impact",
    },
  },
);

const sampleBackground = makeItem(
  "candidate.supplier-capacity",
  "background",
  "background-context",
  3,
  {
    guidanceId: "guidance.supplier-capacity",
    guidanceKind: "de-emphasize",
    intent: "orient",
    importance: "background",
    urgency: "none",
    target: { targetKind: "object", targetId: "supplier" },
    source: {
      sourceKind: "executive-context",
      sourceId: "ctx.supplier",
    },
  },
);

test("1. exact DRI-7:5 identity", () => {
  assert.equal(
    delivery.identity,
    "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
  );
  assert.equal(canonicalIdentity.identity, delivery.identity);
  assert.equal(delivery.phase, "DRI-7:5");
  assert.equal(delivery.role, "Delivery");
});

test("2. exact version 7.5.0", () => {
  assert.equal(delivery.version, "7.5.0");
  assert.equal(canonicalIdentity.version, "7.5.0");
});

test("3. exact namespace", () => {
  assert.equal(
    delivery.namespace,
    "nexora.dri.executive-guidance.delivery",
  );
});

test("4. sole immediate dependency is DRI-7:4", () => {
  assert.equal(
    delivery.upstreamDependency,
    "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition",
  );
  assert.equal(
    delivery.upstreamDependency,
    directorRuntimeExecutiveGuidanceCompositionIdentity,
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceComposition",
  ]);
});

test("5. no direct DRI-7:3 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceResolution["']/,
  );
});

test("6. no direct DRI-7:2 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceContracts["']/,
  );
});

test("7. no direct DRI-7:1 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceFoundation["']/,
  );
});

test("8. no direct DRI-6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeAttentionFocus/,
  );
});

test("9. delivery-status vocabulary completeness", () => {
  assert.deepEqual([...statuses], ["ready", "held", "deferred", "blocked"]);
});

test("10. delivery-reason vocabulary completeness", () => {
  assert.equal(reasons.length, 11);
  assert.equal(new Set(reasons).size, 11);
  assert.ok(reasons.includes("composition-ready"));
  assert.ok(reasons.includes("non-interruption-policy"));
});

test("11. delivery-channel vocabulary completeness", () => {
  assert.deepEqual([...channels], [
    "director",
    "advisor",
    "insight",
    "scene",
    "journal",
    "timeline",
  ]);
});

test("12. delivery-audience vocabulary completeness", () => {
  assert.deepEqual([...audiences], [
    "executive",
    "director-runtime",
    "supporting-consumer",
  ]);
});

test("13. delivery registry deterministic", () => {
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(registry.statusCount, 4);
  assert.equal(registry.channelCount, 6);
  assert.equal(registry.ruleCount, 9);
});

test("14. delivery rule ordering deterministic", () => {
  assert.deepEqual([...ruleOrder], [
    "composition-integrity",
    "active-guidance",
    "traceability",
    "delivery-permission",
    "interruption-policy",
    "focus-preservation",
    "context-preservation",
    "channel-resolution",
    "delivery-readiness",
  ]);
  assert.deepEqual([...ruleIds], [
    "dri7.delivery.composition-integrity",
    "dri7.delivery.active-guidance",
    "dri7.delivery.traceability",
    "dri7.delivery.permission",
    "dri7.delivery.interruption-policy",
    "dri7.delivery.focus-preservation",
    "dri7.delivery.context-preservation",
    "dri7.delivery.channel-resolution",
    "dri7.delivery.readiness",
  ]);
});

test("15. valid active composition can become ready", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      supporting: [sampleSupporting],
      contextual: [sampleContextual],
      background: [sampleBackground],
    }),
  );
  assert.equal(result.status, "ready");
  assert.ok(result.reasons.includes("composition-ready"));
  assert.equal(result.readiness, "ready-for-consumer");
});

test("16. empty composition handled deterministically", () => {
  const result = deliver(makeComposition({ primary: null }));
  assert.equal(result.status, "held");
  assert.ok(result.reasons.includes("no-active-guidance"));
  assert.equal(result.readiness, "not-ready-for-consumer");
});

test("17. delivery disabled produces held", () => {
  const result = deliver(
    makeComposition({ primary: samplePrimary }),
    defaultPolicy({ allowDelivery: false }),
  );
  assert.equal(result.status, "held");
  assert.ok(result.reasons.includes("delivery-policy-hold"));
  assert.equal(result.primary?.guidanceId, "guidance.production-risk");
});

test("18. non-interruption policy can produce deferred", () => {
  const interruptivePrimary = makeItem(
    "candidate.production-risk",
    "primary",
    "attention-anchor",
    0,
    {
      guidanceId: "guidance.production-risk",
      importance: "critical",
      urgency: "immediate",
      intent: "warn",
    },
  );
  const result = deliver(
    makeComposition({ primary: interruptivePrimary }),
    defaultPolicy({ allowInterruption: false, preserveFocus: true }),
  );
  assert.equal(result.status, "deferred");
  assert.ok(result.reasons.includes("non-interruption-policy"));
  assert.equal(result.primary?.guidanceId, "guidance.production-risk");
  assert.equal(result.summary.deliveredItemCount, 0);
});

test("19. invalid composition produces blocked", () => {
  const invalid = {
    compositionId: "bad",
    requestId: "bad",
    primary: null,
    supporting: "not-array",
    contextual: [],
    background: [],
    relationships: [],
    paths: [],
    groups: [],
    traces: [],
    deferredCandidateIds: [],
    suppressedCandidateIds: [],
    rejectedCandidateIds: [],
    unresolvedCandidateIds: [],
    summary: { primaryCount: 0 },
  } as unknown as DirectorRuntimeExecutiveGuidanceComposition;
  const result = deliver(invalid);
  assert.equal(result.status, "blocked");
  assert.ok(result.reasons.includes("invalid-composition"));
});

test("20. traceability failure produces blocked", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      omitTraces: true,
    }),
  );
  assert.equal(result.status, "blocked");
  assert.ok(result.reasons.includes("traceability-incomplete"));
});

test("21. composition primary preserved", () => {
  const result = deliver(makeComposition({ primary: samplePrimary }));
  assert.equal(result.primary?.candidateId, "candidate.production-risk");
  assert.equal(result.primary?.priorityTier, "primary");
});

test("22. no new primary selected", () => {
  const result = deliver(
    makeComposition({
      primary: null,
      supporting: [sampleSupporting],
    }),
  );
  assert.equal(result.primary, null);
  assert.ok(result.reasons.includes("primary-guidance-missing"));
  assert.equal(result.status, "ready");
});

test("23. supporting hierarchy preserved", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      supporting: [sampleSupporting],
    }),
  );
  assert.equal(result.supporting.length, 1);
  assert.equal(result.supporting[0]?.priorityTier, "supporting");
});

test("24. contextual hierarchy preserved", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      contextual: [sampleContextual],
    }),
  );
  assert.equal(result.contextual[0]?.priorityTier, "contextual");
});

test("25. background hierarchy preserved", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      background: [sampleBackground],
    }),
  );
  assert.equal(result.background[0]?.priorityTier, "background");
});

test("26. no DRI-7:4 reclassification", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      supporting: [sampleSupporting],
      contextual: [sampleContextual],
      background: [sampleBackground],
    }),
  );
  assert.equal(result.supporting[0]?.role, "supporting-evidence");
  assert.equal(result.contextual[0]?.role, "path-explanation");
  assert.equal(result.background[0]?.role, "background-context");
  assert.equal(boundary.preservesCompositionHierarchy, true);
});

test("27. no DRI-7:3 candidate re-resolution", () => {
  assert.equal(boundary.doesNotReresolve, true);
  // Platform orchestration may re-export the upstream resolver; Delivery must
  // not implement resolution logic locally.
  assert.doesNotMatch(source, /\b(?:recalculateAttention|selectPrimary)\b/);
  assert.doesNotMatch(
    source,
    /function\s+resolveDirectorExecutiveGuidance\b/,
  );
  assert.doesNotMatch(
    source,
    /const\s+resolveDirectorExecutiveGuidance\s*=/,
  );
  assert.match(
    source,
    /export\s*\{[\s\S]*resolveDirectorExecutiveGuidance[\s\S]*\}\s*from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceComposition["']/,
  );
});

test("28. no suppressed candidate reactivated", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      suppressedCandidateIds: ["candidate.suppressed"],
    }),
  );
  assert.deepEqual([...result.suppressedCandidateIds], ["candidate.suppressed"]);
  assert.ok(
    !result.trace.some((entry) => entry.candidateId === "candidate.suppressed"),
  );
});

test("29. no rejected candidate reactivated", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      rejectedCandidateIds: ["candidate.rejected"],
    }),
  );
  assert.deepEqual([...result.rejectedCandidateIds], ["candidate.rejected"]);
});

test("30. no deferred candidate reactivated", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      deferredCandidateIds: ["candidate.deferred"],
    }),
  );
  assert.deepEqual([...result.deferredCandidateIds], ["candidate.deferred"]);
});

test("31. no unresolved candidate reactivated", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      unresolvedCandidateIds: ["candidate.unresolved"],
    }),
  );
  assert.deepEqual([...result.unresolvedCandidateIds], [
    "candidate.unresolved",
  ]);
});

test("32. candidate identity preserved", () => {
  const result = deliver(makeComposition({ primary: samplePrimary }));
  assert.equal(result.primary?.candidateId, samplePrimary.candidateId);
});

test("33. guidance identity preserved", () => {
  const result = deliver(makeComposition({ primary: samplePrimary }));
  assert.equal(result.primary?.guidanceId, "guidance.production-risk");
});

test("34. guidance content preserved", () => {
  const result = deliver(makeComposition({ primary: samplePrimary }));
  assert.deepEqual(result.primary?.guidance, samplePrimary.guidance);
});

test("35. provenance preserved", () => {
  const result = deliver(makeComposition({ primary: samplePrimary }));
  assert.equal(result.primary?.provenance, samplePrimary.provenance);
});

test("36. path ordering preserved", () => {
  const paths: DirectorRuntimeExecutiveGuidanceCompositionPath[] = [
    Object.freeze({
      pathId: "production-impact-path",
      targets: Object.freeze([
        Object.freeze({ targetKind: "object" as const, targetId: "supplier" }),
        Object.freeze({ targetKind: "object" as const, targetId: "production" }),
        Object.freeze({
          targetKind: "kpi" as const,
          targetId: "delivery-kpi",
        }),
        Object.freeze({ targetKind: "object" as const, targetId: "customer" }),
      ]),
    }),
  ];
  const result = deliver(
    makeComposition({ primary: samplePrimary, paths }),
  );
  assert.deepEqual(
    result.paths[0]?.targets.map((target) => target.targetId),
    ["supplier", "production", "delivery-kpi", "customer"],
  );
});

test("37. relationship ordering preserved", () => {
  const relationships: DirectorRuntimeExecutiveGuidanceCompositionRelationship[] =
    [
      Object.freeze({
        relationshipId: "rel-a",
        relationshipKind: "supports",
        sourceTarget: Object.freeze({
          targetKind: "kpi" as const,
          targetId: "a",
        }),
        targetTarget: Object.freeze({
          targetKind: "object" as const,
          targetId: "production",
        }),
      }),
      Object.freeze({
        relationshipId: "rel-b",
        relationshipKind: "explains",
        sourceTarget: Object.freeze({
          targetKind: "kpi" as const,
          targetId: "b",
        }),
        targetTarget: Object.freeze({
          targetKind: "object" as const,
          targetId: "production",
        }),
      }),
    ];
  const result = deliver(
    makeComposition({ primary: samplePrimary, relationships }),
  );
  assert.deepEqual(
    result.relationships.map((item) => item.relationshipId),
    ["rel-a", "rel-b"],
  );
});

test("38. tier ordering preserved", () => {
  const s1 = makeItem("s1", "supporting", "supporting-evidence", 1, {
    guidanceId: "g-s1",
    guidanceKind: "surface-evidence",
    intent: "explain",
    source: { sourceKind: "attention-candidate", sourceId: "s1" },
  });
  const s2 = makeItem("s2", "supporting", "supporting-evidence", 2, {
    guidanceId: "g-s2",
    guidanceKind: "surface-evidence",
    intent: "explain",
    source: { sourceKind: "attention-candidate", sourceId: "s2" },
  });
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      supporting: [s1, s2],
    }),
  );
  assert.deepEqual(
    result.supporting.map((item) => item.candidateId),
    ["s1", "s2"],
  );
});

test("39. requested channel resolution deterministic", () => {
  assert.equal(
    resolveDirectorExecutiveGuidanceDeliveryChannel({
      requestedChannel: "scene",
      preferredChannel: "director",
      fallbackChannel: "insight",
    }),
    "scene",
  );
});

test("40. preferred channel resolution deterministic", () => {
  assert.equal(
    resolveDirectorExecutiveGuidanceDeliveryChannel({
      requestedChannel: null,
      preferredChannel: "advisor",
      fallbackChannel: "insight",
    }),
    "advisor",
  );
});

test("41. fallback channel resolution deterministic", () => {
  assert.equal(
    resolveDirectorExecutiveGuidanceDeliveryChannel({
      requestedChannel: null,
      preferredChannel: "not-a-channel" as never,
      fallbackChannel: "journal",
    }),
    "journal",
  );
});

test("42. default Director channel deterministic", () => {
  assert.equal(
    resolveDirectorExecutiveGuidanceDeliveryChannel({
      requestedChannel: null,
      preferredChannel: "not-a-channel" as never,
      fallbackChannel: null,
    }),
    "director",
  );
  const result = deliver(makeComposition({ primary: samplePrimary }));
  assert.equal(result.channel, "director");
  assert.equal(result.primary?.audience, "executive");
});

test("43. delivery trace complete", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      supporting: [sampleSupporting],
      contextual: [sampleContextual],
      background: [sampleBackground],
    }),
  );
  assert.equal(result.trace.length, 4);
  assert.ok(result.trace.every((entry) => entry.delivered === true));
});

test("44. delivery summary consistent", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      supporting: [sampleSupporting],
      contextual: [sampleContextual],
      background: [sampleBackground],
    }),
  );
  assert.equal(result.summary.activeItemCount, 4);
  assert.equal(result.summary.deliveredItemCount, 4);
  assert.equal(result.summary.primaryCount, 1);
  assert.equal(result.summary.supportingCount, 1);
  assert.equal(result.summary.contextualCount, 1);
  assert.equal(result.summary.backgroundCount, 1);
});

test("45. delivered-item count correct", () => {
  const held = deliver(
    makeComposition({ primary: samplePrimary }),
    defaultPolicy({ allowDelivery: false }),
  );
  assert.equal(held.summary.deliveredItemCount, 0);
  assert.equal(held.summary.activeItemCount, 1);
});

test("46. active-item count correct", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      supporting: [sampleSupporting],
    }),
  );
  assert.equal(result.summary.activeItemCount, 2);
});

test("47. primary count is 0 or 1", () => {
  assert.equal(
    deliver(makeComposition({ primary: samplePrimary })).summary.primaryCount,
    1,
  );
  assert.equal(
    deliver(
      makeComposition({ primary: null, supporting: [sampleSupporting] }),
    ).summary.primaryCount,
    0,
  );
});

test("48. no delivery item duplicated", () => {
  const result = deliver(
    makeComposition({
      primary: samplePrimary,
      supporting: [sampleSupporting],
      contextual: [sampleContextual],
      background: [sampleBackground],
    }),
  );
  const ids = [
    result.primary?.candidateId,
    ...result.supporting.map((item) => item.candidateId),
    ...result.contextual.map((item) => item.candidateId),
    ...result.background.map((item) => item.candidateId),
  ].filter(Boolean);
  assert.equal(new Set(ids).size, ids.length);
});

test("49. no new guidance generated", () => {
  assert.equal(boundary.doesNotCreateGuidance, true);
  const result = deliver(makeComposition({ primary: samplePrimary }));
  assert.equal(
    result.primary?.guidance.guidanceId,
    samplePrimary.guidance.guidanceId,
  );
});

test("50. no numeric scoring", () => {
  assert.doesNotMatch(
    source,
    /\b(?:deliveryScore|consumerPriority|renderPriority|channelWeight|visibilityRank|priorityScore)\b/,
  );
});

test("51. no weighted ranking", () => {
  assert.doesNotMatch(
    source,
    /\b(?:weightedRank|weightedScore|sortByScore|rankByWeight)\b/,
  );
  assert.equal(boundary.doesNotReprioritize, true);
});

test("52. no hidden sorting", () => {
  assert.doesNotMatch(source, /\.sort\s*\(|localeCompare/);
});

test("53. no event emitter", () => {
  assert.doesNotMatch(source, /\bEventEmitter\b/);
});

test("54. no event bus", () => {
  assert.doesNotMatch(source, /\b(?:eventBus|messageBus|event-bus|message-bus)\b/);
});

test("55. no callback-based consumer dispatch", () => {
  assert.doesNotMatch(
    source,
    /\b(?:consumerCallback|onDeliver|deliverToConsumer)\b/,
  );
  assert.equal(boundary.doesNotDispatchExternally, true);
});

test("56. no network IO", () => {
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|http\.|axios)\b/);
});

test("57. no storage IO", () => {
  assert.doesNotMatch(
    source,
    /\b(?:localStorage|sessionStorage|indexedDB|writeFile|readFile)\b/,
  );
});

test("58. no timers", () => {
  assert.doesNotMatch(source, /\b(?:setTimeout|setInterval|requestAnimationFrame)\b/);
});

test("59. no randomness", () => {
  assert.doesNotMatch(source, /\bMath\.random\(|crypto\.randomUUID\b/);
});

test("60. no internally generated timestamps", () => {
  assert.doesNotMatch(source, /\bDate\.now\(|new Date\(/);
});

test("61. composition input not mutated", () => {
  const composition = makeComposition({
    primary: samplePrimary,
    supporting: [sampleSupporting],
  });
  const snap = JSON.stringify(composition);
  deliver(composition);
  assert.equal(JSON.stringify(composition), snap);
});

test("62. policy input not mutated", () => {
  const policy = defaultPolicy({ preserveFocus: true });
  const snap = JSON.stringify(policy);
  deliver(makeComposition({ primary: samplePrimary }), policy);
  assert.equal(JSON.stringify(policy), snap);
});

test("63. context input not mutated", () => {
  const context = defaultContext({
    activeFocusId: "production",
    requestedChannel: "scene",
  });
  const snap = JSON.stringify(context);
  deliver(makeComposition({ primary: samplePrimary }), defaultPolicy(), context);
  assert.equal(JSON.stringify(context), snap);
});

test("64. delivery package immutable", () => {
  const result = deliver(makeComposition({ primary: samplePrimary }));
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.supporting), true);
  assert.equal(Object.isFrozen(result.trace), true);
  assert.equal(Object.isFrozen(result.summary), true);
  assert.throws(() => {
    (result as { status?: string }).status = "held";
  });
});

test("65. registry immutable", () => {
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(statuses), true);
  assert.throws(() => {
    (registry as { version?: string }).version = "0";
  });
});

test("66. repeated identical input gives identical output", () => {
  const composition = makeComposition({
    primary: samplePrimary,
    supporting: [sampleSupporting],
    contextual: [sampleContextual],
    background: [sampleBackground],
    paths: [
      Object.freeze({
        pathId: "production-impact-path",
        targets: Object.freeze([
          Object.freeze({
            targetKind: "object" as const,
            targetId: "supplier",
          }),
          Object.freeze({
            targetKind: "object" as const,
            targetId: "production",
          }),
          Object.freeze({
            targetKind: "kpi" as const,
            targetId: "delivery-kpi",
          }),
          Object.freeze({
            targetKind: "object" as const,
            targetId: "customer",
          }),
        ]),
      }),
    ],
  });
  const first = deliver(composition);
  const second = deliver(composition);
  assert.deepEqual(first, second);
  assert.equal(first.status, "ready");
  assert.equal(first.primary?.guidanceId, "guidance.production-risk");
  assert.equal(first.supporting[0]?.guidanceId, "guidance.delivery-kpi");
  assert.equal(
    first.contextual[0]?.guidanceId,
    "guidance.production-impact-path",
  );
  assert.equal(
    first.background[0]?.guidanceId,
    "guidance.supplier-capacity",
  );
});

test("67. no Three.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i);
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Vector3)\b/);
});

test("68. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next)(?:\/[^"']*)?["']/i);
  assert.doesNotMatch(source, /\b(?:React|ReactDOM|JSX|useState|useEffect)\b/);
});

test("69. no DOM/browser dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage)\b/,
  );
});

test("70. no renderer-specific fields", () => {
  assert.doesNotMatch(
    source,
    /\b(?:color|opacity|position|scale|rotation|camera|zoom|glow|pulse|animation|duration|easing|mesh|material|geometry|zIndex)\s*[?:]/,
  );
});

test("71. no Advisor/LLM behavior", () => {
  assert.doesNotMatch(
    source,
    /\b(?:LLM|systemPrompt|assistantMessage|tokenCount|modelName|chatHistory)\b/,
  );
  assert.equal(delivery.advisorIndependent, true);
});

test("72. no executable business actions", () => {
  assert.doesNotMatch(
    source,
    /\b(?:approveDecision|rejectDecision|startExecution|pauseExecution|navigateWorkspace|openPanel)\b/,
  );
  assert.equal(delivery.actionIndependent, true);
});

test("73. no SceneRenderer integration", () => {
  assert.doesNotMatch(
    source,
    /\b(?:SceneRenderer|AnimatableObject|createThreeScene)\b/,
  );
  assert.equal(delivery.sceneIndependent, true);
});

test("74. verification passes", () => {
  const first = verifyDirectorRuntimeExecutiveGuidanceDelivery();
  const second = verifyDirectorRuntimeExecutiveGuidanceDelivery();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(first.statusCount, 4);
  assert.equal(first.reasonCount, 11);
  assert.equal(first.channelCount, 6);
  assert.equal(first.audienceCount, 3);
  assert.equal(first.ruleCount, 9);
  assert.equal(first.publicTypeCount, 17);
  assert.equal(first.publicApiCount, 11);
  assert.equal(first.frozen, true);
  assert.equal(first.deliveryDeterministic, true);
  assert.equal(apiNames.length, registry.publicApiCount);
  assert.equal(publicTypeNames.length, registry.publicTypeCount);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(
    delivery.architecturalStatus,
    "Delivery Complete · Consumer-Ready · Deterministic · Traceable · Immutable · Side-Effect-Free · Renderer-Independent · ReadyForPlatform",
  );
});

test("75. DRI-7:4 regression passes", () => {
  const composition = verifyDirectorRuntimeExecutiveGuidanceComposition();
  assert.equal(composition.ok, true);
});

test("76. DRI-7:3 regression passes", () => {
  const resolution = verifyDirectorRuntimeExecutiveGuidanceResolution();
  assert.equal(resolution.ok, true);
});

test("77. DRI-7:2 regression passes", () => {
  const contracts = verifyDirectorRuntimeExecutiveGuidanceContracts();
  assert.equal(contracts.ok, true);
});

test("78. DRI-7:1 regression passes", () => {
  const foundation = verifyDirectorRuntimeExecutiveGuidanceFoundation();
  assert.equal(foundation.ok, true);
});

test("79. DRI-6 regression remains clean", () => {
  const publicIndex = verifyDirectorRuntimeAttentionFocusPublicIndex();
  assert.equal(publicIndex.ok, true);
});
