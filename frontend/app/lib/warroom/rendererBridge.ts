import type { DecisionPathState, PropagationState, RendererBridge } from "./warRoomTypes";

type RendererBridgeSetters = {
  setPropagationState: (next: PropagationState | null) => void;
  setDecisionPathState: (next: DecisionPathState | null) => void;
  setFocusTarget: (targetId: string | null) => void;
};

export function createRendererBridge(setters: RendererBridgeSetters): RendererBridge {
  return {
    setPropagationState: setters.setPropagationState,
    setDecisionPathState: setters.setDecisionPathState,
    setFocusTarget: setters.setFocusTarget,
  };
}
