import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_BOUNDARY as boundary,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_PUBLIC_TYPE_NAMES as publicTypeNames,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS as reasons,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_IDS as ruleIds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER as ruleOrder,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES as statuses,
  createDirectorRuntimeExecutiveGuidanceResolutionContext,
  detectDirectorExecutiveGuidanceConflict,
  detectDirectorExecutiveGuidanceDuplicate,
  directorRuntimeExecutiveGuidanceResolution as resolution,
  directorRuntimeExecutiveGuidanceResolutionApiNames as apiNames,
  directorRuntimeExecutiveGuidanceResolutionCanonicalIdentity as canonicalIdentity,
  directorRuntimeExecutiveGuidanceResolutionRegistry as registry,
  resolveDirectorExecutiveGuidance,
  resolveDirectorExecutiveGuidancePrimaryCandidate,
  summarizeDirectorExecutiveGuidanceResolution,
  verifyDirectorRuntimeExecutiveGuidanceResolution,
  type DirectorRuntimeExecutiveGuidanceCandidate,
  type DirectorRuntimeExecutiveGuidanceEnvelope,
  type DirectorRuntimeExecutiveGuidanceResolutionInput,
} from "./directorRuntimeExecutiveGuidanceResolution.ts";

import {
  createDirectorRuntimeExecutiveGuidanceCandidate,
  createDirectorRuntimeExecutiveGuidanceEnvelope,
  directorRuntimeExecutiveGuidanceContractsIdentity,
  verifyDirectorRuntimeExecutiveGuidanceContracts,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceContracts";
import { verifyDirectorRuntimeExecutiveGuidanceFoundation } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation";
import { verifyDirectorRuntimeAttentionFocusPublicIndex } from
  "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeExecutiveGuidanceResolution.ts", import.meta.url),
  "utf8",
);

function makeGuidance(
  overrides: Partial<DirectorRuntimeExecutiveGuidanceCandidate["guidance"]> & {
    guidanceId: string;
  },
): DirectorRuntimeExecutiveGuidanceCandidate["guidance"] {
  return {
    guidanceId: overrides.guidanceId,
    guidanceKind: overrides.guidanceKind ?? "direct-attention",
    target: overrides.target ?? {
      targetKind: "object",
      targetId: "production",
    },
    importance: overrides.importance ?? "critical",
    urgency: overrides.urgency ?? "immediate",
    intent: overrides.intent ?? "warn",
    source: overrides.source ?? {
      sourceKind: "attention-output",
      sourceId: "attention.production-risk",
    },
    rationale: overrides.rationale,
  };
}

function makeCandidate(
  candidateId: string,
  guidanceOverrides: Partial<DirectorRuntimeExecutiveGuidanceCandidate["guidance"]> & {
    guidanceId: string;
  },
  extras: Partial<DirectorRuntimeExecutiveGuidanceCandidate> = {},
): DirectorRuntimeExecutiveGuidanceCandidate {
  return createDirectorRuntimeExecutiveGuidanceCandidate({
    candidateId,
    guidance: makeGuidance(guidanceOverrides),
    eligibility: extras.eligibility ?? "eligible",
    provenance: extras.provenance ?? {
      sourceReferences: [{
        sourceKind: "attention-output",
        sourceId: "attention.production-risk",
      }],
      derivedFromGuidanceIds: [],
    },
    constraints: extras.constraints ?? {},
  });
}

function makeEnvelope(
  candidates: readonly DirectorRuntimeExecutiveGuidanceCandidate[],
  constraintOverrides: DirectorRuntimeExecutiveGuidanceEnvelope["request"]["constraints"] = {},
  deliveryOverrides: Partial<
    DirectorRuntimeExecutiveGuidanceEnvelope["deliveryPolicy"]
  > = {},
): DirectorRuntimeExecutiveGuidanceEnvelope {
  return createDirectorRuntimeExecutiveGuidanceEnvelope({
    envelopeId: "envelope.production-risk",
    request: {
      requestId: "request.production-risk",
      subjects: [{ targetKind: "object", targetId: "production" }],
      attentionReferences: [{
        sourceKind: "attention-output",
        sourceId: "attention.production-risk",
      }],
      constraints: {
        preserveCurrentFocus: false,
        preserveExecutiveContext: false,
        allowInterruption: true,
        allowComparison: true,
        allowPathExplanation: true,
        maximumGuidanceItems: 10,
        ...constraintOverrides,
      },
    },
    candidates: [...candidates],
    relationships: [],
    paths: [],
    deliveryPolicy: {
      interruption: "non-interruptive",
      persistence: "transient",
      preserveFocus: false,
      preserveContext: false,
      ...deliveryOverrides,
    },
  });
}

