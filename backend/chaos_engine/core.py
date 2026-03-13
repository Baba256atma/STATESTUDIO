"""Chaos Signal Engine v1 - deterministic signal analysis core.

This module preserves the existing ChaosEngine public behavior while
cleaning up the engine into a reusable signal-analysis layer that can
later hand off to risk propagation, runtime updates, scenario building,
and domain-aware reasoning.

Compatibility guarantees:
- `ChaosEngine.analyze(...)` remains the public entry point.
- Existing `ChaosResult` fields remain available:
  intensity, volatility, dominant_signal, signal_scores, top_signals,
  affected_objects, explanation.
- Additional fields are additive and future-facing only.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional, Literal, Dict, Tuple
import hashlib
import math

Polarity = Literal["positive", "negative", "neutral"]
SignalCategory = Literal[
    "risk",
    "pressure",
    "constraint",
    "flow",
    "buffer",
    "outcome",
    "trust",
    "quality",
    "shock",
    "general",
]
DomainHint = Literal["business", "finance", "devops", "strategy", "general"]
ShockClass = Literal["shock", "pressure", "constraint", "degradation", "stability", "general"]


@dataclass(frozen=True)
class ChaosSignal:
    """Represents a named signal the engine will look for in text.

    - keyword: a short token or phrase (engine performs simple matching)
    - weight: relative importance of this signal (positive -> raises intensity)
    - polarity: semantic polarity used for explanation and volatility effects
    """

    keyword: str
    weight: float
    polarity: Polarity = "neutral"
    category: SignalCategory = "general"
    keywords: Tuple[str, ...] = ()


@dataclass(frozen=True)
class ChaosSignalObservation:
    signal: str
    category: SignalCategory
    polarity: Polarity
    weight: float
    raw_score: float
    contribution: float
    matched_terms: Tuple[str, ...] = ()
    note: str = ""


@dataclass(frozen=True)
class ChaosObjectHint:
    object_id: str
    score: float
    matched_terms: Tuple[str, ...] = ()
    role_hint: Optional[str] = None
    note: str = ""


@dataclass
class ChaosResult:
    """Result produced by the engine.

    - intensity: how strong the chaos effect should be (0..1)
    - volatility: how unstable / changeable the effect is (0..1)
    - dominant_signal: signal keyword driving the result (or None)
    - signal_scores: per-signal scores (for Nexora Product A)
    - top_signals: list of (signal, value) tuples (for Nexora Product A)
    - affected_objects: deterministic list of object identifiers
    - explanation: short human-readable rationale
    """

    intensity: float
    volatility: float
    dominant_signal: Optional[str]
    signal_scores: Dict[str, float] = field(default_factory=dict)
    top_signals: List[Tuple[str, float]] = field(default_factory=list)
    affected_objects: List[str] = field(default_factory=list)
    explanation: str = ""
    signal_categories: Dict[str, str] = field(default_factory=dict)
    signal_polarities: Dict[str, str] = field(default_factory=dict)
    signal_observations: List[Dict[str, object]] = field(default_factory=list)
    object_hints: List[Dict[str, object]] = field(default_factory=list)
    domain_hint: Optional[str] = None
    explanation_notes: List[str] = field(default_factory=list)
    risk_handoff: Dict[str, object] = field(default_factory=dict)


class ChaosEngine:
    """Deterministic, extensible decision engine for producing chaos signals.

    The engine is intentionally simple and pure: it accepts text and an
    optional history and returns a `ChaosResult`. It contains a small
    default signal set but can be extended by passing a custom list of
    `ChaosSignal` instances to the constructor.
    """

    def __init__(self, signals: Optional[List[ChaosSignal]] = None):
        # Default signals are simple examples; these are not hard-coded
        # behavioral branches, merely scored inputs that the engine uses.
        self.signals: List[ChaosSignal] = (
            list(signals)
            if signals is not None
            else [
                ChaosSignal("risk", 1.0, "negative", "risk", ("risk", "risky", "exposure", "threat")),
                ChaosSignal("delay", 0.9, "negative", "flow", ("delay", "delayed", "late", "lag")),
                ChaosSignal("inventory", 0.7, "neutral", "buffer", ("inventory", "stock", "buffer", "shortage")),
                ChaosSignal("quality", 0.8, "negative", "quality", ("quality", "defect", "failure", "reject")),
                ChaosSignal("urgent", 0.6, "positive", "pressure", ("urgent", "priority", "expedite")),
            ]
        )

        self._registry: Dict[str, Dict[str, object]] = {
            "inventory": {
                "keywords": ["inventory", "stock", "out_of_stock", "shortage", "backorder"],
                "base_weight": 0.8,
                "polarity": "neutral",
                "category": "buffer",
            },
            "quality": {
                "keywords": ["quality", "defect", "defective", "failure", "reject"],
                "base_weight": 0.9,
                "polarity": "negative",
                "category": "quality",
            },
            "delay": {
                "keywords": ["delay", "delayed", "late", "lag", "postpone"],
                "base_weight": 0.85,
                "polarity": "negative",
                "category": "flow",
            },
            "risk": {
                "keywords": ["risk", "risky", "exposure", "threat"],
                "base_weight": 1.0,
                "polarity": "negative",
                "category": "risk",
            },
            "pressure": {
                "keywords": ["pressure", "stress", "overload", "pressure_high"],
                "base_weight": 0.7,
                "polarity": "neutral",
                "category": "pressure",
            },
            "trust": {
                "keywords": ["trust", "confidence", "reliable", "faith"],
                "base_weight": 0.5,
                "polarity": "positive",
                "category": "trust",
            },
            "cash": {
                "keywords": ["cash", "liquidity", "cost", "margin", "budget"],
                "base_weight": 0.75,
                "polarity": "negative",
                "category": "constraint",
            },
            "latency": {
                "keywords": ["latency", "outage", "database", "service", "uptime"],
                "base_weight": 0.8,
                "polarity": "negative",
                "category": "flow",
            },
            "competition": {
                "keywords": ["competitor", "pricing", "market", "share", "strategy"],
                "base_weight": 0.65,
                "polarity": "negative",
                "category": "pressure",
            },
        }
        self._domain_keywords: Dict[DomainHint, Tuple[str, ...]] = {
            "business": ("supplier", "inventory", "delivery", "customer", "operations", "capacity"),
            "finance": ("liquidity", "portfolio", "drawdown", "capital", "exposure", "cash"),
            "devops": ("service", "database", "latency", "outage", "queue", "uptime"),
            "strategy": ("competitor", "market", "pricing", "position", "share", "objective"),
            "general": (),
        }


    # --------------------
    # Utility: deterministic hash -> floats
    # --------------------
    def _seed_from(self, text: str, history: Optional[List[str]]) -> int:
        """Create a deterministic integer seed from the inputs."""
        h = hashlib.sha256()
        h.update(text.encode("utf-8"))
        if history:
            # join history to preserve order
            h.update("\n".join(history).encode("utf-8"))
        # take first 8 bytes as integer
        return int.from_bytes(h.digest()[:8], "big", signed=False)

    def _rand_float(self, seed: int, idx: int) -> float:
        """Deterministic pseudo-random float in [0,1) derived from seed and index.

        We avoid the `random` module to keep pure determinism across
        environments; instead use hashing of seed+index.
        """
        m = hashlib.sha256()
        m.update(seed.to_bytes(8, "big", signed=False))
        m.update(idx.to_bytes(4, "big", signed=False))
        val = int.from_bytes(m.digest()[:8], "big", signed=False)
        return (val % (10 ** 9)) / float(10 ** 9)

    # --------------------
    # Text processing helpers
    # --------------------
    @staticmethod
    def _tokenize(text: str) -> List[str]:
        """Very small tokenizer: split on non-word chars, lowercase.

        This keeps the engine dependency-free while being serviceable for
        keyword matching. No complex NLP is used.
        """
        if not text:
            return []
        # split on anything that's not alnum or underscore
        tokens = []
        cur = []
        for ch in text.lower():
            if ch.isalnum() or ch == "_":
                cur.append(ch)
            else:
                if cur:
                    tokens.append("".join(cur))
                    cur = []
        if cur:
            tokens.append("".join(cur))
        return tokens

    def _extract_signals(self, text: str) -> List[ChaosSignal]:
        """Extract semantic signals from free text using the internal registry.

        - Case-insensitive matching against registry keywords.
        - Multiple hits increase the returned signal's weight using a
          sub-linear transform (sqrt) to avoid runaway linear scaling.
        - Returns a list of `ChaosSignal` instances. If nothing is found,
          returns an empty list. This function never raises.
        """
        try:
            tokens = set(self._tokenize(text or ""))
            found: List[ChaosSignal] = []
            for name, meta in self._registry.items():
                kwlist = list(meta.get("keywords", []))
                base = float(meta.get("base_weight", 0.0))
                polarity = str(meta.get("polarity", "neutral"))
                category = str(meta.get("category", "general"))

                # Count matches across keywords; allow substring matches
                # in tokens as well.
                count = 0
                for kw in kwlist:
                    lkw = kw.lower()
                    if lkw in tokens:
                        count += 1
                    else:
                        # allow substring matches to capture variants
                        for t in tokens:
                            if lkw in t:
                                count += 1
                                break

                if count <= 0:
                    continue

                # Non-linear weight growth: sqrt of count to give
                # diminishing returns for repeated mentions.
                weight = base * math.sqrt(count)
                # Clip to reasonable range (engine will also clamp later)
                weight = max(0.0, min(4.0, weight))

                found.append(
                    ChaosSignal(
                        keyword=name,
                        weight=weight,
                        polarity=polarity,  # type: ignore[arg-type]
                        category=category,  # type: ignore[arg-type]
                        keywords=tuple(str(kw).lower() for kw in kwlist),
                    )
                )

            return found
        except Exception:
            # Extraction must not break the engine; on error return empty list
            return []

    @staticmethod
    def _clamp01(x: float) -> float:
        if x != x:  # NaN
            return 0.0
        return max(0.0, min(1.0, x))

    def _matched_terms(self, text_tokens: List[str], signal: ChaosSignal) -> Tuple[str, ...]:
        matched: List[str] = []
        keywords = signal.keywords or (signal.keyword.lower(),)
        token_set = set(text_tokens)
        for keyword in keywords:
            if keyword in token_set:
                matched.append(keyword)
                continue
            if len(keyword) >= 3:
                for token in token_set:
                    if keyword in token:
                        matched.append(keyword)
                        break
        if signal.keyword.lower() in token_set and signal.keyword.lower() not in matched:
            matched.append(signal.keyword.lower())
        return tuple(dict.fromkeys(matched))

    def _infer_domain_hint(self, tokens: List[str]) -> DomainHint:
        token_set = set(tokens)
        best_domain: DomainHint = "general"
        best_score = 0
        for domain, keywords in self._domain_keywords.items():
            score = sum(1 for keyword in keywords if keyword in token_set)
            if score > best_score:
                best_score = score
                best_domain = domain
        return best_domain

    def _build_signal_observations(
        self,
        text_tokens: List[str],
        signals: List[ChaosSignal],
        raw_scores: Dict[str, float],
        contributions: Dict[str, float],
    ) -> List[ChaosSignalObservation]:
        observations: List[ChaosSignalObservation] = []
        for signal in signals:
            keyword = signal.keyword
            observations.append(
                ChaosSignalObservation(
                    signal=keyword,
                    category=signal.category,
                    polarity=signal.polarity,
                    weight=float(signal.weight),
                    raw_score=float(raw_scores.get(keyword, 0.0)),
                    contribution=float(contributions.get(keyword, 0.0)),
                    matched_terms=self._matched_terms(text_tokens, signal),
                    note=f"{keyword} scored from direct token and substring matches.",
                )
            )
        observations.sort(key=lambda item: (-item.contribution, item.signal))
        return observations

    def _infer_role_hint(self, candidate_object: str) -> Optional[str]:
        lowered = candidate_object.lower()
        role_map = {
            "supplier": "source",
            "vendor": "source",
            "inventory": "buffer",
            "stock": "buffer",
            "buffer": "buffer",
            "delivery": "flow",
            "service": "node",
            "database": "dependency",
            "queue": "buffer",
            "customer": "outcome",
            "trust": "outcome",
            "risk": "risk",
            "pressure": "pressure",
            "cash": "constraint",
            "liquidity": "constraint",
            "competitor": "actor",
            "market": "outcome",
        }
        for key, value in role_map.items():
            if key in lowered:
                return value
        return None

    def _score_candidate_object(
        self,
        candidate_object: str,
        signal_observations: List[ChaosSignalObservation],
        seed: int,
        idx: int,
        domain_hint: DomainHint,
    ) -> ChaosObjectHint:
        lowered = candidate_object.lower()
        matched_terms: List[str] = []
        lexical_score = 0.0

        for observation in signal_observations:
            for term in observation.matched_terms:
                if term and term in lowered:
                    matched_terms.append(term)
                    lexical_score += observation.contribution * 0.85
            if observation.signal in lowered:
                matched_terms.append(observation.signal)
                lexical_score += observation.contribution
            if observation.category != "general" and observation.category in lowered:
                matched_terms.append(observation.category)
                lexical_score += observation.contribution * 0.55

        role_hint = self._infer_role_hint(candidate_object)
        if role_hint and any(obs.category == "risk" for obs in signal_observations) and role_hint in {"risk", "pressure", "source", "dependency"}:
            lexical_score += 0.18
        if domain_hint != "general":
            for domain_kw in self._domain_keywords.get(domain_hint, ()):
                if domain_kw in lowered:
                    lexical_score += 0.08
                    matched_terms.append(domain_kw)

        deterministic_noise = self._rand_float(seed, 2000 + idx)
        hash_bias = int.from_bytes(
            hashlib.sha256((str(seed) + "::" + candidate_object).encode("utf-8")).digest()[:4],
            "big",
            signed=False,
        ) / float(2**32)

        score = lexical_score + (0.08 * deterministic_noise) + (0.04 * hash_bias)
        note = "candidate selected by lexical overlap" if lexical_score > 0 else "candidate selected by deterministic fallback ranking"
        return ChaosObjectHint(
            object_id=candidate_object,
            score=score,
            matched_terms=tuple(dict.fromkeys(matched_terms)),
            role_hint=role_hint,
            note=note,
        )

    def _build_risk_handoff(
        self,
        dominant_signal: Optional[str],
        intensity: float,
        affected_objects: List[str],
        domain_hint: DomainHint,
        top_observations: List[ChaosSignalObservation],
    ) -> Dict[str, object]:
        top_categories = [obs.category for obs in top_observations if obs.contribution > 0]
        shock_class: ShockClass = "general"
        if dominant_signal in {"risk", "quality"}:
            shock_class = "degradation"
        elif dominant_signal in {"pressure", "delay", "latency", "competition"}:
            shock_class = "pressure"
        elif dominant_signal in {"cash"}:
            shock_class = "constraint"
        elif dominant_signal in {"trust"}:
            shock_class = "stability"
        elif dominant_signal:
            shock_class = "shock"

        return {
            "source_weight": self._clamp01(intensity),
            "source_signal": dominant_signal,
            "source_category": top_categories[0] if top_categories else "general",
            "target_object_hints": list(affected_objects),
            "propagation_stage_hint": "immediate",
            "shock_classification": shock_class,
            "domain_hint": domain_hint,
        }

    # --------------------
    # Core analysis
    # --------------------
    def analyze(self, text: str, history: Optional[List[str]] = None, candidate_objects: Optional[List[str]] = None) -> ChaosResult:
        """Analyze text (and optional history) and produce a ChaosResult.

        The algorithm steps:
        1. Tokenize the input and compute a simple match-strength per signal
           based on token counts and substring hits (no brittle phrase checks).
        2. Transform match strengths non-linearly (exponential decay / sigmoid)
           and weight by signal importance.
        3. Compute pairwise synergies: if two signals co-occur, produce a
           multiplicative boost to intensity (non-linear interaction).
        4. Inject deterministic, small "noise" derived from a hash of inputs
           to avoid pure linearity while keeping repeatability.
        5. Aggregate into final intensity and volatility scores and produce
           a short explanation.
        """
        seed = self._seed_from(text or "", history)
        tokens = self._tokenize(text or "")
        domain_hint = self._infer_domain_hint(tokens)
        token_counts: Dict[str, int] = {}
        for t in tokens:
            token_counts[t] = token_counts.get(t, 0) + 1

        # Allow semantic extraction from the free text. If the extractor
        # finds signals, use those; otherwise fall back to the engine's
        # configured `self.signals`. This keeps behavior backward
        # compatible while enabling richer detection.
        extracted = self._extract_signals(text or "")
        signals_for_scoring = extracted if extracted else list(self.signals)

        # 1) Per-signal raw match scores (count-based + substring factor)
        raw_scores: Dict[str, float] = {}
        for i, sig in enumerate(signals_for_scoring):
            key = sig.keyword.lower()
            # count exact token matches
            c = token_counts.get(key, 0)
            # add substring presence bonus (e.g. "delay" in "delayed")
            substr_bonus = 0
            if c == 0 and len(key) >= 3:
                for t in token_counts:
                    if key in t:
                        substr_bonus += token_counts[t]
            # normalized occurrence measure
            occ = float(c + substr_bonus)
            # apply a mild non-linear transform so diminishing returns occur
            # for repeated tokens: 1 - exp(-k * occ)
            match_strength = 1.0 - math.exp(-0.8 * occ)
            raw_scores[sig.keyword] = match_strength * max(0.0, sig.weight)

        # 2) Apply deterministic polarity multipliers and weight
        # We intentionally avoid randomness here to keep the engine
        # deterministic. Polarity effects are applied as small
        # multiplicative biases:
        #  - positive signals slightly amplify contributions
        #  - negative signals slightly reduce them (they still contribute)
        #  - neutral signals have modest influence
        contributions: Dict[str, float] = {}
        for sig in signals_for_scoring:
            base = raw_scores.get(sig.keyword, 0.0)
            if sig.polarity == "positive":
                polarity_mult = 1.12
            elif sig.polarity == "negative":
                polarity_mult = 0.88
            else:
                polarity_mult = 0.95

            contrib = base * polarity_mult
            contributions[sig.keyword] = max(0.0, contrib)

        signal_observations = self._build_signal_observations(
            tokens, signals_for_scoring, raw_scores, contributions
        )

        # 3) Pairwise synergy (non-linear): for each pair, if both present,
        # produce a small multiplicative boost proportional to geometric mean
        # of their scores. This avoids simple additive chaining.
        synergy = 1.0
        keys = list(contributions.keys())
        for i in range(len(keys)):
            for j in range(i + 1, len(keys)):
                a = contributions[keys[i]]
                b = contributions[keys[j]]
                if a > 0 and b > 0:
                    # geometric mean gives stronger boost when both are strong
                    gm = math.sqrt(a * b)
                    # non-linear curve to privilege moderate co-occurrence
                    boost = 1.0 + (gm ** 1.5) * 0.25
                    synergy *= boost

        # 4) Aggregate intensity base using a sigmoid to squash extremes
        # Mathematical choice rationale:
        # - We first compute an `aggregated` score which combines weighted
        #   signal magnitudes and pairwise synergy. This value can grow
        #   above 1 for strong inputs. To map it into [0,1] smoothly we use
        #   a logistic (sigmoid) function because it provides a tunable
        #   non-linear ramp: small aggregated -> near 0, medium -> steep
        #   slope, large -> saturates near 1. This is preferable to a
        #   simple linear clamp since it naturally models diminishing
        #   returns for increasing signal strength.
        weighted_sum = sum(contributions.values())
        aggregated = weighted_sum * synergy

        # Center and scale the sigmoid so that `aggregated` around ~0.5
        # yields moderate intensity. The constants below were chosen to
        # produce a responsive curve for typical signal ranges while
        # remaining smooth and predictable.
        a = 1.1  # slope
        b = 0.6  # center
        raw_intensity = 1.0 / (1.0 + math.exp(- (a * (aggregated - b))))

        # small deterministic history bias (more history slightly raises intensity)
        if history:
            raw_intensity = raw_intensity + min(0.1, len(history) * 0.01)

        intensity = self._clamp01(raw_intensity)

        # Volatility: measure of how mixed / unstable the signals are.
        # We prefer an entropy-based approach because entropy captures
        # distributional diversity: a spread of similar-sized signals
        # yields high entropy (high volatility), while one dominant
        # signal yields low entropy (low volatility).
        vals = [v for v in contributions.values() if v > 0]
        if not vals:
            volatility = 0.0
        else:
            s = sum(vals)
            probs = [v / s for v in vals]
            n = len(probs)
            # Shannon entropy normalized to [0,1]
            eps = 1e-12
            entropy = -sum(p * math.log(p + eps) for p in probs) / (math.log(n) if n > 1 else 1)

            # dominance ratio: how much the largest signal dominates
            dominance = max(vals) / s

            # Combine: higher entropy increases volatility, but dominance
            # reduces it. Use a mild non-linear blend.
            raw_volatility = entropy * (1.0 - dominance ** 0.7)

            # squish with tanh to keep within reasonable bounds and smooth
            volatility = self._clamp01(math.tanh(raw_volatility * 1.1))

        # Dominant signal: highest contribution if above a small threshold
        dominant_signal = None
        if contributions:
            best = max(contributions.items(), key=lambda kv: kv[1])
            if best[1] > 0.05:
                dominant_signal = best[0]

        # Affected objects: deterministic selection based on intensity and seed
        # Prefer selecting from provided candidate_objects (e.g., allowed_objects)
        # to avoid generating unknown object ids.
        max_objs = 10
        count = int(math.ceil(intensity * max_objs))

        affected_objects: List[str] = []
        object_hints: List[ChaosObjectHint] = []
        if candidate_objects:
            for idx, obj in enumerate(candidate_objects):
                object_hints.append(
                    self._score_candidate_object(
                        obj, signal_observations, seed, idx, domain_hint
                    )
                )
            object_hints.sort(key=lambda item: (-item.score, item.object_id))
            for hint in object_hints[: min(count, len(object_hints))]:
                affected_objects.append(hint.object_id)
        else:
            # Backward-compatible fallback: generate deterministic ids like obj_00042
            for k in range(count):
                r = self._rand_float(seed, 1000 + k)
                obj_id = f"obj_{int(r * 100000):05d}"
                affected_objects.append(obj_id)

        # Explanation: concise rationale generated from top signals and stats
        top_signals = sorted(contributions.items(), key=lambda kv: kv[1], reverse=True)[:3]
        parts: List[str] = []
        if top_signals:
            for s, v in top_signals:
                parts.append(f"{s}({v:.2f})")
        parts.append(f"intensity={intensity:.2f}")
        parts.append(f"volatility={volatility:.2f}")
        if domain_hint != "general":
            parts.append(f"domain={domain_hint}")
        explanation = " | ".join(parts)

        explanation_notes = []
        if top_signals:
            explanation_notes.append(
                "top_signals=" + ",".join(f"{name}:{value:.2f}" for name, value in top_signals)
            )
        if candidate_objects:
            explanation_notes.append("affected_objects selected from provided candidates")
        else:
            explanation_notes.append("affected_objects generated from deterministic fallback ids")
        if domain_hint != "general":
            explanation_notes.append(f"domain hint inferred as {domain_hint}")

        risk_handoff = self._build_risk_handoff(
            dominant_signal,
            intensity,
            affected_objects,
            domain_hint,
            signal_observations[:3],
        )

        # Final result
        return ChaosResult(
            intensity=self._clamp01(intensity),
            volatility=self._clamp01(volatility),
            dominant_signal=dominant_signal,
            signal_scores=contributions,
            top_signals=top_signals,
            affected_objects=affected_objects,
            explanation=explanation,
            signal_categories={obs.signal: obs.category for obs in signal_observations},
            signal_polarities={obs.signal: obs.polarity for obs in signal_observations},
            signal_observations=[
                {
                    "signal": obs.signal,
                    "category": obs.category,
                    "polarity": obs.polarity,
                    "weight": round(obs.weight, 4),
                    "raw_score": round(obs.raw_score, 4),
                    "contribution": round(obs.contribution, 4),
                    "matched_terms": list(obs.matched_terms),
                    "note": obs.note,
                }
                for obs in signal_observations
            ],
            object_hints=[
                {
                    "object_id": hint.object_id,
                    "score": round(hint.score, 4),
                    "matched_terms": list(hint.matched_terms),
                    "role_hint": hint.role_hint,
                    "note": hint.note,
                }
                for hint in object_hints
            ],
            domain_hint=domain_hint,
            explanation_notes=explanation_notes,
            risk_handoff=risk_handoff,
        )


# Simple self-test when run as script (does not run on import)
if __name__ == "__main__":
    e = ChaosEngine()
    r = e.analyze("inventory delay risk quality quality urgent", history=["prev 1", "prev 2"])
    print(r)
