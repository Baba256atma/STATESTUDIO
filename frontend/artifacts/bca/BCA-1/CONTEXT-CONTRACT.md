# BCA:1 canonical context contract

The public foundation is exported from `app/lib/business-context-awareness/index.ts`.

Flow:

```text
Domain / Organization / Project / Goal / Object / Data Reality
                         +
          DATA-ADV confirmed semantic concepts
                         |
                         v
          resolveBusinessProjectContext
                         |
                         v
     immutable BusinessProjectContext + diagnostics
```

The output is a contextual projection, not published business truth. Its source refs retain authority and source-context boundaries. It contains no mutation method.

Relationship safety is structural: every contextual relationship has `causal: false`; no `CAUSES` relationship exists in the vocabulary. Manager safety is structural: manager metadata has `permissions: null` and `decisionAuthority: null`.
