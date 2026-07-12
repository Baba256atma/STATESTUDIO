import { ExecutiveRequestIntentFoundation } from "./executiveRequestIntentIndex.ts";
import { ExecutiveRequestIntentModelManifest } from "./executiveRequestIntentModelIndex.ts";
import { ExecutiveRequestIntentRegistryManifest } from "./executiveRequestIntentRegistryIndex.ts";
import { ExecutiveRequestIntentValidationManifest } from "./executiveRequestIntentValidationIndex.ts";
import { ExecutiveRequestIntentDependencyMap } from "./executiveRequestIntentDependencyMap.ts";
import type { ExecutiveRequestIntentManifest as Manifest } from "./executiveRequestIntentManifestTypes.ts";
import { ExecutiveRequestIntentPhaseRegistry } from "./executiveRequestIntentPhaseRegistry.ts";
import { ExecutiveRequestIntentPublicSurface } from "./executiveRequestIntentPublicSurface.ts";

const metadata = Object.freeze({
  id: "ENG-2:5", version: "1.0.0", namespace: "nexora.engine.executive.request-intent.manifest",
  phase: "Manifest", owner: "ENG-2",
  description: "Canonical immutable aggregation manifest for the ENG-2 Executive Request & Intent Platform.",
  releaseStatus: "Draft", metadataOnly: true, immutable: true,
} as const);

const dependencySummary = Object.freeze({
  approvedDependencyCount: 4, futureReferenceCount: 4, policy: "PublicIndicesOnly",
} as const);
const phaseSummary = Object.freeze({
  phaseCount: 5, completedPhaseCount: 4, activePhase: "ENG-2:5",
} as const);
const publicApiSummary = Object.freeze({ apiCount: 36, exportPolicy: "ExplicitOnly" } as const);
const validationSummary = Object.freeze({ groupCount: 5, ruleCount: 41, status: "Defined" } as const);
const ownershipSummary = Object.freeze({
  owner: "ENG-2", collisionSafe: true, previousPhasesUnchanged: true, phaseOverwriteProhibited: true,
} as const);
const summary = Object.freeze({
  phaseCount: 5, completedPhaseCount: 4, dependencyCount: 4, futureReferenceCount: 4,
  publicApiCount: 36, validationGroupCount: 5, validationRuleCount: 41,
  releaseStatus: "Draft", metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveRequestIntentManifest = Object.freeze({
  metadata,
  foundation: ExecutiveRequestIntentFoundation,
  registry: ExecutiveRequestIntentRegistryManifest,
  model: ExecutiveRequestIntentModelManifest,
  validation: ExecutiveRequestIntentValidationManifest,
  phaseRegistry: ExecutiveRequestIntentPhaseRegistry,
  dependencyMap: ExecutiveRequestIntentDependencyMap,
  publicSurface: ExecutiveRequestIntentPublicSurface,
  dependencySummary, phaseSummary, publicApiSummary, validationSummary, ownershipSummary, summary,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies Manifest);

export const getExecutiveRequestIntentManifest = () => ExecutiveRequestIntentManifest;
export const getExecutiveRequestIntentManifestSummary = () => summary;
export const getExecutiveRequestIntentDependencySummary = () => dependencySummary;
