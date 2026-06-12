/**
 * MRP_HUD:10:1 — HUD zone audit report builder (diagnosis only).
 */

import type { HudZoneContractAuditResult } from "./hudZoneContractAudit.ts";

export type HudZoneAuditReportSection =
  | "zone-inventory"
  | "visible-runtime-layout"
  | "hidden-runtime-hosts"
  | "portal-inventory"
  | "overlap-inventory"
  | "hud-brake-inventory"
  | "safe-zone-violations"
  | "recommended-fix-order"
  | "risk-assessment"
  | "audit-verdict";

function formatZoneTable(result: HudZoneContractAuditResult): string {
  const header =
    "| Zone | Label | x | y | width | height | z-index | owner | mounted | visible |";
  const divider =
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |";
  const rows = result.zones.map(
    (zone) =>
      `| ${zone.zoneId} | ${zone.label} | ${zone.x} | ${zone.y} | ${zone.width} | ${zone.height} | ${zone.zIndex} | ${zone.ownerComponent} | ${zone.mountedComponent} | ${zone.visible ? "yes" : "no"} |`
  );
  return [header, divider, ...rows].join("\n");
}

function formatPortalTable(result: HudZoneContractAuditResult): string {
  const header =
    "| Host ID | Role | owner | x | y | width | height | z-index | mounted | hidden | zero-size |";
  const divider =
    "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |";
  const rows = result.portals.map(
    (portal) =>
      `| ${portal.id} | ${portal.expectedRole} | ${portal.ownerComponent} | ${portal.x} | ${portal.y} | ${portal.width} | ${portal.height} | ${portal.zIndex} | ${portal.mounted ? "yes" : "no"} | ${portal.hidden ? "yes" : "no"} | ${portal.zeroSize ? "yes" : "no"} |`
  );
  return [header, divider, ...rows].join("\n");
}

function formatOverlapTable(result: HudZoneContractAuditResult): string {
  if (!result.overlaps.length) {
    return "_No measured DOM overlaps._";
  }
  const header = "| Zone A | Zone B | overlap area (px²) | visible |";
  const divider = "| --- | --- | ---: | --- |";
  const rows = result.overlaps.map(
    (overlap) =>
      `| ${overlap.zoneA} | ${overlap.zoneB} | ${overlap.overlapArea} | ${overlap.visible ? "yes" : "no"} |`
  );
  return [header, divider, ...rows].join("\n");
}

function buildRecommendedFixOrder(result: HudZoneContractAuditResult): string[] {
  const order: string[] = [];
  if (result.contractMrpOverlapDetected) {
    order.push("1. Resolve contract-level MRP overlap (ensure sceneWidth is measured before object panel placement).");
  }
  if (result.overlaps.some((overlap) => overlap.visible)) {
    order.push("2. Eliminate visible DOM zone collisions before any width tuning.");
  }
  if (result.hiddenHostDetected) {
    order.push("3. Consolidate portal hosts — retire legacy `#nexora-right-panel-root` when visible MRP host is active.");
  }
  if (result.safeZoneViolations.some((v) => v.includes("zero_size"))) {
    order.push("4. Fix zero-size active hosts that block portal mounting.");
  }
  if (result.contractOverlapDetected) {
    order.push("5. Reconcile scene HUD zone contract overlap flags with measured layout.");
  }
  if (!order.length) {
    order.push("No stabilization fixes required — proceed to HUD movement phase with baseline PASS.");
  }
  return order;
}

function buildRiskAssessment(result: HudZoneContractAuditResult): string {
  if (result.verdict === "fail") {
    return "HIGH — visible HUD collisions may block interaction or obscure MRP content.";
  }
  if (result.verdict === "warning") {
    return "MEDIUM — hidden/legacy hosts or contract overlap flags present; visible UI may still be acceptable.";
  }
  return "LOW — zones are contract-aligned with no visible collisions.";
}

