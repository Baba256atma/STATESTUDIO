"use client";

import { getDomain } from "./ExecutiveDomainRegistry";
import { EXECUTIVE_UNITS } from "./ExecutiveObjectMetadata";
import { useExecutiveMetadata } from "./hooks/useExecutiveMetadata";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * Metadata Inspector — resolves Runtime objectId / field into business meaning.
 */
export function ExecutiveMetadataInspector() {
  const {
    selectedObjectId,
    selectedFieldId,
    getObject,
    getField,
    relations,
  } = useExecutiveMetadata();

  const object = selectedObjectId ? getObject(selectedObjectId) : null;
  const field = selectedFieldId ? getField(selectedFieldId) : null;
  const related = relations.filter(
    (r) =>
      r.fromObjectId === selectedObjectId || r.toObjectId === selectedObjectId,
  );

  return (
    <div
      data-testid="executive-metadata-inspector"
      style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
    >
      {object ? (
        <section
          data-testid="metadata-inspector-object"
          style={card}
        >
          <p style={eyebrow}>Executive Object</p>
          <strong style={{ color: cockpit.accent, fontSize: "0.85rem" }}>
            {object.displayName}
          </strong>
          <p style={body}>{object.description}</p>
          <p style={body}>
            Domain ·{" "}
            {object.domainIds
              .map((id) => getDomain(id)?.name ?? id)
              .join(", ")}
          </p>
          <p style={body}>
            Category · {object.category} · Owner · {object.owner}
          </p>
          <p style={body}>
            Unit ·{" "}
            {object.unitId ? EXECUTIVE_UNITS[object.unitId].label : "—"}
          </p>
          <p style={body}>Synonyms · {object.synonyms.join(", ")}</p>
          {related.length ? (
            <div style={{ marginTop: "0.35rem" }}>
              <p style={eyebrow}>Relationships</p>
              {related.map((r) => (
                <p key={r.relationId} style={body}>
                  {r.label}
                </p>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {field ? (
        <section data-testid="metadata-inspector-field" style={card}>
          <p style={eyebrow}>Field</p>
          <strong style={{ color: cockpit.accent, fontSize: "0.85rem" }}>
            {field.displayName}
          </strong>
          <p style={body}>
            Technical · {field.technicalName} · {field.dataType}
          </p>
          <p style={body}>{field.businessMeaning}</p>
          <p style={body}>
            Mapped Object · {field.mappedObjectId ?? "Unmapped"}
          </p>
          <p style={body}>
            Domain · {field.domainId ? getDomain(field.domainId)?.name : "—"}
          </p>
        </section>
      ) : null}
    </div>
  );
}

const card = {
  padding: "0.65rem 0.7rem",
  borderRadius: cockpit.radius.md,
  border: `1px solid ${cockpit.border}`,
  background: cockpit.panelSoft,
} as const;

const eyebrow = {
  margin: 0,
  fontSize: "0.55rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: cockpit.lowMuted,
};

const body = {
  margin: "0.25rem 0 0",
  fontSize: "0.74rem",
  lineHeight: 1.45,
  color: cockpit.textSoft,
};
