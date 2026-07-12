import { ExecutiveIntentResolutionRegistry } from "./executiveIntentResolutionIndex.ts";
import { ExecutiveIntentResolutionCapabilityRegistry } from "./executiveIntentResolutionCapabilityRegistry.ts";
import { ExecutiveIntentResolutionDomainRegistry } from "./executiveIntentResolutionDomainRegistry.ts";
import { ExecutiveIntentResolutionIntentRegistry } from "./executiveIntentResolutionIntentRegistry.ts";
import type { ExecutiveRegistryCollection, ExecutiveRegistryManifest } from "./executiveIntentResolutionRegistryTypes.ts";

const goals = Object.freeze({ id: "eng-3-registry-goals", group: "Goals", category: "Goal", owner: "ENG-3", version: "1.0.0", entries: ExecutiveIntentResolutionRegistry.goals, metadataOnly: true, immutable: true } as const satisfies ExecutiveRegistryCollection);
const outputs = Object.freeze({ id: "eng-3-registry-output-expectations", group: "OutputExpectations", category: "Output", owner: "ENG-3", version: "1.0.0", entries: ExecutiveIntentResolutionRegistry.outputExpectations, metadataOnly: true, immutable: true } as const satisfies ExecutiveRegistryCollection);
const lifecycle = Object.freeze({ id: "eng-3-registry-lifecycle-stages", group: "LifecycleStages", category: "Lifecycle", owner: "ENG-3", version: "1.0.0", entries: ExecutiveIntentResolutionRegistry.lifecycleStages, metadataOnly: true, immutable: true } as const satisfies ExecutiveRegistryCollection);
const priorities = Object.freeze({ id: "eng-3-registry-priorities", group: "Priorities", category: "Priority", owner: "ENG-3", version: "1.0.0", entries: ExecutiveIntentResolutionRegistry.priorities, metadataOnly: true, immutable: true } as const satisfies ExecutiveRegistryCollection);
const confidence = Object.freeze({ id: "eng-3-registry-confidence-levels", group: "ConfidenceLevels", category: "Confidence", owner: "ENG-3", version: "1.0.0", entries: ExecutiveIntentResolutionRegistry.confidenceLevels, metadataOnly: true, immutable: true } as const satisfies ExecutiveRegistryCollection);
const statuses = Object.freeze({ id: "eng-3-registry-statuses", group: "Statuses", category: "Status", owner: "ENG-3", version: "1.0.0", entries: ExecutiveIntentResolutionRegistry.statuses, metadataOnly: true, immutable: true } as const satisfies ExecutiveRegistryCollection);

export const ExecutiveIntentResolutionRegistryManifest = Object.freeze({
  ownership: "ENG-3",
  registryGroups: Object.freeze([
    ExecutiveIntentResolutionIntentRegistry, goals, ExecutiveIntentResolutionDomainRegistry,
    ExecutiveIntentResolutionCapabilityRegistry, outputs, lifecycle, priorities, confidence, statuses,
  ]),
  dependencies: Object.freeze(["ENG-3:1:executiveIntentResolutionIndex.ts"]),
  visibility: "Public",
  compatibility: Object.freeze({ foundation: "ENG-3:1", engineLayer: "Compatible", ownershipSafe: true, collisionSafe: true, publicApiOnly: true }),
  version: "1.0.0", certificationState: "Uncertified", stability: "Draft",
  publicationState: "Published", metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveRegistryManifest);