export function buildHudZoneAuditReport(result: HudZoneContractAuditResult): string {
  const hiddenHosts = result.portals.filter(
    (portal) => portal.hidden || portal.zeroSize || portal.expectedRole === "legacy"
  );
  const fixOrder = buildRecommendedFixOrder(result);

  return [
    "# MRP HUD Zone Contract Audit Report",
    "",
    `**Audit ID:** ${result.auditId}`,
    `**Timestamp:** ${new Date(result.timestamp).toISOString()}`,
    `**Verdict:** ${result.verdict.toUpperCase()}`,
    "",
    "## Zone Inventory",
    "",
    formatZoneTable(result),
    "",
    "## Visible Runtime Layout",
    "",
    result.zones
      .filter((zone) => zone.visible)
      .map((zone) => `- **${zone.zoneId}** (${zone.label}): ${zone.width}×${zone.height} at (${zone.x}, ${zone.y})`)
      .join("\n") || "_No visible zones measured in DOM — contract fallback values used._",
    "",
    "## Hidden Runtime Hosts",
    "",
    hiddenHosts.length
      ? hiddenHosts
          .map(
            (host) =>
              `- \`${host.id}\` (${host.expectedRole}): ${host.width}×${host.height}, hidden=${host.hidden}, zeroSize=${host.zeroSize}`
          )
          .join("\n")
      : "_No hidden or legacy hosts detected._",
    "",
    "## Portal Inventory",
    "",
    `**Mounted portal count:** ${result.portalCount}`,
    "",
    formatPortalTable(result),
    "",
    "## Overlap Inventory",
    "",
    `- Contract overlapDetected: \`${result.contractOverlapDetected}\``,
    `- Contract mrpOverlapDetected: \`${result.contractMrpOverlapDetected}\``,
    `- Runtime overlapDetected: \`${result.overlapDetected}\``,
    "",
    formatOverlapTable(result),
    "",
    "## HUD Brake Inventory",
    "",
    result.brakes.length
      ? result.brakes
          .map(
            (brake) =>
              `- **${brake.source}**: overlapDetected=${brake.overlapDetected}, mrpOverlapDetected=${brake.mrpOverlapDetected} — ${brake.detail}`
          )
          .join("\n")
      : "_No brake entries._",
    "",
    "### Known Issue Verification: `[Nexora][HUDZoneBrake]`",
    "",
    result.contractMrpOverlapDetected || result.contractOverlapDetected
      ? "Brake **may still fire** when contract overlap flags are true (typically viewport-fallback without sceneWidth)."
      : "Brake **should not fire** for current contract inputs — overlap flags are false.",
    "",
    "## Safe Zone Violations",
    "",
    result.safeZoneViolations.length
      ? result.safeZoneViolations.map((violation) => `- ${violation}`).join("\n")
      : "_No safe zone violations._",
    "",
    "## Recommended Fix Order",
    "",
    fixOrder.map((item) => `- ${item}`).join("\n"),
    "",
    "## Risk Assessment",
    "",
    buildRiskAssessment(result),
    "",
    "## Audit Verdict",
    "",
    `**${result.verdict.toUpperCase()}**`,
    "",
    result.notes.length ? `Notes:\n${result.notes.map((note) => `- ${note}`).join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildHudZoneAuditReportSections(
  result: HudZoneContractAuditResult
): Record<HudZoneAuditReportSection, string> {
  const full = buildHudZoneAuditReport(result);
  return {
    "zone-inventory": formatZoneTable(result),
    "visible-runtime-layout": result.zones
      .filter((zone) => zone.visible)
      .map((zone) => `${zone.zoneId}: ${zone.width}×${zone.height}`)
      .join(", "),
    "hidden-runtime-hosts": result.portals
      .filter((portal) => portal.hidden || portal.zeroSize)
      .map((portal) => portal.id)
      .join(", "),
    "portal-inventory": formatPortalTable(result),
    "overlap-inventory": formatOverlapTable(result),
    "hud-brake-inventory": result.brakes.map((brake) => brake.source).join(", "),
    "safe-zone-violations": result.safeZoneViolations.join(", "),
    "recommended-fix-order": buildRecommendedFixOrder(result).join("\n"),
    "risk-assessment": buildRiskAssessment(result),
    "audit-verdict": result.verdict,
  };
}
