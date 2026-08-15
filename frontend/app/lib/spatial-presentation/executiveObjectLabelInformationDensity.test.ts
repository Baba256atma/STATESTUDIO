/**
 * SP:2.5 — Executive Label & Information Density System tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS,
  EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY,
  EXECUTIVE_OBJECT_LABEL_INFORMATION_PRIORITY,
  applyExecutiveObjectLabelCollisionAdjustment,
  estimateExecutiveObjectLabelScreenBounds,
  executiveObjectLabelInformationDensityIdentity,
  getExecutiveObjectLabelInformationDensityIdentity,
  projectExecutiveObjectLabelToNdc,
  resolveExecutiveObjectLabelCollisions,
  resolveExecutiveObjectLabelPresentation,
  resolveExecutiveObjectLabelPriorityRank,
  verifyExecutiveObjectLabelInformationDensity,
  type ExecutiveObjectLabelInput,
  type ExecutiveObjectLabelPresentation,
} from "./executiveObjectLabelInformationDensity.ts";
import { resolveExecutiveObjectVisualPresentation } from "./executiveObjectVisualFoundation.ts";
import { resolveExecutiveObjectGeometryFamily } from "./executiveObjectGeometryLanguage.ts";
import { resolveExecutiveObjectStateVisualPresentation } from "./executiveObjectStateVisualHierarchy.ts";
import { resolveExecutiveObjectMaterialPresentation } from "./executiveObjectMaterialSurface.ts";
import { resolveExecutiveObjectOcclusion } from "./executiveObjectOcclusion.ts";
import {
  applyExecutiveCameraNavigationAction,
  INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
  resolveExecutiveCameraNavigationBaseIntent,
  resolveNavigatedExecutiveCameraIntent,
} from "./executiveCameraNavigation.ts";
import { resolveExecutiveCameraPresentation } from "./executiveCameraFoundation.ts";
import { resolveExecutiveDensityAwareFraming } from "./executiveDensityAwareFraming.ts";

const source = readFileSync(
  new URL("./executiveObjectLabelInformationDensity.ts", import.meta.url),
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

const labelRendererSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraExecutiveObjectLabel.tsx",
    import.meta.url,
  ),
  "utf8",
);

const sceneSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraStageScene.tsx",
    import.meta.url,
  ),
  "utf8",
);

function baseInput(
  overrides: Partial<ExecutiveObjectLabelInput> = {},
): ExecutiveObjectLabelInput {
  return Object.freeze({
    objectId: "obj-revenue",
    objectName: "Revenue",
    objectKind: "kpi",
    status: "stable",
    attention: "normal",
    spatialRole: "overview",
    densityProfile: "balanced",
    cameraDistance: 10.35,
    ...overrides,
  });
}

function levelRank(level: ExecutiveObjectLabelPresentation["level"]): number {
  return level === "detail" ? 3 : level === "summary" ? 2 : 1;
}

test("1. SP:2.5 identity and presentation-only boundary", () => {
  const identity = getExecutiveObjectLabelInformationDensityIdentity();
  assert.equal(identity.id, executiveObjectLabelInformationDensityIdentity);
  assert.equal(identity.version, "2.5.0");
  assert.equal(
    identity.upstreamStateVisualHierarchy,
    "SP:2.4/ExecutiveObjectStateVisualHierarchy",
  );
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY.ownsBusinessTruth,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY.inventsPrimaryValues,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY.usesObjectIdLabelHacks,
    false,
  );
  assert.equal(
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY
      .startsFocusAttentionPolish,
    false,
  );
  assert.equal(verifyExecutiveObjectLabelInformationDensity().ok, true);
  assert.doesNotMatch(source, /from ["']@react-three/);
  assert.doesNotMatch(source, /from ["']three["']/);
  assert.doesNotMatch(source, /objectId\s*===\s*["']delivery["']/i);
  assert.doesNotMatch(source, /objectName\s*===\s*["']Delivery["']/);
  assert.deepEqual(
    [...EXECUTIVE_OBJECT_LABEL_INFORMATION_PRIORITY],
    [
      "identity",
      "stateCue",
      "recommendationCue",
      "primaryValue",
      "metricLabel",
      "secondaryContext",
    ],
  );
});

test("2. sparse overview allows summary", () => {
  const presentation = resolveExecutiveObjectLabelPresentation(
    baseInput({
      densityProfile: "sparse",
      cameraDistance: 9.2,
      spatialRole: "overview",
    }),
  );
  assert.equal(presentation.level, "summary");
  assert.equal(presentation.showName, true);
  assert.equal(presentation.visible, true);
});

test("3. balanced overview uses summary for normal overview objects", () => {
  const presentation = resolveExecutiveObjectLabelPresentation(
    baseInput({ densityProfile: "balanced" }),
  );
  assert.equal(presentation.level, "summary");
  assert.equal(presentation.showName, true);
});

test("4. dense overview reduces background to identity", () => {
  const presentation = resolveExecutiveObjectLabelPresentation(
    baseInput({
      densityProfile: "dense",
      spatialRole: "background",
      status: "stable",
    }),
  );
  assert.equal(presentation.level, "identity");
  assert.equal(presentation.showPrimaryValue, false);
});

test("5. high-density overview is identity-first", () => {
  const presentation = resolveExecutiveObjectLabelPresentation(
    baseInput({
      densityProfile: "high-density",
      cameraDistance: 12.6,
      spatialRole: "overview",
    }),
  );
  assert.equal(presentation.level, "identity");
  assert.equal(presentation.lines.length <= 1 || presentation.showStateCue, true);
});

test("6. focused object always receives detail", () => {
  const presentation = resolveExecutiveObjectLabelPresentation(
    baseInput({
      focused: true,
      spatialRole: "focus",
      primaryValue: "96%",
      densityProfile: "high-density",
      cameraDistance: 13,
    }),
  );
  assert.equal(presentation.level, "detail");
  assert.equal(presentation.showName, true);
  assert.equal(presentation.showPrimaryValue, true);
  assert.equal(presentation.primaryValueText, "96%");
  assert.ok(presentation.lines.length <= 3);
});

test("7. background normal reduces appropriately", () => {
  const presentation = resolveExecutiveObjectLabelPresentation(
    baseInput({
      spatialRole: "background",
      status: "stable",
      densityProfile: "balanced",
    }),
  );
  assert.equal(presentation.level, "identity");
  assert.equal(presentation.showStateCue, false);
  assert.equal(presentation.showPrimaryValue, false);
  assert.equal(presentation.nameText, "REVENUE");
});

test("8. background critical remains discoverable", () => {
  const presentation = resolveExecutiveObjectLabelPresentation(
    baseInput({
      objectId: "obj-capacity",
      objectName: "Capacity",
      spatialRole: "background",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
      densityProfile: "high-density",
      cameraDistance: 12.8,
    }),
  );
  assert.equal(presentation.statusClass, "critical");
  assert.equal(presentation.visible, true);
  assert.equal(presentation.showName, true);
  assert.notEqual(presentation.level, "detail");
  assert.ok(
    presentation.stateText === "critical" || presentation.showStateCue === true,
  );
  assert.match(presentation.lines.join(" "), /CAPACITY/i);
  assert.match(presentation.lines.join(" "), /critical/i);
});

test("9. distance reduces information progressively", () => {
  const near = resolveExecutiveObjectLabelPresentation(
    baseInput({ cameraDistance: 7.5, densityProfile: "sparse" }),
  );
  const far = resolveExecutiveObjectLabelPresentation(
    baseInput({ cameraDistance: 13.5, densityProfile: "balanced" }),
  );
  assert.ok(levelRank(near.level) >= levelRank(far.level));
  assert.equal(far.level, "identity");
});

test("10. identical inputs → identical output; no mutation", () => {
  const input = baseInput({
    status: "watch",
    attention: "important",
    primaryValue: "92%",
  });
  const snapshot = JSON.stringify(input);
  const a = resolveExecutiveObjectLabelPresentation(input);
  const b = resolveExecutiveObjectLabelPresentation(input);
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(input), snapshot);
});

test("11. information priority — reduction removes lower-priority first", () => {
  const detail = resolveExecutiveObjectLabelPresentation(
    baseInput({
      focused: true,
      spatialRole: "focus",
      primaryValue: "91%",
      primaryMetricLabel: "Delivery",
      status: "watch",
      recommended: true,
    }),
  );
  assert.equal(detail.level, "detail");
  assert.equal(detail.showName, true);
  assert.equal(detail.showPrimaryValue, true);

  const summary = resolveExecutiveObjectLabelPresentation(
    baseInput({
      spatialRole: "overview",
      status: "watch",
      primaryValue: "91%",
      densityProfile: "balanced",
      cameraDistance: 10,
    }),
  );
  assert.equal(summary.level, "summary");
  assert.equal(summary.showName, true);

  const identity = resolveExecutiveObjectLabelPresentation(
    baseInput({
      spatialRole: "background",
      status: "stable",
      primaryValue: "91%",
      densityProfile: "high-density",
      cameraDistance: 13,
    }),
  );
  assert.equal(identity.level, "identity");
  assert.equal(identity.showPrimaryValue, false);
  assert.equal(identity.showName, true);
});

test("12. focus owns detail; related/background stay restrained", () => {
  const focus = resolveExecutiveObjectLabelPresentation(
    baseInput({
      focused: true,
      spatialRole: "focus",
      primaryValue: "88%",
    }),
  );
  const related = resolveExecutiveObjectLabelPresentation(
    baseInput({
      objectId: "obj-scenario",
      objectName: "Scenario",
      spatialRole: "related",
      status: "stable",
      densityProfile: "dense",
    }),
  );
  const background = resolveExecutiveObjectLabelPresentation(
    baseInput({
      objectId: "obj-other",
      objectName: "Inventory",
      spatialRole: "background",
      status: "stable",
    }),
  );
  assert.equal(focus.level, "detail");
  assert.ok(levelRank(related.level) < levelRank(focus.level));
  assert.equal(background.level, "identity");
});

test("13. critical background mandatory regression", () => {
  const focused = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-revenue",
    objectKind: "kpi",
    objectName: "Revenue",
    selected: true,
    focused: true,
    spatialRole: "focus",
    status: "stable",
    attention: "normal",
    densityProfile: "balanced",
    cameraDistance: 10.35,
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
    densityProfile: "high-density",
    cameraDistance: 12.5,
  });
  assert.equal(focused.spatialRole, "focus");
  assert.equal(focused.label.level, "detail");
  assert.equal(backgroundCritical.spatialRole, "background");
  assert.equal(backgroundCritical.label.statusClass, "critical");
  assert.equal(backgroundCritical.label.visible, true);
  assert.equal(backgroundCritical.label.showName, true);
  assert.notEqual(backgroundCritical.label.level, "detail");
  assert.ok(
    backgroundCritical.label.stateText === "critical" ||
      backgroundCritical.label.showStateCue,
  );
  assert.equal(backgroundCritical.emphasis.focused, false);
});

test("14. recommendation remains distinct from severity", () => {
  const normalRecommended = resolveExecutiveObjectLabelPresentation(
    baseInput({ recommended: true, status: "stable" }),
  );
  const watchRecommended = resolveExecutiveObjectLabelPresentation(
    baseInput({ recommended: true, status: "watch" }),
  );
  const criticalRecommended = resolveExecutiveObjectLabelPresentation(
    baseInput({
      recommended: true,
      status: "risk",
      attention: "critical",
      focused: true,
      spatialRole: "focus",
      primaryValue: "96%",
    }),
  );
  assert.equal(normalRecommended.recommendationCue, true);
  assert.equal(normalRecommended.statusClass, "normal");
  assert.ok(
    normalRecommended.stateText === "recommended" ||
      normalRecommended.showStateCue,
  );
  assert.equal(watchRecommended.statusClass, "watch");
  assert.equal(watchRecommended.stateText, "watch");
  assert.equal(criticalRecommended.statusClass, "critical");
  assert.equal(criticalRecommended.stateText, "critical");
  assert.equal(criticalRecommended.recommendationCue, true);
});

test("15. unresolved retains identity + uncertainty cue", () => {
  const presentation = resolveExecutiveObjectLabelPresentation(
    baseInput({
      objectName: "Cost",
      status: "unresolved",
      stateMarker: "unresolved",
      spatialRole: "overview",
    }),
  );
  assert.equal(presentation.statusClass, "unresolved");
  assert.equal(presentation.visible, true);
  assert.equal(presentation.showName, true);
  assert.equal(presentation.stateText, "unresolved");
  assert.doesNotMatch(presentation.lines.join(" "), /ERROR|FAILED/i);
});

test("16. near/normal/far progressive disclosure", () => {
  const near = resolveExecutiveObjectLabelPresentation(
    baseInput({ cameraDistance: 7 }),
  );
  const normal = resolveExecutiveObjectLabelPresentation(
    baseInput({ cameraDistance: 10.35 }),
  );
  const far = resolveExecutiveObjectLabelPresentation(
    baseInput({ cameraDistance: 13 }),
  );
  assert.ok(levelRank(near.level) >= levelRank(normal.level));
  assert.ok(levelRank(normal.level) >= levelRank(far.level));
  assert.equal(far.level, "identity");
});

test("17. density profile changes presentation without changing truth", () => {
  const sparse = resolveExecutiveObjectLabelPresentation(
    baseInput({ densityProfile: "sparse", status: "watch" }),
  );
  const high = resolveExecutiveObjectLabelPresentation(
    baseInput({
      densityProfile: "high-density",
      status: "watch",
      cameraDistance: 12.8,
    }),
  );
  assert.equal(sparse.statusClass, "watch");
  assert.equal(high.statusClass, "watch");
  assert.ok(levelRank(sparse.level) >= levelRank(high.level));
});

test("18. collision priority — focus and critical survive", () => {
  const result = resolveExecutiveObjectLabelCollisions({
    candidates: [
      Object.freeze({
        objectId: "focus",
        priorityRank: 120,
        stageOrder: 0,
        level: "detail" as const,
        prominence: "full" as const,
        visible: true,
        screenX: 100,
        screenY: 100,
        width: 80,
        height: 28,
      }),
      Object.freeze({
        objectId: "normal-bg",
        priorityRank: 12,
        stageOrder: 1,
        level: "identity" as const,
        prominence: "minimal" as const,
        visible: true,
        screenX: 105,
        screenY: 102,
        width: 70,
        height: 20,
      }),
      Object.freeze({
        objectId: "critical-bg",
        priorityRank: 68,
        stageOrder: 2,
        level: "identity" as const,
        prominence: "normal" as const,
        visible: true,
        screenX: 400,
        screenY: 400,
        width: 70,
        height: 20,
      }),
      Object.freeze({
        objectId: "normal-bg-2",
        priorityRank: 10,
        stageOrder: 3,
        level: "identity" as const,
        prominence: "minimal" as const,
        visible: true,
        screenX: 402,
        screenY: 401,
        width: 70,
        height: 20,
      }),
    ],
    viewportWidth: 1280,
    viewportHeight: 720,
  });
  assert.equal(result.byId.get("focus")?.visible, true);
  assert.equal(result.byId.get("critical-bg")?.visible, true);
  const normal = result.byId.get("normal-bg");
  assert.ok(normal);
  assert.ok(
    normal.visible === false ||
      normal.action === "offset" ||
      normal.action === "reduce-level" ||
      normal.action === "reduce-prominence" ||
      normal.action === "hide",
  );
});

test("19. collision displacement stays within bounds", () => {
  const result = resolveExecutiveObjectLabelCollisions({
    candidates: Array.from({ length: 6 }, (_, index) =>
      Object.freeze({
        objectId: `obj-${index}`,
        priorityRank: 30 - index,
        stageOrder: index,
        level: "summary" as const,
        prominence: "normal" as const,
        visible: true,
        screenX: 200,
        screenY: 200,
        width: 90,
        height: 24,
      }),
    ),
    viewportWidth: 1280,
    viewportHeight: 720,
  });
  for (const adjustment of result.adjustments) {
    assert.ok(
      Math.abs(adjustment.screenOffsetX) <=
        EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS.maxScreenOffsetX,
    );
    assert.ok(
      Math.abs(adjustment.screenOffsetY) <=
        EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS.maxScreenOffsetY,
    );
  }
});

test("20. UI exclusion / screen-edge safe response", () => {
  const dialZone = resolveExecutiveObjectLabelCollisions({
    candidates: [
      Object.freeze({
        objectId: "near-dial",
        priorityRank: 20,
        stageOrder: 0,
        level: "summary" as const,
        prominence: "normal" as const,
        visible: true,
        screenX: 1200,
        screenY: 680,
        width: 80,
        height: 22,
      }),
    ],
    viewportWidth: 1280,
    viewportHeight: 720,
  });
  const adjustment = dialZone.byId.get("near-dial");
  assert.ok(adjustment);
  assert.ok(
    adjustment.action === "offset" ||
      adjustment.screenOffsetY !== 0 ||
      adjustment.visible === true,
  );
});

test("21. Delivery-like occlusion — identity remains discoverable", () => {
  const visual = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-delivery",
    objectKind: "kpi",
    objectName: "Delivery",
    selected: false,
    focused: false,
    status: "watch",
    attention: "elevated",
    occlusionState: "partial",
    readabilityAssist: true,
    silhouetteAssist: true,
    densityProfile: "balanced",
    cameraDistance: 10.35,
  });
  assert.equal(visual.label.visible, true);
  assert.equal(visual.label.showName, true);
  assert.match(visual.label.nameText, /DELIVERY/);

  const focused = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-delivery",
    objectKind: "kpi",
    objectName: "Delivery",
    selected: true,
    focused: true,
    spatialRole: "focus",
    status: "watch",
    primaryValue: "91%",
    occlusionState: "partial",
  });
  assert.equal(focused.label.level, "detail");
  assert.equal(focused.label.primaryValueText, "91%");

  const occlusion = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "front",
        position: Object.freeze({ x: 0.2, y: 0.1, z: 1.1 }),
        radius: visual.connectionAnchor.radius,
      }),
      Object.freeze({
        objectId: "obj-delivery",
        position: Object.freeze({ x: 0.15, y: 0.12, z: -0.2 }),
        radius: visual.connectionAnchor.radius,
      }),
    ],
    cameraPosition: Object.freeze({ x: 3.8, y: 5.2, z: 7.6 }),
    cameraTarget: Object.freeze({ x: -0.22, y: 0.2, z: 0.02 }),
    fovDegrees: 38,
    aspect: 1.45,
  });
  assert.ok(occlusion.byId.has("obj-delivery"));
});

test("22. navigation projection remains finite and upright contract", () => {
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
    const camera = resolveExecutiveCameraPresentation(intent);
    const ndc = projectExecutiveObjectLabelToNdc({
      world: { x: 0.5, y: 0.8, z: 0.2 },
      cameraPosition: camera.position,
      cameraTarget: camera.target,
      fovDegrees: camera.fov,
      aspect: 1.45,
    });
    assert.ok(Number.isFinite(ndc.x));
    assert.ok(Number.isFinite(ndc.y));
  }
  const label = resolveExecutiveObjectLabelPresentation(baseInput());
  assert.equal(label.anchor.faceCamera, true);
  assert.equal(label.anchor.upright, true);
});

test("23. long names truncate without uncontrolled width", () => {
  const long = resolveExecutiveObjectLabelPresentation(
    baseInput({
      objectName: "Strategic Enterprise Capacity Planning Unit",
      spatialRole: "background",
    }),
  );
  assert.ok(long.nameText.length <= long.maxNameCharacters);
  assert.match(long.nameText, /…$/);
  const short = resolveExecutiveObjectLabelPresentation(
    baseInput({ objectName: "Risk" }),
  );
  assert.equal(short.nameText, "RISK");
});

test("24. values — present, missing, no invented placeholders", () => {
  const withValue = resolveExecutiveObjectLabelPresentation(
    baseInput({
      focused: true,
      spatialRole: "focus",
      primaryValue: "87%",
    }),
  );
  assert.equal(withValue.showPrimaryValue, true);
  assert.equal(withValue.primaryValueText, "87%");

  const missing = resolveExecutiveObjectLabelPresentation(
    baseInput({ focused: true, spatialRole: "focus" }),
  );
  assert.equal(missing.showPrimaryValue, false);
  assert.equal(missing.primaryValueText, null);
  assert.doesNotMatch(missing.lines.join(" "), /N\/A|undefined|null/i);

  const currency = resolveExecutiveObjectLabelPresentation(
    baseInput({
      focused: true,
      spatialRole: "focus",
      primaryValue: "$12.4M",
    }),
  );
  assert.equal(currency.primaryValueText, "$12.4M");
});

test("25. SP:2.4 / SP:2.3 / SP:2.2 compatibility", () => {
  const state = resolveExecutiveObjectStateVisualPresentation({
    status: "risk",
    attention: "critical",
  });
  const label = resolveExecutiveObjectLabelPresentation(
    baseInput({ status: "risk", attention: "critical" }),
  );
  assert.equal(label.statusClass, state.statusClass);

  const material = resolveExecutiveObjectMaterialPresentation({
    geometryFamily: "block",
    semanticFamily: "operational",
    status: "risk",
    attention: "critical",
  });
  assert.equal(material.surfaceTone, "object.surface.risk");

  for (const kind of ["object", "goal", "kpi", "problem", "decision"] as const) {
    const geometry = resolveExecutiveObjectGeometryFamily({ objectKind: kind });
    const visual = resolveExecutiveObjectVisualPresentation({
      objectId: `label-${kind}`,
      objectKind: kind,
      objectName: kind,
      selected: false,
      focused: false,
    });
    assert.equal(visual.geometry.family, geometry.geometryFamily);
    assert.equal(visual.label.objectId, `label-${kind}`);
    assert.ok(visual.label.anchor.offset > visual.dimensions.height * 0.5);
  }
});

test("26. spatial invariance — labels do not alter XYZ/camera/focus/density", () => {
  const normal = resolveExecutiveObjectVisualPresentation({
    objectId: "spatial-a",
    objectKind: "kpi",
    objectName: "Revenue",
    selected: false,
    focused: false,
    status: "stable",
  });
  const critical = resolveExecutiveObjectVisualPresentation({
    objectId: "spatial-a",
    objectKind: "kpi",
    objectName: "Revenue",
    selected: false,
    focused: false,
    status: "risk",
    attention: "critical",
  });
  assert.equal(normal.scale, critical.scale);
  assert.deepEqual(normal.dimensions, critical.dimensions);
  assert.equal("position" in normal, false);

  const framing = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
  });
  assert.ok(Number.isFinite(framing.cameraDistance));
});

test("27. renderer is dumb — no status branching in label JSX", () => {
  assert.match(foundationSource, /resolveExecutiveObjectLabelPresentation/);
  assert.match(stageObjectSource, /NexoraExecutiveObjectLabel/);
  assert.match(sceneSource, /resolveExecutiveObjectLabelCollisions/);
  assert.match(labelRendererSource, /label\.lines/);
  assert.match(labelRendererSource, /pointerEvents/);
  assert.doesNotMatch(labelRendererSource, /status\s*===\s*["']critical["']/);
  assert.doesNotMatch(labelRendererSource, /attention\s*===\s*["']critical["']/);
  assert.doesNotMatch(stageObjectSource, /if\s*\(\s*status\s*===\s*["']critical["']/);
});

test("28. hover/selected promote information without becoming focus detail", () => {
  const idle = resolveExecutiveObjectLabelPresentation(
    baseInput({ spatialRole: "background", status: "stable" }),
  );
  const hovered = resolveExecutiveObjectLabelPresentation(
    baseInput({
      spatialRole: "background",
      status: "stable",
      hovered: true,
    }),
  );
  const selected = resolveExecutiveObjectLabelPresentation(
    baseInput({
      spatialRole: "overview",
      status: "stable",
      selected: true,
    }),
  );
  assert.equal(idle.level, "identity");
  assert.ok(levelRank(hovered.level) >= levelRank(idle.level));
  assert.equal(selected.level, "summary");
  assert.notEqual(hovered.level, "detail");
});

test("29. collision apply preserves ownership offsets", () => {
  const base = resolveExecutiveObjectLabelPresentation(
    baseInput({ focused: true, spatialRole: "focus", primaryValue: "96%" }),
  );
  const adjusted = applyExecutiveObjectLabelCollisionAdjustment(base, {
    objectId: base.objectId,
    visible: true,
    level: "summary",
    prominence: "normal",
    screenOffsetX: 12,
    screenOffsetY: -14,
    action: "reduce-level",
  });
  assert.equal(adjusted.level, "summary");
  assert.equal(adjusted.anchor.screenOffsetX, 12);
  assert.equal(adjusted.anchor.screenOffsetY, -14);
  assert.ok(
    Math.abs(adjusted.anchor.screenOffsetY) <=
      EXECUTIVE_OBJECT_LABEL_COLLISION_BOUNDS.maxScreenOffsetY,
  );
});

test("30. priority rank is deterministic and ordered", () => {
  const focus = resolveExecutiveObjectLabelPriorityRank({
    focused: true,
    spatialRole: "focus",
  });
  const critical = resolveExecutiveObjectLabelPriorityRank({
    status: "risk",
    attention: "critical",
    spatialRole: "background",
  });
  const normal = resolveExecutiveObjectLabelPriorityRank({
    status: "stable",
    spatialRole: "background",
  });
  assert.ok(focus > critical);
  assert.ok(critical > normal);
});

test("31. estimated bounds are finite", () => {
  const bounds = estimateExecutiveObjectLabelScreenBounds({
    lines: ["CAPACITY", "96% · critical"],
    fontSizePx: 12,
    screenX: 100,
    screenY: 80,
  });
  assert.ok(Number.isFinite(bounds.width));
  assert.ok(Number.isFinite(bounds.height));
  assert.ok(bounds.width <= 220);
});
