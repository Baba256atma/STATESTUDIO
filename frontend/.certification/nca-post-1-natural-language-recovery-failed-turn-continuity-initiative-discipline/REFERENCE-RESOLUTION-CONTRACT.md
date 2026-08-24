# Reference resolution contract

Pipeline: raw text → filler/article/punctuation/case normalization → morphology → registered-catalog Damerau fuzzy match → confidence.

Tiers: EXACT, NORMALIZED_EXACT, HIGH_CONFIDENCE_FUZZY, AMBIGUOUS, UNRESOLVED.

Precedence: strong explicit reference > high-confidence registered fuzzy match > conversation subject > stage > other fallback.

Fuzzy matching never invents subjects, data, or projections. It only recovers identity against the supplied catalog.
