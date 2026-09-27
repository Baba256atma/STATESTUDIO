/**
 * NPA-T OVS:2 — Object State & Interaction Visuals.
 *
 * Presentation only. Consumes Stage MVP status/attention, P2:8.2 executive
 * visual state, and existing focus/selection/hover. Does not own those
 * signals. Does not change OVS:1 geometry families.
 *
 * Precedence: management class first (critical > unresolved > watch > normal);
 * interaction then adds temporary emphasis without replacing the class.
 */

import {
  EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE,
  EXECUTIVE_OVS_MATERIAL_LANGUAGE,
  resolveExecutiveOvsObjectVisualLanguage,
} from "./executiveOvsObjectVisualLanguage.ts";

export const executiveOvsObjectStateVisualIdentity =
  "NPA-T OVS:2/ObjectStateInteractionVisuals" as const;

export const executiveOvsObjectStateVisualVersion = "1.0.0" as const;

export const executiveOvsObjectStateVisualNamespace =
  "nexora.spatial-presentation.ovs-object-state-interaction-visuals" as const;

export const executiveOvsObjectStateVisualArchitecturalRole =
  "PresentationOnlyExecutiveObjectStateVisualExpression" as const;

const IDENTITY = Object.freeze({
  id: executiveOvsObjectStateVisualIdentity,
  version: executiveOvsObjectStateVisualVersion,
  namespace: executiveOvsObjectStateVisualNamespace,
  architecturalRole: executiveOvsObjectStateVisualArchitecturalRole,
});

export function getExecutiveOvsObjectStateVisualIdentity() {
  return IDENTITY;
}

export const EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY = Object.freeze({
  architecturalRole: executiveOvsObjectStateVisualArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsSeverityTruth: false as const,
  ownsAttentionTruth: false as const,
  ownsSelection: false as const,
  ownsFocus: false as const,
  ownsDisclosure: false as const,
  ownsCamera: false as const,
  ownsMotion: false as const,
  introducesSecondCanvas: false as const,
  inventsBusinessStates: false as const,
  changesGeometryFamily: false as const,
  independentUseFrame: false as const,
  motionIsOnlyMeaningCarrier: false as const,
});

export const EXECUTIVE_OVS_UNAVAILABLE_STATE_SIGNALS = Object.freeze({
  executingActive:
    "Stage object presentation has no authoritative executing/in-progress status field",
  completedResolved:
    "Stage object presentation has no completed/resolved status; stable is the quiet baseline, not completion",
} as const);

export type ExecutiveOvsManagementVisualClass =
  | "normal"
  | "watch"
  | "critical"
  | "unresolved";

export type ExecutiveOvsInteractionVisualClass =
  | "idle"
  | "hovered"
  | "selected"
  | "focused"
  | "related"
  | "background";

export type ExecutiveOvsObjectStateVisualInput = {
  readonly objectKind?: string | null;
  readonly status?: string | null;
  readonly attention?: string | null;
  readonly executiveVisualState?: string | null;
  readonly executiveState?:
    | "normal"
    | "watch"
    | "critical"
    | "recommended"
    | "unresolved"
    | null;
  readonly interactionState?:
    | "overview"
    | "focused"
    | "selected"
    | "related"
    | "secondary"
    | "background"
    | null;
  readonly focused?: boolean;
  readonly selected?: boolean;
  readonly hovered?: boolean;
  readonly disclosureState?: string | null;
  readonly reducedMotion?: boolean;
};

export type ExecutiveOvsObjectStateVisual = {
  readonly contract: "ovs-2";
  readonly identity: typeof executiveOvsObjectStateVisualIdentity;
  readonly managementClass: ExecutiveOvsManagementVisualClass;
  readonly interactionClass: ExecutiveOvsInteractionVisualClass;
  readonly geometryFamily: string;
  readonly geometryPrimitive: string;
  readonly emissiveScale: number;
  readonly maxEmissive: number;
  readonly roughnessBias: number;
  readonly opacityScale: number;
  readonly depthBias: number;
  readonly edgeOpacity: number;
  readonly edgeExtent: number;
  readonly edgeStyle: "none" | "solid" | "uncertainty";
  readonly motionHint: "none";
  readonly reducedMotion: boolean;
};

