"use client";

import { useState, useSyncExternalStore } from "react";
import {
  getCsvRealDataImportVersion,
  listCsvRealDataImports,
  subscribeCsvRealDataImports,
} from "@/app/lib/data-reality/csvRealDataImportStore";
import { listManagerDeckDatasetIds } from "@/app/lib/deck/nexoraDeckDatasetReferenceAuthority";
import {
  getDeckDatasetReferenceSnapshot,
  subscribeDeckDatasetReferences,
} from "@/app/lib/deck/nexoraDeckDatasetReferenceRegistry";
import {
  CANONICAL_OBJECT_TYPES,
  canonicalObjectRevision,
  createCanonicalObject,
  getCanonicalObject,
  listDeckCanonicalObjects,
  subscribeCanonicalObjects,
  type CanonicalObjectType,
} from "@/app/lib/scene-org/canonicalObjectRegistry";
import {
  runFencedWorkspaceMutation,
  WORKSPACE_UNAVAILABLE_MESSAGE,
  workspaceAuthorityFailureMessage,
} from "@/app/lib/workspace/workspaceAuthorityFence";
import {
  approveCommittedDatasetEntities,
  approveSourceAssociation,
  previewCommittedDatasetEntities,
  previewSourceAssociation,
  readCommittedDatasetSnapshot,
  type EntityReconciliationPlan,
  type SourceLinkPlan,
} from "@/app/lib/scene-org/canonicalDatasetEntityPipeline";
import { listCanonicalMutations, canonicalMutationJournalStatus } from "@/app/lib/scene-org/canonicalMutationJournal";

type Props = Readonly<{
  workspaceId: string;
  deckId: string;
  onInspect: (canonicalObjectId: string) => void;
}>;

