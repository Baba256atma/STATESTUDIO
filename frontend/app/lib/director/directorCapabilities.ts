const CAPABILITY_NAMES = [
  "Scene Planning",
  "Scene Composition",
  "Object Placement",
  "Layer Management",
  "Timeline Planning",
  "Camera Planning",
  "Executive Focus Planning",
  "Visualization Planning",
  "Transition Planning",
  "Animation Planning",
] as const;

export const DirectorCapabilities = Object.freeze(
  CAPABILITY_NAMES.map((name, index) =>
    Object.freeze({
      capabilityId: `DIRECTOR-1:1/Capability/${name.replaceAll(" ", "")}`,
      name,
      deterministicOrder: index + 1,
      executes: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

