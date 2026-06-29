/**
 * APP-8:1 — Decision Journal Platform foundation.
 */

import {
  DECISION_JOURNAL_CONFIDENCE_KEYS,
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_SOURCE_KEYS,
  DECISION_JOURNAL_STATUS_KEYS,
} from "./decisionJournalConstants.ts";
import {
  getDecisionJournalRegistrySnapshot,
  listDecisionJournalIds,
  seedDefaultDecisionJournalRegistry,
} from "./decisionJournalRegistry.ts";
import type { DecisionJournalPlatformResult, DecisionJournalPlatformState } from "./decisionJournalTypes.ts";

export const DECISION_JOURNAL_FOUNDATION_VERSION = "APP-8/1" as const;
export const DECISION_JOURNAL_FOUNDATION_OWNER = "decision-journal-platform-foundation" as const;

export const DECISION_JOURNAL_FOUNDATION_TAGS = Object.freeze([
  "[APP8_1]",
  "[DECISION_JOURNAL_FOUNDATION]",
  "[METADATA_ONLY]",
  "[NO_VISUALIZATION]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): DecisionJournalPlatformResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

export function resetDecisionJournalFoundationForTests(): void {
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isDecisionJournalReady(): boolean {
  return platformInitialized;
}

export function isDecisionJournalPlatformInitialized(): boolean {
  return platformInitialized;
}

export function getDecisionJournalPlatformState(
  timestamp: string = new Date(0).toISOString()
): DecisionJournalPlatformState {
  const snapshot = getDecisionJournalRegistrySnapshot();
  return Object.freeze({
    platformId: "decision-journal-platform",
    foundationVersion: DECISION_JOURNAL_FOUNDATION_VERSION,
    contractVersion: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
    initialized: platformInitialized,
    journalCount: snapshot.journalCount,
    registeredJournalIds: listDecisionJournalIds(),
    supportedStatuses: DECISION_JOURNAL_STATUS_KEYS,
    supportedSources: DECISION_JOURNAL_SOURCE_KEYS,
    supportedConfidenceLevels: DECISION_JOURNAL_CONFIDENCE_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function getDecisionJournal(
  timestamp: string = new Date(0).toISOString()
): DecisionJournalPlatformState {
  return getDecisionJournalPlatformState(timestamp);
}

export function createDecisionJournalFoundation(
  timestamp: string = new Date(0).toISOString()
): DecisionJournalPlatformResult<DecisionJournalPlatformState> {
  seedDefaultDecisionJournalRegistry();
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Decision Journal platform foundation created.", getDecisionJournalPlatformState(timestamp));
}

export function createDecisionJournal(
  timestamp: string = new Date(0).toISOString()
): DecisionJournalPlatformResult<DecisionJournalPlatformState> {
  return createDecisionJournalFoundation(timestamp);
}

export function getDecisionJournalFoundationVersionMetadata(): Readonly<{
  foundationVersion: typeof DECISION_JOURNAL_FOUNDATION_VERSION;
  contractVersion: typeof DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION;
  owner: typeof DECISION_JOURNAL_FOUNDATION_OWNER;
}> {
  return Object.freeze({
    foundationVersion: DECISION_JOURNAL_FOUNDATION_VERSION,
    contractVersion: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
    owner: DECISION_JOURNAL_FOUNDATION_OWNER,
  });
}

export const DecisionJournalFoundation = Object.freeze({
  createDecisionJournal,
  createDecisionJournalFoundation,
  getDecisionJournal,
  getDecisionJournalPlatformState,
  isDecisionJournalReady,
  isDecisionJournalPlatformInitialized,
  getDecisionJournalFoundationVersionMetadata,
  resetDecisionJournalFoundationForTests,
  version: DECISION_JOURNAL_FOUNDATION_VERSION,
  tags: DECISION_JOURNAL_FOUNDATION_TAGS,
});