function makeInput(
  candidates: readonly DirectorRuntimeExecutiveGuidanceCandidate[],
  options: {
    constraints?: DirectorRuntimeExecutiveGuidanceEnvelope["request"]["constraints"];
    delivery?: Partial<DirectorRuntimeExecutiveGuidanceEnvelope["deliveryPolicy"]>;
    activeContext?: DirectorRuntimeExecutiveGuidanceResolutionInput["context"]["activeContext"];
    activeFocus?: DirectorRuntimeExecutiveGuidanceResolutionInput["context"]["activeFocus"];
  } = {},
): DirectorRuntimeExecutiveGuidanceResolutionInput {
  const envelope = makeEnvelope(
    candidates,
    options.constraints,
    options.delivery,
  );
  return {
    resolutionId: "resolution.production-risk",
    envelope,
    context: createDirectorRuntimeExecutiveGuidanceResolutionContext({
      activeContext: options.activeContext ?? null,
      activeFocus: options.activeFocus ?? null,
      deliveryPolicy: envelope.deliveryPolicy,
    }),
  };
}

test("1. exact DRI-7:3 identity", () => {
  assert.equal(
    resolution.identity,
    "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution",
  );
  assert.equal(canonicalIdentity.identity, resolution.identity);
  assert.equal(resolution.phase, "DRI-7:3");
  assert.equal(resolution.role, "Resolution");
});

test("2. exact version 7.3.0", () => {
  assert.equal(resolution.version, "7.3.0");
  assert.equal(canonicalIdentity.version, "7.3.0");
});

test("3. exact namespace", () => {
  assert.equal(
    resolution.namespace,
    "nexora.dri.executive-guidance.resolution",
  );
});

test("4. sole immediate dependency is DRI-7:2", () => {
  assert.equal(
    resolution.upstreamDependency,
    "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
  );
  assert.equal(
    resolution.upstreamDependency,
    directorRuntimeExecutiveGuidanceContractsIdentity,
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceContracts",
  ]);
});

test("5. no direct DRI-7:1 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceFoundation["']/,
  );
});

test("6. no direct DRI-6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeAttentionFocus/,
  );
});

test("7. resolution-status vocabulary completeness", () => {
  assert.deepEqual([...statuses], [
    "selected",
    "deferred",
    "suppressed",
    "rejected",
    "unresolved",
  ]);
  assert.equal(new Set(statuses).size, 5);
});

test("8. resolution-reason vocabulary completeness", () => {
  assert.deepEqual([...reasons], [
    "eligible",
    "candidate-ineligible",
    "candidate-suppressed",
    "candidate-deferred",
    "context-mismatch",
    "focus-preservation",
    "interruption-not-allowed",
    "comparison-not-allowed",
    "path-explanation-not-allowed",
    "duplicate-guidance",
    "conflicting-guidance",
    "maximum-guidance-reached",
    "insufficient-context",
    "invalid-provenance",
    "constraint-conflict",
    "unresolved-conflict",
  ]);
  assert.equal(reasons.length, 16);
  assert.equal(new Set(reasons).size, 16);
});

