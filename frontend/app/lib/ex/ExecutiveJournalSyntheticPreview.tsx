/**
 * EX-2 Tier-0 Synthetic Contract Preview — React presentation.
 *
 * Canonical styling: injected `ExecutiveJournalSyntheticUiCssText` with real
 * `@media` breakpoints. Native button list semantics (complete keyboard path).
 *
 * Authorized by EX2-UI-AUTH-T0-2026-07-27-01.
 */

"use client";

import { useId, useState, type ReactElement } from "react";
import {
  filterExecutiveJournalSyntheticUiRecords,
  selectExecutiveJournalSyntheticUiRecord,
  ExecutiveJournalSyntheticReadOnlyUiFacade,
} from "./executiveJournalSyntheticUiFacade.ts";
import {
  ExecutiveJournalSyntheticUiCssText,
  ex2t0,
} from "./executiveJournalSyntheticUiStyles.ts";
import {
  ExecutiveJournalSyntheticUiCategoryFilters,
  ExecutiveJournalSyntheticUiLifecycleFilters,
  ExecutiveJournalSyntheticUiProductName,
  ExecutiveJournalSyntheticUiStateCopy,
  ExecutiveJournalSyntheticUiSubtitle,
  type ExecutiveJournalSyntheticUiCategoryFilter,
  type ExecutiveJournalSyntheticUiLifecycleFilter,
  type ExecutiveJournalSyntheticUiRecord,
  type ExecutiveJournalSyntheticUiView,
} from "./executiveJournalSyntheticUiTypes.ts";

export interface ExecutiveJournalSyntheticPreviewProps {
  readonly view?: ExecutiveJournalSyntheticUiView;
  readonly "data-testid"?: string;
}

const StyleTag = (): ReactElement => (
  <style data-ex2-t0-canonical-css="true">{ExecutiveJournalSyntheticUiCssText}</style>
);

const SyntheticMarker = ({
  visible,
  screenReader,
  detail = false,
  testId,
}: {
  readonly visible: string;
  readonly screenReader: string;
  readonly detail?: boolean;
  readonly testId?: string;
}): ReactElement => (
  <div
    className={detail ? ex2t0.detailMarker : ex2t0.marker}
    data-testid={testId ?? "ex2-t0-synthetic-marker"}
    data-dismissible="false"
    role="note"
    aria-label={screenReader}
  >
    {visible}
  </div>
);

const StatusChips = ({
  record,
}: {
  readonly record: ExecutiveJournalSyntheticUiRecord;
}): ReactElement => (
  <div className={ex2t0.statusRow} data-testid="ex2-t0-status-labels">
    <span className={ex2t0.statusLabel}>{record.labels.category}</span>
    <span className={ex2t0.statusLabel}>{record.labels.lifecycle}</span>
    <span className={ex2t0.statusLabel}>{record.labels.origin}</span>
    <span className={ex2t0.statusLabel}>{record.labels.authority}</span>
    <span className={ex2t0.statusLabel}>{record.labels.integrity}</span>
  </div>
);

