/**
 * MRP:10:8 — Dashboard Home layout runtime.
 *
 * Structure validation only. No layout measurement, no state ownership.
 */

import {
  DASHBOARD_HOME_CANONICAL_SECTION_ORDER,
  DASHBOARD_HOME_LAYOUT_ZONES,
  warnDashboardHomeLayoutBrake,
  type DashboardHomeLayoutSectionId,
  type DashboardHomeLayoutValidation,
  type DashboardHomeLayoutView,
  type DashboardHomeLayoutZoneId,
} from "./dashboardHomeLayoutContract.ts";

export function buildDashboardHomeLayoutView(): DashboardHomeLayoutView {
  return Object.freeze({
    zones: DASHBOARD_HOME_LAYOUT_ZONES,
    sectionOrder: DASHBOARD_HOME_CANONICAL_SECTION_ORDER,
    source: "dashboard_home_layout",
  });
}

export function getDashboardHomeZoneDefinition(zoneId: DashboardHomeLayoutZoneId) {
  return DASHBOARD_HOME_LAYOUT_ZONES.find((zone) => zone.id === zoneId) ?? null;
}

export function validateDashboardHomeSectionOrder(
  actualSectionOrder: readonly DashboardHomeLayoutSectionId[]
): DashboardHomeLayoutValidation {
  const expected = DASHBOARD_HOME_CANONICAL_SECTION_ORDER;
  const valid =
    actualSectionOrder.length === expected.length &&
    actualSectionOrder.every((sectionId, index) => sectionId === expected[index]);

  if (!valid) {
    warnDashboardHomeLayoutBrake("Dashboard Home section order drift detected.", {
      expected,
      actual: actualSectionOrder,
    });
  }

  return Object.freeze({
    valid,
    expectedSectionOrder: expected,
    actualSectionOrder,
  });
}

export function sectionBelongsToZone(
  sectionId: DashboardHomeLayoutSectionId,
  zoneId: DashboardHomeLayoutZoneId
): boolean {
  const zone = getDashboardHomeZoneDefinition(zoneId);
  return zone?.sections.includes(sectionId) ?? false;
}
