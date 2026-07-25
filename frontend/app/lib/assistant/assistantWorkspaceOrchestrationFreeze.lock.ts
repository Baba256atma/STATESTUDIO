/** ASSISTANT-5:8 — Canonical lock, architectural locks, and frozen registry. */
import { AssistantWorkspaceOrchestrationCertification } from "./assistantWorkspaceOrchestrationCertification.ts";
import type {
  AssistantWorkspaceOrchestrationFreezeArchitecturalLockMetadata,
  AssistantWorkspaceOrchestrationFreezeRegistryEntryMetadata,
} from "./assistantWorkspaceOrchestrationFreeze.types.ts";

const certification = AssistantWorkspaceOrchestrationCertification;
const platform = certification.platform;
const composition = platform.composition;

export const AssistantWorkspaceOrchestrationFreezeCanonicalLock =
  Object.freeze({
    lockIdentifier: "ASSISTANT-5-WORKSPACE-ORCHESTRATION-LOCKED",
    name: "Assistant Workspace Orchestration Architecture Lock",
    description:
      "Permanent immutable lock for the certified Workspace Orchestration architecture.",
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
      "Lock canonical Workspace Orchestration identities permanently.",
    protectedTarget: certification.identity.id,
  },
  {
    name: "Namespace Locked",
    description:
      "Lock Workspace Orchestration namespace declarations permanently.",
    protectedTarget: certification.identity.namespace,
  },
  {
    name: "Version Locked",
    description:
      "Lock Workspace Orchestration version metadata permanently.",
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
      "Lock Workspace Orchestration architectural boundaries permanently.",
    protectedTarget: "ASSISTANT-5-WORKSPACE-ORCHESTRATION-LOCKED",
  },
] as const);

export const AssistantWorkspaceOrchestrationFreezeArchitecturalLocks:
readonly AssistantWorkspaceOrchestrationFreezeArchitecturalLockMetadata[] =
  Object.freeze(
    architecturalLocks.map((lock, index) => Object.freeze({
      lockId: `ASSISTANT-5:8/Lock/${String(index + 1).padStart(2, "0")}`,
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

export const AssistantWorkspaceOrchestrationFreezeArchitectureRegistry:
readonly AssistantWorkspaceOrchestrationFreezeRegistryEntryMetadata[] =
  Object.freeze(
    registryEntries.map((entry, index) => Object.freeze({
      entryId: `ASSISTANT-5:8/Registry/${String(index + 1).padStart(2, "0")}`,
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
