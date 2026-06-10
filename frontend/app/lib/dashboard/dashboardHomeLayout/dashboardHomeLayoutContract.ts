/**
 * MRP:10:8 — Dashboard Home Layout contract.
 * MRP:10:10 — MVP Approved (frozen).
 *
 * Canonical executive information hierarchy. Layout only — no business logic,
 * routing, or state ownership.
 */

export const DASHBOARD_HOME_LAYOUT_CONTRACT_STATUS = "MVP Approved" as const;

export type DashboardHomeLayoutZoneId =
  | "executive_status"
  | "executive_action"
  | "executive_guidance"
  | "executive_continuity";

export type DashboardHomeLayoutSectionId =
  | "executive_summary"
  | "workspace_snapshot"
  | "daily_readiness"
  | "quick_actions"
  | "recommendations_surface"
  | "intelligence_briefing"
  | "recent_activity_timeline"
  | "favorites_layer"
  | "workspace_recovery";

export type DashboardHomeVisualWeight = "high" | "medium" | "low";

export type DashboardHomeLayoutZoneDefinition = Readonly<{
  id: DashboardHomeLayoutZoneId;
  title: string;
  purpose: string;
  visualWeight: DashboardHomeVisualWeight;
  sections: readonly DashboardHomeLayoutSectionId[];
  scanningQuestion: string;
}>;

/** Fixed canonical zone order — no dynamic reordering. */
export const DASHBOARD_HOME_LAYOUT_ZONES: readonly DashboardHomeLayoutZoneDefinition[] =
  Object.freeze([
    Object.freeze({
      id: "executive_status",
      title: "Executive Status",
      purpose: "Immediate situational awareness",
      visualWeight: "high",
      scanningQuestion: "What is happening?",
      sections: Object.freeze([
        "executive_summary",
        "workspace_snapshot",
        "daily_readiness",
      ] as const satisfies readonly DashboardHomeLayoutSectionId[]),
    }),
    Object.freeze({
      id: "executive_action",
      title: "Executive Actions",
      purpose: "Immediate workflow access",
      visualWeight: "medium",
      scanningQuestion: "What should I do next?",
      sections: Object.freeze(["quick_actions"] as const satisfies readonly DashboardHomeLayoutSectionId[]),
    }),
    Object.freeze({
      id: "executive_guidance",
      title: "Executive Guidance",
      purpose: "Decision support",
      visualWeight: "medium",
      scanningQuestion: "What requires attention?",
      sections: Object.freeze([
        "recommendations_surface",
        "intelligence_briefing",
      ] as const satisfies readonly DashboardHomeLayoutSectionId[]),
    }),
    Object.freeze({
      id: "executive_continuity",
      title: "Executive Continuity",
      purpose: "Context recovery and continuity",
      visualWeight: "low",
      scanningQuestion: "What was I doing previously?",
      sections: Object.freeze([
        "recent_activity_timeline",
        "favorites_layer",
        "workspace_recovery",
      ] as const satisfies readonly DashboardHomeLayoutSectionId[]),
    }),
  ]);

export const DASHBOARD_HOME_CANONICAL_SECTION_ORDER: readonly DashboardHomeLayoutSectionId[] =
  Object.freeze(DASHBOARD_HOME_LAYOUT_ZONES.flatMap((zone) => [...zone.sections]));

export type DashboardHomeLayoutView = Readonly<{
  zones: typeof DASHBOARD_HOME_LAYOUT_ZONES;
  sectionOrder: typeof DASHBOARD_HOME_CANONICAL_SECTION_ORDER;
  source: "dashboard_home_layout";
}>;

export type DashboardHomeLayoutValidation = Readonly<{
  valid: boolean;
  expectedSectionOrder: readonly DashboardHomeLayoutSectionId[];
  actualSectionOrder: readonly DashboardHomeLayoutSectionId[];
}>;

const loggedBrakes = new Set<string>();

export function warnDashboardHomeLayoutBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[DashboardHomeLayout][Brake]", { message, ...detail });
}

export function resetDashboardHomeLayoutBrakesForTests(): void {
  loggedBrakes.clear();
}