test("9. resolution registry deterministic order", () => {
  assert.deepEqual([...ruleOrder], [
    "contract-validity",
    "eligibility",
    "focus-preservation",
    "context-preservation",
    "interruption",
    "comparison",
    "path-explanation",
    "duplicate",
    "conflict",
    "maximum-guidance",
    "primary-candidate",
  ]);
  assert.deepEqual([...ruleIds], [
    "dri7.resolution.contract-validity",
    "dri7.resolution.eligibility",
    "dri7.resolution.focus-preservation",
    "dri7.resolution.context-preservation",
    "dri7.resolution.interruption",
    "dri7.resolution.comparison",
    "dri7.resolution.path-explanation",
    "dri7.resolution.duplicate",
    "dri7.resolution.conflict",
    "dri7.resolution.maximum-guidance",
    "dri7.resolution.primary-candidate",
  ]);
  assert.equal(Object.isFrozen(registry), true);
});

test("10. eligible candidate can resolve selected", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput([
      makeCandidate("candidate.production-risk", {
        guidanceId: "guidance.production-risk",
      }),
    ]),
  );
  assert.equal(result.entries[0]?.status, "selected");
  assert.deepEqual([...result.entries[0]!.reasons], ["eligible"]);
});

test("11. deferred candidate remains deferred", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput([
      makeCandidate("candidate.deferred", {
        guidanceId: "g-deferred",
      }, { eligibility: "deferred" }),
    ]),
  );
  assert.equal(result.entries[0]?.status, "deferred");
  assert.deepEqual([...result.entries[0]!.reasons], ["candidate-deferred"]);
});

test("12. suppressed candidate remains suppressed", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput([
      makeCandidate("candidate.suppressed", {
        guidanceId: "g-suppressed",
      }, { eligibility: "suppressed" }),
    ]),
  );
  assert.equal(result.entries[0]?.status, "suppressed");
  assert.deepEqual([...result.entries[0]!.reasons], ["candidate-suppressed"]);
});

test("13. ineligible candidate resolves rejected", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput([
      makeCandidate("candidate.ineligible", {
        guidanceId: "g-ineligible",
      }, { eligibility: "ineligible" }),
    ]),
  );
  assert.equal(result.entries[0]?.status, "rejected");
  assert.deepEqual([...result.entries[0]!.reasons], ["candidate-ineligible"]);
});

test("14. focus-preservation constraint respected", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput(
      [
        makeCandidate("candidate.redirect", {
          guidanceId: "g-redirect",
          guidanceKind: "direct-attention",
          target: { targetKind: "object", targetId: "warehouse" },
        }),
      ],
      {
        constraints: { preserveCurrentFocus: true },
        activeFocus: { targetKind: "object", targetId: "production" },
      },
    ),
  );
  assert.equal(result.entries[0]?.status, "deferred");
  assert.ok(result.entries[0]?.reasons.includes("focus-preservation"));
});

test("15. context-preservation constraint respected", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput(
      [
        makeCandidate("candidate.mismatch", {
          guidanceId: "g-mismatch",
          target: { targetKind: "object", targetId: "warehouse" },
        }),
      ],
      {
        constraints: { preserveExecutiveContext: true },
        activeContext: { contextKind: "object", contextId: "production" },
      },
    ),
  );
  assert.equal(result.entries[0]?.status, "deferred");
  assert.ok(result.entries[0]?.reasons.includes("context-mismatch"));
});

test("16. non-interruption constraint respected", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput(
      [
        makeCandidate("candidate.interrupt", {
          guidanceId: "g-interrupt",
          importance: "critical",
          urgency: "immediate",
        }),
      ],
      {
        constraints: { allowInterruption: false },
        delivery: { interruption: "interruptive" },
      },
    ),
  );
  assert.equal(result.entries[0]?.status, "deferred");
  assert.ok(result.entries[0]?.reasons.includes("interruption-not-allowed"));
});

test("17. comparison-disabled constraint respected", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput(
      [
        makeCandidate("candidate.compare", {
          guidanceId: "g-compare",
          guidanceKind: "compare",
          intent: "compare",
          importance: "important",
          urgency: "none",
        }),
      ],
      { constraints: { allowComparison: false } },
    ),
  );
  assert.equal(result.entries[0]?.status, "suppressed");
  assert.ok(result.entries[0]?.reasons.includes("comparison-not-allowed"));
});

