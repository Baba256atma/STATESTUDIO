import type { ScheduleCalendarDescriptor } from "./schedulingModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-6:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze(["OPS-6:1", "OPS-6:2"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ScheduleCalendarModel = Object.freeze([
  Object.freeze({
    id: "schedule-calendar-operational",
    name: "Operational Calendar",
    description: "Calendar metadata for operational execution windows and working periods.",
    calendarTypes: Object.freeze(["Business", "Team", "Department"]),
    calendarMetadata: Object.freeze([
      "working-periods",
      "calendar-exceptions",
      "regional-coverage",
    ]),
    metadata,
  }),
  Object.freeze({
    id: "schedule-calendar-delivery",
    name: "Delivery Calendar",
    description: "Calendar metadata for delivery schedules, milestones, and review windows.",
    calendarTypes: Object.freeze(["Project", "Release", "Review"]),
    calendarMetadata: Object.freeze([
      "delivery-cadence",
      "milestone-windows",
      "review-boundaries",
    ]),
    metadata,
  }),
] as const satisfies readonly ScheduleCalendarDescriptor[]);
