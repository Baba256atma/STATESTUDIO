import { PsychState, ObjectState, PsychElementId } from "./reactionTypes";
import { interpretUserInput } from "./reactionInterpreter";
import { applyReaction } from "./reactionEngine";

export function createPsychStore() {
  let state: PsychState = {
    energy: 50,
    calm: 50,
    tension: 50,
    curiosity: 50,
  };

  let objects: Record<PsychElementId, ObjectState> = {
    fire: { id: "fire", brightness: 0.2, activity: 0.2 },
    water: { id: "water", brightness: 0.2, activity: 0.1 },
    air: { id: "air", brightness: 0.2, activity: 0.1 },
    earth: { id: "earth", brightness: 0.2, activity: 0.05 },
    sun: { id: "sun", brightness: 0.2, activity: 0.1 },
    ego: { id: "ego", brightness: 0.2, activity: 0.1 },
  };

  return {
    getState: () => ({ ...state }),
    getObjects: () => ({ ...objects }),
    applyText: (text: string) => {
      if (process.env.NODE_ENV !== "production") {
        // dev log
        // eslint-disable-next-line no-console
        console.log("[Sycho][Reaction][Input]", text);
      }
      const reaction = interpretUserInput(text);
      const result = applyReaction(state, objects, reaction as any);
      state = result.nextState;
      objects = result.nextObjects;
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("[Sycho][Reaction][Result]", { state, objects, reaction });
      }
      return { state: { ...state }, objects: { ...objects }, reaction };
    },
  };
}
