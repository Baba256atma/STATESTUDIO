# DATA-UX:5 Provenance Retention

Current reality: after confirmed removal of the active source, the shell stops passing that dataset. Stage returns to the existing non-CSV catalog scenario. DATA-UX:5 does not invent a freshness/unavailable KPI model.

Historical: a `CsvRemovedSourceReference` keeps source id, import id, label, snapshot ref, mapping id, and removal time. It does not supply current data and does not carry reusable manager confirmations.

Decisions, Evidence, Execution, Outcome, and Learning are not rewritten. A past Decision is not “without evidence” because the source later left current reality.
