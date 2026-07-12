import type {
  ProjectLifecycleDescriptor,
  ProjectModelMetadata,
} from "./projectModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-4:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze([
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:1",
    "OPS-4:2",
  ]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ProjectModelMetadata);

export const ProjectLifecycleModel = Object.freeze({
  lifecycleStages: Object.freeze([
    "Defined",
    "Structured",
    "Sequenced",
    "Ready",
    "Cataloged",
  ]),
  entryCriteriaMetadata: Object.freeze([
    "Identity metadata established",
    "Workflow linkage metadata established",
  ]),
  exitCriteriaMetadata: Object.freeze([
    "Readiness metadata satisfied",
    "Governance metadata satisfied",
  ]),
  lifecycleStatusMetadata: Object.freeze([
    "Draft release-stage metadata",
    "Metadata-only lifecycle status",
  ]),
  metadata,
} as const satisfies ProjectLifecycleDescriptor);