test("18. path-explanation-disabled constraint respected", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput(
      [
        makeCandidate("candidate.path", {
          guidanceId: "g-path",
          guidanceKind: "explain-path",
          intent: "explain",
          importance: "supporting",
          urgency: "none",
        }),
      ],
      { constraints: { allowPathExplanation: false } },
    ),
  );
  assert.equal(result.entries[0]?.status, "suppressed");
  assert.ok(result.entries[0]?.reasons.includes("path-explanation-not-allowed"));
});

test("19. exact duplicate detection works", () => {
  const a = makeCandidate("candidate.a", { guidanceId: "g-a" });
  const b = makeCandidate("candidate.b", { guidanceId: "g-a-dup" });
  assert.equal(detectDirectorExecutiveGuidanceDuplicate(a, b), true);
  const c = makeCandidate("candidate.c", {
    guidanceId: "g-c",
    target: { targetKind: "kpi", targetId: "delivery" },
  });
  assert.equal(detectDirectorExecutiveGuidanceDuplicate(a, c), false);
});

test("20. earliest duplicate candidate is preserved", () => {
  const first = makeCandidate("candidate.production-risk", {
    guidanceId: "guidance.production-risk",
  });
  const duplicate = makeCandidate("candidate.production-risk.duplicate", {
    guidanceId: "guidance.production-risk.dup",
  });
  const result = resolveDirectorExecutiveGuidance(makeInput([first, duplicate]));
  assert.equal(result.entries[0]?.status, "selected");
  assert.equal(result.entries[0]?.candidateId, "candidate.production-risk");
});

test("21. later duplicate is suppressed", () => {
  const first = makeCandidate("candidate.production-risk", {
    guidanceId: "guidance.production-risk",
  });
  const duplicate = makeCandidate("candidate.production-risk.duplicate", {
    guidanceId: "guidance.production-risk.dup",
  });
  const result = resolveDirectorExecutiveGuidance(makeInput([first, duplicate]));
  assert.equal(result.entries[1]?.status, "suppressed");
  assert.ok(result.entries[1]?.reasons.includes("duplicate-guidance"));
});

test("22. deterministic conflict detection works", () => {
  const preserve = makeCandidate("candidate.preserve", {
    guidanceId: "g-preserve",
    guidanceKind: "preserve-context",
    intent: "orient",
    importance: "important",
    urgency: "none",
  });
  const deemphasize = makeCandidate("candidate.deemphasize", {
    guidanceId: "g-deemphasize",
    guidanceKind: "de-emphasize",
    intent: "orient",
    importance: "supporting",
    urgency: "none",
    source: {
      sourceKind: "executive-context",
      sourceId: "ctx.deemphasize",
    },
  });
  const conflict = detectDirectorExecutiveGuidanceConflict(preserve, deemphasize);
  assert.equal(conflict.conflicts, true);
  assert.equal(conflict.resolvable, true);
  assert.equal(conflict.winnerCandidateId, "candidate.preserve");

  const result = resolveDirectorExecutiveGuidance(
    makeInput([preserve, deemphasize]),
  );
  assert.equal(result.entries[0]?.status, "selected");
  assert.equal(result.entries[1]?.status, "suppressed");
  assert.ok(result.entries[1]?.reasons.includes("conflicting-guidance"));
});

test("23. unresolvable conflict returns unresolved", () => {
  const maintain = makeCandidate("candidate.maintain", {
    guidanceId: "g-maintain",
    guidanceKind: "maintain-focus",
    intent: "orient",
    importance: "important",
    urgency: "none",
    target: { targetKind: "object", targetId: "production" },
  });
  const direct = makeCandidate("candidate.direct", {
    guidanceId: "g-direct",
    guidanceKind: "direct-attention",
    intent: "warn",
    target: { targetKind: "object", targetId: "warehouse" },
    source: {
      sourceKind: "attention-output",
      sourceId: "attention.warehouse",
    },
  });
  const result = resolveDirectorExecutiveGuidance(makeInput([maintain, direct]));
  assert.equal(result.entries[0]?.status, "unresolved");
  assert.equal(result.entries[1]?.status, "unresolved");
  assert.ok(result.entries[0]?.reasons.includes("unresolved-conflict"));
  assert.equal(result.primaryCandidateId, null);
});

