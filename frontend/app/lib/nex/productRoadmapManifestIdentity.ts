/**
 * NEX-2:5 — Product Roadmap Manifest identity.
 */

import { ProductRoadmapValidation } from "./productRoadmapValidation.ts";

export const ProductRoadmapManifestIdentity = Object.freeze({
  id: "NEX-2:5/ProductRoadmapManifest",
  name: "Nexora Product Roadmap Manifest",
  domain: "NEX Product Roadmap",
  phase: "NEX-2:5",
  namespace: "nexora.nex.product-roadmap.manifest",
  version: "1.0.0",
  status: "Manifest",
  description:
    "Canonical immutable publication package for validated Product Roadmap metadata.",
  manifestVersion: "1.0.0",
  manifestOwner: "Nexora Product",
  upstreamId: ProductRoadmapValidation.identity.id,
  upstreamPhase: "NEX-2:4",
  validationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
