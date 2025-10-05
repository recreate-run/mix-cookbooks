"""Shared utilities for Mix Python SDK examples.

This module provides a simple wrapper around the Mix SDK's streaming helpers
with custom formatting for thinking and content display.
"""

from mix_python_sdk.helpers import stream_and_send


async def stream_message(mix, session_id: str, message: str) -> None:
    """Send message via streaming and process events with nice formatting.

    This uses the SDK's stream_and_send helper with custom callbacks
    for consistent formatting across cookbook examples.
    """
    thinking_started = content_started = False

    def handle_thinking(text: str):
        nonlocal thinking_started
        if not thinking_started:
            print("🤔 Thinking: ", end="", flush=True)
            thinking_started = True
        print(text, end="", flush=True)

    def handle_content(text: str):
        nonlocal content_started, thinking_started
        if not content_started:
            if thinking_started:
                print("\n📝 Response: ", end="", flush=True)
            else:
                print("📝 Response: ", end="", flush=True)
            content_started = True
        print(text, end="", flush=True)

    def handle_tool(tool):
        print(f"\n🔧 Tool: {tool.name} - {tool.status}")
        if hasattr(tool, "input") and tool.input:
            print(f"   Parameters: {tool.input}")

    await stream_and_send(
        mix,
        session_id=session_id,
        message=message,
        on_thinking=handle_thinking,
        on_content=handle_content,
        on_tool=handle_tool,
        on_error=lambda error: print(f"\n❌ Error: {error}"),
    )
