import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_PACKAGE as emptyPackage,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_BOUNDARY as boundary,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FOUNDATION_INVARIANTS as invariants,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES as importanceValues,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES as intentValues,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS as guidanceKinds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRINCIPLE as principle,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES as publicTypeNames,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS as sourceKinds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS as targetKinds,
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES as urgencyValues,
  createDirectorRuntimeExecutiveGuidanceItem,
  createDirectorRuntimeExecutiveGuidancePackage,
  createDirectorRuntimeExecutiveGuidancePath,
  createDirectorRuntimeExecutiveGuidanceRelationship,
  createDirectorRuntimeExecutiveGuidanceSource,
  createDirectorRuntimeExecutiveGuidanceTarget,
  directorRuntimeExecutiveGuidanceFoundation as foundation,
  directorRuntimeExecutiveGuidanceFoundationApiNames as apiNames,
  directorRuntimeExecutiveGuidanceFoundationCanonicalIdentity as canonicalIdentity,
  directorRuntimeExecutiveGuidanceFoundationRegistry as registry,
  verifyDirectorRuntimeExecutiveGuidanceFoundation,
} from "./directorRuntimeExecutiveGuidanceFoundation.ts";

import {
  directorRuntimeAttentionFocusPublicIndexIdentity,
  verifyDirectorRuntimeAttentionFocusPublicIndex,
} from "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex";
import { verifyDirectorRuntimeAttentionFocusFoundation } from
  "@/app/lib/dri/directorRuntimeAttentionFocusFoundation";

const source = readFileSync(
  new URL("./directorRuntimeExecutiveGuidanceFoundation.ts", import.meta.url),
  "utf8",
);

test("1. exact DRI-7:1 identity", () => {
  assert.equal(
    foundation.identity,
    "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation",
  );
  assert.equal(canonicalIdentity.identity, foundation.identity);
  assert.equal(foundation.phase, "DRI-7:1");
  assert.equal(foundation.name, "DirectorRuntimeExecutiveGuidanceFoundation");
  assert.equal(foundation.role, "Foundation");
  assert.equal(foundation.status, "FoundationReady");
});

test("2. exact version 7.1.0", () => {
  assert.equal(foundation.version, "7.1.0");
  assert.equal(canonicalIdentity.version, "7.1.0");
  assert.equal(registry.version, "7.1.0");
});

test("3. exact namespace", () => {
  assert.equal(
    foundation.namespace,
    "nexora.dri.executive-guidance.foundation",
  );
  assert.equal(canonicalIdentity.namespace, foundation.namespace);
  assert.equal(registry.namespace, foundation.namespace);
});

test("4. DRI-6:9 Public Index is the sole immediate upstream dependency", () => {
  assert.equal(
    foundation.upstreamDependency,
    "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex",
  );
  assert.equal(
    foundation.upstreamDependency,
    directorRuntimeAttentionFocusPublicIndexIdentity,
  );
  assert.equal(registry.dependency, foundation.upstreamDependency);
  assert.equal(canonicalIdentity.upstream, foundation.upstreamDependency);
  assert.equal(foundation.attentionFocusBoundary, "DRI-6:9-public-index-only");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex",
  ]);
  assert.doesNotMatch(
    source,
    /directorRuntimeAttentionFocus(?:Foundation|Platform|CertificationFreeze|Signal|Priority|Path|Transition|FocusContext)/,
  );
});

test("5. guidance-kind vocabulary is complete and unique", () => {
  assert.deepEqual([...guidanceKinds], [
    "direct-attention",
    "maintain-focus",
    "surface-context",
    "surface-evidence",
    "surface-risk",
    "surface-opportunity",
    "explain-relationship",
    "explain-path",
    "compare",
    "de-emphasize",
    "preserve-context",
    "request-awareness",
  ]);
  assert.equal(guidanceKinds.length, 12);
  assert.equal(new Set(guidanceKinds).size, 12);
  assert.equal(Object.isFrozen(guidanceKinds), true);
});

test("6. target-kind vocabulary is complete and unique", () => {
  assert.deepEqual([...targetKinds], [
    "goal",
    "object",
    "kpi",
    "koi",
    "problem",
    "scenario",
    "decision",
    "execution",
    "pack",
    "relationship",
    "path",
    "context",
  ]);
  assert.equal(targetKinds.length, 12);
  assert.equal(new Set(targetKinds).size, 12);
  assert.equal(Object.isFrozen(targetKinds), true);
});

test("7. importance vocabulary is complete and unique", () => {
  assert.deepEqual([...importanceValues], [
    "background",
    "supporting",
    "important",
    "critical",
  ]);
  assert.equal(importanceValues.length, 4);
  assert.equal(new Set(importanceValues).size, 4);
});

