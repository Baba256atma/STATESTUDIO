import type { StrategicLayoutMode } from "./executiveDensityTypes";
import type { Vector3Tuple } from "../../sceneTypes";
import { logStrategicLayoutApplied } from "./executiveDensityInstrumentation";

export type StrategicLayoutInput = {
  mode: StrategicLayoutMode;
  index: number;
  objectCount: number;
  spacing?: number;
  columns?: number;
};

const SUPPORTED_LAYOUT_MODES: StrategicLayoutMode[] = ["GRID", "NETWORK"];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function clampBounds(position: Vector3Tuple): Vector3Tuple {
  return [
    Number(clamp(position[0], -8.5, 8.5).toFixed(3)),
    Number(clamp(position[1], -2.5, 2.5).toFixed(3)),
    Number(clamp(position[2], -8.5, 8.5).toFixed(3)),
  ];
}

export function isStrategicLayoutModeSupported(mode: StrategicLayoutMode): boolean {
  return SUPPORTED_LAYOUT_MODES.includes(mode);
}

/** Grid layout for executive readability at medium/high object counts. */
export function resolveGridLayoutPosition(input: StrategicLayoutInput): Vector3Tuple {
  const spacing = Math.max(0.95, input.spacing ?? 1.25);
  const columns = Math.max(3, Math.min(12, input.columns ?? Math.ceil(Math.sqrt(Math.max(1, input.objectCount)))));
  const row = Math.floor(input.index / columns);
  const col = input.index % columns;
  const x = (col - (columns - 1) / 2) * spacing;
  const z = (row - Math.floor((input.objectCount - 1) / columns) / 2) * spacing;
  const y = ((input.index % 3) - 1) * 0.12;
  return clampBounds([x, y, z]);
}

/** Network layout using golden-angle orbit for organic system topology. */
export function resolveNetworkLayoutPosition(input: StrategicLayoutInput): Vector3Tuple {
  if (input.index <= 0) return [0, 0, 0];
  const spacing = Math.max(0.9, input.spacing ?? 1.15);
  const radius = spacing * (1.15 + Math.floor((input.index - 1) / 10) * 0.55);
  const angle = (input.index - 1) * 2.399963229728653;
  const y = ((input.index - 1) % 4 - 1.5) * 0.16;
  return clampBounds([Math.cos(angle) * radius, y, Math.sin(angle) * radius]);
}

export function resolveStrategicLayoutPosition(input: StrategicLayoutInput): Vector3Tuple {
  const position =
    input.mode === "GRID" ? resolveGridLayoutPosition(input) : resolveNetworkLayoutPosition(input);

  logStrategicLayoutApplied({
    mode: input.mode,
    index: input.index,
    objectCount: input.objectCount,
    spacing: input.spacing ?? null,
    position,
  });

  return position;
}

export function resolvePreferredStrategicLayoutMode(objectCount: number): StrategicLayoutMode {
  if (objectCount <= 6) return "NETWORK";
  return "GRID";
}
