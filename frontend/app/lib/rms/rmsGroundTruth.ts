/**
 * NPA-T RMS:1/2 — Simulation World / Ground Truth.
 *
 * Reality ≠ Data ≠ Nexora Knowledge.
 * RMS:2 instantiates structured Business/Project world state inside this seal.
 * Observer may inspect it. Nexora must not receive it automatically.
 */

import type { RmsGroundTruthSeed } from "./rmsWorldEngine.ts";
import { instantiateRmsGroundTruth } from "./rmsWorldEngine.ts";
import type { RmsStructuredGroundTruth, RmsWorldFact } from "./rmsWorldContract.ts";

export const RMS_KNOWLEDGE_PLANES = Object.freeze([
  "GROUND_TRUTH",
  "OBSERVABLE_DATA",
  "NEXORA_KNOWLEDGE",
] as const);

export type RmsKnowledgePlane = (typeof RMS_KNOWLEDGE_PLANES)[number];

export type { RmsWorldFact };

export type RmsGroundTruth = RmsStructuredGroundTruth;

export type RmsObservableDataEnvelope = {
  readonly envelopeId: string;
  readonly producedByActorId: string;
  readonly producedByKind: "OPERATOR_AGENT";
  readonly records: readonly Readonly<{
    readonly key: string;
    readonly value: string | number | boolean;
  }>[];
  readonly handoffOwner: "Data Reality";
  readonly implementsCsvGeneration: false;
};

export type RmsNexoraKnowledgeView = {
  readonly plane: "NEXORA_KNOWLEDGE";
  readonly runtimeOwner: "CC:5";
  readonly runtimeEntry: "executeNexoraConversationalExperience";
  readonly observableEnvelopeIds: readonly string[];
  readonly groundTruthExposed: false;
  readonly worldId: null;
  readonly facts: readonly never[];
};

export function freezeRmsGroundTruth(input: RmsGroundTruthSeed | RmsStructuredGroundTruth): RmsGroundTruth {
  if ("identity" in input && input.identity === "NPA-T RMS:2/BusinessProjectGroundTruth") {
    return input;
  }
  return instantiateRmsGroundTruth(input);
}

export function createEmptyObservableData(): readonly RmsObservableDataEnvelope[] {
  return Object.freeze([]);
}

export function projectRmsNexoraKnowledgeView(
  observableEnvelopeIds: readonly string[] = [],
): RmsNexoraKnowledgeView {
  return Object.freeze({
    plane: "NEXORA_KNOWLEDGE",
    runtimeOwner: "CC:5",
    runtimeEntry: "executeNexoraConversationalExperience",
    observableEnvelopeIds: Object.freeze([...observableEnvelopeIds]),
    groundTruthExposed: false,
    worldId: null,
    facts: Object.freeze([]),
  });
}

export function nexoraKnowledgeExposesGroundTruth(view: RmsNexoraKnowledgeView): boolean {
  return (
    view.groundTruthExposed !== false ||
    view.worldId !== null ||
    view.facts.length > 0
  );
}
