import type {
  ExecutiveSceneEveMetadata,
  ExecutiveSceneEvePolicy,
  ExecutiveSceneEveSignalBridge as ExecutiveSceneEveSignalBridgeContract,
  ExecutiveSceneEveSignalCategory,
} from "./executiveSceneEveSignalBridgeTypes.ts";

export const EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_ID = "executive-scene-eve-signal-bridge";
export const EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_VERSION = "LAY-CONN-10";

export const EXECUTIVE_SCENE_EVE_SIGNAL_CATEGORIES: readonly ExecutiveSceneEveSignalCategory[] = Object.freeze([
  "Scene",
  "Visual",
  "Object",
  "Timeline",
  "Camera",
  "Highlight",
  "Sketch",
  "Narration",
  "Dashboard",
  "Assistant",
  "Executive Context",
  "Awareness",
] as const);

export const EXECUTIVE_SCENE_EVE_SIGNAL_TYPES: readonly string[] = Object.freeze([
  "scene-context-signal",
  "visual-context-signal",
  "object-reference-signal",
  "timeline-reference-signal",
  "camera-reference-signal",
  "highlight-reference-signal",
  "sketch-reference-signal",
  "narration-reference-signal",
  "dashboard-reference-signal",
  "assistant-reference-signal",
  "executive-context-reference-signal",
  "awareness-reference-signal",
] as const);

export const EXECUTIVE_SCENE_EVE_METADATA: ExecutiveSceneEveMetadata = Object.freeze({
  bridgeId: EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_ID,
  phaseId: "LAY-CONN-10",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "scene-eve", "signal-metadata"] as const),
});

export const EXECUTIVE_SCENE_EVE_POLICY: ExecutiveSceneEvePolicy = Object.freeze({
  policyId: "scene-eve-metadata-only-policy",
  sceneRuntimeAllowed: false,
  visualRuntimeAllowed: false,
  signalDispatchAllowed: false,
  cameraControlAllowed: false,
  objectChangeAllowed: false,
  timelinePlaybackAllowed: false,
  stateChangeAllowed: false,
  extensionMode: "additive-only",
});

const objectReference = Object.freeze({
  referenceId: "object-reference",
  referenceType: "object",
  sourceId: "executive-object-metadata",
  metadata: EXECUTIVE_SCENE_EVE_METADATA,
});

const cameraReference = Object.freeze({
  referenceId: "camera-reference",
  referenceType: "camera",
  sourceId: "camera-metadata",
  metadata: EXECUTIVE_SCENE_EVE_METADATA,
});

const timelineReference = Object.freeze({
  referenceId: "timeline-reference",
  referenceType: "timeline",
  sourceId: "timeline-metadata",
  metadata: EXECUTIVE_SCENE_EVE_METADATA,
});

export const ExecutiveSceneEveSignalBridge: ExecutiveSceneEveSignalBridgeContract = Object.freeze({
  bridgeId: EXECUTIVE_SCENE_EVE_SIGNAL_BRIDGE_ID,
  name: "Executive Scene Eve Signal Bridge",
  sceneContext: Object.freeze({
    contextId: "scene-context-contract",
    sourceContextId: "executive-scene-context-metadata",
    metadata: EXECUTIVE_SCENE_EVE_METADATA,
  }),
  visualContext: Object.freeze({
    contextId: "eve-visual-context-contract",
    sourceContextId: "executive-visual-context-metadata",
    metadata: EXECUTIVE_SCENE_EVE_METADATA,
  }),
  sceneSignals: Object.freeze([
    Object.freeze({ signalId: "scene-context-signal", category: "Scene", signalType: "scene-context-signal", references: Object.freeze([objectReference.referenceId] as const), metadata: EXECUTIVE_SCENE_EVE_METADATA }),
    Object.freeze({ signalId: "scene-camera-signal", category: "Camera", signalType: "camera-reference-signal", references: Object.freeze([cameraReference.referenceId] as const), metadata: EXECUTIVE_SCENE_EVE_METADATA }),
  ] as const),
  eveSignals: Object.freeze([
    Object.freeze({ signalId: "eve-visual-context-signal", category: "Visual", signalType: "visual-context-signal", references: Object.freeze([objectReference.referenceId] as const), metadata: EXECUTIVE_SCENE_EVE_METADATA }),
    Object.freeze({ signalId: "eve-timeline-signal", category: "Timeline", signalType: "timeline-reference-signal", references: Object.freeze([timelineReference.referenceId] as const), metadata: EXECUTIVE_SCENE_EVE_METADATA }),
  ] as const),
  references: Object.freeze([
    objectReference,
    Object.freeze({ referenceId: "object-selection-reference", referenceType: "object-selection", sourceId: "object-selection-metadata", metadata: EXECUTIVE_SCENE_EVE_METADATA }),
    cameraReference,
    timelineReference,
    Object.freeze({ referenceId: "highlight-reference", referenceType: "highlight", sourceId: "highlight-metadata", metadata: EXECUTIVE_SCENE_EVE_METADATA }),
    Object.freeze({ referenceId: "sketch-reference", referenceType: "sketch", sourceId: "sketch-metadata", metadata: EXECUTIVE_SCENE_EVE_METADATA }),
    Object.freeze({ referenceId: "narration-reference", referenceType: "narration", sourceId: "narration-metadata", metadata: EXECUTIVE_SCENE_EVE_METADATA }),
    Object.freeze({ referenceId: "executive-context-reference", referenceType: "executive-context", sourceId: "executive-context-metadata", metadata: EXECUTIVE_SCENE_EVE_METADATA }),
    Object.freeze({ referenceId: "dashboard-reference", referenceType: "dashboard", sourceId: "dashboard-metadata", metadata: EXECUTIVE_SCENE_EVE_METADATA }),
    Object.freeze({ referenceId: "assistant-reference", referenceType: "assistant", sourceId: "assistant-metadata", metadata: EXECUTIVE_SCENE_EVE_METADATA }),
  ] as const),
  policy: EXECUTIVE_SCENE_EVE_POLICY,
  metadata: EXECUTIVE_SCENE_EVE_METADATA,
});
