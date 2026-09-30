# SIM-TEST:6-FIX10 Certification

Status: **CERTIFIED**

SIM-TEST:6 recertification: **STILL NOT CERTIFIED**

- T92 `What does the production data show?` is a **DATA_EVIDENCE_QUERY** / operational-domain data qualifier, not `obj-production` and not sticky Capacity.
- Expected: keep current management subject (`obj-delivery` after T90/T91); do not resolve `production` via the Capacity alias `production capacity`.
- Repair: NCA-POST:1 compound-key fuzzy parts require full key-word coverage; FINAL:6.1 skips Object mentions when the token is a `data|numbers|csv` domain qualifier on the full utterance; CC:1 matches `what does (the) X data show` as `evidence` with no object target hints.
- Manufacturing S1 = 0. Logistics T21 is the same utterance/root and is also S1 = 0.
- Project T18/T35 and Service T17/T18 remain independent.
- Production build / browser: NOT RUN — final certification deferred.
