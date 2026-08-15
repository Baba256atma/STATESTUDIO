/**
 * SP:2.8 — Executive Stage Visual Calibration & Human Sign-Off tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_DENSITY_COMPOSITION_SPREAD,
} from "./executiveDensityAwareFraming.ts";
import {
  EXECUTIVE_FOCUS_RELATED_LIMITS,
} from "./executiveFocusChoreography.ts";
import {
  EXECUTIVE_SAFE_FRAMING_MARGINS,
  EXECUTIVE_WORKSPACE_DIAL_EXCLUSION,
} from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_OBJECT_LABEL_FONT_TOKENS,
  resolveExecutiveObjectLabelPresentation,
} from "./executiveObjectLabelInformationDensity.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  resolveExecutiveSpatialComposition,
} from "./executiveSpatialComposition.ts";
import {
  certifyExecutiveObjectVisualIntegration,
} from "./executiveObjectVisualIntegrationCertification.ts";
import {
  EXECUTIVE_STAGE_VISUAL_CALIBRATION_BOUNDARY,
  EXECUTIVE_STAGE_VISUAL_CALIBRATION_FINDINGS,
  EXECUTIVE_STAGE_VISUAL_CALIBRATION_OWNERS,
  EXECUTIVE_STAGE_VISUAL_HUMAN_CATEGORIES,
  certifyExecutiveStageVisualCalibration,
  getExecutiveStageVisualCalibrationIdentity,
  verifyExecutiveStageVisualCalibration,
} from "./executiveStageVisualCalibration.ts";
import { resolveExecutiveObjectVisualPresentation } from "./executiveObjectVisualFoundation.ts";

const calibrationSource = readFileSync(
  new URL("./executiveStageVisualCalibration.ts", import.meta.url),
  "utf8",
);
const stageObjectSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraStageObject.tsx",
    import.meta.url,
  ),
  "utf8",
);
const labelSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraExecutiveObjectLabel.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("1. SP:2.8 identity and calibration-only boundary", () => {
  const identity = getExecutiveStageVisualCalibrationIdentity();
  assert.equal(identity.id, "SP:2.8/ExecutiveStageVisualCalibration");
  assert.equal(identity.version, "2.8.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-stage-visual-calibration",
  );
  assert.equal(identity.readiness, "AwaitingHumanVisualSignOff");
  assert.equal(
    EXECUTIVE_STAGE_VISUAL_CALIBRATION_BOUNDARY.startsSp3Atmosphere,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_VISUAL_CALIBRATION_BOUNDARY.autoClaimsHumanVisualSignOff,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_VISUAL_CALIBRATION_BOUNDARY.usesObjectIdHacks,
    false,
  );
  assert.equal(EXECUTIVE_STAGE_VISUAL_CALIBRATION_FINDINGS.length, 5);
  assert.equal(EXECUTIVE_STAGE_VISUAL_CALIBRATION_OWNERS.finalVisual, "SP:2.1");
  assert.equal(verifyExecutiveStageVisualCalibration().ok, true);
});

test("2. constellation spread increases breathing room within bounds", () => {
  const composition = resolveExecutiveSpatialComposition({
    objects: [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
    ].map((objectId) => Object.freeze({ objectId })),
  });
  assert.ok(
    EXECUTIVE_DENSITY_COMPOSITION_SPREAD.balanced.horizontalSpread >= 1.04,
  );
  assert.ok(EXECUTIVE_FOCUS_RELATED_LIMITS.relatedRadius >= 1.7);
  for (const entry of composition.objects) {
    assert.ok(entry.position.x >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minX);
    assert.ok(entry.position.x <= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxX);
    assert.ok(entry.position.z >= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minZ);
    assert.ok(entry.position.z <= EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxZ);
  }
  // Deterministic — identical inputs identical slots.
  const again = resolveExecutiveSpatialComposition({
    objects: composition.objects.map((entry) =>
      Object.freeze({ objectId: entry.objectId }),
    ),
  });
  assert.deepEqual(
    composition.objects.map((entry) => entry.slotId),
    again.objects.map((entry) => entry.slotId),
  );
});

test("3. overview labels compact to single-line state cues", () => {
  const watch = resolveExecutiveObjectLabelPresentation({
    objectId: "capacity",
    objectName: "Capacity",
    spatialRole: "overview",
    status: "watch",
    stateMarker: "attention",
  });
  const unresolved = resolveExecutiveObjectLabelPresentation({
    objectId: "budget",
    objectName: "Budget",
    spatialRole: "overview",
    status: "unresolved",
    stateMarker: "unresolved",
  });
  const criticalBg = resolveExecutiveObjectLabelPresentation({
    objectId: "capacity-bg",
    objectName: "Capacity",
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  assert.equal(watch.lines.length, 1);
  assert.match(watch.lines[0] ?? "", /CAPACITY · watch/i);
  assert.equal(unresolved.lines.length, 1);
  assert.match(unresolved.lines[0] ?? "", /BUDGET · unresolved/i);
  assert.ok(criticalBg.visible);
  assert.ok(criticalBg.showStateCue);
  assert.ok(EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.detail <= 11);
});

test("4. focus detail remains richer and compact", () => {
  const withValue = resolveExecutiveObjectLabelPresentation({
    objectId: "focus",
    objectName: "Capacity",
    focused: true,
    spatialRole: "focus",
    status: "watch",
    stateMarker: "attention",
    primaryValue: "88%",
  });
  const withoutValue = resolveExecutiveObjectLabelPresentation({
    objectId: "focus-2",
    objectName: "Capacity",
    focused: true,
    spatialRole: "focus",
    status: "watch",
    stateMarker: "attention",
  });
  assert.equal(withValue.level, "detail");
  assert.ok(withValue.lines.length <= 3);
  assert.match(withValue.lines.join(" "), /88%/);
  assert.match(withValue.lines.join(" "), /watch/i);
  assert.equal(withoutValue.level, "detail");
  assert.ok(withoutValue.lines.length <= 2);
});

test("5. label hierarchy preserved without font explosion", () => {
  const focus = resolveExecutiveObjectLabelPresentation({
    objectId: "f",
    objectName: "Revenue",
    focused: true,
    spatialRole: "focus",
  });
  const critical = resolveExecutiveObjectLabelPresentation({
    objectId: "c",
    objectName: "Capacity",
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  const related = resolveExecutiveObjectLabelPresentation({
    objectId: "r",
    objectName: "Scenario",
    spatialRole: "related",
  });
  const background = resolveExecutiveObjectLabelPresentation({
    objectId: "b",
    objectName: "Inventory",
    spatialRole: "background",
  });
  assert.ok(focus.priorityRank > critical.priorityRank);
  assert.ok(critical.priorityRank > related.priorityRank);
  assert.ok(related.priorityRank > background.priorityRank);
  assert.ok(focus.fontSizePx <= 11);
  assert.ok(focus.scale <= 1.08);
});

test("6. connection hierarchy quieter background; no invented edges", () => {
  const result = certifyExecutiveStageVisualCalibration();
  assert.equal(result.checks.connectionHierarchy, true);
  assert.equal(result.checks.nonEdge, true);
  const revenue = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-revenue",
    objectKind: "kpi",
    objectName: "Revenue",
    focused: true,
    selected: true,
    spatialRole: "focus",
    status: "stable",
  });
  const capacity = resolveExecutiveObjectVisualPresentation({
    objectId: "obj-capacity",
    objectKind: "problem",
    objectName: "Capacity",
    selected: false,
    focused: false,
    spatialRole: "background",
    status: "risk",
    attention: "critical",
    stateMarker: "critical",
  });
  assert.equal(revenue.emphasis.showFocusPedestal, true);
  assert.equal(capacity.spatialRole, "background");
  assert.equal(capacity.emphasis.stateClass, "critical");
});

test("7. Dial exclusion is generic and stronger", () => {
  assert.ok(EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.minNdcX <= 0.45);
  assert.ok(EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.maxNdcY <= -0.28);
  assert.ok(EXECUTIVE_SAFE_FRAMING_MARGINS.right >= 0.3);
  assert.ok(EXECUTIVE_SAFE_FRAMING_MARGINS.bottom >= 0.28);
  assert.doesNotMatch(stageObjectSource, /objectId\s*===\s*["']risk["']/i);
  assert.doesNotMatch(labelSource, /objectId\s*===\s*["']risk["']/i);
  assert.equal(certifyExecutiveStageVisualCalibration().checks.dialExclusion, true);
});

test("8. Delivery-like occlusion remains generic", () => {
  assert.equal(certifyExecutiveStageVisualCalibration().checks.occlusion, true);
  assert.doesNotMatch(calibrationSource, /objectId\s*===\s*["']delivery["']/i);
});

test("9. dense / focus / many-critical checks pass", () => {
  const result = certifyExecutiveStageVisualCalibration();
  assert.equal(result.checks.denseScene, true);
  assert.equal(result.checks.focusScene, true);
  assert.equal(result.checks.manyCritical, true);
});

test("10. focus pedestal is restrained after calibration", () => {
  assert.match(stageObjectSource, /ringGeometry args=\{\[0\.5,\s*0\.68/);
  assert.match(stageObjectSource, /opacity=\{0\.32\}/);
});

test("11. SP:2.7 Level A+B remain certified after calibration", () => {
  const sp27 = certifyExecutiveObjectVisualIntegration();
  assert.equal(sp27.structuralStatus, "certified");
  assert.equal(sp27.automatedStatus, "certified");
  const sp28 = certifyExecutiveStageVisualCalibration();
  assert.equal(sp28.sp27Recertification.structuralStatus, "certified");
  assert.equal(sp28.sp27Recertification.automatedStatus, "certified");
  assert.equal(sp28.automatedStatus, "certified");
  assert.equal(sp28.humanVisualStatus, "pending");
  assert.equal(EXECUTIVE_STAGE_VISUAL_HUMAN_CATEGORIES.length, 15);
  for (const category of EXECUTIVE_STAGE_VISUAL_HUMAN_CATEGORIES) {
    assert.equal(sp28.humanCategories[category], "not-inspected");
  }
});

test("12. no SP:3 work and no auto human sign-off", () => {
  assert.doesNotMatch(calibrationSource, /fog|bloom|SSAO|postprocessing/i);
  assert.doesNotMatch(calibrationSource, /startsSp3Atmosphere:\s*true/);
  assert.equal(
    verifyExecutiveStageVisualCalibration().doesNotStartSp3,
    true,
  );
});
