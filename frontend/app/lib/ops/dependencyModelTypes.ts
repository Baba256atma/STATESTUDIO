import type {
  DependencyCriticality,
  DependencyDirection,
  DependencyMetadata,
  DependencyPriority,
  DependencyStrength,
} from "./dependencyIntelligenceIndex.ts";
import type {
  DependencyEntityCategory,
  DependencyEntityType,
  DependencyLifecycleStage,
  DependencyRelationshipType,
} from "./dependencyRegistryIndex.ts";

export interface DependencyNodeDescriptor {
  readonly id: string;
  readonly entityType: DependencyEntityType;
  readonly category: DependencyEntityCategory;
  readonly label: string;
  readonly description: string;
  readonly lifecycle: DependencyLifecycleStage;
  readonly metadata: DependencyMetadata;
}

export type DependencyNodeCollection = readonly DependencyNodeDescriptor[];

export interface DependencyEdgeDescriptor {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly relationshipType: DependencyRelationshipType;
  readonly direction: DependencyDirection;
  readonly strength: DependencyStrength;
  readonly priority: DependencyPriority;
  readonly criticality: DependencyCriticality;
  readonly lifecycle: DependencyLifecycleStage;
  readonly metadata: DependencyMetadata;
}

export type DependencyEdgeCollection = readonly DependencyEdgeDescriptor[];

export interface DependencyGraphDescriptor {
  readonly graphId: string;
  readonly graphName: string;
  readonly description: string;
  readonly nodes: DependencyNodeCollection;
  readonly edges: DependencyEdgeCollection;
  readonly graphMetadata: DependencyMetadata;
  readonly compatibilityMetadata: {
    readonly foundationVersion: string;
    readonly registryVersion: string;
    readonly compatibilityVersion: string;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly platformMetadata: {
    readonly platformId: string;
    readonly platformVersion: string;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
}

export type DependencyGraphCollection = readonly DependencyGraphDescriptor[];

export interface DependencyImpactDescriptor {
  readonly id: string;
  readonly type:
    | "direct-impact"
    | "indirect-impact"
    | "upstream-impact"
    | "downstream-impact"
    | "dependency-chain"
    | "dependency-group"
    | "dependency-scope";
  readonly name: string;
  readonly description: string;
  readonly relatedEntityTypes: readonly DependencyEntityType[];
  readonly metadata: DependencyMetadata;
}

export interface DependencyImpactSummary {
  readonly impactDescriptorCount: number;
  readonly supportedImpactTypes: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyModelDescriptor {
  readonly modelVersion: string;
  readonly supportedGraphVersion: string;
  readonly supportedNodeVersion: string;
  readonly supportedEdgeVersion: string;
  readonly supportedImpactVersion: string;
  readonly compatibilityVersion: string;
  readonly deterministicStatus: "Deterministic";
  readonly readonlyStatus: "Readonly";
  readonly metadataOnlyStatus: "MetadataOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyModelSummary {
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly graphCount: number;
  readonly impactCount: number;
  readonly status: "PASS";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
