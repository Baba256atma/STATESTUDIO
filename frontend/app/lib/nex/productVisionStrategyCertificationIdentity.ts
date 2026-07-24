/**
 * NEX-1:7 — Vision & Product Strategy Certification identity.
 */

import { ProductVisionStrategyPlatform } from "./productVisionStrategyPlatform.ts";

export const ProductVisionStrategyCertificationIdentity = Object.freeze({
  id: "NEX-1:7/ProductVisionStrategyCertification",
  name: "Nexora Vision & Product Strategy Certification",
  layer: "NEX",
  phase: "NEX-1:7",
  namespace: "nexora.nex.product-vision-strategy.certification",
  version: "1.0.0",
  status: "Certification",
  description:
    "Canonical immutable certification metadata for the Nexora Vision & Product Strategy Platform.",
  certificationVersion: "1.0.0",
  certificationOwner: "Nexora Product",
  upstreamId: ProductVisionStrategyPlatform.identity.id,
  upstreamPhase: "NEX-1:6",
  platformOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