test("24. maximum-guidance constraint respected", () => {
  const candidates = [
    makeCandidate("c1", { guidanceId: "g1" }),
    makeCandidate("c2", {
      guidanceId: "g2",
      target: { targetKind: "kpi", targetId: "kpi-1" },
      source: { sourceKind: "attention-candidate", sourceId: "a2" },
    }),
    makeCandidate("c3", {
      guidanceId: "g3",
      target: { targetKind: "kpi", targetId: "kpi-2" },
      source: { sourceKind: "attention-candidate", sourceId: "a3" },
    }),
  ];
  const result = resolveDirectorExecutiveGuidance(
    makeInput(candidates, { constraints: { maximumGuidanceItems: 2 } }),
  );
  assert.equal(result.summary.selectedCount, 2);
  assert.equal(result.entries[2]?.status, "deferred");
});

test("25. overflow candidate is deferred", () => {
  const candidates = [
    makeCandidate("c1", { guidanceId: "g1" }),
    makeCandidate("c2", {
      guidanceId: "g2",
      target: { targetKind: "object", targetId: "warehouse" },
      source: { sourceKind: "attention-candidate", sourceId: "a2" },
    }),
  ];
  const result = resolveDirectorExecutiveGuidance(
    makeInput(candidates, { constraints: { maximumGuidanceItems: 1 } }),
  );
  assert.equal(result.entries[1]?.status, "deferred");
  assert.ok(result.entries[1]?.reasons.includes("maximum-guidance-reached"));
});

test("26. candidate input order preserved", () => {
  const candidates = [
    makeCandidate("c-late", {
      guidanceId: "g-late",
      importance: "supporting",
      urgency: "none",
      target: { targetKind: "kpi", targetId: "k1" },
      source: { sourceKind: "attention-candidate", sourceId: "s1" },
    }),
    makeCandidate("c-early", {
      guidanceId: "g-early",
      importance: "critical",
      urgency: "immediate",
    }),
  ];
  const result = resolveDirectorExecutiveGuidance(makeInput(candidates));
  assert.deepEqual(
    result.entries.map((entry) => entry.candidateId),
    ["c-late", "c-early"],
  );
  assert.deepEqual(
    result.entries.map((entry) => entry.ordinal),
    [0, 1],
  );
});

test("27. selected candidate order preserved", () => {
  const candidates = [
    makeCandidate("c1", {
      guidanceId: "g1",
      importance: "supporting",
      urgency: "none",
      target: { targetKind: "kpi", targetId: "k1" },
      source: { sourceKind: "attention-candidate", sourceId: "s1" },
    }),
    makeCandidate("c2", { guidanceId: "g2" }),
  ];
  const result = resolveDirectorExecutiveGuidance(makeInput(candidates));
  assert.deepEqual([...result.selectedCandidateIds], ["c1", "c2"]);
});

test("28. no numeric scoring", () => {
  assert.doesNotMatch(
    source,
    /\b(?:priorityScore|attentionScore|guidanceScore|importanceWeight|urgencyWeight|confidenceWeight|rankScore)\b/,
  );
  assert.equal(boundary.doesNotScoreGuidance, true);
});

test("29. no weighted ranking", () => {
  assert.doesNotMatch(
    source,
    /\b(?:weightedRank|weightedScore|sortByScore|rankByWeight|critical\s*=\s*4|important\s*=\s*3)\b/,
  );
  assert.equal(boundary.doesNotRankByWeight, true);
});

test("30. primary candidate only references selected candidate", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput([
      makeCandidate("selected", { guidanceId: "g-selected" }),
      makeCandidate("deferred", {
        guidanceId: "g-deferred",
        target: { targetKind: "kpi", targetId: "k" },
        source: { sourceKind: "attention-candidate", sourceId: "s" },
      }, { eligibility: "deferred" }),
    ]),
  );
  assert.equal(result.primaryCandidateId, "selected");
  assert.ok(result.selectedCandidateIds.includes(result.primaryCandidateId!));
});

