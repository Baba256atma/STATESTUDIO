# Root cause

**Did CC:1 understand this as a data/evidence query?** Before repair: no (generic / object-shaped). After: yes, `evidence` with empty targetHints.

**Did canonical meaning preserve "production data"?** Before: cue `data show` was stripped, leftover `production` looked like an Object. After: EVIDENCE family + `isDataDomainQualifier` on the full utterance.

**Was a legitimate Production data source available?** Yes — Data Reality PRODUCTION v4 at tick 21 via Gate/RDI.

**Did Data Reality contain current Production data?** Yes. Latest visible version is v4.

**Did Production-related evidence enter candidates?** The Data Reality source existed. Conversational Object matching incorrectly treated `production` as Capacity.

**Did Capacity enter candidates? Why?** Alias `production capacity` exposed fuzzy **part** `production`. Sticky historical Capacity was not required; the alias part match was sufficient.

**Which candidate won (before)?** `obj-capacity` (Object / FUZZY_OBJECT_MATCH).

**Was the conversational referent actually wrong?** Yes — Observer WRONG_REFERENT was correct. Architecture does **not** require evidence source == subject, but it also does not authorize switching to Capacity.

**Was the selected evidence source correct after repair?** Conversational referent stays Delivery; PRODUCTION v4 remains the Nexora-visible production-data family. Advisor is not rewritten.

**Was the response evidence-bounded?** Yes. No Ground Truth leak. No causal overclaim required for certification.

**First incorrect transition:**  
`production` token / alias part of `production capacity` was treated as an Object candidate **before** data-domain semantics applied  
→ canonical/conversational referent became Capacity.

**Why the long session exposed it:** T88–T91 moved the subject off Capacity (Inventory → Delivery + unknown Maintenance clarification). T92 then named production data; the alias match pulled Capacity back. Short journeys whose current subject is already Capacity do not surface WRONG_REFERENT for the same utterance (Service T21 keeps Capacity legitimately).

**Why this owner:** Gate/RDI/Data Reality already had PRODUCTION v4. Advisor/Stage were downstream of a wrong Object referent. Repair belongs at POST:1 compound-key matching and 6.1 mention construction, with CC:1 evidence classification so the utterance is not an Object investigation.

Classification: **OBJECT_VS_DATA_KIND_CONFUSION** (earliest), with **DATA_PHRASE_EXTRACTION_DEFECT** (cue-strip) contributing.
