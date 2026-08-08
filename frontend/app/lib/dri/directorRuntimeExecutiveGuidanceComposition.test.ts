import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_BOUNDARY as boundary,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_PUBLIC_TYPE_NAMES as publicTypeNames,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES as roles,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_IDS as ruleIds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER as ruleOrder,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS as tiers,
  composeDirectorExecutiveGuidance,
  directorRuntimeExecutiveGuidanceComposition as composition,
  directorRuntimeExecutiveGuidanceCompositionApiNames as apiNames,
  directorRuntimeExecutiveGuidanceCompositionCanonicalIdentity as canonicalIdentity,
  directorRuntimeExecutiveGuidanceCompositionRegistry as registry,
  resolveDirectorExecutiveGuidanceCompositionRole,
  verifyDirectorRuntimeExecutiveGuidanceComposition,
  type DirectorRuntimeExecutiveGuidanceCompositionInput,
  type DirectorRuntimeExecutiveGuidanceCompositionPath,
  type DirectorRuntimeExecutiveGuidanceCompositionRelationship,
  type DirectorRuntimeExecutiveGuidanceItem,
  type DirectorRuntimeExecutiveGuidanceProvenance,
  type DirectorRuntimeExecutiveGuidanceResolution,
  type DirectorRuntimeExecutiveGuidanceResolutionEntry,
} from "./directorRuntimeExecutiveGuidanceComposition.ts";

import {
  directorRuntimeExecutiveGuidanceResolutionIdentity,
  verifyDirectorRuntimeExecutiveGuidanceResolution,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceResolution";
import { verifyDirectorRuntimeExecutiveGuidanceContracts } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceContracts";
import { verifyDirectorRuntimeExecutiveGuidanceFoundation } from
  "@/app/lib/dri/directorRuntimeExecutiveGuidanceFoundation";
import { verifyDirectorRuntimeAttentionFocusPublicIndex } from
  "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex";

const source = readFileSync(
  new URL("./directorRuntimeExecutiveGuidanceComposition.ts", import.meta.url),
  "utf8",
);

const emptyProvenance: DirectorRuntimeExecutiveGuidanceProvenance =
  Object.freeze({
    sourceReferences: Object.freeze([]),
    derivedFromGuidanceIds: Object.freeze([]),
  });

function guidance(
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
    importance: overrides.importance ?? "critical",
    urgency: overrides.urgency ?? "immediate",
    intent: overrides.intent ?? "warn",
    source: Object.freeze(
      overrides.source ?? {
        sourceKind: "attention-output" as const,
        sourceId: "attention.production-risk",
      },
    ),
    ...(overrides.rationale !== undefined
      ? { rationale: overrides.rationale }
      : {}),
  });
}

function entry(
  candidateId: string,
  status: DirectorRuntimeExecutiveGuidanceResolutionEntry["status"],
  ordinal: number,
  item: DirectorRuntimeExecutiveGuidanceItem | null,
  reasons: DirectorRuntimeExecutiveGuidanceResolutionEntry["reasons"] = [
    "eligible",
  ],
): DirectorRuntimeExecutiveGuidanceResolutionEntry {
  return Object.freeze({
    candidateId,
    status,
    reasons: Object.freeze([...reasons]),
    guidance: item,
    provenance: emptyProvenance,
    ordinal,
  });
}

function makeResolution(
  entries: readonly DirectorRuntimeExecutiveGuidanceResolutionEntry[],
  primaryCandidateId: string | null,
): DirectorRuntimeExecutiveGuidanceResolution {
  const selectedCandidateIds = Object.freeze(
    entries
      .filter((item) => item.status === "selected")
      .map((item) => item.candidateId),
  );
  return Object.freeze({
    resolutionId: "resolution.production-risk",
    requestId: "request.production-risk",
    entries: Object.freeze([...entries]),
    selectedCandidateIds,
    primaryCandidateId,
    summary: Object.freeze({
      totalCandidates: entries.length,
      selectedCount: entries.filter((item) => item.status === "selected").length,
      deferredCount: entries.filter((item) => item.status === "deferred").length,
      suppressedCount: entries.filter((item) => item.status === "suppressed")
        .length,
      rejectedCount: entries.filter((item) => item.status === "rejected").length,
      unresolvedCount: entries.filter((item) => item.status === "unresolved")
        .length,
    }),
  });
}

