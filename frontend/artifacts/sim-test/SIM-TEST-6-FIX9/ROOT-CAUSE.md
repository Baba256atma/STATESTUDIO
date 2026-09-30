# Root cause

**What collection did T89 refer to?** NCA:2 `lastCollection` (listed problem/scenario labels), not Inventory, not previousSubjects, not Stage visible order.

**Was that collection legitimately active/referable?** No. T88 `Switch to inventory.` is an explicit named Object switch. Inventory is not a member of that list. Historical existence of the list is not enough.

**Was ordinal index resolved correctly?** Index 0 would have been correct *if* the collection were eligible. The collection choice was wrong.

**Canonical target?** CC:5 correctly stayed `obj-inventory`. NCA:2 incorrectly rewrote dialogue `activeSubject` to Capacity Gap.

**CC:5 context?** Correct Inventory.

**Advisor input?** Wrong because NCA:2 activeSubject was Capacity Gap. NXA:1 projection followed that consumer contract.

**Observer?** Correct ADVISOR_DIVERGENCE (Advisor Capacity Gap vs conversation Inventory).

**First incorrect transition:** NCA:2 `interpretNcaDialogueTurn` treated any `lastCollection.items` as an ordinal pool, including after an out-of-collection named switch.

**Why long-session exposed it:** The list was established many turns earlier (problems/alternatives). Sticky `lastCollection` survived T88. Short journeys that switch then ordinal without a leftover list do not show it.

**Why this owner:** Repairing NXA:1 or Stage would hide a dialogue-state ordinal lifetime defect. CC:5 already had the right subject.

Classification: `ORDINAL_COLLECTION_LIFETIME_DEFECT` (earliest), producing `ADVISOR_CONTEXT_BUNDLE_DEFECT` downstream. Not `ORDINAL_INDEX_RESOLUTION_DEFECT`.
