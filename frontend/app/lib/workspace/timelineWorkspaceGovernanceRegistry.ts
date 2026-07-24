/** WS-10:2 — Foundation-derived governance registries. */
import {
  TimelineWorkspaceResponsibilities,
} from "./timelineWorkspaceCapabilities.ts";
import { TimelineWorkspaceLifecycle } from "./timelineWorkspaceLifecycle.ts";

const register = (
  group: string,
  sources: readonly ({ readonly name: string } | string)[],
) => Object.freeze(sources.map((source, index) => Object.freeze({
  id: `WS-10:2/${group}/${String(index + 1).padStart(2, "0")}`,
  key: `${group.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
  name: typeof source === "string" ? source : source.name,
  group,
  source,
  order: index + 1,
  executable: false,
  metadataOnly: true,
  immutable: true,
})));

export const TimelineWorkspaceGovernanceRegistry = Object.freeze({
  responsibilities: register(
    "Responsibility",
    TimelineWorkspaceResponsibilities,
  ),
  lifecycle: register("Lifecycle", TimelineWorkspaceLifecycle),
  boundaries: register("Boundary", [
    "Timeline Playback",
    "Event Execution",
    "Chronological Processing",
    "AI Reasoning",
    "Workflow Execution",
    "Data Persistence",
    "Rendering",
    "External Communication",
    "Runtime Execution",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
