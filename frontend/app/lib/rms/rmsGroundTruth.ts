/**
 * NPA-T RMS:1 — Simulation World / Ground Truth.
 *
 * Reality ≠ Data ≠ Nexora Knowledge.
 * Operator may later emit observable data from this world.
 * Observer may inspect it. Nexora must not receive it automatically.
 */

export const RMS_KNOWLEDGE_PLANES = Object.freeze([
  "GROUND_TRUTH",
  "OBSERVABLE_DATA",
  "NEXORA_KNOWLEDGE",
] as const);

export type RmsKnowledgePlane = (typeof RMS_KNOWLEDGE_PLANES)[number];

export type RmsWorldFact = {
  readonly factId: string;
  readonly key: string;
  readonly value: string | number | boolean;
};

export type RmsGroundTruth = {
  readonly worldId: string;
  readonly facts: readonly RmsWorldFact[];
};

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

export function freezeRmsGroundTruth(input: RmsGroundTruth): RmsGroundTruth {
  return Object.freeze({
    worldId: input.worldId,
    facts: Object.freeze(input.facts.map((fact) => Object.freeze({ ...fact }))),
  });
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
