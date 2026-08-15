/**
 * SP:2.7 — Executive Object Visual Integration & Certification.
 *
 * Certifies that SP:2.1–SP:2.6 compose as one coherent executive object
 * visual chain under SP:2.1 final authority, without competing Stage
 * authorities or business-truth mutation.
 *
 * Certification layers:
 *   Level A — Structural / architectural
 *   Level B — Automated integration scenarios
 *   Level C — Human visual sign-off (never auto-claimed)
 *
 * Does NOT implement SP:3 atmosphere/lighting polish.
 * Does NOT freeze/lock/release SP:2 unless separately requested.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  EXECUTIVE_WORKSPACE_DIAL_EXCLUSION,
  type ExecutiveStageDensityProfile,
} from "./executiveFramingVisualCalibration.ts";
import {
  EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY,
  getExecutiveObjectGeometryLanguageIdentity,
  resolveExecutiveObjectGeometryFamily,
} from "./executiveObjectGeometryLanguage.ts";
import {
  EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY,
  EXECUTIVE_OBJECT_FOCUS_ATTENTION_VISUAL_PRIORITY,
  getExecutiveObjectFocusAttentionPresentationIdentity,
  resolveExecutiveObjectFocusAttentionPresentation,
} from "./executiveObjectFocusAttentionPresentation.ts";
import {
  EXECUTIVE_OBJECT_LABEL_FONT_TOKENS,
  EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY,
  EXECUTIVE_OBJECT_LABEL_NAME_BOUNDS,
  EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS,
  getExecutiveObjectLabelInformationDensityIdentity,
  resolveExecutiveObjectLabelCollisions,
  resolveExecutiveObjectLabelPresentation,
  estimateExecutiveObjectLabelScreenBounds,
} from "./executiveObjectLabelInformationDensity.ts";
import {
  EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY,
  EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS,
  getExecutiveObjectMaterialSurfaceIdentity,
} from "./executiveObjectMaterialSurface.ts";
import {
  EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS,
  EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY,
  getExecutiveObjectStateVisualHierarchyIdentity,
} from "./executiveObjectStateVisualHierarchy.ts";
import {
  EXECUTIVE_OBJECT_MATERIAL_BOUNDS,
  EXECUTIVE_OBJECT_SCALE_ENVELOPE,
  EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY,
  getExecutiveObjectVisualFoundationIdentity,
  resolveExecutiveObjectVisualPresentation,
  type ExecutiveObjectVisualInput,
  type ExecutiveObjectVisualPresentation,
} from "./executiveObjectVisualFoundation.ts";
import { executiveObjectOcclusionIdentity } from "./executiveObjectOcclusion.ts";
import { executiveCameraFoundationIdentity } from "./executiveCameraFoundation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveObjectVisualIntegrationCertificationIdentity =
  "SP:2.7/ExecutiveObjectVisualIntegrationCertification" as const;

export const executiveObjectVisualIntegrationCertificationVersion =
  "2.7.0" as const;

export const executiveObjectVisualIntegrationCertificationNamespace =
  "nexora.spatial-presentation.executive-object-visual-integration-certification" as const;

export const executiveObjectVisualIntegrationCertificationPhase =
  "ExecutiveObjectVisualIntegrationAndCertification" as const;

export const executiveObjectVisualIntegrationCertificationArchitecturalRole =
  "PresentationOnlyExecutiveObjectVisualIntegrationCertification" as const;

export const executiveObjectVisualIntegrationCertificationReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveObjectVisualIntegrationCertificationIdentity = {
  readonly id: typeof executiveObjectVisualIntegrationCertificationIdentity;
  readonly version: typeof executiveObjectVisualIntegrationCertificationVersion;
  readonly namespace: typeof executiveObjectVisualIntegrationCertificationNamespace;
  readonly phase: typeof executiveObjectVisualIntegrationCertificationPhase;
  readonly architecturalRole: typeof executiveObjectVisualIntegrationCertificationArchitecturalRole;
  readonly readiness: typeof executiveObjectVisualIntegrationCertificationReadiness;
  readonly upstreamVisualFoundation: "SP:2.1/ExecutiveObjectVisualFoundation";
  readonly upstreamGeometryLanguage: "SP:2.2/ExecutiveObjectGeometryLanguage";
  readonly upstreamMaterialSurface: "SP:2.3/ExecutiveObjectMaterialSurface";
  readonly upstreamStateVisualHierarchy: "SP:2.4/ExecutiveObjectStateVisualHierarchy";
  readonly upstreamLabelInformationDensity: "SP:2.5/ExecutiveObjectLabelInformationDensity";
  readonly upstreamFocusAttentionPresentation: "SP:2.6/ExecutiveObjectFocusAttentionPresentation";
  readonly upstreamSpatialAuthority: "SP:1";
};

const CERTIFICATION_IDENTITY: ExecutiveObjectVisualIntegrationCertificationIdentity =
  Object.freeze({
    id: executiveObjectVisualIntegrationCertificationIdentity,
    version: executiveObjectVisualIntegrationCertificationVersion,
    namespace: executiveObjectVisualIntegrationCertificationNamespace,
    phase: executiveObjectVisualIntegrationCertificationPhase,
    architecturalRole:
      executiveObjectVisualIntegrationCertificationArchitecturalRole,
    readiness: executiveObjectVisualIntegrationCertificationReadiness,
    upstreamVisualFoundation: "SP:2.1/ExecutiveObjectVisualFoundation",
    upstreamGeometryLanguage: "SP:2.2/ExecutiveObjectGeometryLanguage",
    upstreamMaterialSurface: "SP:2.3/ExecutiveObjectMaterialSurface",
    upstreamStateVisualHierarchy: "SP:2.4/ExecutiveObjectStateVisualHierarchy",
    upstreamLabelInformationDensity:
      "SP:2.5/ExecutiveObjectLabelInformationDensity",
    upstreamFocusAttentionPresentation:
      "SP:2.6/ExecutiveObjectFocusAttentionPresentation",
    upstreamSpatialAuthority: "SP:1",
  });

export function getExecutiveObjectVisualIntegrationCertificationIdentity(): ExecutiveObjectVisualIntegrationCertificationIdentity {
  return CERTIFICATION_IDENTITY;
}

export const EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      executiveObjectVisualIntegrationCertificationArchitecturalRole,
    ownsBusinessTruth: false as const,
    ownsFocusTruth: false as const,
    ownsCamera: false as const,
    ownsSpatialPosition: false as const,
    inventsRelationships: false as const,
    introducesNewGeometryFamilies: false as const,
    introducesNewMaterialLanguage: false as const,
    introducesNewSeveritySemantics: false as const,
    introducesNewLabelArchitecture: false as const,
    startsSp3Atmosphere: false as const,
    autoClaimsHumanVisualSignOff: false as const,
    freezesSp2Automatically: false as const,
    presentationOnly: true as const,
    certificationOnly: true as const,
  });

export const EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP = Object.freeze({
  visual: "SP:2.1",
  geometry: "SP:2.2",
  material: "SP:2.3",
  stateSeverity: "SP:2.4",
  labelDensity: "SP:2.5",
  focusAttentionPresentation: "SP:2.6",
  cameraSpatial: "SP:1",
} as const);

export const EXECUTIVE_OBJECT_VISUAL_HUMAN_CHECKLIST = Object.freeze([
  "A.overallCohesion",
  "B.operationalFamily",
  "C.semanticGeometry",
  "D.materials",
  "E.normalState",
  "F.watch",
  "G.critical",
  "H.unresolved",
  "I.recommendation",
  "J.focus",
  "K.criticalBackground",
  "L.labelsOverview",
  "M.focusLabel",
  "N.occlusion",
  "O.dialUiExclusion",
  "P.navigation",
  "Q.denseScene",
  "R.workspaceEnvironment",
] as const);

const TRAFFIC_LIGHT_FORBIDDEN = Object.freeze([
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#00ff00",
  "#ffff00",
  "#ff0000",
]);

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveObjectVisualCertificationPhase =
  | "SP:2.1"
  | "SP:2.2"
  | "SP:2.3"
  | "SP:2.4"
  | "SP:2.5"
  | "SP:2.6"
  | "SP:2.7"
  | "SP:1";

export type ExecutiveObjectVisualCertificationFindingStatus =
  | "pass"
  | "fail"
  | "pending";

export type ExecutiveObjectVisualCertificationFinding = {
  readonly id: string;
  readonly phase: ExecutiveObjectVisualCertificationPhase;
  readonly category: string;
  readonly status: ExecutiveObjectVisualCertificationFindingStatus;
  readonly scenario?: string;
  readonly expected?: string;
  readonly actual?: string;
  readonly message: string;
};

export type ExecutiveObjectVisualScenarioResult = {
  readonly scenarioId: string;
  readonly title: string;
  readonly status: ExecutiveObjectVisualCertificationFindingStatus;
  readonly findingIds: readonly string[];
};

export type ExecutiveObjectVisualIntegrationCertificationLevelStatus =
  | "certified"
  | "failed"
  | "pending";

export type ExecutiveObjectVisualIntegrationCertificationResult = {
  readonly identity: ExecutiveObjectVisualIntegrationCertificationIdentity;
  readonly structuralStatus: "certified" | "failed";
  readonly automatedStatus: "certified" | "failed";
  readonly humanVisualStatus: "verified" | "pending" | "failed";
  readonly sp2StructurallyComplete: boolean;
  readonly sp2FullyVisuallySignedOff: boolean;
  readonly authorityMap: typeof EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP;
  readonly humanChecklist: typeof EXECUTIVE_OBJECT_VISUAL_HUMAN_CHECKLIST;
  readonly findings: readonly ExecutiveObjectVisualCertificationFinding[];
  readonly scenarioResults: readonly ExecutiveObjectVisualScenarioResult[];
  readonly counts: Readonly<{
    readonly passed: number;
    readonly failed: number;
    readonly pending: number;
  }>;
  readonly levels: Readonly<{
    readonly A: ExecutiveObjectVisualIntegrationCertificationLevelStatus;
    readonly B: ExecutiveObjectVisualIntegrationCertificationLevelStatus;
    readonly C: ExecutiveObjectVisualIntegrationCertificationLevelStatus;
  }>;
};

export type CertifyExecutiveObjectVisualIntegrationInput = {
  readonly humanVisualStatus?: "verified" | "pending" | "failed";
  /** Optional override — never invent verified without Stage inspection. */
  readonly forceStructuralFailure?: boolean;
  readonly forceAutomatedFailure?: boolean;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function finding(
  partial: ExecutiveObjectVisualCertificationFinding,
): ExecutiveObjectVisualCertificationFinding {
  return Object.freeze(partial);
}

