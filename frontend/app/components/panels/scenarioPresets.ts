/**
 * @deprecated Import scenario seeds from `app/lib/decision/scenarioPresetCatalog` (Decision Assistant).
 * Thin compatibility wrapper for panels that still expect `ScenarioPreset` shape.
 */
import type { ScenarioDomain as AssistantScenarioDomain } from "../../lib/decision/decisionAssistantTypes.ts";
import { getScenarioSeedsForDomain } from "../../lib/decision/scenarioPresetCatalog.ts";

export type ScenarioDomain = AssistantScenarioDomain;

export type ScenarioPreset = {
  name: string;
  delta: Record<string, number>;
};

export function buildScenarioPresets(domain: ScenarioDomain): ScenarioPreset[] {
  return getScenarioSeedsForDomain(domain).map((seed) => ({
    name: seed.name,
    delta: { ...seed.delta },
  }));
}
