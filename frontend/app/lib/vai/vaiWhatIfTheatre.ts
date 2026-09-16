/**
 * NPA-A VAI:7 — presentation overlay for baseline vs experiment.
 * Director arranges classified results. It does not calculate them.
 */

import type { VaiImpactScene } from "./vaiImpactComposer.ts";
import { vaiWhatIfIdentity } from "./vaiWhatIfIdentity.ts";
import type { VaiWhatIfExperiment, VaiWhatIfVariableView } from "./vaiWhatIfContract.ts";

export type VaiWhatIfTheatreRow = {
  readonly variableId: string;
  readonly displayName: string;
  readonly currentLabel: "CURRENT / BASELINE";
  readonly whatIfLabel: "WHAT-IF / ASSUMED";
  readonly baselineDisplay: string;
  readonly experimentDisplay: string;
  readonly resultClass: VaiWhatIfVariableView["resultClass"];
  readonly visualPropagation: "none" | "supported";
  readonly animated: false;
};

export type VaiWhatIfTheatreProjection = {
  readonly identity: typeof vaiWhatIfIdentity;
  readonly apply: boolean;
  readonly experimentId: string | null;
  readonly analysisContextId: string | null;
  readonly sceneId: string | null;
  readonly rows: readonly VaiWhatIfTheatreRow[];
  readonly visuallyMerged: false;
  readonly directorCalculated: false;
  readonly animatedUnsupported: false;
  readonly boundedLeverAction: "Explore change" | null;
  readonly createsExperimentOnLeverSelect: false;
};

export function projectVaiWhatIfTheatre(input: {
  readonly experiment: VaiWhatIfExperiment | null;
  readonly scene?: VaiImpactScene | null;
  readonly selectedLeverId?: string | null;
}): VaiWhatIfTheatreProjection {
  if (!input.experiment) {
    return emptyProjection(input.scene ?? null);
  }
  const rows = Object.freeze(
    input.experiment.views.map((view) =>
      Object.freeze({
        variableId: view.variableId,
        displayName: view.displayName,
        currentLabel: "CURRENT / BASELINE" as const,
        whatIfLabel: "WHAT-IF / ASSUMED" as const,
        baselineDisplay: view.baselineDisplay,
        experimentDisplay: view.experimentDisplay,
        resultClass: view.resultClass,
        visualPropagation: view.visualPropagation,
        animated: false as const,
      }),
    ),
  );
  const selected = input.selectedLeverId
    ? input.experiment.views.find((view) => view.variableId === input.selectedLeverId)
    : input.experiment.views.find((view) => view.role === "LEVER");
  return Object.freeze({
    identity: vaiWhatIfIdentity,
    apply: true,
    experimentId: input.experiment.experimentId,
    analysisContextId: input.experiment.analysisContextId,
    sceneId: input.scene?.sceneId ?? null,
    rows,
    visuallyMerged: false,
    directorCalculated: false,
    animatedUnsupported: false,
    boundedLeverAction: selected?.role === "LEVER" ? "Explore change" : null,
    createsExperimentOnLeverSelect: false,
  });
}

function emptyProjection(scene: VaiImpactScene | null): VaiWhatIfTheatreProjection {
  return Object.freeze({
    identity: vaiWhatIfIdentity,
    apply: false,
    experimentId: null,
    analysisContextId: scene?.analysisContextId ?? null,
    sceneId: scene?.sceneId ?? null,
    rows: Object.freeze([]),
    visuallyMerged: false,
    directorCalculated: false,
    animatedUnsupported: false,
    boundedLeverAction: null,
    createsExperimentOnLeverSelect: false,
  });
}
