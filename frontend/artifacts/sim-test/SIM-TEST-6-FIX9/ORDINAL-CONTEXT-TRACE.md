# Ordinal context dual-path trace

```
"The first one."
      │
      ├─ ordinal detection
      │   collectionOrdinalIndex → 0                         CORRECT
      │
      ├─ eligible collection discovery
      │   lastCollection PROBLEM members still stored        CORRECT (history retained)
      │   T88 named switch stripped establishedAtTurn        CORRECT after repair
      │   PRE: treated as ordinal-active                     DIVERGES_HERE
      │
      ├─ collection precedence
      │   stale lastCollection beat Inventory subject        DIVERGES_HERE (pre)
      │   POST: ineligible → no collection                   CORRECT
      │
      ├─ ordered member resolution
      │   PRE: items[0] Capacity Gap                         DIVERGES_HERE
      │   POST: NOT_APPLICABLE
      │
      ├─ canonical target
      │   CC:5 currentSubject stayed obj-inventory           CORRECT
      │
      └─ Advisor context
          PRE: NCA:2 activeSubject / “Understood — Capacity Gap.”
          POST: Inventory + ordered-list clarification       CORRECT
```
