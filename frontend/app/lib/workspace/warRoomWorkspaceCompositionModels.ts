/** WS-8:3 — Declarative War Room structural compositions. */
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Operational Status Composition", [
    "Status Identity",
    "Status Category",
    "Status Description",
    "Related Activities",
    "Related Events",
    "Related Metadata",
  ]],
  ["Executive Alert Composition", [
    "Alert Identity",
    "Alert Type",
    "Alert Severity",
    "Alert Source Reference",
    "Alert Metadata",
  ]],
  ["Executive Event Composition", [
    "Event Identity",
    "Event Category",
    "Event Description",
    "Event References",
    "Event Metadata",
  ]],
  ["Executive Incident Composition", [
    "Incident Identity",
    "Incident Category",
    "Incident Severity",
    "Related Activities",
    "Metadata",
  ]],
  ["Operational Coordination Composition", [
    "Coordination Identity",
    "Coordination Type",
    "Participants",
    "Related Activities",
    "Metadata",
  ]],
  ["Executive Monitoring Composition", [
    "Monitoring Identity",
    "Monitoring Domain",
    "Monitoring Scope",
    "Metadata",
  ]],
  ["Executive Collaboration Composition", [
    "Collaboration Identity",
    "Collaboration Type",
    "Related Roles",
    "Metadata",
  ]],
  ["War Room Readiness Composition", [
    "ReadyForValidation",
    "ReadyForValueWorkspace",
    "ReadyForTimelineWorkspace",
    "ReadyForExecutiveReview",
    "Incomplete",
  ]],
] as const);

export const WarRoomWorkspaceCompositionModels = Object.freeze(
  definitions.map(([name, fields], index) =>
    Object.freeze({
      id: `WS-8:3/Composition/${String(index + 1).padStart(2, "0")}`,
      name,
      description: `Declares ${name.toLowerCase()} without processing.`,
      fields: Object.freeze([...fields]),
      source: WarRoomWorkspaceRegistry,
      computed: false,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
