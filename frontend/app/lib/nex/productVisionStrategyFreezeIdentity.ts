/**
 * NEX-1:8 — Vision & Product Strategy Freeze identity.
 */

import { ProductVisionStrategyCertification } from "./productVisionStrategyCertification.ts";

export const ProductVisionStrategyFreezeIdentity = Object.freeze({
  id: "NEX-1:8/ProductVisionStrategyFreeze",
  name: "Nexora Vision & Product Strategy Freeze",
  layer: "NEX",
  phase: "NEX-1:8",
  namespace: "nexora.nex.product-vision-strategy.freeze",
  version: "1.0.0",
  status: "Freeze",
  description:
    "Canonical immutable frozen baseline for the certified Nexora Vision & Product Strategy Platform.",
  freezeVersion: "1.0.0",
  freezeOwner: "Nexora Product",
  canonicalLockIdentifier: "NEX-1-VISION-PRODUCT-STRATEGY-LOCKED",
  upstreamId: ProductVisionStrategyCertification.identity.id,
  upstreamPhase: "NEX-1:7",
  certificationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
