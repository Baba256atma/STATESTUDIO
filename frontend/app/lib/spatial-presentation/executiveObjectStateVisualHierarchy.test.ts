/**
 * SP:2.4 — State & Severity Visual Hierarchy tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS,
  resolveExecutiveObjectMaterialPresentation,
} from "./executiveObjectMaterialSurface.ts";
import {
  EXECUTIVE_OBJECT_SCALE_ENVELOPE,
  resolveExecutiveObjectVisualPresentation,
} from "./executiveObjectVisualFoundation.ts";
import { resolveExecutiveObjectGeometryFamily } from "./executiveObjectGeometryLanguage.ts";
import { resolveExecutiveObjectOcclusion } from "./executiveObjectOcclusion.ts";
import {
  applyExecutiveCameraNavigationAction,
  INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
  resolveExecutiveCameraNavigationBaseIntent,
  resolveNavigatedExecutiveCameraIntent,
} from "./executiveCameraNavigation.ts";
import { resolveExecutiveCameraPresentation } from "./executiveCameraFoundation.ts";
import { resolveExecutiveDensityAwareFraming } from "./executiveDensityAwareFraming.ts";
import {
  EXECUTIVE_OBJECT_RECOMMENDATION_VISUAL,
  EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY,
  EXECUTIVE_OBJECT_STATE_VISUAL_COMPOSITION_ORDER,
  EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS,
  EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY,
  EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES,
  composeExecutiveObjectStateVisualClass,
  executiveObjectStateVisualHierarchyIdentity,
  getExecutiveObjectStateVisualHierarchyIdentity,
  resolveExecutiveObjectStateVisualPresentation,
  verifyExecutiveObjectStateVisualHierarchy,
  type ExecutiveObjectStateVisualInput,
  type ExecutiveObjectStateVisualPresentation,
} from "./executiveObjectStateVisualHierarchy.ts";

const source = readFileSync(
  new URL("./executiveObjectStateVisualHierarchy.ts", import.meta.url),
  "utf8",
);

const foundationSource = readFileSync(
  new URL("./executiveObjectVisualFoundation.ts", import.meta.url),
  "utf8",
);

const materialSource = readFileSync(
  new URL("./executiveObjectMaterialSurface.ts", import.meta.url),
  "utf8",
);

const rendererSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx",
    import.meta.url,
  ),
  "utf8",
);

const stageObjectSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraStageObject.tsx",
    import.meta.url,
  ),
  "utf8",
);

function baseInput(
  overrides: Partial<ExecutiveObjectStateVisualInput> = {},
): ExecutiveObjectStateVisualInput {
  return Object.freeze({
    status: "stable",
    attention: "normal",
    recommended: false,
    spatialRole: "overview",
    selected: false,
    focused: false,
    hovered: false,
    occlusionState: "clear",
    ...overrides,
  });
}

function assertBounded(
  presentation: ExecutiveObjectStateVisualPresentation,
): void {
  const bounds = EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS;
  assert.ok(Number.isFinite(presentation.prominenceRank));
  assert.ok(Number.isFinite(presentation.visualEnergy));
  assert.ok(Number.isFinite(presentation.emissiveLift));
  assert.ok(Number.isFinite(presentation.surfaceTint));
  assert.ok(Number.isFinite(presentation.edge.opacity));
  assert.ok(Number.isFinite(presentation.opacityFloor));
  assert.ok(
    presentation.prominenceRank >= bounds.minimumProminenceRank &&
      presentation.prominenceRank <= bounds.maximumProminenceRank,
  );
  assert.ok(presentation.visualEnergy >= 0);
  assert.ok(presentation.visualEnergy <= bounds.maximumVisualEnergy);
  assert.ok(presentation.emissiveLift >= 0);
  assert.ok(presentation.emissiveLift <= bounds.maximumEmissiveLift);
  assert.ok(presentation.edge.opacity >= 0);
  assert.ok(presentation.edge.opacity <= bounds.maximumEdgeOpacity);
  assert.ok(presentation.surfaceTint >= 0 && presentation.surfaceTint <= 1);
}

test("1. SP:2.4 identity and presentation-only boundary", () => {
  const identity = getExecutiveObjectStateVisualHierarchyIdentity();
  assert.equal(identity.id, executiveObjectStateVisualHierarchyIdentity);
  assert.equal(identity.version, "2.4.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-object-state-visual-hierarchy",
  );
  assert.equal(
    identity.upstreamVisualFoundation,
    "SP:2.1/ExecutiveObjectVisualFoundation",
  );
  assert.equal(
    identity.upstreamGeometryLanguage,
    "SP:2.2/ExecutiveObjectGeometryLanguage",
  );
  assert.equal(
    identity.upstreamMaterialSurface,
    "SP:2.3/ExecutiveObjectMaterialSurface",
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.ownsBusinessTruth,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.ownsKpiComputation,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.ownsSeverityTruth,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.changesGeometry,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.changesScaleAggressively,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.introducesTrafficLightBodies,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.introducesPulsing,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.introducesBlinking,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.autoFocusesCritical,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY
      .replacesVisualFoundationAuthority,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY
      .replacesMaterialSurfaceAuthority,
    false,
  );
  assert.equal(verifyExecutiveObjectStateVisualHierarchy().ok, true);
  assert.doesNotMatch(source, /from ["']@react-three/);
  assert.doesNotMatch(source, /from ["']three["']/);
  assert.doesNotMatch(source, /from ["']\.\/executiveObjectVisualFoundation/);
  assert.doesNotMatch(source, /from ["']\.\/executiveObjectMaterialSurface/);
  assert.deepEqual(
    [...EXECUTIVE_OBJECT_STATE_VISUAL_COMPOSITION_ORDER],
    [
      "baseMaterial",
      "canonicalState",
      "attentionRecommendation",
      "spatialRole",
      "interaction",
      "occlusionReadability",
    ],
  );
});

test("2. normal resolves deterministically", () => {
  const presentation = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "stable", attention: "normal" }),
  );
  assert.equal(presentation.statusClass, "normal");
  assert.equal(presentation.surfaceTone, "object.surface.base");
  assert.equal(presentation.marker, "none");
  assert.equal(presentation.edge.mode, "none");
  assert.equal(presentation.recommendationCue, false);
  assert.ok(
    presentation.visualEnergy <
      EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.energy,
  );
  assertBounded(presentation);
});

test("3. watch resolves deterministically", () => {
  const presentation = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "watch", attention: "elevated" }),
  );
  assert.equal(presentation.statusClass, "watch");
  assert.equal(presentation.surfaceTone, "object.surface.watch");
  assert.equal(presentation.marker, "attention");
  assert.equal(presentation.edge.mode, "watch");
  assert.equal(presentation.edge.style, "solid");
  assert.ok(presentation.edge.opacity > 0);
  assertBounded(presentation);
});

test("4. critical resolves deterministically", () => {
  const presentation = resolveExecutiveObjectStateVisualPresentation(
    baseInput({
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
    }),
  );
  assert.equal(presentation.statusClass, "critical");
  assert.equal(presentation.surfaceTone, "object.surface.risk");
  assert.equal(presentation.marker, "critical");
  assert.equal(presentation.edge.mode, "critical");
  assert.ok(
    presentation.prominenceRank >
      EXECUTIVE_OBJECT_STATE_VISUAL_PROFILES.watch.prominenceRank,
  );
  assertBounded(presentation);
});

test("5. unresolved resolves deterministically", () => {
  const presentation = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "unresolved", stateMarker: "unresolved" }),
  );
  assert.equal(presentation.statusClass, "unresolved");
  assert.equal(presentation.surfaceTone, "object.surface.unresolved");
  assert.equal(presentation.marker, "unresolved");
  assert.equal(presentation.edge.mode, "unresolved");
  assert.equal(presentation.edge.style, "uncertainty");
  assert.notEqual(presentation.statusClass, "critical");
  assertBounded(presentation);
});

test("6. identical input yields identical output", () => {
  const input = baseInput({
    status: "risk",
    attention: "critical",
    focused: true,
    spatialRole: "focus",
  });
  const a = resolveExecutiveObjectStateVisualPresentation(input);
  const b = resolveExecutiveObjectStateVisualPresentation(input);
  assert.deepEqual(a, b);
});

test("7. resolver does not mutate input", () => {
  const input = baseInput({
    status: "watch",
    recommended: true,
    hovered: true,
  });
  const snapshot = JSON.stringify(input);
  resolveExecutiveObjectStateVisualPresentation(input);
  assert.equal(JSON.stringify(input), snapshot);
});

test("8. numeric presentation values are bounded", () => {
  const stacked = resolveExecutiveObjectStateVisualPresentation(
    baseInput({
      status: "risk",
      attention: "critical",
      recommended: true,
      focused: true,
      selected: true,
      hovered: true,
      spatialRole: "focus",
      occlusionState: "substantial",
      rimIntensity: 1,
    }),
  );
  assertBounded(stacked);
  assert.ok(
    stacked.visualEnergy <=
      EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS.maximumVisualEnergy,
  );
});

test("9. unknown state degrades safely to normal", () => {
  const unknown = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "mystery-status", attention: "not-a-level" }),
  );
  assert.equal(unknown.statusClass, "normal");
  assert.equal(unknown.attentionLevel, "normal");
  assert.equal(unknown.marker, "none");
  assertBounded(unknown);
  assert.equal(composeExecutiveObjectStateVisualClass({}), "normal");
});

test("10. object identity is preserved — visual resolver has no id/kind fields", () => {
  const presentation = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "risk" }),
  );
  assert.equal("objectId" in presentation, false);
  assert.equal("objectKind" in presentation, false);
  assert.equal("geometry" in presentation, false);
  assert.equal("position" in presentation, false);
  const visual = resolveExecutiveObjectVisualPresentation({
    objectId: "canonical-id",
    objectKind: "decision",
    selected: false,
    focused: false,
    status: "risk",
    attention: "critical",
  });
  assert.equal(visual.objectId, "canonical-id");
  assert.equal(visual.objectKind, "decision");
});

test("11. geometry family does not change across states", () => {
  const kinds = ["object", "problem", "decision", "scenario", "kpi"] as const;
  const states = [
    { status: "stable", attention: "normal" as const },
    { status: "watch", attention: "elevated" as const },
    { status: "risk", attention: "critical" as const },
    { status: "unresolved", attention: "normal" as const },
  ] as const;
  for (const kind of kinds) {
    const families = states.map((state) => {
      const visual = resolveExecutiveObjectVisualPresentation({
        objectId: `geo-${kind}`,
        objectKind: kind,
        selected: false,
        focused: false,
        recommended: state.status === "stable",
        ...state,
      });
      return Object.freeze({
        family: visual.geometry.family,
        semanticFamily: visual.geometry.semanticFamily,
        dimensions: visual.dimensions,
      });
    });
    for (const next of families.slice(1)) {
      assert.equal(next.family, families[0].family);
      assert.equal(next.semanticFamily, families[0].semanticFamily);
      assert.deepEqual(next.dimensions, families[0].dimensions);
    }
    const geometry = resolveExecutiveObjectGeometryFamily({ objectKind: kind });
    assert.equal(families[0].family, geometry.geometryFamily);
  }
});

test("12. severity order — critical > watch > normal", () => {
  const normal = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "stable" }),
  );
  const watch = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "watch" }),
  );
  const critical = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "risk", attention: "critical" }),
  );
  assert.ok(critical.prominenceRank > watch.prominenceRank);
  assert.ok(watch.prominenceRank > normal.prominenceRank);
  assert.ok(critical.visualEnergy > watch.visualEnergy);
  assert.ok(watch.visualEnergy > normal.visualEnergy);
  assert.ok(critical.emissiveLift > watch.emissiveLift);
  assert.ok(watch.emissiveLift > normal.emissiveLift);
  assert.ok(critical.edge.opacity > watch.edge.opacity);
  assert.ok(watch.edge.opacity > normal.edge.opacity);
  assert.ok(critical.surfaceTint > watch.surfaceTint);
});

test("13. unresolved is visible, not critical, not disabled", () => {
  const unresolved = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "unresolved", stateMarker: "unresolved" }),
  );
  const critical = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "risk", attention: "critical" }),
  );
  assert.equal(unresolved.statusClass, "unresolved");
  assert.notEqual(unresolved.statusClass, "critical");
  assert.notEqual(unresolved.surfaceTone, critical.surfaceTone);
  assert.notEqual(unresolved.marker, "critical");
  assert.ok(unresolved.edge.opacity > 0);
  assert.equal(unresolved.labelProminence, "full");
  assert.ok(unresolved.prominenceRank < critical.prominenceRank);
  const visual = resolveExecutiveObjectVisualPresentation({
    objectId: "unresolved-a",
    objectKind: "object",
    selected: true,
    focused: false,
    hovered: true,
    status: "unresolved",
    stateMarker: "unresolved",
  });
  assert.equal(visual.emphasis.stateClass, "unresolved");
  assert.equal(visual.emphasis.selected, true);
  assert.equal(visual.emphasis.hover, true);
  assert.equal(visual.geometry.family, "block");
  assert.ok(visual.material.opacity >= 0.8);
  assert.notEqual(visual.material.opacity, 0);
});

test("14. recommendation is independent of severity", () => {
  const normalRecommended = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "stable", recommended: true }),
  );
  const watchRecommended = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "watch", recommended: true }),
  );
  const criticalRecommended = resolveExecutiveObjectStateVisualPresentation(
    baseInput({
      status: "risk",
      attention: "critical",
      recommended: true,
    }),
  );
  assert.equal(normalRecommended.statusClass, "normal");
  assert.equal(watchRecommended.statusClass, "watch");
  assert.equal(criticalRecommended.statusClass, "critical");
  assert.equal(normalRecommended.recommendationCue, true);
  assert.equal(watchRecommended.recommendationCue, true);
  assert.equal(criticalRecommended.recommendationCue, true);
  assert.equal(normalRecommended.marker, "recommended");
  assert.equal(watchRecommended.marker, "attention");
  assert.equal(criticalRecommended.marker, "critical");
  assert.equal(normalRecommended.edge.mode, "recommended");
  assert.equal(
    normalRecommended.edge.tone,
    EXECUTIVE_OBJECT_RECOMMENDATION_VISUAL.edgeTone,
  );
  assert.notEqual(
    criticalRecommended.edge.color.toLowerCase(),
    EXECUTIVE_OBJECT_RECOMMENDATION_VISUAL.edgeColor.toLowerCase(),
  );
  assert.ok(
    criticalRecommended.prominenceRank > watchRecommended.prominenceRank,
  );
});

test("15. focus composition keeps state readable", () => {
  for (const status of ["stable", "watch", "risk", "unresolved"] as const) {
    const overview = resolveExecutiveObjectStateVisualPresentation(
      baseInput({
        status,
        attention: status === "risk" ? "critical" : "normal",
      }),
    );
    const focused = resolveExecutiveObjectStateVisualPresentation(
      baseInput({
        status,
        attention: status === "risk" ? "critical" : "normal",
        focused: true,
        spatialRole: "focus",
      }),
    );
    assert.equal(focused.statusClass, overview.statusClass);
    assert.ok(focused.visualEnergy >= overview.visualEnergy);
    assert.equal(focused.surfaceTone, overview.surfaceTone);
    const visual = resolveExecutiveObjectVisualPresentation({
      objectId: `focus-${status}`,
      objectKind: "kpi",
      selected: false,
      focused: true,
      spatialRole: "focus",
      status,
      attention: status === "risk" ? "critical" : "normal",
    });
    assert.equal(visual.emphasis.showFocusPedestal, true);
    assert.equal(visual.spatialRole, "focus");
    assert.equal(visual.emphasis.stateClass, overview.statusClass);
  }
});

test("16. critical background remains discoverable without becoming focus", () => {
  const focused = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-revenue",
    objectKind: "kpi",
    selected: true,
    focused: true,
    spatialRole: "focus",
    status: "stable",
    attention: "normal",
  });
  const backgroundCritical = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-capacity",
    objectKind: "problem",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
    rimIntensity: 0.8,
    compositionOpacity: 0.28,
  });
  const backgroundState = resolveExecutiveObjectStateVisualPresentation(
    baseInput({
      status: "risk",
      attention: "critical",
      spatialRole: "background",
      stateMarker: "critical",
    }),
  );

  assert.equal(focused.spatialRole, "focus");
  assert.equal(focused.emphasis.focused, true);
  assert.equal(focused.emphasis.stateClass, "normal");
  assert.equal(backgroundCritical.spatialRole, "background");
  assert.equal(backgroundCritical.emphasis.focused, false);
  assert.equal(backgroundCritical.emphasis.stateClass, "critical");
  assert.equal(backgroundCritical.material.surfaceTone, "object.surface.risk");
  assert.ok(
    backgroundCritical.material.opacity >=
      EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY.criticalFloor,
  );
  assert.ok(
    backgroundCritical.material.opacity >=
      EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.backgroundCriticalFloor,
  );
  assert.ok(
    backgroundCritical.material.opacity <=
      EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.backgroundOpacityCeiling,
  );
  assert.equal(backgroundCritical.edge.mode, "attention");
  assert.equal(backgroundCritical.edge.tone, "object.edge.critical");
  assert.ok(backgroundState.backgroundOpacityFloor >= 0.5);
  assert.notEqual(focused.objectId, backgroundCritical.objectId);
  assert.ok(
    backgroundCritical.emphasis.prominenceRank >
      focused.emphasis.prominenceRank,
  );
});

test("17. related objects retain distinct state", () => {
  const relatedNormal = resolveExecutiveObjectVisualPresentation({
    objectId: "rel-scenario",
    objectKind: "scenario",
    selected: false,
    focused: false,
    spatialRole: "related",
    status: "stable",
    attention: "normal",
  });
  const relatedCritical = resolveExecutiveObjectVisualPresentation({
    objectId: "rel-risk",
    objectKind: "problem",
    selected: false,
    focused: false,
    spatialRole: "related",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  assert.equal(relatedNormal.spatialRole, "related");
  assert.equal(relatedCritical.spatialRole, "related");
  assert.equal(relatedNormal.emphasis.stateClass, "normal");
  assert.equal(relatedCritical.emphasis.stateClass, "critical");
  assert.notEqual(
    relatedNormal.material.surfaceTone,
    relatedCritical.material.surfaceTone,
  );
  assert.ok(
    relatedCritical.emphasis.prominenceRank >
      relatedNormal.emphasis.prominenceRank,
  );
  assert.ok(
    relatedCritical.material.emissiveIntensity >
      relatedNormal.material.emissiveIntensity,
  );
});

test("18. interaction remains visible without erasing state", () => {
  const cases = [
    {
      status: "risk",
      attention: "critical" as const,
      hovered: true,
      selected: false,
    },
    {
      status: "risk",
      attention: "critical" as const,
      hovered: false,
      selected: true,
    },
    {
      status: "watch",
      attention: "elevated" as const,
      hovered: true,
      selected: false,
    },
    {
      status: "unresolved",
      attention: "normal" as const,
      hovered: false,
      selected: true,
    },
  ] as const;

  for (const next of cases) {
    const idle = resolveExecutiveObjectVisualPresentation({
      objectId: `ix-${next.status}`,
      objectKind: "object",
      selected: false,
      focused: false,
      hovered: false,
      status: next.status,
      attention: next.attention,
      stateMarker:
        next.status === "risk"
          ? "critical"
          : next.status === "watch"
            ? "attention"
            : "unresolved",
    });
    const interactive = resolveExecutiveObjectVisualPresentation({
      objectId: `ix-${next.status}`,
      objectKind: "object",
      selected: next.selected,
      focused: false,
      hovered: next.hovered,
      status: next.status,
      attention: next.attention,
      stateMarker:
        next.status === "risk"
          ? "critical"
          : next.status === "watch"
            ? "attention"
            : "unresolved",
    });
    assert.equal(interactive.emphasis.stateClass, idle.emphasis.stateClass);
    assert.equal(interactive.material.surfaceTone, idle.material.surfaceTone);
    assert.equal(interactive.emphasis.hover, next.hovered);
    assert.equal(interactive.emphasis.selected, next.selected);
    if (next.status === "risk" || next.status === "watch") {
      assert.equal(interactive.edge.mode, "attention");
    }
    if (next.selected && next.status === "unresolved") {
      assert.ok(
        interactive.edge.mode === "attention" ||
          interactive.edge.mode === "selected",
      );
    }
  }
});

test("19. occlusion does not erase state discoverability", () => {
  const criticalPartial = resolveExecutiveObjectStateVisualPresentation(
    baseInput({
      status: "risk",
      attention: "critical",
      occlusionState: "partial",
    }),
  );
  const watchSubstantial = resolveExecutiveObjectStateVisualPresentation(
    baseInput({
      status: "watch",
      occlusionState: "substantial",
    }),
  );
  assert.equal(criticalPartial.statusClass, "critical");
  assert.equal(watchSubstantial.statusClass, "watch");
  assert.ok(criticalPartial.edge.opacity >= 0.24);
  assert.ok(watchSubstantial.edge.opacity >= 0.3);

  const visual = resolveExecutiveObjectVisualPresentation({
    objectId: "occ-critical",
    objectKind: "problem",
    selected: false,
    focused: false,
    status: "risk",
    attention: "critical",
    occlusionState: "partial",
    silhouetteAssist: true,
    readabilityAssist: true,
  });
  assert.equal(visual.emphasis.stateClass, "critical");
  assert.equal(visual.edge.mode, "attention");
  const occlusion = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "occ-front",
        position: Object.freeze({ x: 0.2, y: 0.1, z: 1.1 }),
        radius: visual.connectionAnchor.radius,
      }),
      Object.freeze({
        objectId: "occ-critical",
        position: Object.freeze({ x: 0.15, y: 0.12, z: -0.2 }),
        radius: visual.connectionAnchor.radius,
      }),
    ],
    cameraPosition: Object.freeze({ x: 3.8, y: 5.2, z: 7.6 }),
    cameraTarget: Object.freeze({ x: -0.22, y: 0.2, z: 0.02 }),
    fovDegrees: 38,
    aspect: 1.45,
  });
  assert.ok(occlusion.byId.has("occ-critical"));
});

test("20. many-critical scene stays within visual-energy bounds", () => {
  const objects = [
    "obj-a",
    "obj-b",
    "obj-c",
    "obj-d",
    "obj-e",
  ] as const;
  const presentations = objects.map((objectId) =>
    resolveExecutiveObjectVisualPresentation({
      objectId,
      objectKind: "problem",
      selected: objectId === "obj-a",
      focused: objectId === "obj-a",
      spatialRole: objectId === "obj-a" ? "focus" : "overview",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
      hovered: objectId === "obj-b",
      recommended: objectId === "obj-c",
    }),
  );
  for (const presentation of presentations) {
    assert.equal(presentation.emphasis.stateClass, "critical");
    assert.ok(
      presentation.emphasis.visualEnergy <=
        EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS.maximumVisualEnergy,
    );
    assert.ok(
      presentation.material.emissiveIntensity <=
        EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS.maximumEmissive,
    );
    assert.ok(
      presentation.edge.opacity <=
        EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS.maximumEdgeOpacity,
    );
    assert.equal(presentation.geometry.semanticFamily, "risk_problem");
  }
  assert.equal(presentations[0].spatialRole, "focus");
  assert.equal(presentations[1].spatialRole, "overview");
});

test("21. normal-dominant scene remains calm", () => {
  const presentations = ["kpi", "goal", "decision", "scenario"].map((kind) =>
    resolveExecutiveObjectVisualPresentation({
      objectId: `calm-${kind}`,
      objectKind: kind,
      selected: false,
      focused: false,
      status: "stable",
      attention: "normal",
    }),
  );
  for (const presentation of presentations) {
    assert.equal(presentation.emphasis.stateClass, "normal");
    assert.ok(presentation.emphasis.visualEnergy <= 0.2);
    assert.ok(presentation.material.emissiveIntensity <= 0.12);
    assert.equal(presentation.edge.mode, "none");
    assert.equal(presentation.emphasis.marker, "none");
  }
});

test("22. renderer consumes resolved presentation — no raw state branching", () => {
  assert.match(foundationSource, /resolveExecutiveObjectStateVisualPresentation/);
  assert.match(materialSource, /resolveExecutiveObjectStateVisualPresentation/);
  assert.match(rendererSource, /material\.color/);
  assert.match(rendererSource, /material\.emissiveColor/);
  assert.doesNotMatch(rendererSource, /status\s*===\s*["']critical["']/);
  assert.doesNotMatch(rendererSource, /status\s*===\s*["']watch["']/);
  assert.doesNotMatch(rendererSource, /attention\s*===\s*["']critical["']/);
  assert.doesNotMatch(stageObjectSource, /STATUS_COLOR/);
  assert.doesNotMatch(stageObjectSource, /if\s*\(\s*status\s*===\s*["']critical["']/);
  assert.match(stageObjectSource, /emphasis\.stateClass/);
});

test("23. SP:2.3 material ranges remain respected under state modifiers", () => {
  const bounds = EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS;
  const cases: readonly ExecutiveObjectStateVisualInput[] = [
    baseInput({ status: "stable" }),
    baseInput({ status: "watch", attention: "important" }),
    baseInput({ status: "risk", attention: "critical", focused: true }),
    baseInput({ status: "unresolved", spatialRole: "background" }),
    baseInput({
      status: "risk",
      attention: "critical",
      spatialRole: "background",
      recommended: true,
      hovered: true,
    }),
  ];
  for (const input of cases) {
    const material = resolveExecutiveObjectMaterialPresentation({
      geometryFamily: "block",
      semanticFamily: "operational",
      spatialRole: input.spatialRole,
      selected: input.selected,
      focused: input.focused,
      hovered: input.hovered,
      attention: input.attention,
      status: input.status,
      occlusionState: input.occlusionState,
      recommended: input.recommended,
    });
    assert.ok(material.roughness >= bounds.minimumRoughness);
    assert.ok(material.roughness <= bounds.maximumRoughness);
    assert.ok(material.metalness >= bounds.minimumMetalness);
    assert.ok(material.metalness <= bounds.maximumMetalness);
    assert.ok(material.opacity >= bounds.minimumOpacity);
    assert.ok(material.emissiveIntensity <= bounds.maximumEmissive);
    assert.ok(material.envMapIntensity >= bounds.minimumEnvMapIntensity);
    assert.ok(material.envMapIntensity <= bounds.maximumEnvMapIntensity);
    assert.notEqual(material.color.toLowerCase(), "#ff0000");
    assert.notEqual(material.color.toLowerCase(), "#00ff00");
    assert.notEqual(material.color.toLowerCase(), "#ffff00");
    assert.notEqual(material.color.toLowerCase(), "#f87171");
  }
});

test("24. SP:2.2 geometry invariance across all states", () => {
  const decisionNormal = resolveExecutiveObjectVisualPresentation({
    objectId: "decision-a",
    objectKind: "decision",
    selected: false,
    focused: false,
    status: "stable",
  });
  const decisionCritical = resolveExecutiveObjectVisualPresentation({
    objectId: "decision-a",
    objectKind: "decision",
    selected: false,
    focused: false,
    status: "risk",
    attention: "critical",
    recommended: true,
  });
  assert.equal(decisionNormal.geometry.family, decisionCritical.geometry.family);
  assert.equal(
    decisionNormal.geometry.semanticFamily,
    decisionCritical.geometry.semanticFamily,
  );
  assert.deepEqual(decisionNormal.dimensions, decisionCritical.dimensions);
  assert.equal(decisionNormal.geometry.family, "rounded");
});

test("25. SP:1 spatial invariance — state does not change camera or scale", () => {
  const normal = resolveExecutiveObjectVisualPresentation({
    objectId: "spatial-a",
    objectKind: "kpi",
    selected: false,
    focused: false,
    status: "stable",
  });
  const critical = resolveExecutiveObjectVisualPresentation({
    objectId: "spatial-a",
    objectKind: "kpi",
    selected: false,
    focused: false,
    status: "risk",
    attention: "critical",
    recommended: true,
  });
  assert.equal(normal.scale, critical.scale);
  assert.ok(normal.scale <= EXECUTIVE_OBJECT_SCALE_ENVELOPE.maximumEmphasis);
  assert.equal("position" in normal, false);
  assert.equal("camera" in critical, false);

  const target = Object.freeze({ x: 0, y: 0.2, z: 0 });
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target,
  });
  let nav = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (const action of [
    "orbit-left",
    "orbit-right",
    "tilt-up",
    "tilt-down",
  ] as const) {
    nav = applyExecutiveCameraNavigationAction(nav, action, base);
    const intent = resolveNavigatedExecutiveCameraIntent({
      mode: "overview",
      target,
      navigation: nav,
    });
    const presentation = resolveExecutiveCameraPresentation(intent);
    assert.ok(Number.isFinite(presentation.position.x));
  }
  const framing = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
  });
  assert.ok(Number.isFinite(framing.cameraDistance));
});

test("26. status and attention remain orthogonal", () => {
  const watchImportant = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "watch", attention: "important" }),
  );
  const stableCriticalAttention = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "stable", attention: "critical" }),
  );
  const unresolvedElevated = resolveExecutiveObjectStateVisualPresentation(
    baseInput({ status: "unresolved", attention: "elevated" }),
  );
  assert.equal(watchImportant.statusClass, "watch");
  assert.equal(watchImportant.attentionLevel, "important");
  assert.equal(stableCriticalAttention.statusClass, "critical");
  assert.equal(stableCriticalAttention.attentionLevel, "critical");
  assert.equal(unresolvedElevated.statusClass, "unresolved");
  assert.equal(unresolvedElevated.attentionLevel, "elevated");
});

test("27. single marker strategy — no stacked icons", () => {
  const stacked = resolveExecutiveObjectStateVisualPresentation(
    baseInput({
      status: "risk",
      attention: "critical",
      recommended: true,
      selected: true,
      stateMarker: "critical",
    }),
  );
  assert.equal(stacked.marker, "critical");
  assert.equal(stacked.recommendationCue, true);
  assert.equal(typeof stacked.marker, "string");
});

test("28. no traffic-light body colors", () => {
  for (const status of ["stable", "watch", "risk", "unresolved"] as const) {
    const material = resolveExecutiveObjectMaterialPresentation({
      geometryFamily: "block",
      semanticFamily: "operational",
      status,
      attention: status === "risk" ? "critical" : "normal",
    });
    assert.ok(material.color.startsWith("#"));
    assert.notEqual(material.color.toLowerCase(), "#00ff00");
    assert.notEqual(material.color.toLowerCase(), "#ffff00");
    assert.notEqual(material.color.toLowerCase(), "#ff0000");
    assert.notEqual(material.color.toLowerCase(), "#22c55e");
    assert.notEqual(material.color.toLowerCase(), "#eab308");
    assert.notEqual(material.color.toLowerCase(), "#ef4444");
    assert.equal(
      material.baseColor,
      "#536478",
    );
  }
});
