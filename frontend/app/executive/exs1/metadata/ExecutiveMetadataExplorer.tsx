"use client";

import type { Exs1ObjectId } from "../exs1Types";
import { ExecutiveMetadataEditor } from "./ExecutiveMetadataEditor";
import { ExecutiveMetadataInspector } from "./ExecutiveMetadataInspector";
import type { KnowledgeSection } from "./ExecutiveMetadataProvider";
import { useExecutiveMetadata } from "./hooks/useExecutiveMetadata";
import { cockpit } from "../shell/executiveCockpitTheme";

const SECTIONS: readonly KnowledgeSection[] = [
  "Objects",
  "Fields",
  "Domains",
  "KPIs",
  "Glossary",
];

/**
 * Knowledge Explorer — Objects, Fields, Domains, KPIs, Glossary.
 */
export function ExecutiveMetadataExplorer() {
  const {
    section,
    setSection,
    query,
    setQuery,
    searchKind,
    setSearchKind,
    hits,
    catalog,
    domains,
    kpis,
    glossary,
    setSelectedFieldId,
    setSelectedObjectId,
    selectedFieldId,
    selectedObjectId,
  } = useExecutiveMetadata();

  return (
    <div
      data-testid="executive-metadata-explorer"
      style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          Executive Knowledge
        </p>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.74rem",
            color: cockpit.textSoft,
          }}
        >
          Semantic layer for objects, fields, domains, KPIs, and glossary.
        </p>
      </div>

      <input
        data-testid="executive-metadata-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search objects, fields, domains, KPIs, synonyms…"
        style={{
          padding: "0.45rem 0.55rem",
          borderRadius: cockpit.radius.sm,
          border: `1px solid ${cockpit.border}`,
          background: cockpit.navy,
          color: cockpit.text,
          fontSize: "0.76rem",
          fontFamily: "inherit",
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
        {(
          ["All", "Objects", "Fields", "Domains", "KPIs", "Glossary", "Synonyms"] as const
        ).map((kind) => (
          <button
            key={kind}
            type="button"
            data-testid={`metadata-filter-${kind.toLowerCase()}`}
            onClick={() => setSearchKind(kind)}
            style={chip(searchKind === kind)}
          >
            {kind}
          </button>
        ))}
      </div>

      <div
        role="tablist"
        style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}
      >
        {SECTIONS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={section === item}
            data-testid={`knowledge-section-${item.toLowerCase()}`}
            onClick={() => setSection(item)}
            style={chip(section === item)}
          >
            {item}
          </button>
        ))}
      </div>

      {query.trim() ? (
        <div
          data-testid="executive-metadata-hits"
          style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
        >
          {hits.map((hit) => (
            <button
              key={hit.id}
              type="button"
              data-testid={`metadata-hit-${hit.id}`}
              onClick={() => {
                if (hit.objectId) setSelectedObjectId(hit.objectId);
                if (hit.fieldId) setSelectedFieldId(hit.fieldId);
              }}
              style={{
                textAlign: "left",
                padding: "0.5rem 0.6rem",
                borderRadius: cockpit.radius.sm,
                border: `1px solid ${cockpit.border}`,
                background: cockpit.panelSoft,
                color: cockpit.text,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <div style={{ fontSize: "0.55rem", color: cockpit.accent }}>
                {hit.kind}
              </div>
              <div style={{ fontSize: "0.78rem", fontWeight: 550 }}>
                {hit.title}
              </div>
              <div style={{ fontSize: "0.7rem", color: cockpit.textSoft }}>
                {hit.subtitle}
              </div>
            </button>
          ))}
          {hits.length === 0 ? (
            <p style={{ margin: 0, color: cockpit.muted, fontSize: "0.74rem" }}>
              No knowledge matches.
            </p>
          ) : null}
        </div>
      ) : (
        <div
          data-testid={`knowledge-panel-${section.toLowerCase()}`}
          style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
        >
          {section === "Objects"
            ? catalog.objects.map((object) => (
                <ListRow
                  key={object.objectId}
                  testId={`knowledge-object-${object.objectId}`}
                  title={object.displayName}
                  subtitle={object.description}
                  active={selectedObjectId === object.objectId}
                  onClick={() =>
                    setSelectedObjectId(object.objectId as Exs1ObjectId)
                  }
                />
              ))
            : null}
          {section === "Fields"
            ? catalog.fields.map((field) => (
                <ListRow
                  key={field.fieldId}
                  testId={`knowledge-field-${field.fieldId}`}
                  title={field.displayName}
                  subtitle={`${field.technicalName} · ${field.businessMeaning}`}
                  active={selectedFieldId === field.fieldId}
                  onClick={() => setSelectedFieldId(field.fieldId)}
                />
              ))
            : null}
          {section === "Domains"
            ? domains.map((domain) => (
                <ListRow
                  key={domain.id}
                  testId={`knowledge-domain-${domain.id}`}
                  title={domain.name}
                  subtitle={domain.description}
                />
              ))
            : null}
          {section === "KPIs"
            ? kpis.map((kpi) => (
                <ListRow
                  key={kpi.kpiId}
                  testId={`knowledge-kpi-${kpi.kpiId}`}
                  title={kpi.name}
                  subtitle={kpi.description}
                />
              ))
            : null}
          {section === "Glossary"
            ? glossary.map((entry) => (
                <ListRow
                  key={entry.termId}
                  testId={`knowledge-term-${entry.termId}`}
                  title={entry.term}
                  subtitle={entry.definition}
                />
              ))
            : null}
        </div>
      )}

      <ExecutiveMetadataInspector />
      {section === "Fields" ? <ExecutiveMetadataEditor /> : null}
    </div>
  );
}

function ListRow({
  title,
  subtitle,
  onClick,
  active,
  testId,
}: {
  readonly title: string;
  readonly subtitle: string;
  readonly onClick?: () => void;
  readonly active?: boolean;
  readonly testId: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: "0.5rem 0.6rem",
        borderRadius: cockpit.radius.sm,
        border: active
          ? `1px solid ${cockpit.accent}`
          : `1px solid ${cockpit.border}`,
        background: active ? cockpit.accentSoft : cockpit.panelSoft,
        color: cockpit.text,
        cursor: onClick ? "pointer" : "default",
        fontFamily: "inherit",
      }}
    >
      <div style={{ fontSize: "0.78rem", fontWeight: 550 }}>{title}</div>
      <div style={{ fontSize: "0.7rem", color: cockpit.textSoft }}>{subtitle}</div>
    </button>
  );
}

function chip(active: boolean) {
  return {
    padding: "0.3rem 0.5rem",
    borderRadius: cockpit.radius.sm,
    border: active
      ? `1px solid ${cockpit.accent}`
      : `1px solid ${cockpit.border}`,
    background: active ? cockpit.accentSoft : "transparent",
    color: active ? cockpit.accent : cockpit.muted,
    fontSize: "0.62rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    fontFamily: "inherit",
  };
}
