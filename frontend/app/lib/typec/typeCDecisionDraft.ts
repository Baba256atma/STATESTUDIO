import type { SceneJson } from "../sceneTypes.ts";
import type { TypeCDecisionReadinessSnapshot } from "./typeCDecisionReadiness.ts";

export type TypeCDecisionPosture =
  | "investigate"
  | "hold"
  | "recommend";

export type TypeCDecisionDraft = {
  id: string;
  scenarioId: string | null;
  posture: TypeCDecisionPosture;
  confidence: number;
  summary: string;
  reasons: string[];
  nextActions: string[];
  basedOnReadinessId: string;
  createdAt: string;
};

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function stableDraftId(input: {
  readinessId: string;
  posture: TypeCDecisionPosture;
  confidence: number;
}): string {
  const confidencePart = Math.round(input.confidence * 100);
  return `typec_decision_draft_${input.readinessId}_${input.posture}_${confidencePart}`;
}

function missingReasons(readiness: TypeCDecisionReadinessSnapshot): string[] {
  if (!readiness.missing.length) return ["No readiness gaps detected."];
  return readiness.missing.map((item) => `Missing readiness item: ${item}`);
}

export function buildTypeCDecisionDraft(input: {
  readiness: TypeCDecisionReadinessSnapshot | null;
  scene: SceneJson | null;
}): TypeCDecisionDraft | null {
  try {
    const { readiness } = input;
    if (!readiness) return null;

    const posture: TypeCDecisionPosture =
      readiness.level === "ready"
        ? "recommend"
        : readiness.level === "partial"
          ? "investigate"
          : "hold";
    const confidence = clamp01(
      readiness.level === "ready"
        ? 0.7
        : readiness.level === "partial"
          ? 0.45
          : 0.2
    );
    const summary =
      readiness.level === "ready"
        ? "Scenario is structurally ready for decision drafting."
        : readiness.level === "partial"
          ? "Scenario needs more structure before recommendation."
          : "Decision is blocked until the scenario structure is ready.";
    const reasons =
      readiness.level === "ready"
        ? [
            `Scenario contains ${readiness.objectCount} non-core objects.`,
            `Scenario contains ${readiness.loopCount} connection${readiness.loopCount === 1 ? "" : "s"}.`,
          ]
        : missingReasons(readiness);
    const nextActions =
      readiness.level === "ready"
        ? [
            "Review scenario assumptions",
            "Compare risk impact",
            "Prepare execution plan",
          ]
        : readiness.level === "partial"
          ? [
              "Add missing objects or connections",
              "Mark the selected scenario ready for decision",
              "Check decision readiness again",
            ]
          : [
              "Create or select a scenario",
              "Add at least two connected objects",
              "Mark the scenario ready for decision",
            ];

    return {
      id: stableDraftId({
        readinessId: readiness.id,
        posture,
        confidence,
      }),
      scenarioId: readiness.scenarioId,
      posture,
      confidence,
      summary,
      reasons,
      nextActions,
      basedOnReadinessId: readiness.id,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
