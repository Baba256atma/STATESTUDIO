/**
 * DKL-1:5 — Dependency Manifest.
 *
 * Immutable dependency inventory mirroring the DKL-1:1 Foundation dependency
 * declarations. This manifest does not introduce a new dependency system — it
 * only re-publishes the Foundation's public dependency metadata. No runtime
 * behavior.
 */

import { DataKnowledgeFoundationDependencies } from "./dataKnowledgeFoundation.ts";
import type { DataKnowledgeDependencyManifestDescriptor } from "./dataKnowledgeFoundationManifestTypes.ts";

export const DataKnowledgeFoundationDependencyManifest = Object.freeze({
  allowed: Object.freeze([...DataKnowledgeFoundationDependencies.allowed]),
  future: Object.freeze([...DataKnowledgeFoundationDependencies.future]),
  forbidden: Object.freeze([...DataKnowledgeFoundationDependencies.forbidden]),
  metadataOnly: true,
  immutable: true,
} as const satisfies DataKnowledgeDependencyManifestDescriptor);
