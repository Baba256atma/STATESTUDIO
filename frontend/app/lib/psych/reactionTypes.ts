export type PsychElementId = "fire" | "water" | "air" | "earth" | "sun" | "ego";

export type PsychState = {
  energy: number; // 0-100
  calm: number; // 0-100
  tension: number; // 0-100
  curiosity: number; // 0-100
};

export type ObjectState = {
  id: PsychElementId;
  brightness: number; // 0-1
  activity: number; // 0-1
};

export type ReactionResult = {
  stateDelta: Partial<PsychState>;
  objectEffects: Record<PsychElementId, Partial<ObjectState>>;
  message?: string;
};
