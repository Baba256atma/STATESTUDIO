import type { DecisionAction } from "./decisionRouter";

export type DecisionActionDeps = {
  setOverride?: (id: string, patch: { color?: string; scale?: number }) => void;
  updateObjectUx?: (id: string, patch: { opacity?: number; scale?: number }) => void;
};

export function applyDecisionActions(actions: DecisionAction[], deps: DecisionActionDeps) {
  if (!Array.isArray(actions) || actions.length === 0) return;

  actions.forEach((action) => {
    if (!action || typeof action.type !== "string") return;
    const target = action.target;
    if (!target) return;

    if (action.type === "SET_OBJECT_COLOR") {
      const color = (action.payload as { color?: string } | undefined)?.color;
      if (color && deps.setOverride) {
        deps.setOverride(target, { color });
      }
      return;
    }

    if (action.type === "SET_OBJECT_SCALE") {
      const multiplier = (action.payload as { multiplier?: number } | undefined)?.multiplier;
      if (typeof multiplier === "number" && deps.setOverride) {
        deps.setOverride(target, { scale: multiplier });
      }
      return;
    }

    if (action.type === "SET_OBJECT_OPACITY") {
      const opacity = (action.payload as { opacity?: number } | undefined)?.opacity;
      if (typeof opacity === "number" && deps.updateObjectUx) {
        deps.updateObjectUx(target, { opacity });
      }
    }
  });
}
