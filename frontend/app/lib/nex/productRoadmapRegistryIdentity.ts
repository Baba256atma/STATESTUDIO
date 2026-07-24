/**
 * NEX-2:2 — Product Roadmap Registry identity.
 */

import { ProductRoadmapFoundation } from "./productRoadmapFoundation.ts";

export const ProductRoadmapRegistryIdentity = Object.freeze({
  id: "NEX-2:2/ProductRoadmapRegistry",
  name: "Nexora Product Roadmap Registry",
  domain: "NEX Product Roadmap",
  phase: "NEX-2:2",
  namespace: "nexora.nex.product-roadmap.registry",
  version: "1.0.0",
  status: "Registry",
  description:
    "Canonical immutable registry of Product Roadmap reference vocabularies.",
  registryVersion: "1.0.0",
  registryOwner: "Nexora Product",
  upstreamId: ProductRoadmapFoundation.identity.id,
  upstreamPhase: "NEX-2:1",
  foundationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
