/**
 * MRP:4F:4 — Derive War Room action plan from commitment runtime state.
 *
 * Structural execution planning only — no scenario regeneration or simulation.
 */

import type { ScenarioCommitPackage } from "../scenario/scenarioHandoffContract.ts";
import {
  DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER,
  WAR_ROOM_ACTION_PLAN_PURPOSE,
  WAR_ROOM_ACTION_PLAN_SECTION_LABELS,
  WAR_ROOM_ACTION_PLAN_SECTION_ORDER,
  WAR_ROOM_ACTION_PLAN_TAG,
  type WarRoomActionItem,
  type WarRoomActionItemPriority,
  type WarRoomActionItemStatus,
  type WarRoomActionPlanLayer,
  type WarRoomActionPlanSectionId,
  type WarRoomActionPlanSurface,
} from "./warRoomActionPlanContract.ts";
import type { WarRoomFieldSnapshot } from "./warRoomWorkspaceStateContract.ts";
import type { WarRoomStatus } from "./warRoomStateContract.ts";
import type { WarRoomWorkspaceContext } from "./warRoomWorkspaceContextContract.ts";

export type WarRoomActionPlanInput = Readonly<{
  selectedStrategy: string | null;
  activeDecisionId: string | null;
  status: WarRoomStatus;
  workspaceContext: WarRoomWorkspaceContext;
  commitPackage: ScenarioCommitPackage | null;
}>;

function resolveStrategyLabel(input: WarRoomActionPlanInput): string {
  return (
    input.commitPackage?.title?.trim() ||
    input.selectedStrategy?.trim() ||
    input.workspaceContext.strategyFocus.trim() ||
    "Selected strategy"
  );
}

function resolveObjectSegment(input: WarRoomActionPlanInput): string {
  return (
    input.commitPackage?.selectedObjectId?.trim() ||
    input.workspaceContext.selectedObjectId?.trim() ||
    "general"
  );
}

function resolveImmediateStatus(input: WarRoomActionPlanInput): WarRoomActionItemStatus {
  if (input.status === "active" || input.status === "approved") return "active";
  if (input.status === "review") return "active";
  return "pending";
}

function buildActionItem(
  sectionId: WarRoomActionPlanSectionId,
  id: string,
  title: string,
  owner: string,
  priority: WarRoomActionItemPriority,
  status: WarRoomActionItemStatus
): WarRoomActionItem {
  return Object.freeze({
    id,
    title,
    owner,
    priority,
    status,
    sectionId,
  });
}

export function deriveWarRoomActionPlanLayer(
  input: WarRoomActionPlanInput
): WarRoomActionPlanLayer {
  const hasPlanningContext =
    input.workspaceContext.hasSelection ||
    input.activeDecisionId !== null ||
    input.commitPackage !== null;

  if (!hasPlanningContext) {
    return DEFAULT_WAR_ROOM_ACTION_PLAN_LAYER;
  }

  const strategy = resolveStrategyLabel(input);
  const objectSegment = resolveObjectSegment(input);
  const objectLabel = input.workspaceContext.selectedObject;
  const immediateStatus = resolveImmediateStatus(input);

  const immediateItems: WarRoomActionItem[] = [
    buildActionItem(
      "immediate_actions",
      `action:immediate:${objectSegment}:confirm`,
      `Confirm decision scope for ${strategy}`,
      "War Room Lead",
      "critical",
      immediateStatus
    ),
    buildActionItem(
      "immediate_actions",
      `action:immediate:${objectSegment}:align`,
      `Align stakeholders on ${objectLabel} commitment path`,
      "Executive Sponsor",
      "high",
      immediateStatus === "active" ? "active" : "pending"
    ),
  ];

  const nearTermItems: WarRoomActionItem[] = [
    buildActionItem(
      "near_term_actions",
      `action:near_term:${objectSegment}:owners`,
      `Assign cross-functional owners for ${strategy}`,
      "Operations Lead",
      "high",
      "pending"
    ),
    buildActionItem(
      "near_term_actions",
      `action:near_term:${objectSegment}:milestones`,
      `Define near-term milestones for ${objectLabel}`,
      "Program Manager",
      "medium",
      "pending"
    ),
  ];

  const longTermItems: WarRoomActionItem[] = [
    buildActionItem(
      "long_term_actions",
      `action:long_term:${objectSegment}:track`,
      `Track ${strategy} outcome against commitment baseline`,
      "Strategy Office",
      "medium",
      "pending"
    ),
    buildActionItem(
      "long_term_actions",
      `action:long_term:${objectSegment}:close`,
      `Prepare closure criteria for ${objectLabel} decision`,
      "War Room Lead",
      "low",
      "pending"
    ),
  ];

  const sectionItems: Readonly<Record<WarRoomActionPlanSectionId, readonly WarRoomActionItem[]>> =
    Object.freeze({
      immediate_actions: Object.freeze(immediateItems),
      near_term_actions: Object.freeze(nearTermItems),
      long_term_actions: Object.freeze(longTermItems),
    });

  return Object.freeze({
    sections: Object.freeze(
      WAR_ROOM_ACTION_PLAN_SECTION_ORDER.map((id) =>
        Object.freeze({
          id,
          label: WAR_ROOM_ACTION_PLAN_SECTION_LABELS[id],
          items: sectionItems[id],
        })
      )
    ),
    executionPlanningOwned: true,
  });
}

export function buildWarRoomActionPlanSignature(layer: WarRoomActionPlanLayer): string {
  return JSON.stringify(layer);
}

export function buildWarRoomActionPlanSurface(
  layer: WarRoomActionPlanLayer
): WarRoomActionPlanSurface {
  return Object.freeze({
    purpose: WAR_ROOM_ACTION_PLAN_PURPOSE,
    sections: layer.sections,
    dashboardContext: "war_room",
    executionPlanningOwned: true,
  });
}

export function countWarRoomActionPlanItems(layer: WarRoomActionPlanLayer): number {
  return layer.sections.reduce((total, section) => total + section.items.length, 0);
}

export function buildWarRoomActionPlanCardSnapshot(
  layer: WarRoomActionPlanLayer
): WarRoomFieldSnapshot {
  const itemCount = countWarRoomActionPlanItems(layer);

  return Object.freeze({
    headline:
      itemCount > 0
        ? `Action Plan Panel active (${itemCount} items)`
        : "Action plan awaiting strategy",
    detail:
      itemCount > 0
        ? `${WAR_ROOM_ACTION_PLAN_TAG} ${WAR_ROOM_ACTION_PLAN_PURPOSE} Immediate, Near-Term, and Long-Term execution planning owned by War Room — no scenario regeneration.`
        : `${WAR_ROOM_ACTION_PLAN_TAG} Select a strategy or accept a scenario handoff to populate execution actions.`,
  });
}
