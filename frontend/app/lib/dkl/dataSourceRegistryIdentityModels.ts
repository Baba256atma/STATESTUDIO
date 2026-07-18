/**
 * DKL-2:3 — Registry Identity Models.
 *
 * Canonical, immutable identity metadata models for every registry identity
 * kind. Each model documents the stable identity field set that every registered
 * entry must carry. Metadata only — no runtime identifiers are generated.
 *
 * Responsibility: publish the identity models + lookup.
 * Ownership: owned exclusively by DKL-2:3.
 * Dependency rules: depends only on DKL-2:3 model types.
 * Architectural purpose: answer "what is a registry identity?".
 */

import {
  createModelIdentity,
  identityModelId,
  MODEL_IDENTITY_FIELDS,
  type IdentityKind,
  type IdentityModel,
  type IdentityModelsContainer,
} from "./dataSourceRegistryModelTypes.ts";

const identityModel = (identityKind: IdentityKind, name: string): IdentityModel =>
  Object.freeze({
    identity: createModelIdentity({
      id: identityModelId(identityKind),
      name,
      category: "identity",
      tags: Object.freeze(["identity-model", identityKind]),
    }),
    identityKind,
    requiredFields: MODEL_IDENTITY_FIELDS,
    metadataOnly: true,
    immutable: true,
  } as const satisfies IdentityModel);

const identityModelEntries: readonly IdentityModel[] = Object.freeze([
  identityModel("RegistryIdentity", "Registry Identity Model"),
  identityModel("DataSourceIdentity", "Data Source Identity Model"),
  identityModel("KnowledgeIdentity", "Knowledge Identity Model"),
  identityModel("ConnectorIdentity", "Connector Identity Model"),
  identityModel("ContentIdentity", "Content Identity Model"),
  identityModel("SourceGroupIdentity", "Source Group Identity Model"),
  identityModel("CompatibilityIdentity", "Compatibility Identity Model"),
]);

export const RegistryIdentityModels: IdentityModelsContainer = Object.freeze({
  kind: "IdentityModels",
  models: identityModelEntries,
  getById: (id: string): IdentityModel | undefined =>
    identityModelEntries.find((model) => model.identity.id === id),
});
