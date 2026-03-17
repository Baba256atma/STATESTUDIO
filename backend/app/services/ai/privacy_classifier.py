"""Deterministic privacy and data classification for AI routing."""

from __future__ import annotations

from app.core.config import LocalAISettings
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService
from app.services.ai.privacy_types import (
    PrivacyClassificationRequest,
    PrivacyClassificationResult,
    PrivacyPolicyResponse,
)


RESTRICTED_KEYWORDS = {
    "ssn",
    "social security",
    "passport",
    "medical record",
    "patient",
    "bank account",
    "routing number",
    "export controlled",
    "regulated data",
}

CONFIDENTIAL_KEYWORDS = {
    "payroll",
    "revenue",
    "forecast",
    "acquisition",
    "customer list",
    "incident",
    "contract",
    "legal",
    "api key",
    "secret",
    "credential",
    "token",
}

INTERNAL_KEYWORDS = {
    "internal",
    "supplier",
    "operations",
    "margin",
    "backlog",
    "delivery",
    "roadmap",
    "workspace",
}


class PrivacyClassifier:
    """Classify request sensitivity before provider routing."""

    def __init__(self, settings: LocalAISettings) -> None:
        self.settings = settings
        self.control_plane = AIControlPlaneService(settings)

    def describe_policy(self) -> PrivacyPolicyResponse:
        """Return a static snapshot of the active privacy policy."""
        policy = self.control_plane.get_privacy_policy()
        return PrivacyPolicyResponse(
            enabled=policy.enabled,
            default_privacy_mode=policy.default_privacy_mode,
            strict_mode=policy.strict_mode,
            assume_uploaded_content_confidential=policy.assume_uploaded_content_confidential,
            cloud_blocked_sensitivity_levels=sorted(policy.cloud_blocked_sensitivity_levels),
            local_required_sensitivity_levels=sorted(policy.local_required_sensitivity_levels),
        )

    def classify(self, request: PrivacyClassificationRequest) -> PrivacyClassificationResult:
        """Return a deterministic privacy classification result."""
        policy = self.control_plane.get_privacy_policy()
        provider_policy = self.control_plane.get_provider_policy()
        if not policy.enabled:
            return PrivacyClassificationResult(
                task_type=request.task_type,
                contains_uploaded_content=request.contains_uploaded_content,
                privacy_mode=policy.default_privacy_mode,
                sensitivity_level="internal",
                cloud_allowed=False,
                local_required=False,
                classification_reason="Privacy classification is disabled; conservative defaults applied",
                policy_tags=["classification_disabled"],
            )

        metadata = dict(request.metadata)
        context = dict(request.context)
        text = (request.text or "").lower()
        task_type = request.task_type
        tags: list[str] = []

        explicit_mode = self._resolve_explicit_mode(metadata, context, request.workspace_privacy_mode)
        contains_uploaded_content = bool(
            request.contains_uploaded_content
            or metadata.get("contains_uploaded_content")
            or context.get("contains_uploaded_content")
            or metadata.get("uploaded_document")
            or context.get("uploaded_document")
        )

        if explicit_mode == "local_only":
            return PrivacyClassificationResult(
                task_type=task_type,
                contains_uploaded_content=contains_uploaded_content,
                privacy_mode="local_only",
                sensitivity_level="confidential",
                cloud_allowed=False,
                local_required=True,
                classification_reason="Explicit local-only privacy mode requires local execution",
                policy_tags=["explicit_local_only"],
            )

        sensitivity_level = "public"
        if self._contains_any(text, RESTRICTED_KEYWORDS):
            sensitivity_level = "restricted"
            tags.append("restricted_keyword")
        elif self._contains_any(text, CONFIDENTIAL_KEYWORDS):
            sensitivity_level = "confidential"
            tags.append("confidential_keyword")
        elif contains_uploaded_content and policy.assume_uploaded_content_confidential:
            sensitivity_level = "confidential"
            tags.append("uploaded_content")
        elif metadata.get("privacy_sensitive") or context.get("privacy_sensitive"):
            sensitivity_level = "confidential"
            tags.append("privacy_sensitive")
        elif self._contains_any(text, INTERNAL_KEYWORDS) or task_type in {"analyze_scenario", "extract_objects"}:
            sensitivity_level = "internal"
            tags.append("internal_context")

        if metadata.get("regulated_data") or metadata.get("restricted_data"):
            sensitivity_level = "restricted"
            tags.append("regulated_metadata")

        privacy_mode = explicit_mode or policy.default_privacy_mode
        local_required = sensitivity_level in set(policy.local_required_sensitivity_levels)
        if local_required and privacy_mode != "local_only":
            privacy_mode = "local_preferred"

        cloud_allowed = (
            privacy_mode != "local_only"
            and provider_policy.cloud_provider_enabled
            and sensitivity_level not in set(policy.cloud_blocked_sensitivity_levels)
            and not local_required
            and not bool(metadata.get("cloud_not_allowed"))
        )

        if metadata.get("cloud_allowed") is True and not local_required and privacy_mode != "local_only":
            cloud_allowed = True
            if privacy_mode == "default":
                privacy_mode = "cloud_allowed"
            tags.append("explicit_cloud_allowed")

        if policy.strict_mode and sensitivity_level in {"confidential", "restricted"}:
            cloud_allowed = False

        if metadata.get("privacy_sensitive") and privacy_mode == "default":
            privacy_mode = "local_preferred"

        return PrivacyClassificationResult(
            task_type=task_type,
            contains_uploaded_content=contains_uploaded_content,
            privacy_mode=privacy_mode,
            sensitivity_level=sensitivity_level,
            cloud_allowed=cloud_allowed,
            local_required=local_required or privacy_mode == "local_only",
            classification_reason=self._reason(
                sensitivity_level=sensitivity_level,
                privacy_mode=privacy_mode,
                contains_uploaded_content=contains_uploaded_content,
                tags=tags,
            ),
            policy_tags=tags,
        )

    @staticmethod
    def _contains_any(text: str, keywords: set[str]) -> bool:
        return any(keyword in text for keyword in keywords)

    @staticmethod
    def _resolve_explicit_mode(
        metadata: dict,
        context: dict,
        workspace_privacy_mode: str | None,
    ) -> str | None:
        if isinstance(workspace_privacy_mode, str) and workspace_privacy_mode.strip():
            return workspace_privacy_mode.strip().lower()
        for key in ("privacy_mode",):
            raw_value = metadata.get(key) or context.get(key)
            if isinstance(raw_value, str) and raw_value.strip():
                return raw_value.strip().lower()
        if metadata.get("local_only") or context.get("local_only"):
            return "local_only"
        return None

    @staticmethod
    def _reason(
        *,
        sensitivity_level: str,
        privacy_mode: str,
        contains_uploaded_content: bool,
        tags: list[str],
    ) -> str:
        if privacy_mode == "local_only":
            return "Explicit local-only privacy mode blocks cloud routing"
        if sensitivity_level == "restricted":
            return "Restricted data classification blocks cloud routing"
        if contains_uploaded_content and sensitivity_level == "confidential":
            return "Uploaded content was classified conservatively as confidential"
        if sensitivity_level == "confidential":
            return "Confidential content requires conservative local-preferred handling"
        if sensitivity_level == "internal":
            return "Internal content defaults to local-first routing"
        if "explicit_cloud_allowed" in tags:
            return "Low-risk request is cloud-allowed by explicit policy"
        return "Low-risk request classified as public"
