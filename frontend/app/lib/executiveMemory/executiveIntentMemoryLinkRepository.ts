/**
 * APP-4:5 — Executive Intent ↔ Memory link repository.
 */

import { applyExecutiveIntentMemoryLinkUpdate, createExecutiveIntentMemoryLink } from "./executiveIntentMemoryLinkModel.ts";
import { executiveIntentMemoryLinkErrorFromCode } from "./executiveIntentMemoryLinkErrors.ts";
import {
  commitExecutiveIntentMemoryLink,
  getExecutiveIntentMemoryLinkFromRegistry,
  hasExecutiveIntentMemoryLinkInRegistry,
  listExecutiveIntentMemoryLinksFromRegistry,
  restoreExecutiveIntentMemoryLinkSnapshot,
  snapshotExecutiveIntentMemoryLinks,
} from "./executiveIntentMemoryLinkRegistry.ts";
import {
  buildExecutiveIntentMemoryLinkSignature,
  validateExecutiveIntentMemoryLink,
  validateExecutiveIntentMemoryLinkQuery,
} from "./executiveIntentMemoryLinkValidator.ts";
import type {
  CreateExecutiveIntentMemoryLinkInput,
  ExecutiveIntentMemoryLink,
  ExecutiveIntentMemoryLinkId,
  ExecutiveIntentMemoryLinkQuery,
  ExecutiveIntentMemoryLinkResult,
  UpdateExecutiveIntentMemoryLinkInput,
} from "./executiveIntentMemoryLinkTypes.ts";

function createResult<T>(
  success: boolean,
  reason: string,
  data: T | null,
  error: ExecutiveIntentMemoryLinkResult<T>["error"] = null
): ExecutiveIntentMemoryLinkResult<T> {
  return Object.freeze({ success, reason, data, error, readOnly: true as const });
}

function hasDuplicateActiveLink(candidate: ExecutiveIntentMemoryLink): boolean {
  const activeLinks = listExecutiveIntentMemoryLinksFromRegistry({
    intentId: candidate.intentId,
    lifecycle: "active",
  });
  const signature = buildExecutiveIntentMemoryLinkSignature(candidate);
  return activeLinks.some(
    (link) => link.linkId !== candidate.linkId && buildExecutiveIntentMemoryLinkSignature(link) === signature
  );
}

function runTransaction<T>(
  operation: () => ExecutiveIntentMemoryLinkResult<T>
): ExecutiveIntentMemoryLinkResult<T> {
  const snapshot = snapshotExecutiveIntentMemoryLinks();
  const outcome = operation();
  if (!outcome.success) {
    restoreExecutiveIntentMemoryLinkSnapshot(snapshot);
    return createResult(
      false,
      outcome.reason,
      null,
      outcome.error ??
        executiveIntentMemoryLinkErrorFromCode("transactionRollback", "Link transaction rolled back.")
    );
  }
  return outcome;
}

export function createIntentMemoryLink(
  input: CreateExecutiveIntentMemoryLinkInput
): ExecutiveIntentMemoryLinkResult<ExecutiveIntentMemoryLink> {
  return runTransaction(() => {
    const link = createExecutiveIntentMemoryLink(input);
    const validation = validateExecutiveIntentMemoryLink(link);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveIntentMemoryLinkErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    if (hasExecutiveIntentMemoryLinkInRegistry(link.linkId)) {
      return createResult(
        false,
        `Duplicate link id: ${link.linkId}.`,
        null,
        executiveIntentMemoryLinkErrorFromCode("duplicateLink", `Duplicate link id: ${link.linkId}.`, "linkId")
      );
    }
    if (hasDuplicateActiveLink(link)) {
      return createResult(
        false,
        "Duplicate active link signature detected.",
        null,
        executiveIntentMemoryLinkErrorFromCode("duplicateLink", "Duplicate active link signature detected.")
      );
    }
    commitExecutiveIntentMemoryLink(link);
    return createResult(true, "Intent memory link created.", link);
  });
}

export function updateIntentMemoryLink(
  linkId: ExecutiveIntentMemoryLinkId,
  updates: UpdateExecutiveIntentMemoryLinkInput,
  timestamp: string
): ExecutiveIntentMemoryLinkResult<ExecutiveIntentMemoryLink> {
  return runTransaction(() => {
    const existing = getExecutiveIntentMemoryLinkFromRegistry(linkId);
    if (!existing) {
      return createResult(
        false,
        `Link not found: ${linkId}.`,
        null,
        executiveIntentMemoryLinkErrorFromCode("linkNotFound", `Link not found: ${linkId}.`, "linkId")
      );
    }
    if (existing.lifecycle === "archived") {
      return createResult(
        false,
        "Archived links cannot be updated.",
        null,
        executiveIntentMemoryLinkErrorFromCode("invalidLifecycle", "Archived links cannot be updated.", "lifecycle")
      );
    }

    const updated = applyExecutiveIntentMemoryLinkUpdate(existing, updates, timestamp);
    const validation = validateExecutiveIntentMemoryLink(updated);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveIntentMemoryLinkErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    if (hasDuplicateActiveLink(updated)) {
      return createResult(
        false,
        "Duplicate active link signature detected.",
        null,
        executiveIntentMemoryLinkErrorFromCode("duplicateLink", "Duplicate active link signature detected.")
      );
    }
    commitExecutiveIntentMemoryLink(updated);
    return createResult(true, "Intent memory link updated.", updated);
  });
}

export function removeIntentMemoryLink(
  linkId: ExecutiveIntentMemoryLinkId,
  timestamp: string
): ExecutiveIntentMemoryLinkResult<ExecutiveIntentMemoryLink> {
  return archiveIntentMemoryLink(linkId, timestamp);
}

