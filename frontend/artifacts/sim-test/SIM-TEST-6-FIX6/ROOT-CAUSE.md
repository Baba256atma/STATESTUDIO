# Root cause

**Was T83 a FIX1 regression?** No. FIX1 was empty-candidate MISSING_SUBJECT capturing a comparison reminder. T83 is a later TYPE/REFERENCE_AMBIGUITY from deictic `that` plus a long thread, capturing independent evidence/outcome/investigate. **INDEPENDENT_ROOT.**

**Was pending active before T83?** Yes (pre-repair). Origin T81.

**Was the request independently resolvable?** Yes. Canonical subject was already `obj-delivery`.

**Was the old clarification repeated?** Yes. Same question signature, loopCount ≥ 2. Not a newly recreated equivalent with a new origin.

**Was referent already wrong?** No. Delivery was canonical through T81–T83.

**Was intent already wrong?** T83 INVESTIGATE was legitimate. T81 CC:1 was not the first failure; the gate fired on `that` even with an active subject.

**Was Observer wrong?** No. Three consecutive `clarificationRequired` turns exceeded the budget. Production really repeated the pending.

**First incorrect transition:** FINAL:6.3 `evaluateClarificationGate` `that`+thread REFERENCE_AMBIGUITY while `activeSubjectId` was Delivery and the operation was knowledge (EVIDENCE). Resolver then treated T82/T83 as answers to that pending.

**Why long-session history exposed it:** Thread accumulated many subject IDs; `\bthat\b` in “What supports that now?” matched the long-thread rule. Short journeys never reach thread size ≥ 2 with this evidence phrasing.
