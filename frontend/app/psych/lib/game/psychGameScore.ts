import type { ObjectState, PsychElementId, PsychState } from "../../../lib/psych/reactionTypes";

export type PsychGameLevel = "Observer" | "Aware" | "Explorer" | "Integrator" | "Self-Master";

export type PsychGameState = {
  selfAwarenessScore: number;
  balanceScore: number;
  level: PsychGameLevel;
  achievements: string[];
};

type CalculatePsychGameStateInput = {
  psychState: PsychState;
  objects: Record<PsychElementId, ObjectState>;
  interactionCount: number;
  objectClickCount: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function levelForScore(score: number): PsychGameLevel {
  if (score >= 86) return "Self-Master";
  if (score >= 68) return "Integrator";
  if (score >= 46) return "Explorer";
  if (score >= 22) return "Aware";
  return "Observer";
}

export function calculatePsychGameState({ psychState, objects, interactionCount, objectClickCount }: CalculatePsychGameStateInput): PsychGameState {
  const objectValues = Object.values(objects);
  const averageBrightness = objectValues.reduce((sum, object) => sum + object.brightness, 0) / Math.max(1, objectValues.length);
  const averageActivity = objectValues.reduce((sum, object) => sum + object.activity, 0) / Math.max(1, objectValues.length);
  const objectSpread = objectValues.reduce((sum, object) => sum + Math.abs(object.brightness - averageBrightness) + Math.abs(object.activity - averageActivity), 0) / Math.max(1, objectValues.length);

  const interactionBonus = Math.min(36, interactionCount * 8);
  const explorationBonus = Math.min(18, objectClickCount * 3);
  const engagementBonus = clamp((averageBrightness + averageActivity) * 18, 0, 20);
  const selfAwarenessScore = Math.round(clamp(8 + interactionBonus + explorationBonus + engagementBonus, 0, 100));

  const neutralStateDistance = (
    Math.abs(psychState.energy - 50) +
    Math.abs(psychState.calm - 50) +
    Math.abs(psychState.tension - 50) +
    Math.abs(psychState.curiosity - 50)
  ) / 4;
  const tensionPenalty = psychState.tension > 70 && psychState.calm < 45 ? (psychState.tension - psychState.calm) * 0.45 : 0;
  const objectBalancePenalty = objectSpread * 42;
  const balanceScore = Math.round(clamp(100 - neutralStateDistance * 0.9 - tensionPenalty - objectBalancePenalty, 0, 100));

  const achievements: string[] = [];
  if (interactionCount >= 1) achievements.push("First Awakening");
  if (objectClickCount >= 3) achievements.push("Element Explorer");
  if ((objects.fire?.brightness ?? 0) >= 0.3 || (objects.fire?.activity ?? 0) >= 0.38) achievements.push("Fire Contact");
  if ((objects.water?.brightness ?? 0) >= 0.38) achievements.push("Calm Current");

  return {
    selfAwarenessScore,
    balanceScore,
    level: levelForScore(selfAwarenessScore),
    achievements,
  };
}
