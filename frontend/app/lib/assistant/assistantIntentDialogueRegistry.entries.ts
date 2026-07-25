/** ASSISTANT-3:2 — Canonical immutable registry entries. */
import type { AssistantIntentDialogueRegistryEntry } from "./assistantIntentDialogueRegistry.types.ts";

const register = (
  category: string,
  names: readonly string[],
): readonly AssistantIntentDialogueRegistryEntry[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-3:2/${category}/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Canonical ${category} metadata for ${name}.`,
    category,
    version: "1.0.0",
    lifecycle: "Active",
    status: "Registered",
    tags: Object.freeze([
      "assistant",
      "intent-dialogue",
      category.toLowerCase(),
    ]),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AssistantIntentDialogueExecutiveIntentTypeEntries = register(
  "ExecutiveIntentType",
  [
    "Question",
    "Request",
    "Analysis",
    "Decision",
    "Planning",
    "Comparison",
    "Investigation",
    "Review",
    "Guidance",
    "Monitoring",
    "Explanation",
    "Unknown",
  ],
);

export const AssistantIntentDialogueDialogueTypeEntries = register(
  "DialogueType",
  [
    "Discovery Dialogue",
    "Clarification Dialogue",
    "Guidance Dialogue",
    "Analysis Dialogue",
    "Decision Dialogue",
    "Review Dialogue",
    "Planning Dialogue",
    "Monitoring Dialogue",
    "Follow-up Dialogue",
    "Closing Dialogue",
  ],
);

export const AssistantIntentDialogueDialogueStateEntries = register(
  "DialogueState",
  [
    "Initialized",
    "Active",
    "Clarifying",
    "Waiting",
    "Processing",
    "Reviewing",
    "Confirmed",
    "Completed",
    "Suspended",
    "Archived",
  ],
);

export const AssistantIntentDialogueTurnTypeEntries = register(
  "DialogueTurnType",
  [
    "User Message",
    "Assistant Response",
    "Clarification",
    "Recommendation",
    "Confirmation",
    "Summary",
    "Question",
    "Instruction",
    "Notification",
    "System Message",
  ],
);

export const AssistantIntentDialoguePriorityEntries = register(
  "ExecutiveIntentPriority",
  ["Critical", "High", "Normal", "Low"],
);

export const AssistantIntentDialogueOutcomeEntries = register(
  "ExecutiveIntentOutcome",
  [
    "Identified",
    "Clarified",
    "Ambiguous",
    "Deferred",
    "Rejected",
    "Accepted",
    "Completed",
    "Escalated",
  ],
);

export const AssistantIntentDialogueClarificationTypeEntries = register(
  "ClarificationType",
  [
    "Missing Information",
    "Ambiguous Intent",
    "Multiple Intent",
    "Context Required",
    "Confirmation Required",
    "Scope Required",
    "Priority Required",
    "Executive Approval Required",
  ],
);

export const AssistantIntentDialoguePolicyEntries = register(
  "DialoguePolicy",
  [
    "Metadata Only",
    "Immutable Registry",
    "Canonical Identity",
    "Version Controlled",
    "Freeze Compatible",
    "Public Index Compatible",
  ],
);

export const AssistantIntentDialogueLifecycleStateEntries = register(
  "DialogueLifecycleState",
  [
    "Declared",
    "Registered",
    "Modelled",
    "Validated",
    "Published",
    "Certified",
    "Frozen",
    "Released",
  ],
);

export const AssistantIntentDialogueTagEntries = register("DialogueTag", [
  "Executive",
  "Intent",
  "Dialogue",
  "Clarification",
  "Conversation",
  "Context",
  "Planning",
  "Decision",
]);

export const AssistantIntentDialogueRegistryEntries = Object.freeze([
  ...AssistantIntentDialogueExecutiveIntentTypeEntries,
  ...AssistantIntentDialogueDialogueTypeEntries,
  ...AssistantIntentDialogueDialogueStateEntries,
  ...AssistantIntentDialogueTurnTypeEntries,
  ...AssistantIntentDialoguePriorityEntries,
  ...AssistantIntentDialogueOutcomeEntries,
  ...AssistantIntentDialogueClarificationTypeEntries,
  ...AssistantIntentDialoguePolicyEntries,
  ...AssistantIntentDialogueLifecycleStateEntries,
  ...AssistantIntentDialogueTagEntries,
]);
