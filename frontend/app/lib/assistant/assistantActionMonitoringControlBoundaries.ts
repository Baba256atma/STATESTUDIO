/** ASSISTANT-9:1 — Architectural boundaries and prohibited surfaces. */
import type { AssistantActionMonitoringControlBoundaryMetadata } from "./assistantActionMonitoringControlIdentity.ts";

const declarations = Object.freeze([
  ["KPI Calculations", "KPI evaluation and numeric computation"],
  ["Monitoring Engines", "Monitoring engine runtime execution"],
  ["Alert Engines", "Alert engine runtime execution"],
  ["Retry Logic", "Retry and recovery runtime logic"],
  ["Scheduling", "Scheduling and timer-driven behaviour"],
  ["Automation", "Automation and workflow runtime behaviour"],
  ["Dashboards", "Dashboard rendering and presentation"],
  ["API Calls", "Outbound API and network invocation"],
  ["Services", "Service runtime objects and factories"],
  ["Databases", "Database access and persistence"],
  ["AI", "AI reasoning and model invocation"],
  ["Decision Engines", "Decision engine runtime evaluation"],
  ["Execution Engines", "Execution engine runtime behaviour"],
  ["Rendering", "UI rendering and visual presentation"],
  ["Background Workers", "Background workers and job processing"],
  ["Event Buses", "Event bus publication and subscription"],
  ["Message Queues", "Message queue runtime processing"],
  ["Network Access", "Network communication and transport"],
  ["Persistence", "Durable storage and persistence adapters"],
] as const);

export const AssistantActionMonitoringControlBoundaries:
readonly AssistantActionMonitoringControlBoundaryMetadata[] = Object.freeze(
  declarations.map(([name, prohibitedResponsibility], index) =>
    Object.freeze({
      id: `ASSISTANT-9:1/Boundary/${String(index + 1).padStart(2, "0")}`,
      name,
      prohibitedResponsibility,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
);

export const AssistantActionMonitoringControlProhibitedSurfaces = Object.freeze(
  declarations.map(([name]) => name),
);
