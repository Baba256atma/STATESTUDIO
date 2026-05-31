import type { E2WorkspaceReadinessContext, ExecutiveFirst30SecondsReport } from "./e2ReadinessTypes";
import { logWorkspaceValidation } from "./e2ReadinessInstrumentation";

function scoreFromFlags(flags: boolean[]): number {
  if (flags.length === 0) return 0;
  return Math.round((flags.filter(Boolean).length / flags.length) * 100);
}

/** E2:50 Part 2 — validate executive first-30-seconds experience. */
export function validateExecutiveFirst30Seconds(context: E2WorkspaceReadinessContext): ExecutiveFirst30SecondsReport {
  const experience = context.orientationExperience;
  const findings: string[] = [];

  const topBarClear = context.commandBarVisible;
  const sceneClear = context.sceneJsonPresent;
  const timelineDiscoverable = context.timelineVisible;
  const objectInfoReady = context.objectInfoVisible || Boolean(context.selectedObjectId);
  const assistantDiscoverable = context.assistantVisible;

  if (!topBarClear) findings.push("Top bar not visible — executive posture unclear on entry.");
  if (!sceneClear) findings.push("Scene empty — first impression lacks operational map.");
  if (!timelineDiscoverable) findings.push("Timeline not visible — decision history hard to discover.");
  if (!assistantDiscoverable) findings.push("AI Assistant not visible — guidance channel missing.");
  if (context.orientationEnabled && !experience) findings.push("Orientation enabled but experience snapshot missing.");

  const orientationQuality = experience
    ? scoreFromFlags([
        Boolean(experience.firstImpression.summaryLines.length),
        Boolean(experience.situationalAwareness.entryHeadline),
        experience.confidence.signals.some((s) => s.ready),
      ])
    : context.orientationEnabled
      ? 40
      : 70;

  const discoverability = scoreFromFlags([
    topBarClear,
    sceneClear,
    timelineDiscoverable,
    assistantDiscoverable,
    context.quickActionsVisible || context.navigationToolbarVisible,
  ]);

  const clarity = experience
    ? scoreFromFlags([
        !experience.situationalAwareness.entryHeadline.match(/loading|initializing|unknown/i),
        experience.firstImpression.recommendedFocus.length > 0,
        topBarClear,
      ])
    : scoreFromFlags([topBarClear, sceneClear]);

  const guidanceQuality = experience
    ? scoreFromFlags([
        experience.quickStart.length > 0,
        Boolean(experience.welcome.suggestedFirstAction || !experience.welcome.showWelcome),
        Boolean(experience.situationalAwareness.recommendedNextStep),
      ])
    : 50;

  if (experience && experience.quickStart.length === 0) {
    findings.push("No contextual quick-start recommendations generated.");
  }

  const surfaces = [
    { name: "Top Bar", ok: topBarClear },
    { name: "Scene", ok: sceneClear },
    { name: "Timeline", ok: timelineDiscoverable },
    { name: "Object Info", ok: objectInfoReady },
    { name: "AI Assistant", ok: assistantDiscoverable },
  ];
  for (const surface of surfaces) {
    if (!surface.ok) findings.push(`${surface.name} failed first-30-seconds discoverability check.`);
  }

  const passed = discoverability >= 70 && clarity >= 65 && orientationQuality >= 60;
  const report: ExecutiveFirst30SecondsReport = {
    orientationQuality,
    discoverability,
    clarity,
    guidanceQuality,
    passed,
    findings,
  };

  logWorkspaceValidation("first30Seconds", report);
  return report;
}
