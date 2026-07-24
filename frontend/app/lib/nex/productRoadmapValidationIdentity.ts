/**
 * NEX-2:4 — Product Roadmap Validation identity.
 */

import { ProductRoadmapModel } from "./productRoadmapModel.ts";

export const ProductRoadmapValidationIdentity = Object.freeze({
  id: "NEX-2:4/ProductRoadmapValidation",
  name: "Nexora Product Roadmap Validation",
  domain: "NEX Product Roadmap",
  phase: "NEX-2:4",
  namespace: "nexora.nex.product-roadmap.validation",
  version: "1.0.0",
  status: "Validation",
  description:
    "Canonical immutable validation metadata for the Product Roadmap domain.",
  validationVersion: "1.0.0",
  validationOwner: "Nexora Product",
  upstreamId: ProductRoadmapModel.identity.id,
  upstreamPhase: "NEX-2:3",
  modelOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
