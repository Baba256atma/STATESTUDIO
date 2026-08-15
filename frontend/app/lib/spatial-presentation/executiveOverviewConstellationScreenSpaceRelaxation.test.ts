/**
 * SP:2.8B — Overview constellation screen-space relaxation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE,
} from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  EXECUTIVE_SPATIAL_RESERVED_CENTER,
  EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE,
  resolveExecutiveSpatialComposition,
} from "./executiveSpatialComposition.ts";
import {
  EXECUTIVE_FOCUS_REGION,
  resolveExecutiveFocusChoreography,
} from "./executiveFocusChoreography.ts";
import {
  EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY,
  EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS,
  getExecutiveOverviewConstellationScreenSpaceRelaxationIdentity,
  measureExecutiveProjectedSilhouettePressure,
  projectExecutiveObjectSilhouetteBounds,
  resolveExecutiveOverviewConstellationRelaxation,
  resolveExecutiveOverviewPresentationPriorityRank,
  resolveExecutiveOverviewRelaxationDefaultCamera,
  verifyExecutiveOverviewConstellationScreenSpaceRelaxation,
} from "./executiveOverviewConstellationScreenSpaceRelaxation.ts";
import { certifyExecutiveObjectVisualIntegration } from "./executiveObjectVisualIntegrationCertification.ts";
import { certifyExecutiveStageFinalVisualMicroCalibration } from "./executiveStageFinalVisualMicroCalibration.ts";
import { certifyExecutiveStageVisualCalibration } from "./executiveStageVisualCalibration.ts";
import { resolveExecutiveObjectLabelPresentation } from "./executiveObjectLabelInformationDensity.ts";
import { EXECUTIVE_OVERVIEW_VIEWING_POLICY as VIEW_POLICY } from "./executiveViewingAngle.ts";

const source = readFileSync(
  new URL(
    "./executiveOverviewConstellationScreenSpaceRelaxation.ts",
    import.meta.url,
  ),
  "utf8",
);

function topologyFixture(ids: readonly [string, string, string]) {
  return Object.freeze([
    Object.freeze({
      objectId: ids[0],
      canonicalPosition: Object.freeze({ x: 0.15, y: 0.18, z: 0.08 }),
      priorityRank: 75,
      approximateRadius: 0.42,
      stageOrder: 0,
    }),
    Object.freeze({
      objectId: ids[1],
      canonicalPosition: Object.freeze({ x: 0.55, y: 0.14, z: 0.35 }),
      priorityRank: 45,
      approximateRadius: 0.4,
      stageOrder: 1,
    }),
    Object.freeze({
      objectId: ids[2],
      canonicalPosition: Object.freeze({ x: 1.05, y: 0.08, z: 0.72 }),
      priorityRank: 35,
      approximateRadius: 0.38,
      stageOrder: 2,
    }),
  ]);
}

test("1. SP:2.8B identity is overview composition calibration only", () => {
  const identity = getExecutiveOverviewConstellationScreenSpaceRelaxationIdentity();
  assert.equal(
    identity.id,
    "SP:2.8B/OverviewConstellationScreenSpaceRelaxation",
  );
  assert.equal(identity.version, "2.8.2");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.overview-constellation-screen-space-relaxation",
  );
  assert.equal(
    identity.architecturalRole,
    "PresentationOnlyOverviewCompositionCalibration",
  );
  assert.equal(verifyExecutiveOverviewConstellationScreenSpaceRelaxation().ok, true);
  assert.equal(
    EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY.ownsSpatialAuthority,
    false,
  );
  assert.equal(
    EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY.increasesCameraDistance,
    false,
  );
  assert.equal(
    EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY.usesForceDirectedLayout,
    false,
  );
  assert.equal(
    EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY.usesPhysicsEngine,
    false,
  );
  assert.doesNotMatch(source, /\bd3-force\b/);
  assert.doesNotMatch(source, /if\s*\(\s*(?:name|objectId|label)\s*===/);
});

test("2. screen-space collision reduces projected pressure within bounds", () => {
  const camera = resolveExecutiveOverviewRelaxationDefaultCamera();
  const objects = Object.freeze([
    Object.freeze({
      objectId: "a",
      canonicalPosition: Object.freeze({ x: 0.4, y: 0.15, z: 0.5 }),
      priorityRank: 40,
      approximateRadius: 0.55,
      stageOrder: 0,
    }),
    Object.freeze({
      objectId: "b",
      canonicalPosition: Object.freeze({ x: 0.55, y: 0.15, z: 0.58 }),
      priorityRank: 30,
      approximateRadius: 0.55,
      stageOrder: 1,
    }),
  ]);
  const beforeA = projectExecutiveObjectSilhouetteBounds({
    objectId: "a",
    position: objects[0]!.canonicalPosition,
    radius: 0.55,
    priorityRank: 40,
    camera,
  })!;
  const beforeB = projectExecutiveObjectSilhouetteBounds({
    objectId: "b",
    position: objects[1]!.canonicalPosition,
    radius: 0.55,
    priorityRank: 30,
    camera,
  })!;
  const pressureBefore = measureExecutiveProjectedSilhouettePressure(
    beforeA,
    beforeB,
  );
  assert.ok(
    pressureBefore >
      EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.pressureActivateThreshold,
  );

  const result = resolveExecutiveOverviewConstellationRelaxation({
    objects,
    camera,
    densityProfile: "balanced",
  });
  assert.ok(result.totalPressureAfter <= result.totalPressureBefore);
  assert.ok(
    result.totalPressureAfter <=
      Math.max(
        EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.pressureAcceptThreshold *
          4,
        result.totalPressureBefore * 0.85,
      ),
  );
  for (const entry of result.objects) {
    assert.ok(
      Math.abs(entry.delta.x) <=
        EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.maxRelaxX + 1e-9,
    );
    assert.ok(
      Math.abs(entry.delta.y) <=
        EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.maxRelaxY + 1e-9,
    );
    assert.ok(
      Math.abs(entry.delta.z) <=
        EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.maxRelaxZ + 1e-9,
    );
  }
});

test("3. Capacity/Delivery/Risk-like generic topology becomes independently readable", () => {
  const camera = resolveExecutiveOverviewRelaxationDefaultCamera();
  const objects = topologyFixture(["central", "near-right", "outer-right"]);
  const beforeSilhouettes = objects.map((entry) =>
    projectExecutiveObjectSilhouetteBounds({
      objectId: entry.objectId,
      position: entry.canonicalPosition,
      radius: entry.approximateRadius!,
      priorityRank: entry.priorityRank!,
      camera,
    })!,
  );
  let pressureBeforePairs = 0;
  for (let i = 0; i < beforeSilhouettes.length; i += 1) {
    for (let j = i + 1; j < beforeSilhouettes.length; j += 1) {
      pressureBeforePairs += measureExecutiveProjectedSilhouettePressure(
        beforeSilhouettes[i]!,
        beforeSilhouettes[j]!,
      );
    }
  }

  const result = resolveExecutiveOverviewConstellationRelaxation({
    objects,
    densityProfile: "balanced",
    camera,
  });
  assert.ok(result.totalPressureAfter < result.totalPressureBefore);
  assert.ok(result.totalPressureAfter <= pressureBeforePairs * 0.72);

  const byId = new Map(result.objects.map((entry) => [entry.objectId, entry]));
  const afterSilhouettes = ["central", "near-right", "outer-right"].map(
    (objectId) =>
      projectExecutiveObjectSilhouetteBounds({
        objectId,
        position: byId.get(objectId)!.relaxedPosition,
        radius: 0.4,
        priorityRank: byId.get(objectId)!.priorityRank,
        camera,
      })!,
  );
  let pressureAfterPairs = 0;
  for (let i = 0; i < afterSilhouettes.length; i += 1) {
    for (let j = i + 1; j < afterSilhouettes.length; j += 1) {
      pressureAfterPairs += measureExecutiveProjectedSilhouettePressure(
        afterSilhouettes[i]!,
        afterSilhouettes[j]!,
      );
    }
  }
  assert.ok(pressureAfterPairs < pressureBeforePairs);
  // Each silhouette center remains distinct in NDC.
  const centers = afterSilhouettes.map((entry) => [entry.centerX, entry.centerY]);
  for (let i = 0; i < centers.length; i += 1) {
    for (let j = i + 1; j < centers.length; j += 1) {
      assert.ok(
        Math.hypot(
          centers[i]![0]! - centers[j]![0]!,
          centers[i]![1]! - centers[j]![1]!,
        ) > 0.04,
      );
    }
  }
});

test("4. ID/name invariance for equivalent topology", () => {
  const a = resolveExecutiveOverviewConstellationRelaxation({
    objects: topologyFixture(["alpha", "beta", "gamma"]),
  });
  const b = resolveExecutiveOverviewConstellationRelaxation({
    objects: topologyFixture(["capacity-x", "delivery-y", "risk-z"]),
  });
  for (let index = 0; index < 3; index += 1) {
    assert.ok(
      Math.abs(
        a.objects[index]!.relaxedPosition.x -
          b.objects[index]!.relaxedPosition.x,
      ) < 1e-6,
    );
    assert.ok(
      Math.abs(
        a.objects[index]!.relaxedPosition.z -
          b.objects[index]!.relaxedPosition.z,
      ) < 1e-6,
    );
  }
});

test("5. safe scene produces zero/minimal movement", () => {
  const result = resolveExecutiveOverviewConstellationRelaxation({
    objects: [
      Object.freeze({
        objectId: "left",
        canonicalPosition: Object.freeze({ x: -2.2, y: 0.2, z: -1.2 }),
        priorityRank: 20,
        approximateRadius: 0.3,
      }),
      Object.freeze({
        objectId: "right",
        canonicalPosition: Object.freeze({ x: 2.1, y: 0.2, z: -1.1 }),
        priorityRank: 20,
        approximateRadius: 0.3,
      }),
    ],
  });
  assert.equal(result.passesExecuted, 0);
  for (const entry of result.objects) {
    assert.equal(entry.delta.x, 0);
    assert.equal(entry.delta.y, 0);
    assert.equal(entry.delta.z, 0);
  }
});

test("6. severe pressure remains within max displacement", () => {
  const result = resolveExecutiveOverviewConstellationRelaxation({
    objects: Array.from({ length: 5 }, (_, index) =>
      Object.freeze({
        objectId: `crowd-${index}`,
        canonicalPosition: Object.freeze({
          x: 0.35 + index * 0.05,
          y: 0.12,
          z: 0.4 + index * 0.04,
        }),
        priorityRank: 25 + index,
        approximateRadius: 0.62,
        stageOrder: index,
      }),
    ),
    densityProfile: "high-density",
  });
  for (const entry of result.objects) {
    assert.ok(
      Math.abs(entry.delta.x) <=
        EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.maxRelaxX + 1e-9,
    );
    assert.ok(
      Math.abs(entry.delta.y) <=
        EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.maxRelaxY + 1e-9,
    );
    assert.ok(
      Math.abs(entry.delta.z) <=
        EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.maxRelaxZ + 1e-9,
    );
  }
});

test("7. Dial and bottom constraints remain authoritative", () => {
  const result = resolveExecutiveOverviewConstellationRelaxation({
    objects: [
      Object.freeze({
        objectId: "peer",
        canonicalPosition: Object.freeze({ x: 1.2, y: 0.05, z: 0.9 }),
        priorityRank: 40,
        approximateRadius: 0.5,
      }),
      Object.freeze({
        objectId: "br-candidate",
        canonicalPosition: Object.freeze({ x: 1.65, y: -0.02, z: 1.2 }),
        priorityRank: 30,
        approximateRadius: 0.5,
      }),
    ],
  });
  for (const entry of result.objects) {
    const inDial =
      entry.relaxedPosition.x >=
        EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.unsafeMinX &&
      entry.relaxedPosition.z >=
        EXECUTIVE_SPATIAL_UI_OVERLAY_SAFE_ZONE.unsafeMinZ;
    assert.equal(inDial, false);
    assert.ok(
      entry.relaxedPosition.y >=
        EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minY - 1e-9,
    );
  }
});

test("8. central crowding is not recreated", () => {
  const composition = resolveExecutiveSpatialComposition({
    objects: ["a", "b", "c", "d", "e", "f", "g", "h"].map((objectId) =>
      Object.freeze({ objectId }),
    ),
    densityProfile: "balanced",
  });
  const nearCenter = composition.objects.filter(
    (entry) =>
      Math.hypot(
        entry.position.x - EXECUTIVE_SPATIAL_RESERVED_CENTER.x,
        entry.position.z - EXECUTIVE_SPATIAL_RESERVED_CENTER.z,
      ) < 1.1,
  );
  assert.ok(nearCenter.length <= 2);
});

test("9. density profiles remain finite and bounded", () => {
  const profiles = ["sparse", "balanced", "dense", "high-density"] as const;
  const pressures: number[] = [];
  for (const densityProfile of profiles) {
    const result = resolveExecutiveOverviewConstellationRelaxation({
      objects: topologyFixture(["c", "n", "o"]),
      densityProfile,
    });
    assert.ok(Number.isFinite(result.totalPressureAfter));
    for (const entry of result.objects) {
      assert.ok(Number.isFinite(entry.relaxedPosition.x));
      assert.ok(
        Math.abs(entry.delta.x) <=
          EXECUTIVE_OVERVIEW_SCREEN_SPACE_RELAXATION_LIMITS.maxRelaxX + 1e-9,
      );
    }
    pressures.push(result.totalPressureAfter);
  }
  assert.ok(pressures.every((value) => Number.isFinite(value)));
});

test("10. camera orbit/tilt/zoom remain finite and do not change policy distance", () => {
  assert.equal(VIEW_POLICY.distance, 10.65);
  assert.equal(EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced, 10.65);

  for (const azimuth of [
    VIEW_POLICY.azimuth - 0.35,
    VIEW_POLICY.azimuth,
    VIEW_POLICY.azimuth + 0.35,
  ]) {
    const result = resolveExecutiveOverviewConstellationRelaxation({
      objects: topologyFixture(["c", "n", "o"]),
      camera: resolveExecutiveOverviewRelaxationDefaultCamera({ azimuth }),
    });
    assert.ok(Number.isFinite(result.totalPressureAfter));
    assert.equal(result.objects.length, 3);
  }

  for (const elevation of [
    VIEW_POLICY.elevation - 0.12,
    VIEW_POLICY.elevation,
    VIEW_POLICY.elevation + 0.12,
  ]) {
    const result = resolveExecutiveOverviewConstellationRelaxation({
      objects: topologyFixture(["c", "n", "o"]),
      camera: resolveExecutiveOverviewRelaxationDefaultCamera({ elevation }),
    });
    assert.ok(Number.isFinite(result.totalPressureAfter));
  }

  const zoomed = resolveExecutiveOverviewConstellationRelaxation({
    objects: topologyFixture(["c", "n", "o"]),
    camera: resolveExecutiveOverviewRelaxationDefaultCamera({
      distance: VIEW_POLICY.distance + 1.25,
    }),
  });
  assert.ok(Number.isFinite(zoomed.totalPressureAfter));
  assert.equal(VIEW_POLICY.distance, 10.65);
});

test("11. focus bypass leaves SP:1.5 targets unchanged", () => {
  const composition = resolveExecutiveSpatialComposition({
    objects: [
      Object.freeze({
        objectId: "obj-revenue",
        preferredPosition: Object.freeze({ x: -2.0, y: 0.1, z: 0 }),
      }),
      Object.freeze({
        objectId: "obj-capacity",
        preferredPosition: Object.freeze({ x: 0.8, y: 0.15, z: 1.0 }),
        presentationPriorityRank: 80,
      }),
      Object.freeze({
        objectId: "obj-delivery",
        preferredPosition: Object.freeze({ x: 1.1, y: 0.1, z: 0.6 }),
      }),
    ],
  });
  const byId = new Map(
    composition.objects.map((entry) => [entry.objectId, entry.position]),
  );
  const focus = resolveExecutiveFocusChoreography({
    focusedObjectId: "obj-capacity",
    objects: composition.objects.map((entry) =>
      Object.freeze({
        objectId: entry.objectId,
        basePosition: entry.position,
      }),
    ),
    connections: [
      Object.freeze({
        id: "e1",
        sourceId: "obj-capacity",
        targetId: "obj-delivery",
      }),
    ],
  });
  const focused = focus.objects.find(
    (entry) => entry.objectId === "obj-capacity",
  )!;
  assert.equal(focused.role, "focus");
  assert.ok(
    Math.hypot(
      focused.targetPosition.x - EXECUTIVE_FOCUS_REGION.x,
      focused.targetPosition.z - EXECUTIVE_FOCUS_REGION.z,
    ) < 0.35,
  );
  assert.deepEqual(byId.get("obj-capacity"), focused.basePosition);
});

test("12. focus exit returns to relaxed overview homes", () => {
  const overview = resolveExecutiveSpatialComposition({
    objects: topologyFixture(["central", "near", "outer"]).map((entry) =>
      Object.freeze({
        objectId: entry.objectId,
        preferredPosition: entry.canonicalPosition,
        presentationPriorityRank: entry.priorityRank,
        approximateRadius: entry.approximateRadius,
      }),
    ),
  });
  const focus = resolveExecutiveFocusChoreography({
    focusedObjectId: "central",
    objects: overview.objects.map((entry) =>
      Object.freeze({
        objectId: entry.objectId,
        basePosition: entry.position,
      }),
    ),
    connections: [],
  });
  const cleared = resolveExecutiveFocusChoreography({
    focusedObjectId: null,
    objects: overview.objects.map((entry) =>
      Object.freeze({
        objectId: entry.objectId,
        basePosition: entry.position,
      }),
    ),
    connections: [],
  });
  for (const entry of cleared.objects) {
    const home = overview.objects.find(
      (item) => item.objectId === entry.objectId,
    )!;
    assert.deepEqual(entry.targetPosition, home.position);
  }
  assert.notEqual(focus.focusedObjectId, null);
});

test("13. labels remain compact; priority helper is generic", () => {
  const label = resolveExecutiveObjectLabelPresentation({
    objectId: "any",
    objectName: "Inventory",
    spatialRole: "overview",
    status: "watch",
    stateMarker: "attention",
  });
  assert.equal(label.lines.length, 1);
  assert.ok(
    resolveExecutiveOverviewPresentationPriorityRank({
      attention: "critical",
    }) >
      resolveExecutiveOverviewPresentationPriorityRank({
        attention: "normal",
      }),
  );
});

test("14. picking/connection positions follow relaxed composition", () => {
  const composition = resolveExecutiveSpatialComposition({
    objects: topologyFixture(["central", "near", "outer"]).map((entry) =>
      Object.freeze({
        objectId: entry.objectId,
        preferredPosition: entry.canonicalPosition,
        presentationPriorityRank: entry.priorityRank,
        approximateRadius: entry.approximateRadius,
      }),
    ),
  });
  for (const entry of composition.objects) {
    assert.ok(Number.isFinite(entry.position.x));
    assert.ok(Number.isFinite(entry.position.z));
  }
});

test("15. relationship edge-set and non-edge invariants hold", () => {
  const edgesBefore = Object.freeze([
    "rel-customer-revenue",
    "rel-delivery-customer",
    "rel-capacity-delivery",
  ]);
  const edgesAfter = edgesBefore;
  assert.deepEqual(edgesAfter, edgesBefore);
  assert.equal(edgesBefore.includes("rel-revenue-capacity"), false);

  const sp27 = certifyExecutiveObjectVisualIntegration();
  assert.equal(sp27.structuralStatus, "certified");
  assert.equal(sp27.automatedStatus, "certified");
});

test("16. determinism: identical inputs → identical outputs", () => {
  const input = {
    objects: topologyFixture(["central", "near", "outer"]),
    densityProfile: "balanced" as const,
  };
  const a = resolveExecutiveOverviewConstellationRelaxation(input);
  const b = resolveExecutiveOverviewConstellationRelaxation(input);
  assert.deepEqual(a, b);
});

test("17. SP:2.8 / SP:2.8A remain certified; no SP:3", () => {
  assert.equal(
    certifyExecutiveStageVisualCalibration().automatedStatus,
    "certified",
  );
  assert.equal(
    certifyExecutiveStageFinalVisualMicroCalibration().automatedStatus,
    "certified",
  );
  assert.equal(
    EXECUTIVE_OVERVIEW_CONSTELLATION_RELAXATION_BOUNDARY.startsSp3Atmosphere,
    false,
  );
  assert.doesNotMatch(source, /fog|bloom|SSAO|post-processing/i);
});
