import { DashboardExecutiveWorkspaceVisualizationCertificationPlatform } from "./dashboardExecutiveWorkspaceVisualizationCertification.ts";
import type { DashboardExecutiveWorkspaceFrozenBaseline } from "./dashboardExecutiveWorkspaceVisualizationFreezeTypes.ts";

const certification =
  DashboardExecutiveWorkspaceVisualizationCertificationPlatform;
const composition = certification.platform.composition;
const baselineSources = Object.freeze([
  ["Foundation baseline", composition[0]],
  ["Registry baseline", composition[1]],
  ["Model baseline", composition[2]],
  ["Validation baseline", composition[3]],
  ["Manifest baseline", composition[4]],
  ["Platform baseline", certification.platform],
  ["Certification baseline", certification],
  ["Dashboard & Executive Workspace Visualization architecture baseline",
    certification],
] as const);

export const DashboardExecutiveWorkspaceVisualizationFrozenBaselines:
readonly DashboardExecutiveWorkspaceFrozenBaseline[] = Object.freeze(
  baselineSources.map(([name, canonicalReference], index) => Object.freeze({
    id: `EVE-6:8/Baseline/${index + 1}` as const,
    name,
    canonicalReference,
    preservedByReference: true as const,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
