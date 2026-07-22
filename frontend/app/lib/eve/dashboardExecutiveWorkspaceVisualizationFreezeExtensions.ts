import { DashboardExecutiveWorkspaceVisualizationCertificationPlatform } from "./dashboardExecutiveWorkspaceVisualizationCertification.ts";
import type { DashboardExecutiveWorkspaceFreezeDeclaration } from "./dashboardExecutiveWorkspaceVisualizationFreezeTypes.ts";

const certification =
  DashboardExecutiveWorkspaceVisualizationCertificationPlatform;
const composition = certification.platform.composition;
const extensionSources = Object.freeze([
  ["Foundation extension", composition[0]],
  ["Registry extension", composition[1]],
  ["Model extension", composition[2]],
  ["Validation extension", composition[3]],
  ["Manifest extension", composition[4]],
  ["Platform extension", certification.platform],
  ["Certification extension", certification],
  ["Public Index extension", certification.readiness],
] as const);

export const DashboardExecutiveWorkspaceVisualizationFreezeExtensions:
readonly DashboardExecutiveWorkspaceFreezeDeclaration[] = Object.freeze(
  extensionSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-6:8/Extension/${index + 1}` as const,
    name,
    canonicalReference,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    runtimeExecution: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
