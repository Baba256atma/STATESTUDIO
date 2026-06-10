/**
 * Phase 6:6 — Board Intelligence integration contract (preparatory only).
 * Institutional Alignment → Board Intelligence feed boundary.
 * Board intelligence is NOT implemented in this phase.
 */

import type { InstitutionalAlignmentSnapshot } from "./institutionalAlignmentContract.ts";
import { CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER } from "./institutionalAlignmentContract.ts";

export const BOARD_INTELLIGENCE_CONTRACT_VERSION = "6.6.0";

export const CANONICAL_BOARD_INTELLIGENCE_OWNER = "boardIntelligenceRuntime";

export type BoardIntelligenceFeedStatus = "pending_implementation";

export type InstitutionalAlignmentBoardFeed = Readonly<{
  source: "institutional_alignment";
  owner: typeof CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER;
  targetOwner: typeof CANONICAL_BOARD_INTELLIGENCE_OWNER;
  status: BoardIntelligenceFeedStatus;
  institutionalHealth: InstitutionalAlignmentSnapshot["institutionalHealth"]["level"];
  institutionalAttention: InstitutionalAlignmentSnapshot["institutionalAttention"]["level"];
  summary: string;
}>;

export function buildInstitutionalAlignmentBoardFeed(
  snapshot: InstitutionalAlignmentSnapshot
): InstitutionalAlignmentBoardFeed {
  return Object.freeze({
    source: "institutional_alignment",
    owner: CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
    targetOwner: CANONICAL_BOARD_INTELLIGENCE_OWNER,
    status: "pending_implementation",
    institutionalHealth: snapshot.institutionalHealth.level,
    institutionalAttention: snapshot.institutionalAttention.level,
    summary: "Board intelligence feed contract reserved — institutional alignment remains canonical owner",
  });
}
