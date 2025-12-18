"""Chaos Decision Engine - core logic

Pure logic module. Deterministic, non-linear behavior with no external
dependencies. Designed to be extended and plugged into higher-level services.

Design notes:
- Input text and optional history are deterministically hashed to derive
  pseudo-random but repeatable "noise" values. This keeps behavior non-
  linear while remaining reproducible for the same inputs.
- Signals are scored by simple token matching and aggregated using
  non-linear transforms (sigmoid / exponential / power). Pairwise
  interactions produce synergy effects without hard-coded branches.
- No external libraries used. All outputs are clamped to the [0,1]
  range before being returned.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional, Literal, Dict, Tuple
import hashlib
import math

Polarity = Literal["positive", "negative", "neutral"]


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


@dataclass
class ChaosResult:
    """Result produced by the engine.

    - intensity: how strong the chaos effect should be (0..1)
    - volatility: how unstable / changeable the effect is (0..1)
    - dominant_signal: signal keyword driving the result (or None)
    - affected_objects: deterministic list of object identifiers
    - explanation: short human-readable rationale
    """

    intensity: float
    volatility: float
    dominant_signal: Optional[str]
    affected_objects: List[str] = field(default_factory=list)
    explanation: str = ""


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
                ChaosSignal("risk", 1.0, "negative"),
                ChaosSignal("delay", 0.9, "negative"),
                ChaosSignal("inventory", 0.7, "neutral"),
                ChaosSignal("quality", 0.8, "negative"),
                ChaosSignal("urgent", 0.6, "positive"),
            ]
        )

        # Internal semantic registry: maps a signal name to matching keywords,
        # a base weight and polarity. This registry is used by
        # `_extract_signals` to detect semantic signal strength in free text.
        # It intentionally does not depend on scene objects or any external
        # data; it is a lightweight lexical detector.
        self._registry: Dict[str, Dict] = {
            "inventory": {
                "keywords": ["inventory", "stock", "out_of_stock", "shortage", "backorder"],
                "base_weight": 0.8,
                "polarity": "neutral",
            },
            "quality": {
                "keywords": ["quality", "defect", "defective", "failure", "reject"],
                "base_weight": 0.9,
                "polarity": "negative",
            },
            "delay": {
                "keywords": ["delay", "delayed", "late", "lag", "postpone"],
                "base_weight": 0.85,
                "polarity": "negative",
            },
            "risk": {
                "keywords": ["risk", "risky", "exposure", "threat"],
                "base_weight": 1.0,
                "polarity": "negative",
            },
            "pressure": {
                "keywords": ["pressure", "stress", "overload", "pressure_high"],
                "base_weight": 0.7,
                "polarity": "neutral",
            },
            "trust": {
                "keywords": ["trust", "confidence", "reliable", "faith"],
                "base_weight": 0.5,
                "polarity": "positive",
            },
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
                kwlist = meta.get("keywords", [])
                base = float(meta.get("base_weight", 0.0))
                polarity = meta.get("polarity", "neutral")

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

                found.append(ChaosSignal(keyword=name, weight=weight, polarity=polarity))

            return found
        except Exception:
            # Extraction must not break the engine; on error return empty list
            return []

    @staticmethod
    def _clamp01(x: float) -> float:
        if x != x:  # NaN
            return 0.0
        return max(0.0, min(1.0, x))

    # --------------------
    # Core analysis
    # --------------------
    def analyze(self, text: str, history: Optional[List[str]] = None) -> ChaosResult:
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
        for i, sig in enumerate(signals_for_scoring):
            base = raw_scores.get(sig.keyword, 0.0)
            if sig.polarity == "positive":
                polarity_mult = 1.12
            elif sig.polarity == "negative":
                polarity_mult = 0.88
            else:
                polarity_mult = 0.95

            contrib = base * polarity_mult
            contributions[sig.keyword] = max(0.0, contrib)

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
        # number of objects is proportional to intensity, up to 10
        max_objs = 10
        count = int(math.ceil(intensity * max_objs))
        affected_objects: List[str] = []
        for k in range(count):
            r = self._rand_float(seed, 1000 + k)
            # produce deterministic id like obj_42_hex
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
        explanation = " | ".join(parts)

        # Final result
        return ChaosResult(
            intensity=self._clamp01(intensity),
            volatility=self._clamp01(volatility),
            dominant_signal=dominant_signal,
            affected_objects=affected_objects,
            explanation=explanation,
        )


# Simple self-test when run as script (does not run on import)
if __name__ == "__main__":
    e = ChaosEngine()
    r = e.analyze("inventory delay risk quality quality urgent", history=["prev 1", "prev 2"])
    print(r)
