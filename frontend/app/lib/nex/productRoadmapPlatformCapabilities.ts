/**
 * NEX-2:6 — Immutable descriptive Platform capabilities.
 */

import { ProductRoadmapManifest } from "./productRoadmapManifest.ts";

export const ProductRoadmapPlatformCapabilities = Object.freeze([
  Object.freeze({ id: "NEX-2:6/Capability/RoadmapPublication", name: "Roadmap Publication", description: "Represents canonical roadmap metadata.", sourceSubject: ProductRoadmapManifest.platformSeedMetadata.capabilitySubjects[0], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:6/Capability/ReleaseStrategyPublication", name: "Release Strategy Publication", description: "Represents release strategy metadata.", sourceSubject: ProductRoadmapManifest.platformSeedMetadata.capabilitySubjects[1], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:6/Capability/MilestonePublication", name: "Milestone Publication", description: "Represents product milestone metadata.", sourceSubject: ProductRoadmapManifest.platformSeedMetadata.capabilitySubjects[2], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:6/Capability/InitiativePublication", name: "Strategic Initiative Publication", description: "Represents strategic initiative metadata.", sourceSubject: ProductRoadmapManifest.platformSeedMetadata.capabilitySubjects[3], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:6/Capability/ThemePublication", name: "Product Theme Publication", description: "Represents product theme metadata.", sourceSubject: ProductRoadmapManifest.platformSeedMetadata.capabilitySubjects[4], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:6/Capability/PriorityPublication", name: "Product Priority Publication", description: "Represents product priority metadata.", sourceSubject: ProductRoadmapManifest.platformSeedMetadata.capabilitySubjects[5], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:6/Capability/GovernancePublication", name: "Roadmap Governance Publication", description: "Represents roadmap governance metadata.", sourceSubject: ProductRoadmapManifest.platformSeedMetadata.capabilitySubjects[6], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:6/Capability/EvolutionPublication", name: "Product Evolution Publication", description: "Represents product evolution metadata.", sourceSubject: ProductRoadmapManifest.platformSeedMetadata.capabilitySubjects[7], executable: false, metadataOnly: true, immutable: true }),
] as const);
