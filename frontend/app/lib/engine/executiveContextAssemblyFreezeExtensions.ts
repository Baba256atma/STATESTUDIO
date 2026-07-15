import type { ExecutiveContextFreezeExtensionPoint } from "./executiveContextAssemblyFreezeTypes.ts";

const extension = (
  key: string,
  name: string,
  description: string,
  allowedFuturePhase: string,
  protectedBoundaries: readonly string[],
) => Object.freeze({
  extensionId: `eng-4-freeze-extension-${key}`,
  name, description, owner: "ENG-4",
  currentState: "DeclaredOnly",
  allowedFuturePhase,
  protectedBoundaries,
  prohibitedOwnershipChanges: true,
  publicApiRequirement: "PublicSurfaceOnly",
  runtimeImplementationAbsent: true,
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextFreezeExtensionPoint);

const protectedOwnership = Object.freeze([
  "ENG-4:1 Foundation ownership",
  "ENG-4:2 Registry ownership",
  "ENG-4:3 Model ownership",
  "ENG-4:4 Validation ownership",
  "ENG-4:5 Manifest ownership",
  "ENG-4:6 Platform ownership",
  "ENG-4:7 Certification ownership",
  "specialized executiveContextModel.ts ownership",
] as const);

export const ExecutiveContextAssemblyFreezeExtensions = Object.freeze([
  extension("public-index", "ENG-4:9 Public Index", "Future public release surface for the frozen Context Assembly platform.", "ENG-4:9", protectedOwnership),
  extension("runtime-context-adapter", "Future runtime context assembly adapter", "Future adapter boundary for runtime context assembly outside ENG-4 freeze.", "Future Runtime Phase", protectedOwnership),
  extension("data-source-adapter", "Future data-source integration adapter", "Future adapter boundary for data-source integration outside ENG-4 freeze.", "Future Runtime Phase", protectedOwnership),
  extension("normalization-runtime", "Future context normalization runtime", "Future runtime boundary for context normalization outside ENG-4 freeze.", "Future Runtime Phase", protectedOwnership),
  extension("enrichment-runtime", "Future context enrichment runtime", "Future runtime boundary for context enrichment outside ENG-4 freeze.", "Future Runtime Phase", protectedOwnership),
  extension("advisor-integration", "Future Advisor integration", "Future integration boundary for Advisor consumers of frozen public metadata.", "Future Advisor Phase", protectedOwnership),
  extension("director-scene-integration", "Future Director/Scene integration", "Future integration boundary for Director/Scene consumers of frozen public metadata.", "Future Director Phase", protectedOwnership),
  extension("observability-integration", "Future observability integration", "Future integration boundary for observability over frozen public metadata.", "Future Observability Phase", protectedOwnership),
] as const);
