/**
 * NPA-T RMS:8 — customer Scenario cards from the RMS:7 registry.
 */

import { listRmsScenarios } from "./rmsScenarioRegistry.ts";
import type { RmsWatchScenarioCard } from "./rmsWatchContract.ts";

export function listRmsWatchScenarioCards(): readonly RmsWatchScenarioCard[] {
  return Object.freeze(
    listRmsScenarios().map((scenario) =>
      Object.freeze({
        scenarioId: scenario.scenarioId,
        version: scenario.version,
        title: scenario.customer.title,
        worldKind: scenario.worldKind,
        worldKindLabel: scenario.worldKind === "PROJECT" ? "Project" : scenario.worldKind === "HYBRID" ? "Hybrid" : "Business",
        shortDescription: scenario.customer.shortDescription,
        managementTopics: scenario.customer.managementTopics,
        estimatedLength: scenario.customer.estimatedLength,
        dataAreas: scenario.customer.dataSourcesInvolved,
      } satisfies RmsWatchScenarioCard),
    ),
  );
}

export function getRmsWatchScenarioCard(scenarioId: string, version = "1.0"): RmsWatchScenarioCard {
  const card = listRmsWatchScenarioCards().find((item) => item.scenarioId === scenarioId && item.version === version);
  if (!card) throw new Error(`RMS:8 unknown watch scenario ${scenarioId}@${version}`);
  return card;
}
