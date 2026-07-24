/**
 * NEX-1:4 — Vision & Product Strategy Validation identity metadata.
 */

import { ProductVisionStrategyModel } from "./productVisionStrategyModel.ts";

export const ProductVisionStrategyValidationIdentity = Object.freeze({
  id: "NEX-1:4/ProductVisionStrategyValidation",
  name: "Nexora Vision & Product Strategy Validation",
  layer: "NEX",
  phase: "NEX-1:4",
  namespace: "nexora.nex.product-vision-strategy.validation",
  version: "1.0.0",
  status: "Validation",
  description:
    "Canonical immutable validation metadata for the Nexora Product Vision & Strategy domain.",
  validationVersion: "1.0.0",
  validationOwner: "Nexora Product",
  upstreamId: ProductVisionStrategyModel.identity.id,
  upstreamPhase: "NEX-1:3",
  modelOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);

export const ProductVisionStrategyValidationReadinessMetadata = Object.freeze({
  readiness: "ReadyForManifest",
  readyForManifest: true,
  nextPhase: "NEX-1:5 — Vision & Product Strategy Manifest",
  executesValidation: false,
  metadataOnly: true,
  immutable: true,
} as const);