function passFinding(
  id: string,
  phase: ExecutiveObjectVisualCertificationPhase,
  category: string,
  message: string,
  scenario?: string,
): ExecutiveObjectVisualCertificationFinding {
  return finding({
    id,
    phase,
    category,
    status: "pass",
    scenario,
    message,
  });
}

function failFinding(
  id: string,
  phase: ExecutiveObjectVisualCertificationPhase,
  category: string,
  message: string,
  options?: {
    readonly scenario?: string;
    readonly expected?: string;
    readonly actual?: string;
  },
): ExecutiveObjectVisualCertificationFinding {
  return finding({
    id,
    phase,
    category,
    status: "fail",
    scenario: options?.scenario,
    expected: options?.expected,
    actual: options?.actual,
    message,
  });
}

function pendingFinding(
  id: string,
  phase: ExecutiveObjectVisualCertificationPhase,
  category: string,
  message: string,
  scenario?: string,
): ExecutiveObjectVisualCertificationFinding {
  return finding({
    id,
    phase,
    category,
    status: "pending",
    scenario,
    message,
  });
}

function readStageSource(relativeFromThisModule: string): string {
  return readFileSync(
    fileURLToPath(new URL(relativeFromThisModule, import.meta.url)),
    "utf8",
  );
}

function within(
  value: number,
  min: number,
  max: number,
): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

function materialInSafeRanges(
  presentation: ExecutiveObjectVisualPresentation,
): boolean {
  const m = presentation.material;
  const surface = EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDS;
  const foundation = EXECUTIVE_OBJECT_MATERIAL_BOUNDS;
  return (
    within(m.roughness, surface.minimumRoughness, surface.maximumRoughness) &&
    within(m.metalness, surface.minimumMetalness, surface.maximumMetalness) &&
    within(m.opacity, foundation.minimumOpacity, foundation.maximumOpacity) &&
    within(
      m.emissiveIntensity,
      foundation.minimumEmissive,
      Math.min(foundation.maximumEmissive, surface.maximumEmissive),
    ) &&
    (typeof m.envMapIntensity !== "number" ||
      within(
        m.envMapIntensity,
        surface.minimumEnvMapIntensity,
        surface.maximumEnvMapIntensity,
      ))
  );
}

function notTrafficLightBody(
  presentation: ExecutiveObjectVisualPresentation,
): boolean {
  const color = presentation.material.color.toLowerCase();
  return !TRAFFIC_LIGHT_FORBIDDEN.includes(color);
}

function resolve(
  input: ExecutiveObjectVisualInput,
): ExecutiveObjectVisualPresentation {
  return resolveExecutiveObjectVisualPresentation(input);
}

function baseInput(
  overrides: Partial<ExecutiveObjectVisualInput> &
    Pick<ExecutiveObjectVisualInput, "objectId" | "objectKind">,
): ExecutiveObjectVisualInput {
  return Object.freeze({
    objectId: overrides.objectId,
    objectKind: overrides.objectKind,
    objectName: overrides.objectName,
    selected: overrides.selected === true,
    focused: overrides.focused === true,
    hovered: overrides.hovered === true,
    recommended: overrides.recommended === true,
    status: overrides.status ?? "stable",
    attention: overrides.attention,
    spatialRole: overrides.spatialRole ?? "overview",
    occlusionState: overrides.occlusionState ?? "clear",
    stateMarker: overrides.stateMarker,
    primaryValue: overrides.primaryValue,
    primaryMetricLabel: overrides.primaryMetricLabel,
    cameraDistance: overrides.cameraDistance,
    densityProfile: overrides.densityProfile,
    stageOrder: overrides.stageOrder,
    rimIntensity: overrides.rimIntensity,
    readabilityAssist: overrides.readabilityAssist,
    silhouetteAssist: overrides.silhouetteAssist,
  });
}

function scenarioResult(
  scenarioId: string,
  title: string,
  findings: readonly ExecutiveObjectVisualCertificationFinding[],
): ExecutiveObjectVisualScenarioResult {
  const failed = findings.some((item) => item.status === "fail");
  const pending =
    !failed && findings.some((item) => item.status === "pending");
  return Object.freeze({
    scenarioId,
    title,
    status: failed ? "fail" : pending ? "pending" : "pass",
    findingIds: Object.freeze(findings.map((item) => item.id)),
  });
}

// ─── Level A — Structural ───────────────────────────────────────────────────

