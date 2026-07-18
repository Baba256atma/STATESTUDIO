/**
 * DKL-5:1 — Knowledge Validation Dependencies.
 *
 * Immutable layer dependency declarations. Consumes DKL-4 exclusively through
 * the Knowledge Modeling Public Index. Metadata only.
 *
 * Ownership: owned exclusively by DKL-5:1.
 */

import {
  KnowledgeModelingPublicIndexId,
  KnowledgeModelingPublicIndexVersion,
  KnowledgeModelingPublicReleaseStatus,
  getKnowledgeModelingPublicReleaseMetadata,
} from "./knowledgeModelingPublicIndex.ts";

const dkl4Release = getKnowledgeModelingPublicReleaseMetadata();

/** Canonical immutable Knowledge Validation dependency declarations. */
export const KnowledgeValidationDependencies = Object.freeze({
  dependenciesId: "DKL-5:1/KnowledgeValidationDependencies",
  sourcePhase: "DKL-5:1",
  allowed: Object.freeze([
    Object.freeze({
      dependencyId: "DEP-DKL4-PUBLIC-INDEX",
      name: "DKL-4 Knowledge Modeling Public Index",
      module: "knowledgeModelingPublicIndex.ts",
      phase: "DKL-4:9",
      publicIndexId: KnowledgeModelingPublicIndexId,
      publicIndexVersion: KnowledgeModelingPublicIndexVersion,
      releaseStatus: KnowledgeModelingPublicReleaseStatus,
      readyForDKL5: dkl4Release.ReadyForDKL5 === true,
      required: true,
      futurePhase: false,
      publicEntryPointOnly: true,
    }),
  ]),
  declaredUpstreamByReference: Object.freeze([
    "DKL-4 Knowledge Object contracts",
    "DKL-4 Business Object contracts",
    "DKL-4 Entity and Relationship contracts",
    "DKL-4 identity and reference contracts",
    "DKL-4 provenance and context contracts",
    "DKL-4 semantic structure contracts",
  ]),
  declaredFuture: Object.freeze([
    Object.freeze({ name: "DKL-5:2 Registry", futurePhase: true, required: false }),
    Object.freeze({ name: "DKL-5:3 Model", futurePhase: true, required: false }),
    Object.freeze({ name: "DKL-5:4 Validation", futurePhase: true, required: false }),
    Object.freeze({ name: "DKL-5:5 Manifest", futurePhase: true, required: false }),
    Object.freeze({ name: "DKL-5:6 Platform", futurePhase: true, required: false }),
    Object.freeze({ name: "DKL-5:7 Certification", futurePhase: true, required: false }),
    Object.freeze({ name: "DKL-5:8 Freeze", futurePhase: true, required: false }),
    Object.freeze({ name: "DKL-5:9 Public Index", futurePhase: true, required: false }),
    Object.freeze({
      name: "Future approved DKL consumers",
      futurePhase: true,
      required: false,
    }),
    Object.freeze({
      name: "Executive Engine (restricted downstream consumer)",
      futurePhase: true,
      required: false,
      restricted: true,
    }),
  ]),
  entryCount: 1,
  noActiveFuturePhaseImports: true,
  forbidden: Object.freeze([
    "knowledgeModelingFoundation.ts",
    "knowledgeModelingRegistry.ts",
    "knowledgeModelingModel.ts",
    "knowledgeModelingValidation.ts",
    "knowledgeModelingManifest.ts",
    "knowledgeModelingPlatform.ts",
    "knowledgeModelingCertification.ts",
    "knowledgeModelingFreeze.ts",
    "DKL-4:1 through DKL-4:8 internal modules",
    "DKL-1 direct",
    "DKL-2 direct",
    "DKL-3 direct",
    "DKL-5:2+",
    "data cleansing systems",
    "Persistence",
    "Database",
    "Engine",
    "Advisor",
    "Scene",
    "UI",
    "external AI or LLM services",
    "external packages",
  ]),
  notes: Object.freeze({
    publicApiOnly: true,
    dkl4ViaPublicIndexOnly: true,
    cycleFree: true,
    futureDependenciesDeclarativeOnly: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