test("31. no selected candidate → primary null", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput([
      makeCandidate("only-deferred", {
        guidanceId: "g",
      }, { eligibility: "deferred" }),
    ]),
  );
  assert.equal(result.primaryCandidateId, null);
  assert.equal(
    resolveDirectorExecutiveGuidancePrimaryCandidate(result.entries),
    null,
  );
});

test("32. exactly one selected candidate → becomes primary", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput([
      makeCandidate("only-selected", { guidanceId: "g" }),
    ]),
  );
  assert.equal(result.primaryCandidateId, "only-selected");
});

test("33. multiple selected candidates resolve deterministically", () => {
  const candidates = [
    makeCandidate("kpi", {
      guidanceId: "g-kpi",
      guidanceKind: "surface-evidence",
      intent: "explain",
      importance: "important",
      urgency: "soon",
      target: { targetKind: "kpi", targetId: "delivery" },
      source: { sourceKind: "attention-candidate", sourceId: "kpi" },
    }),
    makeCandidate("production", {
      guidanceId: "g-production",
      guidanceKind: "direct-attention",
    }),
  ];
  const result = resolveDirectorExecutiveGuidance(makeInput(candidates));
  // Exactly one direct-attention → unambiguous primary
  assert.equal(result.primaryCandidateId, "production");
  const again = resolveDirectorExecutiveGuidance(makeInput(candidates));
  assert.equal(again.primaryCandidateId, result.primaryCandidateId);
});

test("34. summary counts match total candidate count", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput([
      makeCandidate("a", { guidanceId: "ga" }),
      makeCandidate("b", {
        guidanceId: "gb",
        target: { targetKind: "kpi", targetId: "k" },
        source: { sourceKind: "attention-candidate", sourceId: "sb" },
      }, { eligibility: "deferred" }),
      makeCandidate("c", {
        guidanceId: "gc",
        target: { targetKind: "object", targetId: "x" },
        source: { sourceKind: "attention-candidate", sourceId: "sc" },
      }, { eligibility: "suppressed" }),
    ]),
  );
  const s = result.summary;
  assert.equal(
    s.selectedCount +
      s.deferredCount +
      s.suppressedCount +
      s.rejectedCount +
      s.unresolvedCount,
    s.totalCandidates,
  );
  assert.deepEqual(
    summarizeDirectorExecutiveGuidanceResolution(result.entries),
    s,
  );
});

test("35. no candidate is lost", () => {
  const candidates = [
    makeCandidate("c1", { guidanceId: "g1" }),
    makeCandidate("c2", {
      guidanceId: "g2",
      target: { targetKind: "kpi", targetId: "k" },
      source: { sourceKind: "attention-candidate", sourceId: "s2" },
    }),
    makeCandidate("c3", {
      guidanceId: "g3",
      target: { targetKind: "object", targetId: "w" },
      source: { sourceKind: "attention-candidate", sourceId: "s3" },
    }, { eligibility: "ineligible" }),
  ];
  const result = resolveDirectorExecutiveGuidance(makeInput(candidates));
  assert.equal(result.entries.length, candidates.length);
  assert.deepEqual(
    result.entries.map((entry) => entry.candidateId),
    candidates.map((entry) => entry.candidateId),
  );
});

test("36. provenance preserved", () => {
  const candidate = makeCandidate("c-prov", {
    guidanceId: "g-prov",
  }, {
    provenance: {
      sourceReferences: [{
        sourceKind: "focus-subject",
        sourceId: "focus.production",
      }],
      derivedFromGuidanceIds: ["guidance.parent"],
      rationale: "trace",
    },
  });
  const result = resolveDirectorExecutiveGuidance(makeInput([candidate]));
  assert.equal(
    result.entries[0]?.provenance.sourceReferences[0]?.sourceId,
    "focus.production",
  );
  assert.deepEqual(
    [...result.entries[0]!.provenance.derivedFromGuidanceIds],
    ["guidance.parent"],
  );
});

