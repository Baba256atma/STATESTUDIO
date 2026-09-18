/**
 * NPA-T RMS:10 — in-process experiment views. Not inferred from UI.
 */

import type { RmsExperimentView } from "./rmsExperimentContract.ts";
import type { RmsPublicSimulationState } from "./rmsSimulationState.ts";

type Stored = {
  view: RmsExperimentView;
  parent: RmsPublicSimulationState;
  template: RmsPublicSimulationState;
  branches: Map<string, RmsPublicSimulationState>;
};

const BY_ID = new Map<string, Stored>();
const BY_WATCH = new Map<string, string>();

export function setRmsExperimentStored(stored: Stored): RmsExperimentView {
  BY_ID.set(stored.view.experiment.experimentId, stored);
  BY_WATCH.set(stored.view.experiment.parentWatchSessionId, stored.view.experiment.experimentId);
  return stored.view;
}

export function getRmsExperimentStored(experimentId: string): Stored | null {
  return BY_ID.get(experimentId) ?? null;
}

export function getRmsExperimentIdForWatch(watchSessionId: string): string | null {
  return BY_WATCH.get(watchSessionId) ?? null;
}

export function deleteRmsExperimentForWatch(watchSessionId: string): void {
  const experimentId = BY_WATCH.get(watchSessionId);
  if (!experimentId) return;
  BY_WATCH.delete(watchSessionId);
  BY_ID.delete(experimentId);
}
