# Clarification lifetime trace (T83 cluster)

T77 `Show me the alternatives again.`  
CREATE collection show (`Which one do you want me to show?`). CORRECT (FIX5: not a Decision write). Independent of T83.

T78 COMPARE  
SUPERSEDE T77 pending. CORRECT (FIX1 comparison rule).

T81 `What supports that now?`  
Pre-repair: CREATE REFERENCE_AMBIGUITY from `\bthat\b` + thread size ≥ 2 despite active `obj-delivery`. **DIVERGES_HERE**  
Post-repair: NONE / proceed on Delivery. CORRECT.

T82 `Did the action work after the later data?`  
Pre-repair: KEEP T81 pending (same problem/KPI question). DOWNSTREAM of T81.  
Post-repair: no pending; Outcome/TOO_EARLY path. CORRECT.

T83 `Is there a new bottleneck I should know about?`  
Pre-repair: KEEP same pending → loopCount ≥ 2 → fail. **REPEATED** (same origin T81), not RECREATED.  
Post-repair: proceed on Delivery; clarificationRequired=false. CORRECT.

T84 `What about inventory?`  
Known topic switch. CORRECT.
