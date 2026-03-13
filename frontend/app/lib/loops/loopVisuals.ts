import type { SceneLoop, LoopType, LoopStatus } from "../sceneTypes";
import { clamp01 } from "./loopContract";

export type LoopVisual = {
  color: string;
  lineWidth: number;
  pulse: number;
  label: string;
  dash?: boolean;
};

const typeLabelMap: Record<LoopType, string> = {
  quality_protection: "Quality Protection",
  cost_compression: "Cost Compression",
  delivery_customer: "Delivery & Customer",
  risk_ignorance: "Risk Ignorance",
  stability_balance: "Stability & Balance",
};

const typeColorMap: Record<LoopType, string> = {
  quality_protection: "#4cc9f0",
  cost_compression: "#f8961e",
  delivery_customer: "#43aa8b",
  risk_ignorance: "#f94144",
  stability_balance: "#b5179e",
};

function baseColorFor(type: LoopType): string {
  return typeColorMap[type] ?? "#95a5a6";
}

function labelFor(type: LoopType): string {
  return typeLabelMap[type] ?? "Loop";
}

export function getLoopVisual(loop: SceneLoop): LoopVisual {
  const loopType = (loop?.type as LoopType) ?? "stability_balance";
  const severity = clamp01(
    typeof loop?.severity === "number"
      ? loop.severity
      : typeof loop?.strength === "number"
      ? loop.strength
      : 0.35
  );
  const status: LoopStatus | undefined = loop?.status as LoopStatus | undefined;

  let lineWidth = Math.min(6, Math.max(1, 1 + Math.round(5 * severity)));
  let pulse = severity;
  let dash = false;

  if (status === "paused") {
    dash = true;
    pulse = 0;
  } else if (status === "warning") {
    lineWidth = Math.min(6, lineWidth + 1);
  }

  return {
    color: baseColorFor(loopType),
    lineWidth,
    pulse,
    label: loop?.label ?? labelFor(loopType),
    dash,
  };
}
