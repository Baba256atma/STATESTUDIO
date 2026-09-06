# NEX-ENT:6 architecture inspection

Answers before coding.

1. **Who owns source ingestion?** Existing Data UX / CSV chooser / `parseCsvDeterministically` / RDI prepare. ENT:6 does not ingest.
2. **Who owns source lifecycle?** `csvRealDataImportStore` pending/commit/discard. ENT:6 observes and narrates.
3. **Who owns field meaning?** `csvSemanticUnderstanding` / DATA-ADV:2 `resolveSemanticCandidates`. ENT:6 translates confidence; does not invent meaning.
4. **Who may confirm field semantics?** `applyCsvSemanticClarification` via `applyAdvisorDataSemanticClarification` / NCA. ENT:6 does not write confirmation.
5. **Who owns DATA_OBJECT identity?** Existing Data Reality / Stage projection. ENT:6 teaches; does not inject Objects.
6. **Who determines whether data supplies current reality?** RDI / Data Reality commit (`suppliesCurrentReality` / accepted evidence). ENT:6 never sets it.
7. **Who projects Data Objects to Stage?** Director / `projectDataRealityToExecutiveRuntime`. ENT:6 observes.
8. **Who explains Data to Advisor?** `answerAdvisorDataInquiry` / `projectAdvisorDataContext`. Example path uses read-only `interpretCsvSemantics` on the certified `data-ux3-update.csv` fixture without storing.
9. **Who owns Data Library persistence?** DATA-UX:6 / IndexedDB durability. Independent of ENT session refresh.
10. **Who owns dependency/removal?** DATA-UX:5 `analyzeCsvSourceRemovalImpact` / `answerCsvSourceRemovalInquiry`. ENT:6 answers at high level; does not remove.
11. **Who owns Guided Attention to Data?** DIR:GA `DATA_ENTRY`. ENT:6 may set `pendingOfferTarget`; does not highlight.
12. **Evidence vs interpretation vs confirmation?** Lifecycle/accepted evidence is Data Reality. Candidates are DATA-ADV. Confirmation is `applyCsvSemanticClarification` only.

## Example isolation

Educational “Show me an example” interprets the existing DATA-UX:3 update fixture in memory. It does not `saveCsvImportCandidate` or commit Data Reality. Copy states it is example data, not the manager’s business library.
