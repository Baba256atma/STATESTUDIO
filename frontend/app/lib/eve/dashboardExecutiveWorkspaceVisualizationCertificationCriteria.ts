import { DashboardExecutiveWorkspaceVisualizationPlatform } from "./dashboardExecutiveWorkspaceVisualizationPlatform.ts";
import type { DashboardExecutiveWorkspaceCertificationCriterion } from "./dashboardExecutiveWorkspaceVisualizationCertificationTypes.ts";

const criterionNames = Object.freeze([
  "Foundation integrity certified", "Registry integrity certified",
  "Model integrity certified", "Validation integrity certified",
  "Manifest integrity certified", "Platform integrity certified",
  "Canonical composition certified", "Canonical references certified",
  "Inventory integrity certified", "Compatibility certified",
  "Dependency isolation certified", "Public surface certified",
  "Metadata immutability certified", "Canonical ordering certified",
  "Canonical Inventory Rule certified", "ReadyForFreeze certified",
] as const);

export const DashboardExecutiveWorkspaceVisualizationCertificationCriteria:
readonly DashboardExecutiveWorkspaceCertificationCriterion[] = Object.freeze(
  criterionNames.map((name, index) => Object.freeze({
    id: `EVE-6:7/Criterion/${index + 1}` as const,
    name,
    description: `Declarative certification criterion: ${name}.`,
    platformReference:
      DashboardExecutiveWorkspaceVisualizationPlatform.metadata.id,
    status: "Certified" as const,
    deterministicOrder: index + 1,
    verification: "DeclarativeOnly" as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
