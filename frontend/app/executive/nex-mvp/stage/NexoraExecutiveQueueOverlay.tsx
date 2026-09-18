"use client";

import { useState } from "react";

import { composeNmiAttentionItems } from "@/app/lib/nmi/nmiAttentionCompose.ts";
import { NMI_NAVIGATION_SECTIONS } from "@/app/lib/nmi/nmiManagementNavigationContract.ts";
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

export type NexoraExecutiveQueueOverlayMapNode = {
  readonly section: (typeof NMI_NAVIGATION_SECTIONS)[number];
  readonly nodeId: string;
  readonly title: string;
};

type Props = {
  readonly entries: readonly NexoraExecutiveQueueOverlayEntry[];
  readonly onSelectCategory: (
    category: NexoraExecutiveQueueOverlayCategory,
  ) => void;
  readonly collectionHeaderLabel?: string | null;
  readonly projectionAnchorId?: string | null;
  readonly mapNodes?: readonly NexoraExecutiveQueueOverlayMapNode[];
  readonly onSelectCanonicalId?: (canonicalId: string) => void;
};

const NAV_SECTION_LABELS: Readonly<Record<(typeof NMI_NAVIGATION_SECTIONS)[number], string>> =
  Object.freeze({
    CONTEXT: "Business / Project",
    GOALS: "Goals",
    OPERATIONS: "Operations",
    KPI_DATA: "KPI & Data",
    PROBLEMS_RISKS: "Problems & Risks",
    VARIABLES: "Variables / Drivers",
    SCENARIOS: "Scenarios",
    DECISIONS: "Decisions",
    EXECUTIONS: "Executions",
    OUTCOMES_LEARNING: "Outcomes / Learning",
  });

/**
 * STAGE-PROD:1/2 Queue evolved as NMI:5 Attention + NMI:6 Stage projection handoff.
 * Queue entries remain STAGE-PROD:1 presentation controls — never semantic Objects.
 */
export function NexoraExecutiveQueueOverlay({
  entries,
  onSelectCategory,
  collectionHeaderLabel = null,
  projectionAnchorId = null,
  mapNodes = [],
  onSelectCanonicalId,
}: Props) {
  const [mode, setMode] = useState<"attention" | "map">("attention");
  if (entries.length === 0) {
    return null;
  }

  const attentionCount = composeNmiAttentionItems({
    queueEntries: entries.map((entry) => ({
      category: entry.category,
      count: entry.count,
      objectIds: entry.objectIds,
    })),
  }).length;
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
        data-nmi="6"
        data-nmi-live="8"
        data-nmi-mode={mode}
      data-nmi-projection-anchor={projectionAnchorId ?? undefined}
      data-queue-is-semantic-object="false"
      data-core-int4="reader"
      data-queue-compact="true"
      data-collection-header={collectionHeaderLabel ?? undefined}
      aria-label="Executive Queue"
      style={{
        position: "absolute",
        right: "0.85rem",
        top: "42%",
        transform: "translateY(-50%)",
        zIndex: 8,
        width: collectionActive ? "9.25rem" : "8.15rem",
        maxWidth: "18%",
        minWidth: "7.25rem",
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
          <span>NMI</span>
          <span
            data-testid="nexora-executive-queue-summary-count"
            data-nmi-attention-count={String(attentionCount)}
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
      <div
        data-testid="nmi-navigation-modes"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.08rem",
          marginBottom: "0.18rem",
        }}
      >
        <button
          type="button"
          data-testid="nmi-mode-attention"
          aria-pressed={mode === "attention"}
          onClick={() => setMode("attention")}
          style={{
            border: "none",
            background: mode === "attention" ? "rgba(56, 120, 180, 0.18)" : "transparent",
            color: cockpit.textSoft,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "0.62rem",
            letterSpacing: "0.04em",
            padding: "0.18rem 0.2rem",
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Attention</span>
          <span data-testid="nmi-attention-count">{attentionCount}</span>
        </button>
        <button
          type="button"
          data-testid="nmi-mode-map"
          aria-pressed={mode === "map"}
          onClick={() => setMode("map")}
          style={{
            border: "none",
            background: mode === "map" ? "rgba(56, 120, 180, 0.18)" : "transparent",
            color: cockpit.textSoft,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "0.62rem",
            letterSpacing: "0.04em",
            padding: "0.18rem 0.2rem",
            textAlign: "left",
          }}
        >
          Management Map
        </button>
      </div>
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
        data-testid="nmi-map-section-list"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: mode === "map" ? "flex" : "none",
          flexDirection: "column",
          gap: "0.08rem",
        }}
      >
        {NMI_NAVIGATION_SECTIONS.map((section) => {
          const nodes = mapNodes.filter((item) => item.section === section);
          return (
          <li key={section}>
            <div
              data-testid={`nmi-map-section-${section}`}
              data-nmi-section={section}
              data-nmi-section-count={String(nodes.length)}
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.03em",
                color: cockpit.textSoft,
                padding: "0.16rem 0.2rem",
              }}
            >
              {NAV_SECTION_LABELS[section]}
              <span data-testid={`nmi-map-section-count-${section}`}> {nodes.length}</span>
            </div>
            {nodes.map((node) => (
              <button
                key={node.nodeId}
                type="button"
                data-testid={`nmi-map-node-${node.nodeId}`}
                data-nmi-map-node={node.nodeId}
                onClick={() => onSelectCanonicalId?.(node.nodeId)}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  color: cockpit.textSoft,
                  cursor: onSelectCanonicalId ? "pointer" : "default",
                  fontFamily: "inherit",
                  fontSize: "0.58rem",
                  letterSpacing: "0.02em",
                  padding: "0.08rem 0.2rem 0.16rem",
                  textAlign: "left",
                }}
              >
                {node.title}
              </button>
            ))}
          </li>
          );
        })}
      </ul>
      <ul
        data-testid="nexora-executive-queue-list"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: mode === "attention" ? "flex" : "none",
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
