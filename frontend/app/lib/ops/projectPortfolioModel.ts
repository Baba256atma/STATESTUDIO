import type {
  ProjectModelMetadata,
  ProjectPortfolioDescriptor,
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

export const ProjectPortfolioModel = Object.freeze([
  Object.freeze({
    portfolioIdentifier: "portfolio-executive-transformation",
    programIdentifier: "program-strategic-modernization",
    strategicAlignmentMetadata: Object.freeze([
      "Executive transformation alignment metadata",
      "Business priority alignment metadata",
    ]),
    parentProjectMetadata: Object.freeze([
      "Portfolio parent project metadata",
    ]),
    childProjectMetadata: Object.freeze([
      "Program child project metadata",
      "Initiative child project metadata",
    ]),
    metadata,
  }),
  Object.freeze({
    portfolioIdentifier: "portfolio-operational-excellence",
    programIdentifier: "program-continuous-improvement",
    strategicAlignmentMetadata: Object.freeze([
      "Operational excellence alignment metadata",
      "Efficiency objective alignment metadata",
    ]),
    parentProjectMetadata: Object.freeze([
      "Operational portfolio parent metadata",
    ]),
    childProjectMetadata: Object.freeze([
      "Continuous improvement child metadata",
    ]),
    metadata,
  }),
] as const satisfies readonly ProjectPortfolioDescriptor[]);