function compose(
  resolution: DirectorRuntimeExecutiveGuidanceResolution,
  relationships: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[] =
    [],
  paths: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[] = [],
): ReturnType<typeof composeDirectorExecutiveGuidance> {
  const input: DirectorRuntimeExecutiveGuidanceCompositionInput = {
    compositionId: "composition.production-risk",
    resolution,
    relationships,
    paths,
  };
  return composeDirectorExecutiveGuidance(input);
}

test("1. exact DRI-7:4 identity", () => {
  assert.equal(
    composition.identity,
    "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition",
  );
  assert.equal(canonicalIdentity.identity, composition.identity);
  assert.equal(composition.phase, "DRI-7:4");
  assert.equal(composition.role, "Composition");
});

test("2. exact version 7.4.0", () => {
  assert.equal(composition.version, "7.4.0");
  assert.equal(canonicalIdentity.version, "7.4.0");
});

test("3. exact namespace", () => {
  assert.equal(
    composition.namespace,
    "nexora.dri.executive-guidance.composition",
  );
});

test("4. sole immediate dependency is DRI-7:3", () => {
  assert.equal(
    composition.upstreamDependency,
    "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution",
  );
  assert.equal(
    composition.upstreamDependency,
    directorRuntimeExecutiveGuidanceResolutionIdentity,
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeExecutiveGuidanceResolution",
  ]);
});

test("5. no direct DRI-7:2 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceContracts["']/,
  );
});

test("6. no direct DRI-7:1 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeExecutiveGuidanceFoundation["']/,
  );
});

test("7. no direct DRI-6 import", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeAttentionFocus/,
  );
});

test("8. priority-tier vocabulary completeness", () => {
  assert.deepEqual([...tiers], [
    "primary",
    "supporting",
    "contextual",
    "background",
  ]);
  assert.equal(new Set(tiers).size, 4);
});

test("9. composition-role vocabulary completeness", () => {
  assert.deepEqual([...roles], [
    "attention-anchor",
    "supporting-evidence",
    "risk-context",
    "opportunity-context",
    "relationship-explanation",
    "path-explanation",
    "comparison-context",
    "preserved-context",
    "background-context",
  ]);
  assert.equal(roles.length, 9);
});

test("10. composition registry deterministic", () => {
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(registry.priorityTierCount, 4);
  assert.equal(registry.compositionRoleCount, 9);
  assert.equal(registry.ruleCount, 7);
});

test("11. rule ordering deterministic", () => {
  assert.deepEqual([...ruleOrder], [
    "upstream-primary",
    "direct-support",
    "explicit-relationship",
    "explicit-path",
    "preserved-context",
    "contextual-relevance",
    "background-fallback",
  ]);
  assert.deepEqual([...ruleIds], [
    "dri7.composition.upstream-primary",
    "dri7.composition.direct-support",
    "dri7.composition.explicit-relationship",
    "dri7.composition.explicit-path",
    "dri7.composition.preserved-context",
    "dri7.composition.contextual-relevance",
    "dri7.composition.background-fallback",
  ]);
});

test("12. upstream primary maps to composition primary", () => {
  const result = compose(
    makeResolution(
      [
        entry("candidate.production-risk", "selected", 0, guidance({
          guidanceId: "guidance.production-risk",
        })),
        entry("candidate.delivery-kpi", "selected", 1, guidance({
          guidanceId: "guidance.delivery-kpi",
          guidanceKind: "surface-evidence",
          intent: "explain",
          importance: "important",
          urgency: "soon",
        })),
      ],
      "candidate.production-risk",
    ),
  );
  assert.equal(result.primary?.candidateId, "candidate.production-risk");
  assert.equal(result.primary?.priorityTier, "primary");
  assert.equal(result.primary?.role, "attention-anchor");
});

test("13. null upstream primary may remain null", () => {
  const result = compose(
    makeResolution(
      [
        entry("candidate.a", "selected", 0, guidance({
          guidanceId: "g-a",
          guidanceKind: "surface-evidence",
          intent: "explain",
          importance: "supporting",
          urgency: "none",
        })),
      ],
      null,
    ),
  );
  assert.equal(result.primary, null);
  assert.equal(result.summary.primaryCount, 0);
});

test("14. maximum one composition primary", () => {
  const result = compose(
    makeResolution(
      [
        entry("a", "selected", 0, guidance({ guidanceId: "ga" })),
        entry("b", "selected", 1, guidance({
          guidanceId: "gb",
          guidanceKind: "direct-attention",
          target: { targetKind: "object", targetId: "warehouse" },
          source: {
            sourceKind: "attention-output",
            sourceId: "attention.warehouse",
          },
        })),
      ],
      "a",
    ),
  );
  assert.equal(result.summary.primaryCount, 1);
  assert.equal(result.primary?.candidateId, "a");
  assert.ok(!result.supporting.some((item) => item.priorityTier === "primary"));
});