test("37. original ordinal preserved", () => {
  const candidates = [
    makeCandidate("c0", { guidanceId: "g0" }),
    makeCandidate("c1", {
      guidanceId: "g1",
      target: { targetKind: "kpi", targetId: "k" },
      source: { sourceKind: "attention-candidate", sourceId: "s1" },
    }),
  ];
  const result = resolveDirectorExecutiveGuidance(makeInput(candidates));
  assert.equal(result.entries[0]?.ordinal, 0);
  assert.equal(result.entries[1]?.ordinal, 1);
});

test("38. resolver does not mutate envelope", () => {
  const input = makeInput([
    makeCandidate("c1", { guidanceId: "g1" }),
  ]);
  const snap = JSON.stringify(input.envelope);
  resolveDirectorExecutiveGuidance(input);
  assert.equal(JSON.stringify(input.envelope), snap);
});

test("39. resolver does not mutate candidates", () => {
  const candidates = [
    makeCandidate("c1", { guidanceId: "g1" }),
  ];
  const snap = JSON.stringify(candidates);
  resolveDirectorExecutiveGuidance(makeInput(candidates));
  assert.equal(JSON.stringify(candidates), snap);
});

test("40. resolver does not mutate context", () => {
  const input = makeInput(
    [makeCandidate("c1", { guidanceId: "g1" })],
    {
      activeFocus: { targetKind: "object", targetId: "production" },
      activeContext: { contextKind: "object", contextId: "production" },
    },
  );
  const snap = JSON.stringify(input.context);
  resolveDirectorExecutiveGuidance(input);
  assert.equal(JSON.stringify(input.context), snap);
});

test("41. result is immutable", () => {
  const result = resolveDirectorExecutiveGuidance(
    makeInput([makeCandidate("c1", { guidanceId: "g1" })]),
  );
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.entries), true);
  assert.equal(Object.isFrozen(result.summary), true);
  assert.throws(() => {
    (result as { primaryCandidateId?: string | null }).primaryCandidateId =
      "x";
  });
});

test("42. registry is immutable", () => {
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(statuses), true);
  assert.equal(Object.isFrozen(reasons), true);
  assert.equal(Object.isFrozen(ruleOrder), true);
  assert.throws(() => {
    (registry as { version?: string }).version = "0";
  });
});

test("43. resolver is deterministic across repeated identical inputs", () => {
  const input = makeInput([
    makeCandidate("production", { guidanceId: "g-prod" }),
    makeCandidate("kpi", {
      guidanceId: "g-kpi",
      guidanceKind: "surface-evidence",
      intent: "explain",
      target: { targetKind: "kpi", targetId: "delivery" },
      source: { sourceKind: "attention-candidate", sourceId: "kpi" },
    }),
    makeCandidate("production.dup", { guidanceId: "g-dup" }),
    makeCandidate("compare", {
      guidanceId: "g-compare",
      guidanceKind: "compare",
      intent: "compare",
      target: { targetKind: "scenario", targetId: "s1" },
      source: { sourceKind: "executive-context", sourceId: "cmp" },
    }),
  ], { constraints: { allowComparison: false, maximumGuidanceItems: 3 } });
  const first = resolveDirectorExecutiveGuidance(input);
  const second = resolveDirectorExecutiveGuidance(input);
  assert.deepEqual(first, second);
});

test("44. no Three.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i);
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Vector3)\b/);
});

test("45. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next)(?:\/[^"']*)?["']/i);
  assert.doesNotMatch(source, /\b(?:React|ReactDOM|JSX|useState|useEffect)\b/);
});

test("46. no DOM/browser dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage|fetch|XMLHttpRequest)\b/,
  );
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
});

test("47. no renderer-specific fields", () => {
  assert.doesNotMatch(
    source,
    /\b(?:color|opacity|position|scale|rotation|camera|zoom|glow|pulse|animation|duration|easing|mesh|material|geometry)\s*[?:]/,
  );
});

test("48. no Advisor/LLM dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:LLM|prompt|systemPrompt|assistantMessage|tokenCount|modelName|chatHistory)\b/,
  );
  assert.equal(resolution.advisorIndependent, true);
});

test("49. no action execution", () => {
  assert.doesNotMatch(
    source,
    /\b(?:approveDecision|rejectDecision|startExecution|pauseExecution|navigateWorkspace|openPanel)\b/,
  );
  assert.equal(resolution.actionIndependent, true);
});

