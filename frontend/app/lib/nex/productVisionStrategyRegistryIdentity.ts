/**
 * NEX-1:2 — Canonical Vision & Product Strategy Registry identity.
 */

import { ProductVisionStrategyFoundation } from "./productVisionStrategyFoundation.ts";

export const ProductVisionStrategyRegistryId =
  "NEX-1:2/ProductVisionStrategyRegistry" as const;
export const ProductVisionStrategyRegistryName =
  "Nexora Vision & Product Strategy Registry" as const;
export const ProductVisionStrategyRegistryNamespace =
  "nexora.nex.product-vision-strategy.registry" as const;
export const ProductVisionStrategyRegistryVersion = "1.0.0" as const;
export const ProductVisionStrategyRegistryStatus = "Registry" as const;
export const ProductVisionStrategyRegistryReadiness = "ReadyForModel" as const;

export const ProductVisionStrategyRegistryIdentity = Object.freeze({
  id: ProductVisionStrategyRegistryId,
  name: ProductVisionStrategyRegistryName,
  layer: "NEX",
  phase: "NEX-1:2",
  namespace: ProductVisionStrategyRegistryNamespace,
  version: ProductVisionStrategyRegistryVersion,
  status: ProductVisionStrategyRegistryStatus,
  description:
    "Canonical immutable registry of Nexora product vision and strategy reference vocabularies.",
  registryVersion: "1.0.0",
  registryOwner: "Nexora Product",
  upstreamId: ProductVisionStrategyFoundation.identity.id,
  upstreamPhase: "NEX-1:1",
  foundationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