test("15. only selected resolution entries become active", () => {
  const result = compose(
    makeResolution(
      [
        entry("selected", "selected", 0, guidance({ guidanceId: "gs" })),
        entry("deferred", "deferred", 1, guidance({ guidanceId: "gd" }), [
          "candidate-deferred",
        ]),
      ],
      "selected",
    ),
  );
  assert.equal(result.summary.activeItemCount, 1);
  assert.deepEqual([...result.deferredCandidateIds], ["deferred"]);
});

test("16. deferred entries not reactivated", () => {
  const result = compose(
    makeResolution(
      [
        entry("d", "deferred", 0, guidance({ guidanceId: "gd" }), [
          "candidate-deferred",
        ]),
      ],
      null,
    ),
  );
  assert.equal(result.primary, null);
  assert.equal(result.supporting.length, 0);
  assert.equal(result.contextual.length, 0);
  assert.equal(result.background.length, 0);
  assert.deepEqual([...result.deferredCandidateIds], ["d"]);
});

test("17. suppressed entries not reactivated", () => {
  const result = compose(
    makeResolution(
      [
        entry("s", "suppressed", 0, guidance({ guidanceId: "gs" }), [
          "duplicate-guidance",
        ]),
      ],
      null,
    ),
  );
  assert.equal(result.summary.activeItemCount, 0);
  assert.deepEqual([...result.suppressedCandidateIds], ["s"]);
});

test("18. rejected entries not reactivated", () => {
  const result = compose(
    makeResolution(
      [
        entry("r", "rejected", 0, null, ["candidate-ineligible"]),
      ],
      null,
    ),
  );
  assert.equal(result.summary.activeItemCount, 0);
  assert.deepEqual([...result.rejectedCandidateIds], ["r"]);
});

test("19. unresolved entries not reactivated", () => {
  const result = compose(
    makeResolution(
      [
        entry("u", "unresolved", 0, guidance({ guidanceId: "gu" }), [
          "unresolved-conflict",
        ]),
      ],
      null,
    ),
  );
  assert.equal(result.summary.activeItemCount, 0);
  assert.deepEqual([...result.unresolvedCandidateIds], ["u"]);
});

test("20. supporting classification deterministic", () => {
  const result = compose(
    makeResolution(
      [
        entry("primary", "selected", 0, guidance({
          guidanceId: "g-primary",
        })),
        entry("kpi", "selected", 1, guidance({
          guidanceId: "g-kpi",
          guidanceKind: "surface-evidence",
          intent: "explain",
          importance: "important",
          urgency: "soon",
        })),
      ],
      "primary",
    ),
  );
  assert.equal(result.supporting.length, 1);
  assert.equal(result.supporting[0]?.candidateId, "kpi");
  assert.equal(result.supporting[0]?.role, "supporting-evidence");
});

test("21. contextual classification deterministic", () => {
  const result = compose(
    makeResolution(
      [
        entry("primary", "selected", 0, guidance({
          guidanceId: "g-primary",
        })),
        entry("scenario", "selected", 1, guidance({
          guidanceId: "g-scenario",
          guidanceKind: "compare",
          intent: "compare",
          importance: "important",
          urgency: "none",
          target: { targetKind: "scenario", targetId: "scenario-a" },
          source: {
            sourceKind: "executive-context",
            sourceId: "ctx.scenario",
          },
        })),
      ],
      "primary",
    ),
  );
  assert.equal(result.contextual.length, 1);
  assert.equal(result.contextual[0]?.role, "comparison-context");
});

test("22. background fallback deterministic", () => {
  const result = compose(
    makeResolution(
      [
        entry("primary", "selected", 0, guidance({
          guidanceId: "g-primary",
        })),
        entry("dim", "selected", 1, guidance({
          guidanceId: "g-dim",
          guidanceKind: "de-emphasize",
          intent: "orient",
          importance: "background",
          urgency: "none",
          target: { targetKind: "object", targetId: "warehouse" },
          source: {
            sourceKind: "executive-context",
            sourceId: "ctx.dim",
          },
        })),
      ],
      "primary",
    ),
  );
  assert.equal(result.background.length, 1);
  assert.equal(result.background[0]?.role, "background-context");
});

