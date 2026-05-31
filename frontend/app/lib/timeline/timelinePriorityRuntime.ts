import type { TimelineEvent } from "../scene/executiveTimelineHudTypes";

export type TimelinePriorityCategory = "CRITICAL" | "IMPORTANT" | "INFORMATIONAL" | "BACKGROUND";

const logKeys = new Set<string>();

function log(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][TimelinePriority]", payload);
}

export function resolveTimelinePriority(event: TimelineEvent): TimelinePriorityCategory {
  const title = event.title.toLowerCase();
  let priority: TimelinePriorityCategory = "INFORMATIONAL";

  if (
    event.status === "active" ||
    title.includes("risk") ||
    title.includes("delay") ||
    title.includes("critical") ||
    title.includes("approved")
  ) {
    priority = "CRITICAL";
  } else if (
    event.status === "completed" ||
    title.includes("decision") ||
    title.includes("scenario") ||
    title.includes("impact") ||
    title.includes("supplier")
  ) {
    priority = "IMPORTANT";
  } else if (event.status === "pending") {
    priority = "BACKGROUND";
  }

  log({
    eventId: event.id,
    title: event.title,
    status: event.status,
    priority,
  });
  return priority;
}

export function shouldDisplayTimelinePriority(
  priority: TimelinePriorityCategory,
  mode: "COMPACT" | "STANDARD" | "EXPANDED"
): boolean {
  if (mode === "EXPANDED") return priority !== "BACKGROUND";
  if (mode === "STANDARD") return priority === "CRITICAL" || priority === "IMPORTANT" || priority === "INFORMATIONAL";
  return priority === "CRITICAL" || priority === "IMPORTANT";
}

export function resetTimelinePriorityRuntimeForTests(): void {
  logKeys.clear();
}
