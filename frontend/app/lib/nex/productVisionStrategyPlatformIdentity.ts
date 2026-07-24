/**
 * NEX-1:6 — Vision & Product Strategy Platform identity.
 */

import { ProductVisionStrategyManifest } from "./productVisionStrategyManifest.ts";

export const ProductVisionStrategyPlatformIdentity = Object.freeze({
  id: "NEX-1:6/ProductVisionStrategyPlatform",
  name: "Nexora Vision & Product Strategy Platform",
  layer: "NEX",
  phase: "NEX-1:6",
  namespace: "nexora.nex.product-vision-strategy.platform",
  version: "1.0.0",
  status: "Platform",
  description:
    "Canonical immutable platform surface for Nexora Vision & Product Strategy metadata.",
  platformVersion: "1.0.0",
  platformOwner: "Nexora Product",
  upstreamId: ProductVisionStrategyManifest.identity.id,
  upstreamPhase: "NEX-1:5",
  manifestOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
