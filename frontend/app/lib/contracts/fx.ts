export type EmotionalFxKind =
  | "calm"
  | "focus"
  | "warning"
  | "danger"
  | "success"
  | "neutral";

export type EmotionalFx = {
  kind: EmotionalFxKind;
  intensity: number; // 0..1
  // optional short label for HUD
  label?: string;
};
