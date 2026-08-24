# MVP-OUT:1-FIX3 — Root cause

## Failure

`what if delivery be too late` produced the generic fallback.

## Why

FIX2 delay matching required:

`SUBJECT (be|is|gets|becomes) (late|delayed)`

The intensity token `too` sits between the copula and the adjective, so the clause did not match. Intent stayed unknown → CC:5 generic fallback.

This was a phrase-shaped hole, not a missing Delivery product rule.

## Correction

A shared deterministic grammar:

WHAT_IF + SUBJECT + (directional verb | copula + optional intensity + canonical state) + optional magnitude

Canonical states: late, delayed, high, low, slow, fast, critical, stable, worse, better, higher, lower.

Intensities: too, very, extremely, more, less — qualitative only; never converted to days or percents.

Conversation emits `explore-scenario` with `{ actionKind, state, direction, intensity?, magnitude? }`. CC:9 still decides modeled vs unsupported.

Unknown adjectives (`sparkly`) remain genuine fallback (parser did not understand). Recognized but unmodeled Delivery delay is honest unsupported-model copy, including “severe” when intensity is too/very/extremely.
