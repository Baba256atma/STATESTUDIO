"""Rules-based selection engine for Nexora Local AI models."""

from __future__ import annotations

from app.core.config import LocalAISettings
from app.schemas.ai import (
    BenchmarkModelPreference,
    ModelCapabilityProfile,
    ModelSelectionRequest,
    ModelSelectionResult,
)
from app.services.ai.benchmark_preferences import BenchmarkPreferencesLoader
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService
from app.services.ai.model_profiles import build_default_model_profiles
from app.services.ai.selection_policy import resolve_benchmark_priority, resolve_model_class


class LocalAIModelSelectionEngine:
    """Select the best available model for a local AI task."""

    def __init__(self, settings: LocalAISettings) -> None:
        self.settings = settings
        self.control_plane = AIControlPlaneService(settings)
        self._profiles = build_default_model_profiles(settings)
        self._benchmark_loader = BenchmarkPreferencesLoader(settings)

    def select(self, request: ModelSelectionRequest, *, default_model: str) -> ModelSelectionResult:
        """Resolve a model selection result using deterministic policy rules."""
        if request.requested_model:
            return ModelSelectionResult(
                task_type=request.task_type,
                selected_model=request.requested_model,
                model_class="requested",
                strategy="requested_override",
                provider=request.provider,
                reason="requested_model_override",
                fallback_used=False,
                benchmark_used=False,
            )

        model_policy = self.control_plane.get_model_policy()
        benchmark_policy = self.control_plane.get_benchmark_policy()

        if not model_policy.selection_enabled:
            return ModelSelectionResult(
                task_type=request.task_type,
                selected_model=self._select_default_available_model(request.available_models, default_model),
                model_class="default",
                strategy="disabled",
                provider=request.provider,
                reason="model_selection_disabled",
                fallback_used=True,
                benchmark_used=False,
            )

        preferred_model_class = resolve_model_class(
            task_type=request.task_type,
            latency_sensitive=request.latency_sensitive,
            quality_policy=request.quality_policy,
            metadata=request.metadata,
        )
        candidate_profiles = self._candidate_profiles(request.available_models)
        static_profile = self._select_profile_for_class(
            model_class=preferred_model_class,
            available_models=request.available_models,
        )
        benchmark_snapshot = self._benchmark_loader.load()

        if candidate_profiles and benchmark_snapshot.available:
            scored = self._score_candidates(
                candidate_profiles=candidate_profiles,
                preferred_model_class=preferred_model_class,
                task_type=request.task_type,
                latency_sensitive=request.latency_sensitive,
                preferences=benchmark_snapshot.preferences,
            )
            if scored:
                selected = max(scored, key=lambda item: item["total_score"])
                profile = selected["profile"]
                benchmark_used = bool(selected["benchmark_score"] > 0.0 and selected["preference"] is not None)
                return ModelSelectionResult(
                    task_type=request.task_type,
                    selected_model=profile.model,
                    model_class=self._model_class_for_profile(profile),
                    strategy=model_policy.selection_strategy,
                    provider=request.provider,
                    reason=self._selection_reason(
                        selected_model=profile.model,
                        task_type=request.task_type,
                        preferred_model_class=preferred_model_class,
                        benchmark_used=benchmark_used,
                        benchmark_priority=resolve_benchmark_priority(
                            request.task_type,
                            request.latency_sensitive,
                        ),
                        benchmark_enabled=benchmark_policy.enabled,
                        benchmark_available=benchmark_snapshot.available,
                    ),
                    fallback_used=bool(static_profile is None or profile.model != static_profile.model),
                    benchmark_used=benchmark_used,
                    metadata={
                        "profile_latency_class": profile.latency_class,
                        "profile_quality_class": profile.quality_class,
                        "benchmark_source_path": benchmark_snapshot.source_path,
                        "benchmark_error": benchmark_snapshot.error,
                        "static_score": round(selected["static_score"], 4),
                        "benchmark_score": round(selected["benchmark_score"], 4),
                        "total_score": round(selected["total_score"], 4),
                    },
                )

        if static_profile is not None:
            benchmark_message = (
                "benchmark_results_unavailable"
                if benchmark_policy.enabled and not benchmark_snapshot.available
                else None
            )
            return ModelSelectionResult(
                task_type=request.task_type,
                selected_model=static_profile.model,
                model_class=preferred_model_class,
                strategy=model_policy.selection_strategy,
                provider=request.provider,
                reason=self._selection_reason(
                    selected_model=static_profile.model,
                    task_type=request.task_type,
                    preferred_model_class=preferred_model_class,
                    benchmark_used=False,
                    benchmark_priority=None,
                    benchmark_enabled=benchmark_policy.enabled,
                    benchmark_available=benchmark_snapshot.available,
                ),
                fallback_used=False,
                benchmark_used=False,
                metadata={
                    "profile_latency_class": static_profile.latency_class,
                    "profile_quality_class": static_profile.quality_class,
                    "benchmark_source_path": benchmark_snapshot.source_path,
                    "benchmark_error": benchmark_message or benchmark_snapshot.error,
                },
            )

        fallback_model = self._select_default_available_model(request.available_models, default_model)
        return ModelSelectionResult(
            task_type=request.task_type,
            selected_model=fallback_model,
            model_class="default",
            strategy=model_policy.selection_strategy,
            provider=request.provider,
            reason=self._selection_reason(
                selected_model=fallback_model,
                task_type=request.task_type,
                preferred_model_class=preferred_model_class,
                benchmark_used=False,
                benchmark_priority=None,
                benchmark_enabled=benchmark_policy.enabled,
                benchmark_available=benchmark_snapshot.available,
                fallback_used=True,
            ),
            fallback_used=True,
            benchmark_used=False,
            metadata={
                "preferred_model_class": preferred_model_class,
                "benchmark_source_path": benchmark_snapshot.source_path,
                "benchmark_error": benchmark_snapshot.error,
            },
        )

    def _candidate_profiles(self, available_models: list[str]) -> list[ModelCapabilityProfile]:
        available_set = {model for model in available_models if isinstance(model, str)}
        candidates = [profile for profile in self._profiles if profile.enabled]
        if available_set:
            candidates = [profile for profile in candidates if profile.model in available_set]
        return candidates

    def _select_profile_for_class(
        self,
        *,
        model_class: str,
        available_models: list[str],
    ) -> ModelCapabilityProfile | None:
        available_set = {model for model in available_models if isinstance(model, str)}
        candidates = [profile for profile in self._profiles if profile.enabled]
        if available_set:
            candidates = [profile for profile in candidates if profile.model in available_set]

        if not candidates:
            return None

        if model_class == "fast":
            return max(candidates, key=lambda profile: (profile.speed_score, profile.supports_json))
        if model_class == "reasoning":
            return max(candidates, key=lambda profile: (profile.reasoning_score, profile.supports_json))
        if model_class == "extraction":
            return max(candidates, key=lambda profile: (profile.extraction_score, profile.supports_json))
        return self._profile_for_model(self.control_plane.get_model_policy().default_model, candidates)

    def _score_candidates(
        self,
        *,
        candidate_profiles: list[ModelCapabilityProfile],
        preferred_model_class: str,
        task_type: str,
        latency_sensitive: bool,
        preferences: dict[str, BenchmarkModelPreference],
    ) -> list[dict]:
        benchmark_priority = resolve_benchmark_priority(task_type, latency_sensitive)
        latencies = [
            preference.avg_latency_ms
            for profile in candidate_profiles
            if (preference := preferences.get(profile.model)) and preference.avg_latency_ms is not None
        ]
        min_latency = min(latencies) if latencies else None
        max_latency = max(latencies) if latencies else None
        max_objects = max(
            (
                preferences.get(profile.model).avg_objects_detected
                for profile in candidate_profiles
                if preferences.get(profile.model) is not None
            ),
            default=0.0,
        )

        scored: list[dict] = []
        for profile in candidate_profiles:
            preference = preferences.get(profile.model)
            static_score = self._static_score(profile, preferred_model_class, task_type, latency_sensitive)
            benchmark_score = self._benchmark_score(
                profile=profile,
                preference=preference,
                benchmark_priority=benchmark_priority,
                min_latency=min_latency,
                max_latency=max_latency,
                max_objects=max_objects,
            )
            scored.append(
                {
                    "profile": profile,
                    "preference": preference,
                    "static_score": static_score,
                    "benchmark_score": benchmark_score,
                    "total_score": static_score + benchmark_score,
                }
            )
        return scored

    def _static_score(
        self,
        profile: ModelCapabilityProfile,
        preferred_model_class: str,
        task_type: str,
        latency_sensitive: bool,
    ) -> float:
        capability_score = profile.reasoning_score
        if latency_sensitive:
            capability_score = profile.speed_score
        elif task_type == "extract_objects":
            capability_score = profile.extraction_score

        class_bonus = 0.35 if self._model_class_for_profile(profile) == preferred_model_class else 0.0
        json_bonus = 0.1 if profile.supports_json else 0.0
        default_bonus = 0.05 if profile.model == self.control_plane.get_model_policy().default_model else 0.0
        return class_bonus + (capability_score * 0.45) + json_bonus + default_bonus

    def _benchmark_score(
        self,
        *,
        profile: ModelCapabilityProfile,
        preference: BenchmarkModelPreference | None,
        benchmark_priority: str,
        min_latency: float | None,
        max_latency: float | None,
        max_objects: float,
    ) -> float:
        if preference is None:
            return 0.0

        benchmark_policy = self.control_plane.get_benchmark_policy()
        weights = benchmark_policy.weights
        if preference.success_rate < benchmark_policy.min_success_rate:
            return 0.0

        latency_score = self._normalized_latency_score(preference.avg_latency_ms, min_latency, max_latency)
        extraction_quality = 0.0
        if max_objects > 0:
            extraction_quality = min(preference.avg_objects_detected / max_objects, 1.0)

        if benchmark_priority == "latency":
            return (
                latency_score * weights["latency"]
                + preference.success_rate * weights["success"]
                + preference.json_valid_rate * (weights["json_validity"] * 0.5)
            )

        if benchmark_priority == "extraction":
            return (
                preference.success_rate * (weights["success"] * 0.7)
                + preference.json_valid_rate * weights["json_validity"]
                + extraction_quality * (weights["extraction"] + 0.35)
            )

        return (
            preference.success_rate * weights["success"]
            + preference.json_valid_rate * (weights["json_validity"] * 0.5)
            + preference.avg_confidence * weights["reasoning"]
        )

    @staticmethod
    def _normalized_latency_score(
        latency_ms: float | None,
        min_latency: float | None,
        max_latency: float | None,
    ) -> float:
        if latency_ms is None or min_latency is None or max_latency is None:
            return 0.0
        if max_latency == min_latency:
            return 1.0
        return 1.0 - ((latency_ms - min_latency) / (max_latency - min_latency))

    def _model_class_for_profile(self, profile: ModelCapabilityProfile) -> str:
        model_policy = self.control_plane.get_model_policy()
        if profile.model == model_policy.fast_model:
            return "fast"
        if profile.model == model_policy.reasoning_model:
            return "reasoning"
        if profile.model == model_policy.extraction_model:
            return "extraction"
        return "default"

    @staticmethod
    def _selection_reason(
        *,
        selected_model: str,
        task_type: str,
        preferred_model_class: str,
        benchmark_used: bool,
        benchmark_priority: str | None,
        benchmark_enabled: bool,
        benchmark_available: bool,
        fallback_used: bool = False,
    ) -> str:
        if benchmark_used and benchmark_priority == "extraction":
            return (
                f"Selected {selected_model} for {task_type} due to high JSON validity "
                "and extraction benchmark score"
            )
        if benchmark_used and benchmark_priority == "latency":
            return f"Selected {selected_model} for {task_type} due to strong low-latency benchmark score"
        if benchmark_used:
            return f"Selected {selected_model} for {task_type} due to strong benchmark-assisted reasoning score"
        if fallback_used and benchmark_enabled and not benchmark_available:
            return f"Fell back to {selected_model} because benchmark data was unavailable"
        if fallback_used:
            return f"Fell back to {selected_model} because the preferred model was unavailable"
        return f"Selected {selected_model} using rules-based {preferred_model_class} policy"

    @staticmethod
    def _profile_for_model(
        model_name: str,
        profiles: list[ModelCapabilityProfile],
    ) -> ModelCapabilityProfile | None:
        for profile in profiles:
            if profile.model == model_name:
                return profile
        return profiles[0] if profiles else None

    @staticmethod
    def _select_default_available_model(available_models: list[str], default_model: str) -> str:
        if default_model:
            if not available_models or default_model in available_models:
                return default_model
        if available_models:
            return available_models[0]
        return default_model or "unknown"
