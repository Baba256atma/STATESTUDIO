"""Static model capability profiles for the Local AI selection engine."""

from __future__ import annotations

from app.core.config import LocalAISettings
from app.schemas.ai import ModelCapabilityProfile


def build_default_model_profiles(settings: LocalAISettings) -> list[ModelCapabilityProfile]:
    """Return baseline capability profiles derived from current settings."""
    profiles = {
        settings.default_model: ModelCapabilityProfile(
            model=settings.default_model,
            provider=settings.provider,
            supports_json=True,
            reasoning_score=0.75,
            speed_score=0.65,
            extraction_score=0.7,
            enabled=True,
            latency_class="balanced",
            quality_class="balanced",
        ),
        settings.fast_model: ModelCapabilityProfile(
            model=settings.fast_model,
            provider=settings.provider,
            supports_json=True,
            reasoning_score=0.6,
            speed_score=0.9,
            extraction_score=0.75,
            enabled=True,
            latency_class="fast",
            quality_class="pragmatic",
        ),
        settings.reasoning_model: ModelCapabilityProfile(
            model=settings.reasoning_model,
            provider=settings.provider,
            supports_json=True,
            reasoning_score=0.9,
            speed_score=0.55,
            extraction_score=0.7,
            enabled=True,
            latency_class="balanced",
            quality_class="high",
        ),
        settings.extraction_model: ModelCapabilityProfile(
            model=settings.extraction_model,
            provider=settings.provider,
            supports_json=True,
            reasoning_score=0.65,
            speed_score=0.8,
            extraction_score=0.9,
            enabled=True,
            latency_class="fast",
            quality_class="balanced",
        ),
    }
    return list(profiles.values())
