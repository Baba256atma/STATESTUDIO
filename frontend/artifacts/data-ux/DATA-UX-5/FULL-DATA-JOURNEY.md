# DATA-UX:5 Full Data Journey

Composed CSV Data Object lifecycle (DATA-UX:1–5), not a second state machine.

```
Open /executive
  → Open Data
  → Add CSV
  → Preview / structural understand (RDI:1)
  → Semantic proposal + Advisor clarify (DATA-UX:3)
  → Manager confirm / correct / unknown
  → Source-scoped validate
  → Import (RDI:2)
  → Data Reality handoff (one active source)
  → Data Rail
  → Show Data Object on Stage (DATA-UX:4)
  → Inspect / Advisor explain
  → Provenance relationship (ESI + DTH, non-causal)
  → Update source (same sourceContextId)
  → Review source removal (intent, not delete)
  → Cancel (unchanged)
  → Review again → explicit confirm
  → Store remove + historical reference
  → Stage drops DATA_OBJECT; Director re-projects
```

Native live in DATA-UX:5 exercised import → Stage → Advisor review → cancel → Remove from Stage ≠ Remove data source → confirm → empty Rail, plus a dependent-source review. Semantic clarify, update, and shared-source cases remain certified on DATA-UX:2/3/4 plus DATA-UX:5 automated tests.

Manager Type-C distinctions that must stay obvious:

- Added a data source, not a file in Finder.
- Nexora’s understanding is structural + semantic, with explicit uncertainty.
- Remove from Stage is presentation.
- Remove data source is reviewed destruction.
- History is not rewritten; Decisions are not cancelled.