test("23. explicit relationship may classify supporting guidance", () => {
  const relationships: DirectorRuntimeExecutiveGuidanceCompositionRelationship[] =
    [
      Object.freeze({
        relationshipId: "rel.kpi-production",
        relationshipKind: "supports",
        sourceTarget: Object.freeze({
          targetKind: "kpi" as const,
          targetId: "delivery",
        }),
        targetTarget: Object.freeze({
          targetKind: "object" as const,
          targetId: "production",
        }),
      }),
    ];
  const result = compose(
    makeResolution(
      [
        entry("primary", "selected", 0, guidance({
          guidanceId: "g-primary",
        })),
        entry("kpi", "selected", 1, guidance({
          guidanceId: "g-kpi",
          guidanceKind: "surface-evidence",
          intent: "explain",
          importance: "important",
          urgency: "soon",
          target: { targetKind: "kpi", targetId: "delivery" },
          source: {
            sourceKind: "attention-candidate",
            sourceId: "kpi",
          },
        })),
      ],
      "primary",
    ),
    relationships,
  );
  assert.equal(result.supporting[0]?.candidateId, "kpi");
  assert.equal(result.relationships.length, 1);
});

test("24. explicit path may classify path explanation", () => {
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
      meaning: "Operational impact path",
    }),
  ];
  const result = compose(
    makeResolution(
      [
        entry("primary", "selected", 0, guidance({
          guidanceId: "g-primary",
        })),
        entry("path", "selected", 1, guidance({
          guidanceId: "g-path",
          guidanceKind: "explain-path",
          intent: "explain",
          importance: "supporting",
          urgency: "none",
          target: { targetKind: "path", targetId: "production-impact-path" },
          source: {
            sourceKind: "path-evidence",
            sourceId: "path.production-impact",
          },
        })),
      ],
      "primary",
    ),
    [],
    paths,
  );
  assert.equal(result.contextual[0]?.role, "path-explanation");
  assert.equal(result.paths[0]?.pathId, "production-impact-path");
});

test("25. path target ordering preserved", () => {
  const paths: DirectorRuntimeExecutiveGuidanceCompositionPath[] = [
    Object.freeze({
      pathId: "p1",
      targets: Object.freeze([
        Object.freeze({ targetKind: "object" as const, targetId: "supplier" }),
        Object.freeze({ targetKind: "object" as const, targetId: "production" }),
        Object.freeze({ targetKind: "kpi" as const, targetId: "delivery-kpi" }),
        Object.freeze({ targetKind: "object" as const, targetId: "customer" }),
      ]),
    }),
  ];
  const result = compose(
    makeResolution(
      [entry("primary", "selected", 0, guidance({ guidanceId: "g" }))],
      "primary",
    ),
    [],
    paths,
  );
  assert.deepEqual(
    result.paths[0]?.targets.map((target) => target.targetId),
    ["supplier", "production", "delivery-kpi", "customer"],
  );
});

test("26. relationship ordering preserved", () => {
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
  const result = compose(
    makeResolution(
      [entry("primary", "selected", 0, guidance({ guidanceId: "g" }))],
      "primary",
    ),
    relationships,
  );
  assert.deepEqual(
    result.relationships.map((item) => item.relationshipId),
    ["rel-a", "rel-b"],
  );
});

test("27. selected-item ordering preserved within tiers", () => {
  const result = compose(
    makeResolution(
      [
        entry("primary", "selected", 0, guidance({ guidanceId: "gp" })),
        entry("kpi-a", "selected", 1, guidance({
          guidanceId: "ga",
          guidanceKind: "surface-evidence",
          intent: "explain",
          importance: "supporting",
          urgency: "none",
          target: { targetKind: "object", targetId: "production" },
          source: { sourceKind: "attention-candidate", sourceId: "a" },
        })),
        entry("kpi-b", "selected", 2, guidance({
          guidanceId: "gb",
          guidanceKind: "surface-evidence",
          intent: "explain",
          importance: "important",
          urgency: "soon",
          target: { targetKind: "object", targetId: "production" },
          source: { sourceKind: "attention-candidate", sourceId: "b" },
        })),
      ],
      "primary",
    ),
  );
  assert.deepEqual(
    result.supporting.map((item) => item.candidateId),
    ["kpi-a", "kpi-b"],
  );
});

test("28. no weighted ranking", () => {
  assert.doesNotMatch(
    source,
    /\b(?:weightedRank|weightedScore|sortByScore|rankByWeight|priorityWeight)\b/,
  );
  assert.equal(boundary.doesNotRankByWeight, true);
});

test("29. no numeric priority score", () => {
  assert.doesNotMatch(
    source,
    /\b(?:priorityScore|tierScore|guidanceRank|semanticScore|compositionScore)\b/,
  );
  assert.doesNotMatch(source, /critical\s*=\s*\d+|important\s*=\s*\d+/);
  assert.equal(boundary.doesNotScoreGuidance, true);
});