function certifyStructuralLayer(): {
  readonly findings: ExecutiveObjectVisualCertificationFinding[];
  readonly scenarios: ExecutiveObjectVisualScenarioResult[];
} {
  const findings: ExecutiveObjectVisualCertificationFinding[] = [];
  const scenarios: ExecutiveObjectVisualScenarioResult[] = [];

  const identityFindings: ExecutiveObjectVisualCertificationFinding[] = [];
  const sp21 = getExecutiveObjectVisualFoundationIdentity();
  const sp22 = getExecutiveObjectGeometryLanguageIdentity();
  const sp23 = getExecutiveObjectMaterialSurfaceIdentity();
  const sp24 = getExecutiveObjectStateVisualHierarchyIdentity();
  const sp25 = getExecutiveObjectLabelInformationDensityIdentity();
  const sp26 = getExecutiveObjectFocusAttentionPresentationIdentity();
  const sp27 = getExecutiveObjectVisualIntegrationCertificationIdentity();

  identityFindings.push(
    sp21.id === "SP:2.1/ExecutiveObjectVisualFoundation"
      ? passFinding(
          "A.identity.sp21",
          "SP:2.1",
          "identity",
          "SP:2.1 identity present",
        )
      : failFinding(
          "A.identity.sp21",
          "SP:2.1",
          "identity",
          "SP:2.1 identity mismatch",
          { actual: sp21.id },
        ),
    sp22.id === "SP:2.2/ExecutiveObjectGeometryLanguage"
      ? passFinding(
          "A.identity.sp22",
          "SP:2.2",
          "identity",
          "SP:2.2 identity present",
        )
      : failFinding(
          "A.identity.sp22",
          "SP:2.2",
          "identity",
          "SP:2.2 identity mismatch",
          { actual: sp22.id },
        ),
    sp23.id === "SP:2.3/ExecutiveObjectMaterialSurface"
      ? passFinding(
          "A.identity.sp23",
          "SP:2.3",
          "identity",
          "SP:2.3 identity present",
        )
      : failFinding(
          "A.identity.sp23",
          "SP:2.3",
          "identity",
          "SP:2.3 identity mismatch",
          { actual: sp23.id },
        ),
    sp24.id === "SP:2.4/ExecutiveObjectStateVisualHierarchy"
      ? passFinding(
          "A.identity.sp24",
          "SP:2.4",
          "identity",
          "SP:2.4 identity present",
        )
      : failFinding(
          "A.identity.sp24",
          "SP:2.4",
          "identity",
          "SP:2.4 identity mismatch",
          { actual: sp24.id },
        ),
    sp25.id === "SP:2.5/ExecutiveObjectLabelInformationDensity"
      ? passFinding(
          "A.identity.sp25",
          "SP:2.5",
          "identity",
          "SP:2.5 identity present",
        )
      : failFinding(
          "A.identity.sp25",
          "SP:2.5",
          "identity",
          "SP:2.5 identity mismatch",
          { actual: sp25.id },
        ),
    sp26.id === "SP:2.6/ExecutiveObjectFocusAttentionPresentation"
      ? passFinding(
          "A.identity.sp26",
          "SP:2.6",
          "identity",
          "SP:2.6 identity present",
        )
      : failFinding(
          "A.identity.sp26",
          "SP:2.6",
          "identity",
          "SP:2.6 identity mismatch",
          { actual: sp26.id },
        ),
    sp27.id === "SP:2.7/ExecutiveObjectVisualIntegrationCertification"
      ? passFinding(
          "A.identity.sp27",
          "SP:2.7",
          "identity",
          "SP:2.7 identity present",
        )
      : failFinding(
          "A.identity.sp27",
          "SP:2.7",
          "identity",
          "SP:2.7 identity mismatch",
          { actual: sp27.id },
        ),
  );

  const authorityOk =
    EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP.visual === "SP:2.1" &&
    EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP.geometry === "SP:2.2" &&
    EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP.material === "SP:2.3" &&
    EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP.stateSeverity === "SP:2.4" &&
    EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP.labelDensity === "SP:2.5" &&
    EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP.focusAttentionPresentation ===
      "SP:2.6" &&
    EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP.cameraSpatial === "SP:1";

  identityFindings.push(
    authorityOk
      ? passFinding(
          "A.singleAuthority.map",
          "SP:2.7",
          "singleAuthority",
          "Single-authority map matches SP:1–SP:2.6 ownership",
        )
      : failFinding(
          "A.singleAuthority.map",
          "SP:2.7",
          "singleAuthority",
          "Authority map corrupted",
        ),
  );

  const boundaryOk =
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.ownsCamera === false &&
    EXECUTIVE_OBJECT_VISUAL_FOUNDATION_BOUNDARY.ownsBusinessTruth === false &&
    EXECUTIVE_OBJECT_GEOMETRY_LANGUAGE_BOUNDARY.ownsCamera === false &&
    EXECUTIVE_OBJECT_MATERIAL_SURFACE_BOUNDARY.ownsCamera === false &&
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.ownsCamera === false &&
    EXECUTIVE_OBJECT_STATE_VISUAL_HIERARCHY_BOUNDARY.ownsSeverityTruth ===
      false &&
    EXECUTIVE_OBJECT_LABEL_INFORMATION_DENSITY_BOUNDARY.ownsBusinessTruth ===
      false &&
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY.ownsFocusTruth ===
      false &&
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY.ownsCamera ===
      false &&
    EXECUTIVE_OBJECT_FOCUS_ATTENTION_PRESENTATION_BOUNDARY
      .inventsRelationships === false &&
    EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY
      .startsSp3Atmosphere === false &&
    EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY
      .autoClaimsHumanVisualSignOff === false;

  identityFindings.push(
    boundaryOk
      ? passFinding(
          "A.boundaries.presentationOnly",
          "SP:2.7",
          "boundary",
          "SP:2 boundaries remain presentation-only; no camera/business ownership",
        )
      : failFinding(
          "A.boundaries.presentationOnly",
          "SP:2.7",
          "boundary",
          "One or more SP:2 boundaries claim forbidden authority",
        ),
  );

  findings.push(...identityFindings);
  scenarios.push(
    scenarioResult(
      "structural.identities",
      "Single authority + identity chain",
      identityFindings,
    ),
  );

  // Renderer / source audits
  const foundationSource = readStageSource(
    "./executiveObjectVisualFoundation.ts",
  );
  const stageObjectSource = readStageSource(
    "../../executive/nex-mvp/stage/NexoraStageObject.tsx",
  );
  const geometryRendererSource = readStageSource(
    "../../executive/nex-mvp/stage/ExecutiveObjectGeometryRenderer.tsx",
  );
  const labelRendererSource = readStageSource(
    "../../executive/nex-mvp/stage/NexoraExecutiveObjectLabel.tsx",
  );
  const sceneSource = readStageSource(
    "../../executive/nex-mvp/stage/NexoraStageScene.tsx",
  );
  const environmentSource = readStageSource(
    "../../executive/nex-mvp/workspace/NexoraSceneEnvironmentController.tsx",
  );

  const auditFindings: ExecutiveObjectVisualCertificationFinding[] = [];

  const chainWired =
    /resolveExecutiveObjectGeometryFamily|resolveExecutiveObjectGeometry/.test(
      foundationSource,
    ) &&
    /resolveExecutiveObjectMaterialSurface|resolveExecutiveObjectMaterial/.test(
      foundationSource,
    ) &&
    /resolveExecutiveObjectStateVisualPresentation/.test(foundationSource) &&
    /resolveExecutiveObjectLabelPresentation/.test(foundationSource) &&
    /resolveExecutiveObjectFocusAttentionPresentation/.test(foundationSource);

  auditFindings.push(
    chainWired
      ? passFinding(
          "A.chain.composition",
          "SP:2.1",
          "composition",
          "SP:2.1 orchestrates geometry → material → state → label → focus/attention",
        )
      : failFinding(
          "A.chain.composition",
          "SP:2.1",
          "composition",
          "SP:2.1 missing one or more SP:2 composition imports",
        ),
  );

  auditFindings.push(
    /resolveExecutiveObjectVisualPresentation/.test(stageObjectSource)
      ? passFinding(
          "A.renderer.consumesSp21",
          "SP:2.1",
          "rendererPolicy",
          "NexoraStageObject consumes SP:2.1 visual presentation",
        )
      : failFinding(
          "A.renderer.consumesSp21",
          "SP:2.1",
          "rendererPolicy",
          "NexoraStageObject does not call resolveExecutiveObjectVisualPresentation",
        ),
  );

  auditFindings.push(
    /meshStandardMaterial/.test(geometryRendererSource) &&
      !/ShaderMaterial|RawShaderMaterial|shaderMaterial/.test(
        geometryRendererSource,
      )
      ? passFinding(
          "A.renderer.meshStandard",
          "SP:2.3",
          "noShaderRegression",
          "Geometry renderer uses MeshStandardMaterial path; no custom shaders",
        )
      : failFinding(
          "A.renderer.meshStandard",
          "SP:2.3",
          "noShaderRegression",
          "Unexpected shader path in ExecutiveObjectGeometryRenderer",
        ),
  );

  const statusBranchInJsx =
    /if\s*\(\s*(?:presentation\.)?status\s*===\s*["']critical["']/.test(
      stageObjectSource,
    ) ||
    /if\s*\(\s*status\s*===\s*["']critical["']/.test(labelRendererSource) ||
    /material\.color\s*=/.test(stageObjectSource);

  auditFindings.push(
    !statusBranchInJsx
      ? passFinding(
          "A.renderer.dumb",
          "SP:2.7",
          "rendererPolicy",
          "Stage object/label JSX does not branch semantic color/status policy",
        )
      : failFinding(
          "A.renderer.dumb",
          "SP:2.7",
          "rendererPolicy",
          "Stage JSX implements semantic status/color policy",
        ),
  );

  const idHack =
    /objectId\s*===\s*["']delivery["']/i.test(stageObjectSource) ||
    /objectId\s*===\s*["']risk["']/i.test(stageObjectSource) ||
    /name\s*===\s*["']Risk["']/.test(stageObjectSource) ||
    /label\.includes\(\s*["']Capacity["']/.test(stageObjectSource) ||
    /objectId\s*===\s*["']delivery["']/i.test(foundationSource);

  auditFindings.push(
    !idHack
      ? passFinding(
          "A.renderer.noIdHacks",
          "SP:2.7",
          "noIdNameHacks",
          "No objectId/name presentation hacks in Stage object / foundation",
        )
      : failFinding(
          "A.renderer.noIdHacks",
          "SP:2.7",
          "noIdNameHacks",
          "Detected objectId/name presentation hack",
        ),
  );

  const useFrameIndex = stageObjectSource.indexOf("useFrame(");
  const frameSection =
    useFrameIndex >= 0 ? stageObjectSource.slice(useFrameIndex) : "";
  auditFindings.push(
    /useMemo\(/.test(stageObjectSource) &&
      useFrameIndex >= 0 &&
      !/resolveExecutiveObjectVisualPresentation/.test(frameSection)
      ? passFinding(
          "A.performance.memoizedResolve",
          "SP:2.7",
          "performance",
          "Visual resolve is memoized; frame loop interpolates only",
        )
      : failFinding(
          "A.performance.memoizedResolve",
          "SP:2.7",
          "performance",
          "Suspected per-frame semantic resolve in Stage object",
        ),
  );

  auditFindings.push(
    /resolveExecutiveObjectOcclusion/.test(sceneSource) &&
      executiveObjectOcclusionIdentity.includes("SP:1.8")
      ? passFinding(
          "A.spatial.occlusionAuthority",
          "SP:1",
          "spatialAuthority",
          "Occlusion remains SP:1.8 authority consumed by Stage scene",
        )
      : failFinding(
          "A.spatial.occlusionAuthority",
          "SP:1",
          "spatialAuthority",
          "Occlusion authority wiring missing",
        ),
  );

  auditFindings.push(
    executiveCameraFoundationIdentity.includes("SP:1")
      ? passFinding(
          "A.spatial.cameraAuthority",
          "SP:1",
          "spatialAuthority",
          "Camera foundation identity remains SP:1",
        )
      : failFinding(
          "A.spatial.cameraAuthority",
          "SP:1",
          "spatialAuthority",
          "Camera foundation identity missing SP:1",
        ),
  );

  // Environment must not redefine severity taxonomy in controller.
  const envRedefinesSeverity =
    /statusClass\s*=\s*["']critical["']/.test(environmentSource) ||
    /severity\s*=\s*["']risk["']/.test(environmentSource);

  auditFindings.push(
    !envRedefinesSeverity
      ? passFinding(
          "A.workspace.environmentDoesNotOwnSeverity",
          "SP:2.4",
          "workspaceEnvironment",
          "Workspace environment controller does not redefine severity",
        )
      : failFinding(
          "A.workspace.environmentDoesNotOwnSeverity",
          "SP:2.4",
          "workspaceEnvironment",
          "Environment controller appears to redefine severity",
        ),
  );

  findings.push(...auditFindings);
  scenarios.push(
    scenarioResult(
      "structural.rendererAudit",
      "Renderer dumness / authority / performance audit",
      auditFindings,
    ),
  );

  return { findings, scenarios };
}

// ─── Level B — Automated scenarios ──────────────────────────────────────────

function certifyBaselineOverview(): {
  findings: ExecutiveObjectVisualCertificationFinding[];
  scenario: ExecutiveObjectVisualScenarioResult;
} {
  const scenarioId = "baseline.overview";
  const objects = [
    resolve(
      baseInput({
        objectId: "obj-revenue",
        objectKind: "kpi",
        objectName: "Revenue",
        spatialRole: "overview",
      }),
    ),
    resolve(
      baseInput({
        objectId: "obj-capacity",
        objectKind: "object",
        objectName: "Capacity",
        spatialRole: "overview",
      }),
    ),
    resolve(
      baseInput({
        objectId: "obj-inventory",
        objectKind: "object",
        objectName: "Inventory",
        spatialRole: "overview",
      }),
    ),
  ];
  const findings: ExecutiveObjectVisualCertificationFinding[] = [];
  const calm =
    objects.every((item) => item.emphasis.stateClass === "normal") &&
    objects.every((item) => item.material.emissiveIntensity <= 0.16) &&
    objects.every((item) => item.label.level === "identity" || item.label.level === "summary") &&
    objects.every((item) => !item.emphasis.showFocusPedestal);

  findings.push(
    calm
      ? passFinding(
          "B.baseline.calm",
          "SP:2.7",
          "baselineOverview",
          "Overview scene remains calm without unnecessary signal emphasis",
          scenarioId,
        )
      : failFinding(
          "B.baseline.calm",
          "SP:2.7",
          "baselineOverview",
          "Overview scene is not calm",
          { scenario: scenarioId },
        ),
  );
  findings.push(
    objects.every(materialInSafeRanges)
      ? passFinding(
          "B.baseline.material",
          "SP:2.3",
          "materialRange",
          "Overview materials stay in safe ranges",
          scenarioId,
        )
      : failFinding(
          "B.baseline.material",
          "SP:2.3",
          "materialRange",
          "Overview material out of range",
          { scenario: scenarioId },
        ),
  );
  return {
    findings,
    scenario: scenarioResult(scenarioId, "Baseline overview", findings),
  };
}

function certifyMixedSemanticTypes(): {
  findings: ExecutiveObjectVisualCertificationFinding[];
  scenario: ExecutiveObjectVisualScenarioResult;
} {
  const scenarioId = "mixed.semanticTypes";
  const kinds = [
    "object",
    "goal",
    "kpi",
    "problem",
    "decision",
    "scenario",
    "execution",
    "insight",
  ] as const;
  const resolved = kinds.map((kind) =>
    resolve(
      baseInput({
        objectId: `obj-${kind}`,
        objectKind: kind,
        objectName: kind,
        spatialRole: "overview",
      }),
    ),
  );
  const geometries = new Set(resolved.map((item) => item.geometry.family));
  const semantics = new Set(resolved.map((item) => item.geometry.semanticFamily));
  const findings: ExecutiveObjectVisualCertificationFinding[] = [];

  findings.push(
    geometries.size >= 4 && semantics.size >= 6
      ? passFinding(
          "B.mixed.differentiation",
          "SP:2.2",
          "mixedSemanticGeometry",
          "Canonical kinds produce differentiated semantic/geometry families",
          scenarioId,
        )
      : failFinding(
          "B.mixed.differentiation",
          "SP:2.2",
          "mixedSemanticGeometry",
          "Insufficient semantic geometry differentiation",
          {
            scenario: scenarioId,
            actual: `families=${geometries.size}, semantics=${semantics.size}`,
          },
        ),
  );

  const operational = ["Revenue", "Capacity", "Inventory", "Delivery", "Budget", "Customer"].map(
    (name, index) =>
      resolve(
        baseInput({
          objectId: `ops-${index}`,
          objectKind: "object",
          objectName: name,
        }),
      ),
  );
  const sameFamily = operational.every(
    (item) => item.geometry.semanticFamily === "operational",
  );
  findings.push(
    sameFamily
      ? passFinding(
          "B.mixed.operationalConsistency",
          "SP:2.2",
          "operationalConsistency",
          "Named operational objects share operational visual family",
          scenarioId,
        )
      : failFinding(
          "B.mixed.operationalConsistency",
          "SP:2.2",
          "operationalConsistency",
          "Operational objects diverged from operational family",
          { scenario: scenarioId },
        ),
  );

  findings.push(
    resolved.every((item) => item.label.anchor.faceCamera) &&
      resolved.every((item) => Number.isFinite(item.connectionAnchor.radius))
      ? passFinding(
          "B.mixed.anchors",
          "SP:2.1",
          "semanticFamilyCohesion",
          "Label and connection anchors remain valid across families",
          scenarioId,
        )
      : failFinding(
          "B.mixed.anchors",
          "SP:2.1",
          "semanticFamilyCohesion",
          "Anchor contract broken for a semantic family",
          { scenario: scenarioId },
        ),
  );

  return {
    findings,
    scenario: scenarioResult(
      scenarioId,
      "Mixed semantic types + operational consistency",
      findings,
    ),
  };
}

function certifyFocusAndAttentionScenarios(): {
  findings: ExecutiveObjectVisualCertificationFinding[];
  scenarios: ExecutiveObjectVisualScenarioResult[];
} {
  const findings: ExecutiveObjectVisualCertificationFinding[] = [];
  const scenarios: ExecutiveObjectVisualScenarioResult[] = [];

  // Focused normal
  {
    const scenarioId = "focus.normal";
    const revenue = resolve(
      baseInput({
        objectId: "obj-revenue",
        objectKind: "kpi",
        objectName: "Revenue",
        focused: true,
        selected: true,
        spatialRole: "focus",
        status: "stable",
        primaryValue: "88%",
      }),
    );
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      revenue.emphasis.showFocusPedestal &&
      revenue.label.level === "detail" &&
      revenue.emphasis.stateClass === "normal" &&
      notTrafficLightBody(revenue) &&
      (revenue.edge.mode === "none" || revenue.edge.tone.includes("focus"))
        ? passFinding(
            "B.focus.normal",
            "SP:2.6",
            "focusedNormal",
            "Focused normal owns scene without looking critical",
            scenarioId,
          )
        : failFinding(
            "B.focus.normal",
            "SP:2.6",
            "focusedNormal",
            "Focused normal presentation incorrect",
            {
              scenario: scenarioId,
              actual: `${revenue.emphasis.stateClass}/${revenue.label.level}/${revenue.edge.mode}`,
            },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Focused normal", local));
  }

  // Focused critical
  {
    const scenarioId = "focus.critical";
    const capacity = resolve(
      baseInput({
        objectId: "obj-capacity",
        objectKind: "problem",
        objectName: "Capacity",
        focused: true,
        selected: true,
        spatialRole: "focus",
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
      }),
    );
    const stacked =
      capacity.emphasis.suppressInteractionNoise !== true &&
      capacity.focusAttention.edgeMode === "interaction";
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      capacity.emphasis.showFocusPedestal &&
      capacity.emphasis.stateClass === "critical" &&
      capacity.emphasis.marker === "critical" &&
      capacity.emphasis.visualEnergy <=
        EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS.maximumVisualEnergy &&
      !stacked
        ? passFinding(
            "B.focus.critical",
            "SP:2.6",
            "focusedCritical",
            "Focused critical preserves both focus ownership and severity",
            scenarioId,
          )
        : failFinding(
            "B.focus.critical",
            "SP:2.6",
            "focusedCritical",
            "Focused critical composition failed",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Focused critical", local));
  }

  // Critical background non-edge (mandatory)
  {
    const scenarioId = "criticalBackground.nonEdge";
    const revenue = resolve(
      baseInput({
        objectId: "obj-revenue",
        objectKind: "kpi",
        objectName: "Revenue",
        focused: true,
        selected: true,
        spatialRole: "focus",
        status: "stable",
      }),
    );
    const capacity = resolve(
      baseInput({
        objectId: "obj-capacity",
        objectKind: "problem",
        objectName: "Capacity",
        focused: false,
        selected: false,
        spatialRole: "background",
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
      }),
    );
    const fa = resolveExecutiveObjectFocusAttentionPresentation({
      objectId: capacity.objectId,
      spatialRole: "background",
      statusClass: "critical",
      focused: false,
    });
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      revenue.emphasis.showFocusPedestal &&
      capacity.spatialRole === "background" &&
      capacity.emphasis.stateClass === "critical" &&
      capacity.label.visible &&
      fa.role === "background" &&
      revenue.emphasis.emphasisRank > capacity.emphasis.emphasisRank
        ? passFinding(
            "B.criticalBackground.nonEdge",
            "SP:2.6",
            "criticalBackgroundNonEdge",
            "Critical background stays discoverable without becoming focus or inventing relation",
            scenarioId,
          )
        : failFinding(
            "B.criticalBackground.nonEdge",
            "SP:2.6",
            "criticalBackgroundNonEdge",
            "Critical background non-edge invariant failed",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "Critical background non-edge", local),
    );
  }

  // Related critical
  {
    const scenarioId = "related.critical";
    const focus = resolve(
      baseInput({
        objectId: "obj-a",
        objectKind: "kpi",
        objectName: "A",
        focused: true,
        spatialRole: "focus",
      }),
    );
    const relatedCritical = resolve(
      baseInput({
        objectId: "obj-b",
        objectKind: "problem",
        objectName: "B",
        spatialRole: "related",
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
      }),
    );
    const relatedNormal = resolve(
      baseInput({
        objectId: "obj-c",
        objectKind: "kpi",
        objectName: "C",
        spatialRole: "related",
        status: "stable",
      }),
    );
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      relatedCritical.emphasis.emphasisRank >
        relatedNormal.emphasis.emphasisRank &&
      focus.emphasis.emphasisRank > relatedCritical.emphasis.emphasisRank &&
      relatedCritical.emphasis.stateClass === "critical"
        ? passFinding(
            "B.related.critical",
            "SP:2.6",
            "relatedCritical",
            "Related critical rises above related normal but remains subordinate to focus",
            scenarioId,
          )
        : failFinding(
            "B.related.critical",
            "SP:2.6",
            "relatedCritical",
            "Related critical hierarchy incorrect",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Related critical", local));
  }

  // Recommendation orthogonality
  {
    const scenarioId = "recommendation.orthogonal";
    const cases = [
      resolve(
        baseInput({
          objectId: "rec-normal",
          objectKind: "decision",
          recommended: true,
          status: "stable",
          spatialRole: "background",
        }),
      ),
      resolve(
        baseInput({
          objectId: "rec-watch",
          objectKind: "decision",
          recommended: true,
          status: "watch",
          attention: "elevated",
          stateMarker: "attention",
          spatialRole: "background",
        }),
      ),
      resolve(
        baseInput({
          objectId: "rec-critical",
          objectKind: "decision",
          recommended: true,
          status: "risk",
          attention: "critical",
          stateMarker: "critical",
          spatialRole: "background",
        }),
      ),
    ];
    const ok =
      cases.every((item) => item.emphasis.recommendationCue === true) &&
      cases[0].emphasis.marker === "recommended" &&
      cases[1].emphasis.marker === "attention" &&
      cases[2].emphasis.marker === "critical" &&
      cases[0].emphasis.stateClass === "normal";
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      ok
        ? passFinding(
            "B.recommendation.orthogonal",
            "SP:2.4",
            "recommendation",
            "Recommendation remains orthogonal; no second large severity marker",
            scenarioId,
          )
        : failFinding(
            "B.recommendation.orthogonal",
            "SP:2.4",
            "recommendation",
            "Recommendation/severity orthogonality failed",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Recommendation", local));
  }

  // Unresolved
  {
    const scenarioId = "unresolved.distinct";
    const unresolved = resolve(
      baseInput({
        objectId: "obj-cost",
        objectKind: "kpi",
        objectName: "Cost",
        status: "unresolved",
        stateMarker: "unresolved",
        spatialRole: "background",
      }),
    );
    const focusedUnresolved = resolve(
      baseInput({
        objectId: "obj-cost-focus",
        objectKind: "kpi",
        objectName: "Cost",
        status: "unresolved",
        stateMarker: "unresolved",
        focused: true,
        spatialRole: "focus",
      }),
    );
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      unresolved.emphasis.stateClass === "unresolved" &&
      unresolved.emphasis.marker === "unresolved" &&
      unresolved.geometry.family === focusedUnresolved.geometry.family &&
      focusedUnresolved.emphasis.showFocusPedestal
        ? passFinding(
            "B.unresolved.distinct",
            "SP:2.4",
            "unresolved",
            "Unresolved remains distinct, interactive, and geometry-intact",
            scenarioId,
          )
        : failFinding(
            "B.unresolved.distinct",
            "SP:2.4",
            "unresolved",
            "Unresolved presentation incorrect",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Unresolved", local));
  }

  return { findings, scenarios };
}

function certifyDensityOcclusionNavigation(): {
  findings: ExecutiveObjectVisualCertificationFinding[];
  scenarios: ExecutiveObjectVisualScenarioResult[];
} {
  const findings: ExecutiveObjectVisualCertificationFinding[] = [];
  const scenarios: ExecutiveObjectVisualScenarioResult[] = [];

  // Many critical
  {
    const scenarioId = "many.critical";
    const items = Array.from({ length: 5 }, (_, index) =>
      resolve(
        baseInput({
          objectId: `crit-${index}`,
          objectKind: "problem",
          objectName: `Critical ${index}`,
          status: "risk",
          attention: "critical",
          stateMarker: "critical",
          spatialRole: index === 0 ? "focus" : "background",
          focused: index === 0,
          stageOrder: index,
        }),
      ),
    );
    const energyOk = items.every(
      (item) =>
        item.emphasis.visualEnergy <=
        EXECUTIVE_OBJECT_STATE_VISUAL_ENERGY_BOUNDS.maximumVisualEnergy,
    );
    const notAllDetail = items
      .filter((item) => !item.emphasis.showFocusPedestal)
      .every((item) => item.label.level !== "detail");
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      energyOk && notAllDetail && items[0].emphasis.showFocusPedestal
        ? passFinding(
            "B.many.critical",
            "SP:2.6",
            "manyCritical",
            "Many-critical scene stays energy-bounded with focus ownership",
            scenarioId,
          )
        : failFinding(
            "B.many.critical",
            "SP:2.6",
            "manyCritical",
            "Many-critical scene over-energized or lost focus ownership",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Many critical objects", local));
  }

  // Dense scene
  {
    const scenarioId = "dense.scene";
    const density: ExecutiveStageDensityProfile = "high-density";
    const focus = resolve(
      baseInput({
        objectId: "dense-focus",
        objectKind: "kpi",
        objectName: "Revenue",
        focused: true,
        spatialRole: "focus",
        densityProfile: density,
        cameraDistance: 14,
      }),
    );
    const background = resolve(
      baseInput({
        objectId: "dense-bg",
        objectKind: "object",
        objectName: "Inventory",
        spatialRole: "background",
        densityProfile: density,
        cameraDistance: 14,
      }),
    );
    const criticalBg = resolve(
      baseInput({
        objectId: "dense-crit",
        objectKind: "problem",
        objectName: "Capacity",
        spatialRole: "background",
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
        densityProfile: density,
        cameraDistance: 14,
      }),
    );
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      focus.label.level === "detail" &&
      background.label.level === "identity" &&
      criticalBg.label.visible
        ? passFinding(
            "B.dense.labels",
            "SP:2.5",
            "denseScene",
            "Dense scene reduces background labels while preserving focus detail and critical cue",
            scenarioId,
          )
        : failFinding(
            "B.dense.labels",
            "SP:2.5",
            "denseScene",
            "Dense-scene label policy failed",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Dense scene", local));
  }

  // Delivery-like occlusion
  {
    const scenarioId = "occlusion.deliveryLike";
    const occluded = resolve(
      baseInput({
        objectId: "obj-delivery",
        objectKind: "object",
        objectName: "Delivery",
        spatialRole: "background",
        occlusionState: "partial",
        readabilityAssist: true,
        silhouetteAssist: true,
      }),
    );
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      occluded.label.visible &&
      occluded.objectId === "obj-delivery" &&
      occluded.geometry.semanticFamily === "operational"
        ? passFinding(
            "B.occlusion.deliveryLike",
            "SP:1",
            "occlusion",
            "Delivery-like partial occlusion retains discoverable identity without ID hack",
            scenarioId,
          )
        : failFinding(
            "B.occlusion.deliveryLike",
            "SP:1",
            "occlusion",
            "Occlusion discoverability failed",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "Delivery-like occlusion", local),
    );
  }

  // Risk / UI exclusion
  {
    const scenarioId = "ui.exclusion.riskLike";
    const label = resolveExecutiveObjectLabelPresentation({
      objectId: "obj-risk-boundary",
      objectName: "Risk Exposure Boundary Case",
      spatialRole: "background",
      status: "risk",
      attention: "critical",
      stateMarker: "critical",
    });
    const screenBounds = estimateExecutiveObjectLabelScreenBounds({
      lines: label.lines,
      fontSizePx: label.fontSizePx,
      screenX: 920,
      screenY: 640,
    });
    const dialExclusionConfigured =
      Number.isFinite(EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.minNdcX) &&
      Number.isFinite(EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.maxNdcY) &&
      EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.minNdcX > 0.35 &&
      EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.maxNdcY < -0.25;
    // Certification: dial exclusion + finite label bounds; no objectId hack.
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      dialExclusionConfigured &&
      Number.isFinite(screenBounds.width) &&
      Number.isFinite(screenBounds.height) &&
      label.objectId === "obj-risk-boundary"
        ? passFinding(
            "B.ui.exclusion",
            "SP:2.5",
            "uiExclusion",
            "Risk/UI-exclusion uses dial exclusion constants with finite label bounds (no ID hack)",
            scenarioId,
          )
        : failFinding(
            "B.ui.exclusion",
            "SP:2.5",
            "uiExclusion",
            "UI exclusion certification failed",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "Risk / UI exclusion", local),
    );
  }

  // Orbit / tilt / zoom — presentation stability under camera-distance bands
  {
    const scenarioId = "navigation.orbitTiltZoom";
    const distances = [6, 10, 16];
    const presentations = distances.map((distance) =>
      resolve(
        baseInput({
          objectId: "nav-object",
          objectKind: "scenario",
          objectName: "Scenario",
          focused: true,
          spatialRole: "focus",
          cameraDistance: distance,
        }),
      ),
    );
    const geometryStable = presentations.every(
      (item) => item.geometry.family === presentations[0].geometry.family,
    );
    const focusDetail = presentations.every((item) => item.label.level === "detail");
    const materialsStable = presentations.every(materialInSafeRanges);
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      geometryStable && focusDetail && materialsStable
        ? passFinding(
            "B.navigation.stability",
            "SP:2.7",
            "navigation",
            "Orbit/tilt/zoom distance bands keep geometry/material/focus label stable",
            scenarioId,
          )
        : failFinding(
            "B.navigation.stability",
            "SP:2.7",
            "navigation",
            "Navigation distance presentation unstable",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "Orbit / Tilt / Zoom stability", local),
    );
  }

  return { findings, scenarios };
}

function certifyInteractionAndLabels(): {
  findings: ExecutiveObjectVisualCertificationFinding[];
  scenarios: ExecutiveObjectVisualScenarioResult[];
} {
  const findings: ExecutiveObjectVisualCertificationFinding[] = [];
  const scenarios: ExecutiveObjectVisualScenarioResult[] = [];

  // Focus switch + exit
  {
    const scenarioId = "focus.switchAndExit";
    const sequence = ["Revenue", "Capacity", "Delivery", "Decision"] as const;
    const kinds = ["kpi", "problem", "object", "decision"] as const;
    let latest = "";
    for (let i = 0; i < sequence.length; i += 1) {
      latest = `obj-${sequence[i].toLowerCase()}`;
      const presentation = resolve(
        baseInput({
          objectId: latest,
          objectKind: kinds[i],
          objectName: sequence[i],
          focused: true,
          selected: true,
          spatialRole: "focus",
          status: kinds[i] === "problem" ? "risk" : "stable",
          attention: kinds[i] === "problem" ? "critical" : "normal",
          stateMarker: kinds[i] === "problem" ? "critical" : "none",
        }),
      );
      if (
        presentation.objectId !== latest ||
        presentation.label.level !== "detail" ||
        !presentation.emphasis.showFocusPedestal
      ) {
        const local = [
          failFinding(
            "B.focus.switch",
            "SP:2.6",
            "focusSwitch",
            "Focus switch did not apply latest intent",
            { scenario: scenarioId, actual: presentation.objectId },
          ),
        ];
        findings.push(...local);
        scenarios.push(scenarioResult(scenarioId, "Focus switch / exit", local));
        return { findings, scenarios };
      }
    }
    const exited = resolve(
      baseInput({
        objectId: latest,
        objectKind: "decision",
        objectName: "Decision",
        focused: false,
        selected: false,
        spatialRole: "overview",
        status: "stable",
      }),
    );
    const criticalStill = resolve(
      baseInput({
        objectId: "obj-capacity",
        objectKind: "problem",
        objectName: "Capacity",
        focused: false,
        spatialRole: "background",
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
      }),
    );
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      !exited.emphasis.showFocusPedestal &&
      exited.label.level !== "detail" &&
      criticalStill.emphasis.stateClass === "critical"
        ? passFinding(
            "B.focus.switchExit",
            "SP:2.6",
            "focusSwitch",
            "Focus switch uses latest intent; exit retracts detail while severity persists",
            scenarioId,
          )
        : failFinding(
            "B.focus.switchExit",
            "SP:2.6",
            "focusSwitch",
            "Focus switch/exit failed",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Focus switch / exit", local));
  }

  // Hover / selection
  {
    const scenarioId = "interaction.hoverSelection";
    const hoveredCriticalBg = resolve(
      baseInput({
        objectId: "obj-capacity",
        objectKind: "problem",
        objectName: "Capacity",
        spatialRole: "background",
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
        hovered: true,
      }),
    );
    const selectedBg = resolve(
      baseInput({
        objectId: "obj-inventory",
        objectKind: "object",
        objectName: "Inventory",
        spatialRole: "background",
        selected: true,
      }),
    );
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      hoveredCriticalBg.spatialRole === "background" &&
      hoveredCriticalBg.emphasis.stateClass === "critical" &&
      !hoveredCriticalBg.emphasis.showFocusPedestal &&
      selectedBg.spatialRole === "background" &&
      !selectedBg.emphasis.showFocusPedestal
        ? passFinding(
            "B.interaction.hoverSelection",
            "SP:2.6",
            "hoverSelection",
            "Hover/selection add interaction clarity without becoming focus",
            scenarioId,
          )
        : failFinding(
            "B.interaction.hoverSelection",
            "SP:2.6",
            "hoverSelection",
            "Hover/selection promoted role incorrectly",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Hover / selection", local));
  }

  // Long labels + missing value
  {
    const scenarioId = "labels.longAndMissing";
    const longName = resolve(
      baseInput({
        objectId: "obj-long",
        objectKind: "kpi",
        objectName:
          "Quarterly Consolidated Operating Revenue Forecast Variance Analysis",
        focused: true,
        spatialRole: "focus",
        primaryValue: "12.4%",
      }),
    );
    const missing = resolve(
      baseInput({
        objectId: "obj-missing",
        objectKind: "kpi",
        objectName: "Inventory",
        focused: true,
        spatialRole: "focus",
      }),
    );
    const joined = missing.label.lines.join(" ");
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      longName.label.lines.every(
        (line) =>
          line.length <= EXECUTIVE_OBJECT_LABEL_NAME_BOUNDS.detailMaxCharacters,
      ) &&
      longName.label.fontSizePx <= EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.detail &&
      longName.label.scale <= EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS.maximum &&
      !joined.toLowerCase().includes("undefined") &&
      !/n\/a/i.test(joined) &&
      missing.label.showPrimaryValue === false &&
      missing.label.primaryValueText == null
        ? passFinding(
            "B.labels.longMissing",
            "SP:2.5",
            "longNameMissingValue",
            "Long names stay bounded; missing primary value degrades cleanly",
            scenarioId,
          )
        : failFinding(
            "B.labels.longMissing",
            "SP:2.5",
            "longNameMissingValue",
            "Long-name or missing-value policy failed",
            { scenario: scenarioId, actual: joined },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "Long labels / missing value", local),
    );
  }

  // Collision priority
  {
    const scenarioId = "labels.collision";
    const candidates = [
      resolveExecutiveObjectLabelPresentation({
        objectId: "a-focus",
        objectName: "Focus",
        focused: true,
        spatialRole: "focus",
      }),
      resolveExecutiveObjectLabelPresentation({
        objectId: "b-critical",
        objectName: "Critical",
        spatialRole: "background",
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
      }),
      resolveExecutiveObjectLabelPresentation({
        objectId: "c-related",
        objectName: "Related",
        spatialRole: "related",
      }),
      resolveExecutiveObjectLabelPresentation({
        objectId: "d-bg",
        objectName: "Background",
        spatialRole: "background",
      }),
    ];
    const orderOk =
      candidates[0].priorityRank > candidates[1].priorityRank &&
      candidates[1].priorityRank > candidates[2].priorityRank &&
      candidates[2].priorityRank > candidates[3].priorityRank;
    const collisionCandidates = candidates.map((label, index) => {
      const bounds = estimateExecutiveObjectLabelScreenBounds({
        lines: label.lines,
        fontSizePx: label.fontSizePx,
        screenX: 400,
        screenY: 300 + index,
      });
      return Object.freeze({
        objectId: label.objectId,
        priorityRank: label.priorityRank,
        stageOrder: index,
        level: label.level,
        prominence: label.prominence,
        visible: label.visible,
        screenX: bounds.x,
        screenY: bounds.y,
        width: bounds.width,
        height: bounds.height,
      });
    });
    const collisions = resolveExecutiveObjectLabelCollisions({
      candidates: collisionCandidates,
      viewportWidth: 1280,
      viewportHeight: 800,
    });
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      orderOk && collisions.byId instanceof Map && collisions.adjustments.length > 0
        ? passFinding(
            "B.labels.collision",
            "SP:2.5",
            "collision",
            "Collision priority focus > critical > related > background with deterministic resolver",
            scenarioId,
          )
        : failFinding(
            "B.labels.collision",
            "SP:2.5",
            "collision",
            "Collision priority/resolver failed",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(scenarioResult(scenarioId, "Label collision", local));
  }

  return { findings, scenarios };
}

function certifyInvariantsAndRanges(): {
  findings: ExecutiveObjectVisualCertificationFinding[];
  scenarios: ExecutiveObjectVisualScenarioResult[];
} {
  const findings: ExecutiveObjectVisualCertificationFinding[] = [];
  const scenarios: ExecutiveObjectVisualScenarioResult[] = [];

  // State invariance / spatial / business truth
  {
    const scenarioId = "invariants.stateSpatialBusiness";
    const states: Array<Partial<ExecutiveObjectVisualInput>> = [
      { status: "stable" },
      { status: "watch", attention: "elevated", stateMarker: "attention" },
      {
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
      },
      { status: "unresolved", stateMarker: "unresolved" },
      { status: "stable", recommended: true },
      { status: "stable", focused: true, spatialRole: "focus", selected: true },
      { status: "stable", selected: true },
    ];
    const baseKind = "decision";
    const presentations = states.map((state, index) =>
      resolve(
        baseInput({
          objectId: "invariant-object",
          objectKind: baseKind,
          objectName: "Decision",
          stageOrder: index,
          ...state,
          spatialRole:
            state.spatialRole ??
            (state.focused ? "focus" : "overview"),
        }),
      ),
    );
    const geometryFamily = presentations[0].geometry.family;
    const geometryOk = presentations.every(
      (item) =>
        item.geometry.family === geometryFamily &&
        item.objectKind === baseKind &&
        item.objectId === "invariant-object",
    );
    const input = baseInput({
      objectId: "truth-object",
      objectKind: "kpi",
      objectName: "Revenue",
      status: "risk",
      attention: "critical",
      recommended: true,
      primaryValue: "42",
    });
    const frozen = { ...input };
    resolve(input);
    const businessOk =
      input.status === frozen.status &&
      input.attention === frozen.attention &&
      input.recommended === frozen.recommended &&
      input.primaryValue === frozen.primaryValue &&
      input.objectKind === frozen.objectKind;

    // Spatial invariance — visual resolve does not invent XYZ/camera fields.
    const visual = presentations[0] as ExecutiveObjectVisualPresentation & {
      targetPosition?: unknown;
      cameraTarget?: unknown;
    };
    const spatialOk =
      visual.targetPosition === undefined &&
      visual.cameraTarget === undefined;

    const local: ExecutiveObjectVisualCertificationFinding[] = [
      geometryOk
        ? passFinding(
            "B.invariant.state",
            "SP:2.2",
            "stateInvariance",
            "Geometry family and object identity unchanged across state/focus/selection",
            scenarioId,
          )
        : failFinding(
            "B.invariant.state",
            "SP:2.2",
            "stateInvariance",
            "State changed geometry or identity",
            { scenario: scenarioId },
          ),
      spatialOk
        ? passFinding(
            "B.invariant.spatial",
            "SP:1",
            "spatialInvariance",
            "SP:2 presentation does not emit camera/position ownership fields",
            scenarioId,
          )
        : failFinding(
            "B.invariant.spatial",
            "SP:1",
            "spatialInvariance",
            "Visual presentation includes spatial ownership fields",
            { scenario: scenarioId },
          ),
      businessOk
        ? passFinding(
            "B.invariant.business",
            "SP:2.7",
            "businessTruthInvariance",
            "Resolver does not mutate business truth fields on input",
            scenarioId,
          )
        : failFinding(
            "B.invariant.business",
            "SP:2.7",
            "businessTruthInvariance",
            "Business truth fields mutated",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "State / spatial / business invariants", local),
    );
  }

  // Material / scale / label ranges + determinism + traffic light
  {
    const scenarioId = "ranges.determinism";
    const stacked = resolve(
      baseInput({
        objectId: "stack",
        objectKind: "problem",
        objectName: "Capacity",
        focused: true,
        selected: true,
        hovered: true,
        recommended: true,
        spatialRole: "focus",
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
        occlusionState: "partial",
      }),
    );
    const again = resolve(
      baseInput({
        objectId: "stack",
        objectKind: "problem",
        objectName: "Capacity",
        focused: true,
        selected: true,
        hovered: true,
        recommended: true,
        spatialRole: "focus",
        status: "risk",
        attention: "critical",
        stateMarker: "critical",
        occlusionState: "partial",
      }),
    );
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      materialInSafeRanges(stacked) && notTrafficLightBody(stacked)
        ? passFinding(
            "B.ranges.material",
            "SP:2.3",
            "materialRange",
            "Signal-stacked material remains in SP:2.3 safe ranges without traffic-light body",
            scenarioId,
          )
        : failFinding(
            "B.ranges.material",
            "SP:2.3",
            "materialRange",
            "Material range or traffic-light regression",
            {
              scenario: scenarioId,
              actual: stacked.material.color,
            },
          ),
      within(
        stacked.scale,
        EXECUTIVE_OBJECT_SCALE_ENVELOPE.minimumCompositionScale,
        EXECUTIVE_OBJECT_SCALE_ENVELOPE.maximumEmphasis,
      )
        ? passFinding(
            "B.ranges.scale",
            "SP:2.1",
            "scaleRange",
            "Scale remains inside SP:2.1 envelope",
            scenarioId,
          )
        : failFinding(
            "B.ranges.scale",
            "SP:2.1",
            "scaleRange",
            "Scale out of envelope",
            { scenario: scenarioId, actual: String(stacked.scale) },
          ),
      within(
        stacked.label.scale,
        EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS.minimum,
        EXECUTIVE_OBJECT_LABEL_SCALE_BOUNDS.maximum,
      ) &&
      stacked.label.fontSizePx <= EXECUTIVE_OBJECT_LABEL_FONT_TOKENS.detail
        ? passFinding(
            "B.ranges.label",
            "SP:2.5",
            "labelScale",
            "Label scale/font remain inside SP:2.5 bounds",
            scenarioId,
          )
        : failFinding(
            "B.ranges.label",
            "SP:2.5",
            "labelScale",
            "Label scale/font out of bounds",
            { scenario: scenarioId },
          ),
      JSON.stringify(stacked.geometry) === JSON.stringify(again.geometry) &&
      JSON.stringify(stacked.material) === JSON.stringify(again.material) &&
      JSON.stringify(stacked.label) === JSON.stringify(again.label) &&
      JSON.stringify(stacked.focusAttention) ===
        JSON.stringify(again.focusAttention)
        ? passFinding(
            "B.ranges.determinism",
            "SP:2.7",
            "determinism",
            "Identical inputs produce identical composed presentations",
            scenarioId,
          )
        : failFinding(
            "B.ranges.determinism",
            "SP:2.7",
            "determinism",
            "Non-deterministic presentation composition",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "Ranges + determinism", local),
    );
  }

  // Dominant scenes
  {
    const scenarioId = "scenes.dominant";
    const normalDominant = Array.from({ length: 6 }, (_, index) =>
      resolve(
        baseInput({
          objectId: `n-${index}`,
          objectKind: "object",
          objectName: `Ops ${index}`,
          spatialRole: "overview",
        }),
      ),
    );
    const unresolvedDominant = Array.from({ length: 5 }, (_, index) =>
      resolve(
        baseInput({
          objectId: `u-${index}`,
          objectKind: "kpi",
          objectName: `Unknown ${index}`,
          status: "unresolved",
          stateMarker: "unresolved",
          spatialRole: "overview",
        }),
      ),
    );
    const normalCalm = normalDominant.every(
      (item) =>
        item.emphasis.stateClass === "normal" &&
        item.material.emissiveIntensity <= 0.14 &&
        item.edge.mode === "none",
    );
    const unresolvedOk = unresolvedDominant.every(
      (item) =>
        item.emphasis.stateClass === "unresolved" &&
        notTrafficLightBody(item) &&
        item.label.visible,
    );
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      normalCalm
        ? passFinding(
            "B.scenes.normalDominant",
            "SP:2.4",
            "normalDominant",
            "Normal-dominant scene remains calm",
            scenarioId,
          )
        : failFinding(
            "B.scenes.normalDominant",
            "SP:2.4",
            "normalDominant",
            "Normal-dominant scene not calm",
            { scenario: scenarioId },
          ),
      unresolvedOk
        ? passFinding(
            "B.scenes.unresolvedDominant",
            "SP:2.4",
            "unresolvedDominant",
            "Unresolved-dominant scene communicates uncertainty without error-red takeover",
            scenarioId,
          )
        : failFinding(
            "B.scenes.unresolvedDominant",
            "SP:2.4",
            "unresolvedDominant",
            "Unresolved-dominant scene incorrect",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "Normal / unresolved dominant scenes", local),
    );
  }

  // Information density progressive
  {
    const scenarioId = "labels.densityProgressive";
    const identity = resolveExecutiveObjectLabelPresentation({
      objectId: "d1",
      objectName: "Inventory",
      spatialRole: "background",
      cameraDistance: 18,
      densityProfile: "high-density",
    });
    const summary = resolveExecutiveObjectLabelPresentation({
      objectId: "d2",
      objectName: "Scenario",
      spatialRole: "related",
      cameraDistance: 10,
      densityProfile: "balanced",
    });
    const detail = resolveExecutiveObjectLabelPresentation({
      objectId: "d3",
      objectName: "Revenue",
      focused: true,
      spatialRole: "focus",
      cameraDistance: 8,
      primaryValue: "88%",
    });
    const rank = { identity: 0, summary: 1, detail: 2 } as const;
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      rank[identity.level] < rank[summary.level] &&
      rank[summary.level] < rank[detail.level] &&
      detail.level === "detail"
        ? passFinding(
            "B.labels.densityProgressive",
            "SP:2.5",
            "informationDensity",
            "identity < summary < detail with focus remaining detail",
            scenarioId,
          )
        : failFinding(
            "B.labels.densityProgressive",
            "SP:2.5",
            "informationDensity",
            "Progressive density failed",
            {
              scenario: scenarioId,
              actual: `${identity.level}/${summary.level}/${detail.level}`,
            },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "Information density progressive", local),
    );
  }

  // Geometry family mapping still authoritative
  {
    const scenarioId = "geometry.mappingAuthority";
    const a = resolveExecutiveObjectGeometryFamily({ objectKind: "scenario" });
    const b = resolveExecutiveObjectGeometryFamily({ objectKind: "scenario" });
    const local: ExecutiveObjectVisualCertificationFinding[] = [
      a.geometryFamily === b.geometryFamily &&
      a.semanticFamily === "scenario" &&
      EXECUTIVE_OBJECT_FOCUS_ATTENTION_VISUAL_PRIORITY[0] === "focusedObject"
        ? passFinding(
            "B.geometry.mapping",
            "SP:2.2",
            "geometryAuthority",
            "SP:2.2 remains geometry mapping authority; SP:2.6 priority model intact",
            scenarioId,
          )
        : failFinding(
            "B.geometry.mapping",
            "SP:2.2",
            "geometryAuthority",
            "Geometry mapping authority broken",
            { scenario: scenarioId },
          ),
    ];
    findings.push(...local);
    scenarios.push(
      scenarioResult(scenarioId, "Geometry mapping authority", local),
    );
  }

  return { findings, scenarios };
}

// ─── Level C — Human visual ─────────────────────────────────────────────────

function certifyHumanVisualLayer(
  humanVisualStatus: "verified" | "pending" | "failed",
): {
  findings: ExecutiveObjectVisualCertificationFinding[];
  scenarios: ExecutiveObjectVisualScenarioResult[];
} {
  const scenarioId = "human.visualSignOff";
  const findings: ExecutiveObjectVisualCertificationFinding[] =
    EXECUTIVE_OBJECT_VISUAL_HUMAN_CHECKLIST.map((item) => {
      if (humanVisualStatus === "verified") {
        return passFinding(
          `C.${item}`,
          "SP:2.7",
          "humanVisual",
          `${item} verified by human Stage inspection`,
          scenarioId,
        );
      }
      if (humanVisualStatus === "failed") {
        return failFinding(
          `C.${item}`,
          "SP:2.7",
          "humanVisual",
          `${item} failed human Stage inspection`,
          { scenario: scenarioId },
        );
      }
      return pendingFinding(
        `C.${item}`,
        "SP:2.7",
        "humanVisual",
        `${item} awaiting human Stage inspection`,
        scenarioId,
      );
    });

  return {
    findings,
    scenarios: [
      scenarioResult(
        scenarioId,
        "Human visual sign-off checklist (A–R)",
        findings,
      ),
    ],
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Certify the complete SP:2 executive object visual chain.
 * Level C defaults to pending — never auto-claimed from unit tests alone.
 */
export function certifyExecutiveObjectVisualIntegration(
  input: CertifyExecutiveObjectVisualIntegrationInput = {},
): ExecutiveObjectVisualIntegrationCertificationResult {
  const humanVisualStatus = input.humanVisualStatus ?? "pending";
  if (
    humanVisualStatus === "verified" &&
    EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY
      .autoClaimsHumanVisualSignOff
  ) {
    // Boundary forbids auto-claim; callers may still pass verified after real inspection.
  }

  const allFindings: ExecutiveObjectVisualCertificationFinding[] = [];
  const allScenarios: ExecutiveObjectVisualScenarioResult[] = [];

  const structural = certifyStructuralLayer();
  allFindings.push(...structural.findings);
  allScenarios.push(...structural.scenarios);

  const baseline = certifyBaselineOverview();
  allFindings.push(...baseline.findings);
  allScenarios.push(baseline.scenario);

  const mixed = certifyMixedSemanticTypes();
  allFindings.push(...mixed.findings);
  allScenarios.push(mixed.scenario);

  const focusAttention = certifyFocusAndAttentionScenarios();
  allFindings.push(...focusAttention.findings);
  allScenarios.push(...focusAttention.scenarios);

  const densityNav = certifyDensityOcclusionNavigation();
  allFindings.push(...densityNav.findings);
  allScenarios.push(...densityNav.scenarios);

  const interaction = certifyInteractionAndLabels();
  allFindings.push(...interaction.findings);
  allScenarios.push(...interaction.scenarios);

  const invariants = certifyInvariantsAndRanges();
  allFindings.push(...invariants.findings);
  allScenarios.push(...invariants.scenarios);

  const human = certifyHumanVisualLayer(humanVisualStatus);
  allFindings.push(...human.findings);
  allScenarios.push(...human.scenarios);

  if (input.forceStructuralFailure === true) {
    allFindings.push(
      failFinding(
        "A.forced.failure",
        "SP:2.7",
        "forced",
        "Forced structural failure for harness testing",
      ),
    );
  }
  if (input.forceAutomatedFailure === true) {
    allFindings.push(
      failFinding(
        "B.forced.failure",
        "SP:2.7",
        "forced",
        "Forced automated failure for harness testing",
      ),
    );
  }

  const structuralFindings = allFindings.filter((item) =>
    item.id.startsWith("A."),
  );
  const automatedFindings = allFindings.filter((item) =>
    item.id.startsWith("B."),
  );

  const structuralStatus = structuralFindings.some(
    (item) => item.status === "fail",
  )
    ? "failed"
    : "certified";
  const automatedStatus = automatedFindings.some(
    (item) => item.status === "fail",
  )
    ? "failed"
    : "certified";

  const passed = allFindings.filter((item) => item.status === "pass").length;
  const failed = allFindings.filter((item) => item.status === "fail").length;
  const pending = allFindings.filter((item) => item.status === "pending").length;

  const sp2StructurallyComplete =
    structuralStatus === "certified" && automatedStatus === "certified";
  const sp2FullyVisuallySignedOff =
    sp2StructurallyComplete && humanVisualStatus === "verified";

  return Object.freeze({
    identity: CERTIFICATION_IDENTITY,
    structuralStatus,
    automatedStatus,
    humanVisualStatus,
    sp2StructurallyComplete,
    sp2FullyVisuallySignedOff,
    authorityMap: EXECUTIVE_OBJECT_VISUAL_AUTHORITY_MAP,
    humanChecklist: EXECUTIVE_OBJECT_VISUAL_HUMAN_CHECKLIST,
    findings: Object.freeze([...allFindings]),
    scenarioResults: Object.freeze([...allScenarios]),
    counts: Object.freeze({ passed, failed, pending }),
    levels: Object.freeze({
      A:
        structuralStatus === "certified"
          ? ("certified" as const)
          : ("failed" as const),
      B:
        automatedStatus === "certified"
          ? ("certified" as const)
          : ("failed" as const),
      C:
        humanVisualStatus === "verified"
          ? ("certified" as const)
          : humanVisualStatus === "failed"
            ? ("failed" as const)
            : ("pending" as const),
    }),
  });
}

export function verifyExecutiveObjectVisualIntegrationCertification(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly structuralCertified: boolean;
  readonly automatedCertified: boolean;
  readonly humanPending: boolean;
  readonly sp2StructurallyComplete: boolean;
  readonly doesNotAutoClaimHumanSignOff: boolean;
  readonly doesNotStartSp3: boolean;
}> {
  const result = certifyExecutiveObjectVisualIntegration({
    forceAutomatedFailure: options?.forceFailure === true,
  });
  const ok =
    options?.forceFailure !== true &&
    result.structuralStatus === "certified" &&
    result.automatedStatus === "certified" &&
    result.humanVisualStatus === "pending" &&
    result.sp2StructurallyComplete === true &&
    result.sp2FullyVisuallySignedOff === false;

  return Object.freeze({
    ok,
    structuralCertified: result.structuralStatus === "certified",
    automatedCertified: result.automatedStatus === "certified",
    humanPending: result.humanVisualStatus === "pending",
    sp2StructurallyComplete: result.sp2StructurallyComplete,
    doesNotAutoClaimHumanSignOff:
      EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY
        .autoClaimsHumanVisualSignOff === false,
    doesNotStartSp3:
      EXECUTIVE_OBJECT_VISUAL_INTEGRATION_CERTIFICATION_BOUNDARY
        .startsSp3Atmosphere === false,
  });
}