test("8. urgency vocabulary is complete and unique", () => {
  assert.deepEqual([...urgencyValues], [
    "none",
    "monitor",
    "soon",
    "immediate",
  ]);
  assert.equal(urgencyValues.length, 4);
  assert.equal(new Set(urgencyValues).size, 4);
});

test("9. intent vocabulary is complete and unique", () => {
  assert.deepEqual([...intentValues], [
    "inform",
    "orient",
    "warn",
    "explain",
    "compare",
    "prepare-decision",
    "support-decision",
    "support-execution",
  ]);
  assert.equal(intentValues.length, 8);
  assert.equal(new Set(intentValues).size, 8);
});

test("10. source vocabulary is deterministic", () => {
  assert.deepEqual([...sourceKinds], [
    "attention-output",
    "focus-subject",
    "attention-candidate",
    "executive-context",
    "runtime-state",
    "relationship-evidence",
    "path-evidence",
  ]);
  assert.equal(sourceKinds.length, 7);
  assert.equal(new Set(sourceKinds).size, 7);
  assert.equal(Object.isFrozen(sourceKinds), true);
  assert.deepEqual([...registry.sourceKinds], [...sourceKinds]);
});

test("11. guidance targets are immutable", () => {
  const target = createDirectorRuntimeExecutiveGuidanceTarget({
    targetKind: "object",
    targetId: "production",
    label: "Production",
  });
  assert.equal(Object.isFrozen(target), true);
  assert.throws(() => {
    (target as { targetId?: string }).targetId = "mutated";
  });
});

test("12. guidance sources are immutable", () => {
  const guidanceSource = createDirectorRuntimeExecutiveGuidanceSource({
    sourceKind: "attention-output",
    sourceId: "attention.production-risk",
  });
  assert.equal(Object.isFrozen(guidanceSource), true);
  assert.throws(() => {
    (guidanceSource as { sourceId?: string }).sourceId = "mutated";
  });
});

test("13. guidance items are immutable", () => {
  const item = createDirectorRuntimeExecutiveGuidanceItem({
    guidanceId: "guidance.production",
    guidanceKind: "direct-attention",
    target: { targetKind: "object", targetId: "production" },
    importance: "critical",
    urgency: "immediate",
    intent: "warn",
    source: {
      sourceKind: "attention-output",
      sourceId: "attention.production-risk",
    },
    rationale: "Production currently dominates executive attention.",
  });
  assert.equal(Object.isFrozen(item), true);
  assert.equal(Object.isFrozen(item.target), true);
  assert.equal(Object.isFrozen(item.source), true);
  assert.throws(() => {
    (item as { importance?: string }).importance = "background";
  });
});

test("14. guidance paths preserve ordered target sequence", () => {
  const path = createDirectorRuntimeExecutiveGuidancePath({
    pathId: "production-impact-path",
    targets: [
      { targetKind: "object", targetId: "supplier" },
      { targetKind: "object", targetId: "production" },
      { targetKind: "kpi", targetId: "delivery-performance" },
      { targetKind: "object", targetId: "customer" },
    ],
    meaning: "Operational impact path",
  });
  assert.deepEqual(
    path.targets.map((entry) => entry.targetId),
    ["supplier", "production", "delivery-performance", "customer"],
  );
  assert.equal(Object.isFrozen(path), true);
  assert.equal(Object.isFrozen(path.targets), true);
  assert.throws(() => {
    (path.targets as DirectorRuntimeExecutiveGuidanceTargetMutable[]).push({
      targetKind: "object",
      targetId: "extra",
    });
  });
});

type DirectorRuntimeExecutiveGuidanceTargetMutable = {
  targetKind: string;
  targetId: string;
};