test("30. no hidden sorting", () => {
  assert.doesNotMatch(
    source,
    /\.sort\s*\(|sortByImportance|sortByUrgency|localeCompare/,
  );
});

test("31. intent-aware composition deterministic", () => {
  assert.equal(
    resolveDirectorExecutiveGuidanceCompositionRole(
      guidance({
        guidanceId: "g",
        guidanceKind: "surface-context",
        intent: "warn",
      }),
    ),
    "risk-context",
  );
  assert.equal(
    resolveDirectorExecutiveGuidanceCompositionRole(
      guidance({
        guidanceId: "g2",
        guidanceKind: "surface-context",
        intent: "compare",
      }),
    ),
    "comparison-context",
  );
});

test("32. guidance-kind-aware composition deterministic", () => {
  assert.equal(
    resolveDirectorExecutiveGuidanceCompositionRole(
      guidance({ guidanceId: "g1", guidanceKind: "direct-attention" }),
    ),
    "attention-anchor",
  );
  assert.equal(
    resolveDirectorExecutiveGuidanceCompositionRole(
      guidance({ guidanceId: "g2", guidanceKind: "preserve-context" }),
    ),
    "preserved-context",
  );
  assert.equal(
    resolveDirectorExecutiveGuidanceCompositionRole(
      guidance({ guidanceId: "g3", guidanceKind: "de-emphasize" }),
    ),
    "background-context",
  );
});

test("33. preserved context retained where appropriate", () => {
  const result = compose(
    makeResolution(
      [
        entry("primary", "selected", 0, guidance({ guidanceId: "gp" })),
        entry("ctx", "selected", 1, guidance({
          guidanceId: "gc",
          guidanceKind: "preserve-context",
          intent: "orient",
          importance: "supporting",
          urgency: "none",
          target: { targetKind: "context", targetId: "executive-ctx" },
          source: {
            sourceKind: "executive-context",
            sourceId: "ctx.1",
          },
        })),
      ],
      "primary",
    ),
  );
  assert.equal(result.contextual[0]?.role, "preserved-context");
  assert.equal(result.contextual[0]?.candidateId, "ctx");
});

test("34. no active candidate appears in multiple tiers", () => {
  const result = compose(
    makeResolution(
      [
        entry("primary", "selected", 0, guidance({ guidanceId: "gp" })),
        entry("kpi", "selected", 1, guidance({
          guidanceId: "gk",
          guidanceKind: "surface-evidence",
          intent: "explain",
        })),
        entry("path", "selected", 2, guidance({
          guidanceId: "gpath",
          guidanceKind: "explain-path",
          intent: "explain",
          target: { targetKind: "path", targetId: "p1" },
          source: { sourceKind: "path-evidence", sourceId: "p1" },
        })),
      ],
      "primary",
    ),
  );
  const ids = [
    result.primary?.candidateId,
    ...result.supporting.map((item) => item.candidateId),
    ...result.contextual.map((item) => item.candidateId),
    ...result.background.map((item) => item.candidateId),
  ].filter(Boolean);
  assert.equal(new Set(ids).size, ids.length);
});

test("35. candidate identity preserved", () => {
  const result = compose(
    makeResolution(
      [
        entry("candidate.production-risk", "selected", 0, guidance({
          guidanceId: "guidance.production-risk",
        })),
      ],
      "candidate.production-risk",
    ),
  );
  assert.equal(result.primary?.candidateId, "candidate.production-risk");
});

test("36. guidance identity preserved", () => {
  const result = compose(
    makeResolution(
      [
        entry("c1", "selected", 0, guidance({
          guidanceId: "guidance.production-risk",
        })),
      ],
      "c1",
    ),
  );
  assert.equal(result.primary?.guidanceId, "guidance.production-risk");
  assert.equal(
    result.primary?.guidance.guidanceId,
    "guidance.production-risk",
  );
});

test("37. provenance preserved", () => {
  const provenance: DirectorRuntimeExecutiveGuidanceProvenance = Object.freeze({
    sourceReferences: Object.freeze([
      Object.freeze({
        sourceKind: "attention-output" as const,
        sourceId: "attention.production-risk",
      }),
    ]),
    derivedFromGuidanceIds: Object.freeze(["guidance.parent"]),
    rationale: "trace",
  });
  const customEntry = Object.freeze({
    candidateId: "c1",
    status: "selected" as const,
    reasons: Object.freeze(["eligible" as const]),
    guidance: guidance({ guidanceId: "g1" }),
    provenance,
    ordinal: 0,
  });
  const result = compose(makeResolution([customEntry], "c1"));
  assert.equal(
    result.primary?.provenance.sourceReferences[0]?.sourceId,
    "attention.production-risk",
  );
  assert.deepEqual(
    [...result.primary!.provenance.derivedFromGuidanceIds],
    ["guidance.parent"],
  );
});

test("38. resolution reasons preserved", () => {
  const result = compose(
    makeResolution(
      [
        entry("c1", "selected", 0, guidance({ guidanceId: "g1" }), [
          "eligible",
        ]),
      ],
      "c1",
    ),
  );
  assert.deepEqual([...result.primary!.resolutionReasons], ["eligible"]);
});

test("39. traceability complete", () => {
  const resolution = makeResolution(
    [
      entry("a", "selected", 0, guidance({ guidanceId: "ga" })),
      entry("b", "deferred", 1, guidance({ guidanceId: "gb" }), [
        "candidate-deferred",
      ]),
      entry("c", "suppressed", 2, guidance({ guidanceId: "gc" }), [
        "duplicate-guidance",
      ]),
    ],
    "a",
  );
  const result = compose(resolution);
  assert.equal(result.traces.length, 3);
  assert.deepEqual(
    result.traces.map((trace) => trace.candidateId),
    ["a", "b", "c"],
  );
  assert.equal(result.traces[0]?.compositionTier, "primary");
  assert.equal(result.traces[1]?.compositionTier, null);
  assert.equal(result.traces[2]?.compositionTier, null);
});

test("40. summary active-item count correct", () => {
  const result = compose(
    makeResolution(
      [
        entry("p", "selected", 0, guidance({ guidanceId: "gp" })),
        entry("s", "selected", 1, guidance({
          guidanceId: "gs",
          guidanceKind: "surface-evidence",
          intent: "explain",
        })),
        entry("d", "deferred", 2, null, ["candidate-deferred"]),
      ],
      "p",
    ),
  );
  assert.equal(result.summary.activeItemCount, 2);
});

test("41. summary tier counts correct", () => {
  const result = compose(
    makeResolution(
      [
        entry("p", "selected", 0, guidance({ guidanceId: "gp" })),
        entry("s", "selected", 1, guidance({
          guidanceId: "gs",
          guidanceKind: "surface-evidence",
          intent: "explain",
        })),
        entry("c", "selected", 2, guidance({
          guidanceId: "gc",
          guidanceKind: "preserve-context",
          intent: "orient",
          target: { targetKind: "context", targetId: "ctx" },
          source: { sourceKind: "executive-context", sourceId: "ctx" },
        })),
        entry("b", "selected", 3, guidance({
          guidanceId: "gb",
          guidanceKind: "de-emphasize",
          intent: "orient",
          target: { targetKind: "object", targetId: "other" },
          source: { sourceKind: "executive-context", sourceId: "other" },
        })),
      ],
      "p",
    ),
  );
  assert.equal(result.summary.primaryCount, 1);
  assert.equal(result.summary.supportingCount, 1);
  assert.equal(result.summary.contextualCount, 1);
  assert.equal(result.summary.backgroundCount, 1);
});

test("42. summary inactive-reference counts reconcile with resolution", () => {
  const resolution = makeResolution(
    [
      entry("p", "selected", 0, guidance({ guidanceId: "gp" })),
      entry("d", "deferred", 1, null, ["candidate-deferred"]),
      entry("s", "suppressed", 2, null, ["duplicate-guidance"]),
      entry("r", "rejected", 3, null, ["candidate-ineligible"]),
      entry("u", "unresolved", 4, null, ["unresolved-conflict"]),
    ],
    "p",
  );
  const result = compose(resolution);
  assert.equal(
    result.summary.deferredReferenceCount,
    resolution.summary.deferredCount,
  );
  assert.equal(
    result.summary.suppressedReferenceCount,
    resolution.summary.suppressedCount,
  );
  assert.equal(
    result.summary.rejectedReferenceCount,
    resolution.summary.rejectedCount,
  );
  assert.equal(
    result.summary.unresolvedReferenceCount,
    resolution.summary.unresolvedCount,
  );
});

test("43. no candidate silently disappears from audit trace", () => {
  const resolution = makeResolution(
    [
      entry("a", "selected", 0, guidance({ guidanceId: "ga" })),
      entry("b", "deferred", 1, null, ["candidate-deferred"]),
      entry("c", "rejected", 2, null, ["candidate-ineligible"]),
    ],
    "a",
  );
  const result = compose(resolution);
  assert.equal(result.traces.length, resolution.entries.length);
  assert.deepEqual(
    result.traces.map((trace) => trace.candidateId).sort(),
    resolution.entries.map((item) => item.candidateId).sort(),
  );
});

test("44. composition input not mutated", () => {
  const relationships: DirectorRuntimeExecutiveGuidanceCompositionRelationship[] =
    [
      {
        relationshipId: "rel-1",
        relationshipKind: "supports",
        sourceTarget: { targetKind: "kpi", targetId: "k" },
        targetTarget: { targetKind: "object", targetId: "production" },
      },
    ];
  const paths: DirectorRuntimeExecutiveGuidanceCompositionPath[] = [
    {
      pathId: "p1",
      targets: [
        { targetKind: "object", targetId: "supplier" },
        { targetKind: "object", targetId: "production" },
      ],
    },
  ];
  const input: DirectorRuntimeExecutiveGuidanceCompositionInput = {
    compositionId: "composition.x",
    resolution: makeResolution(
      [entry("p", "selected", 0, guidance({ guidanceId: "gp" }))],
      "p",
    ),
    relationships,
    paths,
  };
  const snap = JSON.stringify(input);
  composeDirectorExecutiveGuidance(input);
  assert.equal(JSON.stringify(input), snap);
});

test("45. resolution not mutated", () => {
  const resolution = makeResolution(
    [entry("p", "selected", 0, guidance({ guidanceId: "gp" }))],
    "p",
  );
  const snap = JSON.stringify(resolution);
  compose(resolution);
  assert.equal(JSON.stringify(resolution), snap);
});

test("46. paths not mutated", () => {
  const paths: DirectorRuntimeExecutiveGuidanceCompositionPath[] = [
    {
      pathId: "p1",
      targets: [
        { targetKind: "object", targetId: "supplier" },
        { targetKind: "object", targetId: "production" },
      ],
    },
  ];
  const snap = JSON.stringify(paths);
  compose(
    makeResolution(
      [entry("p", "selected", 0, guidance({ guidanceId: "gp" }))],
      "p",
    ),
    [],
    paths,
  );
  assert.equal(JSON.stringify(paths), snap);
});

test("47. relationships not mutated", () => {
  const relationships: DirectorRuntimeExecutiveGuidanceCompositionRelationship[] =
    [
      {
        relationshipId: "rel-1",
        relationshipKind: "supports",
        sourceTarget: { targetKind: "kpi", targetId: "k" },
        targetTarget: { targetKind: "object", targetId: "production" },
      },
    ];
  const snap = JSON.stringify(relationships);
  compose(
    makeResolution(
      [entry("p", "selected", 0, guidance({ guidanceId: "gp" }))],
      "p",
    ),
    relationships,
  );
  assert.equal(JSON.stringify(relationships), snap);
});

test("48. composition result immutable", () => {
  const result = compose(
    makeResolution(
      [entry("p", "selected", 0, guidance({ guidanceId: "gp" }))],
      "p",
    ),
  );
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.supporting), true);
  assert.equal(Object.isFrozen(result.summary), true);
  assert.equal(Object.isFrozen(result.traces), true);
  assert.throws(() => {
    (result as { compositionId?: string }).compositionId = "x";
  });
});

