"""Shared utilities for Mix Python SDK cookbook examples.

This module provides a simple, clean streaming helper that handles all
formatting automatically - content line breaks, show_media display, and
tool output filtering.
"""

import json
import re
from mix_python_sdk.helpers import send_with_callbacks


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

    def handle_content(text: str):
        """Print content with proper line breaks between sentences"""
        # Add newline after period followed by capital letter (new sentence)
        text = re.sub(r'(\.)([A-Z])', r'\1\n\2', text)
        print(text, end="", flush=True)

    def handle_tool(tool):
        """Display show_media content (videos, images, plots)"""
        # Only process show_media tools - skip others to reduce noise
        if hasattr(tool, "name") and "show_media" in str(tool.name).lower():
            if hasattr(tool, "input") and tool.input:
                try:
                    input_data = json.loads(tool.input) if isinstance(tool.input, str) else tool.input
                    if "outputs" in input_data:
                        print("\n")  # Line gap before media
                        for output in input_data["outputs"]:
                            print(f"{output.get('title', 'Media')}")
                            if output.get('description'):
                                print(f"   {output['description']}")
                            if output.get('path'):
                                print(f"   {output['path']}")
                            print()  # Empty line between each item
                except:
                    print("⚠️ Failed to parse show_media tool input")
                    pass  # Silently skip malformed tool input

    def handle_tool_complete(data):
        """Display actual tool output (ReadMedia, bash results, etc.)"""
        # Only show actual output content, skip "Completed X tool" messages
        if hasattr(data, "progress") and data.progress and "Completed" not in data.progress:
            print(f"\n\n{data.progress}")

    # Use SDK's send_with_callbacks with our custom handlers
    await send_with_callbacks(
        mix,
        session_id=session_id,
        message=message,
        on_thinking=lambda text: print(text, end="", flush=True),
        on_content=handle_content,
        on_tool=handle_tool,
        on_tool_execution_complete=handle_tool_complete,
        on_error=lambda error: print(f"\n❌ {error}"),
    )