test("15. guidance packages preserve deterministic ordering", () => {
  const supporting = createDirectorRuntimeExecutiveGuidanceItem({
    guidanceId: "guidance.kpi",
    guidanceKind: "surface-evidence",
    target: { targetKind: "kpi", targetId: "delivery-performance" },
    importance: "important",
    urgency: "soon",
    intent: "explain",
    source: {
      sourceKind: "attention-candidate",
      sourceId: "candidate.delivery-kpi",
    },
  });
  const primary = createDirectorRuntimeExecutiveGuidanceItem({
    guidanceId: "guidance.production",
    guidanceKind: "direct-attention",
    target: { targetKind: "object", targetId: "production" },
    importance: "critical",
    urgency: "immediate",
    intent: "warn",
    source: {
      sourceKind: "attention-output",
      sourceId: "attention.production-risk",
    },
  });
  const path = createDirectorRuntimeExecutiveGuidancePath({
    pathId: "path-a",
    targets: [
      { targetKind: "object", targetId: "supplier" },
      { targetKind: "object", targetId: "production" },
    ],
  });
  const pkg = createDirectorRuntimeExecutiveGuidancePackage({
    packageId: "guidance.production-risk",
    primaryGuidance: primary,
    guidanceItems: [primary, supporting],
    paths: [path],
  });
  assert.equal(pkg.packageId, "guidance.production-risk");
  assert.equal(pkg.primaryGuidance?.guidanceId, "guidance.production");
  assert.deepEqual(
    pkg.guidanceItems.map((entry) => entry.guidanceId),
    ["guidance.production", "guidance.kpi"],
  );
  assert.deepEqual(
    pkg.paths.map((entry) => entry.pathId),
    ["path-a"],
  );
  assert.equal(Object.isFrozen(pkg), true);
  assert.equal(Object.isFrozen(pkg.guidanceItems), true);
  assert.equal(Object.isFrozen(pkg.paths), true);
  assert.equal(Object.isFrozen(emptyPackage), true);
});

test("16. constructors do not mutate caller input", () => {
  const mutableTarget = {
    targetKind: "object" as const,
    targetId: "production",
    label: "Production",
  };
  const targetSnap = JSON.stringify(mutableTarget);
  createDirectorRuntimeExecutiveGuidanceTarget(mutableTarget);
  assert.equal(JSON.stringify(mutableTarget), targetSnap);

  const mutableItem = {
    guidanceId: "g1",
    guidanceKind: "surface-context" as const,
    target: mutableTarget,
    importance: "supporting" as const,
    urgency: "monitor" as const,
    intent: "orient" as const,
    source: {
      sourceKind: "executive-context" as const,
      sourceId: "ctx-1",
    },
  };
  const itemSnap = JSON.stringify(mutableItem);
  createDirectorRuntimeExecutiveGuidanceItem(mutableItem);
  assert.equal(JSON.stringify(mutableItem), itemSnap);

  const mutablePath = {
    pathId: "p1",
    targets: [
      { targetKind: "object" as const, targetId: "a" },
      { targetKind: "object" as const, targetId: "b" },
    ] as Array<{ targetKind: "object" | "kpi"; targetId: string }>,
  };
  const pathSnap = JSON.stringify(mutablePath);
  createDirectorRuntimeExecutiveGuidancePath(mutablePath);
  assert.equal(JSON.stringify(mutablePath), pathSnap);
  mutablePath.targets.push({ targetKind: "kpi", targetId: "c" });
  assert.equal(mutablePath.targets.length, 3);
});

test("17. importance and urgency remain independent", () => {
  const strategic = createDirectorRuntimeExecutiveGuidanceItem({
    guidanceId: "opportunity",
    guidanceKind: "surface-opportunity",
    target: { targetKind: "decision", targetId: "expand-capacity" },
    importance: "important",
    urgency: "none",
    intent: "prepare-decision",
    source: {
      sourceKind: "executive-context",
      sourceId: "ctx.opportunity",
    },
  });
  const disruption = createDirectorRuntimeExecutiveGuidanceItem({
    guidanceId: "disruption",
    guidanceKind: "surface-risk",
    target: { targetKind: "problem", targetId: "line-halt" },
    importance: "critical",
    urgency: "immediate",
    intent: "warn",
    source: {
      sourceKind: "attention-output",
      sourceId: "attention.line-halt",
    },
  });
  assert.equal(strategic.importance, "important");
  assert.equal(strategic.urgency, "none");
  assert.equal(disruption.importance, "critical");
  assert.equal(disruption.urgency, "immediate");
  assert.ok(!importanceValues.includes("immediate" as never));
  assert.ok(!urgencyValues.includes("critical" as never));
  assert.notDeepEqual([...importanceValues], [...urgencyValues]);
});

test("18. guidance items retain source traceability", () => {
  const item = createDirectorRuntimeExecutiveGuidanceItem({
    guidanceId: "guidance.trace",
    guidanceKind: "maintain-focus",
    target: { targetKind: "decision", targetId: "decision-1" },
    importance: "important",
    urgency: "monitor",
    intent: "support-decision",
    source: {
      sourceKind: "focus-subject",
      sourceId: "focus.decision-1",
    },
  });
  assert.equal(item.source.sourceKind, "focus-subject");
  assert.equal(item.source.sourceId, "focus.decision-1");
  assert.equal(Object.isFrozen(item.source), true);
});

