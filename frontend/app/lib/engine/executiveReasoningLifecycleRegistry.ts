import { ExecutiveReasoningLifecycle } from "./executiveReasoningPipelineFoundation.ts";

export const ExecutiveReasoningLifecycleRegistry = Object.freeze(
  ExecutiveReasoningLifecycle.map((stage) => Object.freeze({
    id: stage.id,
    name: stage.name,
    description: stage.description,
    order: stage.order,
    owner: "ENG-6",
    status: "Registered",
    version: "1.0.0",
    sourcePhase: "ENG-6:1",
    metadataOnly: true,
    immutable: true,
    runtimeFree: true,
  } as const)),
);

const lifecycleIndex = Object.freeze(
  Object.fromEntries(ExecutiveReasoningLifecycleRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, (typeof ExecutiveReasoningLifecycleRegistry)[number] | undefined>
  >,
);

export const getReasoningLifecycleStageById = (
  id: string,
): (typeof ExecutiveReasoningLifecycleRegistry)[number] | undefined => lifecycleIndex[id];
