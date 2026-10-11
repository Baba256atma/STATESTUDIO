"use client";

import type { SceneOrgActivityEntry } from "@/app/lib/scene-org/sceneOrgActivityWorkspaceContract";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly entries: readonly SceneOrgActivityEntry[];
  readonly selectedId: string | null;
  readonly onSelect: (entryId: string, subjectId: string) => void;
  readonly emptyLabel?: string;
  readonly historySubjectId?: string | null;
  readonly historySource?: "canonical-projection";
};

/**
 * Manager Activity — read-only presentation of existing linked flow records.
 */
export function NexoraFlowJournalExplorer({
  entries,
  selectedId,
  onSelect,
  emptyLabel = "No recorded activity is available for the current executive context.",
  historySubjectId = null,
  historySource,
}: Props) {
  return (
    <div
      data-testid="nexora-manager-activity"
      data-nex-mvp="8"
      data-history-source={historySource}
      data-historical-subject={historySubjectId ?? ""}
      aria-label="Manager Activity"
      style={{ padding: "0.75rem" }}
    >
      <p
        style={{
          margin: "0 0 0.65rem",
          fontSize: "0.56rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Recent Activity
      </p>
      {entries.length === 0 ? (
        <p
          data-testid="nexora-manager-activity-empty"
          style={{ margin: 0, fontSize: "0.72rem", color: cockpit.muted }}
        >
          {emptyLabel}
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.45rem",
          }}
        >
          {entries.map((entry) => {
            const selected = entry.id === selectedId;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  data-testid={`nexora-activity-entry-${entry.id}`}
                  data-source-id={entry.sourceId ?? ""}
                  data-fact-type={entry.factType ?? entry.eventType}
                  data-placeable={entry.placeable === true ? "true" : entry.placeable === false ? "false" : undefined}
                  data-projection-key={entry.projectionKey ?? ""}
                  aria-pressed={selected}
                  onClick={() => onSelect(entry.id, entry.canonicalSubjectId)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: `1px solid ${
                      selected ? cockpit.accent : cockpit.border
                    }`,
                    background: selected
                      ? "rgba(56, 120, 180, 0.18)"
                      : cockpit.panelSoft,
                    borderRadius: cockpit.radius.md,
                    padding: "0.55rem 0.65rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: cockpit.text,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.55rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: cockpit.lowMuted,
                    }}
                  >
                    {entry.eventType.replaceAll("-", " ")}
                    {" · "}
                    {entry.timeLabel ??
                      (entry.occurredAt
                        ? new Date(entry.occurredAt).toLocaleDateString()
                        : "Time unknown")}
                  </span>
                  <span
                    style={{
                      display: "block",
                      marginTop: "0.2rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {entry.title}
                  </span>
                  <span
                    style={{
                      display: "block",
                      marginTop: "0.25rem",
                      fontSize: "0.68rem",
                      color: cockpit.textSoft,
                      lineHeight: 1.4,
                    }}
                  >
                    {entry.description}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