test("50. resolution verification passes", () => {
  const first = verifyDirectorRuntimeExecutiveGuidanceResolution();
  const second = verifyDirectorRuntimeExecutiveGuidanceResolution();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(first.statusCount, 5);
  assert.equal(first.reasonCount, 16);
  assert.equal(first.ruleCount, 11);
  assert.equal(first.publicTypeCount, 11);
  assert.equal(first.publicApiCount, 15);
  assert.equal(first.frozen, true);
  assert.equal(first.resolverDeterministic, true);
  assert.equal(first.noNumericScoring, true);
  assert.equal(apiNames.length, registry.publicApiCount);
  assert.equal(publicTypeNames.length, registry.publicTypeCount);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(
    resolution.architecturalStatus,
    "Resolution Complete · Deterministic · Traceable · Constraint-Aware · Immutable · Renderer-Independent · ReadyForComposition",
  );
});

test("51. DRI-7:2 regression passes", () => {
  const contracts = verifyDirectorRuntimeExecutiveGuidanceContracts();
  assert.equal(contracts.ok, true);
  assert.equal(
    contracts.identity,
    "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
  );
});

test("52. DRI-7:1 regression passes", () => {
  const foundation = verifyDirectorRuntimeExecutiveGuidanceFoundation();
  assert.equal(foundation.ok, true);
});

test("53. DRI-6 regression remains clean", () => {
  const publicIndex = verifyDirectorRuntimeAttentionFocusPublicIndex();
  assert.equal(publicIndex.ok, true);
});

test("54. focused example scenario matches expected dispositions", () => {
  const production = makeCandidate("candidate.production-risk", {
    guidanceId: "guidance.production-risk",
  });
  const kpi = makeCandidate("candidate.production-kpi", {
    guidanceId: "guidance.production-kpi",
    guidanceKind: "surface-evidence",
    intent: "explain",
    importance: "important",
    urgency: "soon",
    target: { targetKind: "kpi", targetId: "delivery-performance" },
    source: {
      sourceKind: "attention-candidate",
      sourceId: "candidate.delivery-kpi",
    },
  });
  const duplicate = makeCandidate("candidate.production-risk.duplicate", {
    guidanceId: "guidance.production-risk.dup",
  });
  const compare = makeCandidate("candidate.scenario-comparison", {
    guidanceId: "guidance.scenario-comparison",
    guidanceKind: "compare",
    intent: "compare",
    importance: "important",
    urgency: "none",
    target: { targetKind: "scenario", targetId: "scenario-a" },
    source: {
      sourceKind: "executive-context",
      sourceId: "ctx.scenario-a",
    },
  });
  const result = resolveDirectorExecutiveGuidance(
    makeInput([production, kpi, duplicate, compare], {
      constraints: {
        preserveCurrentFocus: false,
        preserveExecutiveContext: false,
        allowInterruption: true,
        allowComparison: false,
        allowPathExplanation: true,
        maximumGuidanceItems: 3,
      },
      activeContext: { contextKind: "object", contextId: "production" },
      activeFocus: { targetKind: "object", targetId: "production" },
    }),
  );
  assert.equal(result.entries[0]?.status, "selected");
  assert.equal(result.entries[1]?.status, "selected");
  assert.equal(result.entries[2]?.status, "suppressed");
  assert.ok(result.entries[2]?.reasons.includes("duplicate-guidance"));
  assert.equal(result.entries[3]?.status, "suppressed");
  assert.ok(result.entries[3]?.reasons.includes("comparison-not-allowed"));
  assert.deepEqual([...result.selectedCandidateIds], [
    "candidate.production-risk",
    "candidate.production-kpi",
  ]);
  assert.equal(result.primaryCandidateId, "candidate.production-risk");
  assert.deepEqual(result.summary, {
    totalCandidates: 4,
    selectedCount: 2,
    deferredCount: 0,
    suppressedCount: 2,
    rejectedCount: 0,
    unresolvedCount: 0,
  });
});
