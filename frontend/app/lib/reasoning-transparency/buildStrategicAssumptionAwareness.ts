import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes.ts";
import type {
  ExecutiveMetaCognitionSnapshot,
  ExecutiveMetaCognitionAssumption,
} from "../meta-cognition/executiveMetaCognitionTypes.ts";
import type {
  ExecutiveReasoningAssumption,
  StrategicAssumptionAwareness,
} from "./executiveReasoningTransparencyTypes.ts";

function mapSource(
  source: ExecutiveMetaCognitionAssumption["source"]
): ExecutiveReasoningAssumption["source"] {
  switch (source) {
    case "scene":
      return "operational";
    case "recommendation":
      return "strategic";
    case "governance":
      return "governance";
    case "confidence":
      return "evidence";
    case "assistant":
      return "interpretation";
    default:
      return "interpretation";
  }
}

function stableSignature(parts: readonly unknown[]): string {
  return parts
    .map((part) => {
      if (part == null) return "null";
      if (typeof part === "string" || typeof part === "number" || typeof part === "boolean") return String(part);
      try {
        return JSON.stringify(part);
      } catch {
        return String(part);
      }
    })
    .join("|");
}

export function buildStrategicAssumptionAwareness(input: {
  metaCognition: ExecutiveMetaCognitionSnapshot;
  canonicalRecommendation?: CanonicalRecommendation | null;
}): StrategicAssumptionAwareness {
  const trackedAssumptions: ExecutiveReasoningAssumption[] = input.metaCognition.assumptions.map((item) => ({
    id: item.id.replace("assumption::", "strategic-assumption::"),
    label: item.label,
    source: mapSource(item.source),
    stability: item.stability,
  }));

  if (input.canonicalRecommendation?.simulation?.summary) {
    trackedAssumptions.push({
      id: "strategic-assumption::simulation-context",
      label: "Simulation context informs but does not replace executive judgment.",
      source: "evidence",
      stability: "forming",
    });
  }

  const dependencyGaps: string[] = [];
  const evidenceWeakness: string[] = [];

  for (const item of input.metaCognition.uncertainty) {
    if (item.id.includes("thin-scene") || item.id.includes("weak-signal")) {
      dependencyGaps.push(item.label);
    } else {
      evidenceWeakness.push(item.label);
    }
  }

  if (!input.canonicalRecommendation) {
    evidenceWeakness.push("Canonical advisory boundary is not yet established.");
  }

  return {
    trackedAssumptions: Object.freeze(trackedAssumptions.slice(0, 6)),
    dependencyGaps: Object.freeze(dependencyGaps.slice(0, 3)),
    evidenceWeakness: Object.freeze(evidenceWeakness.slice(0, 3)),
    signature: stableSignature([
      input.metaCognition.signature,
      trackedAssumptions.map((a) => a.id),
      dependencyGaps,
      evidenceWeakness,
    ]),
  };
}
