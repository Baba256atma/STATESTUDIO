export const DirectorOwnership = Object.freeze({
  ownershipId: "DIRECTOR-1:1/Ownership",
  owns: Object.freeze([
    "Scene orchestration",
    "Executive visualization planning",
    "Camera planning",
    "Timeline planning",
    "Focus planning",
    "Animation planning",
    "Scene composition metadata",
  ] as const),
  doesNotOwn: Object.freeze([
    "Rendering",
    "Graphics",
    "Business logic",
    "Executive decisions",
    "AI",
    "Data ingestion",
    "Knowledge",
    "Business Objects",
  ] as const),
  runtimeBehavior: "None",
  metadataOnly: true,
  immutable: true,
} as const);

