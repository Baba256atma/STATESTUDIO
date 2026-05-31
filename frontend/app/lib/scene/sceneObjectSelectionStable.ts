/** Stable object-selection reference for scene rendering (panel churn must not recreate selection). */

export type SceneObjectSelectionLike = {
  highlighted_objects?: string[];
  risk_sources?: string[];
  risk_targets?: string[];
  dim_unrelated_objects?: boolean;
} | null;

export function buildSceneObjectSelectionSignature(
  selection: SceneObjectSelectionLike
): string {
  if (!selection) return "none";
  return JSON.stringify({
    highlighted: [...(selection.highlighted_objects ?? [])].sort(),
    riskSources: [...(selection.risk_sources ?? [])].sort(),
    riskTargets: [...(selection.risk_targets ?? [])].sort(),
    dim: selection.dim_unrelated_objects === true,
  });
}
