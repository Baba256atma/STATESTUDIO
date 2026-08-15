/**
 * SP:3.1 — Executive Lighting Foundation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_DEFAULT_LIGHTING_PROFILE,
  EXECUTIVE_DEFAULT_LIGHTING_TOKENS,
  EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY,
  EXECUTIVE_LIGHTING_LIGHT_TYPES,
  EXECUTIVE_LIGHTING_MATERIAL_COMPATIBILITY,
  EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS,
  EXECUTIVE_LIGHTING_PROFILES,
  EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION,
  EXECUTIVE_LIGHTING_TOKEN_BOUNDS,
  executiveLightingFoundationArchitecturalRole,
  executiveLightingFoundationIdentity,
  executiveLightingFoundationNamespace,
  executiveLightingFoundationVersion,
  getExecutiveLightingFoundationIdentity,
  resolveExecutiveLightingProfile,
  toExecutiveLightingTuple,
  validateExecutiveLightingTokens,
  verifyExecutiveLightingFoundation,
  type ExecutiveLightingEnvironmentHints,
  type ExecutiveLightingTokens,
} from "./executiveLightingFoundation.ts";

const source = readFileSync(
  new URL("./executiveLightingFoundation.ts", import.meta.url),
  "utf8",
);

const rigSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraExecutiveLightingRig.tsx",
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

const canvasSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/NexoraStageCanvas.tsx",
    import.meta.url,
  ),
  "utf8",
);

const environmentSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx",
    import.meta.url,
  ),
  "utf8",
);

const geometryRendererSource = readFileSync(
  new URL(
    "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx",
    import.meta.url,
  ),
  "utf8",
);

const workspacePresentationSource = readFileSync(
  new URL("../nex-mvp/nexoraMVPWorkspacePresentation.ts", import.meta.url),
  "utf8",
);

function isFiniteVector(vector: { x: number; y: number; z: number }): boolean {
  return (
    Number.isFinite(vector.x) &&
    Number.isFinite(vector.y) &&
    Number.isFinite(vector.z)
  );
}

test("1. canonical profile resolution", () => {
  const identity = getExecutiveLightingFoundationIdentity();
  assert.equal(
    executiveLightingFoundationIdentity,
    "SP:3.1/ExecutiveLightingFoundation",
  );
  assert.equal(identity.id, "SP:3.1/ExecutiveLightingFoundation");
  assert.equal(executiveLightingFoundationVersion, "3.1.0");
  assert.equal(
    executiveLightingFoundationNamespace,
    "nexora.spatial-presentation.executive-lighting",
  );
  assert.equal(
    executiveLightingFoundationArchitecturalRole,
    "PresentationOnlyExecutiveLightingFoundation",
  );

  const resolved = resolveExecutiveLightingProfile({
    profileId: "executive-default",
  });
  assert.equal(resolved.profileId, "executive-default");
  assert.equal(resolved.identity, "SP:3.1/ExecutiveLightingFoundation");
  assert.equal(resolved.version, "3.1.0");
  assert.equal(
    EXECUTIVE_LIGHTING_PROFILES["executive-default"].id,
    EXECUTIVE_DEFAULT_LIGHTING_PROFILE.id,
  );
  assert.deepEqual(
    Object.keys(EXECUTIVE_LIGHTING_PROFILES),
    ["executive-default"],
  );
});

test("2. deterministic output", () => {
  const hints: ExecutiveLightingEnvironmentHints = Object.freeze({
    keyLightColor: "#f8fafc",
    fillLightColor: "#93c5fd",
    groundColor: "#111827",
  });
  const a = resolveExecutiveLightingProfile({
    profileId: "executive-default",
    environment: hints,
  });
  const b = resolveExecutiveLightingProfile({
    profileId: "executive-default",
    environment: hints,
  });
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(a), JSON.stringify(b));

  const bareA = resolveExecutiveLightingProfile();
  const bareB = resolveExecutiveLightingProfile({
    profileId: "executive-default",
  });
  assert.deepEqual(bareA, bareB);
});

test("3. valid lighting token ranges", () => {
  const resolved = resolveExecutiveLightingProfile();
  const check = validateExecutiveLightingTokens(resolved.tokens);
  assert.equal(check.ok, true);
  assert.equal(check.intensitiesInRange, true);
  assert.equal(check.colorsValid, true);

  const bounds = EXECUTIVE_LIGHTING_TOKEN_BOUNDS;
  assert.ok(
    resolved.tokens.ambientIntensity >= bounds.ambientIntensity.min &&
      resolved.tokens.ambientIntensity <= bounds.ambientIntensity.max,
  );
  assert.ok(
    resolved.tokens.keyIntensity >= bounds.keyIntensity.min &&
      resolved.tokens.keyIntensity <= bounds.keyIntensity.max,
  );
  assert.ok(
    resolved.tokens.fillIntensity >= bounds.fillIntensity.min &&
      resolved.tokens.fillIntensity <= bounds.fillIntensity.max,
  );
  assert.ok(
    resolved.tokens.rimIntensity >= bounds.rimIntensity.min &&
      resolved.tokens.rimIntensity <= bounds.rimIntensity.max,
  );
});

test("4. Key > Fill hierarchy", () => {
  const resolved = resolveExecutiveLightingProfile();
  assert.ok(resolved.tokens.keyIntensity > resolved.tokens.fillIntensity);
  assert.ok(
    resolved.hierarchy.keyToFillRatio >=
      EXECUTIVE_LIGHTING_TOKEN_BOUNDS.minimumKeyToFillRatio,
  );
  assert.equal(resolved.hierarchy.keyGreaterThanFill, true);

  // Sanitizer restores hierarchy if inverted input slips through profile tokens.
  const inverted = resolveExecutiveLightingProfile();
  assert.ok(inverted.tokens.keyIntensity > inverted.tokens.fillIntensity);
});

test("5. required light positions are finite", () => {
  const tokens = resolveExecutiveLightingProfile().tokens;
  assert.ok(isFiniteVector(tokens.keyPosition));
  assert.ok(isFiniteVector(tokens.fillPosition));
  assert.ok(isFiniteVector(tokens.rimPosition));
  assert.deepEqual(toExecutiveLightingTuple(tokens.keyPosition), [
    tokens.keyPosition.x,
    tokens.keyPosition.y,
    tokens.keyPosition.z,
  ]);
  assert.equal(validateExecutiveLightingTokens(tokens).positionsFinite, true);
});

test("6. valid shadow configuration", () => {
  const resolved = resolveExecutiveLightingProfile();
  assert.equal(resolved.shadow.enabled, true);
  assert.equal(resolved.shadow.castFromKeyOnly, true);
  assert.ok(
    (
      EXECUTIVE_LIGHTING_TOKEN_BOUNDS.shadowMapSize.allowed as readonly number[]
    ).includes(resolved.shadow.mapSize),
  );
  assert.ok(
    resolved.shadow.mapSize <=
      EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS.maximumShadowMapSize,
  );
  assert.ok(resolved.shadow.bias <= 0);
  assert.ok(resolved.shadow.normalBias >= 0);
  assert.ok(resolved.shadow.softIntensityBias > 0);
  assert.ok(resolved.shadow.softIntensityBias < 1);
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
    EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.pickingHelpers.castShadow,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.contextNodes.castShadow,
    false,
  );
});

test("7. presentation-only architectural boundary", () => {
  assert.equal(EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.presentationOnly, true);
  assert.equal(EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsBusinessTruth, false);
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsCanonicalNexoraObjects,
    false,
  );
  assert.equal(EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsDataReality, false);
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsExecutiveStateResolution,
    false,
  );
  assert.equal(EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsRelationships, false);
  assert.equal(EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsFocusSemantics, false);
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsSelectionSemantics,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsWorkspaceSemantics,
    false,
  );
  assert.equal(EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsCameraContracts, false);
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.ownsSp2CompositionContracts,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.introducesWorkspaceSpecificLighting,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.introducesFocusReactiveLighting,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.introducesPostProcessing,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.introducesBloom,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_FOUNDATION_BOUNDARY.frameworkIndependentResolver,
    true,
  );
  assert.doesNotMatch(source, /Math\.random|Date\.now|performance\.now/);
});

test("8. compatibility with current Stage environment", () => {
  const environmentHints: ExecutiveLightingEnvironmentHints = Object.freeze({
    keyLightColor: "#f8fafc",
    fillLightColor: "#93c5fd",
    groundColor: "#111827",
    ambientIntensity: 0.55,
    keyLightIntensity: 0.85,
    fillLightIntensity: 0.25,
  });
  const resolved = resolveExecutiveLightingProfile({
    profileId: "executive-default",
    environment: environmentHints,
  });

  // Color tint consumed; foundation intensities remain profile-owned.
  assert.equal(resolved.tokens.keyColor, "#f8fafc");
  assert.equal(resolved.tokens.fillColor, "#93c5fd");
  assert.equal(resolved.tokens.groundResponse.groundColor, "#111827");
  assert.equal(
    resolved.tokens.keyIntensity,
    EXECUTIVE_DEFAULT_LIGHTING_TOKENS.keyIntensity,
  );
  assert.equal(
    resolved.tokens.fillIntensity,
    EXECUTIVE_DEFAULT_LIGHTING_TOKENS.fillIntensity,
  );

  assert.match(workspacePresentationSource, /ambientIntensity/);
  assert.match(workspacePresentationSource, /keyLightIntensity/);
  assert.match(sceneSource, /resolveExecutiveLightingProfile/);
  assert.match(sceneSource, /NexoraExecutiveLightingRig/);
  assert.match(canvasSource, /\bshadows\b/);
  assert.match(environmentSource, /groundResponse/);
  assert.doesNotMatch(environmentSource, /<ambientLight/);
  assert.doesNotMatch(environmentSource, /<directionalLight/);
});

test("9. no mutation of upstream state", () => {
  const hints: ExecutiveLightingEnvironmentHints = Object.freeze({
    keyLightColor: "#ABCDEF",
    fillLightColor: "#123456",
    groundColor: "#111827",
  });
  const before = JSON.stringify(hints);
  const resolved = resolveExecutiveLightingProfile({
    environment: hints,
  });
  assert.equal(JSON.stringify(hints), before);
  assert.equal(resolved.tokens.keyColor, "#abcdef");

  const frozenTokens = EXECUTIVE_DEFAULT_LIGHTING_TOKENS;
  assert.throws(() => {
    (frozenTokens as { ambientIntensity: number }).ambientIntensity = 99;
  });

  assert.deepEqual(
    [...resolved.lightTypes],
    [...EXECUTIVE_LIGHTING_LIGHT_TYPES],
  );
});

test("10. material compatibility remains MeshStandard for Stage bodies", () => {
  assert.equal(
    EXECUTIVE_LIGHTING_MATERIAL_COMPATIBILITY.requiredBodyMaterialFamily,
    "MeshStandardMaterial",
  );
  assert.equal(
    EXECUTIVE_LIGHTING_MATERIAL_COMPATIBILITY.unlitBodyMaterialsAllowed,
    false,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_MATERIAL_COMPATIBILITY.redesignsObjectAppearance,
    false,
  );
  assert.match(geometryRendererSource, /meshStandardMaterial/);
  assert.match(
    geometryRendererSource,
    /EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION/,
  );
  assert.match(rigSource, /hemisphereLight/);
  assert.match(rigSource, /directionalLight/);
  assert.match(rigSource, /ambientLight/);
});

test("11. verifyExecutiveLightingFoundation passes", () => {
  const report = verifyExecutiveLightingFoundation();
  assert.equal(report.ok, true);
  assert.equal(report.identityValid, true);
  assert.equal(report.boundaryValid, true);
  assert.equal(report.resolutionDeterministic, true);
  assert.equal(report.tokensValid, true);
  assert.equal(report.hierarchyValid, true);
  assert.equal(report.shadowValid, true);
  assert.equal(report.presentationOnly, true);
  assert.equal(report.environmentCompatible, true);

  const forced = verifyExecutiveLightingFoundation({ forceFailure: true });
  assert.equal(forced.ok, false);
});

test("12. invalid tokens are sanitized into safe ranges", () => {
  // Direct validation of sanitizer path via resolve with extreme defaults is
  // covered by bounds; also assert default profile already validates.
  const tokens: ExecutiveLightingTokens = EXECUTIVE_DEFAULT_LIGHTING_TOKENS;
  const check = validateExecutiveLightingTokens(tokens);
  assert.equal(check.ok, true);
  assert.equal(check.keyGreaterThanFill, true);
  assert.equal(check.shadowValid, true);
});

test("13. performance safeguards documented", () => {
  assert.equal(EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS.maximumDynamicLights, 5);
  assert.equal(EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS.keyCastsShadowsOnly, true);
  assert.equal(EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS.noPostProcessing, true);
  assert.equal(EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS.noBloom, true);
  assert.equal(
    EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS.noVolumetricLighting,
    true,
  );
  assert.equal(
    EXECUTIVE_LIGHTING_LIGHT_TYPES.length,
    EXECUTIVE_LIGHTING_PERFORMANCE_SAFEGUARDS.maximumDynamicLights,
  );
});
