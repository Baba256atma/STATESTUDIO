/**
 * EX-1:1 — Executive Stage Foundation Types.
 *
 * Readonly contracts and foundation metadata for the Executive Stage.
 * No business visualisation, animations, Workspace behaviour, or AI.
 *
 * Ownership: owned exclusively by EX-1:1.
 */

/** Foundation status. */
export type ExecutiveStageFoundationStatus = "Foundation";

/** Immediate next-phase readiness. */
export type ExecutiveStageFoundationReadiness = "ReadyForRegistry";

/** Foundational visual states — only one active at a time. */
export type ExecutiveStageVisualState =
  | "Initializing"
  | "Loading"
  | "Ready"
  | "Empty"
  | "Error";

/** Canonical Stage composition layers. */
export type ExecutiveStageLayerName =
  | "StageSurface"
  | "ObjectLayer"
  | "RelationshipLayer"
  | "FocusLayer"
  | "InteractionLayer"
  | "StageOverlay";

/** Supported interaction surfaces — handling deferred. */
export type ExecutiveStageInteractionKind =
  | "click"
  | "double-click"
  | "hover"
  | "context-menu-request";

/** Overlay kinds — no KPI or analytics overlays. */
export type ExecutiveStageOverlayKind =
  | "loading"
  | "empty-stage"
  | "unavailable-runtime"
  | "development-diagnostics";

/** Canonical foundation identity. */
export const ExecutiveStageFoundationId =
  "EX-1:1/ExecutiveStageFoundation" as const;

export const ExecutiveStageFoundationName =
  "Executive Stage Foundation" as const;

export const ExecutiveStageFoundationVersion = "1.0.0" as const;

export const ExecutiveStageFoundationNamespace =
  "nexora.ex.executive.stage.foundation" as const;

export const ExecutiveStageFoundationStatus = "Foundation" as const;

export const ExecutiveStageFoundationReadiness = "ReadyForRegistry" as const;

export const ExecutiveStageFoundationNextPhase =
  "EX-1:2 — Executive Stage Registry" as const;

