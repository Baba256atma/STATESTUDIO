export type {
  TopologyConnection,
  TopologyLayoutGenerator,
  TopologyLayoutOutput,
  TopologyNode,
  ResolvedTopologyType,
  TopologyResult,
  TopologyType,
} from "./topologyTypes.ts";

export {
  formatTopologySelectionReason,
  generateAutoTopology,
  selectTopology,
} from "./topologyAutoSelector.ts";
export { FLOW_NODE_SPACING, generateFlowTopology } from "./flowTopologyGenerator.ts";
export { HUB_RADIUS, generateHubTopology } from "./hubTopologyGenerator.ts";
export { generateTopology } from "./topologyEngine.ts";
export {
  getTopologyGenerator,
  topologyRegistry,
  type TopologyRegistry,
} from "./topologyRegistry.ts";
export {
  logTopologyGenerating,
  logTopologyInitializedOnce,
  resetTopologyDevLogsForTests,
} from "./topologyDevLog.ts";
export {
  DEFAULT_SCENE_TOPOLOGY_MODE,
  ACTIVE_SCENE_TOPOLOGY_MODE,
  type SceneTopologyBinding,
  type SceneTopologyBindingDiagnostics,
  type SceneTopologyBindingResult,
  type SceneTopologyBindingSource,
  type SceneTopologyMode,
} from "./topologySceneBindingTypes.ts";
export {
  bindTopologyToSceneObjects,
  buildEmptySceneTopologyIdleBinding,
  readSceneObjectOriginalPosition,
  resolveSceneObjectId,
  sceneObjectToTopologyNode,
  sceneObjectsToTopologyNodes,
} from "./topologySceneBinding.ts";
export {
  buildTopologyPositionLookupMap,
  buildTopologyRuntimeLayoutPositions,
  isValidScenePosition,
  resolveEffectiveLayoutPositions,
  resolveRuntimeScenePosition,
  type RuntimeScenePositionResult,
  type RuntimeScenePositionSource,
  type ScenePosition,
} from "./topologyScenePositioning.ts";
export {
  logTopologyPositioningBrake,
  resetTopologyPositioningBrakeLogsForTests,
} from "./topologyPositioningDevLog.ts";
export type {
  SceneConnectionLine,
  TopologyConnectionDiagnostics,
  TopologyConnectionResolution,
} from "./topologyConnectionTypes.ts";
export {
  auditTopologyConnectionHighlight,
  collectTopologyConnectionObjectIds,
  isTopologyLineRelatedToSelectedObject,
  resolveTopologyLineVisualState,
  type TopologyLineVisualState,
} from "./topologyConnectionHighlight.ts";
export {
  logTopologyConnectionHighlightBrake,
  resetTopologyConnectionHighlightBrakeLogsForTests,
} from "./topologyConnectionHighlightDevLog.ts";
export {
  buildTopologyConnectionLineId,
  resolveTopologyConnectionLines,
} from "./topologyConnectionResolver.ts";
export {
  logTopologyConnectionBrake,
  resetTopologyConnectionBrakeLogsForTests,
} from "./topologyConnectionDevLog.ts";
export {
  auditTopologyConnectionEndpointAlignment,
  collectTopologyRuntimePositionAliasKeys,
  resolveTopologyRuntimePosition,
  topologyPositionDistance,
  TOPOLOGY_POSITION_MISMATCH_TOLERANCE,
  type TopologyRuntimePositionContext,
  type TopologyRuntimePositionResult,
  type TopologyRuntimePositionSource,
} from "./topologyRuntimePosition.ts";
export {
  logTopologyLineResolved,
  logTopologyPositionMismatch,
  resetTopologyRuntimePositionDevLogsForTests,
} from "./topologyRuntimePositionDevLog.ts";
export {
  buildConnectionRuntimeAuditSignature,
  collectConnectionRuntimeAuditRecords,
  CONNECTION_TOPOLOGY_MATCH_THRESHOLD,
  logConnectionRuntimeAudit,
  runConnectionRuntimeAudit,
  summarizeConnectionRuntimeAudit,
  type ConnectionPositionProvider,
  type ConnectionRuntimeAuditContext,
  type ConnectionRuntimeAuditRecord,
  type ConnectionRuntimeAuditSummary,
  type ConnectionRuntimeClassification,
  type ConnectionRuntimeLayer,
} from "./connectionRuntimeAudit.ts";
export {
  buildTopologyCameraSignature,
  computeTopologyCameraFrame,
  DEFAULT_TOPOLOGY_CAMERA_PADDING,
  MIN_CAMERA_RADIUS,
  type TopologyCameraFrame,
} from "./topologyCameraFrame.ts";
export {
  logTopologyCameraBrake,
  resetTopologyCameraBrakeLogsForTests,
} from "./topologyCameraDevLog.ts";
