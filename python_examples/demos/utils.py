"""Shared utilities for Mix Python SDK cookbook examples.

This module provides a simple, clean streaming helper that handles all
formatting automatically - content line breaks, show_media display, and
tool output filtering.
"""

import re
from mix_python_sdk.helpers import send_with_callbacks
from mix_python_sdk.tool_models import MediaShowcaseParams
from pydantic import ValidationError


async def stream_message(mix, session_id: str, message: str) -> None:
    """Send message via streaming with automatic nice formatting.

    This handles:
    - Content line breaks (sentences on separate lines)
    - show_media display (videos, images, plots with titles/descriptions)
    - Tool output display (ReadMedia, bash results)
    - Skips "Completed X tool" spam

    Args:
        mix: Mix SDK client instance
        session_id: Session ID to send the message to
        message: Message text to send
    """

    def handle_tool(tool):
        """Display show_media content using typed models"""
        if not (hasattr(tool, "name") and "show_media" in str(tool.name).lower()):
            return
        if not (hasattr(tool, "input") and tool.input):
            return

        try:
            params = MediaShowcaseParams.model_validate_json(tool.input)
            print("\n")
            for output in params.outputs:
                parts = [output.title]
                if output.description: parts.append(f"   {output.description}")
                if output.path: parts.append(f"   {output.path}")
                print("\n".join(parts) + "\n")
        except Exception as e:
            print(f"⚠️ Failed to parse show_media: {e}")

    # Use SDK's send_with_callbacks with our custom handlers
    await send_with_callbacks(
        mix,
        session_id=session_id,
        message=message,
        on_thinking=lambda text: print(text, end="", flush=True),
        on_content=lambda text: print(re.sub(r'(\.)([A-Z])', r'\1\n\2', text), end="", flush=True),
        on_tool=handle_tool,
        on_error=lambda error: print(f"\n❌ {error}"),
    )
