# Source Update Semantics

DATA-UX:2 `Update source` remains canonical and requires the same source filename/identity.

For every replacement field:

- same workspace + source + field, compatible datatype/unit: reuse a manager confirmation and preserve its provenance;
- renamed field: treat as a new field; no confirmation reuse;
- changed datatype: `CONFLICTING`, preserve prior meaning for explanation, require reassessment;
- changed unit: `CONFLICTING`, preserve prior meaning, require reassessment;
- different source or workspace: no reuse;
- unknown/nonmaterial additions: explicit but nonblocking.

Replacement still prepares outside the committed store and publishes atomically only after all existing guards pass. A conflict cannot silently overwrite prior committed Runtime truth.

