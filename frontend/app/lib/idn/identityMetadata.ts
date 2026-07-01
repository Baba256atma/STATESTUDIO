import type { IdentitySource } from "./identityEnums.ts";

export type IdentityId = string;

export type IdentityTag = string;

export type IdentityMetadataValue = string | number | boolean | null;

export type IdentityMetadataMap = Readonly<Record<string, IdentityMetadataValue>>;

export type IdentityCreationMetadata = Readonly<{
  createdAt: string;
  updatedAt: string;
  createdBy: IdentityId;
  version: number;
  source: IdentitySource;
  description?: string;
  tags: readonly IdentityTag[];
  metadata: IdentityMetadataMap;
}>;

export type IdentityMetadataInput = Readonly<{
  createdAt: string;
  updatedAt?: string;
  createdBy: IdentityId;
  version?: number;
  source: IdentitySource;
  description?: string;
  tags?: readonly IdentityTag[];
  metadata?: IdentityMetadataMap;
}>;

export function freezeIdentityMetadata(metadata: IdentityCreationMetadata): IdentityCreationMetadata {
  return Object.freeze({
    ...metadata,
    tags: Object.freeze([...metadata.tags]),
    metadata: Object.freeze({ ...metadata.metadata }),
  });
}
