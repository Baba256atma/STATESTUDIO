import { DashboardExecutiveWorkspaceVisualizationCertificationPlatform } from "./dashboardExecutiveWorkspaceVisualizationCertification.ts";
import type { DashboardExecutiveWorkspaceFreezeDeclaration } from "./dashboardExecutiveWorkspaceVisualizationFreezeTypes.ts";

const certification =
  DashboardExecutiveWorkspaceVisualizationCertificationPlatform;
const composition = certification.platform.composition;
const compatibilitySources = Object.freeze([
  ["Foundation compatibility preserved", composition[0]],
  ["Registry compatibility preserved", composition[1]],
  ["Model compatibility preserved", composition[2]],
  ["Validation compatibility preserved", composition[3]],
  ["Manifest compatibility preserved", composition[4]],
  ["Platform compatibility preserved", certification.platform],
  ["Certification compatibility preserved", certification],
  ["Public Index compatibility preserved", certification.readiness],
] as const);

export const DashboardExecutiveWorkspaceVisualizationFreezeCompatibility:
readonly DashboardExecutiveWorkspaceFreezeDeclaration[] = Object.freeze(
  compatibilitySources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-6:8/Compatibility/${index + 1}` as const,
    name,
    canonicalReference,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    runtimeExecution: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