test("49. registry immutable", () => {
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(tiers), true);
  assert.equal(Object.isFrozen(roles), true);
  assert.equal(Object.isFrozen(ruleOrder), true);
  assert.throws(() => {
    (registry as { version?: string }).version = "0";
  });
});

test("50. determinism across repeated identical inputs", () => {
  const resolution = makeResolution(
    [
      entry("candidate.production-risk", "selected", 0, guidance({
        guidanceId: "guidance.production-risk",
      })),
      entry("candidate.delivery-kpi", "selected", 1, guidance({
        guidanceId: "guidance.delivery-kpi",
        guidanceKind: "surface-evidence",
        intent: "explain",
        importance: "important",
        urgency: "soon",
      })),
      entry("candidate.production-path", "selected", 2, guidance({
        guidanceId: "guidance.production-path",
        guidanceKind: "explain-path",
        intent: "explain",
        importance: "supporting",
        urgency: "none",
        target: { targetKind: "path", targetId: "production-impact-path" },
        source: {
          sourceKind: "path-evidence",
          sourceId: "path.production-impact",
        },
      })),
      entry("candidate.scenario-comparison", "suppressed", 3, guidance({
        guidanceId: "guidance.scenario-comparison",
        guidanceKind: "compare",
        intent: "compare",
      }), ["comparison-not-allowed"]),
      entry("candidate.budget-warning", "deferred", 4, guidance({
        guidanceId: "guidance.budget-warning",
        guidanceKind: "surface-risk",
        target: { targetKind: "kpi", targetId: "budget" },
        source: { sourceKind: "attention-candidate", sourceId: "budget" },
      }), ["candidate-deferred"]),
    ],
    "candidate.production-risk",
  );
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
  const first = compose(resolution, [], paths);
  const second = compose(resolution, [], paths);
  assert.deepEqual(first, second);
  assert.equal(first.primary?.candidateId, "candidate.production-risk");
  assert.equal(first.supporting[0]?.candidateId, "candidate.delivery-kpi");
  assert.equal(first.contextual[0]?.candidateId, "candidate.production-path");
  assert.deepEqual([...first.suppressedCandidateIds], [
    "candidate.scenario-comparison",
  ]);
  assert.deepEqual([...first.deferredCandidateIds], [
    "candidate.budget-warning",
  ]);
});

