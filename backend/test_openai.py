"""Simple local smoke test for OpenAI configuration and connectivity."""
from __future__ import annotations

import argparse
import os
import sys
import traceback
from typing import Optional

try:
    from dotenv import load_dotenv  # type: ignore
except Exception:  # pragma: no cover
    load_dotenv = None

try:
    from openai import OpenAI
except ImportError:
    print("OpenAI SDK not installed. Install with `pip install openai`.", file=sys.stderr)
    sys.exit(2)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Smoke-test OpenAI connectivity without leaking secrets."
    )
    parser.add_argument("--model", type=str, help="Model name override (default: gpt-4o-mini)")
    parser.add_argument(
        "--input", type=str, default="Reply with the single word OK.", help="Prompt text"
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=None,
        help="Request timeout in seconds (ignored if unsupported).",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Print stack trace on failure for troubleshooting.",
    )
    return parser.parse_args()


def load_env() -> None:
    """Load .env if python-dotenv is available; otherwise rely on OS env."""
    if load_dotenv:
        env_path = os.path.join(os.path.dirname(__file__), ".env")
        load_dotenv(env_path)


def main() -> None:
    args = parse_args()
    load_env()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY is missing. Set it in your environment or backend/.env.", file=sys.stderr)
        sys.exit(1)

    model = args.model or os.getenv("OPENAI_MODEL") or "gpt-4o-mini"
    prompt = args.input

    client = OpenAI(api_key=api_key)

    request_kwargs = {
        "model": model,
        "input": prompt,
    }
    if args.timeout is not None:
        request_kwargs["timeout"] = args.timeout

    try:
        resp = client.responses.create(**request_kwargs)
        # For the new Responses API, content is a list of parts.
        text = ""
        for item in resp.output_text:
            text += item
        print(text.strip())
    except Exception as exc:  # pragma: no cover
        print(f"OpenAI request failed: {exc}", file=sys.stderr)
        if args.debug:
            traceback.print_exc()
        sys.exit(2)


if __name__ == "__main__":
    main()