export const ExecutiveStageFoundationIdentity = Object.freeze({
  id: ExecutiveStageFoundationId,
  name: ExecutiveStageFoundationName,
  phaseId: "EX-1:1" as const,
  version: ExecutiveStageFoundationVersion,
  namespace: ExecutiveStageFoundationNamespace,
  status: ExecutiveStageFoundationStatus,
  readiness: ExecutiveStageFoundationReadiness,
  layer: "Executive Experience" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Stage" as const,
  target: "Nexora Executive Experience MVP" as const,
  upstream: "RTC-1:9 — Executive Context Runtime Public Index" as const,
  sourceRuntimePublicIndex:
    "RTC-1:9/ExecutiveContextRuntimePublicIndex" as const,
  nextPhase: ExecutiveStageFoundationNextPhase,
  description:
    "Architectural foundation of the Nexora Executive Stage — a Runtime-driven living operational space. Defines Stage composition, Shell, and projection layers without business visualisation, animations, Workspace behaviour, or AI.",
  canonical: true as const,
  mutable: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Ordered Stage composition layers. */
export const ExecutiveStageLayers = Object.freeze([
  Object.freeze({
    layerId: "EX-1:1/Layer/01",
    name: "StageSurface" as const,
    displayName: "Stage Surface",
    description: "Visual workspace boundaries, dimensions, and viewport.",
    order: 1,
  }),
  Object.freeze({
    layerId: "EX-1:1/Layer/02",
    name: "ObjectLayer" as const,
    displayName: "Object Layer",
    description: "Placeholder rendering for Runtime objects.",
    order: 2,
  }),
  Object.freeze({
    layerId: "EX-1:1/Layer/03",
    name: "RelationshipLayer" as const,
    displayName: "Relationship Layer",
    description: "Reserved space for object relationships.",
    order: 3,
  }),
  Object.freeze({
    layerId: "EX-1:1/Layer/04",
    name: "FocusLayer" as const,
    displayName: "Focus Layer",
    description: "Visualises executive attention from Runtime focus.",
    order: 4,
  }),
  Object.freeze({
    layerId: "EX-1:1/Layer/05",
    name: "InteractionLayer" as const,
    displayName: "Interaction Layer",
    description: "Captures executive interactions; handling deferred.",
    order: 5,
  }),
  Object.freeze({
    layerId: "EX-1:1/Layer/06",
    name: "StageOverlay" as const,
    displayName: "Stage Overlay",
    description: "Non-business visual information overlays.",
    order: 6,
  }),
] as const);

export const ExecutiveStageLayerNames = Object.freeze([
  "StageSurface",
  "ObjectLayer",
  "RelationshipLayer",
  "FocusLayer",
  "InteractionLayer",
  "StageOverlay",
] as const satisfies readonly ExecutiveStageLayerName[]);

/** Foundational visual states. */
export const ExecutiveStageVisualStates = Object.freeze([
  "Initializing",
  "Loading",
  "Ready",
  "Empty",
  "Error",
] as const satisfies readonly ExecutiveStageVisualState[]);

/** Supported interaction kinds. */
export const ExecutiveStageInteractionKinds = Object.freeze([
  "click",
  "double-click",
  "hover",
  "context-menu-request",
] as const satisfies readonly ExecutiveStageInteractionKind[]);

/** Permitted overlay kinds. */
export const ExecutiveStageOverlayKinds = Object.freeze([
  "loading",
  "empty-stage",
  "unavailable-runtime",
  "development-diagnostics",
] as const satisfies readonly ExecutiveStageOverlayKind[]);

/** Foundation principles. */
export const ExecutiveStageFoundationPrinciples = Object.freeze([
  Object.freeze({
    principleId: "EX-1:1/Principle/01",
    name: "Runtime Owns State",
    description: "The Stage never owns business state. All business state comes from Runtime.",
  }),
  Object.freeze({
    principleId: "EX-1:1/Principle/02",
    name: "Stage Is Projection",
    description: "The Stage is a projection. It visualises the active Executive Context.",
  }),
  Object.freeze({
    principleId: "EX-1:1/Principle/03",
    name: "Object Driven",
    description: "The Stage is object-driven. Objects are the primary interaction model.",
  }),
  Object.freeze({
    principleId: "EX-1:1/Principle/04",
    name: "Calm Stage",
    description: "The Stage remains calm. Visual motion must always communicate meaning.",
  }),
  Object.freeze({
    principleId: "EX-1:1/Principle/05",
    name: "Runtime Origin",
    description: "Everything visible must originate from Runtime.",
  }),
] as const);

/** Stage responsibilities. */
export const ExecutiveStageResponsibilities = Object.freeze([
  "displaying the executive scene",
  "rendering object placeholders",
  "rendering focus state",
  "rendering relationship placeholders",
  "exposing interaction surfaces",
  "responding to Runtime Context updates",
] as const);

/** Shell placeholder regions — only Stage is active in EX-1:1. */
export const ExecutiveShellPlaceholders = Object.freeze([
  Object.freeze({
    regionId: "EX-1:1/Shell/Timeline",
    name: "Executive Timeline",
    status: "placeholder" as const,
    active: false as const,
  }),
  Object.freeze({
    regionId: "EX-1:1/Shell/Journal",
    name: "Executive Journal",
    status: "placeholder" as const,
    active: false as const,
  }),
] as const);

/** Design constraints. */
export const ExecutiveStageDesignConstraints = Object.freeze([
  "avoid dashboard cards",
  "avoid navigation-heavy layouts",
  "avoid modal-driven workflows",
  "preserve a calm executive experience",
  "maintain generous spacing",
] as const);

/** Accessibility foundation requirements. */
export const ExecutiveStageAccessibilityFoundation = Object.freeze([
  "keyboard focus regions",
  "semantic landmarks",
  "accessible interaction targets",
  "scalable typography",
  "responsive layout containers",
] as const);

/** Runtime synchronisation signals the Stage reacts to. */
export const ExecutiveStageRuntimeSyncSignals = Object.freeze([
  "active context changes",
  "focus changes",
  "workspace changes",
  "timeline position changes",
  "Runtime availability",
] as const);

/** Prohibited surfaces. */
export const ExecutiveStageProhibitedSurfaces = Object.freeze([
  "business logic",
  "AI logic",
  "business object implementation",
  "business visualisation algorithms",
  "animations",
  "Workspace behaviour",
  "KPI overlays",
  "analytics overlays",
  "direct RTC Foundation import",
  "direct RTC Registry import",
  "direct RTC Model import",
  "direct RTC Platform import",
] as const);

/**
 * Canonical Executive Stage Foundation aggregate metadata.
 */
export const ExecutiveStageFoundation = Object.freeze({
  identity: ExecutiveStageFoundationIdentity,
  layers: ExecutiveStageLayers,
  layerNames: ExecutiveStageLayerNames,
  visualStates: ExecutiveStageVisualStates,
  interactionKinds: ExecutiveStageInteractionKinds,
  overlayKinds: ExecutiveStageOverlayKinds,
  principles: ExecutiveStageFoundationPrinciples,
  responsibilities: ExecutiveStageResponsibilities,
  shellPlaceholders: ExecutiveShellPlaceholders,
  designConstraints: ExecutiveStageDesignConstraints,
  accessibility: ExecutiveStageAccessibilityFoundation,
  runtimeSyncSignals: ExecutiveStageRuntimeSyncSignals,
  prohibitedSurfaces: ExecutiveStageProhibitedSurfaces,
  runtimeDependency: "executiveContextRuntimePublicIndex" as const,
  status: ExecutiveStageFoundationStatus,
  readiness: ExecutiveStageFoundationReadiness,
  nextPhase: ExecutiveStageFoundationNextPhase,
  ownsBusinessState: false as const,
  initiatesRuntimeChanges: false as const,
  businessLogic: false as const,
  aiLogic: false as const,
  businessObjectImplementation: false as const,
  journalActive: false as const,
  timelineActive: false as const,
  stageActive: true as const,
  metadataOnly: false as const,
  projectionOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

export type ExecutiveStageFoundationDescriptor =
  typeof ExecutiveStageFoundation;

/** Props shared by Stage projection layers. */
export interface ExecutiveStageLayerProps {
  readonly visualState?: ExecutiveStageVisualState;
  readonly "data-testid"?: string;
}
