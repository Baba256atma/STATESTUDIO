"use client";

import type { NexoraMVPJournalEntryView } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly entries: readonly NexoraMVPJournalEntryView[];
  readonly selectedId: string | null;
  readonly onSelect: (entryId: string, subjectId: string) => void;
};

/**
 * Journal explorer list — Pack presentation, not a second persistence store.
 */
export function NexoraFlowJournalExplorer({
  entries,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div
      data-testid="nexora-flow-journal"
      data-nex-mvp="8"
      aria-label="Executive Journal"
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
        Journal Packs
      </p>
      {entries.length === 0 ? (
        <p
          data-testid="nexora-flow-journal-empty"
          style={{ margin: 0, fontSize: "0.72rem", color: cockpit.muted }}
        >
          No journal packs recorded for the current executive context.
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
                  data-testid={`nexora-journal-entry-${entry.id}`}
                  aria-pressed={selected}
                  onClick={() => onSelect(entry.id, entry.subjectId)}
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
                    {entry.packKind}
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
                    {entry.summary}
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
