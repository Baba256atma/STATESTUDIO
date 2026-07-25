/** ASSISTANT-6:8 — Canonical lock, architectural locks, and frozen registry. */
import { AssistantObjectContextManagementCertification } from "./assistantObjectContextManagementCertification.ts";
import type {
  AssistantObjectContextManagementFreezeArchitecturalLockMetadata,
  AssistantObjectContextManagementFreezeRegistryEntryMetadata,
} from "./assistantObjectContextManagementFreeze.types.ts";

const certification = AssistantObjectContextManagementCertification;
const platform = certification.platform;
const composition = platform.composition;

export const AssistantObjectContextManagementFreezeCanonicalLock =
  Object.freeze({
    lockIdentifier: "ASSISTANT-6-OBJECT-CONTEXT-MANAGEMENT-LOCKED",
    name: "Assistant Object & Context Management Architecture Lock",
    description:
      "Permanent immutable lock for the certified Object & Context Management architecture.",
    sourceCertification: certification.identity.id,
    status: "Locked",
    frozen: true,
    mutationAllowed: false,
    permanent: true,
    version: "1.0.0",
    metadataOnly: true,
    immutable: true,
  } as const);

const architecturalLocks = Object.freeze([
  {
    name: "Canonical Identity Locked",
    description:
      "Lock canonical Object & Context Management identities permanently.",
    protectedTarget: certification.identity.id,
  },
  {
    name: "Namespace Locked",
    description:
      "Lock Object & Context Management namespace declarations permanently.",
    protectedTarget: certification.identity.namespace,
  },
  {
    name: "Version Locked",
    description:
      "Lock Object & Context Management version metadata permanently.",
    protectedTarget: certification.identity.version,
  },
  {
    name: "Foundation Locked",
    description: "Lock Foundation metadata permanently.",
    protectedTarget: composition.foundation.identity.id,
  },
  {
    name: "Registry Locked",
    description: "Lock Registry metadata permanently.",
    protectedTarget: composition.registry.identity.id,
  },
  {
    name: "Model Locked",
    description: "Lock domain, relationship, and lifecycle models permanently.",
    protectedTarget: composition.validation.model.identity.id,
  },
  {
    name: "Validation Locked",
    description: "Lock Validation metadata permanently.",
    protectedTarget: composition.validation.identity.id,
  },
  {
    name: "Manifest Locked",
    description: "Lock Manifest inventories permanently.",
    protectedTarget: composition.manifest.identity.id,
  },
  {
    name: "Platform Locked",
    description: "Lock Platform metadata permanently.",
    protectedTarget: platform.identity.id,
  },
  {
    name: "Certification Locked",
    description: "Lock Certification metadata permanently.",
    protectedTarget: certification.identity.id,
  },
  {
    name: "Public Metadata Locked",
    description: "Lock public metadata inventories permanently.",
    protectedTarget: composition.publicMetadata.validationIdentity.id,
  },
  {
    name: "Architecture Locked",
    description:
      "Lock Object & Context Management architectural boundaries permanently.",
    protectedTarget: "ASSISTANT-6-OBJECT-CONTEXT-MANAGEMENT-LOCKED",
  },
] as const);

export const AssistantObjectContextManagementFreezeArchitecturalLocks:
readonly AssistantObjectContextManagementFreezeArchitecturalLockMetadata[] =
  Object.freeze(
    architecturalLocks.map((lock, index) => Object.freeze({
      lockId: `ASSISTANT-6:8/Lock/${String(index + 1).padStart(2, "0")}`,
      name: lock.name,
      description: lock.description,
      protectedTarget: lock.protectedTarget,
      lockStatus: "Locked",
      version: "1.0.0",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );

const registryEntries = Object.freeze([
  {
    name: "Foundation",
    canonicalIdentity: composition.foundation.identity.id,
  },
  {
    name: "Registry",
    canonicalIdentity: composition.registry.identity.id,
  },
  {
    name: "Model",
    canonicalIdentity: composition.validation.model.identity.id,
  },
  {
    name: "Validation",
    canonicalIdentity: composition.validation.identity.id,
  },
  {
    name: "Manifest",
    canonicalIdentity: composition.manifest.identity.id,
  },
  {
    name: "Platform",
    canonicalIdentity: platform.identity.id,
  },
  {
    name: "Certification",
    canonicalIdentity: certification.identity.id,
  },
] as const);

export const AssistantObjectContextManagementFreezeArchitectureRegistry:
readonly AssistantObjectContextManagementFreezeRegistryEntryMetadata[] =
  Object.freeze(
    registryEntries.map((entry, index) => Object.freeze({
      entryId: `ASSISTANT-6:8/Registry/${String(index + 1).padStart(2, "0")}`,
      name: entry.name,
      canonicalIdentity: entry.canonicalIdentity,
      status: "Frozen",
      order: index + 1,
      descriptiveOnly: true,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );
