/**
 * DKL-6:6 — Knowledge Repository Platform Sections.
 *
 * Ordered platform sections and component inventory.
 * Metadata only.
 *
 * Ownership: owned exclusively by DKL-6:6.
 */

import {
  KnowledgeRepositoryFoundationId,
  KnowledgeRepositoryFoundationStatus,
  KnowledgeRepositoryFoundationVersion,
} from "./knowledgeRepositoryFoundation.ts";
import {
  KnowledgeRepositoryManifestId,
  KnowledgeRepositoryManifestStatus,
  KnowledgeRepositoryManifestVersion,
} from "./knowledgeRepositoryManifest.ts";
import {
  KnowledgeRepositoryModelId,
  KnowledgeRepositoryModelStatus,
  KnowledgeRepositoryModelVersion,
} from "./knowledgeRepositoryModel.ts";
import {
  KnowledgeRepositoryRegistryId,
  KnowledgeRepositoryRegistryStatus,
  KnowledgeRepositoryRegistryVersion,
} from "./knowledgeRepositoryRegistry.ts";
import {
  KnowledgeRepositoryValidationId,
  KnowledgeRepositoryValidationStatus,
  KnowledgeRepositoryValidationVersion,
} from "./knowledgeRepositoryValidation.ts";
import type {
  KnowledgeRepositoryPlatformComponent,
  KnowledgeRepositoryPlatformSection,
} from "./knowledgeRepositoryPlatformTypes.ts";

export const KnowledgeRepositoryPlatformSectionId =
  "DKL-6:6/KnowledgeRepositoryPlatform" as const;
export const KnowledgeRepositoryPlatformSectionVersion = "1.0.0" as const;
export const KnowledgeRepositoryPlatformSectionStatus =
  "PlatformComplete" as const;

const section = (
  id: string,
  name: KnowledgeRepositoryPlatformSection["name"],
  sourceIdentity: string,
  sourceVersion: string,
  sourceStatus: string,
  order: number,
): KnowledgeRepositoryPlatformSection =>
  Object.freeze({
    id,
    name,
    sourceIdentity,
    sourceVersion,
    sourceStatus,
    order,
    owner: "DKL-6" as const,
    included: true as const,
    stable: true as const,
    runtimeBehavior: "None" as const,
  });

const component = (
  id: string,
  name: string,
  sourceIdentity: string,
  architecturalRole: string,
): KnowledgeRepositoryPlatformComponent =>
  Object.freeze({
    id,
    name,
    sourceIdentity,
    architecturalRole,
    status: "Available" as const,
    owner: "DKL-6" as const,
    stable: true as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly six ordered platform sections. */
export const KnowledgeRepositoryPlatformSections: readonly KnowledgeRepositoryPlatformSection[] =
  Object.freeze([
    section(
      "DKL-6:6/Section/foundation",
      "foundation",
      KnowledgeRepositoryFoundationId,
      KnowledgeRepositoryFoundationVersion,
      KnowledgeRepositoryFoundationStatus,
      1,
    ),
    section(
      "DKL-6:6/Section/registry",
      "registry",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistryVersion,
      KnowledgeRepositoryRegistryStatus,
      2,
    ),
    section(
      "DKL-6:6/Section/model",
      "model",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModelVersion,
      KnowledgeRepositoryModelStatus,
      3,
    ),
    section(
      "DKL-6:6/Section/validation",
      "validation",
      KnowledgeRepositoryValidationId,
      KnowledgeRepositoryValidationVersion,
      KnowledgeRepositoryValidationStatus,
      4,
    ),
    section(
      "DKL-6:6/Section/manifest",
      "manifest",
      KnowledgeRepositoryManifestId,
      KnowledgeRepositoryManifestVersion,
      KnowledgeRepositoryManifestStatus,
      5,
    ),
    section(
      "DKL-6:6/Section/platform",
      "platform",
      KnowledgeRepositoryPlatformSectionId,
      KnowledgeRepositoryPlatformSectionVersion,
      KnowledgeRepositoryPlatformSectionStatus,
      6,
    ),
  ]);

/** Exactly six platform components. */
export const KnowledgeRepositoryPlatformComponents: readonly KnowledgeRepositoryPlatformComponent[] =
  Object.freeze([
    component(
      "DKL-6:6/Component/RepositoryFoundationComponent",
      "RepositoryFoundationComponent",
      KnowledgeRepositoryFoundationId,
      "Foundation",
    ),
    component(
      "DKL-6:6/Component/RepositoryRegistryComponent",
      "RepositoryRegistryComponent",
      KnowledgeRepositoryRegistryId,
      "Registry",
    ),
    component(
      "DKL-6:6/Component/RepositoryModelComponent",
      "RepositoryModelComponent",
      KnowledgeRepositoryModelId,
      "Model",
    ),
    component(
      "DKL-6:6/Component/RepositoryValidationComponent",
      "RepositoryValidationComponent",
      KnowledgeRepositoryValidationId,
      "Validation",
    ),
    component(
      "DKL-6:6/Component/RepositoryManifestComponent",
      "RepositoryManifestComponent",
      KnowledgeRepositoryManifestId,
      "Manifest",
    ),
    component(
      "DKL-6:6/Component/RepositoryPlatformComponent",
      "RepositoryPlatformComponent",
      KnowledgeRepositoryPlatformSectionId,
      "Platform",
    ),
  ]);
