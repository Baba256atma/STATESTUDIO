/**
 * NEX-1:5 — Vision & Product Strategy Manifest identity.
 */

import { ProductVisionStrategyValidation } from "./productVisionStrategyValidation.ts";

export const ProductVisionStrategyManifestIdentity = Object.freeze({
  id: "NEX-1:5/ProductVisionStrategyManifest",
  name: "Nexora Vision & Product Strategy Manifest",
  layer: "NEX",
  phase: "NEX-1:5",
  namespace: "nexora.nex.product-vision-strategy.manifest",
  version: "1.0.0",
  status: "Manifest",
  description:
    "Canonical immutable metadata publication inventory for the Nexora Vision & Product Strategy package.",
  manifestVersion: "1.0.0",
  manifestOwner: "Nexora Product",
  upstreamId: ProductVisionStrategyValidation.identity.id,
  upstreamPhase: "NEX-1:4",
  validationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
