/** CC:12 structured response first; CC:5 text is presentation only. */
import type { NexoraConversationalMessage } from "./conversationalExperience.ts";
import type { NexoraExecutionFollowUpComparison } from "./executiveFollowUpChange.ts";
import type { NexoraExecutionFollowUpSnapshot } from "./executiveFollowUpSnapshot.ts";

export type NexoraExecutiveFollowUpAdvisorResponse = { readonly summary: string; readonly changes: readonly string[]; readonly attention: string | null; readonly uncertainty: readonly string[] };
export function buildExecutiveFollowUpAdvisorResponse(input: { readonly title: string; readonly current: NexoraExecutionFollowUpSnapshot; readonly comparison?: NexoraExecutionFollowUpComparison | null; readonly noHistory?: boolean }): NexoraExecutiveFollowUpAdvisorResponse {
  if (input.noHistory) return Object.freeze({ summary: `I don't have an earlier execution snapshot to compare with for ${input.title} yet.`, changes: Object.freeze([]), attention: null, uncertainty: Object.freeze([]) });
  const comparison = input.comparison;
  if (!comparison || comparison.changes.length === 0) return Object.freeze({ summary: "No material execution change is recorded since the last review.", changes: Object.freeze([]), attention: null, uncertainty: Object.freeze(input.current.progress == null ? ["Progress remains unavailable."] : []) });
  const lines = comparison.changes.map((change) => {
    if (change.kind === "became-blocked") return `${input.title} is now blocked.`;
    if (change.kind === "became-at-risk") return `${input.title} is now at risk.`;
    if (change.kind === "resumed") return `${input.title} has resumed.`;
    if (change.kind === "completed") return `${input.title} is now completed.`;
    if (change.kind === "blocker-added") return `${change.addedIds?.join(", ")} ${change.addedIds?.length === 1 ? "is" : "are"} now recorded as a blocker.`;
    if (change.kind === "blocker-removed") return `${change.removedIds?.join(", ")} is no longer recorded as a blocker.`;
    if (change.kind === "risk-added") return `New recorded risk: ${change.addedIds?.join(", ")}.`;
    if (change.kind === "risk-removed") return `Risk no longer recorded: ${change.removedIds?.join(", ")}.`;
    if (change.kind === "progress-changed") return `Progress ${comparison.progressDelta! >= 0 ? "increased" : "decreased"} by ${Math.abs(comparison.progressDelta!)} percentage points to ${change.current}%.`;
    if (change.kind === "progress-became-available") return `Trusted progress is now available at ${change.current}%.`;
    if (change.kind === "owner-changed") return `Recorded ownership changed${change.addedIds?.length ? ` to ${change.addedIds.join(", ")}` : ""}.`;
    if (change.kind === "milestone-changed") return "The recorded milestone set changed.";
    if (change.kind === "deadline-changed") return `The recorded deadline moved from ${change.previous ?? "unavailable"} to ${change.current ?? "unavailable"}.`;
    if (change.kind === "status-changed") return `Status changed from ${change.previous} to ${change.current}.`;
    return "";
  }).filter(Boolean);
  return Object.freeze({ summary: lines[0] ?? "Execution changed.", changes: Object.freeze(lines.slice(1)), attention: comparison.attention === "normal" ? null : comparison.attention === "critical" ? "Critical executive attention is warranted." : "Executive attention is warranted.", uncertainty: Object.freeze(input.current.progress == null ? ["Progress remains unavailable."] : []) });
}
export function renderExecutiveFollowUpAdvisorText(response: NexoraExecutiveFollowUpAdvisorResponse): string { return [response.summary, ...response.changes, response.attention, ...response.uncertainty].filter(Boolean).join(" "); }
export function toExecutiveFollowUpConversationalMessage(response: NexoraExecutiveFollowUpAdvisorResponse, id: string): NexoraConversationalMessage { return Object.freeze({ id, role: "nexora", text: renderExecutiveFollowUpAdvisorText(response), status: "applied" }); }
