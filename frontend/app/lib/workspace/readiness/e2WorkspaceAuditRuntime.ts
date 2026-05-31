import type { E2AuditCheckResult, E2WorkspaceAuditReport, E2WorkspaceReadinessContext } from "./e2ReadinessTypes";
import { logE2WorkspaceAudit } from "./e2ReadinessInstrumentation";

function check(id: string, label: string, passed: boolean, detail: string, severity: "pass" | "warn" | "rec" | "critical"): E2AuditCheckResult & { severity: typeof severity } {
  return { id, label, passed, detail, severity };
}

/** E2:50 Part 1 — full E2 workspace domain audit. */
export function runE2WorkspaceAudit(context: E2WorkspaceReadinessContext): E2WorkspaceAuditReport {
  const results: Array<E2AuditCheckResult & { severity: "pass" | "warn" | "rec" | "critical" }> = [
    check("scene-present", "Scene workspace", context.sceneJsonPresent, context.sceneJsonPresent ? "Scene JSON available" : "No scene loaded", context.sceneJsonPresent ? "pass" : "critical"),
    check("scene-objects", "Scene objects", context.objectCount >= 0, `${context.objectCount} objects in scene`, "pass"),
    check("hud-command-bar", "Top executive bar", context.commandBarVisible, context.commandBarVisible ? "Command bar visible" : "Command bar hidden in clean Type-C", context.commandBarVisible ? "pass" : "critical"),
    check("hud-status", "Status HUD", context.statusHudVisible, context.statusHudVisible ? "Status HUD active" : "Status HUD not visible", context.statusHudVisible ? "pass" : "warn"),
    check("hud-scene-info", "Scene Info HUD", context.sceneInfoVisible, context.sceneInfoVisible ? "Scene Info embedded" : "Scene Info not visible", context.sceneInfoVisible ? "pass" : "warn"),
    check("hud-object-info", "Object Info HUD", context.objectInfoVisible, context.objectInfoVisible ? "Object Info embedded" : "Object Info awaiting selection", context.objectInfoVisible ? "pass" : "warn"),
    check("hud-timeline", "Timeline HUD", context.timelineVisible, context.timelineVisible ? "Timeline surface visible" : "Timeline not visible", context.timelineVisible ? "pass" : "warn"),
    check("assistant", "AI Assistant", context.assistantVisible, context.assistantVisible ? "Executive assistant on right rail" : "Assistant not visible", context.assistantVisible ? "pass" : "critical"),
    check("navigation", "Navigation toolbar", context.navigationToolbarVisible, context.navigationToolbarVisible ? "Scene navigation available" : "Navigation toolbar hidden", context.navigationToolbarVisible ? "pass" : "rec"),
    check("relationships", "Relationship intelligence", context.relationshipCount >= 0, `${context.relationshipCount} relationships mapped`, context.relationshipCount > 0 || context.objectCount <= 3 ? "pass" : "rec"),
    check("layout-readiness", "Workspace layout", context.workspaceReadiness.ready, `Layout readiness ${context.workspaceReadiness.score}%`, context.workspaceReadiness.ready ? "pass" : "warn"),
    check("orientation", "Executive orientation", !context.orientationEnabled || Boolean(context.orientationExperience), context.orientationEnabled ? "Orientation layer active" : "Orientation optional", "pass"),
    check("object-placement", "Object placement", context.objectCount === 0 || context.sceneJsonPresent, context.sceneJsonPresent ? "Placement runtime has scene context" : "Awaiting scene for placement", context.sceneJsonPresent || context.objectCount === 0 ? "pass" : "critical"),
  ];

  if (context.usesLegacyShellWithoutSurface.length > 0) {
    results.push(
      check(
        "legacy-hud-shell",
        "Scene-native HUD shells",
        false,
        `Legacy shells: ${context.usesLegacyShellWithoutSurface.join(", ")}`,
        "warn"
      )
    );
  }

  if (context.harmonizationScore < 80) {
    results.push(
      check(
        "harmonization-score",
        "UX harmonization",
        false,
        `Harmonization score ${context.harmonizationScore}`,
        "rec"
      )
    );
  }

  const passedChecks = results.filter((r) => r.passed).map(({ severity: _s, ...rest }) => rest);
  const warnings = results.filter((r) => !r.passed && r.severity === "warn").map(({ severity: _s, ...rest }) => rest);
  const recommendations = results.filter((r) => !r.passed && r.severity === "rec").map(({ severity: _s, ...rest }) => rest);
  const criticalIssues = results.filter((r) => !r.passed && r.severity === "critical").map(({ severity: _s, ...rest }) => rest);

  const score = Math.round((passedChecks.length / results.length) * 100);
  const report: E2WorkspaceAuditReport = {
    auditedAt: new Date().toISOString(),
    domains: ["scene", "hud", "timeline", "objectInfo", "sceneInfo", "navigation", "assistant", "layout", "placement", "relationships"],
    passedChecks,
    warnings,
    recommendations,
    criticalIssues,
    score,
  };

  logE2WorkspaceAudit("completed", { score, critical: criticalIssues.length, warnings: warnings.length });
  return report;
}
