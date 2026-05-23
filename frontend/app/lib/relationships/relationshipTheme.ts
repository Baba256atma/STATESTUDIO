import { resolveSceneThemeTokens } from "../../lib/theme/sceneThemeTokens";
import type { SceneThemeId } from "../../lib/theme/sceneThemeTypes";
import type { NexoraRelationshipType } from "../../lib/relationships/relationshipTypes";

export type RelationshipVisualTokens = {
  lineColor: string;
  labelColor: string;
  arrowColor: string;
  opacity: number;
  lineWidth: number;
  variant: "solid" | "directional" | "thin" | "double" | "warning" | "strong";
};

const TYPE_OPACITY: Partial<Record<NexoraRelationshipType, number>> = {
  risk: 0.82,
  blocks: 0.82,
  ownership: 0.78,
  flow: 0.72,
  influences: 0.72,
  dependency: 0.68,
  information: 0.54,
  resource: 0.66,
  supplies: 0.66,
  reports_to: 0.62,
  supports: 0.6,
  owns: 0.58,
  custom: 0.55,
};

export function resolveRelationshipVisualTokens(
  themeId: SceneThemeId = "night",
  type: NexoraRelationshipType = "dependency"
): RelationshipVisualTokens {
  const tokens = resolveSceneThemeTokens(themeId);
  const accent =
    type === "risk" || type === "blocks"
      ? tokens.danger
      : type === "supports" || type === "supplies" || type === "resource" || type === "flow"
        ? tokens.success
        : type === "influences" || type === "information"
          ? tokens.warning
          : type === "owns" || type === "ownership"
            ? tokens.accent
          : tokens.timelineConnector;
  const variant: RelationshipVisualTokens["variant"] =
    type === "risk" || type === "blocks"
      ? "warning"
      : type === "flow" || type === "supplies"
        ? "directional"
        : type === "information" || type === "influences"
          ? "thin"
          : type === "resource" || type === "supports"
            ? "double"
            : type === "ownership" || type === "owns" || type === "reports_to"
              ? "strong"
              : "solid";

  return {
    lineColor: accent,
    labelColor: tokens.textSecondary,
    arrowColor: tokens.textPrimary,
    opacity: TYPE_OPACITY[type] ?? 0.64,
    lineWidth: variant === "thin" ? 0.7 : variant === "strong" ? 1.7 : 1.15,
    variant,
  };
}
