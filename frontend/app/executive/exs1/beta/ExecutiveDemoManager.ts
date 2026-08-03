/**
 * Phase E — Demo Mode manager (reset / load official demos).
 */

import type { DemoDataset, DemoDatasetId } from "./ExecutiveDemoDatasets";
import { OFFICIAL_DEMO_DATASETS, getDemoDataset } from "./ExecutiveDemoDatasets";

export type DemoLoadResult = {
  readonly dataset: DemoDataset;
  readonly advisory: readonly string[];
  readonly loadedAt: number;
};

export type ExecutiveDemoManager = {
  readonly list: () => readonly DemoDataset[];
  readonly current: () => DemoDataset | null;
  resetDemo: () => DemoLoadResult;
  loadDemo: (id: DemoDatasetId) => DemoLoadResult;
  loadManufacturingDemo: () => DemoLoadResult;
  loadPmoDemo: () => DemoLoadResult;
  loadRetailDemo: () => DemoLoadResult;
};

export function createDemoManager(
  initial: DemoDatasetId = "manufacturing",
): ExecutiveDemoManager {
  let currentId: DemoDatasetId = initial;

  function load(id: DemoDatasetId): DemoLoadResult {
    const dataset = getDemoDataset(id);
    if (!dataset) throw new Error(`Unknown demo dataset ${id}`);
    currentId = id;
    return {
      dataset,
      advisory: [
        `Demo · ${dataset.name}`,
        `Story · ${dataset.story}`,
        `Pack · ${dataset.pack}`,
        `CSV hint · ${dataset.csvHint}`,
        "Reset Demo restores Manufacturing defaults.",
      ],
      loadedAt: Date.now(),
    };
  }

  return {
    list: () => OFFICIAL_DEMO_DATASETS,
    current: () => getDemoDataset(currentId) ?? null,
    resetDemo: () => load("manufacturing"),
    loadDemo: (id) => load(id),
    loadManufacturingDemo: () => load("manufacturing"),
    loadPmoDemo: () => load("pmo"),
    loadRetailDemo: () => load("retail"),
  };
}