test("19. path semantics contain no rendering geometry", () => {
  const path = createDirectorRuntimeExecutiveGuidancePath({
    pathId: "semantic-path",
    targets: [
      { targetKind: "object", targetId: "supplier" },
      { targetKind: "object", targetId: "warehouse" },
      { targetKind: "object", targetId: "production" },
    ],
    meaning: "Dependency path",
    relationshipIds: ["rel-supplier-warehouse", "rel-warehouse-production"],
  });
  assert.equal("coordinates" in path, false);
  assert.equal("geometry" in path, false);
  assert.equal("points" in path, false);
  assert.equal("vectors" in path, false);
  assert.equal("arrow" in path, false);
  assert.equal("position" in path, false);
  assert.doesNotMatch(
    JSON.stringify(path),
    /(?:coordinates|geometry|vector3|svg|screenX|screenY|arrow)/i,
  );
  const relationship = createDirectorRuntimeExecutiveGuidanceRelationship({
    relationshipId: "rel-1",
    source: { targetKind: "object", targetId: "supplier" },
    target: { targetKind: "object", targetId: "warehouse" },
    meaning: "supplies",
  });
  assert.equal("line" in relationship, false);
  assert.equal(Object.isFrozen(relationship), true);
});

test("20. no Three.js dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:three|@react-three(?:\/[^"']*)?)["']/i);
  assert.doesNotMatch(source, /\b(?:THREE|WebGL|Object3D|Mesh|Material|Vector3)\b/);
});

test("21. no React dependency", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next)["']/i);
  assert.doesNotMatch(source, /\b(?:React|ReactDOM|JSX|useState|useEffect)\b/);
});

test("22. no DOM/browser dependency", () => {
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage|fetch|XMLHttpRequest|navigator)\b/,
  );
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path|http)["']/);
});

test("23. no renderer-specific fields", () => {
  assert.doesNotMatch(
    source,
    /\b(?:color|opacity|glow|pulse|blink|zoom|cameraZoom|animation|duration|easing|position|scale|rotation|cssClass|material|geometry|highlight)\s*[?:]/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:open-panel|draw-arrow|fade|move|rotate)\b/,
  );
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
  assert.equal(principle.includes("Attention describes what currently matters"), true);
  assert.equal(boundary.doesNotRecalculateAttention, true);
});

test("24. no DRI-6 internal imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntimeAttentionFocus(?:Foundation|Platform|CertificationFreeze|SignalContracts|PriorityResolution|FocusContextBinding|PathOrchestration|TransitionOrchestration)["']/,
  );
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.equal(imports.length, 1);
  assert.equal(
    imports[0],
    "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex",
  );
});

test("25. foundation verification passes", () => {
  const first = verifyDirectorRuntimeExecutiveGuidanceFoundation();
  const second = verifyDirectorRuntimeExecutiveGuidanceFoundation();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.guidanceKindCount, 12);
  assert.equal(first.targetKindCount, 12);
  assert.equal(first.importanceCount, 4);
  assert.equal(first.urgencyCount, 4);
  assert.equal(first.intentCount, 8);
  assert.equal(first.sourceKindCount, 7);
  assert.equal(first.vocabularySectionCount, 6);
  assert.equal(first.vocabularyValueCount, 47);
  assert.equal(first.publicTypeCount, 14);
  assert.equal(first.publicApiCount, 13);
  assert.equal(first.invariantCount, 12);
  assert.equal(first.frozen, true);
  assert.equal(first.importanceUrgencyIndependent, true);
  assert.equal(first.dri6BoundaryIntact, true);
  assert.equal(first.rendererIndependent, true);
  assert.equal(apiNames.length, registry.publicApiCount);
  assert.equal(publicTypeNames.length, registry.publicTypeCount);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(
    foundation.architecturalStatus,
    "Foundation Complete · Deterministic · Immutable · Renderer-Independent · ReadyForContracts",
  );
});

test("26. DRI-6 upstream behavior remains unchanged", () => {
  const publicIndex = verifyDirectorRuntimeAttentionFocusPublicIndex();
  assert.equal(publicIndex.ok, true);
  assert.equal(
    publicIndex.identity,
    "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex",
  );
  assert.equal(publicIndex.version, "6.9.0");
  assert.equal(
    directorRuntimeAttentionFocusPublicIndexIdentity,
    "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex",
  );
  const dri6Foundation = verifyDirectorRuntimeAttentionFocusFoundation();
  assert.equal(dri6Foundation.ok, true);
  assert.equal(
    dri6Foundation.identity,
    "DRI-6:1/DirectorRuntimeAttentionFocusFoundation",
  );
  assert.doesNotMatch(
    source,
    /verifyDirectorRuntimeAttentionFocus(?:Foundation|Platform|PublicIndex)/,
  );
});
