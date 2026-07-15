import type { ExecutiveReasoningCompatibilityKind, ExecutiveReasoningCompatibilityLevel } from "./executiveReasoningFreezeTypes.ts";

const declaration = (
  key: string,
  subject: string,
  kind: ExecutiveReasoningCompatibilityKind,
  status: ExecutiveReasoningCompatibilityLevel,
  description: string,
) => Object.freeze({
  id: `eng-6-freeze-compatibility-${key}`,
  subject,
  kind,
  status,
  supportedVersion: "1.0.0",
  description,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

/**
 * Immutable freeze-level compatibility declarations for ENG-6:8.
 * Shared as the canonical ExecutiveReasoningCompatibility public export.
 */
export const ExecutiveReasoningCompatibility = Object.freeze({
  id: "eng-6-compatibility",
  name: "Executive Reasoning Compatibility",
  description:
    "Immutable compatibility declarations locking ENG-6:1 through ENG-6:7 architectural contracts for freeze and public index.",
  phase: "ENG-6:8",
  owner: "ENG-6",
  version: "1.0.0",
  backwardCompatibility: Object.freeze({
    status: "Compatible",
    description:
      "Frozen contracts preserve public surfaces published by ENG-6:1 through ENG-6:7 without breaking changes.",
  } as const),
  forwardCompatibility: Object.freeze({
    status: "ForwardCompatible",
    description:
      "Freeze metadata is additive and ready for ENG-6:9 Public Index without mutating frozen contracts.",
  } as const),
  namespaceCompatibility: Object.freeze({
    status: "Compatible",
    description:
      "Namespaces under nexora.engine.executive.reasoning.* remain ownership-safe and frozen.",
  } as const),
  platformCompatibility: Object.freeze({
    status: "FrozenCompatible",
    description:
      "ENG-6:6 Platform aggregation remains compatible with certified foundation through manifest layers.",
  } as const),
  modelCompatibility: Object.freeze({
    status: "Compatible",
    description:
      "Model and relationship metadata remain structurally compatible with registry and validation.",
  } as const),
  registryCompatibility: Object.freeze({
    status: "Compatible",
    description:
      "Registry inventories remain compatible with foundation lifecycle and capabilities.",
  } as const),
  certificationCompatibility: Object.freeze({
    status: "Compatible",
    description:
      "ENG-6:7 Certification CERTIFIED status remains compatible with freeze readiness.",
  } as const),
  publicApiCompatibility: Object.freeze({
    status: "Stable",
    description:
      "Public API inventory remains Stable and Frozen after release-lock.",
  } as const),
  declarations: Object.freeze([
    declaration(
      "backward",
      "ENG-6:1–ENG-6:7 public contracts",
      "Backward",
      "Compatible",
      "No breaking changes to certified reasoning pipeline public surfaces.",
    ),
    declaration(
      "forward",
      "ENG-6:9 Public Index",
      "Forward",
      "ForwardCompatible",
      "Ready for public index publication without mutating frozen APIs.",
    ),
    declaration(
      "namespace",
      "nexora.engine.executive.reasoning.*",
      "Namespace",
      "Compatible",
      "Namespace ownership is preserved and frozen across all certified phases.",
    ),
    declaration(
      "platform",
      "Executive Reasoning Platform",
      "Platform",
      "FrozenCompatible",
      "Platform aggregation remains compatible with certified layers.",
    ),
    declaration(
      "model",
      "Executive Reasoning Models",
      "Model",
      "Compatible",
      "Model metadata remains consistent with registry registration and relationship flow.",
    ),
    declaration(
      "registry",
      "Executive Reasoning Registry",
      "Registry",
      "Compatible",
      "Registry inventories remain consistent with foundation contracts.",
    ),
    declaration(
      "certification",
      "Executive Reasoning Certification",
      "Certification",
      "Compatible",
      "Certification CERTIFIED status is freeze-compatible.",
    ),
    declaration(
      "public-api",
      "Public API inventory",
      "PublicApi",
      "Stable",
      "Inventoried APIs remain Stable and Frozen.",
    ),
  ] as const),
  status: "Compatible",
  publicApiStability: "StableAndFrozen",
  declarationCount: 8,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
