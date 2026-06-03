export type {
  ExecutiveLayoutPreset,
  ExecutiveObjectCluster,
  ExecutiveObjectClusterKind,
  ExecutiveSceneBoundsKind,
  ExecutiveSceneBoundsSnapshot,
  ExecutiveSceneFramingInput,
  ExecutiveSceneFramingResult,
} from "./executiveSceneFramingTypes";

export {
  analyzeExecutiveSceneBounds,
  computeTightFormationBounds,
  fallbackExecutiveSceneBounds,
  mergeExecutiveBounds,
  readExecutiveSceneObjectPositions,
} from "./executiveSceneBoundsRuntime";
export type { SceneObjectPosition } from "./executiveSceneBoundsRuntime";

export {
  assignExecutiveTemplatePositions,
  assertExecutiveLayoutGroundPlane,
} from "./executiveLayoutTemplateSlots";
export type {
  ExecutiveLayoutObjectRoleProfile,
  ExecutiveLayoutTemplateId,
  ExecutiveLayoutTemplateSlot,
} from "./executiveLayoutTemplateTypes";
export {
  buildExecutiveLayoutObjectRoleProfiles,
  collectExecutiveObjectSemanticTokens,
  logExecutiveLayoutTemplateResolvedOnce,
  resetExecutiveLayoutTemplateLogsForTests,
  resolveExecutiveLayoutTemplate,
} from "./resolveExecutiveLayoutTemplate";

export {
  classifyExecutiveObjectLayoutRole,
  EXECUTIVE_LAYOUT_MIN_DISTANCE,
  EXECUTIVE_OPERATIONAL_LAYOUT_MAX_OBJECTS,
  EXECUTIVE_OPERATIONAL_LAYOUT_MIN_OBJECTS,
  normalizeExecutiveObjectLayout,
  resetExecutiveObjectLayoutForTests,
  resolveExecutiveOperationalLayoutCameraFit,
  resolveExecutiveOperationalSceneCenter,
  shouldUseExecutiveOperationalLayout,
} from "./normalizeExecutiveObjectLayout";
export type {
  ExecutiveLayoutLabelOffset,
  ExecutiveLayoutNormalizedResult,
  ExecutiveObjectLayoutRole,
  NormalizeExecutiveObjectLayoutOptions,
} from "./normalizeExecutiveObjectLayout";

export {
  detectExecutiveObjectClusters,
  resolveExecutiveClusterLayoutSpacing,
} from "./executiveClusterDetectionRuntime";

export {
  applyEmptySpaceRecoveryToBounds,
  computeExecutiveReadabilityScore,
  measureExecutiveEmptySpace,
} from "./executiveEmptySpaceGovernance";
export type { ExecutiveEmptySpaceMeasurement } from "./executiveEmptySpaceGovernance";

export {
  mapCameraPresetToLayoutPreset,
  resolveExecutiveAdaptivePadding,
  resolveExecutiveSceneFraming,
  resetExecutiveSceneFramingForTests,
} from "./executiveSceneFramingRuntime";

export type {
  TopologyConnection,
  TopologyLayoutGenerator,
  TopologyLayoutOutput,
  TopologyNode,
  ResolvedTopologyType,
  TopologyResult,
  TopologyType,
} from "../topology/topologyTypes";
export {
  ACTIVE_SCENE_TOPOLOGY_MODE,
  DEFAULT_SCENE_TOPOLOGY_MODE,
  FLOW_NODE_SPACING,
  HUB_RADIUS,
  bindTopologyToSceneObjects,
  buildTopologyCameraSignature,
  buildTopologyConnectionLineId,
  buildTopologyRuntimeLayoutPositions,
  computeTopologyCameraFrame,
  formatTopologySelectionReason,
  generateAutoTopology,
  generateFlowTopology,
  generateHubTopology,
  generateTopology,
  isValidScenePosition,
  resolveEffectiveLayoutPositions,
  resolveRuntimeScenePosition,
  resolveTopologyConnectionLines,
  selectTopology,
  type SceneConnectionLine,
  type SceneTopologyBinding,
  type SceneTopologyBindingResult,
  type SceneTopologyMode,
  getTopologyGenerator,
  topologyRegistry,
  type TopologyRegistry,
} from "../topology";
