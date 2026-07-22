const boundaryNames = Object.freeze([
  "Animation metadata vs runtime animation",
  "Transition metadata vs transition execution",
  "Effect metadata vs effect rendering",
  "Timing metadata vs frame scheduling",
  "Easing metadata vs easing calculation",
  "Motion metadata vs physics simulation",
  "Visual emphasis metadata vs UI implementation",
  "Animation description vs frame generation",
  "Foundation contracts vs GPU execution",
  "Animation metadata vs networking",
  "Animation metadata vs persistence",
  "Animation architecture vs Director orchestration",
] as const);

export const AnimationEffectsBoundaries = Object.freeze(boundaryNames.map(
  (name, index) => Object.freeze({
    id: `EVE-7:1/Boundary/${index + 1}` as const,
    name,
    description: `${name}; the latter responsibility is explicitly excluded.`,
    ownership: "Excluded" as const,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
