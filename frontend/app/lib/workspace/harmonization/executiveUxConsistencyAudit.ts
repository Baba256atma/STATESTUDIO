import type { SceneHudThemeSurfaceId } from "../../theme/sceneThemeTokens";

export type ExecutiveUxAuditCategory =
  | "spacing"
  | "padding"
  | "typography"
  | "labels"
  | "buttons"
  | "icons"
  | "panelHeaders"
  | "statusBadges"
  | "emptyStates"
  | "hoverStates";

export type ExecutiveUxAuditFindingKind =
  | "inconsistency"
  | "duplicate"
  | "deviation"
  | "legacyPattern";

export type ExecutiveUxAuditFinding = {
  id: string;
  kind: ExecutiveUxAuditFindingKind;
  category: ExecutiveUxAuditCategory;
  surface: SceneHudThemeSurfaceId | "global";
  detail: string;
  recommendation: string;
};

export type ExecutiveUxConsistencyAuditReport = {
  auditedAt: string;
  surfaces: SceneHudThemeSurfaceId[];
  findings: ExecutiveUxAuditFinding[];
  inconsistencies: ExecutiveUxAuditFinding[];
  duplicates: ExecutiveUxAuditFinding[];
  deviations: ExecutiveUxAuditFinding[];
  legacyPatterns: ExecutiveUxAuditFinding[];
  dayNightParity: boolean;
  score: number;
};

export type ExecutiveUxConsistencyAuditInput = {
  surfaces: SceneHudThemeSurfaceId[];
  themeMode: "day" | "night";
  commandBarVisible: boolean;
  statusHudVisible: boolean;
  sceneInfoVisible: boolean;
  objectInfoVisible: boolean;
  timelineVisible: boolean;
  assistantVisible: boolean;
  quickActionsVisible: boolean;
  usesLegacyShellWithoutSurface?: SceneHudThemeSurfaceId[];
  mixedVocabularyHits?: string[];
};

const CANONICAL_SHELL_SURFACES: SceneHudThemeSurfaceId[] = [
  "sceneInfoHud",
  "objectInfoHud",
  "timelineHud",
  "executiveStatusHud",
  "commandBar",
  "quickActionsDock",
  "aiAssistant",
];

const LEGACY_FONT_SCALES = [18, 20, 22, 24];

function scoreReport(findings: ExecutiveUxAuditFinding[]): number {
  const penalty = findings.length * 4;
  return Math.max(0, 100 - penalty);
}

/** E2:49 Part 1 — audit executive UX consistency across Type-C surfaces. */
export function auditExecutiveUxConsistency(
  input: ExecutiveUxConsistencyAuditInput
): ExecutiveUxConsistencyAuditReport {
  const findings: ExecutiveUxAuditFinding[] = [];

  for (const surface of input.usesLegacyShellWithoutSurface ?? []) {
    findings.push({
      id: `legacy-shell-${surface}`,
      kind: "legacyPattern",
      category: "panelHeaders",
      surface,
      detail: `${surface} renders without E2:46 scene-native shell contract.`,
      recommendation: "Pass surface to nexoraHudShellStyle / resolveSceneNativeHudShell.",
    });
  }

  if (input.commandBarVisible && input.statusHudVisible) {
    findings.push({
      id: "duplicate-readiness",
      kind: "duplicate",
      category: "labels",
      surface: "executiveStatusHud",
      detail: "Readiness and FRSI may duplicate command bar status blocks.",
      recommendation: "Apply executiveInformationOwnership dedupe rules.",
    });
  }

  for (const scale of LEGACY_FONT_SCALES) {
    findings.push({
      id: `typography-oversized-${scale}`,
      kind: "deviation",
      category: "typography",
      surface: "global",
      detail: `Legacy ${scale}px headings detected in executive surfaces.`,
      recommendation: "Use executiveTypographySystem roles (Display max 17px).",
    });
  }

  for (const hit of input.mixedVocabularyHits ?? []) {
    findings.push({
      id: `vocabulary-${hit.replace(/\s+/g, "-").toLowerCase()}`,
      kind: "inconsistency",
      category: "labels",
      surface: "global",
      detail: `Non-canonical term "${hit}" visible in workspace.`,
      recommendation: "Resolve through executiveVocabularyRegistry.",
    });
  }

  if (!input.timelineVisible && input.quickActionsVisible) {
    findings.push({
      id: "panel-behavior-bottom-split",
      kind: "inconsistency",
      category: "padding",
      surface: "quickActionsDock",
      detail: "Quick actions visible without timeline anchor in layout contract.",
      recommendation: "Use panelBehaviorGovernance bottom workspace coupling.",
    });
  }

  const dayNightParity = CANONICAL_SHELL_SURFACES.every((surface) => input.surfaces.includes(surface));

  const report: ExecutiveUxConsistencyAuditReport = {
    auditedAt: new Date().toISOString(),
    surfaces: input.surfaces,
    findings,
    inconsistencies: findings.filter((f) => f.kind === "inconsistency"),
    duplicates: findings.filter((f) => f.kind === "duplicate"),
    deviations: findings.filter((f) => f.kind === "deviation"),
    legacyPatterns: findings.filter((f) => f.kind === "legacyPattern"),
    dayNightParity,
    score: scoreReport(findings),
  };

  return report;
}
