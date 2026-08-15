/**
 * SP:3.2 — Executive Lighting Hierarchy tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_DEFAULT_LIGHTING_PROFILE,
  EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION,
  executiveLightingFoundationIdentity,
  resolveExecutiveLightingProfile,
} from "./executiveLightingFoundation.ts";
import {
  EXECUTIVE_LIGHTING_EMPHASIS_LEVELS,
  EXECUTIVE_LIGHTING_EMPHASIS_PROFILES,
  EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY,
  EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS,
  EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY,
  applyExecutiveLightingHierarchyToMaterial,
  compareExecutiveLightingEmphasisStrength,
  executiveLightingHierarchyArchitecturalRole,
  executiveLightingHierarchyIdentity,
  executiveLightingHierarchyNamespace,
  executiveLightingHierarchyVersion,
  getExecutiveLightingHierarchyIdentity,
  mapPresentationStateToLightingEmphasisLevel,
  resolveExecutiveLightingEmphasis,
  resolveExecutiveLightingHierarchy,
  verifyExecutiveLightingHierarchy,
  type ExecutiveLightingHierarchyInput,
} from "./executiveLightingHierarchy.ts";

const source = readFileSync(
  new URL("./executiveLightingHierarchy.ts", import.meta.url),
  "utf8",
);

const foundationSource = readFileSync(
  new URL("./executiveLightingFoundation.ts", import.meta.url),
  "utf8",
);

const stageObjectSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraStageObject.tsx",
    import.meta.url,
  ),
  "utf8",
);

const lightingRigSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraExecutiveLightingRig.tsx",
    import.meta.url,
  ),
  "utf8",
);

function sampleObjects(): readonly ExecutiveLightingHierarchyInput[] {
  return Object.freeze([
    Object.freeze({
      objectId: "revenue",
      focused: true,
      selected: true,
      attention: "normal",
      spatialRole: "focus",
      stageRole: "focused",
      presentationTarget: "stage-object" as const,
    }),
    Object.freeze({
      objectId: "capacity",
      focused: false,
      attention: "critical",
      stateMarker: "critical",
      spatialRole: "background",
      stageRole: "unrelated",
      presentationTarget: "stage-object" as const,
    }),
    Object.freeze({
      objectId: "pipeline",
      focused: false,
      attention: "normal",
      spatialRole: "related",
      stageRole: "related",
      presentationTarget: "stage-object" as const,
    }),
    Object.freeze({
      objectId: "context-problem",
      focused: false,
      attention: "normal",
      presentationTarget: "context-node" as const,
      spatialRole: "background",
      stageRole: "unrelated",
    }),
  ]);
}

test("1. deterministic hierarchy resolution", () => {
  const identity = getExecutiveLightingHierarchyIdentity();
  assert.equal(
    executiveLightingHierarchyIdentity,
    "SP:3.2/ExecutiveLightingHierarchy",
  );
  assert.equal(identity.id, "SP:3.2/ExecutiveLightingHierarchy");
  assert.equal(executiveLightingHierarchyVersion, "3.2.0");
  assert.equal(
    executiveLightingHierarchyNamespace,
    "nexora.spatial-presentation.executive-lighting-hierarchy",
  );
  assert.equal(
    executiveLightingHierarchyArchitecturalRole,
    "PresentationOnlyExecutiveLightingHierarchy",
  );

  const objects = sampleObjects();
  const a = resolveExecutiveLightingHierarchy(objects);
  const b = resolveExecutiveLightingHierarchy(objects);
  assert.deepEqual(a.orderedObjectIds, b.orderedObjectIds);
  assert.equal(
    JSON.stringify([...a.byId.entries()]),
    JSON.stringify([...b.byId.entries()]),
  );
  assert.doesNotMatch(source, /Math\.random|Date\.now|performance\.now/);
});

test("2. primary focus receives strongest presentation emphasis", () => {
  const hierarchy = resolveExecutiveLightingHierarchy(sampleObjects());
  const primary = hierarchy.byId.get("revenue")!;
  const critical = hierarchy.byId.get("capacity")!;
  const normal = hierarchy.byId.get("pipeline")!;
  const background = hierarchy.byId.get("context-problem")!;

  assert.equal(primary.level, "primary");
  assert.equal(primary.rank, 0);
  assert.ok(primary.strength > critical.strength);
  assert.ok(primary.strength > normal.strength);
  assert.ok(primary.strength > background.strength);
  assert.equal(
    compareExecutiveLightingEmphasisStrength(primary, critical),
    1,
  );
});

test("3. critical non-focused object remains elevated/discoverable", () => {
  const hierarchy = resolveExecutiveLightingHierarchy(sampleObjects());
  const critical = hierarchy.byId.get("capacity")!;
  const normal = hierarchy.byId.get("pipeline")!;

  assert.equal(critical.level, "elevated");
  assert.ok(critical.strength > normal.strength);
  assert.ok(
    critical.strength - normal.strength >=
      EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumElevatedOverStandardStrengthGap -
        0.01,
  );
  assert.equal(
    mapPresentationStateToLightingEmphasisLevel({
      objectId: "capacity",
      focused: false,
      attention: "critical",
      spatialRole: "background",
    }),
    "elevated",
  );
});

test("4. normal objects remain readable", () => {
  const normal = resolveExecutiveLightingEmphasis({
    objectId: "pipeline",
    focused: false,
    attention: "normal",
    spatialRole: "related",
    stageRole: "related",
  });
  assert.equal(normal.level, "standard");
  assert.ok(
    normal.strength >= EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumStrength,
  );
  assert.equal(normal.response.emissiveLift, 0);
  assert.equal(normal.response.lightResponseMultiplier, 1);
});

test("5. background receives lower emphasis", () => {
  const background = resolveExecutiveLightingEmphasis({
    objectId: "context-problem",
    focused: false,
    presentationTarget: "context-node",
    spatialRole: "background",
  });
  const normal = resolveExecutiveLightingEmphasis({
    objectId: "pipeline",
    attention: "normal",
    spatialRole: "related",
  });
  assert.equal(background.level, "background");
  assert.ok(background.strength < normal.strength);
  assert.ok(background.response.envMapMultiplier < 1);
  assert.ok(background.response.lightResponseMultiplier < 1);
});

test("6. no semantic color mutation", () => {
  const material = Object.freeze({
    color: "#536478",
    emissiveColor: "#4a5564",
    emissiveIntensity: 0.08,
    roughness: 0.46,
    metalness: 0.22,
    opacity: 1,
    transparent: false,
    envMapIntensity: 0.38,
    surfaceTone: "object.surface.base",
  });
  const emphasis = resolveExecutiveLightingEmphasis({
    objectId: "revenue",
    focused: true,
  });
  const applied = applyExecutiveLightingHierarchyToMaterial(material, emphasis);
  assert.equal(applied.color, material.color);
  assert.equal(applied.emissiveColor, material.emissiveColor);
  assert.equal(EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.mutatesSemanticColors, false);
  assert.notEqual(applied.emissiveIntensity, material.emissiveIntensity);
});

test("7. no Data Reality mutation", () => {
  assert.equal(EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.ownsDataReality, false);
  assert.equal(
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.ownsExecutiveStateResolution,
    false,
  );
  assert.equal(EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.ownsBusinessTruth, false);
  const emphasis = resolveExecutiveLightingEmphasis({
    objectId: "x",
    focused: true,
  });
  assert.equal(emphasis.preservesDataReality, true);
  assert.doesNotMatch(
    source,
    /resolveDataReality|mutateDataReality|from\s+["'].*data-reality/,
  );
});

test("8. stable ordering", () => {
  const hierarchy = resolveExecutiveLightingHierarchy(sampleObjects());
  assert.deepEqual(hierarchy.orderedObjectIds, [
    "revenue",
    "capacity",
    "pipeline",
    "context-problem",
  ]);

  const again = resolveExecutiveLightingHierarchy(sampleObjects());
  assert.deepEqual(again.orderedObjectIds, hierarchy.orderedObjectIds);
});

test("9. valid emphasis ranges", () => {
  assert.deepEqual(
    [...EXECUTIVE_LIGHTING_EMPHASIS_LEVELS],
    ["primary", "elevated", "standard", "background"],
  );

  for (const level of EXECUTIVE_LIGHTING_EMPHASIS_LEVELS) {
    const profile = EXECUTIVE_LIGHTING_EMPHASIS_PROFILES[level];
    assert.ok(
      profile.strength >= EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumStrength,
    );
    assert.ok(
      profile.strength <= EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.maximumStrength,
    );

    const material = applyExecutiveLightingHierarchyToMaterial(
      Object.freeze({
        color: "#536478",
        emissiveIntensity: 0.1,
        roughness: 0.46,
        metalness: 0.22,
        opacity: 1,
        transparent: false,
        envMapIntensity: 0.38,
      }),
      resolveExecutiveLightingEmphasis({
        objectId: level,
        focused: level === "primary",
        attention: level === "elevated" ? "critical" : "normal",
        presentationTarget:
          level === "background" ? "context-node" : "stage-object",
        spatialRole: level === "background" ? "background" : "overview",
      }),
    );

    assert.ok(
      material.emissiveIntensity >=
        EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumEmissive,
    );
    assert.ok(
      material.emissiveIntensity <=
        EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.maximumEmissive,
    );
    assert.ok(
      material.roughness >= EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumRoughness,
    );
    assert.ok(
      material.roughness <= EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.maximumRoughness,
    );
    assert.ok(
      material.envMapIntensity >=
        EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.minimumEnvMapIntensity,
    );
    assert.ok(
      material.envMapIntensity <=
        EXECUTIVE_LIGHTING_HIERARCHY_BOUNDS.maximumEnvMapIntensity,
    );
  }
});

test("10. bounded lighting complexity", () => {
  const hierarchy = resolveExecutiveLightingHierarchy(sampleObjects());
  assert.equal(hierarchy.lightCountDelta, 0);
  assert.equal(EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY.lightCountDelta, 0);
  assert.equal(EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY.addsSpotLights, false);
  assert.equal(EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY.addsPointLights, false);
  assert.equal(
    EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY.addsDirectionalLights,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY.addsPerObjectShadowMaps,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_HIERARCHY_COMPLEXITY.usesMaterialResponseOnly,
    true,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.introducesObjectSpecificLights,
    false,
  );
  assert.doesNotMatch(source, /spotLight|pointLight|RectAreaLight/);
  assert.doesNotMatch(lightingRigSource, /resolveExecutiveLightingEmphasis/);
});

test("11. SP:3.1 profile remains canonical", () => {
  const foundation = resolveExecutiveLightingProfile({
    profileId: "executive-default",
  });
  assert.equal(foundation.identity, executiveLightingFoundationIdentity);
  assert.equal(foundation.profileId, "executive-default");
  assert.equal(foundation.profileId, EXECUTIVE_DEFAULT_LIGHTING_PROFILE.id);
  assert.equal(
    getExecutiveLightingHierarchyIdentity().upstreamLightingFoundation,
    "SP:3.1/ExecutiveLightingFoundation",
  );
  assert.equal(
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.replacesSp31LightingFoundation,
    false,
  );
  assert.match(foundationSource, /SP:3\.1\/ExecutiveLightingFoundation/);
  assert.match(stageObjectSource, /resolveExecutiveLightingEmphasis/);
  assert.match(stageObjectSource, /applyExecutiveLightingHierarchyToMaterial/);
});

test("12. shadow strategy remains unchanged", () => {
  const foundation = resolveExecutiveLightingProfile();
  const hierarchy = resolveExecutiveLightingHierarchy(sampleObjects());
  assert.equal(hierarchy.shadowStrategyUnchanged, true);
  assert.equal(foundation.shadow.castFromKeyOnly, true);
  assert.equal(
    EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.stageObjectGeometry.castShadow,
    true,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.stageGround.castShadow,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.stageGround.receiveShadow,
    true,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.contextNodes.castShadow,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.pickingHelpers.castShadow,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_HIERARCHY_BOUNDARY.introducesPerObjectShadowMaps,
    false,
  );
});

test("13. identical inputs produce identical outputs", () => {
  const input = Object.freeze({
    objectId: "revenue",
    focused: true,
    selected: true,
    attention: "normal",
    spatialRole: "focus",
    stageRole: "focused",
  });
  const before = JSON.stringify(input);
  const a = resolveExecutiveLightingEmphasis(input);
  const b = resolveExecutiveLightingEmphasis(input);
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(input), before);

  const material = Object.freeze({
    color: "#536478",
    emissiveIntensity: 0.08,
    roughness: 0.46,
    metalness: 0.22,
    opacity: 1,
    transparent: false,
    envMapIntensity: 0.38,
  });
  const materialBefore = JSON.stringify(material);
  const appliedA = applyExecutiveLightingHierarchyToMaterial(material, a);
  const appliedB = applyExecutiveLightingHierarchyToMaterial(material, b);
  assert.deepEqual(appliedA, appliedB);
  assert.equal(JSON.stringify(material), materialBefore);
});

test("14. verifyExecutiveLightingHierarchy passes", () => {
  const report = verifyExecutiveLightingHierarchy();
  assert.equal(report.ok, true);
  assert.equal(report.primaryStrongest, true);
  assert.equal(report.criticalCompetingElevated, true);
  assert.equal(report.sp31Canonical, true);
  assert.equal(report.shadowUnchanged, true);
  assert.equal(verifyExecutiveLightingHierarchy({ forceFailure: true }).ok, false);
});