export function archiveIntentMemoryLink(
  linkId: ExecutiveIntentMemoryLinkId,
  timestamp: string
): ExecutiveIntentMemoryLinkResult<ExecutiveIntentMemoryLink> {
  return runTransaction(() => {
    const existing = getExecutiveIntentMemoryLinkFromRegistry(linkId);
    if (!existing) {
      return createResult(
        false,
        `Link not found: ${linkId}.`,
        null,
        executiveIntentMemoryLinkErrorFromCode("linkNotFound", `Link not found: ${linkId}.`, "linkId")
      );
    }
    if (existing.lifecycle === "archived") {
      return createResult(
        false,
        `Link already archived: ${linkId}.`,
        null,
        executiveIntentMemoryLinkErrorFromCode("invalidLifecycle", `Link already archived: ${linkId}.`, "lifecycle")
      );
    }
    const archived = Object.freeze({
      ...existing,
      lifecycle: "archived" as const,
      archivedAt: timestamp,
      updatedAt: timestamp,
      readOnly: true as const,
    });
    commitExecutiveIntentMemoryLink(archived);
    return createResult(true, "Intent memory link archived.", archived);
  });
}

export function restoreIntentMemoryLink(
  linkId: ExecutiveIntentMemoryLinkId,
  timestamp: string
): ExecutiveIntentMemoryLinkResult<ExecutiveIntentMemoryLink> {
  return runTransaction(() => {
    const existing = getExecutiveIntentMemoryLinkFromRegistry(linkId);
    if (!existing) {
      return createResult(
        false,
        `Link not found: ${linkId}.`,
        null,
        executiveIntentMemoryLinkErrorFromCode("linkNotFound", `Link not found: ${linkId}.`, "linkId")
      );
    }
    if (existing.lifecycle === "active") {
      return createResult(
        false,
        `Link is not archived: ${linkId}.`,
        null,
        executiveIntentMemoryLinkErrorFromCode("invalidLifecycle", `Link is not archived: ${linkId}.`, "lifecycle")
      );
    }
    const restored = Object.freeze({
      ...existing,
      lifecycle: "active" as const,
      archivedAt: null,
      updatedAt: timestamp,
      readOnly: true as const,
    });
    const validation = validateExecutiveIntentMemoryLink(restored);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveIntentMemoryLinkErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    if (hasDuplicateActiveLink(restored)) {
      return createResult(
        false,
        "Duplicate active link signature detected.",
        null,
        executiveIntentMemoryLinkErrorFromCode("duplicateLink", "Duplicate active link signature detected.")
      );
    }
    commitExecutiveIntentMemoryLink(restored);
    return createResult(true, "Intent memory link restored.", restored);
  });
}

export function getIntentMemoryLinkById(
  linkId: ExecutiveIntentMemoryLinkId
): ExecutiveIntentMemoryLink | null {
  return getExecutiveIntentMemoryLinkFromRegistry(linkId);
}

export function getIntentMemoryLinks(
  query: ExecutiveIntentMemoryLinkQuery = {}
): readonly ExecutiveIntentMemoryLink[] {
  const validation = validateExecutiveIntentMemoryLinkQuery(query);
  if (!validation.valid) {
    return Object.freeze([]);
  }
  return listExecutiveIntentMemoryLinksFromRegistry(query);
}

export function getIntentMemoryLinksByIntent(
  intentId: string,
  query: ExecutiveIntentMemoryLinkQuery = {}
): readonly ExecutiveIntentMemoryLink[] {
  return getIntentMemoryLinks(Object.freeze({ ...query, intentId }));
}

export function getIntentMemoryLinksByMemory(
  memoryId: string,
  query: ExecutiveIntentMemoryLinkQuery = {}
): readonly ExecutiveIntentMemoryLink[] {
  return getIntentMemoryLinks(Object.freeze({ ...query, memoryId }));
}

export function getIntentMemoryLinksByGoal(
  goalId: string,
  query: ExecutiveIntentMemoryLinkQuery = {}
): readonly ExecutiveIntentMemoryLink[] {
  return getIntentMemoryLinks(Object.freeze({ ...query, goalId }));
}

export function getIntentMemoryLinksByScenario(
  scenarioId: string,
  query: ExecutiveIntentMemoryLinkQuery = {}
): readonly ExecutiveIntentMemoryLink[] {
  return getIntentMemoryLinks(Object.freeze({ ...query, scenarioId }));
}

export function getIntentMemoryLinksByDecision(
  decisionId: string,
  query: ExecutiveIntentMemoryLinkQuery = {}
): readonly ExecutiveIntentMemoryLink[] {
  return getIntentMemoryLinks(Object.freeze({ ...query, decisionId }));
}

export function hasIntentMemoryLink(linkId: ExecutiveIntentMemoryLinkId): boolean {
  return hasExecutiveIntentMemoryLinkInRegistry(linkId);
}

export function validateIntentMemoryLink(
  link: ExecutiveIntentMemoryLink
): ReturnType<typeof validateExecutiveIntentMemoryLink> {
  return validateExecutiveIntentMemoryLink(link);
}

export const ExecutiveIntentMemoryLinkRepository = Object.freeze({
  createIntentMemoryLink,
  updateIntentMemoryLink,
  removeIntentMemoryLink,
  archiveIntentMemoryLink,
  restoreIntentMemoryLink,
  getIntentMemoryLinkById,
  getIntentMemoryLinks,
  getIntentMemoryLinksByIntent,
  getIntentMemoryLinksByMemory,
  getIntentMemoryLinksByGoal,
  getIntentMemoryLinksByScenario,
  getIntentMemoryLinksByDecision,
  hasIntentMemoryLink,
  validateIntentMemoryLink,
});
