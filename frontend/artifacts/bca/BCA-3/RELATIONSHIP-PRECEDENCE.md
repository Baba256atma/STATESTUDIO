# BCA:3 relationship precedence

`BUSINESS_PROJECT_RELATIONSHIP_PRECEDENCE`:

1. MEASURE_OF / INDICATOR_OF
2. PART_OF / BELONGS_TO
3. DEPENDS_ON / REQUIRES (vocabulary only; not emitted from the general registry)
4. POTENTIALLY_CONSTRAINS
5. RELEVANT_TO
6. ASSOCIATED_WITH / SUPPORTS_UNDERSTANDING_OF / AFFECTED_BY_CONTEXT / RELATED_THROUGH
7. POTENTIALLY_RELATED_TO

For the same directed pair, a general MEASURE_OF or PART_OF suppresses a general RELEVANT_TO duplicate.

Organization-specific contrary records do not delete general knowledge. They set `suppressedForCurrentContext` and preserve both provenance notes.
