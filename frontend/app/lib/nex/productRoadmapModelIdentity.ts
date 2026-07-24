/**
 * NEX-2:3 — Product Roadmap Model identity.
 */

import { ProductRoadmapRegistry } from "./productRoadmapRegistry.ts";

export const ProductRoadmapModelIdentity = Object.freeze({
  id: "NEX-2:3/ProductRoadmapModel",
  name: "Nexora Product Roadmap Model",
  domain: "NEX Product Roadmap",
  phase: "NEX-2:3",
  namespace: "nexora.nex.product-roadmap.model",
  version: "1.0.0",
  status: "Model",
  description:
    "Canonical typed structural representation of Product Roadmap metadata.",
  modelVersion: "1.0.0",
  modelOwner: "Nexora Product",
  upstreamId: ProductRoadmapRegistry.identity.id,
  upstreamPhase: "NEX-2:2",
  registryOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
