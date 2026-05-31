import type {
  ExecutiveOrientationTier,
  ProgressiveDisclosureLayer,
  ProgressiveDisclosureSnapshot,
} from "./executiveOrientationTypes";
import { logProgressiveDisclosure } from "./executiveOrientationInstrumentation";

const LAYER_ORDER: ProgressiveDisclosureLayer[] = [
  "situation",
  "risk",
  "decision",
  "action",
  "advanced",
];

function layersForTier(tier: ExecutiveOrientationTier, elapsedSeconds: number): ProgressiveDisclosureLayer[] {
  if (tier === "experiencedUser") return [...LAYER_ORDER];

  if (tier === "returningUser") {
    if (elapsedSeconds < 5) return ["situation", "risk"];
    if (elapsedSeconds < 15) return ["situation", "risk", "decision"];
    if (elapsedSeconds < 25) return ["situation", "risk", "decision", "action"];
    return [...LAYER_ORDER];
  }

  // firstVisit — gradual exposure across the first 30 seconds
  if (elapsedSeconds < 5) return ["situation"];
  if (elapsedSeconds < 12) return ["situation", "risk"];
  if (elapsedSeconds < 20) return ["situation", "risk", "decision"];
  if (elapsedSeconds < 28) return ["situation", "risk", "decision", "action"];
  return [...LAYER_ORDER];
}

function phaseLabelForLayers(layers: ProgressiveDisclosureLayer[]): string {
  const last = layers[layers.length - 1] ?? "situation";
  if (last === "situation") return "Situation";
  if (last === "risk") return "Risk context";
  if (last === "decision") return "Decision posture";
  if (last === "action") return "Recommended actions";
  return "Advanced analysis";
}

/** E2:48 Part 6 — progressive workspace disclosure by visit tier and elapsed time. */
export function resolveProgressiveWorkspaceDisclosure(input: {
  tier: ExecutiveOrientationTier;
  elapsedSeconds: number;
}): ProgressiveDisclosureSnapshot {
  const visibleLayers = layersForTier(input.tier, input.elapsedSeconds);
  const snapshot: ProgressiveDisclosureSnapshot = {
    visibleLayers,
    phaseLabel: phaseLabelForLayers(visibleLayers),
  };
  logProgressiveDisclosure("resolved", snapshot);
  return snapshot;
}

export function isProgressiveLayerVisible(
  layer: ProgressiveDisclosureLayer,
  snapshot: ProgressiveDisclosureSnapshot
): boolean {
  return snapshot.visibleLayers.includes(layer);
}