const RecordDetail = ({
  record,
  markerVisible,
  markerScreenReader,
}: {
  readonly record: ExecutiveJournalSyntheticUiRecord;
  readonly markerVisible: string;
  readonly markerScreenReader: string;
}): ReactElement => (
  <div data-testid="ex2-t0-record-detail">
    <SyntheticMarker
      visible={markerVisible}
      screenReader={markerScreenReader}
      detail
      testId="ex2-t0-detail-synthetic-marker"
    />
    <h3 className={ex2t0.regionHeading}>Selected synthetic record</h3>
    <StatusChips record={record} />
    <ul className={ex2t0.fieldList}>
      <li>
        <span className={ex2t0.fieldName}>Category</span>
        <span className={ex2t0.fieldValue} data-field="entry_category">
          {record.display.entry_category}
        </span>
      </li>
      <li>
        <span className={ex2t0.fieldName}>Lifecycle</span>
        <span className={ex2t0.fieldValue} data-field="lifecycle_state">
          {record.display.lifecycle_state}
        </span>
      </li>
      <li>
        <span className={ex2t0.fieldName}>Origin</span>
        <span className={ex2t0.fieldValue} data-field="origin_classification">
          {record.labels.origin}
        </span>
      </li>
      <li>
        <span className={ex2t0.fieldName}>Authority</span>
        <span className={ex2t0.fieldValue} data-field="authority_state">
          {record.labels.authority}
        </span>
      </li>
      <li>
        <span className={ex2t0.fieldName}>Integrity</span>
        <span className={ex2t0.fieldValue} data-field="integrity_state">
          {record.labels.integrity}
        </span>
      </li>
      <li>
        <span className={ex2t0.fieldName}>Source</span>
        <span className={ex2t0.fieldValue} data-field="source_classification">
          {record.display.source_classification}
        </span>
      </li>
      {record.conditional.journal_ref ? (
        <li>
          <span className={ex2t0.fieldName}>Journal reference</span>
          <span className={ex2t0.refValue} data-field="journal_ref">
            {record.conditional.journal_ref}
          </span>
        </li>
      ) : null}
      {record.conditional.provenance_ref ? (
        <li>
          <span className={ex2t0.fieldName}>Provenance reference</span>
          <span className={ex2t0.refValue} data-field="provenance_ref">
            {record.conditional.provenance_ref}
          </span>
        </li>
      ) : null}
      {record.conditional.correction_ref ? (
        <li>
          <span className={ex2t0.fieldName}>Correction reference</span>
          <span className={ex2t0.refValue} data-field="correction_ref">
            {record.conditional.correction_ref}
          </span>
        </li>
      ) : null}
      {record.conditional.supersession_ref ? (
        <li>
          <span className={ex2t0.fieldName}>Supersession reference</span>
          <span className={ex2t0.refValue} data-field="supersession_ref">
            {record.conditional.supersession_ref}
          </span>
        </li>
      ) : null}
      {record.conditional.projection_schema_version ? (
        <li>
          <span className={ex2t0.fieldName}>Projection schema version</span>
          <span className={ex2t0.fieldValue} data-field="projection_schema_version">
            {record.conditional.projection_schema_version}
          </span>
        </li>
      ) : null}
    </ul>
  </div>
);

const StatePanel = ({
  heading,
  message,
  live = false,
}: {
  readonly heading: string;
  readonly message: string;
  readonly live?: boolean;
}): ReactElement => (
  <div
    className={ex2t0.statePanel}
    data-testid="ex2-t0-state-panel"
    role={live ? "status" : undefined}
    aria-live={live ? "polite" : undefined}
  >
    <h2 className={ex2t0.stateHeading}>{heading}</h2>
    <p className={ex2t0.stateMessage}>{message}</p>
  </div>
);

/**
 * Read-only Tier-0 synthetic Executive Journal preview.
 * Local ephemeral filter/selection state only — resets on remount.
 */
