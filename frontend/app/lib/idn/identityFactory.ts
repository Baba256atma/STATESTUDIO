import { IDENTITY_CONTRACT_VERSION } from "./identityEnums.ts";
import type { CreateIdentityInput, NexoraIdentity } from "./identityContracts.ts";
import { freezeIdentityMetadata } from "./identityMetadata.ts";

export function createIdentity(input: CreateIdentityInput): NexoraIdentity {
  const created = freezeIdentityMetadata({
    createdAt: input.created.createdAt,
    updatedAt: input.created.updatedAt ?? input.created.createdAt,
    createdBy: input.created.createdBy,
    version: input.created.version ?? 1,
    source: input.created.source,
    description: input.created.description,
    tags: Object.freeze([...(input.created.tags ?? [])]),
    metadata: Object.freeze({ ...(input.created.metadata ?? {}) }),
  });

  return Object.freeze({
    contractVersion: IDENTITY_CONTRACT_VERSION,
    id: input.id,
    type: input.type,
    displayName: input.displayName,
    created,
    lifecycle: input.lifecycle ?? "Created",
    version: input.version ?? created.version,
    tags: Object.freeze([...(input.tags ?? [])]),
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
  } as NexoraIdentity);
}
