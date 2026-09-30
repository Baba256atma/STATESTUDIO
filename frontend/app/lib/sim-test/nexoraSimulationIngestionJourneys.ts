/** SIM-TEST:2 activates the SIM-TEST:1 journey contract's INGESTION mode. */

import type { NexoraSimulationTestJourney } from "./nexoraSimulationTestContract.ts";
import {
  SIM_TEST_LOGISTICS_PARITY,
  SIM_TEST_MANUFACTURING_BASELINE,
  SIM_TEST_PROJECT_BASELINE,
  SIM_TEST_SERVICE_PARITY,
} from "./nexoraSimulationTestJourneys.ts";

function ingestionJourney(
  base: NexoraSimulationTestJourney,
  journeyId: string,
): NexoraSimulationTestJourney {
  return Object.freeze({
    ...base,
    journeyId,
    version: "2.0",
    mode: "INGESTION" as const,
    targetSurfaces: Object.freeze([
      ...base.targetSurfaces,
      "CUSTOMER_CSV",
      "RDI2_GATE",
      "CSV_PROVENANCE",
    ]),
  });
}

export const SIM_TEST_2_MANUFACTURING_INGESTION = ingestionJourney(
  SIM_TEST_MANUFACTURING_BASELINE,
  "ingestion-manager-investigation-manufacturing",
);

export const SIM_TEST_2_PROJECT_INGESTION = ingestionJourney(
  SIM_TEST_PROJECT_BASELINE,
  "ingestion-manager-investigation-project",
);

export const SIM_TEST_2_LOGISTICS_INGESTION = ingestionJourney(
  SIM_TEST_LOGISTICS_PARITY,
  "ingestion-parity-logistics",
);

export const SIM_TEST_2_SERVICE_INGESTION = ingestionJourney(
  SIM_TEST_SERVICE_PARITY,
  "ingestion-parity-service",
);

export const SIM_TEST_2_INGESTION_JOURNEYS = Object.freeze([
  SIM_TEST_2_MANUFACTURING_INGESTION,
  SIM_TEST_2_PROJECT_INGESTION,
  SIM_TEST_2_LOGISTICS_INGESTION,
  SIM_TEST_2_SERVICE_INGESTION,
]);

export function getNexoraSimulationIngestionJourney(scenarioId: string): NexoraSimulationTestJourney {
  const journey = SIM_TEST_2_INGESTION_JOURNEYS.find((item) => item.scenarioId === scenarioId);
  if (!journey) throw new Error(`SIM-TEST:2 unknown ingestion journey ${scenarioId}`);
  return journey;
}
