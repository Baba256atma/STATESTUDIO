/**
 * NPA-T RMS:7 — read-only Scenario Registry.
 */

import type { RmsScenarioCategory } from "./rmsScenarioContract.ts";
import type { RmsScenarioDefinition } from "./rmsScenarioContract.ts";
import { RMS_INITIAL_SCENARIO_LIBRARY } from "./rmsScenarioLibrary.ts";
import type { RmsWorldKind } from "./rmsWorldContract.ts";

const CATALOG: readonly RmsScenarioDefinition[] = RMS_INITIAL_SCENARIO_LIBRARY;

export function listRmsScenarios(): readonly RmsScenarioDefinition[] {
  return CATALOG;
}

export function getRmsScenario(scenarioId: string, version = "1.0"): RmsScenarioDefinition {
  const found = CATALOG.find((item) => item.scenarioId === scenarioId && item.version === version);
  if (!found) throw new Error(`RMS:7 unknown scenario ${scenarioId}@${version}`);
  return found;
}

export function filterRmsScenarios(input: {
  readonly worldKind?: RmsWorldKind;
  readonly category?: RmsScenarioCategory;
  readonly complexity?: RmsScenarioDefinition["complexity"];
}): readonly RmsScenarioDefinition[] {
  return Object.freeze(
    CATALOG.filter((item) => {
      if (input.worldKind && item.worldKind !== input.worldKind) return false;
      if (input.category && item.category !== input.category) return false;
      if (input.complexity && item.complexity !== input.complexity) return false;
      return true;
    }),
  );
}

export function inspectRmsScenarioCapabilities(scenarioId: string, version = "1.0") {
  const scenario = getRmsScenario(scenarioId, version);
  return Object.freeze({
    scenarioId: scenario.scenarioId,
    version: scenario.version,
    worldKind: scenario.worldKind,
    category: scenario.category,
    requiredCapabilities: scenario.requiredCapabilities,
    enabledSources: scenario.enabledSources,
    tags: scenario.tags,
    customer: scenario.customer,
    forkCompatible: scenario.forkCompatible,
  });
}
