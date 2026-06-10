/**
 * Phase 6:2 — Strategic Objective Registry.
 * Generic institutional framework — not organization-specific objectives.
 */

export const STRATEGIC_OBJECTIVE_REGISTRY_VERSION = "6.2.0";

export type StrategicObjectiveId = "objective_a" | "objective_b" | "objective_c";

export type StrategicPriority = "foundational" | "moderate" | "high" | "critical";

export type StrategicTheme =
  | "growth"
  | "resilience"
  | "innovation"
  | "operational_excellence";

export type StrategicInitiativeId = "initiative_alpha" | "initiative_beta" | "initiative_gamma";

export type StrategicObjectiveImpactLevel = "supported" | "neutral" | "at_risk";

export type StrategicObjectiveEntry = Readonly<{
  id: StrategicObjectiveId;
  label: string;
  theme: StrategicTheme;
  priority: StrategicPriority;
  initiativeId: StrategicInitiativeId;
  summary: string;
}>;

export type StrategicInitiativeEntry = Readonly<{
  id: StrategicInitiativeId;
  label: string;
  theme: StrategicTheme;
  priority: StrategicPriority;
  summary: string;
}>;

export type StrategicThemeEntry = Readonly<{
  theme: StrategicTheme;
  label: string;
  summary: string;
}>;

export const STRATEGIC_THEME_REGISTRY: Readonly<Record<StrategicTheme, StrategicThemeEntry>> =
  Object.freeze({
    growth: Object.freeze({
      theme: "growth",
      label: "Growth",
      summary: "Organizational expansion and market advancement",
    }),
    resilience: Object.freeze({
      theme: "resilience",
      label: "Resilience",
      summary: "Stability, continuity, and risk absorption capacity",
    }),
    innovation: Object.freeze({
      theme: "innovation",
      label: "Innovation",
      summary: "Transformational capability and adaptive change",
    }),
    operational_excellence: Object.freeze({
      theme: "operational_excellence",
      label: "Operational Excellence",
      summary: "Execution quality and institutional efficiency",
    }),
  });

export const STRATEGIC_INITIATIVE_REGISTRY: Readonly<
  Record<StrategicInitiativeId, StrategicInitiativeEntry>
> = Object.freeze({
  initiative_alpha: Object.freeze({
    id: "initiative_alpha",
    label: "Initiative Alpha",
    theme: "growth",
    priority: "high",
    summary: "Primary growth trajectory initiative",
  }),
  initiative_beta: Object.freeze({
    id: "initiative_beta",
    label: "Initiative Beta",
    theme: "resilience",
    priority: "critical",
    summary: "Institutional resilience and continuity initiative",
  }),
  initiative_gamma: Object.freeze({
    id: "initiative_gamma",
    label: "Initiative Gamma",
    theme: "innovation",
    priority: "moderate",
    summary: "Innovation and adaptive transformation initiative",
  }),
});

export const STRATEGIC_OBJECTIVE_REGISTRY: Readonly<
  Record<StrategicObjectiveId, StrategicObjectiveEntry>
> = Object.freeze({
  objective_a: Object.freeze({
    id: "objective_a",
    label: "Strategic Objective A",
    theme: "growth",
    priority: "high",
    initiativeId: "initiative_alpha",
    summary: "Advance organizational growth trajectory",
  }),
  objective_b: Object.freeze({
    id: "objective_b",
    label: "Strategic Objective B",
    theme: "resilience",
    priority: "critical",
    initiativeId: "initiative_beta",
    summary: "Strengthen institutional resilience and continuity",
  }),
  objective_c: Object.freeze({
    id: "objective_c",
    label: "Strategic Objective C",
    theme: "innovation",
    priority: "moderate",
    initiativeId: "initiative_gamma",
    summary: "Enable innovation and adaptive transformation",
  }),
});

export function listStrategicObjectives(): readonly StrategicObjectiveEntry[] {
  return Object.freeze(Object.values(STRATEGIC_OBJECTIVE_REGISTRY));
}

export function listStrategicInitiatives(): readonly StrategicInitiativeEntry[] {
  return Object.freeze(Object.values(STRATEGIC_INITIATIVE_REGISTRY));
}

export function listStrategicThemes(): readonly StrategicThemeEntry[] {
  return Object.freeze(Object.values(STRATEGIC_THEME_REGISTRY));
}

export function getStrategicObjective(id: StrategicObjectiveId): StrategicObjectiveEntry {
  return STRATEGIC_OBJECTIVE_REGISTRY[id];
}
