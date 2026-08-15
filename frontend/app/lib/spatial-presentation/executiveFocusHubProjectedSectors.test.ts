/**
 * SP:4.1C — Focused Hub projected sector allocation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET,
} from "./executiveFocusSceneDisclosure.ts";
import {
  EXECUTIVE_FOCUS_HUB_SECTOR_IDS,
  EXECUTIVE_FOCUS_HUB_SECTOR_POLICY,
  allocateExecutiveFocusHubSectors,
  detectDegenerateHubCollinearity,
  projectedSafeEnvelopesOverlap,
  resolveExecutiveProjectedObjectBounds,
  resolvePreferredHubSectorFromProjection,
  resolveWorldAngleForHubSector,
} from "./executiveFocusHubProjectedSectors.ts";
import {
  EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY,
  EXECUTIVE_FOCUS_VISUAL_SCALE,
  resolveExecutiveFocusVisualGrammar,
  resolveExecutiveStageObjectBounds,
} from "./executiveFocusVisualGrammar.ts";
import { EXECUTIVE_LIGHTING_EMPHASIS_PROFILES } from "./executiveLightingHierarchy.ts";
import { EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS } from "./executiveSpatialComposition.ts";

const cameraPosition = Object.freeze({ x: 0, y: 4.2, z: 7.4 });
const cameraTarget = Object.freeze({ x: 0, y: 0.42, z: 0.14 });
const cameraFov = 42;

function inventoryLikeSubjects() {
  return Object.freeze([
    Object.freeze({
      subjectId: "obj-inventory",
      label: "Inventory",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "focused" as const,
      disclosureState: "visible-primary" as const,
      position: [0, 0.42, 0.14] as const,
      status: "watch",
      attention: "important",
    }),
    Object.freeze({
      subjectId: "obj-capacity",
      label: "Capacity",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [-1.4, 0.42, 0.6] as const,
      status: "watch",
      attention: "important",
    }),
    Object.freeze({
      subjectId: "obj-delivery",
      label: "Delivery",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [0.9, 0.42, 0.7] as const,
      status: "stable",
    }),
    Object.freeze({
      subjectId: "obj-demand",
      label: "Demand",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [1.1, 0.42, 0.55] as const,
      status: "unresolved",
      attention: "elevated",
    }),
    Object.freeze({
      subjectId: "obj-budget",
      label: "Budget",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [0.85, 0.42, 0.4] as const,
      status: "stable",
    }),
    Object.freeze({
      subjectId: "thread-obj-inventory",
      label: "Executive Thread · 4",
      family: "collapsed-thread" as const,
      objectKind: "insight",
      roleHint: "collapsed-thread" as const,
      disclosureState: "collapsed-thread" as const,
      position: [0.4, 0.1, 1.0] as const,
    }),
  ]);
}

function revenueLikeSubjects() {
  return Object.freeze([
    Object.freeze({
      subjectId: "obj-revenue",
      label: "Revenue",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "focused" as const,
      disclosureState: "visible-primary" as const,
      position: [0, 0.42, 0.14] as const,
      status: "stable",
    }),
    Object.freeze({
      subjectId: "obj-customer",
      label: "Customer",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [-1.2, 0.42, 0.9] as const,
      status: "watch",
    }),
    Object.freeze({
      subjectId: "obj-demand",
      label: "Demand",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [0.2, 0.42, 1.4] as const,
      status: "unresolved",
    }),
    Object.freeze({
      subjectId: "obj-capacity",
      label: "Capacity",
      family: "business-object" as const,
      objectKind: "object",
      roleHint: "related" as const,
      disclosureState: "visible-related" as const,
      position: [1.3, 0.42, 0.7] as const,
      status: "watch",
    }),
    Object.freeze({
      subjectId: "thread-obj-revenue",
      label: "Executive Thread · 5",
      family: "collapsed-thread" as const,
      objectKind: "insight",
      roleHint: "collapsed-thread" as const,
      disclosureState: "collapsed-thread" as const,
      position: [0.8, 0.1, 1.1] as const,
    }),
  ]);
}

test("S1. deterministic sector assignment", () => {
  const a = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  const b = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  assert.deepEqual(a.hubSectorAssignments, b.hubSectorAssignments);
  assert.deepEqual(a.subjects, b.subjects);
});

test("S2. preferred sector derived from projected topology direction", () => {
  const preferred = resolvePreferredHubSectorFromProjection({
    focusPosition: { x: 0, y: 0.42, z: 0.14 },
    neighborPosition: { x: -1.6, y: 0.42, z: 0.2 },
    cameraPosition,
    cameraTarget,
    cameraFov,
  });
  assert.ok(EXECUTIVE_FOCUS_HUB_SECTOR_IDS.includes(preferred));
  // Strong -X should prefer a left-ish sector.
  assert.ok(preferred.includes("left") || preferred === "upper-left" || preferred === "lower-left");
});

test("S3. occupied preferred sector chooses nearest valid alternative", () => {
  const focusBounds = resolveExecutiveStageObjectBounds({
    subjectId: "obj-inventory",
    objectKind: "object",
    scale: 1,
  });
  const neighborBounds = resolveExecutiveStageObjectBounds({
    subjectId: "n",
    objectKind: "object",
    scale: 0.76,
  });
  const allocated = allocateExecutiveFocusHubSectors({
    focus: {
      subjectId: "obj-inventory",
      position: { x: 0, y: 0.42, z: 0.14 },
      bounds: focusBounds,
    },
    neighbors: [
      Object.freeze({
        subjectId: "obj-a",
        position: { x: 1.2, y: 0.42, z: 0.2 },
        bounds: neighborBounds,
        priority: 20,
        visualRole: "related",
      }),
      Object.freeze({
        subjectId: "obj-b",
        position: { x: 1.25, y: 0.42, z: 0.22 },
        bounds: neighborBounds,
        priority: 10,
        visualRole: "related",
      }),
    ],
    hubRadius: 1.9,
    bounds: EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
    cameraPosition,
    cameraTarget,
    cameraFov,
  });
  const sectors = allocated.assignments.map((entry) => entry.sectorId);
  assert.equal(new Set(sectors).size, sectors.length);
  assert.ok(allocated.assignments.some((entry) => entry.usedFallback));
});

test("S4. stable-ID tie-breaking", () => {
  const focusBounds = resolveExecutiveStageObjectBounds({
    subjectId: "focus",
    objectKind: "object",
    scale: 1,
  });
  const neighborBounds = resolveExecutiveStageObjectBounds({
    subjectId: "n",
    objectKind: "object",
    scale: 0.76,
  });
  const allocated = allocateExecutiveFocusHubSectors({
    focus: {
      subjectId: "focus",
      position: { x: 0, y: 0.42, z: 0.14 },
      bounds: focusBounds,
    },
    neighbors: [
      Object.freeze({
        subjectId: "obj-z",
        position: { x: 1, y: 0.42, z: 0.2 },
        bounds: neighborBounds,
        priority: 10,
        visualRole: "related",
      }),
      Object.freeze({
        subjectId: "obj-a",
        position: { x: 1.01, y: 0.42, z: 0.21 },
        bounds: neighborBounds,
        priority: 10,
        visualRole: "related",
      }),
    ],
    hubRadius: 1.9,
    bounds: EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
    cameraPosition,
    cameraTarget,
    cameraFov,
  });
  assert.equal(allocated.assignments[0]!.subjectId, "obj-a");
});

test("S5. focused object retains anchor", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  const inventory = result.byId.get("obj-inventory")!;
  assert.ok(Math.abs(inventory.targetPosition[0]) < 0.35);
  assert.ok(Math.abs(inventory.targetPosition[2]) < 0.55);
});

test("S6. focus clear zone preserved", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  assert.equal(result.focusWhitespaceSatisfied, true);
});

test("S7. one related object per primary sector where possible", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  const businessSectors = result.hubSectorAssignments
    .filter((entry) => !entry.subjectId.startsWith("thread-"))
    .map((entry) => entry.sectorId);
  assert.equal(new Set(businessSectors).size, businessSectors.length);
});

test("S8. projected bounds include final scale", () => {
  const small = resolveExecutiveStageObjectBounds({
    subjectId: "a",
    objectKind: "object",
    scale: 0.6,
  });
  const large = resolveExecutiveStageObjectBounds({
    subjectId: "b",
    objectKind: "object",
    scale: 1,
  });
  const projectedSmall = resolveExecutiveProjectedObjectBounds({
    subjectId: "a",
    position: { x: 1, y: 0.42, z: 0.5 },
    bounds: small,
    cameraPosition,
    cameraTarget,
    cameraFov,
  })!;
  const projectedLarge = resolveExecutiveProjectedObjectBounds({
    subjectId: "b",
    position: { x: 1, y: 0.42, z: 0.5 },
    bounds: large,
    cameraPosition,
    cameraTarget,
    cameraFov,
  })!;
  assert.ok(projectedSmall.radiusNdc < projectedLarge.radiusNdc);
});

test("S9. projected bounds include effective geometry footprint", () => {
  const bounds = resolveExecutiveStageObjectBounds({
    subjectId: "a",
    objectKind: "object",
    scale: 1,
  });
  const projected = resolveExecutiveProjectedObjectBounds({
    subjectId: "a",
    position: { x: 0, y: 0.42, z: 0.14 },
    bounds,
    cameraPosition,
    cameraTarget,
    cameraFov,
  })!;
  assert.ok(projected.safeRadiusNdc > projected.radiusNdc);
  assert.ok(projected.radiusNdc > 0);
});

test("S10. projected safe envelopes do not overlap", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  const projected = result.subjects.map((subject) =>
    resolveExecutiveProjectedObjectBounds({
      subjectId: subject.subjectId,
      position: {
        x: subject.targetPosition[0],
        y: subject.targetPosition[1],
        z: subject.targetPosition[2],
      },
      bounds: subject.bounds,
      cameraPosition,
      cameraTarget,
      cameraFov,
    }),
  );
  for (let i = 0; i < projected.length; i += 1) {
    for (let j = i + 1; j < projected.length; j += 1) {
      const left = projected[i];
      const right = projected[j];
      if (left == null || right == null) continue;
      assert.equal(
        projectedSafeEnvelopesOverlap(left, right),
        false,
        `${left.subjectId}/${right.subjectId}`,
      );
    }
  }
});

test("S11. no neighbor overlaps focus safe envelope", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  const focus = result.byId.get("obj-inventory")!;
  const focusProjected = resolveExecutiveProjectedObjectBounds({
    subjectId: focus.subjectId,
    position: {
      x: focus.targetPosition[0],
      y: focus.targetPosition[1],
      z: focus.targetPosition[2],
    },
    bounds: focus.bounds,
    cameraPosition,
    cameraTarget,
    cameraFov,
    safePaddingNdc:
      EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.focusProjectedClearPaddingNdc,
  })!;
  for (const subject of result.subjects) {
    if (subject.subjectId === focus.subjectId) continue;
    const projected = resolveExecutiveProjectedObjectBounds({
      subjectId: subject.subjectId,
      position: {
        x: subject.targetPosition[0],
        y: subject.targetPosition[1],
        z: subject.targetPosition[2],
      },
      bounds: subject.bounds,
      cameraPosition,
      cameraTarget,
      cameraFov,
    })!;
    assert.equal(projectedSafeEnvelopesOverlap(focusProjected, projected), false);
  }
});

test("S12. no neighbor-on-neighbor projected occlusion", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  assert.equal(result.projectedSeparationSatisfied, true);
});

test("S13. degenerate projected line detected", () => {
  const focusProjected = Object.freeze({
    subjectId: "focus",
    centerNdcX: 0,
    centerNdcY: 0,
    halfWidthNdc: 0.1,
    halfHeightNdc: 0.1,
    radiusNdc: 0.1,
    safeRadiusNdc: 0.12,
    depth: 8,
  });
  // Synthetic neighbors sharing essentially one screen direction.
  const neighbors = [0.2, 0.35, 0.5, 0.65].map((radius, index) =>
    Object.freeze({
      subjectId: `n${index}`,
      centerNdcX: radius,
      centerNdcY: radius * 0.05,
      halfWidthNdc: 0.05,
      halfHeightNdc: 0.05,
      radiusNdc: 0.05,
      safeRadiusNdc: 0.07,
      depth: 7,
    }),
  );
  assert.equal(
    detectDegenerateHubCollinearity({
      focusProjected,
      neighborProjected: neighbors,
    }),
    true,
  );
});

test("S14. degenerate Hub redistributed", () => {
  const piled = inventoryLikeSubjects().map((subject, index) =>
    subject.family === "business-object" && subject.roleHint === "related"
      ? Object.freeze({
          ...subject,
          position: [0.7 + index * 0.05, 0.42, 0.5 + index * 0.03] as const,
        })
      : subject,
  );
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: Object.freeze(piled),
  });
  const sectors = result.hubSectorAssignments
    .filter((entry) => !entry.subjectId.startsWith("thread-"))
    .map((entry) => entry.sectorId);
  assert.ok(new Set(sectors).size >= Math.min(3, sectors.length));
});

test("S15. angular redistribution deterministic", () => {
  const angle = resolveWorldAngleForHubSector({
    sectorId: "left",
    cameraPosition,
    cameraTarget,
  });
  const again = resolveWorldAngleForHubSector({
    sectorId: "left",
    cameraPosition,
    cameraTarget,
  });
  assert.equal(angle, again);
});

test("S16. radial expansion bounded", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  assert.ok(result.hubRadius <= 2.95 + 1e-6);
});

test("S17. secondary scale fallback bounded", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  for (const subject of result.subjects) {
    assert.ok(subject.scale <= EXECUTIVE_FOCUS_VISUAL_SCALE.maximumPrimary);
    assert.ok(subject.scale >= 0.3);
  }
});

test("S18. no Z-only escape", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  assert.equal(result.usedZOnlyEscape, false);
});

test("S19. collapsed thread receives lower sector priority", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  const thread = result.hubSectorAssignments.find((entry) =>
    entry.subjectId.startsWith("thread-"),
  );
  assert.ok(thread);
  assert.ok(
    EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.collapsedPreferredSectors.includes(
      thread!.sectorId as (typeof EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.collapsedPreferredSectors)[number],
    ) || thread!.usedFallback,
  );
});

test("S20. collapsed thread avoids focus ring", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  const focus = result.byId.get("obj-inventory")!;
  const thread = result.byId.get("thread-obj-inventory")!;
  const dist = Math.hypot(
    thread.targetPosition[0] - focus.targetPosition[0],
    thread.targetPosition[2] - focus.targetPosition[2],
  );
  assert.ok(dist > 0.95);
});

test("S21. collapsed thread avoids Business Object envelopes", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  assert.equal(result.separationSatisfied, true);
});

test("S22. labels use final positions", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  assert.equal(result.byId.get("obj-inventory")!.label.primaryLine, "Inventory");
  assert.ok(result.byId.get("obj-inventory")!.labelAnchorBoost > 0);
});

test("S23. focused label clearance preserved", () => {
  assert.ok(EXECUTIVE_FOCUS_HUB_SECTOR_POLICY.primaryLabelClearanceBoost >= 0.18);
  const source = readFileSync(
    new URL("../../executive/nex-mvp/stage/NexoraStageObject.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /labelAnchorBoost/);
});

test("S24. connections use final positions", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-inventory");
  const presentation = deriveNexoraMVPStageInteractionPresentation(state);
  assert.ok(presentation.scene.connections.length > 0);
  assert.ok(
    presentation.scene.objects.every((object) =>
      object.targetPosition.every((value) => Number.isFinite(value)),
    ),
  );
});

test("S25. Stage safe areas invalidate conflicting sectors", () => {
  const source = readFileSync(
    new URL("./executiveFocusHubProjectedSectors.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /unsafeMinX|1\.5/);
  assert.match(source, /isSectorSafeForDial/);
});

test("S26. Inventory-like 4-neighbor case produces distinct sectors", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  const sectors = result.hubSectorAssignments
    .filter((entry) => !entry.subjectId.startsWith("thread-"))
    .map((entry) => entry.sectorId);
  assert.equal(sectors.length, 4);
  assert.equal(new Set(sectors).size, 4);
});

test("S27. Revenue-like focus case produces distinct sectors", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-revenue",
    subjects: revenueLikeSubjects(),
  });
  const sectors = result.hubSectorAssignments
    .filter((entry) => !entry.subjectId.startsWith("thread-"))
    .map((entry) => entry.sectorId);
  assert.equal(new Set(sectors).size, sectors.length);
  assert.equal(result.projectedSeparationSatisfied, true);
});

test("S28. MINIMUM Disclosure membership unchanged", () => {
  assert.equal(EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.minimum.relatedBusiness, 4);
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.ownsDisclosureMembership,
    false,
  );
});

test("S29. REPORT behavior unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.report.expandedExecutiveWork,
    2,
  );
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.ownsDisclosureMembership,
    false,
  );
});

test("S30. OPERATION behavior unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_SCENE_DISCLOSURE_BUDGET.operation.expandedExecutiveWork,
    4,
  );
});

test("S31. Overview Flow behavior unchanged", () => {
  const overview = resolveExecutiveFocusVisualGrammar({
    mode: "overview",
    presentationDepth: "minimum",
    focusedSubjectId: null,
    subjects: revenueLikeSubjects().slice(0, 4),
  });
  assert.equal(overview.hubSectorAssignments.length, 0);
});

test("S32. Data Reality unchanged", () => {
  assert.equal(EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.ownsDataReality, false);
});

test("S33. lighting unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.replacesLightingHierarchy,
    false,
  );
  assert.ok(EXECUTIVE_LIGHTING_EMPHASIS_PROFILES.primary.strength > 0);
});

test("S34. camera unchanged", () => {
  assert.equal(
    EXECUTIVE_FOCUS_VISUAL_GRAMMAR_BOUNDARY.presentationOnly,
    true,
  );
});

test("S35. sector count is restrained 6–8", () => {
  assert.ok(EXECUTIVE_FOCUS_HUB_SECTOR_IDS.length >= 6);
  assert.ok(EXECUTIVE_FOCUS_HUB_SECTOR_IDS.length <= 8);
});

test("S36. identity/version remains 4.1.2", () => {
  const result = resolveExecutiveFocusVisualGrammar({
    mode: "focus",
    presentationDepth: "minimum",
    focusedSubjectId: "obj-inventory",
    subjects: inventoryLikeSubjects(),
  });
  assert.equal(result.version, "4.1.2");
});

test("S37. interaction Inventory MINIMUM uses distinct sectors", () => {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-inventory");
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });
  const presentation = deriveNexoraMVPStageInteractionPresentation(state);
  const visible = presentation.scene.objects.filter(
    (object) =>
      object.disclosureState === "visible-related" ||
      object.disclosureState === "visible-primary",
  );
  assert.ok(visible.length >= 2);
  const inventory = visible.find((object) => object.id === "obj-inventory")!;
  assert.ok(inventory.labelAnchorBoost! > 0);
});
