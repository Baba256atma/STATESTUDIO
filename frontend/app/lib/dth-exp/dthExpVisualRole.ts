/**
 * NPA-T DTH-EXP:1 — extensible visual-role contract.
 * Presentation only. Distinct from VAI analytical roles and DTH:5 scene actor roles.
 * Nexo families are reserved consumers, not implemented here.
 */

export const DTH_EXP_NEXO_SCENE_FAMILIES = Object.freeze([
  "NexoBubble",
  "NexoBars",
  "NexoFlow",
  "NexoImpact",
  "NexoRisk",
  "NexoTime",
  "NexoCause",
  "NexoExecution",
  "NexoOutcome",
] as const);

export type DthExpNexoSceneFamily = (typeof DTH_EXP_NEXO_SCENE_FAMILIES)[number];

export const DTH_EXP_VISUAL_ROLES = Object.freeze([
  "bubble",
  "bar",
  "flow-node",
  "impact-node",
  "cause-node",
  "risk-marker",
  "time-point",
  "execution-marker",
  "outcome-marker",
] as const);

export type DthExpVisualRole = (typeof DTH_EXP_VISUAL_ROLES)[number];

export const DTH_EXP_VISUAL_ROLE_FAMILY: Readonly<Record<DthExpVisualRole, DthExpNexoSceneFamily>> =
  Object.freeze({
    bubble: "NexoBubble",
    bar: "NexoBars",
    "flow-node": "NexoFlow",
    "impact-node": "NexoImpact",
    "cause-node": "NexoCause",
    "risk-marker": "NexoRisk",
    "time-point": "NexoTime",
    "execution-marker": "NexoExecution",
    "outcome-marker": "NexoOutcome",
  });

export const DTH_EXP_NEXO_FAMILY_IMPLEMENTATION = Object.freeze(
  Object.fromEntries(DTH_EXP_NEXO_SCENE_FAMILIES.map((family) => [family, false as const])) as Record<
    DthExpNexoSceneFamily,
    false
  >,
);

export function isDthExpVisualRole(value: string | null | undefined): value is DthExpVisualRole {
  return value != null && (DTH_EXP_VISUAL_ROLES as readonly string[]).includes(value);
}

export const DTH_EXP_NEXO_TIME_BOUNDARY = Object.freeze({
  identity: "NPA-T DTH-EXP:1/NexoTimeBoundary" as const,
  timelineIsVisualizationTechniqueInsideNexoTime: true as const,
  parallelTimelineTheatreSystem: false as const,
  parallelTimelineEngine: false as const,
  eveTimelineAdoptedAsTheatreAuthority: false as const,
  nexoTimeImplemented: false as const,
  rule: "Timeline is a visualization technique inside NexoTime, not a separate Theatre system.",
});