test("51. no delivery behavior", () => {
  assert.doesNotMatch(
    source,
    /\b(?:dispatch\(|publish\(|emit\(|subscribe\(|notify\(|sendGuidance\()\b/,
  );
  assert.doesNotMatch(source, /\b(?:eventBus|messageBus|EventEmitter)\b/);
  assert.equal(composition.deliveryIndependent, true);
  assert.equal(boundary.doesNotDeliverGuidance, true);
  assert.ok(
    invariants.some((entry) => entry.id === "composition-not-delivery"),
  );
});

test("52. no event bus", () => {
  assert.doesNotMatch(
    source,
    /\b(?:EventEmitter|event-bus|message-bus|addEventListener|on\(|once\()\b/,
  );
});

test("53. no Three.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i);
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Vector3)\b/);
});

test("54. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next)(?:\/[^"']*)?["']/i);
  assert.doesNotMatch(source, /\b(?:React|ReactDOM|JSX|useState|useEffect)\b/);
});

test("55. no DOM/browser dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage|fetch|XMLHttpRequest)\b/,
  );
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
});

test("56. no renderer-specific fields", () => {
  assert.doesNotMatch(
    source,
    /\b(?:color|opacity|position|scale|rotation|camera|zoom|glow|pulse|animation|duration|easing|mesh|material|geometry)\s*[?:]/,
  );
});

