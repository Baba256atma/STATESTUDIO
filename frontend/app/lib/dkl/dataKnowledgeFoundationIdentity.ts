/**
 * DKL-1:1 — Data Knowledge Layer Foundation.
 *
 * Immutable identity metadata for the Data Knowledge Layer.
 * Metadata only — no runtime behavior.
 */

import type { DataKnowledgeIdentityDescriptor } from "./dataKnowledgeFoundationTypes.ts";

export const DataKnowledgeFoundationIdentity = Object.freeze({
  platformName: "Nexora Data Knowledge Layer",
  namespace: "nexora.dkl.foundation",
  layerId: "DKL",
  phaseId: "DKL-1:1",
  version: "1.0.0",
  stability: "Stable",
  releaseStatus: "Certified",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DataKnowledgeIdentityDescriptor);
