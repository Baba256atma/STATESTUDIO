export const SceneRenderingOwnership = Object.freeze({
  id: "EVE-2:1/SceneRenderingOwnership",
  owns: Object.freeze([
    "Rendering contracts", "Scene rendering identities", "Render metadata",
    "Rendering boundaries", "Rendering lifecycle", "Rendering capabilities",
  ] as const),
  doesNotOwn: Object.freeze([
    "Executive decisions", "Business Objects", "Advisor logic",
    "Director orchestration", "Runtime rendering", "UI implementation",
  ] as const),
  changesBusinessState: false,
  runtimeOwnership: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