export function ExecutiveJournalSyntheticPreview({
  view = ExecutiveJournalSyntheticReadOnlyUiFacade.loadView("Normal"),
  "data-testid": testId = "ex2-t0-synthetic-preview",
}: ExecutiveJournalSyntheticPreviewProps): ReactElement {
  const categoryId = useId();
  const lifecycleId = useId();
  const [category, setCategory] =
    useState<ExecutiveJournalSyntheticUiCategoryFilter>("All");
  const [lifecycle, setLifecycle] =
    useState<ExecutiveJournalSyntheticUiLifecycleFilter>("All");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const liveAnnouncement =
    view.state === "Ready"
      ? "Synthetic preview ready."
      : "message" in view
      ? view.message
      : "Synthetic preview state updated.";

  if (view.state !== "Ready") {
    return (
      <main
        className={ex2t0.root}
        data-testid={testId}
        data-ui-id={ExecutiveJournalSyntheticReadOnlyUiFacade.uiId}
        data-state={view.state}
        data-host="DevelopmentTestHarnessOnly"
        aria-label={ExecutiveJournalSyntheticUiProductName}
      >
        <StyleTag />
        <SyntheticMarker
          visible={view.markerVisible}
          screenReader={view.markerScreenReader}
        />
        <header className={ex2t0.header}>
          <h1 className={ex2t0.title}>{ExecutiveJournalSyntheticUiProductName}</h1>
          <p className={ex2t0.subtitle}>{ExecutiveJournalSyntheticUiSubtitle}</p>
          <p className={ex2t0.scope}>
            Development/test harness preview only. No live journal data. No
            production route.
          </p>
        </header>
        <div className={ex2t0.liveRegion} aria-live="polite">
          {liveAnnouncement}
        </div>
        <StatePanel
          heading={view.state}
          message={
            "message" in view
              ? view.message
              : ExecutiveJournalSyntheticUiStateCopy.Failure
          }
        />
        {view.state === "IntegrityUnavailable" && view.record ? (
          <section
            className={ex2t0.detailRegion}
            aria-label="Synthetic integrity detail"
          >
            <RecordDetail
              record={view.record}
              markerVisible={view.markerVisible}
              markerScreenReader={view.markerScreenReader}
            />
          </section>
        ) : null}
      </main>
    );
  }

  const filtered = filterExecutiveJournalSyntheticUiRecords(
    view.records,
    category,
    lifecycle,
  );
  const selected =
    selectExecutiveJournalSyntheticUiRecord(filtered, selectedKey)
    ?? (filtered.length > 0 ? filtered[0] : null);
  const effectiveSelectedKey = selected?.selectionKey ?? null;

  return (
    <main
      className={ex2t0.root}
      data-testid={testId}
      data-ui-id={ExecutiveJournalSyntheticReadOnlyUiFacade.uiId}
      data-state={view.state}
      data-host="DevelopmentTestHarnessOnly"
      aria-label={ExecutiveJournalSyntheticUiProductName}
    >
      <StyleTag />
      <SyntheticMarker
        visible={view.markerVisible}
        screenReader={view.markerScreenReader}
      />
      <header className={ex2t0.header}>
        <h1 className={ex2t0.title}>{ExecutiveJournalSyntheticUiProductName}</h1>
        <p className={ex2t0.subtitle}>{ExecutiveJournalSyntheticUiSubtitle}</p>
        <p className={ex2t0.scope}>
          Development/test harness preview only. No live journal data. No
          production route.
        </p>
      </header>

      <div className={ex2t0.liveRegion} aria-live="polite">
        {liveAnnouncement}
      </div>

      <div
        className={ex2t0.filters}
        role="group"
        aria-label="Synthetic preview filters"
        data-testid="ex2-t0-filters"
      >
        <div className={ex2t0.filterGroup}>
          <label className={ex2t0.filterLabel} htmlFor={categoryId}>
            Category
          </label>
          <select
            id={categoryId}
            className={ex2t0.filterControl}
            value={category}
            data-testid="ex2-t0-category-filter"
            onChange={(event) => {
              setCategory(
                event.target.value as ExecutiveJournalSyntheticUiCategoryFilter,
              );
              setSelectedKey(null);
            }}
          >
            {ExecutiveJournalSyntheticUiCategoryFilters.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className={ex2t0.filterGroup}>
          <label className={ex2t0.filterLabel} htmlFor={lifecycleId}>
            Lifecycle
          </label>
          <select
            id={lifecycleId}
            className={ex2t0.filterControl}
            value={lifecycle}
            data-testid="ex2-t0-lifecycle-filter"
            onChange={(event) => {
              setLifecycle(
                event.target.value as ExecutiveJournalSyntheticUiLifecycleFilter,
              );
              setSelectedKey(null);
            }}
          >
            {ExecutiveJournalSyntheticUiLifecycleFilters.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={ex2t0.layout} data-testid="ex2-t0-layout">
        <section
          className={ex2t0.listRegion}
          aria-label="Synthetic metadata list"
          data-testid="ex2-t0-list-region"
        >
          <h2 className={ex2t0.regionHeading}>Synthetic records</h2>
          {filtered.length === 0 ? (
            <StatePanel
              heading="Empty filter result"
              message={ExecutiveJournalSyntheticUiStateCopy.ReadyEmptyFilter}
            />
          ) : (
            <ul className={ex2t0.recordList} aria-label="Synthetic records">
              {filtered.map((record) => {
                const isSelected = record.selectionKey === effectiveSelectedKey;
                const accessibleName = `${record.labels.category}, ${record.labels.lifecycle}, ${record.labels.origin}`;
                return (
                  <li key={record.selectionKey}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-current={isSelected ? "true" : undefined}
                      aria-label={accessibleName}
                      className={
                        isSelected
                          ? ex2t0.recordButtonSelected
                          : ex2t0.recordButton
                      }
                      data-testid={`ex2-t0-record-${record.display.entry_category}-${record.display.lifecycle_state}`}
                      onClick={() => setSelectedKey(record.selectionKey)}
                    >
                      <span className={ex2t0.recordPrimary}>
                        {record.labels.category}
                      </span>
                      <span className={ex2t0.recordSecondary}>
                        {record.labels.lifecycle} · {record.labels.origin}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section
          className={ex2t0.detailRegion}
          aria-label="Selected synthetic record detail"
          data-testid="ex2-t0-detail-region"
        >
          {selected ? (
            <RecordDetail
              record={selected}
              markerVisible={view.markerVisible}
              markerScreenReader={view.markerScreenReader}
            />
          ) : (
            <StatePanel
              heading="No selection"
              message={ExecutiveJournalSyntheticUiStateCopy.ReadyEmptyFilter}
            />
          )}
        </section>
      </div>
    </main>
  );
}
