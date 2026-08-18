"use client";

import type { ExecutiveQueueCategory } from "@/app/lib/spatial-presentation/executiveStageProductivityContract";
import { EXECUTIVE_QUEUE_CATEGORY_LABELS } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation";
import { EXECUTIVE_CHANGE_QUEUE_LABEL } from "@/app/lib/spatial-presentation/executiveStageChangeIntelligence";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

export type NexoraExecutiveQueueOverlayCategory =
  | ExecutiveQueueCategory
  | "changes-since-visit";

export type NexoraExecutiveQueueOverlayEntry = {
  readonly category: NexoraExecutiveQueueOverlayCategory;
  readonly count: number;
  readonly objectIds: readonly string[];
  readonly isSemanticObject: false;
  readonly isActive: boolean;
  readonly collectionKind?: "object-kind" | "productivity";
  readonly label?: string;
};

type Props = {
  readonly entries: readonly NexoraExecutiveQueueOverlayEntry[];
  readonly onSelectCategory: (
    category: NexoraExecutiveQueueOverlayCategory,
  ) => void;
  readonly collectionHeaderLabel?: string | null;
};

/**
 * STAGE-PROD:1/2 — compact Executive Queue in the hard-reserved right Stage region.
 * Presentation controls only — never semantic Objects.
 */
export function NexoraExecutiveQueueOverlay({
  entries,
  onSelectCategory,
  collectionHeaderLabel = null,
}: Props) {
  if (entries.length === 0) {
    return null;
  }

  const attentionCount = entries.reduce((sum, entry) => sum + entry.count, 0);
  const needsAttention = entries.some(
    (entry) =>
      entry.count > 0 &&
      (entry.category === "problem" ||
        entry.category === "decision" ||
        entry.category === "changes-since-visit"),
  );
  const collectionActive = collectionHeaderLabel != null;

  return (
    <aside
      data-testid="nexora-executive-queue"
      data-stage-prod="2"
      data-queue-is-semantic-object="false"
      data-queue-compact="true"
      data-collection-header={collectionHeaderLabel ?? undefined}
      aria-label="Executive Queue"
      style={{
        position: "absolute",
        right: "0.85rem",
        top: "42%",
        transform: "translateY(-50%)",
        zIndex: 8,
        width: collectionActive ? "8.75rem" : "7.25rem",
        maxWidth: "16%",
        minWidth: "6.5rem",
        pointerEvents: "auto",
        color: cockpit.textSoft,
        fontFamily: "inherit",
      }}
    >
      <details
        data-testid="nexora-executive-queue-disclosure"
        open={collectionActive || undefined}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.22rem",
          padding: "0.35rem 0.45rem 0.4rem",
          borderLeft: `1px solid ${cockpit.border}`,
          background: "rgba(6, 10, 18, 0.42)",
          backdropFilter: "blur(6px)",
        }}
      >
        <summary
          data-testid="nexora-executive-queue-title"
          style={{
            listStyle: "none",
            cursor: "pointer",
            fontSize: "0.58rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: needsAttention ? cockpit.warning : cockpit.muted,
            fontWeight: 600,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "0.35rem",
          }}
        >
          <span>Queue</span>
          <span
            data-testid="nexora-executive-queue-summary-count"
            style={{
              fontVariantNumeric: "tabular-nums",
              color: cockpit.textSoft,
              fontSize: "0.62rem",
            }}
          >
            {attentionCount}
          </span>
        </summary>
      <div
        aria-hidden
        style={{
          height: 1,
          background: cockpit.border,
          opacity: 0.85,
          marginBottom: "0.1rem",
        }}
      />
      {collectionHeaderLabel != null ? (
        <div
          data-testid="nexora-executive-queue-collection-header"
          data-is-semantic-object="false"
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.06em",
            color: cockpit.accent,
            marginBottom: "0.15rem",
          }}
        >
          {collectionHeaderLabel}
        </div>
      ) : null}
      <ul
        data-testid="nexora-executive-queue-list"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.12rem",
        }}
      >
        {entries.map((entry) => {
          const isProductivity = entry.collectionKind === "productivity";
          const label =
            entry.label ??
            EXECUTIVE_QUEUE_CATEGORY_LABELS[entry.category] ??
            (entry.category === "changes-since-visit"
              ? EXECUTIVE_CHANGE_QUEUE_LABEL
              : entry.category);
          return (
            <li key={entry.category}>
              {isProductivity ? (
                <div
                  aria-hidden
                  style={{
                    height: 1,
                    background: cockpit.border,
                    opacity: 0.55,
                    margin: "0.25rem 0 0.2rem",
                  }}
                />
              ) : null}
              <button
                type="button"
                data-testid={`nexora-executive-queue-row-${entry.category}`}
                data-queue-category={entry.category}
                data-queue-count={String(entry.count)}
                data-queue-active={entry.isActive ? "true" : "false"}
                data-queue-collection-kind={
                  entry.collectionKind ?? "object-kind"
                }
                data-is-semantic-object="false"
                aria-pressed={entry.isActive}
                aria-label={`${label}, ${entry.count}`}
                onClick={() => onSelectCategory(entry.category)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  border: "none",
                  borderRadius: "0.2rem",
                  background: entry.isActive
                    ? "rgba(56, 120, 180, 0.22)"
                    : "transparent",
                  boxShadow: entry.isActive
                    ? `inset 2px 0 0 ${cockpit.accent}`
                    : "none",
                  color: cockpit.textSoft,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.68rem",
                  letterSpacing: "0.04em",
                  padding: "0.32rem 0.35rem",
                  textAlign: "left",
                  minHeight: "1.65rem",
                }}
              >
                <span
                  style={{
                    fontWeight: entry.isActive ? 600 : 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
                <span
                  data-testid={`nexora-executive-queue-count-${entry.category}`}
                  style={{
                    color: cockpit.muted,
                    fontSize: "0.62rem",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 500,
                  }}
                >
                  {entry.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      </details>
    </aside>
  );
}
