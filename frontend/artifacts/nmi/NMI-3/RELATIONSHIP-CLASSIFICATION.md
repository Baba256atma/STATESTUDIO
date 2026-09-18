# NPA-T NMI:3 — Relationship classification

Classes are projections over NMI:1 kinds. They are not a new canonical vocabulary.

| Class | NMI:1 kinds |
| --- | --- |
| STRUCTURAL | `belongs_to`, `depends_on`, `supports` (non-evidence) |
| PERFORMANCE | `measures`, `threatens` |
| EVIDENCE | `evidenced_by`, `supports` when a DATA_EVIDENCE endpoint exists |
| ANALYTICAL | `affects` (VAI semantics preserved) |
| RESPONSE | `addresses`, `evaluated_by` |
| COMMITMENT | `selected_as` |
| EXECUTION | `executed_by` |
| OBSERVATION | `observed_by` |
| LEARNING | `reassesses` |

Suggested English kinds such as `part_of`, `associated_with`, `implements`, or `approved_as` are not added. They appear only if an existing NMI:1 kind already carries that management meaning.
