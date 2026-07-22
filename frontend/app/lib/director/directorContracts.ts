import type {
  DirectorContractDeclaration,
  DirectorContractName,
} from "./directorFoundationTypes.ts";

const declareContract = (
  contractName: DirectorContractName,
  fields: readonly string[],
  deterministicOrder: number,
): DirectorContractDeclaration =>
  Object.freeze({
    contractId: `DIRECTOR-1:1/Contract/${contractName}`,
    contractName,
    fields: Object.freeze([...fields]),
    deterministicOrder,
    metadataOnly: true,
    immutable: true,
    runtimeBehavior: "None",
  });

export const DirectorContracts = Object.freeze([
  declareContract("ExecutiveScene", ["sceneId", "plan", "lifecycleState"], 1),
  declareContract("ScenePlan", ["planId", "intent", "layers", "cameraFocus", "executiveFocus", "timeline"], 2),
  declareContract("SceneObject", ["objectId", "objectType", "placementRef", "sourceRef"], 3),
  declareContract("SceneLayer", ["layerId", "order", "objects"], 4),
  declareContract("CameraFocus", ["focusId", "target", "framing"], 5),
  declareContract("CameraTarget", ["targetId", "sceneObjectRef"], 6),
  declareContract("VisualizationIntent", ["intentId", "intentType", "sourceRef", "emphasis"], 7),
  declareContract("ExecutiveFocus", ["focusId", "subjectRefs", "priority"], 8),
  declareContract("Timeline", ["timelineId", "markers", "transitions", "animationInstructions"], 9),
  declareContract("AnimationInstruction", ["instructionId", "targetRef", "animationType", "startMarkerRef", "endMarkerRef"], 10),
  declareContract("SceneTransition", ["transitionId", "fromMarkerRef", "toMarkerRef", "transitionType"], 11),
  declareContract("SceneMarker", ["markerId", "sequence", "label"], 12),
] as const);

export const DirectorContractNames = Object.freeze(
  DirectorContracts.map(({ contractName }) => contractName),
);

