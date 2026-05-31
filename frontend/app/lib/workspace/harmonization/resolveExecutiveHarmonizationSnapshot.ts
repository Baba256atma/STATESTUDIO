import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";
import { auditExecutiveUxConsistency, type ExecutiveUxConsistencyAuditInput } from "./executiveUxConsistencyAudit";
import { logExecutiveUxAudit, logExecutiveWorkspaceIdentity } from "./executiveHarmonizationInstrumentation";
import { TYPE_C_WORKSPACE_IDENTITY_CONTRACT } from "./typeCWorkspaceIdentityContract";

export type ExecutiveHarmonizationSnapshot = {
  audit: ReturnType<typeof auditExecutiveUxConsistency>;
  identityVersion: string;
  themeMode: "day" | "night";
};

/** Orchestrates E2:49 harmonization audit + identity contract reference. */
export function resolveExecutiveHarmonizationSnapshot(
  input: ExecutiveUxConsistencyAuditInput
): ExecutiveHarmonizationSnapshot {
  const audit = auditExecutiveUxConsistency(input);
  logExecutiveUxAudit("completed", {
    score: audit.score,
    findings: audit.findings.length,
    dayNightParity: audit.dayNightParity,
  });
  logExecutiveWorkspaceIdentity("contract", {
    version: TYPE_C_WORKSPACE_IDENTITY_CONTRACT.version,
  });
  return {
    audit,
    identityVersion: TYPE_C_WORKSPACE_IDENTITY_CONTRACT.version,
    themeMode: input.themeMode,
  };
}

export function verifyDayNightHarmonizationParity(surfaces: SceneHudThemeSurfaceId[]): boolean {
  const required: SceneHudThemeSurfaceId[] = [
    "sceneInfoHud",
    "objectInfoHud",
    "timelineHud",
    "executiveStatusHud",
    "commandBar",
    "quickActionsDock",
    "aiAssistant",
  ];
  return required.every((surface) => surfaces.includes(surface));
}