/** Manager creation and approved mapping of a committed Dataset. Preview writes nothing. */
export function NexoraOrganizationalObjectControls({ workspaceId, deckId, onInspect }: Props) {
  const revision = useSyncExternalStore(subscribeCanonicalObjects, canonicalObjectRevision, () => 0);
  const datasetVersion = useSyncExternalStore(subscribeCsvRealDataImports, getCsvRealDataImportVersion, () => 0);
  const referenceVersion = useSyncExternalStore(
    subscribeDeckDatasetReferences,
    () => getDeckDatasetReferenceSnapshot().references.length,
    () => 0,
  );
  const objects = listDeckCanonicalObjects(workspaceId, deckId);
  const authorizedDatasetIds = new Set(listManagerDeckDatasetIds(workspaceId, deckId));
  const datasets = listCsvRealDataImports(workspaceId).filter((dataset) => authorizedDatasetIds.has(dataset.sourceContextId));
  void referenceVersion;
  void revision;
  void datasetVersion;
  const [objectType, setObjectType] = useState<CanonicalObjectType>("MACHINE");
  const [displayName, setDisplayName] = useState("");
  const [sourceContextId, setSourceContextId] = useState("");
  const [sourceKeyColumn, setSourceKeyColumn] = useState("");
  const [displayNameColumn, setDisplayNameColumn] = useState("");
  const [attributeColumn, setAttributeColumn] = useState("");
  const [plan, setPlan] = useState<EntityReconciliationPlan | null>(null);
  const [linkObjectId, setLinkObjectId] = useState("");
  const [linkDatasetId, setLinkDatasetId] = useState("");
  const [linkKeyColumn, setLinkKeyColumn] = useState("");
  const [linkSourceKey, setLinkSourceKey] = useState("");
  const [linkPlan, setLinkPlan] = useState<SourceLinkPlan | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const snapshot = sourceContextId ? readCommittedDatasetSnapshot(workspaceId, sourceContextId) : null;
  const linkSnapshot = linkDatasetId ? readCommittedDatasetSnapshot(workspaceId, linkDatasetId) : null;
  const linkColumns = linkSnapshot?.ok ? linkSnapshot.value.columns : [];
  const linkRows = linkSnapshot?.ok ? linkSnapshot.value.rows : [];
  const linkObject = linkObjectId ? getCanonicalObject(workspaceId, linkObjectId) : null;
  const columns = snapshot?.ok ? snapshot.value.columns : [];
  const recovery = listCanonicalMutations().filter((operation) =>
    operation.status === "PREPARED" || operation.status === "APPLYING" || operation.status === "RECOVERY_REQUIRED").length;

  return (
    <section
      data-testid="nexora-org-panel"
      data-canonical-recovery={canonicalMutationJournalStatus()}
      data-canonical-recovery-pending={recovery}
      style={{ display: "grid", gap: 8, marginTop: 8 }}
    >
      <strong>Organizational objects</strong>
      <ul>
        {objects.map((object) => (
          <li key={object.canonicalObjectId}>
            <button type="button" data-testid={`nexora-org-inspect-${object.canonicalObjectId}`} onClick={() => onInspect(object.canonicalObjectId)}>
              {object.displayName}
            </button>
            <span> {object.objectType} · {object.reconciliationStatus}</span>
          </li>
        ))}
      </ul>
      <label>
        Type
        <select data-testid="nexora-org-create-type" value={objectType} onChange={(event) => setObjectType(event.target.value as CanonicalObjectType)}>
          {CANONICAL_OBJECT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </label>
      <input data-testid="nexora-org-create-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Display name" />
      <button
        type="button"
        data-testid="nexora-org-create"
        onClick={() => {
          void runFencedWorkspaceMutation(workspaceId, () => {
            const created = createCanonicalObject({ workspaceId, objectType, displayName, deckId });
            const unavailable = created.ok ? null : workspaceAuthorityFailureMessage(created.reason);
            if (unavailable) window.dispatchEvent(new CustomEvent("nexora-workspace-unavailable", { detail: unavailable }));
            setMessage(created.ok ? `Created ${created.value.canonicalObjectId}` : unavailable ?? created.reason);
            if (created.ok) setDisplayName("");
          }).catch(() => {
            window.dispatchEvent(new CustomEvent("nexora-workspace-unavailable", { detail: WORKSPACE_UNAVAILABLE_MESSAGE }));
            setMessage(WORKSPACE_UNAVAILABLE_MESSAGE);
          });
        }}
      >
        Create object
      </button>
      <label>
        Committed dataset
        <select
          data-testid="nexora-org-dataset"
          value={sourceContextId}
          onChange={(event) => {
            setSourceContextId(event.target.value);
            setPlan(null);
          }}
        >
          <option value="">Select a committed dataset</option>
          {datasets.map((dataset) => (
            <option key={dataset.sourceContextId} value={dataset.sourceContextId}>{dataset.prepared.fileName}</option>
          ))}
        </select>
      </label>
      <p data-testid="nexora-org-dataset-columns">{columns.join("|")}</p>
      <p data-testid="nexora-org-dataset-row-count">{snapshot?.ok ? snapshot.value.rowCount : 0}</p>
      <label>
        Stable source key
        <select data-testid="nexora-org-source-key" value={sourceKeyColumn} onChange={(event) => setSourceKeyColumn(event.target.value)}>
          <option value="">Column</option>
          {columns.map((column) => <option key={column} value={column}>{column}</option>)}
        </select>
      </label>
      <label>
        Display name
        <select data-testid="nexora-org-display-name" value={displayNameColumn} onChange={(event) => setDisplayNameColumn(event.target.value)}>
          <option value="">Column</option>
          {columns.map((column) => <option key={column} value={column}>{column}</option>)}
        </select>
      </label>
      <label>
        Capacity column
        <select data-testid="nexora-org-attribute-column" value={attributeColumn} onChange={(event) => setAttributeColumn(event.target.value)}>
          <option value="">None</option>
          {columns.map((column) => <option key={column} value={column}>{column}</option>)}
        </select>
      </label>
      <button
        type="button"
        data-testid="nexora-org-mapping-preview"
        onClick={() => {
          const result = previewCommittedDatasetEntities({
            workspaceId,
            sourceContextId,
            deckId,
            mapping: {
              objectType: "MACHINE",
              sourceKeyColumn,
              displayNameColumn,
              attributeColumns: attributeColumn ? { [attributeColumn]: "capacityPerHour" } : {},
            },
          });
          setPlan(result.ok ? result.value : null);
          setMessage(result.ok
            ? `Preview ${result.value.preview.proposed.length} proposed, ${result.value.preview.updates.length} updates, ${result.value.preview.missing.length} missing`
            : result.reason);
        }}
      >
        Preview mapping
      </button>
      {plan ? (
        <p
          data-testid="nexora-org-mapping-preview-result"
          data-proposed-count={plan.preview.proposed.length}
          data-missing-count={plan.preview.missing.length}
          data-update-count={plan.preview.updates.length}
          data-dataset-fingerprint={plan.datasetFingerprint}
        >
          Proposed {plan.preview.proposed.map((row) => row.sourceKey).join("|")}
          {" · "}Updates {plan.preview.updates.map((row) => row.sourceKey).join("|")}
          {" · "}Missing {plan.preview.missing.map((row) => row.sourceKey).join("|")}
        </p>
      ) : null}
      <button
        type="button"
        data-testid="nexora-org-mapping-approve"
        disabled={plan == null}
        onClick={() => {
          if (!plan) return;
          const applied = approveCommittedDatasetEntities({ plan, workspaceId, deckId });
          setMessage(applied.ok ? "Approved mapping" : applied.reason);
          if (applied.ok) setPlan(null);
        }}
      >
        Approve mapping
      </button>
      <strong>Source associations</strong>
      <label>
        Canonical object
        <select data-testid="nexora-org-link-object" value={linkObjectId} onChange={(event) => { setLinkObjectId(event.target.value); setLinkPlan(null); }}>
          <option value="">Select an object</option>
          {objects.map((object) => <option key={object.canonicalObjectId} value={object.canonicalObjectId}>{object.displayName}</option>)}
        </select>
      </label>
      <p data-testid="nexora-org-link-current">{linkObject ? `${linkObject.displayName} · ${linkObject.canonicalObjectId} · ${linkObject.objectType} · ${linkObject.sourceLinks.map((link) => `${link.datasetId}/${link.sourceKey}`).join(" | ") || "none"}` : "No object selected"}</p>
      <label>
        Link dataset
        <select data-testid="nexora-org-link-dataset" value={linkDatasetId} onChange={(event) => { setLinkDatasetId(event.target.value); setLinkPlan(null); }}>
          <option value="">Select a committed dataset</option>
          {datasets.map((dataset) => <option key={dataset.sourceContextId} value={dataset.sourceContextId}>{dataset.prepared.fileName}</option>)}
        </select>
      </label>
      <p data-testid="nexora-org-link-columns">{linkColumns.join("|")}</p>
      <label>
        Source key column
        <select data-testid="nexora-org-link-key-column" value={linkKeyColumn} onChange={(event) => { setLinkKeyColumn(event.target.value); setLinkPlan(null); }}>
          <option value="">Column</option>
          {linkColumns.map((column) => <option key={column} value={column}>{column}</option>)}
        </select>
      </label>
      <label>
        Source record
        <select data-testid="nexora-org-link-source-key" value={linkSourceKey} onChange={(event) => { setLinkSourceKey(event.target.value); setLinkPlan(null); }}>
          <option value="">Record</option>
          {linkRows.map((row) => {
            const key = linkKeyColumn ? row[linkKeyColumn] ?? "" : "";
            return <option key={key} value={key}>{key}</option>;
          })}
        </select>
      </label>
      <button
        type="button"
        data-testid="nexora-org-link-preview"
        onClick={() => {
          const result = previewSourceAssociation({
            workspaceId,
            deckId,
            canonicalObjectId: linkObjectId,
            sourceContextId: linkDatasetId,
            sourceKeyColumn: linkKeyColumn,
            sourceKey: linkSourceKey,
            displayNameColumn: linkColumns.includes("machine_name") ? "machine_name" : undefined,
            attributeColumns: linkColumns.includes("capacity") ? { capacity: "capacityPerHour" } : {},
          });
          setLinkPlan(result.ok ? result.value : null);
          setMessage(result.ok ? result.value.status : result.reason);
        }}
      >
        Preview source link
      </button>
      {linkPlan ? (
        <p data-testid="nexora-org-link-preview-result" data-link-status={linkPlan.status} data-link-fingerprint={linkPlan.datasetFingerprint} data-canonical-object-id={linkPlan.canonicalObjectId}>
          {linkPlan.displayName} · {linkPlan.canonicalObjectId} · {linkPlan.sourceKey} · {linkPlan.importId}
          {linkPlan.attributeConflicts.length > 0 ? ` · Conflict ${linkPlan.attributeConflicts.map((conflict) => `${conflict.attribute} ${conflict.canonicalValue} vs ${conflict.sourceValue}`).join(", ")}` : ""}
        </p>
      ) : null}
      <button
        type="button"
        data-testid="nexora-org-link-approve"
        disabled={linkPlan == null || linkPlan.status === "IDENTITY_CONFLICT" || linkPlan.status === "UNAUTHORIZED" || linkPlan.status === "INVALID_SOURCE"}
        onClick={() => {
          if (!linkPlan) return;
          const applied = approveSourceAssociation({ plan: linkPlan, workspaceId, deckId });
          setMessage(applied.ok ? "Approved source link" : applied.reason);
          if (applied.ok) setLinkPlan(null);
        }}
      >
        Approve source link
      </button>
      <button type="button" data-testid="nexora-org-link-cancel" onClick={() => setLinkPlan(null)}>Cancel source link</button>
      {message ? <p data-testid="nexora-org-message">{message}</p> : null}
    </section>
  );
}
