/**
 * SP:2.6 — Focus & Attention Object Presentation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS,
  EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY,
  EXECUTIVE_OBJECT_FOCUS_ATTENTION_VISUAL_PRIORITY,
  executiveObjectFocusAttentionPresentationIdentity,
  getExecutiveObjectFocusAttentionPresentationIdentity,
  resolveExecutiveObjectFocusAttentionPresentation,
  verifyExecutiveObjectFocusAttentionPresentation,
  type ExecutiveObjectFocusAttentionInput,
} from "./executiveObjectFocusAttentionPresentation.ts";
import {
  EXECUTIVE_OBJECT_MATERIAL_BOUNDS,
  EXECUTIVE_OBJECT_SCALE_ENVELOPE,
  resolveExecutiveObjectVisualPresentation,
} from "./executiveObjectVisualFoundation.ts";
import { EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY } from "./executiveObjectStateVisualHierarchy.ts";
import { EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS } from "./executiveObjectMaterialSurface.ts";
import { resolveExecutiveObjectGeometryFamily } from "./executiveObjectGeometryLanguage.ts";
import { resolveExecutiveObjectOcclusion } from "./executiveObjectOcclusion.ts";
import { resolveExecutiveDensityAwareFraming } from "./executiveDensityAwareFraming.ts";
import {
  applyExecutiveCameraNavigationAction,
  INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
  resolveExecutiveCameraNavigationBaseIntent,
  resolveNavigatedExecutiveCameraIntent,
} from "./executiveCameraNavigation.ts";
import { resolveExecutiveCameraPresentation } from "./executiveCameraFoundation.ts";

const source = readFileSync(
  new URL("./executiveObjectFocusAttentionPresentation.ts", import.meta.url),
  "utf8",
);

const foundationSource = readFileSync(
  new URL("./executiveObjectVisualFoundation.ts", import.meta.url),
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
  overrides: Partial<ExecutiveObjectFocusAttentionInput> = {},
): ExecutiveObjectFocusAttentionInput {
  return Object.freeze({
    objectId: "obj-revenue",
    spatialRole: "overview",
    status: "stable",
    attention: "normal",
    statusClass: "normal",
    stateVisualEnergy: 0.08,
    labelLevel: "summary",
    ...overrides,
  });
}

test("1. SP:2.6 identity and presentation-only boundary", () => {
  const identity = getExecutiveObjectFocusAttentionPresentationIdentity();
  assert.equal(identity.id, executiveObjectFocusAttentionPresentationIdentity);
  assert.equal(identity.version, "2.6.0");
  assert.equal(
    identity.upstreamLabelInformationDensity,
    "SP:2.5/ExecutiveObjectLabelInformationDensity",
  );
  assert.equal(
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY.ownsFocusTruth,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY.inventsRelationships,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY.ownsCamera,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY.autoFocusesCritical,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY
      .startsCertificationFreeze,
    false,
  );
  assert.equal(verifyExecutiveObjectFocusAttentionPresentation().ok, true);
  assert.doesNotMatch(source, /from ["']@react-three/);
  assert.doesNotMatch(source, /from ["']three["']/);
  assert.doesNotMatch(source, /from ["']\.\/executiveObjectVisualFoundation/);
  assert.deepEqual(
    [...EXECUTIVE_OBJECT_FOCUS_ATTENTION_VISUAL_PRIORITY],
    [
      "focusedObject",
      "relatedHighAttention",
      "criticalCompetingBackground",
      "otherRelatedContext",
      "watchOrRecommendedBackground",
      "normalBackground",
    ],
  );
});

test("2. focused normal", () => {
  const presentation = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({
      spatialRole: "focus",
      focused: true,
      statusClass: "normal",
      labelLevel: "detail",
    }),
  );
  assert.equal(presentation.role, "focus");
  assert.equal(presentation.showFocusPedestal, true);
  assert.equal(presentation.statusClass, "normal");
  assert.equal(presentation.preferStateEdge, false);
  assert.equal(presentation.primaryMarker, "none");
  assert.ok(presentation.labelEmphasis >= 0.9);
});

test("3. focused watch", () => {
  const presentation = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({
      spatialRole: "focus",
      focused: true,
      status: "watch",
      statusClass: "watch",
      stateEdgeOpacity: 0.32,
      marker: "attention",
      labelLevel: "detail",
    }),
  );
  assert.equal(presentation.showFocusPedestal, true);
  assert.equal(presentation.statusClass, "watch");
  assert.equal(presentation.preferStateEdge, true);
  assert.equal(presentation.primaryMarker, "attention");
});

test("4. focused critical", () => {
  const presentation = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({
      spatialRole: "focus",
      focused: true,
      status: "risk",
      statusClass: "critical",
      stateEdgeOpacity: 0.48,
      marker: "critical",
      labelLevel: "detail",
    }),
  );
  assert.equal(presentation.showFocusPedestal, true);
  assert.equal(presentation.statusClass, "critical");
  assert.equal(presentation.primaryMarker, "critical");
  assert.ok(presentation.edgeOpacity > 0);
  assert.ok(presentation.edgeEmphasis > 0.5);
});

test("5. focused unresolved", () => {
  const presentation = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({
      spatialRole: "focus",
      focused: true,
      status: "unresolved",
      statusClass: "unresolved",
      marker: "unresolved",
      stateEdgeOpacity: 0.28,
      labelLevel: "detail",
    }),
  );
  assert.equal(presentation.statusClass, "unresolved");
  assert.equal(presentation.primaryMarker, "unresolved");
  assert.equal(presentation.showFocusPedestal, true);
});

test("6. related normal / critical", () => {
  const normal = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({
      objectId: "rel-normal",
      spatialRole: "related",
      statusClass: "normal",
      labelLevel: "summary",
    }),
  );
  const critical = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({
      objectId: "rel-critical",
      spatialRole: "related",
      statusClass: "critical",
      stateEdgeOpacity: 0.46,
      marker: "critical",
      labelLevel: "summary",
    }),
  );
  assert.ok(critical.emphasisRank > normal.emphasisRank);
  assert.ok(critical.edgeEmphasis > normal.edgeEmphasis);
  assert.equal(critical.role, "related");
});

test("7. background normal / watch / critical / recommended", () => {
  const normal = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({ spatialRole: "background", statusClass: "normal" }),
  );
  const watch = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({
      spatialRole: "background",
      statusClass: "watch",
      stateEdgeOpacity: 0.3,
      marker: "attention",
    }),
  );
  const critical = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({
      spatialRole: "background",
      statusClass: "critical",
      stateEdgeOpacity: 0.48,
      marker: "critical",
      labelLevel: "identity",
    }),
  );
  const recommended = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({
      spatialRole: "background",
      statusClass: "normal",
      recommended: true,
    }),
  );
  assert.ok(critical.opacityFloor >= EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY.criticalFloor);
  assert.ok(watch.opacityFloor >= EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY.watchFloor);
  assert.ok(normal.opacityFloor >= EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY.normalFloor);
  assert.ok(critical.emphasisRank > watch.emphasisRank);
  assert.ok(watch.emphasisRank > normal.emphasisRank);
  assert.equal(recommended.recommendationCue, true);
  assert.equal(recommended.primaryMarker, "recommended");
  assert.equal(critical.showFocusPedestal, false);
  assert.equal(critical.role, "background");
});

test("8. deterministic output; input not mutated", () => {
  const input = baseInput({
    spatialRole: "focus",
    focused: true,
    statusClass: "critical",
    selected: true,
    hovered: true,
  });
  const snapshot = JSON.stringify(input);
  const a = resolveExecutiveObjectFocusAttentionPresentation(input);
  const b = resolveExecutiveObjectFocusAttentionPresentation(input);
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(input), snapshot);
});

test("9. role-order prominence relationships", () => {
  const focusNormal = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({ spatialRole: "focus", focused: true, statusClass: "normal" }),
  );
  const backgroundNormal = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({ spatialRole: "background", statusClass: "normal" }),
  );
  const relatedCritical = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({ spatialRole: "related", statusClass: "critical" }),
  );
  const relatedNormal = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({ spatialRole: "related", statusClass: "normal" }),
  );
  const criticalBackground = resolveExecutiveObjectFocusAttentionPresentation(
    baseInput({ spatialRole: "background", statusClass: "critical" }),
  );
  assert.ok(focusNormal.emphasisRank > backgroundNormal.emphasisRank);
  assert.ok(relatedCritical.emphasisRank > relatedNormal.emphasisRank);
  assert.ok(criticalBackground.emphasisRank > backgroundNormal.emphasisRank);
  // Focus owns scene composition even when background is critical.
  assert.ok(focusNormal.emphasisRank > criticalBackground.emphasisRank);
  assert.equal(focusNormal.showFocusPedestal, true);
  assert.equal(criticalBackground.showFocusPedestal, false);
});

test("10. critical background non-edge mandatory regression", () => {
  const focused = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-revenue",
    objectKind: "kpi",
    objectName: "Revenue",
    selected: true,
    focused: true,
    spatialRole: "focus",
    status: "stable",
    attention: "normal",
  });
  const backgroundCritical = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-capacity",
    objectKind: "problem",
    objectName: "Capacity",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
    rimIntensity: 0.8,
    compositionOpacity: 0.28,
  });
  assert.equal(focused.spatialRole, "focus");
  assert.equal(focused.focusAttention.role, "focus");
  assert.equal(focused.emphasis.showFocusPedestal, true);
  assert.equal(backgroundCritical.spatialRole, "background");
  assert.equal(backgroundCritical.focusAttention.role, "background");
  assert.equal(backgroundCritical.emphasis.focused, false);
  assert.equal(backgroundCritical.emphasis.stateClass, "critical");
  assert.ok(
    backgroundCritical.material.opacity >=
      EXECUTIVE_OBJECT_STATE_BACKGROUND_OPACITY.criticalFloor,
  );
  assert.equal(backgroundCritical.edge.mode, "attention");
  assert.ok(backgroundCritical.label.visible);
  assert.notEqual(focused.objectId, backgroundCritical.objectId);
  // No relationship invented — presentation has no connection fabrication.
  assert.equal("relationships" in backgroundCritical, false);
});

test("11. signal stacking remains bounded", () => {
  const stacked = resolveExecutiveObjectVisualPresentation({
    objectId: "stacked",
    objectKind: "problem",
    objectName: "Capacity",
    selected: true,
    focused: true,
    hovered: true,
    recommended: true,
    spatialRole: "focus",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
    rimIntensity: 1,
    occlusionState: "partial",
    primaryValue: "96%",
  });
  assert.ok(
    stacked.emphasis.visualEnergy <=
      EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS.maximumVisualEnergy,
  );
  assert.ok(
    stacked.material.emissiveIntensity <=
      EXECUTIVE_OBJECT_MATERIAL_BOUNDS.maximumEmissive,
  );
  assert.ok(
    stacked.edge.opacity <=
      EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS.maximumEdgeOpacity,
  );
  assert.equal(stacked.emphasis.marker, "critical");
  assert.equal(stacked.emphasis.recommendationCue, true);
  assert.equal(stacked.emphasis.suppressInteractionNoise, true);
  assert.equal(stacked.edge.mode, "attention");
  assert.equal(stacked.geometry.semanticFamily, "risk_problem");
  assert.deepEqual(stacked.connectionAnchor.localOffset, { x: 0, y: 0, z: 0 });
});

test("12. focused normal does not look critical", () => {
  const focusedNormal = resolveExecutiveObjectVisualPresentation({
    objectId: "focus-normal",
    objectKind: "kpi",
    objectName: "Revenue",
    selected: false,
    focused: true,
    spatialRole: "focus",
    status: "stable",
    attention: "normal",
  });
  const focusedCritical = resolveExecutiveObjectVisualPresentation({
    objectId: "focus-critical",
    objectKind: "problem",
    objectName: "Capacity",
    selected: false,
    focused: true,
    spatialRole: "focus",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  assert.equal(focusedNormal.material.surfaceTone, "object.surface.base");
  assert.equal(focusedCritical.material.surfaceTone, "object.surface.risk");
  assert.notEqual(focusedNormal.material.color, focusedCritical.material.color);
  assert.equal(focusedNormal.emphasis.stateClass, "normal");
  assert.equal(focusedNormal.emphasis.marker, "none");
  assert.equal(focusedNormal.focusAttention.preferStateEdge, false);
});

test("13. focused critical preserves both focus and severity", () => {
  const presentation = resolveExecutiveObjectVisualPresentation({
    objectId: "focus-critical",
    objectKind: "problem",
    objectName: "Capacity",
    selected: false,
    focused: true,
    spatialRole: "focus",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
    primaryValue: "96%",
  });
  assert.equal(presentation.emphasis.showFocusPedestal, true);
  assert.equal(presentation.emphasis.stateClass, "critical");
  assert.equal(presentation.label.level, "detail");
  assert.equal(presentation.edge.mode, "attention");
  assert.equal(presentation.focusAttention.primaryMarker, "critical");
});

test("14. recommendation remains distinct across roles", () => {
  const cases = [
    { spatialRole: "background" as const, focused: false, status: "stable" },
    {
      spatialRole: "background" as const,
      focused: false,
      status: "risk",
      attention: "critical" as const,
      stateMarker: "critical" as const,
    },
    { spatialRole: "related" as const, focused: false, status: "stable" },
    { spatialRole: "focus" as const, focused: true, status: "stable" },
  ];
  for (const next of cases) {
    const presentation = resolveExecutiveObjectVisualPresentation({
      objectId: `rec-${next.spatialRole}-${next.status}`,
      objectKind: "decision",
      objectName: "Decision",
      selected: false,
      focused: next.focused,
      spatialRole: next.spatialRole,
      status: next.status,
      attention: next.attention,
      stateMarker: next.stateMarker,
      recommended: true,
    });
    assert.equal(presentation.emphasis.recommendationCue, true);
    if (next.status === "risk") {
      assert.equal(presentation.emphasis.marker, "critical");
    }
  }
});

test("15. selected does not become focus presentation", () => {
  const selected = resolveExecutiveObjectVisualPresentation({
    objectId: "selected-bg",
    objectKind: "kpi",
    objectName: "Inventory",
    selected: true,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  assert.equal(selected.emphasis.focused, false);
  assert.equal(selected.emphasis.showFocusPedestal, false);
  assert.equal(selected.spatialRole, "background");
  assert.equal(selected.emphasis.selected, true);
  assert.equal(selected.emphasis.stateClass, "critical");
});

test("16. hover does not alter spatial role or state class", () => {
  const idle = resolveExecutiveObjectVisualPresentation({
    objectId: "hover-bg",
    objectKind: "kpi",
    objectName: "Inventory",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "watch",
    stateMarker: "attention",
  });
  const hovered = resolveExecutiveObjectVisualPresentation({
    objectId: "hover-bg",
    objectKind: "kpi",
    objectName: "Inventory",
    selected: false,
    focused: false,
    hovered: true,
    spatialRole: "background",
    status: "watch",
    stateMarker: "attention",
  });
  assert.equal(hovered.spatialRole, "background");
  assert.equal(hovered.emphasis.stateClass, idle.emphasis.stateClass);
  assert.equal(hovered.emphasis.hover, true);
  assert.equal(hovered.focusAttention.suppressInteractionNoise, true);
});

test("17. occlusion retains discoverability floors", () => {
  const criticalPartial = resolveExecutiveObjectVisualPresentation({
    objectId: "occ-critical",
    objectKind: "problem",
    objectName: "Capacity",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
    occlusionState: "partial",
    readabilityAssist: true,
  });
  const relatedSubstantial = resolveExecutiveObjectVisualPresentation({
    objectId: "occ-related",
    objectKind: "scenario",
    objectName: "Scenario",
    selected: false,
    focused: false,
    spatialRole: "related",
    status: "watch",
    occlusionState: "substantial",
    readabilityAssist: true,
  });
  assert.ok(criticalPartial.label.visible);
  assert.ok(criticalPartial.edge.opacity > 0);
  assert.ok(relatedSubstantial.focusAttention.labelEmphasis >= 0.55);
  assert.equal(criticalPartial.spatialRole, "background");
});

test("18. label integration with SP:2.5", () => {
  const focus = resolveExecutiveObjectVisualPresentation({
    objectId: "lbl-focus",
    objectKind: "kpi",
    objectName: "Revenue",
    selected: false,
    focused: true,
    spatialRole: "focus",
    primaryValue: "88%",
  });
  const related = resolveExecutiveObjectVisualPresentation({
    objectId: "lbl-related",
    objectKind: "scenario",
    objectName: "Scenario",
    selected: false,
    focused: false,
    spatialRole: "related",
    status: "watch",
  });
  const criticalBackground = resolveExecutiveObjectVisualPresentation({
    objectId: "lbl-critical",
    objectKind: "problem",
    objectName: "Capacity",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    densityProfile: "high-density",
    cameraDistance: 12.5,
  });
  const backgroundNormal = resolveExecutiveObjectVisualPresentation({
    objectId: "lbl-normal",
    objectKind: "kpi",
    objectName: "Inventory",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "stable",
  });
  assert.equal(focus.label.level, "detail");
  assert.ok(related.label.level === "summary" || related.label.level === "identity");
  assert.notEqual(criticalBackground.label.level, "detail");
  assert.ok(
    criticalBackground.label.stateText === "critical" ||
      criticalBackground.label.showStateCue,
  );
  assert.equal(backgroundNormal.label.level, "identity");
});

test("19. material ranges respected", () => {
  const presentation = resolveExecutiveObjectVisualPresentation({
    objectId: "mat-stack",
    objectKind: "problem",
    selected: true,
    focused: true,
    hovered: true,
    recommended: true,
    spatialRole: "focus",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
    occlusionState: "partial",
  });
  const bounds = EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS;
  assert.ok(presentation.material.roughness >= bounds.minimumRoughness);
  assert.ok(presentation.material.roughness <= bounds.maximumRoughness);
  assert.ok(presentation.material.metalness >= bounds.minimumMetalness);
  assert.ok(presentation.material.emissiveIntensity <= bounds.maximumEmissive);
  assert.ok(presentation.material.opacity >= bounds.minimumOpacity);
});

test("20. state hierarchy / geometry / spatial invariance", () => {
  const normal = resolveExecutiveObjectVisualPresentation({
    objectId: "inv-a",
    objectKind: "decision",
    objectName: "Decision",
    selected: false,
    focused: false,
    status: "stable",
  });
  const critical = resolveExecutiveObjectVisualPresentation({
    objectId: "inv-a",
    objectKind: "decision",
    objectName: "Decision",
    selected: true,
    focused: true,
    recommended: true,
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  assert.equal(normal.geometry.family, critical.geometry.family);
  assert.equal(normal.geometry.semanticFamily, critical.geometry.semanticFamily);
  assert.deepEqual(normal.dimensions, critical.dimensions);
  assert.ok(critical.scale <= EXECUTIVE_OBJECT_SCALE_ENVELOPE.maximumEmphasis);
  assert.equal(critical.emphasis.stateClass, "critical");
  assert.equal("position" in critical, false);
  assert.equal("camera" in critical, false);

  const geometry = resolveExecutiveObjectGeometryFamily({
    objectKind: "decision",
  });
  assert.equal(normal.geometry.family, geometry.geometryFamily);
});

test("21. many-critical scene stays bounded", () => {
  const presentations = ["a", "b", "c", "d"].map((id, index) =>
    resolveExecutiveObjectVisualPresentation({
      objectId: `crit-${id}`,
      objectKind: "problem",
      objectName: `Risk ${id}`,
      selected: index === 0,
      focused: index === 0,
      spatialRole: index === 0 ? "focus" : "background",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
      hovered: index === 1,
    }),
  );
  for (const presentation of presentations) {
    assert.equal(presentation.emphasis.stateClass, "critical");
    assert.ok(
      presentation.emphasis.visualEnergy <=
        EXECUTIVE_OBJECT_FOCUS_ATTENTION_ENERGY_BOUNDS.maximumVisualEnergy,
    );
  }
  assert.equal(presentations[0].emphasis.showFocusPedestal, true);
  assert.equal(presentations[1].spatialRole, "background");
});

test("22. mixed executive scene fixture", () => {
  const scene = [
    resolveExecutiveObjectVisualPresentation({
      objectId: "obj-revenue",
      objectKind: "kpi",
      objectName: "Revenue",
      selected: true,
      focused: true,
      spatialRole: "focus",
      status: "stable",
      primaryValue: "88%",
    }),
    resolveExecutiveObjectVisualPresentation({
      objectId: "obj-scenario",
      objectKind: "scenario",
      objectName: "Scenario",
      selected: false,
      focused: false,
      spatialRole: "related",
      status: "watch",
      stateMarker: "attention",
    }),
    resolveExecutiveObjectVisualPresentation({
      objectId: "obj-decision",
      objectKind: "decision",
      objectName: "Decision",
      selected: false,
      focused: false,
      spatialRole: "related",
      status: "stable",
      recommended: true,
    }),
    resolveExecutiveObjectVisualPresentation({
      objectId: "obj-capacity",
      objectKind: "problem",
      objectName: "Capacity",
      selected: false,
      focused: false,
      spatialRole: "background",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
    }),
    resolveExecutiveObjectVisualPresentation({
      objectId: "obj-inventory",
      objectKind: "kpi",
      objectName: "Inventory",
      selected: false,
      focused: false,
      spatialRole: "background",
      status: "stable",
    }),
    resolveExecutiveObjectVisualPresentation({
      objectId: "obj-cost",
      objectKind: "kpi",
      objectName: "Cost",
      selected: false,
      focused: false,
      spatialRole: "background",
      status: "unresolved",
      stateMarker: "unresolved",
    }),
  ];
  const byId = Object.fromEntries(scene.map((item) => [item.objectId, item]));
  assert.equal(byId["obj-revenue"].label.level, "detail");
  assert.equal(byId["obj-revenue"].emphasis.showFocusPedestal, true);
  assert.equal(byId["obj-capacity"].spatialRole, "background");
  assert.equal(byId["obj-capacity"].emphasis.stateClass, "critical");
  assert.ok(byId["obj-capacity"].label.visible);
  assert.equal(byId["obj-decision"].emphasis.recommendationCue, true);
  assert.equal(byId["obj-inventory"].label.level, "identity");
  assert.equal(byId["obj-cost"].emphasis.stateClass, "unresolved");
  assert.ok(
    byId["obj-revenue"].emphasis.emphasisRank >
      byId["obj-capacity"].emphasis.emphasisRank,
  );
  assert.ok(
    byId["obj-capacity"].emphasis.emphasisRank >
      byId["obj-inventory"].emphasis.emphasisRank,
  );
});

test("23. rapid focus switch uses latest intent", () => {
  const sequence = ["obj-revenue", "obj-capacity", "obj-delivery"] as const;
  let latest: string = sequence[0];
  for (const objectId of sequence) {
    latest = objectId;
    const presentation = resolveExecutiveObjectVisualPresentation({
      objectId,
      objectKind: objectId === "obj-capacity" ? "problem" : "kpi",
      objectName: objectId.replace("obj-", ""),
      selected: true,
      focused: true,
      spatialRole: "focus",
      status: objectId === "obj-capacity" ? "risk" : "stable",
      attention: objectId === "obj-capacity" ? "critical" : "normal",
    });
    assert.equal(presentation.objectId, latest);
    assert.equal(presentation.emphasis.focused, true);
    assert.equal(presentation.focusAttention.role, "focus");
  }
});

test("24. focus exit restores overview hierarchy while state persists", () => {
  const focused = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-capacity",
    objectKind: "problem",
    objectName: "Capacity",
    selected: true,
    focused: true,
    spatialRole: "focus",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
    primaryValue: "96%",
  });
  const cleared = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-capacity",
    objectKind: "problem",
    objectName: "Capacity",
    selected: false,
    focused: false,
    spatialRole: "overview",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  assert.equal(focused.label.level, "detail");
  assert.equal(focused.emphasis.showFocusPedestal, true);
  assert.equal(cleared.emphasis.showFocusPedestal, false);
  assert.equal(cleared.emphasis.stateClass, "critical");
  assert.notEqual(cleared.label.level, "detail");
  assert.ok(cleared.edge.mode === "attention" || cleared.label.showStateCue);
});

test("25. navigation remains finite; no camera ownership", () => {
  const target = Object.freeze({ x: 0, y: 0.2, z: 0 });
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target,
  });
  let nav = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (const action of ["orbit-left", "orbit-right", "tilt-up"] as const) {
    nav = applyExecutiveCameraNavigationAction(nav, action, base);
    const intent = resolveNavigatedExecutiveCameraIntent({
      mode: "overview",
      target,
      navigation: nav,
    });
    const presentation = resolveExecutiveCameraPresentation(intent);
    assert.ok(Number.isFinite(presentation.position.x));
  }
  assert.doesNotMatch(source, /orbit-left|zoom-in|cameraDistance\s*=/);
  const framing = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
  });
  assert.ok(Number.isFinite(framing.cameraDistance));
});

test("26. occlusion authority remains SP:1.8", () => {
  const visual = resolveExecutiveObjectVisualPresentation({
    objectId: "occ-b",
    objectKind: "problem",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    occlusionState: "partial",
  });
  const occlusion = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "occ-a",
        position: Object.freeze({ x: 0.2, y: 0.1, z: 1.1 }),
        radius: visual.connectionAnchor.radius,
      }),
      Object.freeze({
        objectId: "occ-b",
        position: Object.freeze({ x: 0.15, y: 0.12, z: -0.2 }),
        radius: visual.connectionAnchor.radius,
      }),
    ],
    cameraPosition: Object.freeze({ x: 3.8, y: 5.2, z: 7.6 }),
    cameraTarget: Object.freeze({ x: -0.22, y: 0.2, z: 0.02 }),
    fovDegrees: 38,
    aspect: 1.45,
  });
  assert.ok(occlusion.byId.has("occ-b"));
  assert.equal(visual.spatialRole, "background");
});

test("27. renderer/foundation consume SP:2.6 composition", () => {
  assert.match(
    foundationSource,
    /resolveExecutiveObjectFocusAttentionPresentation/,
  );
  assert.match(foundationSource, /focusAttention/);
  assert.match(stageObjectSource, /visualEmphasisRank|emphasis\.emphasisRank/);
  assert.doesNotMatch(stageObjectSource, /if\s*\(\s*status\s*===\s*["']critical["']/);
});
