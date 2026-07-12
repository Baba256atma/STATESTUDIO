import { ExecutiveRequestIntentFoundation } from "./executiveRequestIntentIndex.ts";
import { ExecutiveRequestIntentRegistryManifest } from "./executiveRequestIntentRegistryIndex.ts";
import { ExecutiveRequestIntentClassificationModel } from "./executiveRequestIntentClassificationModel.ts";
import { ExecutiveRequestIntentContextModel } from "./executiveRequestIntentContextModel.ts";
import { ExecutiveRequestIntentIntentModel } from "./executiveRequestIntentIntentModel.ts";
import { ExecutiveRequestIntentLifecycleModel } from "./executiveRequestIntentLifecycleModel.ts";
import { ExecutiveRequestIntentMetadataModel } from "./executiveRequestIntentMetadataModel.ts";
import { ExecutiveRequestIntentRelationshipModel } from "./executiveRequestIntentRelationshipModel.ts";
import { ExecutiveRequestIntentRequestModel } from "./executiveRequestIntentRequestModel.ts";
import type { ExecutiveRequestIntentModelManifest as ModelManifest } from "./executiveRequestIntentModelTypes.ts";

const models = Object.freeze([
  ExecutiveRequestIntentRequestModel,
  ExecutiveRequestIntentIntentModel,
  ExecutiveRequestIntentClassificationModel,
  ExecutiveRequestIntentContextModel,
  ExecutiveRequestIntentMetadataModel,
  ExecutiveRequestIntentLifecycleModel,
  ExecutiveRequestIntentRelationshipModel,
] as const);

const modelSummary = Object.freeze({
  modelCount: 7, relationshipCount: 5, dependencyCount: 2,
  namespace: "nexora.engine.executive.request-intent.model", version: "1.0.0",
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveRequestIntentModelManifest = Object.freeze({
  id: "ENG-2:3", name: "Executive Request & Intent Model Manifest",
  models,
  namespace: "nexora.engine.executive.request-intent.model", version: "1.0.0",
  dependencyReferences: Object.freeze([
    Object.freeze({ phase: "ENG-2:1", publicIndex: "executiveRequestIntentIndex.ts", reference: ExecutiveRequestIntentFoundation }),
    Object.freeze({ phase: "ENG-2:2", publicIndex: "executiveRequestIntentRegistryIndex.ts", reference: ExecutiveRequestIntentRegistryManifest }),
  ]),
  ownershipReferences: Object.freeze([
    "ENG-1 owns the generic Executive Engine Request Model.",
    "ENG-1 owns the generic Executive Engine Intent Model.",
    "ENG-2 owns the specialized Request & Intent Platform models.",
    "ENG-2 model filenames and public symbols are collision-safe.",
    "ENG-2 does not import or reuse ENG-1 implementation files.",
  ]),
  architecturalSummary: modelSummary,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ModelManifest);

export const getExecutiveRequestIntentModelManifest = () => ExecutiveRequestIntentModelManifest;
export const getExecutiveRequestIntentModelSummary = () => modelSummary;
