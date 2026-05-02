export type PsychElementId = "sun" | "water" | "fire" | "air" | "earth" | "ego";

export type PsychElementVisualConfig = {
  id: PsychElementId;
  label: string;
  position: [number, number, number];
  baseColor: string;
  defaultBrightness: number; // 0-1
  defaultActivity: number; // 0-1
};

export const PSYCH_ELEMENT_CONFIGS: PsychElementVisualConfig[] = [
  {
    id: "sun",
    label: "Foggy Sun",
    position: [0, 1.8, -0.4],
    baseColor: "#d69a3d",
    defaultBrightness: 0.9,
    defaultActivity: 0.2,
  },
  {
    id: "ego",
    label: "Ego",
    position: [0, 0, 0],
    baseColor: "#5f5f74",
    defaultBrightness: 0.6,
    defaultActivity: 0.15,
  },
  {
    id: "fire",
    label: "Fire",
    position: [2.4, 0.5, 0],
    baseColor: "#cf4a24",
    defaultBrightness: 0.8,
    defaultActivity: 0.7,
  },
  {
    id: "water",
    label: "Liquid",
    position: [-2.2, -0.7, 0],
    baseColor: "#247fa0",
    defaultBrightness: 0.6,
    defaultActivity: 0.35,
  },
  {
    id: "air",
    label: "Air",
    position: [-1.7, 0.9, -0.2],
    baseColor: "#9bd9e6",
    defaultBrightness: 0.5,
    defaultActivity: 0.25,
  },
  {
    id: "earth",
    label: "Earth",
    position: [1.6, -1.3, 0.2],
    baseColor: "#47704a",
    defaultBrightness: 0.45,
    defaultActivity: 0.12,
  },
];

export default PSYCH_ELEMENT_CONFIGS;
