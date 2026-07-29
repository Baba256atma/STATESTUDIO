/**
 * EX-1:8 — Executive Stage Frozen Baselines.
 *
 * Exactly eight frozen baselines describing the certified Stage release.
 *
 * Ownership: owned exclusively by EX-1:8.
 */

/** Frozen baseline name. */
export type ExecutiveStageFrozenBaselineName =
  | "Architecture"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Certification"
  | "Public Contracts";

/** Frozen baseline declaration. */
export interface ExecutiveStageFrozenBaseline {
  readonly baselineId: string;
  readonly baselineName: ExecutiveStageFrozenBaselineName;
  readonly phaseId: string;
  readonly description: string;
  readonly order: number;
  readonly frozen: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const baseline = (
  baselineName: ExecutiveStageFrozenBaselineName,
  phaseId: string,
  description: string,
  order: number,
): ExecutiveStageFrozenBaseline =>
  Object.freeze({
    baselineId: `EX-1:8/Baseline/${String(order).padStart(2, "0")}`,
    baselineName,
    phaseId,
    description,
    order,
    frozen: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight frozen baselines. */
export const ExecutiveStageFrozenBaselines = Object.freeze([
  baseline(
    "Architecture",
    "EX-1:1",
    "Frozen Stage structure, layer ordering, and architectural composition.",
    1,
  ),
  baseline(
    "Registry",
    "EX-1:2",
    "Frozen Stage Registry identities and canonical layer order.",
    2,
  ),
  baseline(
    "Model",
    "EX-1:3",
    "Frozen Stage Model entities, ownership, and Runtime bindings.",
    3,
  ),
  baseline(
    "Validation",
    "EX-1:4",
    "Frozen Validation categories and forty-rule baseline.",
    4,
  ),
  baseline(
    "Manifest",
    "EX-1:5",
    "Frozen Manifest capabilities, guarantees, and release description.",
    5,
  ),
  baseline(
    "Platform",
    "EX-1:6",
    "Frozen Platform services, lifecycle, events, and public APIs.",
    6,
  ),
  baseline(
    "Certification",
    "EX-1:7",
    "Frozen Certification domains, gates, and release readiness.",
    7,
  ),
  baseline(
    "Public Contracts",
    "EX-1:8",
    "Frozen public contract identities for the Stage release.",
    8,
  ),
] as const);

export const ExecutiveStageFrozenBaselineNames = Object.freeze([
  "Architecture",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Certification",
  "Public Contracts",
] as const satisfies readonly ExecutiveStageFrozenBaselineName[]);

/** Immutable architecture components locked by Freeze. */
export const ExecutiveStageFrozenArchitectureComponents = Object.freeze([
  "Stage Structure",
  "Layer Ordering",
  "Runtime Binding Rules",
  "Platform Services",
  "Lifecycle States",
  "Event Definitions",
  "Public Contracts",
  "Validation Baseline",
] as const);

/** Frozen baseline catalogue. */
export const ExecutiveStageFrozenBaselineCatalog = Object.freeze({
  catalogId: "EX-1:8/BaselineCatalog",
  baselines: ExecutiveStageFrozenBaselines,
  baselineNames: ExecutiveStageFrozenBaselineNames,
  baselineCount: ExecutiveStageFrozenBaselines.length,
  architectureComponents: ExecutiveStageFrozenArchitectureComponents,
  architectureComponentCount: ExecutiveStageFrozenArchitectureComponents.length,
  frozen: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
