/** Director-1:2 immutable registry contracts. Metadata only. */

export type DirectorRegistryStability = "Stable";

export interface DirectorRegistryEntry<
  Id extends string = string,
  Category extends string = string,
> {
  readonly id: Id;
  readonly name: string;
  readonly description: string;
  readonly category: Category;
  readonly version: "1.0.0";
  readonly namespace: `nexora.director.registry.${string}`;
  readonly stability: DirectorRegistryStability;
  readonly deterministicOrder: number;
}

export interface DirectorRegistryDescriptor {
  readonly identity: {
    readonly id: "DIRECTOR-1:2/DirectorRegistry";
    readonly version: "1.0.0";
    readonly name: "Director Registry";
    readonly namespace: "nexora.director.registry";
    readonly layer: "Director";
    readonly status: "Registry";
    readonly readiness: "ReadyForModel";
  };
  readonly foundation: unknown;
  readonly scenes: unknown;
  readonly cameras: unknown;
  readonly timelines: unknown;
  readonly visualizations: unknown;
  readonly metadata: unknown;
  readonly services: false;
  readonly factories: false;
  readonly execution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