test("57. no Advisor/LLM dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:LLM|prompt|systemPrompt|assistantMessage|tokenCount|modelName|chatHistory)\b/,
  );
  assert.equal(composition.advisorIndependent, true);
});

test("58. no action execution", () => {
  assert.doesNotMatch(
    source,
    /\b(?:approveDecision|rejectDecision|startExecution|pauseExecution|navigateWorkspace|openPanel)\b/,
  );
  assert.equal(composition.actionIndependent, true);
});

test("59. composition verification passes", () => {
  const first = verifyDirectorRuntimeExecutiveGuidanceComposition();
  const second = verifyDirectorRuntimeExecutiveGuidanceComposition();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(first.priorityTierCount, 4);
  assert.equal(first.compositionRoleCount, 9);
  assert.equal(first.ruleCount, 7);
  assert.equal(first.publicTypeCount, 15);
  assert.equal(first.publicApiCount, 9);
  assert.equal(first.frozen, true);
  assert.equal(first.composerDeterministic, true);
  assert.equal(first.noNumericScoring, true);
  assert.equal(apiNames.length, registry.publicApiCount);
  assert.equal(publicTypeNames.length, registry.publicTypeCount);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(
    composition.architecturalStatus,
    "Composition Complete · Prioritized · Deterministic · Traceable · Immutable · Renderer-Independent · ReadyForDelivery",
  );
});

test("60. DRI-7:3 regression passes", () => {
  const resolution = verifyDirectorRuntimeExecutiveGuidanceResolution();
  assert.equal(resolution.ok, true);
});

test("61. DRI-7:2 regression passes", () => {
  const contracts = verifyDirectorRuntimeExecutiveGuidanceContracts();
  assert.equal(contracts.ok, true);
});

test("62. DRI-7:1 regression passes", () => {
  const foundation = verifyDirectorRuntimeExecutiveGuidanceFoundation();
  assert.equal(foundation.ok, true);
});

test("63. DRI-6 regression remains clean", () => {
  const publicIndex = verifyDirectorRuntimeAttentionFocusPublicIndex();
  assert.equal(publicIndex.ok, true);
});