const MANAGEMENT_PROFILE = Object.freeze({
  normal: Object.freeze({
    emissiveScale: 1,
    roughnessBias: 0,
    opacityScale: 1,
    depthBias: 0,
    edgeOpacity: 0,
    edgeExtent: 1,
    edgeStyle: "none" as const,
  }),
  watch: Object.freeze({
    emissiveScale: 1.28,
    roughnessBias: -0.04,
    opacityScale: 1,
    depthBias: 0,
    edgeOpacity: 0.34,
    edgeExtent: 1.08,
    edgeStyle: "solid" as const,
  }),
  critical: Object.freeze({
    emissiveScale: 1.55,
    roughnessBias: -0.07,
    opacityScale: 1,
    depthBias: 0.012,
    edgeOpacity: 0.5,
    edgeExtent: 1.14,
    edgeStyle: "solid" as const,
  }),
  unresolved: Object.freeze({
    emissiveScale: 1.12,
    roughnessBias: 0.08,
    opacityScale: 0.92,
    depthBias: 0,
    edgeOpacity: 0.3,
    edgeExtent: 1.1,
    edgeStyle: "uncertainty" as const,
  }),
});

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function resolveExecutiveOvsManagementVisualClass(
  input: ExecutiveOvsObjectStateVisualInput,
): ExecutiveOvsManagementVisualClass {
  const status = `${input.status ?? ""}`.toLowerCase();
  const visual = `${input.executiveVisualState ?? ""}`.toLowerCase();
  const attention = `${input.attention ?? ""}`.toLowerCase();
  const mapped = input.executiveState ?? "normal";

  const critical =
    status === "risk" ||
    visual === "critical" ||
    attention === "critical" ||
    mapped === "critical";
  const unresolved =
    status === "unresolved" ||
    visual === "unresolved" ||
    mapped === "unresolved";
  const watch =
    status === "watch" ||
    visual === "attention" ||
    attention === "elevated" ||
    attention === "important" ||
    mapped === "watch" ||
    mapped === "recommended";

  if (critical) return "critical";
  if (unresolved) return "unresolved";
  if (watch) return "watch";
  return "normal";
}

export function resolveExecutiveOvsInteractionVisualClass(
  input: ExecutiveOvsObjectStateVisualInput,
): ExecutiveOvsInteractionVisualClass {
  if (input.focused === true || input.interactionState === "focused") {
    return "focused";
  }
  if (input.selected === true || input.interactionState === "selected") {
    return "selected";
  }
  if (input.hovered === true) return "hovered";
  if (input.interactionState === "related") return "related";
  if (
    input.interactionState === "background" ||
    input.interactionState === "secondary"
  ) {
    return "background";
  }
  const disclosure = `${input.disclosureState ?? ""}`;
  if (
    disclosure === "background-discoverable" ||
    disclosure === "collapsed-thread"
  ) {
    return "background";
  }
  return "idle";
}

export function resolveExecutiveOvsObjectStateVisual(
  input: ExecutiveOvsObjectStateVisualInput = {},
): ExecutiveOvsObjectStateVisual {
  const managementClass = resolveExecutiveOvsManagementVisualClass(input);
  const interactionClass = resolveExecutiveOvsInteractionVisualClass(input);
  const geometry = resolveExecutiveOvsObjectVisualLanguage({
    objectKind: input.objectKind,
    enabled: true,
  });
  const base = MANAGEMENT_PROFILE[managementClass];
  const reducedMotion = input.reducedMotion === true;

  let emissiveScale = base.emissiveScale;
  let roughnessBias = base.roughnessBias;
  let opacityScale = base.opacityScale;
  let depthBias = base.depthBias;
  let edgeOpacity = base.edgeOpacity;
  let edgeExtent = base.edgeExtent;

  if (interactionClass === "focused") {
    emissiveScale += 0.14;
    depthBias += 0.028;
    edgeOpacity += 0.12;
    edgeExtent += 0.04;
  } else if (interactionClass === "selected") {
    emissiveScale += 0.08;
    depthBias += 0.016;
    edgeOpacity += 0.08;
    edgeExtent += 0.03;
  } else if (interactionClass === "hovered") {
    emissiveScale += 0.05;
    edgeOpacity += 0.05;
    edgeExtent += 0.016;
  } else if (interactionClass === "related") {
    opacityScale *= 0.92;
  } else if (interactionClass === "background") {
    opacityScale *= 0.78;
    emissiveScale *= 0.72;
    edgeOpacity *= 0.7;
  }

  return Object.freeze({
    contract: "ovs-2" as const,
    identity: executiveOvsObjectStateVisualIdentity,
    managementClass,
    interactionClass,
    geometryFamily: geometry.family,
    geometryPrimitive: geometry.primitive,
    emissiveScale: stabilize(clamp(emissiveScale, 0.4, 1.85)),
    maxEmissive: stabilize(
      clamp(
        EXECUTIVE_OVS_MATERIAL_LANGUAGE.maxEmissive *
          (managementClass === "critical" ? 1.35 : 1),
        0.12,
        0.22,
      ),
    ),
    roughnessBias: stabilize(clamp(roughnessBias, -0.12, 0.14)),
    opacityScale: stabilize(clamp(opacityScale, 0.55, 1)),
    depthBias: stabilize(clamp(depthBias, 0, 0.05)),
    edgeOpacity: stabilize(clamp(edgeOpacity, 0, 0.58)),
    edgeExtent: stabilize(clamp(edgeExtent, 1, 1.22)),
    edgeStyle: base.edgeStyle,
    motionHint: "none" as const,
    reducedMotion,
  });
}

export function verifyExecutiveOvsObjectStateVisual(): true {
  if (IDENTITY.id !== "NPA-T OVS:2/ObjectStateInteractionVisuals") {
    throw new Error("OVS:2 identity mismatch");
  }
  if (EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.inventsBusinessStates) {
    throw new Error("OVS:2 must not invent business states");
  }
  if (EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily) {
    throw new Error("OVS:2 must not change OVS:1 geometry");
  }
  if (EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.goal !== "orb") {
    throw new Error("OVS:1 geometry mapping drifted");
  }
  if (EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.independentUseFrame) {
    throw new Error("OVS:2 must not own a useFrame loop");
  }
  return true;
}
